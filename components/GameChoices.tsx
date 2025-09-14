"use client"

import { memo, useCallback } from 'react'

interface GameChoicesProps {
  choices: any[]
  isProcessing: boolean
  onChoice: (choice: any) => void
}

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

ChoiceButton.displayName = 'ChoiceButton'

/**
 * Game Choices Component
 * Displays choice buttons with optimized rendering
 */
export const GameChoices = memo(({ choices, isProcessing, onChoice }: GameChoicesProps) => {
  if (!choices || choices.length === 0) {
    return null
  }

  return (
    <div className="apple-choices-container apple-animate-slide-in">
      {choices.map((choice, index) => (
        <ChoiceButton
          key={index}
          choice={choice}
          index={index}
          onChoice={onChoice}
          isProcessing={isProcessing}
        />
      ))}
    </div>
  )
})

GameChoices.displayName = 'GameChoices'
