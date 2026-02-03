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
import type { AsymmetryReaction } from '@/lib/trust-derivatives'
import { analyzeTrustAsymmetry, getAsymmetryComment } from '@/lib/trust-derivatives'

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

export function evaluateDiscoveryHint(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

export function evaluatePatternRecognition(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
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
