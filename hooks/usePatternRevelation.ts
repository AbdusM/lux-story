import { useEffect, useState, useCallback, useRef } from 'react'
import { getPatternTracker } from '@/lib/game-state'

/**
 * Hook to provide subtle narrative hints based on emerging patterns
 * Never explicitly mentions careers - only poetic observations
 */
export function usePatternRevelation() {
  const lastRevelationRef = useRef<number>(0)
  
  const checkForRevelation = useCallback((): string | null => {
    const tracker = getPatternTracker()
    const patterns = tracker.getPatternData()
    
    // Only reveal after enough choices
    if (patterns.choiceThemes.length < 5) return null
    
    // Don't reveal too often
    const now = Date.now()
    if (now - lastRevelationRef.current < 300000) return null // 5 minutes between revelations
    
    // Count theme frequencies
    const themeCounts: Record<string, number> = {}
    patterns.choiceThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1
    })
    
    // Find dominant theme
    const sortedThemes = Object.entries(themeCounts)
      .sort(([, a], [, b]) => b - a)
    
    if (sortedThemes.length === 0) return null
    
    const [dominantTheme, count] = sortedThemes[0]
    
    // Only reveal if pattern is strong (appears 3+ times)
    if (count < 3) return null
    
    // Map themes to subtle revelations
    const revelations: Record<string, string[]> = {
      'helping': [
        "You often choose to help. The forest notices.",
        "Your hands seem drawn to lifting others.",
        "Care flows through your choices like water finding its path."
      ],
      'patience': [
        "Stillness comes naturally to you.",
        "You wait like the forest waits. Without urgency.",
        "Time bends around your patience."
      ],
      'questioning': [
        "Questions bloom from you like morning flowers.",
        "Your curiosity creates paths where none existed.",
        "The forest appreciates those who ask why."
      ],
      'analyzing': [
        "Patterns reveal themselves to your watching.",
        "You see the structures beneath the surface.",
        "The forest's logic speaks to you."
      ],
      'building': [
        "Your hands remember the shape of making.",
        "Creation calls to you, steady as breathing.",
        "You understand how pieces become whole."
      ],
      'exploring': [
        "Unknown paths feel familiar to you.",
        "You move toward mystery like a compass finding north.",
        "Discovery is your natural rhythm."
      ],
      'listening': [
        "Silence speaks loudest to you.",
        "You hear what others miss in the quiet.",
        "The forest's whispers find your ears."
      ],
      'thinking': [
        "Thoughts move through you like careful rivers.",
        "You hold ideas gently, examining their weight.",
        "Philosophy grows where you pause."
      ],
      'experiencing': [
        "You dive deep into each moment.",
        "Presence is your practice.",
        "The forest feels more real when you're here."
      ],
      'harmony': [
        "Peace follows you like a shadow.",
        "You smooth the rough edges of the world.",
        "Balance finds you, or you find it."
      ]
    }
    
    const possibleRevelations = revelations[dominantTheme]
    if (!possibleRevelations) return null
    
    // Pick a random revelation
    const revelation = possibleRevelations[Math.floor(Math.random() * possibleRevelations.length)]
    
    lastRevelationRef.current = now
    return revelation
  }, [])
  
  return { checkForRevelation }
}