/**
 * Pattern Mastery Display Layer
 *
 * Maps existing OrbTier values to station-themed display names.
 * This is a DISPLAY LAYER - it doesn't replace the orb system.
 *
 * DATA SOURCE: lib/orbs.ts - OrbTier enum and ORB_TIERS thresholds
 *
 * @module lib/ranking/pattern-mastery-display
 */

import { randomPick } from '@/lib/seeded-random'
import type { OrbTier, OrbBalance } from '@/lib/orbs'
import { getOrbTier, ORB_TIERS } from '@/lib/orbs'
import type { PatternType, PlayerPatterns } from '@/lib/patterns'
import { PATTERN_TYPES, PATTERN_THRESHOLDS, getDominantPattern } from '@/lib/patterns'
import type {
  PatternMasteryDisplay,
  PatternMasteryState,
  PatternProgressView
} from './types'
// Registry functions available from './registry' if needed for future enhancements

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY NAME MAPPING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Station-themed display names for OrbTier values
 * These names are used by Samuel and in UI presentation
 */
export const PATTERN_MASTERY_DISPLAY: Record<OrbTier, PatternMasteryDisplay> = {
  nascent: {
    displayName: 'Traveler',
    description: 'Just arrived at the station. Everything is new.',
    iconVariant: 'compass'
  },
  emerging: {
    displayName: 'Passenger',
    description: 'Beginning to find your way. Patterns emerging.',
    iconVariant: 'ticket'
  },
  developing: {
    displayName: 'Regular',
    description: 'The station knows you. You know yourself.',
    iconVariant: 'badge'
  },
  flourishing: {
    displayName: 'Conductor',
    description: 'You guide your own journey now.',
    iconVariant: 'hat'
  },
  mastered: {
    displayName: 'Station Master',
    description: 'The station is part of you. You are part of it.',
    iconVariant: 'key'
  }
}

/**
 * OrbTier to rank tier ID mapping
 */
const ORB_TIER_TO_RANK_ID: Record<OrbTier, string> = {
  nascent: 'pm_traveler',
  emerging: 'pm_passenger',
  developing: 'pm_regular',
  flourishing: 'pm_conductor',
  mastered: 'pm_stationmaster'
}

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get display name for current orb tier
 */
export function getPatternMasteryDisplayName(orbTier: OrbTier): string {
  return PATTERN_MASTERY_DISPLAY[orbTier].displayName
}

/**
 * Get display info for current orb tier
 */
export function getPatternMasteryDisplayInfo(orbTier: OrbTier): PatternMasteryDisplay {
  return PATTERN_MASTERY_DISPLAY[orbTier]
}

/**
 * Get rank tier ID for orb tier
 */
