import { useState, useEffect } from 'react'
import { GameStateManager } from '@/lib/game-state'

/**
 * Custom hook for managing game state initialization and updates
 * @returns Initialized GameStateManager instance and loading state
 */
export function useGameState() {
  const [gameState, setGameState] = useState<GameStateManager | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const manager = new GameStateManager()
    setGameState(manager)
    setIsInitialized(true)
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