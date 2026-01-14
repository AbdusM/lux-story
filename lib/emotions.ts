/**
 * Emotion Type System - Canonical Source of Truth
 *
 * All valid emotion types for dialogue and character states.
 * Used for validation and consistent typing across the codebase.
 *
 * Supports both:
 * 1. Primary emotions (single words like 'grateful', 'anxious')
 * 2. Compound emotions (underscore-joined like 'vulnerable_grateful', 'warm_determined')
 *
 * Compound emotions are validated by checking that each component is a valid primary emotion.
 */

/**
 * Primary emotions used in dialogue content
 * These can be used standalone or combined with underscores
 */
export const EMOTION_TYPES = [
  // Neutral/Base
  'neutral',

  // Accepting spectrum
  'accepting',
  'content',
  'satisfied',
  'serene',
  'peace',
  'peaceful',

  // Admiration spectrum
  'admiring',
  'appreciative',
  'awed',
  'awe',
  'awestruck',
  'impressed',
  'respectful',
  'reverent',

  // Affirming spectrum
  'affirming',
  'approving',
  'encouraging',
  'supportive',

  // Alert spectrum
  'alert',
  'alarmed',
  'attentive',
  'focused',
  'observant',

  // Amazed spectrum
  'amazed',
  'astonished',
  'stunned',
  'shocked',
  'surprised',

  // Analytical spectrum
  'analytical',
  'calculating',
  'logical',
  'strategic',

  // Angry spectrum
  'angry',
  'annoyed',
  'bitter',
  'frustrated',
  'impatient',

  // Anxious spectrum
  'anxious',
  'anxiety',
  'nervous',
  'panicked',
  'paranoid',
  'tense',
  'worried',

  // Caring spectrum
  'caring',
  'compassionate',
  'empathetic',
  'gentle',
  'tender',
  'warm',

  // Cautious spectrum
  'cautioning',
  'guarded',
  'hesitant',
  'skeptical',
  'suspicious',
  'uncertain',

  // Challenging spectrum
  'challenging',
  'commanding',
  'defiant',
  'fierce',
  'insistent',
  'stern',

  // Confident spectrum
  'certain',
  'confident',
  'determined',
  'empowered',
  'resolute',
  'resolved',

  // Connected spectrum
  'connected',
  'connecting',
  'engaged',
  'integrated',
  'understood',

  // Contemplative spectrum
  'contemplative',
  'pensive',
  'philosophical',
  'reflective',
  'thoughtful',

  // Curious spectrum
  'curious',
  'eager',
  'intrigued',
  'interested',
  'wondering',

  // Defeated spectrum
  'breaking',
  'broken',
  'defeated',
  'deflated',
  'devastated',
  'exhausted',
  'hollowed',
  'hopeless',
  'lost',
  'shattered',

  // Delighted spectrum
  'amused',
  'charming',
  'delighted',
  'excited',
  'happy',
  'playful',
  'teasing',
  'triumphant',

  // Dismissive spectrum
  'closed',
  'cold',
  'dismissive',
  'distant',
  'dry',
  'off',

  // Emotional spectrum
  'emotional',
  'moved',
  'touched',
  'tearful',

  // Energized spectrum
  'animated',
  'eager',
  'energized',
  'ignited',
  'passionate',
  'zealous',

  // Fear spectrum
  'afraid',
  'fearful',
  'horrified',
  'paralyzed',
  'scared',
  'terrified',

  // Grateful spectrum
  'grateful',
  'humbled',
  'relieved',
  'thankful',

  // Grief spectrum
  'anguished',
  'grief',
  'grieving',
  'haunted',
  'melancholic',
  'melancholy',
  'mourning',
  'nostalgic',
  'pained',
  'sad',
  'wistful',
  'wounded',

  // Grounded spectrum
  'calm',
  'calmer',
  'controlled',
  'grounded',
  'measured',
  'patient',
  'steady',

  // Guilt spectrum
  'ashamed',
  'chastened',
  'guilt',
  'guilty',
  'regret',
  'regretful',
  'shame',

  // Honest spectrum
  'confessional',
  'earnest',
  'frank',
  'honest',
  'raw',
  'sincere',
  'vulnerable',

  // Hopeful spectrum
  'hopeful',
  'optimistic',
  'visionary',

  // Insight spectrum
  'dawning',
  'epiphany',
  'illuminated',
  'insightful',
  'realization',
  'realizing',
  'recognized',
  'recognizing',
  'revelation',
  'revelatory',

  // Inspired spectrum
  'inspired',
  'liberated',
  'transcendent',
  'transformed',
  'vindicated',

  // Knowing spectrum
  'knowing',
  'mature',
  'nuanced',
  'sage',
  'understanding',
  'wise',

  // Mysterious spectrum
  'atmospheric',
  'hypnotic',
  'mysterious',
  'mystical',
  'mystified',

  // Negative spectrum
  'closed_off',
  'conflicted',
  'confused',
  'desperate',
  'disappointed',
  'disillusioned',
  'hurt',
  'isolated',
  'lonely',
  'overwhelmed',
  'resigned',
  'stuck',
  'struggling',
  'tired',
  'troubled',
  'weary',

  // Open spectrum
  'inviting',
  'open',
  'receptive',
  'trusting',
  'welcoming',

  // Practical spectrum
  'direct',
  'firm',
  'matter_of_fact',
  'practical',
  'pragmatic',
  'realistic',

  // Pride spectrum
  'proud',
  'purposeful',

  // Processing spectrum
  'processing',
  'searching',
  'seeking',

  // Ready spectrum
  'prepared',
  'ready',

  // Serious spectrum
  'grave',
  'grim',
  'serious',
  'solemn',
  'somber',
  'urgent',

  // Teaching spectrum
  'guiding',
  'instructive',
  'mentoring',
  'pedagogical',
  'teaching',

  // Testing spectrum
  'probing',
  'testing',

  // Wry spectrum
  'ironic',
  'rueful',
  'wry',

  // Special/Narrative (rarely used but valid)
  'awkward',
  'concerned',
  'convicted',
  'defensive',
  'deflecting',
  'dreaming',
  'fond',
  'heavy',
  'growing',
  'intense',
  'lighter',
  'meaningful',
  'bittersweet',
  'profound',
  'puzzled',
  'release',
  'respect',
  'revealing',
  'rushed',
  'seen',
  'whisper',
  'depth',
  'fire',
  'clarity',

  // Additional compound components found in content
  'anger',
  'hope',
  'balanced',
  'spirit',
  'robotic',
  'community',
  'comprehensive',
  'guide',
  'dots',
  'creative',
  'recognition',
  'cynical',
  'deep',
  'deeply',
  'panic',
  'fragile',
  'doubt',
  'quiet',
  'breakthrough',
  'shaken',
  'enlightened',
  'solemn',
  'tears',
  'love',
  'clarity',
  'determination',
  'gratitude',
  'regret',
  'tender',
  'hollow',
  'resolved',
  'present',
  'stakes',
  'high',
  'informative',
  'wisdom',
  'but',
  'realistic',
  'excited',
  'tired',
  'connection',
  'joy',
  'relief',
  'humble',
  'pride',
  'resolve',
  'satisfied',
  'courage',
  'fear',
  'honesty',
  'pain',
  'scared',
  'disagreement',
  'sadness',
  'rooted',
  'sobering',
  'solidarity',
  'critical',
  'aware',
  'self',
  'noble',
  'mask',
  'monk',
  'emotional',
  'grounded',
  'haunted',
  'honest',
  'hopeful',
  'peaceful',
  'vulnerable',
  'strategic',
  'engagement',
  'gently',
  'intensity',
  'nuance',
  'technical',
  'excitement',
  'insight',
  'fierce',
  'competitive',
  'earnest',
  'generous',
  'guiding',
  'observant',
  'surprised',
  'understanding',
  'wistful',
  'weary',
  'constructive',
  'affection',
  'amusement',
  'growth',
  'nervous',
  'distracted',
  'friendly',
  'admiration',
  'patience',
  'offered',
  'offering',
  'rare',
  'space',
  'origin',
  'story',
  'paternal',
  'private',
  'recovering',
  'reverent',
  'opening',
  'released',
  'wonder',
  'kindred',
  'impressesd',
  'knowing',
  'acceptance',
  'truth',
  'certain',
  'uncertain',
  'dread',
  'existential',
  'uncertainty',
  'intrigued',

  // Final missing compound components
  'scattered',
  'clear',
  'encouraged',
  'and',
  'grudgingly',
  'won',
  'hard',
  'honoring',
  'cautious',
  'confession',
  'awareness'
] as const

