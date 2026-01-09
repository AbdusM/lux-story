/**
 * D-038: Milestone Celebrations
 * Visual celebration moments for player achievements
 *
 * Philosophy:
 * - Celebrations should feel earned, not gamified
 * - Subtle enough to not interrupt flow, impactful enough to feel special
 * - Respect reduced motion preferences
 */

import { PatternType, PATTERN_THRESHOLDS, PATTERN_METADATA } from './patterns'
import { CharacterId } from './graph-registry'
import type { MetaAchievement } from './meta-achievements'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Types of milestone celebrations
 */
export type CelebrationType =
  | 'first_meeting'      // Met a new character
  | 'trust_milestone'    // Reached trust level 5 or 10
  | 'pattern_emerging'   // Pattern reached EMERGING threshold (3)
  | 'pattern_developing' // Pattern reached DEVELOPING threshold (6)
  | 'pattern_flourishing'// Pattern reached FLOURISHING threshold (9)
  | 'arc_complete'       // Completed a character arc
  | 'achievement'        // Unlocked a meta-achievement
  | 'full_trust'         // Reached trust 10 with a character
  | 'identity_formed'    // Identity ceremony triggered

/**
 * Visual effect types for celebrations
 */
export type CelebrationEffect =
  | 'confetti'           // Particle confetti burst
  | 'glow'               // Radial glow pulse
  | 'shimmer'            // Shimmering overlay
  | 'pulse'              // Pulsing emphasis
  | 'ripple'             // Ripple wave effect
  | 'sparkle'            // Scattered sparkles
  | 'none'               // No visual effect (for reduced motion)

/**
 * Celebration instance
 */
