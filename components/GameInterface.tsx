"use client"

import { useCallback, useMemo, memo, useEffect } from 'react'
import { useGameContext, useGameState, useGameActions, useGameSystems, useGameSupport, useGameMonitoring } from '@/contexts/GameContext'
import { useMemoryCleanup } from '@/hooks/useMemoryCleanup'
import { GameHeader } from './GameHeader'
import { GameMessages } from './GameMessages'
import { GameSupport } from './GameSupport'
import { GameChoices } from './GameChoices'
import { GameControls } from './GameControls'
import { CharacterIntro } from './CharacterIntro'
import { SilentCompanion } from './SilentCompanion'
import { CareerReflectionHelper } from './CareerReflectionHelper'
import { GameErrorBoundary } from './GameErrorBoundary'
import { hapticFeedback } from '@/lib/haptic-feedback'
import { webShare } from '@/lib/web-share'
import { logger } from '@/lib/logger'
import '@/styles/apple-design-system.css'
import { cn } from '@/lib/utils'

/**
 * Apple-Style Game Interface
 * Implements Apple design principles: clarity, simplicity, beauty
 * Focuses on emotional resonance and Birmingham youth connection
 * 
 * HYBRID VERSION: Uses simplified useGame hook + Apple design components
 */

export function GameInterface() {
  // Use context hooks instead of props drilling
  const gameState = useGameState()
  const gameActions = useGameActions()
  const gameSystems = useGameSystems()
  const gameSupport = useGameSupport()
  const gameMonitoring = useGameMonitoring()

  // Destructure for easier access
  const {
    currentScene,
    hasStarted,
    isProcessing,
    messages,
    performanceLevel
  } = gameState

  const {
    emotionalState,
    cognitiveState,
    identityState,
    neuralState,
    skills,
    patterns,
    updateEmotionalState,
    updateCognitiveState,
    updateIdentityState,
    updateNeuralState,
    updateSkills
  } = gameSystems

  const {
    handleChoice,
    handleContinue,
    handleStartGame,
    handleShare
  } = gameActions

  const {
    getVisualAdjustments,
    getEmotionalSupport,
    getMetacognitivePrompt,
    getSkillSuggestions
  } = gameSupport

  const {
    getMetrics,
    getScore,
    trackSceneTransition,
    trackChoiceResponse,
    getMemoryUsage,
    checkMemoryLeaks
  } = gameMonitoring

  // Register cleanup functions
  useMemoryCleanup(() => {
    // Cleanup any component-specific resources
    logger.debug('GameInterface cleanup: clearing component resources')
  }, [])

  // Monitor memory usage in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const memory = getMemoryUsage()
        const leakCheck = checkMemoryLeaks()
        
        if (leakCheck.isLeaking) {
          logger.warn('Memory leak detected:', leakCheck.details)
        }
        
        logger.debug('Memory usage:', {
          used: `${(memory.used / 1024 / 1024).toFixed(2)}MB`,
          total: `${(memory.total / 1024 / 1024).toFixed(2)}MB`,
          percentage: `${memory.percentage.toFixed(2)}%`
        })
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [getMemoryUsage, checkMemoryLeaks])

  // Get visual adjustments based on emotional state (memoized)
  const visualAdjustments = useMemo(() => getVisualAdjustments(), [getVisualAdjustments])
  
  // Get support messages (memoized)
  const emotionalSupport = useMemo(() => getEmotionalSupport(), [getEmotionalSupport])
  const metacognitivePrompt = useMemo(() => getMetacognitivePrompt(), [getMetacognitivePrompt])
  const skillSuggestions = useMemo(() => getSkillSuggestions(), [getSkillSuggestions])

  // Enhanced choice handling with all systems (memoized)
  const handleEnhancedChoice = useCallback((choice: any) => {
    if (isProcessing) return
    
    // Track performance
    const choiceStartTime = performance.now()
    
    // Track choice across all systems
    const timestamp = Date.now()
    
    // Update emotional state based on choice
    const choiceText = choice.text.toLowerCase()
    if (choiceText.includes('rush') || choiceText.includes('hurry')) {
      updateEmotionalState({ 
        stressLevel: 'anxious',
        rapidClicks: (emotionalState.rapidClicks || 0) + 1
      })
    } else if (choiceText.includes('wait') || choiceText.includes('patience')) {
      updateEmotionalState({ 
        stressLevel: 'calm',
        hesitationCount: (emotionalState.hesitationCount || 0) + 1
      })
    }
    
    // Update cognitive state
    if (choiceText.includes('think') || choiceText.includes('analyze')) {
      updateCognitiveState({
        flowState: 'flow',
        metacognitiveAwareness: Math.min(1, (cognitiveState.metacognitiveAwareness || 0) + 0.1)
      })
    }
    
    // Update skills based on choice patterns
    const skillUpdates: Partial<typeof skills> = {}
    if (choiceText.includes('help') || choiceText.includes('support')) {
      skillUpdates.communication = Math.min(1, (skills.communication || 0) + 0.05)
      skillUpdates.emotionalIntelligence = Math.min(1, (skills.emotionalIntelligence || 0) + 0.05)
    }
    if (choiceText.includes('build') || choiceText.includes('create')) {
      skillUpdates.creativity = Math.min(1, (skills.creativity || 0) + 0.05)
      skillUpdates.problemSolving = Math.min(1, (skills.problemSolving || 0) + 0.05)
    }
    if (choiceText.includes('analyze') || choiceText.includes('think')) {
      skillUpdates.criticalThinking = Math.min(1, (skills.criticalThinking || 0) + 0.05)
    }
    
    if (Object.keys(skillUpdates).length > 0) {
      updateSkills(skillUpdates)
    }
    
    // Call the main choice handler
    handleChoice(choice)
    
    // Track performance
    trackChoiceResponse(choiceStartTime)
  }, [
    isProcessing,
    emotionalState.rapidClicks,
    emotionalState.hesitationCount,
    cognitiveState.metacognitiveAwareness,
    skills.communication,
    skills.emotionalIntelligence,
    skills.creativity,
    skills.problemSolving,
    skills.criticalThinking,
    updateEmotionalState,
    updateCognitiveState,
    updateSkills,
    handleChoice
  ])

  // Show intro if not started
  if (!hasStarted) {
    return (
      <div className="apple-game-container">
        <div className="apple-game-main" style={visualAdjustments.style}>
          <CharacterIntro onStart={handleStartGame} />
        </div>
      </div>
    )
  }

  return (
    <GameErrorBoundary componentName="GameInterface">
      <div className="apple-game-container">
        <div className="apple-game-main" style={visualAdjustments.style}>
        {/* Header */}
        <GameHeader visualAdjustments={visualAdjustments} />

        {/* Messages */}
        <GameMessages messages={messages} />

        {/* Support Messages */}
        <GameSupport
          emotionalSupport={emotionalSupport}
          metacognitivePrompt={metacognitivePrompt}
          skillSuggestions={skillSuggestions}
        />

        {/* Choices */}
        <GameChoices
          choices={currentScene?.choices || []}
          isProcessing={isProcessing}
          onChoice={handleEnhancedChoice}
        />

        {/* Controls */}
        <GameControls
          currentScene={currentScene}
          isProcessing={isProcessing}
          onContinue={handleContinue}
          onShare={handleShare}
        />

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="apple-debug-info">
            <div>Performance: {Math.round(performanceLevel * 100)}%</div>
            <div>Stress: {emotionalState.stressLevel}</div>
            <div>Flow: {cognitiveState.flowState}</div>
            <div>Patterns: {Object.entries(patterns).filter(([_, v]) => (v as number) > 0).map(([k, v]) => `${k}:${v}`).join(', ')}</div>
            <div>Core Web Vitals Score: {Math.round(getScore().overall)}%</div>
            <div>Memory: {getMemoryUsage().percentage.toFixed(1)}%</div>
          </div>
        )}
        </div>
      </div>
    </GameErrorBoundary>
  )
}

// Memoize the main component to prevent unnecessary re-renders
export default memo(GameInterface)