/**
 * Debug Test Data
 * Check if test players and urgency scores exist
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function debugTestData() {
  const supabase = createClient(supabaseUrl, serviceKey)

  console.log('\n🔍 DEBUGGING TEST DATA\n')

  const testUserIds = [
    'test_critical_9day_stuck',
    'test_high_4day_confused',
    'test_low_active_healthy'
  ]

  for (const userId of testUserIds) {
    console.log(`\n📍 ${userId}:`)

    // Check player profile
    const { data: profile } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    console.log(`  Profile: ${profile ? '✅ EXISTS' : '❌ MISSING'}`)
    if (profile) {
      console.log(`    Last active: ${profile.last_active_at}`)
    }

    // Check urgency score
    const { data: urgency } = await supabase
      .from('player_urgency_scores')
      .select('*')
      .eq('player_id', userId)
      .single()

    console.log(`  Urgency Score: ${urgency ? '✅ EXISTS' : '❌ MISSING'}`)
    if (urgency) {
      console.log(`    Level: ${urgency.urgency_level}`)
      console.log(`    Score: ${Math.round(urgency.urgency_score * 100)}%`)
      console.log(`    Narrative: ${urgency.urgency_narrative?.substring(0, 100)}...`)
    }
  }

  // Check materialized view
  console.log('\n📊 MATERIALIZED VIEW (urgent_students):')
  const { data: view, error } = await supabase
    .from('urgent_students')
    .select('user_id, urgency_level, urgency_score')

  if (error) {
    console.log('  ❌ ERROR:', error.message)
  } else {
    console.log(`  Found ${view?.length || 0} students in view`)
    if (view && view.length > 0) {
      view.forEach((s: any) => {
        console.log(`    - ${s.user_id}: ${s.urgency_level} (${Math.round(s.urgency_score * 100)}%)`)
      })
    }
  }

  console.log('\n')
}

debugTestData().catch(console.error)
