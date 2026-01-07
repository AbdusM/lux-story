/**
 * D-078: Cognitive Load Hook
 * Manages user preference for cognitive load level
 * Persists to localStorage for cross-session consistency
 */

import { useState, useEffect, useCallback } from 'react'
import type { CognitiveLoadLevel } from '@/lib/cognitive-load'
import { getCognitiveLoadConfig, type CognitiveLoadConfig } from '@/lib/cognitive-load'

const STORAGE_KEY = 'lux_cognitive_load_level'
const DEFAULT_LEVEL: CognitiveLoadLevel = 'normal'

/**
 * Hook for managing cognitive load preference
 * @returns [currentLevel, setLevel, config, availableLevels]
 */
export function useCognitiveLoad(): [
  CognitiveLoadLevel,
  (level: CognitiveLoadLevel) => void,
  CognitiveLoadConfig,
  CognitiveLoadLevel[]
] {
  const [level, setLevelState] = useState<CognitiveLoadLevel>(DEFAULT_LEVEL)

  // Load preference from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isValidCognitiveLoadLevel(stored)) {
      setLevelState(stored as CognitiveLoadLevel)
    }
  }, [])

  // Save preference to localStorage when changed
  const setLevel = useCallback((newLevel: CognitiveLoadLevel) => {
    setLevelState(newLevel)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLevel)
    }
  }, [])

  const config = getCognitiveLoadConfig(level)

  const availableLevels: CognitiveLoadLevel[] = [
    'minimal',
    'reduced',
    'normal',
    'detailed'
  ]

  return [level, setLevel, config, availableLevels]
}

/**
 * Validate if a string is a valid cognitive load level
 */
function isValidCognitiveLoadLevel(value: string): value is CognitiveLoadLevel {
  return ['minimal', 'reduced', 'normal', 'detailed'].includes(value)
}

/**
 * Get the current cognitive load level from localStorage (for non-React contexts)
 */
export function getStoredCognitiveLoadLevel(): CognitiveLoadLevel {
  if (typeof window === 'undefined') return DEFAULT_LEVEL

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isValidCognitiveLoadLevel(stored)) {
    return stored as CognitiveLoadLevel
  }
  return DEFAULT_LEVEL
}
