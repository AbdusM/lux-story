/**
 * Gossip Propagation Processor (V1)
 *
 * Goal: make the station feel like a community by queueing a small number of
 * cross-character "heard about you" echoes after meaningful interactions.
 *
 * Design constraints:
 * - Deterministic (no Math.random)
 * - Debt-controlled (bounded fanout)
 * - Safe: queues only when the relevant characters exist in state
 */

import type { GameState } from '@/lib/character-state'
import type { CharacterId } from '@/lib/graph-registry'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import { CHARACTER_RELATIONSHIP_WEB } from '@/lib/character-relationships'
import { characterNames } from '@/lib/game-interface-types'
import { loadEchoQueue, saveEchoQueue, queueEchosForFlag, type CrossCharacterEcho } from '@/lib/cross-character-memory'

export interface GossipPropagationInput {
  newGameState: GameState
  sourceCharacterId: CharacterId
  trustDelta: number
}

export interface GossipPropagationResult {
  queued: number
  logs: Array<{ type: 'queued' | 'skipped'; data: Record<string, unknown> }>
}

function hasMet(gameState: GameState, characterId: string): boolean {
  const c = gameState.characters.get(characterId)
  return (c?.conversationHistory?.length ?? 0) > 0
}

function buildEchoText(sourceId: CharacterId): string {
  const sourceName = characterNames[sourceId] ?? sourceId
  return `"${sourceName} mentioned you."`
}

/**
 * Queue small "gossip" echoes for future delivery by the cross-character memory system.
 */
export function processGossipPropagation(input: GossipPropagationInput): GossipPropagationResult {
  const logs: GossipPropagationResult['logs'] = []

  // Only propagate on positive interactions; avoid noise.
  if (input.trustDelta <= 0) {
    logs.push({ type: 'skipped', data: { reason: 'trustDelta<=0' } })
    return { queued: 0, logs }
  }

  const source = input.sourceCharacterId

  // Build a deterministic, bounded target list.
  const candidateTargets: CharacterId[] = []

  // Always queue to Samuel when possible (hub conduit), unless Samuel is the source.
  if (source !== 'samuel' && input.newGameState.characters.has('samuel') && hasMet(input.newGameState, 'samuel')) {
    candidateTargets.push('samuel')
  }

  const edges = CHARACTER_RELATIONSHIP_WEB
    .filter(e => e.fromCharacterId === source)
    .slice()
    .sort((a, b) => {
      if (a.intensity !== b.intensity) return b.intensity - a.intensity
      return String(a.toCharacterId).localeCompare(String(b.toCharacterId))
    })

  for (const e of edges) {
    const to = e.toCharacterId as CharacterId
    if (to === source) continue
    if (!input.newGameState.characters.has(to)) continue
    if (!hasMet(input.newGameState, to)) continue
    if (!candidateTargets.includes(to)) candidateTargets.push(to)
    if (candidateTargets.length >= 2) break
  }

  if (candidateTargets.length === 0) {
    logs.push({ type: 'skipped', data: { reason: 'no_targets' } })
    return { queued: 0, logs }
  }

  const now = Date.now()
  const sourceFlag = `gossip_v1:${source}`
  const echo: ConsequenceEcho = {
    text: buildEchoText(source),
    emotion: 'knowing',
    timing: 'immediate',
  }

  const procedural: CrossCharacterEcho[] = candidateTargets.map((target) => ({
    sourceCharacter: source,
    sourceFlag,
    targetCharacter: target,
    delay: 1,
    echo,
    requiredTrust: 3,
  }))

  const queue = loadEchoQueue()
  const updated = queueEchosForFlag(sourceFlag, procedural, queue)
  saveEchoQueue(updated)

  logs.push({ type: 'queued', data: { source, targets: candidateTargets, sourceFlag, at: now } })
  return { queued: candidateTargets.length, logs }
}

