/**
 * Unified Dashboard Module
 *
 * Aggregates all ranking systems into a single dashboard state.
 * Performance target: <50ms for full calculation.
 *
 * @module lib/ranking/unified-dashboard
 */

import type {
  PatternMasteryState,
  CareerExpertiseState,
  BillboardState,
  SkillStarsState,
  EliteStatusState,
  CeremonyState,
  UnifiedDashboardState
} from './types'
import type { ResonanceInput } from './resonance'

import { calculatePatternMasteryState } from './pattern-mastery-display'
import type { OrbTier } from '@/lib/orbs'
import type { PlayerPatterns } from '@/lib/patterns'
import { PATTERN_TYPES } from '@/lib/patterns'
import { calculateCareerExpertiseState } from './career-expertise'
import { calculatePlayerReadiness, getGradeIndex } from './challenge-rating'
import { calculateBillboardState } from './station-billboard'
import { calculateSkillStarsState } from './skill-stars'
import { calculateEliteStatusState } from './elite-status'
import { calculateLocalCohortComparison } from './cohorts'
import { createDefaultCeremonyState, getNextCeremony } from './ceremonies'
import { calculateResonanceState } from './resonance'

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert OrbTier to numeric level (0-4)
 */
function getOrbTierLevel(orbTier: OrbTier): number {
  const tiers: OrbTier[] = ['nascent', 'emerging', 'developing', 'flourishing', 'mastered']
  return tiers.indexOf(orbTier)
}

/**
 * Convert generic pattern orbs record to PlayerPatterns type
 */
function toPlayerPatterns(patternOrbs: Record<string, number>): PlayerPatterns {
  return {
    analytical: patternOrbs.analytical ?? 0,
    patience: patternOrbs.patience ?? 0,
    exploring: patternOrbs.exploring ?? 0,
    helping: patternOrbs.helping ?? 0,
    building: patternOrbs.building ?? 0
  }
}

/**
 * Count patterns at flourishing level (9+)
 */
function countFlourishingPatterns(patterns: PlayerPatterns): number {
  const FLOURISHING_THRESHOLD = 9
  return PATTERN_TYPES.filter(p => patterns[p] >= FLOURISHING_THRESHOLD).length
}

/**
 * Get max pattern value
 */
