"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getCognitiveDevelopmentSystem, CognitiveState, LearningMetrics } from '@/lib/cognitive-development-system'

/**
 * Hook for cognitive development and metacognitive scaffolding
 * Integrates with emotional regulation and career exploration systems
 */
export function useCognitiveDevelopment() {
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>({
    flowState: 'struggle',
    challengeLevel: 0.5,
    skillLevel: 0.3,
    metacognitiveAwareness: 'low',
    executiveFunction: 'developing',
    workingMemory: 'normal',
    attentionSpan: 'medium',
    learningStyle: 'mixed'
  })

  const [learningMetrics, setLearningMetrics] = useState<LearningMetrics>({
    choiceComplexity: 0.5,
    decisionTime: 0,
    patternRecognition: 0.5,
    abstractionLevel: 0.5,
    transferAbility: 0.5,
    reflectionDepth: 0.5
  })

  const [choiceHistory, setChoiceHistory] = useState<string[]>([])
  const [decisionStartTime, setDecisionStartTime] = useState<number>(0)
  const [lastChoiceTime, setLastChoiceTime] = useState<number>(0)

  const cognitiveSystem = useMemo(() => getCognitiveDevelopmentSystem(), [])

  // Track choice complexity and decision time
  const trackChoice = useCallback((choiceText: string, choiceTime: number) => {
    const decisionTime = choiceTime - decisionStartTime
    const choiceComplexity = calculateChoiceComplexity(choiceText)
    const patternRecognition = calculatePatternRecognition(choiceText, choiceHistory)
    const abstractionLevel = calculateAbstractionLevel(choiceText)
    const transferAbility = calculateTransferAbility(choiceText, choiceHistory)
    const reflectionDepth = calculateReflectionDepth(choiceText)

    const newMetrics: LearningMetrics = {
      choiceComplexity,
      decisionTime,
      patternRecognition,
      abstractionLevel,
      transferAbility,
      reflectionDepth
    }

    setLearningMetrics(newMetrics)
    setChoiceHistory(prev => [...prev.slice(-9), choiceText]) // Keep last 10 choices
    setLastChoiceTime(choiceTime)

    // Analyze with cognitive development system
    const newCognitiveState = cognitiveSystem.analyzeLearningMetrics(newMetrics)
    setCognitiveState(newCognitiveState)
  }, [decisionStartTime, choiceHistory, cognitiveSystem])

  // Start tracking decision time
  const startDecisionTracking = useCallback(() => {
    setDecisionStartTime(Date.now())
  }, [])

  // Get metacognitive prompt
  const getMetacognitivePrompt = useCallback(() => {
    return cognitiveSystem.getMetacognitivePrompt()
  }, [cognitiveSystem])

  // Get flow optimization suggestions
  const getFlowOptimization = useCallback(() => {
    return cognitiveSystem.getFlowOptimization()
  }, [cognitiveSystem])

  // Get cognitive scaffolding
  const getCognitiveScaffolding = useCallback(() => {
    return cognitiveSystem.getCognitiveScaffolding()
  }, [cognitiveSystem])

  // Get learning style adaptations
  const getLearningStyleAdaptations = useCallback(() => {
    return cognitiveSystem.getLearningStyleAdaptations()
  }, [cognitiveSystem])

  // Reset cognitive state
  const resetCognitiveState = useCallback(() => {
    cognitiveSystem.reset()
    setCognitiveState({
      flowState: 'struggle',
      challengeLevel: 0.5,
      skillLevel: 0.3,
      metacognitiveAwareness: 'low',
      executiveFunction: 'developing',
      workingMemory: 'normal',
      attentionSpan: 'medium',
      learningStyle: 'mixed'
    })
    setLearningMetrics({
      choiceComplexity: 0.5,
      decisionTime: 0,
      patternRecognition: 0.5,
      abstractionLevel: 0.5,
      transferAbility: 0.5,
      reflectionDepth: 0.5
    })
    setChoiceHistory([])
    setDecisionStartTime(0)
    setLastChoiceTime(0)
  }, [cognitiveSystem])

  // Auto-reset decision tracking after period of inactivity
  useEffect(() => {
    if (decisionStartTime > 0) {
      const timer = setTimeout(() => {
        setDecisionStartTime(0)
      }, 30000) // Reset after 30 seconds

      return () => clearTimeout(timer)
    }
  }, [decisionStartTime])

  return {
    cognitiveState,
    learningMetrics,
    trackChoice,
    startDecisionTracking,
    getMetacognitivePrompt,
    getFlowOptimization,
    getCognitiveScaffolding,
    getLearningStyleAdaptations,
    resetCognitiveState
  }
}

