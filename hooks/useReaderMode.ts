"use client"

/**
 * useReaderMode - Accessibility font toggle
 *
 * Sprint 4: Reader mode toggle for better text readability
 * Switches between monospace (default terminal aesthetic) and
 * sans-serif (easier reading for dyslexia, visual impairments)
 *
 * Persists preference to localStorage.
 */

import { useState, useEffect, useCallback } from 'react'

type ReaderMode = 'mono' | 'sans'

const STORAGE_KEY = 'lux-reader-mode'

export function useReaderMode() {
  const [mode, setModeState] = useState<ReaderMode>('mono')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ReaderMode | null
    if (stored === 'mono' || stored === 'sans') {
      setModeState(stored)
      applyReaderMode(stored)
    }
    setIsLoaded(true)
  }, [])

  // Apply mode to document
  const applyReaderMode = useCallback((newMode: ReaderMode) => {
    const root = document.documentElement
    if (newMode === 'sans') {
      root.classList.add('reader-mode-sans')
      root.classList.remove('reader-mode-mono')
    } else {
      root.classList.add('reader-mode-mono')
      root.classList.remove('reader-mode-sans')
    }
  }, [])

  // Toggle between modes
  const toggleMode = useCallback(() => {
    const newMode = mode === 'mono' ? 'sans' : 'mono'
    setModeState(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
    applyReaderMode(newMode)
  }, [mode, applyReaderMode])

  // Set specific mode
  const setMode = useCallback((newMode: ReaderMode) => {
    setModeState(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
    applyReaderMode(newMode)
  }, [applyReaderMode])

  return {
    mode,
    isLoaded,
    isSansMode: mode === 'sans',
    isMonoMode: mode === 'mono',
    toggleMode,
    setMode,
  }
}

export default useReaderMode
