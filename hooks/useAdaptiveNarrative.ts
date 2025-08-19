import { useEffect, useState, useCallback } from 'react'
import { getPerformanceSystem } from '@/lib/performance-system'

/**
 * Hook that adapts narrative based on performance level
 * Provides different scene enhancements without changing core story
 */
export function useAdaptiveNarrative() {
  const [performanceLevel, setPerformanceLevel] = useState<'struggling' | 'exploring' | 'flowing' | 'mastering'>('exploring')
  const performanceSystem = getPerformanceSystem()
  
  useEffect(() => {
    // Check performance level periodically
    const interval = setInterval(() => {
      const level = performanceSystem.getPerformanceLevel()
      setPerformanceLevel(level)
    }, 10000) // Every 10 seconds
    
    return () => clearInterval(interval)
  }, [performanceSystem])
  
  /**
   * Enhance scene text based on performance level
   */
  const enhanceSceneText = useCallback((originalText: string, sceneType: string): string => {
    // Don't modify choice texts or dialogue
    if (sceneType !== 'narration') return originalText
    
    switch (performanceLevel) {
      case 'struggling':
        // Add calming additions for anxious players
        if (Math.random() < 0.3) {
          return originalText + " The station gives you time to think."
        }
        break
        
      case 'exploring':
        // Encourage exploration
        if (Math.random() < 0.2) {
          return originalText + " Many paths remain undiscovered."
        }
        break
        
      case 'flowing':
        // Affirm their rhythm
        if (Math.random() < 0.2) {
          return originalText + " Your choices align with Birmingham's rhythm."
        }
        break
        
      case 'mastering':
        // Deeper insights
        if (Math.random() < 0.25) {
          return originalText + " The patterns reveal themselves to your patient observation."
        }
        break
    }
    
    return originalText
  }, [performanceLevel])
  
  /**
   * Get additional ambient messages based on performance
   */
  const getAmbientMessage = useCallback((): string | null => {
    const messages = {
      struggling: [
        "A leaf falls. There's no rush to catch it.",
        "The station clock ticks patiently.",
        "Even questions can rest.",
        "Samuel watches, understanding your hesitation."
      ],
      exploring: [
        "Paths appear as you walk them.",
        "Each choice creates the next.",
        "The platforms respond to your interest.",
        "Discovery has its own pace."
      ],
      flowing: [
        "Your choices ripple through the station.",
        "The rhythm you've found is yours alone.",
        "Clarity emerges from consistency.",
        "The platforms recognize your career alignment."
      ],
      mastering: [
        "You've become part of Birmingham's future.",
        "Your stillness teaches the trees.",
        "The path was always there. Now you see it.",
        "Time bends around your certainty."
      ]
    }
    
    const levelMessages = messages[performanceLevel]
    if (Math.random() < 0.1) { // 10% chance
      return levelMessages[Math.floor(Math.random() * levelMessages.length)]
    }
    
    return null
  }, [performanceLevel])
  
  /**
   * Modify choice presentation based on performance
   */
  const enhanceChoices = useCallback((choices: any[]): any[] => {
    // For struggling players, subtly highlight calming choices
    if (performanceLevel === 'struggling') {
      return choices.map(choice => {
        if (choice.consequence === 'patience' || 
            choice.consequence === 'acceptance' || 
            choice.consequence === 'silence') {
          return {
            ...choice,
            text: choice.text + " ..."  // Add ellipsis to suggest pause
          }
        }
        return choice
      })
    }
    
    // For mastering players, add subtle depth hints
    if (performanceLevel === 'mastering') {
      return choices.map(choice => {
        if (choice.consequence === 'observation' || 
            choice.consequence === 'philosophy') {
          return {
            ...choice,
            text: "◈ " + choice.text  // Add symbol for deeper choices
          }
        }
        return choice
      })
    }
    
    return choices
  }, [performanceLevel])
  
  /**
   * Get breathing invitation frequency based on performance
   */
  const getBreathingFrequency = useCallback((): number => {
    switch (performanceLevel) {
      case 'struggling': return 0.4  // 40% chance
      case 'exploring': return 0.2   // 20% chance
      case 'flowing': return 0.1     // 10% chance
      case 'mastering': return 0.05  // 5% chance
    }
  }, [performanceLevel])
  
  return {
    performanceLevel,
    enhanceSceneText,
    getAmbientMessage,
    enhanceChoices,
    getBreathingFrequency
  }
}