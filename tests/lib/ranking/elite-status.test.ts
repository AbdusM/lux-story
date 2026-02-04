/**
 * Elite Status Tests
 *
 * Tests for the Bleach-inspired special designation system.
 */

import { describe, it, expect } from 'vitest'
import {
  ELITE_DESIGNATIONS,
  DESIGNATION_DISPLAY,
  isDesignationUnlocked,
  getDesignationProgress,
  calculateEliteStatusState,
  getEliteTier,
  getSamuelDesignationMessage,
  getSamuelEliteTierMessage,
  getNearestDesignation,
  hasDesignationNearUnlock,
  getPrimaryTitle,
  getAllTitles
} from '@/lib/ranking/elite-status'
import type { EliteStatusInput } from '@/lib/ranking/elite-status'
import type { EliteDesignation } from '@/lib/ranking/types'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const makeInput = (overrides: Partial<EliteStatusInput> = {}): EliteStatusInput => ({
  firstDiscoveries: 0,
  specialistDomains: 0,
  maxTrustCharacters: 0,
  flourishingPatterns: 0,
  standingLevel: 0,
  totalOrbs: 0,
  arcsCompleted: 0,
  ...overrides
})

// ═══════════════════════════════════════════════════════════════════════════
// DESIGNATION DEFINITIONS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Designation Definitions', () => {
  it('has 5 elite designations', () => {
    expect(ELITE_DESIGNATIONS).toHaveLength(5)
    expect(ELITE_DESIGNATIONS).toEqual([
      'pathfinder', 'bridge_builder', 'mentor_heart', 'pattern_sage', 'station_pillar'
    ])
  })

  it('all designations have display info', () => {
    for (const designation of ELITE_DESIGNATIONS) {
      expect(DESIGNATION_DISPLAY[designation]).toBeDefined()
      expect(DESIGNATION_DISPLAY[designation].name).toBeDefined()
      expect(DESIGNATION_DISPLAY[designation].title).toBeDefined()
      expect(DESIGNATION_DISPLAY[designation].requirement).toBeDefined()
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// INDIVIDUAL DESIGNATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('isDesignationUnlocked', () => {
  it('pathfinder requires 3+ first discoveries', () => {
    expect(isDesignationUnlocked('pathfinder', makeInput({ firstDiscoveries: 2 }))).toBe(false)
    expect(isDesignationUnlocked('pathfinder', makeInput({ firstDiscoveries: 3 }))).toBe(true)
  })

  it('bridge_builder requires 3+ specialist domains', () => {
    expect(isDesignationUnlocked('bridge_builder', makeInput({ specialistDomains: 2 }))).toBe(false)
    expect(isDesignationUnlocked('bridge_builder', makeInput({ specialistDomains: 3 }))).toBe(true)
  })

  it('mentor_heart requires 5+ max trust characters', () => {
    expect(isDesignationUnlocked('mentor_heart', makeInput({ maxTrustCharacters: 4 }))).toBe(false)
    expect(isDesignationUnlocked('mentor_heart', makeInput({ maxTrustCharacters: 5 }))).toBe(true)
  })

  it('pattern_sage requires 5 flourishing patterns', () => {
    expect(isDesignationUnlocked('pattern_sage', makeInput({ flourishingPatterns: 4 }))).toBe(false)
    expect(isDesignationUnlocked('pattern_sage', makeInput({ flourishingPatterns: 5 }))).toBe(true)
  })

  it('station_pillar requires standing level 3', () => {
    expect(isDesignationUnlocked('station_pillar', makeInput({ standingLevel: 2 }))).toBe(false)
    expect(isDesignationUnlocked('station_pillar', makeInput({ standingLevel: 3 }))).toBe(true)
  })
})

describe('getDesignationProgress', () => {
  it('returns 0 for zero progress', () => {
    expect(getDesignationProgress('pathfinder', makeInput())).toBe(0)
  })

  it('returns correct percentage', () => {
    // 2/3 discoveries = 67%
    expect(getDesignationProgress('pathfinder', makeInput({ firstDiscoveries: 2 }))).toBe(67)

    // 3/5 trust = 60%
    expect(getDesignationProgress('mentor_heart', makeInput({ maxTrustCharacters: 3 }))).toBe(60)
  })

  it('caps at 100%', () => {
    expect(getDesignationProgress('pathfinder', makeInput({ firstDiscoveries: 10 }))).toBe(100)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// STATE CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateEliteStatusState', () => {
  it('returns empty state for new player', () => {
    const state = calculateEliteStatusState(makeInput())

    expect(state.unlockedDesignations).toHaveLength(0)
    expect(state.pendingDesignations).toHaveLength(0)
  })

  it('tracks unlocked designations', () => {
    const state = calculateEliteStatusState(makeInput({
      firstDiscoveries: 3,  // Unlocks pathfinder
      maxTrustCharacters: 5 // Unlocks mentor_heart
    }))

    expect(state.unlockedDesignations).toContain('pathfinder')
    expect(state.unlockedDesignations).toContain('mentor_heart')
    expect(state.unlockedDesignations).toHaveLength(2)
  })

  it('tracks pending designations (>= 33% progress)', () => {
    const state = calculateEliteStatusState(makeInput({
      firstDiscoveries: 1,   // 33% = pending
      specialistDomains: 0   // 0% = not pending
    }))

    expect(state.pendingDesignations).toContain('pathfinder')
    expect(state.pendingDesignations).not.toContain('bridge_builder')
  })

  it('tracks progress for all designations', () => {
    const state = calculateEliteStatusState(makeInput({
      firstDiscoveries: 1,
      specialistDomains: 2
    }))

    expect(state.progress.pathfinder).toBe(33)
    expect(state.progress.bridge_builder).toBe(67)
    expect(state.progress.mentor_heart).toBe(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// ELITE TIER TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getEliteTier', () => {
  it('returns Standard for 0 designations', () => {
    const tier = getEliteTier(0)
    expect(tier.name).toBe('Standard')
    expect(tier.level).toBe(0)
  })

  it('returns Recognized for 1 designation', () => {
    const tier = getEliteTier(1)
    expect(tier.name).toBe('Recognized')
    expect(tier.level).toBe(1)
  })

  it('returns Elite for 3 designations', () => {
    const tier = getEliteTier(3)
    expect(tier.name).toBe('Elite')
    expect(tier.level).toBe(2)
  })

  it('returns Legendary for 5 designations', () => {
    const tier = getEliteTier(5)
    expect(tier.name).toBe('Legendary')
    expect(tier.level).toBe(3)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Samuel Messages', () => {
  it('getSamuelDesignationMessage returns string for all designations', () => {
    for (const designation of ELITE_DESIGNATIONS) {
      const message = getSamuelDesignationMessage(designation)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })

  it('getSamuelEliteTierMessage returns string for all tiers', () => {
    const tiers = ['Standard', 'Recognized', 'Elite', 'Legendary']
    for (const tier of tiers) {
      const message = getSamuelEliteTierMessage(tier)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })

  it('getSamuelEliteTierMessage has fallback', () => {
    const message = getSamuelEliteTierMessage('Unknown')
    expect(message).toBe('Continue your path. Growth never stops.')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Utility Functions', () => {
  it('getNearestDesignation returns highest progress designation', () => {
    const state = calculateEliteStatusState(makeInput({
      firstDiscoveries: 2,   // 67%
      specialistDomains: 1   // 33%
    }))

    expect(getNearestDesignation(state)).toBe('pathfinder')
  })

  it('getNearestDesignation returns null when all unlocked', () => {
    const state = calculateEliteStatusState(makeInput({
      firstDiscoveries: 3,
      specialistDomains: 3,
      maxTrustCharacters: 5,
      flourishingPatterns: 5,
      standingLevel: 3
    }))

    expect(getNearestDesignation(state)).toBeNull()
  })

  it('hasDesignationNearUnlock detects near-complete designations', () => {
    const nearComplete = calculateEliteStatusState(makeInput({
      firstDiscoveries: 2 // 67% - below 80
    }))
    expect(hasDesignationNearUnlock(nearComplete, 80)).toBe(false)

    const almostThere = calculateEliteStatusState(makeInput({
      maxTrustCharacters: 4 // 80%
    }))
    expect(hasDesignationNearUnlock(almostThere, 80)).toBe(true)
  })

  it('getPrimaryTitle returns first unlocked title', () => {
    const state = calculateEliteStatusState(makeInput({
      firstDiscoveries: 3
    }))

    expect(getPrimaryTitle(state)).toBe('The Pathfinder')
  })

  it('getPrimaryTitle returns null when none unlocked', () => {
    const state = calculateEliteStatusState(makeInput())
    expect(getPrimaryTitle(state)).toBeNull()
  })

  it('getAllTitles returns all unlocked titles', () => {
    const state = calculateEliteStatusState(makeInput({
      firstDiscoveries: 3,
      maxTrustCharacters: 5
    }))

    const titles = getAllTitles(state)
    expect(titles).toContain('The Pathfinder')
    expect(titles).toContain('The Mentor Heart')
    expect(titles).toHaveLength(2)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('calculateEliteStatusState completes in <1ms', () => {
    const input = makeInput({
      firstDiscoveries: 5,
      specialistDomains: 4,
      maxTrustCharacters: 8,
      flourishingPatterns: 4,
      standingLevel: 2
    })

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      calculateEliteStatusState(input)
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100) // 1000 calls in <100ms
  })
})
