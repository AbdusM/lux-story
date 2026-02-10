import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const paths = vi.hoisted(() => {
  const ROOT = process.cwd()
  // NOTE: `vi.hoisted()` runs before ESM imports initialize. Avoid imported helpers like `node:path` here.
  const C = (p: string) => `${ROOT}/components/${p}`
  const J = (p: string) => `${ROOT}/components/journal/${p}`
  return {
    ROOT,
    HarmonicsView: C('HarmonicsView.tsx'),
    EssenceSigil: C('EssenceSigil.tsx'),
    MasteryView: C('MasteryView.tsx'),
    ThoughtCabinet: C('ThoughtCabinet.tsx'),
    NarrativeAnalysisDisplay: C('NarrativeAnalysisDisplay.tsx'),
    ToolkitView: C('ToolkitView.tsx'),
    SimulationsArchive: C('SimulationsArchive.tsx'),
    OrbDetailPanel: C('OrbDetailPanel.tsx'),
    CognitionView: C('CognitionView.tsx'),
    CharacterAvatar: C('CharacterAvatar.tsx'),
    PatternOrb: C('PatternOrb.tsx'),
    BiologyIndicator: C('BiologyIndicator.tsx'),
    RankingView: J('RankingView.tsx'),
    CareerRecommendationsView: J('CareerRecommendationsView.tsx'),
    CareerValuesView: J('CareerValuesView.tsx'),
    SimulationGodView: J('SimulationGodView.tsx'),
    OpportunitiesView: J('OpportunitiesView.tsx'),
    SynthesisPuzzlesView: J('SynthesisPuzzlesView.tsx'),
    MysteryView: J('MysteryView.tsx'),
    SkillCombosView: J('SkillCombosView.tsx'),
    PatternRankBadge: `${ROOT}/components/ranking/PatternRankBadge.tsx`,
  }
})

vi.mock('framer-motion', () => {
  const React = require('react')
  const motionProxy = new Proxy({}, {
    get: () => (props: any) => React.createElement('div', props, props.children),
  })
  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
    useReducedMotion: () => true,
  }
})

vi.mock('@/hooks/usePullToDismiss', () => ({
  usePullToDismiss: () => ({ dragProps: {}, onDragEnd: () => {} }),
  pullToDismissPresets: { leftPanel: {} },
}))

vi.mock('@/hooks/useReaderMode', () => ({
  useReaderMode: () => ({ mode: 'normal', toggleMode: vi.fn() }),
}))

vi.mock('@/hooks/useConstellationData', () => ({
  useConstellationData: () => ({ skills: [] }),
}))

vi.mock('@/hooks/useInsights', () => ({
  useInsights: () => null,
}))

vi.mock('@/hooks/useOrbs', () => ({
  useOrbs: () => ({
    hasNewOrbs: false,
    markOrbsViewed: vi.fn(),
    balance: {},
    tier: 1,
  }),
}))

vi.mock('@/hooks/useSimulations', () => ({
  useSimulations: () => ({ availableCount: 0 }),
}))

vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => ({ isEducator: false, loading: false, user: null, role: 'player' }),
}))

vi.mock('@/hooks/useBiology', () => ({
  useBiology: () => ({ nervousState: null, lastReaction: null, isLoading: false }),
}))

vi.mock('@/content/birmingham-opportunities', () => ({
  getBirminghamOpportunities: () => ({
    getFilteredOpportunities: () => ([]),
  }),
}))

vi.mock('@/lib/game-store', () => ({
  useGameSelectors: {
    useThoughts: () => ([]),
    usePatterns: () => ({ analytical: 0, helping: 0, building: 0, exploring: 0, patience: 0 }),
  },
  useGameStore: (selector: any) => selector({ unlockedAchievements: [] }),
}))

// Stub heavy subviews to keep the test focused on tab switching behavior.
vi.mock(paths.HarmonicsView, () => ({ HarmonicsView: () => <div>HarmonicsView</div> }))
vi.mock(paths.EssenceSigil, () => ({ EssenceSigil: () => <div>EssenceSigil</div> }))
vi.mock(paths.MasteryView, () => ({ MasteryView: () => <div>MasteryView</div> }))
vi.mock(paths.RankingView, () => ({ RankingView: () => <div>RankingView</div> }))
vi.mock(paths.CareerRecommendationsView, () => ({ CareerRecommendationsView: () => <div>CareerRecommendationsView</div> }))
vi.mock(paths.CareerValuesView, () => ({ CareerValuesView: () => <div>CareerValuesView</div> }))

// Everything else imported by Journal.tsx.
vi.mock(paths.ThoughtCabinet, () => ({ ThoughtCabinet: () => <div>ThoughtCabinet</div> }))
vi.mock(paths.NarrativeAnalysisDisplay, () => ({ NarrativeAnalysisDisplay: () => <div>NarrativeAnalysisDisplay</div> }))
vi.mock(paths.ToolkitView, () => ({ ToolkitView: () => <div>ToolkitView</div> }))
vi.mock(paths.SimulationsArchive, () => ({ SimulationsArchive: () => <div>SimulationsArchive</div> }))
vi.mock(paths.SimulationGodView, () => ({ SimulationGodView: () => <div>SimulationGodView</div> }))
vi.mock(paths.OpportunitiesView, () => ({ OpportunitiesView: () => <div>OpportunitiesView</div> }))
vi.mock(paths.SynthesisPuzzlesView, () => ({ SynthesisPuzzlesView: () => <div>SynthesisPuzzlesView</div> }))
vi.mock(paths.MysteryView, () => ({ MysteryView: () => <div>MysteryView</div> }))
vi.mock(paths.SkillCombosView, () => ({ SkillCombosView: () => <div>SkillCombosView</div> }))
vi.mock(paths.OrbDetailPanel, () => ({ OrbDetailPanel: () => <div>OrbDetailPanel</div> }))
vi.mock(paths.CognitionView, () => ({ CognitionView: () => <div>CognitionView</div> }))
vi.mock(paths.CharacterAvatar, () => ({ PlayerAvatar: () => <div>PlayerAvatar</div> }))
vi.mock(paths.PatternOrb, () => ({ PatternOrb: () => <div>PatternOrb</div> }))
vi.mock(paths.PatternRankBadge, () => ({ CompactRankBadge: () => <div>CompactRankBadge</div> }))
vi.mock(paths.BiologyIndicator, () => ({ BiologyIndicator: () => <div>BiologyIndicator</div> }))

import { Journal } from '@/components/Journal'

describe('Prism tabs (Journal)', () => {
  it('renders key tabs and switches content when clicked', async () => {
    render(<Journal isOpen={true} onClose={vi.fn()} />)

    // Default is harmonics.
    expect(screen.getByText('HarmonicsView')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: /essence/i })[0]!)
    expect(screen.getByText('EssenceSigil')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: /mastery/i })[0]!)
    expect(screen.getByText('MasteryView')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: /ranks/i })[0]!)
    expect(screen.getByText('RankingView')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: /careers/i })[0]!)
    expect(screen.getByText('CareerRecommendationsView')).toBeInTheDocument()
  })
})
