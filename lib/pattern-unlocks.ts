/**
 * Pattern Unlocks - Abilities that unlock as orbs fill
 *
 * Each of the 5 pattern orbs fills up as choices are made.
 * At certain thresholds, abilities unlock within that orb.
 *
 * Visual model: 5 orbs that fill (○◔◑◐●), not coins to collect.
 */

import { type PatternType, PATTERN_METADATA } from './patterns'

// ═══════════════════════════════════════════════════════════════════════════
// ORB FILL STATES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Visual symbols for orb fill state
 */
export const ORB_FILL_SYMBOLS = {
  empty: '○',      // 0%
  quarter: '◔',    // 1-25%
  half: '◑',       // 26-50%
  threeQuarter: '◐', // 51-75%
  full: '●',       // 76-100%
} as const

/**
 * Get the orb symbol for a fill percentage
 */
export function getOrbSymbol(fillPercent: number): string {
  if (fillPercent <= 0) return ORB_FILL_SYMBOLS.empty
  if (fillPercent <= 25) return ORB_FILL_SYMBOLS.quarter
  if (fillPercent <= 50) return ORB_FILL_SYMBOLS.half
  if (fillPercent <= 75) return ORB_FILL_SYMBOLS.threeQuarter
  return ORB_FILL_SYMBOLS.full
}

/**
 * Orb fill tiers with thresholds (out of 100)
 */
export type OrbFillTier = 'nascent' | 'emerging' | 'developing' | 'flourishing' | 'mastered'

export const ORB_FILL_TIERS: Record<OrbFillTier, { min: number; max: number; label: string }> = {
  nascent: { min: 0, max: 24, label: 'Nascent' },
  emerging: { min: 25, max: 49, label: 'Emerging' },
  developing: { min: 50, max: 74, label: 'Developing' },
  flourishing: { min: 75, max: 99, label: 'Flourishing' },
  mastered: { min: 100, max: 100, label: 'Mastered' },
}

