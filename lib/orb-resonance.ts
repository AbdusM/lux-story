/**
 * Orb Resonance System
 *
 * Connects pattern accumulation to dialogue unlocks.
 * Follows Invisible Depth Principle: backend tracks silently,
 * manifestation only through Samuel's dialogue.
 *
 * Orb tiers trigger global flags that unlock new Samuel topics.
 */

import { OrbTier, ORB_TIERS, getOrbTier } from './orbs'
import { PlayerPatterns } from './character-state'
import { PatternType } from './patterns'

/**
 * Orb resonance state - derived from patterns
 */
export interface OrbResonanceState {
  totalOrbs: number
  currentTier: OrbTier
  previousTier: OrbTier | null
  tierJustUnlocked: OrbTier | null
  dominantPattern: PatternType | null
}

/**
 * Global flags set when orb tiers are reached
 */
export const ORB_TIER_FLAGS = {
  emerging: 'orb_tier_emerging',    // 10+ orbs
  developing: 'orb_tier_developing', // 30+ orbs
  flourishing: 'orb_tier_flourishing', // 60+ orbs
  mastered: 'orb_tier_mastered'     // 100+ orbs
} as const

/**
 * Samuel dialogue nodes unlocked by orb tiers
 */
export const ORB_DIALOGUE_UNLOCKS: Record<OrbTier, string | null> = {
  nascent: null, // No special dialogue at start
  emerging: 'samuel_orb_emerging',
  developing: 'samuel_orb_developing',
  flourishing: 'samuel_orb_flourishing',
  mastered: 'samuel_orb_mastered'
}

/**
 * Calculate total orbs from pattern scores
 * Each pattern point = 1 orb earned
 */
export function calculateTotalOrbs(patterns: PlayerPatterns): number {
  return (
    patterns.analytical +
    patterns.patience +
    patterns.exploring +
    patterns.helping +
    patterns.building
  )
}

/**
 * Get the dominant pattern (highest score)
 */
export function getDominantPattern(patterns: PlayerPatterns): PatternType | null {
  const entries: [PatternType, number][] = [
    ['analytical', patterns.analytical],
    ['patience', patterns.patience],
    ['exploring', patterns.exploring],
    ['helping', patterns.helping],
    ['building', patterns.building]
  ]

  const sorted = entries.sort((a, b) => b[1] - a[1])

  // Return null if no patterns yet
  if (sorted[0][1] === 0) return null

  return sorted[0][0]
}

/**
 * Calculate orb resonance state from patterns
 */
export function calculateOrbResonance(
  patterns: PlayerPatterns,
  previousGlobalFlags: Set<string>
): OrbResonanceState {
  const totalOrbs = calculateTotalOrbs(patterns)
  const currentTier = getOrbTier(totalOrbs)
  const dominantPattern = getDominantPattern(patterns)

  // Determine previous tier from flags
  let previousTier: OrbTier | null = null
  if (previousGlobalFlags.has(ORB_TIER_FLAGS.mastered)) {
    previousTier = 'mastered'
  } else if (previousGlobalFlags.has(ORB_TIER_FLAGS.flourishing)) {
    previousTier = 'flourishing'
  } else if (previousGlobalFlags.has(ORB_TIER_FLAGS.developing)) {
    previousTier = 'developing'
  } else if (previousGlobalFlags.has(ORB_TIER_FLAGS.emerging)) {
    previousTier = 'emerging'
  }

  // Check if tier just unlocked
  let tierJustUnlocked: OrbTier | null = null
  if (currentTier !== 'nascent' && currentTier !== previousTier) {
    // Check if this is a new tier achievement
    const tierOrder: OrbTier[] = ['nascent', 'emerging', 'developing', 'flourishing', 'mastered']
    const currentIndex = tierOrder.indexOf(currentTier)
    const previousIndex = previousTier ? tierOrder.indexOf(previousTier) : -1

    if (currentIndex > previousIndex) {
      tierJustUnlocked = currentTier
    }
  }

  return {
    totalOrbs,
    currentTier,
    previousTier,
    tierJustUnlocked,
    dominantPattern
  }
}

/**
 * Get global flags to add when orb tier is reached
 * Returns flags that should be added to game state
 */
export function getOrbTierFlags(tier: OrbTier): string[] {
  const flags: string[] = []

  // Add cumulative flags (reaching tier 3 means you've passed tiers 1-2)
  const tierOrder: OrbTier[] = ['nascent', 'emerging', 'developing', 'flourishing', 'mastered']
  const tierIndex = tierOrder.indexOf(tier)

  if (tierIndex >= 1) flags.push(ORB_TIER_FLAGS.emerging)
  if (tierIndex >= 2) flags.push(ORB_TIER_FLAGS.developing)
  if (tierIndex >= 3) flags.push(ORB_TIER_FLAGS.flourishing)
  if (tierIndex >= 4) flags.push(ORB_TIER_FLAGS.mastered)

  return flags
}

/**
 * Check if player has reached a specific orb tier
 */
export function hasReachedOrbTier(tier: OrbTier, globalFlags: Set<string>): boolean {
  if (tier === 'nascent') return true

  const flagKey = tier as keyof typeof ORB_TIER_FLAGS
  return globalFlags.has(ORB_TIER_FLAGS[flagKey])
}

/**
 * Get tier-specific Samuel dialogue prompt
 * These are the "resonance" dialogues Samuel offers
 */
export function getOrbTierDialoguePrompt(tier: OrbTier): string {
  const prompts: Record<OrbTier, string> = {
    nascent: '',
    emerging: '"Something stirs in the patterns..."',
    developing: '"The station recognizes your way of seeing..."',
    flourishing: '"The platforms respond to you now..."',
    mastered: '"You know who you are..."'
  }

  return prompts[tier]
}

/**
 * Get tier progress as percentage to next tier
 */
export function getOrbTierProgress(totalOrbs: number): {
  currentTier: OrbTier
  progress: number
  orbsToNext: number
  nextTier: OrbTier | null
} {
  const currentTier = getOrbTier(totalOrbs)
  const tierOrder: OrbTier[] = ['nascent', 'emerging', 'developing', 'flourishing', 'mastered']
  const currentIndex = tierOrder.indexOf(currentTier)

  if (currentIndex >= tierOrder.length - 1) {
    return {
      currentTier,
      progress: 100,
      orbsToNext: 0,
      nextTier: null
    }
  }

  const nextTier = tierOrder[currentIndex + 1]
  const currentMin = ORB_TIERS[currentTier].minOrbs
  const nextMin = ORB_TIERS[nextTier].minOrbs
  const range = nextMin - currentMin
  const orbsInRange = totalOrbs - currentMin

  return {
    currentTier,
    progress: Math.round((orbsInRange / range) * 100),
    orbsToNext: nextMin - totalOrbs,
    nextTier
  }
}
