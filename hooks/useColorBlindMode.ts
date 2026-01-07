/**
 * D-077: Color Blind Mode Hook
 * Manages user preference for color blind-friendly pattern colors
 * Persists to localStorage for cross-session consistency
 */

import { useState, useEffect, useCallback } from 'react'
import type { ColorBlindMode } from '@/lib/patterns'

const STORAGE_KEY = 'lux_color_blind_mode'
const DEFAULT_MODE: ColorBlindMode = 'default'

/**
 * Hook for managing color blind mode preference
 * @returns [currentMode, setMode, availableModes]
 */
export function useColorBlindMode(): [
  ColorBlindMode,
  (mode: ColorBlindMode) => void,
  ColorBlindMode[]
] {
  const [mode, setModeState] = useState<ColorBlindMode>(DEFAULT_MODE)

  // Load preference from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isValidColorBlindMode(stored)) {
      setModeState(stored as ColorBlindMode)
    }
  }, [])

  // Save preference to localStorage when changed
  const setMode = useCallback((newMode: ColorBlindMode) => {
    setModeState(newMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newMode)
    }
  }, [])

  const availableModes: ColorBlindMode[] = [
    'default',
    'protanopia',
    'deuteranopia',
    'tritanopia',
    'highContrast'
  ]

  return [mode, setMode, availableModes]
}

/**
 * Validate if a string is a valid color blind mode
 */
function isValidColorBlindMode(value: string): value is ColorBlindMode {
  return ['default', 'protanopia', 'deuteranopia', 'tritanopia', 'highContrast'].includes(value)
}

/**
 * Get the current color blind mode from localStorage (for non-React contexts)
 */
export function getStoredColorBlindMode(): ColorBlindMode {
  if (typeof window === 'undefined') return DEFAULT_MODE

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isValidColorBlindMode(stored)) {
    return stored as ColorBlindMode
  }
  return DEFAULT_MODE
}
