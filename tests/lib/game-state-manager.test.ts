import { beforeEach, describe, expect, it } from 'vitest'

import { GameStateManager } from '@/lib/game-state-manager'
import { GameStateUtils } from '@/lib/character-state'
import { getSafeStart } from '@/lib/graph-registry'

describe('GameStateManager.resetConversationPosition', () => {
  beforeEach(() => {
    localStorage.clear()
  })

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

  it('returns a validated save snapshot for progression-facing surfaces', () => {
    const state = GameStateUtils.createNewGameState('test-player')
    state.pendingCheckIns = [{ characterId: 'maya', sessionsRemaining: 0, dialogueNodeId: 'maya_intro' }]

    expect(GameStateManager.saveGameState(state)).toBe(true)

    expect(GameStateManager.getSaveSnapshot()).toMatchObject({
      playerId: 'test-player',
      currentCharacterId: 'samuel',
      pendingCheckIns: [{ characterId: 'maya', sessionsRemaining: 0, dialogueNodeId: 'maya_intro' }],
    })
  })
})
