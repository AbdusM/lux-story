/**
 * Orb System - Insight Currency for Lux Story
 *
 * Orbs represent self-knowledge earned through choices.
 * Players earn orbs by making choices that demonstrate patterns,
 * and can allocate them to unlock career insights and dialogue options.
 *
 * Inspired by LinkDap's orb economy and Diablo's attribute system.
 */

import { PatternType, PATTERN_METADATA } from './patterns'

// ═══════════════════════════════════════════════════════════════════════════
// ORB TYPES & TIERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Orb types match the 5 pattern types
 */
export type OrbType = PatternType

/**
 * Orb tiers based on total orbs earned
 */
export type OrbTier = 'nascent' | 'emerging' | 'developing' | 'flourishing' | 'mastered'

/**
 * Tier thresholds and metadata
 */
export const ORB_TIERS: Record<OrbTier, {
  minOrbs: number
  label: string
  description: string
  color: string
  glowIntensity: number
}> = {
  nascent: {
    minOrbs: 0,
    label: 'Nascent',
    description: 'Your journey is just beginning',
    color: '#94A3B8', // slate-400
    glowIntensity: 0.2
  },
  emerging: {
    minOrbs: 10,
    label: 'Emerging',
    description: 'Patterns are starting to form',
    color: '#60A5FA', // blue-400
    glowIntensity: 0.4
  },
  developing: {
    minOrbs: 30,
    label: 'Developing',
    description: 'Your style is taking shape',
    color: '#A78BFA', // violet-400
    glowIntensity: 0.6
  },
  flourishing: {
    minOrbs: 60,
    label: 'Flourishing',
    description: 'The station recognizes you',
    color: '#FBBF24', // amber-400
    glowIntensity: 0.8
  },
  mastered: {
    minOrbs: 100,
    label: 'Mastered',
    description: 'You know who you are',
    color: '#F472B6', // pink-400
    glowIntensity: 1.0
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ORB BALANCE & TRACKING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Player's orb balance across all types
 */
export interface OrbBalance {
  // Orbs by pattern type
  analytical: number
  patience: number
  exploring: number
  helping: number
  building: number

  // Totals
  totalEarned: number
  totalAllocated: number
  availableToAllocate: number

  // Streaks (consecutive choices of same pattern)
  currentStreak: number
  currentStreakType: OrbType | null
  bestStreak: number

  // Milestones
  arcCompletions: number
  patternThresholdsHit: number
}

/**
 * Transaction record for orb movements
 */
export interface OrbTransaction {
  id: string
  timestamp: number
  type: 'earned' | 'allocated' | 'bonus' | 'milestone'
  orbType: OrbType
  amount: number
  reason: string
  balanceBefore: number
  balanceAfter: number
}

/**
 * Allocation target - where orbs can be spent
 */
export interface AllocationTarget {
  id: string
  name: string
  description: string
  requiredOrbs: Record<OrbType, number>
  unlocks: string[] // What this allocation unlocks
  isUnlocked: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// EARNING MECHANICS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Orbs earned per action
 */
export const ORB_EARNINGS = {
  // Base earnings
  choice: 1,              // Any choice earns 1 orb of matching pattern

  // Bonuses
  arcCompletion: 5,       // Completing a character arc
  patternThreshold: 10,   // First time hitting pattern threshold (5+)
  trustMilestone: 3,      // Reaching trust milestone with character

  // Streak bonuses
  streak3: 2,             // 3 consecutive same-pattern choices
  streak5: 5,             // 5 consecutive
  streak10: 15,           // 10 consecutive

  // Special
  samuelRecognition: 5,   // When Samuel acknowledges your pattern
  journeyComplete: 25     // Completing full journey
}

/**
 * Calculate streak bonus
 */
export function getStreakBonus(streak: number): number {
  if (streak >= 10) return ORB_EARNINGS.streak10
  if (streak >= 5) return ORB_EARNINGS.streak5
  if (streak >= 3) return ORB_EARNINGS.streak3
  return 0
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get orb tier from total orbs
 */
export function getOrbTier(totalOrbs: number): OrbTier {
  if (totalOrbs >= ORB_TIERS.mastered.minOrbs) return 'mastered'
  if (totalOrbs >= ORB_TIERS.flourishing.minOrbs) return 'flourishing'
  if (totalOrbs >= ORB_TIERS.developing.minOrbs) return 'developing'
  if (totalOrbs >= ORB_TIERS.emerging.minOrbs) return 'emerging'
  return 'nascent'
}

/**
 * Get tier metadata
 */
export function getOrbTierMetadata(tier: OrbTier) {
  return ORB_TIERS[tier]
}

/**
 * Get color for orb type (uses pattern colors)
 */
export function getOrbColor(orbType: OrbType): string {
  return PATTERN_METADATA[orbType].color
}

/**
 * Get gradient for orb type
 */
export function getOrbGradient(orbType: OrbType): string {
  const color = PATTERN_METADATA[orbType].color
  return `radial-gradient(circle at 30% 30%, ${color}88, ${color})`
}

/**
 * Format orb count for display
 */
export function formatOrbCount(orbs: number): string {
  if (orbs >= 1000) return `${(orbs / 1000).toFixed(1)}K`
  return orbs.toString()
}

/**
 * Calculate dominant orb type from balance
 */
export function getDominantOrbType(balance: OrbBalance): OrbType | null {
  const types: OrbType[] = ['analytical', 'patience', 'exploring', 'helping', 'building']
  let maxType: OrbType | null = null
  let maxCount = 0

  for (const type of types) {
    if (balance[type] > maxCount) {
      maxCount = balance[type]
      maxType = type
    }
  }

  return maxType
}

/**
 * Get orb distribution as percentages
 */
export function getOrbDistribution(balance: OrbBalance): Record<OrbType, number> {
  const types: OrbType[] = ['analytical', 'patience', 'exploring', 'helping', 'building']
  const total = types.reduce((sum, type) => sum + balance[type], 0)

  if (total === 0) {
    return { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 }
  }

  const distribution: Record<OrbType, number> = {} as Record<OrbType, number>
  for (const type of types) {
    distribution[type] = Math.round((balance[type] / total) * 100)
  }

  return distribution
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default orb balance for new players
 */
export const INITIAL_ORB_BALANCE: OrbBalance = {
  analytical: 0,
  patience: 0,
  exploring: 0,
  helping: 0,
  building: 0,
  totalEarned: 0,
  totalAllocated: 0,
  availableToAllocate: 0,
  currentStreak: 0,
  currentStreakType: null,
  bestStreak: 0,
  arcCompletions: 0,
  patternThresholdsHit: 0
}

// ═══════════════════════════════════════════════════════════════════════════
// ORB MESSAGES - What Samuel says when orbs are earned
// ═══════════════════════════════════════════════════════════════════════════

export const ORB_MILESTONE_MESSAGES: Record<string, string[]> = {
  firstOrb: [
    "The station notices you.",
    "Something stirs in the patterns.",
    "You're beginning to understand."
  ],
  tier_emerging: [
    "Your patterns are taking shape.",
    "The station sees who you're becoming.",
    "You've earned something here."
  ],
  tier_developing: [
    "The station recognizes your way of seeing.",
    "Your choices have weight now.",
    "You're finding your path."
  ],
  tier_flourishing: [
    "The platforms respond to you now.",
    "You've earned the station's trust.",
    "Your journey has meaning."
  ],
  tier_mastered: [
    "You know who you are.",
    "The station was waiting for you.",
    "Some travelers find their way. You have."
  ],
  streak3: [
    "Consistency. The station notices.",
    "Three in a row. A pattern emerges."
  ],
  streak5: [
    "Five choices, one voice. You know yourself.",
    "The station hums in recognition."
  ],
  streak10: [
    "Ten. Remarkable clarity.",
    "Few travelers show such conviction."
  ],
  arcComplete: [
    "A chapter closes. New paths open.",
    "You've earned more than knowledge here.",
    "Their story is now part of yours."
  ]
}

/**
 * Get a random milestone message
 */
export function getOrbMilestoneMessage(milestone: keyof typeof ORB_MILESTONE_MESSAGES): string {
  const messages = ORB_MILESTONE_MESSAGES[milestone]
  return messages[Math.floor(Math.random() * messages.length)]
}
