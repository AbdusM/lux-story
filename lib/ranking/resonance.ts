/**
 * Cross-System Resonance Module
 *
 * Integration layer where ranking systems amplify each other.
 * Creates emergent gameplay through system interactions.
 *
 * @module lib/ranking/resonance
 */

import { randomPick } from '@/lib/seeded-random'
import type { RankCategory } from './types'
import type { QualitativeStanding } from './cohorts'

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cross-system resonance types - how ranking systems amplify each other
 */
export type ResonanceType =
  | 'pattern_expertise'     // Pattern mastery → Career expertise boost
  | 'expertise_standing'    // Career expertise → Station standing boost
  | 'standing_challenge'    // Station standing → Challenge rating adjustment
  | 'challenge_stars'       // Challenge success → Skill stars contribution
  | 'stars_elite'           // Skill stars → Elite status acceleration
  | 'elite_mastery'         // Elite status → Pattern mastery depth
  | 'assessment_expertise'  // Assessment success → Expertise validation
  | 'cohort_standing'       // Cohort position → Standing visibility

/**
 * All resonance types
 */
export const RESONANCE_TYPES: ResonanceType[] = [
  'pattern_expertise',
  'expertise_standing',
  'standing_challenge',
  'challenge_stars',
  'stars_elite',
  'elite_mastery',
  'assessment_expertise',
  'cohort_standing'
]

/**
 * Resonance bonus definition
 */
export interface ResonanceBonus {
  type: ResonanceType
  sourceSystem: RankCategory | 'assessment' | 'cohort'
  targetSystem: RankCategory
  multiplier: number        // 1.0 = no bonus, 1.25 = 25% bonus
  sourceMinLevel: number    // Minimum level in source system
  description: string
  samuelQuote?: string
}

/**
 * Resonance event definition
 */
export interface ResonanceEvent {
  id: string
  name: string
  description: string
  requiredResonances: ResonanceType[]
  reward: ResonanceEventReward
  samuelCommentary: string
}

/**
 * Resonance event reward
 */
export interface ResonanceEventReward {
  type: 'pattern_bonus' | 'expertise_bonus' | 'merit_bonus' | 'flag'
  value: number | string
}

/**
 * Input for resonance calculation
 */
export interface ResonanceInput {
  // Pattern Mastery
  patternMasteryLevel: number

  // Career Expertise
  maxExpertiseLevel: number
  hasChampion: boolean

  // Station Standing (level based on tier)
  stationStandingLevel: number

  // Challenge Rating
  challengeGradeIndex: number
  hasChallengeOvercome: boolean

  // Skill Stars
  totalStars: number

  // Elite Status
  unlockedDesignationCount: number

  // Assessment
  hasAssessmentComplete: boolean
  hasCrossroadsComplete: boolean

  // Cohort
  cohortStanding: QualitativeStanding
}

/**
 * Active resonance state
 */
export interface ResonanceState {
  activeResonances: ResonanceBonus[]
  pendingEvents: ResonanceEvent[]
  completedEventIds: string[]
  totalMultiplier: number
}

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Resonance bonus registry
 */
export const RESONANCE_BONUSES: ResonanceBonus[] = [
  {
    type: 'pattern_expertise',
    sourceSystem: 'pattern_mastery',
    targetSystem: 'career_expertise',
    multiplier: 1.15,
    sourceMinLevel: 2,  // Regular rank
    description: 'Your pattern awareness accelerates career learning',
    samuelQuote: "The patterns you see... they make learning faster."
  },

  {
    type: 'expertise_standing',
    sourceSystem: 'career_expertise',
    targetSystem: 'station_standing',
    multiplier: 1.20,
    sourceMinLevel: 3,  // Practitioner level
    description: 'Your expertise earns recognition at the station',
    samuelQuote: "Expertise speaks. The station listens."
  },

  {
    type: 'standing_challenge',
    sourceSystem: 'station_standing',
    targetSystem: 'challenge_rating',
    multiplier: 1.10,
    sourceMinLevel: 2,  // Established standing
    description: 'Your reputation opens doors to greater challenges',
    samuelQuote: "Reputation opens doors. What you do with them is up to you."
  },

  {
    type: 'challenge_stars',
    sourceSystem: 'challenge_rating',
    targetSystem: 'skill_stars',
    multiplier: 1.15,
    sourceMinLevel: 3,  // Grade 3+
    description: 'Overcoming challenges reveals your true contributions',
    samuelQuote: "Challenges overcome become stars earned."
  },

  {
    type: 'stars_elite',
    sourceSystem: 'skill_stars',
    targetSystem: 'elite_status',
    multiplier: 1.25,
    sourceMinLevel: 6,  // 6+ total stars
    description: 'Your contributions mark you for elite recognition',
    samuelQuote: "Stars guide the way to elite standing."
  },

  {
    type: 'elite_mastery',
    sourceSystem: 'elite_status',
    targetSystem: 'pattern_mastery',
    multiplier: 1.20,
    sourceMinLevel: 1,  // Any elite status
    description: 'Elite experience deepens your pattern understanding',
    samuelQuote: "The elite see patterns others miss."
  },

  {
    type: 'assessment_expertise',
    sourceSystem: 'assessment',
    targetSystem: 'career_expertise',
    multiplier: 1.15,
    sourceMinLevel: 1,  // Assessment complete
    description: 'Assessment success validates your career growth',
    samuelQuote: "The trials weren't just tests. They were catalysts."
  },

  {
    type: 'cohort_standing',
    sourceSystem: 'cohort',
    targetSystem: 'station_standing',
    multiplier: 1.10,
    sourceMinLevel: 4,  // Leading cohort (mapped from 'leading')
    description: 'Leading your generation amplifies your station presence',
    samuelQuote: "Your generation watches. Lead well."
  }
]

