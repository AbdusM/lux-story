import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { SeededRandom, randomPick, randomInt, random, randomShuffle } from '@/lib/seeded-random'

describe('SeededRandom', () => {
  afterEach(() => {
    SeededRandom.reset()
  })

  describe('seeded mode', () => {
    it('produces deterministic output when seeded', () => {
      SeededRandom.seed(12345)
      const first = SeededRandom.random()

      SeededRandom.seed(12345)
      const second = SeededRandom.random()

      expect(first).toBe(second)
    })

    it('produces different output with different seeds', () => {
      SeededRandom.seed(12345)
      const first = SeededRandom.random()

      SeededRandom.seed(54321)
      const second = SeededRandom.random()

      expect(first).not.toBe(second)
    })

    it('produces different values on subsequent calls', () => {
      SeededRandom.seed(12345)
      const values = [
        SeededRandom.random(),
        SeededRandom.random(),
        SeededRandom.random()
      ]

      // All should be different
      expect(new Set(values).size).toBe(3)
    })

    it('tracks call count', () => {
      SeededRandom.seed(12345)
      expect(SeededRandom.getCallCount()).toBe(0)

      SeededRandom.random()
      expect(SeededRandom.getCallCount()).toBe(1)

      SeededRandom.random()
      SeededRandom.random()
      expect(SeededRandom.getCallCount()).toBe(3)
    })

    it('reports seeded state correctly', () => {
      expect(SeededRandom.isSeeded()).toBe(false)
      SeededRandom.seed(12345)
      expect(SeededRandom.isSeeded()).toBe(true)
      SeededRandom.reset()
      expect(SeededRandom.isSeeded()).toBe(false)
    })
  })

  describe('randomInt', () => {
    it('produces integers in range', () => {
      SeededRandom.seed(12345)
      for (let i = 0; i < 100; i++) {
        const value = SeededRandom.randomInt(1, 6)
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(6)
        expect(Number.isInteger(value)).toBe(true)
      }
    })

    it('is deterministic when seeded', () => {
      SeededRandom.seed(12345)
      const first = [1, 2, 3, 4, 5].map(() => SeededRandom.randomInt(1, 100))

      SeededRandom.seed(12345)
      const second = [1, 2, 3, 4, 5].map(() => SeededRandom.randomInt(1, 100))

      expect(first).toEqual(second)
    })
  })

  describe('pick', () => {
    it('picks from array deterministically when seeded', () => {
      const array = ['a', 'b', 'c', 'd', 'e']

      SeededRandom.seed(12345)
      const first = SeededRandom.pick(array)

      SeededRandom.seed(12345)
      const second = SeededRandom.pick(array)

      expect(first).toBe(second)
    })

    it('returns undefined for empty array', () => {
      SeededRandom.seed(12345)
      expect(SeededRandom.pick([])).toBeUndefined()
    })
  })

  describe('shuffle', () => {
    it('shuffles deterministically when seeded', () => {
      SeededRandom.seed(12345)
      const first = SeededRandom.shuffle([1, 2, 3, 4, 5])

      SeededRandom.seed(12345)
      const second = SeededRandom.shuffle([1, 2, 3, 4, 5])

      expect(first).toEqual(second)
    })

    it('contains all original elements', () => {
      SeededRandom.seed(12345)
      const original = [1, 2, 3, 4, 5]
      const shuffled = SeededRandom.shuffle([...original])

      expect(shuffled.sort()).toEqual(original.sort())
    })
  })

  describe('convenience functions', () => {
    beforeEach(() => {
      SeededRandom.seed(12345)
    })

    it('random() uses SeededRandom', () => {
      const r = random()
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThan(1)
    })

    it('randomInt() uses SeededRandom', () => {
      const r = randomInt(1, 10)
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(10)
    })

    it('randomPick() uses SeededRandom', () => {
      const r = randomPick(['a', 'b', 'c'])
      expect(['a', 'b', 'c']).toContain(r)
    })

    it('randomShuffle() uses SeededRandom', () => {
      const r = randomShuffle([1, 2, 3])
      expect(r.sort()).toEqual([1, 2, 3])
    })
  })

  describe('production mode (unseeded)', () => {
    it('uses Math.random when not seeded', () => {
      // Just verify it doesn't throw and returns valid values
      const value = SeededRandom.random()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    })
  })
})