// Helper function to calculate choice complexity
function calculateChoiceComplexity(choiceText: string): number {
  const complexityIndicators = {
    high: ['analyze', 'consider', 'evaluate', 'compare', 'strategize', 'plan', 'decide'],
    medium: ['choose', 'select', 'pick', 'prefer', 'want', 'like'],
    low: ['yes', 'no', 'okay', 'sure', 'maybe', 'continue']
  }

  const text = choiceText.toLowerCase()
  let complexity = 0.5 // Default medium complexity

  if (complexityIndicators.high.some(keyword => text.includes(keyword))) {
    complexity = 0.8
  } else if (complexityIndicators.medium.some(keyword => text.includes(keyword))) {
    complexity = 0.5
  } else if (complexityIndicators.low.some(keyword => text.includes(keyword))) {
    complexity = 0.2
  }

  // Adjust based on text length and word count
  const wordCount = choiceText.split(' ').length
  const lengthFactor = Math.min(wordCount / 10, 1) // Normalize to 0-1
  complexity = Math.min(1, complexity + (lengthFactor * 0.2))

  return complexity
}

// Helper function to calculate pattern recognition
function calculatePatternRecognition(choiceText: string, choiceHistory: string[]): number {
  if (choiceHistory.length < 2) return 0.5

  const currentTheme = extractCareerTheme(choiceText)
  const recentThemes = choiceHistory.slice(-5).map(extractCareerTheme)
  const themeMatches = recentThemes.filter(theme => theme === currentTheme).length

  return Math.min(1, themeMatches / 5) // Higher if following patterns
}

// Helper function to calculate abstraction level
function calculateAbstractionLevel(choiceText: string): number {
  const abstractionKeywords = {
    high: ['philosophy', 'meaning', 'purpose', 'values', 'principles', 'concepts', 'ideas'],
    medium: ['goals', 'plans', 'strategies', 'approaches', 'methods', 'ways'],
    low: ['things', 'stuff', 'items', 'objects', 'actions', 'doing']
  }

  const text = choiceText.toLowerCase()
  let abstraction = 0.5 // Default medium abstraction

  if (abstractionKeywords.high.some(keyword => text.includes(keyword))) {
    abstraction = 0.8
  } else if (abstractionKeywords.medium.some(keyword => text.includes(keyword))) {
    abstraction = 0.5
  } else if (abstractionKeywords.low.some(keyword => text.includes(keyword))) {
    abstraction = 0.2
  }

  return abstraction
}

// Helper function to calculate transfer ability
function calculateTransferAbility(choiceText: string, choiceHistory: string[]): number {
  if (choiceHistory.length < 3) return 0.5

  const currentTheme = extractCareerTheme(choiceText)
  const allThemes = choiceHistory.map(extractCareerTheme)
  const uniqueThemes = new Set(allThemes).size
  const themeDiversity = uniqueThemes / Math.min(allThemes.length, 10)

  // Higher transfer ability if exploring diverse themes
  return Math.min(1, themeDiversity * 1.5)
}

// Helper function to calculate reflection depth
function calculateReflectionDepth(choiceText: string): number {
  const reflectionKeywords = {
    high: ['reflect', 'consider', 'think', 'wonder', 'question', 'explore', 'discover'],
    medium: ['feel', 'believe', 'know', 'understand', 'realize', 'notice'],
    low: ['want', 'like', 'prefer', 'choose', 'pick', 'select']
  }

  const text = choiceText.toLowerCase()
  let reflection = 0.5 // Default medium reflection

  if (reflectionKeywords.high.some(keyword => text.includes(keyword))) {
    reflection = 0.8
  } else if (reflectionKeywords.medium.some(keyword => text.includes(keyword))) {
    reflection = 0.5
  } else if (reflectionKeywords.low.some(keyword => text.includes(keyword))) {
    reflection = 0.2
  }

  return reflection
}

// Helper function to extract career theme from choice text
function extractCareerTheme(choiceText: string): string | null {
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
