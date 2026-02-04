/**
 * Elite Status Module
 *
 * Bleach-inspired special designations for exceptional achievements.
 * Requires meeting multi-system requirements for each designation.
 *
 * @module lib/ranking/elite-status
 */

import type {
  EliteDesignation,
  EliteStatusState
} from './types'
import { getTierForPoints } from './registry'

// ═══════════════════════════════════════════════════════════════════════════
// INPUT INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input for elite status calculation
 * Tracks relevant metrics for each designation
 */
export interface EliteStatusInput {
  /** First-discovery achievements (for pathfinder) */
  firstDiscoveries: number
  /** Number of domains with Specialist+ tier (for bridge_builder) */
  specialistDomains: number
  /** Number of characters at max trust (for mentor_heart) */
  maxTrustCharacters: number
  /** Number of patterns at flourishing+ (for pattern_sage) */
  flourishingPatterns: number
  /** Station standing level: 0-3 (for station_pillar) */
  standingLevel: number
  /** Total orbs earned (supplementary) */
  totalOrbs: number
  /** Arcs completed (supplementary) */
  arcsCompleted: number
}

// ═══════════════════════════════════════════════════════════════════════════
// DESIGNATION DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All elite designations
 */
export const ELITE_DESIGNATIONS: EliteDesignation[] = [
  'pathfinder',
  'bridge_builder',
  'mentor_heart',
  'pattern_sage',
  'station_pillar'
]

export interface DesignationDisplayInfo {
  designation: EliteDesignation
  name: string
  title: string
  description: string
  requirement: string
  iconVariant: string
  colorToken: string
}

