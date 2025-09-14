"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getNeuroscienceSystem, NeuralState, BrainMetrics, NeuroplasticityIndicators } from '@/lib/neuroscience-system'

/**
 * Hook for neuroscience and brain-based learning
 * Integrates with emotional regulation, cognitive development, and developmental psychology systems
 */
export function useNeuroscience() {
  const [neuralState, setNeuralState] = useState<NeuralState>({
    attentionNetwork: 'alerting',
    memoryConsolidation: 'encoding',
    neuroplasticity: 'moderate',
    dopamineLevel: 'moderate',
    stressResponse: 'calm',
    cognitiveLoad: 'moderate',
    neuralEfficiency: 'developing'
  })

  const [brainMetrics, setBrainMetrics] = useState<BrainMetrics>({
    attentionSustained: 0.5,
    workingMemoryLoad: 0.5,
    cognitiveFlexibility: 0.5,
    inhibitoryControl: 0.5,
    processingSpeed: 0.5,
    memoryEncoding: 0.5,
    memoryRetrieval: 0.5,
    neuralConnectivity: 0.5
  })

  const [neuroplasticityIndicators, setNeuroplasticityIndicators] = useState<NeuroplasticityIndicators>({
    learningNovelty: 0.5,
    repetitionPatterns: 0.5,
    challengeLevel: 0.5,
    rewardExpectation: 0.5,
    socialEngagement: 0.5,
    emotionalArousal: 0.5,
    sleepQuality: 0.5,
    physicalActivity: 0.5
  })

  const [choiceHistory, setChoiceHistory] = useState<string[]>([])
  const [interactionPatterns, setInteractionPatterns] = useState<string[]>([])

  const neuroscienceSystem = useMemo(() => getNeuroscienceSystem(), [])

  // Track choice for brain analysis
  const trackChoice = useCallback((choiceText: string, choiceTime: number) => {
    const attentionSustained = calculateAttentionSustained(choiceText, choiceHistory)
    const workingMemoryLoad = calculateWorkingMemoryLoad(choiceText)
    const cognitiveFlexibility = calculateCognitiveFlexibility(choiceText, choiceHistory)
    const inhibitoryControl = calculateInhibitoryControl(choiceText)
    const processingSpeed = calculateProcessingSpeed(choiceText, choiceTime)
    const memoryEncoding = calculateMemoryEncoding(choiceText)
    const memoryRetrieval = calculateMemoryRetrieval(choiceText, choiceHistory)
    const neuralConnectivity = calculateNeuralConnectivity(choiceText, choiceHistory)

    const newMetrics: BrainMetrics = {
      attentionSustained,
      workingMemoryLoad,
      cognitiveFlexibility,
      inhibitoryControl,
      processingSpeed,
      memoryEncoding,
      memoryRetrieval,
      neuralConnectivity
    }

    setBrainMetrics(newMetrics)
    setChoiceHistory(prev => [...prev.slice(-9), choiceText]) // Keep last 10 choices

    // Analyze with neuroscience system
    const newNeuralState = neuroscienceSystem.analyzeBrainMetrics(newMetrics)
    setNeuralState(newNeuralState)
  }, [choiceHistory, neuroscienceSystem])

  // Track neuroplasticity indicators
  const trackNeuroplasticity = useCallback((indicators: Partial<NeuroplasticityIndicators>) => {
    const newIndicators = { ...neuroplasticityIndicators, ...indicators }
    setNeuroplasticityIndicators(newIndicators)
  }, [neuroplasticityIndicators])

  // Get brain-based prompt
  const getBrainPrompt = useCallback(() => {
    return neuroscienceSystem.getBrainPrompt()
  }, [neuroscienceSystem])

  // Get brain optimization
  const getBrainOptimization = useCallback(() => {
    return neuroscienceSystem.getBrainOptimization()
  }, [neuroscienceSystem])

  // Get neuroplasticity support
  const getNeuroplasticitySupport = useCallback(() => {
    return neuroscienceSystem.getNeuroplasticitySupport()
  }, [neuroscienceSystem])

  // Get neural efficiency tips
  const getNeuralEfficiencyTips = useCallback(() => {
    return neuroscienceSystem.getNeuralEfficiencyTips()
  }, [neuroscienceSystem])

  // Reset neural state
  const resetNeuralState = useCallback(() => {
    neuroscienceSystem.reset()
    setNeuralState({
      attentionNetwork: 'alerting',
      memoryConsolidation: 'encoding',
      neuroplasticity: 'moderate',
      dopamineLevel: 'moderate',
      stressResponse: 'calm',
      cognitiveLoad: 'moderate',
      neuralEfficiency: 'developing'
    })
    setBrainMetrics({
      attentionSustained: 0.5,
      workingMemoryLoad: 0.5,
      cognitiveFlexibility: 0.5,
      inhibitoryControl: 0.5,
      processingSpeed: 0.5,
      memoryEncoding: 0.5,
      memoryRetrieval: 0.5,
      neuralConnectivity: 0.5
    })
    setChoiceHistory([])
    setInteractionPatterns([])
  }, [neuroscienceSystem])

  return {
    neuralState,
    brainMetrics,
    neuroplasticityIndicators,
    trackChoice,
    trackNeuroplasticity,
    getBrainPrompt,
    getBrainOptimization,
    getNeuroplasticitySupport,
    getNeuralEfficiencyTips,
    resetNeuralState
  }
}

