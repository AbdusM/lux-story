import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layoutId: _layoutId, ...props }: { children?: React.ReactNode; layoutId?: string }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/lib/choice-ordering', () => ({
  orderChoicesForDisplay: (choices: any[]) => ({
    orderedChoices: [...choices],
    meta: { variant: 'deterministic_shuffle', seed: 'test' },
  }),
}))

vi.mock('@/lib/sync-queue', () => ({
  queueInteractionEventSync: () => undefined,
  generateActionId: () => 'evt-test',
}))

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

describe('GameChoices (Sheet Mode)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses capped sheet sizing for four or more choices', () => {
    render(
      <GameChoices
        choices={[
          { id: 'c1', text: 'A' },
          { id: 'c2', text: 'B' },
          { id: 'c3', text: 'C' },
          { id: 'c4', text: 'D' },
        ]}
        isProcessing={false}
        onChoice={() => undefined}
      />
    )

    const listbox = screen.getByRole('listbox', { name: /choose your response/i })
    expect(listbox.className).toContain('min-h-')
    expect(listbox.className).toContain('max-h-')
    expect(listbox.className).toContain('overflow-y-auto')
  })

  it('keeps natural height when three or fewer choices are present', () => {
    render(
      <GameChoices
        choices={[
          { id: 'c1', text: 'A' },
          { id: 'c2', text: 'B' },
          { id: 'c3', text: 'C' },
        ]}
        isProcessing={false}
        onChoice={() => undefined}
      />
    )

    const listbox = screen.getByRole('listbox', { name: /choose your response/i })
    expect(listbox.className).not.toContain('min-h-')
    expect(listbox.className).toContain('overflow-visible')
  })
})
