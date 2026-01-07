/**
 * D-030: Visual Accessibility Profiles
 * One-click profiles for dyslexia, low vision, high contrast, and more
 *
 * WCAG 2.1 AA compliance target
 * Supports prefers-reduced-motion and prefers-color-scheme
 */

import { ColorBlindMode, getPatternColorPalette } from './patterns'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Accessibility profile presets
 */
export type AccessibilityProfile =
  | 'default'        // Standard experience
  | 'dyslexia'       // OpenDyslexic font, increased spacing
  | 'low_vision'     // Large text, high contrast, simplified UI
  | 'high_contrast'  // Maximum contrast, bold outlines
  | 'reduced_motion' // Minimal animations, static UI
  | 'focus_mode'     // Reduced distractions, essential UI only
  | 'custom'         // User-defined combination

/**
 * Individual accessibility settings
 */
export interface AccessibilitySettings {
  // Typography
  fontFamily: 'default' | 'dyslexic' | 'mono' | 'sans'
  fontSize: 'normal' | 'large' | 'x-large'
  lineHeight: 'normal' | 'relaxed' | 'loose'
  letterSpacing: 'normal' | 'wide' | 'wider'
  wordSpacing: 'normal' | 'wide' | 'wider'

  // Colors
  colorMode: 'default' | 'high-contrast' | 'dark' | 'light'
  colorBlindMode: ColorBlindMode

  // Motion
  reduceMotion: boolean
  reduceTransparency: boolean

  // UI
  showFocusIndicators: boolean
  enlargeTouchTargets: boolean
  simplifyUI: boolean
  showTooltips: boolean

  // Audio (future)
  screenReaderOptimized: boolean
}

/**
 * CSS variable overrides for a profile
 */
export interface ProfileCSSVariables {
  '--font-family': string
  '--font-size-base': string
  '--font-size-lg': string
  '--font-size-sm': string
  '--line-height': string
  '--letter-spacing': string
  '--word-spacing': string
  '--text-color': string
  '--bg-color': string
  '--accent-color': string
  '--border-width': string
  '--focus-ring-width': string
  '--touch-target-min': string
  '--transition-duration': string
  '--backdrop-blur': string
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontFamily: 'default',
  fontSize: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  wordSpacing: 'normal',
  colorMode: 'default',
  colorBlindMode: 'default',
  reduceMotion: false,
  reduceTransparency: false,
  showFocusIndicators: true,
  enlargeTouchTargets: false,
  simplifyUI: false,
  showTooltips: true,
  screenReaderOptimized: false
}

/**
 * Profile presets
 */
export const ACCESSIBILITY_PROFILES: Record<
  Exclude<AccessibilityProfile, 'custom'>,
  AccessibilitySettings
> = {
  default: { ...DEFAULT_SETTINGS },

  dyslexia: {
    ...DEFAULT_SETTINGS,
    fontFamily: 'dyslexic',
    fontSize: 'large',
    lineHeight: 'relaxed',
    letterSpacing: 'wide',
    wordSpacing: 'wide',
    reduceMotion: true
  },

  low_vision: {
    ...DEFAULT_SETTINGS,
    fontSize: 'x-large',
    lineHeight: 'loose',
    letterSpacing: 'wider',
    colorMode: 'high-contrast',
    enlargeTouchTargets: true,
    simplifyUI: true,
    reduceTransparency: true
  },

  high_contrast: {
    ...DEFAULT_SETTINGS,
    colorMode: 'high-contrast',
    reduceTransparency: true,
    showFocusIndicators: true
  },

  reduced_motion: {
    ...DEFAULT_SETTINGS,
    reduceMotion: true,
    reduceTransparency: true
  },

  focus_mode: {
    ...DEFAULT_SETTINGS,
    simplifyUI: true,
    reduceMotion: true,
    showTooltips: false
  }
}

/**
 * Profile labels and descriptions
 */
