/**
 * Identity Agency System
 *
 * The Disco Elysium Mechanic:
 * When a pattern crosses threshold 5, player gets identity choice:
 * "Is this who you are?"
 *
 * INTERNALIZE: Commit to this identity → +20% future gains
 * DISCARD: Stay flexible → No bonus, but no lock-in
 *
 * Design Philosophy:
 * - Identity is a conscious choice, not passive accumulation
 * - Commitment is rewarded, but flexibility isn't punished
 * - Players feel agency over their character development
 */

import { PatternType } from './patterns'
import { ActiveThought } from '@/content/thoughts'
import { GameState } from './character-state'

/**
 * Identity offering - the moment of choice
 */
export interface IdentityOffer {
  pattern: PatternType
  thoughtId: string
  internalizeBonus: number // +0.20 = +20% future gains
  threshold: number // Pattern level when offered (always 5)
}

/**
 * Internalized identity - player's conscious commitment
 */
export interface InternalizedIdentity {
  pattern: PatternType
  thoughtId: string
  internalizedAt: number // Timestamp
  bonus: number // The actual bonus applied (0.20 = +20%)
}

/**
 * Constants for identity system
 */
export const IDENTITY_CONSTANTS = {
  OFFERING_THRESHOLD: 5, // Pattern level when identity is offered
  INTERNALIZE_BONUS: 0.20, // +20% to future gains
  DISCARD_PENALTY: 0 // No penalty for discarding
} as const

/**
 * Check if a thought is an identity offering
 */
export function isIdentityThought(thoughtId: string): boolean {
  return thoughtId.startsWith('identity-')
}

/**
 * Extract pattern type from identity thought ID
 * @example extractPatternFromIdentity('identity-analytical') => 'analytical'
 */
export function extractPatternFromIdentity(thoughtId: string): PatternType | null {
  if (!isIdentityThought(thoughtId)) return null
  const pattern = thoughtId.replace('identity-', '')
  return pattern as PatternType
}

/**
 * Create identity offering when pattern crosses threshold
 * This is called automatically by StatefulGameInterface when pattern reaches 5
 */
export function createIdentityOffer(pattern: PatternType): IdentityOffer {
  return {
    pattern,
    thoughtId: `identity-${pattern}`,
    internalizeBonus: IDENTITY_CONSTANTS.INTERNALIZE_BONUS,
    threshold: IDENTITY_CONSTANTS.OFFERING_THRESHOLD
  }
}

/**
 * Get internalized identities from game state
 * These are thoughts with status='internalized' that start with 'identity-'
 */
export function getInternalizedIdentities(gameState: GameState): InternalizedIdentity[] {
  return gameState.thoughts
    .filter(t => t.status === 'internalized' && isIdentityThought(t.id))
    .map(t => ({
      pattern: extractPatternFromIdentity(t.id)!,
      thoughtId: t.id,
      internalizedAt: t.lastUpdated,
      bonus: IDENTITY_CONSTANTS.INTERNALIZE_BONUS
    }))
}

/**
 * Check if player has internalized a specific pattern identity
 */
export function hasInternalizedPattern(gameState: GameState, pattern: PatternType): boolean {
  return gameState.thoughts.some(
    t => t.id === `identity-${pattern}` && t.status === 'internalized'
  )
}

/**
 * Calculate modified pattern gain with internalization bonus
 *
 * This is the core mechanic:
 * - Base gain: 1 point per choice
 * - If identity internalized: 1 × (1 + 0.20) = 1.2 points
 *
 * @param baseGain - Base pattern points earned (usually 1)
 * @param pattern - Pattern being earned
 * @param gameState - Current game state
 * @returns Modified gain (1.0 or 1.2)
 */
export function calculatePatternGain(
  baseGain: number,
  pattern: PatternType,
  gameState: GameState
): number {
  const isInternalized = hasInternalizedPattern(gameState, pattern)

  if (isInternalized) {
    return baseGain * (1 + IDENTITY_CONSTANTS.INTERNALIZE_BONUS)
  }

  return baseGain
}

/**
 * Get all identity offers (developing status)
 * These are identity thoughts that player hasn't decided on yet
 */
export function getPendingIdentityOffers(gameState: GameState): ActiveThought[] {
  return gameState.thoughts.filter(
    t => isIdentityThought(t.id) && t.status === 'developing'
  )
}

