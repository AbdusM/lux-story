/**
 * Admin API Test Script
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Tests the admin urgency API endpoints:
 * - GET /api/admin/urgency (fetch urgent students)
 * - POST /api/admin/urgency (trigger recalculation)
 *
 * Prerequisites:
 * 1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local
 *    (Get from Supabase Dashboard → Settings → API → service_role)
 *
 * 2. Add ADMIN_API_TOKEN to .env.local
 *    (Generate with: openssl rand -hex 32)
 *
 * Run: npx tsx scripts/test-admin-api.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN

interface TestResult {
  name: string
  passed: boolean
  message: string
  details?: any
}

const results: TestResult[] = []

// ============================================================================
// SETUP VALIDATION
// ============================================================================

async function validateSetup(): Promise<boolean> {
  console.log('\n' + '='.repeat(60))
  console.log('🔧 VALIDATING SETUP')
  console.log('='.repeat(60))

  let allValid = true

  // Check ADMIN_API_TOKEN
  if (!ADMIN_TOKEN) {
    console.log('\n❌ ADMIN_API_TOKEN not found in .env.local')
    console.log('   Run: echo "ADMIN_API_TOKEN=$(openssl rand -hex 32)" >> .env.local')
    allValid = false
  } else {
    console.log('\n✅ ADMIN_API_TOKEN configured')
  }

  // Check SUPABASE_SERVICE_ROLE_KEY
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('\n❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
    console.log('   Get from: Supabase Dashboard → Settings → API → service_role')
    console.log('   Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your-key-here')
    allValid = false
  } else {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY configured')
  }

  // Check dev server
  try {
    const response = await fetch(`${API_BASE}/api/health`, { method: 'GET' })
    if (!response.ok && response.status !== 404) {
      console.log('\n⚠️  Dev server may not be running at', API_BASE)
      console.log('   Run: npm run dev')
      allValid = false
    } else {
      console.log('✅ Dev server reachable')
    }
  } catch (error) {
    console.log('\n❌ Cannot reach dev server at', API_BASE)
    console.log('   Run: npm run dev')
    allValid = false
  }

  if (!allValid) {
    console.log('\n' + '='.repeat(60))
    console.log('⚠️  SETUP INCOMPLETE - Fix issues above and re-run')
    console.log('='.repeat(60) + '\n')
    return false
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ SETUP VALID - Proceeding with tests')
  console.log('='.repeat(60))

  return true
}

// ============================================================================
// TEST 1: GET /api/admin/urgency (fetch urgent students)
// ============================================================================

async function testFetchUrgentStudents(): Promise<void> {
  console.log('\n📍 Test 1: GET /api/admin/urgency')
  console.log('─'.repeat(60))

  try {
    const url = `${API_BASE}/api/admin/urgency?level=all&limit=10`
    console.log(`   Fetching: ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`)
    }

    console.log(`   Status: ${response.status} OK`)
    console.log(`   Students returned: ${data.count}`)

    // Validate response structure
    if (!data.students || !Array.isArray(data.students)) {
      throw new Error('Response missing students array')
    }

    if (!data.timestamp) {
      throw new Error('Response missing timestamp')
    }

    // Check if any students have narrative (Glass Box validation)
    if (data.count > 0) {
      const studentsWithNarrative = data.students.filter((s: any) => s.urgency_narrative)
      console.log(`   Students with narrative: ${studentsWithNarrative.length}/${data.count}`)

      if (studentsWithNarrative.length > 0) {
        const sample = studentsWithNarrative[0]
        console.log(`   Sample narrative: "${sample.urgency_narrative?.substring(0, 100)}..."`)
      }
    } else {
      console.log('   ℹ️  No urgent students found (empty database - expected for new install)')
    }

    results.push({
      name: 'GET /api/admin/urgency',
      passed: true,
      message: `✅ Successfully fetched ${data.count} students`,
      details: { count: data.count, hasNarratives: data.count > 0 }
    })

    console.log(`   ✅ PASSED`)

  } catch (error: any) {
    results.push({
      name: 'GET /api/admin/urgency',
      passed: false,
      message: `❌ ${error.message}`,
      details: error
    })
    console.log(`   ❌ FAILED: ${error.message}`)
  }
}

// ============================================================================
// TEST 2: GET with level filter
// ============================================================================

async function testFetchCriticalOnly(): Promise<void> {
  console.log('\n📍 Test 2: GET /api/admin/urgency?level=critical')
  console.log('─'.repeat(60))

  try {
    const url = `${API_BASE}/api/admin/urgency?level=critical&limit=5`
    console.log(`   Fetching: ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`)
    }

    console.log(`   Status: ${response.status} OK`)
    console.log(`   Critical students: ${data.count}`)

    results.push({
      name: 'GET /api/admin/urgency?level=critical',
      passed: true,
      message: `✅ Successfully filtered to ${data.count} critical students`,
      details: { count: data.count }
    })

    console.log(`   ✅ PASSED`)

  } catch (error: any) {
    results.push({
      name: 'GET /api/admin/urgency?level=critical',
      passed: false,
      message: `❌ ${error.message}`,
      details: error
    })
    console.log(`   ❌ FAILED: ${error.message}`)
  }
}

// ============================================================================
// TEST 3: Authentication - should fail without token
// ============================================================================

async function testAuthenticationRequired(): Promise<void> {
  console.log('\n📍 Test 3: Authentication Required')
  console.log('─'.repeat(60))

  try {
    const url = `${API_BASE}/api/admin/urgency`
    console.log(`   Fetching without auth token...`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // No Authorization header
      }
    })

    if (response.status === 401) {
      console.log(`   Status: 401 Unauthorized (expected)`)
      results.push({
        name: 'Authentication Required',
        passed: true,
        message: '✅ API correctly rejects unauthenticated requests',
        details: { status: 401 }
      })
      console.log(`   ✅ PASSED - Auth working correctly`)
    } else {
      throw new Error(`Expected 401, got ${response.status} (authentication not enforced!)`)
    }

  } catch (error: any) {
    results.push({
      name: 'Authentication Required',
      passed: false,
      message: `❌ ${error.message}`,
      details: error
    })
    console.log(`   ❌ FAILED: ${error.message}`)
  }
}

// ============================================================================
// TEST 4: POST /api/admin/urgency (trigger recalculation)
// ============================================================================

async function testTriggerRecalculation(): Promise<void> {
  console.log('\n📍 Test 4: POST /api/admin/urgency (recalculation)')
  console.log('─'.repeat(60))

  try {
    const url = `${API_BASE}/api/admin/urgency`
    console.log(`   Triggering urgency recalculation...`)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || 'Unknown error'}`)
    }

    console.log(`   Status: ${response.status} OK`)
    console.log(`   Message: ${data.message}`)
    console.log(`   Players processed: ${data.playersProcessed}`)

    results.push({
      name: 'POST /api/admin/urgency',
      passed: true,
      message: `✅ Successfully recalculated urgency for ${data.playersProcessed} players`,
      details: data
    })

    console.log(`   ✅ PASSED`)

  } catch (error: any) {
    results.push({
      name: 'POST /api/admin/urgency',
      passed: false,
      message: `❌ ${error.message}`,
      details: error
    })
    console.log(`   ❌ FAILED: ${error.message}`)
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests(): Promise<void> {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 ADMIN API TEST SUITE')
  console.log('='.repeat(60))

  // Validate setup first
  const setupValid = await validateSetup()
  if (!setupValid) {
    process.exit(1)
  }

  // Run tests
  await testFetchUrgentStudents()
  await testFetchCriticalOnly()
  await testAuthenticationRequired()
  await testTriggerRecalculation()

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(60))

  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length

  console.log(`\nResults: ${passed}/${total} tests passed`)
  console.log(`Status: ${failed === 0 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}\n`)

  // Detailed results
  for (const result of results) {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`)
    console.log(`   ${result.message}`)
  }

  console.log('\n' + '='.repeat(60))

  // Exit with error code if any tests failed
  process.exit(failed > 0 ? 1 : 0)
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
