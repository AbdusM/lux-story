/**
 * Pattern Mastery Display Tests
 *
 * Tests for the display layer that maps OrbTier values to
 * station-themed presentation names and Samuel's messages.
 */

import { describe, it, expect } from 'vitest'
import {
  PATTERN_MASTERY_DISPLAY,
  SAMUEL_PROMOTION_MESSAGES,
  SAMUEL_PATTERN_MESSAGES,
  getPatternMasteryDisplayName,
  getPatternMasteryDisplayInfo,
  getRankTierIdForOrbTier,
  getSamuelPromotionMessage,
  getSamuelPatternMessage,
  calculatePatternMasteryState,
  checkPatternPromotions
} from '@/lib/ranking'
import type { OrbTier } from '@/lib/orbs'
import type { PatternType, PlayerPatterns } from '@/lib/patterns'
import { PATTERN_TYPES } from '@/lib/patterns'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const ALL_ORB_TIERS: OrbTier[] = ['nascent', 'emerging', 'developing', 'flourishing', 'mastered']

const makePatterns = (values: Partial<Record<PatternType, number>> = {}): PlayerPatterns => ({
  analytical: 0,
  patience: 0,
  exploring: 0,
  helping: 0,
  building: 0,
  ...values
})

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY MAPPING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Pattern Mastery Display Mapping', () => {
  it('all OrbTiers have display entries', () => {
    for (const tier of ALL_ORB_TIERS) {
      expect(PATTERN_MASTERY_DISPLAY[tier]).toBeDefined()
      expect(PATTERN_MASTERY_DISPLAY[tier].displayName).toBeDefined()
      expect(PATTERN_MASTERY_DISPLAY[tier].description).toBeDefined()
      expect(PATTERN_MASTERY_DISPLAY[tier].iconVariant).toBeDefined()
    }
  })

  it('display names match station theme', () => {
    expect(PATTERN_MASTERY_DISPLAY.nascent.displayName).toBe('Traveler')
    expect(PATTERN_MASTERY_DISPLAY.emerging.displayName).toBe('Passenger')
    expect(PATTERN_MASTERY_DISPLAY.developing.displayName).toBe('Regular')
    expect(PATTERN_MASTERY_DISPLAY.flourishing.displayName).toBe('Conductor')
    expect(PATTERN_MASTERY_DISPLAY.mastered.displayName).toBe('Station Master')
  })

  it('getPatternMasteryDisplayName returns correct names', () => {
    expect(getPatternMasteryDisplayName('nascent')).toBe('Traveler')
    expect(getPatternMasteryDisplayName('emerging')).toBe('Passenger')
    expect(getPatternMasteryDisplayName('developing')).toBe('Regular')
    expect(getPatternMasteryDisplayName('flourishing')).toBe('Conductor')
    expect(getPatternMasteryDisplayName('mastered')).toBe('Station Master')
  })

  it('getPatternMasteryDisplayInfo returns full display object', () => {
    const info = getPatternMasteryDisplayInfo('developing')
    expect(info.displayName).toBe('Regular')
    expect(info.description).toContain('station')
    expect(info.iconVariant).toBe('badge')
  })

  it('getRankTierIdForOrbTier returns correct tier IDs', () => {
    expect(getRankTierIdForOrbTier('nascent')).toBe('pm_traveler')
    expect(getRankTierIdForOrbTier('emerging')).toBe('pm_passenger')
    expect(getRankTierIdForOrbTier('developing')).toBe('pm_regular')
    expect(getRankTierIdForOrbTier('flourishing')).toBe('pm_conductor')
    expect(getRankTierIdForOrbTier('mastered')).toBe('pm_stationmaster')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Samuel Promotion Messages', () => {
  it('all tiers have at least one promotion message', () => {
    for (const tier of ALL_ORB_TIERS) {
      expect(SAMUEL_PROMOTION_MESSAGES[tier]).toBeDefined()
      expect(SAMUEL_PROMOTION_MESSAGES[tier].length).toBeGreaterThanOrEqual(1)
    }
  })

  it('getSamuelPromotionMessage returns a string', () => {
    for (const tier of ALL_ORB_TIERS) {
      const message = getSamuelPromotionMessage(tier)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })

  it('getSamuelPromotionMessage returns message from tier pool', () => {
    // Run multiple times to verify randomness stays in pool
    for (let i = 0; i < 10; i++) {
      const message = getSamuelPromotionMessage('emerging')
      expect(SAMUEL_PROMOTION_MESSAGES.emerging).toContain(message)
    }
  })
})

describe('Samuel Pattern Messages', () => {
  it('all patterns have messages for all tiers', () => {
    for (const pattern of PATTERN_TYPES) {
      expect(SAMUEL_PATTERN_MESSAGES[pattern]).toBeDefined()
      for (const tier of ALL_ORB_TIERS) {
        expect(SAMUEL_PATTERN_MESSAGES[pattern][tier]).toBeDefined()
        expect(typeof SAMUEL_PATTERN_MESSAGES[pattern][tier]).toBe('string')
      }
    }
  })

  it('getSamuelPatternMessage returns correct message', () => {
    const message = getSamuelPatternMessage('analytical', 'developing')
    expect(message).toBe(SAMUEL_PATTERN_MESSAGES.analytical.developing)
  })

  it('pattern messages are unique per tier', () => {
    for (const pattern of PATTERN_TYPES) {
      const messages = ALL_ORB_TIERS.map(tier => SAMUEL_PATTERN_MESSAGES[pattern][tier])
      const uniqueMessages = new Set(messages)
      expect(uniqueMessages.size).toBe(messages.length)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// STATE CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculatePatternMasteryState', () => {
  it('returns nascent tier for zero patterns', () => {
    const patterns = makePatterns()
    const state = calculatePatternMasteryState(patterns)

    expect(state.overallOrbTier).toBe('nascent')
    expect(state.overallDisplayName).toBe('Traveler')
  })

  it('returns correct tier based on total orbs', () => {
    // 10 total = emerging
    const state1 = calculatePatternMasteryState(makePatterns({ analytical: 5, patience: 5 }))
    expect(state1.overallOrbTier).toBe('emerging')
    expect(state1.overallDisplayName).toBe('Passenger')

    // 30 total = developing
    const state2 = calculatePatternMasteryState(makePatterns({ analytical: 10, patience: 10, exploring: 10 }))
    expect(state2.overallOrbTier).toBe('developing')
    expect(state2.overallDisplayName).toBe('Regular')

    // 60 total = flourishing
    const state3 = calculatePatternMasteryState(makePatterns({ analytical: 20, patience: 20, exploring: 20 }))
    expect(state3.overallOrbTier).toBe('flourishing')
    expect(state3.overallDisplayName).toBe('Conductor')

    // 100 total = mastered
    const state4 = calculatePatternMasteryState(makePatterns({ analytical: 20, patience: 20, exploring: 20, helping: 20, building: 20 }))
    expect(state4.overallOrbTier).toBe('mastered')
    expect(state4.overallDisplayName).toBe('Station Master')
  })

  it('calculates per-pattern breakdown', () => {
    const patterns = makePatterns({ analytical: 10, patience: 3, exploring: 1 })
    const state = calculatePatternMasteryState(patterns)

    expect(state.perPattern.analytical.points).toBe(10)
    expect(state.perPattern.analytical.thresholdLevel).toBe('flourishing') // 10 >= 9
    expect(state.perPattern.analytical.unlocksEarned).toBe(1) // 10% = 1 unlock at 10%

    expect(state.perPattern.patience.points).toBe(3)
    expect(state.perPattern.patience.thresholdLevel).toBe('emerging')

    expect(state.perPattern.exploring.points).toBe(1)
    expect(state.perPattern.exploring.thresholdLevel).toBe('nascent')
  })

  it('detects balanced patterns', () => {
    // All within 2 of each other
    const balanced = makePatterns({ analytical: 5, patience: 5, exploring: 4, helping: 5, building: 6 })
    const stateBalanced = calculatePatternMasteryState(balanced)
    expect(stateBalanced.balanced).toBe(true)

    // Not balanced (>2 difference)
    const unbalanced = makePatterns({ analytical: 10, patience: 0, exploring: 0, helping: 0, building: 0 })
    const stateUnbalanced = calculatePatternMasteryState(unbalanced)
    expect(stateUnbalanced.balanced).toBe(false)
  })

  it('respects orbBalance override', () => {
    const patterns = makePatterns({ analytical: 5, patience: 5 }) // Total 10
    const orbBalance = {
      analytical: 20, patience: 20, exploring: 20, helping: 20, building: 20,
      totalEarned: 100,
      currentStreak: 0, currentStreakType: null, bestStreak: 0,
      arcCompletions: 0, patternThresholdsHit: 0
    }

    const state = calculatePatternMasteryState(patterns, orbBalance)
    expect(state.overallOrbTier).toBe('mastered') // Uses orbBalance.totalEarned
  })

  it('calculates unlocks earned correctly', () => {
    // 10% = 1 unlock
    const state1 = calculatePatternMasteryState(makePatterns({ analytical: 10 }))
    expect(state1.perPattern.analytical.unlocksEarned).toBe(1)

    // 50% = 2 unlocks
    const state2 = calculatePatternMasteryState(makePatterns({ analytical: 50 }))
    expect(state2.perPattern.analytical.unlocksEarned).toBe(2)

    // 85% = 3 unlocks
    const state3 = calculatePatternMasteryState(makePatterns({ analytical: 85 }))
    expect(state3.perPattern.analytical.unlocksEarned).toBe(3)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PROMOTION DETECTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('checkPatternPromotions', () => {
  it('detects overall tier promotion', () => {
    const prev = calculatePatternMasteryState(makePatterns({ analytical: 5 })) // nascent overall
    const curr = calculatePatternMasteryState(makePatterns({ analytical: 10 })) // emerging overall

    const promotions = checkPatternPromotions(prev, curr)

    // Should have overall promotion + pattern promotion (analytical went from developing to flourishing)
    expect(promotions.length).toBeGreaterThanOrEqual(1)

    const overallPromotion = promotions.find(p => p.type === 'overall')
    expect(overallPromotion).toBeDefined()
    expect(overallPromotion?.previousTier).toBe('nascent')
    expect(overallPromotion?.newTier).toBe('emerging')
    expect(overallPromotion?.message).toBeDefined()
  })

  it('detects per-pattern tier promotion', () => {
    // Pattern goes from nascent (2 points) to emerging (3 points)
    const prev = calculatePatternMasteryState(makePatterns({ analytical: 2 }))
    const curr = calculatePatternMasteryState(makePatterns({ analytical: 3 }))

    const promotions = checkPatternPromotions(prev, curr)

    const patternPromotion = promotions.find(p => p.type === 'pattern' && p.pattern === 'analytical')
    expect(patternPromotion).toBeDefined()
    expect(patternPromotion?.previousTier).toBe('nascent')
    expect(patternPromotion?.newTier).toBe('emerging')
  })

  it('returns empty array when no promotion', () => {
    // Both at 4 and 5 are in 'emerging' tier (3 <= x < 6)
    const prev = calculatePatternMasteryState(makePatterns({ analytical: 4 }))
    const curr = calculatePatternMasteryState(makePatterns({ analytical: 5 })) // Same tier

    const promotions = checkPatternPromotions(prev, curr)
    expect(promotions.length).toBe(0)
  })

  it('does not detect demotions', () => {
    const prev = calculatePatternMasteryState(makePatterns({ analytical: 10 })) // emerging
    const curr = calculatePatternMasteryState(makePatterns({ analytical: 5 })) // nascent

    const promotions = checkPatternPromotions(prev, curr)
    expect(promotions.length).toBe(0)
  })

  it('can detect multiple promotions', () => {
    const prev = calculatePatternMasteryState(makePatterns({ analytical: 2, patience: 2 }))
    const curr = calculatePatternMasteryState(makePatterns({ analytical: 6, patience: 6 }))

    const promotions = checkPatternPromotions(prev, curr)

    // Should have overall + 2 pattern promotions
    expect(promotions.length).toBeGreaterThanOrEqual(2)
    expect(promotions.some(p => p.type === 'pattern' && p.pattern === 'analytical')).toBe(true)
    expect(promotions.some(p => p.type === 'pattern' && p.pattern === 'patience')).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Pattern Mastery Performance', () => {
  it('calculatePatternMasteryState completes in <1ms', () => {
    const patterns = makePatterns({ analytical: 20, patience: 15, exploring: 10 })

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      calculatePatternMasteryState(patterns)
    }
    const duration = performance.now() - start

    // 1000 calls in <100ms (0.1ms average)
    expect(duration).toBeLessThan(100)
  })

  it('checkPatternPromotions completes in <1ms', () => {
    const prev = calculatePatternMasteryState(makePatterns({ analytical: 5 }))
    const curr = calculatePatternMasteryState(makePatterns({ analytical: 15 }))

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      checkPatternPromotions(prev, curr)
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100)
  })
})
