"use client"

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for career-focused reflection moments
 * Tracks player behavior for subtle UI suggestions
 */
export function useCareerReflection() {
  const [rapidClicks, setRapidClicks] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  
  // Track rapid clicking (indicates stress/urgency)
  const trackClick = useCallback(() => {
    const now = Date.now()
    const timeSinceLastClick = now - lastClickTime
    
    if (timeSinceLastClick < 2000) { // Less than 2 seconds between clicks
      setRapidClicks(prev => prev + 1)
    } else {
      setRapidClicks(1) // Reset counter
    }
    
    setLastClickTime(now)
  }, [lastClickTime])
  
  // Reset rapid clicks after 10 seconds of no activity
  useEffect(() => {
    const timer = setTimeout(() => {
      setRapidClicks(0)
    }, 10000)
    
    return () => clearTimeout(timer)
  }, [lastClickTime])
  
  return {
    trackClick,
    rapidClicks
  }
}
