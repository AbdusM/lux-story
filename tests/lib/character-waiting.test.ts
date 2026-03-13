import { describe, expect, it } from 'vitest'

import type { CharacterState, GameState } from '@/lib/character-state'
import { detectReturningPlayer } from '@/lib/character-waiting'

function makeCharacterState(
  characterId: string,
  overrides: Partial<CharacterState> = {}
): CharacterState {
  return {
    characterId,
    trust: 0,
    anxiety: 0,
    nervousSystemState: 'ventral_vagal',
    lastReaction: null,
    knowledgeFlags: new Set(),
    relationshipStatus: 'stranger',
    conversationHistory: [],
    ...overrides,
  }
}

function makeGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    saveVersion: '1.0.0',
    playerId: 'test-player',
    lastSaved: 0,
    currentNodeId: 'start',
    currentCharacterId: 'samuel',
    globalFlags: new Set(),
    patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
    sessionStartTime: 0,
    sessionBoundariesCrossed: 0,
    characters: new Map<string, CharacterState>(),
    thoughts: [],
    episodeNumber: 1,
    platforms: {},
    careerValues: {
      directImpact: 0,
      systemsThinking: 0,
      dataInsights: 0,
      futureBuilding: 0,
      independence: 0,
    },
    mysteries: {
      letterSender: 'unknown',
      platformSeven: 'stable',
      samuelsPast: 'hidden',
      stationNature: 'unknown',
    },
    time: {
      currentDisplay: '12:00 PM',
      minutesRemaining: 10,
      flowRate: 1,
      isStopped: false,
    },
    quietHour: {
      potential: false,
      experienced: [],
    },
    overdensity: 0,
    items: {
      letter: 'kept',
      discoveredPaths: [],
    },
    pendingCheckIns: [],
    unlockedAbilities: [],
    archivistState: {} as GameState['archivistState'],
    skillLevels: {},
    skillUsage: new Map(),
    ...overrides,
  }
}

describe('character-waiting', () => {
  it('does not treat legacy conversationHistory as "visited this session" when timestamp is before session start', () => {
    const now = 1_000_000_000
    const sessionStartTime = now
    const lastSaved = now - 5 * 60 * 60 * 1000 // 5h ago

    const characters = new Map<string, CharacterState>([
      ['maya', makeCharacterState('maya', {
        conversationHistory: ['maya_intro'],
        lastInteractionTimestamp: now - 10 * 60 * 60 * 1000,
      })],
    ])

    const ctx = detectReturningPlayer(
      makeGameState({ lastSaved, sessionStartTime, characters }),
      sessionStartTime + 1000
    )

    expect(ctx.currentSessionCharacters.has('maya')).toBe(false)
  })

  it('treats lastInteractionTimestamp >= sessionStartTime as "visited this session"', () => {
    const now = 2_000_000_000
    const sessionStartTime = now
    const lastSaved = now - 5 * 60 * 60 * 1000 // 5h ago

    const characters = new Map<string, CharacterState>([
      ['devon', makeCharacterState('devon', {
        conversationHistory: ['devon_intro'],
        lastInteractionTimestamp: sessionStartTime + 10_000,
      })],
    ])

    const ctx = detectReturningPlayer(
      makeGameState({ lastSaved, sessionStartTime, characters }),
      sessionStartTime + 20_000
    )

    expect(ctx.currentSessionCharacters.has('devon')).toBe(true)
  })
})
