/**
 * Cross-Character Memory System
 *
 * Lux Story 2.0 - The Consequence Web
 *
 * Characters reference player's relationships with others through dialogue.
 * When an arc completes, "gossip echoes" queue for other characters.
 * Samuel serves as primary conduit: "Devon mentioned you..."
 *
 * Philosophy: The station remembers. Characters talk. You are the subject.
 */

import type { CharacterId } from './graph-registry'
import type { GameState } from './character-state'
import type { ConsequenceEcho } from './consequence-echoes'

/**
 * A cross-character echo - one character references another character's
 * relationship with the player.
 */
export interface CrossCharacterEcho {
  /** Character who completed the arc */
  sourceCharacter: CharacterId
  /** Flag that triggers this echo (e.g., 'maya_arc_complete') */
  sourceFlag: string
  /** Character who delivers the echo */
  targetCharacter: CharacterId
  /** Interactions before surfacing (0 = immediate, 1+ = delayed) */
  delay: number
  /** The actual echo content */
  echo: ConsequenceEcho
  /** Optional: Only show if player has this pattern */
  requiredPattern?: { pattern: string; minLevel: number }
  /** Optional: Only show if trust with target is at least this */
  requiredTrust?: number
}

/**
 * Pending echo in the queue - tracks remaining delay
 */
interface PendingEcho {
  echo: CrossCharacterEcho
  remainingDelay: number
  triggeredAt: number // timestamp
}

/**
 * Cross-character echo queue state
 * Stored in localStorage alongside game state
 */
export interface CrossCharacterEchoQueueState {
  pending: PendingEcho[]
  delivered: string[] // sourceFlag + targetCharacter combos already shown
}

const STORAGE_KEY = 'lux-cross-character-echoes'

/**
 * Load echo queue from storage
 */
export function loadEchoQueue(): CrossCharacterEchoQueueState {
  if (typeof window === 'undefined') {
    return { pending: [], delivered: [] }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn('[CrossCharacterMemory] Failed to load echo queue:', e)
  }

  return { pending: [], delivered: [] }
}

/**
 * Save echo queue to storage
 */
export function saveEchoQueue(queue: CrossCharacterEchoQueueState): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  } catch (e) {
    console.warn('[CrossCharacterMemory] Failed to save echo queue:', e)
  }
}

/**
 * Check if an echo has already been delivered
 */
function echoKey(echo: CrossCharacterEcho): string {
  return `${echo.sourceFlag}:${echo.targetCharacter}`
}

/**
 * Queue new echoes when a flag is set
 * Called when globalFlags change (e.g., arc completion)
 */
export function queueEchosForFlag(
  flag: string,
  echoes: CrossCharacterEcho[],
  queue: CrossCharacterEchoQueueState
): CrossCharacterEchoQueueState {
  const relevantEchoes = echoes.filter(e => e.sourceFlag === flag)
  const newPending: PendingEcho[] = []

  for (const echo of relevantEchoes) {
    const key = echoKey(echo)

    // Skip if already delivered
    if (queue.delivered.includes(key)) continue

    // Skip if already pending
    if (queue.pending.some(p => echoKey(p.echo) === key)) continue

    newPending.push({
      echo,
      remainingDelay: echo.delay,
      triggeredAt: Date.now()
    })
  }

  if (newPending.length > 0) {
    console.log(`[CrossCharacterMemory] Queued ${newPending.length} echoes for flag: ${flag}`)
  }

  return {
    ...queue,
    pending: [...queue.pending, ...newPending]
  }
}

/**
 * Get ready echoes for a character and decrement delays for others
 * Called when entering a new node with a character
 */
export function getAndUpdateEchosForCharacter(
  characterId: CharacterId,
  gameState: GameState,
  queue: CrossCharacterEchoQueueState
): {
  echoes: ConsequenceEcho[]
  updatedQueue: CrossCharacterEchoQueueState
} {
  const readyEchoes: ConsequenceEcho[] = []
  const stillPending: PendingEcho[] = []
  const newDelivered: string[] = [...queue.delivered]

  for (const pending of queue.pending) {
    const isForThisCharacter = pending.echo.targetCharacter === characterId

    if (isForThisCharacter && pending.remainingDelay <= 0) {
      // Check conditions
      const meetsConditions = checkEchoConditions(pending.echo, gameState)

      if (meetsConditions) {
        readyEchoes.push(pending.echo.echo)
        newDelivered.push(echoKey(pending.echo))
        console.log(`[CrossCharacterMemory] Delivering echo from ${pending.echo.sourceCharacter} via ${characterId}`)
      } else {
        // Conditions not met, keep waiting
        stillPending.push(pending)
      }
    } else if (isForThisCharacter) {
      // Decrement delay for this character's echoes
      stillPending.push({
        ...pending,
        remainingDelay: pending.remainingDelay - 1
      })
    } else {
      // Not for this character, keep as-is
      stillPending.push(pending)
    }
  }

  return {
    echoes: readyEchoes,
    updatedQueue: {
      pending: stillPending,
      delivered: newDelivered
    }
  }
}

/**
 * Check if echo conditions are met
 */
function checkEchoConditions(echo: CrossCharacterEcho, gameState: GameState): boolean {
  // Check pattern requirement
  if (echo.requiredPattern) {
    const { pattern, minLevel } = echo.requiredPattern
    const playerLevel = gameState.patterns[pattern as keyof typeof gameState.patterns] || 0
    if (playerLevel < minLevel) return false
  }

  // Check trust requirement
  if (echo.requiredTrust !== undefined) {
    const character = gameState.characters.get(echo.targetCharacter)
    if (!character || character.trust < echo.requiredTrust) return false
  }

  return true
}

/**
 * Reset echo queue (for new game)
 */
export function resetEchoQueue(): void {
  saveEchoQueue({ pending: [], delivered: [] })
}

/**
 * Debug: Get queue stats
 */
export function getEchoQueueStats(): {
  pendingCount: number
  deliveredCount: number
  pendingByCharacter: Record<string, number>
} {
  const queue = loadEchoQueue()
  const byCharacter: Record<string, number> = {}

  for (const pending of queue.pending) {
    const target = pending.echo.targetCharacter
    byCharacter[target] = (byCharacter[target] || 0) + 1
  }

  return {
    pendingCount: queue.pending.length,
    deliveredCount: queue.delivered.length,
    pendingByCharacter: byCharacter
  }
}
