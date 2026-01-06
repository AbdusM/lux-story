/**
 * Orb Resonance System Tests
 * Tests for the orb tier tracking and dialogue unlocking system
 */

import { describe, it, expect } from 'vitest'
import {
  calculateTotalOrbs,
  getDominantPattern,
  calculateOrbResonance,
  getOrbTierFlags,
  hasReachedOrbTier,
  getOrbTierDialoguePrompt,
  getOrbTierProgress,
  ORB_TIER_FLAGS,
  ORB_DIALOGUE_UNLOCKS
} from '@/lib/orb-resonance'
import { PlayerPatterns } from '@/lib/character-state'

describe('Orb Resonance System', () => {
  describe('calculateTotalOrbs', () => {
    it('should sum all pattern scores', () => {
      const patterns: PlayerPatterns = {
        analytical: 5,
        patience: 3,
        exploring: 7,
        helping: 2,
        building: 8
      }
      expect(calculateTotalOrbs(patterns)).toBe(25)
    })

    it('should return 0 for empty patterns', () => {
      const patterns: PlayerPatterns = {
        analytical: 0,
        patience: 0,
        exploring: 0,
        helping: 0,
        building: 0
      }
      expect(calculateTotalOrbs(patterns)).toBe(0)
    })
  })

  describe('getDominantPattern', () => {
    it('should return the highest scoring pattern', () => {
      const patterns: PlayerPatterns = {
        analytical: 5,
        patience: 3,
        exploring: 7,
        helping: 2,
        building: 8
      }
      expect(getDominantPattern(patterns)).toBe('building')
    })

    it('should return null if all patterns are 0', () => {
      const patterns: PlayerPatterns = {
        analytical: 0,
        patience: 0,
        exploring: 0,
        helping: 0,
        building: 0
      }
      expect(getDominantPattern(patterns)).toBeNull()
    })

    it('should return first highest in case of tie', () => {
      const patterns: PlayerPatterns = {
        analytical: 5,
        patience: 5,
        exploring: 5,
        helping: 5,
        building: 5
      }
      // First in iteration order wins
      expect(getDominantPattern(patterns)).toBe('analytical')
    })
  })

  describe('calculateOrbResonance', () => {
    it('should detect nascent tier with no orbs', () => {
      const patterns: PlayerPatterns = {
        analytical: 0,
        patience: 0,
        exploring: 0,
        helping: 0,
        building: 0
      }
      const result = calculateOrbResonance(patterns, new Set())

      expect(result.totalOrbs).toBe(0)
      expect(result.currentTier).toBe('nascent')
      expect(result.tierJustUnlocked).toBeNull()
    })

    it('should detect emerging tier at 10+ orbs', () => {
      const patterns: PlayerPatterns = {
        analytical: 5,
        patience: 3,
        exploring: 2,
        helping: 0,
        building: 0
      }
      const result = calculateOrbResonance(patterns, new Set())

      expect(result.totalOrbs).toBe(10)
      expect(result.currentTier).toBe('emerging')
      expect(result.tierJustUnlocked).toBe('emerging')
    })

    it('should detect developing tier at 30+ orbs', () => {
      const patterns: PlayerPatterns = {
        analytical: 10,
        patience: 8,
        exploring: 7,
        helping: 3,
        building: 2
      }
      const result = calculateOrbResonance(patterns, new Set([ORB_TIER_FLAGS.emerging]))

      expect(result.totalOrbs).toBe(30)
      expect(result.currentTier).toBe('developing')
      expect(result.tierJustUnlocked).toBe('developing')
    })

    it('should detect flourishing tier at 60+ orbs', () => {
      const patterns: PlayerPatterns = {
        analytical: 20,
        patience: 15,
        exploring: 10,
        helping: 10,
        building: 5
      }
      const result = calculateOrbResonance(
        patterns,
        new Set([ORB_TIER_FLAGS.emerging, ORB_TIER_FLAGS.developing])
      )

      expect(result.totalOrbs).toBe(60)
      expect(result.currentTier).toBe('flourishing')
      expect(result.tierJustUnlocked).toBe('flourishing')
    })

    it('should detect mastered tier at 100+ orbs', () => {
      const patterns: PlayerPatterns = {
        analytical: 30,
        patience: 25,
        exploring: 20,
        helping: 15,
        building: 10
      }
      const result = calculateOrbResonance(
        patterns,
        new Set([ORB_TIER_FLAGS.emerging, ORB_TIER_FLAGS.developing, ORB_TIER_FLAGS.flourishing])
      )

      expect(result.totalOrbs).toBe(100)
      expect(result.currentTier).toBe('mastered')
      expect(result.tierJustUnlocked).toBe('mastered')
    })

    it('should not trigger tierJustUnlocked if already at that tier', () => {
      const patterns: PlayerPatterns = {
        analytical: 5,
        patience: 3,
        exploring: 2,
        helping: 0,
        building: 0
      }
      // Already has emerging flag
      const result = calculateOrbResonance(patterns, new Set([ORB_TIER_FLAGS.emerging]))

      expect(result.currentTier).toBe('emerging')
      expect(result.tierJustUnlocked).toBeNull()
    })
  })

  describe('getOrbTierFlags', () => {
    it('should return empty array for nascent', () => {
      expect(getOrbTierFlags('nascent')).toEqual([])
    })

    it('should return emerging flag for emerging tier', () => {
      expect(getOrbTierFlags('emerging')).toEqual([ORB_TIER_FLAGS.emerging])
    })

    it('should return cumulative flags for developing tier', () => {
      const flags = getOrbTierFlags('developing')
      expect(flags).toContain(ORB_TIER_FLAGS.emerging)
      expect(flags).toContain(ORB_TIER_FLAGS.developing)
      expect(flags.length).toBe(2)
    })

    it('should return all flags for mastered tier', () => {
      const flags = getOrbTierFlags('mastered')
      expect(flags).toContain(ORB_TIER_FLAGS.emerging)
      expect(flags).toContain(ORB_TIER_FLAGS.developing)
      expect(flags).toContain(ORB_TIER_FLAGS.flourishing)
      expect(flags).toContain(ORB_TIER_FLAGS.mastered)
      expect(flags.length).toBe(4)
    })
  })

  describe('hasReachedOrbTier', () => {
    it('should always return true for nascent', () => {
      expect(hasReachedOrbTier('nascent', new Set())).toBe(true)
    })

    it('should check for correct flag', () => {
      const flags = new Set([ORB_TIER_FLAGS.emerging])

      expect(hasReachedOrbTier('emerging', flags)).toBe(true)
      expect(hasReachedOrbTier('developing', flags)).toBe(false)
    })
  })

  describe('getOrbTierDialoguePrompt', () => {
    it('should return empty string for nascent', () => {
      expect(getOrbTierDialoguePrompt('nascent')).toBe('')
    })

    it('should return appropriate prompts for each tier', () => {
      expect(getOrbTierDialoguePrompt('emerging')).toContain('stirs')
      expect(getOrbTierDialoguePrompt('developing')).toContain('recognizes')
      expect(getOrbTierDialoguePrompt('flourishing')).toContain('respond')
      expect(getOrbTierDialoguePrompt('mastered')).toContain('know who you are')
    })
  })

  describe('getOrbTierProgress', () => {
    it('should calculate progress within tier', () => {
      const result = getOrbTierProgress(15) // Between emerging (10) and developing (30)

      expect(result.currentTier).toBe('emerging')
      expect(result.nextTier).toBe('developing')
      expect(result.orbsToNext).toBe(15) // 30 - 15
      expect(result.progress).toBe(25) // (15-10) / (30-10) = 5/20 = 25%
    })

    it('should return 100% progress at mastered', () => {
      const result = getOrbTierProgress(150)

      expect(result.currentTier).toBe('mastered')
      expect(result.nextTier).toBeNull()
      expect(result.orbsToNext).toBe(0)
      expect(result.progress).toBe(100)
    })

    it('should handle 0 orbs', () => {
      const result = getOrbTierProgress(0)

      expect(result.currentTier).toBe('nascent')
      expect(result.nextTier).toBe('emerging')
      expect(result.orbsToNext).toBe(10)
      expect(result.progress).toBe(0)
    })
  })

  describe('ORB_DIALOGUE_UNLOCKS', () => {
    it('should have null for nascent tier', () => {
      expect(ORB_DIALOGUE_UNLOCKS.nascent).toBeNull()
    })

    it('should have dialogue nodes for other tiers', () => {
      expect(ORB_DIALOGUE_UNLOCKS.emerging).toBe('samuel_orb_emerging')
      expect(ORB_DIALOGUE_UNLOCKS.developing).toBe('samuel_orb_developing')
      expect(ORB_DIALOGUE_UNLOCKS.flourishing).toBe('samuel_orb_flourishing')
      expect(ORB_DIALOGUE_UNLOCKS.mastered).toBe('samuel_orb_mastered')
    })
  })
})
