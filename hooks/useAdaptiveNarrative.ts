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
   * Semantic content analyzer - identifies content types and assigns hierarchy
   */
  const analyzeContentSemantics = useCallback((text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    return sentences.map(sentence => {
      const cleanSentence = sentence.trim()
      
      // Critical action - demands immediate attention
      if (/(\d+ minutes?.*find|find.*\d+ minutes?|got \d+|have \d+.*to)/i.test(cleanSentence)) {
        return { text: cleanSentence, type: 'critical-action', priority: 1 }
      }
      
      // Specific time - important for urgency
      if (/\d+:\d+|clock says|time shows/i.test(cleanSentence)) {
        return { text: cleanSentence, type: 'specific-time', priority: 2 }
      }
      
      // Stakes/mystery - intriguing but not urgent
      if (/(supposed to|meant to|going to|will|future|change everything|destiny|fate)/i.test(cleanSentence)) {
        return { text: cleanSentence, type: 'stakes-mystery', priority: 4 }
      }
      
      // Time markers - moderate emphasis
      if (/(almost|nearly|midnight|dawn|dusk|— |tonight|today)/i.test(cleanSentence)) {
        return { text: cleanSentence, type: 'time-marker', priority: 3 }
      }
      
      // Atmosphere - recedes to background
      if (/(cold|hot|dark|bright|smells|sounds|feels|quiet|loud)/i.test(cleanSentence)) {
        return { text: cleanSentence, type: 'atmosphere', priority: 5 }
      }
      
      // Default to moderate importance
      return { text: cleanSentence, type: 'default', priority: 3 }
    }).sort((a, b) => a.priority - b.priority)
  }, [])

  /**
   * Enhance scene text based on performance level and improve formatting
   */
  const enhanceSceneText = useCallback((originalText: string, sceneType: string): string => {
    let enhancedText = originalText
    
    // Add emphasis and styling for key narrative elements
    enhancedText = enhancedText
      // Platform numbers get special treatment
      .replace(/Platform (\d+(?:½)?)/g, '**Platform $1**')
      // Time references for urgency
      .replace(/(\d+:\d+|\d+ minutes?)/g, '***$1***')
      // Important locations and concepts
      .replace(/(Grand Central Station|Grand Central Terminus)/g, '*$1*')
      // Letter-style quotes get emphasis
      .replace(/"([^"]+)"/g, '*"$1"*')
      // Future references
      .replace(/(Future You|future awaits)/gi, '**$1**')
    
    // Add better line breaks for all text types
    enhancedText = enhancedText
      // Add breaks after sentence-ending periods followed by space and capital letter
      .replace(/\. ([A-Z])/g, '.\n\n$1')
      // Add breaks after questions and exclamations
      .replace(/[?!] ([A-Z])/g, '$&\n\n')
      // Add breaks before conjunctions that start new ideas
      .replace(/ (But|However|Meanwhile|Suddenly|Then|Now) /g, '\n\n$1 ')
      // Add spacing around em dashes for emphasis
      .replace(/ - /g, '\n\n— ')
      // Break up long descriptions with commas into separate lines for better readability
      .replace(/, ([a-z][^,]{25,})/g, ',\n$1')
    
    // Don't modify choice texts or dialogue beyond formatting
    if (sceneType !== 'narration') return enhancedText
    
    // Performance-based enhancements only for narration - reduced frequency
    switch (performanceLevel) {
      case 'struggling':
        // Add calming additions for anxious players - much less frequently
        if (Math.random() < 0.05) {
          return enhancedText + "\n\nThe station gives you time to think."
        }
        break
        
      case 'exploring':
        // Encourage exploration - reduced frequency
        if (Math.random() < 0.08) {
          return enhancedText + "\n\nMany paths remain undiscovered."
        }
        break
        
      case 'flowing':
        // Affirm their rhythm - reduced frequency  
        if (Math.random() < 0.08) {
          return enhancedText + "\n\nYour choices align with Birmingham's rhythm."
        }
        break
        
      case 'mastering':
        // Deeper insights - reduced frequency
        if (Math.random() < 0.1) {
          return enhancedText + "\n\nThe patterns reveal themselves to your patient observation."
        }
        break
    }
    
    return enhancedText
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
    analyzeContentSemantics,
    getAmbientMessage,
    enhanceChoices,
    getBreathingFrequency
  }
}