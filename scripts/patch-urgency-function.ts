/**
 * Quick patch for calculate_urgency_score function
 * Fixes: relationship_progress uses user_id not player_id
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function patchFunction() {
  const supabase = createClient(supabaseUrl, serviceKey)

  console.log('\n🔧 Patching calculate_urgency_score function...\n')

  // Read migration 003 file and fix the relationship_progress query
  const fs = require('fs')
  const path = require('path')

  const migrationPath = path.join(process.cwd(), 'supabase/migrations/003_urgency_triage.sql')
  let sql = fs.readFileSync(migrationPath, 'utf8')

  // Replace the incorrect query
  sql = sql.replace(
    'FROM relationship_progress WHERE player_id = p_player_id',
    'FROM relationship_progress WHERE user_id = p_player_id'
  )

  // Extract just the function definition
  const functionStart = sql.indexOf('CREATE OR REPLACE FUNCTION calculate_urgency_score')
  const functionEnd = sql.indexOf('$$ LANGUAGE plpgsql;', functionStart) + '$$ LANGUAGE plpgsql;'.length

  const functionSQL = sql.substring(functionStart, functionEnd)

  console.log('Executing patched function...\n')

  const { error } = await supabase.rpc('exec_sql' as any, { sql: functionSQL })

  if (error) {
    // Try direct execution via raw query if RPC doesn't work
    console.log('RPC failed, trying direct migration apply...')

    // Write patched migration to temp file
    fs.writeFileSync(migrationPath + '.patched', functionSQL)
    console.log('✅ Patched function written to:', migrationPath + '.patched')
    console.log('\nRun: supabase db reset --local')
    console.log('Or manually execute the patched function in Supabase dashboard\n')
  } else {
    console.log('✅ Function patched successfully!\n')
  }
}

patchFunction().catch(console.error)
