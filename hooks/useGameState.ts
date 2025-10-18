import { useState, useEffect } from 'react'
import { GameStateManager } from '@/lib/game-state'

import { logger } from '@/lib/logger'
/**
 * Custom hook for managing game state initialization and updates
 * @returns Initialized GameStateManager instance and loading state
 */
export function useGameState() {
  const [gameState, setGameState] = useState<GameStateManager | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Ensure we're on the client side before accessing localStorage
    if (typeof window !== 'undefined') {
      try {
        const manager = new GameStateManager()
        setGameState(manager)
        setIsInitialized(true)
      } catch (error) {
        logger.error('Failed to initialize game state:', { error: error instanceof Error ? error.message : String(error) })
        // Create a fresh instance without localStorage
        const manager = new GameStateManager()
        setGameState(manager)
        setIsInitialized(true)
      }
    }
  }, [])

  const reset = () => {
    if (confirm('Reset your journey? All progress will be lost.')) {
      gameState?.reset()
      window.location.reload()
    }
  }

  return {
    gameState,
    isInitialized,
    reset
  }
}