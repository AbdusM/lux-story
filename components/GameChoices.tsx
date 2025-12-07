"use client"

import { memo, useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { springs, stagger } from '@/lib/animations'

interface Choice {
  text: string
  next?: string
  consequence?: string
  pattern?: string // Used for grouping
  /** Visual feedback type */
  feedback?: 'shake' | 'glow' | 'pulse'
  /** Pivotal choice - triggers marquee effect */
  pivotal?: boolean
}

interface GameChoicesProps {
  choices: Choice[]
  isProcessing: boolean
  onChoice: (choice: Choice) => void
}

/**
 * Custom hook for keyboard navigation of choices
 */
function useKeyboardNavigation(
  choices: Choice[],
  isProcessing: boolean,
  onChoice: (choice: Choice) => void
) {
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset focus when choices change
  useEffect(() => {
    setFocusedIndex(-1)
  }, [choices])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isProcessing || choices.length === 0) return

    // Number keys 1-9 for direct selection
    if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1
      if (index < choices.length) {
        e.preventDefault()
        onChoice(choices[index])
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
      case 'j': // vim-style
        e.preventDefault()
        setFocusedIndex(prev => {
          const next = prev < choices.length - 1 ? prev + 1 : 0
          return next
        })
        break
      case 'ArrowUp':
      case 'k': // vim-style
        e.preventDefault()
        setFocusedIndex(prev => {
          const next = prev > 0 ? prev - 1 : choices.length - 1
          return next
        })
        break
      case 'Enter':
      case ' ':
        if (focusedIndex >= 0 && focusedIndex < choices.length) {
          e.preventDefault()
          onChoice(choices[focusedIndex])
        }
        break
      case 'Escape':
        setFocusedIndex(-1)
        break
    }
  }, [choices, focusedIndex, isProcessing, onChoice])

  // Attach keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Scroll focused choice into view
  useEffect(() => {
    if (focusedIndex >= 0 && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll('[data-choice-index]')
      const focusedButton = buttons[focusedIndex] as HTMLElement | undefined
      if (focusedButton) {
        focusedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [focusedIndex])

  return { focusedIndex, setFocusedIndex, containerRef }
}

// Stagger container for sequential button reveals
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.05,
    },
  },
}

// Individual button animation (used with stagger)
const buttonVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.snappy
  },
  tap: { scale: 0.98 },
  hover: { scale: 1.01, y: -1 }
}

const shakeVariant = {
  opacity: 1,
  x: [0, -5, 5, -5, 5, 0],
  transition: { duration: 0.4 }
}

const glowVariant = {
  opacity: 1,
  boxShadow: [
    "0px 0px 0px rgba(59,130,246,0)",
    "0px 0px 15px rgba(59,130,246,0.5)",
    "0px 0px 0px rgba(59,130,246,0)"
  ],
  transition: { duration: 1.5, repeat: Infinity }
}

