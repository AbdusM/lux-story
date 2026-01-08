/**
 * Voice Template Validator
 *
 * Build-time validation and content audit tools for the voice variation system.
 * Helps identify coverage gaps and ensures quality across all characters.
 *
 * Key Features:
 * - Per-character voice coverage analysis
 * - Archetype detection accuracy testing
 * - Migration analysis for existing content
 * - Content audit reports
 */

import type { PatternType } from '@/lib/patterns'
import type {
  TemplateArchetype,
  VoiceCharacterId,
  VoiceCoverageResult,
  MigrationAnalysis
} from './template-types'
import {
  detectArchetype,
  getArchetypeNames,
  isValidArchetype
} from './template-archetypes'
import { detectArchetypeWithConfidence, wouldBenefitFromVoice } from './template-resolver'

// ============================================================
// CHARACTER TIER TARGETS
// ============================================================

/**
 * Voice variation targets per character tier
 * From CLAUDE.md:
 * - Tier 1: 15 variations (Core: Samuel, Maya, Devon)
 * - Tier 2: 10 variations (Marcus, Kai, Tess, Rohan)
 * - Tier 3-4: 6 variations (Everyone else)
 */
const CHARACTER_TIER_TARGETS: Record<VoiceCharacterId, number> = {
  // Tier 1 - Core (15 variations)
  samuel: 15,
  maya: 15,
  devon: 15,

  // Tier 2 - Standard (10 variations)
  marcus: 10,
  kai: 10,
  tess: 10,
  rohan: 10,

  // Tier 3-4 - Extended/Specialized (6 variations)
  yaquin: 6,
  grace: 6,
  alex: 6,
  elena: 6,
  jordan: 6,
  silas: 6,
  asha: 6,
  lira: 6,
  zara: 6
}

// ============================================================
// COVERAGE VALIDATION
// ============================================================

/**
 * Choice data for validation
 */
interface ChoiceData {
  nodeId: string
  choiceId: string
  text: string
  voiceVariations?: Partial<Record<PatternType, string>>
  archetype?: TemplateArchetype
}

/**
 * Validate voice coverage for a character's dialogue choices
 *
 * @param characterId - Character to validate
 * @param choices - Array of dialogue choices from the character's graph
 * @returns Coverage result with gaps identified
 */
export function validateVoiceCoverage(
  characterId: VoiceCharacterId,
  choices: ChoiceData[]
): VoiceCoverageResult {
  const tierTarget = CHARACTER_TIER_TARGETS[characterId]
  const gaps: string[] = []
  let covered = 0

  for (const choice of choices) {
    // Already has voice variations
    if (choice.voiceVariations && Object.keys(choice.voiceVariations).length > 0) {
      covered++
      continue
    }

    // Has explicit archetype annotation
    if (choice.archetype && isValidArchetype(choice.archetype)) {
      covered++
      continue
    }

    // Check if archetype can be detected with confidence
    const detection = detectArchetypeWithConfidence(choice.text)
    if (detection.archetype && detection.confidence >= 0.7) {
      covered++
      continue
    }

    // This choice has a coverage gap
    gaps.push(`${choice.nodeId}:${choice.choiceId}`)
  }

  const total = choices.length
  const percentage = total > 0 ? ((covered / total) * 100).toFixed(1) : '0.0'

  return {
    characterId,
    tierTarget,
    covered,
    total,
    percentage,
    gaps
  }
}

/**
 * Check if a character meets their tier target
 */
export function meetsTargetCoverage(result: VoiceCoverageResult): boolean {
  return result.covered >= result.tierTarget
}

// ============================================================
// MIGRATION ANALYSIS
// ============================================================

/**
 * Analyze existing dialogue content for migration
 *
 * @param allChoices - All choices across all characters
 * @returns Analysis of current state and migration opportunities
 */