/**
 * Resonance events registry
 */
export const RESONANCE_EVENTS: ResonanceEvent[] = [
  {
    id: 'harmonic_convergence',
    name: 'Harmonic Convergence',
    description: 'Three or more systems resonate simultaneously',
    requiredResonances: ['pattern_expertise', 'expertise_standing', 'standing_challenge'],
    reward: {
      type: 'pattern_bonus',
      value: 2
    },
    samuelCommentary: "The systems are singing together now. That doesn't happen often."
  },

  {
    id: 'elite_resonance',
    name: 'Elite Resonance',
    description: 'Elite status creates ripples across all systems',
    requiredResonances: ['elite_mastery', 'stars_elite'],
    reward: {
      type: 'merit_bonus',
      value: 25
    },
    samuelCommentary: "When you master multiple domains at the elite level... the station itself responds."
  },

  {
    id: 'assessment_amplification',
    name: 'Assessment Amplification',
    description: 'Assessment success amplifies career growth',
    requiredResonances: ['assessment_expertise'],
    reward: {
      type: 'expertise_bonus',
      value: 5
    },
    samuelCommentary: "The trials weren't just tests. They were catalysts."
  },

  {
    id: 'generational_echo',
    name: 'Generational Echo',
    description: 'Leading your cohort creates lasting impact',
    requiredResonances: ['cohort_standing', 'pattern_expertise'],
    reward: {
      type: 'flag',
      value: 'generational_leader'
    },
    samuelCommentary: "Your generation will remember you. That's not something I say lightly."
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map cohort standing to numeric level
 */
function getCohortStandingLevel(standing: QualitativeStanding): number {
  const levels: Record<QualitativeStanding, number> = {
    leading: 4,
    ahead: 3,
    with_peers: 2,
    developing: 1,
    new: 0
  }
  return levels[standing]
}

/**
 * Check if a resonance bonus is active
 */
export function isResonanceActive(bonus: ResonanceBonus, input: ResonanceInput): boolean {
  switch (bonus.type) {
    case 'pattern_expertise':
      return input.patternMasteryLevel >= bonus.sourceMinLevel

    case 'expertise_standing':
      return input.maxExpertiseLevel >= bonus.sourceMinLevel

    case 'standing_challenge':
      return input.stationStandingLevel >= bonus.sourceMinLevel

    case 'challenge_stars':
      return input.challengeGradeIndex >= bonus.sourceMinLevel &&
             input.hasChallengeOvercome

    case 'stars_elite':
      return input.totalStars >= bonus.sourceMinLevel

    case 'elite_mastery':
      return input.unlockedDesignationCount >= bonus.sourceMinLevel

    case 'assessment_expertise':
      return input.hasAssessmentComplete

    case 'cohort_standing':
      return getCohortStandingLevel(input.cohortStanding) >= bonus.sourceMinLevel

    default:
      return false
  }
}

/**
 * Get all active resonance bonuses
 */
export function getActiveResonances(input: ResonanceInput): ResonanceBonus[] {
  return RESONANCE_BONUSES.filter(bonus => isResonanceActive(bonus, input))
}

/**
 * Get total multiplier for a target system
 */
export function getResonanceMultiplier(
  targetSystem: RankCategory,
  input: ResonanceInput
): number {
  const activeResonances = getActiveResonances(input)
  const relevantBonuses = activeResonances.filter(
    bonus => bonus.targetSystem === targetSystem
  )

  if (relevantBonuses.length === 0) return 1.0

  // Multiplicative stacking (diminishing returns)
  return relevantBonuses.reduce(
    (total, bonus) => total * bonus.multiplier,
    1.0
  )
}

/**
 * Get multipliers for all target systems
 */
export function getAllResonanceMultipliers(input: ResonanceInput): Record<RankCategory, number> {
  const categories: RankCategory[] = [
    'pattern_mastery',
    'career_expertise',
    'challenge_rating',
    'station_standing',
    'skill_stars',
    'elite_status'
  ]

  return categories.reduce((acc, category) => {
    acc[category] = getResonanceMultiplier(category, input)
    return acc
  }, {} as Record<RankCategory, number>)
}

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE EVENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check for triggered resonance events
 */
export function checkResonanceEvents(
  input: ResonanceInput,
  completedEventIds: string[]
): ResonanceEvent[] {
  const activeResonances = getActiveResonances(input)
  const activeTypes = new Set(activeResonances.map(r => r.type))

  return RESONANCE_EVENTS.filter(event => {
    // Skip completed events
    if (completedEventIds.includes(event.id)) return false

    // Check all required resonances are active
    return event.requiredResonances.every(type => activeTypes.has(type))
  })
}

/**
 * Get a resonance event by ID
 */
export function getResonanceEventById(eventId: string): ResonanceEvent | undefined {
  return RESONANCE_EVENTS.find(e => e.id === eventId)
}

// ═══════════════════════════════════════════════════════════════════════════
// RESONANCE STATE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate full resonance state
 */
export function calculateResonanceState(
  input: ResonanceInput,
  completedEventIds: string[] = []
): ResonanceState {
  const activeResonances = getActiveResonances(input)
  const pendingEvents = checkResonanceEvents(input, completedEventIds)

  // Calculate total multiplier (product of all active)
  const totalMultiplier = activeResonances.reduce(
    (total, bonus) => total * bonus.multiplier,
    1.0
  )

  return {
    activeResonances,
    pendingEvents,
    completedEventIds,
    totalMultiplier
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Resonance display info
 */
export interface ResonanceDisplayInfo {
  type: ResonanceType
  name: string
  description: string
  bonusPercent: number
  sourceLabel: string
  targetLabel: string
  samuelQuote?: string
}

/**
 * Display names for resonance types
 */
const RESONANCE_TYPE_NAMES: Record<ResonanceType, string> = {
  pattern_expertise: 'Pattern Expertise',
  expertise_standing: 'Expertise Standing',
  standing_challenge: 'Standing Challenge',
  challenge_stars: 'Challenge Stars',
  stars_elite: 'Stars Elite',
  elite_mastery: 'Elite Mastery',
  assessment_expertise: 'Assessment Expertise',
  cohort_standing: 'Cohort Standing'
}

/**
 * Display names for rank categories and special sources
 */
const SYSTEM_LABELS: Record<RankCategory | 'assessment' | 'cohort', string> = {
  pattern_mastery: 'Pattern Mastery',
  career_expertise: 'Career Expertise',
  challenge_rating: 'Challenge Rating',
  station_standing: 'Station Standing',
  skill_stars: 'Skill Stars',
  elite_status: 'Elite Status',
  assessment: 'Assessment',
  cohort: 'Cohort'
}

/**
 * Get display info for a resonance bonus
 */
export function getResonanceDisplayInfo(bonus: ResonanceBonus): ResonanceDisplayInfo {
  return {
    type: bonus.type,
    name: RESONANCE_TYPE_NAMES[bonus.type],
    description: bonus.description,
    bonusPercent: Math.round((bonus.multiplier - 1) * 100),
    sourceLabel: SYSTEM_LABELS[bonus.sourceSystem],
    targetLabel: SYSTEM_LABELS[bonus.targetSystem],
    samuelQuote: bonus.samuelQuote
  }
}

/**
 * Samuel messages for resonance counts
 */
export const SAMUEL_RESONANCE_MESSAGES: Record<number, string[]> = {
  0: [
    "The systems are quiet. That's not bad—it's a beginning.",
    "No resonance yet. Keep growing."
  ],
  1: [
    "I feel something stirring. A connection forming.",
    "One resonance active. The systems are starting to notice you."
  ],
  2: [
    "Two paths reinforcing each other. Interesting.",
    "Your growth in one area is feeding another. This is how mastery works."
  ],
  3: [
    "Three resonances. The station hums differently around you now.",
    "Few achieve this kind of synchronicity."
  ],
  4: [
    "Four resonances active. Remarkable.",
    "The systems are singing together. Listen."
  ]
}

/**
 * Get Samuel's message about resonance count
 */
export function getSamuelResonanceMessage(resonanceCount: number): string {
  const clampedCount = Math.min(resonanceCount, 4)
  const messages = SAMUEL_RESONANCE_MESSAGES[clampedCount]
  return randomPick(messages)!
}

/**
 * Create default (empty) resonance input
 */
export function createDefaultResonanceInput(): ResonanceInput {
  return {
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
    cohortStanding: 'new'
  }
}
