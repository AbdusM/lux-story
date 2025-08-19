"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StoryMessage } from "./StoryMessage"
import { CharacterIntro } from "./CharacterIntro"
import { SilentCompanion } from "./SilentCompanion"
import { StoryEngine, Choice } from "@/lib/story-engine"
import { ChevronRight, RotateCcw } from "lucide-react"

// Simplified hooks - no more gamification
import { useGameState } from "@/hooks/useGameState"
import { useSceneTransitions } from "@/hooks/useSceneTransitions"
import { useMessageManager } from "@/hooks/useMessageManager"
import { usePresence } from "@/hooks/usePresence"
import { useAdaptiveNarrative } from "@/hooks/useAdaptiveNarrative"
import { getPerformanceSystem } from "@/lib/performance-system"
import { getGrandCentralState } from "@/lib/grand-central-state"

export function GameInterface() {
  const [storyEngine] = useState(() => new StoryEngine())
  const [showIntro, setShowIntro] = useState(true)
  const [choiceStartTime, setChoiceStartTime] = useState<number>(Date.now())
  const [lastSceneLoadTime, setLastSceneLoadTime] = useState<number>(0)
  const performanceSystem = useMemo(() => getPerformanceSystem(), [])
  const grandCentralState = useMemo(() => getGrandCentralState(), [])
  
  // Simplified state management - no tracking, no stats
  const { gameState, isInitialized, reset } = useGameState()
  const { currentScene, isProcessing, loadScene, setProcessing } = useSceneTransitions(storyEngine, gameState)
  const { messages, messagesEndRef, addMessage, clearMessages } = useMessageManager()
  const { resetPresence } = usePresence()
  const { performanceLevel, enhanceSceneText, enhanceChoices } = useAdaptiveNarrative()
  
  // Track choice timing for Grand Central Terminus - no forest interference
  useEffect(() => {
    if (currentScene?.type === 'choice') {
      setChoiceStartTime(Date.now()) // Track when choice appears for performance metrics only
    }
  }, [currentScene])
  
  // Load scene with simple message handling
  const handleLoadScene = useCallback((sceneId: string, forceLoad = false) => {
    
    // Prevent rapid scene loading (debounce)
    const now = Date.now()
    if (!forceLoad && now - lastSceneLoadTime < 500) {
      return
    }
    setLastSceneLoadTime(now)
    
    if (!gameState) {
      return
    }
    
    // Load the scene first through useSceneTransitions
    const scene = loadScene(sceneId, forceLoad)
    if (!scene) {
      return
    }
    
    // Display text with adaptive enhancements
    if (scene.text) {
      const speaker = scene.speaker || 'narrator'
      const enhancedText = enhanceSceneText(scene.text, scene.type)
      addMessage({ 
        speaker, 
        text: enhancedText,
        type: scene.type as 'narration' | 'dialogue'
      })
      
      // No breathing invitations for Grand Central Terminus - this is career exploration, not meditation
    }
  }, [loadScene, gameState, addMessage, lastSceneLoadTime])
  
  const handleStartGame = useCallback(() => {
    setShowIntro(false)
    if (gameState) {
      // Always start from the beginning for a new game
      const initialScene = '1-1'
      // Clear messages and reset state for fresh start
      clearMessages()
      resetPresence()
      // Reset game state to beginning
      gameState.setScene(initialScene)
      // Force load the initial scene (handleLoadScene will add the message)
      handleLoadScene(initialScene, true)
    }
  }, [gameState, clearMessages, resetPresence, handleLoadScene])

  const handleContinueGame = useCallback(() => {
    setShowIntro(false)
    if (gameState) {
      const state = gameState.getState()
      // Clear messages but keep progress
      clearMessages()
      resetPresence()
      // Load the saved scene
      handleLoadScene(state.currentScene, true)
    }
  }, [gameState, clearMessages, resetPresence, handleLoadScene])
  
  
  const handleChoice = useCallback(async (choice: any) => {
    console.log('handleChoice called with:', choice)
    try {
      if (!gameState || !currentScene) {
        console.log('Missing gameState or currentScene:', { gameState: !!gameState, currentScene: !!currentScene })
        return
      }
      
      setProcessing(true)
      resetPresence() // New scene, new presence
    
    // Calculate time taken to make choice
    const timeToChoose = Date.now() - choiceStartTime
    
    // Apply Grand Central choice effects
    if (choice.stateChanges) {
      grandCentralState.applyChoiceEffects(choice.stateChanges)
    }
    
    // Record the choice with theme tracking for Birmingham demo
    // Map consequences to career-relevant themes
    const themeMap: Record<string, string> = {
      'trusting': 'trust',
      'cautious': 'analyzing',
      'rebellious': 'independence',
      'analytical': 'analyzing',
      'builder': 'building',
      'helper': 'helping',
      'focused': 'rushing',
      'direct': 'analyzing',
      'curious': 'exploring',
      'impatient': 'rushing',
      'determined': 'rushing',
      'exploring': 'exploring',
      'connecting': 'helping',
      'observing': 'patience',
      'explorer_quiet': 'exploring',
      'understanding_quiet': 'analyzing',
      'helper_quiet': 'helping',
      'revolutionary_quiet': 'independence',
      // Chapter 2 career values consequences
      'service_calling': 'helping',
      'systems_calling': 'building',
      'analysis_calling': 'analyzing',
      'future_calling': 'exploring',
      'service_systems_blend': 'helping',
      'systems_analysis_blend': 'building',
      'analysis_future_blend': 'analyzing',
      'future_independence_blend': 'exploring',
      'service_systems_clarity': 'helping',
      'systems_analysis_clarity': 'building',
      'analysis_future_clarity': 'analyzing',
      'future_independence_clarity': 'exploring',
      'practical_guidance': 'patience',
      'hybrid_exploration': 'independence',
      'mentoring_others': 'helping',
      'contemplative_insight': 'patience',
      'focused_commitment': 'building',
      'hybrid_integration': 'independence',
      'guide_commitment': 'helping',
      'continued_exploration': 'exploring',
      'confident_departure': 'building',
      'service_before_self': 'helping',
      'station_integration': 'independence',
      'final_reflection': 'patience',
      'values_guided_career': 'analyzing',
      'workforce_development_career': 'helping',
      'career_innovation': 'independence',
      'lifelong_exploration': 'exploring',
      // Chapter 3 career development consequences
      'healthcare_exploration': 'helping',
      'innovation_networking': 'exploring',
      'community_service': 'helping',
      'strategic_research': 'analyzing',
      'organic_exploration': 'patience',
      'parallel_exploration': 'exploring',
      'skills_first_approach': 'building',
      'relationship_building': 'helping',
      'technical_specialization': 'building',
      'interpersonal_development': 'helping',
      'business_acumen': 'analyzing',
      'entrepreneurial_development': 'independence',
      'mentorship_approach': 'patience',
      'project_approach': 'building',
      'community_approach': 'helping',
      'creation_approach': 'independence',
      'specialization_focus': 'building',
      'generalist_focus': 'exploring',
      'influence_focus': 'helping',
      'innovation_focus': 'independence',
      'systematic_planning': 'building',
      'adaptive_planning': 'exploring',
      'balanced_planning': 'patience',
      'relationship_planning': 'helping',
      'values_evolution_insight': 'patience',
      'location_advantage_insight': 'analyzing',
      'contribution_insight': 'helping',
      'relationship_insight': 'helping',
      'mentorship_commitment': 'helping',
      'building_commitment': 'building',
      'exploration_commitment': 'exploring',
      'integration_commitment': 'analyzing'
    }
    
    const theme = themeMap[choice.consequence] || choice.consequence
    gameState.recordChoiceWithTheme(currentScene.id, choice.text, choice.consequence, theme)
    
    // Update performance metrics
    const character = messages.slice(-5).find(m => m.speaker !== 'You' && m.speaker !== 'narrator')?.speaker
    performanceSystem.updateFromChoice(theme, timeToChoose, currentScene.id, character)
    
    // Get all recent themes for pattern analysis
    const state = gameState.getState()
    const recentThemes = state.choices.slice(-10).map(c => {
      const mappedTheme = themeMap[c.consequence] || c.consequence
      return mappedTheme
    })
    performanceSystem.updateFromPatterns(recentThemes)
    
    // Add choice to messages
    addMessage({
      speaker: 'You',
      text: choice.text,
      type: 'dialogue'
    })
    
    // Load next scene after a short delay
    setTimeout(() => {
      handleLoadScene(choice.nextScene)
      setProcessing(false)
    }, 1000)
    
    } catch (error) {
      setProcessing(false)
    }
  }, [gameState, currentScene, setProcessing, addMessage, handleLoadScene, resetPresence, choiceStartTime, performanceSystem, messages])
  
  const handleContinue = useCallback(() => {
    if (!currentScene) return
    
    const nextSceneId = storyEngine.getNextScene(currentScene.id)
    if (nextSceneId) {
      handleLoadScene(nextSceneId)
    } else {
      // End of current chapter
      addMessage({
        speaker: 'narrator',
        text: 'To be continued...',
        type: 'narration'
      })
    }
  }, [currentScene, storyEngine, handleLoadScene, addMessage])
  
  // Loading state
  if (!gameState || !isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  // Intro screen
  if (showIntro) {
    const hasSavedProgress = gameState.getState().currentScene !== '1-1'
    return (
      <CharacterIntro 
        onStart={handleStartGame}
        onContinue={handleContinueGame}
        hasSavedProgress={hasSavedProgress}
      />
    )
  }
  
  const state = gameState.getState()
  
  const gcState = grandCentralState.getState()
  const platformClass = gcState.platforms.p1.warmth > 2 ? 'platform-warm' : 
                      gcState.platforms.p1.warmth < -2 ? 'platform-cold' : 'platform-neutral'
  const quietHourClass = gcState.time.stopped ? 'quiet-hour' : ''
  
  return (
    <div className={`game-container container max-w-4xl mx-auto p-4 md:p-4 p-0 performance-${performanceLevel} grand-central-terminus ${platformClass} ${quietHourClass}`}>
      <Card className="game-card max-w-3xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-sm text-muted-foreground">
            <span>·</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages Area - The only thing on screen */}
          <div className="h-[60vh] overflow-y-auto mb-4 space-y-3 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Your journey begins...</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="fade-in">
                  <StoryMessage
                    speaker={msg.speaker}
                    text={msg.text}
                    type={msg.type}
                  />
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Action Area - Adaptive choice layout */}
          <div className="choice-buttons border-t pt-4">
            {currentScene?.type === 'choice' && currentScene.choices ? (
              <div className={
                currentScene.choices.length === 1 
                  ? "flex justify-center" 
                  : currentScene.choices.length === 2
                  ? "grid grid-cols-1 md:grid-cols-2 gap-2"
                  : currentScene.choices.length === 3
                  ? "grid grid-cols-1 md:grid-cols-3 gap-2"
                  : "grid grid-cols-1 md:grid-cols-2 gap-2"
              }>
                {enhanceChoices(currentScene.choices).map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    disabled={isProcessing}
                    variant={currentScene.choices?.length === 1 ? "default" : "outline"}
                    className={`choice-button h-auto py-3 px-4 text-sm md:text-base text-left md:text-center whitespace-normal ${
                      currentScene.choices?.length === 1 ? "max-w-xs" : ""
                    }`}
                  >
                    <span className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 md:hidden" />
                      <span>{choice.text}</span>
                    </span>
                  </Button>
                ))}
              </div>
            ) : currentScene ? (
              <Button
                onClick={handleContinue}
                disabled={isProcessing || !storyEngine.getNextScene(currentScene.id)}
                className="w-full"
                size="lg"
              >
                {storyEngine.getNextScene(currentScene.id) ? 'Continue' : 'Chapter Complete'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
      
      {/* No breathing invitation for Grand Central Terminus */}
      
      {/* Silent companion - only speaks when asked, only asks questions */}
      <SilentCompanion />
    </div>
  )
}