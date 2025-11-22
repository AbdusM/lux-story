"use client"

import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface Choice {
  text: string
  next?: string
  consequence?: string
  pattern?: string // Used for grouping
  /** Visual feedback type */
  feedback?: 'shake' | 'glow' | 'pulse'
}

interface GameChoicesProps {
  choices: Choice[]
  isProcessing: boolean
  onChoice: (choice: Choice) => void
}

// Animation variants for juice
const buttonVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  tap: { scale: 0.98 },
  hover: { scale: 1.01, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }
}

const shakeVariant = {
  x: [0, -5, 5, -5, 5, 0],
  transition: { duration: 0.4 }
}

const glowVariant = {
  boxShadow: [
    "0px 0px 0px rgba(59,130,246,0)",
    "0px 0px 15px rgba(59,130,246,0.5)",
    "0px 0px 0px rgba(59,130,246,0)"
  ],
  transition: { duration: 1.5, repeat: Infinity }
}

// Memoized choice button component
const ChoiceButton = memo(({ choice, index, onChoice, isProcessing }: {
  choice: Choice
  index: number
  onChoice: (choice: Choice) => void
  isProcessing: boolean
}) => {
  // Combine standard variants with feedback variants
  const combinedVariants = {
    ...buttonVariants,
    shake: shakeVariant,
    glow: glowVariant
  }

  // Determine which animation state to use
  // If feedback is active, use that variant name; otherwise use standard 'animate' entry
  const animateState = choice.feedback ? choice.feedback : "animate"

  return (
    <motion.div
      initial="initial"
      animate={animateState}
      whileHover="hover"
      whileTap="tap"
      variants={combinedVariants}
      custom={index}
      className="w-full"
    >
      <Button
        key={index}
        onClick={() => onChoice(choice)}
        disabled={isProcessing}
        variant="ghost"
        className={`
          w-full min-h-[52px] px-5 py-3.5
          text-[15px] font-normal text-slate-700 text-left whitespace-normal leading-relaxed
          border border-slate-200 bg-white
          hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm
          transition-all duration-150 ease-out
          rounded-lg
          ${choice.feedback === 'shake' ? 'border-red-300 bg-red-50/80' : ''}
          ${choice.feedback === 'glow' ? 'border-blue-300 bg-blue-50/80' : ''}
        `}
      >
        {choice.text}
      </Button>
    </motion.div>
  )
})

ChoiceButton.displayName = 'ChoiceButton'

/**
 * Group choices by pattern/domain for better organization
 */
const groupChoices = (choices: Choice[]) => {
  const groups: Record<string, Choice[]> = {
    'Career Paths': [],
    'Exploration': [],
    'Other': []
  }

  choices.forEach(choice => {
    if (choice.pattern === 'building' || choice.pattern === 'helping' || choice.pattern === 'analytical') {
      groups['Career Paths'].push(choice)
    } else if (choice.pattern === 'exploring' || choice.pattern === 'patience') {
      groups['Exploration'].push(choice)
    } else {
      groups['Other'].push(choice)
    }
  })

  return groups
}

/**
 * Game Choices Component
 * Displays choice buttons with optimized rendering, grouping, and "juice"
 */
export const GameChoices = memo(({ choices, isProcessing, onChoice }: GameChoicesProps) => {
  if (!choices || choices.length === 0) {
    return null
  }

  // Determine layout strategy based on count
  const useGrid = choices.length > 2 // Use grid for 3+ choices on desktop
  const useGrouping = choices.length > 4 // Group if very many

  if (useGrouping) {
    const groups = groupChoices(choices)
    const nonEmptyGroups = Object.entries(groups).filter(([_, groupChoices]) => groupChoices.length > 0)

    return (
      <div className="space-y-6">
        {nonEmptyGroups.map(([title, groupChoices]) => (
          <div key={title} className="space-y-3">
            {title !== 'Other' && (
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-xs font-medium text-slate-500 px-2">
                  {title}
                </span>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>
            )}
            <div className={`grid gap-3 ${groupChoices.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {groupChoices.map((choice, index) => (
                <ChoiceButton
                  key={`${title}-${index}`}
                  choice={choice}
                  index={index}
                  onChoice={onChoice}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid gap-3 ${useGrid ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
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
