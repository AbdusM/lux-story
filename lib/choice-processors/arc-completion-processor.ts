/**
 * Arc Completion Processor
 *
 * Phase 4B: Extracted from useChoiceHandler to reduce file size.
 * Handles arc completion rewards (bonus orbs, echoes, gifts).
 *
 * Contract:
 * - NO setState calls
 * - NO audio triggers
 * - Returns values only (actions to take)
 */

import type { GameState } from '@/lib/character-state'
import type { CharacterId } from '@/lib/graph-registry'
import type { PatternType } from '@/lib/patterns'
import { isValidPattern } from '@/lib/patterns'
import { getArcCompletionFlag, detectArcCompletion } from '@/lib/arc-learning-objectives'
import {
  loadEchoQueue,
  saveEchoQueue,
  queueEchosForFlag,
} from '@/lib/cross-character-memory'
import { CROSS_CHARACTER_ECHOES } from '@/lib/cross-character-echoes'
import {
  queueGiftsForArcComplete,
  type DelayedGift,
} from '@/lib/delayed-gifts'

export interface ArcCompletionInput {
  previousGameState: GameState
  newGameState: GameState
}

export interface ArcCompletionResult {
  /** Character ID of completed arc, or null if no completion */
  completedArc: CharacterId | null
  /** Dominant pattern to award bonus orbs for */
  dominantPattern: PatternType | null
  /** Number of bonus orbs to award */
  bonusOrbAmount: number
  /** Queued gifts for other characters */
  queuedGifts: DelayedGift[]
  logs: Array<{ type: 'completion' | 'echoes' | 'gifts'; data: Record<string, unknown> }>
}

/**
 * Process arc completion rewards and queue cross-character effects.
 */
export function processArcCompletion(
  input: ArcCompletionInput
): ArcCompletionResult {
  const logs: ArcCompletionResult['logs'] = []

  const completedArc = detectArcCompletion(input.previousGameState, input.newGameState)

  if (!completedArc) {
    return {
      completedArc: null,
      dominantPattern: null,
      bonusOrbAmount: 0,
      queuedGifts: [],
      logs
    }
  }

  // Calculate dominant pattern for bonus orbs
  const patterns = input.newGameState.patterns
  const patternEntries = Object.entries(patterns) as [PatternType, number][]
  const dominantEntry = patternEntries.reduce((max, curr) =>
    curr[1] > max[1] ? curr : max, patternEntries[0])

  const dominantPattern = isValidPattern(dominantEntry?.[0]) ? dominantEntry[0] : null

  logs.push({
    type: 'completion',
    data: { completedArc, dominantPattern }
  })

  // Queue cross-character echoes for this arc completion
  const arcFlag = getArcCompletionFlag(completedArc)
  const currentQueue = loadEchoQueue()
  const updatedQueue = queueEchosForFlag(arcFlag, CROSS_CHARACTER_ECHOES, currentQueue)
  saveEchoQueue(updatedQueue)

  logs.push({
    type: 'echoes',
    data: { completedArc, arcFlag }
  })

  // Queue delayed gifts for arc completion
  const queuedGifts = queueGiftsForArcComplete(completedArc as CharacterId)
  if (queuedGifts.length > 0) {
    logs.push({
      type: 'gifts',
      data: {
        completedArc,
        giftCount: queuedGifts.length,
        targets: queuedGifts.map(g => g.targetCharacter)
      }
    })
  }

  return {
    completedArc: completedArc as CharacterId,
    dominantPattern,
    bonusOrbAmount: 5, // ORB_EARNINGS.arcCompletion
    queuedGifts,
    logs
  }
}
