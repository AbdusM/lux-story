/**
 * Cross-System Resonance Tests
 *
 * Tests for the integration layer where ranking systems amplify each other.
 */

import { describe, it, expect } from 'vitest'
import {
  RESONANCE_BONUSES,
  RESONANCE_EVENTS,
  RESONANCE_TYPES,
  isResonanceActive,
  getActiveResonances,
  getResonanceMultiplier,
  getAllResonanceMultipliers,
  checkResonanceEvents,
  getResonanceEventById,
  calculateResonanceState,
  getResonanceDisplayInfo,
  getSamuelResonanceMessage,
  createDefaultResonanceInput,
  SAMUEL_RESONANCE_MESSAGES
} from '@/lib/ranking/resonance'
import type { ResonanceInput } from '@/lib/ranking/resonance'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const createInput = (overrides: Partial<ResonanceInput> = {}): ResonanceInput => ({
  patternMasteryLevel: 0,
  maxExpertiseLevel: 0,
  hasChampion: false,
  stationStandingLevel: 0,
  challengeGradeIndex: 0,
  hasChallengeOvercome: false,
  totalStars: 0,
  unlockedDesignationCount: 0,
  hasAssessmentComplete: false,
  hasCrossroadsComplete: false,
  cohortStanding: 'new',
  ...overrides
})

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Resonance Registry', () => {
  it('has 8 resonance types', () => {
    expect(RESONANCE_TYPES.length).toBe(8)
  })

  it('has 8 resonance bonuses', () => {
    expect(RESONANCE_BONUSES.length).toBe(8)
  })

  it('all bonuses have required fields', () => {
    for (const bonus of RESONANCE_BONUSES) {
      expect(bonus.type).toBeDefined()
      expect(bonus.sourceSystem).toBeDefined()
      expect(bonus.targetSystem).toBeDefined()
      expect(bonus.multiplier).toBeGreaterThan(1.0)
      expect(bonus.multiplier).toBeLessThanOrEqual(1.30) // Max 30% bonus
      expect(bonus.sourceMinLevel).toBeGreaterThanOrEqual(1)
      expect(bonus.description).toBeDefined()
    }
  })

  it('has unique resonance types', () => {
    const types = RESONANCE_BONUSES.map(b => b.type)
    const uniqueTypes = new Set(types)
    expect(types.length).toBe(uniqueTypes.size)
  })

  it('multipliers are within expected range (10-25%)', () => {
    for (const bonus of RESONANCE_BONUSES) {
      const bonusPercent = (bonus.multiplier - 1) * 100
      expect(bonusPercent).toBeGreaterThanOrEqual(10)
      expect(bonusPercent).toBeLessThanOrEqual(25)
    }
  })
})

