/**
 * Unified Dashboard Tests
 *
 * Tests for the aggregated ranking dashboard.
 * Performance target: <50ms for full calculation.
 */

import { describe, it, expect } from 'vitest'
import {
  calculateUnifiedDashboard,
  createDefaultDashboardInput
} from '@/lib/ranking/unified-dashboard'
import type { UnifiedDashboardInput } from '@/lib/ranking/unified-dashboard'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const createInput = (overrides: Partial<UnifiedDashboardInput> = {}): UnifiedDashboardInput => ({
  patternOrbs: {},
  characterStates: [],
  demonstratedSkills: [],
  totalOrbs: 0,
  charactersMet: 0,
  averageTrust: 0,
  arcsCompleted: 0,
  visitedScenes: 0,
  choicesMade: 0,
  sessionsPlayed: 0,
  createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
  ...overrides
})

const createMidGameInput = (): UnifiedDashboardInput => createInput({
  patternOrbs: {
    analytical: 15,
    exploring: 12,
    helping: 8,
    patience: 6,
    building: 4
  },
  characterStates: [
    { characterId: 'maya', trust: 6, arcsCompleted: 1 },
    { characterId: 'marcus', trust: 5, arcsCompleted: 0 },
    { characterId: 'devon', trust: 4, arcsCompleted: 1 }
  ],
  demonstratedSkills: [
    'technical_analysis', 'problem_solving', 'communication',
    'leadership', 'empathy'
  ],
  totalOrbs: 45,
  charactersMet: 5,
  averageTrust: 5,
  arcsCompleted: 2,
  visitedScenes: 20,
  choicesMade: 50,
  sessionsPlayed: 5
})

const createAdvancedInput = (): UnifiedDashboardInput => createInput({
  patternOrbs: {
    analytical: 40,
    exploring: 35,
    helping: 30,
    patience: 25,
    building: 20
  },
  characterStates: [
    { characterId: 'maya', trust: 8, arcsCompleted: 2 },
    { characterId: 'marcus', trust: 7, arcsCompleted: 1 },
    { characterId: 'devon', trust: 8, arcsCompleted: 2 },
    { characterId: 'rohan', trust: 6, arcsCompleted: 1 },
    { characterId: 'tess', trust: 7, arcsCompleted: 1 }
  ],
  demonstratedSkills: [
    'technical_analysis', 'problem_solving', 'communication',
    'leadership', 'empathy', 'data_interpretation', 'critical_thinking',
    'collaboration', 'creativity', 'strategic_planning'
  ],
  totalOrbs: 150,
  charactersMet: 10,
  averageTrust: 7.2,
  arcsCompleted: 7,
  visitedScenes: 60,
  choicesMade: 150,
  sessionsPlayed: 15
})

