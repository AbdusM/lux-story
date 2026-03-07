import { describe, expect, it } from 'vitest'

import { GameStateUtils } from '@/lib/character-state'
import { deriveJourneyLaneSummary } from '@/lib/journey-lane'

describe('deriveJourneyLaneSummary', () => {
  it('returns empty-state copy when no save snapshot exists', () => {
    expect(deriveJourneyLaneSummary(null)).toMatchObject({
      hasJourney: false,
      heldRouteLabel: 'No saved route',
      dominantPatternLabel: 'Unread',
      openReturnsCount: 0,
    })
  })

  it('summarizes the active route, strongest signal, and waiting returns', () => {
    const state = GameStateUtils.createNewGameState('player-1')
    state.currentCharacterId = 'maya'
    state.currentNodeId = 'maya_intro'
    state.episodeNumber = 3
    state.patterns.helping = 6
    state.patterns.analytical = 2
    state.patterns.exploring = 1
    state.unlockedAbilities = ['orb_echo']
    state.pendingCheckIns = [
      { characterId: 'devon', sessionsRemaining: 0, dialogueNodeId: 'devon_intro' },
      { characterId: 'isaiah', sessionsRemaining: 2, dialogueNodeId: 'isaiah_intro' },
    ]

    const samuel = state.characters.get('samuel')
    const maya = state.characters.get('maya')
    const devon = state.characters.get('devon')

    if (!samuel || !maya || !devon) {
      throw new Error('Expected seeded characters to exist')
    }

    samuel.conversationHistory = ['samuel_introduction']
    maya.conversationHistory = ['maya_intro']
    devon.conversationHistory = ['devon_intro']

    const summary = deriveJourneyLaneSummary(GameStateUtils.serialize(state))

    expect(summary).toMatchObject({
      hasJourney: true,
      episodeNumber: 3,
      heldRouteLabel: 'Maya Chen',
      dominantPatternLabel: 'Helping',
      dominantPatternScore: 6,
      voicesReachedCount: 3,
      openReturnsCount: 1,
      nextReturnLabel: 'Devon Brooks',
      unlockedAbilitiesCount: 1,
    })
    expect(summary.heldRouteNote).toMatch(/Maya Chen/)
    expect(summary.openReturnsNote).toMatch(/Devon Brooks/)
  })
})
