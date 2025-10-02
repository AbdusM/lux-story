/**
 * Manual urgency calculation workaround
 * Calculates urgency scores without relying on broken database function
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function calculateManualUrgency() {
  const supabase = createClient(supabaseUrl, serviceKey)

  const testUsers = [
    'test_critical_9day_stuck',
    'test_high_4day_confused',
    'test_low_active_healthy'
  ]

  console.log('\n🔢 MANUAL URGENCY CALCULATION\n')

  for (const userId of testUsers) {
    console.log(`\n📊 Calculating for ${userId}...`)

    // Get player profile
    const { data: profile } = await supabase
      .from('player_profiles')
      .select('last_activity')
      .eq('user_id', userId)
      .single()

    if (!profile) {
      console.log('   ❌ Player not found')
      continue
    }

    // Calculate days inactive
    const daysInactive = (Date.now() - new Date(profile.last_activity).getTime()) / (1000 * 60 * 60 * 24)

    // Get choice count
    const { count: choiceCount } = await supabase
      .from('choice_history')
      .select('*', { count: 'exact', head: true })
      .eq('player_id', userId)

    // Get scene count
    const { count: sceneCount } = await supabase
      .from('visited_scenes')
      .select('*', { count: 'exact', head: true })
      .eq('player_id', userId)

    // Get relationship count (using user_id!)
    const { count: relationshipCount } = await supabase
      .from('relationship_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Calculate urgency score components
    const disengagement = Math.min(1.0, daysInactive / 7.0)
    const confusion = (choiceCount || 0) > 10 && (sceneCount || 0) < 5 ? 0.8 : 0.2
    const isolation = (relationshipCount || 0) === 0 ? 0.7 : 0.2
    const stress = 0.1 // default low

    const totalScore = disengagement * 0.4 + confusion * 0.3 + stress * 0.2 + isolation * 0.1

    const level = totalScore >= 0.75 ? 'critical' : totalScore >= 0.5 ? 'high' : totalScore >= 0.25 ? 'medium' : 'low'

    // Generate narrative
    const narrative = `Urgency level is ${level.toUpperCase()} (${Math.round(totalScore * 100)}%). ` +
      `${daysInactive >= 7 ? 'CRITICAL: ' : ''}Student has been inactive for ${Math.round(daysInactive)} days. ` +
      `${confusion > 0.5 ? `Strong confusion signals: ${choiceCount} choices made but only ${sceneCount} scenes explored (stuck pattern). ` : ''}` +
      `${isolation > 0.5 ? 'No relationships formed (isolation risk). ' : ''}` +
      `RECOMMENDED ACTION: ${level === 'critical' ? 'Immediate outreach required' : level === 'high' ? 'Contact within 48 hours' : 'Monitor for next session'}. ` +
      `Primary factors: ${disengagement > 0.5 ? 'disengagement, ' : ''}${confusion > 0.5 ? 'confusion, ' : ''}${isolation > 0.5 ? 'isolation' : 'low risk'}.`

    console.log(`   Level: ${level.toUpperCase()} (${Math.round(totalScore * 100)}%)`)
    console.log(`   Narrative: ${narrative.substring(0, 100)}...`)

    // Insert/update urgency score
    const { error } = await supabase
      .from('player_urgency_scores')
      .upsert({
        player_id: userId,
        urgency_level: level,
        urgency_score: totalScore,
        disengagement_score: disengagement,
        confusion_score: confusion,
        stress_score: stress,
        isolation_score: isolation,
        urgency_narrative: narrative,
        last_calculated: new Date().toISOString()
      })

    if (error) {
      console.log(`   ❌ Error: ${error.message}`)
    } else {
      console.log(`   ✅ Saved to database`)
    }
  }

  // Refresh materialized view
  console.log('\n🔄 Refreshing materialized view...')
  await supabase.rpc('refresh_urgent_students_view')
  console.log('✅ Done!\n')
}

calculateManualUrgency().catch(console.error)
