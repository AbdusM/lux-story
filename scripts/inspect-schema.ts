/**
 * Inspect Supabase table schemas
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function inspectSchemas() {
  const supabase = createClient(supabaseUrl, serviceKey)

  const tables = ['choice_history', 'visited_scenes', 'skill_milestones', 'relationship_progress']

  for (const table of tables) {
    console.log(`\n📋 ${table}:`)

    // Query information_schema to get column details
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `SELECT column_name, data_type, is_nullable
              FROM information_schema.columns
              WHERE table_name = '${table}'
              AND table_schema = 'public'
              ORDER BY ordinal_position`
      })
      .single()

    if (error) {
      // Try direct query approach if RPC doesn't work
      console.log('   Using direct table query...')
      const { data: sample, error: sampleError } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (sampleError) {
        console.log(`   ❌ Error: ${sampleError.message}`)
      } else {
        console.log('   Columns:', sample && sample.length > 0 ? Object.keys(sample[0]) : 'Unable to determine (0 rows)')
      }
    } else {
      console.log(data)
    }
  }
}

inspectSchemas().catch(console.error)
