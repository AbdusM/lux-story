/**
 * D-078: Cognitive Load Adjustment
 * Accessibility feature that adjusts UI complexity based on user preference
 *
 * Research basis:
 * - Miller's Law: 7±2 chunks of information at a time
 * - Cognitive Load Theory: Reduce extraneous load for better learning
 * - WCAG 2.1: Support users with cognitive disabilities
 */

import { type EvaluatedChoice } from './dialogue-graph'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cognitive load levels
 * - minimal: Reduce to 2-3 choices, essential text only
 * - reduced: 3-4 choices, simplified text where available
 * - normal: Full experience (default)
 * - detailed: Show all available choices + extra context
 */
export type CognitiveLoadLevel = 'minimal' | 'reduced' | 'normal' | 'detailed'

/**
 * Configuration for each cognitive load level
 */
export interface CognitiveLoadConfig {
  maxChoices: number           // Maximum choices to display
  maxTextLength: number        // Max characters in choice text before truncation
  showSubtext: boolean         // Whether to show choice subtext
  showPatternHints: boolean    // Whether to show pattern alignment hints
  animationSpeed: number       // Multiplier for animation speeds (1 = normal)
  readingTimeMultiplier: number // Multiplier for reading time calculations
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration per cognitive load level
 */
export const COGNITIVE_LOAD_CONFIG: Record<CognitiveLoadLevel, CognitiveLoadConfig> = {
  minimal: {
    maxChoices: 2,
    maxTextLength: 60,
    showSubtext: false,
    showPatternHints: false,
    animationSpeed: 0.5,      // Slower animations
    readingTimeMultiplier: 1.5 // More time to read
  },
  reduced: {
    maxChoices: 3,
    maxTextLength: 100,
    showSubtext: false,
    showPatternHints: false,
    animationSpeed: 0.75,
    readingTimeMultiplier: 1.25
  },
  normal: {
    maxChoices: 5,
    maxTextLength: 200,
    showSubtext: true,
    showPatternHints: true,
    animationSpeed: 1.0,
    readingTimeMultiplier: 1.0
  },
  detailed: {
    maxChoices: 8,
    maxTextLength: 300,
    showSubtext: true,
    showPatternHints: true,
    animationSpeed: 1.0,
    readingTimeMultiplier: 0.8 // Less reading time (assumes higher processing speed)
  }
}

/**
 * Labels for cognitive load levels (for UI)
 */
export const COGNITIVE_LOAD_LABELS: Record<CognitiveLoadLevel, string> = {
  minimal: 'Simplified',
  reduced: 'Reduced Complexity',
  normal: 'Standard',
  detailed: 'Full Detail'
}

/**
 * Descriptions for cognitive load levels (for accessibility settings)
 */
export const COGNITIVE_LOAD_DESCRIPTIONS: Record<CognitiveLoadLevel, string> = {
  minimal: 'Fewer choices, shorter text, slower animations - ideal for focus or fatigue',
  reduced: 'Streamlined experience with essential choices only',
  normal: 'Full game experience with all features',
  detailed: 'Maximum information including all optional choices and context'
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get configuration for a cognitive load level
 */
export function getCognitiveLoadConfig(level: CognitiveLoadLevel): CognitiveLoadConfig {
  return COGNITIVE_LOAD_CONFIG[level]
}

/**
 * Filter choices based on cognitive load level
 * Prioritizes choices by:
 * 1. Critical story choices (no pattern requirement)
 * 2. Pattern-aligned choices (if player has that pattern developed)
 * 3. General exploration choices
 */
export function filterChoicesByLoad(
  choices: EvaluatedChoice[],
  level: CognitiveLoadLevel,
  playerDominantPattern?: string
): EvaluatedChoice[] {
  const config = COGNITIVE_LOAD_CONFIG[level]

  if (choices.length <= config.maxChoices) {
    return choices
  }

  // Sort by priority
  const prioritized = [...choices].sort((a, b) => {
    // Critical choices (no pattern) first
    const aHasPattern = !!a.choice.pattern
    const bHasPattern = !!b.choice.pattern
    if (!aHasPattern && bHasPattern) return -1
    if (aHasPattern && !bHasPattern) return 1

    // Then dominant pattern choices
    if (playerDominantPattern) {
      const aMatchesDominant = a.choice.pattern === playerDominantPattern
      const bMatchesDominant = b.choice.pattern === playerDominantPattern
      if (aMatchesDominant && !bMatchesDominant) return -1
      if (!aMatchesDominant && bMatchesDominant) return 1
    }

    return 0
  })

  return prioritized.slice(0, config.maxChoices)
}

/**
 * Truncate text based on cognitive load level
 */
export function truncateTextForLoad(
  text: string,
  level: CognitiveLoadLevel
): string {
  const config = COGNITIVE_LOAD_CONFIG[level]

  if (text.length <= config.maxTextLength) {
    return text
  }

  // Find a good break point (end of word, punctuation)
  const truncated = text.slice(0, config.maxTextLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > config.maxTextLength * 0.7) {
    return truncated.slice(0, lastSpace) + '...'
  }

  return truncated + '...'
}

/**
 * Get animation duration multiplier for cognitive load level
 */
export function getAnimationSpeedMultiplier(level: CognitiveLoadLevel): number {
  return COGNITIVE_LOAD_CONFIG[level].animationSpeed
}

/**
 * Get reading time multiplier for cognitive load level
 */
export function getReadingTimeMultiplier(level: CognitiveLoadLevel): number {
  return COGNITIVE_LOAD_CONFIG[level].readingTimeMultiplier
}

/**
 * Check if subtext should be shown for cognitive load level
 */
export function shouldShowSubtext(level: CognitiveLoadLevel): boolean {
  return COGNITIVE_LOAD_CONFIG[level].showSubtext
}

/**
 * Check if pattern hints should be shown for cognitive load level
 */
export function shouldShowPatternHints(level: CognitiveLoadLevel): boolean {
  return COGNITIVE_LOAD_CONFIG[level].showPatternHints
}

/**
 * Calculate adjusted delay for animations/transitions
 */
export function getAdjustedDelay(
  baseDelayMs: number,
  level: CognitiveLoadLevel
): number {
  // Inverse relationship: slower animations = longer delays
  const speedMultiplier = COGNITIVE_LOAD_CONFIG[level].animationSpeed
  return Math.round(baseDelayMs / speedMultiplier)
}
