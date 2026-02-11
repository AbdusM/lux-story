import { describe, expect, it } from 'vitest'

import { detectReturningPlayer } from '@/lib/character-waiting'

function makeGameState(overrides: Partial<any> = {}): any {
  return {
    lastSaved: 0,
    sessionStartTime: 0,
    characters: new Map(),
    ...overrides,
  }
}

describe('character-waiting', () => {
  it('does not treat legacy conversationHistory as "visited this session" when timestamp is before session start', () => {
    const now = 1_000_000_000
    const sessionStartTime = now
    const lastSaved = now - 5 * 60 * 60 * 1000 // 5h ago

    const characters = new Map<string, any>([
      ['maya', { conversationHistory: ['maya_intro'], lastInteractionTimestamp: now - 10 * 60 * 60 * 1000 }],
    ])

    const ctx = detectReturningPlayer(
      makeGameState({ lastSaved, sessionStartTime, characters }) as any,
      sessionStartTime + 1000
    )

    expect(ctx.currentSessionCharacters.has('maya')).toBe(false)
  })

  it('treats lastInteractionTimestamp >= sessionStartTime as "visited this session"', () => {
    const now = 2_000_000_000
    const sessionStartTime = now
    const lastSaved = now - 5 * 60 * 60 * 1000 // 5h ago

    const characters = new Map<string, any>([
      ['devon', { conversationHistory: ['devon_intro'], lastInteractionTimestamp: sessionStartTime + 10_000 }],
    ])

    const ctx = detectReturningPlayer(
      makeGameState({ lastSaved, sessionStartTime, characters }) as any,
      sessionStartTime + 20_000
    )

    expect(ctx.currentSessionCharacters.has('devon')).toBe(true)
  })
})

