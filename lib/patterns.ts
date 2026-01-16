/**
 * Pattern System - Canonical Source of Truth
 * All pattern-related constants, types, and metadata in ONE place
 *
 * CRITICAL: This is the ONLY file that defines pattern metadata.
 * All other files MUST import from here.
 */

/**
 * Valid pattern types - the 5 decision-making approaches
 */
export const PATTERN_TYPES = [
  'analytical',
  'patience',
  'exploring',
  'helping',
  'building'
] as const

export type PatternType = typeof PATTERN_TYPES[number]

/**
 * Standard Pattern Thresholds
 * Used across Logic, Voice, and Experience systems to ensure consistent difficulty.
 */
export const PATTERN_THRESHOLDS = {
  EMERGING: 3,   // Level 1: Voice whispers, basic options unlock
  DEVELOPING: 6, // Level 2: Voice urges, standard options unlock
  FLOURISHING: 9 // Level 3: Voice commands, mastery options unlock
} as const

/**
 * Comprehensive pattern metadata - single source of truth
 */
export const PATTERN_METADATA: Record<PatternType, {
  // Display labels
  label: string              // Full label: "Analytical Thinker"
  shortLabel: string         // Short label: "Analytical"

  // Descriptions
  description: string        // Full description for student insights
  contextDescription: string // Description for demonstration records

  // Visual styling
  color: string             // Hex color
  tailwindBg: string        // Tailwind background class
  tailwindText: string      // Tailwind text color class

  // Correlations
  skills: string[]          // Related WEF 2030 skills
}> = {
  analytical: {
    label: 'The Weaver',
    shortLabel: 'Weaver',
    description: 'You see the hidden threads where others see only chaos. The truth is a tapestry waiting to be untangled.',
    contextDescription: 'Traced the hidden connections to find a logical path forward',
    color: '#3B82F6',
    tailwindBg: 'bg-blue-500',
    tailwindText: 'text-blue-600',
    skills: ['criticalThinking', 'problemSolving', 'digitalLiteracy', 'dataDemocratization']
  },
  patience: {
    label: 'The Anchor',
    shortLabel: 'Anchor',
    description: 'You are the stillness in the storm. When the world rushes, you hold fast, allowing the moment to speak.',
    contextDescription: 'Held space for the moment to unfold naturally',
    color: '#10B981',
    tailwindBg: 'bg-green-500',
    tailwindText: 'text-green-600',
    skills: ['timeManagement', 'adaptability', 'emotionalIntelligence', 'groundedResearch']
  },
  exploring: {
    label: 'The Voyager',
    shortLabel: 'Voyager',
    description: 'The map is not the territory. You step off the path because the unknown is where the answers live.',
    contextDescription: 'Venture into the unknown to uncover a new perspective',
    color: '#8B5CF6',
    tailwindBg: 'bg-purple-500',
    tailwindText: 'text-purple-600',
    skills: ['adaptability', 'creativity', 'criticalThinking', 'multimodalCreation']
  },
  helping: {
    label: 'The Harmonic',
    shortLabel: 'Harmonic',
    description: 'You feel the resonance between people. You tune the discord until it becomes a chord.',
    contextDescription: 'Resonated with the needs of others to build connection',
    color: '#EC4899',
    tailwindBg: 'bg-pink-500',
    tailwindText: 'text-pink-600',
    skills: ['emotionalIntelligence', 'collaboration', 'communication', 'aiLiteracy']
  },
  building: {
    label: 'The Architect',
    shortLabel: 'Architect',
    description: 'You do not wait for the future; you forge it. Your hands turn abstract hope into concrete reality.',
    contextDescription: 'Constructed a tangible solution from the available pieces',
    color: '#F59E0B',
    tailwindBg: 'bg-amber-500',
    tailwindText: 'text-amber-600',
    skills: ['creativity', 'problemSolving', 'leadership', 'agenticCoding', 'workflowOrchestration']
  }
}

/**
 * Pattern-to-skill mapping (extracted from metadata for convenience)
 */
export const PATTERN_SKILL_MAP: Record<PatternType, string[]> = Object.entries(PATTERN_METADATA).reduce(
  (acc, [pattern, metadata]) => {
    acc[pattern as PatternType] = metadata.skills
    return acc
  },
  {} as Record<PatternType, string[]>
)

/**
 * Helper functions for pattern formatting
 */

/**
 * Format pattern name for display (short label)
 * @example formatPatternName('analytical') => 'Analytical'
 */
