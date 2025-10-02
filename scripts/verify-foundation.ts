#!/usr/bin/env npx tsx
// @ts-nocheck

/**
 * Verify the foundation actually works
 * Simple, practical tests to ensure we're not overcomplicating
 */

import {
  GameState,
  GameStateUtils,
  StateChange
} from '../lib/character-state'

import { GameStateManager } from '../lib/game-state-manager'

import {
  DialogueNode,
  StateConditionEvaluator,
  StateCondition,
  ConditionalChoice
} from '../lib/dialogue-graph'

console.log('\n🔨 FOUNDATION VERIFICATION\n')
console.log('================================\n')

// Test 1: Can we create and save state?
console.log('TEST 1: Basic State Management')
console.log('-------------------------------')

const gameState = GameStateUtils.createNewGameState('test-player')
console.log('✅ Created new game state')

// Add some data
gameState.characters.get('maya')!.trust = 3
gameState.globalFlags.add('test_flag')
console.log('✅ Modified state (Maya trust: 3, added test_flag)')

// Test 2: Does save/load actually work?
console.log('\nTEST 2: Save/Load Persistence')
console.log('-------------------------------')

// Mock localStorage for Node environment
const storage = new Map<string, string>()
global.localStorage = {
  getItem: (key: string) => storage.get(key) || null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear()
} as any

const saved = GameStateManager.saveGameState(gameState)
console.log(saved ? '✅ State saved' : '❌ Save failed')

const loaded = GameStateManager.loadGameState()
if (loaded && loaded.characters.get('maya')!.trust === 3) {
  console.log('✅ State loaded correctly')
} else {
  console.log('❌ Load failed or data corrupted')
}

// Test 3: Does the condition evaluator work?
console.log('\nTEST 3: Condition Evaluation')
console.log('-------------------------------')

const testCondition: StateCondition = {
  trust: { min: 2 },
  hasGlobalFlags: ['test_flag']
}

const passesCondition = StateConditionEvaluator.evaluate(testCondition, gameState, 'maya')
console.log(passesCondition ? '✅ Condition evaluated correctly (should pass)' : '❌ Condition evaluation failed')

const failCondition: StateCondition = {
  trust: { min: 5 }  // Maya only has 3
}

const failsCondition = !StateConditionEvaluator.evaluate(failCondition, gameState, 'maya')
console.log(failsCondition ? '✅ Condition evaluated correctly (should fail)' : '❌ Condition evaluation failed')

// Test 4: Can we apply state changes?
console.log('\nTEST 4: State Changes')
console.log('-------------------------------')

const stateChange: StateChange = {
  characterId: 'maya',
  trustChange: 2,
  setRelationshipStatus: 'acquaintance'
  // Don't add knows_robotics here - we'll test it in the dialogue node
}

const newState = GameStateUtils.applyStateChange(gameState, stateChange)

const changeWorked =
  newState.characters.get('maya')!.trust === 5 &&
  newState.characters.get('maya')!.relationshipStatus === 'acquaintance' &&
  gameState.characters.get('maya')!.trust === 3  // Original unchanged (immutable)

console.log(changeWorked ? '✅ State changes applied correctly' : '❌ State change failed')

// Test 5: Simple dialogue node example
console.log('\nTEST 5: Dialogue Node Example')
console.log('-------------------------------')

const exampleNode: DialogueNode = {
  nodeId: 'maya_robotics_reveal',
  speaker: 'Maya Chen',
  content: [
    { text: "I've never told anyone this, but I love robotics more than medicine.", variation_id: 'v1' },
    { text: "My real passion? Building robots. Medicine is my parents' dream.", variation_id: 'v2' }
  ],
  requiredState: {
    trust: { min: 3 },
    lacksKnowledgeFlags: ['knows_robotics']  // Don't repeat if already known
  },
  choices: [
    {
      choiceId: 'encourage',
      text: "Follow your passion, not their expectations",
      nextNodeId: 'maya_grateful',
      pattern: 'helping',
      consequence: {
        characterId: 'maya',
        trustChange: 1,
        addKnowledgeFlags: ['encouraged_robotics']
      }
    },
    {
      choiceId: 'practical',
      text: "Medical robotics combines both fields",
      nextNodeId: 'maya_thoughtful',
      pattern: 'analytical',
      consequence: {
        characterId: 'maya',
        addKnowledgeFlags: ['suggested_combination']
      }
    }
  ],
  onEnter: [
    {
      characterId: 'maya',
      addKnowledgeFlags: ['knows_robotics']
    }
  ]
}

// Check if Maya can access this node
const canAccessNode = StateConditionEvaluator.evaluate(
  exampleNode.requiredState,
  newState,  // Maya has trust 5 now
  'maya'
)

console.log(canAccessNode ? '✅ Node access conditions work' : '❌ Node access evaluation failed')

// Summary
console.log('\n================================')
console.log('FOUNDATION STATUS\n')

const allTestsPassed = saved && loaded && passesCondition && failsCondition && changeWorked && canAccessNode

if (allTestsPassed) {
  console.log('✅ ALL SYSTEMS OPERATIONAL')
  console.log('\nThe foundation is solid and not overcomplicated.')
  console.log('We have:')
  console.log('  • Clean state management')
  console.log('  • Working persistence')
  console.log('  • Reliable condition evaluation')
  console.log('  • Immutable state changes')
  console.log('  • Flexible dialogue nodes')
  console.log('\nReady for Week 2: Maya vertical slice')
} else {
  console.log('❌ FOUNDATION NEEDS FIXES')
  console.log('Review the failed tests above')
}

console.log('\n================================\n')