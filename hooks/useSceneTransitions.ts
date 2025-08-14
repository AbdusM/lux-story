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

  const loadScene = useCallback((sceneId: string, forceLoad = false) => {
    if (!gameState) {
      console.error('Game state not initialized')
      return null
    }
    
    console.log('Loading scene:', sceneId, 'forceLoad:', forceLoad)
    
    // Get the scene first
    const scene = storyEngine.getScene(sceneId)
    if (!scene) {
      console.error('Scene not found:', sceneId)
      return null
    }
    
    // Check if we should skip loading
    const currentSceneId = state.currentScene?.id
    if (!forceLoad && currentSceneId === sceneId && !state.isLoadingScene) {
      console.log('Scene already loaded:', sceneId)
      return scene
    }
    
    // Update state
    console.log('Scene loaded successfully:', scene)
    setState({
      currentScene: scene,
      isLoadingScene: true,
      isProcessing: false
    })
    
    // Update game state
    gameState.setScene(sceneId)
    
    // Clear loading flag after a short delay
    setTimeout(() => {
      setState(prev => ({ ...prev, isLoadingScene: false }))
    }, TIMINGS.SCENE_TRANSITION_DELAY || 300)
    
    return scene
  }, [storyEngine, gameState, state.currentScene?.id, state.isLoadingScene])

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