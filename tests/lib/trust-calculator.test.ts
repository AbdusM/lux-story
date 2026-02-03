/**
 * Trust Calculator Tests
 *
 * Phase 3D: Validates the consolidated trust calculation system.
 */

import { describe, test, expect } from 'vitest'
import {
  calculateTrustChange,
  clampTrust,
  isMaxTrust,
  isMinTrust,
  isValidTrust,
  TRUST_BOUNDS
} from '@/lib/trust/trust-calculator'
import { createTrustMomentum } from '@/lib/trust-derivatives'

describe('Trust Calculator (Phase 3D)', () => {
  const defaultPatterns = {
    analytical: 5,
    patience: 3,
    exploring: 4,
    helping: 6,
    building: 2
  }

  describe('calculateTrustChange', () => {
    test('applies basic trust change', () => {
      const result = calculateTrustChange(5, 2, {
        characterId: 'maya',
        patterns: defaultPatterns,
        skipResonance: true,
        skipMomentum: true
      })

      expect(result.newTrust).toBe(7)
      expect(result.actualDelta).toBe(2)
      expect(result.breakdown.base).toBe(2)
    })

    test('clamps trust at maximum', () => {
      const result = calculateTrustChange(9, 5, {
        characterId: 'maya',
        patterns: defaultPatterns,
        skipResonance: true,
        skipMomentum: true
      })

      expect(result.newTrust).toBe(10)
      expect(result.actualDelta).toBe(1)
      expect(result.breakdown.clamped).toBe(4) // 14 - 10 = 4 clamped
    })

    test('clamps trust at minimum', () => {
      const result = calculateTrustChange(2, -5, {
        characterId: 'maya',
        patterns: defaultPatterns,
        skipResonance: true,
        skipMomentum: true
      })

      expect(result.newTrust).toBe(0)
      expect(result.actualDelta).toBe(-2)
      expect(result.breakdown.clamped).toBe(-3) // -3 - 0 = -3 clamped
    })

    test('applies resonance when not skipped', () => {
      const result = calculateTrustChange(5, 2, {
        characterId: 'maya',
        patterns: defaultPatterns,
        choicePattern: 'analytical',
        skipMomentum: true
        // skipResonance: false (default)
      })

      // Resonance should modify the trust change
      expect(result.breakdown.base).toBe(2)
      // Resonance may add or subtract based on pattern affinity
      expect(result.breakdown.resonance).toBeDefined()
    })

    test('applies momentum when not skipped', () => {
      const momentum = createTrustMomentum('maya')
      // Simulate some positive history
      momentum.recentChanges = [1, 1, 1, 1, 1]
      momentum.consecutivePositive = 5

      const result = calculateTrustChange(5, 2, {
        characterId: 'maya',
        patterns: defaultPatterns,
        momentum,
        skipResonance: true
        // skipMomentum: false (default)
      })

      // Momentum should affect the trust change
      expect(result.breakdown.momentumEffect).toBeDefined()
      expect(result.updatedMomentum).toBeDefined()
    })

    test('returns updated momentum state', () => {
      const result = calculateTrustChange(5, 2, {
        characterId: 'maya',
        patterns: defaultPatterns,
        skipResonance: true
      })

      expect(result.updatedMomentum).toBeDefined()
      expect(result.updatedMomentum.characterId).toBe('maya')
    })

    test('provides full breakdown', () => {
      const result = calculateTrustChange(5, 2, {
        characterId: 'maya',
        patterns: defaultPatterns
      })

      expect(result.breakdown).toHaveProperty('base')
      expect(result.breakdown).toHaveProperty('resonance')
      expect(result.breakdown).toHaveProperty('afterResonance')
      expect(result.breakdown).toHaveProperty('momentumEffect')
      expect(result.breakdown).toHaveProperty('afterMomentum')
      expect(result.breakdown).toHaveProperty('clamped')
    })

    test('handles zero trust change', () => {
      const result = calculateTrustChange(5, 0, {
        characterId: 'maya',
        patterns: defaultPatterns
      })

      expect(result.newTrust).toBe(5)
      expect(result.actualDelta).toBe(0)
    })

    test('handles negative trust change', () => {
      const result = calculateTrustChange(5, -2, {
        characterId: 'maya',
        patterns: defaultPatterns,
        skipResonance: true,
        skipMomentum: true
      })

      expect(result.newTrust).toBe(3)
      expect(result.actualDelta).toBe(-2)
    })
  })

  describe('clampTrust', () => {
    test('clamps values above maximum', () => {
      expect(clampTrust(15)).toBe(10)
      expect(clampTrust(100)).toBe(10)
    })

    test('clamps values below minimum', () => {
      expect(clampTrust(-5)).toBe(0)
      expect(clampTrust(-100)).toBe(0)
    })

    test('preserves values within range', () => {
      expect(clampTrust(5)).toBe(5)
      expect(clampTrust(0)).toBe(0)
      expect(clampTrust(10)).toBe(10)
    })
  })

  describe('isMaxTrust', () => {
    test('returns true at maximum', () => {
      expect(isMaxTrust(10)).toBe(true)
    })

    test('returns true above maximum', () => {
      expect(isMaxTrust(15)).toBe(true)
    })

    test('returns false below maximum', () => {
      expect(isMaxTrust(9)).toBe(false)
      expect(isMaxTrust(0)).toBe(false)
    })
  })

  describe('isMinTrust', () => {
    test('returns true at minimum', () => {
      expect(isMinTrust(0)).toBe(true)
    })

    test('returns true below minimum', () => {
      expect(isMinTrust(-5)).toBe(true)
    })

    test('returns false above minimum', () => {
      expect(isMinTrust(1)).toBe(false)
      expect(isMinTrust(10)).toBe(false)
    })
  })

  describe('isValidTrust', () => {
    test('validates numbers in range', () => {
      expect(isValidTrust(0)).toBe(true)
      expect(isValidTrust(5)).toBe(true)
      expect(isValidTrust(10)).toBe(true)
    })

    test('rejects numbers out of range', () => {
      expect(isValidTrust(-1)).toBe(false)
      expect(isValidTrust(11)).toBe(false)
    })

    test('rejects non-numbers', () => {
      expect(isValidTrust(NaN)).toBe(false)
      expect(isValidTrust(Infinity)).toBe(false)
      expect(isValidTrust(-Infinity)).toBe(false)
    })
  })

  describe('TRUST_BOUNDS', () => {
    test('exports correct bounds', () => {
      expect(TRUST_BOUNDS.MIN).toBe(0)
      expect(TRUST_BOUNDS.MAX).toBe(10)
    })
  })
})
