import { describe, it, expect } from 'vitest'
import { deriveDerivedState } from '@/lib/game-store'
import type { SerializableGameState } from '@/lib/character-state'

function makeCore(characters: Array<{ characterId: string; conversationHistory: string[] }>): SerializableGameState {
  return {
    characters: characters.map(c => ({
      characterId: c.characterId,
      trust: 0,
      anxiety: 0,
      nervousSystemState: 'ventral_vagal' as const,
      lastReaction: null,
      knowledgeFlags: [],
      relationshipStatus: 'stranger' as const,
      conversationHistory: c.conversationHistory,
    })),
  } as unknown as SerializableGameState
}

describe('deriveDerivedState', () => {
  it('returns empty visitedScenes for no characters', () => {
    const result = deriveDerivedState(makeCore([]))
    expect(result.visitedScenes).toEqual([])
  })

  it('collects unique nodeIds from conversation history', () => {
    const result = deriveDerivedState(makeCore([
      { characterId: 'samuel', conversationHistory: ['node_a', 'node_b', 'node_a'] },
    ]))
    expect(result.visitedScenes).toEqual(['node_a', 'node_b'])
  })

  it('deduplicates across characters', () => {
    const result = deriveDerivedState(makeCore([
      { characterId: 'samuel', conversationHistory: ['node_a', 'node_b'] },
      { characterId: 'maya', conversationHistory: ['node_b', 'node_c'] },
    ]))
    expect(result.visitedScenes).toEqual(['node_a', 'node_b', 'node_c'])
  })
})
