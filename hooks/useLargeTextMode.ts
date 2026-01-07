/**
 * D-080: Large Text Mode Hook
 * Manages user's text size preference
 * Persists to localStorage and applies CSS variables to document
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  TextSizePreset,
  TEXT_SIZE_CONFIGS,
  TEXT_SIZE_LABELS,
  TEXT_SIZE_DESCRIPTIONS,
  getTextSizeCSSProperties,
  getTextSizeClass,
  getNextLargerSize,
  getNextSmallerSize,
  getAvailableTextSizes
} from '@/lib/large-text-mode'

const STORAGE_KEY = 'lux_text_size'

/**
 * Hook for managing large text mode
 */
export function useLargeTextMode() {
  const [textSize, setTextSizeState] = useState<TextSizePreset>('default')

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isValidTextSize(stored)) {
      setTextSizeState(stored as TextSizePreset)
    }
  }, [])

  // Apply CSS variables to document
  useEffect(() => {
    if (typeof window === 'undefined') return

    const cssProps = getTextSizeCSSProperties(textSize)
    const root = document.documentElement

    // Apply CSS custom properties
    Object.entries(cssProps).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // Apply/remove class
    const allClasses = ['text-size-large', 'text-size-x-large', 'text-size-xx-large']
    allClasses.forEach(c => root.classList.remove(c))

    const newClass = getTextSizeClass(textSize)
    if (newClass) {
      root.classList.add(newClass)
    }

    return () => {
      allClasses.forEach(c => root.classList.remove(c))
    }
  }, [textSize])

  // Set text size
  const setTextSize = useCallback((size: TextSizePreset) => {
    setTextSizeState(size)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, size)
    }
  }, [])

  // Increase text size
  const increaseSize = useCallback(() => {
    const next = getNextLargerSize(textSize)
    setTextSize(next)
  }, [textSize, setTextSize])

  // Decrease text size
  const decreaseSize = useCallback(() => {
    const next = getNextSmallerSize(textSize)
    setTextSize(next)
  }, [textSize, setTextSize])

  // Reset to default
  const resetSize = useCallback(() => {
    setTextSize('default')
  }, [setTextSize])

  // Get config for current size
  const config = useMemo(() => TEXT_SIZE_CONFIGS[textSize], [textSize])

  // Available sizes with metadata
  const sizes = useMemo(() => {
    return getAvailableTextSizes().map(size => ({
      id: size,
      label: TEXT_SIZE_LABELS[size],
      description: TEXT_SIZE_DESCRIPTIONS[size],
      config: TEXT_SIZE_CONFIGS[size],
      active: size === textSize
    }))
  }, [textSize])

  // Check bounds
  const canIncrease = textSize !== 'xx-large'
  const canDecrease = textSize !== 'default'
  const isLargeText = textSize !== 'default'

  return {
    textSize,
    setTextSize,
    config,
    sizes,
    increaseSize,
    decreaseSize,
    resetSize,
    canIncrease,
    canDecrease,
    isLargeText,
    scaleMultiplier: config.scaleMultiplier
  }
}

/**
 * Validate text size string
 */
function isValidTextSize(value: string): value is TextSizePreset {
  return ['default', 'large', 'x-large', 'xx-large'].includes(value)
}

/**
 * Get stored text size (for non-React contexts)
 */
export function getStoredTextSize(): TextSizePreset {
  if (typeof window === 'undefined') return 'default'

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isValidTextSize(stored)) {
    return stored
  }
  return 'default'
}