export function analyzeMigration(
  allChoices: Array<ChoiceData & { file: string }>
): MigrationAnalysis {
  const byArchetype: Record<TemplateArchetype | 'CUSTOM' | 'UNDETECTED', number> = {
    ASK_FOR_DETAILS: 0,
    STAY_SILENT: 0,
    ACKNOWLEDGE_EMOTION: 0,
    EXPRESS_CURIOSITY: 0,
    OFFER_SUPPORT: 0,
    CHALLENGE_ASSUMPTION: 0,
    SHOW_UNDERSTANDING: 0,
    TAKE_ACTION: 0,
    REFLECT_BACK: 0,
    SET_BOUNDARY: 0,
    MAKE_OBSERVATION: 0,
    SIMPLE_CONTINUE: 0,
    AFFIRM_CHOICE: 0,
    SHARE_PERSPECTIVE: 0,
    EXPRESS_GRATITUDE: 0,
    SEEK_CLARIFICATION: 0,
    CUSTOM: 0,
    UNDETECTED: 0
  }

  const customVariations: MigrationAnalysis['customVariations'] = []
  let choicesWithVoice = 0

  for (const choice of allChoices) {
    // Has custom voice variations
    if (choice.voiceVariations && Object.keys(choice.voiceVariations).length > 0) {
      choicesWithVoice++
      byArchetype.CUSTOM++

      customVariations.push({
        file: choice.file,
        nodeId: choice.nodeId,
        choiceId: choice.choiceId,
        text: choice.text,
        variations: choice.voiceVariations
      })
      continue
    }

    // Has explicit archetype
    if (choice.archetype && isValidArchetype(choice.archetype)) {
      choicesWithVoice++
      byArchetype[choice.archetype]++
      continue
    }

    // Try to detect archetype
    const detected = detectArchetype(choice.text)
    if (detected) {
      byArchetype[detected]++
    } else {
      byArchetype.UNDETECTED++
    }
  }

  return {
    totalChoices: allChoices.length,
    choicesWithVoice,
    byArchetype,
    customVariations
  }
}

// ============================================================
// CONTENT AUDIT
// ============================================================

/**
 * Audit result for a single choice
 */
export interface ChoiceAuditResult {
  nodeId: string
  choiceId: string
  text: string
  status: 'covered' | 'detectable' | 'needs-attention'
  detectedArchetype: TemplateArchetype | null
  confidence: number
  recommendation: string
}

/**
 * Audit all choices for a character
 */
export function auditCharacterChoices(
  characterId: VoiceCharacterId,
  choices: ChoiceData[]
): ChoiceAuditResult[] {
  return choices.map(choice => {
    const hasCustom = !!(choice.voiceVariations && Object.keys(choice.voiceVariations).length > 0)
    const hasExplicit = !!(choice.archetype && isValidArchetype(choice.archetype))

    if (hasCustom) {
      return {
        nodeId: choice.nodeId,
        choiceId: choice.choiceId,
        text: choice.text,
        status: 'covered' as const,
        detectedArchetype: null,
        confidence: 1.0,
        recommendation: 'Has custom voiceVariations'
      }
    }

    if (hasExplicit) {
      return {
        nodeId: choice.nodeId,
        choiceId: choice.choiceId,
        text: choice.text,
        status: 'covered' as const,
        detectedArchetype: choice.archetype!,
        confidence: 1.0,
        recommendation: `Explicit archetype: ${choice.archetype}`
      }
    }

    const benefit = wouldBenefitFromVoice(choice.text, false)

    if (benefit.detectedArchetype && benefit.confidence >= 0.7) {
      return {
        nodeId: choice.nodeId,
        choiceId: choice.choiceId,
        text: choice.text,
        status: 'detectable' as const,
        detectedArchetype: benefit.detectedArchetype,
        confidence: benefit.confidence,
        recommendation: `Auto-detects as ${benefit.detectedArchetype} (${(benefit.confidence * 100).toFixed(0)}%)`
      }
    }

    return {
      nodeId: choice.nodeId,
      choiceId: choice.choiceId,
      text: choice.text,
      status: 'needs-attention' as const,
      detectedArchetype: benefit.detectedArchetype,
      confidence: benefit.confidence,
      recommendation: benefit.reason
    }
  })
}

