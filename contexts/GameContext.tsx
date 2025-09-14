"use client"

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useGame } from '@/hooks/useGame'
import { useNormalizedData } from '@/hooks/useNormalizedData'
import { usePerformanceMonitor } from '@/lib/performance-monitor'
import { useMemoryMonitor } from '@/hooks/useMemoryCleanup'

// Context interfaces
interface GameContextValue {
  // Game state
  currentScene: any
  hasStarted: boolean
  isProcessing: boolean
  messages: any[]
  performanceLevel: number
  
  // Emotional state
  emotionalState: any
  updateEmotionalState: (updates: any) => void
  
  // Cognitive state
  cognitiveState: any
  updateCognitiveState: (updates: any) => void
  
  // Identity state
  identityState: any
  updateIdentityState: (updates: any) => void
  
  // Neural state
  neuralState: any
  updateNeuralState: (updates: any) => void
  
  // Skills
  skills: any
  updateSkills: (updates: any) => void
  
  // Patterns
  patterns: any
  
  // Actions
  handleChoice: (choice: any) => void
  handleContinue: () => void
  handleStartGame: () => void
  handleShare: () => void
  
  // Support functions
  getVisualAdjustments: () => any
  getEmotionalSupport: () => any
  getMetacognitivePrompt: () => any
  getSkillSuggestions: () => any
  
  // Performance monitoring
  getMetrics: () => any
  getScore: () => any
  trackSceneTransition: (startTime: number) => void
  trackChoiceResponse: (startTime: number) => void
  
  // Memory monitoring
  getMemoryUsage: () => any
  checkMemoryLeaks: () => any
  
  // Normalized data
  characterRelationships: any[]
  platformRelationships: any[]
  allPatterns: any[]
  activeSession: any
  updateCharacterRelationship: (id: string, updates: any) => any
  updatePlatformRelationship: (id: string, updates: any) => any
  updatePattern: (id: string, updates: any) => any
}

// Create context
const GameContext = createContext<GameContextValue | null>(null)

// Provider component
interface GameContextProviderProps {
  children: ReactNode
}

export function GameContextProvider({ children }: GameContextProviderProps) {
  // Get all game state and functions
  const gameState = useGame()
  const normalizedData = useNormalizedData()
  const performanceMonitor = usePerformanceMonitor()
  const memoryMonitor = useMemoryMonitor()

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // Game state
    currentScene: gameState.currentScene,
    hasStarted: gameState.hasStarted,
    isProcessing: gameState.isProcessing,
    messages: gameState.messages,
    performanceLevel: gameState.performanceLevel,
    
    // Emotional state
    emotionalState: gameState.emotionalState,
    updateEmotionalState: gameState.updateEmotionalState,
    
    // Cognitive state
    cognitiveState: gameState.cognitiveState,
    updateCognitiveState: gameState.updateCognitiveState,
    
    // Identity state
    identityState: gameState.identityState,
    updateIdentityState: gameState.updateIdentityState,
    
    // Neural state
    neuralState: gameState.neuralState,
    updateNeuralState: gameState.updateNeuralState,
    
    // Skills
    skills: gameState.skills,
    updateSkills: gameState.updateSkills,
    
    // Patterns
    patterns: gameState.patterns,
    
    // Actions
    handleChoice: gameState.handleChoice,
    handleContinue: gameState.handleContinue,
    handleStartGame: gameState.handleStartGame,
    handleShare: gameState.handleShare,
    
    // Support functions
    getVisualAdjustments: gameState.getVisualAdjustments,
    getEmotionalSupport: gameState.getEmotionalSupport,
    getMetacognitivePrompt: gameState.getMetacognitivePrompt,
    getSkillSuggestions: gameState.getSkillSuggestions,
    
    // Performance monitoring
    getMetrics: performanceMonitor.getMetrics,
    getScore: performanceMonitor.getScore,
    trackSceneTransition: performanceMonitor.trackSceneTransition,
    trackChoiceResponse: performanceMonitor.trackChoiceResponse,
    
    // Memory monitoring
    getMemoryUsage: memoryMonitor.getMemoryUsage,
    checkMemoryLeaks: memoryMonitor.checkMemoryLeaks,
    
    // Normalized data
    characterRelationships: normalizedData.characterRelationships,
    platformRelationships: normalizedData.platformRelationships,
    allPatterns: normalizedData.allPatterns,
    activeSession: normalizedData.activeSession,
    updateCharacterRelationship: normalizedData.updateCharacterRelationship,
    updatePlatformRelationship: normalizedData.updatePlatformRelationship,
    updatePattern: normalizedData.updatePattern
  }), [gameState, normalizedData, performanceMonitor, memoryMonitor])

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}

// Hook to use game context
export function useGameContext(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider')
  }
  return context
}

// Specialized hooks for specific parts of the context
export function useGameState() {
  const context = useGameContext()
  return {
    currentScene: context.currentScene,
    hasStarted: context.hasStarted,
    isProcessing: context.isProcessing,
    messages: context.messages,
    performanceLevel: context.performanceLevel
  }
}

export function useGameActions() {
  const context = useGameContext()
  return {
    handleChoice: context.handleChoice,
    handleContinue: context.handleContinue,
    handleStartGame: context.handleStartGame,
    handleShare: context.handleShare
  }
}

export function useGameSystems() {
  const context = useGameContext()
  return {
    emotionalState: context.emotionalState,
    cognitiveState: context.cognitiveState,
    identityState: context.identityState,
    neuralState: context.neuralState,
    skills: context.skills,
    patterns: context.patterns,
    updateEmotionalState: context.updateEmotionalState,
    updateCognitiveState: context.updateCognitiveState,
    updateIdentityState: context.updateIdentityState,
    updateNeuralState: context.updateNeuralState,
    updateSkills: context.updateSkills
  }
}

export function useGameSupport() {
  const context = useGameContext()
  return {
    getVisualAdjustments: context.getVisualAdjustments,
    getEmotionalSupport: context.getEmotionalSupport,
    getMetacognitivePrompt: context.getMetacognitivePrompt,
    getSkillSuggestions: context.getSkillSuggestions
  }
}

export function useGameMonitoring() {
  const context = useGameContext()
  return {
    getMetrics: context.getMetrics,
    getScore: context.getScore,
    trackSceneTransition: context.trackSceneTransition,
    trackChoiceResponse: context.trackChoiceResponse,
    getMemoryUsage: context.getMemoryUsage,
    checkMemoryLeaks: context.checkMemoryLeaks
  }
}

export function useGameData() {
  const context = useGameContext()
  return {
    characterRelationships: context.characterRelationships,
    platformRelationships: context.platformRelationships,
    allPatterns: context.allPatterns,
    activeSession: context.activeSession,
    updateCharacterRelationship: context.updateCharacterRelationship,
    updatePlatformRelationship: context.updatePlatformRelationship,
    updatePattern: context.updatePattern
  }
}
