import { describe, expect, it } from 'vitest'

import { GameStateManager } from '@/lib/game-state-manager'
import { GameStateUtils } from '@/lib/character-state'
import { getSafeStart } from '@/lib/graph-registry'

describe('GameStateManager.resetConversationPosition', () => {
  it('returns the player to the canonical safe start instead of the legacy Samuel intro', () => {
    const state = GameStateUtils.createNewGameState('test-player')
    state.currentNodeId = 'samuel_backstory_intro'
    state.currentCharacterId = 'samuel'

    const reset = GameStateManager.resetConversationPosition(state)
    const safeStart = getSafeStart()

    expect(reset.currentNodeId).toBe(safeStart.graph.startNodeId)
    expect(reset.currentCharacterId).toBe(safeStart.characterId)
    expect(reset.currentNodeId).not.toBe('samuel_introduction')
  })
})