// Memoized choice button component
const ChoiceButton = memo(({ choice, index, onChoice, isProcessing, isFocused }: {
  choice: Choice
  index: number
  onChoice: (choice: Choice) => void
  isProcessing: boolean
  isFocused?: boolean
}) => {
  // Combine standard variants with feedback variants
  const combinedVariants = {
    ...buttonVariants,
    shake: shakeVariant,
    glow: glowVariant,
    focused: {
      opacity: 1,
      y: 0,
      scale: 1.02,
      boxShadow: "0px 0px 0px 2px rgba(59,130,246,0.5)",
      transition: { duration: 0.15 }
    }
  }

  // Determine which animation state to use
  // Stagger uses "visible" as base state, then apply feedback or focus
  let _animateState: string = "visible"
  if (choice.feedback) _animateState = choice.feedback
  if (isFocused) _animateState = "focused"

  return (
    <motion.div
      variants={combinedVariants}
      whileHover="hover"
      whileTap="tap"
      custom={index}
      className="w-full"
      data-choice-index={index}
      style={{ scrollSnapAlign: 'start' }}
    >
      <Button
        key={index}
        onClick={() => onChoice(choice)}
        disabled={isProcessing}
        variant="ghost"
        data-testid="choice-button"
        data-choice-text={choice.text}
        data-pattern={choice.pattern || ''}
        data-pivotal={choice.pivotal ? 'true' : undefined}
        aria-label={`Choice ${index + 1}: ${choice.text}`}
        className={`
          w-full min-h-[56px] sm:min-h-[52px] h-auto px-4 sm:px-6 py-4 sm:py-3
          text-base sm:text-sm font-medium text-stone-700 text-left justify-start break-words whitespace-normal leading-relaxed
          border border-stone-200 bg-white
          hover:bg-stone-100 hover:border-stone-300
          active:bg-stone-200 active:scale-[0.99]
          transition-colors duration-100 ease-out
          rounded-xl
          touch-manipulation select-none
          ${choice.feedback === 'shake' ? 'border-red-200 bg-red-50' : ''}
          ${choice.feedback === 'glow' ? 'border-amber-300 bg-amber-50' : ''}
          ${isFocused ? 'ring-2 ring-amber-500 ring-offset-1 border-amber-400 bg-amber-50/50' : ''}
        `}
      >
        <span className="flex-1">{choice.text}</span>
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
    'Approach': [],
    'Other': []
  }

  choices.forEach(choice => {
    const p = choice.pattern || ''
    
    // Core Career Patterns
    if (['building', 'helping', 'analytical', 'systemsThinking', 'technicalLiteracy', 'leadership', 'creativity', 'crisisManagement'].includes(p)) {
      groups['Career Paths'].push(choice)
    } 
    // Exploration & Soft Skills
    else if (['exploring', 'patience', 'adaptability', 'resilience', 'communication', 'emotionalIntelligence', 'humility', 'wisdom'].includes(p)) {
      groups['Exploration'].push(choice)
    }
    // Approach / Trap Patterns
    else if (['fairness', 'compliance', 'pragmatism', 'safety', 'efficiency'].includes(p)) {
       groups['Approach'].push(choice)
    }
    else {
      groups['Other'].push(choice)
    }
  })

  return groups
}

/**
 * Game Choices Component
 * Displays choice buttons with optimized rendering, grouping, keyboard navigation, and "juice"
 *
 * Keyboard shortcuts:
 * - Arrow keys (or j/k): Navigate between choices
 * - Enter/Space: Select focused choice
 * - 1-9: Direct selection of choice by number
 * - Escape: Clear focus
 */
export const GameChoices = memo(({ choices, isProcessing, onChoice }: GameChoicesProps) => {
  const { focusedIndex, containerRef } = useKeyboardNavigation(choices, isProcessing, onChoice)

  if (!choices || choices.length === 0) {
    return null
  }

  // Determine layout strategy based on count
  const useGrid = choices.length > 2 // Use grid for 3+ choices on desktop
  const useGrouping = choices.length > 4 // Group if very many

  if (useGrouping) {
    const groups = groupChoices(choices)
    const nonEmptyGroups = Object.entries(groups).filter(([_, groupChoices]) => groupChoices.length > 0)

    // Track global index for keyboard navigation across groups
    let globalIndex = 0

    return (
      <motion.div
        className="space-y-8"
        ref={containerRef}
        role="listbox"
        aria-label="Choose your response"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={choices.map(c => c.text).join(',')} // Re-trigger animation on choice change
      >
        {nonEmptyGroups.map(([title, groupChoices]) => (
          <div key={title} className="space-y-3" role="group" aria-label={title}>
            {title !== 'Other' && (
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1" aria-label={`${title} options`}>
                {title}
              </h3>
            )}
            <div className={`grid gap-3 ${groupChoices.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {groupChoices.map((choice, localIndex) => {
                const currentGlobalIndex = globalIndex++
                return (
                  <ChoiceButton
                    key={`${title}-${localIndex}`}
                    choice={choice}
                    index={currentGlobalIndex}
                    onChoice={onChoice}
                    isProcessing={isProcessing}
                    isFocused={focusedIndex === currentGlobalIndex}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      className={`grid gap-3 ${useGrid ? 'md:grid-cols-2' : 'grid-cols-1'}`}
      data-testid="game-choices"
      role="listbox"
      aria-label="Choose your response"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={choices.map(c => c.text).join(',')} // Re-trigger animation on choice change
    >
      {choices.map((choice, index) => (
        <ChoiceButton
          key={index}
          choice={choice}
          index={index}
          onChoice={onChoice}
          isProcessing={isProcessing}
          isFocused={focusedIndex === index}
        />
      ))}
    </motion.div>
  )
})

GameChoices.displayName = 'GameChoices'