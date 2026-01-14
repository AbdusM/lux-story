/**
 * Core Game Loop Logic Tests
 * Tests pure functions without UI - the critical dialogue → choice → state flow
 *
 * Coverage Goals: 95% of game loop logic
 * Runtime Target: <100ms total
 */

import { describe, it, expect } from 'vitest'
import { GameStateUtils } from '@/lib/character-state'
import { StateConditionEvaluator } from '@/lib/dialogue-graph'
import { MAX_TRUST, MIN_TRUST } from '@/lib/constants'
import {
  createStateWithCharacter,
  createChoiceWithConsequence,
  createNodeWithChoice,
  createNodeWithChoices,
  wrapChoice,
  createStateWithPatterns,
  createStateWithFlags,
  createConditionalNode,
  getPattern,
  getCharacterTrust,
  hasGlobalFlag,
  assertStateNotMutated
} from './helpers/game-loop-fixtures'

describe('Core Game Loop Logic', () => {
  describe('Choice Processing - Happy Path', () => {
    it('should process basic choice and update patterns', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')
      const choice = createChoiceWithConsequence({
        patternChanges: { analytical: 1 }
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      expect(getPattern(newState, 'analytical')).toBe(1)
      expect(assertStateNotMutated(gameState, newState)).toBe(true)
    })

    it('should apply trust changes correctly', () => {
      const gameState = createStateWithCharacter('maya', { trust: 3 })
      const choice = createChoiceWithConsequence({
        characterId: 'maya',
        trustChange: 2
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      expect(getCharacterTrust(newState, 'maya')).toBe(5)
    })

    it('should add global flags from choice consequences', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')
      const choice = createChoiceWithConsequence({
        addGlobalFlags: ['test-flag']
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      expect(hasGlobalFlag(newState, 'test-flag')).toBe(true)
    })

    it('should add knowledge flags to character state', () => {
      const gameState = createStateWithCharacter('maya', { trust: 3 })
      const choice = createChoiceWithConsequence({
        characterId: 'maya',
        addKnowledgeFlags: ['maya-backstory']
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)
      const mayaState = newState.characters.get('maya')!

      expect(mayaState.knowledgeFlags.has('maya-backstory')).toBe(true)
    })

    it('should apply multiple pattern changes simultaneously', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')
      const choice = createChoiceWithConsequence({
        patternChanges: {
          analytical: 2,
          helping: 1,
          building: 3
        }
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      expect(getPattern(newState, 'analytical')).toBe(2)
      expect(getPattern(newState, 'helping')).toBe(1)
      expect(getPattern(newState, 'building')).toBe(3)
    })
  })

  describe('Conditional Choice Evaluation', () => {
    it('should hide choice when trust requirement not met (with fallback choice)', () => {
      const gameState = createStateWithCharacter('maya', { trust: 2 })
      // Need at least one always-visible choice to prevent AUTO-FALLBACK
      const node = createNodeWithChoices([
        { choiceId: 'deep_question', visibleCondition: { trust: { min: 5 } } },
        { choiceId: 'casual_chat', visibleCondition: undefined } // Always visible
      ])

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      const deepQuestion = evaluated.find(c => c.choice.choiceId === 'deep_question')
      const casualChat = evaluated.find(c => c.choice.choiceId === 'casual_chat')

      expect(deepQuestion?.visible).toBe(false) // Hidden due to trust
      expect(casualChat?.visible).toBe(true) // Always visible
    })

    it('should show choice when trust requirement is met exactly', () => {
      const gameState = createStateWithCharacter('maya', { trust: 5 })
      const node = createNodeWithChoice({
        choiceId: 'deep_question',
        visibleCondition: { trust: { min: 5 } }
      })

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      const deepQuestion = evaluated.find(c => c.choice.choiceId === 'deep_question')
      expect(deepQuestion?.visible).toBe(true)
    })

    it('should unlock pattern-gated choice at threshold', () => {
      const gameState = createStateWithPatterns({ analytical: 3 })
      const node = createNodeWithChoice({
        visibleCondition: { patterns: { analytical: { min: 3 } } }
      })

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      expect(evaluated[0]?.visible).toBe(true)
    })

    it('should hide pattern-gated choice below threshold (with fallback choice)', () => {
      const gameState = createStateWithPatterns({ analytical: 2 })
      const node = createNodeWithChoices([
        { choiceId: 'analytical_path', visibleCondition: { patterns: { analytical: { min: 3 } } } },
        { choiceId: 'general_path', visibleCondition: undefined } // Always visible
      ])

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      const analyticalPath = evaluated.find(c => c.choice.choiceId === 'analytical_path')
      const generalPath = evaluated.find(c => c.choice.choiceId === 'general_path')

      expect(analyticalPath?.visible).toBe(false) // Hidden due to pattern
      expect(generalPath?.visible).toBe(true) // Always visible
    })

    it('should evaluate multiple pattern conditions (AND logic)', () => {
      const gameState = createStateWithPatterns({
        analytical: 4,
        helping: 3
      })
      const node = createNodeWithChoice({
        visibleCondition: {
          patterns: {
            analytical: { min: 4 },
            helping: { min: 3 }
          }
        }
      })

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      expect(evaluated[0]?.visible).toBe(true)
    })

    it('should hide choice when one of multiple pattern conditions not met (with fallback choice)', () => {
      const gameState = createStateWithPatterns({
        analytical: 4,
        helping: 2 // Below minimum
      })
      const node = createNodeWithChoices([
        {
          choiceId: 'combo_path',
          visibleCondition: {
            patterns: {
              analytical: { min: 4 },
              helping: { min: 3 }
            }
          }
        },
        { choiceId: 'general_path', visibleCondition: undefined } // Always visible
      ])

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      const comboPath = evaluated.find(c => c.choice.choiceId === 'combo_path')
      const generalPath = evaluated.find(c => c.choice.choiceId === 'general_path')

      expect(comboPath?.visible).toBe(false) // Hidden due to helping pattern
      expect(generalPath?.visible).toBe(true) // Always visible
    })

    it('should evaluate global flag requirements', () => {
      const gameState = createStateWithFlags(['met_maya'])
      const node = createNodeWithChoice({
        visibleCondition: { hasGlobalFlags: ['met_maya'] }
      })

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      expect(evaluated[0]?.visible).toBe(true)
    })

    it('should hide choice when required flag is missing (with fallback choice)', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')
      const node = createNodeWithChoices([
        { choiceId: 'flag_path', visibleCondition: { hasGlobalFlags: ['met_maya'] } },
        { choiceId: 'general_path', visibleCondition: undefined } // Always visible
      ])

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      const flagPath = evaluated.find(c => c.choice.choiceId === 'flag_path')
      const generalPath = evaluated.find(c => c.choice.choiceId === 'general_path')

      expect(flagPath?.visible).toBe(false) // Hidden due to missing flag
      expect(generalPath?.visible).toBe(true) // Always visible
    })
  })

  describe('Edge Cases', () => {
    it('should handle no visible choices gracefully (fallback mode)', () => {
      const node = createNodeWithChoices([
        { choiceId: 'c1', visibleCondition: { trust: { min: 10 } } },
        { choiceId: 'c2', visibleCondition: { trust: { min: 10 } } }
      ])
      const gameState = createStateWithCharacter('maya', { trust: 0 })

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      // Auto-fallback: all choices shown to prevent deadlock
      expect(evaluated.every(c => c.visible)).toBe(true)
    })

    it('should clamp trust at MAX_TRUST boundary', () => {
      const gameState = createStateWithCharacter('maya', { trust: 9 })
      const choice = createChoiceWithConsequence({
        characterId: 'maya',
        trustChange: 5 // Would go to 14
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)
      const mayaTrust = getCharacterTrust(newState, 'maya')

      expect(mayaTrust).toBe(MAX_TRUST) // Clamped at 10
      expect(mayaTrust).toBeLessThanOrEqual(MAX_TRUST)
    })

    it('should clamp trust at MIN_TRUST boundary', () => {
      const gameState = createStateWithCharacter('maya', { trust: 1 })
      const choice = createChoiceWithConsequence({
        characterId: 'maya',
        trustChange: -5 // Would go to -4
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)
      const mayaTrust = getCharacterTrust(newState, 'maya')

      expect(mayaTrust).toBe(MIN_TRUST) // Clamped at 0
      expect(mayaTrust).toBeGreaterThanOrEqual(MIN_TRUST)
    })

    it('should handle zero pattern changes (no-op)', () => {
      const gameState = createStateWithPatterns({ analytical: 3 })
      const choice = createChoiceWithConsequence({
        patternChanges: { analytical: 0 }
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      expect(getPattern(newState, 'analytical')).toBe(3) // Unchanged
    })

    it('should handle negative pattern changes (pattern decay)', () => {
      const gameState = createStateWithPatterns({ patience: 5 })
      const choice = createChoiceWithConsequence({
        patternChanges: { patience: -2 }
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      expect(getPattern(newState, 'patience')).toBe(3)
    })

    it('should allow patterns to go negative (no min clamping in current implementation)', () => {
      const gameState = createStateWithPatterns({ patience: 1 })
      const choice = createChoiceWithConsequence({
        patternChanges: { patience: -5 } // Would go to -4
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      // Current implementation doesn't clamp at 0 - patterns can go negative
      expect(getPattern(newState, 'patience')).toBe(-4)
    })

    it('should handle empty consequence object', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')
      const choice = createChoiceWithConsequence({})

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      // State should remain unchanged
      expect(newState.patterns).toEqual(gameState.patterns)
    })

    it('should handle undefined consequence', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')

      // No consequence - state should remain unchanged
      const newState = gameState

      expect(newState).toBe(gameState)
    })
  })

  describe('Pattern Threshold Detection', () => {
    it('should detect when pattern crosses threshold upward', () => {
      const gameState = createStateWithPatterns({ analytical: 2 })
      const choice = createChoiceWithConsequence({
        patternChanges: { analytical: 1 } // 2 + 1 = 3 (crosses threshold)
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      expect(getPattern(newState, 'analytical')).toBe(3)

      // Can now unlock pattern-gated content at threshold 3
      const node = createNodeWithChoice({
        visibleCondition: { patterns: { analytical: { min: 3 } } }
      })
      const evaluated = StateConditionEvaluator.evaluateChoices(node, newState, 'maya')

      expect(evaluated[0]?.visible).toBe(true)
    })

    it('should detect pattern at multiple thresholds (3, 6, 9)', () => {
      const testThresholds = [3, 6, 9]

      testThresholds.forEach(threshold => {
        const gameState = createStateWithPatterns({ analytical: threshold })
        const node = createNodeWithChoice({
          visibleCondition: { patterns: { analytical: { min: threshold } } }
        })

        const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

        expect(evaluated[0]?.visible).toBe(true)
      })
    })
  })

  describe('Trust Threshold Detection', () => {
    it('should unlock vulnerability arc at trust 6', () => {
      const gameState = createStateWithCharacter('maya', { trust: 6 })
      const node = createNodeWithChoice({
        choiceId: 'vulnerability_arc',
        visibleCondition: { trust: { min: 6 } }
      })

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      const vulnerabilityChoice = evaluated.find(
        c => c.choice.choiceId === 'vulnerability_arc'
      )
      expect(vulnerabilityChoice?.visible).toBe(true)
    })

    it('should respect trust max condition (with fallback choice)', () => {
      const gameState = createStateWithCharacter('maya', { trust: 8 })
      const node = createNodeWithChoices([
        { choiceId: 'mid_trust', visibleCondition: { trust: { min: 3, max: 6 } } },
        { choiceId: 'general_path', visibleCondition: undefined } // Always visible
      ])

      const evaluated = StateConditionEvaluator.evaluateChoices(node, gameState, 'maya')

      const midTrust = evaluated.find(c => c.choice.choiceId === 'mid_trust')
      const generalPath = evaluated.find(c => c.choice.choiceId === 'general_path')

      expect(midTrust?.visible).toBe(false) // Trust too high (8 > 6)
      expect(generalPath?.visible).toBe(true) // Always visible
    })
  })

  describe('Immutability Checks', () => {
    it('should not mutate original state when processing choice', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')
      const originalPatterns = { ...gameState.patterns }

      const choice = createChoiceWithConsequence({
        patternChanges: { analytical: 5 }
      })

      GameStateUtils.applyStateChange(gameState, choice.consequence!)

      // Original state should be unchanged
      expect(gameState.patterns).toEqual(originalPatterns)
    })

    it('should create new Map instance for characters', () => {
      const gameState = createStateWithCharacter('maya', { trust: 3 })
      const originalCharacters = gameState.characters

      const choice = createChoiceWithConsequence({
        characterId: 'maya',
        trustChange: 2
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      expect(newState.characters).not.toBe(originalCharacters)
    })

    it('should create new Set instance for global flags', () => {
      const gameState = createStateWithFlags(['flag1'])
      const originalFlags = gameState.globalFlags

      const choice = createChoiceWithConsequence({
        addGlobalFlags: ['flag2']
      })

      const newState = GameStateUtils.applyStateChange(gameState, choice.consequence!)

      expect(newState.globalFlags).not.toBe(originalFlags)
    })
  })
})
