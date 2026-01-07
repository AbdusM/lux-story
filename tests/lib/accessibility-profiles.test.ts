/**
 * D-030: Accessibility Profiles Tests
 */

import { describe, it, expect } from 'vitest'
import {
  ACCESSIBILITY_PROFILES,
  DEFAULT_SETTINGS,
  PROFILE_METADATA,
  getProfileSettings,
  mergeSettings,
  generateCSSVariables,
  generateCSSClasses,
  getAvailableProfiles,
  validateContrastRatio,
  type AccessibilityProfile,
  type AccessibilitySettings
} from '@/lib/accessibility-profiles'

describe('Accessibility Profiles (D-030)', () => {
  const profiles: AccessibilityProfile[] = [
    'default', 'dyslexia', 'low_vision', 'high_contrast', 'reduced_motion', 'focus_mode'
  ]

  describe('ACCESSIBILITY_PROFILES', () => {
    it('should have settings for all profiles', () => {
      profiles.forEach(profile => {
        expect(ACCESSIBILITY_PROFILES[profile as keyof typeof ACCESSIBILITY_PROFILES]).toBeDefined()
      })
    })

    it('should have valid font family for all profiles', () => {
      profiles.forEach(profile => {
        const settings = ACCESSIBILITY_PROFILES[profile as keyof typeof ACCESSIBILITY_PROFILES]
        expect(['default', 'dyslexic', 'mono', 'sans']).toContain(settings.fontFamily)
      })
    })

    it('should have valid font size for all profiles', () => {
      profiles.forEach(profile => {
        const settings = ACCESSIBILITY_PROFILES[profile as keyof typeof ACCESSIBILITY_PROFILES]
        expect(['normal', 'large', 'x-large']).toContain(settings.fontSize)
      })
    })
  })

  describe('DEFAULT_SETTINGS', () => {
    it('should have all required properties', () => {
      expect(DEFAULT_SETTINGS.fontFamily).toBe('default')
      expect(DEFAULT_SETTINGS.fontSize).toBe('normal')
      expect(DEFAULT_SETTINGS.reduceMotion).toBe(false)
      expect(DEFAULT_SETTINGS.showFocusIndicators).toBe(true)
    })
  })

  describe('PROFILE_METADATA', () => {
    it('should have metadata for all profiles including custom', () => {
      const allProfiles: AccessibilityProfile[] = [...profiles, 'custom']
      allProfiles.forEach(profile => {
        expect(PROFILE_METADATA[profile]).toBeDefined()
        expect(PROFILE_METADATA[profile].label).toBeDefined()
        expect(PROFILE_METADATA[profile].description).toBeDefined()
        expect(PROFILE_METADATA[profile].icon).toBeDefined()
      })
    })
  })

  describe('Dyslexia Profile', () => {
    const dyslexia = ACCESSIBILITY_PROFILES.dyslexia

    it('should use dyslexic font', () => {
      expect(dyslexia.fontFamily).toBe('dyslexic')
    })

    it('should have larger text', () => {
      expect(dyslexia.fontSize).toBe('large')
    })

    it('should have relaxed line height', () => {
      expect(dyslexia.lineHeight).toBe('relaxed')
    })

    it('should have wide letter spacing', () => {
      expect(dyslexia.letterSpacing).toBe('wide')
    })

    it('should reduce motion', () => {
      expect(dyslexia.reduceMotion).toBe(true)
    })
  })

  describe('Low Vision Profile', () => {
    const lowVision = ACCESSIBILITY_PROFILES.low_vision

    it('should use extra large text', () => {
      expect(lowVision.fontSize).toBe('x-large')
    })

    it('should use high contrast', () => {
      expect(lowVision.colorMode).toBe('high-contrast')
    })

    it('should enlarge touch targets', () => {
      expect(lowVision.enlargeTouchTargets).toBe(true)
    })

    it('should simplify UI', () => {
      expect(lowVision.simplifyUI).toBe(true)
    })
  })

  describe('High Contrast Profile', () => {
    const highContrast = ACCESSIBILITY_PROFILES.high_contrast

    it('should use high contrast color mode', () => {
      expect(highContrast.colorMode).toBe('high-contrast')
    })

    it('should reduce transparency', () => {
      expect(highContrast.reduceTransparency).toBe(true)
    })
  })

  describe('Reduced Motion Profile', () => {
    const reducedMotion = ACCESSIBILITY_PROFILES.reduced_motion

    it('should reduce motion', () => {
      expect(reducedMotion.reduceMotion).toBe(true)
    })

    it('should reduce transparency', () => {
      expect(reducedMotion.reduceTransparency).toBe(true)
    })
  })

  describe('getProfileSettings', () => {
    it('should return correct settings for each profile', () => {
      profiles.forEach(profile => {
        const settings = getProfileSettings(profile)
        expect(settings).toEqual(ACCESSIBILITY_PROFILES[profile as keyof typeof ACCESSIBILITY_PROFILES])
      })
    })

    it('should return default settings for custom profile', () => {
      const settings = getProfileSettings('custom')
      expect(settings).toEqual(DEFAULT_SETTINGS)
    })
  })

  describe('mergeSettings', () => {
    it('should merge overrides into base', () => {
      const base = DEFAULT_SETTINGS
      const merged = mergeSettings(base, { fontSize: 'large' })

      expect(merged.fontSize).toBe('large')
      expect(merged.fontFamily).toBe(base.fontFamily)
    })

    it('should not mutate original settings', () => {
      const base = { ...DEFAULT_SETTINGS }
      mergeSettings(base, { reduceMotion: true })

      expect(base.reduceMotion).toBe(false)
    })
  })

  describe('generateCSSVariables', () => {
    it('should generate valid CSS variables', () => {
      const cssVars = generateCSSVariables(DEFAULT_SETTINGS)

      expect(cssVars['--font-family']).toBeDefined()
      expect(cssVars['--font-size-base']).toBeDefined()
      expect(cssVars['--line-height']).toBeDefined()
      expect(cssVars['--text-color']).toBeDefined()
      expect(cssVars['--bg-color']).toBeDefined()
    })

    it('should use larger font sizes for large preset', () => {
      const normalVars = generateCSSVariables(DEFAULT_SETTINGS)
      const largeVars = generateCSSVariables({ ...DEFAULT_SETTINGS, fontSize: 'large' })

      expect(parseFloat(largeVars['--font-size-base']))
        .toBeGreaterThan(parseFloat(normalVars['--font-size-base']))
    })

    it('should disable transitions for reduced motion', () => {
      const reducedMotionVars = generateCSSVariables({
        ...DEFAULT_SETTINGS,
        reduceMotion: true
      })

      expect(reducedMotionVars['--transition-duration']).toBe('0ms')
    })
  })

  describe('generateCSSClasses', () => {
    it('should return empty for default settings', () => {
      const classes = generateCSSClasses(DEFAULT_SETTINGS)
      expect(classes).toBe('')
    })

    it('should include dyslexic class for dyslexic font', () => {
      const classes = generateCSSClasses({
        ...DEFAULT_SETTINGS,
        fontFamily: 'dyslexic'
      })
      expect(classes).toContain('font-dyslexic')
    })

    it('should include high-contrast class', () => {
      const classes = generateCSSClasses({
        ...DEFAULT_SETTINGS,
        colorMode: 'high-contrast'
      })
      expect(classes).toContain('high-contrast')
    })

    it('should include reduce-motion class', () => {
      const classes = generateCSSClasses({
        ...DEFAULT_SETTINGS,
        reduceMotion: true
      })
      expect(classes).toContain('reduce-motion')
    })

    it('should include multiple classes for combined settings', () => {
      const classes = generateCSSClasses({
        ...DEFAULT_SETTINGS,
        colorMode: 'high-contrast',
        reduceMotion: true,
        enlargeTouchTargets: true
      })

      expect(classes).toContain('high-contrast')
      expect(classes).toContain('reduce-motion')
      expect(classes).toContain('large-touch-targets')
    })
  })

  describe('getAvailableProfiles', () => {
    it('should return all profiles including custom', () => {
      const available = getAvailableProfiles()

      expect(available).toContain('default')
      expect(available).toContain('dyslexia')
      expect(available).toContain('custom')
      expect(available.length).toBe(7)
    })
  })

  describe('validateContrastRatio', () => {
    it('should pass AA for white on black', () => {
      const result = validateContrastRatio('#ffffff', '#000000')
      expect(result.passesAA).toBe(true)
      expect(result.passesAAA).toBe(true)
    })

    it('should calculate reasonable ratio for similar colors', () => {
      const result = validateContrastRatio('#888888', '#999999')
      expect(result.ratio).toBeGreaterThan(0)
      expect(result.ratio).toBeLessThan(2)
    })
  })
})
