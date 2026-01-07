/**
 * D-078: Cognitive Load Adjustment Tests
 */

import { describe, it, expect } from 'vitest'
import {
  COGNITIVE_LOAD_CONFIG,
  COGNITIVE_LOAD_LABELS,
  COGNITIVE_LOAD_DESCRIPTIONS,
  getCognitiveLoadConfig,
  filterChoicesByLoad,
  truncateTextForLoad,
  getAnimationSpeedMultiplier,
  getReadingTimeMultiplier,
  shouldShowSubtext,
  shouldShowPatternHints,
  getAdjustedDelay,
  type CognitiveLoadLevel
} from '@/lib/cognitive-load'
import type { EvaluatedChoice } from '@/lib/dialogue-graph'

// Mock choices for testing
const mockChoices: EvaluatedChoice[] = [
  { choice: { choiceId: '1', text: 'Critical choice', nextNodeId: 'node1' }, visible: true, enabled: true },
  { choice: { choiceId: '2', text: 'Analytical choice', nextNodeId: 'node2', pattern: 'analytical' }, visible: true, enabled: true },
  { choice: { choiceId: '3', text: 'Helping choice', nextNodeId: 'node3', pattern: 'helping' }, visible: true, enabled: true },
  { choice: { choiceId: '4', text: 'Building choice', nextNodeId: 'node4', pattern: 'building' }, visible: true, enabled: true },
  { choice: { choiceId: '5', text: 'Patience choice', nextNodeId: 'node5', pattern: 'patience' }, visible: true, enabled: true },
  { choice: { choiceId: '6', text: 'Exploring choice', nextNodeId: 'node6', pattern: 'exploring' }, visible: true, enabled: true }
]

