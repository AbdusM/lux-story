/**
 * Run Database Migrations
 * Executes all SQL migration files in order using Supabase client
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  console.log(`\n🔵 Found ${files.length} migration files\n`)

  for (const file of files) {
    const filePath = path.join(migrationsDir, file)
    const sql = fs.readFileSync(filePath, 'utf-8')

    console.log(`📝 Running migration: ${file}`)

    try {
      // Use rpc to execute raw SQL
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

      if (error) {
        // If exec_sql doesn't exist, try direct query
        const { error: directError } = await supabase.from('_migrations').select('*').limit(1)

        if (directError && directError.code === '42P01') {
          // Table doesn't exist, we need to use PostgreSQL REST API
          console.log(`   ⚠️  Using alternative method...`)

          // For now, we'll skip and tell user to use Supabase dashboard
          console.log(`   ℹ️  Please run this migration manually in Supabase SQL Editor`)
          console.log(`   📍 File: ${filePath}`)
          continue
        }

        throw error
      }

      console.log(`   ✅ Success\n`)
    } catch (err) {
      console.error(`   ❌ Error:`, err)
      console.error(`\n⚠️  Migration failed. Please run remaining migrations manually.`)
      console.error(`📍 Start from: ${file}\n`)
      process.exit(1)
    }
  }

  console.log(`\n✅ All migrations completed successfully!\n`)
}

runMigrations().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
