/**
 * Evaluators Module
 *
 * Phase 4B: Consequence echo evaluator system.
 *
 * USAGE:
 * ```typescript
 * import { runTier2Evaluators, type EvaluatorContext } from '@/lib/evaluators'
 *
 * const ctx: EvaluatorContext = { ... }
 * const tier1Echo = computeTrustFeedback(...).consequenceEcho
 * const result = runTier2Evaluators(ctx, tier1Echo)
 * ```
 */

export * from './evaluator-types'
export * from './evaluator-registry'
export * from './tier2-evaluators'