describe('Cognitive Load System (D-078)', () => {
  const levels: CognitiveLoadLevel[] = ['minimal', 'reduced', 'normal', 'detailed']

  describe('COGNITIVE_LOAD_CONFIG', () => {
    it('should have configuration for all levels', () => {
      levels.forEach(level => {
        expect(COGNITIVE_LOAD_CONFIG[level]).toBeDefined()
      })
    })

    it('should have valid maxChoices for each level', () => {
      expect(COGNITIVE_LOAD_CONFIG.minimal.maxChoices).toBe(2)
      expect(COGNITIVE_LOAD_CONFIG.reduced.maxChoices).toBe(3)
      expect(COGNITIVE_LOAD_CONFIG.normal.maxChoices).toBe(5)
      expect(COGNITIVE_LOAD_CONFIG.detailed.maxChoices).toBe(8)
    })

    it('should have increasing maxChoices from minimal to detailed', () => {
      expect(COGNITIVE_LOAD_CONFIG.minimal.maxChoices)
        .toBeLessThan(COGNITIVE_LOAD_CONFIG.reduced.maxChoices)
      expect(COGNITIVE_LOAD_CONFIG.reduced.maxChoices)
        .toBeLessThan(COGNITIVE_LOAD_CONFIG.normal.maxChoices)
      expect(COGNITIVE_LOAD_CONFIG.normal.maxChoices)
        .toBeLessThan(COGNITIVE_LOAD_CONFIG.detailed.maxChoices)
    })

    it('should have slower animations for minimal level', () => {
      expect(COGNITIVE_LOAD_CONFIG.minimal.animationSpeed).toBeLessThan(1)
      expect(COGNITIVE_LOAD_CONFIG.normal.animationSpeed).toBe(1)
    })

    it('should have longer reading time for minimal level', () => {
      expect(COGNITIVE_LOAD_CONFIG.minimal.readingTimeMultiplier)
        .toBeGreaterThan(COGNITIVE_LOAD_CONFIG.normal.readingTimeMultiplier)
    })
  })

  describe('COGNITIVE_LOAD_LABELS', () => {
    it('should have labels for all levels', () => {
      levels.forEach(level => {
        expect(COGNITIVE_LOAD_LABELS[level]).toBeDefined()
        expect(typeof COGNITIVE_LOAD_LABELS[level]).toBe('string')
      })
    })
  })

  describe('COGNITIVE_LOAD_DESCRIPTIONS', () => {
    it('should have descriptions for all levels', () => {
      levels.forEach(level => {
        expect(COGNITIVE_LOAD_DESCRIPTIONS[level]).toBeDefined()
        expect(COGNITIVE_LOAD_DESCRIPTIONS[level].length).toBeGreaterThan(20)
      })
    })
  })

  describe('getCognitiveLoadConfig', () => {
    it('should return correct config for each level', () => {
      expect(getCognitiveLoadConfig('minimal').maxChoices).toBe(2)
      expect(getCognitiveLoadConfig('detailed').maxChoices).toBe(8)
    })
  })

  describe('filterChoicesByLoad', () => {
    it('should return all choices if under max limit', () => {
      const twoChoices = mockChoices.slice(0, 2)
      const result = filterChoicesByLoad(twoChoices, 'minimal')
      expect(result).toHaveLength(2)
    })

    it('should limit choices based on level', () => {
      expect(filterChoicesByLoad(mockChoices, 'minimal')).toHaveLength(2)
      expect(filterChoicesByLoad(mockChoices, 'reduced')).toHaveLength(3)
      expect(filterChoicesByLoad(mockChoices, 'normal')).toHaveLength(5)
      expect(filterChoicesByLoad(mockChoices, 'detailed')).toHaveLength(6) // All 6
    })

    it('should prioritize critical choices (no pattern)', () => {
      const result = filterChoicesByLoad(mockChoices, 'minimal')
      // Critical choice (no pattern) should be first
      expect(result[0].choice.text).toBe('Critical choice')
    })

    it('should prioritize dominant pattern choices', () => {
      const result = filterChoicesByLoad(mockChoices, 'reduced', 'helping')
      // Should include critical and helping choices
      const texts = result.map(c => c.choice.text)
      expect(texts).toContain('Critical choice')
      expect(texts).toContain('Helping choice')
    })
  })

  describe('truncateTextForLoad', () => {
    const longText = 'This is a very long text that exceeds the maximum text length allowed for the minimal cognitive load level setting.'

    it('should not truncate short text', () => {
      const shortText = 'Short text'
      expect(truncateTextForLoad(shortText, 'minimal')).toBe(shortText)
    })

    it('should truncate text exceeding maxTextLength', () => {
      const result = truncateTextForLoad(longText, 'minimal')
      expect(result.length).toBeLessThanOrEqual(63) // 60 + '...'
      expect(result.slice(-3)).toBe('...')
    })

    it('should not truncate for detailed level with longer limit', () => {
      const result = truncateTextForLoad(longText, 'detailed')
      expect(result).toBe(longText) // Under 300 char limit
    })
  })

  describe('getAnimationSpeedMultiplier', () => {
    it('should return slower speed for minimal', () => {
      expect(getAnimationSpeedMultiplier('minimal')).toBe(0.5)
    })

    it('should return normal speed for normal level', () => {
      expect(getAnimationSpeedMultiplier('normal')).toBe(1.0)
    })
  })

  describe('getReadingTimeMultiplier', () => {
    it('should return higher multiplier for minimal', () => {
      expect(getReadingTimeMultiplier('minimal')).toBe(1.5)
    })

    it('should return lower multiplier for detailed', () => {
      expect(getReadingTimeMultiplier('detailed')).toBe(0.8)
    })
  })

  describe('shouldShowSubtext', () => {
    it('should return false for minimal/reduced', () => {
      expect(shouldShowSubtext('minimal')).toBe(false)
      expect(shouldShowSubtext('reduced')).toBe(false)
    })

    it('should return true for normal/detailed', () => {
      expect(shouldShowSubtext('normal')).toBe(true)
      expect(shouldShowSubtext('detailed')).toBe(true)
    })
  })

  describe('shouldShowPatternHints', () => {
    it('should return false for minimal/reduced', () => {
      expect(shouldShowPatternHints('minimal')).toBe(false)
      expect(shouldShowPatternHints('reduced')).toBe(false)
    })

    it('should return true for normal/detailed', () => {
      expect(shouldShowPatternHints('normal')).toBe(true)
      expect(shouldShowPatternHints('detailed')).toBe(true)
    })
  })

  describe('getAdjustedDelay', () => {
    it('should increase delay for slower animation speeds', () => {
      const baseDelay = 100
      // Minimal has 0.5 speed, so delay should be doubled
      expect(getAdjustedDelay(baseDelay, 'minimal')).toBe(200)
    })

    it('should return same delay for normal speed', () => {
      const baseDelay = 100
      expect(getAdjustedDelay(baseDelay, 'normal')).toBe(100)
    })
  })
})
