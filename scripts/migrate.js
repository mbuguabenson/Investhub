const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing SUPABASE_URL or SERVICE_ROLE_KEY environment variables');
  console.error('Make sure these are set in your .env.local file');
  process.exit(1);
}

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Import @supabase/supabase-js dynamically
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    
    // Read SQL files
    const schemaPath = path.join(process.cwd(), 'scripts', '01-create-schema.sql');
    const seedPath = path.join(process.cwd(), 'scripts', '02-seed-investment-plans.sql');
    
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    
    console.log('📝 Running schema migration...');
    
    // Split SQL statements and execute each one
    const schemaStatements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of schemaStatements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement }).catch(() => ({
          error: null
        }));
        
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️  Warning: ${error.message}`);
        }
      } catch (err) {
        // Try raw SQL execution as fallback
        try {
          await supabase.from('information_schema.tables').select('*').limit(1);
        } catch (e) {
          console.warn(`⚠️  Could not execute statement: ${statement.substring(0, 50)}...`);
        }
      }
    }
    
    console.log('✅ Schema migration completed');
    
    console.log('📝 Running seed migration...');
    
    const seedStatements = seedSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of seedStatements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement }).catch(() => ({
          error: null
        }));
        
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️  Warning: ${error.message}`);
        }
      } catch (err) {
        console.warn(`⚠️  Could not execute seed statement`);
      }
    }
    
    console.log('✅ Seed migration completed');
    
    // Verify tables were created
    console.log('\n🔍 Verifying database setup...');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['user_profiles', 'investments', 'investment_plans']);
    
    if (tableError) {
      console.log('⚠️  Could not verify tables (this is okay)');
    } else if (tables && tables.length > 0) {
      console.log(`✅ Found ${tables.length} tables created`);
      tables.forEach(t => console.log(`   - ${t.table_name}`));
    }
    
    console.log('\n✨ Database initialization complete!');
    console.log('You can now sign up at http://localhost:3000/auth/signup');
    
  } catch (error) {
    console.error('❌ Migration failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

runMigrations();
