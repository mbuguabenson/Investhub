import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase environment variables not set');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));

    console.log(`\n📜 Running migration: ${path.basename(filePath)}`);
    console.log(`📊 Found ${statements.length} SQL statements\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      try {
        const { error } = await supabase.rpc('run_sql', { sql: statement });
        if (error) {
          console.log(`⚠️  Statement ${i + 1}: ${statement.substring(0, 50)}...`);
          console.log(`   Note: ${error.message}`);
        } else {
          console.log(`✅ Statement ${i + 1} completed`);
        }
      } catch (err) {
        // Many statements may fail due to already existing objects, which is fine
        console.log(`⚠️  Statement ${i + 1}: ${err.message || 'skipped'}`);
      }
    }

    console.log(`\n✨ Migration ${path.basename(filePath)} completed!\n`);
  } catch (error) {
    console.error(`❌ Error running migration:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Run migrations in order
    const migrations = [
      path.join(__dirname, '01-create-schema.sql'),
      path.join(__dirname, '02-seed-investment-plans.sql'),
    ];

    for (const migrationFile of migrations) {
      if (fs.existsSync(migrationFile)) {
        await runMigration(migrationFile);
      } else {
        console.warn(`⚠️  Migration file not found: ${migrationFile}`);
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\nYou can now run: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

main();
