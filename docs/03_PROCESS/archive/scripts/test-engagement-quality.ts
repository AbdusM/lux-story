/**
 * Test Engagement Quality Analyzer
 * 
 * Demonstrates the system with synthetic game states representing
 * different engagement tiers
 */

import { EngagementQualityAnalyzer, quickEngagementCheck } from '../lib/engagement-quality-analyzer'
import { GameState, CharacterState } from '../lib/character-state'

// Helper to create synthetic game states
function createTestGameState(profile: {
  userId: string
  totalChoices: number
  trustLevels: { maya: number; devon: number; jordan: number; samuel: number }
  patterns: { helping: number; analytical: number; building: number; patience: number; exploring: number }
  globalFlags: string[]
  knowledgeFlags: string[]
}): GameState {
  const state: GameState = {
    saveVersion: '1.0',
    playerId: profile.userId,
    currentNodeId: 'test_node',
    currentCharacterId: 'samuel',
    characters: new Map(),
    globalFlags: new Set(profile.globalFlags),
    patterns: profile.patterns,
    lastSaved: Date.now(),
    thoughts: [],
    episodeNumber: 1,
    sessionStartTime: Date.now(),
    sessionBoundariesCrossed: 0
  }
  
  // Add characters
  const characters: Array<[string, CharacterState]> = [
    ['maya', {
      characterId: 'maya',
      trust: profile.trustLevels.maya,
      relationshipStatus: 'acquaintance',
      knowledgeFlags: new Set(profile.knowledgeFlags),
      conversationHistory: []
    }],
    ['devon', {
      characterId: 'devon',
      trust: profile.trustLevels.devon,
      relationshipStatus: 'stranger',
      knowledgeFlags: new Set(),
      conversationHistory: []
    }],
    ['jordan', {
      characterId: 'jordan',
      trust: profile.trustLevels.jordan,
      relationshipStatus: 'stranger',
      knowledgeFlags: new Set(),
      conversationHistory: []
    }],
    ['samuel', {
      characterId: 'samuel',
      trust: profile.trustLevels.samuel,
      relationshipStatus: 'confidant',
      knowledgeFlags: new Set(),
      conversationHistory: []
    }]
  ]
  
  characters.forEach(([id, char]) => state.characters.set(id, char))
  
  return state
}

// Test Case 1: Exceptional Engagement
console.log('\n' + '='.repeat(60))
console.log('TEST CASE 1: EXCEPTIONAL ENGAGEMENT')
console.log('='.repeat(60))

const exceptionalUser = createTestGameState({
  userId: 'exceptional_user',
  totalChoices: 25,
  trustLevels: { maya: 8, devon: 6, jordan: 5, samuel: 4 },
  patterns: {
    helping: 8,
    analytical: 6,
    building: 4,
    patience: 5,
    exploring: 2
  },
  globalFlags: ['maya_arc_complete', 'knows_birmingham_context'],
  knowledgeFlags: ['shared_parent_failure', 'knows_samuel_was_traveler']
})

const exceptionalMetrics = EngagementQualityAnalyzer.analyze(exceptionalUser)
console.log(EngagementQualityAnalyzer.generateDetailedReport(exceptionalUser))
console.log('\nCoaching Tips:', EngagementQualityAnalyzer.getCoachingTips(exceptionalUser))

// Test Case 2: Surface Engagement (Rusher)
console.log('\n' + '='.repeat(60))
console.log('TEST CASE 2: SURFACE ENGAGEMENT (RUSHER)')
console.log('='.repeat(60))

const rusherUser = createTestGameState({
  userId: 'rusher_user',
  totalChoices: 15,
  trustLevels: { maya: 2, devon: 1, jordan: 0, samuel: 1 },
  patterns: {
    helping: 1,
    analytical: 8,
    building: 5,
    patience: 0, // RED FLAG: Never waits
    exploring: 1
  },
  globalFlags: [],
  knowledgeFlags: []
})

const rusherMetrics = EngagementQualityAnalyzer.analyze(rusherUser)
console.log(EngagementQualityAnalyzer.generateDetailedReport(rusherUser))
console.log('\nCoaching Tips:', EngagementQualityAnalyzer.getCoachingTips(rusherUser))