export function formatPatternName(pattern: PatternType | string): string {
  if (pattern in PATTERN_METADATA) {
    return PATTERN_METADATA[pattern as PatternType].shortLabel
  }
  return pattern
}

/**
 * Get full label for pattern
 * @example getPatternLabel('analytical') => 'Analytical Thinker'
 */
export function getPatternLabel(pattern: PatternType | string): string {
  if (pattern in PATTERN_METADATA) {
    return PATTERN_METADATA[pattern as PatternType].label
  }
  return pattern
}

/**
 * Get pattern description for student insights
 * @example getPatternDescription('analytical') => 'You analyze details and...'
 */
export function getPatternDescription(pattern: PatternType | string): string {
  if (pattern in PATTERN_METADATA) {
    return PATTERN_METADATA[pattern as PatternType].description
  }
  return ''
}

/**
 * Get pattern context description for demonstration records
 * @example getPatternContextDescription('analytical') => 'Approached the situation by...'
 */
export function getPatternContextDescription(pattern: PatternType | string): string {
  if (pattern in PATTERN_METADATA) {
    return PATTERN_METADATA[pattern as PatternType].contextDescription
  }
  return `Demonstrated ${pattern} decision-making pattern`
}

/**
 * Get Tailwind background class for pattern
 * @example getPatternBgClass('analytical') => 'bg-blue-500'
 */
export function getPatternBgClass(pattern: PatternType | string): string {
  if (pattern in PATTERN_METADATA) {
    return PATTERN_METADATA[pattern as PatternType].tailwindBg
  }
  return 'bg-gray-500'
}

/**
 * Get hex color for pattern
 * @example getPatternColor('analytical') => '#3B82F6'
 */
export function getPatternColor(pattern: PatternType | string): string {
  if (pattern in PATTERN_METADATA) {
    return PATTERN_METADATA[pattern as PatternType].color
  }
  return '#6B7280'
}

// ═══════════════════════════════════════════════════════════════════════════
// D-077: COLOR BLIND PATTERN MODES
// Accessible color palettes for different types of color vision deficiency
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Color blind mode types
 */
export type ColorBlindMode = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'highContrast'

/**
 * Color blind-friendly palettes
 * Research-based colors optimized for each type of color vision deficiency
 */
export const COLOR_BLIND_PALETTES: Record<ColorBlindMode, Record<PatternType, string>> = {
  default: {
    analytical: '#3B82F6',  // Blue
    patience: '#10B981',    // Green
    exploring: '#8B5CF6',   // Purple
    helping: '#EC4899',     // Pink
    building: '#F59E0B'     // Amber
  },
  // Protanopia (red-blind): Replace red/green with blue/yellow spectrum
  protanopia: {
    analytical: '#0077BB',  // Blue
    patience: '#33BBEE',    // Cyan
    exploring: '#EE7733',   // Orange
    helping: '#CC3311',     // Dark red (visible as darker)
    building: '#EE3377'     // Magenta
  },
  // Deuteranopia (green-blind): Similar adjustments, shift green to blue
  deuteranopia: {
    analytical: '#0077BB',  // Blue
    patience: '#009988',    // Teal
    exploring: '#EE7733',   // Orange
    helping: '#CC3311',     // Dark red
    building: '#EE3377'     // Magenta
  },
  // Tritanopia (blue-blind): Replace blue/purple with red/green spectrum
  tritanopia: {
    analytical: '#117733',  // Dark green
    patience: '#44AA99',    // Teal-green
    exploring: '#CC6677',   // Rose
    helping: '#882255',     // Dark magenta
    building: '#DDCC77'     // Yellow-tan
  },
  // High contrast: Maximum distinction for low vision
  highContrast: {
    analytical: '#0000FF',  // Pure blue
    patience: '#00FF00',    // Pure green
    exploring: '#FF00FF',   // Magenta
    helping: '#FF0000',     // Pure red
    building: '#FFFF00'     // Yellow
  }
}

/**
 * Get accessible color for pattern based on color blind mode
 */
export function getAccessiblePatternColor(
  pattern: PatternType | string,
  mode: ColorBlindMode = 'default'
): string {
  if (pattern in PATTERN_METADATA) {
    return COLOR_BLIND_PALETTES[mode][pattern as PatternType]
  }
  return '#6B7280'
}

/**
 * Get all pattern colors for a specific color blind mode
 */
export function getPatternColorPalette(mode: ColorBlindMode = 'default'): Record<PatternType, string> {
  return COLOR_BLIND_PALETTES[mode]
}

/**
 * Color blind mode labels for UI
 */
