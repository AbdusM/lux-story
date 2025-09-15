"use client"

import { useCallback, useMemo, useState, useEffect } from 'react'
import { useGameStore, useGameSelectors } from '@/lib/game-store'
import { StoryEngine, type Scene } from '@/lib/story-engine'
import { getSimpleAnalytics, trackChoice } from '@/lib/simple-analytics'
import { hapticFeedback } from '@/lib/haptic-feedback'
import { webShare } from '@/lib/web-share'
import { generateBridgeText } from '@/lib/narrative-bridge'

/**
 * Optimized Game Hook
 * Simplified version that focuses on core functionality with basic analytics
 * Keeps Gemini integration for narrative bridge generation
 */
export function useOptimizedGame() {
  // Core game state
  const currentSceneId = useGameSelectors.useCurrentScene()
  const hasStarted = useGameSelectors.useGameStarted()
  const isProcessing = useGameSelectors.useIsProcessing()
  const messages = useGameSelectors.useMessages()
  const performanceLevel = useGameSelectors.usePerformanceLevel()

  // Game state
  const patterns = useGameSelectors.usePatterns()
  const choiceHistory = useGameSelectors.useChoiceHistory()

  // Additional state from store
  const gameStore = useGameStore()
  const {
    showIntro,
    choiceStartTime,
    messageId,
    visitedScenes,
    platformWarmth,
    characterTrust
  } = gameStore
  
  // Actions
  const {
    setCurrentScene: setCurrentSceneId,
    startGame,
    setProcessing,
    setChoiceStartTime,
    addMessage,
    clearMessages,
    markSceneVisited,
    addChoiceRecord,
    updatePatterns,
    updatePerformance,
    resetGame
  } = useGameStore()

  // Story engine instance (memoized)
  const storyEngine = useMemo(() => new StoryEngine(), [])

  // Current scene state
  const [currentScene, setCurrentScene] = useState<Scene | null>(null)
  const [sceneLoading, setSceneLoading] = useState(false)

  // Generate consistent user ID for analytics
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let existingId = localStorage.getItem('lux-player-id')
      if (!existingId) {
        existingId = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('lux-player-id', existingId)
      }
      return existingId
    }
    return 'anonymous'
  })

  // Initialize analytics session
  useEffect(() => {
    if (userId && hasStarted) {
      const analytics = getSimpleAnalytics()
      analytics.initializeSession(userId)
    }
  }, [userId, hasStarted])

  // Load scene asynchronously
  const loadCurrentScene = useCallback(async () => {
    if (!currentSceneId) {
      setCurrentScene(null)
      return
    }

    setSceneLoading(true)

    try {
      const scene = await storyEngine.getScene(currentSceneId)
      setCurrentScene(scene)
    } catch (error) {
      console.error('Failed to load scene:', error)
      setCurrentScene(null)
    } finally {
      setSceneLoading(false)
    }
  }, [currentSceneId, storyEngine])

  // Load scene when currentSceneId changes
  useEffect(() => {
    loadCurrentScene()
  }, [loadCurrentScene])

  // Load scene
  const loadScene = useCallback(async (sceneId: string) => {
    try {
      setCurrentSceneId(sceneId)
      markSceneVisited(sceneId)

      const scene = await storyEngine.getScene(sceneId)
      if (scene) {
        addMessage({
          speaker: scene.speaker || 'Narrator',
          text: scene.text || '',
          type: scene.type === 'choice' ? 'narration' : 'narration',
          messageWeight: 'primary'
        })

        // Track scene completion in analytics
        const analytics = getSimpleAnalytics()
        analytics.trackSceneCompletion(userId, sceneId)
      }
    } catch (error) {
      console.error('Error loading scene:', error)
      addMessage({
        speaker: 'System',
        text: 'Something went wrong loading the next scene. Please try again.',
        type: 'narration',
        messageWeight: 'secondary'
      })
    }
  }, [setCurrentSceneId, markSceneVisited, storyEngine, addMessage, userId])

  // Handle choice selection with simplified analytics
  const handleChoice = useCallback((choice: any) => {
    if (isProcessing) return

    const responseStartTime = Date.now()
    const responseTime = choiceStartTime ? responseStartTime - choiceStartTime : 0

    // Haptic feedback
    hapticFeedback.choice()

    setProcessing(true)
    setChoiceStartTime(responseStartTime)
    
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

    // Track choice with simplified analytics
    trackChoice(userId, {
      text: choice.text,
      consequence: choice.consequence || '',
      responseTime
    })

    // Update patterns (simplified)
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
    
    if (Object.keys(patternUpdates).length > 0) {
      updatePatterns(patternUpdates)
    }
    
    // Update performance metrics (simplified)
    updatePerformance({
      rushing: choiceText.includes('rush') || choiceText.includes('hurry') ? 1 : 0,
      patience: choiceText.includes('wait') || choiceText.includes('patience') ? 1 : 0
    })

    // Process choice with narrative bridge (keep Gemini integration)
    if (choice.nextScene) {
      setTimeout(async () => {
        try {
          // Load the next scene to get its text
          const nextScene = await storyEngine.getScene(choice.nextScene)

          if (nextScene?.text) {
            // Generate bridge text using Gemini
            const bridgeText = await generateBridgeText({
              userChoiceText: choice.text,
              nextSceneText: nextScene.text,
              sceneContext: currentScene?.text,
              pattern: choice.consequence?.split('_')[0]
            })

            // Add bridge text as a narrative message
            if (bridgeText && bridgeText.trim() !== '') {
              addMessage({
                speaker: 'Narrator',
                text: bridgeText,
                type: 'narration',
                messageWeight: 'tertiary'
              })

              // Small delay to let bridge text appear before scene transition
              await new Promise(resolve => setTimeout(resolve, 500))
            }
          }

          // Load the next scene
          loadScene(choice.nextScene)
          setProcessing(false)
          hapticFeedback.storyProgress()
        } catch (error) {
          console.error('❌ Bridge generation failed, proceeding with scene:', error)
          // Fallback to normal scene transition
          loadScene(choice.nextScene)
          setProcessing(false)
          hapticFeedback.storyProgress()
        }
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
    currentScene,
    patterns,
    updatePatterns,
    updatePerformance,
    loadScene,
    storyEngine,
    userId
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

  // Get career insights from simplified analytics
  const getCareerInsights = useCallback(() => {
    const analytics = getSimpleAnalytics()
    return analytics.getCareerInsights(userId)
  }, [userId])

  // Get analytics data
  const getAnalytics = useCallback(() => {
    const analytics = getSimpleAnalytics()
    return analytics.getAnalytics(userId)
  }, [userId])

  return {
    // State
    currentScene,
    hasStarted,
    isProcessing,
    sceneLoading,
    messages,
    performanceLevel,
    patterns,
    
    // Actions
    handleChoice,
    handleContinue,
    handleStartGame,
    handleShare,
    loadScene,
    resetGame,
    
    // Analytics
    getCareerInsights,
    getAnalytics,
    
    // Direct state updates (for advanced usage)
    updatePatterns,
    updatePerformance
  }
}
