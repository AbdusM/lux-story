"use client"

import { useCallback, memo, useEffect, useState } from 'react'
import { useOptimizedGame } from '@/hooks/useOptimizedGame'
import { useMemoryCleanup } from '@/hooks/useMemoryCleanup'
import { useEventBusSubscription, useEventBusEmitter } from '@/hooks/useEventBus'
import { clearCorruptedStorage } from '@/lib/game-store'
import { GameHeader } from './GameHeader'
import { GameMessages } from './GameMessages'
import { GameSupport } from './GameSupport'
import { GameChoices } from './GameChoices'
import { GameControls } from './GameControls'
import { CharacterIntro } from './CharacterIntro'
import { SilentCompanion } from './SilentCompanion'
import { SimpleAnalyticsDisplay } from './SimpleAnalyticsDisplay'
import { GameErrorBoundary } from './GameErrorBoundary'
import { hapticFeedback } from '@/lib/haptic-feedback'
import { webShare } from '@/lib/web-share'
import { logger } from '@/lib/logger'
import '@/styles/apple-design-system.css'
import { cn } from '@/lib/utils'

/**
 * Optimized Game Interface
 * Simplified version with basic analytics and improved UX
 * Keeps Gemini integration for narrative bridge generation
 */
export function OptimizedGameInterface() {
  // Clear any corrupted localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      clearCorruptedStorage()
    }
  }, [])

  // Use optimized game hook
  const game = useOptimizedGame()

  // Event bus integration
  const { emit } = useEventBusEmitter()

  // Memory cleanup
  useMemoryCleanup(() => {
    // Cleanup resources
    console.log('OptimizedGameInterface cleanup')
  }, [])

  // Analytics visibility state
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Handle analytics toggle
  const handleAnalyticsToggle = useCallback(() => {
    setShowAnalytics(!showAnalytics)
    hapticFeedback.medium()
  }, [showAnalytics])

  // Get visual adjustments based on performance level
  const getVisualAdjustments = useCallback(() => {
    const adjustments = {
      style: {} as React.CSSProperties,
      className: ''
    }
    
    if (game.performanceLevel < 0.3) {
      adjustments.style.filter = 'hue-rotate(10deg) saturate(1.1)'
      adjustments.className = 'apple-stress-response'
    }
    
    if (game.performanceLevel > 0.7) {
      adjustments.style.transform = 'scale(1.01)'
      adjustments.className += ' apple-high-performance'
    }
    
    return adjustments
  }, [game.performanceLevel])

  // Get career insights
  const careerInsights = game.getCareerInsights()
  const analytics = game.getAnalytics()

  // Emit events for external systems
  useEffect(() => {
    if (game.currentScene) {
      emit('sceneChanged', {
        sceneId: game.currentScene.id,
        sceneType: game.currentScene.type,
        timestamp: Date.now()
      })
    }
  }, [game.currentScene, emit])

  useEffect(() => {
    if (careerInsights) {
      emit('careerInsightsUpdated', {
        primaryInterest: careerInsights.primaryInterest,
        confidence: careerInsights.confidence,
        timestamp: Date.now()
      })
    }
  }, [careerInsights, emit])

  // Show intro if not started
  if (!game.hasStarted) {
    return (
      <div className="min-h-screen grand-central-terminus">
        <CharacterIntro
          onStart={game.handleStartGame}
          onContinue={() => {}}
          hasSavedProgress={false}
        />
        <SilentCompanion />
      </div>
    )
  }

  const visualAdjustments = getVisualAdjustments()

  return (
    <GameErrorBoundary>
      <div 
        className={cn(
          "min-h-screen grand-central-terminus apple-game-container",
          visualAdjustments.className
        )}
        style={visualAdjustments.style}
      >
        {/* Game Header */}
        <GameHeader
          currentScene={game.currentScene}
          isProcessing={game.isProcessing}
          onShare={game.handleShare}
          onAnalyticsToggle={handleAnalyticsToggle}
          showAnalytics={showAnalytics}
        />

        {/* Main Game Content */}
        <div className="apple-game-content">
          {/* Messages */}
          <GameMessages messages={game.messages} />

          {/* Choices */}
          {game.currentScene?.choices && (
            <GameChoices
              choices={game.currentScene.choices}
              isProcessing={game.isProcessing}
              onChoice={game.handleChoice}
            />
          )}

          {/* Continue Button */}
          {game.currentScene?.type === 'narration' && (
            <div className="apple-continue-container">
              <button
                onClick={game.handleContinue}
                disabled={game.isProcessing}
                className="apple-continue-button"
              >
                {game.isProcessing ? 'Processing...' : 'Continue'}
              </button>
            </div>
          )}

          {/* Processing Indicator */}
          {game.isProcessing && (
            <div className="apple-processing-indicator">
              <div className="apple-spinner" />
              <span>Processing your choice...</span>
            </div>
          )}
        </div>

        {/* Support Systems */}
        <GameSupport
          performanceLevel={game.performanceLevel}
          patterns={game.patterns}
          onReset={game.resetGame}
        />

        {/* Simple Analytics Display */}
        <SimpleAnalyticsDisplay
          playerId="current-player"
          isVisible={showAnalytics}
          onToggle={handleAnalyticsToggle}
        />

        {/* Silent Companion */}
        <SilentCompanion />

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded max-w-xs">
            <div>Scene: {game.currentScene?.id}</div>
            <div>Performance: {Math.round(game.performanceLevel * 100)}%</div>
            <div>Choices: {game.patterns ? Object.values(game.patterns).reduce((a, b) => a + b, 0) : 0}</div>
            {careerInsights && (
              <div>Interest: {careerInsights.primaryInterest}</div>
            )}
          </div>
        )}
      </div>
    </GameErrorBoundary>
  )
}

/**
 * Memoized Game Interface for performance
 */
export const OptimizedGameInterfaceMemo = memo(OptimizedGameInterface)
