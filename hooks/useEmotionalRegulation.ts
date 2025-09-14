"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getEmotionalRegulationSystem, EmotionalState, StressIndicators } from '@/lib/emotional-regulation-system'

/**
 * Hook for emotional regulation and limbic learning support
 * Integrates with existing career reflection and choice systems
 */
export function useEmotionalRegulation() {
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    stressLevel: 'calm',
    heartRateVariability: 0.7,
    vagalTone: 'normal',
    breathingRhythm: 'natural',
    emotionalWeight: 0.5,
    regulationNeeded: false
  })

  const [stressIndicators, setStressIndicators] = useState<StressIndicators>({
    rapidClicks: 0,
    choiceTime: 0,
    themeJumping: false,
    hesitationCount: 0,
    emotionalIntensity: 0
  })

  const [lastChoiceTime, setLastChoiceTime] = useState<number>(Date.now())
  const [choiceHistory, setChoiceHistory] = useState<string[]>([])
  const [hesitationCount, setHesitationCount] = useState(0)

  const emotionalSystem = useMemo(() => getEmotionalRegulationSystem(), [])

  // Track choice timing and patterns
  const trackChoice = useCallback((choiceText: string, choiceTime: number) => {
    const timeSinceLastChoice = choiceTime - lastChoiceTime
    const isRapidClick = timeSinceLastChoice < 3000 // Less than 3 seconds
    
    // Check for theme jumping
    const currentTheme = extractTheme(choiceText)
    const lastTheme = choiceHistory.length > 0 ? extractTheme(choiceHistory[choiceHistory.length - 1]) : null
    const isThemeJumping = Boolean(lastTheme && currentTheme !== lastTheme)

    // Update stress indicators
    const newIndicators: StressIndicators = {
      rapidClicks: isRapidClick ? stressIndicators.rapidClicks + 1 : 0,
      choiceTime: timeSinceLastChoice,
      themeJumping: isThemeJumping,
      hesitationCount: hesitationCount,
      emotionalIntensity: calculateEmotionalIntensity(choiceText)
    }

    setStressIndicators(newIndicators)
    setLastChoiceTime(choiceTime)
    setChoiceHistory(prev => [...prev.slice(-4), choiceText]) // Keep last 5 choices

    // Analyze with emotional regulation system
    const newEmotionalState = emotionalSystem.analyzeStressIndicators(newIndicators)
    setEmotionalState(newEmotionalState)
  }, [lastChoiceTime, stressIndicators.rapidClicks, choiceHistory, hesitationCount, emotionalSystem])

  // Track hesitation (when player hovers over choices without selecting)
  const trackHesitation = useCallback(() => {
    setHesitationCount(prev => prev + 1)
  }, [])

  // Reset hesitation when choice is made
  const resetHesitation = useCallback(() => {
    setHesitationCount(0)
  }, [])

  // Get emotional support message
  const getEmotionalSupport = useCallback(() => {
    return emotionalSystem.getEmotionalSupportMessage()
  }, [emotionalSystem])

  // Get visual adjustments for current emotional state
  const getVisualAdjustments = useCallback(() => {
    return emotionalSystem.getVisualAdjustments()
  }, [emotionalSystem])

  // Get regulation strategy
  const getRegulationStrategy = useCallback(() => {
    return emotionalSystem.getRegulationStrategy()
  }, [emotionalSystem])

  // Reset emotional state (useful for scene transitions)
  const resetEmotionalState = useCallback(() => {
    emotionalSystem.reset()
    setEmotionalState({
      stressLevel: 'calm',
      heartRateVariability: 0.7,
      vagalTone: 'normal',
      breathingRhythm: 'natural',
      emotionalWeight: 0.5,
      regulationNeeded: false
    })
    setStressIndicators({
      rapidClicks: 0,
      choiceTime: 0,
      themeJumping: false,
      hesitationCount: 0,
      emotionalIntensity: 0
    })
    setChoiceHistory([])
    setHesitationCount(0)
  }, [emotionalSystem])

  // Auto-reset stress indicators after period of calm
  useEffect(() => {
    if (stressIndicators.rapidClicks === 0 && emotionalState.stressLevel === 'calm') {
      const timer = setTimeout(() => {
        setStressIndicators(prev => ({
          ...prev,
          choiceTime: 0,
          themeJumping: false,
          hesitationCount: 0
        }))
      }, 10000) // Reset after 10 seconds of calm

      return () => clearTimeout(timer)
    }
  }, [stressIndicators.rapidClicks, emotionalState.stressLevel])

  return {
    emotionalState,
    stressIndicators,
    trackChoice,
    trackHesitation,
    resetHesitation,
    getEmotionalSupport,
    getVisualAdjustments,
    getRegulationStrategy,
    resetEmotionalState
  }
}

// Helper function to extract career theme from choice text
function extractTheme(choiceText: string): string | null {
  const themes = {
    helping: ['help', 'care', 'support', 'people', 'others', 'community', 'service'],
    building: ['build', 'create', 'make', 'construct', 'design', 'craft', 'art'],
    analyzing: ['analyze', 'study', 'research', 'data', 'numbers', 'logic', 'think'],
    exploring: ['explore', 'discover', 'adventure', 'travel', 'new', 'unknown', 'curious'],
    listening: ['listen', 'hear', 'sound', 'music', 'quiet', 'attention', 'focus'],
    thinking: ['think', 'consider', 'ponder', 'reflect', 'philosophy', 'deep', 'wisdom']
  }

  const text = choiceText.toLowerCase()
  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return theme
    }
  }
  return null
}

// Helper function to calculate emotional intensity from choice text
function calculateEmotionalIntensity(choiceText: string): number {
  const emotionalKeywords = {
    high: ['urgent', 'immediately', 'quickly', 'rush', 'panic', 'anxious', 'worried'],
    medium: ['consider', 'think', 'wonder', 'curious', 'interested', 'concerned'],
    low: ['calm', 'peaceful', 'gentle', 'slow', 'patient', 'relaxed', 'easy']
  }

  const text = choiceText.toLowerCase()
  let intensity = 0.5 // Default medium intensity

  if (emotionalKeywords.high.some(keyword => text.includes(keyword))) {
    intensity = 0.8
  } else if (emotionalKeywords.medium.some(keyword => text.includes(keyword))) {
    intensity = 0.5
  } else if (emotionalKeywords.low.some(keyword => text.includes(keyword))) {
    intensity = 0.2
  }

  return intensity
}
