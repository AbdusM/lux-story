/**
 * Emotion Type System - Canonical Source of Truth
 *
 * All valid emotion types for dialogue and character states.
 * Used for validation and consistent typing across the codebase.
 */

/**
 * Primary emotions used in dialogue content
 */
export const EMOTION_TYPES = [
  // Neutral/Base
  'neutral',

  // Anxious spectrum
  'anxious',
  'worried',
  'nervous',
  'uncertain',

  // Vulnerable spectrum
  'vulnerable',
  'hesitant',
  'defensive',

  // Thoughtful spectrum
  'thoughtful',
  'reflective',
  'contemplative',
  'pensive',

  // Positive spectrum
  'excited',
  'hopeful',
  'confident',
  'determined',
  'proud',
  'relieved',

  // Curious spectrum
  'curious',
  'intrigued',
  'skeptical',

  // Warm spectrum
  'warm',
  'caring',
  'supportive',
  'gentle',

  // Frustrated spectrum
  'frustrated',
  'impatient',
  'dismissive',

  // Open spectrum
  'open',
  'receptive',
  'trusting',

  // Serious spectrum
  'serious',
  'grave',
  'urgent',

  // Playful spectrum
  'playful',
  'amused',
  'teasing',

  // Special/Narrative
  'atmospheric',
  'knowing',
  'approving',
  'engaged',
  'moved',
  'surprised',
  'grateful',
  'cold',
  'distant',
  'disappointed',
  'hurt',
  'angry',
  'sad',
  'resigned',
  'trusting',
  'interested',
  'happy',
  'awkward',
  'melancholy',
  'guarded'
] as const

export type EmotionType = typeof EMOTION_TYPES[number]

/**
 * Validate if a string is a valid emotion type
 */
export function isValidEmotion(emotion: string): emotion is EmotionType {
  return EMOTION_TYPES.includes(emotion as EmotionType)
}

/**
 * Get emotion with fallback to neutral if invalid
 */
export function getValidEmotion(emotion: string | undefined): EmotionType {
  if (!emotion) return 'neutral'
  if (isValidEmotion(emotion)) return emotion
  console.warn(`[Emotions] Unknown emotion "${emotion}", defaulting to neutral`)
  return 'neutral'
}

/**
 * Emotion categories for grouping similar emotions
 */
export const EMOTION_CATEGORIES: Record<string, EmotionType[]> = {
  anxious: ['anxious', 'worried', 'nervous', 'uncertain'],
  vulnerable: ['vulnerable', 'hesitant', 'defensive'],
  thoughtful: ['thoughtful', 'reflective', 'contemplative', 'pensive'],
  positive: ['excited', 'hopeful', 'confident', 'determined', 'proud', 'relieved'],
  curious: ['curious', 'intrigued', 'skeptical'],
  warm: ['warm', 'caring', 'supportive', 'gentle'],
  frustrated: ['frustrated', 'impatient', 'dismissive'],
  open: ['open', 'receptive', 'trusting'],
  serious: ['serious', 'grave', 'urgent'],
  playful: ['playful', 'amused', 'teasing']
}

/**
 * Get the category for an emotion
 */
export function getEmotionCategory(emotion: EmotionType): string {
  for (const [category, emotions] of Object.entries(EMOTION_CATEGORIES)) {
    if (emotions.includes(emotion)) {
      return category
    }
  }
  return 'neutral'
}

/**
 * Emotion metadata for UI display
 */
export const EMOTION_METADATA: Partial<Record<EmotionType, {
  label: string
  color: string
  icon?: string
}>> = {
  anxious: { label: 'Anxious', color: 'text-amber-600' },
  worried: { label: 'Worried', color: 'text-amber-500' },
  vulnerable: { label: 'Vulnerable', color: 'text-pink-500' },
  thoughtful: { label: 'Thoughtful', color: 'text-blue-500' },
  excited: { label: 'Excited', color: 'text-green-500' },
  hopeful: { label: 'Hopeful', color: 'text-emerald-500' },
  curious: { label: 'Curious', color: 'text-purple-500' },
  frustrated: { label: 'Frustrated', color: 'text-red-500' },
  confident: { label: 'Confident', color: 'text-blue-600' },
  defensive: { label: 'Defensive', color: 'text-orange-500' },
  warm: { label: 'Warm', color: 'text-rose-400' },
  serious: { label: 'Serious', color: 'text-slate-600' }
}