// Test Case 3: Moderate Engagement (Steady)
console.log('\n' + '='.repeat(60))
console.log('TEST CASE 3: MODERATE ENGAGEMENT (STEADY)')
console.log('='.repeat(60))

const moderateUser = createTestGameState({
  userId: 'moderate_user',
  totalChoices: 18,
  trustLevels: { maya: 5, devon: 3, jordan: 1, samuel: 2 },
  patterns: {
    helping: 6,
    analytical: 5,
    building: 3,
    patience: 3,
    exploring: 1
  },
  globalFlags: ['maya_arc_complete'],
  knowledgeFlags: ['shared_parent_failure']
})

const moderateMetrics = EngagementQualityAnalyzer.analyze(moderateUser)
console.log(EngagementQualityAnalyzer.generateDetailedReport(moderateUser))
console.log('\nCoaching Tips:', EngagementQualityAnalyzer.getCoachingTips(moderateUser))

// Test Case 4: Random Clicker (Disengaged)
console.log('\n' + '='.repeat(60))
console.log('TEST CASE 4: RANDOM CLICKER (DISENGAGED)')
console.log('='.repeat(60))

const randomUser = createTestGameState({
  userId: 'random_user',
  totalChoices: 20,
  trustLevels: { maya: 2, devon: 2, jordan: 1, samuel: 1 },
  patterns: {
    helping: 4,
    analytical: 5,
    building: 4,
    patience: 3,
    exploring: 4
  }, // Very evenly distributed = no consistency
  globalFlags: [],
  knowledgeFlags: []
})

const randomMetrics = EngagementQualityAnalyzer.analyze(randomUser)
console.log(EngagementQualityAnalyzer.generateDetailedReport(randomUser))
console.log('\nCoaching Tips:', EngagementQualityAnalyzer.getCoachingTips(randomUser))

// Quick Check Comparison
console.log('\n' + '='.repeat(60))
console.log('QUICK CHECK COMPARISON')
console.log('='.repeat(60))

const users = [
  { name: 'Exceptional', state: exceptionalUser },
  { name: 'Rusher', state: rusherUser },
  { name: 'Moderate', state: moderateUser },
  { name: 'Random', state: randomUser }
]

users.forEach(user => {
  const check = quickEngagementCheck(user.state)
  console.log(`\n${user.name}:`)
  console.log(`  Tier: ${check.tier.toUpperCase()}`)
  console.log(`  Score: ${check.score}/100`)
  console.log(`  Concerns: ${check.concerns.length > 0 ? check.concerns.join(', ') : 'None'}`)
  console.log(`  Strengths: ${check.strengths.length > 0 ? check.strengths.join(', ') : 'None'}`)
})

// Summary Statistics
console.log('\n' + '='.repeat(60))
console.log('SUMMARY STATISTICS')
console.log('='.repeat(60))

const allMetrics = [
  { name: 'Exceptional', metrics: exceptionalMetrics },
  { name: 'Rusher', metrics: rusherMetrics },
  { name: 'Moderate', metrics: moderateMetrics },
  { name: 'Random', metrics: randomMetrics }
]

console.log('\nScore Distribution:')
allMetrics.forEach(({ name, metrics }) => {
  const bar = '█'.repeat(Math.floor(metrics.qualityScore / 5))
  console.log(`${name.padEnd(15)}: ${bar} ${metrics.qualityScore}`)
})

console.log('\nTier Distribution:')
const tierCounts: Record<string, number> = {}
allMetrics.forEach(({ metrics }) => {
  tierCounts[metrics.tier] = (tierCounts[metrics.tier] || 0) + 1
})
Object.entries(tierCounts).forEach(([tier, count]) => {
  console.log(`${tier.padEnd(15)}: ${count} users`)
})

console.log('\n' + '='.repeat(60))
console.log('TEST COMPLETE')
console.log('='.repeat(60))
console.log('\nRun this script to see engagement quality analysis in action:')
console.log('  npx tsx scripts/test-engagement-quality.ts')
console.log('\nOr integrate into your admin dashboard for real user analysis.')

