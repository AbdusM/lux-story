import { getSimpleAnalytics, BIRMINGHAM_OPPORTUNITIES } from '../lib/simple-career-analytics'

/**
 * Data Integrity Monitor
 * 
 * Runs a quick health check on the Career Analytics system.
 * Alerts if "mock" or "fallback" data is being returned when real data should exist.
 * 
 * Usage: npx tsx scripts/monitor-data-integrity.ts
 */

const TEST_USER_ID = 'monitor_test_user_' + Date.now()

async function runIntegrityCheck() {
  console.log('🔍 Starting Data Integrity Monitor...')
  console.log(`👤 Test User ID: ${TEST_USER_ID}`)

  const analytics = getSimpleAnalytics()

  // 1. Check Initial State (Should be empty, not mock data)
  const initialInsights = analytics.getSimpleInsights(TEST_USER_ID)
  
  if (initialInsights.platformsCount !== 0) {
    console.error('❌ FAILURE: New user has phantom platform visits!')
    process.exit(1)
  }
  
  if (initialInsights.primaryInterest !== 'exploring') {
    console.error(`❌ FAILURE: New user has phantom interest: ${initialInsights.primaryInterest}`)
    process.exit(1)
  }

  console.log('✅ Initial State: Clean')

  // 2. Simulate User Actions
  console.log('🔄 Simulating user actions...')
  analytics.trackChoice(TEST_USER_ID, { text: "I want to help people in healthcare" })
  analytics.trackChoice(TEST_USER_ID, { text: "I love local Birmingham food" }) // Should trigger local affinity
  analytics.trackPlatformVisit(TEST_USER_ID, 'uab-medicine')

  // 3. Verify Updates
  const updatedInsights = analytics.getSimpleInsights(TEST_USER_ID)

  if (updatedInsights.primaryInterest !== 'healthcare') {
    console.error(`❌ FAILURE: Interest tracking failed. Expected 'healthcare', got '${updatedInsights.primaryInterest}'`)
    process.exit(1)
  }

  if (updatedInsights.localAffinity !== 1) {
     console.error(`❌ FAILURE: Local affinity tracking failed. Expected 1, got ${updatedInsights.localAffinity}`)
     process.exit(1)
  }

  if (updatedInsights.platformsCount !== 1) {
    console.error(`❌ FAILURE: Platform visit tracking failed.`)
    process.exit(1)
  }

  console.log('✅ Tracking Logic: Verified')

  // 4. Check Opportunity Matching
  const matches = analytics.getBirminghamOpportunities(TEST_USER_ID)
  
  // Should match healthcare opportunities
  const healthcareMatches = matches.filter(m => m.careerArea === 'healthcare')
  
  if (healthcareMatches.length === 0) {
    console.error('❌ FAILURE: Opportunity matching failed. No healthcare matches found.')
    process.exit(1)
  }

  // Verify real data is used (check a known ID)
  const uabMatch = matches.find(m => m.id === 'uab-medical')
  if (!uabMatch) {
    console.error('❌ FAILURE: Known real opportunity (UAB Medical) missing from matches.')
    process.exit(1)
  }

  console.log('✅ Data Source: Verified Real (UAB Medical found)')

  console.log('🎉 INTEGRITY CHECK PASSED: System is using real logic and real data.')
}

runIntegrityCheck().catch(err => {
  console.error('❌ FATAL ERROR:', err)
  process.exit(1)
})