// Helper function to calculate attention sustained
function calculateAttentionSustained(choiceText: string, choiceHistory: string[]): number {
  const attentionKeywords = {
    high: ['focus', 'concentrate', 'attention', 'notice', 'observe', 'watch', 'listen'],
    medium: ['look', 'see', 'hear', 'feel', 'think', 'consider', 'explore'],
    low: ['quick', 'fast', 'rush', 'hurry', 'skip', 'ignore', 'dismiss']
  }

  const text = choiceText.toLowerCase()
  let attention = 0.5 // Default medium attention

  if (attentionKeywords.high.some(keyword => text.includes(keyword))) {
    attention = 0.8
  } else if (attentionKeywords.medium.some(keyword => text.includes(keyword))) {
    attention = 0.5
  } else if (attentionKeywords.low.some(keyword => text.includes(keyword))) {
    attention = 0.2
  }

  // Adjust based on choice history patterns
  if (choiceHistory.length > 0) {
    const recentChoices = choiceHistory.slice(-3)
    const avgAttention = recentChoices.reduce((sum, choice) => {
      const choiceAttention = calculateAttentionSustained(choice, [])
      return sum + choiceAttention
    }, 0) / recentChoices.length
    
    // If consistently high attention, maintain it
    if (avgAttention > 0.7) {
      attention = Math.max(attention, 0.7)
    }
  }

  return attention
}

// Helper function to calculate working memory load
function calculateWorkingMemoryLoad(choiceText: string): number {
  const complexityKeywords = {
    high: ['analyze', 'compare', 'evaluate', 'consider', 'strategize', 'plan', 'decide'],
    medium: ['choose', 'select', 'pick', 'prefer', 'want', 'like'],
    low: ['yes', 'no', 'okay', 'sure', 'maybe', 'continue']
  }

  const text = choiceText.toLowerCase()
  let load = 0.5 // Default medium load

  if (complexityKeywords.high.some(keyword => text.includes(keyword))) {
    load = 0.8
  } else if (complexityKeywords.medium.some(keyword => text.includes(keyword))) {
    load = 0.5
  } else if (complexityKeywords.low.some(keyword => text.includes(keyword))) {
    load = 0.2
  }

  // Adjust based on text length
  const wordCount = choiceText.split(' ').length
  const lengthFactor = Math.min(wordCount / 15, 1) // Normalize to 0-1
  load = Math.min(1, load + (lengthFactor * 0.3))

  return load
}

