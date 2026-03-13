import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { GameState } from '@/lib/game-store'

const choiceGeneratorMocks = vi.hoisted(() => ({
  generateDynamicChoices: vi.fn(),
  shouldUseDynamicChoices: vi.fn(),
}))

vi.mock('@/lib/choice-generator', () => ({
  generateDynamicChoices: choiceGeneratorMocks.generateDynamicChoices,
  ChoiceGenerator: {
    shouldUseDynamicChoices: choiceGeneratorMocks.shouldUseDynamicChoices,
  },
}))

import { StoryEngine } from '@/lib/story-engine'

function createTestGameState(): GameState {
  return {
    playerId: 'test-player',
    currentSceneId: '1-1',
    patterns: {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0,
    },
    platformWarmth: {},
    platformAccessible: {},
    characters: {},
    skillLevels: {},
    performanceLevel: 0.5,
  } as unknown as GameState
}

describe('StoryEngine live augmentation gate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.NEXT_PUBLIC_ENABLE_LIVE_AUGMENTATION
    delete process.env.ENABLE_LIVE_AUGMENTATION

    choiceGeneratorMocks.generateDynamicChoices.mockResolvedValue([
      {
        text: 'Explore further',
        consequence: 'exploring_1',
        nextScene: '1-1-1a',
      },
    ])
    choiceGeneratorMocks.shouldUseDynamicChoices.mockReturnValue(true)
  })

  it('disables live augmentation by default', async () => {
    const engine = new StoryEngine()

    await engine.getScene('1-1', createTestGameState())

    expect(choiceGeneratorMocks.generateDynamicChoices).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1-1' }),
      expect.any(Object),
      expect.objectContaining({
        enableLiveAugmentation: false,
        liveAugmentationChance: 0,
      })
    )
  })

  it('enables live augmentation when the feature flag is set', async () => {
    process.env.NEXT_PUBLIC_ENABLE_LIVE_AUGMENTATION = 'true'
    const engine = new StoryEngine()

    await engine.getScene('1-1', createTestGameState())

    expect(choiceGeneratorMocks.generateDynamicChoices).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1-1' }),
      expect.any(Object),
      expect.objectContaining({
        enableLiveAugmentation: true,
        liveAugmentationChance: 0.33,
      })
    )
  })
})