export type PrimaryEmotionType = typeof EMOTION_TYPES[number]

/**
 * Emotion type includes both primary emotions and compound emotions
 * Compound emotions are validated dynamically
 */
export type EmotionType = PrimaryEmotionType | string

/**
 * Check if a string is a valid primary emotion
 */
export function isPrimaryEmotion(emotion: string): emotion is PrimaryEmotionType {
  return EMOTION_TYPES.includes(emotion as PrimaryEmotionType)
}

/**
 * Validate if a string is a valid emotion type (primary or compound)
 *
 * Compound emotions are validated by checking each underscore-separated
 * component is a valid primary emotion.
 *
 * Examples:
 * - 'grateful' -> true (primary)
 * - 'vulnerable_grateful' -> true (compound: both parts valid)
 * - 'anxious_deflecting' -> true (compound)
 * - 'invalid_emotion' -> false
 */
export function isValidEmotion(emotion: string): emotion is EmotionType {
  // Check if it's a primary emotion
  if (isPrimaryEmotion(emotion)) return true

  // Check if it's a compound emotion (contains underscore)
  if (emotion.includes('_')) {
    const parts = emotion.split('_')
    // All parts must be valid primary emotions
    return parts.every(part => isPrimaryEmotion(part))
  }

  return false
}

/**
 * Get emotion with fallback to neutral if invalid
 */
