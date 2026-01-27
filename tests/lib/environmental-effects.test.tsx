/**
 * EnvironmentalEffects Component Tests
 *
 * Verifies that body CSS classes are correctly applied based on game state.
 * This is a regression test to prevent the atmospheric visual effects from
 * being accidentally broken again (as happened in the Gemini merge).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { EnvironmentalEffects } from '@/components/EnvironmentalEffects'
import type { GameState } from '@/lib/character-state'

// Helper to create a minimal gameState for testing
function createTestGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
    characters: [],
    globalFlags: [],
    thoughts: [],
    currentCharacterId: 'samuel',
    currentNodeId: 'test_node',
    platforms: {},
    careerValues: { directImpact: 0, systemsThinking: 0, dataInsights: 0, futureBuilding: 0, independence: 0 },
    mysteries: { letterSender: 'unknown', platformSeven: 'stable', samuelsPast: 'hidden', stationNature: 'unknown' },
    time: { currentDisplay: '23:47', minutesRemaining: 13, flowRate: 1.0, isStopped: false },
    quietHour: { potential: true, experienced: [] },
    overdensity: 0.3,
    items: { letter: 'kept', discoveredPaths: [] },
    pendingCheckIns: [],
    unlockedAbilities: [],
    archivistState: { collectedRecords: [], verifiedLore: [], sensoryCalibration: {} },
    ...overrides
  } as GameState
}

describe('EnvironmentalEffects', () => {
  beforeEach(() => {
    // Clear any existing classes on body
    document.body.className = ''
  })

  afterEach(() => {
    cleanup()
    document.body.className = ''
  })

  describe('Pattern-based classes', () => {
    it('applies dominant pattern environment class when pattern > 5', () => {
      const gameState = createTestGameState({
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 7, building: 3 }
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('helping-environment')).toBe(true)
    })

    it('does not apply environment class when no pattern > 5', () => {
      const gameState = createTestGameState({
        patterns: { analytical: 3, patience: 4, exploring: 2, helping: 5, building: 3 }
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('helping-environment')).toBe(false)
      expect(document.body.classList.contains('analytical-environment')).toBe(false)
    })

    it('applies station-breathing class when patience > 7', () => {
      const gameState = createTestGameState({
        patterns: { analytical: 0, patience: 8, exploring: 0, helping: 0, building: 0 }
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('station-breathing')).toBe(true)
    })

    it('applies shadow-warm class when helping > 5', () => {
      const gameState = createTestGameState({
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 6, building: 0 }
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('shadow-warm')).toBe(true)
    })

    it('applies particles-helping class when helping > 6', () => {
      const gameState = createTestGameState({
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 7, building: 0 }
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('particles-helping')).toBe(true)
    })

    it('applies particles-building class when building > 6 (and helping <= 6)', () => {
      const gameState = createTestGameState({
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 5, building: 7 }
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('particles-building')).toBe(true)
      expect(document.body.classList.contains('particles-helping')).toBe(false)
    })

    it('applies objects-responsive class when building > 4', () => {
      const gameState = createTestGameState({
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 5 }
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('objects-responsive')).toBe(true)
      expect(document.body.classList.contains('building-nearby')).toBe(true)
    })

    it('applies growth-minded class when exploring > 4 (and building <= 4)', () => {
      const gameState = createTestGameState({
        patterns: { analytical: 0, patience: 0, exploring: 5, helping: 0, building: 3 }
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('objects-responsive')).toBe(true)
      expect(document.body.classList.contains('growth-minded')).toBe(true)
    })
  })

  describe('Character atmosphere classes', () => {
    it('applies character class based on highest trust character', () => {
      const gameState = createTestGameState({
        characters: [
          { characterId: 'maya', trust: 5 },
          { characterId: 'devon', trust: 3 },
          { characterId: 'marcus', trust: 7 }
        ] as unknown as GameState['characters']
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('character-atmosphere')).toBe(true)
      expect(document.body.classList.contains('character-marcus')).toBe(true)
      expect(document.body.classList.contains('character-maya')).toBe(false)
    })

    it('defaults to samuel when no characters have trust', () => {
      const gameState = createTestGameState({
        characters: [] as unknown as GameState['characters']
      })

      render(<EnvironmentalEffects gameState={gameState} />)

      expect(document.body.classList.contains('character-atmosphere')).toBe(true)
      expect(document.body.classList.contains('character-samuel')).toBe(true)
    })
  })

  describe('Null gameState handling', () => {
    it('handles null gameState gracefully', () => {
      // Should not throw
      expect(() => {
        render(<EnvironmentalEffects gameState={null} />)
      }).not.toThrow()
    })

    it('does not add classes when gameState is null', () => {
      render(<EnvironmentalEffects gameState={null} />)

      // Body should only have whatever was there before (empty in our test)
      expect(document.body.classList.contains('character-atmosphere')).toBe(false)
    })
  })

  describe('Class cleanup on state change', () => {
    it('removes old pattern classes when gameState changes', () => {
      const helpingState = createTestGameState({
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 7, building: 0 }
      })
      const buildingState = createTestGameState({
        patterns: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 7 }
      })

      const { rerender } = render(<EnvironmentalEffects gameState={helpingState} />)

      expect(document.body.classList.contains('helping-environment')).toBe(true)

      rerender(<EnvironmentalEffects gameState={buildingState} />)

      expect(document.body.classList.contains('helping-environment')).toBe(false)
      expect(document.body.classList.contains('building-environment')).toBe(true)
    })

    it('removes old character classes when highest trust changes', () => {
      const mayaState = createTestGameState({
        characters: [{ characterId: 'maya', trust: 7 }] as unknown as GameState['characters']
      })
      const devonState = createTestGameState({
        characters: [
          { characterId: 'maya', trust: 3 },
          { characterId: 'devon', trust: 8 }
        ] as unknown as GameState['characters']
      })

      const { rerender } = render(<EnvironmentalEffects gameState={mayaState} />)

      expect(document.body.classList.contains('character-maya')).toBe(true)

      rerender(<EnvironmentalEffects gameState={devonState} />)

      expect(document.body.classList.contains('character-maya')).toBe(false)
      expect(document.body.classList.contains('character-devon')).toBe(true)
    })
  })
})
