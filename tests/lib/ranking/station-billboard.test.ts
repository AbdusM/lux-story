/**
 * Station Billboard Tests
 *
 * Tests for the OPM-inspired public recognition system.
 */

import { describe, it, expect } from 'vitest'
import {
  STANDING_DISPLAY,
  STANDING_TIERS,
  MERIT_CATEGORIES,
  calculateMeritBreakdown,
  getStandingForMerit,
  generateHighlights,
  calculateBillboardState,
  getSamuelStandingMessage,
  getMeritPercentages
} from '@/lib/ranking/station-billboard'
import type { BillboardInput } from '@/lib/ranking/station-billboard'
import type { StationStandingTier } from '@/lib/ranking/types'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const makeInput = (overrides: Partial<BillboardInput> = {}): BillboardInput => ({
  totalOrbs: 0,
  charactersMetCount: 0,
  averageTrust: 0,
  scenesDiscovered: 0,
  arcsCompleted: 0,
  skillsDemonstrated: 0,
  achievementsUnlocked: 0,
  ...overrides
})

// ═══════════════════════════════════════════════════════════════════════════
// STANDING DEFINITIONS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Standing Definitions', () => {
  it('has 4 standing tiers in order', () => {
    expect(STANDING_TIERS).toEqual(['newcomer', 'regular', 'notable', 'distinguished'])
  })

  it('all standings have display info', () => {
    for (const tier of STANDING_TIERS) {
      expect(STANDING_DISPLAY[tier]).toBeDefined()
      expect(STANDING_DISPLAY[tier].name).toBeDefined()
      expect(STANDING_DISPLAY[tier].description).toBeDefined()
      expect(STANDING_DISPLAY[tier].iconVariant).toBeDefined()
    }
  })

  it('has 4 merit categories', () => {
    expect(MERIT_CATEGORIES.length).toBe(4)
    expect(MERIT_CATEGORIES.map(c => c.key)).toEqual([
      'patterns', 'relationships', 'discoveries', 'contributions'
    ])
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// MERIT CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateMeritBreakdown', () => {
  it('returns 0 for empty input', () => {
    const breakdown = calculateMeritBreakdown(makeInput())
    expect(breakdown.total).toBe(0)
    expect(breakdown.patterns).toBe(0)
    expect(breakdown.relationships).toBe(0)
    expect(breakdown.discoveries).toBe(0)
    expect(breakdown.contributions).toBe(0)
  })

  it('calculates pattern merit from orbs', () => {
    const breakdown = calculateMeritBreakdown(makeInput({ totalOrbs: 100 }))
    expect(breakdown.patterns).toBe(50) // 100 * 0.5
  })

  it('calculates relationship merit from characters and trust', () => {
    const breakdown = calculateMeritBreakdown(makeInput({
      charactersMetCount: 5,
      averageTrust: 6
    }))
    // 5 * 2 (character) + 5 * 6 * 0.5 (trust) = 10 + 15 = 25
    expect(breakdown.relationships).toBe(25)
  })

  it('calculates discovery merit from scenes and arcs', () => {
    const breakdown = calculateMeritBreakdown(makeInput({
      scenesDiscovered: 50,
      arcsCompleted: 3
    }))
    // 50 * 0.2 (scenes) + 3 * 5 (arcs) = 10 + 15 = 25
    expect(breakdown.discoveries).toBe(25)
  })

  it('calculates contribution merit from skills and achievements', () => {
    const breakdown = calculateMeritBreakdown(makeInput({
      skillsDemonstrated: 10,
      achievementsUnlocked: 5
    }))
    // 10 * 1 (skills) + 5 * 3 (achievements) = 10 + 15 = 25
    expect(breakdown.contributions).toBe(25)
  })

  it('total equals sum of categories', () => {
    const breakdown = calculateMeritBreakdown(makeInput({
      totalOrbs: 50,       // 25 patterns
      charactersMetCount: 5,
      averageTrust: 4,     // 20 relationships
      arcsCompleted: 2,    // 10 discoveries
      skillsDemonstrated: 5 // 5 contributions
    }))
    expect(breakdown.total).toBe(
      breakdown.patterns +
      breakdown.relationships +
      breakdown.discoveries +
      breakdown.contributions
    )
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// STANDING CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getStandingForMerit', () => {
  it('returns newcomer for 0-24 merit', () => {
    expect(getStandingForMerit(0)).toBe('newcomer')
    expect(getStandingForMerit(24)).toBe('newcomer')
  })

  it('returns regular for 25-74 merit', () => {
    expect(getStandingForMerit(25)).toBe('regular')
    expect(getStandingForMerit(74)).toBe('regular')
  })

  it('returns notable for 75-149 merit', () => {
    expect(getStandingForMerit(75)).toBe('notable')
    expect(getStandingForMerit(149)).toBe('notable')
  })

  it('returns distinguished for 150+ merit', () => {
    expect(getStandingForMerit(150)).toBe('distinguished')
    expect(getStandingForMerit(500)).toBe('distinguished')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// HIGHLIGHTS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('generateHighlights', () => {
  it('generates highlights for non-zero values', () => {
    const highlights = generateHighlights(makeInput({
      totalOrbs: 50,
      charactersMetCount: 5,
      arcsCompleted: 2,
      skillsDemonstrated: 3
    }))

    expect(highlights.length).toBeGreaterThan(0)
    expect(highlights.some(h => h.category === 'patterns')).toBe(true)
    expect(highlights.some(h => h.category === 'relationships')).toBe(true)
    expect(highlights.some(h => h.category === 'discoveries')).toBe(true)
    expect(highlights.some(h => h.category === 'contributions')).toBe(true)
  })

  it('omits zero-value highlights', () => {
    const highlights = generateHighlights(makeInput({
      totalOrbs: 10,
      charactersMetCount: 0 // No relationship highlight
    }))

    expect(highlights.some(h => h.label === 'Connections Made')).toBe(false)
  })

  it('shows trust only if meaningful (>= 4)', () => {
    const lowTrust = generateHighlights(makeInput({
      charactersMetCount: 5,
      averageTrust: 2
    }))
    expect(lowTrust.some(h => h.label === 'Trust Level')).toBe(false)

    const highTrust = generateHighlights(makeInput({
      charactersMetCount: 5,
      averageTrust: 5
    }))
    expect(highTrust.some(h => h.label === 'Trust Level')).toBe(true)
  })

  it('calculates trends from previous input', () => {
    const previous = makeInput({ totalOrbs: 30 })
    const current = makeInput({ totalOrbs: 50 })

    const highlights = generateHighlights(current, previous)
    const orbHighlight = highlights.find(h => h.label === 'Orbs Collected')

    expect(orbHighlight?.trend).toBe('up')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// BILLBOARD STATE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateBillboardState', () => {
  it('returns complete billboard state', () => {
    const state = calculateBillboardState(makeInput({
      totalOrbs: 50,
      charactersMetCount: 5,
      averageTrust: 4,
      arcsCompleted: 2
    }))

    expect(state.standing).toBeDefined()
    expect(state.standingName).toBeDefined()
    expect(state.meritPoints).toBeGreaterThan(0)
    expect(state.meritBreakdown).toBeDefined()
    expect(state.highlights).toBeDefined()
    expect(state.lastUpdated).toBeDefined()
  })

  it('standing matches merit points', () => {
    const lowMerit = calculateBillboardState(makeInput({ totalOrbs: 10 }))
    expect(lowMerit.standing).toBe('newcomer')

    const highMerit = calculateBillboardState(makeInput({
      totalOrbs: 200,
      charactersMetCount: 15,
      averageTrust: 8,
      arcsCompleted: 10
    }))
    expect(highMerit.standing).toBe('distinguished')
  })

  it('uses provided timestamp', () => {
    const now = 1700000000000
    const state = calculateBillboardState(makeInput(), undefined, now)
    expect(state.lastUpdated).toBe(now)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Samuel Messages', () => {
  it('getSamuelStandingMessage returns string for all standings', () => {
    for (const tier of STANDING_TIERS) {
      const message = getSamuelStandingMessage(tier)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// MERIT PERCENTAGES TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getMeritPercentages', () => {
  it('returns 0 for all categories when total is 0', () => {
    const percentages = getMeritPercentages({
      patterns: 0,
      relationships: 0,
      discoveries: 0,
      contributions: 0,
      total: 0
    })

    expect(percentages.patterns).toBe(0)
    expect(percentages.relationships).toBe(0)
    expect(percentages.discoveries).toBe(0)
    expect(percentages.contributions).toBe(0)
  })

  it('calculates correct percentages', () => {
    const percentages = getMeritPercentages({
      patterns: 50,
      relationships: 25,
      discoveries: 15,
      contributions: 10,
      total: 100
    })

    expect(percentages.patterns).toBe(50)
    expect(percentages.relationships).toBe(25)
    expect(percentages.discoveries).toBe(15)
    expect(percentages.contributions).toBe(10)
  })

  it('rounds percentages', () => {
    const percentages = getMeritPercentages({
      patterns: 33,
      relationships: 33,
      discoveries: 17,
      contributions: 17,
      total: 100
    })

    // Should round to nearest integer
    expect(percentages.patterns).toBe(33)
    expect(percentages.relationships).toBe(33)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('calculateBillboardState completes in <1ms', () => {
    const input = makeInput({
      totalOrbs: 100,
      charactersMetCount: 15,
      averageTrust: 6,
      scenesDiscovered: 50,
      arcsCompleted: 5,
      skillsDemonstrated: 20,
      achievementsUnlocked: 10
    })

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      calculateBillboardState(input)
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100) // 1000 calls in <100ms
  })
})