export function getValidEmotion(emotion: string | undefined): EmotionType {
  if (!emotion) return 'neutral'
  if (isValidEmotion(emotion)) return emotion
  // Suppress console.warn in production - the emotion is still usable even if not in the list
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Emotions] Unknown emotion "${emotion}", defaulting to neutral`)
  }
  return 'neutral'
}

/**
 * Emotion categories for grouping similar emotions
 */
export const EMOTION_CATEGORIES: Record<string, PrimaryEmotionType[]> = {
  accepting: ['accepting', 'content', 'satisfied', 'serene', 'peaceful'],
  admiring: ['admiring', 'appreciative', 'awed', 'awe', 'awestruck', 'impressed', 'respectful', 'reverent'],
  affirming: ['affirming', 'approving', 'encouraging', 'supportive'],
  alert: ['alert', 'alarmed', 'attentive', 'focused', 'observant'],
  amazed: ['amazed', 'stunned', 'shocked', 'surprised'],
  analytical: ['analytical', 'calculating', 'strategic'],
  angry: ['angry', 'annoyed', 'bitter', 'frustrated', 'impatient'],
  anxious: ['anxious', 'anxiety', 'nervous', 'panicked', 'paranoid', 'tense', 'worried'],
  caring: ['caring', 'gentle', 'tender', 'warm'],
  cautious: ['cautioning', 'guarded', 'hesitant', 'skeptical', 'suspicious', 'uncertain'],
  challenging: ['challenging', 'commanding', 'defiant', 'fierce', 'insistent', 'stern'],
  confident: ['certain', 'confident', 'determined', 'empowered', 'resolute', 'resolved'],
  connected: ['connected', 'connecting', 'engaged', 'integrated', 'understood'],
  contemplative: ['contemplative', 'pensive', 'philosophical', 'reflective', 'thoughtful'],
  curious: ['curious', 'eager', 'intrigued', 'interested', 'wondering'],
  defeated: ['broken', 'defeated', 'deflated', 'devastated', 'exhausted', 'hollowed', 'hopeless', 'shattered'],
  delighted: ['amused', 'charming', 'delighted', 'excited', 'happy', 'playful', 'teasing', 'triumphant'],
  dismissive: ['cold', 'dismissive', 'distant', 'dry'],
  emotional: ['emotional', 'moved', 'touched'],
  energized: ['animated', 'energized', 'ignited', 'passionate', 'zealous'],
  fearful: ['fearful', 'horrified', 'paralyzed', 'scared', 'terrified'],
  grateful: ['grateful', 'humbled', 'relieved'],
  grief: ['anguished', 'grief', 'grieving', 'haunted', 'melancholic', 'melancholy', 'nostalgic', 'pained', 'sad', 'wistful', 'wounded'],
  grounded: ['calm', 'calmer', 'controlled', 'grounded', 'measured', 'patient'],
  guilt: ['chastened', 'guilt', 'guilty', 'regret', 'regretful', 'shame'],
  honest: ['confessional', 'earnest', 'honest', 'raw', 'sincere', 'vulnerable'],
  hopeful: ['hopeful', 'visionary'],
  insight: ['dawning', 'epiphany', 'illuminated', 'insightful', 'realization', 'realizing', 'recognized', 'recognizing', 'revelation', 'revelatory'],
  inspired: ['inspired', 'liberated', 'transcendent', 'transformed', 'vindicated'],
  knowing: ['knowing', 'mature', 'nuanced', 'sage', 'understanding', 'wise'],
  mysterious: ['atmospheric', 'hypnotic', 'mysterious', 'mystical', 'mystified'],
  negative: ['conflicted', 'confused', 'desperate', 'disappointed', 'disillusioned', 'hurt', 'isolated', 'overwhelmed', 'resigned', 'stuck', 'struggling', 'tired', 'troubled'],
  open: ['inviting', 'open', 'receptive', 'trusting', 'welcoming'],
  practical: ['direct', 'firm', 'practical', 'pragmatic', 'realistic'],
  pride: ['proud', 'purposeful'],
  serious: ['grave', 'grim', 'serious', 'solemn', 'somber', 'urgent'],
  teaching: ['guiding', 'mentoring', 'pedagogical', 'teaching'],
  wry: ['rueful', 'wry']
}

/**
 * Get the category for an emotion (works with primary or compound)
 * For compound emotions, returns category of first component
 */
export function getEmotionCategory(emotion: string): string {
  // For compound emotions, check the first component
  const primaryEmotion = emotion.includes('_') ? emotion.split('_')[0] : emotion

  for (const [category, emotions] of Object.entries(EMOTION_CATEGORIES)) {
    if (emotions.includes(primaryEmotion as PrimaryEmotionType)) {
      return category
    }
  }
  return 'neutral'
}

/**
 * Emotion metadata for UI display
 */
export const EMOTION_METADATA: Partial<Record<PrimaryEmotionType, {
  label: string
  color: string
  icon?: string
}>> = {
  // Anxious spectrum
  anxious: { label: 'Anxious', color: 'text-amber-600' },
  worried: { label: 'Worried', color: 'text-amber-500' },
  nervous: { label: 'Nervous', color: 'text-amber-400' },
  uncertain: { label: 'Uncertain', color: 'text-amber-500' },

  // Vulnerable/Honest spectrum
  vulnerable: { label: 'Vulnerable', color: 'text-pink-500' },
  raw: { label: 'Raw', color: 'text-pink-600' },
  honest: { label: 'Honest', color: 'text-pink-400' },

  // Thoughtful spectrum
  thoughtful: { label: 'Thoughtful', color: 'text-blue-500' },
  reflective: { label: 'Reflective', color: 'text-blue-400' },
  contemplative: { label: 'Contemplative', color: 'text-blue-600' },
  philosophical: { label: 'Philosophical', color: 'text-indigo-500' },

  // Positive spectrum
  excited: { label: 'Excited', color: 'text-green-500' },
  hopeful: { label: 'Hopeful', color: 'text-emerald-500' },
  grateful: { label: 'Grateful', color: 'text-emerald-400' },
  happy: { label: 'Happy', color: 'text-green-400' },
  proud: { label: 'Proud', color: 'text-emerald-600' },
  relieved: { label: 'Relieved', color: 'text-teal-500' },

  // Curious spectrum
  curious: { label: 'Curious', color: 'text-purple-500' },
  intrigued: { label: 'Intrigued', color: 'text-purple-400' },
  wondering: { label: 'Wondering', color: 'text-purple-600' },

  // Warm spectrum
  warm: { label: 'Warm', color: 'text-rose-400' },
  caring: { label: 'Caring', color: 'text-rose-500' },
  tender: { label: 'Tender', color: 'text-rose-300' },
  gentle: { label: 'Gentle', color: 'text-rose-400' },

  // Frustrated spectrum
  frustrated: { label: 'Frustrated', color: 'text-red-500' },
  angry: { label: 'Angry', color: 'text-red-600' },
  annoyed: { label: 'Annoyed', color: 'text-red-400' },

  // Confident spectrum
  confident: { label: 'Confident', color: 'text-blue-600' },
  determined: { label: 'Determined', color: 'text-blue-700' },
  resolved: { label: 'Resolved', color: 'text-blue-500' },

  // Cautious spectrum
  defensive: { label: 'Defensive', color: 'text-orange-500' },
  guarded: { label: 'Guarded', color: 'text-orange-400' },
  skeptical: { label: 'Skeptical', color: 'text-orange-600' },

  // Serious spectrum
  serious: { label: 'Serious', color: 'text-slate-600' },
  grave: { label: 'Grave', color: 'text-slate-700' },
  solemn: { label: 'Solemn', color: 'text-slate-500' },

  // Teaching spectrum
  teaching: { label: 'Teaching', color: 'text-cyan-500' },
  mentoring: { label: 'Mentoring', color: 'text-cyan-600' },
  wise: { label: 'Wise', color: 'text-cyan-400' },
  knowing: { label: 'Knowing', color: 'text-cyan-500' },

  // Grief spectrum
  sad: { label: 'Sad', color: 'text-gray-500' },
  haunted: { label: 'Haunted', color: 'text-gray-600' },
  grief: { label: 'Grief', color: 'text-gray-700' },
  melancholy: { label: 'Melancholy', color: 'text-gray-400' },

  // Mysterious spectrum
  mystical: { label: 'Mystical', color: 'text-violet-500' },
  mysterious: { label: 'Mysterious', color: 'text-violet-600' },
  atmospheric: { label: 'Atmospheric', color: 'text-violet-400' },

  // Special
  passionate: { label: 'Passionate', color: 'text-red-500' },
  inspired: { label: 'Inspired', color: 'text-yellow-500' },
  moved: { label: 'Moved', color: 'text-pink-400' }
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
  skills?: Record<string, number>,
  flags?: Set<string> | string[]
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

  // 3. Golden Prompt Regulation (The "Simulation Effect")
  // Successful simulations (Golden Prompts) act as permanent nervous system regulators
  let flagBuffer = 0
  if (flags) {
    const flagSet = Array.isArray(flags) ? new Set(flags) : flags
    if (flagSet.has('golden_prompt_voice') || flagSet.has('golden_prompt_midjourney') || flagSet.has('golden_prompt_workflow')) {
      flagBuffer = 30 // Massive stabilizer (e.g. "I know my purpose now")
    }
  }

  const effectiveAnxiety = Math.max(0, normalizedAnxiety - trustBuffer - skillBuffer - flagBuffer)

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

