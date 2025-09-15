/**
 * Simplified Game Hook
 * Replaces complex useGame with essential functionality only
 */

import { useState, useCallback, useEffect } from 'react'
import { generateUserId, safeStorage, saveProgress, loadProgress } from '@/lib/safe-storage'
import { trackUserChoice, getUserInsights, getBirminghamMatches } from '@/lib/simple-career-analytics'

// Essential game state only
export interface SimpleGameState {
  hasStarted: boolean
  currentScene: string
  messages: Array<{ text: string; speaker: string; type: string }>
  choices: Array<{ text: string; next?: string; consequence?: string }>
  isProcessing: boolean
  userId: string
  choiceHistory: string[]
}

// Simple scene data (replaces complex story engine)
const SIMPLE_SCENES = {
  'intro': {
    id: 'intro',
    text: "Welcome to Grand Central Terminus. You've received a mysterious letter: \"Platform 7, Midnight. Your future awaits.\"",
    speaker: 'Narrator',
    choices: [
      { text: "Explore the healthcare platform", next: 'healthcare-intro', consequence: 'healthcare' },
      { text: "Check out the technology area", next: 'tech-intro', consequence: 'technology' },
      { text: "Visit the engineering section", next: 'engineering-intro', consequence: 'engineering' },
      { text: "Look around for guidance", next: 'guidance', consequence: 'exploring' }
    ]
  },
  'healthcare-intro': {
    id: 'healthcare-intro',
    text: "Platform 1: The Care Line. You see medical professionals discussing patient care and healing. This could be your path to helping others.",
    speaker: 'Maya (Pre-med Student)',
    choices: [
      { text: "Learn about Birmingham medical opportunities", next: 'healthcare-birmingham', consequence: 'healthcare' },
      { text: "Explore other career areas", next: 'career-exploration', consequence: 'exploring' },
      { text: "Ask about medical school preparation", next: 'healthcare-education', consequence: 'education' }
    ]
  },
  'tech-intro': {
    id: 'tech-intro',
    text: "Platform 7: The Data Stream. Screens flicker with code and innovation. Birmingham's tech scene is growing rapidly.",
    speaker: 'Devon (Software Engineer)',
    choices: [
      { text: "Discover Birmingham tech companies", next: 'tech-birmingham', consequence: 'technology' },
      { text: "Learn about coding bootcamps", next: 'tech-education', consequence: 'education' },
      { text: "Explore other platforms", next: 'career-exploration', consequence: 'exploring' }
    ]
  },
  'engineering-intro': {
    id: 'engineering-intro',
    text: "Platform 3: The Builder's Track. You see blueprints and models. Birmingham has a rich industrial heritage and modern manufacturing.",
    speaker: 'Jordan (Manufacturing Engineer)',
    choices: [
      { text: "Explore Birmingham engineering firms", next: 'engineering-birmingham', consequence: 'engineering' },
      { text: "Learn about engineering programs", next: 'engineering-education', consequence: 'education' },
      { text: "Continue exploring", next: 'career-exploration', consequence: 'exploring' }
    ]
  },
  'career-exploration': {
    id: 'career-exploration',
    text: "You're discovering your interests through exploration. What calls to you?",
    speaker: 'Samuel (Station Keeper)',
    choices: [
      { text: "Review my interests and opportunities", next: 'insights', consequence: 'reflecting' },
      { text: "Visit a new platform", next: 'intro', consequence: 'exploring' },
      { text: "Get guidance on next steps", next: 'guidance', consequence: 'planning' }
    ]
  },
  'insights': {
    id: 'insights',
    text: "Let me share what I've learned about your interests and Birmingham opportunities...",
    speaker: 'Samuel (Station Keeper)',
    choices: [
      { text: "Continue exploring", next: 'intro', consequence: 'exploring' },
      { text: "Plan my next steps", next: 'guidance', consequence: 'planning' }
    ]
  }
}

export function useSimpleGame() {
  const [gameState, setGameState] = useState<SimpleGameState>(() => {
    const userId = generateUserId()
    const savedProgress = loadProgress()

    return {
      hasStarted: false,
      currentScene: 'intro',
      messages: [],
      choices: [],
      isProcessing: false,
      userId,
      choiceHistory: savedProgress?.choiceHistory || []
    }
  })

  // Load current scene
  useEffect(() => {
    if (gameState.hasStarted) {
      const scene = SIMPLE_SCENES[gameState.currentScene as keyof typeof SIMPLE_SCENES]
      if (scene) {
        setGameState(prev => ({
          ...prev,
          messages: [{ text: scene.text, speaker: scene.speaker, type: 'narrative' }],
          choices: scene.choices
        }))
      }
    }
  }, [gameState.currentScene, gameState.hasStarted])

  const handleStartGame = useCallback(() => {
    setGameState(prev => ({ ...prev, hasStarted: true }))
  }, [])

  const handleChoice = useCallback((choice: any) => {
    setGameState(prev => ({ ...prev, isProcessing: true }))

    // Track the choice
    trackUserChoice(gameState.userId, choice)

    // Save progress
    const newChoiceHistory = [...gameState.choiceHistory, choice.text]
    saveProgress({
      currentScene: choice.next || gameState.currentScene,
      choiceHistory: newChoiceHistory
    })

    // Move to next scene
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentScene: choice.next || prev.currentScene,
        choiceHistory: newChoiceHistory,
        isProcessing: false
      }))
    }, 1000)
  }, [gameState.userId, gameState.choiceHistory, gameState.currentScene])

  const handleContinue = useCallback(() => {
    // Simple continue logic
    setGameState(prev => ({ ...prev, currentScene: 'intro' }))
  }, [])

  const handleShare = useCallback(() => {
    const insights = getUserInsights(gameState.userId)
    const birminghamMatches = getBirminghamMatches(gameState.userId)

    const shareText = `I've been exploring career paths in Birmingham!
Primary interest: ${insights.primaryInterest}
Birmingham opportunities found: ${birminghamMatches.length}
Check out this career exploration tool!`

    if (navigator.share) {
      navigator.share({
        title: 'My Birmingham Career Exploration',
        text: shareText,
        url: window.location.href
      }).catch(console.error)
    } else {
      navigator.clipboard?.writeText(shareText)
    }
  }, [gameState.userId])

  // Simple insights for analytics display
  const getInsights = useCallback(() => {
    return getUserInsights(gameState.userId)
  }, [gameState.userId])

  const getBirminghamOpportunities = useCallback(() => {
    return getBirminghamMatches(gameState.userId)
  }, [gameState.userId])

  return {
    ...gameState,
    currentScene: gameState.hasStarted ? SIMPLE_SCENES[gameState.currentScene as keyof typeof SIMPLE_SCENES] : null,
    handleStartGame,
    handleChoice,
    handleContinue,
    handleShare,
    getInsights,
    getBirminghamOpportunities
  }
}