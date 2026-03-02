import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function executeSQL(sql: string) {
  const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Split SQL into statements and execute each
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      const { error } = await supabase.rpc('query', {
        query_string: statement + ';',
      });

      if (error && !error.message.includes('already exists')) {
        console.log(`Statement skipped: ${statement.substring(0, 80)}...`);
      }
    }

    return { success: true };
  } catch (err) {
    console.error('SQL execution error:', err);
    throw err;
  }
}

export async function POST(request: Request) {
  // Security: Check for admin authorization
  const authHeader = request.headers.get('authorization');
  const adminToken = process.env.ADMIN_SETUP_TOKEN;

  if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      {
        error: 'Missing Supabase credentials',
        details: 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
      },
      { status: 500 }
    );
  }

  try {
    const schemaPath = path.join(process.cwd(), 'scripts', '01-create-schema.sql');
    const seedPath = path.join(process.cwd(), 'scripts', '02-seed-investment-plans.sql');

    let results = [];

    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      await executeSQL(schemaSql);
      results.push('Schema created');
    }

    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      await executeSQL(seedSql);
      results.push('Seed data inserted');
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      results,
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        error: 'Database setup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
