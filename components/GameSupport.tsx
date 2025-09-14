"use client"

import { memo } from 'react'

interface GameSupportProps {
  emotionalSupport?: { message: string; type: string } | null
  metacognitivePrompt?: string | null
  skillSuggestions?: { developing: string[] } | null
}

/**
 * Game Support Component
 * Displays contextual support messages for emotional, cognitive, and skills development
 */
export const GameSupport = memo(({ 
  emotionalSupport, 
  metacognitivePrompt, 
  skillSuggestions 
}: GameSupportProps) => {
  return (
    <>
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
    </>
  )
})

GameSupport.displayName = 'GameSupport'
