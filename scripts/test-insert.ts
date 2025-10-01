/**
 * Test insert to discover exact schema
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function testInserts() {
  const supabase = createClient(supabaseUrl, serviceKey)

  console.log('\n🧪 Testing choice_history insert...')
  const { error: ch1 } = await supabase.from('choice_history').insert({
    player_id: 'test_critical_9day_stuck',
    scene_id: 'maya-intro',
    choice_text: 'Test choice',
    choice_index: 0,
    chosen_at: new Date()
  })
  if (ch1) console.log(`   ❌ ${ch1.message}`)
  else console.log('   ✅ SUCCESS')

  console.log('\n🧪 Testing visited_scenes insert...')
  const { error: vs1 } = await supabase.from('visited_scenes').insert({
    player_id: 'test_critical_9day_stuck',
    scene_id: 'maya-intro',
    reached_at: new Date()
  })
  if (vs1) console.log(`   ❌ ${vs1.message}`)
  else console.log('   ✅ SUCCESS')

  console.log('\n🧪 Testing skill_milestones insert...')
  const { error: sm1 } = await supabase.from('skill_milestones').insert({
    player_id: 'test_low_active_healthy',
    milestone_name: 'First_Connection',
    achieved_at: new Date()
  })
  if (sm1) console.log(`   ❌ ${sm1.message}`)
  else console.log('   ✅ SUCCESS')

  console.log('\n🧪 Testing relationship_progress insert...')
  const { error: rp1 } = await supabase.from('relationship_progress').insert({
    player_id: 'test_low_active_healthy',
    character_name: 'Maya',
    trust_level: 3
  })
  if (rp1) console.log(`   ❌ ${rp1.message}`)
  else console.log('   ✅ SUCCESS')
}

testInserts().catch(console.error)
