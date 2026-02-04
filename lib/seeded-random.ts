/**
 * Seeded Random Number Generator
 * TD-007: Provides deterministic randomness for testing
 *
 * Uses a simple mulberry32 algorithm for fast, deterministic random numbers.
 * In production, falls back to Math.random() unless explicitly seeded.
 *
 * Usage:
 * - Tests: SeededRandom.seed(12345) then SeededRandom.random()
 * - Production: SeededRandom.random() uses Math.random()
 *
 * Key insight: This doesn't replace all Math.random() calls automatically.
 * Instead, critical game logic functions should use this for testability.
 */

type RandomFunction = () => number

// Mulberry32: A fast, high-quality 32-bit PRNG
function mulberry32(seed: number): RandomFunction {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

class SeededRandomGenerator {
  private _seed: number | null = null
  private _generator: RandomFunction | null = null
  private _callCount = 0

  /**
   * Seed the random number generator for deterministic output.
   * Call this at the start of tests.
   *
   * @param seed - The seed value (any integer)
   */
  seed(seed: number): void {
    this._seed = seed
    this._generator = mulberry32(seed)
    this._callCount = 0
  }

  /**
   * Reset to using Math.random() (production mode)
   */
  reset(): void {
    this._seed = null
    this._generator = null
    this._callCount = 0
  }

  /**
   * Get a random number between 0 (inclusive) and 1 (exclusive).
   * Uses seeded generator if seeded, otherwise Math.random()
   */
  random(): number {
    if (this._generator) {
      this._callCount++
      return this._generator()
    }
    return Math.random()
  }

  /**
   * Get a random integer between min (inclusive) and max (inclusive).
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min
  }

  /**
   * Pick a random element from an array.
   */
  pick<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined
    return array[Math.floor(this.random() * array.length)]
  }

  /**
   * Shuffle an array in place using Fisher-Yates algorithm.
   */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  /**
   * Check if we're in seeded mode
   */
  isSeeded(): boolean {
    return this._seed !== null
  }

  /**
   * Get the current seed (for debugging)
   */
  getSeed(): number | null {
    return this._seed
  }

  /**
   * Get how many random calls have been made since seeding
   */
  getCallCount(): number {
    return this._callCount
  }
}

// Singleton instance
export const SeededRandom = new SeededRandomGenerator()

/**
 * Convenience function to pick a random element from an array.
 * Uses SeededRandom internally for testability.
 *
 * @example
 * const choice = randomPick(['a', 'b', 'c'])
 */
export function randomPick<T>(array: T[]): T | undefined {
  return SeededRandom.pick(array)
}

/**
 * Convenience function to get a random integer in range.
 * Uses SeededRandom internally for testability.
 *
 * @example
 * const dice = randomInt(1, 6)
 */
export function randomInt(min: number, max: number): number {
  return SeededRandom.randomInt(min, max)
}

/**
 * Convenience function to get a random float [0, 1).
 * Uses SeededRandom internally for testability.
 *
 * @example
 * if (random() < 0.3) { // 30% chance }
 */
export function random(): number {
  return SeededRandom.random()
}

/**
 * Convenience function to shuffle an array.
 * Uses SeededRandom internally for testability.
 * NOTE: Modifies the array in place and returns it.
 *
 * @example
 * const shuffled = randomShuffle([1, 2, 3, 4, 5])
 */
export function randomShuffle<T>(array: T[]): T[] {
  return SeededRandom.shuffle(array)
}
