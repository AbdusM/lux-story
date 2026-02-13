import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const mockSetCurrentScene = vi.fn()
const mockMarkOrbsViewed = vi.fn()
const mockToggleReaderMode = vi.fn()

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      layoutId: _layoutId,
      drag: _drag,
      dragConstraints: _dragConstraints,
      dragElastic: _dragElastic,
      variants: _variants,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      ...props
    }: { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  LazyMotion: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  domAnimation: {},
  useReducedMotion: () => false,
}))

vi.mock('@/hooks/usePullToDismiss', () => ({
  usePullToDismiss: () => ({
    dragProps: {},
    onDragEnd: () => undefined,
  }),
  pullToDismissPresets: {
    leftPanel: {},
  },
}))

vi.mock('@/hooks/useReaderMode', () => ({
  useReaderMode: () => ({
    mode: 'mono',
    toggleMode: mockToggleReaderMode,
  }),
}))

vi.mock('@/hooks/useConstellationData', () => ({
  useConstellationData: () => ({
    skills: [],
    characters: [],
    metCharacterIds: [],
    demonstratedSkillIds: [],
  }),
}))

vi.mock('@/hooks/useInsights', () => ({
  useInsights: () => ({
    journey: { stageLabel: 'Beginning' },
    decisionStyle: null,
  }),
}))

vi.mock('@/hooks/useOrbs', () => ({
  useOrbs: () => ({
    hasNewOrbs: false,
    markOrbsViewed: mockMarkOrbsViewed,
    balance: { totalEarned: 0 },
    tier: 'base',
  }),
}))

vi.mock('@/hooks/useSimulations', () => ({
  useSimulations: () => ({ availableCount: 0 }),
}))

vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => ({
    isEducator: false,
    loading: false,
  }),
}))

vi.mock('@/lib/game-store', () => ({
  useGameSelectors: {
    useThoughts: () => [],
    useCoreGameState: () => ({
      globalFlags: [],
      patterns: { analytical: 0, helping: 0, building: 0, patience: 0, exploring: 0 },
      characters: [],
    }),
  },
  useGameStore: (selector: (s: any) => any) =>
    selector({
      unlockedAchievements: [],
      setCurrentScene: mockSetCurrentScene,
    }),
}))

vi.mock('@/lib/quest-system', () => ({
  getQuestsWithStatus: () => [],
}))

vi.mock('@/components/CharacterAvatar', () => ({
  PlayerAvatar: () => <div data-testid="player-avatar">avatar</div>,
}))

vi.mock('@/components/PatternOrb', () => ({
  PatternOrb: () => <div data-testid="pattern-orb">orb</div>,
}))

vi.mock('@/components/HarmonicsView', () => ({
  HarmonicsView: () => <div>Harmonics View</div>,
}))
vi.mock('@/components/EssenceSigil', () => ({
  EssenceSigil: () => <div>Essence View</div>,
}))
vi.mock('@/components/MasteryView', () => ({
  MasteryView: () => <div>Mastery View</div>,
}))
vi.mock('@/components/ThoughtCabinet', () => ({
  ThoughtCabinet: () => <div>Mind View</div>,
}))
vi.mock('@/components/NarrativeAnalysisDisplay', () => ({
  NarrativeAnalysisDisplay: () => <div>Analysis View</div>,
}))
vi.mock('@/components/ToolkitView', () => ({
  ToolkitView: () => <div>Toolkit View</div>,
}))
vi.mock('@/components/SimulationsArchive', () => ({
  SimulationsArchive: () => <div>Simulations View</div>,
}))
vi.mock('@/components/journal/SimulationGodView', () => ({
  SimulationGodView: () => <div>God Mode View</div>,
}))
vi.mock('@/components/journal/OpportunitiesView', () => ({
  OpportunitiesView: () => <div>Opportunities View</div>,
}))
vi.mock('@/components/journal/CareerRecommendationsView', () => ({
  CareerRecommendationsView: () => <div>Careers View</div>,
}))
vi.mock('@/components/journal/SkillCombosView', () => ({
  SkillCombosView: () => <div>Combos View</div>,
}))
vi.mock('@/components/OrbDetailPanel', () => ({
  OrbDetailPanel: () => <div>Orb Detail</div>,
}))
vi.mock('@/components/CognitionView', () => ({
  CognitionView: () => <div>Cognition View</div>,
}))

vi.mock('@/components/journal/PrismTabs', () => ({
  PrismTabs: ({ tabs, activeTab, onSelect, ariaLabel }: any) => (
    <div role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab: any) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('@/components/constellation/PeopleView', () => ({
  PeopleView: () => <div>People View</div>,
}))
vi.mock('@/components/constellation/SkillsView', () => ({
  SkillsView: () => <div>Skills View</div>,
}))
vi.mock('@/components/constellation/QuestsView', () => ({
  QuestsView: () => <div>Quests View</div>,
}))
vi.mock('@/components/constellation/DetailModal', () => ({
  DetailModal: () => null,
}))

import { Journal } from '@/components/Journal'
import { ConstellationPanel } from '@/components/constellation/ConstellationPanel'

describe('Side Panels Runtime', () => {
  beforeEach(() => {
    mockSetCurrentScene.mockClear()
    mockMarkOrbsViewed.mockClear()
    mockToggleReaderMode.mockClear()
  })

  it('Journal closes via close button, backdrop, and Escape', () => {
    const onClose = vi.fn()
    render(<Journal isOpen={true} onClose={onClose} />)

    expect(screen.getByTestId('journal-panel')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: /prism/i })).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText(/close prism/i))
    fireEvent.click(screen.getByTestId('journal-backdrop'))
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(3)
  })

  it('ConstellationPanel supports arrow-key tab navigation and closes reliably', async () => {
    const onClose = vi.fn()
    render(<ConstellationPanel isOpen={true} onClose={onClose} />)

    const peopleTab = screen.getByRole('tab', { name: /network/i })
    const skillsTab = screen.getByRole('tab', { name: /skills/i })
    expect(peopleTab).toHaveAttribute('aria-selected', 'true')
    expect(skillsTab).toHaveAttribute('aria-selected', 'false')

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /skills/i })).toHaveAttribute('aria-selected', 'true')
    })

    fireEvent.click(screen.getByLabelText(/close journey panel/i))
    fireEvent.click(screen.getByTestId('journey-backdrop'))
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(3)
  })
})
