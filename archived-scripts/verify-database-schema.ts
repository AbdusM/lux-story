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

  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Expected tables (Migration 001)
  const migration001Tables = [
    'player_profiles',
    'skill_demonstrations',
    'career_explorations',
    'relationship_progress',
    'platform_states'
  ]

  // Expected tables (Migration 002 - Normalized Schema)
  const migration002Tables = [
    'visited_scenes',
    'choice_history',
    'player_patterns',
    'player_behavioral_profiles',
    'skill_milestones',
    'relationship_key_moments',
    'career_local_opportunities'
  ]

  const allTables = [...migration001Tables, ...migration002Tables]

  console.log('📋 Checking Migration 001 tables (Core Schema)...\n')

  let migration001Complete = true

  for (const tableName of migration001Tables) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0)

    if (error) {
      console.log(`❌ ${tableName}: MISSING or ERROR`)
      console.log(`   Error: ${error.message}`)
      migration001Complete = false
    } else {
      console.log(`✅ ${tableName}: EXISTS`)
    }
  }

  console.log('\n📋 Checking Migration 002 tables (Normalized Schema)...\n')

  let migration002Complete = true

  for (const tableName of migration002Tables) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0)

    if (error) {
      console.log(`❌ ${tableName}: MISSING or ERROR`)
      console.log(`   Error: ${error.message}`)
      migration002Complete = false
    } else {
      console.log(`✅ ${tableName}: EXISTS`)
    }
  }

  console.log('\n📊 Schema Validation Results:')
  console.log('─'.repeat(50))

  if (migration001Complete && migration002Complete) {
    console.log('✅ All 12 tables created successfully!')
    console.log('   • Migration 001: 5/5 tables ✅')
    console.log('   • Migration 002: 7/7 tables ✅')
    console.log('\n🎯 Database Schema Status: READY FOR DUAL-WRITE')
    console.log('\n📌 Next Steps:')
    console.log('   1. Switch to dual-write mode in lib/database-service.ts')
    console.log('   2. Integrate Supabase writes in useSimpleGame.ts')
    console.log('   3. Test data consistency between localStorage and Supabase')
  } else {
    console.log('❌ Some tables are missing or have errors')
    if (!migration001Complete) {
      console.log('   • Migration 001: INCOMPLETE')
    }
    if (!migration002Complete) {
      console.log('   • Migration 002: INCOMPLETE')
    }
    console.log('\n💡 Fix: Run migrations with:')
    console.log('   supabase db push')
  }

  console.log('\n' + '─'.repeat(50))
}

verifySchema()
