/**
 * Tier 2 Evaluators - First-Match-Wins
 *
 * Phase 4B: Pure computation functions for Tier 2 consequence echo evaluators.
 * These only set consequenceEcho if none exists (first-match-wins).
 *
 * Contract:
 * - NO setState calls
 * - NO audio triggers
 * - NO localStorage access
 * - NO Zustand store access
 * - Returns values only
 *
 * NOTE: This file contains stub implementations. The actual logic remains
 * in useChoiceHandler until each evaluator is incrementally migrated.
 * This allows the registry infrastructure to be tested while avoiding
 * breaking changes.
 */

import type { EvaluatorContext, EvaluatorResult } from './evaluator-types'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import { DISCOVERY_HINTS, getDiscoveryHint } from '@/lib/consequence-echoes'
import type { AsymmetryReaction } from '@/lib/trust-derivatives'
import { analyzeTrustAsymmetry, getAsymmetryComment } from '@/lib/trust-derivatives'
import { getPatternRecognitionComments } from '@/lib/pattern-derivatives'

/**
 * Evaluator: Trust Asymmetry
 * D-005: Character notices player trusts others differently
 * 15% chance per interaction
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateTrustAsymmetry(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  // 15% chance per interaction
  if (Math.random() >= 0.15) {
    return { consequenceEcho: null }
  }

  const asymmetries = analyzeTrustAsymmetry(ctx.gameState.characters, ctx.characterId)
  const significantAsymmetry = asymmetries.find(
    a => a.asymmetry.level === 'notable' || a.asymmetry.level === 'major'
  )

  if (!significantAsymmetry) {
    return { consequenceEcho: null }
  }

  const reaction: AsymmetryReaction = significantAsymmetry.direction === 'higher'
    ? 'curiosity'
    : 'jealousy'

  const asymmetryText = getAsymmetryComment(ctx.characterId, reaction, ctx.gameState)

  if (!asymmetryText) {
    return { consequenceEcho: null }
  }

  return {
    consequenceEcho: {
      text: asymmetryText,
      timing: 'immediate',
      soundCue: undefined
    }
  }
}

/**
 * Stub evaluators for registry completeness.
 * Actual logic remains in useChoiceHandler until migrated.
 */

/**
 * Evaluator: Discovery Hint
 * Vulnerability foreshadowing for Maya/Devon
 * 20% chance per interaction, only if no other echo is active
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateDiscoveryHint(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  // Check if character has discovery hints defined
  if (!DISCOVERY_HINTS[ctx.characterId]) {
    return { consequenceEcho: null }
  }

  // 20% chance per interaction
  if (Math.random() >= 0.20) {
    return { consequenceEcho: null }
  }

  const targetCharacter = ctx.gameState.characters.get(ctx.characterId)
  if (!targetCharacter) {
    return { consequenceEcho: null }
  }

  const vulnerabilities = DISCOVERY_HINTS[ctx.characterId]
  for (const vuln of vulnerabilities) {
    // Check if vulnerability not yet discovered
    const discoveryFlag = `${ctx.characterId}_${vuln.vulnerability}_revealed`
    if (!targetCharacter.knowledgeFlags.has(discoveryFlag)) {
      const hint = getDiscoveryHint(ctx.characterId, vuln.vulnerability, targetCharacter.trust)
      if (hint) {
        return { consequenceEcho: hint }
      }
    }
  }

  return { consequenceEcho: null }
}

/**
 * Evaluator: Pattern Recognition
 * D-004: Character notices player behavioral pattern
 * Characters notice and comment on player's developed patterns
 *
 * Deduplication: Uses shownPatternComments from context (passed by orchestrator).
 * Returns markPatternCommentsShown for orchestrator to persist.
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluatePatternRecognition(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  const patternComments = getPatternRecognitionComments(
    ctx.characterId,
    ctx.gameState.patterns,
    ctx.shownPatternComments
  )

  if (patternComments.length === 0) {
    return { consequenceEcho: null }
  }

  const comment = patternComments[0]
  const commentKey = `${comment.characterId}_${comment.pattern}_${comment.threshold}`

  return {
    consequenceEcho: {
      text: `"${comment.comment}"`,
      emotion: comment.emotion,
      timing: 'immediate'
    },
    stateChanges: {
      markPatternCommentsShown: [commentKey]
    }
  }
}

export function evaluateKnowledgeCombination(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

export function evaluateIcebergInvestigable(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

export function evaluatePatternTrustGate(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

export function evaluateMagicalRealism(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

export function evaluatePatternAchievement(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

export function evaluateEnvironmentalEffect(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

export function evaluateCrossCharacterExperience(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

export function evaluateCascadeEffect(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

export function evaluateMetaRevelation(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}
