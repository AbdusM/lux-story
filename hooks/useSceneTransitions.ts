import { useState, useCallback } from 'react'
import { Scene } from '@/lib/story-engine'
import { GameStateManager } from '@/lib/game-state'
import { TIMINGS } from '@/lib/game-constants'

interface SceneTransitionState {
  currentScene: Scene | null
  isLoadingScene: boolean
  isProcessing: boolean
}

/**
 * Custom hook for managing scene transitions and loading states
 * @param storyEngine - The story engine instance
 * @param gameState - The game state manager
 * @returns Scene transition handlers and state
 */
export function useSceneTransitions(
  storyEngine: any,
  gameState: GameStateManager | null
) {
  const [state, setState] = useState<SceneTransitionState>({
    currentScene: null,
    isLoadingScene: false,
    isProcessing: false
  })

  const loadScene = useCallback((sceneId: string) => {
    if (!gameState || state.isLoadingScene) return
    
    // Prevent loading the same scene twice
    if (state.currentScene?.id === sceneId) return
    
    setState(prev => ({ ...prev, isLoadingScene: true }))
    
    const scene = storyEngine.getScene(sceneId)
    if (!scene) {
      console.error('Scene not found:', sceneId)
      setState(prev => ({ ...prev, isLoadingScene: false }))
      return scene
    }
    
    setState(prev => ({ ...prev, currentScene: scene }))
    gameState.setScene(sceneId)
    
    // Clear loading flag after a short delay
    setTimeout(() => {
      setState(prev => ({ ...prev, isLoadingScene: false }))
    }, TIMINGS.SCENE_TRANSITION_DELAY)
    
    return scene
  }, [storyEngine, gameState, state.currentScene, state.isLoadingScene])

  const setProcessing = useCallback((processing: boolean) => {
    setState(prev => ({ ...prev, isProcessing: processing }))
  }, [])

  return {
    currentScene: state.currentScene,
    isLoadingScene: state.isLoadingScene,
    isProcessing: state.isProcessing,
    loadScene,
    setProcessing
  }
}