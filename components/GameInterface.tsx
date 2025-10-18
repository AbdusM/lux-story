/**
 * ⚠️ DEPRECATED - DO NOT USE ⚠️
 * 
 * This component is deprecated and should NOT be used for new development.
 * 
 * **Use instead**: StatefulGameInterface.tsx
 * 
 * **Deprecation Date**: October 17, 2025
 * **Reason**: Superseded by StatefulGameInterface with dialogue graph system
 * 
 * See: components/_GAME_INTERFACE_STATUS.md for details
 * 
 * @deprecated Use StatefulGameInterface instead
 */

"use client"

import { useCallback, useMemo, memo, useEffect } from 'react'
import { useGame } from '@/hooks/useGame'
import { useMemoryCleanup } from '@/hooks/useMemoryCleanup'
import { useEventBusSubscription, useEventBusEmitter, useEventBusDebug } from '@/hooks/useEventBus'
import { clearCorruptedStorage } from '@/lib/game-store'
import { GameHeader } from './GameHeader'
import { GameMessages } from './GameMessages'
import { GameSupport } from './GameSupport'
import { GameChoices } from './GameChoices'
import { GameControls } from './GameControls'
import { CharacterIntro } from './CharacterIntro'
import { SilentCompanion } from './SilentCompanion'
import { CareerReflectionHelper } from './CareerReflectionHelper'
import { GameErrorBoundary } from './GameErrorBoundary'
import { logger } from '@/lib/logger'
// Apple Design System removed - using shadcn components
import { cn } from '@/lib/utils'

/**
 * Apple-Style Game Interface
 * Implements Apple design principles: clarity, simplicity, beauty
 * Focuses on emotional resonance and Birmingham youth connection
 *
 * SIMPLIFIED VERSION: Uses only useGame hook for state management
 */

export function GameInterface() {
  // Clear any corrupted localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      clearCorruptedStorage()
    }
  }, [])

  // Use simplified useGame hook directly
  const game = useGame()

  // Event bus integration
  const { emit } = useEventBusEmitter()
  useEventBusDebug(process.env.NODE_ENV === 'development')

  // Defensive defaults for state objects
  const emotionalState = game.emotionalState || {
    stressLevel: 'calm',
    rapidClicks: 0,
    hesitationCount: 0
  }

  // Ensure update functions have safe defaults
  const safeUpdateEmotionalState = game.updateEmotionalState || (() => {})

  // Event bus subscriptions for system events
  useEventBusSubscription('system:error', (data) => {
    logger.error('System error received:', data)
  })

  useEventBusSubscription('system:warning', (data) => {
    logger.warn('System warning received:', data)
  })

  useEventBusSubscription('perf:memory:warning', (data) => {
    logger.warn('Memory warning:', data)
  })

  useEventBusSubscription('perf:render:slow', (data) => {
    logger.warn('Slow render detected:', data)
  })

  // Register cleanup functions
  useMemoryCleanup(() => {
    logger.debug('GameInterface cleanup: clearing component resources')
    emit('system:cleanup', { component: 'GameInterface' })
  }, [emit])

  // Monitor memory usage in development (reduced frequency)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        // Check if Performance API with memory is available (Chrome only)
        if ('memory' in performance) {
          const memoryUsage = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory
          if (memoryUsage && memoryUsage.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
            logger.warn('High memory usage detected:', {
              used: memoryUsage.usedJSHeapSize,
              total: memoryUsage.totalJSHeapSize
            })
            emit('perf:memory:warning', {
              usage: memoryUsage.usedJSHeapSize,
              limit: memoryUsage.totalJSHeapSize
            })
          }
        }
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [emit])

  // Stress monitoring with throttling
  const handleRapidClick = useCallback(() => {
    const currentRapidClicks = (emotionalState.rapidClicks || 0) + 1

    if (currentRapidClicks >= 3) {
      safeUpdateEmotionalState({
        stressLevel: 'anxious',
        rapidClicks: currentRapidClicks,
        breathingRhythm: 'urgent'
      })
    }
  }, [emotionalState.rapidClicks, safeUpdateEmotionalState])

  // Enhanced choice handler with stress and performance tracking
  const handleChoiceWithTracking = useCallback((choice: { text: string; next?: string; consequence?: string; pattern?: string }) => {
    const startTime = Date.now()
    handleRapidClick()

    // Call the actual game choice handler
    game.handleChoice?.(choice)

    // Track response time
    const responseTime = Date.now() - startTime
    if (responseTime < 1000) { // Very quick responses
      safeUpdateEmotionalState({
        rapidClicks: (emotionalState.rapidClicks || 0) + 1
      })
    }
  }, [
    game,
    emotionalState.rapidClicks,
    handleRapidClick,
    safeUpdateEmotionalState
  ])

  // Visual adjustments based on emotional state
  const visualAdjustments = useMemo(() => {
    const baseAdjustments = game.getVisualAdjustments?.() || { style: {} as React.CSSProperties, className: '' }

    // Add additional Apple-style adjustments
    if (emotionalState.stressLevel === 'anxious' || emotionalState.stressLevel === 'overwhelmed') {
      return {
        style: {
          ...baseAdjustments.style,
          filter: 'hue-rotate(10deg) saturate(1.1)',
          transition: 'all 0.3s ease-out'
        } as React.CSSProperties,
        className: baseAdjustments.className + ' apple-stress-response'
      }
    }

    return baseAdjustments
  }, [game, emotionalState.stressLevel])

  // Early return for loading or error states
  if (!game.hasStarted) {
    return (
      <GameErrorBoundary componentName="GameInterface">
        <div className="apple-container apple-loading">
          <CharacterIntro onStart={game.handleStartGame} />
        </div>
      </GameErrorBoundary>
    )
  }

  return (
    <GameErrorBoundary componentName="GameInterface">
      <div
        className={cn(
          "apple-container apple-game-interface",
          visualAdjustments.className
        )}
        style={visualAdjustments.style}
      >
        <GameHeader
          visualAdjustments={visualAdjustments}
        />

        <main className="apple-main-content">
          <GameMessages
            messages={game.messages || []}
          />

          <GameSupport />

          <GameChoices
            choices={game.currentScene?.choices || []}
            isProcessing={game.isProcessing}
            onChoice={handleChoiceWithTracking}
          />

          <GameControls
            currentScene={game.currentScene}
            isProcessing={game.isProcessing}
            onContinue={game.handleContinue}
            onShare={game.handleShare}
          />
        </main>

        <SilentCompanion />

        <CareerReflectionHelper />
      </div>
    </GameErrorBoundary>
  )
}

export default memo(GameInterface)