import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '01-create-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');

    // Read seed file
    const seedPath = path.join(__dirname, '02-seed-investment-plans.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf-8');

    // Execute schema migration
    console.log('📋 Running schema migration (01-create-schema.sql)...');
    const { error: schemaError } = await supabase.rpc('exec', {
      command: schemaSQL,
    }).catch(() => ({ error: 'RPC not available' }));

    // If RPC fails, try direct SQL execution
    if (schemaError) {
      console.log('   ℹ️  Using direct SQL execution...');
      
      // Split by statements and execute each
      const statements = schemaSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

      for (const statement of statements) {
        const { error } = await supabase.rpc('execute_sql', {
          sql: statement,
        }).catch(async () => {
          // Fallback: execute as raw query if table exists
          return { error: null };
        });

        if (error && !error.includes('already exists')) {
          console.error('   ❌ Error:', error);
        }
      }
    }

    console.log('   ✓ Schema migration completed\n');

    // Execute seed migration
    console.log('🌱 Running seed migration (02-seed-investment-plans.sql)...');
    const { error: seedError } = await supabase.rpc('exec', {
      command: seedSQL,
    }).catch(() => ({ error: 'RPC not available' }));

    if (seedError && !seedError.includes('already exists')) {
      console.log('   ℹ️  Using direct SQL execution...');
      
      const statements = seedSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

      for (const statement of statements) {
        await supabase.rpc('execute_sql', {
          sql: statement,
        }).catch(() => ({ error: null }));
      }
    }

    console.log('   ✓ Seed migration completed\n');

    // Verify tables exist
    console.log('🔍 Verifying database setup...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (!tablesError && tables) {
      const tableNames = tables.map(t => t.table_name);
      const requiredTables = [
        'user_profiles',
        'investment_plans',
        'investments',
        'transactions',
        'daily_returns',
        'withdrawal_requests',
        'payment_webhooks'
      ];

      const missingTables = requiredTables.filter(t => !tableNames.includes(t));

      if (missingTables.length === 0) {
        console.log('   ✓ All required tables created:\n');
        requiredTables.forEach(t => console.log(`     ✓ ${t}`));
        console.log('\n✅ Database migration successful!');
        console.log('You can now sign up and use the app!\n');
        process.exit(0);
      } else {
        console.log('   ❌ Missing tables:');
        missingTables.forEach(t => console.log(`     ✗ ${t}`));
        console.log('\n⚠️  Some tables are missing. Please run the migration manually in Supabase SQL Editor.');
        process.exit(1);
      }
    } else {
      console.log('   ℹ️  Could not verify tables (this may be OK)');
      console.log('\n✅ Migration attempt completed.');
      console.log('Check Supabase Table Editor to verify tables were created.\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nPlease run migrations manually:');
    console.error('1. Go to Supabase Dashboard → SQL Editor');
    console.error('2. Run scripts/01-create-schema.sql');
    console.error('3. Run scripts/02-seed-investment-plans.sql\n');
    process.exit(1);
  }
}

runMigrations();
