
import { GameLogic } from '../lib/game-logic'
import { GameStateUtils } from '../lib/character-state'
import { EvaluatedChoice } from '../lib/dialogue-graph'

console.log('⚡️ Starting Lux Story Logic Harness...')

// 1. Mock State
console.log('📦 1. Initializing Mock State...')
const initialState = GameStateUtils.createNewGameState('test-player')
// Simulate an active game
initialState.characters.get('samuel')!.trust = 5

// 2. Mock Choice (Scenario: Helping Samuel)
const testChoice: EvaluatedChoice = {
    choice: {
        choiceId: 'help_samuel',
        text: "I want to help you fix this.",
        pattern: 'helping',
        consequence: {
            characterId: 'samuel',
            trustChange: 1
        }
    },
    enabled: true,
    score: 10,
    reasons: ['Testing logic']
}

console.log(`🎯 2. Executing Choice: "${testChoice.choice.text}" (Pattern: ${testChoice.choice.pattern})`)

// 3. Process Choice
const result = GameLogic.processChoice(initialState, testChoice)

// 4. Verification
console.log('🔍 3. Verifying Results (The Unified Calculator)...')

let passed = true

// Assert Trust
const trustBefore = initialState.characters.get('samuel')?.trust ?? 0
const trustAfter = result.newState.characters.get('samuel')?.trust ?? 0
const expectedTrust = trustBefore + 1

if (trustAfter === expectedTrust) {
    console.log(`✅ Trust Logic Valid: ${trustBefore} -> ${trustAfter}`)
} else {
    console.error(`❌ Trust Logic BUSTED: Expected ${expectedTrust}, got ${trustAfter}`)
    passed = false
}

// Assert Patterns
const helpingPoints = result.newState.patterns.helping
if (helpingPoints > 0) {
    console.log(`✅ Pattern Logic Valid: Helping points increased to ${helpingPoints.toFixed(2)}`)
} else {
    console.error(`❌ Pattern Logic BUSTED: Helping points did not increase.`)
    passed = false
}

// Assert Events
if (result.events.earnOrb === 'helping') {
    console.log(`✅ Event Logic Valid: Earned 'helping' orb.`)
} else {
    console.error(`❌ Event Logic BUSTED: Failed to earn orb.`)
    passed = false
}

if (passed) {
    console.log('\n✨ ALL SYSTEMS OPERATIONAL. LOGIC HARNESS APPROVED. ✨')
    process.exit(0)
} else {
    console.error('\n💥 CRITICAL FAILURES DETECTED. ABORTING INTEGRATION. 💥')
    process.exit(1)
}
