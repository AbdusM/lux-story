/**
 * Evaluator Types
 *
 * Phase 4B: Type definitions for the consequence echo evaluator system.
 *
 * ARCHITECTURE:
 * - Evaluators are pure functions that compute state changes
 * - They receive a context object with all needed data
 * - They return results that the orchestrator applies
 * - NO side effects (no setState, no audio, no localStorage)
 *
 * EVALUATOR TIERS:
 * - Tier 1 (Overwrite): Can always set consequenceEcho
 * - Tier 2 (First-Match): Only sets if !consequenceEcho
 */

import type { GameState } from '@/lib/character-state'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import type { PatternType, PlayerPatterns } from '@/lib/patterns'
import type { CharacterId } from '@/lib/graph-registry'
import type { EvaluatedChoice, DialogueNode } from '@/lib/dialogue-graph'

/**
 * Context passed to all evaluators.
 * Contains everything needed to compute without side effects.
 */
export interface EvaluatorContext {
  /** Current game state (post-choice application) */
  gameState: GameState

  /** Previous game state (pre-choice) */
  previousGameState: GameState

  /** Previous patterns (for threshold detection) */
  previousPatterns: PlayerPatterns

  /** The choice that was made */
  choice: EvaluatedChoice

  /** Current dialogue node */
  currentNode: DialogueNode | null

  /** Current character being talked to */
  characterId: CharacterId

  /** Trust change from this choice */
  trustDelta: number

  /** Current timestamp */
  now: number

  /** Node ID */
  nodeId: string

  /** Choice text (for context) */
  choiceText: string

  /** Choice pattern (if any) */
  choicePattern: PatternType | undefined

  /**
   * Already-shown pattern recognition comment keys (for deduplication).
   * Format: `${characterId}_${pattern}_${threshold}`
   * Orchestrator reads from localStorage before calling, handles persistence after.
   */
  shownPatternComments: Set<string>

  /**
   * Already-shown magical realism manifestation IDs (for deduplication).
   * Orchestrator reads from localStorage before calling, handles persistence after.
   */
  shownMagicalRealisms: Set<string>
}

/**
 * Result from an evaluator.
 * Orchestrator applies these changes.
 */
export interface EvaluatorResult {
  /** Consequence echo to display (or null) */
  consequenceEcho: ConsequenceEcho | null

  /** State changes to apply */
  stateChanges?: {
    /** Global flags to add */
    addGlobalFlags?: string[]

    /** Knowledge flags to add (per character) */
    addKnowledgeFlags?: { characterId: string; flags: string[] }[]

    /** Pattern evolution to record */
    patternEvolution?: {
      pattern: PatternType
      delta: number
    }

    /** Pattern recognition comment keys to mark as shown (for persistence) */
    markPatternCommentsShown?: string[]

    /** Magical realism manifestation IDs to mark as shown (for persistence) */
    markMagicalRealismsShown?: string[]
  }

  /** Events to trigger (orchestrator handles) */
  events?: {
    /** Play audio */
    playSound?: 'trust' | 'pattern' | 'milestone' | 'identity'

    /** Show toast */
    showToast?: { message: string }

    /** Trigger UI state change */
    triggerUI?: {
      showIdentityCeremony?: PatternType
    }
  }
}

/**
 * Evaluator definition for the registry.
 */
export interface ConsequenceEvaluator {
  /** Unique identifier */
  id: string

  /** Tier determines override behavior */
  tier: 1 | 2

  /** Dependencies (must run before this) */
  dependencies: string[]

  /** Human-readable description */
  description: string

  /**
   * Evaluate function.
   * @param ctx - Full context
   * @param currentEcho - Current consequence echo (may be null)
   * @returns Result with optional echo and state changes
   */
  evaluate: (ctx: EvaluatorContext, currentEcho: ConsequenceEcho | null) => EvaluatorResult
}

/**
 * Aggregated result from running all evaluators.
 */
export interface EvaluatorPipelineResult {
  /** Final consequence echo to display */
  consequenceEcho: ConsequenceEcho | null

  /** All state changes to apply */
  stateChanges: NonNullable<EvaluatorResult['stateChanges']>[]

  /** All events to trigger */
  events: NonNullable<EvaluatorResult['events']>[]

  /** Evaluator IDs that produced echoes */
  echoSources: string[]
}
