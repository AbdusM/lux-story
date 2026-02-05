/**
 * Voice Template Resolver
 *
 * Resolves player choices to pattern-appropriate voice variations using
 * a 4-tier priority system that respects hand-authored content.
 *
 * Resolution Priority:
 * 1. Custom override (voiceVariations from dialogue content) - ALWAYS wins
 * 2. Character-specific pattern override
 * 3. Template archetype transform with slot filling
 * 4. Base text fallback
 *
 * Design Philosophy (from Game Designer Brain analysis):
 * - Invisible sophistication: System works silently but should be surfaced
 * - Regex fragility mitigation: Confidence scoring + explicit annotation priority
 * - Slot fill safety: Validate extracted values, use sensible defaults
 * - Variety injection: Hook for future "off-day" character moods
 */

import { type PatternType, getDominantPattern } from '@/lib/patterns'
import { random } from '@/lib/seeded-random'
import type {
  TemplateArchetype,
  VoiceCharacterId,
  VoiceResolutionContext,
  PlayerPatterns
} from './template-types'
import {
  VOICE_TEMPLATES,
  detectArchetype,
  extractSlotValues,
  fillSlots
} from './template-archetypes'
import { CHARACTER_VOICE_PROFILES } from './character-voices'

// ============================================================
// CONFIGURATION
// ============================================================

/**
 * Minimum confidence threshold for archetype detection
 * Below this, fall back to base text (per Game Designer recommendation)
 */
const DETECTION_CONFIDENCE_THRESHOLD = 0.7

/**
 * Enable variety injection for non-key moments
 * When true, 20% of the time uses a different pattern's voice
 */
const ENABLE_VARIETY_INJECTION = false // Disabled until playtesting validates

/**
 * Variety injection probability (when enabled)
 */
const VARIETY_INJECTION_RATE = 0.2

// ============================================================
// PATTERN UTILITIES
// ============================================================

/**
 * Get secondary pattern for variety injection
 */
function getSecondaryPattern(
  patterns: PlayerPatterns,
  excludePattern: PatternType
): PatternType | null {
  const entries = Object.entries(patterns) as [PatternType, number][]
  const filtered = entries.filter(([pattern]) => pattern !== excludePattern)

  if (filtered.length === 0) return null

  const maxScore = Math.max(...filtered.map(([, score]) => score))
  if (maxScore < 1) return null

  return filtered.find(([, score]) => score === maxScore)?.[0] || null
}

// ============================================================
// DETECTION CONFIDENCE
// ============================================================

/**
 * Detection result with confidence score
 */
interface DetectionResult {
  archetype: TemplateArchetype | null
  confidence: number
  matchedPattern?: string
}

/**
 * Detect archetype with confidence scoring
 * Higher confidence for:
 * - Longer matching phrases
 * - More specific patterns (STAY_SILENT markers)
 * - Earlier in detection priority
 */
export function detectArchetypeWithConfidence(baseText: string): DetectionResult {
  const text = baseText.toLowerCase().trim()
  const textLength = text.length

  // Very short text = low confidence
  if (textLength < 5) {
    return { archetype: null, confidence: 0 }
  }

  // Check for explicit markers first (highest confidence)
  if (/\[(silence|wait|pause)\]/i.test(text)) {
    return {
      archetype: 'STAY_SILENT',
      confidence: 1.0,
      matchedPattern: 'explicit marker'
    }
  }

  if (/\[(query|pause|acknowledged|noted|error|execute)\]/i.test(text)) {
    // This is Devon-style syntax, likely already has voice variation
    return { archetype: null, confidence: 0 }
  }

  // Use standard detection
  const archetype = detectArchetype(baseText)

  if (!archetype) {
    return { archetype: null, confidence: 0 }
  }

  // Calculate confidence based on text characteristics
  let confidence = 0.6 // Base confidence for regex match

  // Boost for question marks (clearer intent)
  if (text.includes('?')) confidence += 0.15

  // Boost for longer text (more context)
  if (textLength > 30) confidence += 0.1
  if (textLength > 60) confidence += 0.1

  // Boost for specific archetypes that have distinctive patterns
  const highConfidenceArchetypes: TemplateArchetype[] = [
    'STAY_SILENT',
    'REFLECT_BACK',
    'SET_BOUNDARY'
  ]
  if (highConfidenceArchetypes.includes(archetype)) {
    confidence += 0.15
  }

  // Cap at 1.0
  confidence = Math.min(confidence, 1.0)

  return {
    archetype,
    confidence,
    matchedPattern: 'regex detection'
  }
}

