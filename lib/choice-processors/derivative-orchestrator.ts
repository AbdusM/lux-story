/**
 * Derivative Processor Orchestrator
 *
 * Phase 4B: Consolidates all derivative processor calls into a single orchestrator.
 * Reduces boilerplate by:
 * - Reading localStorage once upfront
 * - Calling processors in deterministic order
 * - Merging state changes, echoes, and localStorage writes
 *
 * Contract:
 * - Processors called in same order as original inline code
 * - NO setState calls
 * - NO audio triggers
 * - Returns consolidated result for orchestrator to apply
 */

import type { GameState, CharacterState } from '@/lib/character-state'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import type { DialogueNode } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'
import type { PatternType, PlayerPatterns } from '@/lib/patterns'
import type { EvaluatedChoice } from '@/lib/dialogue-graph'

import { processStoryArcProgression } from './story-arc-processor'
import { processSynthesisPuzzles } from './puzzle-processor'
import { processKnowledgeUpdates } from './knowledge-processor'
import { processIcebergReferences } from './iceberg-processor'
import { processArcCompletion } from './arc-completion-processor'
import { processGossipPropagation } from './gossip-propagation-processor'
import { runTier2Evaluators, type EvaluatorContext } from '@/lib/evaluators'
import { isEnabled } from '@/lib/feature-flags'
import {
  loadEchoQueue,
  saveEchoQueue,
  getAndUpdateEchosForCharacter,
} from '@/lib/cross-character-memory'
import {
  getReadyGiftsForCharacter,
  consumeGift,
  type DelayedGift,
} from '@/lib/delayed-gifts'

/**
 * Pre-read localStorage snapshot to avoid repeated window checks
 */
export interface LocalStorageSnapshot {
  completedPuzzles: Set<string>
  hintsShown: Set<string>
  completedTrades: Set<string>
  notifiedTrades: Set<string>
  discoveredKnowledge: Set<string>
  shownPatternComments: Set<string>
  shownMagicalRealisms: Set<string>
}

/**
 * Read all localStorage values needed by processors once upfront
 */
export function readLocalStorageSnapshot(): LocalStorageSnapshot {
  const isClient = typeof window !== 'undefined'

  const parseSet = (key: string): Set<string> => {
    if (!isClient) return new Set()
    const raw = localStorage.getItem(key)
    return new Set<string>(raw ? JSON.parse(raw) : [])
  }

  return {
    completedPuzzles: parseSet('lux_completed_synthesis_puzzles'),
    hintsShown: parseSet('lux_synthesis_hints_shown'),
    completedTrades: parseSet('lux_completed_info_trades'),
    notifiedTrades: parseSet('lux_notified_info_trades'),
    discoveredKnowledge: parseSet('lux_discovered_knowledge_items'),
    shownPatternComments: parseSet('lux_pattern_recognition_shown'),
    shownMagicalRealisms: parseSet('lux_magical_realism_shown'),
  }
}

/**
 * Context passed to the derivative orchestrator
 */
export interface DerivativeOrchestratorContext {
  /** Current game state (post-choice, pre-derivatives) */
  gameState: GameState
  /** Previous game state (pre-choice) */
  previousGameState: GameState
  /** Previous patterns (for threshold detection) */
  previousPatterns: PlayerPatterns
  /** The choice that was made */
  choice: EvaluatedChoice
  /** Next dialogue node */
  nextNode: DialogueNode
  /** Target character ID */
  targetCharacterId: CharacterId
  /** Target character state */
  targetCharacter: CharacterState
  /** Trust delta from this choice */
  trustDelta: number
  /** Pre-read localStorage snapshot */
  localStorage: LocalStorageSnapshot
  /** Existing consequence echo (from Tier 1 evaluators) */
  existingEcho: ConsequenceEcho | null
}

/**
 * Log entry from processors
 */
export interface ProcessorLog {
  processor: string
  type: string
  data: Record<string, unknown>
}

/**
 * Result from running all derivative processors
 */
export interface DerivativeOrchestratorResult {
  /** Updated game state */
  newGameState: GameState
  /** Final consequence echo (may be from any processor) */
  consequenceEcho: ConsequenceEcho | null
  /** localStorage writes to buffer */
  localStorageWrites: Record<string, string>
  /** All processor logs */
  logs: ProcessorLog[]
  /** Delivered pending gift (if any) */
  pendingGift: DelayedGift | null
  /** Arc completion result (for bonus orbs) */
  arcCompletion: {
    completedArc: CharacterId | null
    dominantPattern: PatternType | null
    bonusOrbAmount: number
  }
}