export const COLOR_BLIND_MODE_LABELS: Record<ColorBlindMode, string> = {
  default: 'Default',
  protanopia: 'Protanopia (Red-blind)',
  deuteranopia: 'Deuteranopia (Green-blind)',
  tritanopia: 'Tritanopia (Blue-blind)',
  highContrast: 'High Contrast'
}

/**
 * Color blind mode descriptions for accessibility settings
 */
export const COLOR_BLIND_MODE_DESCRIPTIONS: Record<ColorBlindMode, string> = {
  default: 'Standard color palette',
  protanopia: 'Optimized for red-green color blindness (red-blind type)',
  deuteranopia: 'Optimized for red-green color blindness (green-blind type)',
  tritanopia: 'Optimized for blue-yellow color blindness',
  highContrast: 'Maximum contrast for low vision accessibility'
}

/**
 * Get skills associated with a pattern
 * @example getPatternSkills('analytical') => ['criticalThinking', 'problemSolving', 'digitalLiteracy']
 */
export function getPatternSkills(pattern: PatternType | string): string[] {
  if (pattern in PATTERN_METADATA) {
    return PATTERN_METADATA[pattern as PatternType].skills
  }
  return []
}

/**
 * Validate if a string is a valid pattern type
 */
export function isValidPattern(pattern: string): pattern is PatternType {
  return PATTERN_TYPES.includes(pattern as PatternType)
}

/**
 * Pattern Sensations - Subtle feedback when player leans into a pattern
 * These are atmospheric, not informational. The station notices you.
 */
export const PATTERN_SENSATIONS: Record<PatternType, string[]> = {
  analytical: [
    'You pause to consider the angles.',
    'Something clicks into place.',
    'The pattern emerges.',
    'Your mind traces the connections.',
  ],
  patience: [
    'You let the moment breathe.',
    'There\'s no rush. You know that now.',
    'Silence has its own answers.',
    'You wait. The station waits with you.',
  ],
  exploring: [
    'Curiosity pulls at you.',
    'There\'s more here. You feel it.',
    'Questions beget questions.',
    'The unknown beckons.',
  ],
  helping: [
    'Something in you reaches out.',
    'Connection matters. You know this.',
    'Their story becomes part of yours.',
    'You lean in, listening.',
  ],
  building: [
    'Your hands itch to make it real.',
    'The shape of it forms in your mind.',
    'Creation stirs.',
    'You see what could be.',
  ],
}

/**
 * Get a random sensation for a pattern
 */
export function getPatternSensation(pattern: PatternType): string {
  const sensations = PATTERN_SENSATIONS[pattern]
  return sensations[Math.floor(Math.random() * sensations.length)]
}

// ═══════════════════════════════════════════════════════════════════════════
// VOICE VARIATION RESOLUTION
// Makes NPCs respond differently based on who the player is becoming
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Player patterns type - matches game state patterns structure
 */
export interface PlayerPatterns {
  analytical: number
  patience: number
  exploring: number
  helping: number
  building: number
}

/**
 * Default threshold for "dominant" pattern detection
 * A pattern must be >= this value to be considered dominant
 */
export const DOMINANT_PATTERN_THRESHOLD = 5

/**
 * Get the player's dominant pattern (if any)
 * A pattern is dominant if it's >= threshold AND higher than all other patterns
 *
 * @param patterns - Player's current pattern levels
 * @param threshold - Minimum level to be considered dominant (default: 5)
 * @returns The dominant pattern type, or undefined if none qualifies
 *
 * @example
 * getDominantPattern({ analytical: 7, patience: 3, exploring: 2, helping: 4, building: 1 }, 5)
 * // Returns: 'analytical'
 *
 * @example
 * getDominantPattern({ analytical: 4, patience: 4, exploring: 4, helping: 4, building: 4 }, 5)
 * // Returns: undefined (none >= 5)
 */
export function getDominantPattern(
  patterns: PlayerPatterns | Record<string, number>,
  threshold: number = DOMINANT_PATTERN_THRESHOLD
): PatternType | undefined {
  let maxPattern: PatternType | undefined
  let maxValue = threshold - 1 // Must exceed threshold - 1 (i.e., be >= threshold)

  for (const patternType of PATTERN_TYPES) {
    const value = patterns[patternType] ?? 0
    if (value >= threshold && value > maxValue) {
      maxValue = value
      maxPattern = patternType
    }
  }

  return maxPattern
}

/**
 * Get all patterns that meet the threshold (for complex voice logic)
 *
 * @param patterns - Player's current pattern levels
 * @param threshold - Minimum level to be considered (default: 5)
 * @returns Array of pattern types that meet threshold, sorted by value descending
 */
