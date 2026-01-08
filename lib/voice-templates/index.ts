/**
 * Voice Templates Module
 *
 * Template-based voice variation system for Grand Central Terminus.
 * Enables 60% reduction in manual authoring while maintaining character authenticity.
 *
 * Usage:
 * ```typescript
 * import {
 *   resolveVoiceVariation,
 *   getVoicedText,
 *   detectArchetype,
 *   CHARACTER_VOICE_PROFILES
 * } from '@/lib/voice-templates'
 *
 * // Get voiced text for a choice
 * const text = getVoicedText(
 *   "Tell me more about that",
 *   playerPatterns,
 *   { characterId: 'maya' }
 * )
 *
 * // Full resolution with metadata
 * const result = resolveVoiceVariation({
 *   baseText: "Tell me more about that",
 *   characterId: 'maya'
 * }, playerPatterns)
 *
 * console.log(result.text)   // The voiced text
 * console.log(result.source) // 'custom' | 'character' | 'template' | 'base'
 * ```
 */

// ============================================================
// TYPE EXPORTS
// ============================================================

export type {
  TemplateArchetype,
  VoiceCharacterId,
  VoiceTemplate,
  CharacterVoiceProfile,
  VoiceResolutionContext,
  PlayerPatterns,
  VoiceCoverageResult,
  MigrationAnalysis,
  SyntaxStructure,
  BrevityLevel
} from './template-types'

// ============================================================
// ARCHETYPE EXPORTS
// ============================================================

export {
  VOICE_TEMPLATES,
  detectArchetype,
  extractSlotValues,
  fillSlots,
  getArchetypeNames,
  isValidArchetype
} from './template-archetypes'

// ============================================================
// CHARACTER VOICE EXPORTS
// ============================================================

export {
  CHARACTER_VOICE_PROFILES,
  getCharacterVoice,
  hasPatternOverride,
  getCharactersWithArchetypeOverride
} from './character-voices'

// ============================================================
// RESOLVER EXPORTS
// ============================================================

export {
  resolveVoiceVariation,
  getVoicedText,
  getDominantPattern,
  detectArchetypeWithConfidence,
  wouldBenefitFromVoice,
  explainResolution
} from './template-resolver'

export type { VoiceResolutionResult } from './template-resolver'

// ============================================================
// VALIDATOR EXPORTS
// ============================================================

export {
  validateVoiceCoverage,
  meetsTargetCoverage,
  analyzeMigration,
  auditCharacterChoices,
  generateAuditSummary,
  analyzeArchetypeDistribution,
  getUnderrepresentedArchetypes,
  CHARACTER_TIER_TARGETS
} from './template-validator'

export type { ChoiceAuditResult } from './template-validator'
