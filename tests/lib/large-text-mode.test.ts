/**
 * D-080: Large Text Mode Tests
 */

import { describe, it, expect } from 'vitest'
import {
  TEXT_SIZE_CONFIGS,
  TEXT_SIZE_LABELS,
  TEXT_SIZE_DESCRIPTIONS,
  getTextSizeCSSProperties,
  getTextSizeClass,
  getResponsiveTextSize,
  willTextFit,
  getMaxSafeFontSize,
  getOverflowStrategy,
  getNextLargerSize,
  getNextSmallerSize,
  isWCAGLargeText,
  getAvailableTextSizes,
  type TextSizePreset
} from '@/lib/large-text-mode'

describe('Large Text Mode (D-080)', () => {
  const presets: TextSizePreset[] = ['default', 'large', 'x-large', 'xx-large']

  describe('TEXT_SIZE_CONFIGS', () => {
    it('should have configs for all presets', () => {
      presets.forEach(preset => {
        expect(TEXT_SIZE_CONFIGS[preset]).toBeDefined()
      })
    })

    it('should have increasing scale multipliers', () => {
      expect(TEXT_SIZE_CONFIGS.default.scaleMultiplier).toBe(1)
      expect(TEXT_SIZE_CONFIGS.large.scaleMultiplier).toBe(1.25)
      expect(TEXT_SIZE_CONFIGS['x-large'].scaleMultiplier).toBe(1.5)
      expect(TEXT_SIZE_CONFIGS['xx-large'].scaleMultiplier).toBe(2)
    })

    it('should have increasing base sizes', () => {
      expect(TEXT_SIZE_CONFIGS.large.baseSize)
        .toBeGreaterThan(TEXT_SIZE_CONFIGS.default.baseSize)
      expect(TEXT_SIZE_CONFIGS['x-large'].baseSize)
        .toBeGreaterThan(TEXT_SIZE_CONFIGS.large.baseSize)
      expect(TEXT_SIZE_CONFIGS['xx-large'].baseSize)
        .toBeGreaterThan(TEXT_SIZE_CONFIGS['x-large'].baseSize)
    })

    it('should enable container awareness for large sizes', () => {
      expect(TEXT_SIZE_CONFIGS.default.containerAware).toBe(false)
      expect(TEXT_SIZE_CONFIGS.large.containerAware).toBe(true)
      expect(TEXT_SIZE_CONFIGS['x-large'].containerAware).toBe(true)
      expect(TEXT_SIZE_CONFIGS['xx-large'].containerAware).toBe(true)
    })
  })

  describe('TEXT_SIZE_LABELS', () => {
    it('should have labels for all presets', () => {
      presets.forEach(preset => {
        expect(TEXT_SIZE_LABELS[preset]).toBeDefined()
        expect(typeof TEXT_SIZE_LABELS[preset]).toBe('string')
      })
    })

    it('should show percentage values', () => {
      expect(TEXT_SIZE_LABELS.default).toContain('100%')
      expect(TEXT_SIZE_LABELS.large).toContain('125%')
      expect(TEXT_SIZE_LABELS['x-large']).toContain('150%')
      expect(TEXT_SIZE_LABELS['xx-large']).toContain('200%')
    })
  })

  describe('TEXT_SIZE_DESCRIPTIONS', () => {
    it('should have descriptions for all presets', () => {
      presets.forEach(preset => {
        expect(TEXT_SIZE_DESCRIPTIONS[preset]).toBeDefined()
        expect(TEXT_SIZE_DESCRIPTIONS[preset].length).toBeGreaterThan(10)
      })
    })
  })

  describe('getTextSizeCSSProperties', () => {
    it('should return CSS properties object', () => {
      const props = getTextSizeCSSProperties('default')

      expect(props['--text-scale']).toBeDefined()
      expect(props['--text-base']).toBeDefined()
      expect(props['--text-sm']).toBeDefined()
      expect(props['--text-lg']).toBeDefined()
    })

    it('should scale values for larger presets', () => {
      const defaultProps = getTextSizeCSSProperties('default')
      const largeProps = getTextSizeCSSProperties('large')

      expect(parseFloat(largeProps['--text-base']))
        .toBeGreaterThan(parseFloat(defaultProps['--text-base']))
    })

    it('should include all size variants', () => {
      const props = getTextSizeCSSProperties('x-large')

      expect(props['--text-xs']).toBeDefined()
      expect(props['--text-sm']).toBeDefined()
      expect(props['--text-base']).toBeDefined()
      expect(props['--text-lg']).toBeDefined()
      expect(props['--text-xl']).toBeDefined()
      expect(props['--text-2xl']).toBeDefined()
      expect(props['--text-3xl']).toBeDefined()
    })
  })

  describe('getTextSizeClass', () => {
    it('should return empty string for default', () => {
      expect(getTextSizeClass('default')).toBe('')
    })

    it('should return correct class for other presets', () => {
      expect(getTextSizeClass('large')).toBe('text-size-large')
      expect(getTextSizeClass('x-large')).toBe('text-size-x-large')
      expect(getTextSizeClass('xx-large')).toBe('text-size-xx-large')
    })
  })

  describe('getResponsiveTextSize', () => {
    it('should return clamp() function', () => {
      const result = getResponsiveTextSize(1, 'large')
      expect(result).toContain('clamp(')
    })

    it('should include rem units', () => {
      const result = getResponsiveTextSize(1, 'x-large')
      expect(result).toContain('rem')
    })
  })

  describe('willTextFit', () => {
    it('should return true for short text in wide container', () => {
      expect(willTextFit('Hello', 500, 1)).toBe(true)
    })

    it('should return false for long text in narrow container', () => {
      const longText = 'This is a very long text that will not fit in a narrow container'
      expect(willTextFit(longText, 100, 1)).toBe(false)
    })

    it('should consider font size', () => {
      const text = 'Medium length text'
      const narrowWidth = 150

      // Should fit at normal size but not at 2x
      expect(willTextFit(text, narrowWidth, 1)).toBe(true)
      expect(willTextFit(text, narrowWidth, 2)).toBe(false)
    })
  })

  describe('getMaxSafeFontSize', () => {
    it('should return xx-large for short text', () => {
      expect(getMaxSafeFontSize('Hi', 500)).toBe('xx-large')
    })

    it('should return smaller size for longer text', () => {
      const longText = 'This is a much longer text that needs more space'
      const result = getMaxSafeFontSize(longText, 200)

      // Should be smaller than xx-large
      expect(['default', 'large', 'x-large']).toContain(result)
    })
  })

  describe('getOverflowStrategy', () => {
    it('should return wrap for dialogue', () => {
      expect(getOverflowStrategy('default', 'dialogue')).toBe('wrap')
      expect(getOverflowStrategy('xx-large', 'dialogue')).toBe('wrap')
    })

    it('should return scale-down for large buttons', () => {
      expect(getOverflowStrategy('xx-large', 'button')).toBe('scale-down')
    })

    it('should return scroll for large choice text', () => {
      expect(getOverflowStrategy('xx-large', 'choice')).toBe('scroll')
    })

    it('should return truncate for normal button', () => {
      expect(getOverflowStrategy('default', 'button')).toBe('truncate')
    })
  })

  describe('getNextLargerSize', () => {
    it('should return next size up', () => {
      expect(getNextLargerSize('default')).toBe('large')
      expect(getNextLargerSize('large')).toBe('x-large')
      expect(getNextLargerSize('x-large')).toBe('xx-large')
    })

    it('should return same size at maximum', () => {
      expect(getNextLargerSize('xx-large')).toBe('xx-large')
    })
  })

  describe('getNextSmallerSize', () => {
    it('should return next size down', () => {
      expect(getNextSmallerSize('xx-large')).toBe('x-large')
      expect(getNextSmallerSize('x-large')).toBe('large')
      expect(getNextSmallerSize('large')).toBe('default')
    })

    it('should return same size at minimum', () => {
      expect(getNextSmallerSize('default')).toBe('default')
    })
  })

  describe('isWCAGLargeText', () => {
    it('should return false for default size', () => {
      expect(isWCAGLargeText('default')).toBe(false)
    })

    it('should return true for x-large and above', () => {
      expect(isWCAGLargeText('x-large')).toBe(true)
      expect(isWCAGLargeText('xx-large')).toBe(true)
    })
  })

  describe('getAvailableTextSizes', () => {
    it('should return all 4 sizes', () => {
      const sizes = getAvailableTextSizes()
      expect(sizes.length).toBe(4)
    })

    it('should return sizes in order', () => {
      const sizes = getAvailableTextSizes()
      expect(sizes[0]).toBe('default')
      expect(sizes[1]).toBe('large')
      expect(sizes[2]).toBe('x-large')
      expect(sizes[3]).toBe('xx-large')
    })
  })
})
