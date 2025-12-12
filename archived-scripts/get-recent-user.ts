import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function getMostRecentUser() {
  // Get most recent user
  const { data: profile, error } = await supabase
    .from('player_profiles')
    .select('user_id, total_demonstrations, last_activity, current_scene')
    .order('last_activity', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.log('Error fetching profile:', error.message)
    return
  }

  console.log('📊 Most Recent User Profile:')
  console.log(JSON.stringify(profile, null, 2))

  // Get their skill demonstrations
  const { data: skills } = await supabase
    .from('skill_demonstrations')
    .select('skill_name, demonstrated_at, scene_id, choice_text, context')
    .eq('user_id', profile.user_id)
    .order('demonstrated_at', { ascending: false })
    .limit(30)

  if (skills && skills.length > 0) {
    console.log('\n🎯 Skill Demonstrations (Total: ' + skills.length + '):')

    // Count skills
    const skillCounts = new Map<string, number>()
    skills.forEach(s => {
      skillCounts.set(s.skill_name, (skillCounts.get(s.skill_name) || 0) + 1)
    })

    console.log('\nSkill Breakdown:')
    Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([skill, count]) => {
        console.log(`  ${skill}: ${count}x`)
      })

    console.log('\n📝 Recent Demonstrations (Latest 5):')
    skills.slice(0, 5).forEach((s, i) => {
      console.log(`\n${i + 1}. ${s.skill_name}`)
      console.log(`   Scene: ${s.scene_id}`)
      console.log(`   Choice: "${s.choice_text?.substring(0, 60)}..."`)
      console.log(`   Time: ${new Date(s.demonstrated_at).toLocaleString()}`)
    })
  }

  // Get career explorations
  const { data: careers } = await supabase
    .from('career_explorations')
    .select('career_name, match_score, readiness_level')
    .eq('user_id', profile.user_id)
    .order('match_score', { ascending: false })
    .limit(5)

  if (careers && careers.length > 0) {
    console.log('\n💼 Top Career Matches:')
    careers.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.career_name}: ${Math.round(c.match_score * 100)}% match (${c.readiness_level})`)
    })
  }
}

getMostRecentUser().catch(console.error)
