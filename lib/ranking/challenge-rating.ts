/**
 * Challenge Rating Module
 *
 * JJK-inspired difficulty matching system.
 * Calculates player readiness based on multiple progression dimensions.
 *
 * @module lib/ranking/challenge-rating
 */

import type {
  ChallengeGrade,
  ReadinessMatch,
  PlayerReadiness
} from './types'
import { getTierForPoints, calculateProgress } from './registry'

// ═══════════════════════════════════════════════════════════════════════════
// INPUT INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input for challenge rating calculation
 * Each dimension is a 0-100 score
 */
export interface ChallengeRatingInput {
  /** Pattern mastery score (0-100, from total orbs / max orbs) */
  patternMastery: number
  /** Career expertise score (0-100, from expertise points / max points) */
  careerExpertise: number
  /** Relationship depth score (0-100, from avg trust / max trust) */
  relationshipDepth: number
  /** Skill breadth score (0-100, from demonstrated skills / total skills) */
  skillBreadth: number
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Challenge grade display info
 */
export interface GradeDisplayInfo {
  grade: ChallengeGrade
  name: string
  description: string
  colorToken: string
  minReadiness: number
}

export const GRADE_DISPLAY: Record<ChallengeGrade, GradeDisplayInfo> = {
  D: {
    grade: 'D',
    name: 'Grade D',
    description: 'Starting your journey. Safe paths ahead.',
    colorToken: 'slate',
    minReadiness: 0
  },
  C: {
    grade: 'C',
    name: 'Grade C',
    description: 'Finding your footing. Standard challenges.',
    colorToken: 'blue',
    minReadiness: 25
  },
  B: {
    grade: 'B',
    name: 'Grade B',
    description: 'Growing stronger. Meaningful tests ahead.',
    colorToken: 'green',
    minReadiness: 50
  },
  A: {
    grade: 'A',
    name: 'Grade A',
    description: 'Near mastery. Complex paths open.',
    colorToken: 'purple',
    minReadiness: 75
  },
  S: {
    grade: 'S',
    name: 'Grade S',
    description: 'Ready for anything. The station salutes you.',
    colorToken: 'amber',
    minReadiness: 90
  }
}

/**
 * All grades in order
 */
export const GRADES: ChallengeGrade[] = ['D', 'C', 'B', 'A', 'S']

// ═══════════════════════════════════════════════════════════════════════════
// READINESS CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dimension weights for overall readiness calculation
 * Total = 1.0
 */
const DIMENSION_WEIGHTS = {
  patternMastery: 0.30,
  careerExpertise: 0.25,
  relationshipDepth: 0.25,
  skillBreadth: 0.20
}

/**
 * Calculate overall readiness score (0-100)
 */
export function calculateReadinessScore(input: ChallengeRatingInput): number {
  const score =
    input.patternMastery * DIMENSION_WEIGHTS.patternMastery +
    input.careerExpertise * DIMENSION_WEIGHTS.careerExpertise +
    input.relationshipDepth * DIMENSION_WEIGHTS.relationshipDepth +
    input.skillBreadth * DIMENSION_WEIGHTS.skillBreadth

  return Math.min(100, Math.max(0, Math.round(score)))
}

/**
 * Get grade for a readiness score
 */
export function getGradeForScore(score: number): ChallengeGrade {
  if (score >= 90) return 'S'
  if (score >= 75) return 'A'
  if (score >= 50) return 'B'
  if (score >= 25) return 'C'
  return 'D'
}

/**
 * Get grade index for comparison (D=0, C=1, B=2, A=3, S=4)
 */
export function getGradeIndex(grade: ChallengeGrade): number {
  return GRADES.indexOf(grade)
}

/**
 * Calculate full player readiness state
 */
export function calculatePlayerReadiness(input: ChallengeRatingInput): PlayerReadiness {
  const score = calculateReadinessScore(input)
  const grade = getGradeForScore(score)
  const tier = getTierForPoints('challenge_rating', score)
  const progress = calculateProgress('challenge_rating', score)

  return {
    grade,
    gradeName: tier.name,
    percentToNext: progress.percent,
    dimensions: {
      patternMastery: Math.round(input.patternMastery),
      careerExpertise: Math.round(input.careerExpertise),
      relationshipDepth: Math.round(input.relationshipDepth),
      skillBreadth: Math.round(input.skillBreadth)
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT MATCHING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine how well content matches player readiness
 */
export function getReadinessMatch(
  playerGrade: ChallengeGrade,
  contentGrade: ChallengeGrade
): ReadinessMatch {
  const playerIdx = getGradeIndex(playerGrade)
  const contentIdx = getGradeIndex(contentGrade)
  const diff = contentIdx - playerIdx

  if (diff === 0) return 'perfect'
  if (diff === -1) return 'comfortable'
  if (diff === 1) return 'challenging'
  if (diff >= 2) return 'overreach'
  return 'trivial' // diff <= -2
}

/**
 * Match display info
 */
export interface MatchDisplayInfo {
  label: string
  description: string
  colorToken: string
  recommended: boolean
}

export const MATCH_DISPLAY: Record<ReadinessMatch, MatchDisplayInfo> = {
  perfect: {
    label: 'Perfect Match',
    description: 'This content matches your current level exactly.',
    colorToken: 'green',
    recommended: true
  },
  comfortable: {
    label: 'Comfortable',
    description: 'Slightly below your level. A relaxing challenge.',
    colorToken: 'blue',
    recommended: true
  },
  challenging: {
    label: 'Challenging',
    description: 'Slightly above your level. Growth opportunity.',
    colorToken: 'amber',
    recommended: true
  },
  overreach: {
    label: 'Overreach',
    description: 'Well above your current level. Consider building more experience first.',
    colorToken: 'red',
    recommended: false
  },
  trivial: {
    label: 'Trivial',
    description: 'Well below your level. Limited growth potential.',
    colorToken: 'slate',
    recommended: false
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

export const SAMUEL_GRADE_MESSAGES: Record<ChallengeGrade, string[]> = {
  D: [
    "Every journey begins with a single step.",
    "Take your time. The station isn't going anywhere."
  ],
  C: [
    "You're finding your rhythm here.",
    "Standard paths are opening up to you."
  ],
  B: [
    "I've seen your kind before. Growing stronger each day.",
    "Meaningful challenges await you now."
  ],
  A: [
    "Few travelers reach this level of readiness.",
    "Complex paths open to those who are ready."
  ],
  S: [
    "The station recognizes true readiness. You have it.",
    "Ready for anything. That's rare."
  ]
}

/**
 * Get Samuel's message for a grade
 */
export function getSamuelGradeMessage(grade: ChallengeGrade): string {
  const messages = SAMUEL_GRADE_MESSAGES[grade]
  return messages[Math.floor(Math.random() * messages.length)]
}

export const SAMUEL_MATCH_MESSAGES: Record<ReadinessMatch, string> = {
  perfect: "This path suits you well. Trust your instincts.",
  comfortable: "An easier road, but still worthwhile.",
  challenging: "A stretch, but growth requires reaching.",
  overreach: "Careful. Some paths aren't ready for you yet.",
  trivial: "You've outgrown this. Seek greater challenges."
}

/**
 * Get Samuel's message for a content match
 */
export function getSamuelMatchMessage(match: ReadinessMatch): string {
  return SAMUEL_MATCH_MESSAGES[match]
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT RECOMMENDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get recommended content grades for a player
 */
export function getRecommendedGrades(playerGrade: ChallengeGrade): ChallengeGrade[] {
  const playerIdx = getGradeIndex(playerGrade)
  const recommended: ChallengeGrade[] = []

  // Include same grade (perfect)
  recommended.push(playerGrade)

  // Include one below if available (comfortable)
  if (playerIdx > 0) {
    recommended.push(GRADES[playerIdx - 1])
  }

  // Include one above if available (challenging)
  if (playerIdx < GRADES.length - 1) {
    recommended.push(GRADES[playerIdx + 1])
  }

  return recommended
}

/**
 * Filter content by recommended difficulty
 */
export function filterContentByReadiness<T extends { grade: ChallengeGrade }>(
  content: T[],
  playerGrade: ChallengeGrade,
  includeOverreach: boolean = false
): T[] {
  const recommended = getRecommendedGrades(playerGrade)

  return content.filter(item => {
    if (recommended.includes(item.grade)) return true
    if (includeOverreach) {
      const match = getReadinessMatch(playerGrade, item.grade)
      return match !== 'trivial' // Exclude only trivial content
    }
    return false
  })
}
