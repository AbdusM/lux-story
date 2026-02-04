/**
 * Skill Stars Module
 *
 * HxH-inspired contribution honors system.
 * Awards stars in 6 dimensions based on player progress.
 *
 * @module lib/ranking/skill-stars
 */

import type {
  StarLevel,
  StarType,
  SkillStar,
  SkillStarsState
} from './types'
// Registry functions available if needed for future enhancements

// ═══════════════════════════════════════════════════════════════════════════
// INPUT INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input for skill star calculation
 */
export interface SkillStarsInput {
  /** Highest single pattern value (0-100) - for mastery star */
  maxPatternValue: number
  /** Number of skill combos unlocked - for synthesis star */
  skillCombosUnlocked: number
  /** Number of unique info tiers discovered - for discovery star */
  infoTiersDiscovered: number
  /** Highest trust level achieved with any character - for connection star */
  maxTrustLevel: number
  /** Total orbs earned - for growth star */
  totalOrbs: number
  /** Number of challenging content completed - for resilience star */
  challengesCompleted: number
}

// ═══════════════════════════════════════════════════════════════════════════
// STAR TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All star types
 */
export const STAR_TYPES: StarType[] = [
  'mastery',
  'synthesis',
  'discovery',
  'connection',
  'growth',
  'resilience'
]

export interface StarTypeDisplay {
  type: StarType
  name: string
  description: string
  iconVariant: string
  colorToken: string
}

