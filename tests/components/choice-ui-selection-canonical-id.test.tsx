import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Keep animation semantics out of unit tests.
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layoutId: _layoutId, ...props }: { children?: React.ReactNode; layoutId?: string }) => (
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
vi.mock('@/lib/sync-queue', () => ({
  queueInteractionEventSync: () => undefined,
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

vi.mock('@/lib/game-store', () => ({
  useGameStore: (selector: (s: any) => any) => selector({
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

const recordChoiceUiSelection = vi.fn()
vi.mock('@/lib/choice-dispatch-telemetry', () => ({
  recordChoiceUiSelection: (...args: unknown[]) => recordChoiceUiSelection(...args),
}))

import { GameChoices } from '@/components/GameChoices'

describe('GameChoices telemetry (canonical choice ids)', () => {
  beforeEach(() => {
    recordChoiceUiSelection.mockClear()
    localStorage.clear()
  })

  it('records UI selection using choice.id (not index or text)', async () => {
    const user = userEvent.setup()

    render(
      <GameChoices
        choices={[
          { id: 'choice_a', text: 'Alpha', next: '0' },
          { id: 'choice_b', text: 'Beta', next: '1' },
        ]}
        isProcessing={false}
        onChoice={() => undefined}
      />
    )

    await user.click(screen.getByText('Alpha'))

    expect(recordChoiceUiSelection).toHaveBeenCalledTimes(1)
    expect(recordChoiceUiSelection).toHaveBeenCalledWith(
      expect.objectContaining({ selected_choice_id: 'choice_a' })
    )
    expect((recordChoiceUiSelection.mock.calls[0]?.[0] as any).selected_choice_id).not.toBe('0')
  })
})

