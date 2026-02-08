import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layoutId: _layoutId, ...props }: { children: React.ReactNode; layoutId?: string }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

vi.mock('@/hooks/usePullToDismiss', () => ({
  pullToDismissPresets: { leftPanel: {} },
  usePullToDismiss: () => ({ dragProps: {}, onDragEnd: vi.fn() }),
}))

vi.mock('@/hooks/useReaderMode', () => ({
  useReaderMode: () => ({ mode: 'mono', toggleMode: vi.fn() }),
}))

vi.mock('@/hooks/useConstellationData', () => ({
  useConstellationData: () => ({ skills: [] }),
}))

vi.mock('@/hooks/useInsights', () => ({
  useInsights: () => ({ journey: { stageLabel: 'Beginning' }, decisionStyle: { primaryPattern: null } }),
}))

vi.mock('@/hooks/useOrbs', () => ({
  useOrbs: () => ({
    hasNewOrbs: false,
    markOrbsViewed: vi.fn(),
    balance: { totalEarned: 0 },
    tier: 'emerging',
  }),
}))

vi.mock('@/hooks/useSimulations', () => ({
  useSimulations: () => ({ availableCount: 0 }),
}))

vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => ({ isEducator: false, loading: false }),
}))

vi.mock('@/hooks/useBiology', () => ({
  useBiology: () => ({ nervousState: null, lastReaction: null, isLoading: true }),
}))

// Stub heavy tab bodies so tests only validate navigation.
vi.mock('../../components/HarmonicsView', () => ({
  HarmonicsView: () => <div>Harmonics content</div>,
}))

vi.mock('../../components/EssenceSigil', () => ({
  EssenceSigil: () => <div>Essence content</div>,
}))

vi.mock('../../components/MasteryView', () => ({
  MasteryView: () => <div>Mastery content</div>,
}))

vi.mock('../../components/journal/CareerValuesView', () => ({
  CareerValuesView: () => <div>Career values content</div>,
}))

vi.mock('../../components/journal/CareerRecommendationsView', () => ({
  CareerRecommendationsView: () => <div>Careers content</div>,
}))

vi.mock('../../components/journal/RankingView', () => ({
  RankingView: () => <div>Ranks content</div>,
}))

import { Journal } from '@/components/Journal'

describe('Prism Tabs (Journal)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders tab buttons and switches content for core tabs', async () => {
    const user = userEvent.setup()
    render(<Journal isOpen={true} onClose={vi.fn()} />)

    // Default tab
    expect(screen.getByText('Harmonics content')).toBeInTheDocument()

    // Essence
    await user.click(screen.getAllByRole('button', { name: 'Essence' })[0])
    expect(screen.getByText('Essence content')).toBeInTheDocument()

    // Mastery
    await user.click(screen.getAllByRole('button', { name: 'Mastery' })[0])
    expect(screen.getByText('Mastery content')).toBeInTheDocument()

    // Ranks
    await user.click(screen.getAllByRole('button', { name: 'Ranks' })[0])
    expect(screen.getByText('Ranks content')).toBeInTheDocument()

    // Careers
    await user.click(screen.getAllByRole('button', { name: 'Careers' })[0])
    expect(screen.getByText('Careers content')).toBeInTheDocument()
  })
})
