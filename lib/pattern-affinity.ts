/**
 * Pattern-Character Affinity System
 * Certain patterns resonate with certain characters, affecting trust gain rates
 *
 * Design Philosophy:
 * - Resonance feels like discovering a kindred spirit, not gaming a system
 * - Friction patterns create interesting TENSION, not lockouts
 * - Players discover affinities through NPC dialogue, not UI meters
 * - This honors the "silent tracking, feel comes first" principle
 */

import { PatternType, PATTERN_TYPES } from './patterns'

/**
 * Affinity levels determine trust multipliers
 */
export type AffinityLevel = 'primary' | 'secondary' | 'neutral' | 'friction'

/**
 * Pattern affinity configuration for a character
 */
export interface CharacterPatternAffinity {
  characterId: string
  primary: PatternType           // +50% trust gain - deep resonance
  secondary: PatternType         // +25% trust gain - natural fit
  neutral: PatternType[]         // Standard trust gain
  friction: PatternType          // -25% trust gain - productive tension (NOT blocked)

  // Resonance descriptions (for consequence echoes)
  resonanceDescriptions: {
    pattern: PatternType
    description: string          // Why this pattern resonates/creates friction
  }[]

  // Special dialogue unlocks at high pattern levels
  patternUnlocks?: {
    pattern: PatternType
    threshold: number            // Orb fill percentage (0-100)
    unlockedNodeId: string       // Special dialogue that unlocks
    description: string          // What this unlock represents
  }[]
}

/**
 * Trust multipliers for each affinity level
 */
export const AFFINITY_MULTIPLIERS: Record<AffinityLevel, number> = {
  primary: 1.5,     // +50% trust gain
  secondary: 1.25,  // +25% trust gain
  neutral: 1.0,     // Standard
  friction: 0.75    // -25% trust gain (tension, NOT blocked)
}

/**
 * All character pattern affinities
 * Starting with Maya as proof of concept
 */
export const CHARACTER_PATTERN_AFFINITIES: Record<string, CharacterPatternAffinity> = {
  maya: {
    characterId: 'maya',
    primary: 'building',        // Maya connects with fellow makers
    secondary: 'analytical',    // She respects systematic thinking
    neutral: ['patience', 'exploring'],
    friction: 'helping',        // She bristles at being "helped" - wants autonomy

    resonanceDescriptions: [
      {
        pattern: 'building',
        description: 'Maya sees a kindred maker spirit in you. Her eyes light up when you talk about creating things.'
      },
      {
        pattern: 'analytical',
        description: 'Your systematic thinking reminds Maya of how she approaches robotics problems.'
      },
      {
        pattern: 'patience',
        description: 'Maya appreciates that you don\'t rush her, even if she\'s not sure what to do with that kindness.'
      },
      {
        pattern: 'exploring',
        description: 'Your curiosity opens doors Maya didn\'t know existed.'
      },
      {
        pattern: 'helping',
        description: 'Maya tenses slightly. She\'s spent her whole life being helped into a box she didn\'t choose.'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'building',
        threshold: 40,
        unlockedNodeId: 'maya_workshop_invitation',
        description: 'Maya invites you to see her secret workshop'
      },
      {
        pattern: 'building',
        threshold: 70,
        unlockedNodeId: 'maya_collaboration_offer',
        description: 'Maya asks for your help on a robotics project'
      },
      {
        pattern: 'analytical',
        threshold: 50,
        unlockedNodeId: 'maya_technical_deep_dive',
        description: 'Maya shares the technical details she usually hides'
      }
    ]
  },

  // Additional characters will be added after Maya proves the system
  // Showing structure for reference:
  samuel: {
    characterId: 'samuel',
    primary: 'patience',         // Samuel values those who listen and wait
    secondary: 'helping',        // He appreciates those who help others
    neutral: ['analytical', 'exploring'],
    friction: 'building',        // He's wary of those who want to "fix" everything fast

    resonanceDescriptions: [
      {
        pattern: 'patience',
        description: 'Samuel nods slowly. You understand that some things can\'t be rushed.'
      },
      {
        pattern: 'helping',
        description: 'Samuel recognizes a fellow guide in you.'
      },
      {
        pattern: 'analytical',
        description: 'Samuel appreciates your thoughtfulness, even if he sees things differently.'
      },
      {
        pattern: 'exploring',
        description: 'Your curiosity reminds Samuel of his younger self.'
      },
      {
        pattern: 'building',
        description: 'Samuel watches carefully. Not everything needs to be fixed immediately.'
      }
    ],

    patternUnlocks: []
  },

  devon: {
    characterId: 'devon',
    primary: 'analytical',       // Devon connects with systematic thinkers
    secondary: 'building',       // He respects those who make things
    neutral: ['patience', 'exploring'],
    friction: 'helping',         // Direct emotional support makes him uncomfortable

    resonanceDescriptions: [
      {
        pattern: 'analytical',
        description: 'Devon\'s posture relaxes. You speak his language.'
      },
      {
        pattern: 'building',
        description: 'Devon respects that you understand making things.'
      },
      {
        pattern: 'patience',
        description: 'Devon appreciates that you don\'t push for immediate answers.'
      },
      {
        pattern: 'exploring',
        description: 'Your questions make Devon think in new ways.'
      },
      {
        pattern: 'helping',
        description: 'Devon shifts uncomfortably. He prefers systems to sentiment.'
      }
    ],

    patternUnlocks: []
  }
}

