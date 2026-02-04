/**
 * Challenge Rating Tests
 *
 * Tests for the JJK-inspired difficulty matching system.
 */

import { describe, it, expect } from 'vitest'
import {
  GRADE_DISPLAY,
  GRADES,
  MATCH_DISPLAY,
  calculateReadinessScore,
  getGradeForScore,
  getGradeIndex,
  calculatePlayerReadiness,
  getReadinessMatch,
  getSamuelGradeMessage,
  getSamuelMatchMessage,
  getRecommendedGrades,
  filterContentByReadiness
} from '@/lib/ranking/challenge-rating'
import type { ChallengeRatingInput } from '@/lib/ranking/challenge-rating'
import type { ChallengeGrade, ReadinessMatch } from '@/lib/ranking/types'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const makeInput = (overrides: Partial<ChallengeRatingInput> = {}): ChallengeRatingInput => ({
  patternMastery: 0,
  careerExpertise: 0,
  relationshipDepth: 0,
  skillBreadth: 0,
  ...overrides
})

// ═══════════════════════════════════════════════════════════════════════════
// GRADE DEFINITIONS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Grade Definitions', () => {
  it('has 5 grades in order', () => {
    expect(GRADES).toEqual(['D', 'C', 'B', 'A', 'S'])
  })

  it('all grades have display info', () => {
    for (const grade of GRADES) {
      expect(GRADE_DISPLAY[grade]).toBeDefined()
      expect(GRADE_DISPLAY[grade].name).toBeDefined()
      expect(GRADE_DISPLAY[grade].description).toBeDefined()
      expect(GRADE_DISPLAY[grade].minReadiness).toBeDefined()
    }
  })

  it('grade thresholds are increasing', () => {
    let prevThreshold = -1
    for (const grade of GRADES) {
      expect(GRADE_DISPLAY[grade].minReadiness).toBeGreaterThan(prevThreshold)
      prevThreshold = GRADE_DISPLAY[grade].minReadiness
    }
  })

  it('getGradeIndex returns correct indices', () => {
    expect(getGradeIndex('D')).toBe(0)
    expect(getGradeIndex('C')).toBe(1)
    expect(getGradeIndex('B')).toBe(2)
    expect(getGradeIndex('A')).toBe(3)
    expect(getGradeIndex('S')).toBe(4)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// READINESS SCORE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateReadinessScore', () => {
  it('returns 0 for zero input', () => {
    const score = calculateReadinessScore(makeInput())
    expect(score).toBe(0)
  })

  it('returns 100 for max input', () => {
    const score = calculateReadinessScore(makeInput({
      patternMastery: 100,
      careerExpertise: 100,
      relationshipDepth: 100,
      skillBreadth: 100
    }))
    expect(score).toBe(100)
  })

  it('calculates weighted average', () => {
    // 50 in all dimensions should give 50
    const score = calculateReadinessScore(makeInput({
      patternMastery: 50,
      careerExpertise: 50,
      relationshipDepth: 50,
      skillBreadth: 50
    }))
    expect(score).toBe(50)
  })

  it('respects dimension weights', () => {
    // Pattern mastery has highest weight (0.30)
    const highPattern = calculateReadinessScore(makeInput({
      patternMastery: 100,
      careerExpertise: 0,
      relationshipDepth: 0,
      skillBreadth: 0
    }))

    // Skill breadth has lowest weight (0.20)
    const highSkill = calculateReadinessScore(makeInput({
      patternMastery: 0,
      careerExpertise: 0,
      relationshipDepth: 0,
      skillBreadth: 100
    }))

    expect(highPattern).toBeGreaterThan(highSkill)
  })

  it('clamps score to 0-100', () => {
    const negative = calculateReadinessScore(makeInput({
      patternMastery: -50,
      careerExpertise: -50,
      relationshipDepth: -50,
      skillBreadth: -50
    }))
    expect(negative).toBe(0)

    const over = calculateReadinessScore(makeInput({
      patternMastery: 200,
      careerExpertise: 200,
      relationshipDepth: 200,
      skillBreadth: 200
    }))
    expect(over).toBe(100)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// GRADE CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getGradeForScore', () => {
  it('returns D for 0-24', () => {
    expect(getGradeForScore(0)).toBe('D')
    expect(getGradeForScore(24)).toBe('D')
  })

  it('returns C for 25-49', () => {
    expect(getGradeForScore(25)).toBe('C')
    expect(getGradeForScore(49)).toBe('C')
  })

  it('returns B for 50-74', () => {
    expect(getGradeForScore(50)).toBe('B')
    expect(getGradeForScore(74)).toBe('B')
  })

  it('returns A for 75-89', () => {
    expect(getGradeForScore(75)).toBe('A')
    expect(getGradeForScore(89)).toBe('A')
  })

  it('returns S for 90+', () => {
    expect(getGradeForScore(90)).toBe('S')
    expect(getGradeForScore(100)).toBe('S')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PLAYER READINESS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculatePlayerReadiness', () => {
  it('returns complete readiness state', () => {
    const readiness = calculatePlayerReadiness(makeInput({
      patternMastery: 30,
      careerExpertise: 40,
      relationshipDepth: 35,
      skillBreadth: 25
    }))

    expect(readiness.grade).toBeDefined()
    expect(readiness.gradeName).toBeDefined()
    expect(readiness.percentToNext).toBeDefined()
    expect(readiness.dimensions).toBeDefined()
  })

  it('includes rounded dimension values', () => {
    const readiness = calculatePlayerReadiness(makeInput({
      patternMastery: 33.33,
      careerExpertise: 66.66,
      relationshipDepth: 50,
      skillBreadth: 75
    }))

    expect(readiness.dimensions.patternMastery).toBe(33)
    expect(readiness.dimensions.careerExpertise).toBe(67)
    expect(readiness.dimensions.relationshipDepth).toBe(50)
    expect(readiness.dimensions.skillBreadth).toBe(75)
  })

  it('grade matches score thresholds', () => {
    const d = calculatePlayerReadiness(makeInput({ patternMastery: 0 }))
    expect(d.grade).toBe('D')

    const s = calculatePlayerReadiness(makeInput({
      patternMastery: 100, careerExpertise: 100,
      relationshipDepth: 100, skillBreadth: 100
    }))
    expect(s.grade).toBe('S')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// READINESS MATCH TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getReadinessMatch', () => {
  it('returns perfect for same grade', () => {
    expect(getReadinessMatch('B', 'B')).toBe('perfect')
    expect(getReadinessMatch('S', 'S')).toBe('perfect')
  })

  it('returns comfortable for content 1 below player', () => {
    expect(getReadinessMatch('B', 'C')).toBe('comfortable')
    expect(getReadinessMatch('A', 'B')).toBe('comfortable')
  })

  it('returns challenging for content 1 above player', () => {
    expect(getReadinessMatch('C', 'B')).toBe('challenging')
    expect(getReadinessMatch('B', 'A')).toBe('challenging')
  })

  it('returns overreach for content 2+ above player', () => {
    expect(getReadinessMatch('D', 'B')).toBe('overreach')
    expect(getReadinessMatch('C', 'S')).toBe('overreach')
  })

  it('returns trivial for content 2+ below player', () => {
    expect(getReadinessMatch('A', 'C')).toBe('trivial')
    expect(getReadinessMatch('S', 'C')).toBe('trivial')
  })

  it('all match types have display info', () => {
    const matchTypes: ReadinessMatch[] = ['perfect', 'comfortable', 'challenging', 'overreach', 'trivial']
    for (const match of matchTypes) {
      expect(MATCH_DISPLAY[match]).toBeDefined()
      expect(MATCH_DISPLAY[match].label).toBeDefined()
      expect(MATCH_DISPLAY[match].recommended).toBeDefined()
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Samuel Messages', () => {
  it('getSamuelGradeMessage returns string for all grades', () => {
    for (const grade of GRADES) {
      const message = getSamuelGradeMessage(grade)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })

  it('getSamuelMatchMessage returns string for all matches', () => {
    const matches: ReadinessMatch[] = ['perfect', 'comfortable', 'challenging', 'overreach', 'trivial']
    for (const match of matches) {
      const message = getSamuelMatchMessage(match)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT RECOMMENDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Content Recommendation', () => {
  it('getRecommendedGrades returns same and adjacent grades', () => {
    const forB = getRecommendedGrades('B')
    expect(forB).toContain('B') // same
    expect(forB).toContain('C') // one below
    expect(forB).toContain('A') // one above
    expect(forB).not.toContain('D')
    expect(forB).not.toContain('S')
  })

  it('getRecommendedGrades handles edge cases', () => {
    // Lowest grade
    const forD = getRecommendedGrades('D')
    expect(forD).toContain('D')
    expect(forD).toContain('C')
    expect(forD.length).toBe(2)

    // Highest grade
    const forS = getRecommendedGrades('S')
    expect(forS).toContain('S')
    expect(forS).toContain('A')
    expect(forS.length).toBe(2)
  })

  it('filterContentByReadiness filters correctly', () => {
    const content = [
      { id: 1, grade: 'D' as ChallengeGrade },
      { id: 2, grade: 'C' as ChallengeGrade },
      { id: 3, grade: 'B' as ChallengeGrade },
      { id: 4, grade: 'A' as ChallengeGrade },
      { id: 5, grade: 'S' as ChallengeGrade }
    ]

    // For B player: should get C, B, A
    const forB = filterContentByReadiness(content, 'B')
    expect(forB.map(c => c.id)).toEqual([2, 3, 4])

    // For D player: should get D, C
    const forD = filterContentByReadiness(content, 'D')
    expect(forD.map(c => c.id)).toEqual([1, 2])
  })

  it('filterContentByReadiness can include overreach', () => {
    const content = [
      { id: 1, grade: 'D' as ChallengeGrade },
      { id: 2, grade: 'A' as ChallengeGrade },
      { id: 3, grade: 'S' as ChallengeGrade }
    ]

    // For D player with overreach allowed: exclude trivial only (none here)
    const withOverreach = filterContentByReadiness(content, 'D', true)
    expect(withOverreach.length).toBe(3) // Includes A and S as overreach
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('calculatePlayerReadiness completes in <1ms', () => {
    const input = makeInput({
      patternMastery: 65,
      careerExpertise: 45,
      relationshipDepth: 55,
      skillBreadth: 40
    })

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      calculatePlayerReadiness(input)
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100) // 1000 calls in <100ms
  })
})
