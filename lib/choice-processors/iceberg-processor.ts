/**
 * Iceberg Processor
 *
 * Phase 4B: Extracted from useChoiceHandler to reduce file size.
 * Handles D-019: Iceberg References in dialogue node tags.
 *
 * Contract:
 * - NO setState calls
 * - NO audio triggers
 * - Returns values only (state changes + optional echo)
 */

import type { GameState } from '@/lib/character-state'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import type { DialogueNode } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'
import { recordIcebergMention, getInvestigableTopics } from '@/lib/knowledge-derivatives'

export interface IcebergProcessorInput {
  gameState: GameState
  nextNode: DialogueNode
  targetCharacterId: CharacterId
}

export interface IcebergProcessorResult {
  newGameState: GameState
  consequenceEcho: ConsequenceEcho | null
  logs: Array<{ type: 'mention' | 'investigable'; data: Record<string, unknown> }>
}

/**
 * Process iceberg references from dialogue node tags.
 * Tags prefixed with "iceberg:" indicate casual mentions of mystery topics.
 */
export function processIcebergReferences(
  input: IcebergProcessorInput,
  existingEcho: ConsequenceEcho | null
): IcebergProcessorResult {
  let newGameState = input.gameState
  let consequenceEcho = existingEcho
  const logs: IcebergProcessorResult['logs'] = []

  // Skip if no iceberg state or no tags
  if (!input.nextNode.tags || !newGameState.icebergState) {
    return { newGameState, consequenceEcho, logs }
  }

  const icebergTags = input.nextNode.tags.filter(tag => tag.startsWith('iceberg:'))
  if (icebergTags.length === 0) {
    return { newGameState, consequenceEcho, logs }
  }

  // Record previous investigable topics for comparison
  const prevInvestigable = getInvestigableTopics(newGameState.icebergState)
  const prevInvestigableIds = new Set(prevInvestigable.map(t => t.id))

  // Record each iceberg mention
  for (const tag of icebergTags) {
    const topicId = tag.replace('iceberg:', '')
    // Use first content variation's text as mention context (or node ID as fallback)
    const mentionText = input.nextNode.content[0]?.text?.substring(0, 100) || input.nextNode.nodeId
    newGameState = {
      ...newGameState,
      icebergState: recordIcebergMention(
        newGameState.icebergState!,
        topicId,
        input.targetCharacterId,
        input.nextNode.nodeId,
        mentionText
      )
    }
    logs.push({
      type: 'mention',
      data: { topicId, characterId: input.targetCharacterId, nodeId: input.nextNode.nodeId }
    })
  }

  // Check if any new topics became investigable
  if (!consequenceEcho) {
    const nowInvestigable = getInvestigableTopics(newGameState.icebergState!)
    const newlyInvestigable = nowInvestigable.filter(t => !prevInvestigableIds.has(t.id))

    if (newlyInvestigable.length > 0) {
      const topic = newlyInvestigable[0]
      consequenceEcho = {
        text: `Something clicks... "${topic.topic}"-you've heard this mentioned enough times now. Perhaps there's more to investigate.`,
        emotion: 'intrigued',
        timing: 'immediate'
      }
      logs.push({
        type: 'investigable',
        data: {
          topicId: topic.id,
          topic: topic.topic,
          investigationNodeId: topic.investigationNodeId
        }
      })
    }
  }

  return { newGameState, consequenceEcho, logs }
}
