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
    label: 'Analytical Thinker',
    shortLabel: 'Analytical',
    description: 'You analyze details and think critically about options before deciding',
    contextDescription: 'Approached the situation by analyzing details and thinking critically about the options',
    color: '#3B82F6',
    tailwindBg: 'bg-blue-500',
    tailwindText: 'text-blue-600',
    skills: ['criticalThinking', 'problemSolving', 'digitalLiteracy']
  },
  patience: {
    label: 'Patient Listener',
    shortLabel: 'Patient',
    description: 'You listen carefully and understand before responding or taking action',
    contextDescription: 'Took time to listen carefully and understand before responding or making a decision',
    color: '#10B981',
    tailwindBg: 'bg-green-500',
    tailwindText: 'text-green-600',
    skills: ['timeManagement', 'adaptability', 'emotionalIntelligence']
  },
  exploring: {
    label: 'Curious Explorer',
    shortLabel: 'Curious',
    description: 'You ask questions to learn more and explore different perspectives',
    contextDescription: 'Asked curious questions to learn more and explore different perspectives',
    color: '#8B5CF6',
    tailwindBg: 'bg-purple-500',
    tailwindText: 'text-purple-600',
    skills: ['adaptability', 'creativity', 'criticalThinking']
  },
  helping: {
    label: 'Supportive Helper',
    shortLabel: 'Supportive',
    description: 'You offer support and show care for others and their wellbeing',
    contextDescription: 'Offered support and assistance to others, showing care for their wellbeing',
    color: '#EC4899',
    tailwindBg: 'bg-pink-500',
    tailwindText: 'text-pink-600',
    skills: ['emotionalIntelligence', 'collaboration', 'communication']
  },
  building: {
    label: 'Creative Builder',
    shortLabel: 'Creative',
    description: 'You create and improve things with a constructive, hands-on approach',
    contextDescription: 'Worked on creating or improving something, taking a constructive approach',
    color: '#F59E0B',
    tailwindBg: 'bg-amber-500',
    tailwindText: 'text-amber-600',
    skills: ['creativity', 'problemSolving', 'leadership']
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
