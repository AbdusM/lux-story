/**
 * Evaluator Registry
 *
 * Phase 4B: Central registry for all consequence echo evaluators.
 *
 * ARCHITECTURE:
 * - Tier 1 evaluators can overwrite consequenceEcho
 * - Tier 2 evaluators only set if !consequenceEcho (first-match-wins)
 * - Order is stable and documented in tests/lib/evaluator-order.test.ts
 *
 * NOTE: Tier 1 evaluators remain in lib/choice-processing.ts for now.
 * This registry focuses on Tier 2 evaluators that can be purely extracted.
 */

import type { ConsequenceEvaluator, EvaluatorContext, EvaluatorPipelineResult } from './evaluator-types'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import {
  evaluateTrustAsymmetry,
  evaluateDiscoveryHint,
  evaluatePatternRecognition,
  evaluateKnowledgeCombination,
  evaluateIcebergInvestigable,
  evaluatePatternTrustGate,
  evaluateMagicalRealism,
  evaluatePatternAchievement,
  evaluateEnvironmentalEffect,
  evaluateCrossCharacterExperience,
  evaluateMetaRevelation,
} from './tier2-evaluators'

/**
 * Tier 2 Evaluator Registry
 *
 * Order matches tests/lib/evaluator-order.test.ts (IDs 10-23)
 * All dependencies on Tier 1 evaluators are implicit (they run first in useChoiceHandler)
 */
export const TIER2_EVALUATOR_REGISTRY: ConsequenceEvaluator[] = [
  // 11. patternRecognition - Character notices player pattern
  {
    id: 'patternRecognition',
    tier: 2,
    dependencies: [],
    description: 'Character notices player behavioral pattern',
    evaluate: evaluatePatternRecognition,
  },

  // 12. knowledgeCombination - Knowledge pieces combine
  {
    id: 'knowledgeCombination',
    tier: 2,
    dependencies: ['patternRecognition'],
    description: 'Knowledge pieces combine to reveal insight',
    evaluate: evaluateKnowledgeCombination,
  },

  // 13. icebergInvestigable - Iceberg topic available
  {
    id: 'icebergInvestigable',
    tier: 2,
    dependencies: ['knowledgeCombination'],
    description: 'Iceberg topic becomes investigable',
    evaluate: evaluateIcebergInvestigable,
  },

  // 14. patternTrustGate - Pattern+trust gate unlocked
  {
    id: 'patternTrustGate',
    tier: 2,
    dependencies: ['icebergInvestigable'],
    description: 'Pattern+trust gate unlocked',
    evaluate: evaluatePatternTrustGate,
  },

  // 15. magicalRealism - High pattern magical effect
  {
    id: 'magicalRealism',
    tier: 2,
    dependencies: ['patternTrustGate'],
    description: 'High pattern triggers magical effect',
    evaluate: evaluateMagicalRealism,
  },

  // 16. patternAchievement - Pattern achievement earned
  {
    id: 'patternAchievement',
    tier: 2,
    dependencies: ['magicalRealism'],
    description: 'Pattern achievement earned',
    evaluate: evaluatePatternAchievement,
  },

  // 17. environmentalEffect - Trust-based environment change
  {
    id: 'environmentalEffect',
    tier: 2,
    dependencies: ['patternAchievement'],
    description: 'Trust level changes environment',
    evaluate: evaluateEnvironmentalEffect,
  },

  // 18. crossCharacterExp - Cross-character experience available
  {
    id: 'crossCharacterExp',
    tier: 2,
    dependencies: ['environmentalEffect'],
    description: 'Cross-character experience available',
    evaluate: evaluateCrossCharacterExperience,
  },

  // 20. metaRevelation - Meta-narrative revelation
  {
    id: 'metaRevelation',
    tier: 2,
    dependencies: ['crossCharacterExp'],
    description: 'Meta-narrative revelation unlocked',
    evaluate: evaluateMetaRevelation,
  },

  // 22. discoveryHint - Vulnerability foreshadowing
  {
    id: 'discoveryHint',
    tier: 2,
    dependencies: ['metaRevelation'],
    description: 'Vulnerability foreshadowing hint',
    evaluate: evaluateDiscoveryHint,
  },

  // 23. trustAsymmetry - Character notices trust imbalance
  {
    id: 'trustAsymmetry',
    tier: 2,
    dependencies: ['discoveryHint'],
    description: 'Character notices trust imbalance',
    evaluate: evaluateTrustAsymmetry,
  },
]

/**
 * Run all Tier 2 evaluators in order.
 *
 * @param ctx - Evaluator context
 * @param initialEcho - Echo from Tier 1 evaluators (may be null)
 * @returns Pipeline result with final echo and all changes
 */
export function runTier2Evaluators(
  ctx: EvaluatorContext,
  initialEcho: ConsequenceEcho | null
): EvaluatorPipelineResult {
  let consequenceEcho = initialEcho
  const stateChanges: NonNullable<EvaluatorPipelineResult['stateChanges']> = []
  const events: NonNullable<EvaluatorPipelineResult['events']> = []
  const echoSources: string[] = []

  if (initialEcho) {
    echoSources.push('tier1')
  }

  for (const evaluator of TIER2_EVALUATOR_REGISTRY) {
    const result = evaluator.evaluate(ctx, consequenceEcho)

    // Tier 2: Only set echo if none exists
    if (result.consequenceEcho && !consequenceEcho) {
      consequenceEcho = result.consequenceEcho
      echoSources.push(evaluator.id)
    }

    // Always collect state changes and events
    if (result.stateChanges) {
      stateChanges.push(result.stateChanges)
    }
    if (result.events) {
      events.push(result.events)
    }
  }

  return {
    consequenceEcho,
    stateChanges,
    events,
    echoSources,
  }
}

/**
 * Validate evaluator dependencies (for testing).
 * Throws if circular dependencies or missing dependencies found.
 */
export function validateEvaluatorOrder(): void {
  const ids = new Set(TIER2_EVALUATOR_REGISTRY.map(e => e.id))

  for (const evaluator of TIER2_EVALUATOR_REGISTRY) {
    for (const dep of evaluator.dependencies) {
      if (!ids.has(dep)) {
        throw new Error(`Evaluator ${evaluator.id} depends on unknown evaluator: ${dep}`)
      }

      // Check order
      const depIndex = TIER2_EVALUATOR_REGISTRY.findIndex(e => e.id === dep)
      const selfIndex = TIER2_EVALUATOR_REGISTRY.findIndex(e => e.id === evaluator.id)

      if (depIndex >= selfIndex) {
        throw new Error(`Evaluator ${evaluator.id} must come after ${dep}`)
      }
    }
  }
}

// Export count for testing
export const TIER2_EVALUATOR_COUNT = TIER2_EVALUATOR_REGISTRY.length
