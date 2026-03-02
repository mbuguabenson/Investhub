#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
  console.error('This is required to execute SQL migrations');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sqlPath) {
  try {
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    
    console.log(`\n📜 Executing: ${path.basename(sqlPath)}`);
    
    // Use RPC to execute raw SQL
    const { data, error } = await supabase.rpc('execute_sql', { 
      sql_query: sqlContent 
    });

    if (error) {
      console.error('❌ SQL Execution Error:', error);
      return false;
    }

    console.log('✅ SQL executed successfully');
    return true;
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Database Migration Tool');
  console.log('=' .repeat(50));

  const schemaFile = path.join(__dirname, '01-create-schema.sql');
  const seedFile = path.join(__dirname, '02-seed-investment-plans.sql');

  try {
    if (fs.existsSync(schemaFile)) {
      await executeSQL(schemaFile);
    }
    
    if (fs.existsSync(seedFile)) {
      await executeSQL(seedFile);
    }

    console.log('\n✨ Migration completed!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

main();
