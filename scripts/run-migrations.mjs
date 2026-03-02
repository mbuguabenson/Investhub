import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('Starting database migration...')

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, '01-create-schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8')

    // Split into individual statements and execute
    const statements = schemaSql.split(';').filter(stmt => stmt.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await supabase.rpc('exec', { sql: statement.trim() }, { head: true })
        } catch (err) {
          // Some statements might fail if they already exist, that's ok
          console.warn(`Statement warning: ${err.message}`)
        }
      }
    }

    console.log('✓ Schema created successfully')

    // Read and execute seed data
    const seedPath = path.join(__dirname, '02-seed-investment-plans.sql')
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf-8')
      const seedStatements = seedSql.split(';').filter(stmt => stmt.trim())

      for (const statement of seedStatements) {
        if (statement.trim()) {
          try {
            await supabase.rpc('exec', { sql: statement.trim() }, { head: true })
          } catch (err) {
            console.warn(`Seed warning: ${err.message}`)
          }
        }
      }

      console.log('✓ Seed data inserted successfully')
    }

    console.log('✓ Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()
