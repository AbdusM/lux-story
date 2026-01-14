/**
 * Game Loop Test Fixtures
 * Helper utilities for testing the core game loop logic
 */

import type { GameState, CharacterState } from '@/lib/character-state'
import { GameStateUtils } from '@/lib/character-state'
import type { CharacterId } from '@/lib/graph-registry'
import type { DialogueNode, ConditionalChoice, StateChange } from '@/lib/dialogue-graph'
import type { PatternType } from '@/lib/patterns'

/**
 * Create a game state with a specific character at a given trust level
 */
export function createStateWithCharacter(
  characterId: CharacterId,
  overrides: Partial<CharacterState> = {}
): GameState {
  const gameState = GameStateUtils.createNewGameState('test-player')

  const charState = gameState.characters.get(characterId)!
  gameState.characters.set(characterId, { ...charState, ...overrides })

  return gameState
}

/**
 * Create a choice with a specific consequence
 */
export function createChoiceWithConsequence(
  consequence: StateChange,
  overrides: Partial<ConditionalChoice> = {}
): ConditionalChoice {
  return {
    choiceId: 'test-choice',
    text: 'Test choice',
    nextNodeId: 'test-next',
    consequence,
    ...overrides
  }
}

/**
 * Create a dialogue node with specific choices
 */
export function createNodeWithChoice(
  choiceOverrides: Partial<ConditionalChoice> = {}
): DialogueNode {
  return {
    nodeId: 'test-node',
    content: [
      {
        text: 'Test dialogue content',
        emotion: 'neutral'
      }
    ],
    choices: [
      {
        choiceId: 'test-choice',
        text: 'Test choice',
        nextNodeId: 'test-next',
        ...choiceOverrides
      }
    ]
  }
}

/**
 * Create a dialogue node with multiple choices
 */
export function createNodeWithChoices(
  choices: Partial<ConditionalChoice>[]
): DialogueNode {
  return {
    nodeId: 'test-node',
    content: [
      {
        text: 'Test dialogue content',
        emotion: 'neutral'
      }
    ],
    choices: choices.map((choice, index) => ({
      choiceId: choice.choiceId || `test-choice-${index}`,
      text: choice.text || `Test choice ${index}`,
      nextNodeId: choice.nextNodeId || `test-next-${index}`,
      ...choice
    }))
  }
}

/**
 * Wrap a choice in the format expected by processChoice
 */
export function wrapChoice(choice: ConditionalChoice): { choice: ConditionalChoice } {
  return { choice }
}

/**
 * Create a minimal game state with specific pattern levels
 */
export function createStateWithPatterns(
  patterns: Partial<Record<PatternType, number>>
): GameState {
  const gameState = GameStateUtils.createNewGameState('test-player')

  Object.entries(patterns).forEach(([pattern, value]) => {
    gameState.patterns[pattern as PatternType] = value
  })

  return gameState
}

/**
 * Create a game state with specific global flags
 */
export function createStateWithFlags(flags: string[]): GameState {
  const gameState = GameStateUtils.createNewGameState('test-player')
  gameState.globalFlags = new Set(flags)
  return gameState
}

/**
 * Create a game state with specific knowledge flags
 */
export function createStateWithKnowledge(knowledgeFlags: string[]): GameState {
  const gameState = GameStateUtils.createNewGameState('test-player')
  gameState.knowledgeFlags = new Set(knowledgeFlags)
  return gameState
}

/**
 * Create a dialogue node with visibility conditions
 */
export function createConditionalNode(
  condition: ConditionalChoice['visibleCondition']
): DialogueNode {
  return {
    nodeId: 'test-conditional-node',
    content: [
      {
        text: 'Conditional content',
        emotion: 'neutral'
      }
    ],
    choices: [
      {
        choiceId: 'conditional-choice',
        text: 'Conditional choice',
        nextNodeId: 'test-next',
        visibleCondition: condition
      }
    ]
  }
}

/**
 * Create a minimal valid game state for testing
 */
export function createMinimalGameState(): GameState {
  return GameStateUtils.createNewGameState('test-player')
}

/**
 * Assert that a game state is immutable (not mutated)
 */
export function assertStateNotMutated(
  originalState: GameState,
  newState: GameState
): boolean {
  return originalState !== newState
}

/**
 * Get pattern value from state safely
 */
export function getPattern(state: GameState, pattern: PatternType): number {
  return state.patterns[pattern] || 0
}

/**
 * Get character trust from state safely
 */
export function getCharacterTrust(
  state: GameState,
  characterId: CharacterId
): number {
  const charState = state.characters.get(characterId)
  return charState?.trust ?? 0
}

/**
 * Check if global flag exists in state
 */
export function hasGlobalFlag(state: GameState, flag: string): boolean {
  return state.globalFlags.has(flag)
}

/**
 * Check if knowledge flag exists in state
 */
export function hasKnowledgeFlag(state: GameState, flag: string): boolean {
  return state.knowledgeFlags.has(flag)
}
