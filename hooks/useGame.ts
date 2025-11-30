"use client"

import { useCallback, useMemo, useState, useEffect } from 'react'
import { useGameStore, useGameSelectors } from '@/lib/game-store'
import { StoryEngine, type Scene } from '@/lib/story-engine'
import { getPersonaTracker } from '@/lib/player-persona'
import { hapticFeedback } from '@/lib/haptic-feedback'
import { webShare } from '@/lib/web-share'
import { generateBridgeText } from '@/lib/narrative-bridge'
import { analyzeChoiceForCareer, getCareerAnalytics } from '@/lib/career-analytics'
import { updatePlatformResonance, getPlatformResonance } from '@/lib/platform-resonance'
import { createSkillTracker } from '@/lib/skill-tracker'
import { logger } from '@/lib/logger'

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
  const performanceMetrics = useGameSelectors.usePerformanceMetrics()

  // Game state
  const emotionalState = useGameSelectors.useEmotionalState()
  const cognitiveState = useGameSelectors.useCognitiveState()
  const identityState = useGameSelectors.useIdentityState()
  const neuralState = useGameSelectors.useNeuralState()
  const skills = useGameSelectors.useSkills()
  const patterns = useGameSelectors.usePatterns()

  // Additional state from store - using granular selectors for render optimization
  const showIntro = useGameSelectors.useShowIntro()
  const choiceStartTime = useGameSelectors.useChoiceStartTime()
  const messageId = useGameSelectors.useMessageId()
  const visitedScenes = useGameSelectors.useVisitedScenes()
  const choiceHistory = useGameSelectors.useChoiceHistory()
  const platformWarmth = useGameSelectors.usePlatformWarmthAll()
  const platformAccessible = useGameSelectors.usePlatformAccessibleAll()
  const characterTrust = useGameSelectors.useCharacterTrustAll()
  const characterHelped = useGameSelectors.useCharacterHelpedAll()
  const thoughts = useGameSelectors.useThoughts()

  // Actions
  const {
    setCurrentScene: setCurrentSceneId,
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

  // Current scene state (managed separately due to async nature)
  const [currentScene, setCurrentScene] = useState<Scene | null>(null)
  const [sceneLoading, setSceneLoading] = useState(false)

  // Generate consistent user ID for analytics
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      // Try to get existing ID from localStorage
      let existingId = localStorage.getItem('lux-player-id')
      if (!existingId) {
        // Generate new ID and store it
        existingId = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('lux-player-id', existingId)
      }
      return existingId
    }
    return 'anonymous' // Server-side fallback
  })

  // Load scene asynchronously with dynamic choices
  const loadCurrentScene = useCallback(async () => {
    if (!currentSceneId) {
      setCurrentScene(null)
      return
    }

    setSceneLoading(true)

    try {
      // Create game state for dynamic choice generation
      const gameState = {
        currentSceneId,
        hasStarted,
        showIntro,
        isProcessing,
        choiceStartTime,
        messages,
        messageId,
        visitedScenes,
        choiceHistory,
        performanceLevel,
        performanceMetrics,
        platformWarmth,
        platformAccessible,
        characterTrust,
        characterHelped,
        patterns,
        emotionalState,
        cognitiveState,
        identityState,
        neuralState,
        skills,
        thoughts,
        triggeredModules: [],
        coreGameState: null, // Included for type compatibility
        unlockedAchievements: []
      }

      const scene = await storyEngine.getScene(currentSceneId, gameState)
      setCurrentScene(scene)
    } catch (error) {
      console.error('Failed to load scene:', error)
      // Fallback to basic scene without dynamic choices
      try {
        const fallbackScene = await storyEngine.getScene(currentSceneId)
        setCurrentScene(fallbackScene)
      } catch (fallbackError) {
        console.error('Fallback scene loading failed:', fallbackError)
        setCurrentScene(null)
      }
    } finally {
      setSceneLoading(false)
    }
  }, [
    currentSceneId,
    storyEngine,
    performanceLevel,
    platformWarmth,
    characterTrust,
    patterns,
    emotionalState,
    hasStarted,
    showIntro,
    isProcessing,
    choiceStartTime,
    messages,
    messageId,
    visitedScenes,
    choiceHistory,
    performanceMetrics,
    platformAccessible,
    characterHelped,
    cognitiveState,
    identityState,
    neuralState,
    skills
  ])

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
      }
    } catch (error) {
      console.error('Error loading scene:', error)
      // Add fallback message to prevent complete failure
      addMessage({
        speaker: 'System',
        text: 'Something went wrong loading the next scene. Please try again.',
        type: 'narration',
        messageWeight: 'secondary'
      })
    }
  }, [setCurrentSceneId, markSceneVisited, storyEngine, addMessage])

  // Handle choice selection
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

    // Record choice with SkillTracker (handles skill + pattern tracking)
    if (userId) {
      try {
        const skillTracker = createSkillTracker(userId)
        // Create minimal gameState object for SkillTracker
        const minimalGameState = {
          choiceHistory: choiceHistory || [],
          characterRelationships: undefined, // Optional - would need character state integration
          hasStarted,
          currentScene: currentSceneId || 'unknown',
          messages: [],
          choices: [],
          isProcessing,
          userId,
          playerPatterns: patterns,
          birminghamKnowledge: {},
          currentDialogueIndex: 0,
          isShowingDialogue: false,
          dialogueChunks: []
        }
        skillTracker.recordChoice(choice, currentSceneId || 'unknown', minimalGameState as any)
      } catch (error) {
        console.warn('Failed to record choice with SkillTracker:', error)
      }
    }

    // Analyze choice for career path implications
    analyzeChoiceForCareer(choice, userId || 'anonymous')

    // Update platform resonance based on choice
    try {
      const resonanceEvents = updatePlatformResonance(userId || 'anonymous', choice)

      // Log platform resonance changes for development
      if (resonanceEvents.length > 0) {
        logger.debug('Platform resonance updates', {
          operation: 'use-game.platform-resonance',
          events: resonanceEvents.map(event => `${event.platformId}: ${event.type} (${event.intensity.toFixed(2)})`).join(', ')
        })
      }
    } catch (error) {
      console.warn('Platform resonance update failed:', error)
    }

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
      patternUpdates.analytical = (patterns.analytical || 0) + 1
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
    
    // Update patterns through coreGameState to ensure consistency
    // Direct updatePatterns() bypasses coreGameState and gets overwritten by syncDerivedState()
    if (Object.keys(patternUpdates).length > 0) {
      const zustandStore = useGameStore.getState()
      const coreState = zustandStore.coreGameState
      if (coreState) {
        const updated = {
          ...coreState,
          patterns: {
            ...coreState.patterns,
            ...patternUpdates
          }
        }
        zustandStore.setCoreGameState(updated)
        // syncDerivedState is called automatically by setCoreGameState
      } else {
        // Fallback: if coreGameState doesn't exist yet, use direct update
        // This should only happen during initialization
        updatePatterns(patternUpdates)
      }
    }
    
    // Update performance metrics
    updatePerformance({
      rushing: patternUpdates.rushing ? 1 : 0,
      patience: patternUpdates.patience ? 1 : 0
    })

    // Update player persona
    try {
      const personaTracker = getPersonaTracker()
      const gameState = {
        currentSceneId,
        hasStarted,
        showIntro,
        isProcessing,
        choiceStartTime,
        messages,
        messageId,
        visitedScenes,
        choiceHistory,
        performanceLevel,
        performanceMetrics,
        platformWarmth,
        platformAccessible,
        characterTrust,
        characterHelped,
        patterns,
        emotionalState,
        cognitiveState,
        identityState,
        neuralState,
        skills,
        thoughts,
        triggeredModules: [],
        coreGameState: null, // Included for type compatibility
        unlockedAchievements: []
      }

      personaTracker.updatePersona('player-main', choice, responseTime, gameState)
      logger.debug('Player persona updated', { operation: 'use-game.persona-update' })
    } catch (error) {
      console.warn('Persona tracking failed:', error)
    }

    // Process choice with narrative bridge
    if (choice.nextScene) {
      setTimeout(async () => {
        try {
          // Load the next scene to get its text
          const nextScene = await storyEngine.getScene(choice.nextScene)

          if (nextScene?.text) {
            // Generate bridge text connecting the choice to the next scene
            const bridgeText = await generateBridgeText({
              userChoiceText: choice.text,
              nextSceneText: nextScene.text,
              sceneContext: currentScene?.text,
              pattern: choice.consequence?.split('_')[0] // Extract pattern from consequence
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
    storyEngine
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
    sceneLoading,
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
