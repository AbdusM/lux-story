/**
 * Knowledge Processor
 *
 * Phase 4B: Extracted from useChoiceHandler to reduce file size.
 * Handles D-056: Knowledge Item Discovery and D-057: Info Trade Availability.
 *
 * Contract:
 * - NO setState calls
 * - NO audio triggers
 * - Returns values only (echo + localStorage writes)
 */

import type { GameState, CharacterState } from '@/lib/character-state'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import type { CharacterId } from '@/lib/graph-registry'
import { getAvailableInfoTrades } from '@/lib/trust-derivatives'
import { ALL_INFO_TRADES } from '@/content/info-trades'
import { KNOWLEDGE_ITEMS } from '@/content/knowledge-items'

export interface KnowledgeProcessorInput {
  newGameState: GameState
  previousGameState: GameState
  targetCharacterId: CharacterId
  targetCharacter: CharacterState
  /** Pre-loaded from localStorage */
  completedTrades: Set<string>
  /** Pre-loaded from localStorage */
  notifiedTrades: Set<string>
  /** Pre-loaded from localStorage */
  discoveredKnowledge: Set<string>
}

export interface KnowledgeProcessorResult {
  consequenceEcho: ConsequenceEcho | null
  /** Updated notified trades set */
  notifiedTrades: Set<string>
  /** Updated discovered knowledge set */
  discoveredKnowledge: Set<string>
  /** localStorage writes to buffer */
  localStorageWrites: Record<string, string>
  logs: Array<{ type: 'trade' | 'discovery'; data: Record<string, unknown> }>
}

/**
 * Process info trade availability and knowledge item discovery.
 */
export function processKnowledgeUpdates(
  input: KnowledgeProcessorInput,
  existingEcho: ConsequenceEcho | null
): KnowledgeProcessorResult {
  let consequenceEcho = existingEcho
  const notifiedTrades = new Set(input.notifiedTrades)
  const discoveredKnowledge = new Set(input.discoveredKnowledge)
  const localStorageWrites: Record<string, string> = {}
  const logs: KnowledgeProcessorResult['logs'] = []

  // D-057: Info Trade Availability Check
  const availableTrades = getAvailableInfoTrades(
    input.targetCharacterId,
    input.targetCharacter.trust,
    ALL_INFO_TRADES,
    input.completedTrades
  )

  // Find trades we haven't notified about yet
  const newTradeAvailable = availableTrades.find(trade => !notifiedTrades.has(trade.id))

  if (newTradeAvailable && !consequenceEcho) {
    notifiedTrades.add(newTradeAvailable.id)
    localStorageWrites['lux_notified_info_trades'] = JSON.stringify([...notifiedTrades])

    consequenceEcho = {
      text: `${input.targetCharacter.characterId} seems willing to share something: "${newTradeAvailable.description}" ${newTradeAvailable.trustCost > 0 ? `(Trust cost: ${newTradeAvailable.trustCost})` : ''}`,
      emotion: 'intrigued',
      timing: 'immediate'
    }

    logs.push({
      type: 'trade',
      data: {
        characterId: input.targetCharacterId,
        tradeId: newTradeAvailable.id,
        tier: newTradeAvailable.tier
      }
    })
  }

  // D-056: Knowledge Item Discovery Tracking
  const prevGlobalFlags = input.previousGameState?.globalFlags || new Set<string>()
  const newFlags = Array.from(input.newGameState.globalFlags).filter(flag => !prevGlobalFlags.has(flag))

  // Also check character knowledge flags
  const prevCharacterFlags = input.previousGameState?.characters.get(input.targetCharacterId)?.knowledgeFlags || new Set<string>()
  const newCharacterFlags = Array.from(input.targetCharacter.knowledgeFlags).filter(flag => !prevCharacterFlags.has(flag))

  const allNewFlags = [...newFlags, ...newCharacterFlags]

  // Find knowledge items that match newly gained flags
  for (const flag of allNewFlags) {
    const matchingItem = KNOWLEDGE_ITEMS.find(item => item.id === flag)
    if (matchingItem && !discoveredKnowledge.has(matchingItem.id)) {
      discoveredKnowledge.add(matchingItem.id)
      localStorageWrites['lux_discovered_knowledge_items'] = JSON.stringify([...discoveredKnowledge])

      // Show discovery echo if no other pending
      if (!consequenceEcho) {
        const tierEmoji = matchingItem.tier === 'truth' ? '✦' :
          matchingItem.tier === 'secret' ? '⚡' :
            matchingItem.tier === 'insight' ? '💡' : '💬'
        consequenceEcho = {
          text: `${tierEmoji} Knowledge gained: "${matchingItem.topic}"-${matchingItem.content}`,
          emotion: 'curious',
          timing: 'immediate'
        }
      }

      logs.push({
        type: 'discovery',
        data: {
          itemId: matchingItem.id,
          topic: matchingItem.topic,
          tier: matchingItem.tier,
          source: matchingItem.sourceCharacterId,
          unlocksTradesWith: matchingItem.unlocksTradesWith
        }
      })
    }
  }

  return {
    consequenceEcho,
    notifiedTrades,
    discoveredKnowledge,
    localStorageWrites,
    logs
  }
}
