/**
 * Cohort System Tests
 *
 * Tests for the Claymore-inspired generational grouping system.
 */

import { describe, it, expect } from 'vitest'
import {
  getCohortId,
  getCohortName,
  getCohortDates,
  createCohort,
  getQualitativeStanding,
  getStandingDescription,
  getStandingLabel,
  calculateLocalCohortComparison,
  getSamuelCohortMessage,
  getCohortDisplayInfo,
  formatPercentileDisplay,
  SPECIAL_COHORT_NAMES,
  SAMUEL_COHORT_MESSAGES
} from '@/lib/ranking/cohorts'
import type { LocalCohortInput, QualitativeStanding } from '@/lib/ranking/cohorts'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const makeInput = (overrides: Partial<LocalCohortInput> = {}): LocalCohortInput => ({
  createdAt: new Date('2026-01-15').getTime(),
  totalOrbs: 0,
  charactersMet: 0,
  averageTrust: 0,
  arcsCompleted: 0,
  skillsDemonstrated: 0,
  ...overrides
})

// ═══════════════════════════════════════════════════════════════════════════
// COHORT ID TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Cohort ID Generation', () => {
  it('generates correct cohort ID for January 2026', () => {
    const timestamp = new Date('2026-01-15').getTime()
    expect(getCohortId(timestamp)).toBe('2026-01')
  })

  it('generates correct cohort ID for December', () => {
    const timestamp = new Date('2026-12-25').getTime()
    expect(getCohortId(timestamp)).toBe('2026-12')
  })

  it('handles different years', () => {
    // Use explicit UTC to avoid timezone issues
    expect(getCohortId(new Date(2025, 5, 15).getTime())).toBe('2025-06') // June
    expect(getCohortId(new Date(2027, 2, 15).getTime())).toBe('2027-03') // March
  })

  it('pads single-digit months with zero', () => {
    const timestamp = new Date(2026, 4, 15).getTime() // May (0-indexed)
    expect(getCohortId(timestamp)).toBe('2026-05')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// COHORT NAMING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Cohort Naming', () => {
  it('generates correct cohort name', () => {
    expect(getCohortName('2026-01')).toBe('The Founders')
    expect(getCohortName('2026-02')).toBe('The Pioneers')
    expect(getCohortName('2026-04')).toBe('The April 2026 Travelers')
  })

  it('uses special names for notable cohorts', () => {
    expect(getCohortName('2026-01')).toBe(SPECIAL_COHORT_NAMES['2026-01'])
    expect(getCohortName('2026-03')).toBe('The Trailblazers')
  })

  it('generates month-based names for regular cohorts', () => {
    expect(getCohortName('2026-07')).toBe('The July 2026 Travelers')
    expect(getCohortName('2027-11')).toBe('The November 2027 Travelers')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// COHORT DATES TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Cohort Dates', () => {
  it('calculates correct start and end dates', () => {
    const { startDate, endDate } = getCohortDates('2026-01')

    const start = new Date(startDate)
    expect(start.getFullYear()).toBe(2026)
    expect(start.getMonth()).toBe(0) // January
    expect(start.getDate()).toBe(1)

    const end = new Date(endDate)
    expect(end.getMonth()).toBe(0) // Still January
    expect(end.getDate()).toBe(31) // Last day of January
  })

  it('handles February correctly', () => {
    const { startDate, endDate } = getCohortDates('2026-02')

    const end = new Date(endDate)
    expect(end.getDate()).toBe(28) // 2026 is not a leap year
  })

  it('handles leap year February', () => {
    const { startDate, endDate } = getCohortDates('2024-02')

    const end = new Date(endDate)
    expect(end.getDate()).toBe(29) // 2024 is a leap year
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// CREATE COHORT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('createCohort', () => {
  it('creates full cohort object', () => {
    const cohort = createCohort('2026-01')

    expect(cohort.id).toBe('2026-01')
    expect(cohort.name).toBe('The Founders')
    expect(cohort.thematicName).toBe('The Founders')
    expect(cohort.startDate).toBeGreaterThan(0)
    expect(cohort.endDate).toBeGreaterThan(cohort.startDate)
  })

  it('creates cohort without thematic name', () => {
    const cohort = createCohort('2026-07')

    expect(cohort.id).toBe('2026-07')
    expect(cohort.name).toBe('The July 2026 Travelers')
    expect(cohort.thematicName).toBeUndefined()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// QUALITATIVE STANDING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Qualitative Standing', () => {
  it('returns new for small cohorts', () => {
    expect(getQualitativeStanding(95, 5)).toBe('new')
    expect(getQualitativeStanding(50, 9)).toBe('new')
  })

  it('returns leading for top 10%', () => {
    expect(getQualitativeStanding(90, 100)).toBe('leading')
    expect(getQualitativeStanding(95, 100)).toBe('leading')
  })

  it('returns ahead for top 33%', () => {
    expect(getQualitativeStanding(67, 100)).toBe('ahead')
    expect(getQualitativeStanding(89, 100)).toBe('ahead')
  })

  it('returns with_peers for middle 33%', () => {
    expect(getQualitativeStanding(33, 100)).toBe('with_peers')
    expect(getQualitativeStanding(66, 100)).toBe('with_peers')
  })

  it('returns developing for bottom 33%', () => {
    expect(getQualitativeStanding(0, 100)).toBe('developing')
    expect(getQualitativeStanding(32, 100)).toBe('developing')
  })
})

describe('Standing Description', () => {
  it('returns correct description for each standing', () => {
    expect(getStandingDescription('leading')).toContain('leaders')
    expect(getStandingDescription('ahead')).toContain('Ahead')
    expect(getStandingDescription('with_peers')).toContain('peers')
    expect(getStandingDescription('developing')).toContain('pace')
    expect(getStandingDescription('new')).toContain('beginning')
  })
})

describe('Standing Label', () => {
  it('returns correct label for each standing', () => {
    expect(getStandingLabel('leading')).toBe('Leading')
    expect(getStandingLabel('ahead')).toBe('Ahead')
    expect(getStandingLabel('with_peers')).toBe('With Peers')
    expect(getStandingLabel('developing')).toBe('Developing')
    expect(getStandingLabel('new')).toBe('New')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// LOCAL COMPARISON TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateLocalCohortComparison', () => {
  const now = new Date('2026-01-22').getTime() // 1 week after start

  it('returns correct cohort info', () => {
    const comparison = calculateLocalCohortComparison(
      makeInput(),
      0, // patternLevel
      0, // maxExpertiseLevel
      now
    )

    expect(comparison.cohortId).toBe('2026-01')
    expect(comparison.cohortName).toBe('The Founders')
  })

  it('calculates percentiles based on expected progression', () => {
    const comparison = calculateLocalCohortComparison(
      makeInput({
        totalOrbs: 10,
        charactersMet: 3,
        averageTrust: 2,
        arcsCompleted: 0,
        skillsDemonstrated: 1
      }),
      0.5, // patternLevel - at expected for week 1
      0.3, // maxExpertiseLevel - at expected for week 1
      now
    )

    // At expected progression should give ~50 percentile
    expect(comparison.playerMetrics.patternMasteryPercentile).toBeGreaterThan(40)
    expect(comparison.playerMetrics.patternMasteryPercentile).toBeLessThan(60)
  })

  it('returns higher percentiles for above-average progress', () => {
    const comparison = calculateLocalCohortComparison(
      makeInput({
        totalOrbs: 100,
        charactersMet: 10,
        averageTrust: 6,
        arcsCompleted: 3,
        skillsDemonstrated: 10
      }),
      2.0, // patternLevel - double expected
      1.5, // maxExpertiseLevel - high
      now
    )

    expect(comparison.playerMetrics.overallPercentile).toBeGreaterThan(60)
  })

  it('returns lower percentiles for below-average progress', () => {
    const comparison = calculateLocalCohortComparison(
      makeInput({
        totalOrbs: 5,
        charactersMet: 1,
        averageTrust: 1
      }),
      0.2, // patternLevel - low
      0.1, // maxExpertiseLevel - low
      now
    )

    expect(comparison.playerMetrics.overallPercentile).toBeLessThan(40)
  })

  it('assigns qualitative standing based on overall percentile', () => {
    const highPerformer = calculateLocalCohortComparison(
      makeInput({
        totalOrbs: 200,
        charactersMet: 15,
        averageTrust: 8,
        arcsCompleted: 5,
        skillsDemonstrated: 20
      }),
      4.0,
      4.0,
      now
    )

    expect(['leading', 'ahead']).toContain(highPerformer.qualitativeStanding)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Samuel Cohort Messages', () => {
  it('has messages for all standings', () => {
    const standings: QualitativeStanding[] = ['leading', 'ahead', 'with_peers', 'developing', 'new']

    for (const standing of standings) {
      expect(SAMUEL_COHORT_MESSAGES[standing]).toBeDefined()
      expect(SAMUEL_COHORT_MESSAGES[standing].length).toBeGreaterThan(0)
    }
  })

  it('getSamuelCohortMessage returns a string', () => {
    const standings: QualitativeStanding[] = ['leading', 'ahead', 'with_peers', 'developing', 'new']

    for (const standing of standings) {
      const message = getSamuelCohortMessage(standing)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY HELPER TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getCohortDisplayInfo', () => {
  it('returns display info for all standings', () => {
    const standings: QualitativeStanding[] = ['leading', 'ahead', 'with_peers', 'developing', 'new']

    for (const standing of standings) {
      const info = getCohortDisplayInfo(standing)
      expect(info.standing).toBe(standing)
      expect(info.label).toBeDefined()
      expect(info.description).toBeDefined()
      expect(info.colorToken).toBeDefined()
      expect(info.iconVariant).toBeDefined()
    }
  })

  it('returns amber color for leading', () => {
    const info = getCohortDisplayInfo('leading')
    expect(info.colorToken).toBe('amber')
  })
})

describe('formatPercentileDisplay', () => {
  it('formats high percentiles correctly', () => {
    expect(formatPercentileDisplay(95)).toBe('Top 10%')
    expect(formatPercentileDisplay(90)).toBe('Top 10%')
  })

  it('formats mid percentiles correctly', () => {
    expect(formatPercentileDisplay(80)).toBe('Top 25%')
    expect(formatPercentileDisplay(75)).toBe('Top 25%')
  })

  it('formats lower percentiles correctly', () => {
    expect(formatPercentileDisplay(60)).toBe('Top Half')
    expect(formatPercentileDisplay(50)).toBe('Top Half')
  })

  it('formats low percentiles correctly', () => {
    expect(formatPercentileDisplay(30)).toBe('Top 70%')
    expect(formatPercentileDisplay(10)).toBe('Top 90%')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('getCohortId completes in <1ms', () => {
    const timestamp = Date.now()

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      getCohortId(timestamp)
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(50) // 1000 calls in <50ms
  })

  it('calculateLocalCohortComparison completes in <5ms', () => {
    const input = makeInput({
      totalOrbs: 50,
      charactersMet: 5,
      averageTrust: 4,
      arcsCompleted: 1,
      skillsDemonstrated: 3
    })
    const now = Date.now()

    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      calculateLocalCohortComparison(input, 1.0, 0.5, now)
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100) // 100 calls in <100ms
  })
})
