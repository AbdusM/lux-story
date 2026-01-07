/**
 * D-026: State-Based Animation Customization
 * Animations adapt to player state for emotional resonance
 *
 * Philosophy:
 * - High tension moments = sharper, quicker animations
 * - Calm/reflective = slower, gentler transitions
 * - High trust = warmer, more fluid movements
 * - Low trust = more restrained, cautious animations
 */

import { PatternType, PATTERN_THRESHOLDS } from './patterns'
import { PlayerPatterns } from './character-state'
import { springs } from './animations'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Animation mood derived from game state
 */
export type AnimationMood =
  | 'neutral'      // Default state
  | 'tense'        // High stakes, confrontation
  | 'warm'         // High trust, positive relationship
  | 'cautious'     // Low trust, uncertainty
  | 'reflective'   // Pattern development moments
  | 'triumphant'   // Achievement, milestone
  | 'vulnerable'   // Character vulnerability scenes

/**
 * Animation intensity level
 */
export type AnimationIntensity = 'subtle' | 'normal' | 'pronounced'

/**
 * Animation configuration for a specific mood
 */
export interface MoodAnimationConfig {
  spring: {
    stiffness: number
    damping: number
    mass: number
  }
  duration: number           // Base duration multiplier (1 = normal)
  opacity: {
    initial: number
    animate: number
  }
  scale: {
    initial: number
    animate: number
  }
  y: {
    initial: number
    animate: number
  }
  blur: number               // Backdrop blur amount
  glow: boolean              // Whether to add glow effects
  glowColor?: string         // Color for glow if enabled
}

// ═══════════════════════════════════════════════════════════════════════════
// MOOD CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Animation configurations per mood
 */
