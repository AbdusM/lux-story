/**
 * Character Typing Rhythms
 *
 * Each character has a distinct "voice" through timing, not character-by-character
 * typing. This affects how chunks are revealed and how long thinking indicators show.
 *
 * Philosophy: "Kill the Typewriter"
 * Humans read by scanning word shapes (saccades), not letter-by-letter.
 * But we CAN modulate the rhythm of chunk reveals to convey personality.
 */

export interface CharacterTypingConfig {
  /** Base duration for typing indicator (ms) before revealing chunk */
  typingDuration: number
  /** Minimum delay between chunk reveals (ms) */
  minChunkDelay: number
  /** Additional delay per character in chunk (ms) - simulates "processing" */
  msPerChar: number
  /** Maximum total chunk delay (ms) */
  maxChunkDelay: number
  /** Personality descriptor for debugging */
  personality: string
}

/**
 * Typing configurations for each character
 *
 * Design rationale:
 * - Samuel: Slow, deliberate (wise mentor, takes time)
 * - Maya: Quick, restless (sharp, impatient energy)
 * - Devon: Precise, consistent (analytical, measured)
 * - Jordan: Casual, flowing (friendly, easy rhythm)
 * - Marcus: Measured, careful (practical, steady)
 * - Kai: Thoughtful pauses (present, contemplative)
 * - Tess: Organized, efficient (crisp, no wasted time)
 * - Yaquin: Dreamy, variable (artistic, unpredictable)
 * - Rohan: Direct, minimal (confident, no hesitation)
 * - Silas: Deliberate, weighted (mysterious, intentional)
 */
export const CHARACTER_TYPING: Record<string, CharacterTypingConfig> = {
  // Samuel - Wise owl, deliberate pauses, comfortable with silence
  samuel: {
    typingDuration: 1000,
    minChunkDelay: 400,
    msPerChar: 8,
    maxChunkDelay: 2000,
    personality: 'deliberate'
  },

  // Maya - Fox energy, quick and restless
  maya: {
    typingDuration: 500,
    minChunkDelay: 200,
    msPerChar: 4,
    maxChunkDelay: 1000,
    personality: 'restless'
  },

  // Devon - Cat precision, consistent rhythm
  devon: {
    typingDuration: 700,
    minChunkDelay: 300,
    msPerChar: 5,
    maxChunkDelay: 1200,
    personality: 'precise'
  },

  // Jordan - Dog friendliness, easy flowing
  jordan: {
    typingDuration: 600,
    minChunkDelay: 250,
    msPerChar: 5,
    maxChunkDelay: 1100,
    personality: 'casual'
  },

  // Marcus - Bear steadiness, measured and careful
  marcus: {
    typingDuration: 900,
    minChunkDelay: 350,
    msPerChar: 7,
    maxChunkDelay: 1800,
    personality: 'measured'
  },

  // Kai - Rabbit presence, thoughtful with pauses
  kai: {
    typingDuration: 850,
    minChunkDelay: 400,
    msPerChar: 7,
    maxChunkDelay: 1600,
    personality: 'thoughtful'
  },

  // Tess - Bird efficiency, organized and crisp
  tess: {
    typingDuration: 550,
    minChunkDelay: 200,
    msPerChar: 4,
    maxChunkDelay: 900,
    personality: 'efficient'
  },

  // Yaquin - Deer dreaminess, variable and artistic
  yaquin: {
    typingDuration: 800,
    minChunkDelay: 300,
    msPerChar: 6,
    maxChunkDelay: 1500,
    personality: 'dreamy'
  },

  // Rohan - Wolf directness, confident minimal pauses
  rohan: {
    typingDuration: 600,
    minChunkDelay: 200,
    msPerChar: 4,
    maxChunkDelay: 1000,
    personality: 'direct'
  },

  // Silas - Crow mystery, deliberate and weighted
  silas: {
    typingDuration: 950,
    minChunkDelay: 400,
    msPerChar: 8,
    maxChunkDelay: 1900,
    personality: 'weighted'
  },

  // Elena - Electrician practicality, no-nonsense but warm
  elena: {
    typingDuration: 650,
    minChunkDelay: 250,
    msPerChar: 5,
    maxChunkDelay: 1100,
    personality: 'practical'
  },

  // Grace - Caregiver patience, gentle and unhurried
  grace: {
    typingDuration: 900,
    minChunkDelay: 400,
    msPerChar: 7,
    maxChunkDelay: 1700,
    personality: 'gentle'
  },

  // Narrator - Neutral, standard pacing
  narrator: {
    typingDuration: 700,
    minChunkDelay: 300,
    msPerChar: 5,
    maxChunkDelay: 1200,
    personality: 'neutral'
  },

  // Default fallback
  default: {
    typingDuration: 700,
    minChunkDelay: 300,
    msPerChar: 5,
    maxChunkDelay: 1200,
    personality: 'standard'
  }
}

/**
 * Get typing config for a character
 */
export function getCharacterTyping(characterName?: string): CharacterTypingConfig {
  if (!characterName) return CHARACTER_TYPING.default

  const key = characterName.toLowerCase()
  return CHARACTER_TYPING[key] || CHARACTER_TYPING.default
}

/**
 * Calculate chunk delay based on character and chunk length
 */
export function calculateChunkDelay(
  characterName: string | undefined,
  chunkLength: number
): number {
  const config = getCharacterTyping(characterName)
  const calculated = config.minChunkDelay + (chunkLength * config.msPerChar)
  return Math.min(calculated, config.maxChunkDelay)
}

/**
 * Get typing indicator duration for a character
 */
export function getTypingDuration(characterName?: string): number {
  return getCharacterTyping(characterName).typingDuration
}
