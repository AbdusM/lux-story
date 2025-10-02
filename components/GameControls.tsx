"use client"

import { memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface GameControlsProps {
  currentScene: { id?: string; text?: string; speaker?: string; type?: string } | null
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
          <Button
            onClick={handleContinue}
            disabled={isProcessing}
            variant="default"
            size="lg"
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      )}

      {/* Share Button */}
      {currentScene && (
        <div className="apple-choices-container apple-animate-slide-in">
          <Button
            onClick={handleShare}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            Share Progress
          </Button>
        </div>
      )}
    </>
  )
})

GameControls.displayName = 'GameControls'