export const MOOD_ANIMATION_CONFIGS: Record<AnimationMood, MoodAnimationConfig> = {
  neutral: {
    spring: { stiffness: 300, damping: 30, mass: 1 },
    duration: 1.0,
    opacity: { initial: 0, animate: 1 },
    scale: { initial: 0.98, animate: 1 },
    y: { initial: 8, animate: 0 },
    blur: 8,
    glow: false
  },
  tense: {
    spring: { stiffness: 500, damping: 25, mass: 0.8 },
    duration: 0.7,
    opacity: { initial: 0, animate: 1 },
    scale: { initial: 0.95, animate: 1 },
    y: { initial: 4, animate: 0 },
    blur: 4,
    glow: true,
    glowColor: 'rgba(239, 68, 68, 0.3)' // Red tint
  },
  warm: {
    spring: { stiffness: 200, damping: 35, mass: 1.2 },
    duration: 1.3,
    opacity: { initial: 0.2, animate: 1 },
    scale: { initial: 0.99, animate: 1 },
    y: { initial: 12, animate: 0 },
    blur: 12,
    glow: true,
    glowColor: 'rgba(251, 191, 36, 0.2)' // Amber warmth
  },
  cautious: {
    spring: { stiffness: 250, damping: 40, mass: 1.5 },
    duration: 1.2,
    opacity: { initial: 0.3, animate: 0.95 },
    scale: { initial: 0.97, animate: 1 },
    y: { initial: 6, animate: 0 },
    blur: 6,
    glow: false
  },
  reflective: {
    spring: { stiffness: 150, damping: 30, mass: 1.3 },
    duration: 1.5,
    opacity: { initial: 0.1, animate: 1 },
    scale: { initial: 1.0, animate: 1 },
    y: { initial: 16, animate: 0 },
    blur: 16,
    glow: true,
    glowColor: 'rgba(139, 92, 246, 0.2)' // Purple reflection
  },
  triumphant: {
    spring: { stiffness: 400, damping: 20, mass: 0.9 },
    duration: 0.8,
    opacity: { initial: 0, animate: 1 },
    scale: { initial: 0.9, animate: 1.02 },
    y: { initial: -8, animate: 0 },
    blur: 10,
    glow: true,
    glowColor: 'rgba(34, 197, 94, 0.3)' // Green success
  },
  vulnerable: {
    spring: { stiffness: 180, damping: 35, mass: 1.4 },
    duration: 1.4,
    opacity: { initial: 0.2, animate: 1 },
    scale: { initial: 1.0, animate: 1 },
    y: { initial: 10, animate: 0 },
    blur: 14,
    glow: true,
    glowColor: 'rgba(244, 114, 182, 0.2)' // Soft pink
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MOOD DETECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Context for determining animation mood
 */
export interface AnimationContext {
  trust?: number
  patterns?: PlayerPatterns
  isVulnerabilityScene?: boolean
  isMilestone?: boolean
  isConfrontation?: boolean
  characterEmotion?: string
  nodeType?: string
}

/**
 * Determine animation mood from game context
 */
export function getAnimationMood(context: AnimationContext): AnimationMood {
  // Explicit scene types take priority
  if (context.isMilestone) return 'triumphant'
  if (context.isVulnerabilityScene) return 'vulnerable'
  if (context.isConfrontation) return 'tense'

  // Character emotion can indicate mood
  if (context.characterEmotion) {
    const emotionMoodMap: Record<string, AnimationMood> = {
      angry: 'tense',
      frustrated: 'tense',
      worried: 'cautious',
      nervous: 'cautious',
      sad: 'vulnerable',
      hurt: 'vulnerable',
      happy: 'warm',
      grateful: 'warm',
      impressed: 'warm',
      thoughtful: 'reflective',
      contemplative: 'reflective'
    }
    const moodFromEmotion = emotionMoodMap[context.characterEmotion]
    if (moodFromEmotion) return moodFromEmotion
  }

  // Trust level affects default mood
  if (context.trust !== undefined) {
    if (context.trust >= 8) return 'warm'
    if (context.trust <= 2) return 'cautious'
  }

  // Node type can indicate mood
  if (context.nodeType) {
    if (context.nodeType.includes('vulnerability')) return 'vulnerable'
    if (context.nodeType.includes('simulation')) return 'reflective'
    if (context.nodeType.includes('loyalty')) return 'triumphant'
  }

  return 'neutral'
}

/**
 * Get intensity based on pattern development
 */
export function getAnimationIntensity(patterns?: PlayerPatterns): AnimationIntensity {
  if (!patterns) return 'normal'

  const total = Object.values(patterns).reduce((a, b) => a + b, 0)

  if (total >= 30) return 'pronounced'
  if (total >= 15) return 'normal'
  return 'subtle'
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get Framer Motion variants for a mood
 */
export function getMoodVariants(mood: AnimationMood, intensity: AnimationIntensity = 'normal') {
  const config = MOOD_ANIMATION_CONFIGS[mood]

  // Intensity modifiers
  const intensityMultiplier = {
    subtle: 0.6,
    normal: 1.0,
    pronounced: 1.4
  }[intensity]

  return {
    initial: {
      opacity: config.opacity.initial,
      scale: config.scale.initial,
      y: config.y.initial * intensityMultiplier,
      filter: config.glow && config.glowColor
        ? `drop-shadow(0 0 ${8 * intensityMultiplier}px ${config.glowColor})`
        : undefined
    },
    animate: {
      opacity: config.opacity.animate,
      scale: config.scale.animate,
      y: config.y.animate,
      filter: config.glow && config.glowColor
        ? `drop-shadow(0 0 ${4 * intensityMultiplier}px ${config.glowColor})`
        : undefined
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: -config.y.initial * 0.5
    }
  }
}

/**
 * Get spring transition for a mood
 */
export function getMoodTransition(mood: AnimationMood) {
  const config = MOOD_ANIMATION_CONFIGS[mood]
  return {
    type: 'spring' as const,
    ...config.spring
  }
}

/**
 * Get complete animation props for a mood and context
 */
export function getStateBasedAnimation(context: AnimationContext) {
  const mood = getAnimationMood(context)
  const intensity = getAnimationIntensity(context.patterns)
  const variants = getMoodVariants(mood, intensity)
  const transition = getMoodTransition(mood)

  return {
    mood,
    intensity,
    variants,
    transition,
    initial: 'initial',
    animate: 'animate',
    exit: 'exit'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN-SPECIFIC ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Animation style hints per pattern
 */
export const PATTERN_ANIMATION_HINTS: Record<PatternType, {
  preferredMood: AnimationMood
  transitionStyle: 'sharp' | 'smooth' | 'gentle'
  motionPreference: 'minimal' | 'moderate' | 'expressive'
}> = {
  analytical: {
    preferredMood: 'neutral',
    transitionStyle: 'sharp',
    motionPreference: 'minimal'
  },
  patience: {
    preferredMood: 'reflective',
    transitionStyle: 'gentle',
    motionPreference: 'minimal'
  },
  exploring: {
    preferredMood: 'triumphant',
    transitionStyle: 'smooth',
    motionPreference: 'expressive'
  },
  helping: {
    preferredMood: 'warm',
    transitionStyle: 'gentle',
    motionPreference: 'moderate'
  },
  building: {
    preferredMood: 'triumphant',
    transitionStyle: 'sharp',
    motionPreference: 'moderate'
  }
}

/**
 * Get animation style for dominant pattern
 */
export function getPatternAnimationStyle(patterns: PlayerPatterns) {
  // Find dominant pattern
  const entries = Object.entries(patterns) as [PatternType, number][]
  const sorted = entries.sort((a, b) => b[1] - a[1])

  if (sorted[0][1] < PATTERN_THRESHOLDS.EMERGING) {
    return null // No dominant pattern yet
  }

  const dominantPattern = sorted[0][0]
  return PATTERN_ANIMATION_HINTS[dominantPattern]
}

// ═══════════════════════════════════════════════════════════════════════════
// STAGGER UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get stagger delay based on mood
 */
export function getMoodStaggerDelay(mood: AnimationMood): number {
  const config = MOOD_ANIMATION_CONFIGS[mood]
  // Base stagger of 80ms, modified by mood duration
  return Math.round(80 * config.duration)
}

/**
 * Generate stagger container variants for a mood
 */
export function getStaggerContainer(mood: AnimationMood, itemCount: number) {
  const staggerDelay = getMoodStaggerDelay(mood)

  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay / 1000,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerDelay / 2000,
        staggerDirection: -1
      }
    }
  }
}
