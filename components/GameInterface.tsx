"use client"

import { useCallback, useMemo, memo } from 'react'
import { useGame } from '@/hooks/useGame'
import { StoryMessage } from './StoryMessage'
import { StreamingMessage } from './StreamingMessage'
import { CharacterIntro } from './CharacterIntro'
import { SilentCompanion } from './SilentCompanion'
import { CareerReflectionHelper } from './CareerReflectionHelper'
import { EmotionalSupport } from './EmotionalSupport'
import { MetacognitiveScaffolding } from './MetacognitiveScaffolding'
import { DevelopmentalPsychologySupport } from './DevelopmentalPsychologySupport'
import { NeuroscienceSupport } from './NeuroscienceSupport'
import { FutureSkillsSupport } from './FutureSkillsSupport'
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
// Memoized choice button component
const ChoiceButton = memo(({ choice, index, onChoice, isProcessing }: {
  choice: any
  index: number
  onChoice: (choice: any) => void
  isProcessing: boolean
}) => (
  <button
    key={index}
    onClick={() => onChoice(choice)}
    disabled={isProcessing}
    className="apple-choice-button"
  >
    {choice.text}
  </button>
))

// Memoized message component
const MessageItem = memo(({ message, index, messages }: {
  message: any
  index: number
  messages: any[]
}) => (
  <div key={message.id} className="apple-message-wrapper">
    <StoryMessage
      speaker={message.speaker}
      text={message.text}
      type={message.type}
      messageWeight={message.messageWeight}
      className={message.className}
      isContinuedSpeaker={index > 0 && messages[index - 1].speaker === message.speaker}
    />
  </div>
))

export function GameInterface() {
  // Use simplified game hook (replaces 14 complex hooks)
  const {
    currentScene,
    hasStarted,
    isProcessing,
    messages,
    performanceLevel,
    emotionalState,
    cognitiveState,
    identityState,
    neuralState,
    skills,
    patterns,
    handleChoice,
    handleContinue,
    handleStartGame,
    handleShare,
    getVisualAdjustments,
    getEmotionalSupport,
    getMetacognitivePrompt,
    getSkillSuggestions,
    updateEmotionalState,
    updateCognitiveState,
    updateIdentityState,
    updateNeuralState,
    updateSkills
  } = useGame()

  // Get visual adjustments based on emotional state (memoized)
  const visualAdjustments = useMemo(() => getVisualAdjustments(), [getVisualAdjustments])
  
  // Get support messages (memoized)
  const emotionalSupport = useMemo(() => getEmotionalSupport(), [getEmotionalSupport])
  const metacognitivePrompt = useMemo(() => getMetacognitivePrompt(), [getMetacognitivePrompt])
  const skillSuggestions = useMemo(() => getSkillSuggestions(), [getSkillSuggestions])

  // Enhanced choice handling with all systems (memoized)
  const handleEnhancedChoice = useCallback((choice: any) => {
    if (isProcessing) return
    
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
    <div className="apple-game-container">
      <div className="apple-game-main" style={visualAdjustments.style}>
        {/* Header */}
        <div className="apple-header">
          <div className="apple-text-headline">Grand Central Terminus</div>
          <div className="apple-text-caption">Birmingham Career Exploration</div>
        </div>

        {/* Messages */}
        <div className="apple-messages-container">
          {messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              index={index}
              messages={messages}
            />
          ))}
        </div>

        {/* Support Messages (Simplified) */}
        {emotionalSupport && (
          <div className="apple-support-message apple-animate-slide-in">
            <div className="apple-support-text">{emotionalSupport.message}</div>
          </div>
        )}

        {metacognitivePrompt && (
          <div className="apple-support-message apple-animate-slide-in">
            <div className="apple-support-text">{metacognitivePrompt}</div>
          </div>
        )}

        {skillSuggestions && (
          <div className="apple-support-message apple-animate-slide-in">
            <div className="apple-support-text">
              Developing: {skillSuggestions.developing.join(', ')}
            </div>
          </div>
        )}

        {/* Choices */}
        {currentScene?.choices && currentScene.choices.length > 0 && (
          <div className="apple-choices-container apple-animate-slide-in">
            {currentScene.choices.map((choice, index) => (
              <ChoiceButton
                key={index}
                choice={choice}
                index={index}
                onChoice={handleEnhancedChoice}
                isProcessing={isProcessing}
              />
            ))}
          </div>
        )}

        {/* Continue Button */}
        {currentScene?.type === 'narration' && (
          <div className="apple-choices-container apple-animate-slide-in">
            <button
              onClick={handleContinue}
              disabled={isProcessing}
              className="apple-button apple-button-primary w-full"
            >
              {isProcessing ? 'Processing...' : 'Continue'}
            </button>
          </div>
        )}

        {/* Share Button */}
        {currentScene && (
          <div className="apple-choices-container apple-animate-slide-in">
            <button
              onClick={handleShare}
              className="apple-button apple-button-ghost w-full"
            >
              Share Progress
            </button>
          </div>
        )}

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="apple-debug-info">
            <div>Performance: {Math.round(performanceLevel * 100)}%</div>
            <div>Stress: {emotionalState.stressLevel}</div>
            <div>Flow: {cognitiveState.flowState}</div>
            <div>Patterns: {Object.entries(patterns).filter(([_, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(', ')}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Memoize the main component to prevent unnecessary re-renders
export default memo(GameInterface)