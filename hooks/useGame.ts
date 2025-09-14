"use client"

import { useCallback, useMemo } from 'react'
import { useGameStore, useGameSelectors } from '@/lib/game-store'
import { StoryEngine } from '@/lib/story-engine'
import { hapticFeedback } from '@/lib/haptic-feedback'
import { webShare } from '@/lib/web-share'

/**
 * Simplified Game Hook
 * Replaces 14 complex hooks with a single, focused hook
 * Uses Zustand for state management and optimized selectors
 */
export function useGame() {
  // Core game state
  const currentSceneId = useGameSelectors.useCurrentScene()
  const hasStarted = useGameSelectors.useGameStarted()
  const isProcessing = useGameSelectors.useIsProcessing()
  const messages = useGameSelectors.useMessages()
  const performanceLevel = useGameSelectors.usePerformanceLevel()
  
  // Game state
  const emotionalState = useGameSelectors.useEmotionalState()
  const cognitiveState = useGameSelectors.useCognitiveState()
  const identityState = useGameSelectors.useIdentityState()
  const neuralState = useGameSelectors.useNeuralState()
  const skills = useGameSelectors.useSkills()
  const patterns = useGameSelectors.usePatterns()
  
  // Actions
  const {
    setCurrentScene,
    startGame,
    setProcessing,
    setChoiceStartTime,
    addMessage,
    addStreamingMessage,
    clearMessages,
    markSceneVisited,
    addChoiceRecord,
    updatePerformance,
    updatePlatformWarmth,
    updateCharacterTrust,
    updateCharacterHelped,
    updatePatterns,
    updateEmotionalState,
    updateCognitiveState,
    updateIdentityState,
    updateNeuralState,
    updateSkills,
    resetGame
  } = useGameStore()

  // Story engine instance (memoized)
  const storyEngine = useMemo(() => new StoryEngine(), [])

  // Get current scene
  const currentScene = useMemo(() => {
    if (!currentSceneId) return null
    return storyEngine.getScene(currentSceneId)
  }, [currentSceneId, storyEngine])

  // Load scene
  const loadScene = useCallback((sceneId: string) => {
    setCurrentScene(sceneId)
    markSceneVisited(sceneId)
    
    const scene = storyEngine.getScene(sceneId)
    if (scene) {
      addMessage({
        speaker: scene.speaker || 'Narrator',
        text: scene.text || '',
        type: scene.type === 'choice' ? 'narration' : 'narration',
        messageWeight: 'primary'
      })
    }
  }, [setCurrentScene, markSceneVisited, storyEngine, addMessage])

  // Handle choice selection
  const handleChoice = useCallback((choice: any) => {
    if (isProcessing) return
    
    // Haptic feedback
    hapticFeedback.choice()
    
    setProcessing(true)
    setChoiceStartTime(Date.now())
    
    // Add user choice message
    addMessage({
      speaker: 'You',
      text: choice.text,
      type: 'dialogue',
      messageWeight: 'primary'
    })
    
    // Record choice
    addChoiceRecord({
      sceneId: currentSceneId || 'unknown',
      choice: choice.text,
      timestamp: Date.now(),
      consequences: choice.consequences
    })
    
    // Update patterns based on choice
    const choiceText = choice.text.toLowerCase()
    const patternUpdates: Partial<typeof patterns> = {}
    
    if (choiceText.includes('explore') || choiceText.includes('investigate')) {
      patternUpdates.exploring = (patterns.exploring || 0) + 1
    }
    if (choiceText.includes('help') || choiceText.includes('support')) {
      patternUpdates.helping = (patterns.helping || 0) + 1
    }
    if (choiceText.includes('build') || choiceText.includes('create')) {
      patternUpdates.building = (patterns.building || 0) + 1
    }
    if (choiceText.includes('analyze') || choiceText.includes('think')) {
      patternUpdates.analyzing = (patterns.analyzing || 0) + 1
    }
    if (choiceText.includes('wait') || choiceText.includes('patience')) {
      patternUpdates.patience = (patterns.patience || 0) + 1
    }
    if (choiceText.includes('rush') || choiceText.includes('hurry')) {
      patternUpdates.rushing = (patterns.rushing || 0) + 1
    }
    if (choiceText.includes('alone') || choiceText.includes('independent')) {
      patternUpdates.independence = (patterns.independence || 0) + 1
    }
    
    if (Object.keys(patternUpdates).length > 0) {
      updatePatterns(patternUpdates)
    }
    
    // Update performance metrics
    updatePerformance({
      rushing: patternUpdates.rushing ? 1 : 0,
      patience: patternUpdates.patience ? 1 : 0
    })
    
    // Process choice
    if (choice.nextScene) {
      setTimeout(() => {
        loadScene(choice.nextScene)
        setProcessing(false)
        hapticFeedback.storyProgress()
      }, 1000)
    } else {
      setProcessing(false)
    }
  }, [
    isProcessing,
    setProcessing,
    setChoiceStartTime,
    addMessage,
    addChoiceRecord,
    currentSceneId,
    patterns,
    updatePatterns,
    updatePerformance,
    loadScene
  ])

  // Handle continue
  const handleContinue = useCallback(() => {
    if (isProcessing || !currentScene) return
    
    hapticFeedback.medium()
    setProcessing(true)
    
    const nextSceneId = storyEngine.getNextScene(currentScene.id)
    if (nextSceneId) {
      setTimeout(() => {
        loadScene(nextSceneId)
        setProcessing(false)
        hapticFeedback.storyProgress()
      }, 1000)
    } else {
      setProcessing(false)
    }
  }, [isProcessing, currentScene, storyEngine, setProcessing, loadScene])

  // Start game
  const handleStartGame = useCallback(() => {
    hapticFeedback.success()
    startGame()
    clearMessages()
    loadScene('1-1')
  }, [startGame, clearMessages, loadScene])

  // Handle sharing
  const handleShare = useCallback(async () => {
    if (!currentScene) return
    
    try {
      const success = await webShare.shareProgress(
        currentScene.id,
        currentScene.text || 'Exploring my career path'
      )
      
      if (success) {
        hapticFeedback.success()
      }
    } catch (error) {
      console.error('Share failed:', error)
      hapticFeedback.error()
    }
  }, [currentScene])

  // Get visual adjustments based on emotional state
  const getVisualAdjustments = useCallback(() => {
    const { stressLevel, emotionalIntensity } = emotionalState
    
    const adjustments = {
      style: {} as React.CSSProperties,
      className: ''
    }
    
    if (stressLevel === 'anxious' || stressLevel === 'overwhelmed') {
      adjustments.style.filter = 'hue-rotate(10deg) saturate(1.1)'
      adjustments.className = 'apple-stress-response'
    }
    
    if (emotionalIntensity > 0.7) {
      adjustments.style.transform = 'scale(1.02)'
      adjustments.className += ' apple-high-intensity'
    }
    
    return adjustments
  }, [emotionalState])

  // Get emotional support message
  const getEmotionalSupport = useCallback(() => {
    const { stressLevel, rapidClicks, hesitationCount } = emotionalState
    
    if (rapidClicks > 5) {
      return {
        message: "Take a moment to breathe. There's no rush in this journey.",
        type: 'calm' as const
      }
    }
    
    if (hesitationCount > 3) {
      return {
        message: "Trust your instincts. Every choice is a step forward.",
        type: 'encourage' as const
      }
    }
    
    if (stressLevel === 'anxious') {
      return {
        message: "You're doing great. This is your story to explore.",
        type: 'reassure' as const
      }
    }
    
    return null
  }, [emotionalState])

  // Get metacognitive prompt
  const getMetacognitivePrompt = useCallback(() => {
    const { flowState, challengeLevel, skillLevel } = cognitiveState
    
    if (flowState === 'struggle' && challengeLevel > skillLevel) {
      return "What skills might help you approach this differently?"
    }
    
    if (flowState === 'boredom' && skillLevel > challengeLevel) {
      return "How could you add more complexity to this situation?"
    }
    
    if (flowState === 'anxiety') {
      return "What would make this feel more manageable for you?"
    }
    
    return null
  }, [cognitiveState])

  // Get skill development suggestions
  const getSkillSuggestions = useCallback(() => {
    const skillEntries = Object.entries(skills) as [keyof typeof skills, number][]
    const developingSkills = skillEntries
      .filter(([_, value]) => value > 0.3 && value < 0.7)
      .map(([skill, _]) => skill)
    
    if (developingSkills.length === 0) return null
    
    return {
      developing: developingSkills,
      suggestions: developingSkills.map(skill => 
        `Continue exploring ${skill.replace(/([A-Z])/g, ' $1').toLowerCase()} opportunities`
      )
    }
  }, [skills])

  return {
    // State
    currentScene,
    hasStarted,
    isProcessing,
    messages,
    performanceLevel,
    emotionalState,
    cognitiveState,
    identityState,
    neuralState,
    skills,
    patterns,
    
    // Actions
    handleChoice,
    handleContinue,
    handleStartGame,
    handleShare,
    loadScene,
    resetGame,
    
    // Support functions
    getVisualAdjustments,
    getEmotionalSupport,
    getMetacognitivePrompt,
    getSkillSuggestions,
    
    // Direct state updates (for advanced usage)
    updateEmotionalState,
    updateCognitiveState,
    updateIdentityState,
    updateNeuralState,
    updateSkills,
    updatePatterns,
    updatePerformance,
    updatePlatformWarmth,
    updateCharacterTrust,
    updateCharacterHelped
  }
}
