/**
 * MINIMAL Game Interface - Zero Complex Dependencies
 * Breaks the whack-a-mole cycle with guaranteed-working simple components
 */

"use client"

import { useSimpleGame } from '@/hooks/useSimpleGame'
import '@/styles/apple-design-system.css'

// Text parsing function for visual hierarchy and bite-sized information
function parseTextWithHierarchy(text: string) {
  // Split by double line breaks to create major sections
  const sections = text.split('\n\n').filter(section => section.trim())
  
  return sections.map((section, index) => {
    const trimmedSection = section.trim()
    
    // Detect different types of content for appropriate styling
    if (trimmedSection.startsWith('"') && trimmedSection.endsWith('"')) {
      // Direct dialogue - make it prominent
      return (
        <div key={index} className="apple-dialogue-block">
          <div className="apple-dialogue-text">
            {trimmedSection.slice(1, -1)}
          </div>
        </div>
      )
    } else if (trimmedSection.includes(':')) {
      // Scene setting or character action - make it contextual
      return (
        <div key={index} className="apple-context-block">
          <div className="apple-context-text">
            {trimmedSection}
          </div>
        </div>
      )
    } else if (trimmedSection.length > 100) {
      // Long narrative - break into smaller chunks
      const sentences = trimmedSection.split('. ').filter(s => s.trim())
      return (
        <div key={index} className="apple-narrative-block">
          {sentences.map((sentence, sentenceIndex) => (
            <div key={sentenceIndex} className="apple-narrative-sentence">
              {sentence.trim()}{sentenceIndex < sentences.length - 1 ? '.' : ''}
            </div>
          ))}
        </div>
      )
    } else {
      // Short statements - make them punchy
      return (
        <div key={index} className="apple-statement-block">
          <div className="apple-statement-text">
            {trimmedSection}
          </div>
        </div>
      )
    }
  })
}

export function MinimalGameInterface() {
  const game = useSimpleGame()

  // Show intro screen if not started
  if (!game.hasStarted) {
    return (
      <div className="apple-game-container">
        <div className="apple-game-content">
          <div className="apple-header">
            <div className="apple-text-headline">Grand Central Terminus</div>
            <div className="apple-text-caption">Birmingham Career Exploration</div>
          </div>

          <div className="apple-story-message">
            <div className="apple-story-speaker">NARRATOR</div>
            <div className="apple-story-text">
              {parseTextWithHierarchy("Grand Central Terminus isn't on any map, but here you are.\n\nThe letter in your hand reads: \"Platform 7, Midnight. Your future awaits.\"\n\nAround you, platforms stretch into the distance, each humming with different energy.")}
            </div>
          </div>

          <div className="apple-choices-container">
            <button
              onClick={game.handleStartGame}
              className="apple-button apple-button-primary"
            >
              Begin New Journey
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show main game interface
  return (
    <div className="apple-game-container">
      <div className="apple-game-content">
        <div className="apple-header">
          <div className="apple-text-headline">Grand Central Terminus</div>
          <div className="apple-text-caption">Birmingham Career Exploration</div>
        </div>

        {/* Simple messages display - no virtualization */}
        {game.messages && game.messages.length > 0 && (
          <div className="apple-story-message">
            <div className="apple-story-speaker">{game.messages[0].speaker}</div>
            <div className="apple-story-text">
              {parseTextWithHierarchy(game.messages[0].text)}
            </div>
          </div>
        )}

        {/* Simple choices - no complex components */}
        {game.choices && game.choices.length > 0 && (
          <div className="apple-choices-container">
            {game.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => game.handleChoice(choice)}
                disabled={game.isProcessing}
                className="apple-choice-button"
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* Processing indicator */}
        {game.isProcessing && (
          <div className="apple-processing-indicator">
            <div className="apple-spinner"></div>
            <span>Processing your choice...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MinimalGameInterface