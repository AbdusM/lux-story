/**
 * Pattern System Tests
 *
 * Verifies core pattern functionality:
 * - Type validation
 * - Color mappings
 * - Sensation generation
 */

import { describe, it, expect } from 'vitest'
import {
  PATTERN_TYPES,
  isValidPattern,
  PATTERN_METADATA,
  type PatternType
} from '@/lib/patterns'

describe('Pattern System', () => {
  describe('PATTERN_TYPES', () => {
    it('should have exactly 5 patterns', () => {
      expect(PATTERN_TYPES).toHaveLength(5)
    })

    it('should include all expected patterns', () => {
      expect(PATTERN_TYPES).toContain('analytical')
      expect(PATTERN_TYPES).toContain('patience')
      expect(PATTERN_TYPES).toContain('exploring')
      expect(PATTERN_TYPES).toContain('helping')
      expect(PATTERN_TYPES).toContain('building')
    })
  })

  describe('isValidPattern', () => {
    it('should return true for valid patterns', () => {
      expect(isValidPattern('analytical')).toBe(true)
      expect(isValidPattern('patience')).toBe(true)
      expect(isValidPattern('exploring')).toBe(true)
      expect(isValidPattern('helping')).toBe(true)
      expect(isValidPattern('building')).toBe(true)
    })

    it('should return false for invalid patterns', () => {
      expect(isValidPattern('invalid')).toBe(false)
      expect(isValidPattern('')).toBe(false)
      expect(isValidPattern('ANALYTICAL')).toBe(false) // Case sensitive
      expect(isValidPattern('patience ')).toBe(false) // Whitespace
    })
  })

  describe('PATTERN_METADATA', () => {
    it('should have metadata for all patterns', () => {
      PATTERN_TYPES.forEach((pattern: PatternType) => {
        expect(PATTERN_METADATA[pattern]).toBeDefined()
        expect(PATTERN_METADATA[pattern].color).toBeDefined()
        expect(PATTERN_METADATA[pattern].label).toBeDefined()
      })
    })

    it('should have valid color values', () => {
      PATTERN_TYPES.forEach((pattern: PatternType) => {
        const color = PATTERN_METADATA[pattern].color
        // Color should be a hex color string
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })
  })
})