/**
 * Generate a summary report for content audit
 */
export function generateAuditSummary(
  characterId: VoiceCharacterId,
  auditResults: ChoiceAuditResult[]
): string {
  const covered = auditResults.filter(r => r.status === 'covered').length
  const detectable = auditResults.filter(r => r.status === 'detectable').length
  const needsAttention = auditResults.filter(r => r.status === 'needs-attention').length
  const total = auditResults.length
  const tierTarget = CHARACTER_TIER_TARGETS[characterId]

  let report = `Voice Coverage Audit: ${characterId}\n`
  report += `${'='.repeat(40)}\n\n`
  report += `Tier Target: ${tierTarget} variations\n`
  report += `Total Choices: ${total}\n\n`

  report += `Coverage Breakdown:\n`
  report += `  Covered (custom + explicit): ${covered} (${((covered / total) * 100).toFixed(1)}%)\n`
  report += `  Auto-detectable: ${detectable} (${((detectable / total) * 100).toFixed(1)}%)\n`
  report += `  Needs attention: ${needsAttention} (${((needsAttention / total) * 100).toFixed(1)}%)\n\n`

  report += `Effective Coverage: ${covered + detectable} / ${total} (${(((covered + detectable) / total) * 100).toFixed(1)}%)\n`

  const meetsTarget = (covered + detectable) >= tierTarget
  report += `Meets Target: ${meetsTarget ? 'YES' : 'NO'}\n\n`

  if (needsAttention > 0) {
    report += `Choices Needing Attention:\n`
    report += `-`.repeat(30) + `\n`

    for (const result of auditResults.filter(r => r.status === 'needs-attention')) {
      report += `\n${result.nodeId}:${result.choiceId}\n`
      report += `  Text: "${result.text.substring(0, 50)}${result.text.length > 50 ? '...' : ''}"\n`
      report += `  Recommendation: ${result.recommendation}\n`
    }
  }

  return report
}

// ============================================================
// ARCHETYPE DISTRIBUTION
// ============================================================

/**
 * Analyze archetype distribution across all content
 */
export function analyzeArchetypeDistribution(
  choices: Array<{ text: string; voiceVariations?: Partial<Record<PatternType, string>> }>
): Record<TemplateArchetype | 'UNDETECTED', number> {
  const distribution: Record<TemplateArchetype | 'UNDETECTED', number> = {
    ASK_FOR_DETAILS: 0,
    STAY_SILENT: 0,
    ACKNOWLEDGE_EMOTION: 0,
    EXPRESS_CURIOSITY: 0,
    OFFER_SUPPORT: 0,
    CHALLENGE_ASSUMPTION: 0,
    SHOW_UNDERSTANDING: 0,
    TAKE_ACTION: 0,
    REFLECT_BACK: 0,
    SET_BOUNDARY: 0,
    MAKE_OBSERVATION: 0,
    SIMPLE_CONTINUE: 0,
    AFFIRM_CHOICE: 0,
    SHARE_PERSPECTIVE: 0,
    EXPRESS_GRATITUDE: 0,
    SEEK_CLARIFICATION: 0,
    UNDETECTED: 0
  }

  for (const choice of choices) {
    const detected = detectArchetype(choice.text)
    if (detected) {
      distribution[detected]++
    } else {
      distribution.UNDETECTED++
    }
  }

  return distribution
}

/**
 * Get underrepresented archetypes (less than 5% of total)
 */
export function getUnderrepresentedArchetypes(
  distribution: Record<TemplateArchetype | 'UNDETECTED', number>
): TemplateArchetype[] {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0)
  const threshold = total * 0.05

  return getArchetypeNames().filter(
    archetype => distribution[archetype] < threshold
  )
}

// ============================================================
// EXPORTS FOR CLI TOOLS
// ============================================================

export {
  CHARACTER_TIER_TARGETS,
  getArchetypeNames,
  isValidArchetype
}
