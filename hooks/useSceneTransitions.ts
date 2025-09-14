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
      console.error('❌ Game state not initialized in loadScene')
      return null
    }
    
    console.log('🔄 Loading scene:', sceneId, 'forceLoad:', forceLoad)
    console.log('🔄 Story engine available:', !!storyEngine)
    
    // Get the scene first
    const scene = storyEngine.getScene(sceneId)
    if (!scene) {
      console.error('❌ Scene not found:', sceneId)
      console.error('❌ Available scenes:', storyEngine.getAllScenes?.() || 'getAllScenes not available')
      return null
    }
    
    // Always load the scene when called (simplified logic)
    console.log('✅ Scene loaded successfully:', scene.id, scene.type)
    setState(prev => ({
      currentScene: scene,
      isLoadingScene: true,
      isProcessing: prev.isProcessing
    }))
    
    // Update game state
    console.log('🔄 Updating game state to scene:', sceneId)
    gameState.setScene(sceneId)
    
    // Clear loading flag after a short delay
    setTimeout(() => {
      setState(prev => ({ ...prev, isLoadingScene: false }))
    }, TIMINGS.SCENE_TRANSITION_DELAY || 300)
    
    return scene
  }, [storyEngine, gameState])

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