describe('Resonance Events', () => {
  it('has 4 resonance events', () => {
    expect(RESONANCE_EVENTS.length).toBe(4)
  })

  it('all events have required fields', () => {
    for (const event of RESONANCE_EVENTS) {
      expect(event.id).toBeDefined()
      expect(event.name).toBeDefined()
      expect(event.description).toBeDefined()
      expect(event.requiredResonances.length).toBeGreaterThan(0)
      expect(event.reward).toBeDefined()
      expect(event.samuelCommentary).toBeDefined()
    }
  })

  it('has unique event IDs', () => {
    const ids = RESONANCE_EVENTS.map(e => e.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(uniqueIds.size)
  })

  it('all required resonances are valid types', () => {
    const validTypes = new Set(RESONANCE_TYPES)
    for (const event of RESONANCE_EVENTS) {
      for (const type of event.requiredResonances) {
        expect(validTypes.has(type)).toBe(true)
      }
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE ACTIVATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('isResonanceActive', () => {
  it('detects pattern_expertise resonance', () => {
    const bonus = RESONANCE_BONUSES.find(b => b.type === 'pattern_expertise')!

    // Inactive at level 1
    expect(isResonanceActive(bonus, createInput({ patternMasteryLevel: 1 }))).toBe(false)

    // Active at level 2+
    expect(isResonanceActive(bonus, createInput({ patternMasteryLevel: 2 }))).toBe(true)
    expect(isResonanceActive(bonus, createInput({ patternMasteryLevel: 4 }))).toBe(true)
  })

  it('detects expertise_standing resonance', () => {
    const bonus = RESONANCE_BONUSES.find(b => b.type === 'expertise_standing')!

    expect(isResonanceActive(bonus, createInput({ maxExpertiseLevel: 2 }))).toBe(false)
    expect(isResonanceActive(bonus, createInput({ maxExpertiseLevel: 3 }))).toBe(true)
  })

  it('detects standing_challenge resonance', () => {
    const bonus = RESONANCE_BONUSES.find(b => b.type === 'standing_challenge')!

    expect(isResonanceActive(bonus, createInput({ stationStandingLevel: 1 }))).toBe(false)
    expect(isResonanceActive(bonus, createInput({ stationStandingLevel: 2 }))).toBe(true)
  })

  it('detects challenge_stars resonance (requires flag)', () => {
    const bonus = RESONANCE_BONUSES.find(b => b.type === 'challenge_stars')!

    // High level but no flag
    expect(isResonanceActive(bonus, createInput({
      challengeGradeIndex: 3,
      hasChallengeOvercome: false
    }))).toBe(false)

    // Flag but low level
    expect(isResonanceActive(bonus, createInput({
      challengeGradeIndex: 2,
      hasChallengeOvercome: true
    }))).toBe(false)

    // Both conditions met
    expect(isResonanceActive(bonus, createInput({
      challengeGradeIndex: 3,
      hasChallengeOvercome: true
    }))).toBe(true)
  })

  it('detects stars_elite resonance', () => {
    const bonus = RESONANCE_BONUSES.find(b => b.type === 'stars_elite')!

    expect(isResonanceActive(bonus, createInput({ totalStars: 5 }))).toBe(false)
    expect(isResonanceActive(bonus, createInput({ totalStars: 6 }))).toBe(true)
  })

  it('detects elite_mastery resonance', () => {
    const bonus = RESONANCE_BONUSES.find(b => b.type === 'elite_mastery')!

    expect(isResonanceActive(bonus, createInput({ unlockedDesignationCount: 0 }))).toBe(false)
    expect(isResonanceActive(bonus, createInput({ unlockedDesignationCount: 1 }))).toBe(true)
  })

  it('detects assessment_expertise resonance', () => {
    const bonus = RESONANCE_BONUSES.find(b => b.type === 'assessment_expertise')!

    expect(isResonanceActive(bonus, createInput({ hasAssessmentComplete: false }))).toBe(false)
    expect(isResonanceActive(bonus, createInput({ hasAssessmentComplete: true }))).toBe(true)
  })

  it('detects cohort_standing resonance', () => {
    const bonus = RESONANCE_BONUSES.find(b => b.type === 'cohort_standing')!

    expect(isResonanceActive(bonus, createInput({ cohortStanding: 'ahead' }))).toBe(false)
    expect(isResonanceActive(bonus, createInput({ cohortStanding: 'leading' }))).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVE RESONANCES TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getActiveResonances', () => {
  it('returns empty array for new player', () => {
    const resonances = getActiveResonances(createInput())
    expect(resonances).toEqual([])
  })

  it('returns single resonance when conditions met', () => {
    const resonances = getActiveResonances(createInput({
      patternMasteryLevel: 2
    }))

    expect(resonances.length).toBe(1)
    expect(resonances[0].type).toBe('pattern_expertise')
  })

  it('returns multiple resonances when multiple conditions met', () => {
    const resonances = getActiveResonances(createInput({
      patternMasteryLevel: 3,
      maxExpertiseLevel: 4,
      stationStandingLevel: 2
    }))

    expect(resonances.length).toBe(3)
    expect(resonances.map(r => r.type)).toContain('pattern_expertise')
    expect(resonances.map(r => r.type)).toContain('expertise_standing')
    expect(resonances.map(r => r.type)).toContain('standing_challenge')
  })

  it('returns all resonances for max player', () => {
    const resonances = getActiveResonances(createInput({
      patternMasteryLevel: 4,
      maxExpertiseLevel: 5,
      stationStandingLevel: 3,
      challengeGradeIndex: 5,
      hasChallengeOvercome: true,
      totalStars: 12,
      unlockedDesignationCount: 3,
      hasAssessmentComplete: true,
      cohortStanding: 'leading'
    }))

    expect(resonances.length).toBe(8)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// MULTIPLIER TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getResonanceMultiplier', () => {
  it('returns 1.0 for no active resonances', () => {
    const multiplier = getResonanceMultiplier('career_expertise', createInput())
    expect(multiplier).toBe(1.0)
  })

  it('returns correct multiplier for single resonance', () => {
    const multiplier = getResonanceMultiplier(
      'career_expertise',
      createInput({ patternMasteryLevel: 2 })
    )
    expect(multiplier).toBe(1.15)
  })

  it('stacks multiple multipliers', () => {
    const multiplier = getResonanceMultiplier(
      'career_expertise',
      createInput({
        patternMasteryLevel: 2,
        hasAssessmentComplete: true
      })
    )
    // 1.15 * 1.15 = 1.3225
    expect(multiplier).toBeCloseTo(1.3225, 4)
  })

  it('returns 1.0 for unaffected systems', () => {
    const multiplier = getResonanceMultiplier(
      'pattern_mastery',
      createInput({ patternMasteryLevel: 2 }) // pattern_expertise targets career_expertise
    )
    expect(multiplier).toBe(1.0)
  })
})

describe('getAllResonanceMultipliers', () => {
  it('returns multipliers for all categories', () => {
    const multipliers = getAllResonanceMultipliers(createInput())

    expect(multipliers.pattern_mastery).toBe(1.0)
    expect(multipliers.career_expertise).toBe(1.0)
    expect(multipliers.challenge_rating).toBe(1.0)
    expect(multipliers.station_standing).toBe(1.0)
    expect(multipliers.skill_stars).toBe(1.0)
    expect(multipliers.elite_status).toBe(1.0)
  })

  it('reflects active resonances', () => {
    const multipliers = getAllResonanceMultipliers(createInput({
      patternMasteryLevel: 2,
      maxExpertiseLevel: 3
    }))

    expect(multipliers.career_expertise).toBe(1.15)
    expect(multipliers.station_standing).toBe(1.20)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE EVENTS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('checkResonanceEvents', () => {
  it('returns empty for no active resonances', () => {
    const events = checkResonanceEvents(createInput(), [])
    expect(events).toEqual([])
  })

  it('returns empty when resonances do not meet event requirements', () => {
    const events = checkResonanceEvents(
      createInput({ patternMasteryLevel: 2 }),
      []
    )
    expect(events).toEqual([])
  })

  it('triggers harmonic convergence', () => {
    const events = checkResonanceEvents(
      createInput({
        patternMasteryLevel: 3,
        maxExpertiseLevel: 4,
        stationStandingLevel: 2
      }),
      []
    )

    expect(events.map(e => e.id)).toContain('harmonic_convergence')
  })

  it('triggers elite resonance', () => {
    const events = checkResonanceEvents(
      createInput({
        totalStars: 8,
        unlockedDesignationCount: 2
      }),
      []
    )

    expect(events.map(e => e.id)).toContain('elite_resonance')
  })

  it('triggers assessment amplification', () => {
    const events = checkResonanceEvents(
      createInput({ hasAssessmentComplete: true }),
      []
    )

    expect(events.map(e => e.id)).toContain('assessment_amplification')
  })

  it('triggers generational echo', () => {
    const events = checkResonanceEvents(
      createInput({
        patternMasteryLevel: 3,
        cohortStanding: 'leading'
      }),
      []
    )

    expect(events.map(e => e.id)).toContain('generational_echo')
  })

  it('excludes completed events', () => {
    const events = checkResonanceEvents(
      createInput({ hasAssessmentComplete: true }),
      ['assessment_amplification']
    )

    expect(events.map(e => e.id)).not.toContain('assessment_amplification')
  })
})

describe('getResonanceEventById', () => {
  it('returns event for valid ID', () => {
    const event = getResonanceEventById('harmonic_convergence')
    expect(event).toBeDefined()
    expect(event?.name).toBe('Harmonic Convergence')
  })

  it('returns undefined for invalid ID', () => {
    const event = getResonanceEventById('nonexistent')
    expect(event).toBeUndefined()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE STATE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateResonanceState', () => {
  it('returns default state for new player', () => {
    const state = calculateResonanceState(createInput())

    expect(state.activeResonances).toEqual([])
    expect(state.pendingEvents).toEqual([])
    expect(state.completedEventIds).toEqual([])
    expect(state.totalMultiplier).toBe(1.0)
  })

  it('calculates active resonances', () => {
    const state = calculateResonanceState(createInput({
      patternMasteryLevel: 2,
      maxExpertiseLevel: 3
    }))

    expect(state.activeResonances.length).toBe(2)
    expect(state.totalMultiplier).toBeCloseTo(1.38, 2) // 1.15 * 1.20
  })

  it('includes pending events', () => {
    const state = calculateResonanceState(createInput({
      hasAssessmentComplete: true
    }))

    expect(state.pendingEvents.length).toBe(1)
    expect(state.pendingEvents[0].id).toBe('assessment_amplification')
  })

  it('preserves completed event IDs', () => {
    const state = calculateResonanceState(
      createInput({ hasAssessmentComplete: true }),
      ['assessment_amplification']
    )

    expect(state.completedEventIds).toContain('assessment_amplification')
    expect(state.pendingEvents.length).toBe(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY HELPER TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getResonanceDisplayInfo', () => {
  it('returns correct display info', () => {
    const bonus = RESONANCE_BONUSES.find(b => b.type === 'pattern_expertise')!
    const info = getResonanceDisplayInfo(bonus)

    expect(info.type).toBe('pattern_expertise')
    expect(info.name).toBe('Pattern Expertise')
    expect(info.bonusPercent).toBe(15)
    expect(info.sourceLabel).toBe('Pattern Mastery')
    expect(info.targetLabel).toBe('Career Expertise')
    expect(info.description).toBeDefined()
  })

  it('calculates bonus percent correctly', () => {
    for (const bonus of RESONANCE_BONUSES) {
      const info = getResonanceDisplayInfo(bonus)
      const expectedPercent = Math.round((bonus.multiplier - 1) * 100)
      expect(info.bonusPercent).toBe(expectedPercent)
    }
  })
})

describe('getSamuelResonanceMessage', () => {
  it('returns message for 0 resonances', () => {
    const message = getSamuelResonanceMessage(0)
    expect(typeof message).toBe('string')
    expect(message.length).toBeGreaterThan(0)
  })

  it('returns message for 1-4 resonances', () => {
    for (let count = 1; count <= 4; count++) {
      const message = getSamuelResonanceMessage(count)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })

  it('clamps high resonance counts to 4', () => {
    const message = getSamuelResonanceMessage(10)
    expect(SAMUEL_RESONANCE_MESSAGES[4]).toContain(message)
  })
})

describe('createDefaultResonanceInput', () => {
  it('creates valid empty input', () => {
    const input = createDefaultResonanceInput()

    expect(input.patternMasteryLevel).toBe(0)
    expect(input.maxExpertiseLevel).toBe(0)
    expect(input.hasChampion).toBe(false)
    expect(input.stationStandingLevel).toBe(0)
    expect(input.challengeGradeIndex).toBe(0)
    expect(input.hasChallengeOvercome).toBe(false)
    expect(input.totalStars).toBe(0)
    expect(input.unlockedDesignationCount).toBe(0)
    expect(input.hasAssessmentComplete).toBe(false)
    expect(input.hasCrossroadsComplete).toBe(false)
    expect(input.cohortStanding).toBe('new')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('getActiveResonances completes in <3ms', () => {
    const input = createInput({
      patternMasteryLevel: 4,
      maxExpertiseLevel: 5,
      stationStandingLevel: 3,
      totalStars: 12
    })

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      getActiveResonances(input)
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100) // 1000 calls in <100ms
  })

  it('calculateResonanceState completes quickly', () => {
    const input = createInput({
      patternMasteryLevel: 3,
      maxExpertiseLevel: 4,
      stationStandingLevel: 2,
      hasAssessmentComplete: true
    })

    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      calculateResonanceState(input, [])
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(50) // 100 calls in <50ms
  })
})
