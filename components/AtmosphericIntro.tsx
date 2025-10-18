/**
 * Atmospheric Intro - The Half-Life style hook
 * 
 * Uses existing Apple Design System patterns for seamless flow
 * Environmental storytelling with progressive disclosure
 */

"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface AtmosphericIntroProps {
  onStart: () => void
}

export function AtmosphericIntro({ onStart }: AtmosphericIntroProps) {
  const [currentSequence, setCurrentSequence] = useState(0)
  const [showButton, setShowButton] = useState(false)

  // Auto-advance through sequences
  useEffect(() => {
    if (currentSequence < sequences.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSequence(prev => prev + 1)
      }, 4000) // Each sequence lasts 4 seconds

      return () => clearTimeout(timer)
    } else {
      // Final sequence reached - show button
      const buttonTimer = setTimeout(() => {
        setShowButton(true)
      }, 2000)

      return () => clearTimeout(buttonTimer)
    }
  }, [currentSequence])

  return (
    <div className="apple-game-container">
      <div className="apple-conversation-wrapper">
        <div className="apple-game-content">
          
          {/* Header - consistent with game interface */}
          <div className="apple-header">
            <div className="apple-text-headline">Grand Central Terminus</div>
            <div className="apple-text-caption">Birmingham Career Exploration</div>
          </div>

          {/* Story sequences using existing apple-story-message pattern */}
          <div className="apple-story-container">
            {sequences.map((sequence, index) => (
              <div
                key={index}
                className="apple-story-message"
                data-platform="default"
                style={{
                  opacity: currentSequence === index ? 1 : currentSequence > index ? 0.3 : 0,
                  transform: currentSequence === index 
                    ? 'translateY(0)' 
                    : currentSequence > index 
                    ? 'translateY(-8px)' 
                    : 'translateY(8px)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginBottom: '1rem'
                }}
              >
                {/* Location heading in screenplay format */}
                {sequence.location && (
                  <div className="apple-scene-heading">
                    {sequence.location}
                  </div>
                )}

                {/* Main text - action lines */}
                <div className="apple-story-text">
                  {sequence.text.split('\n\n').map((paragraph, i) => (
                    <div key={i} className="apple-action-line apple-paragraph">
                      {paragraph}
                    </div>
                  ))}
                </div>

                {/* Sound description - parenthetical */}
                {sequence.sound && (
                  <div className="apple-parenthetical">
                    {sequence.sound}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Start Button - using existing apple-choices-container */}
          {showButton && (
            <div 
              className="apple-choices-container"
              style={{
                opacity: showButton ? 1 : 0,
                transition: 'opacity 1s ease-in-out'
              }}
            >
              <Button
                onClick={onStart}
                variant="default"
                size="lg"
                className="w-full"
                aria-label="Begin your journey at Grand Central Terminus"
              >
                Enter the Station
              </Button>

              <button
                onClick={onStart}
                className="apple-text-caption"
                style={{ 
                  textAlign: 'center', 
                  marginTop: '1rem',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  opacity: 0.6,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                aria-label="Skip atmospheric introduction"
              >
                Skip Introduction →
              </button>
            </div>
          )}

          {/* Progress indicators */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem',
              opacity: showButton ? 0 : 1,
              transition: 'opacity 0.5s'
            }}
          >
            {sequences.map((_, index) => (
              <div
                key={index}
                style={{
                  width: currentSequence >= index ? '2rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '0.25rem',
                  background: currentSequence >= index ? 'var(--apple-primary)' : 'var(--apple-gray-300)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                aria-label={`Sequence ${index + 1} of ${sequences.length}`}
                role="progressbar"
                aria-valuenow={currentSequence >= index ? 100 : 0}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

// Atmospheric intro sequences - environmental storytelling
const sequences = [
  {
    location: "BIRMINGHAM, AL — LATE EVENING",
    text: "You've been walking for twenty minutes, but you don't remember starting.\n\nThe street looks familiar—downtown Birmingham, somewhere near the old terminal—but the light is wrong. Too golden. Too still.",
    sound: "Distant train whistle. Your footsteps echo."
  },
  {
    location: "THE LETTER",
    text: "Your hand is holding something. An envelope. Heavy paper, no postmark.\n\nInside, a single card with elegant script:\n\"Platform 7. Midnight. Your future awaits.\"",
    sound: "Paper rustling. Your heartbeat."
  },
  {
    location: "THE ENTRANCE",
    text: "The station materializes as you approach. Not appearing—it was always there, you just couldn't see it until now.\n\nGrand Central Terminus. The name on the facade glows softly, like it's lit from behind by something other than electricity.",
    sound: "A low hum. Energy. Possibility."
  },
  {
    location: "THRESHOLD",
    text: "Three other people stand at the entrance. They look as confused as you feel.\n\nOne clutches medical textbooks. One mutters about flowcharts and decision trees. One keeps checking a phone calendar, scrolling through years of different jobs.\n\nThey're here for the same reason you are.",
    sound: "Quiet voices. Uncertainty made audible."
  },
  {
    location: "INT. GRAND CENTRAL TERMINUS",
    text: "You step inside.\n\nPlatforms stretch into impossible distances. Each one hums with different energy—care, creation, calculation, growth. Above them, departure boards flicker with destinations that aren't places but futures:\n\n\"Platform 1: The Care Line\"\n\"Platform 3: The Builder's Track\"\n\"Platform 7: The Data Stream\"\n\nAn older man in a conductor's uniform watches you arrive. His name tag reads SAMUEL. He smiles, as if he's been expecting you.",
    sound: "The station breathes. You are not alone."
  }
]