export function getPatternsMeetingThreshold(
  patterns: PlayerPatterns | Record<string, number>,
  threshold: number = DOMINANT_PATTERN_THRESHOLD
): PatternType[] {
  return PATTERN_TYPES
    .filter(pattern => (patterns[pattern] ?? 0) >= threshold)
    .sort((a, b) => (patterns[b] ?? 0) - (patterns[a] ?? 0))
}

/**
 * Result of voice variation resolution
 */
export interface VoiceVariationResult {
  /** The resolved text (either varied or original) */
  text: string
  /** The emotion (preserved from original) */
  emotion?: string
  /** Whether a voice variation was applied */
  wasVaried: boolean
  /** Which pattern triggered the variation (if any) */
  appliedPattern?: PatternType
}

/**
 * Resolve voice variation for NPC dialogue content
 *
 * When a player has developed a dominant pattern (>= threshold), NPCs respond
 * differently to acknowledge who the player is becoming. This creates the
 * BIDIRECTIONAL reflection system - NPCs see the player's patterns.
 *
 * @param content - The DialogueContent with optional voiceVariations
 * @param patterns - Player's current pattern levels
 * @param threshold - Minimum level to trigger variation (default: 5)
 * @returns Resolved text with emotion and variation metadata
 *
 * @example
 * const content = {
 *   text: "Tell me what you're thinking.",
 *   emotion: 'curious',
 *   voiceVariations: {
 *     analytical: "You're looking for the pattern, aren't you?",
 *     helping: "You noticed something was off. Thank you for that."
 *   }
 * }
 *
 * resolveContentVoiceVariation(content, { analytical: 7, ... })
 * // Returns: { text: "You're looking for the pattern, aren't you?", emotion: 'curious', wasVaried: true, appliedPattern: 'analytical' }
 */
export function resolveContentVoiceVariation(
  content: { text: string; emotion?: string; voiceVariations?: Partial<Record<PatternType, string>> },
  patterns: PlayerPatterns | Record<string, number>,
  threshold: number = DOMINANT_PATTERN_THRESHOLD
): VoiceVariationResult {
  // No voice variations defined - return original
  if (!content.voiceVariations) {
    return {
      text: content.text,
      emotion: content.emotion,
      wasVaried: false
    }
  }

  // Find dominant pattern
  const dominantPattern = getDominantPattern(patterns, threshold)

  // No dominant pattern - return original
  if (!dominantPattern) {
    return {
      text: content.text,
      emotion: content.emotion,
      wasVaried: false
    }
  }

  // Check if there's a variation for the dominant pattern
  const variedText = content.voiceVariations[dominantPattern]

  if (variedText) {
    return {
      text: variedText,
      emotion: content.emotion, // Preserve original emotion
      wasVaried: true,
      appliedPattern: dominantPattern
    }
  }

  // Dominant pattern exists but no variation for it - return original
  return {
    text: content.text,
    emotion: content.emotion,
    wasVaried: false
  }
}

/**
 * Resolve voice variation for player choice text
 *
 * When a player has developed a dominant pattern, their choice text adapts
 * to reflect who they're becoming. This makes the player's voice consistent
 * with their established patterns.
 *
 * @param choice - The ConditionalChoice with optional voiceVariations
 * @param patterns - Player's current pattern levels
 * @param threshold - Minimum level to trigger variation (default: 5)
 * @returns Resolved choice text
 *
 * @example
 * const choice = {
 *   text: "Tell me more.",
 *   voiceVariations: {
 *     analytical: "Walk me through the details.",
 *     helping: "That sounds hard. What happened?",
 *     patience: "Take your time. I'm listening."
 *   }
 * }
 *
 * resolveChoiceVoiceVariation(choice, { patience: 6, ... })
 * // Returns: "Take your time. I'm listening."
 */
export function resolveChoiceVoiceVariation(
  choice: { text: string; voiceVariations?: Partial<Record<PatternType, string>> },
  patterns: PlayerPatterns | Record<string, number>,
  threshold: number = DOMINANT_PATTERN_THRESHOLD
): string {
  // No voice variations defined - return original
  if (!choice.voiceVariations) {
    return choice.text
  }

  // Find dominant pattern
  const dominantPattern = getDominantPattern(patterns, threshold)

  // No dominant pattern - return original
  if (!dominantPattern) {
    return choice.text
  }

  // Return varied text if available, otherwise original
  return choice.voiceVariations[dominantPattern] ?? choice.text
}
