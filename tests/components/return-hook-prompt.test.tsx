import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { GameStateUtils } from '@/lib/character-state'
import { ReturnHookPrompt } from '@/components/game/ReturnHookPrompt'

describe('ReturnHookPrompt', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-11T00:00:00.000Z'))
  })

  it('stays hidden when not returning', () => {
    const state = GameStateUtils.createNewGameState('player123')
    render(
      <ReturnHookPrompt
        gameState={state}
        isReturningPlayer={false}
        waitingCharacters={[]}
        onOpenJourney={() => {}}
        onDismiss={() => {}}
      />
    )
    expect(screen.queryByTestId('return-hook')).toBeNull()
  })

  it('renders a messages cue and allows opening the journey', () => {
    const state = GameStateUtils.createNewGameState('player123')
    state.pendingCheckIns.push({
      characterId: 'maya',
      sessionsRemaining: 0,
      dialogueNodeId: 'maya_intro',
    })

    const onOpenJourney = vi.fn()
    render(
      <ReturnHookPrompt
        gameState={state}
        isReturningPlayer={true}
        waitingCharacters={[]}
        onOpenJourney={onOpenJourney}
        onDismiss={() => {}}
      />
    )

    expect(screen.getByTestId('return-hook-primary').textContent).toMatch(/new message from maya/i)
    fireEvent.click(screen.getByTestId('return-hook-open-journey'))
    expect(onOpenJourney).toHaveBeenCalledTimes(1)
  })

  it('renders a waiting cue and allows visiting the character', () => {
    const state = GameStateUtils.createNewGameState('player123')

    const onVisitCharacter = vi.fn()
    render(
      <ReturnHookPrompt
        gameState={state}
        isReturningPlayer={true}
        waitingCharacters={[
          {
            characterId: 'devon',
            hoursSinceVisit: 6,
            waitingMessage: 'Devon asked about you.',
            priority: 10,
            hasNewContent: false,
            trustLevel: 6,
            arcInProgress: false,
          }
        ]}
        onOpenJourney={() => {}}
        onVisitCharacter={onVisitCharacter}
        onDismiss={() => {}}
      />
    )

    expect(screen.getByTestId('return-hook-primary').textContent).toMatch(/devon has been waiting/i)
    fireEvent.click(screen.getByTestId('return-hook-visit-character'))
    expect(onVisitCharacter).toHaveBeenCalledWith('devon')
  })
})