/**
 * Get the affinity level between a player's pattern and a character
 */
export function getPatternAffinityLevel(
  characterId: string,
  pattern: PatternType
): AffinityLevel {
  const affinity = CHARACTER_PATTERN_AFFINITIES[characterId]
  if (!affinity) return 'neutral'

  if (affinity.primary === pattern) return 'primary'
  if (affinity.secondary === pattern) return 'secondary'
  if (affinity.friction === pattern) return 'friction'
  return 'neutral'
}

/**
 * Get the trust multiplier for a character based on player's dominant pattern
 */
export function getTrustMultiplier(
  characterId: string,
  dominantPattern: PatternType | null
): number {
  if (!dominantPattern) return 1.0

  const affinityLevel = getPatternAffinityLevel(characterId, dominantPattern)
  return AFFINITY_MULTIPLIERS[affinityLevel]
}

/**
 * Get the resonance description for a pattern-character pair
 */
export function getResonanceDescription(
  characterId: string,
  pattern: PatternType
): string | null {
  const affinity = CHARACTER_PATTERN_AFFINITIES[characterId]
  if (!affinity) return null

  const resonance = affinity.resonanceDescriptions.find(r => r.pattern === pattern)
  return resonance?.description || null
}

/**
 * Get pattern-based dialogue unlocks for a character
 */
export function getPatternUnlocks(
  characterId: string,
  patternLevels: Record<PatternType, number>  // Orb fill percentages
): string[] {
  const affinity = CHARACTER_PATTERN_AFFINITIES[characterId]
  if (!affinity?.patternUnlocks) return []

  return affinity.patternUnlocks
    .filter(unlock => patternLevels[unlock.pattern] >= unlock.threshold)
    .map(unlock => unlock.unlockedNodeId)
}

/**
 * Get the dominant pattern from player's pattern scores
 * Returns null if no clear dominant (need minimum threshold)
 */
export function getDominantPattern(
  patterns: Record<PatternType, number>,
  minThreshold = 3
): PatternType | null {
  const entries = Object.entries(patterns) as [PatternType, number][]
  const sorted = entries.sort((a, b) => b[1] - a[1])

  // Need at least minThreshold points in dominant pattern
  if (sorted[0][1] >= minThreshold) {
    return sorted[0][0]
  }
  return null
}

/**
 * Calculate modified trust change based on pattern affinity
 * This is called during StateChange application
 */
export function calculateResonantTrustChange(
  baseTrustChange: number,
  characterId: string,
  playerPatterns: Record<PatternType, number>,
  choicePattern?: PatternType
): {
  modifiedTrust: number
  resonanceTriggered: boolean
  resonanceDescription: string | null
} {
  const dominantPattern = getDominantPattern(playerPatterns)

  // Start with base trust
  let modifiedTrust = baseTrustChange
  let resonanceTriggered = false
  let resonanceDescription: string | null = null

  // Apply multiplier based on player's dominant pattern (who they ARE)
  if (dominantPattern) {
    const multiplier = getTrustMultiplier(characterId, dominantPattern)
    if (multiplier !== 1.0) {
      modifiedTrust = Math.round(baseTrustChange * multiplier)
      resonanceTriggered = true
      resonanceDescription = getResonanceDescription(characterId, dominantPattern)
    }
  }

  // Additional bonus/penalty for this specific choice's pattern (what they DID)
  if (choicePattern && choicePattern !== dominantPattern) {
    const choiceMultiplier = getTrustMultiplier(characterId, choicePattern)
    if (choiceMultiplier !== 1.0) {
      // Smaller effect for single choice vs overall pattern
      const choiceAdjustment = baseTrustChange * (choiceMultiplier - 1.0) * 0.5
      modifiedTrust += Math.round(choiceAdjustment)
      if (!resonanceTriggered) {
        resonanceTriggered = true
        resonanceDescription = getResonanceDescription(characterId, choicePattern)
      }
    }
  }

  return {
    modifiedTrust,
    resonanceTriggered,
    resonanceDescription
  }
}

/**
 * Validate pattern type at runtime
 */
export function isValidPatternType(pattern: string): pattern is PatternType {
  return PATTERN_TYPES.includes(pattern as PatternType)
}
