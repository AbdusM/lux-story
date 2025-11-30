/**
 * Floating Module Evaluator
 *
 * Evaluates which floating modules should trigger based on game state.
 * Tracks which modules have already been shown to support oneShot behavior.
 */

import { GameState } from './character-state'
import { FloatingModule, StateConditionEvaluator } from './dialogue-graph'
import { FLOATING_MODULES, getModulesForInsertPoint } from '@/content/floating-modules'

/**
 * Result of evaluating floating modules
 */
export interface ModuleEvaluationResult {
  /** Module that should be shown, if any */
  module: FloatingModule | null
  /** Whether this triggers a pattern threshold moment */
  isPatternThreshold: boolean
  /** The pattern that crossed threshold, if applicable */
  thresholdPattern?: string
}

/**
 * Evaluates and manages floating module triggers
 */
export class FloatingModuleEvaluator {
  /**
   * Check for modules that should trigger at a given insertion point
   *
   * @param insertAfter - The type of insertion point (arc_transition, hub_return, etc.)
   * @param gameState - Current game state
   * @param triggeredModules - Set of module IDs that have already been shown
   * @param previousPatterns - Pattern values before the last choice (for threshold detection)
   * @returns The highest priority module that should trigger, if any
   */
  static evaluateModules(
    insertAfter: FloatingModule['insertAfter'],
    gameState: GameState,
    triggeredModules: Set<string>,
    previousPatterns?: GameState['patterns']
  ): ModuleEvaluationResult {
    // Get modules for this insertion point, sorted by priority
    const candidates = getModulesForInsertPoint(insertAfter)

    for (const floatingMod of candidates) {
      // Skip if oneShot and already triggered
      if (floatingMod.oneShot && triggeredModules.has(floatingMod.moduleId)) {
        continue
      }

      // Check if trigger condition is met
      const conditionMet = StateConditionEvaluator.evaluate(
        floatingMod.triggerCondition,
        gameState
      )

      if (!conditionMet) {
        continue
      }

      // For pattern_threshold modules, verify a threshold was actually crossed
      if (insertAfter === 'pattern_threshold' && previousPatterns) {
        const thresholdCrossed = this.checkPatternThresholdCrossed(
          floatingMod,
          gameState,
          previousPatterns
        )

        if (thresholdCrossed) {
          return {
            module: floatingMod,
            isPatternThreshold: true,
            thresholdPattern: thresholdCrossed
          }
        }
        continue
      }

      // Module qualifies
      return {
        module: floatingMod,
        isPatternThreshold: false
      }
    }

    return { module: null, isPatternThreshold: false }
  }

  /**
   * Check if a pattern threshold was crossed between previous and current state
   */
  private static checkPatternThresholdCrossed(
    module: FloatingModule,
    gameState: GameState,
    previousPatterns: GameState['patterns']
  ): string | null {
    const condition = module.triggerCondition

    if (!condition.patterns) {
      return null
    }

    // Check each pattern in the condition
    for (const [patternName, range] of Object.entries(condition.patterns)) {
      if (!range?.min) continue

      const previousValue = previousPatterns[patternName as keyof typeof previousPatterns] || 0
      const currentValue = gameState.patterns[patternName as keyof typeof gameState.patterns] || 0

      // Threshold crossed if: previous < min AND current >= min
      if (previousValue < range.min && currentValue >= range.min) {
        return patternName
      }
    }

    return null
  }

  /**
   * Get all modules that would currently qualify (for debugging/preview)
   */
  static getQualifyingModules(
    gameState: GameState,
    triggeredModules: Set<string>
  ): FloatingModule[] {
    const qualifying: FloatingModule[] = []

    for (const floatingMod of FLOATING_MODULES) {
      // Skip if oneShot and already triggered
      if (floatingMod.oneShot && triggeredModules.has(floatingMod.moduleId)) {
        continue
      }

      // Check if trigger condition is met
      const conditionMet = StateConditionEvaluator.evaluate(
        floatingMod.triggerCondition,
        gameState
      )

      if (conditionMet) {
        qualifying.push(floatingMod)
      }
    }

    return qualifying.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  /**
   * Check for pattern threshold modules specifically
   * Called after every choice that might change patterns
   */
  static checkPatternThresholds(
    gameState: GameState,
    previousPatterns: GameState['patterns'],
    triggeredModules: Set<string>
  ): ModuleEvaluationResult {
    return this.evaluateModules(
      'pattern_threshold',
      gameState,
      triggeredModules,
      previousPatterns
    )
  }

  /**
   * Check for hub return modules
   * Called when returning to Samuel hub
   */
  static checkHubReturnModules(
    gameState: GameState,
    triggeredModules: Set<string>
  ): ModuleEvaluationResult {
    return this.evaluateModules('hub_return', gameState, triggeredModules)
  }

  /**
   * Check for arc transition modules
   * Called when transitioning between character arcs
   */
  static checkArcTransitionModules(
    gameState: GameState,
    triggeredModules: Set<string>
  ): ModuleEvaluationResult {
    return this.evaluateModules('arc_transition', gameState, triggeredModules)
  }
}