export const DESIGNATION_DISPLAY: Record<EliteDesignation, DesignationDisplayInfo> = {
  pathfinder: {
    designation: 'pathfinder',
    name: 'Pathfinder',
    title: 'The Pathfinder',
    description: 'First to discover hidden content',
    requirement: '3+ first discoveries',
    iconVariant: 'compass',
    colorToken: 'blue'
  },
  bridge_builder: {
    designation: 'bridge_builder',
    name: 'Bridge Builder',
    title: 'The Bridge Builder',
    description: 'Deep expertise across multiple domains',
    requirement: 'Specialist+ in 3+ domains',
    iconVariant: 'git-branch',
    colorToken: 'purple'
  },
  mentor_heart: {
    designation: 'mentor_heart',
    name: 'Mentor Heart',
    title: 'The Mentor Heart',
    description: 'Maximum trust with many characters',
    requirement: 'Max trust with 5+ characters',
    iconVariant: 'heart',
    colorToken: 'pink'
  },
  pattern_sage: {
    designation: 'pattern_sage',
    name: 'Pattern Sage',
    title: 'The Pattern Sage',
    description: 'All patterns at flourishing or above',
    requirement: 'All 5 patterns flourishing+',
    iconVariant: 'zap',
    colorToken: 'amber'
  },
  station_pillar: {
    designation: 'station_pillar',
    name: 'Station Pillar',
    title: 'The Station Pillar',
    description: 'Maximum station standing achieved',
    requirement: 'Distinguished standing',
    iconVariant: 'crown',
    colorToken: 'gold'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DESIGNATION REQUIREMENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Requirements for each designation
 */
interface DesignationRequirement {
  check: (input: EliteStatusInput) => boolean
  progress: (input: EliteStatusInput) => number
}

const DESIGNATION_REQUIREMENTS: Record<EliteDesignation, DesignationRequirement> = {
  pathfinder: {
    check: (input) => input.firstDiscoveries >= 3,
    progress: (input) => Math.min(100, (input.firstDiscoveries / 3) * 100)
  },
  bridge_builder: {
    check: (input) => input.specialistDomains >= 3,
    progress: (input) => Math.min(100, (input.specialistDomains / 3) * 100)
  },
  mentor_heart: {
    check: (input) => input.maxTrustCharacters >= 5,
    progress: (input) => Math.min(100, (input.maxTrustCharacters / 5) * 100)
  },
  pattern_sage: {
    check: (input) => input.flourishingPatterns >= 5,
    progress: (input) => Math.min(100, (input.flourishingPatterns / 5) * 100)
  },
  station_pillar: {
    check: (input) => input.standingLevel >= 3,
    progress: (input) => Math.min(100, (input.standingLevel / 3) * 100)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STATUS CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a designation is unlocked
 */
export function isDesignationUnlocked(designation: EliteDesignation, input: EliteStatusInput): boolean {
  return DESIGNATION_REQUIREMENTS[designation].check(input)
}

/**
 * Get progress toward a designation (0-100)
 */
export function getDesignationProgress(designation: EliteDesignation, input: EliteStatusInput): number {
  return Math.round(DESIGNATION_REQUIREMENTS[designation].progress(input))
}

/**
 * Calculate full elite status state
 */
export function calculateEliteStatusState(input: EliteStatusInput): EliteStatusState {
  const unlockedDesignations: EliteDesignation[] = []
  const pendingDesignations: EliteDesignation[] = []
  const progress: Record<EliteDesignation, number> = {} as Record<EliteDesignation, number>

  for (const designation of ELITE_DESIGNATIONS) {
    const p = getDesignationProgress(designation, input)
    progress[designation] = p

    if (isDesignationUnlocked(designation, input)) {
      unlockedDesignations.push(designation)
    } else if (p >= 33) {
      // Show as pending if 1/3 or more progress
      pendingDesignations.push(designation)
    }
  }

  return {
    unlockedDesignations,
    pendingDesignations,
    progress
  }
}

/**
 * Get overall elite tier based on unlocked designations
 */
export function getEliteTier(unlockedCount: number): { id: string; name: string; level: number } {
  const tier = getTierForPoints('elite_status', unlockedCount)
  return {
    id: tier.id,
    name: tier.name,
    level: tier.level
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

export const SAMUEL_DESIGNATION_MESSAGES: Record<EliteDesignation, string[]> = {
  pathfinder: [
    "You find paths others miss. A rare gift.",
    "The station reveals its secrets to those who seek them."
  ],
  bridge_builder: [
    "You connect worlds. Few can do what you do.",
    "Where others see barriers, you build bridges."
  ],
  mentor_heart: [
    "Hearts open to you. That's a sacred trust.",
    "To be trusted by so many... it says everything."
  ],
  pattern_sage: [
    "All patterns flow through you now.",
    "You've achieved what few travelers ever do."
  ],
  station_pillar: [
    "This station is yours as much as anyone's.",
    "A pillar. A foundation. That's what you've become."
  ]
}

/**
 * Get Samuel's message for a designation
 */
export function getSamuelDesignationMessage(designation: EliteDesignation): string {
  const messages = SAMUEL_DESIGNATION_MESSAGES[designation]
  return messages[Math.floor(Math.random() * messages.length)]
}

export const SAMUEL_ELITE_TIER_MESSAGES: Record<string, string> = {
  Standard: "Walk your own path. Elite status will come.",
  Recognized: "The station has taken notice of you.",
  Elite: "Among the exceptional few. Wear it with pride.",
  Legendary: "Legendary status. Stories will be told of your journey."
}

/**
 * Get Samuel's message for elite tier
 */
export function getSamuelEliteTierMessage(tierName: string): string {
  return SAMUEL_ELITE_TIER_MESSAGES[tierName] ||
    "Continue your path. Growth never stops."
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get nearest designation to unlock
 */
export function getNearestDesignation(state: EliteStatusState): EliteDesignation | null {
  let nearest: { designation: EliteDesignation; progress: number } | null = null

  for (const designation of ELITE_DESIGNATIONS) {
    if (!state.unlockedDesignations.includes(designation)) {
      const p = state.progress[designation]
      if (!nearest || p > nearest.progress) {
        nearest = { designation, progress: p }
      }
    }
  }

  return nearest?.designation || null
}

/**
 * Check if any designation is close to unlock (>= threshold)
 */
export function hasDesignationNearUnlock(state: EliteStatusState, threshold: number = 80): boolean {
  return ELITE_DESIGNATIONS.some(d =>
    !state.unlockedDesignations.includes(d) && state.progress[d] >= threshold
  )
}

/**
 * Get primary designation title (first unlocked or null)
 */
export function getPrimaryTitle(state: EliteStatusState): string | null {
  if (state.unlockedDesignations.length === 0) return null
  return DESIGNATION_DISPLAY[state.unlockedDesignations[0]].title
}

/**
 * Get all unlocked titles
 */
export function getAllTitles(state: EliteStatusState): string[] {
  return state.unlockedDesignations.map(d => DESIGNATION_DISPLAY[d].title)
}