// Helper function to calculate cognitive flexibility
function calculateCognitiveFlexibility(choiceText: string, choiceHistory: string[]): number {
  if (choiceHistory.length < 2) return 0.5

  const currentTheme = extractCareerTheme(choiceText)
  const recentThemes = choiceHistory.slice(-5).map(extractCareerTheme)
  const uniqueThemes = new Set(recentThemes).size
  const themeDiversity = uniqueThemes / Math.min(recentThemes.length, 5)

  // Higher flexibility if exploring diverse themes
  return Math.min(1, themeDiversity * 1.2)
}

// Helper function to calculate inhibitory control
function calculateInhibitoryControl(choiceText: string): number {
  const controlKeywords = {
    high: ['wait', 'pause', 'stop', 'hold', 'resist', 'control', 'manage'],
    medium: ['think', 'consider', 'reflect', 'ponder', 'contemplate'],
    low: ['rush', 'hurry', 'immediate', 'quick', 'fast', 'now']
  }

  const text = choiceText.toLowerCase()
  let control = 0.5 // Default medium control

  if (controlKeywords.high.some(keyword => text.includes(keyword))) {
    control = 0.8
  } else if (controlKeywords.medium.some(keyword => text.includes(keyword))) {
    control = 0.5
  } else if (controlKeywords.low.some(keyword => text.includes(keyword))) {
    control = 0.2
  }

  return control
}

// Helper function to calculate processing speed
function calculateProcessingSpeed(choiceText: string, choiceTime: number): number {
  // This would typically be calculated based on response time
  // For now, we'll use a heuristic based on choice complexity
  const complexity = calculateWorkingMemoryLoad(choiceText)
  const speed = 1 - complexity // Inverse relationship with complexity
  
  return Math.max(0.1, Math.min(1, speed))
}

// Helper function to calculate memory encoding
function calculateMemoryEncoding(choiceText: string): number {
  const encodingKeywords = {
    high: ['remember', 'learn', 'understand', 'grasp', 'comprehend', 'absorb'],
    medium: ['notice', 'observe', 'see', 'hear', 'feel', 'experience'],
    low: ['ignore', 'dismiss', 'skip', 'forget', 'overlook']
  }

  const text = choiceText.toLowerCase()
  let encoding = 0.5 // Default medium encoding

  if (encodingKeywords.high.some(keyword => text.includes(keyword))) {
    encoding = 0.8
  } else if (encodingKeywords.medium.some(keyword => text.includes(keyword))) {
    encoding = 0.5
  } else if (encodingKeywords.low.some(keyword => text.includes(keyword))) {
    encoding = 0.2
  }

  return encoding
}

// Helper function to calculate memory retrieval
function calculateMemoryRetrieval(choiceText: string, choiceHistory: string[]): number {
  if (choiceHistory.length < 2) return 0.5

  const currentTheme = extractCareerTheme(choiceText)
  const recentThemes = choiceHistory.slice(-5).map(extractCareerTheme)
  const themeMatches = recentThemes.filter(theme => theme === currentTheme).length

  // Higher retrieval if following established patterns
  return Math.min(1, themeMatches / 3)
}

// Helper function to calculate neural connectivity
function calculateNeuralConnectivity(choiceText: string, choiceHistory: string[]): number {
  if (choiceHistory.length < 3) return 0.5

  const currentTheme = extractCareerTheme(choiceText)
  const allThemes = choiceHistory.map(extractCareerTheme)
  const uniqueThemes = new Set(allThemes).size
  const themeDiversity = uniqueThemes / Math.min(allThemes.length, 10)

  // Higher connectivity if exploring diverse but connected themes
  const connectivity = themeDiversity * 0.7 + (1 - themeDiversity) * 0.3
  return Math.min(1, connectivity)
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
