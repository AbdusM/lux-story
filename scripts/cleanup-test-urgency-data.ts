/**
 * Cleanup Test Data for Urgency Triage UI Testing
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Removes all test players created by seed-test-urgency-data.ts
 *
 * Run: npx tsx scripts/cleanup-test-urgency-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function cleanupTestData() {
  console.log('\n' + '='.repeat(60))
  console.log('🧹 CLEANING UP TEST URGENCY DATA')
  console.log('='.repeat(60))

  const supabase = createClient(supabaseUrl, serviceKey)

  const testUserIds = [
    'test_critical_9day_stuck',
    'test_high_4day_confused',
    'test_low_active_healthy'
  ]

  for (const userId of testUserIds) {
    console.log(`\n🗑️  Deleting ${userId}...`)

    // Delete in correct order (respect foreign keys)
    await supabase.from('player_urgency_scores').delete().eq('user_id', userId)
    await supabase.from('skill_milestones').delete().eq('player_id', userId)
    await supabase.from('player_patterns').delete().eq('player_id', userId)
    await supabase.from('relationship_progress').delete().eq('player_id', userId)
    await supabase.from('choice_history').delete().eq('player_id', userId)
    await supabase.from('visited_scenes').delete().eq('player_id', userId)
    await supabase.from('player_profiles').delete().eq('user_id', userId)

    console.log(`   ✅ Deleted ${userId}`)
  }

  // Refresh materialized view
  console.log('\n🔄 Refreshing materialized view...')
  const { error } = await supabase.rpc('refresh_urgent_students_view')
  if (error) {
    console.error('❌ Failed to refresh view:', error)
  } else {
    console.log('✅ urgent_students view refreshed')
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ CLEANUP COMPLETE')
  console.log('='.repeat(60) + '\n')
}

cleanupTestData().catch(error => {
  console.error('\n❌ Cleanup failed:', error)
  process.exit(1)
})
