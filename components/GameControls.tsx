"use client"

import { memo, useCallback } from 'react'

interface GameControlsProps {
  currentScene: any
  isProcessing: boolean
  onContinue: () => void
  onShare: () => void
}

/**
 * Game Controls Component
 * Displays continue button and share functionality
 */
export const GameControls = memo(({ 
  currentScene, 
  isProcessing, 
  onContinue, 
  onShare 
}: GameControlsProps) => {
  const handleContinue = useCallback(() => {
    if (!isProcessing) {
      onContinue()
    }
  }, [isProcessing, onContinue])

  const handleShare = useCallback(() => {
    onShare()
  }, [onShare])

  return (
    <>
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
    </>
  )
})

GameControls.displayName = 'GameControls'
