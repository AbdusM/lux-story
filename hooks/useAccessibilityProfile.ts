/**
 * D-030: Accessibility Profile Hook
 * Manages user's accessibility preferences
 * Persists to localStorage and applies CSS variables to document
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  AccessibilityProfile,
  AccessibilitySettings,
  getProfileSettings,
  mergeSettings,
  generateCSSVariables,
  generateCSSClasses,
  detectSystemPreferences,
  DEFAULT_SETTINGS,
  PROFILE_METADATA
} from '@/lib/accessibility-profiles'

const STORAGE_KEY = 'lux_accessibility_profile'
const SETTINGS_KEY = 'lux_accessibility_settings'

/**
 * Hook for managing accessibility profile
 */
export function useAccessibilityProfile() {
  const [profile, setProfileState] = useState<AccessibilityProfile>('default')
  const [customSettings, setCustomSettingsState] = useState<Partial<AccessibilitySettings>>({})

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedProfile = localStorage.getItem(STORAGE_KEY)
    if (storedProfile && isValidProfile(storedProfile)) {
      setProfileState(storedProfile as AccessibilityProfile)
    }

    const storedSettings = localStorage.getItem(SETTINGS_KEY)
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings)
        setCustomSettingsState(parsed)
      } catch {
        // Invalid JSON, ignore
      }
    }

    // Apply system preferences on first load
    const systemPrefs = detectSystemPreferences()
    if (Object.keys(systemPrefs).length > 0 && !storedProfile) {
      setCustomSettingsState(prev => ({ ...prev, ...systemPrefs }))
    }
  }, [])

  // Compute effective settings
  const settings = useMemo<AccessibilitySettings>(() => {
    const base = getProfileSettings(profile)
    return profile === 'custom' ? mergeSettings(base, customSettings) : base
  }, [profile, customSettings])

  // Apply CSS variables to document
  useEffect(() => {
    if (typeof window === 'undefined') return

    const cssVars = generateCSSVariables(settings)
    const root = document.documentElement

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // Apply classes
    const classes = generateCSSClasses(settings)
    const classesToRemove = [
      'font-dyslexic', 'text-lg-all', 'text-xl-all',
      'leading-relaxed-all', 'leading-loose-all',
      'high-contrast', 'reduce-motion', 'reduce-transparency',
      'large-touch-targets', 'simplified-ui', 'sr-optimized'
    ]

    classesToRemove.forEach(c => root.classList.remove(c))
    classes.split(' ').filter(Boolean).forEach(c => root.classList.add(c))

    return () => {
      // Cleanup on unmount
      classesToRemove.forEach(c => root.classList.remove(c))
    }
  }, [settings])

  // Set profile
  const setProfile = useCallback((newProfile: AccessibilityProfile) => {
    setProfileState(newProfile)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newProfile)
    }
  }, [])

  // Update custom settings
  const updateSettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    setCustomSettingsState(prev => {
      const merged = { ...prev, ...updates }
      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
      }
      return merged
    })
    // Auto-switch to custom profile when changing individual settings
    if (profile !== 'custom') {
      setProfile('custom')
    }
  }, [profile, setProfile])

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setProfileState('default')
    setCustomSettingsState({})
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(SETTINGS_KEY)
    }
  }, [])

  // Get available profiles with metadata
  const profiles = useMemo(() => {
    return (Object.keys(PROFILE_METADATA) as AccessibilityProfile[]).map(p => ({
      id: p,
      ...PROFILE_METADATA[p]
    }))
  }, [])

  return {
    profile,
    setProfile,
    settings,
    updateSettings,
    resetToDefaults,
    profiles,
    isCustom: profile === 'custom'
  }
}

/**
 * Validate profile string
 */
function isValidProfile(value: string): value is AccessibilityProfile {
  return ['default', 'dyslexia', 'low_vision', 'high_contrast', 'reduced_motion', 'focus_mode', 'custom'].includes(value)
}

/**
 * Get stored profile (for non-React contexts)
 */
export function getStoredAccessibilityProfile(): AccessibilityProfile {
  if (typeof window === 'undefined') return 'default'

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isValidProfile(stored)) {
    return stored
  }
  return 'default'
}
