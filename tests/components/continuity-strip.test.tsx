import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ContinuityStrip } from '@/components/game/ContinuityStrip'

function makeGameState(overrides: Partial<any> = {}): any {
  return {
    pendingCheckIns: [],
    characters: new Map(),
    ...overrides,
  }
}

describe('ContinuityStrip', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prioritizes check-in ready messaging when a pending check-in exists', () => {
    const gameState = makeGameState({
      pendingCheckIns: [{ characterId: 'maya', sessionsRemaining: 0 }],
      characters: new Map([['maya', { conversationHistory: [] }]]),
    })

    render(<ContinuityStrip gameState={gameState} characterId={'maya' as any} />)

    expect(screen.getByTestId('continuity-primary')).toHaveTextContent('New message from Maya.')
    expect(screen.getByTestId('continuity-secondary')).toHaveTextContent('Check-in ready')
  })

  it('shows re-meet recency when no check-in is ready', () => {
    vi.spyOn(Date, 'now').mockReturnValue(10 * 60 * 60 * 1000) // 10h

    const gameState = makeGameState({
      pendingCheckIns: [],
      characters: new Map([
        ['devon', { conversationHistory: ['devon_intro'], lastInteractionTimestamp: 8 * 60 * 60 * 1000 }], // 2h ago
      ]),
    })

    render(<ContinuityStrip gameState={gameState} characterId={'devon' as any} />)

    expect(screen.getByTestId('continuity-primary')).toHaveTextContent('Last spoke 2h ago.')
    expect(screen.getByTestId('continuity-secondary')).toHaveTextContent('Re-meet')
  })

  it('renders nothing for first-time encounters with no pending check-in', () => {
    const gameState = makeGameState({
      pendingCheckIns: [],
      characters: new Map([['kai', { conversationHistory: [] }]]),
    })

    const { queryByTestId } = render(<ContinuityStrip gameState={gameState} characterId={'kai' as any} />)
    expect(queryByTestId('continuity-strip')).not.toBeInTheDocument()
  })
})

