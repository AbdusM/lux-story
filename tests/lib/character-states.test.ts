/**
 * Character States Tests
 * Tests for the Trust-Based Demeanor System
 */

import { describe, it, expect } from 'vitest'
import {
  CHARACTER_STATES,
  STATE_THRESHOLDS,
  CHARACTER_STATE_MODIFIERS,
  CharacterState,
  getCharacterState,
  getGreetingPrefix,
  getToneShift,
  getAvailableTopics,
  getStateModifiers,
  hasReachedState,
  getTrustForState
} from '@/lib/character-states'

describe('Character States System', () => {
  describe('Constants', () => {
    it('should have 4 character states in correct order', () => {
      expect(CHARACTER_STATES).toEqual(['guarded', 'warming', 'open', 'vulnerable'])
    })

    it('should have threshold boundaries that don\'t overlap', () => {
      expect(STATE_THRESHOLDS.guarded.max).toBe(STATE_THRESHOLDS.warming.min)
      expect(STATE_THRESHOLDS.warming.max).toBe(STATE_THRESHOLDS.open.min)
      expect(STATE_THRESHOLDS.open.max).toBe(STATE_THRESHOLDS.vulnerable.min)
    })

    it('should have modifiers for main characters', () => {
      const expectedCharacters = ['maya', 'devon', 'marcus', 'samuel']
      expectedCharacters.forEach(charId => {
        expect(CHARACTER_STATE_MODIFIERS[charId as keyof typeof CHARACTER_STATE_MODIFIERS]).toBeDefined()
      })
    })

    it('should have all 4 states defined for each character with modifiers', () => {
      Object.entries(CHARACTER_STATE_MODIFIERS).forEach(([charId, modifiers]) => {
        CHARACTER_STATES.forEach(state => {
          expect(modifiers[state]).toBeDefined()
          expect(modifiers[state].greetingPrefix).toBeTruthy()
        })
      })
    })
  })

  describe('getCharacterState', () => {
    it('should return guarded for trust 0', () => {
      expect(getCharacterState(0)).toBe('guarded')
    })

    it('should return guarded for trust 1', () => {
      expect(getCharacterState(1)).toBe('guarded')
    })

    it('should return warming for trust 2', () => {
      expect(getCharacterState(2)).toBe('warming')
    })

    it('should return warming for trust 3', () => {
      expect(getCharacterState(3)).toBe('warming')
    })

    it('should return open for trust 4', () => {
      expect(getCharacterState(4)).toBe('open')
    })

    it('should return open for trust 5', () => {
      expect(getCharacterState(5)).toBe('open')
    })

    it('should return vulnerable for trust 6', () => {
      expect(getCharacterState(6)).toBe('vulnerable')
    })

    it('should return vulnerable for trust 10', () => {
      expect(getCharacterState(10)).toBe('vulnerable')
    })

    // Boundary tests
    it('should handle boundary at trust 2 (guarded → warming)', () => {
      expect(getCharacterState(1.9)).toBe('guarded')
      expect(getCharacterState(2)).toBe('warming')
    })

    it('should handle boundary at trust 4 (warming → open)', () => {
      expect(getCharacterState(3.9)).toBe('warming')
      expect(getCharacterState(4)).toBe('open')
    })

    it('should handle boundary at trust 6 (open → vulnerable)', () => {
      expect(getCharacterState(5.9)).toBe('open')
      expect(getCharacterState(6)).toBe('vulnerable')
    })
  })

  describe('getGreetingPrefix', () => {
    it('should return Maya\'s guarded prefix at trust 0', () => {
      const prefix = getGreetingPrefix('maya', 0)
      expect(prefix).toBe("Maya eyes you warily. ")
    })

    it('should return Maya\'s warming prefix at trust 2', () => {
      const prefix = getGreetingPrefix('maya', 2)
      expect(prefix).toBe("Maya nods in recognition. ")
    })

    it('should return Maya\'s open prefix at trust 4', () => {
      const prefix = getGreetingPrefix('maya', 4)
      expect(prefix).toBe("Maya's face lights up. ")
    })

    it('should return Maya\'s vulnerable prefix at trust 6', () => {
      const prefix = getGreetingPrefix('maya', 6)
      expect(prefix).toBe("Maya takes a breath, as if deciding something. ")
    })

    it('should return Devon\'s prefix at different states', () => {
      expect(getGreetingPrefix('devon', 0)).toContain("guarded")
      expect(getGreetingPrefix('devon', 4)).toContain("pleased")
    })

    it('should return default prefix for character without custom modifiers', () => {
      // Using a character ID that might not have modifiers
      // The function should return a default prefix
      const prefix = getGreetingPrefix('station_entry' as any, 4)
      expect(prefix).toBeTruthy()
    })
  })

  describe('getToneShift', () => {
    it('should return cautious for Maya at guarded state', () => {
      expect(getToneShift('maya', 0)).toBe('cautious')
    })

    it('should return warm for Maya at open state', () => {
      expect(getToneShift('maya', 4)).toBe('warm')
    })

    it('should return intimate for Maya at vulnerable state', () => {
      expect(getToneShift('maya', 6)).toBe('intimate')
    })

    it('should return undefined for character without modifiers', () => {
      expect(getToneShift('station_entry' as any, 4)).toBeUndefined()
    })
  })

  describe('getAvailableTopics', () => {
    it('should return empty array for guarded state', () => {
      expect(getAvailableTopics('maya', 0)).toEqual([])
    })

    it('should return topics for open state', () => {
      const topics = getAvailableTopics('maya', 4)
      expect(topics).toContain('family')
      expect(topics).toContain('dreams')
    })

    it('should return topics for vulnerable state', () => {
      const topics = getAvailableTopics('maya', 6)
      expect(topics).toContain('fears')
      expect(topics).toContain('hopes')
    })

    it('should return empty array for character without modifiers', () => {
      expect(getAvailableTopics('station_entry' as any, 6)).toEqual([])
    })
  })

  describe('getStateModifiers', () => {
    it('should return full modifiers for Maya at open state', () => {
      const modifiers = getStateModifiers('maya', 4)
      expect(modifiers).toBeDefined()
      expect(modifiers?.greetingPrefix).toBeTruthy()
      expect(modifiers?.toneShift).toBe('warm')
      expect(modifiers?.availableTopics).toContain('family')
    })

    it('should return undefined for character without modifiers', () => {
      expect(getStateModifiers('station_entry' as any, 4)).toBeUndefined()
    })
  })

  describe('hasReachedState', () => {
    it('should return true when at or above target state', () => {
      expect(hasReachedState(6, 'vulnerable')).toBe(true)
      expect(hasReachedState(6, 'open')).toBe(true)
      expect(hasReachedState(6, 'warming')).toBe(true)
      expect(hasReachedState(6, 'guarded')).toBe(true)
    })

    it('should return false when below target state', () => {
      expect(hasReachedState(0, 'warming')).toBe(false)
      expect(hasReachedState(2, 'open')).toBe(false)
      expect(hasReachedState(4, 'vulnerable')).toBe(false)
    })

    it('should return true for guarded at any trust level', () => {
      expect(hasReachedState(0, 'guarded')).toBe(true)
      expect(hasReachedState(10, 'guarded')).toBe(true)
    })
  })

  describe('getTrustForState', () => {
    it('should return 0 for guarded', () => {
      expect(getTrustForState('guarded')).toBe(0)
    })

    it('should return 2 for warming', () => {
      expect(getTrustForState('warming')).toBe(2)
    })

    it('should return 4 for open', () => {
      expect(getTrustForState('open')).toBe(4)
    })

    it('should return 6 for vulnerable', () => {
      expect(getTrustForState('vulnerable')).toBe(6)
    })
  })

  describe('Character Coverage', () => {
    const characters = [
      'maya', 'devon', 'marcus', 'tess', 'rohan', 'elena',
      'alex', 'grace', 'kai', 'silas', 'jordan', 'yaquin',
      'asha', 'lira', 'zara', 'samuel'
    ]

    it('should have modifiers defined for all 16 main characters', () => {
      characters.forEach(charId => {
        const modifiers = CHARACTER_STATE_MODIFIERS[charId as keyof typeof CHARACTER_STATE_MODIFIERS]
        expect(modifiers).toBeDefined()
      })
    })

    it('should have unique greeting prefixes for each character', () => {
      const allPrefixes = new Set<string>()
      characters.forEach(charId => {
        const modifiers = CHARACTER_STATE_MODIFIERS[charId as keyof typeof CHARACTER_STATE_MODIFIERS]
        if (modifiers) {
          CHARACTER_STATES.forEach(state => {
            allPrefixes.add(modifiers[state].greetingPrefix)
          })
        }
      })
      // With 16 characters × 4 states = 64 prefixes, they should all be unique
      expect(allPrefixes.size).toBe(64)
    })
  })
})
