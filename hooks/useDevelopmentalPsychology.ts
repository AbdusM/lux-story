"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getDevelopmentalPsychologySystem, IdentityState, DevelopmentalMetrics, CulturalContext } from '@/lib/developmental-psychology-system'

/**
 * Hook for developmental psychology and identity formation
 * Integrates with emotional regulation and cognitive development systems
 */
export function useDevelopmentalPsychology() {
  const [identityState, setIdentityState] = useState<IdentityState>({
    identityExploration: 'early',
    selfConcept: 'fragmented',
    culturalIdentity: 'unexplored',
    careerIdentity: 'unclear',
    socialIdentity: 'isolated',
    futureOrientation: 'present'
  })

  const [culturalContext, setCulturalContext] = useState<CulturalContext>({
    culturalValues: ['community', 'family', 'resilience', 'creativity'],
    communityConnections: 0.5,
    familyInfluence: 0.7,
    peerInfluence: 0.6,
    institutionalSupport: 0.4,
    economicFactors: 0.3,
    educationalBackground: 0.5,
    languagePreference: 'adaptive'
  })

  const [developmentalMetrics, setDevelopmentalMetrics] = useState<DevelopmentalMetrics>({
    identityCommitment: 0.5,
    explorationDepth: 0.5,
    culturalAwareness: 0.5,
    futurePlanning: 0.5,
    socialConnection: 0.5,
    selfEfficacy: 0.5,
    resilience: 0.5,
    purpose: 0.5
  })

  const [choiceHistory, setChoiceHistory] = useState<string[]>([])
  const [careerThemeHistory, setCareerThemeHistory] = useState<string[]>([])

  const developmentalSystem = useMemo(() => getDevelopmentalPsychologySystem(), [])

  // Track choice for developmental analysis
  const trackChoice = useCallback((choiceText: string, choiceTime: number) => {
    const choiceComplexity = calculateChoiceComplexity(choiceText)
    const careerTheme = extractCareerTheme(choiceText)
    const identityCommitment = calculateIdentityCommitment(choiceText)
    const explorationDepth = calculateExplorationDepth(choiceText)
    const culturalAwareness = calculateCulturalAwareness(choiceText)
    const futurePlanning = calculateFuturePlanning(choiceText)
    const socialConnection = calculateSocialConnection(choiceText)
    const selfEfficacy = calculateSelfEfficacy(choiceText)
    const resilience = calculateResilience(choiceText)
    const purpose = calculatePurpose(choiceText)

    const newMetrics: DevelopmentalMetrics = {
      identityCommitment,
      explorationDepth,
      culturalAwareness,
      futurePlanning,
      socialConnection,
      selfEfficacy,
      resilience,
      purpose
    }

    setDevelopmentalMetrics(newMetrics)
    setChoiceHistory(prev => [...prev.slice(-9), choiceText]) // Keep last 10 choices
    setCareerThemeHistory(prev => [...prev.slice(-9), careerTheme || 'unknown'])

    // Analyze with developmental psychology system
    const newIdentityState = developmentalSystem.analyzeDevelopmentalMetrics(newMetrics)
    setIdentityState(newIdentityState)
  }, [developmentalSystem])

  // Get identity formation prompt
  const getIdentityPrompt = useCallback(() => {
    return developmentalSystem.getIdentityPrompt()
  }, [developmentalSystem])

  // Get cultural responsiveness prompt
  const getCulturalPrompt = useCallback(() => {
    return developmentalSystem.getCulturalPrompt()
  }, [developmentalSystem])

  // Get youth development support
  const getYouthDevelopmentSupport = useCallback(() => {
    return developmentalSystem.getYouthDevelopmentSupport()
  }, [developmentalSystem])

  // Get cultural adaptations
  const getCulturalAdaptations = useCallback(() => {
    return developmentalSystem.getCulturalAdaptations()
  }, [developmentalSystem])

  // Get identity scaffolding
  const getIdentityScaffolding = useCallback(() => {
    return developmentalSystem.getIdentityScaffolding()
  }, [developmentalSystem])

  // Reset developmental state
  const resetDevelopmentalState = useCallback(() => {
    developmentalSystem.reset()
    setIdentityState({
      identityExploration: 'early',
      selfConcept: 'fragmented',
      culturalIdentity: 'unexplored',
      careerIdentity: 'unclear',
      socialIdentity: 'isolated',
      futureOrientation: 'present'
    })
    setDevelopmentalMetrics({
      identityCommitment: 0.5,
      explorationDepth: 0.5,
      culturalAwareness: 0.5,
      futurePlanning: 0.5,
      socialConnection: 0.5,
      selfEfficacy: 0.5,
      resilience: 0.5,
      purpose: 0.5
    })
    setChoiceHistory([])
    setCareerThemeHistory([])
  }, [developmentalSystem])

  return {
    identityState,
    culturalContext,
    developmentalMetrics,
    trackChoice,
    getIdentityPrompt,
    getCulturalPrompt,
    getYouthDevelopmentSupport,
    getCulturalAdaptations,
    getIdentityScaffolding,
    resetDevelopmentalState
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

  return complexity
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

// Helper function to calculate identity commitment
function calculateIdentityCommitment(choiceText: string): number {
  const commitmentKeywords = {
    high: ['believe', 'value', 'stand', 'commit', 'dedicated', 'passionate', 'purpose'],
    medium: ['prefer', 'like', 'want', 'choose', 'select', 'decide'],
    low: ['maybe', 'perhaps', 'might', 'could', 'unsure', 'dunno']
  }

  const text = choiceText.toLowerCase()
  let commitment = 0.5 // Default medium commitment

  if (commitmentKeywords.high.some(keyword => text.includes(keyword))) {
    commitment = 0.8
  } else if (commitmentKeywords.medium.some(keyword => text.includes(keyword))) {
    commitment = 0.5
  } else if (commitmentKeywords.low.some(keyword => text.includes(keyword))) {
    commitment = 0.2
  }

  return commitment
}

// Helper function to calculate exploration depth
function calculateExplorationDepth(choiceText: string): number {
  const explorationKeywords = {
    high: ['explore', 'discover', 'learn', 'investigate', 'research', 'curious', 'wonder'],
    medium: ['try', 'test', 'experiment', 'check', 'see', 'find'],
    low: ['know', 'sure', 'certain', 'definite', 'clear', 'obvious']
  }

  const text = choiceText.toLowerCase()
  let exploration = 0.5 // Default medium exploration

  if (explorationKeywords.high.some(keyword => text.includes(keyword))) {
    exploration = 0.8
  } else if (explorationKeywords.medium.some(keyword => text.includes(keyword))) {
    exploration = 0.5
  } else if (explorationKeywords.low.some(keyword => text.includes(keyword))) {
    exploration = 0.2
  }

  return exploration
}

// Helper function to calculate cultural awareness
function calculateCulturalAwareness(choiceText: string): number {
  const culturalKeywords = {
    high: ['community', 'family', 'culture', 'tradition', 'heritage', 'values', 'belonging'],
    medium: ['people', 'others', 'together', 'group', 'team', 'shared'],
    low: ['me', 'myself', 'alone', 'individual', 'personal', 'private']
  }

  const text = choiceText.toLowerCase()
  let awareness = 0.5 // Default medium awareness

  if (culturalKeywords.high.some(keyword => text.includes(keyword))) {
    awareness = 0.8
  } else if (culturalKeywords.medium.some(keyword => text.includes(keyword))) {
    awareness = 0.5
  } else if (culturalKeywords.low.some(keyword => text.includes(keyword))) {
    awareness = 0.2
  }

  return awareness
}

// Helper function to calculate future planning
function calculateFuturePlanning(choiceText: string): number {
  const planningKeywords = {
    high: ['future', 'plan', 'goal', 'dream', 'vision', 'ahead', 'later', 'tomorrow'],
    medium: ['next', 'then', 'after', 'soon', 'eventually', 'someday'],
    low: ['now', 'today', 'immediate', 'right', 'current', 'present']
  }

  const text = choiceText.toLowerCase()
  let planning = 0.5 // Default medium planning

  if (planningKeywords.high.some(keyword => text.includes(keyword))) {
    planning = 0.8
  } else if (planningKeywords.medium.some(keyword => text.includes(keyword))) {
    planning = 0.5
  } else if (planningKeywords.low.some(keyword => text.includes(keyword))) {
    planning = 0.2
  }

  return planning
}

// Helper function to calculate social connection
function calculateSocialConnection(choiceText: string): number {
  const socialKeywords = {
    high: ['together', 'with', 'help', 'support', 'team', 'collaborate', 'share'],
    medium: ['others', 'people', 'friends', 'family', 'community', 'group'],
    low: ['alone', 'myself', 'solo', 'independent', 'individual', 'private']
  }

  const text = choiceText.toLowerCase()
  let connection = 0.5 // Default medium connection

  if (socialKeywords.high.some(keyword => text.includes(keyword))) {
    connection = 0.8
  } else if (socialKeywords.medium.some(keyword => text.includes(keyword))) {
    connection = 0.5
  } else if (socialKeywords.low.some(keyword => text.includes(keyword))) {
    connection = 0.2
  }

  return connection
}

// Helper function to calculate self-efficacy
function calculateSelfEfficacy(choiceText: string): number {
  const efficacyKeywords = {
    high: ['can', 'will', 'able', 'capable', 'confident', 'sure', 'know'],
    medium: ['try', 'attempt', 'hope', 'think', 'believe', 'feel'],
    low: ['can\'t', 'won\'t', 'unable', 'doubt', 'unsure', 'maybe', 'might']
  }

  const text = choiceText.toLowerCase()
  let efficacy = 0.5 // Default medium efficacy

  if (efficacyKeywords.high.some(keyword => text.includes(keyword))) {
    efficacy = 0.8
  } else if (efficacyKeywords.medium.some(keyword => text.includes(keyword))) {
    efficacy = 0.5
  } else if (efficacyKeywords.low.some(keyword => text.includes(keyword))) {
    efficacy = 0.2
  }

  return efficacy
}

// Helper function to calculate resilience
function calculateResilience(choiceText: string): number {
  const resilienceKeywords = {
    high: ['overcome', 'persist', 'endure', 'strength', 'resilient', 'bounce', 'recover'],
    medium: ['try', 'attempt', 'effort', 'work', 'struggle', 'challenge'],
    low: ['give', 'quit', 'stop', 'abandon', 'surrender', 'defeat']
  }

  const text = choiceText.toLowerCase()
  let resilience = 0.5 // Default medium resilience

  if (resilienceKeywords.high.some(keyword => text.includes(keyword))) {
    resilience = 0.8
  } else if (resilienceKeywords.medium.some(keyword => text.includes(keyword))) {
    resilience = 0.5
  } else if (resilienceKeywords.low.some(keyword => text.includes(keyword))) {
    resilience = 0.2
  }

  return resilience
}

// Helper function to calculate purpose
function calculatePurpose(choiceText: string): number {
  const purposeKeywords = {
    high: ['purpose', 'meaning', 'mission', 'calling', 'passion', 'drive', 'motivation'],
    medium: ['goal', 'aim', 'target', 'objective', 'plan', 'intention'],
    low: ['random', 'chance', 'luck', 'accident', 'coincidence', 'happenstance']
  }

  const text = choiceText.toLowerCase()
  let purpose = 0.5 // Default medium purpose

  if (purposeKeywords.high.some(keyword => text.includes(keyword))) {
    purpose = 0.8
  } else if (purposeKeywords.medium.some(keyword => text.includes(keyword))) {
    purpose = 0.5
  } else if (purposeKeywords.low.some(keyword => text.includes(keyword))) {
    purpose = 0.2
  }

  return purpose
}