export function getOrbFillTier(fillPercent: number): OrbFillTier {
  if (fillPercent >= 100) return 'mastered'
  if (fillPercent >= 75) return 'flourishing'
  if (fillPercent >= 50) return 'developing'
  if (fillPercent >= 25) return 'emerging'
  return 'nascent'
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN UNLOCK DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * An ability that unlocks when an orb reaches a threshold
 */
export interface PatternUnlock {
  id: string
  pattern: PatternType
  name: string
  description: string
  threshold: number // Fill percentage required (0-100)
  icon?: string // Optional emoji/icon
}

/**
 * All pattern unlocks organized by pattern
 * Each pattern has 3 unlock tiers at 25%, 50%, and 85%
 */
export const PATTERN_UNLOCKS: PatternUnlock[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // ANALYTICAL - Reading situations, seeing patterns
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'analytical-1',
    pattern: 'analytical',
    name: 'Read Between Lines',
    description: 'See subtext hints in character dialogue',
    threshold: 25,
    icon: '🔬',
  },
  {
    id: 'analytical-2',
    pattern: 'analytical',
    name: 'Pattern Recognition',
    description: 'Notice repeated behaviors and connections',
    threshold: 50,
    icon: '🔗',
  },
  {
    id: 'analytical-3',
    pattern: 'analytical',
    name: 'Strategic Insight',
    description: 'Unlock analytical dialogue options',
    threshold: 85,
    icon: '🎯',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // PATIENCE - Listening, waiting, deliberation
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'patience-1',
    pattern: 'patience',
    name: 'Take Your Time',
    description: '"Wait and observe" choices appear',
    threshold: 25,
    icon: '⏳',
  },
  {
    id: 'patience-2',
    pattern: 'patience',
    name: 'Deep Listening',
    description: 'Characters reveal more when you wait',
    threshold: 50,
    icon: '👂',
  },
  {
    id: 'patience-3',
    pattern: 'patience',
    name: 'Measured Response',
    description: 'Thoughtful counter-arguments unlock',
    threshold: 85,
    icon: '⚖️',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // EXPLORING - Curiosity, questions, discovery
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'exploring-1',
    pattern: 'exploring',
    name: 'Curiosity Rewarded',
    description: 'Extra worldbuilding details appear',
    threshold: 25,
    icon: '🔍',
  },
  {
    id: 'exploring-2',
    pattern: 'exploring',
    name: 'Ask the Right Questions',
    description: 'Probing dialogue options unlock',
    threshold: 50,
    icon: '❓',
  },
  {
    id: 'exploring-3',
    pattern: 'exploring',
    name: "Seeker's Intuition",
    description: 'Find hidden conversation paths',
    threshold: 85,
    icon: '🗝️',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // HELPING - Empathy, support, connection
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'helping-1',
    pattern: 'helping',
    name: 'Empathy Sense',
    description: 'See emotional state hints on characters',
    threshold: 25,
    icon: '💗',
  },
  {
    id: 'helping-2',
    pattern: 'helping',
    name: 'Supportive Presence',
    description: 'Comfort and support options unlock',
    threshold: 50,
    icon: '🤝',
  },
  {
    id: 'helping-3',
    pattern: 'helping',
    name: 'Heart to Heart',
    description: 'Deep emotional dialogue branches',
    threshold: 85,
    icon: '💬',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // BUILDING - Action, decisiveness, creation
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'building-1',
    pattern: 'building',
    name: 'See the Structure',
    description: 'Reference your earlier decisions',
    threshold: 25,
    icon: '🏗️',
  },
  {
    id: 'building-2',
    pattern: 'building',
    name: 'Decisive Action',
    description: 'Bold and direct choice options',
    threshold: 50,
    icon: '⚡',
  },
  {
    id: 'building-3',
    pattern: 'building',
    name: "Architect's Vision",
    description: 'Shape conversation outcomes',
    threshold: 85,
    icon: '🎨',
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all unlocks for a specific pattern
 */
export function getUnlocksForPattern(pattern: PatternType): PatternUnlock[] {
  return PATTERN_UNLOCKS.filter(u => u.pattern === pattern)
    .sort((a, b) => a.threshold - b.threshold)
}

/**
 * Get unlocks that are currently unlocked based on fill percentage
 */
export function getUnlockedAbilities(pattern: PatternType, fillPercent: number): PatternUnlock[] {
  return getUnlocksForPattern(pattern).filter(u => fillPercent >= u.threshold)
}

/**
 * Get the next unlock to achieve for a pattern
 */
export function getNextUnlock(pattern: PatternType, fillPercent: number): PatternUnlock | null {
  const unlocks = getUnlocksForPattern(pattern)
  return unlocks.find(u => fillPercent < u.threshold) || null
}

/**
 * Calculate progress to next unlock
 */
export function getProgressToNextUnlock(pattern: PatternType, fillPercent: number): {
  nextUnlock: PatternUnlock | null
  pointsNeeded: number
  progressPercent: number
} {
  const nextUnlock = getNextUnlock(pattern, fillPercent)
  if (!nextUnlock) {
    return { nextUnlock: null, pointsNeeded: 0, progressPercent: 100 }
  }

  const unlocks = getUnlocksForPattern(pattern)
  const prevUnlock = unlocks.filter(u => u.threshold < nextUnlock.threshold).pop()
  const prevThreshold = prevUnlock?.threshold || 0

  const range = nextUnlock.threshold - prevThreshold
  const progress = fillPercent - prevThreshold
  const progressPercent = Math.round((progress / range) * 100)

  return {
    nextUnlock,
    pointsNeeded: nextUnlock.threshold - fillPercent,
    progressPercent: Math.max(0, Math.min(100, progressPercent)),
  }
}

/**
 * Check if a specific unlock is achieved
 */
export function isUnlockAchieved(unlockId: string, patternFills: Record<PatternType, number>): boolean {
  const unlock = PATTERN_UNLOCKS.find(u => u.id === unlockId)
  if (!unlock) return false
  return patternFills[unlock.pattern] >= unlock.threshold
}

/**
 * Get all currently unlocked abilities across all patterns
 */
export function getAllUnlockedAbilities(patternFills: Record<PatternType, number>): PatternUnlock[] {
  return PATTERN_UNLOCKS.filter(u => patternFills[u.pattern] >= u.threshold)
}

/**
 * Get pattern tagline (flavor text for each orb)
 */
export function getPatternTagline(pattern: PatternType): string {
  const taglines: Record<PatternType, string> = {
    analytical: 'You notice what others miss.',
    patience: 'You understand the value of waiting.',
    exploring: 'Your curiosity opens doors.',
    helping: 'You feel what others feel.',
    building: 'You shape the world around you.',
  }
  return taglines[pattern]
}

/**
 * Convert raw orb count to fill percentage (assuming 100 = full)
 */
export function orbCountToFillPercent(orbCount: number, maxOrbs: number = 100): number {
  return Math.min(100, Math.round((orbCount / maxOrbs) * 100))
}
