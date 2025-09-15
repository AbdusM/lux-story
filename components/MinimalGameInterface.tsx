/**
 * MINIMAL Game Interface - Zero Complex Dependencies
 * Breaks the whack-a-mole cycle with guaranteed-working simple components
 */

"use client"

import { useSimpleGame } from '@/hooks/useSimpleGame'
import '@/styles/apple-design-system.css'

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
            <div className="apple-text-body">
              &quot;Your future awaits at Platform 7. Midnight. Don&apos;t be late.&quot;
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
            <div className="apple-story-text">{game.messages[0].text}</div>
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