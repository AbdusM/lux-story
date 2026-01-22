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
import { z } from 'zod'
import { safeStorage } from './safe-storage'

// Diamond Safe Schemas
// Note: ConsequenceEchoSchema reserved for future strict validation
const _ConsequenceEchoSchema = z.object({
  text: z.string(),
}).passthrough()

const CrossCharacterEchoSchema = z.object({
  sourceCharacter: z.string(), // CharacterId
  sourceFlag: z.string(),
  targetCharacter: z.string(), // CharacterId
  delay: z.number(),
  echo: z.any(), // Allowing loose validation for the inner echo object for now to avoid circular deps or complex schema
  requiredPattern: z.object({ pattern: z.string(), minLevel: z.number() }).optional(),
  requiredTrust: z.number().optional()
})

const PendingEchoSchema = z.object({
  echo: CrossCharacterEchoSchema,
  remainingDelay: z.number(),
  triggeredAt: z.number()
})

const CrossCharacterEchoQueueStateSchema = z.object({
  pending: z.array(PendingEchoSchema),
  delivered: z.array(z.string())
})

export type PendingEcho = z.infer<typeof PendingEchoSchema>
export type CrossCharacterEchoQueueState = z.infer<typeof CrossCharacterEchoQueueStateSchema>

// ... (Interface definitions can infer from Zod or stay as is. Keeping explicit for now)
export interface CrossCharacterEcho {
  sourceCharacter: CharacterId
  sourceFlag: string
  targetCharacter: CharacterId
  delay: number
  echo: ConsequenceEcho
  requiredPattern?: { pattern: string; minLevel: number }
  requiredTrust?: number
}

// ... 

const STORAGE_KEY = 'lux-cross-character-echoes'

/**
 * Load echo queue from storage (Diamond Safe)
 */
export function loadEchoQueue(): CrossCharacterEchoQueueState {
  if (typeof window === 'undefined') {
    return { pending: [], delivered: [] }
  }

  const validated = safeStorage.getValidatedItem(STORAGE_KEY, CrossCharacterEchoQueueStateSchema)

  if (validated) {
    // Cast back to specific types if Zod inference is too loose (e.g. string vs CharacterId)
    return validated as unknown as CrossCharacterEchoQueueState
  }

  return { pending: [], delivered: [] }
}

/**
 * Save echo queue to storage (Diamond Safe)
 */
export function saveEchoQueue(queue: CrossCharacterEchoQueueState): void {
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
}

/**
 * Check if an echo has already been delivered
 */
/**
 * Check if an echo has already been delivered
 */
function echoKey(echo: { sourceFlag: string; targetCharacter: string }): string {
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
      const meetsConditions = checkEchoConditions(pending.echo as unknown as CrossCharacterEcho, gameState)

      if (meetsConditions) {
        readyEchoes.push(pending.echo.echo as ConsequenceEcho)
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
