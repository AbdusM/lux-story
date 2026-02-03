/**
 * Serialization Safety Tests
 *
 * Phase 3C: Validates that corrupted localStorage is handled gracefully.
 * The game should recover without crashing when encountering invalid data.
 */

import { describe, test, expect } from 'vitest'
import {
  SerializedGameStateSchema,
  safeParseGameState,
  isValidGameState
} from '@/lib/schemas/game-state-schema'
import { StateValidation } from '@/lib/character-state'

describe('Serialization Safety (Phase 3C)', () => {
  describe('Zod Schema Validation', () => {
    test('accepts valid minimal game state', () => {
      const minimalValid = {
        playerId: 'player_123',
        saveVersion: '1.0.0',
        characters: [],
        globalFlags: [],
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
        lastSaved: Date.now(),
        currentNodeId: 'station_entrance',
        currentCharacterId: 'samuel'
      }

      const result = SerializedGameStateSchema.safeParse(minimalValid)
      expect(result.success).toBe(true)
    })

    test('provides defaults for missing optional fields', () => {
      const partialState = {
        playerId: 'player_123',
        currentNodeId: 'station_entrance'
      }

      const result = SerializedGameStateSchema.safeParse(partialState)
      expect(result.success).toBe(true)

      if (result.success) {
        // Verify defaults are applied
        expect(result.data.saveVersion).toBe('1.0.0')
        expect(result.data.characters).toEqual([])
        expect(result.data.globalFlags).toEqual([])
        expect(result.data.patterns).toEqual({
          analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0
        })
        expect(result.data.currentCharacterId).toBe('samuel')
        expect(result.data.episodeNumber).toBe(1)
      }
    })

    test('rejects completely invalid data', () => {
      const invalid = {
        foo: 'bar',
        baz: 123
      }

      const result = SerializedGameStateSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    test('rejects null input', () => {
      expect(isValidGameState(null)).toBe(false)
    })

    test('rejects undefined input', () => {
      expect(isValidGameState(undefined)).toBe(false)
    })

    test('rejects non-object input', () => {
      expect(isValidGameState('string')).toBe(false)
      expect(isValidGameState(123)).toBe(false)
      expect(isValidGameState([])).toBe(false)
    })
  })

  describe('Corrupted JSON Recovery', () => {
    test('safeParseGameState returns null for corrupted data', () => {
      const corrupted = {
        playerId: 123, // Wrong type
        patterns: 'not an object',
        currentCharacterId: 'invalid_character'
      }

      const result = safeParseGameState(corrupted)
      expect(result).toBeNull()
    })

    test('safeParseGameState handles truncated JSON', () => {
      // Simulate truncated data (e.g., localStorage quota exceeded mid-write)
      const truncated = {
        playerId: 'player_123',
        characters: [
          { characterId: 'maya' } // Missing required fields
        ]
      }

      const result = safeParseGameState(truncated)
      // Should still work with defaults
      expect(result).not.toBeNull()
    })

    test('safeParseGameState handles invalid character ID', () => {
      const invalidCharacter = {
        playerId: 'player_123',
        currentCharacterId: 'nonexistent_character'
      }

      // Invalid character ID should fail validation
      const result = SerializedGameStateSchema.safeParse(invalidCharacter)
      expect(result.success).toBe(false)
    })

    test('safeParseGameState handles NaN in patterns', () => {
      const nanPatterns = {
        playerId: 'player_123',
        patterns: {
          analytical: NaN,
          patience: 0,
          exploring: 0,
          helping: 0,
          building: 0
        }
      }

      // NaN should fail Zod number validation
      const result = SerializedGameStateSchema.safeParse(nanPatterns)
      expect(result.success).toBe(false)
    })

    test('safeParseGameState handles Infinity in patterns', () => {
      const infinityPatterns = {
        playerId: 'player_123',
        patterns: {
          analytical: Infinity,
          patience: 0,
          exploring: 0,
          helping: 0,
          building: 0
        }
      }

      // Infinity should fail Zod number validation
      const result = SerializedGameStateSchema.safeParse(infinityPatterns)
      expect(result.success).toBe(false)
    })
  })

  describe('StateValidation Integration', () => {
    test('isValidSerializableGameState accepts valid data', () => {
      const valid = {
        playerId: 'player_123',
        saveVersion: '1.0.0',
        characters: [],
        globalFlags: [],
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
        lastSaved: Date.now(),
        currentNodeId: 'station_entrance',
        currentCharacterId: 'samuel'
      }

      expect(StateValidation.isValidSerializableGameState(valid)).toBe(true)
    })

    test('isValidSerializableGameState rejects missing playerId', () => {
      const missingPlayerId = {
        saveVersion: '1.0.0',
        characters: [],
        globalFlags: [],
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
        lastSaved: Date.now(),
        currentNodeId: 'station_entrance',
        currentCharacterId: 'samuel'
      }

      expect(StateValidation.isValidSerializableGameState(missingPlayerId)).toBe(false)
    })

    test('isValidSerializableGameState handles null gracefully', () => {
      expect(StateValidation.isValidSerializableGameState(null)).toBe(false)
    })

    test('parseSerializableGameState returns validated data with defaults', () => {
      const partial = {
        playerId: 'player_123',
        currentNodeId: 'station_entrance'
      }

      const result = StateValidation.parseSerializableGameState(partial)
      expect(result).not.toBeNull()
      expect(result?.saveVersion).toBe('1.0.0')
      expect(result?.patterns.analytical).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    test('handles deeply nested corrupted data', () => {
      const deepCorruption = {
        playerId: 'player_123',
        archivistState: {
          collectedRecords: [123, 456], // Should be strings
          verifiedLore: 'not an array',
          sensoryCalibration: []  // Should be object
        }
      }

      const result = SerializedGameStateSchema.safeParse(deepCorruption)
      expect(result.success).toBe(false)
    })

    test('handles empty string playerId', () => {
      const emptyPlayerId = {
        playerId: '',
        currentNodeId: 'station_entrance'
      }

      // Empty string is technically valid for Zod string schema
      const result = SerializedGameStateSchema.safeParse(emptyPlayerId)
      expect(result.success).toBe(true)
    })

    test('handles very long arrays without crashing', () => {
      const longArrays = {
        playerId: 'player_123',
        characters: Array(100).fill({
          characterId: 'maya',
          trust: 0,
          anxiety: 0,
          nervousSystemState: 'ventral_vagal',
          lastReaction: null,
          knowledgeFlags: [],
          relationshipStatus: 'stranger',
          conversationHistory: []
        }),
        globalFlags: Array(1000).fill('flag')
      }

      // Should parse without crashing (performance test)
      const start = performance.now()
      const result = SerializedGameStateSchema.safeParse(longArrays)
      const duration = performance.now() - start

      expect(result.success).toBe(true)
      expect(duration).toBeLessThan(1000) // Should complete in under 1 second
    })
  })
})
