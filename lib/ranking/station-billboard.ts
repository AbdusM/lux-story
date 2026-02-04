/**
 * Station Billboard Module
 *
 * OPM-inspired public recognition system.
 * Aggregates player achievements into merit points and standing tiers.
 *
 * @module lib/ranking/station-billboard
 */

import type {
  StationStandingTier,
  MeritBreakdown,
  BillboardEntry,
  BillboardState
} from './types'
import { getTierForPoints } from './registry'

// ═══════════════════════════════════════════════════════════════════════════
// INPUT INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input for billboard calculation
 */
export interface BillboardInput {
  /** Total orbs earned */
  totalOrbs: number
  /** Number of unique characters met */
  charactersMetCount: number
  /** Average trust across all met characters */
  averageTrust: number
  /** Number of scenes discovered */
  scenesDiscovered: number
  /** Number of completed arcs */
  arcsCompleted: number
  /** Number of skills demonstrated */
  skillsDemonstrated: number
  /** Number of achievements unlocked */
  achievementsUnlocked: number
}

// ═══════════════════════════════════════════════════════════════════════════
// STANDING DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

export interface StandingDisplayInfo {
  tier: StationStandingTier
  name: string
  description: string
  iconVariant: string
  colorToken: string
}

export const STANDING_DISPLAY: Record<StationStandingTier, StandingDisplayInfo> = {
  newcomer: {
    tier: 'newcomer',
    name: 'Newcomer',
    description: 'A fresh face at the station.',
    iconVariant: 'user',
    colorToken: 'slate'
  },
  regular: {
    tier: 'regular',
    name: 'Regular',
    description: 'The staff nod when they see you.',
    iconVariant: 'user-check',
    colorToken: 'blue'
  },
  notable: {
    tier: 'notable',
    name: 'Notable',
    description: 'People remember your name.',
    iconVariant: 'star',
    colorToken: 'purple'
  },
  distinguished: {
    tier: 'distinguished',
    name: 'Distinguished',
    description: 'A pillar of the station community.',
    iconVariant: 'crown',
    colorToken: 'amber'
  }
}

/**
 * All standing tiers in order
 */
export const STANDING_TIERS: StationStandingTier[] = ['newcomer', 'regular', 'notable', 'distinguished']

// ═══════════════════════════════════════════════════════════════════════════
// MERIT CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Merit point weights for different activities
 */
const MERIT_WEIGHTS = {
  // Patterns: based on total orbs
  ORBS_MULTIPLIER: 0.5, // 100 orbs = 50 merit

  // Relationships: characters met + trust
  CHARACTER_MET: 2,
  TRUST_MULTIPLIER: 0.5, // avg trust 10 = 5 merit per character

  // Discoveries: scenes + arcs
  SCENE_DISCOVERED: 0.2,
  ARC_COMPLETED: 5,

  // Contributions: skills + achievements
  SKILL_DEMONSTRATED: 1,
  ACHIEVEMENT_UNLOCKED: 3
}

/**
 * Calculate merit breakdown from input
 */
export function calculateMeritBreakdown(input: BillboardInput): MeritBreakdown {
  const patterns = Math.round(input.totalOrbs * MERIT_WEIGHTS.ORBS_MULTIPLIER)

  const relationships = Math.round(
    (input.charactersMetCount * MERIT_WEIGHTS.CHARACTER_MET) +
    (input.charactersMetCount * input.averageTrust * MERIT_WEIGHTS.TRUST_MULTIPLIER)
  )

  const discoveries = Math.round(
    (input.scenesDiscovered * MERIT_WEIGHTS.SCENE_DISCOVERED) +
    (input.arcsCompleted * MERIT_WEIGHTS.ARC_COMPLETED)
  )

  const contributions = Math.round(
    (input.skillsDemonstrated * MERIT_WEIGHTS.SKILL_DEMONSTRATED) +
    (input.achievementsUnlocked * MERIT_WEIGHTS.ACHIEVEMENT_UNLOCKED)
  )

  return {
    patterns,
    relationships,
    discoveries,
    contributions,
    total: patterns + relationships + discoveries + contributions
  }
}

/**
 * Get standing tier from merit points
 */
export function getStandingForMerit(meritPoints: number): StationStandingTier {
  const tier = getTierForPoints('station_standing', meritPoints)
  return tier.name.toLowerCase().replace(' ', '_') as StationStandingTier
}

// ═══════════════════════════════════════════════════════════════════════════
// BILLBOARD HIGHLIGHTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate billboard highlights from input
 */