export const STAR_TYPE_DISPLAY: Record<StarType, StarTypeDisplay> = {
  mastery: {
    type: 'mastery',
    name: 'Mastery',
    description: 'Deep expertise in a single pattern',
    iconVariant: 'target',
    colorToken: 'amber'
  },
  synthesis: {
    type: 'synthesis',
    name: 'Synthesis',
    description: 'Combining skills in unique ways',
    iconVariant: 'puzzle',
    colorToken: 'purple'
  },
  discovery: {
    type: 'discovery',
    name: 'Discovery',
    description: 'Uncovering hidden information',
    iconVariant: 'search',
    colorToken: 'blue'
  },
  connection: {
    type: 'connection',
    name: 'Connection',
    description: 'Building deep relationships',
    iconVariant: 'heart',
    colorToken: 'pink'
  },
  growth: {
    type: 'growth',
    name: 'Growth',
    description: 'Overall journey progression',
    iconVariant: 'trending-up',
    colorToken: 'green'
  },
  resilience: {
    type: 'resilience',
    name: 'Resilience',
    description: 'Overcoming challenges',
    iconVariant: 'shield',
    colorToken: 'orange'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STAR LEVEL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface StarLevelDisplay {
  level: StarLevel
  name: string
  requirement: string
  colorToken: string
}

export const STAR_LEVEL_DISPLAY: Record<StarLevel, StarLevelDisplay> = {
  0: {
    level: 0,
    name: 'Unstarred',
    requirement: 'Just beginning',
    colorToken: 'slate'
  },
  1: {
    level: 1,
    name: 'Bronze Star',
    requirement: 'First achievements',
    colorToken: 'orange'
  },
  2: {
    level: 2,
    name: 'Silver Star',
    requirement: 'Notable progress',
    colorToken: 'slate'
  },
  3: {
    level: 3,
    name: 'Gold Star',
    requirement: 'Exceptional achievement',
    colorToken: 'amber'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STAR CALCULATION THRESHOLDS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Thresholds for each star type
 * [bronze, silver, gold]
 */
const STAR_THRESHOLDS: Record<StarType, [number, number, number]> = {
  mastery: [30, 60, 85],        // Max pattern value
  synthesis: [2, 5, 10],         // Skill combos unlocked
  discovery: [5, 15, 30],        // Info tiers discovered
  connection: [6, 8, 10],        // Max trust level
  growth: [30, 60, 100],         // Total orbs
  resilience: [3, 7, 15]         // Challenges completed
}

/**
 * Get star level from value and thresholds
 */
function getStarLevel(value: number, thresholds: [number, number, number]): StarLevel {
  if (value >= thresholds[2]) return 3
  if (value >= thresholds[1]) return 2
  if (value >= thresholds[0]) return 1
  return 0
}

/**
 * Get progress to next level (0-100)
 */
function getProgressToNext(value: number, level: StarLevel, thresholds: [number, number, number]): number {
  if (level >= 3) return 100 // Max level

  // Safe index access (level is 0, 1, or 2 at this point)
  const idx = level as 0 | 1 | 2
  const currentThreshold = idx === 0 ? 0 : thresholds[idx - 1 as 0 | 1]
  const nextThreshold = thresholds[idx]
  const range = nextThreshold - currentThreshold

  if (range === 0) return 100

  const progress = ((value - currentThreshold) / range) * 100
  return Math.min(100, Math.max(0, Math.round(progress)))
}

// ═══════════════════════════════════════════════════════════════════════════
// STAR CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate individual star state
 */
export function calculateStar(type: StarType, value: number): SkillStar {
  const thresholds = STAR_THRESHOLDS[type]
  const level = getStarLevel(value, thresholds)
  const display = STAR_TYPE_DISPLAY[type]
  const _levelDisplay = STAR_LEVEL_DISPLAY[level] // Available for future enhancements

  return {
    type,
    level,
    name: display.name,
    description: display.description,
    progress: getProgressToNext(value, level, thresholds)
  }
}

/**
 * Get value for a star type from input
 */
function getValueForType(type: StarType, input: SkillStarsInput): number {
  switch (type) {
    case 'mastery': return input.maxPatternValue
    case 'synthesis': return input.skillCombosUnlocked
    case 'discovery': return input.infoTiersDiscovered
    case 'connection': return input.maxTrustLevel
    case 'growth': return input.totalOrbs
    case 'resilience': return input.challengesCompleted
  }
}

/**
 * Calculate full skill stars state
 */
export function calculateSkillStarsState(input: SkillStarsInput): SkillStarsState {
  const stars: Record<StarType, SkillStar> = {} as Record<StarType, SkillStar>
  let totalStars = 0

  for (const type of STAR_TYPES) {
    const value = getValueForType(type, input)
    const star = calculateStar(type, value)
    stars[type] = star
    totalStars += star.level
  }

  // Determine constellation name based on total stars
  const constellation = getConstellationName(totalStars)

  return {
    stars,
    totalStars,
    constellation
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTELLATION NAMES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Constellation names based on total stars (max 18)
 */
export const CONSTELLATION_NAMES: Record<number, string> = {
  0: 'Empty Sky',
  1: 'First Light',
  2: 'Faint Glow',
  3: 'Emerging Pattern',
  4: 'Scattered Stars',
  5: 'Nascent Form',
  6: 'Half-Formed',
  7: 'Taking Shape',
  8: 'Rising Cluster',
  9: 'Clear Pattern',
  10: 'Bright Cluster',
  11: 'Brilliant Display',
  12: 'Radiant Form',
  13: 'Stellar Array',
  14: 'Cosmic Dance',
  15: 'Full Constellation',
  16: 'Blazing Glory',
  17: 'Supreme Light',
  18: 'Perfect Constellation'
}

/**
 * Get constellation name for total stars
 */
export function getConstellationName(totalStars: number): string {
  const clamped = Math.min(18, Math.max(0, totalStars))
  return CONSTELLATION_NAMES[clamped] || 'Unknown Pattern'
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

export const SAMUEL_STAR_MESSAGES: Record<StarLevel, string[]> = {
  0: [
    "Your constellation awaits.",
    "Stars need time to form."
  ],
  1: [
    "First lights appear in your sky.",
    "A beginning. Every constellation starts somewhere."
  ],
  2: [
    "A recognizable pattern forms.",
    "Others are starting to see your light."
  ],
  3: [
    "Your constellation shines bright.",
    "Gold stars are rare. Well earned."
  ]
}

/**
 * Get Samuel's message for a star level
 */
export function getSamuelStarMessage(level: StarLevel): string {
  const messages = SAMUEL_STAR_MESSAGES[level]
  return messages[Math.floor(Math.random() * messages.length)]
}

export const SAMUEL_CONSTELLATION_MESSAGES: Record<string, string> = {
  'Empty Sky': "Your journey has just begun.",
  'First Light': "I see a flicker of potential.",
  'Clear Pattern': "Your constellation takes meaningful form.",
  'Full Constellation': "A complete pattern. Rare and beautiful.",
  'Perfect Constellation': "I've seen few constellations this bright."
}

/**
 * Get Samuel's message for constellation
 */
export function getSamuelConstellationMessage(constellation: string): string {
  return SAMUEL_CONSTELLATION_MESSAGES[constellation] ||
    "Your constellation continues to grow."
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get stars at a specific level
 */
export function getStarsAtLevel(state: SkillStarsState, level: StarLevel): StarType[] {
  return STAR_TYPES.filter(type => state.stars[type].level === level)
}

/**
 * Get next star upgrade opportunity
 */
export function getNextUpgradeOpportunity(state: SkillStarsState): { type: StarType; progress: number } | null {
  let best: { type: StarType; progress: number } | null = null

  for (const type of STAR_TYPES) {
    const star = state.stars[type]
    if (star.level < 3 && star.progress > 0) {
      if (!best || star.progress > best.progress) {
        best = { type, progress: star.progress }
      }
    }
  }

  return best
}

/**
 * Check if any star can be upgraded with current progress
 */
export function hasUpgradeReady(state: SkillStarsState, threshold: number = 90): boolean {
  return STAR_TYPES.some(type =>
    state.stars[type].level < 3 && state.stars[type].progress >= threshold
  )
}
