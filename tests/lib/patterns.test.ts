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
  getAccessiblePatternColor,
  getPatternColorPalette,
  COLOR_BLIND_PALETTES,
  COLOR_BLIND_MODE_LABELS,
  type PatternType,
  type ColorBlindMode
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

  // D-077: Color Blind Pattern Modes
  describe('Color Blind Modes (D-077)', () => {
    const colorBlindModes: ColorBlindMode[] = ['default', 'protanopia', 'deuteranopia', 'tritanopia', 'highContrast']

    describe('COLOR_BLIND_PALETTES', () => {
      it('should have palettes for all modes', () => {
        colorBlindModes.forEach(mode => {
          expect(COLOR_BLIND_PALETTES[mode]).toBeDefined()
        })
      })

      it('should have colors for all patterns in each mode', () => {
        colorBlindModes.forEach(mode => {
          PATTERN_TYPES.forEach((pattern: PatternType) => {
            const color = COLOR_BLIND_PALETTES[mode][pattern]
            expect(color).toBeDefined()
            expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
          })
        })
      })

      it('default palette should match PATTERN_METADATA colors', () => {
        PATTERN_TYPES.forEach((pattern: PatternType) => {
          expect(COLOR_BLIND_PALETTES.default[pattern]).toBe(PATTERN_METADATA[pattern].color)
        })
      })
    })

    describe('getAccessiblePatternColor', () => {
      it('should return default color when mode is default', () => {
        expect(getAccessiblePatternColor('analytical', 'default')).toBe('#3B82F6')
        expect(getAccessiblePatternColor('patience', 'default')).toBe('#10B981')
      })

      it('should return protanopia-optimized color', () => {
        expect(getAccessiblePatternColor('analytical', 'protanopia')).toBe('#0077BB')
        expect(getAccessiblePatternColor('patience', 'protanopia')).toBe('#33BBEE')
      })

      it('should return high contrast colors', () => {
        expect(getAccessiblePatternColor('analytical', 'highContrast')).toBe('#0000FF')
        expect(getAccessiblePatternColor('patience', 'highContrast')).toBe('#00FF00')
      })

      it('should return gray for invalid pattern', () => {
        expect(getAccessiblePatternColor('invalid', 'default')).toBe('#6B7280')
      })

      it('should default to default mode if mode not specified', () => {
        expect(getAccessiblePatternColor('analytical')).toBe('#3B82F6')
      })
    })

    describe('getPatternColorPalette', () => {
      it('should return complete palette for mode', () => {
        const palette = getPatternColorPalette('protanopia')
        expect(Object.keys(palette)).toHaveLength(5)
        expect(palette.analytical).toBe('#0077BB')
      })

      it('should default to default palette', () => {
        const palette = getPatternColorPalette()
        expect(palette.analytical).toBe('#3B82F6')
      })
    })

    describe('COLOR_BLIND_MODE_LABELS', () => {
      it('should have labels for all modes', () => {
        colorBlindModes.forEach(mode => {
          expect(COLOR_BLIND_MODE_LABELS[mode]).toBeDefined()
          expect(typeof COLOR_BLIND_MODE_LABELS[mode]).toBe('string')
        })
      })
    })
  })
})
