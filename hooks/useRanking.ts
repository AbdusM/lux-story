'use client'

/**
 * useRanking - Hook for computing and accessing ranking dashboard state
 *
 * Design principle: COMPUTED view of existing data.
 * - Takes game state as input
 * - Computes unified dashboard state
 * - Returns state in format UI components expect
 * - Never persists ranking data (computed from source of truth)
 *
 * Provides:
 * - Full unified dashboard state
 * - Individual ranking system states
 * - Pending ceremonies
 * - Active resonances
 */

import { useMemo } from 'react'
import {
  calculateUnifiedDashboard,
  type UnifiedDashboardInput
} from '@/lib/ranking/unified-dashboard'
import type {
  PatternMasteryState,
  CareerExpertiseState,
  PlayerReadiness,
  BillboardState,
  SkillStarsState,
  EliteStatusState,
  CeremonyState,
  UnifiedDashboardState
} from '@/lib/ranking/types'
import type { CohortComparison } from '@/lib/ranking/cohorts'
import type { ResonanceState } from '@/lib/ranking/resonance'
import type { Ceremony } from '@/lib/ranking/ceremonies'
import type { RankingDashboardState } from '@/components/ranking/RankingDashboard'

// ═══════════════════════════════════════════════════════════════════════════
// INPUT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simplified input for the hook
 * Can be derived from GameState or SerializableGameState
 */
export interface UseRankingInput {
  // Pattern data
  patterns: {
    analytical: number
    patience: number
    exploring: number
    helping: number
    building: number
  }
  totalOrbs: number

  // Character data
  characterStates: {
    characterId: string
    trust: number
    arcsCompleted: number
  }[]

  // Skills
  demonstratedSkills: string[]

  // Session data
  visitedScenes: number
  choicesMade: number
  sessionsPlayed: number

  // Account data
  createdAt: number

  // Optional: ceremony state (if tracking progress)
  ceremonyState?: CeremonyState

  // Optional: completed resonance events
  completedResonanceEventIds?: string[]

  // Optional: global flags for resonance checks
  globalFlags?: string[]
}

// ═══════════════════════════════════════════════════════════════════════════
// RETURN TYPE
// ═══════════════════════════════════════════════════════════════════════════

export interface UseRankingReturn {
  // Full state
  dashboard: UnifiedDashboardState

  // UI-ready state (for RankingDashboard component)
  dashboardState: RankingDashboardState

  // Individual systems (convenience accessors)
  patternMastery: PatternMasteryState
  careerExpertise: CareerExpertiseState
  challengeRating: PlayerReadiness
  stationStanding: BillboardState
  skillStars: SkillStarsState
  eliteStatus: EliteStatusState

  // Cross-system
  cohort: CohortComparison
  resonance: ResonanceState

  // Ceremonies
  pendingCeremony: Ceremony | null
  hasPendingCeremony: boolean

  // Computed summaries
  overallProgression: number
  hasEliteStatus: boolean
  hasChampion: boolean
  activeResonanceCount: number
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute ranking dashboard state from game data
 *
 * @param input - Game state data
 * @param now - Optional timestamp for deterministic testing
 * @returns Full ranking state and UI-ready props
 */
export function useRanking(
  input: UseRankingInput,
  now: number = Date.now()
): UseRankingReturn {
  // Compute unified dashboard
  const dashboard = useMemo(() => {
    // Transform input to dashboard input format
    const dashboardInput: UnifiedDashboardInput = {
      patternOrbs: input.patterns,
      characterStates: input.characterStates,
      demonstratedSkills: input.demonstratedSkills,
      totalOrbs: input.totalOrbs,
      charactersMet: input.characterStates.length,
      averageTrust: input.characterStates.length > 0
        ? input.characterStates.reduce((sum, c) => sum + c.trust, 0) / input.characterStates.length
        : 0,
      arcsCompleted: input.characterStates.reduce((sum, c) => sum + c.arcsCompleted, 0),
      visitedScenes: input.visitedScenes,
      choicesMade: input.choicesMade,
      sessionsPlayed: input.sessionsPlayed,
      createdAt: input.createdAt,
      ceremonyState: input.ceremonyState,
      completedResonanceEventIds: input.completedResonanceEventIds,
      globalFlags: input.globalFlags
    }

    return calculateUnifiedDashboard(dashboardInput, now)
  }, [
    input.patterns,
    input.characterStates,
    input.demonstratedSkills,
    input.totalOrbs,
    input.visitedScenes,
    input.choicesMade,
    input.sessionsPlayed,
    input.createdAt,
    input.ceremonyState,
    input.completedResonanceEventIds,
    input.globalFlags,
    now
  ])

  // Transform to UI component format
  const dashboardState: RankingDashboardState = useMemo(() => ({
    patternMastery: {
      tier: dashboard.patternMastery.overallOrbTier,
      state: dashboard.patternMastery
    },
    careerExpertise: dashboard.careerExpertise,
    challengeRating: dashboard.challengeRating,
    stationStanding: dashboard.stationStanding,
    skillStars: dashboard.skillStars,
    eliteStatus: dashboard.eliteStatus
  }), [dashboard])

  // Convenience accessors
  const hasEliteStatus = dashboard.eliteStatus.unlockedDesignations.length > 0
  const hasChampion = dashboard.careerExpertise.championDomains.length > 0
  const activeResonanceCount = dashboard.resonance.activeResonances.length

  return {
    // Full state
    dashboard,

    // UI-ready state
    dashboardState,

    // Individual systems
    patternMastery: dashboard.patternMastery,
    careerExpertise: dashboard.careerExpertise,
    challengeRating: dashboard.challengeRating,
    stationStanding: dashboard.stationStanding,
    skillStars: dashboard.skillStars,
    eliteStatus: dashboard.eliteStatus,

    // Cross-system
    cohort: dashboard.cohort,
    resonance: dashboard.resonance,

    // Ceremonies
    pendingCeremony: dashboard.pendingCeremony,
    hasPendingCeremony: dashboard.pendingCeremony !== null,

    // Computed summaries
    overallProgression: dashboard.overallProgression,
    hasEliteStatus,
    hasChampion,
    activeResonanceCount
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Create input from common state shapes
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create empty input for initial/default state
 */
export function createEmptyRankingInput(createdAt: number = Date.now()): UseRankingInput {
  return {
    patterns: {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    },
    totalOrbs: 0,
    characterStates: [],
    demonstratedSkills: [],
    visitedScenes: 0,
    choicesMade: 0,
    sessionsPlayed: 0,
    createdAt
  }
}