export const PROFILE_METADATA: Record<AccessibilityProfile, {
  label: string
  description: string
  icon: string
}> = {
  default: {
    label: 'Standard',
    description: 'Default visual experience',
    icon: '👁️'
  },
  dyslexia: {
    label: 'Dyslexia Friendly',
    description: 'OpenDyslexic font, increased spacing, reduced motion',
    icon: '📖'
  },
  low_vision: {
    label: 'Low Vision',
    description: 'Large text, high contrast, simplified interface',
    icon: '🔍'
  },
  high_contrast: {
    label: 'High Contrast',
    description: 'Maximum contrast for better visibility',
    icon: '◐'
  },
  reduced_motion: {
    label: 'Reduced Motion',
    description: 'Minimal animations for motion sensitivity',
    icon: '⏸️'
  },
  focus_mode: {
    label: 'Focus Mode',
    description: 'Simplified UI, fewer distractions',
    icon: '🎯'
  },
  custom: {
    label: 'Custom',
    description: 'Your personalized settings',
    icon: '⚙️'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CSS GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Font family CSS values
 */
const FONT_FAMILIES: Record<AccessibilitySettings['fontFamily'], string> = {
  default: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
  dyslexic: '"OpenDyslexic", "Comic Sans MS", sans-serif',
  mono: 'var(--font-mono, ui-monospace, monospace)',
  sans: 'ui-sans-serif, system-ui, -apple-system, sans-serif'
}

/**
 * Font size CSS values
 */
const FONT_SIZES: Record<AccessibilitySettings['fontSize'], {
  base: string
  lg: string
  sm: string
}> = {
  normal: { base: '1rem', lg: '1.125rem', sm: '0.875rem' },
  large: { base: '1.25rem', lg: '1.5rem', sm: '1rem' },
  'x-large': { base: '1.5rem', lg: '1.875rem', sm: '1.25rem' }
}

/**
 * Line height CSS values
 */
const LINE_HEIGHTS: Record<AccessibilitySettings['lineHeight'], string> = {
  normal: '1.5',
  relaxed: '1.75',
  loose: '2'
}

/**
 * Letter spacing CSS values
 */
const LETTER_SPACINGS: Record<AccessibilitySettings['letterSpacing'], string> = {
  normal: 'normal',
  wide: '0.025em',
  wider: '0.05em'
}

/**
 * Word spacing CSS values
 */
const WORD_SPACINGS: Record<AccessibilitySettings['wordSpacing'], string> = {
  normal: 'normal',
  wide: '0.1em',
  wider: '0.2em'
}

/**
 * Color mode CSS values
 */
const COLOR_MODES: Record<AccessibilitySettings['colorMode'], {
  text: string
  bg: string
  accent: string
}> = {
  default: {
    text: 'rgba(255, 255, 255, 0.9)',
    bg: 'rgba(10, 12, 16, 0.85)',
    accent: '#f59e0b'
  },
  'high-contrast': {
    text: '#ffffff',
    bg: '#000000',
    accent: '#ffff00'
  },
  dark: {
    text: '#e5e5e5',
    bg: '#171717',
    accent: '#f59e0b'
  },
  light: {
    text: '#171717',
    bg: '#fafafa',
    accent: '#d97706'
  }
}

/**
 * Generate CSS variables for settings
 */
export function generateCSSVariables(settings: AccessibilitySettings): ProfileCSSVariables {
  const fontSizes = FONT_SIZES[settings.fontSize]
  const colors = COLOR_MODES[settings.colorMode]

  return {
    '--font-family': FONT_FAMILIES[settings.fontFamily],
    '--font-size-base': fontSizes.base,
    '--font-size-lg': fontSizes.lg,
    '--font-size-sm': fontSizes.sm,
    '--line-height': LINE_HEIGHTS[settings.lineHeight],
    '--letter-spacing': LETTER_SPACINGS[settings.letterSpacing],
    '--word-spacing': WORD_SPACINGS[settings.wordSpacing],
    '--text-color': colors.text,
    '--bg-color': colors.bg,
    '--accent-color': colors.accent,
    '--border-width': settings.colorMode === 'high-contrast' ? '2px' : '1px',
    '--focus-ring-width': settings.showFocusIndicators ? '3px' : '2px',
    '--touch-target-min': settings.enlargeTouchTargets ? '56px' : '44px',
    '--transition-duration': settings.reduceMotion ? '0ms' : '200ms',
    '--backdrop-blur': settings.reduceTransparency ? '0px' : '8px'
  }
}

/**
 * Generate CSS class string for settings
 */
export function generateCSSClasses(settings: AccessibilitySettings): string {
  const classes: string[] = []

  if (settings.fontFamily === 'dyslexic') classes.push('font-dyslexic')
  if (settings.fontSize === 'large') classes.push('text-lg-all')
  if (settings.fontSize === 'x-large') classes.push('text-xl-all')
  if (settings.lineHeight === 'relaxed') classes.push('leading-relaxed-all')
  if (settings.lineHeight === 'loose') classes.push('leading-loose-all')
  if (settings.colorMode === 'high-contrast') classes.push('high-contrast')
  if (settings.reduceMotion) classes.push('reduce-motion')
  if (settings.reduceTransparency) classes.push('reduce-transparency')
  if (settings.enlargeTouchTargets) classes.push('large-touch-targets')
  if (settings.simplifyUI) classes.push('simplified-ui')
  if (settings.screenReaderOptimized) classes.push('sr-optimized')

  return classes.join(' ')
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get settings for a profile
 */
export function getProfileSettings(profile: AccessibilityProfile): AccessibilitySettings {
  if (profile === 'custom') {
    return { ...DEFAULT_SETTINGS }
  }
  return { ...ACCESSIBILITY_PROFILES[profile] }
}

/**
 * Merge custom settings with a base profile
 */
export function mergeSettings(
  base: AccessibilitySettings,
  overrides: Partial<AccessibilitySettings>
): AccessibilitySettings {
  return { ...base, ...overrides }
}

/**
 * Detect system preferences and suggest a profile
 */
export function detectSystemPreferences(): Partial<AccessibilitySettings> {
  if (typeof window === 'undefined') return {}

  const preferences: Partial<AccessibilitySettings> = {}

  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    preferences.reduceMotion = true
  }

  // Check color scheme preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    preferences.colorMode = 'dark'
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    preferences.colorMode = 'light'
  }

  // Check contrast preference
  if (window.matchMedia('(prefers-contrast: more)').matches) {
    preferences.colorMode = 'high-contrast'
  }

  // Check transparency preference
  if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) {
    preferences.reduceTransparency = true
  }

  return preferences
}

/**
 * Suggest best profile based on system preferences
 */
export function suggestProfile(): AccessibilityProfile {
  const prefs = detectSystemPreferences()

  if (prefs.colorMode === 'high-contrast') return 'high_contrast'
  if (prefs.reduceMotion) return 'reduced_motion'

  return 'default'
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate color contrast ratio (WCAG AA requires 4.5:1 for normal text)
 */
export function validateContrastRatio(
  foreground: string,
  background: string
): { ratio: number; passesAA: boolean; passesAAA: boolean } {
  // Simplified contrast calculation
  // In production, use a proper color library
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = rgb & 0xff

    const toLinear = (c: number) => {
      const s = c / 255
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    }

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  }

  try {
    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

    return {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7
    }
  } catch {
    return { ratio: 0, passesAA: false, passesAAA: false }
  }
}

/**
 * Get all available profiles
 */
export function getAvailableProfiles(): AccessibilityProfile[] {
  return ['default', 'dyslexia', 'low_vision', 'high_contrast', 'reduced_motion', 'focus_mode', 'custom']
}
