import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GameInterface } from '@/components/GameInterface'

// Mock the hooks
vi.mock('@/hooks/useMessageManager', () => ({
  useMessageManager: () => ({
    messages: [],
    addMessage: vi.fn(),
    addStreamingMessage: vi.fn(),
    clearMessages: vi.fn(),
  })
}))

vi.mock('@/hooks/useCareerReflection', () => ({
  useCareerReflection: () => ({
    rapidClicks: 0,
    trackClick: vi.fn(),
  })
}))

vi.mock('@/hooks/useEmotionalRegulation', () => ({
  useEmotionalRegulation: () => ({
    emotionalState: { stressLevel: 'calm' },
    trackChoice: vi.fn(),
    trackHesitation: vi.fn(),
    resetHesitation: vi.fn(),
    getEmotionalSupport: vi.fn(),
    getVisualAdjustments: vi.fn(() => ({})),
    resetEmotionalState: vi.fn(),
  })
}))

vi.mock('@/hooks/useCognitiveDevelopment', () => ({
  useCognitiveDevelopment: () => ({
    cognitiveState: { flowState: 'flow' },
    trackChoice: vi.fn(),
    startDecisionTracking: vi.fn(),
    getMetacognitivePrompt: vi.fn(),
    getFlowOptimization: vi.fn(),
    getCognitiveScaffolding: vi.fn(),
    getLearningStyleAdaptations: vi.fn(),
    resetCognitiveState: vi.fn(),
  })
}))

vi.mock('@/hooks/useDevelopmentalPsychology', () => ({
  useDevelopmentalPsychology: () => ({
    identityState: { identityExploration: 'early' },
    culturalContext: { culturalValues: ['community'] },
    trackChoice: vi.fn(),
    getIdentityPrompt: vi.fn(),
    getCulturalPrompt: vi.fn(),
    getYouthDevelopmentSupport: vi.fn(),
    getCulturalAdaptations: vi.fn(),
    getIdentityScaffolding: vi.fn(),
    resetDevelopmentalState: vi.fn(),
  })
}))

vi.mock('@/hooks/useNeuroscience', () => ({
  useNeuroscience: () => ({
    neuralState: { attentionNetwork: 'integrated' },
    trackChoice: vi.fn(),
    getBrainPrompt: vi.fn(),
    getBrainOptimization: vi.fn(),
    getNeuroplasticitySupport: vi.fn(),
    getNeuralEfficiencyTips: vi.fn(),
    resetNeuralState: vi.fn(),
  })
}))

vi.mock('@/hooks/use2030Skills', () => ({
  use2030Skills: () => ({
    skills: { criticalThinking: 0.5 },
    matchingCareerPaths: [],
    trackChoice: vi.fn(),
    getSkillPrompt: vi.fn(),
    getSkillsSummary: vi.fn(),
    getSkillDevelopmentSuggestions: vi.fn(),
    getContextualSkillFeedback: vi.fn(),
    resetSkills: vi.fn(),
  })
}))

vi.mock('@/lib/performance-system', () => ({
  getPerformanceSystem: () => ({
    getPerformanceLevel: () => 'high',
  })
}))

vi.mock('@/lib/grand-central-state', () => ({
  getGrandCentralState: () => ({
    getState: () => ({
      platforms: { p1: { warmth: 3 } },
      time: { stopped: false }
    })
  })
}))

describe('GameInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the intro screen initially', () => {
    render(<GameInterface />)

    expect(screen.getByText('Grand Central Terminus')).toBeInTheDocument()
    expect(screen.getByText('"Your future awaits at Platform 7. Midnight. Don\'t be late."')).toBeInTheDocument()
    expect(screen.getByText('Begin New Journey')).toBeInTheDocument()
  })

  it('starts the game when Begin New Journey is clicked', async () => {
    render(<GameInterface />)

    const startButton = screen.getByText('Begin New Journey')
    fireEvent.click(startButton)

    // The game should start and show the main interface
    await waitFor(() => {
      expect(screen.queryByText('Begin New Journey')).not.toBeInTheDocument()
    })
  })

  it('applies Apple design classes correctly', () => {
    render(<GameInterface />)

    const container = screen.getByText('Grand Central Terminus').closest('.apple-container')
    expect(container).toBeInTheDocument()
  })
})