export interface MilestoneCelebration {
  id: string
  type: CelebrationType
  effect: CelebrationEffect
  duration: number        // Duration in ms
  title: string           // Short title (e.g., "New Connection!")
  message: string         // Celebration message
  icon?: string           // Emoji icon
  color?: string          // Theme color (hex)
  sound?: string          // Sound effect ID
  characterId?: CharacterId
  patternType?: PatternType
  achievementId?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// CELEBRATION CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default effects for each celebration type
 */
export const CELEBRATION_DEFAULTS: Record<CelebrationType, {
  effect: CelebrationEffect
  duration: number
  icon: string
}> = {
  first_meeting: {
    effect: 'sparkle',
    duration: 2000,
    icon: '✨'
  },
  trust_milestone: {
    effect: 'glow',
    duration: 2500,
    icon: '💫'
  },
  pattern_emerging: {
    effect: 'shimmer',
    duration: 2000,
    icon: '🌱'
  },
  pattern_developing: {
    effect: 'glow',
    duration: 2500,
    icon: '🌿'
  },
  pattern_flourishing: {
    effect: 'confetti',
    duration: 3000,
    icon: '🌟'
  },
  arc_complete: {
    effect: 'confetti',
    duration: 3500,
    icon: '🎭'
  },
  achievement: {
    effect: 'ripple',
    duration: 3000,
    icon: '🏆'
  },
  full_trust: {
    effect: 'glow',
    duration: 3000,
    icon: '💜'
  },
  identity_formed: {
    effect: 'confetti',
    duration: 4000,
    icon: '🔮'
  }
}

/**
 * Messages for pattern celebrations
 */
export const PATTERN_CELEBRATION_MESSAGES: Record<PatternType, {
  emerging: string
  developing: string
  flourishing: string
}> = {
  analytical: {
    emerging: 'Your analytical nature is awakening',
    developing: 'The patterns reveal themselves to you',
    flourishing: 'The Weaver emerges - you see the threads others miss'
  },
  patience: {
    emerging: 'Patience takes root within you',
    developing: 'You understand the wisdom of stillness',
    flourishing: 'The Anchor is forged - you are the stillness in the storm'
  },
  exploring: {
    emerging: 'Curiosity stirs in your heart',
    developing: 'The horizon calls ever stronger',
    flourishing: 'The Voyager awakens - the unknown beckons you forward'
  },
  helping: {
    emerging: 'Your caring nature surfaces',
    developing: 'Others sense the warmth you carry',
    flourishing: 'The Harmonic resonates - you feel the connections between all things'
  },
  building: {
    emerging: 'The urge to create grows stronger',
    developing: 'Your hands shape what your mind envisions',
    flourishing: 'The Architect rises - you forge the future with your hands'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CELEBRATION GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a first meeting celebration
 */
export function createFirstMeetingCelebration(
  characterId: CharacterId,
  characterName: string
): MilestoneCelebration {
  const defaults = CELEBRATION_DEFAULTS.first_meeting
  return {
    id: `first_meeting_${characterId}_${Date.now()}`,
    type: 'first_meeting',
    effect: defaults.effect,
    duration: defaults.duration,
    title: 'New Connection',
    message: `You've met ${characterName}`,
    icon: defaults.icon,
    characterId
  }
}

/**
 * Create a trust milestone celebration
 */
export function createTrustMilestoneCelebration(
  characterId: CharacterId,
  characterName: string,
  trustLevel: number
): MilestoneCelebration {
  const isFull = trustLevel >= 10
  const defaults = isFull ? CELEBRATION_DEFAULTS.full_trust : CELEBRATION_DEFAULTS.trust_milestone

  return {
    id: `trust_${characterId}_${trustLevel}_${Date.now()}`,
    type: isFull ? 'full_trust' : 'trust_milestone',
    effect: defaults.effect,
    duration: defaults.duration,
    title: isFull ? 'Deep Bond' : 'Growing Trust',
    message: isFull
      ? `${characterName} trusts you completely`
      : `Your bond with ${characterName} grows stronger`,
    icon: defaults.icon,
    characterId
  }
}

/**
 * Create a pattern threshold celebration
 */
export function createPatternCelebration(
  pattern: PatternType,
  threshold: 'emerging' | 'developing' | 'flourishing'
): MilestoneCelebration {
  const typeMap: Record<typeof threshold, CelebrationType> = {
    emerging: 'pattern_emerging',
    developing: 'pattern_developing',
    flourishing: 'pattern_flourishing'
  }
  const type = typeMap[threshold]
  const defaults = CELEBRATION_DEFAULTS[type]
  const messages = PATTERN_CELEBRATION_MESSAGES[pattern]
  const metadata = PATTERN_METADATA[pattern]

  const titleMap: Record<typeof threshold, string> = {
    emerging: `${metadata.shortLabel} Emerging`,
    developing: `${metadata.shortLabel} Developing`,
    flourishing: metadata.label
  }

  return {
    id: `pattern_${pattern}_${threshold}_${Date.now()}`,
    type,
    effect: defaults.effect,
    duration: defaults.duration,
    title: titleMap[threshold],
    message: messages[threshold],
    icon: defaults.icon,
    color: metadata.color,
    patternType: pattern
  }
}

/**
 * Create an arc completion celebration
 */
export function createArcCompletionCelebration(
  characterId: CharacterId,
  characterName: string,
  arcName: string
): MilestoneCelebration {
  const defaults = CELEBRATION_DEFAULTS.arc_complete

  return {
    id: `arc_${characterId}_${Date.now()}`,
    type: 'arc_complete',
    effect: defaults.effect,
    duration: defaults.duration,
    title: 'Journey Complete',
    message: `You've completed ${characterName}'s story: "${arcName}"`,
    icon: defaults.icon,
    characterId
  }
}

/**
 * Create an achievement celebration
 */
export function createAchievementCelebration(
  achievement: MetaAchievement
): MilestoneCelebration {
  const defaults = CELEBRATION_DEFAULTS.achievement

  return {
    id: `achievement_${achievement.id}_${Date.now()}`,
    type: 'achievement',
    effect: defaults.effect,
    duration: defaults.duration,
    title: achievement.name,
    message: achievement.description,
    icon: achievement.icon || defaults.icon,
    achievementId: achievement.id
  }
}

/**
 * Create an identity ceremony celebration
 */
export function createIdentityCelebration(
  pattern: PatternType
): MilestoneCelebration {
  const defaults = CELEBRATION_DEFAULTS.identity_formed
  const metadata = PATTERN_METADATA[pattern]

  return {
    id: `identity_${pattern}_${Date.now()}`,
    type: 'identity_formed',
    effect: defaults.effect,
    duration: defaults.duration,
    title: `You are ${metadata.label}`,
    message: `This path is now part of who you are`,
    icon: defaults.icon,
    color: metadata.color,
    patternType: pattern
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a pattern level crossed a celebration threshold
 */
export function checkPatternCelebration(
  oldLevel: number,
  newLevel: number
): 'emerging' | 'developing' | 'flourishing' | null {
  // Check flourishing first (highest priority)
  if (oldLevel < PATTERN_THRESHOLDS.FLOURISHING && newLevel >= PATTERN_THRESHOLDS.FLOURISHING) {
    return 'flourishing'
  }
  // Then check developing
  if (oldLevel < PATTERN_THRESHOLDS.DEVELOPING && newLevel >= PATTERN_THRESHOLDS.DEVELOPING) {
    return 'developing'
  }
  // Then check emerging
  if (oldLevel < PATTERN_THRESHOLDS.EMERGING && newLevel >= PATTERN_THRESHOLDS.EMERGING) {
    return 'emerging'
  }
  return null
}

/**
 * Check if trust level crossed a milestone (5 or 10)
 */
export function checkTrustCelebration(
  oldTrust: number,
  newTrust: number
): number | null {
  // Check 10 first (higher priority)
  if (oldTrust < 10 && newTrust >= 10) {
    return 10
  }
  // Then check 5
  if (oldTrust < 5 && newTrust >= 5) {
    return 5
  }
  return null
}

/**
 * Get reduced motion effect (for accessibility)
 */
export function getReducedMotionEffect(effect: CelebrationEffect): CelebrationEffect {
  // For reduced motion, use simpler effects
  switch (effect) {
    case 'confetti':
    case 'sparkle':
    case 'ripple':
      return 'glow' // Simpler glow instead of particles
    case 'shimmer':
      return 'pulse' // Static pulse instead of animation
    default:
      return effect
  }
}

/**
 * Get celebration effect for reduced motion preference
 */
export function getCelebrationWithMotionPreference(
  celebration: MilestoneCelebration,
  prefersReducedMotion: boolean
): MilestoneCelebration {
  if (!prefersReducedMotion) return celebration

  return {
    ...celebration,
    effect: getReducedMotionEffect(celebration.effect),
    duration: Math.min(celebration.duration, 2000) // Shorter duration
  }
}