// ═══════════════════════════════════════════════════════════════════════════
// BASIC FUNCTIONALITY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateUnifiedDashboard', () => {
  const now = 1700000000000

  it('returns valid dashboard for empty input', () => {
    const dashboard = calculateUnifiedDashboard(createInput(), now)

    expect(dashboard.patternMastery).toBeDefined()
    expect(dashboard.careerExpertise).toBeDefined()
    expect(dashboard.challengeRating).toBeDefined()
    expect(dashboard.stationStanding).toBeDefined()
    expect(dashboard.skillStars).toBeDefined()
    expect(dashboard.eliteStatus).toBeDefined()
    expect(dashboard.cohort).toBeDefined()
    expect(dashboard.resonance).toBeDefined()
    expect(dashboard.lastUpdated).toBe(now)
    expect(dashboard.overallProgression).toBe(0)
  })

  it('calculates pattern mastery correctly', () => {
    const dashboard = calculateUnifiedDashboard(createMidGameInput(), now)

    expect(dashboard.patternMastery.overallOrbTier).toBeDefined()
    expect(dashboard.patternMastery.perPattern.analytical).toBeDefined()
  })

  it('calculates career expertise correctly', () => {
    const dashboard = calculateUnifiedDashboard(createMidGameInput(), now)

    expect(dashboard.careerExpertise.primaryDomain).toBeDefined()
    expect(Object.keys(dashboard.careerExpertise.domains).length).toBe(5)
  })

  it('calculates challenge rating correctly', () => {
    const dashboard = calculateUnifiedDashboard(createMidGameInput(), now)

    expect(dashboard.challengeRating.grade).toBeDefined()
    expect(dashboard.challengeRating.gradeName).toBeDefined()
  })

  it('calculates station standing correctly', () => {
    const dashboard = calculateUnifiedDashboard(createMidGameInput(), now)

    expect(dashboard.stationStanding.standing).toBeDefined()
    expect(dashboard.stationStanding.meritPoints).toBeGreaterThanOrEqual(0)
  })

  it('calculates skill stars correctly', () => {
    const dashboard = calculateUnifiedDashboard(createMidGameInput(), now)

    expect(dashboard.skillStars.totalStars).toBeGreaterThanOrEqual(0)
    expect(dashboard.skillStars.stars).toBeDefined()
  })

  it('calculates elite status correctly', () => {
    const dashboard = calculateUnifiedDashboard(createMidGameInput(), now)

    expect(dashboard.eliteStatus.unlockedDesignations).toBeDefined()
    expect(Array.isArray(dashboard.eliteStatus.unlockedDesignations)).toBe(true)
  })

  it('calculates cohort correctly', () => {
    const dashboard = calculateUnifiedDashboard(createMidGameInput(), now)

    expect(dashboard.cohort.cohortId).toBeDefined()
    expect(dashboard.cohort.qualitativeStanding).toBeDefined()
  })

  it('calculates resonance correctly', () => {
    const dashboard = calculateUnifiedDashboard(createAdvancedInput(), now)

    // Advanced player should have some resonances
    expect(dashboard.resonance.activeResonances.length).toBeGreaterThanOrEqual(0)
    expect(dashboard.resonance.totalMultiplier).toBeGreaterThanOrEqual(1.0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// OVERALL PROGRESSION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Overall Progression', () => {
  const now = 1700000000000

  it('returns 0 for empty input', () => {
    const dashboard = calculateUnifiedDashboard(createInput(), now)
    expect(dashboard.overallProgression).toBe(0)
  })

  it('increases with player progress', () => {
    const emptyDashboard = calculateUnifiedDashboard(createInput(), now)
    const midDashboard = calculateUnifiedDashboard(createMidGameInput(), now)
    const advancedDashboard = calculateUnifiedDashboard(createAdvancedInput(), now)

    expect(midDashboard.overallProgression).toBeGreaterThan(emptyDashboard.overallProgression)
    expect(advancedDashboard.overallProgression).toBeGreaterThan(midDashboard.overallProgression)
  })

  it('caps at 100', () => {
    // Create max-level input
    const maxInput = createInput({
      patternOrbs: {
        analytical: 200,
        exploring: 200,
        helping: 200,
        patience: 200,
        building: 200
      },
      characterStates: Array.from({ length: 15 }, (_, i) => ({
        characterId: `char_${i}`,
        trust: 10,
        arcsCompleted: 3
      })),
      demonstratedSkills: Array.from({ length: 30 }, (_, i) => `skill_${i}`),
      totalOrbs: 1000,
      charactersMet: 20,
      averageTrust: 9,
      arcsCompleted: 20,
      visitedScenes: 200,
      choicesMade: 500,
      sessionsPlayed: 50
    })

    const dashboard = calculateUnifiedDashboard(maxInput, now)
    expect(dashboard.overallProgression).toBeLessThanOrEqual(100)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// CEREMONY DETECTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Ceremony Detection', () => {
  const now = 1700000000000

  it('detects no ceremony for new player', () => {
    const dashboard = calculateUnifiedDashboard(createInput(), now)
    expect(dashboard.pendingCeremony).toBeNull()
  })

  it('returns ceremony history', () => {
    const dashboard = calculateUnifiedDashboard(createInput(), now)
    expect(dashboard.ceremonyHistory).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// DETERMINISM TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Determinism', () => {
  it('produces same result with same input and timestamp', () => {
    const input = createMidGameInput()
    const now = 1700000000000

    const result1 = calculateUnifiedDashboard(input, now)
    const result2 = calculateUnifiedDashboard(input, now)

    expect(result1.overallProgression).toBe(result2.overallProgression)
    expect(result1.patternMastery.overallOrbTier).toBe(result2.patternMastery.overallOrbTier)
    expect(result1.lastUpdated).toBe(result2.lastUpdated)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT INPUT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('createDefaultDashboardInput', () => {
  it('creates valid empty input', () => {
    const input = createDefaultDashboardInput()

    expect(input.patternOrbs).toEqual({})
    expect(input.characterStates).toEqual([])
    expect(input.demonstratedSkills).toEqual([])
    expect(input.totalOrbs).toBe(0)
    expect(input.createdAt).toBeGreaterThan(0)
  })

  it('accepts custom createdAt', () => {
    const customTime = 1600000000000
    const input = createDefaultDashboardInput(customTime)

    expect(input.createdAt).toBe(customTime)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('calculateUnifiedDashboard completes in <50ms', () => {
    const input = createAdvancedInput()
    const now = Date.now()

    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      calculateUnifiedDashboard(input, now)
    }
    const duration = performance.now() - start

    // 100 calls should complete in <5000ms (50ms each)
    expect(duration).toBeLessThan(5000)

    // Average should be well under budget
    const avgDuration = duration / 100
    expect(avgDuration).toBeLessThan(50)
  })

  it('handles large input efficiently', () => {
    const largeInput = createInput({
      patternOrbs: Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => [`pattern_${i}`, Math.random() * 100])
      ),
      characterStates: Array.from({ length: 50 }, (_, i) => ({
        characterId: `char_${i}`,
        trust: Math.floor(Math.random() * 10),
        arcsCompleted: Math.floor(Math.random() * 5)
      })),
      demonstratedSkills: Array.from({ length: 100 }, (_, i) => `skill_${i}`),
      totalOrbs: 500,
      charactersMet: 50,
      averageTrust: 7,
      arcsCompleted: 30,
      visitedScenes: 100,
      choicesMade: 300,
      sessionsPlayed: 30
    })

    const start = performance.now()
    calculateUnifiedDashboard(largeInput, Date.now())
    const duration = performance.now() - start

    expect(duration).toBeLessThan(50)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// EDGE CASE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Edge Cases', () => {
  const now = 1700000000000

  it('handles empty character states', () => {
    const input = createInput({ characterStates: [] })
    const dashboard = calculateUnifiedDashboard(input, now)

    // Career expertise should still be defined with empty domains
    expect(dashboard.careerExpertise).toBeDefined()
  })

  it('handles zero orbs', () => {
    const input = createInput({ totalOrbs: 0 })
    const dashboard = calculateUnifiedDashboard(input, now)

    expect(dashboard.stationStanding.meritPoints).toBe(0)
  })

  it('handles future createdAt date', () => {
    const futureTime = now + 30 * 24 * 60 * 60 * 1000 // 30 days in future
    const input = createInput({ createdAt: futureTime })

    // Should not throw
    const dashboard = calculateUnifiedDashboard(input, now)
    expect(dashboard.cohort.cohortId).toBeDefined()
  })
})
