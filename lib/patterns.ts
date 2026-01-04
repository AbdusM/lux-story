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
