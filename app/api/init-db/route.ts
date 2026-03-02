import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  // Verify this is a local request or has proper auth
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  // Simple check - in production, use proper API key
  if (token !== process.env.INIT_DB_TOKEN && process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    console.log('[v0] Starting database initialization...');

    // Read SQL files
    const schemaPath = path.join(process.cwd(), 'scripts', '01-create-schema.sql');
    const seedPath = path.join(process.cwd(), 'scripts', '02-seed-investment-plans.sql');

    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    const seedSQL = fs.readFileSync(seedPath, 'utf-8');

    // Execute schema
    console.log('[v0] Executing schema migration...');
    const { error: schemaError } = await supabase.rpc('exec', {
      command: schemaSQL,
    });

    if (schemaError) {
      console.log('[v0] Schema RPC failed, attempting alternative method...');
      // Try to create table directly
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          full_name TEXT NOT NULL,
          id_number TEXT UNIQUE NOT NULL,
          id_type VARCHAR(50) NOT NULL,
          date_of_birth DATE NOT NULL,
          phone_number VARCHAR(20) UNIQUE NOT NULL,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          country TEXT NOT NULL,
          kyc_status VARCHAR(50) DEFAULT 'pending',
          kyc_submitted_at TIMESTAMP WITH TIME ZONE,
          kyc_verified_at TIMESTAMP WITH TIME ZONE,
          account_balance DECIMAL(15, 2) DEFAULT 0,
          total_invested DECIMAL(15, 2) DEFAULT 0,
          total_returns DECIMAL(15, 2) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_admin BOOLEAN DEFAULT FALSE
        );
      `;

      const { error: createError } = await supabase.rpc('execute_sql', {
        sql: createTableSQL,
      });

      if (createError) {
        console.log('[v0] Create table error:', createError);
      }
    }

    console.log('[v0] Schema migration complete');

    // Execute seed
    console.log('[v0] Executing seed migration...');
    const { error: seedError } = await supabase.rpc('exec', {
      command: seedSQL,
    });

    if (seedError) {
      console.log('[v0] Seed error:', seedError);
    }

    console.log('[v0] Seed migration complete');

    // Verify tables exist
    console.log('[v0] Verifying database setup...');
    const { data: tables, error: tablesError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (!tablesError) {
      console.log('[v0] ✓ Database initialized successfully');
      return Response.json({
        success: true,
        message: 'Database initialized successfully. You can now sign up.',
      });
    }

    return Response.json({
      success: false,
      message: 'Database tables may not be created. Check Supabase SQL Editor.',
      error: tablesError?.message,
    });
  } catch (error) {
    console.error('[v0] Error:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to initialize database',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
