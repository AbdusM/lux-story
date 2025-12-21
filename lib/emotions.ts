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

/**
 * Polyvagal Nervous System States
 * Based on the "ActualizeMe" Limbic Learning Framework
 */
export const NERVOUS_SYSTEM_STATES = [
  'ventral_vagal', // Safe, Social, Connected (Low Anxiety)
  'sympathetic',   // Mobilized, Anxious, Flight/Fight (High Anxiety)
  'dorsal_vagal'   // Shutdown, Disconnected, Numb (Overwhelmed)
] as const

export type NervousSystemState = typeof NERVOUS_SYSTEM_STATES[number]

/**
 * WEF 2030 Skill Mapping to Nervous System Regulation
 * Strategy: "Bounded Accuracy" (Skills act as emotional armor)
 */
export const NEURO_SKILL_MAPPING = {
  // Ventral Regulation (Calm/Social)
  resilience: { target: 'ventral_vagal', power: 0.5 }, // Strong stabilizer
  helping: { target: 'ventral_vagal', power: 0.3 },    // Social connection stabilizer

  // Sympathetic Regulation (Focus/Action)
  analytical: { target: 'sympathetic', power: 0.4 },   // Transforms anxiety into focus
  building: { target: 'sympathetic', power: 0.3 },     // Channels energy into action

  // Dorsal Prevention (Anti-Shutdown)
  patience: { target: 'dorsal_vagal', power: 0.4 },    // Prevents overwhelm/shutdown
  exploring: { target: 'dorsal_vagal', power: 0.2 }    // Maintains curiosity against apathy
} as const

/**
 * Maps anxiety, trust, and SKILLS to a biological nervous system state.
 * @param anxiety 0-100 scale (or 0-10, will normalize)
 * @param trust 0-10 scale
 * @param skills Optional map of current player skill/pattern levels (0-10)
 */
export function determineNervousSystemState(
  anxiety: number,
  trust: number,
  skills?: Record<string, number>
): NervousSystemState {
  // Normalize anxiety to 0-100 if it seems small
  const normalizedAnxiety = anxiety <= 10 ? anxiety * 10 : anxiety

  // 1. Social Safety Buffer (Trust)
  // A trust of 10 gives a 20 point reduction in effective anxiety
  const trustBuffer = trust * 2

  // 2. Skill Regulation Buffer (The "Neuro-Link")
  let skillBuffer = 0
  if (skills) {
    // Resilience strongly buffers anxiety (pushes towards Ventral)
    if (skills.resilience) skillBuffer += skills.resilience * 5 // Max 50 point buffer!

    // Analytical thinking helps manage high anxiety (keeps it "Sympathetic" not "Dorsal")
    // We treat this as a "cap" prevention in a more complex system, but here simple buffer works
    if (skills.analytical) skillBuffer += skills.analytical * 2
  }

  const effectiveAnxiety = Math.max(0, normalizedAnxiety - trustBuffer - skillBuffer)

  if (effectiveAnxiety > 80) return 'dorsal_vagal'     // Total shutdown
  if (effectiveAnxiety > 40) return 'sympathetic'      // Mobilized/Anxious
  return 'ventral_vagal'                               // Safe/Social
}

/**
 * ISP Phase 2: The Chemistry Engine
 * "Emergent reactions when Biology meets Skill"
 */
export const CHEMICAL_REACTIONS = [
  'resonance',    // Sympathetic + Empathy = Vulnerable Connection (Steam)
  'cold_fusion',  // Sympathetic + Analysis = Hyper-Focus (Blue Flame)
  'volatility',   // Sympathetic + Sympathetic Pattern = Explosion (Sparks)
  'deep_rooting', // Dorsal + Patience = Stabilized Grounding (Moss)
  'shutdown'      // Dorsal + No Buffer = Void (Grey)
] as const

export type ChemicalReactionType = typeof CHEMICAL_REACTIONS[number]

export interface ChemicalReaction {
  type: ChemicalReactionType
  intensity: number // 0-1.0
  description: string
}

