/**
 * TD-007: Seeded Random Determinism Tests
 *
 * Validates that gameplay-affecting random calls produce
 * deterministic results when seeded.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { SeededRandom, random, randomPick, randomInt, randomShuffle } from '@/lib/seeded-random'

describe('SeededRandom Determinism', () => {
  afterEach(() => {
    SeededRandom.reset()
  })

  describe('Core Functions', () => {
    it('random() produces same sequence with same seed', () => {
      SeededRandom.seed(12345)
      const sequence1 = [random(), random(), random(), random(), random()]

      SeededRandom.seed(12345)
      const sequence2 = [random(), random(), random(), random(), random()]

      expect(sequence1).toEqual(sequence2)
    })

    it('random() produces different sequence with different seed', () => {
      SeededRandom.seed(12345)
      const sequence1 = [random(), random(), random()]

      SeededRandom.seed(99999)
      const sequence2 = [random(), random(), random()]

      expect(sequence1).not.toEqual(sequence2)
    })

    it('randomPick() is deterministic with same seed', () => {
      const items = ['a', 'b', 'c', 'd', 'e']

      SeededRandom.seed(12345)
      const picks1 = [
        randomPick(items),
        randomPick(items),
        randomPick(items),
      ]

      SeededRandom.seed(12345)
      const picks2 = [
        randomPick(items),
        randomPick(items),
        randomPick(items),
      ]

      expect(picks1).toEqual(picks2)
    })

    it('randomInt() is deterministic with same seed', () => {
      SeededRandom.seed(12345)
      const ints1 = [
        randomInt(1, 100),
        randomInt(1, 100),
        randomInt(1, 100),
      ]

      SeededRandom.seed(12345)
      const ints2 = [
        randomInt(1, 100),
        randomInt(1, 100),
        randomInt(1, 100),
      ]

      expect(ints1).toEqual(ints2)
    })

    it('randomShuffle() is deterministic with same seed', () => {
      SeededRandom.seed(12345)
      const arr1 = [1, 2, 3, 4, 5]
      randomShuffle(arr1)

      SeededRandom.seed(12345)
      const arr2 = [1, 2, 3, 4, 5]
      randomShuffle(arr2)

      expect(arr1).toEqual(arr2)
    })
  })

  describe('Production Mode (Unseeded)', () => {
    it('uses Math.random() when not seeded', () => {
      SeededRandom.reset()
      expect(SeededRandom.isSeeded()).toBe(false)

      // Should produce different sequences (highly likely)
      const vals1 = [random(), random(), random()]
      const vals2 = [random(), random(), random()]

      // With Math.random(), sequences should differ
      // (There's a very small chance they could match, but negligible)
      expect(vals1).not.toEqual(vals2)
    })
  })

  describe('Call Counting', () => {
    it('tracks call count correctly', () => {
      SeededRandom.seed(12345)
      expect(SeededRandom.getCallCount()).toBe(0)

      random()
      expect(SeededRandom.getCallCount()).toBe(1)

      random()
      random()
      expect(SeededRandom.getCallCount()).toBe(3)
    })

    it('resets call count on new seed', () => {
      SeededRandom.seed(12345)
      random()
      random()
      expect(SeededRandom.getCallCount()).toBe(2)

      SeededRandom.seed(99999)
      expect(SeededRandom.getCallCount()).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    it('randomPick returns undefined for empty array', () => {
      SeededRandom.seed(12345)
      expect(randomPick([])).toBeUndefined()
    })

    it('randomPick handles single element array', () => {
      SeededRandom.seed(12345)
      expect(randomPick(['only'])).toBe('only')
    })

    it('randomInt handles same min and max', () => {
      SeededRandom.seed(12345)
      expect(randomInt(5, 5)).toBe(5)
    })
  })
})
