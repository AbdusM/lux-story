import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Keep animation semantics out of unit tests.
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layoutId: _layoutId, ...props }: { children?: React.ReactNode; layoutId?: string }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
  useGameStore: (selector: (s: any) => any) =>
    selector({
      coreGameState: {
        playerId: 'player_123',
        currentNodeId: 'node_1',
        currentCharacterId: 'samuel',
        sessionStartTime: 123,
        characters: [],
        unlockedAbilities: [],
      },
    }),
}))

import { GameChoices } from '@/components/GameChoices'

describe('GameChoices (Legibility)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders locked orb-gated choices with a canonical why + how message', () => {
    render(
      <GameChoices
        choices={[
          {
            id: 'locked-1',
            text: 'Ask the deeper question.',
            requiredOrbFill: { pattern: 'analytical', threshold: 50 },
          },
          {
            id: 'open-1',
            text: 'Keep it simple.',
          },
        ]}
        isProcessing={false}
        onChoice={() => undefined}
        orbFillLevels={{ analytical: 10, helping: 0, building: 0, exploring: 0, patience: 0 }}
      />
    )

    // Locked choice should include both why and how-to-unlock text, consistently.
    const locked = screen.getByLabelText(/locked choice: ask the deeper question/i)
    expect(locked).toHaveTextContent(/requires .* resonance \(50%\)/i)
    expect(locked).toHaveTextContent(/to unlock:/i)
    expect(locked).toHaveTextContent(/10\/50/i)
  })
})
