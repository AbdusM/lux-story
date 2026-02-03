/**
 * Trust Calculator - Consolidated Entry Point
 *
 * Phase 3D: Single source of truth for ALL trust calculations.
 * Previously scattered across:
 * - lib/pattern-affinity.ts (resonance)
 * - lib/trust-derivatives.ts (momentum)
 * - lib/character-state.ts (application + clamping)
 * - lib/constants.ts (bounds)
 *
 * IMPORTANT: Do not calculate trust anywhere else.
 * All trust modifications MUST go through this module.
 */

import { MAX_TRUST, MIN_TRUST } from '@/lib/constants'
import { calculateResonantTrustChange } from '@/lib/pattern-affinity'
import {
  TrustMomentum,
  createTrustMomentum,
  updateTrustMomentum,
  applyMomentumToTrustChange
} from '@/lib/trust-derivatives'
import type { PatternType, PlayerPatterns } from '@/lib/patterns'

/**
 * Context for trust calculation
 */
export interface TrustContext {
  /** The character receiving the trust change */
  characterId: string

  /** Player's current patterns */
  patterns: PlayerPatterns

  /** Pattern associated with the choice (if any) */
  choicePattern?: PatternType

  /** Current trust momentum for the character */
  momentum?: TrustMomentum

  /** Whether to skip resonance calculation */
  skipResonance?: boolean

  /** Whether to skip momentum calculation */
  skipMomentum?: boolean
}

/**
 * Result of trust calculation with full breakdown
 */
export interface TrustResult {
  /** Final trust value after all modifiers */
  newTrust: number

  /** The actual change applied (after clamping) */
  actualDelta: number

  /** Updated momentum state */
  updatedMomentum: TrustMomentum

  /** Breakdown of how the final value was calculated */
  breakdown: {
    /** Base trust change from choice/action */
    base: number
    /** Resonance bonus/penalty from pattern affinity */
    resonance: number
    /** Trust after resonance (before momentum) */
    afterResonance: number
    /** Momentum multiplier effect */
    momentumEffect: number
    /** Trust after momentum (before clamping) */
    afterMomentum: number
    /** Amount clamped (0 if no clamping needed) */
    clamped: number
  }

  /** Resonance description if applicable */
  resonanceDescription?: string
}

/**
 * SINGLE ENTRY POINT for ALL trust calculations.
 *
 * @param currentTrust - The character's current trust value
 * @param baseChange - The base trust change (positive or negative)
 * @param context - Additional context for calculation
 * @returns TrustResult with final value and breakdown
 *
 * @example
 * ```typescript
 * const result = calculateTrustChange(
 *   character.trust,
 *   choice.consequence.trust, // e.g., +2
 *   {
 *     characterId: 'maya',
 *     patterns: gameState.patterns,
 *     choicePattern: 'analytical',
 *     momentum: character.trustMomentum
 *   }
 * )
 *
 * // Apply result
 * character.trust = result.newTrust
 * character.trustMomentum = result.updatedMomentum
 * ```
 */
export function calculateTrustChange(
  currentTrust: number,
  baseChange: number,
  context: TrustContext
): TrustResult {
  // Step 1: Calculate resonance bonus
  let afterResonance = baseChange
  let resonanceBonus = 0
  let resonanceDescription: string | undefined

  if (!context.skipResonance && baseChange !== 0) {
    const resonanceResult = calculateResonantTrustChange(
      baseChange,
      context.characterId,
      context.patterns as Record<PatternType, number>,
      context.choicePattern
    )
    afterResonance = resonanceResult.modifiedTrust
    resonanceBonus = afterResonance - baseChange
    resonanceDescription = resonanceResult.resonanceDescription ?? undefined
  }

  // Step 2: Apply momentum
  const currentMomentum = context.momentum || createTrustMomentum(context.characterId)
  let afterMomentum = afterResonance
  let momentumEffect = 0

  if (!context.skipMomentum) {
    afterMomentum = applyMomentumToTrustChange(afterResonance, currentMomentum)
    momentumEffect = afterMomentum - afterResonance
  }

  // Step 3: Update momentum state
  const updatedMomentum = context.skipMomentum
    ? currentMomentum
    : updateTrustMomentum(currentMomentum, afterResonance)

  // Step 4: Calculate new trust with clamping
  const unclamped = currentTrust + afterMomentum
  const newTrust = clampTrust(unclamped)
  const clamped = unclamped - newTrust

  // Step 5: Calculate actual delta (what was really applied)
  const actualDelta = newTrust - currentTrust

  return {
    newTrust,
    actualDelta,
    updatedMomentum,
    breakdown: {
      base: baseChange,
      resonance: resonanceBonus,
      afterResonance,
      momentumEffect,
      afterMomentum,
      clamped
    },
    resonanceDescription
  }
}

/**
 * Clamp trust to valid range [MIN_TRUST, MAX_TRUST]
 */
export function clampTrust(value: number): number {
  return Math.max(MIN_TRUST, Math.min(MAX_TRUST, value))
}

/**
 * Check if a trust value is at maximum
 */
export function isMaxTrust(trust: number): boolean {
  return trust >= MAX_TRUST
}

/**
 * Check if a trust value is at minimum
 */
export function isMinTrust(trust: number): boolean {
  return trust <= MIN_TRUST
}

/**
 * Get the trust bounds
 */
export const TRUST_BOUNDS = {
  MIN: MIN_TRUST,
  MAX: MAX_TRUST
} as const

/**
 * Validate that a trust value is within bounds
 */
export function isValidTrust(value: number): boolean {
  return typeof value === 'number' &&
    isFinite(value) &&
    !isNaN(value) &&
    value >= MIN_TRUST &&
    value <= MAX_TRUST
}
