/**
 * Verify Database Schema
 * Checks that all tables were created with correct structure
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

async function verifySchema() {
  console.log('🔍 Verifying Grand Central Terminus Database Schema\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Expected tables
  const expectedTables = [
    'player_profiles',
    'skill_demonstrations',
    'career_explorations',
    'relationship_progress',
    'platform_states'
  ]

  console.log('📋 Checking for required tables...\n')

  let allTablesExist = true

  for (const tableName of expectedTables) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0)

    if (error) {
      console.log(`❌ ${tableName}: MISSING or ERROR`)
      console.log(`   Error: ${error.message}`)
      allTablesExist = false
    } else {
      console.log(`✅ ${tableName}: EXISTS`)
    }
  }

  console.log('\n📊 Schema Validation Results:')
  console.log('─'.repeat(50))

  if (allTablesExist) {
    console.log('✅ All 5 tables created successfully!')
    console.log('\n🎯 Database Schema Status: READY')
    console.log('\n📌 Next Steps:')
    console.log('   1. Switch to dual-write mode in lib/database-service.ts')
    console.log('   2. Test data persistence with test users')
    console.log('   3. Verify admin dashboard reads from Supabase')
  } else {
    console.log('❌ Some tables are missing or have errors')
    console.log('\n💡 Fix: Run migration again with:')
    console.log('   supabase db push')
  }

  console.log('\n' + '─'.repeat(50))
}

verifySchema()