/**
 * Run all derivative processors in deterministic order.
 * Order matches original inline code in useChoiceHandler.
 *
 * Processing order:
 * 1. Story Arc Progression (D-061)
 * 2. Synthesis Puzzles (D-083)
 * 3. Knowledge Discovery & Info Trade (D-056/D-057)
 * 4. Cross-Character Echoes
 * 5. Tier 2 Evaluator Registry
 * 6. Iceberg References (D-019)
 * 7. Delayed Gifts
 * 8. Arc Completion
 * 9. Gossip Propagation (V1)
 */
export function runAllDerivativeProcessors(
  ctx: DerivativeOrchestratorContext
): DerivativeOrchestratorResult {
  let newGameState = ctx.gameState
  let consequenceEcho = ctx.existingEcho
  const localStorageWrites: Record<string, string> = {}
  const logs: ProcessorLog[] = []
  let pendingGift: DelayedGift | null = null

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. STORY ARC PROGRESSION (D-061)
  // ═══════════════════════════════════════════════════════════════════════════
  const storyArcResult = processStoryArcProgression(
    {
      gameState: newGameState,
      nextNode: ctx.nextNode,
      targetCharacterId: ctx.targetCharacterId,
      currentConversationHistory: ctx.targetCharacter.conversationHistory,
    },
    consequenceEcho
  )
  newGameState = storyArcResult.newGameState
  if (storyArcResult.consequenceEcho && !consequenceEcho) {
    consequenceEcho = storyArcResult.consequenceEcho
  }
  for (const log of storyArcResult.logs) {
    logs.push({ processor: 'storyArc', type: log.type, data: log.data })
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. SYNTHESIS PUZZLES (D-083)
  // ═══════════════════════════════════════════════════════════════════════════
  const puzzleResult = processSynthesisPuzzles(
    {
      gameState: newGameState,
      completedPuzzles: ctx.localStorage.completedPuzzles,
      hintsShown: ctx.localStorage.hintsShown,
    },
    consequenceEcho
  )
  newGameState = puzzleResult.newGameState
  if (puzzleResult.consequenceEcho && !consequenceEcho) {
    consequenceEcho = puzzleResult.consequenceEcho
  }
  Object.assign(localStorageWrites, puzzleResult.localStorageWrites)
  for (const log of puzzleResult.logs) {
    logs.push({ processor: 'puzzle', type: log.type, data: { puzzleId: log.puzzleId, ...log.data } })
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. KNOWLEDGE DISCOVERY & INFO TRADE (D-056/D-057)
  // ═══════════════════════════════════════════════════════════════════════════
  const knowledgeResult = processKnowledgeUpdates(
    {
      newGameState,
      previousGameState: ctx.previousGameState,
      targetCharacterId: ctx.targetCharacterId,
      targetCharacter: ctx.targetCharacter,
      completedTrades: ctx.localStorage.completedTrades,
      notifiedTrades: ctx.localStorage.notifiedTrades,
      discoveredKnowledge: ctx.localStorage.discoveredKnowledge,
    },
    consequenceEcho
  )
  if (knowledgeResult.consequenceEcho && !consequenceEcho) {
    consequenceEcho = knowledgeResult.consequenceEcho
  }
  Object.assign(localStorageWrites, knowledgeResult.localStorageWrites)
  for (const log of knowledgeResult.logs) {
    logs.push({ processor: 'knowledge', type: log.type, data: log.data })
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CROSS-CHARACTER ECHOES
  // ═══════════════════════════════════════════════════════════════════════════
  if (!consequenceEcho) {
    const echoQueue = loadEchoQueue()
    const { echoes: crossEchoes, updatedQueue } = getAndUpdateEchosForCharacter(
      ctx.targetCharacterId,
      newGameState,
      echoQueue
    )
    if (crossEchoes.length > 0) {
      consequenceEcho = crossEchoes[0]
      saveEchoQueue(updatedQueue)
      logs.push({
        processor: 'crossCharacter',
        type: 'echo',
        data: { targetCharacter: ctx.targetCharacterId, echoText: consequenceEcho.text.substring(0, 50) }
      })
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. TIER 2 EVALUATOR REGISTRY
  // ═══════════════════════════════════════════════════════════════════════════
  const shownPatternComments = new Set(ctx.localStorage.shownPatternComments)
  const shownMagicalRealisms = new Set(ctx.localStorage.shownMagicalRealisms)

  if (!consequenceEcho) {
    const evaluatorCtx: EvaluatorContext = {
      gameState: newGameState,
      previousGameState: ctx.previousGameState,
      previousPatterns: ctx.previousPatterns,
      choice: ctx.choice,
      currentNode: ctx.nextNode,
      characterId: ctx.targetCharacterId,
      trustDelta: ctx.trustDelta,
      now: Date.now(),
      nodeId: ctx.nextNode.nodeId,
      choiceText: ctx.choice.choice.text,
      choicePattern: ctx.choice.choice.pattern as PatternType | undefined,
      shownPatternComments,
      shownMagicalRealisms,
    }

    const tier2Result = runTier2Evaluators(evaluatorCtx, consequenceEcho)

    if (tier2Result.consequenceEcho) {
      consequenceEcho = tier2Result.consequenceEcho
      logs.push({
        processor: 'tier2Registry',
        type: 'echo',
        data: { sources: tier2Result.echoSources, echoText: consequenceEcho.text.substring(0, 50) }
      })
    }

    // Apply state changes from evaluators
    for (const changes of tier2Result.stateChanges) {
      if (changes.addGlobalFlags) {
        for (const flag of changes.addGlobalFlags) {
          newGameState.globalFlags.add(flag)
        }
      }
      if (changes.markPatternCommentsShown) {
        for (const key of changes.markPatternCommentsShown) {
          shownPatternComments.add(key)
        }
        localStorageWrites['lux_pattern_recognition_shown'] = JSON.stringify([...shownPatternComments])
      }
      if (changes.markMagicalRealismsShown) {
        for (const id of changes.markMagicalRealismsShown) {
          shownMagicalRealisms.add(id)
        }
        localStorageWrites['lux_magical_realism_shown'] = JSON.stringify([...shownMagicalRealisms])
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. ICEBERG REFERENCES (D-019)
  // ═══════════════════════════════════════════════════════════════════════════
  const icebergResult = processIcebergReferences(
    { gameState: newGameState, nextNode: ctx.nextNode, targetCharacterId: ctx.targetCharacterId },
    consequenceEcho
  )
  newGameState = icebergResult.newGameState
  if (icebergResult.consequenceEcho && !consequenceEcho) {
    consequenceEcho = icebergResult.consequenceEcho
  }
  for (const log of icebergResult.logs) {
    logs.push({ processor: 'iceberg', type: log.type, data: log.data })
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. DELAYED GIFTS
  // ═══════════════════════════════════════════════════════════════════════════
  if (!consequenceEcho) {
    const readyGifts = getReadyGiftsForCharacter(ctx.targetCharacterId)
    if (readyGifts.length > 0) {
      pendingGift = readyGifts[0]
      let giftText = `"${pendingGift.content.text}"`
      if (pendingGift.giftContext?.sourceChoiceText) {
        const shortText = pendingGift.giftContext.sourceChoiceText.length > 50
          ? pendingGift.giftContext.sourceChoiceText.substring(0, 47) + '...'
          : pendingGift.giftContext.sourceChoiceText
        giftText += `\n\n(Recall: "${shortText}")`
      }

      consequenceEcho = {
        text: giftText,
        emotion: pendingGift.content.emotion || 'knowing',
        timing: 'immediate' as const
      }
      consumeGift(pendingGift.id)
      logs.push({
        processor: 'delayedGift',
        type: 'delivery',
        data: {
          giftId: pendingGift.id,
          sourceCharacter: pendingGift.sourceCharacter,
          targetCharacter: pendingGift.targetCharacter,
          giftType: pendingGift.giftType
        }
      })
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. ARC COMPLETION
  // ═══════════════════════════════════════════════════════════════════════════
  const arcCompletionResult = processArcCompletion({
    previousGameState: ctx.previousGameState,
    newGameState,
  })
  for (const log of arcCompletionResult.logs) {
    logs.push({ processor: 'arcCompletion', type: log.type, data: log.data })
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. GOSSIP PROPAGATION (V1)
  // ═══════════════════════════════════════════════════════════════════════════
  try {
    if (isEnabled('GOSSIP_PROPAGATION_V1')) {
      const gossipResult = processGossipPropagation({
        newGameState,
        sourceCharacterId: ctx.previousGameState.currentCharacterId,
        trustDelta: ctx.trustDelta,
      })
      for (const log of gossipResult.logs) {
        logs.push({ processor: 'gossip', type: log.type, data: log.data })
      }
    }
  } catch {
    // Gossip should never break core derivatives.
  }

  return {
    newGameState,
    consequenceEcho,
    localStorageWrites,
    logs,
    pendingGift,
    arcCompletion: {
      completedArc: arcCompletionResult.completedArc,
      dominantPattern: arcCompletionResult.dominantPattern,
      bonusOrbAmount: arcCompletionResult.bonusOrbAmount,
    },
  }
}
