/**
 * Urgency Narrative Validator
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Purpose: Validate Glass Box urgency narratives for word count and structure
 * Ensures narratives are concise, action-oriented, and severity-appropriate
 */

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low'
export type AdminViewMode = 'family' | 'research'

/**
 * Word count limits by urgency level
 */
export const WORD_COUNT_LIMITS: Record<UrgencyLevel, { min: number; max: number }> = {
  critical: { min: 15, max: 20 },
  high: { min: 20, max: 25 },
  medium: { min: 25, max: 30 },
  low: { min: 30, max: 40 },
}

/**
 * Count words in a text string
 * Treats markdown formatting (**, __) and emojis as non-words
 */
export function countWords(text: string): number {
  // Remove markdown formatting and emojis
  const cleanText = text
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/__/g, '') // Remove emphasis markers
    .replace(/[^\w\s'-]/g, ' ') // Replace non-word chars (except hyphens/apostrophes) with spaces
    .trim()

  // Split on whitespace and filter empty strings
  const words = cleanText.split(/\s+/).filter((word) => word.length > 0)
  return words.length
}

/**
 * Validate narrative word count against severity level limits
 */
export function validateWordCount(
  narrative: string,
  level: UrgencyLevel
): { valid: boolean; wordCount: number; message?: string } {
  const wordCount = countWords(narrative)
  const limits = WORD_COUNT_LIMITS[level]

  if (wordCount < limits.min) {
    return {
      valid: false,
      wordCount,
      message: `${level.toUpperCase()} narrative too short: ${wordCount} words (min: ${limits.min})`,
    }
  }

  if (wordCount > limits.max) {
    return {
      valid: false,
      wordCount,
      message: `${level.toUpperCase()} narrative too long: ${wordCount} words (max: ${limits.max})`,
    }
  }

  return {
    valid: true,
    wordCount,
  }
}

/**
 * Validate narrative structure
 * Ensures narrative has required components based on severity level
 */
export function validateNarrativeStructure(
  narrative: string,
  level: UrgencyLevel
): { valid: boolean; message?: string } {
  // All narratives must have **Action:** directive
  if (!narrative.includes('**Action:**')) {
    return {
      valid: false,
      message: 'Narrative missing **Action:** directive',
    }
  }

  // Critical and high must have emoji indicator
  if ((level === 'critical' || level === 'high') && !narrative.match(/^[🚨🟠]/)) {
    return {
      valid: false,
      message: `${level.toUpperCase()} narrative must start with urgency emoji (🚨 or 🟠)`,
    }
  }

  // Medium must have 🟡 emoji
  if (level === 'medium' && !narrative.startsWith('🟡')) {
    return {
      valid: false,
      message: 'MEDIUM narrative must start with 🟡 emoji',
    }
  }

  // Low must have ✅ emoji
  if (level === 'low' && !narrative.startsWith('✅')) {
    return {
      valid: false,
      message: 'LOW narrative must start with ✅ emoji',
    }
  }

  // Critical must include "today" in action
  if (level === 'critical' && !narrative.toLowerCase().includes('today')) {
    return {
      valid: false,
      message: 'CRITICAL narrative must include "today" in action directive',
    }
  }

  return { valid: true }
}

/**
 * Full narrative validation
 * Combines word count and structure validation
 */
export function validateNarrative(
  narrative: string,
  level: UrgencyLevel
): { valid: boolean; wordCount: number; errors: string[] } {
  const errors: string[] = []

  // Validate word count
  const wordCountResult = validateWordCount(narrative, level)
  if (!wordCountResult.valid && wordCountResult.message) {
    errors.push(wordCountResult.message)
  }

  // Validate structure
  const structureResult = validateNarrativeStructure(narrative, level)
  if (!structureResult.valid && structureResult.message) {
    errors.push(structureResult.message)
  }

  return {
    valid: errors.length === 0,
    wordCount: wordCountResult.wordCount,
    errors,
  }
}

/**
 * Example narratives for testing and documentation
 */
export const EXAMPLE_NARRATIVES: Record<UrgencyLevel, Record<AdminViewMode, string>> = {
  critical: {
    family:
      '🚨 Student stopped playing 5 days ago after a strong start (8 choices). Likely stuck or confused. **Action:** Reach out today.',
    research:
      '🚨 Disengagement pattern detected. Initial: 8 choices. Recent: 2 scenes/5 days. **Action:** Immediate contact protocol today.',
  },
  high: {
    family:
      "🟠 Student's choices show anxiety patterns (4 family conflict scenes). Anxiety patterns suggest need for support. **Action:** Check in this week.",
    research:
      '🟠 Anxiety indicators: 4 family conflict scenes, 78% stress-related choices. Parental pressure hypothesis. **Action:** Counselor intervention within 48 hours this week.',
  },
  medium: {
    family:
      "🟡 No new careers explored in 2 weeks. Comfortable with current path but might benefit from broader exploration. **Action:** Gentle nudge to explore new areas within 2 weeks.",
    research:
      '🟡 Career exploration stagnation: 14-day gap since last new career. Engineering focus (85%). Stable engagement but room for growth. **Action:** Monitor and encourage broader career exploration within 2 weeks.',
  },
  low: {
    family:
      "✅ Thriving with balanced exploration! Explored 4 careers, formed 2 relationships, demonstrating thoughtful decision-making and consistent daily engagement patterns. Great momentum! **Action:** Monthly check-in to celebrate progress and discuss future goals.",
    research:
      '✅ Strong helping patterns and positive engagement metrics! Consistent activity (18 choices) with good reflection patterns, balanced career exploration across 4 domains. **Action:** Schedule monthly progress review to discuss next steps and emerging interests.',
  },
}

/**
 * Test utility: Validate all example narratives
 * Useful for ensuring examples meet validation criteria
 */
export function validateExamples(): Record<string, unknown> {
  const results: Record<string, unknown> = {}

  for (const [level, modes] of Object.entries(EXAMPLE_NARRATIVES)) {
    results[level] = {}
    for (const [mode, narrative] of Object.entries(modes)) {
      const validation = validateNarrative(narrative, level as UrgencyLevel)
      // @ts-expect-error - Unknown type handling
      results[level][mode] = {
        narrative,
        ...validation,
        status: validation.valid ? '✅ PASS' : '❌ FAIL',
      }
    }
  }

  return results
}

/**
 * Development helper: Log validation results for debugging
 */
export function logValidationResults(narrative: string, level: UrgencyLevel): void {
  const validation = validateNarrative(narrative, level)
  const limits = WORD_COUNT_LIMITS[level]

  // Use console.warn for development debugging (allowed by ESLint)
  if (process.env.NODE_ENV === 'development') {
    console.warn(`🔍 Urgency Narrative Validation - ${level.toUpperCase()}`)
    console.warn('Narrative:', narrative)
    console.warn('Word Count:', validation.wordCount, `(${limits.min}-${limits.max})`)
    console.warn('Valid:', validation.valid ? '✅ PASS' : '❌ FAIL')
    if (validation.errors.length > 0) {
      console.warn('Errors:')
      validation.errors.forEach((error) => console.warn(`  - ${error}`))
    }
  }
}