// ============================================================
// CORE RESOLUTION
// ============================================================

/**
 * Resolution result with metadata for debugging
 */
export interface VoiceResolutionResult {
  text: string
  source: 'custom' | 'character' | 'template' | 'base'
  archetype?: TemplateArchetype
  pattern?: PatternType
  confidence?: number
  varietyInjected?: boolean
}

/**
 * Resolve voice variation for a player choice
 *
 * Priority chain:
 * 1. Custom override (hand-authored) - ALWAYS wins
 * 2. Character-specific override - respects character voice
 * 3. Template archetype - automatic pattern variation
 * 4. Base text - safe fallback
 *
 * @param context - Resolution context with base text and options
 * @param patterns - Player's current pattern scores
 * @returns Resolution result with text and metadata
 */
export function resolveVoiceVariation(
  context: VoiceResolutionContext,
  patterns: PlayerPatterns
): VoiceResolutionResult {
  // Use threshold 2 for early pattern detection in voice variations
  const dominant = getDominantPattern(patterns, 2)

  // No dominant pattern = use base text
  if (!dominant) {
    return {
      text: context.baseText,
      source: 'base'
    }
  }

  // Variety injection: occasionally use secondary pattern
  let effectivePattern = dominant
  let varietyInjected = false

  // TD-007: Use seeded random for deterministic testing
  if (ENABLE_VARIETY_INJECTION && random() < VARIETY_INJECTION_RATE) {
    const secondary = getSecondaryPattern(patterns, dominant)
    if (secondary) {
      effectivePattern = secondary
      varietyInjected = true
    }
  }

  // PRIORITY 1: Custom override (hand-authored voiceVariations)
  if (context.customOverride?.[effectivePattern]) {
    return {
      text: context.customOverride[effectivePattern]!,
      source: 'custom',
      pattern: effectivePattern,
      varietyInjected
    }
  }

  // PRIORITY 2: Character-specific override
  if (context.characterId) {
    const profile = CHARACTER_VOICE_PROFILES[context.characterId]
    const archetype = context.archetype || detectArchetypeWithConfidence(context.baseText).archetype

    if (archetype && profile?.patternOverrides?.[effectivePattern]?.[archetype]) {
      return {
        text: profile.patternOverrides[effectivePattern]![archetype]!,
        source: 'character',
        archetype,
        pattern: effectivePattern,
        varietyInjected
      }
    }
  }

  // PRIORITY 3: Template archetype
  // Prefer explicit archetype, then detect
  let archetype = context.archetype
  let confidence = 1.0

  if (!archetype) {
    const detection = detectArchetypeWithConfidence(context.baseText)
    archetype = detection.archetype ?? undefined
    confidence = detection.confidence
  }

  // If detection confidence is too low, fall back to base text
  if (archetype && confidence < DETECTION_CONFIDENCE_THRESHOLD) {
    return {
      text: context.baseText,
      source: 'base',
      archetype,
      confidence
    }
  }

  if (archetype) {
    const template = VOICE_TEMPLATES[archetype]
    if (template?.transforms[effectivePattern]) {
      const slots = extractSlotValues(context.baseText, archetype)
      const filledText = fillSlots(template.transforms[effectivePattern], slots)

      // Validate the filled text looks reasonable
      if (isValidFilledText(filledText)) {
        return {
          text: filledText,
          source: 'template',
          archetype,
          pattern: effectivePattern,
          confidence,
          varietyInjected
        }
      }
    }
  }

  // PRIORITY 4: Base text fallback
  return {
    text: context.baseText,
    source: 'base'
  }
}

