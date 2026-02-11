import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { GameStateUtils } from '@/lib/character-state'
import { createTrustTimeline, recordTrustChange } from '@/lib/trust-derivatives'
import { ContinuityStrip } from '@/components/game/ContinuityStrip'

describe('ContinuityStrip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-11T00:00:00.000Z'))
  })

  it('prefers check-in ready as the primary cue', () => {
    const state = GameStateUtils.createNewGameState('player123')
    state.globalFlags.add('met_maya')
    state.pendingCheckIns.push({
      characterId: 'maya',
      sessionsRemaining: 0,
      dialogueNodeId: 'maya_intro',
    })

    render(<ContinuityStrip gameState={state} characterId="maya" />)

    expect(screen.getByTestId('continuity-strip')).toBeInTheDocument()
    expect(screen.getByTestId('continuity-primary').textContent).toMatch(/new message from maya/i)
    expect(screen.getByTestId('continuity-secondary').textContent).toMatch(/check-in ready/i)
  })

  it('renders a quiet re-meet cue with recency + trust trend when available', () => {
    const state = GameStateUtils.createNewGameState('player123')
    state.globalFlags.add('met_maya')

    const cs = state.characters.get('maya')!
    cs.conversationHistory.push('maya_any_node')
    cs.lastInteractionTimestamp = Date.now() - 2 * 60 * 60 * 1000 // 2h ago

    // Make trust trend improving.
    let tl = createTrustTimeline('maya')
    tl = recordTrustChange(tl, 2, +1, 'n1', 'test')
    tl = recordTrustChange(tl, 3, +1, 'n2', 'test')
    cs.trustTimeline = tl

    render(<ContinuityStrip gameState={state} characterId="maya" />)

    expect(screen.getByTestId('continuity-primary').textContent).toMatch(/last spoke 2h ago/i)
    expect(screen.getByTestId('continuity-secondary').textContent).toMatch(/trust: growing/i)
  })

  it('stays hidden when there is no check-in and it is the first meet', () => {
    const state = GameStateUtils.createNewGameState('player123')
    render(<ContinuityStrip gameState={state} characterId="maya" />)
    expect(screen.queryByTestId('continuity-strip')).toBeNull()
  })
})

