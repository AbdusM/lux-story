"use client"

import { useCallback } from 'react'

/**
 * Simplified presence hook - only provides reset function
 * Removes unused timer functionality for better performance
 */
export function usePresence() {
  const resetPresence = useCallback(() => {
    // Simple state reset for scene transitions
    // No complex timing or revelations needed
  }, [])
  
  return {
    resetPresence
  }
}