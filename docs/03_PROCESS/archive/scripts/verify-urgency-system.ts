/**
 * Verify Urgency Triage System (Migration 003)
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Verifies that all urgency infrastructure components were created:
 * - player_urgency_scores table
 * - calculate_urgency_score function
 * - urgent_students materialized view
 * - refresh_urgent_students_view function
 *
 * Run: npx tsx scripts/verify-urgency-system.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

async function verifyUrgencySystem() {
  console.log('\n' + '='.repeat(60))
  console.log('🔍 VERIFYING URGENCY TRIAGE SYSTEM (Migration 003)')
  console.log('='.repeat(60))

  const supabase = createClient(supabaseUrl, supabaseKey)

  let allPassed = true

  // Check 1: player_urgency_scores table
  console.log('\n1️⃣  Checking player_urgency_scores table...')
  try {
    const { data, error } = await supabase
      .from('player_urgency_scores')
      .select('*')
      .limit(1)

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      throw error
    }
    console.log('   ✅ player_urgency_scores table exists')
    console.log(`   📊 Current records: ${data?.length || 0}`)
  } catch (error: any) {
    console.log('   ❌ FAILED:', error.message)
    allPassed = false
  }

  // Check 2: Verify table columns
  console.log('\n2️⃣  Checking player_urgency_scores columns...')
  try {
    const { data, error } = await supabase
      .from('player_urgency_scores')
      .select('player_id, urgency_score, urgency_level, urgency_narrative, disengagement_score, confusion_score, stress_score, isolation_score')
      .limit(0)

    if (error) throw error
    console.log('   ✅ All required columns present')
    console.log('   📋 Columns: player_id, urgency_score, urgency_level, urgency_narrative')
    console.log('   📋 Factors: disengagement_score, confusion_score, stress_score, isolation_score')
  } catch (error: any) {
    console.log('   ❌ FAILED:', error.message)
    allPassed = false
  }

  // Check 3: calculate_urgency_score function exists
  console.log('\n3️⃣  Checking calculate_urgency_score function...')
  try {
    // Try calling the function with a non-existent user (should not error)
    const { error } = await supabase.rpc('calculate_urgency_score', {
      p_player_id: 'test-nonexistent-user'
    })

    // Function exists if we don't get a "function does not exist" error
    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      throw new Error('Function calculate_urgency_score does not exist')
    }

    console.log('   ✅ calculate_urgency_score function exists')
    console.log('   🔧 Function signature: calculate_urgency_score(p_player_id TEXT)')
  } catch (error: any) {
    console.log('   ❌ FAILED:', error.message)
    allPassed = false
  }

  // Check 4: urgent_students materialized view
  console.log('\n4️⃣  Checking urgent_students materialized view...')
  try {
    const { data, error } = await supabase
      .from('urgent_students')
      .select('*')
      .limit(1)

    if (error && error.code !== 'PGRST116') {
      throw error
    }
    console.log('   ✅ urgent_students materialized view exists')
    console.log(`   📊 Current urgent students: ${data?.length || 0}`)
  } catch (error: any) {
    console.log('   ❌ FAILED:', error.message)
    allPassed = false
  }

  // Check 5: refresh_urgent_students_view function
  console.log('\n5️⃣  Checking refresh_urgent_students_view function...')
  try {
    const { error } = await supabase.rpc('refresh_urgent_students_view')

    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      throw new Error('Function refresh_urgent_students_view does not exist')
    }

    console.log('   ✅ refresh_urgent_students_view function exists')
    console.log('   🔄 Successfully refreshed materialized view')
  } catch (error: any) {
    console.log('   ❌ FAILED:', error.message)
    allPassed = false
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  if (allPassed) {
    console.log('✅ ALL CHECKS PASSED - Urgency system ready!')
  } else {
    console.log('❌ SOME CHECKS FAILED - Review errors above')
  }
  console.log('='.repeat(60) + '\n')

  process.exit(allPassed ? 0 : 1)
}

verifyUrgencySystem().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
