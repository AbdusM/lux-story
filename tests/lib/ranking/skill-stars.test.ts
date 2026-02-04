/**
 * Skill Stars Tests
 *
 * Tests for the HxH-inspired contribution honors system.
 */

import { describe, it, expect } from 'vitest'
import {
  STAR_TYPES,
  STAR_TYPE_DISPLAY,
  STAR_LEVEL_DISPLAY,
  CONSTELLATION_NAMES,
  calculateStar,
  calculateSkillStarsState,
  getConstellationName,
  getSamuelStarMessage,
  getSamuelConstellationMessage,
  getStarsAtLevel,
  getNextUpgradeOpportunity,
  hasUpgradeReady
} from '@/lib/ranking/skill-stars'
import type { SkillStarsInput } from '@/lib/ranking/skill-stars'
import type { StarLevel, StarType } from '@/lib/ranking/types'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const makeInput = (overrides: Partial<SkillStarsInput> = {}): SkillStarsInput => ({
  maxPatternValue: 0,
  skillCombosUnlocked: 0,
  infoTiersDiscovered: 0,
  maxTrustLevel: 0,
  totalOrbs: 0,
  challengesCompleted: 0,
  ...overrides
})

// ═══════════════════════════════════════════════════════════════════════════
// STAR TYPE DEFINITIONS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Star Type Definitions', () => {
  it('has 6 star types', () => {
    expect(STAR_TYPES).toHaveLength(6)
    expect(STAR_TYPES).toEqual([
      'mastery', 'synthesis', 'discovery', 'connection', 'growth', 'resilience'
    ])
  })

  it('all star types have display info', () => {
    for (const type of STAR_TYPES) {
      expect(STAR_TYPE_DISPLAY[type]).toBeDefined()
      expect(STAR_TYPE_DISPLAY[type].name).toBeDefined()
      expect(STAR_TYPE_DISPLAY[type].description).toBeDefined()
      expect(STAR_TYPE_DISPLAY[type].iconVariant).toBeDefined()
    }
  })

  it('has 4 star levels (0-3)', () => {
    const levels: StarLevel[] = [0, 1, 2, 3]
    for (const level of levels) {
      expect(STAR_LEVEL_DISPLAY[level]).toBeDefined()
      expect(STAR_LEVEL_DISPLAY[level].name).toBeDefined()
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// INDIVIDUAL STAR CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateStar', () => {
  it('returns level 0 for zero value', () => {
    const star = calculateStar('mastery', 0)
    expect(star.level).toBe(0)
    expect(star.type).toBe('mastery')
  })

  it('mastery star thresholds: 30/60/85', () => {
    expect(calculateStar('mastery', 29).level).toBe(0)
    expect(calculateStar('mastery', 30).level).toBe(1)
    expect(calculateStar('mastery', 59).level).toBe(1)
    expect(calculateStar('mastery', 60).level).toBe(2)
    expect(calculateStar('mastery', 84).level).toBe(2)
    expect(calculateStar('mastery', 85).level).toBe(3)
  })

  it('synthesis star thresholds: 2/5/10', () => {
    expect(calculateStar('synthesis', 1).level).toBe(0)
    expect(calculateStar('synthesis', 2).level).toBe(1)
    expect(calculateStar('synthesis', 5).level).toBe(2)
    expect(calculateStar('synthesis', 10).level).toBe(3)
  })

  it('connection star thresholds: 6/8/10', () => {
    expect(calculateStar('connection', 5).level).toBe(0)
    expect(calculateStar('connection', 6).level).toBe(1)
    expect(calculateStar('connection', 8).level).toBe(2)
    expect(calculateStar('connection', 10).level).toBe(3)
  })

  it('includes progress to next level', () => {
    // Halfway from 0 to bronze (30) = 15 = 50%
    const star = calculateStar('mastery', 15)
    expect(star.level).toBe(0)
    expect(star.progress).toBe(50)
  })

  it('progress is 100 at max level', () => {
    const star = calculateStar('mastery', 100)
    expect(star.level).toBe(3)
    expect(star.progress).toBe(100)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// FULL STATE CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateSkillStarsState', () => {
  it('returns state for all star types', () => {
    const state = calculateSkillStarsState(makeInput())

    expect(Object.keys(state.stars)).toHaveLength(6)
    for (const type of STAR_TYPES) {
      expect(state.stars[type]).toBeDefined()
      expect(state.stars[type].type).toBe(type)
    }
  })

  it('calculates total stars correctly', () => {
    const state = calculateSkillStarsState(makeInput({
      maxPatternValue: 30,  // Bronze = 1
      skillCombosUnlocked: 5, // Silver = 2
      infoTiersDiscovered: 30, // Gold = 3
      maxTrustLevel: 0,     // Unstarred = 0
      totalOrbs: 0,         // Unstarred = 0
      challengesCompleted: 0 // Unstarred = 0
    }))

    expect(state.totalStars).toBe(6) // 1 + 2 + 3 + 0 + 0 + 0
  })

  it('includes constellation name', () => {
    const state = calculateSkillStarsState(makeInput())
    expect(state.constellation).toBeDefined()
    expect(typeof state.constellation).toBe('string')
  })

  it('max total stars is 18 (6 types * 3 gold)', () => {
    const maxState = calculateSkillStarsState(makeInput({
      maxPatternValue: 100,
      skillCombosUnlocked: 15,
      infoTiersDiscovered: 50,
      maxTrustLevel: 10,
      totalOrbs: 150,
      challengesCompleted: 20
    }))

    expect(maxState.totalStars).toBe(18)
    expect(maxState.constellation).toBe('Perfect Constellation')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// CONSTELLATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Constellation Names', () => {
  it('has names for all star counts 0-18', () => {
    for (let i = 0; i <= 18; i++) {
      expect(CONSTELLATION_NAMES[i]).toBeDefined()
      expect(typeof CONSTELLATION_NAMES[i]).toBe('string')
    }
  })

  it('getConstellationName returns correct names', () => {
    expect(getConstellationName(0)).toBe('Empty Sky')
    expect(getConstellationName(9)).toBe('Clear Pattern')
    expect(getConstellationName(15)).toBe('Full Constellation')
    expect(getConstellationName(18)).toBe('Perfect Constellation')
  })

  it('getConstellationName clamps to valid range', () => {
    expect(getConstellationName(-5)).toBe('Empty Sky')
    expect(getConstellationName(100)).toBe('Perfect Constellation')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Samuel Messages', () => {
  it('getSamuelStarMessage returns string for all levels', () => {
    const levels: StarLevel[] = [0, 1, 2, 3]
    for (const level of levels) {
      const message = getSamuelStarMessage(level)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })

  it('getSamuelConstellationMessage returns string', () => {
    const message = getSamuelConstellationMessage('Empty Sky')
    expect(typeof message).toBe('string')
    expect(message.length).toBeGreaterThan(0)
  })

  it('getSamuelConstellationMessage has fallback', () => {
    const message = getSamuelConstellationMessage('Unknown Pattern')
    expect(message).toBe('Your constellation continues to grow.')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Utility Functions', () => {
  it('getStarsAtLevel returns correct types', () => {
    const state = calculateSkillStarsState(makeInput({
      maxPatternValue: 30,  // Bronze
      skillCombosUnlocked: 2, // Bronze
      maxTrustLevel: 6      // Bronze
    }))

    const bronzeStars = getStarsAtLevel(state, 1)
    expect(bronzeStars).toContain('mastery')
    expect(bronzeStars).toContain('synthesis')
    expect(bronzeStars).toContain('connection')
    expect(bronzeStars).toHaveLength(3)
  })

  it('getNextUpgradeOpportunity finds highest progress', () => {
    const state = calculateSkillStarsState(makeInput({
      maxPatternValue: 25,  // 83% to bronze
      skillCombosUnlocked: 1, // 50% to bronze
      totalOrbs: 15         // 50% to bronze
    }))

    const next = getNextUpgradeOpportunity(state)
    expect(next).toBeDefined()
    expect(next?.type).toBe('mastery')
    expect(next?.progress).toBeGreaterThan(50)
  })

  it('getNextUpgradeOpportunity returns null when no progress', () => {
    const state = calculateSkillStarsState(makeInput())
    const next = getNextUpgradeOpportunity(state)
    expect(next).toBeNull()
  })

  it('hasUpgradeReady detects near-complete stars', () => {
    const almostBronze = calculateSkillStarsState(makeInput({
      maxPatternValue: 28 // 93% to bronze
    }))
    expect(hasUpgradeReady(almostBronze, 90)).toBe(true)

    const lowProgress = calculateSkillStarsState(makeInput({
      maxPatternValue: 10 // 33% to bronze
    }))
    expect(hasUpgradeReady(lowProgress, 90)).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('calculateSkillStarsState completes in <1ms', () => {
    const input = makeInput({
      maxPatternValue: 75,
      skillCombosUnlocked: 8,
      infoTiersDiscovered: 20,
      maxTrustLevel: 9,
      totalOrbs: 80,
      challengesCompleted: 10
    })

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      calculateSkillStarsState(input)
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100) // 1000 calls in <100ms
  })
})