function getMaxPatternValue(patterns: PlayerPatterns): number {
  return Math.max(0, ...PATTERN_TYPES.map(p => patterns[p]))
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED INPUT TYPE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input for unified dashboard calculation
 */
export interface UnifiedDashboardInput {
  // Pattern Mastery
  patternOrbs: Record<string, number>

  // Career Expertise
  characterStates: {
    characterId: string
    trust: number
    arcsCompleted: number
  }[]
  demonstratedSkills: string[]

  // Station Standing
  totalOrbs: number
  charactersMet: number
  averageTrust: number
  arcsCompleted: number
  visitedScenes: number
  choicesMade: number
  sessionsPlayed: number

  // Cohort
  createdAt: number

  // Ceremony state (optional, uses default if not provided)
  ceremonyState?: CeremonyState

  // Completed resonance events
  completedResonanceEventIds?: string[]

  // Flags
  globalFlags?: string[]
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED DASHBOARD CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate the unified dashboard state from input data
 *
 * Performance target: <50ms
 */
export function calculateUnifiedDashboard(
  input: UnifiedDashboardInput,
  now: number = Date.now()
): UnifiedDashboardState {
  // ─────────────────────────────────────────────────────────────────────────
  // Pattern Mastery (Phase 1)
  // ─────────────────────────────────────────────────────────────────────────
  const patterns = toPlayerPatterns(input.patternOrbs)
  const patternMastery = calculatePatternMasteryState(patterns)

  // ─────────────────────────────────────────────────────────────────────────
  // Career Expertise (Phase 2)
  // ─────────────────────────────────────────────────────────────────────────
  // Transform character states array to trust record
  const characterTrust: Record<string, number> = {}
  for (const charState of input.characterStates) {
    characterTrust[charState.characterId] = charState.trust
  }

  // Transform skills array to record (all demonstrated skills at level 1)
  const skills: Record<string, number> = {}
  for (const skill of input.demonstratedSkills) {
    skills[skill] = 1
  }

  const careerExpertise = calculateCareerExpertiseState({
    characterTrust,
    skills
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Challenge Rating (Phase 3)
  // ─────────────────────────────────────────────────────────────────────────
  // Calculate dimension scores (0-100)
  const pmLevel = getOrbTierLevel(patternMastery.overallOrbTier)
  const domainLevels = Object.values(careerExpertise.domains).map(d => d.level)
  const maxExpertise = domainLevels.length > 0 ? Math.max(0, ...domainLevels) : 0

  const challengeRating = calculatePlayerReadiness({
    patternMastery: (pmLevel / 4) * 100,
    careerExpertise: (maxExpertise / 5) * 100,
    relationshipDepth: input.averageTrust * 10, // 0-10 trust -> 0-100
    skillBreadth: Math.min(100, input.demonstratedSkills.length * 5) // 20 skills = 100
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Station Standing (Phase 4)
  // ─────────────────────────────────────────────────────────────────────────
  const stationStanding = calculateBillboardState({
    totalOrbs: input.totalOrbs,
    charactersMetCount: input.charactersMet,
    averageTrust: input.averageTrust,
    scenesDiscovered: input.visitedScenes,
    arcsCompleted: input.arcsCompleted,
    skillsDemonstrated: input.demonstratedSkills.length,
    achievementsUnlocked: input.sessionsPlayed // Using sessions as proxy for achievements
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Skill Stars (Phase 5)
  // ─────────────────────────────────────────────────────────────────────────
  // Find max trust level from character states
  const maxTrustLevel = input.characterStates.length > 0
    ? Math.max(0, ...input.characterStates.map(c => c.trust))
    : 0

  const skillStars = calculateSkillStarsState({
    maxPatternValue: getMaxPatternValue(patterns),
    skillCombosUnlocked: 0, // Would need skill combo tracking in input
    infoTiersDiscovered: input.visitedScenes, // Using visited scenes as proxy
    maxTrustLevel,
    totalOrbs: input.totalOrbs,
    challengesCompleted: input.arcsCompleted // Using arcs as proxy for challenges
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Elite Status (Phase 7)
  // ─────────────────────────────────────────────────────────────────────────
  // Derive hasChampion from championDomains
  const hasChampion = careerExpertise.championDomains.length > 0

  // Count domains at Specialist level (level 4) or above
  const specialistDomains = Object.values(careerExpertise.domains)
    .filter(d => d.level >= 4).length

  // Count characters at max trust (10)
  const maxTrustCharacters = input.characterStates
    .filter(c => c.trust >= 10).length

  const eliteStatus = calculateEliteStatusState({
    firstDiscoveries: 0, // Would need discovery tracking in input
    specialistDomains,
    maxTrustCharacters,
    flourishingPatterns: countFlourishingPatterns(patterns),
    standingLevel: getStandingLevel(stationStanding.standing),
    totalOrbs: input.totalOrbs,
    arcsCompleted: input.arcsCompleted
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Cohort (Phase 9)
  // ─────────────────────────────────────────────────────────────────────────
  const cohort = calculateLocalCohortComparison(
    {
      createdAt: input.createdAt,
      totalOrbs: input.totalOrbs,
      charactersMet: input.charactersMet,
      averageTrust: input.averageTrust,
      arcsCompleted: input.arcsCompleted,
      skillsDemonstrated: input.demonstratedSkills.length
    },
    getOrbTierLevel(patternMastery.overallOrbTier),
    Math.max(0, ...Object.values(careerExpertise.domains).map(d => d.level)),
    now
  )

  // ─────────────────────────────────────────────────────────────────────────
  // Ceremonies (Phase 10)
  // ─────────────────────────────────────────────────────────────────────────
  const ceremonyState = input.ceremonyState ?? createDefaultCeremonyState()

  // Collect trigger IDs from current state
  // (Ceremony eligibility is based on current level, not promotions)
  const triggerIds: string[] = []

  // Add triggers based on current pattern mastery level
  // (Ceremonies will filter out already-completed ones)
  if (pmLevel >= 1) triggerIds.push('pm_passenger')
  if (pmLevel >= 2) triggerIds.push('pm_regular')
  if (pmLevel >= 3) triggerIds.push('pm_conductor')
  if (pmLevel >= 4) triggerIds.push('pm_stationmaster')

  // Champion triggers ceremony
  if (hasChampion &&
      !ceremonyState.completedCeremonies.includes('ceremony_champion')) {
    triggerIds.push('first_champion')
  }

  // Elite triggers ceremony
  if (eliteStatus.unlockedDesignations.length > 0 &&
      !ceremonyState.completedCeremonies.includes('ceremony_elite')) {
    triggerIds.push('first_elite')
  }

  const pendingCeremony = getNextCeremony(ceremonyState, triggerIds, now)

  // ─────────────────────────────────────────────────────────────────────────
  // Resonance (Phase 11)
  // ─────────────────────────────────────────────────────────────────────────
  const resonanceInput: ResonanceInput = {
    patternMasteryLevel: getOrbTierLevel(patternMastery.overallOrbTier),
    maxExpertiseLevel: Math.max(
      0,
      ...Object.values(careerExpertise.domains).map(d => d.level)
    ),
    hasChampion,
    stationStandingLevel: getStandingLevel(stationStanding.standing),
    challengeGradeIndex: getGradeIndex(challengeRating.grade),
    hasChallengeOvercome: input.globalFlags?.includes('challenge_overcome') ?? false,
    totalStars: skillStars.totalStars,
    unlockedDesignationCount: eliteStatus.unlockedDesignations.length,
    hasAssessmentComplete: input.globalFlags?.includes('first_crossing_complete') ?? false,
    hasCrossroadsComplete: input.globalFlags?.includes('crossroads_trial_complete') ?? false,
    cohortStanding: cohort.qualitativeStanding
  }

  const resonance = calculateResonanceState(
    resonanceInput,
    input.completedResonanceEventIds ?? []
  )

  // ─────────────────────────────────────────────────────────────────────────
  // Overall Progression
  // ─────────────────────────────────────────────────────────────────────────
  const overallProgression = calculateOverallProgression(
    patternMastery,
    careerExpertise,
    stationStanding,
    skillStars,
    eliteStatus
  )

  return {
    patternMastery,
    careerExpertise,
    challengeRating,
    stationStanding,
    skillStars,
    eliteStatus,
    cohort,
    resonance,
    pendingCeremony,
    ceremonyHistory: ceremonyState.ceremonyHistory,
    lastUpdated: now,
    overallProgression
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map standing tier to numeric level
 */
function getStandingLevel(standing: string): number {
  const levels: Record<string, number> = {
    newcomer: 0,
    established: 1,
    notable: 2,
    distinguished: 3
  }
  return levels[standing] ?? 0
}

/**
 * Calculate overall progression percentage (0-100)
 */
function calculateOverallProgression(
  patternMastery: PatternMasteryState,
  careerExpertise: CareerExpertiseState,
  stationStanding: BillboardState,
  skillStars: SkillStarsState,
  eliteStatus: EliteStatusState
): number {
  // Weight each system equally (20% each)
  const patternLevel = getOrbTierLevel(patternMastery.overallOrbTier)
  const patternScore = (patternLevel >= 0 ? patternLevel : 0) / 4 * 20

  const domainLevels = Object.values(careerExpertise.domains).map(d => d.level)
  const maxExpertise = domainLevels.length > 0 ? Math.max(0, ...domainLevels) : 0
  const expertiseScore = maxExpertise / 5 * 20

  const standingScore = Math.min(1, (stationStanding.meritPoints || 0) / 150) * 20
  const starsScore = ((skillStars.totalStars || 0) / 18) * 20
  const eliteScore = ((eliteStatus.unlockedDesignations?.length || 0) / 5) * 20

  const total = patternScore + expertiseScore + standingScore + starsScore + eliteScore
  return Math.min(100, Math.round(total))
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT INPUT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a default (empty) dashboard input
 */
export function createDefaultDashboardInput(
  createdAt: number = Date.now()
): UnifiedDashboardInput {
  return {
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
    createdAt
  }
}
