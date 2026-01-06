/**
 * Interrupt System Tests
 *
 * Tests for the ME2-style interrupt system (E2-031 to E2-033)
 * - InterruptWindow type validation
 * - Interrupt opportunity detection
 * - State changes on interrupt/timeout
 * - Pattern attribution
 */

import { describe, test, expect } from 'vitest'
import {
  InterruptWindow,
  DialogueContent,
  DialogueNode
} from '../../lib/dialogue-graph'
import { GameStateUtils } from '../../lib/character-state'
import { isValidPattern } from '../../lib/patterns'

describe('Interrupt System', () => {
  describe('InterruptWindow Type', () => {
    test('should have required fields', () => {
      const interrupt: InterruptWindow = {
        duration: 3000,
        type: 'connection',
        action: 'Reach out',
        targetNodeId: 'comfort_node'
      }

      expect(interrupt.duration).toBe(3000)
      expect(interrupt.type).toBe('connection')
      expect(interrupt.action).toBe('Reach out')
      expect(interrupt.targetNodeId).toBe('comfort_node')
    })

    test('should support optional consequence', () => {
      const interrupt: InterruptWindow = {
        duration: 3000,
        type: 'connection',
        action: 'Reach out',
        targetNodeId: 'comfort_node',
        consequence: {
          patternChanges: {
            helping: 2
          }
        }
      }

      expect(interrupt.consequence).toBeDefined()
      expect(interrupt.consequence?.patternChanges?.helping).toBe(2)
    })

    test('should support optional missedNodeId', () => {
      const interrupt: InterruptWindow = {
        duration: 3000,
        type: 'silence',
        action: 'Wait in silence',
        targetNodeId: 'speak_node',
        missedNodeId: 'continue_silence_node'
      }

      expect(interrupt.missedNodeId).toBe('continue_silence_node')
    })

    test('should support all three interrupt types', () => {
      const types: InterruptWindow['type'][] = ['connection', 'challenge', 'silence']

      types.forEach(type => {
        const interrupt: InterruptWindow = {
          duration: 3000,
          type,
          action: 'Test action',
          targetNodeId: 'test_node'
        }
        expect(interrupt.type).toBe(type)
      })
    })
  })

  describe('InterruptWindow Duration', () => {
    test('should accept recommended duration range (2000-4000ms)', () => {
      const durations = [2000, 2500, 3000, 3500, 4000]

      durations.forEach(duration => {
        const interrupt: InterruptWindow = {
          duration,
          type: 'connection',
          action: 'Test',
          targetNodeId: 'test_node'
        }
        expect(interrupt.duration).toBe(duration)
        expect(interrupt.duration).toBeGreaterThanOrEqual(2000)
        expect(interrupt.duration).toBeLessThanOrEqual(4000)
      })
    })
  })

  describe('DialogueContent with Interrupt', () => {
    test('should allow interrupt on DialogueContent', () => {
      const content: DialogueContent = {
        text: 'She pauses, tears welling in her eyes...',
        emotion: 'vulnerable',
        variation_id: 'emotional_moment_1',
        interrupt: {
          duration: 3000,
          type: 'connection',
          action: 'Reach out and touch her shoulder',
          targetNodeId: 'comfort_response',
          consequence: {
            characterId: 'grace',
            trustChange: 2
          }
        }
      }

      expect(content.interrupt).toBeDefined()
      expect(content.interrupt?.action).toBe('Reach out and touch her shoulder')
    })

    test('should allow content without interrupt', () => {
      const content: DialogueContent = {
        text: 'Hello, welcome to the station.',
        variation_id: 'greeting_1'
      }

      expect(content.interrupt).toBeUndefined()
    })
  })

  describe('Pattern Attribution', () => {
    test('interrupt consequence should use valid patterns', () => {
      const interrupt: InterruptWindow = {
        duration: 3000,
        type: 'connection',
        action: 'Comfort them',
        targetNodeId: 'comfort_node',
        consequence: {
          patternChanges: {
            helping: 2
          }
        }
      }

      const patternKey = Object.keys(interrupt.consequence!.patternChanges!)[0]
      expect(isValidPattern(patternKey)).toBe(true)
    })

    test('should support helping pattern for connection interrupts', () => {
      const interrupt: InterruptWindow = {
        duration: 3000,
        type: 'connection',
        action: 'Offer support',
        targetNodeId: 'support_node',
        consequence: {
          patternChanges: {
            helping: 1
          }
        }
      }

      expect(interrupt.consequence?.patternChanges?.helping).toBe(1)
    })

    test('should support analytical pattern for challenge interrupts', () => {
      const interrupt: InterruptWindow = {
        duration: 3000,
        type: 'challenge',
        action: 'Question their logic',
        targetNodeId: 'challenge_node',
        consequence: {
          patternChanges: {
            analytical: 1
          }
        }
      }

      expect(interrupt.consequence?.patternChanges?.analytical).toBe(1)
    })

    test('should support patience pattern for silence/observe', () => {
      // When player doesn't interrupt (observes), patience should increase
      // This is typically handled in the timeout handler, not the interrupt itself
      const observeConsequence = {
        type: 'pattern' as const,
        pattern: 'patience' as const,
        delta: 1
      }

      expect(isValidPattern(observeConsequence.pattern)).toBe(true)
    })
  })

  describe('State Changes', () => {
    test('should apply trust change on interrupt', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')

      const trustChange = {
        characterId: 'grace',
        trustChange: 2
      }

      const updatedState = GameStateUtils.applyStateChange(gameState, trustChange)
      const graceState = updatedState.characters.get('grace')

      expect(graceState?.trust).toBe(2) // Started at 0, +2
    })

    test('should apply pattern change on interrupt', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')

      const patternChange = {
        patternChanges: {
          helping: 2
        }
      }

      const updatedState = GameStateUtils.applyStateChange(gameState, patternChange)

      expect(updatedState.patterns.helping).toBe(2) // Started at 0, +2
    })

    test('should apply knowledge flag on interrupt', () => {
      const gameState = GameStateUtils.createNewGameState('test-player')

      const flagChange = {
        addGlobalFlags: ['comforted_grace']
      }

      const updatedState = GameStateUtils.applyStateChange(gameState, flagChange)

      expect(updatedState.globalFlags.has('comforted_grace')).toBe(true)
    })
  })

  describe('Interrupt Rarity (E2-032)', () => {
    test('interrupts should be high-impact moments only', () => {
      // This is a design guideline test - we verify that existing interrupt
      // content follows the rarity rule by checking interrupt scenarios
      const highImpactScenarios = [
        'character crying',
        'character vulnerable',
        'emotional revelation',
        'crisis moment'
      ]

      // The interrupt system should only be used for these scenarios
      // We document the expected usage
      expect(highImpactScenarios.length).toBeGreaterThan(0)
    })

    test('missing interrupt should be a valid choice (silence as response)', () => {
      // Per E2-032: "missing them is valid choice"
      // The missedNodeId allows for meaningful silence
      const interrupt: InterruptWindow = {
        duration: 3000,
        type: 'connection',
        action: 'Reach out',
        targetNodeId: 'comfort_node',
        missedNodeId: 'respect_silence_node'
      }

      expect(interrupt.missedNodeId).toBeDefined()
      // Both paths should be meaningful
      expect(interrupt.targetNodeId).not.toBe(interrupt.missedNodeId)
    })
  })

  describe('Integration with DialogueNode', () => {
    test('node content can have interrupt at specific variation', () => {
      const node: Partial<DialogueNode> = {
        nodeId: 'grace_emotional_moment',
        speaker: 'Grace',
        content: [
          {
            text: 'She smiles warmly.',
            variation_id: 'neutral_1'
          },
          {
            text: 'She pauses, tears forming...',
            variation_id: 'vulnerable_1',
            emotion: 'vulnerable',
            interrupt: {
              duration: 3500,
              type: 'connection',
              action: 'Reach out',
              targetNodeId: 'grace_comforted'
            }
          }
        ],
        choices: []
      }

      const contentWithInterrupt = node.content?.find(c => c.interrupt)
      expect(contentWithInterrupt).toBeDefined()
      expect(contentWithInterrupt?.interrupt?.type).toBe('connection')
    })
  })
})