/**
 * Get identity summary for UI display
 */
export function getIdentitySummary(gameState: GameState): {
  internalized: InternalizedIdentity[]
  pending: ActiveThought[]
  totalBonuses: Record<PatternType, number>
} {
  const internalized = getInternalizedIdentities(gameState)
  const pending = getPendingIdentityOffers(gameState)

  // Calculate total bonuses per pattern
  const totalBonuses = internalized.reduce((acc, identity) => {
    acc[identity.pattern] = identity.bonus
    return acc
  }, {} as Record<PatternType, number>)

  return {
    internalized,
    pending,
    totalBonuses
  }
}

/**
 * Format identity for display
 */
export function formatIdentityName(pattern: PatternType): string {
  const names: Record<PatternType, string> = {
    analytical: 'The Analytical Observer',
    patience: 'The Patient Observer',
    exploring: 'The Curious Wanderer',
    helping: 'The Compassionate Heart',
    building: 'The Creative Builder'
  }
  return names[pattern]
}

/**
 * Get identity description for player choice
 */
export function getIdentityChoiceText(pattern: PatternType): {
  question: string
  internalizeText: string
  discardText: string
} {
  const questions: Record<PatternType, string> = {
    analytical: "You notice yourself counting the rivets on the platform railing. Cataloging. Measuring. Analyzing patterns in the rust.",
    patience: "The train arrives when it arrives. You find yourself settling into the bench, watching others rush past. You've learned that some things can't be hurried.",
    exploring: "You've walked every platform at least twice. Checked every alcove. Asked questions others didn't think to ask. The unknown pulls at you like gravity.",
    helping: "When Maya looked scattered, you didn't see a problem to solve. You saw a person who needed someone to listen. Your chest tightens when others struggle.",
    building: "Your hands itch when you see something broken. Not to fix it back to what it was, but to make it better. Every problem feels like a project waiting to be built."
  }

  return {
    question: questions[pattern],
    internalizeText: `Embrace your ${pattern} nature. Future ${pattern} gains +20%. Characters acknowledge your chosen path.`,
    discardText: "Stay flexible. No identity lock-in. Continue developing other patterns."
  }
}

/**
 * Narrative hooks for Samuel's identity dialogues
 * These create the moment before offering the identity choice
 */
export function getSamuelIdentityDialogue(pattern: PatternType): {
  nodeId: string
  trigger: string
  samuelLine: string
} {
  const dialogues: Record<PatternType, { nodeId: string; trigger: string; samuelLine: string }> = {
    analytical: {
      nodeId: 'samuel_identity_analytical',
      trigger: 'analytical_threshold_5',
      samuelLine: "You been watchin' things real close. Notice how you pause before answerin'? Like you're turnin' somethin' over in your mind, lookin' at it from all sides.\n\nThat's a way of bein', not just a way of thinkin'. Question is: you comfortable with that? Or you just passin' through?"
    },
    patience: {
      nodeId: 'samuel_identity_patience',
      trigger: 'patience_threshold_5',
      samuelLine: "Noticed somethin' about you. When everyone else is rushin', you ain't. You let the moment breathe. Let things unfold.\n\nMost folks fight that. They think movin' fast means gettin' somewhere. But you... you seem to know better. That true? Or you still figurin' it out?"
    },
    exploring: {
      nodeId: 'samuel_identity_exploring',
      trigger: 'exploring_threshold_5',
      samuelLine: "You got that look. The one travelers get when they're mappin' new territory. Askin' questions nobody thought to ask. Checkin' corners most folks walk right past.\n\nCuriosity like that—it's either who you are, or it's somethin' you're tryin' on. Which is it?"
    },
    helping: {
      nodeId: 'samuel_identity_helping',
      trigger: 'helping_threshold_5',
      samuelLine: "You lean in when people talk. Really listen. I see you offerin' support before folks even ask for it. That ain't common.\n\nSome people help 'cause they think they should. Others help 'cause they can't not. Which one are you?"
    },
    building: {
      nodeId: 'samuel_identity_building',
      trigger: 'building_threshold_5',
      samuelLine: "Your hands move when you talk about ideas. Like you're already shapin' somethin' in your mind. You see a problem, you don't just analyze it—you wanna build the solution.\n\nThat's a maker's mindset. Question is: you claimin' it? Or you just borrowin' it for a while?"
    }
  }

  return dialogues[pattern]
}
