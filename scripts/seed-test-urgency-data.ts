/**
 * Test Data Seeder for Urgency Triage UI Testing
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Creates three test players with different urgency patterns:
 * 1. CRITICAL: 9 days inactive, stuck pattern (high confusion)
 * 2. HIGH: 4 days inactive, some confusion
 * 3. LOW: Active today, healthy exploration
 *
 * Run: npx tsx scripts/seed-test-urgency-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function seedTestData() {
  console.log('\n' + '='.repeat(60))
  console.log('🌱 SEEDING TEST URGENCY DATA')
  console.log('='.repeat(60))

  const supabase = createClient(supabaseUrl, serviceKey)

  // =======================
  // TEST PLAYER 1: CRITICAL
  // =======================
  console.log('\n📍 Creating CRITICAL urgency player...')

  const criticalUserId = 'test_critical_9day_stuck'
  const nineAgoAgo = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)

  // Player profile
  const { error: profileError } = await supabase.from('player_profiles').insert({
    user_id: criticalUserId,
    current_scene: 'maya-intro',
    last_activity: nineAgoAgo
  })
  if (profileError) {
    console.error('   ❌ Profile insert error:', profileError.message)
    throw profileError
  }

  // Stuck pattern: 15 choices but only 3 scenes (high confusion)
  for (let i = 0; i < 15; i++) {
    await supabase.from('choice_history').insert({
      player_id: criticalUserId,
      scene_id: i < 5 ? 'maya-intro' : i < 10 ? 'devon-workshop' : 'samuel-station',
      choice_text: `Test choice ${i + 1}`,
      choice_id: `choice_${i % 3}`,
      chosen_at: nineAgoAgo
    })
  }

  // Only 3 unique scenes visited
  await supabase.from('visited_scenes').insert([
    { player_id: criticalUserId, scene_id: 'maya-intro', visited_at: nineAgoAgo },
    { player_id: criticalUserId, scene_id: 'devon-workshop', visited_at: nineAgoAgo },
    { player_id: criticalUserId, scene_id: 'samuel-station', visited_at: nineAgoAgo }
  ])

  // No relationships formed (isolation)
  // No patterns added (neutral stress/rushing)

  console.log('   ✅ Created CRITICAL player: ' + criticalUserId)
  console.log('      - 9 days inactive')
  console.log('      - 15 choices, 3 scenes (stuck)')
  console.log('      - 0 relationships (isolation)')
  console.log('      - Expected: ~75%+ urgency, "Immediate outreach required"')

  // ====================
  // TEST PLAYER 2: HIGH
  // ====================
  console.log('\n📍 Creating HIGH urgency player...')

  const highUserId = 'test_high_4day_confused'
  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)

  // Player profile
  await supabase.from('player_profiles').insert({
    user_id: highUserId,
    current_scene: 'devon-workshop',
    last_activity: fourDaysAgo
  })

  // Some confusion: 8 choices, 3 scenes
  for (let i = 0; i < 8; i++) {
    await supabase.from('choice_history').insert({
      player_id: highUserId,
      scene_id: i < 3 ? 'maya-intro' : i < 6 ? 'devon-workshop' : 'jordan-platforms',
      choice_text: `Test choice ${i + 1}`,
      choice_id: `choice_${i % 3}`,
      chosen_at: fourDaysAgo
    })
  }

  // 3 scenes visited
  await supabase.from('visited_scenes').insert([
    { player_id: highUserId, scene_id: 'maya-intro', visited_at: fourDaysAgo },
    { player_id: highUserId, scene_id: 'devon-workshop', visited_at: fourDaysAgo },
    { player_id: highUserId, scene_id: 'jordan-platforms', visited_at: fourDaysAgo }
  ])

  // 1 relationship (some social engagement)
  await supabase.from('relationship_progress').insert({
    user_id: highUserId,
    character_name: 'Devon',
    trust_level: 2
  })

  console.log('   ✅ Created HIGH player: ' + highUserId)
  console.log('      - 4 days inactive')
  console.log('      - 8 choices, 3 scenes (moderate confusion)')
  console.log('      - 1 relationship')
  console.log('      - Expected: ~50-74% urgency, "Contact within 48 hours"')

  // ==================
  // TEST PLAYER 3: LOW
  // ==================
  console.log('\n📍 Creating LOW urgency player...')

  const lowUserId = 'test_low_active_healthy'
  const today = new Date()

  // Player profile
  await supabase.from('player_profiles').insert({
    user_id: lowUserId,
    current_scene: 'jordan-platforms',
    last_activity: today
  })

  // Healthy exploration: 10 choices across 5 scenes
  for (let i = 0; i < 10; i++) {
    await supabase.from('choice_history').insert({
      player_id: lowUserId,
      scene_id: ['maya-intro', 'devon-workshop', 'samuel-station', 'jordan-platforms', 'quiet-hours'][i % 5],
      choice_text: `Test choice ${i + 1}`,
      choice_id: `choice_${i % 3}`,
      chosen_at: today
    })
  }

  // 5 unique scenes visited
  await supabase.from('visited_scenes').insert([
    { player_id: lowUserId, scene_id: 'maya-intro', visited_at: today },
    { player_id: lowUserId, scene_id: 'devon-workshop', visited_at: today },
    { player_id: lowUserId, scene_id: 'samuel-station', visited_at: today },
    { player_id: lowUserId, scene_id: 'jordan-platforms', visited_at: today },
    { player_id: lowUserId, scene_id: 'quiet-hours', visited_at: today }
  ])

  // 2 relationships (good social engagement)
  await supabase.from('relationship_progress').insert([
    { user_id: lowUserId, character_name: 'Maya', trust_level: 3 },
    { user_id: lowUserId, character_name: 'Devon', trust_level: 2 }
  ])

  // Positive helping pattern
  await supabase.from('player_patterns').insert({
    player_id: lowUserId,
    pattern_name: 'helping',
    pattern_value: 0.7
  })

  // 1 milestone
  await supabase.from('skill_milestones').insert({
    player_id: lowUserId,
    milestone_type: 'character_trust_gained',
    milestone_context: 'First connection with Maya',
    reached_at: today
  })

  console.log('   ✅ Created LOW player: ' + lowUserId)
  console.log('      - Active today')
  console.log('      - 10 choices, 5 scenes (healthy exploration)')
  console.log('      - 2 relationships, helping pattern, 1 milestone')
  console.log('      - Expected: <25% urgency, "Monitor for next session"')

  // ===========================
  // CALCULATE URGENCY SCORES
  // ===========================
  console.log('\n' + '='.repeat(60))
  console.log('🔄 CALCULATING URGENCY SCORES')
  console.log('='.repeat(60))

  for (const userId of [criticalUserId, highUserId, lowUserId]) {
    console.log(`\n📊 Calculating for ${userId}...`)
    const { error } = await supabase.rpc('calculate_urgency_score', {
      p_player_id: userId
    })

    if (error) {
      console.error(`   ❌ Error:`, error)
    } else {
      // Fetch and display result
      const { data: score } = await supabase
        .from('player_urgency_scores')
        .select('urgency_level, urgency_score, urgency_narrative')
        .eq('user_id', userId)
        .single()

      if (score) {
        console.log(`   ✅ ${score.urgency_level.toUpperCase()} (${Math.round(score.urgency_score * 100)}%)`)
        console.log(`   📝 ${score.urgency_narrative}`)
      }
    }
  }

  // =============================
  // REFRESH MATERIALIZED VIEW
  // =============================
  console.log('\n' + '='.repeat(60))
  console.log('🔄 REFRESHING MATERIALIZED VIEW')
  console.log('='.repeat(60))

  const { error: refreshError } = await supabase.rpc('refresh_urgent_students_view')
  if (refreshError) {
    console.error('❌ Failed to refresh view:', refreshError)
  } else {
    console.log('✅ urgent_students view refreshed')
  }

  // ===============
  // SUMMARY
  // ===============
  console.log('\n' + '='.repeat(60))
  console.log('✅ TEST DATA SEEDING COMPLETE')
  console.log('='.repeat(60))
  console.log('\nYou can now:')
  console.log('1. Visit http://localhost:3003/admin')
  console.log('2. Click "Urgency Triage" tab')
  console.log('3. Verify 3 test students with Glass Box narratives')
  console.log('\nCleanup: npx tsx scripts/cleanup-test-urgency-data.ts')
  console.log('='.repeat(60) + '\n')
}

// Run seeder
seedTestData().catch(error => {
  console.error('\n❌ Seeding failed:', error)
  process.exit(1)
})
