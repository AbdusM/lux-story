/**
 * Cohort System Module
 *
 * Claymore-inspired generational grouping for peer comparison.
 * Players are grouped by month of first play for privacy-preserving comparison.
 *
 * @module lib/ranking/cohorts
 */

import { randomPick } from '@/lib/seeded-random'

// Types available from './types' if needed for future enhancements

// ═══════════════════════════════════════════════════════════════════════════
// COHORT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cohort definition
 */
export interface Cohort {
  /** Cohort identifier (e.g., "2026-01") */
  id: string
  /** Display name (e.g., "The January 2026 Travelers") */
  name: string
  /** Start timestamp */
  startDate: number
  /** End timestamp */
  endDate: number
  /** Optional special name for notable cohorts */
  thematicName?: string
}

/**
 * Qualitative standing within cohort
 */
export type QualitativeStanding =
  | 'leading'      // Top 10%
  | 'ahead'        // Top 33%
  | 'with_peers'   // Middle 33%
  | 'developing'   // Bottom 33%
  | 'new'          // Insufficient data

/**
 * Player metrics within cohort
 */
export interface PlayerCohortMetrics {
  patternMasteryPercentile: number
  careerExpertisePercentile: number
  stationStandingPercentile: number
  engagementPercentile: number
  overallPercentile: number
}

/**
 * Full cohort comparison result
 */
export interface CohortComparison {
  cohortId: string
  cohortName: string
  playerMetrics: PlayerCohortMetrics
  qualitativeStanding: QualitativeStanding
}

/**
 * Aggregated cohort statistics (privacy-preserving)
 */
export interface CohortStatistics {
  cohortId: string
  memberCount: number
  averagePatternLevel: number
  averageExpertiseLevel: number
  averageMeritPoints: number
  averageCharactersMet: number
  lastUpdated: number
}

/**
 * Input for local cohort calculation
 */
export interface LocalCohortInput {
  createdAt: number
  totalOrbs: number
  charactersMet: number
  averageTrust: number
  arcsCompleted: number
  skillsDemonstrated: number
}

// ═══════════════════════════════════════════════════════════════════════════
// COHORT ID & NAMING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Special cohort names for notable periods
 */
export const SPECIAL_COHORT_NAMES: Record<string, string> = {
  '2026-01': 'The Founders',
  '2026-02': 'The Pioneers',
  '2026-03': 'The Trailblazers'
}

/**
 * Generate cohort ID from timestamp
 */
