import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Keep animation semantics out of unit tests.
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layoutId: _layoutId, ...props }: { children: React.ReactNode; layoutId?: string }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

// Make ordering deterministic for this test file (preserve input order).
vi.mock('@/lib/choice-ordering', () => ({
  orderChoicesForDisplay: (choices: any[]) => ({
    orderedChoices: [...choices],
    meta: { variant: 'deterministic_shuffle', seed: 'test' },
  }),
}))

// Avoid side effects in unit tests (offline queue writes).
const queueInteractionEventSync = vi.fn()
vi.mock('@/lib/sync-queue', () => ({
  queueInteractionEventSync: (...args: unknown[]) => queueInteractionEventSync(...args),
  generateActionId: () => 'evt-test',
}))

// Remove the signature-animation timing from unit tests; treat commit as synchronous.
vi.mock('@/hooks/useChoiceCommitment', () => ({
  useChoiceCommitment: () => ({
    animationState: null,
    selectedChoiceId: null,
    isCommitting: false,
    commitChoice: (_choiceId: string, onComplete: () => void) => onComplete(),
    shouldDimScreen: false,
  }),
}))

// Make telemetry paths active but deterministic.
vi.mock('@/lib/game-store', () => ({
  useGameStore: (selector: (s: { coreGameState: unknown }) => unknown) => selector({
    coreGameState: {
      playerId: 'player_123',
      currentNodeId: 'node_1',
      currentCharacterId: 'samuel',
      sessionStartTime: 123,
      characters: [],
      unlockedAbilities: [],
    }
  }),
}))

import { GameChoices } from '@/components/GameChoices'

describe('GameChoices (Disabled Choices)', () => {
  beforeEach(() => {
    queueInteractionEventSync.mockClear()
    localStorage.clear()
  })

  it('renders enabledCondition-disabled choices as disabled and prevents selection', async () => {
    const user = userEvent.setup()
    const onChoice = vi.fn()

    render(
      <GameChoices
        choices={[
          { id: 'c1', text: 'Disabled option', enabled: false, disabledReason: 'Need trust 10' },
          { id: 'c2', text: 'Enabled option' },
        ]}
        isProcessing={false}
        onChoice={onChoice}
      />
    )

    expect(screen.getByLabelText(/disabled choice: disabled option/i)).toHaveAttribute('aria-disabled', 'true')

    await user.click(screen.getByText('Disabled option'))
    expect(onChoice).not.toHaveBeenCalled()

    fireEvent.keyDown(window, { key: '1' })
    expect(onChoice).not.toHaveBeenCalled()

    fireEvent.keyDown(window, { key: '2' })
    expect(onChoice).toHaveBeenCalledTimes(1)

    // Telemetry should reflect that the choice was disabled.
    await waitFor(() => {
      expect(queueInteractionEventSync).toHaveBeenCalled()
    })

    const presented = queueInteractionEventSync.mock.calls.find((c) => (c[0] as any)?.event_type === 'choice_presented')
    expect(presented).toBeTruthy()
    const payloadChoices = (presented?.[0] as any).payload.choices as Array<any>
    const disabledRow = payloadChoices.find((c) => c.choice_id === 'c1')
    expect(disabledRow?.is_enabled).toBe(false)
    expect(disabledRow?.disabled_reason).toBe('Need trust 10')
  })
})
