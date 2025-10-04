/**
 * Test Script: Urgency Narrative Validation
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Purpose: Test severity-calibrated narrative validation
 * Run: npx tsx scripts/test-urgency-narratives.ts
 */

import {
  validateExamples,
  validateNarrative,
  countWords,
  EXAMPLE_NARRATIVES,
  WORD_COUNT_LIMITS,
  type UrgencyLevel,
} from '../lib/urgency-narrative-validator'

console.log('🧪 Testing Urgency Narrative Validator\n')
console.log('=' .repeat(80))

// ============================================================================
// TEST 1: Validate all example narratives
// ============================================================================

console.log('\n📋 TEST 1: Validate All Example Narratives\n')

const results = validateExamples()

let totalTests = 0
let passedTests = 0
let failedTests = 0

for (const [level, modes] of Object.entries(results)) {
  console.log(`\n${level.toUpperCase()} Urgency:`)
  console.log('-'.repeat(80))

  for (const [mode, result] of Object.entries(modes as Record<string, any>)) {
    totalTests++
    const status = result.valid ? '✅' : '❌'
    const limits = WORD_COUNT_LIMITS[level as UrgencyLevel]

    console.log(`\n  ${status} ${mode.toUpperCase()} Mode:`)
    console.log(`     Word Count: ${result.wordCount} (limit: ${limits.min}-${limits.max})`)
    console.log(`     Narrative: "${result.narrative}"`)

    if (result.valid) {
      passedTests++
    } else {
      failedTests++
      console.log(`     Errors:`)
      result.errors.forEach((error: string) => console.log(`       - ${error}`))
    }
  }
}

console.log('\n' + '='.repeat(80))
console.log(`\n📊 Test Results: ${passedTests}/${totalTests} passed`)

if (failedTests > 0) {
  console.log(`❌ ${failedTests} tests failed`)
  process.exit(1)
} else {
  console.log('✅ All tests passed!')
}

// ============================================================================
// TEST 2: Word count accuracy
// ============================================================================

console.log('\n' + '='.repeat(80))
console.log('\n📏 TEST 2: Word Count Accuracy\n')

const testCases = [
  { text: 'This is a test.', expected: 4 },
  { text: '🚨 Student stopped playing.', expected: 3 },
  { text: '**Action:** Reach out today.', expected: 4 }, // Action: is one word, reach, out, today = 4
  { text: 'Student\'s choices show patterns.', expected: 4 },
  { text: 'Multiple   spaces   between   words.', expected: 4 },
  { text: '   Leading and trailing spaces.   ', expected: 4 },
]

let wordCountPassed = 0

testCases.forEach((testCase, index) => {
  const actual = countWords(testCase.text)
  const passed = actual === testCase.expected
  const status = passed ? '✅' : '❌'

  console.log(`${status} Test ${index + 1}: "${testCase.text}"`)
  console.log(`   Expected: ${testCase.expected}, Got: ${actual}`)

  if (passed) {
    wordCountPassed++
  } else {
    console.log(`   ❌ Word count mismatch!`)
  }
})

console.log(`\n📊 Word Count Tests: ${wordCountPassed}/${testCases.length} passed`)

if (wordCountPassed < testCases.length) {
  console.log('❌ Some word count tests failed')
  process.exit(1)
}

// ============================================================================
// TEST 3: Structure validation
// ============================================================================

console.log('\n' + '='.repeat(80))
console.log('\n🔍 TEST 3: Structure Validation\n')

const structureTests = [
  {
    name: 'Critical missing emoji',
    narrative: 'Student stopped playing. Might be stuck. **Action:** Reach out today.',
    level: 'critical' as UrgencyLevel,
    shouldFail: true,
    expectedError: 'must start with urgency emoji',
  },
  {
    name: 'Critical missing "today"',
    narrative: '🚨 Student stopped playing. Might be stuck. **Action:** Reach out.',
    level: 'critical' as UrgencyLevel,
    shouldFail: true,
    expectedError: 'must include "today"',
  },
  {
    name: 'Missing Action directive',
    narrative: '🟠 Student shows anxiety patterns. Needs support this week.',
    level: 'high' as UrgencyLevel,
    shouldFail: true,
    expectedError: 'missing **Action:**',
  },
  {
    name: 'Valid critical narrative',
    narrative: '🚨 Student stopped playing 5 days ago after strong start. Likely stuck or confused. **Action:** Reach out today.',
    level: 'critical' as UrgencyLevel,
    shouldFail: false,
  },
]

let structurePassed = 0

structureTests.forEach((test) => {
  const result = validateNarrative(test.narrative, test.level)
  const failed = !result.valid
  const passed = failed === test.shouldFail

  const status = passed ? '✅' : '❌'

  console.log(`${status} ${test.name}`)
  console.log(`   Level: ${test.level}`)
  console.log(`   Should fail: ${test.shouldFail}`)
  console.log(`   Actually failed: ${failed}`)

  if (!passed) {
    console.log(`   Expected error: ${test.expectedError || 'none'}`)
    console.log(`   Actual errors: ${result.errors.join(', ') || 'none'}`)
  }

  if (passed) {
    structurePassed++
  }
})

console.log(`\n📊 Structure Tests: ${structurePassed}/${structureTests.length} passed`)

if (structurePassed < structureTests.length) {
  console.log('❌ Some structure tests failed')
  process.exit(1)
}

// ============================================================================
// FINAL SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(80))
console.log('\n🎉 ALL TESTS PASSED!\n')
console.log('Summary:')
console.log(`  ✅ Example narratives: ${passedTests}/${totalTests}`)
console.log(`  ✅ Word count tests: ${wordCountPassed}/${testCases.length}`)
console.log(`  ✅ Structure tests: ${structurePassed}/${structureTests.length}`)
console.log('\n✅ Severity-calibrated urgency narratives are working correctly!')
console.log('\n' + '='.repeat(80))