export function getRankTierIdForOrbTier(orbTier: OrbTier): string {
  return ORB_TIER_TO_RANK_ID[orbTier]
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL PROMOTION MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Samuel's messages when player reaches new tier
 */
export const SAMUEL_PROMOTION_MESSAGES: Record<OrbTier, string[]> = {
  nascent: [
    "Welcome to the station. Your journey begins here."
  ],
  emerging: [
    "You're finding your rhythm here. The station notices.",
    "I've watched a lot of travelers. You're starting to understand."
  ],
  developing: [
    "I've seen a lot of travelers. You're becoming something more.",
    "The station recognizes you now. That means something."
  ],
  flourishing: [
    "You're not just riding the trains anymore. You're choosing the tracks.",
    "Conductors earn their title. You've earned yours."
  ],
  mastered: [
    "This place... it's yours now. As much as it's anyone's.",
    "Station Master. Few travelers reach this. Welcome home."
  ]
}

/**
 * Samuel's per-pattern messages
 */
export const SAMUEL_PATTERN_MESSAGES: Record<PatternType, Record<OrbTier, string>> = {
  analytical: {
    nascent: "You have a thinking way about you.",
    emerging: "That thinking habit of yours. It's sharpening.",
    developing: "You see the gears behind things. Not everyone does.",
    flourishing: "Analysis is your compass. Trust it.",
    mastered: "The patterns aren't just visible to you—they speak."
  },
  patience: {
    nascent: "You know how to wait. That's rare.",
    emerging: "Patience. The station rewards it.",
    developing: "You let things unfold. Wisdom in that.",
    flourishing: "Time bends for those who respect it.",
    mastered: "Stillness is your strength. The station knows."
  },
  exploring: {
    nascent: "Curiosity. I see it in you.",
    emerging: "Always looking for the next platform, aren't you?",
    developing: "The unknown doesn't scare you. Good.",
    flourishing: "Explorer. Voyager. The titles fit.",
    mastered: "Every corner of this place knows your footsteps."
  },
  helping: {
    nascent: "You notice when others struggle.",
    emerging: "That helping instinct. It's growing.",
    developing: "People seek you out. That says something.",
    flourishing: "Hearts open to you. Use that gift wisely.",
    mastered: "Harmonic. The word suits you."
  },
  building: {
    nascent: "Hands that want to make things. I see it.",
    emerging: "Builder's mind. Taking shape.",
    developing: "You don't just dream—you construct.",
    flourishing: "Architect of your own journey now.",
    mastered: "What you build here will outlast us all."
  }
}

/**
 * Get Samuel's promotion message for a tier
 */
export function getSamuelPromotionMessage(orbTier: OrbTier): string {
  const messages = SAMUEL_PROMOTION_MESSAGES[orbTier]
  return randomPick(messages)!
}

/**
 * Get Samuel's pattern-specific message
 */
export function getSamuelPatternMessage(pattern: PatternType, orbTier: OrbTier): string {
  return SAMUEL_PATTERN_MESSAGES[pattern][orbTier]
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get pattern threshold level from points
 */
function getPatternThresholdLevel(points: number): string {
  if (points >= PATTERN_THRESHOLDS.FLOURISHING) return 'flourishing'
  if (points >= PATTERN_THRESHOLDS.DEVELOPING) return 'developing'
  if (points >= PATTERN_THRESHOLDS.EMERGING) return 'emerging'
  return 'nascent'
}

/**
 * Calculate unlocks earned for a pattern (0-3 at 10%, 50%, 85%)
 */
function calculateUnlocksEarned(points: number, maxPoints: number = 100): number {
  const percentage = (points / maxPoints) * 100
  if (percentage >= 85) return 3
  if (percentage >= 50) return 2
  if (percentage >= 10) return 1
  return 0
}

/**
 * Calculate full pattern mastery state from game data
 *
 * @param patterns - PlayerPatterns from GameState
 * @param orbBalance - OrbBalance from GameState (optional, can derive from patterns)
 * @returns Full PatternMasteryState for display
 */
export function calculatePatternMasteryState(
  patterns: PlayerPatterns,
  orbBalance?: OrbBalance
): PatternMasteryState {
  // Calculate total from patterns or use orbBalance
  const totalOrbs = orbBalance?.totalEarned ??
    Object.values(patterns).reduce((sum, val) => sum + val, 0)

  // Get overall tier
  const overallOrbTier = getOrbTier(totalOrbs)
  const overallDisplayName = getPatternMasteryDisplayName(overallOrbTier)

  // Build per-pattern breakdown
  const perPattern: Record<PatternType, PatternProgressView> = {} as Record<PatternType, PatternProgressView>

  let maxValue = 0
  let minValue = Infinity

  for (const pattern of PATTERN_TYPES) {
    const points = patterns[pattern]

    perPattern[pattern] = {
      pattern,
      points,
      thresholdLevel: getPatternThresholdLevel(points),
      unlocksEarned: calculateUnlocksEarned(points)
    }

    if (points > maxValue) {
      maxValue = points
    }
    minValue = Math.min(minValue, points)
  }

  // Determine dominant (if threshold met)
  const dominant = getDominantPattern(patterns) ?? null

  // Check balance (all patterns within 2 of each other)
  const balanced = (maxValue - minValue) <= 2

  return {
    overallOrbTier,
    overallDisplayName,
    perPattern,
    dominant,
    balanced
  }
}

/**
 * Check for promotions between two states
 */
export function checkPatternPromotions(
  previousState: PatternMasteryState,
  currentState: PatternMasteryState
): Array<{
  type: 'overall' | 'pattern'
  pattern?: PatternType
  previousTier: OrbTier
  newTier: OrbTier
  message: string
}> {
  const promotions: Array<{
    type: 'overall' | 'pattern'
    pattern?: PatternType
    previousTier: OrbTier
    newTier: OrbTier
    message: string
  }> = []

  // Check overall promotion
  if (currentState.overallOrbTier !== previousState.overallOrbTier) {
    const prevLevel = Object.keys(ORB_TIERS).indexOf(previousState.overallOrbTier)
    const currLevel = Object.keys(ORB_TIERS).indexOf(currentState.overallOrbTier)

    if (currLevel > prevLevel) {
      promotions.push({
        type: 'overall',
        previousTier: previousState.overallOrbTier,
        newTier: currentState.overallOrbTier,
        message: getSamuelPromotionMessage(currentState.overallOrbTier)
      })
    }
  }

  // Check per-pattern promotions
  for (const pattern of PATTERN_TYPES) {
    const prevLevel = previousState.perPattern[pattern].thresholdLevel
    const currLevel = currentState.perPattern[pattern].thresholdLevel

    if (currLevel !== prevLevel) {
      const tierOrder = ['nascent', 'emerging', 'developing', 'flourishing']
      const prevIdx = tierOrder.indexOf(prevLevel)
      const currIdx = tierOrder.indexOf(currLevel)

      if (currIdx > prevIdx) {
        promotions.push({
          type: 'pattern',
          pattern,
          previousTier: prevLevel as OrbTier,
          newTier: currLevel as OrbTier,
          message: getSamuelPatternMessage(pattern, currLevel as OrbTier)
        })
      }
    }
  }

  return promotions
}
