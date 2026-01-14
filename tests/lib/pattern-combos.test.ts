/**
 * Pattern Combos Tests
 * Tests for the Silent Career Connection System
 */

import { describe, it, expect } from 'vitest'
import {
  PATTERN_COMBOS,
  PatternCombo,
  meetsComboRequirements,
  getUnlockedCombos,
  getCharacterUnlockedCombos,
  getComboById,
  isComboUnlocked,
  getComboFlag,
  getComboProgress,
  getNearbyUnlocks
} from '@/lib/pattern-combos'
import { PlayerPatterns } from '@/lib/character-state'

// Helper to create pattern objects
function createPatterns(overrides: Partial<PlayerPatterns> = {}): PlayerPatterns {
  return {
    analytical: 0,
    patience: 0,
    exploring: 0,
    helping: 0,
    building: 0,
    ...overrides
  }
}

describe('Pattern Combos System', () => {
  describe('PATTERN_COMBOS constant', () => {
    it('should have at least 10 combos defined', () => {
      expect(PATTERN_COMBOS.length).toBeGreaterThanOrEqual(10)
    })

    it('should have unique IDs for all combos', () => {
      const ids = PATTERN_COMBOS.map(c => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have valid characterIds for all combos', () => {
      const validCharacters = [
        'maya', 'marcus', 'devon', 'tess', 'rohan', 'elena',
        'alex', 'grace', 'jordan', 'kai', 'silas', 'yaquin',
        'asha', 'lira', 'zara', 'samuel'
      ]
      PATTERN_COMBOS.forEach(combo => {
        expect(validCharacters).toContain(combo.characterId)
      })
    })

    it('should have non-empty requirements for all combos', () => {
      PATTERN_COMBOS.forEach(combo => {
        expect(Object.keys(combo.requirements).length).toBeGreaterThan(0)
      })
    })

    it('should have careerHint and careerDescription for all combos', () => {
      PATTERN_COMBOS.forEach(combo => {
        expect(combo.careerHint).toBeTruthy()
        expect(combo.careerDescription).toBeTruthy()
      })
    })
  })

  describe('meetsComboRequirements', () => {
    const testCombo: PatternCombo = {
      id: 'test_combo',
      requirements: { analytical: 5, building: 4 },
      careerHint: 'test career',
      careerDescription: 'test description',
      characterId: 'maya',
      primaryPattern: 'analytical'
    }

    it('should return true when all requirements are met', () => {
      const patterns = createPatterns({ analytical: 5, building: 4 })
      expect(meetsComboRequirements(patterns, testCombo)).toBe(true)
    })

    it('should return true when requirements are exceeded', () => {
      const patterns = createPatterns({ analytical: 8, building: 6 })
      expect(meetsComboRequirements(patterns, testCombo)).toBe(true)
    })

    it('should return false when one requirement is not met', () => {
      const patterns = createPatterns({ analytical: 5, building: 3 })
      expect(meetsComboRequirements(patterns, testCombo)).toBe(false)
    })

    it('should return false when all requirements are not met', () => {
      const patterns = createPatterns({ analytical: 2, building: 2 })
      expect(meetsComboRequirements(patterns, testCombo)).toBe(false)
    })

    it('should return false when patterns are at zero', () => {
      const patterns = createPatterns()
      expect(meetsComboRequirements(patterns, testCombo)).toBe(false)
    })

    it('should handle single-requirement combos', () => {
      const singleReqCombo: PatternCombo = {
        id: 'single',
        requirements: { helping: 6 },
        careerHint: 'helper',
        careerDescription: 'helping role',
        characterId: 'marcus',
        primaryPattern: 'helping'
      }
      expect(meetsComboRequirements(createPatterns({ helping: 6 }), singleReqCombo)).toBe(true)
      expect(meetsComboRequirements(createPatterns({ helping: 5 }), singleReqCombo)).toBe(false)
    })

    it('should handle three-requirement combos', () => {
      const threeReqCombo: PatternCombo = {
        id: 'triple',
        requirements: { analytical: 4, helping: 4, patience: 3 },
        careerHint: 'complex role',
        careerDescription: 'multi-skill role',
        characterId: 'kai',
        primaryPattern: 'analytical'
      }
      expect(meetsComboRequirements(
        createPatterns({ analytical: 4, helping: 4, patience: 3 }),
        threeReqCombo
      )).toBe(true)
      expect(meetsComboRequirements(
        createPatterns({ analytical: 4, helping: 4, patience: 2 }),
        threeReqCombo
      )).toBe(false)
    })
  })

  describe('getUnlockedCombos', () => {
    it('should return empty array when no combos are unlocked', () => {
      const patterns = createPatterns()
      expect(getUnlockedCombos(patterns)).toEqual([])
    })

    it('should return architect_vision when requirements met', () => {
      const patterns = createPatterns({ analytical: 5, building: 4 })
      const unlocked = getUnlockedCombos(patterns)
      expect(unlocked).toContain('architect_vision')
    })

    it('should return multiple combos when multiple requirements met', () => {
      const patterns = createPatterns({
        analytical: 6,
        building: 5,
        helping: 6,
        patience: 5,
        exploring: 5
      })
      const unlocked = getUnlockedCombos(patterns)
      expect(unlocked.length).toBeGreaterThan(1)
    })
  })

  describe('getCharacterUnlockedCombos', () => {
    it('should return only combos for specified character', () => {
      const patterns = createPatterns({
        analytical: 6,
        building: 5,
        helping: 6,
        patience: 5
      })
      const mayaCombos = getCharacterUnlockedCombos(patterns, 'maya')
      mayaCombos.forEach(combo => {
        expect(combo.characterId).toBe('maya')
      })
    })

    it('should return empty array when character has no unlocked combos', () => {
      const patterns = createPatterns({ exploring: 3 })
      const combos = getCharacterUnlockedCombos(patterns, 'maya')
      expect(combos).toEqual([])
    })
  })

  describe('getComboById', () => {
    it('should return combo when ID exists', () => {
      const combo = getComboById('architect_vision')
      expect(combo).toBeDefined()
      expect(combo?.id).toBe('architect_vision')
    })

    it('should return undefined when ID does not exist', () => {
      const combo = getComboById('nonexistent_combo')
      expect(combo).toBeUndefined()
    })
  })

  describe('isComboUnlocked', () => {
    it('should return true when combo is unlocked', () => {
      const patterns = createPatterns({ analytical: 5, building: 4 })
      expect(isComboUnlocked('architect_vision', patterns)).toBe(true)
    })

    it('should return false when combo is not unlocked', () => {
      const patterns = createPatterns({ analytical: 3, building: 2 })
      expect(isComboUnlocked('architect_vision', patterns)).toBe(false)
    })

    it('should return false for nonexistent combo', () => {
      const patterns = createPatterns({ analytical: 10, building: 10 })
      expect(isComboUnlocked('nonexistent', patterns)).toBe(false)
    })
  })

  describe('getComboFlag', () => {
    it('should return properly formatted flag name', () => {
      expect(getComboFlag('architect_vision')).toBe('combo_architect_vision_achieved')
    })

    it('should handle any combo ID', () => {
      expect(getComboFlag('healers_path')).toBe('combo_healers_path_achieved')
      expect(getComboFlag('test')).toBe('combo_test_achieved')
    })
  })

  describe('getComboProgress', () => {
    const testCombo: PatternCombo = {
      id: 'progress_test',
      requirements: { analytical: 5, building: 5 },
      careerHint: 'test',
      careerDescription: 'test',
      characterId: 'maya',
      primaryPattern: 'analytical'
    }

    it('should return 0 when no progress', () => {
      const patterns = createPatterns()
      expect(getComboProgress(patterns, testCombo)).toBe(0)
    })

    it('should return 100 when fully complete', () => {
      const patterns = createPatterns({ analytical: 5, building: 5 })
      expect(getComboProgress(patterns, testCombo)).toBe(100)
    })

    it('should return 50 when half complete', () => {
      const patterns = createPatterns({ analytical: 5, building: 0 })
      expect(getComboProgress(patterns, testCombo)).toBe(50)
    })

    it('should cap progress at requirement level', () => {
      // Even if analytical is 10, it should only count up to 5 for this combo
      const patterns = createPatterns({ analytical: 10, building: 0 })
      expect(getComboProgress(patterns, testCombo)).toBe(50)
    })

    it('should calculate partial progress correctly', () => {
      // 3/5 analytical + 2/5 building = 5/10 = 50%
      const patterns = createPatterns({ analytical: 3, building: 2 })
      expect(getComboProgress(patterns, testCombo)).toBe(50)
    })
  })

  describe('getNearbyUnlocks', () => {
    it('should return combos with 75-99% progress', () => {
      // architect_vision requires analytical: 5, building: 4
      // At analytical: 5, building: 3 we have 8/9 = 89%
      const patterns = createPatterns({ analytical: 5, building: 3 })
      const nearby = getNearbyUnlocks(patterns)
      expect(nearby.some(c => c.id === 'architect_vision')).toBe(true)
    })

    it('should not include already unlocked combos', () => {
      const patterns = createPatterns({ analytical: 5, building: 4 })
      const nearby = getNearbyUnlocks(patterns)
      expect(nearby.every(c => c.id !== 'architect_vision')).toBe(true)
    })

    it('should filter by character when provided', () => {
      const patterns = createPatterns({
        analytical: 4,
        building: 3,
        helping: 5,
        patience: 2
      })
      const mayaNearby = getNearbyUnlocks(patterns, 'maya')
      mayaNearby.forEach(combo => {
        expect(combo.characterId).toBe('maya')
      })
    })

    it('should return empty array when no combos are close', () => {
      const patterns = createPatterns({ analytical: 1 })
      const nearby = getNearbyUnlocks(patterns)
      expect(nearby).toEqual([])
    })
  })
})
