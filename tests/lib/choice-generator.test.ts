/**
 * Unit tests for choice generator guardrails
 * Tests min choice count enforcement
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the logger to avoid noise
vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

// Import after mocking
import { ChoiceGenerator } from '@/lib/choice-generator'
import type { Scene } from '@/lib/story-engine'
import type { GameState } from '@/lib/game-store'

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function createTestScene(choices: { text: string; consequence: string }[]): Scene {
  return {
    id: '1-1',
    type: 'choice',
    text: 'Test scene with choices',
    choices: choices.map(c => ({
      text: c.text,
      consequence: c.consequence,
      nextScene: 'next'
    }))
  }
}

function createTestGameState(): GameState {
  return {
    playerId: 'test-player',
    currentSceneId: '1-1',
    patterns: {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    },
    skillLevels: {},
    performanceLevel: 0.5
  } as unknown as GameState
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ChoiceGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('shouldUseDynamicChoices', () => {
    it('returns false for scenes without choices', () => {
      const scene: Scene = {
        id: '1-1',
        type: 'narration',
        text: 'A scene without choices'
      }

      expect(ChoiceGenerator.shouldUseDynamicChoices(scene)).toBe(false)
    })

    it('returns false for scenes with empty choices array', () => {
      const scene: Scene = {
        id: '1-1',
        type: 'choice',
        text: 'A scene with empty choices',
        choices: []
      }

      expect(ChoiceGenerator.shouldUseDynamicChoices(scene)).toBe(false)
    })

    it('returns true for scenes with generic choice text', () => {
      const scene = createTestScene([
        { text: 'Explore further', consequence: 'exploring_1' },
        { text: 'Help someone', consequence: 'helping_1' }
      ])

      expect(ChoiceGenerator.shouldUseDynamicChoices(scene)).toBe(true)
    })

    it('returns false for scenes with specific choice text', () => {
      const scene = createTestScene([
        { text: 'Ask Maya about her robotics project', consequence: 'maya_robotics' },
        { text: 'Tell Maya about your own interests', consequence: 'share_interests' }
      ])

      expect(ChoiceGenerator.shouldUseDynamicChoices(scene)).toBe(false)
    })
  })

  describe('generateChoices', () => {
    it('returns choices for a scene', async () => {
      const scene = createTestScene([
        { text: 'Explore further', consequence: 'exploring_1' },
        { text: 'Help someone', consequence: 'helping_1' }
      ])
      const gameState = createTestGameState()

      const choices = await ChoiceGenerator.generateChoices(scene, gameState)

      expect(choices.length).toBeGreaterThan(0)
    })

    it('preserves original nextScene routing', async () => {
      const scene = createTestScene([
        { text: 'Explore further', consequence: 'exploring_1' },
        { text: 'Help someone', consequence: 'helping_1' }
      ])
      const gameState = createTestGameState()

      const choices = await ChoiceGenerator.generateChoices(scene, gameState)

      // At least some choices should have nextScene preserved
      const withNextScene = choices.filter(c => c.nextScene === 'next')
      expect(withNextScene.length).toBeGreaterThan(0)
    })
  })
})
