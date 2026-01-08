/**
 * Voice Template Type Definitions
 *
 * This module defines the type system for the template-based voice variation architecture.
 * Templates enable 60% reduction in manual authoring while maintaining character authenticity.
 */

import { PatternType } from '@/lib/patterns'
import type { PlayerPatterns } from '@/lib/character-state'

// Re-export for convenience
export type { PlayerPatterns }

/**
 * The 20 primary character IDs for voice profiles
 * (Excludes location graphs which don't need voice profiles)
 */
export type VoiceCharacterId =
  | 'samuel'
  | 'maya'
  | 'devon'
  | 'jordan'
  | 'marcus'
  | 'tess'
  | 'yaquin'
  | 'kai'
  | 'alex'
  | 'rohan'
  | 'silas'
  | 'elena'
  | 'grace'
  | 'asha'
  | 'lira'
  | 'zara'
  // LinkedIn 2026 Career Expansion
  | 'quinn'
  | 'dante'
  | 'nadia'
  | 'isaiah'

/**
 * Template Archetypes - the 10 semantic categories of player utterances
 *
 * Each archetype represents a common conversational intent that can be
 * expressed differently based on the player's dominant pattern.
 */
export type TemplateArchetype =
  | 'ASK_FOR_DETAILS'        // "Tell me more" / "Walk me through"
  | 'STAY_SILENT'            // "[Say nothing]" / "[Let the silence hold]"
  | 'ACKNOWLEDGE_EMOTION'    // "That sounds hard" / "I hear that"
  | 'EXPRESS_CURIOSITY'      // "I'm curious" / "What if..."
  | 'OFFER_SUPPORT'          // "I'm here for you" / "Let me help"
  | 'CHALLENGE_ASSUMPTION'   // "But what if..." / "That doesn't hold"
  | 'SHOW_UNDERSTANDING'     // "That makes sense" / "I get it"
  | 'TAKE_ACTION'            // "Let's do it" / "Time to move"
  | 'REFLECT_BACK'           // "So you're saying..." / "What I hear is..."
  | 'SET_BOUNDARY'           // "I need time" / "Give me space"
  | 'MAKE_OBSERVATION'       // "I noticed..." / "You said X not Y"
  | 'SIMPLE_CONTINUE'        // "[Continue]" / "Go on" / "And then?"
  | 'AFFIRM_CHOICE'          // "I'll do it" / "Count me in" / "Yes"
  | 'SHARE_PERSPECTIVE'      // "I think..." / "For me..." / "In my view..."
  | 'EXPRESS_GRATITUDE'      // "Thank you" / "I appreciate..." / "Thanks for..."
  | 'SEEK_CLARIFICATION'     // "Do you mean..." / "Can you explain..." / "What do you mean by..."

/**
 * A template archetype definition with pattern-specific transforms
 */
export interface VoiceTemplate {
  /** The archetype identifier */
  archetype: TemplateArchetype

  /** Pattern-specific text transforms */
  transforms: Record<PatternType, string>

  /** Optional slots that can be filled from base text (e.g., {subject}, {emotion}) */
  slots?: string[]

  /** Optional description of when this archetype applies */
  description?: string
}

/**
 * Syntax structure preferences for character voice
 */
export type SyntaxStructure =
  | 'declarative'    // Direct statements
  | 'interrogative'  // Question-heavy
  | 'fragmented'     // Incomplete thoughts, ellipses
  | 'formal'         // Professional, complete sentences

/**
 * Brevity preference for character voice
 */
export type BrevityLevel =
  | 'terse'      // Short, clipped responses
  | 'moderate'   // Standard length
  | 'verbose'    // Longer, more detailed

/**
 * Character voice profile - defines how a character "sounds"
 */
export interface CharacterVoiceProfile {
  /** Character identifier */
  characterId: VoiceCharacterId

  /** Vocabulary preferences */
  vocabulary: {
    /** Words this character tends to use */
    preferred: string[]
    /** Words this character avoids */
    avoided: string[]
  }

  /** Syntax preferences */
  syntax: {
    /** Sentence structure preference */
    structure: SyntaxStructure
    /** Response length preference */
    brevity: BrevityLevel
  }

  /**
   * Pattern-specific archetype overrides
   * When a player with pattern X uses archetype Y with this character,
   * use this custom text instead of the template default.
   */
  patternOverrides?: Partial<Record<PatternType, Partial<Record<TemplateArchetype, string>>>>
}

/**
 * Context for voice variation resolution
 */
export interface VoiceResolutionContext {
  /** The original choice text */
  baseText: string

  /** Optional archetype hint (auto-detected if not provided) */
  archetype?: TemplateArchetype

  /** Character being spoken to (enables character-specific overrides) */
  characterId?: VoiceCharacterId

  /** Custom voiceVariations from dialogue content (always wins if present) */
  customOverride?: Partial<Record<PatternType, string>>
}

// PlayerPatterns imported from @/lib/character-state

/**
 * Result of voice coverage validation
 */
export interface VoiceCoverageResult {
  characterId: VoiceCharacterId
  tierTarget: number
  covered: number
  total: number
  percentage: string
  gaps: string[]
}

/**
 * Analysis of existing voice variations for migration
 */
export interface MigrationAnalysis {
  totalChoices: number
  choicesWithVoice: number
  byArchetype: Record<TemplateArchetype | 'CUSTOM' | 'UNDETECTED', number>
  customVariations: Array<{
    file: string
    nodeId: string
    choiceId: string
    text: string
    variations: Partial<Record<PatternType, string>>
  }>
}