/**
 * Validate that filled text looks reasonable
 * Catches slot extraction failures
 */
function isValidFilledText(text: string): boolean {
  // Check for unfilled slot markers
  if (/\{[a-z]+\}/.test(text)) return false

  // Check for empty or whitespace-only
  if (!text.trim()) return false

  // Check for reasonable length
  if (text.length < 3) return false

  // Check for doubled punctuation from bad slot fills
  if (/([.!?])\1{2,}/.test(text)) return false

  return true
}

// ============================================================
// CONVENIENCE FUNCTIONS
// ============================================================

/**
 * Simple voice resolution function for backward compatibility
 * Returns just the text string
 */
export function getVoicedText(
  baseText: string,
  patterns: PlayerPatterns,
  options?: {
    voiceVariations?: Partial<Record<PatternType, string>>
    characterId?: VoiceCharacterId
    archetype?: TemplateArchetype
  }
): string {
  const result = resolveVoiceVariation(
    {
      baseText,
      customOverride: options?.voiceVariations,
      characterId: options?.characterId,
      archetype: options?.archetype
    },
    patterns
  )

  return result.text
}

/**
 * Check if a choice would benefit from voice variation
 * Useful for content audit tools
 */
export function wouldBenefitFromVoice(
  baseText: string,
  hasCustomVariations: boolean
): {
  shouldHaveVoice: boolean
  detectedArchetype: TemplateArchetype | null
  confidence: number
  reason: string
} {
  // Already has custom variations
  if (hasCustomVariations) {
    return {
      shouldHaveVoice: false,
      detectedArchetype: null,
      confidence: 1.0,
      reason: 'Already has custom voiceVariations'
    }
  }

  const detection = detectArchetypeWithConfidence(baseText)

  if (detection.archetype && detection.confidence >= DETECTION_CONFIDENCE_THRESHOLD) {
    return {
      shouldHaveVoice: true,
      detectedArchetype: detection.archetype,
      confidence: detection.confidence,
      reason: `Detected as ${detection.archetype} with ${(detection.confidence * 100).toFixed(0)}% confidence`
    }
  }

  if (detection.archetype && detection.confidence < DETECTION_CONFIDENCE_THRESHOLD) {
    return {
      shouldHaveVoice: true,
      detectedArchetype: detection.archetype,
      confidence: detection.confidence,
      reason: `May be ${detection.archetype} but confidence too low (${(detection.confidence * 100).toFixed(0)}%) - consider explicit annotation`
    }
  }

  return {
    shouldHaveVoice: false,
    detectedArchetype: null,
    confidence: 0,
    reason: 'No archetype detected - may need custom voiceVariations or explicit archetype annotation'
  }
}

// ============================================================
// DEBUG & TESTING
// ============================================================

/**
 * Explain how a voice variation was resolved (for debugging)
 */
export function explainResolution(
  context: VoiceResolutionContext,
  patterns: PlayerPatterns
): string {
  const result = resolveVoiceVariation(context, patterns)
  const dominant = getDominantPattern(patterns, 2)

  let explanation = `Voice Resolution for: "${context.baseText}"\n`
  explanation += `---\n`
  explanation += `Dominant pattern: ${dominant || 'none'}\n`
  explanation += `Resolution source: ${result.source}\n`
  explanation += `Final text: "${result.text}"\n`

  if (result.archetype) {
    explanation += `Detected archetype: ${result.archetype}\n`
  }

  if (result.confidence !== undefined) {
    explanation += `Detection confidence: ${(result.confidence * 100).toFixed(0)}%\n`
  }

  if (result.varietyInjected) {
    explanation += `Note: Variety injection used secondary pattern\n`
  }

  return explanation
}