export function getCohortId(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Generate cohort name from ID
 */
export function getCohortName(cohortId: string): string {
  // Check for special names first
  if (SPECIAL_COHORT_NAMES[cohortId]) {
    return SPECIAL_COHORT_NAMES[cohortId]
  }

  const [year, month] = cohortId.split('-')
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const monthName = monthNames[parseInt(month) - 1]
  return `The ${monthName} ${year} Travelers`
}

/**
 * Get cohort start and end dates
 */
export function getCohortDates(cohortId: string): { startDate: number; endDate: number } {
  const [year, month] = cohortId.split('-').map(Number)
  const startDate = new Date(year, month - 1, 1).getTime()
  const endDate = new Date(year, month, 0, 23, 59, 59, 999).getTime()
  return { startDate, endDate }
}

/**
 * Create full cohort object from ID
 */
export function createCohort(cohortId: string): Cohort {
  const { startDate, endDate } = getCohortDates(cohortId)
  return {
    id: cohortId,
    name: getCohortName(cohortId),
    startDate,
    endDate,
    thematicName: SPECIAL_COHORT_NAMES[cohortId]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// QUALITATIVE STANDING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get qualitative standing from percentile
 */
export function getQualitativeStanding(
  percentile: number,
  memberCount: number
): QualitativeStanding {
  if (memberCount < 10) return 'new'
  if (percentile >= 90) return 'leading'
  if (percentile >= 67) return 'ahead'
  if (percentile >= 33) return 'with_peers'
  return 'developing'
}

/**
 * Get description for qualitative standing
 */
export function getStandingDescription(standing: QualitativeStanding): string {
  const descriptions: Record<QualitativeStanding, string> = {
    leading: 'Among the leaders of your generation',
    ahead: 'Ahead of most in your cohort',
    with_peers: 'Progressing with your peers',
    developing: 'Finding your path at your own pace',
    new: 'Just beginning your journey'
  }
  return descriptions[standing]
}

/**
 * Get display label for standing
 */
export function getStandingLabel(standing: QualitativeStanding): string {
  const labels: Record<QualitativeStanding, string> = {
    leading: 'Leading',
    ahead: 'Ahead',
    with_peers: 'With Peers',
    developing: 'Developing',
    new: 'New'
  }
  return labels[standing]
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCAL PERCENTILE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Expected progression by weeks since start
 * Used for local-only percentile estimation
 */
const EXPECTED_PROGRESSION: Record<number, {
  patternLevel: number
  expertiseLevel: number
  meritPoints: number
  charactersMet: number
}> = {
  1: { patternLevel: 0.5, expertiseLevel: 0.3, meritPoints: 15, charactersMet: 3 },
  2: { patternLevel: 1.0, expertiseLevel: 0.8, meritPoints: 40, charactersMet: 5 },
  4: { patternLevel: 1.5, expertiseLevel: 1.5, meritPoints: 75, charactersMet: 8 },
  8: { patternLevel: 2.5, expertiseLevel: 2.5, meritPoints: 120, charactersMet: 12 },
  12: { patternLevel: 3.0, expertiseLevel: 3.5, meritPoints: 180, charactersMet: 15 }
}

/**
 * Get expected progression for elapsed weeks
 */
function getExpectedProgression(weeksElapsed: number): {
  patternLevel: number
  expertiseLevel: number
  meritPoints: number
  charactersMet: number
} {
  // Find the closest progression milestone
  const milestones = [1, 2, 4, 8, 12]
  const milestone = milestones.reduce((prev, curr) =>
    Math.abs(curr - weeksElapsed) < Math.abs(prev - weeksElapsed) ? curr : prev
  )
  return EXPECTED_PROGRESSION[milestone]
}

/**
 * Compare player value to expected and return percentile
 */
function compareToExpected(playerValue: number, expectedValue: number): number {
  if (expectedValue === 0) return 50

  const ratio = playerValue / expectedValue

  // Convert ratio to percentile using sigmoid-like curve
  // ratio = 1.0 -> 50th percentile
  // ratio = 2.0 -> ~85th percentile
  // ratio = 0.5 -> ~15th percentile
  const percentile = 100 / (1 + Math.exp(-2 * (ratio - 1)))

  return Math.round(Math.max(0, Math.min(100, percentile)))
}

/**
 * Calculate simple merit points estimate from input
 */
function estimateMeritPoints(input: LocalCohortInput): number {
  return Math.round(
    input.totalOrbs * 0.5 +
    input.charactersMet * 2 +
    input.charactersMet * input.averageTrust * 0.5 +
    input.arcsCompleted * 5 +
    input.skillsDemonstrated * 1
  )
}

/**
 * Calculate local cohort comparison (offline mode)
 */
export function calculateLocalCohortComparison(
  input: LocalCohortInput,
  patternLevel: number,
  maxExpertiseLevel: number,
  now: number = Date.now()
): CohortComparison {
  const cohortId = getCohortId(input.createdAt)
  const cohortName = getCohortName(cohortId)

  const weeksElapsed = Math.floor((now - input.createdAt) / (7 * 24 * 60 * 60 * 1000))
  const expected = getExpectedProgression(Math.max(1, weeksElapsed))

  const patternMasteryPercentile = compareToExpected(patternLevel, expected.patternLevel)
  const careerExpertisePercentile = compareToExpected(maxExpertiseLevel, expected.expertiseLevel)
  const meritPoints = estimateMeritPoints(input)
  const stationStandingPercentile = compareToExpected(meritPoints, expected.meritPoints)
  const engagementPercentile = compareToExpected(input.charactersMet, expected.charactersMet)

  const overallPercentile = Math.round(
    patternMasteryPercentile * 0.25 +
    careerExpertisePercentile * 0.25 +
    stationStandingPercentile * 0.25 +
    engagementPercentile * 0.25
  )

  // Local mode always assumes sufficient member count for standing calculation
  const qualitativeStanding = getQualitativeStanding(overallPercentile, 100)

  return {
    cohortId,
    cohortName,
    playerMetrics: {
      patternMasteryPercentile,
      careerExpertisePercentile,
      stationStandingPercentile,
      engagementPercentile,
      overallPercentile
    },
    qualitativeStanding
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

export const SAMUEL_COHORT_MESSAGES: Record<QualitativeStanding, string[]> = {
  leading: [
    "You're among the leaders of your generation. Remarkable.",
    "Few from your cohort have achieved what you have."
  ],
  ahead: [
    "You're ahead of most who started when you did.",
    "Your generation watches your progress with interest."
  ],
  with_peers: [
    "You're growing alongside your peers. That's meaningful.",
    "Together with your cohort, you're finding the way."
  ],
  developing: [
    "Everyone finds their path at their own pace.",
    "The station has seen many journeys. Yours unfolds as it should."
  ],
  new: [
    "Your generation is just beginning. Much awaits.",
    "A new cohort, full of potential. Welcome."
  ]
}

/**
 * Get Samuel's message about cohort standing
 */
export function getSamuelCohortMessage(standing: QualitativeStanding): string {
  const messages = SAMUEL_COHORT_MESSAGES[standing]
  return randomPick(messages)!
}

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export interface CohortDisplayInfo {
  standing: QualitativeStanding
  label: string
  description: string
  colorToken: string
  iconVariant: string
}

/**
 * Get display info for qualitative standing
 */
export function getCohortDisplayInfo(standing: QualitativeStanding): CohortDisplayInfo {
  const displayMap: Record<QualitativeStanding, Omit<CohortDisplayInfo, 'standing'>> = {
    leading: {
      label: 'Leading',
      description: 'Among the leaders of your generation',
      colorToken: 'amber',
      iconVariant: 'star'
    },
    ahead: {
      label: 'Ahead',
      description: 'Ahead of most in your cohort',
      colorToken: 'green',
      iconVariant: 'trending-up'
    },
    with_peers: {
      label: 'With Peers',
      description: 'Progressing with your peers',
      colorToken: 'blue',
      iconVariant: 'users'
    },
    developing: {
      label: 'Developing',
      description: 'Finding your path at your own pace',
      colorToken: 'slate',
      iconVariant: 'compass'
    },
    new: {
      label: 'New',
      description: 'Just beginning your journey',
      colorToken: 'slate',
      iconVariant: 'sparkles'
    }
  }

  return {
    standing,
    ...displayMap[standing]
  }
}

/**
 * Format percentile for display
 */
export function formatPercentileDisplay(percentile: number): string {
  if (percentile >= 90) return 'Top 10%'
  if (percentile >= 75) return 'Top 25%'
  if (percentile >= 50) return 'Top Half'
  return `Top ${100 - percentile}%`
}
