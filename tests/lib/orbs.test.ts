/**
 * Orb System Tests
 *
 * Verifies orb mechanics:
 * - Tier progression
 * - Streak bonuses
 * - Balance calculations
 */

import { describe, it, expect } from 'vitest'
import {
  getOrbTier,
  getStreakBonus,
  getDominantOrbType,
  getOrbDistribution,
  ORB_TIERS,
  INITIAL_ORB_BALANCE
} from '@/lib/orbs'

describe('Orb System', () => {
  describe('getOrbTier', () => {
    it('should return nascent for 0 orbs', () => {
      expect(getOrbTier(0)).toBe('nascent')
    })

    it('should return emerging at threshold', () => {
      expect(getOrbTier(10)).toBe('emerging')
      expect(getOrbTier(9)).toBe('nascent')
    })

    it('should return developing at threshold', () => {
      expect(getOrbTier(30)).toBe('developing')
      expect(getOrbTier(29)).toBe('emerging')
    })

    it('should return flourishing at threshold', () => {
      expect(getOrbTier(60)).toBe('flourishing')
      expect(getOrbTier(59)).toBe('developing')
    })

    it('should return mastered at threshold', () => {
      expect(getOrbTier(100)).toBe('mastered')
      expect(getOrbTier(99)).toBe('flourishing')
    })

    it('should handle values above max', () => {
      expect(getOrbTier(150)).toBe('mastered')
    })
  })

  describe('getStreakBonus', () => {
    it('should return 0 for streaks under 3', () => {
      expect(getStreakBonus(0)).toBe(0)
      expect(getStreakBonus(1)).toBe(0)
      expect(getStreakBonus(2)).toBe(0)
    })

    it('should return streak3 bonus for 3-4 streak', () => {
      expect(getStreakBonus(3)).toBeGreaterThan(0)
      expect(getStreakBonus(4)).toBe(getStreakBonus(3))
    })

    it('should return streak5 bonus for 5-9 streak', () => {
      const streak5Bonus = getStreakBonus(5)
      expect(streak5Bonus).toBeGreaterThan(getStreakBonus(3))
      expect(getStreakBonus(9)).toBe(streak5Bonus)
    })

    it('should return streak10 bonus for 10+ streak', () => {
      const streak10Bonus = getStreakBonus(10)
      expect(streak10Bonus).toBeGreaterThan(getStreakBonus(5))
      expect(getStreakBonus(15)).toBe(streak10Bonus)
    })
  })

  describe('getDominantOrbType', () => {
    it('should return null for empty balance', () => {
      expect(getDominantOrbType(INITIAL_ORB_BALANCE)).toBe(null)
    })

    it('should return the type with highest count', () => {
      const balance = {
        ...INITIAL_ORB_BALANCE,
        analytical: 5,
        patience: 3,
        exploring: 1
      }
      expect(getDominantOrbType(balance)).toBe('analytical')
    })

    it('should handle ties by returning first found', () => {
      const balance = {
        ...INITIAL_ORB_BALANCE,
        analytical: 5,
        helping: 5
      }
      const result = getDominantOrbType(balance)
      // Should be one of them
      expect(['analytical', 'helping']).toContain(result)
    })
  })

  describe('getOrbDistribution', () => {
    it('should return all zeros for empty balance', () => {
      const dist = getOrbDistribution(INITIAL_ORB_BALANCE)
      expect(dist.analytical).toBe(0)
      expect(dist.patience).toBe(0)
      expect(dist.exploring).toBe(0)
      expect(dist.helping).toBe(0)
      expect(dist.building).toBe(0)
    })

    it('should return percentages that sum to approximately 100', () => {
      const balance = {
        ...INITIAL_ORB_BALANCE,
        analytical: 10,
        patience: 20,
        exploring: 30,
        helping: 25,
        building: 15
      }
      const dist = getOrbDistribution(balance)
      const sum = dist.analytical + dist.patience + dist.exploring + dist.helping + dist.building
      // Allow for rounding errors
      expect(sum).toBeGreaterThanOrEqual(98)
      expect(sum).toBeLessThanOrEqual(102)
    })
  })

  describe('ORB_TIERS', () => {
    it('should have all tiers defined', () => {
      expect(ORB_TIERS.nascent).toBeDefined()
      expect(ORB_TIERS.emerging).toBeDefined()
      expect(ORB_TIERS.developing).toBeDefined()
      expect(ORB_TIERS.flourishing).toBeDefined()
      expect(ORB_TIERS.mastered).toBeDefined()
    })

    it('should have increasing minOrbs thresholds', () => {
      expect(ORB_TIERS.nascent.minOrbs).toBeLessThan(ORB_TIERS.emerging.minOrbs)
      expect(ORB_TIERS.emerging.minOrbs).toBeLessThan(ORB_TIERS.developing.minOrbs)
      expect(ORB_TIERS.developing.minOrbs).toBeLessThan(ORB_TIERS.flourishing.minOrbs)
      expect(ORB_TIERS.flourishing.minOrbs).toBeLessThan(ORB_TIERS.mastered.minOrbs)
    })
  })
})
