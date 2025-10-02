/**
 * Check which tables exist in Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function checkTables() {
  const supabase = createClient(supabaseUrl, serviceKey)

  const tables = [
    'player_profiles',
    'choice_history',
    'visited_scenes',
    'player_patterns',
    'relationship_progress',
    'skill_milestones',
    'player_urgency_scores'
  ]

  console.log('\n🔍 CHECKING TABLES:\n')

  for (const table of tables) {
    const { error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log(`❌ ${table}: ERROR - ${error.message}`)
    } else {
      console.log(`✅ ${table}: EXISTS (${count} rows)`)
    }
  }

  console.log('\n')
}

checkTables().catch(console.error)
