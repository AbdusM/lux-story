import { describe, it, expect } from 'vitest'

import { detectReturningPlayer } from '@/lib/character-waiting'
import { GameStateUtils } from '@/lib/character-state'

describe('character-waiting', () => {
  it('computes returning-player and current-session characters from timestamps (not "ever met")', () => {
    const tNow = 1_700_000_000_000
    const sessionStart = tNow - 10_000 // session "just started"
    const lastSaved = tNow - 6 * 60 * 60 * 1000 // 6h ago (away long enough)

    const state = GameStateUtils.createNewGameState('player123')
    state.sessionStartTime = sessionStart
    state.lastSaved = lastSaved

    // Maya: visited this session
    state.characters.get('maya')!.lastInteractionTimestamp = sessionStart + 1

    // Devon: last visited before this session (should NOT count)
    state.characters.get('devon')!.lastInteractionTimestamp = sessionStart - 1

    // Samuel: "ever met" but no timestamp (should NOT count as visited this session)
    state.characters.get('samuel')!.conversationHistory.push('samuel_any_node')

    const ctx = detectReturningPlayer(state, tNow)

    expect(ctx.isReturningPlayer).toBe(true)
    expect(ctx.currentSessionCharacters.has('maya')).toBe(true)
    expect(ctx.currentSessionCharacters.has('devon')).toBe(false)
    expect(ctx.currentSessionCharacters.has('samuel')).toBe(false)
  })
})