export function generateHighlights(
  input: BillboardInput,
  previousInput?: BillboardInput
): BillboardEntry[] {
  const highlights: BillboardEntry[] = []

  // Pattern mastery highlight
  if (input.totalOrbs > 0) {
    highlights.push({
      category: 'patterns',
      label: 'Orbs Collected',
      value: input.totalOrbs,
      trend: previousInput && input.totalOrbs > previousInput.totalOrbs ? 'up' : 'stable'
    })
  }

  // Relationship highlight
  if (input.charactersMetCount > 0) {
    highlights.push({
      category: 'relationships',
      label: 'Connections Made',
      value: input.charactersMetCount,
      trend: previousInput && input.charactersMetCount > previousInput.charactersMetCount ? 'up' : 'stable'
    })
  }

  // Trust depth highlight (if meaningful)
  if (input.averageTrust >= 4) {
    highlights.push({
      category: 'relationships',
      label: 'Trust Level',
      value: `${input.averageTrust.toFixed(1)} avg`,
      trend: previousInput && input.averageTrust > previousInput.averageTrust ? 'up' :
             previousInput && input.averageTrust < previousInput.averageTrust ? 'down' : 'stable'
    })
  }

  // Discovery highlights
  if (input.arcsCompleted > 0) {
    highlights.push({
      category: 'discoveries',
      label: 'Arcs Completed',
      value: input.arcsCompleted,
      trend: previousInput && input.arcsCompleted > previousInput.arcsCompleted ? 'up' : 'stable'
    })
  }

  // Skill highlight
  if (input.skillsDemonstrated > 0) {
    highlights.push({
      category: 'contributions',
      label: 'Skills Shown',
      value: input.skillsDemonstrated,
      trend: previousInput && input.skillsDemonstrated > previousInput.skillsDemonstrated ? 'up' : 'stable'
    })
  }

  // Achievement highlight
  if (input.achievementsUnlocked > 0) {
    highlights.push({
      category: 'contributions',
      label: 'Achievements',
      value: input.achievementsUnlocked,
      trend: previousInput && input.achievementsUnlocked > previousInput.achievementsUnlocked ? 'up' : 'stable'
    })
  }

  return highlights
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate full billboard state
 */
export function calculateBillboardState(
  input: BillboardInput,
  previousInput?: BillboardInput,
  now: number = Date.now()
): BillboardState {
  const meritBreakdown = calculateMeritBreakdown(input)
  const tier = getTierForPoints('station_standing', meritBreakdown.total)
  const standing = tier.name.toLowerCase().replace(' ', '_') as StationStandingTier
  const highlights = generateHighlights(input, previousInput)

  return {
    standing,
    standingName: tier.name,
    meritPoints: meritBreakdown.total,
    meritBreakdown,
    highlights,
    lastUpdated: now
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

export const SAMUEL_STANDING_MESSAGES: Record<StationStandingTier, string[]> = {
  newcomer: [
    "Welcome to the station. Everyone starts somewhere.",
    "Take your time. Learn the rhythms of this place."
  ],
  regular: [
    "The staff have started to recognize you.",
    "You're becoming part of the station's fabric."
  ],
  notable: [
    "People talk about you here. Good things.",
    "Your presence is felt throughout the station."
  ],
  distinguished: [
    "Few achieve this level of standing.",
    "The station considers you family now."
  ]
}

/**
 * Get Samuel's message for standing
 */
export function getSamuelStandingMessage(standing: StationStandingTier): string {
  const messages = SAMUEL_STANDING_MESSAGES[standing]
  return messages[Math.floor(Math.random() * messages.length)]
}

// ═══════════════════════════════════════════════════════════════════════════
// MERIT BREAKDOWN DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

export interface MeritCategoryDisplay {
  key: keyof Omit<MeritBreakdown, 'total'>
  label: string
  description: string
  iconVariant: string
  colorToken: string
}

export const MERIT_CATEGORIES: MeritCategoryDisplay[] = [
  {
    key: 'patterns',
    label: 'Pattern Recognition',
    description: 'Merit from discovering and developing patterns',
    iconVariant: 'zap',
    colorToken: 'amber'
  },
  {
    key: 'relationships',
    label: 'Connections',
    description: 'Merit from building trust and meeting characters',
    iconVariant: 'users',
    colorToken: 'blue'
  },
  {
    key: 'discoveries',
    label: 'Exploration',
    description: 'Merit from discovering scenes and completing arcs',
    iconVariant: 'compass',
    colorToken: 'green'
  },
  {
    key: 'contributions',
    label: 'Contributions',
    description: 'Merit from skills and achievements',
    iconVariant: 'star',
    colorToken: 'purple'
  }
]

/**
 * Get percentage breakdown of merit sources
 */
export function getMeritPercentages(breakdown: MeritBreakdown): Record<string, number> {
  if (breakdown.total === 0) {
    return { patterns: 0, relationships: 0, discoveries: 0, contributions: 0 }
  }

  return {
    patterns: Math.round((breakdown.patterns / breakdown.total) * 100),
    relationships: Math.round((breakdown.relationships / breakdown.total) * 100),
    discoveries: Math.round((breakdown.discoveries / breakdown.total) * 100),
    contributions: Math.round((breakdown.contributions / breakdown.total) * 100)
  }
}
