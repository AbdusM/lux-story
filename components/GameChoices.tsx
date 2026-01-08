"use client"

import { memo, useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { springs, stagger } from '@/lib/animations'
import { Lock, Microscope, Brain, Compass, Heart, Hammer } from 'lucide-react'
import { type PatternType, PATTERN_METADATA, isValidPattern } from '@/lib/patterns'
import { type GravityResult } from '@/lib/narrative-gravity'
import { getPatternPreviewStyles, getPatternHintText } from '@/lib/pattern-derivatives'
import { type PlayerPatterns } from '@/lib/character-state'

import { useGameStore } from '@/lib/game-store'

/**
 * Pattern-specific hover colors for choice buttons
 * Each pattern gets its own glow color for visual identity
 */
const PATTERN_HOVER_STYLES: Record<PatternType, {
  bg: string
  border: string
  shadow: string
  activeBg: string
}> = {
  analytical: {
    bg: 'hover:bg-blue-50',
    border: 'hover:border-blue-300',
    shadow: 'hover:shadow-[0_4px_12px_rgba(59,130,246,0.2),0_2px_4px_rgba(0,0,0,0.05)]',
    activeBg: 'active:bg-blue-100'
  },
  patience: {
    bg: 'hover:bg-green-50',
    border: 'hover:border-green-300',
    shadow: 'hover:shadow-[0_4px_12px_rgba(16,185,129,0.2),0_2px_4px_rgba(0,0,0,0.05)]',
    activeBg: 'active:bg-green-100'
  },
  exploring: {
    bg: 'hover:bg-purple-50',
    border: 'hover:border-purple-300',
    shadow: 'hover:shadow-[0_4px_12px_rgba(139,92,246,0.2),0_2px_4px_rgba(0,0,0,0.05)]',
    activeBg: 'active:bg-purple-100'
  },
  helping: {
    bg: 'hover:bg-pink-50',
    border: 'hover:border-pink-300',
    shadow: 'hover:shadow-[0_4px_12px_rgba(236,72,153,0.2),0_2px_4px_rgba(0,0,0,0.05)]',
    activeBg: 'active:bg-pink-100'
  },
  building: {
    bg: 'hover:bg-amber-50',
    border: 'hover:border-amber-300',
    shadow: 'hover:shadow-[0_4px_12px_rgba(245,158,11,0.2),0_2px_4px_rgba(0,0,0,0.05)]',
    activeBg: 'active:bg-amber-100'
  }
}

// Default hover style when no pattern specified
const DEFAULT_HOVER_STYLE = {
  bg: 'hover:bg-amber-50',
  border: 'hover:border-amber-300 border-transparent', // Added transparent border to prevent shift
  shadow: 'hover:shadow-[0_4px_12px_rgba(251,191,36,0.15),0_2px_4px_rgba(0,0,0,0.05)]',
  activeBg: 'active:bg-amber-100'
}

/**
 * Glass mode hover styles for dark theme
 * Pattern-specific glows with canonical colors from lib/patterns.ts
 */
const PATTERN_GLASS_STYLES: Record<PatternType, {
  bg: string
  border: string
  shadow: string
  activeBg: string
}> = {
  analytical: {
    bg: 'hover:bg-white/10',
    border: 'hover:border-blue-400/40',
    shadow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]',
    activeBg: 'active:bg-white/15'
  },
  patience: {
    bg: 'hover:bg-white/10',
    border: 'hover:border-green-400/40',
    shadow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    activeBg: 'active:bg-white/15'
  },
  exploring: {
    bg: 'hover:bg-white/10',
    border: 'hover:border-purple-400/40',
    shadow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]',
    activeBg: 'active:bg-white/15'
  },
  helping: {
    bg: 'hover:bg-white/10',
    border: 'hover:border-pink-400/40',
    shadow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]',
    activeBg: 'active:bg-white/15'
  },
  building: {
    bg: 'hover:bg-white/10',
    border: 'hover:border-amber-400/40',
    shadow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    activeBg: 'active:bg-white/15'
  }
}

// Default glass hover style when no pattern specified
const DEFAULT_GLASS_STYLE = {
  bg: 'hover:bg-white/10',
  border: 'hover:border-white/20',
  shadow: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
  activeBg: 'active:bg-white/15'
}

/**
 * Marquee gradient colors for premium hover effect
 * Maps patterns to start/mid/end colors for the flowing border
 */
const PATTERN_MARQUEE_COLORS: Record<PatternType, {
  start: string
  mid: string
  end: string
}> = {
  analytical: { start: '#60a5fa', mid: '#22d3ee', end: '#60a5fa' }, // Blue-Cyan-Blue
  patience: { start: '#34d399', mid: '#4ade80', end: '#34d399' },   // Emerald-Green-Emerald
  exploring: { start: '#a78bfa', mid: '#e879f9', end: '#a78bfa' },   // Purple-Fuchsia-Purple
  helping: { start: '#f472b6', mid: '#fb7185', end: '#f472b6' },     // Pink-Rose-Pink
  building: { start: '#fbbf24', mid: '#fb923c', end: '#fbbf24' }     // Amber-Orange-Amber
}

const DEFAULT_MARQUEE_COLORS = { start: '#94a3b8', mid: '#ffffff', end: '#94a3b8' } // Slate-White-Slate

/**
 * Orb fill requirement for gated choices (KOTOR-style)
 */
interface OrbRequirement {
  pattern: PatternType
  threshold: number
}

interface Choice {
  text: string
  next?: string
  consequence?: string
  pattern?: PatternType // Used for grouping - type-safe patterns only
  /** Visual feedback type */
  feedback?: 'shake' | 'glow' | 'pulse'
  /** Pivotal choice - triggers marquee effect */
  pivotal?: boolean
  /** Orb fill requirement - choice is locked until met (KOTOR-style) */
  requiredOrbFill?: OrbRequirement
  /** ISP: Narrative Gravity Weight */ // Added missing property documentation
  ispGravity?: number
  gravity?: GravityResult
}

/**
 * Current orb fill levels for checking locked choices
 */
interface OrbFillLevels {
  analytical: number
  patience: number
  exploring: number
  helping: number
  building: number
}

interface GameChoicesProps {
  choices: Choice[]
  isProcessing: boolean
  onChoice: (choice: Choice) => void
  /** Current orb fill percentages for gating choices */
  orbFillLevels?: OrbFillLevels
  /** Use glass morphism styling for dark theme */
  glass?: boolean
  /** Player's pattern scores for D-007 pattern previews */
  playerPatterns?: PlayerPatterns
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
// Mobile-optimized: faster stagger, no y-offset to prevent layout shift
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.fast, // 50ms - from lib/animations.ts
      delayChildren: 0.02,
    },
  },
}

// Individual button animation (used with stagger)
// Mobile-optimized: opacity-only animation prevents layout shift during reveal
const buttonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const } // easeOut cubic-bezier
  },
  tap: { scale: 0.98 },
  hover: { scale: 1.0 } // REMOVED SCALE: 1.01 -> 1.0
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

import { TESTING_FLAGS } from '@/lib/constants'

/**
 * Check if a choice is locked based on orb requirements
 */
function isChoiceLocked(choice: Choice, orbFillLevels?: OrbFillLevels): boolean {
  if (TESTING_FLAGS.UNLOCK_ALL_CHOICES) return false
  if (!choice.requiredOrbFill || !orbFillLevels) return false
  const { pattern, threshold } = choice.requiredOrbFill
  // Default to 0 if pattern key missing to prevent undefined comparison
  const currentLevel = orbFillLevels[pattern] ?? 0
  return currentLevel < threshold
}

/**
 * Get lock message for a locked choice
 */
function getLockMessage(choice: Choice): string {
  if (!choice.requiredOrbFill) return ''
  const { pattern, threshold } = choice.requiredOrbFill
  const label = PATTERN_METADATA[pattern].label
  return `${label} ${threshold}%`
}

// Memoized choice button component
const ChoiceButton = memo(({ choice, index, onChoice, isProcessing, isFocused, isLocked, glass, showPatternIcon, playerPatterns }: {
  choice: Choice
  index: number
  onChoice: (choice: Choice) => void
  isProcessing: boolean
  isFocused?: boolean
  isLocked?: boolean
  glass?: boolean
  showPatternIcon?: boolean
  /** D-007: Player patterns for subtle preview glow */
  playerPatterns?: PlayerPatterns
}) => {
  // MAGNETIC EFFECT REMOVED for stability and "less disjointed" feel
  // const magnetic = useMagneticElement(...)

  // Combine standard variants with feedback variants
  const combinedVariants = {
    ...buttonVariants,
    shake: shakeVariant,
    glow: glowVariant,
    focused: {
      opacity: 1,
      y: 0,
      scale: 1.0, // Reduced from 1.02
      boxShadow: "0px 0px 0px 2px rgba(59,130,246,0.5)",
      transition: { duration: 0.15 }
    },
    locked: {
      opacity: 0.6,
      y: 0,
      transition: springs.snappy
    },
    // Gravity Effects
    attracted: {
      scale: [1, 1.02, 1],
      boxShadow: "0px 0px 8px rgba(16, 185, 129, 0.3)",
      borderColor: "rgba(16, 185, 129, 0.5)",
      transition: { duration: 2, repeat: Infinity }
    },
    repelled: {
      opacity: 0.7,
      scale: 0.98,
      grayscale: 0.5
    }
  }

  // Determine which animation state to use
  // Stagger uses "visible" as base state, then apply feedback or focus
  let _animateState: string = "visible"
  if (choice.feedback) _animateState = choice.feedback
  if (isFocused) _animateState = "focused"
  if (isLocked) _animateState = "locked"

  // Gravity overrides (unless locked or focused)
  if (!isLocked && !isFocused && choice.gravity) {
    if (choice.gravity.effect === 'attract') _animateState = "attracted"
    if (choice.gravity.effect === 'repel') _animateState = "repelled"
  }

  // Locked choice styling
  if (isLocked) {
    return (
      <div className="w-full">
        <motion.div
          variants={combinedVariants}
          custom={index}
          className="w-full"
          data-choice-index={index}
          style={{ scrollSnapAlign: 'start' }}
        >
          <div
            className={`
              w-full min-h-[56px] sm:min-h-[52px] h-auto px-4 sm:px-6 py-4 sm:py-3
              text-base sm:text-sm font-medium text-stone-400 text-left
              border border-stone-200 bg-stone-50
              rounded-[14px]
              flex items-center gap-3
              cursor-not-allowed
            `}
            aria-label={`Locked choice: ${choice.text}. Requires ${getLockMessage(choice)}`}
            role="button"
            aria-disabled="true"
          >
            <Lock className="w-4 h-4 flex-shrink-0 text-stone-400" />
            <span className="flex-1 line-clamp-2">{choice.text}</span>
            <span className="text-xs text-stone-400 flex-shrink-0 whitespace-nowrap">
              {getLockMessage(choice)}
            </span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <motion.div
        variants={combinedVariants}
        // whileHover="hover" // REMOVED: No generic hover scale
        whileTap="tap"
        animate={_animateState} // ISP FIX: Prop moved to motion.div
        custom={index}
        className="w-full"
        data-choice-index={index}
        style={{ scrollSnapAlign: 'start' }}
      >
        <Button
          key={index}
          onClick={() => onChoice(choice)}
          disabled={isProcessing}
          variant={glass ? "glass" : "outline"} // Agent 8: Systemic Fix - Use first-class glass variant
          data-testid="choice-button"
          data-choice-text={choice.text}
          data-pattern={choice.pattern || ''}
          data-pivotal={choice.pivotal ? 'true' : undefined}
          aria-label={`Choice ${index + 1}: ${choice.text}`}
          className={`
            w-full min-h-[60px] sm:min-h-[56px] h-auto px-5 py-4
            text-base sm:text-[15px] font-medium text-left justify-start break-words whitespace-normal leading-relaxed
            ${glass && '!text-slate-100 !bg-slate-900/60 border-white/10'}
            ${!glass && '!text-stone-700 bg-white/90 backdrop-blur-sm shadow-sm hover:!text-stone-900'}
            ${(() => {
              const pattern = choice.pattern
              if (glass) {
                const styles = pattern && isValidPattern(pattern) ? PATTERN_GLASS_STYLES[pattern] : DEFAULT_GLASS_STYLE
                return `${styles.bg} ${styles.border} ${styles.shadow} ${styles.activeBg}`
              } else {
                const styles = pattern && isValidPattern(pattern) ? PATTERN_HOVER_STYLES[pattern] : DEFAULT_HOVER_STYLE
                return `${styles.bg} border border-transparent ${styles.shadow} ${styles.activeBg}`
              }
            })()}
            ${/* MARQUEE EFFECT: Only apply if choice is pivotal or has a pattern */ ''}
            ${choice.pivotal || (choice.pattern && isValidPattern(choice.pattern)) ? 'marquee-border' : ''}
            active:shadow-none
            transition-colors duration-200
            rounded-[14px]
            touch-manipulation select-none
            ${choice.feedback === 'shake' ? (glass ? 'border-red-400/40 bg-red-900/20' : 'border-red-200 bg-red-50') : ''}
            ${choice.feedback === 'glow' ? (glass ? 'border-amber-400/40 bg-amber-900/20' : 'border-amber-300 bg-amber-50') : ''}
            ${isFocused ? (glass
              ? 'ring-2 ring-white/30 ring-offset-2 ring-offset-transparent border-white/30 bg-white/15'
              : 'ring-2 ring-stone-900/10 ring-offset-2 border-stone-300 bg-stone-50') : ''}
            ${/* Gravity Repulsion Styling - Dimmed Text */ ''}
            ${choice.gravity?.effect === 'repel' && !isFocused && !isLocked
              ? (glass ? 'text-slate-400 bg-white/[0.02] shadow-none' : 'text-stone-400 bg-stone-50/50 shadow-none')
              : ''}
            ${choice.gravity?.effect === 'attract' && !isFocused && !isLocked
              ? (glass ? 'border-emerald-400/30 bg-emerald-900/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-emerald-200/50 bg-emerald-50/40 shadow-emerald-100')
              : ''}

          `}
          style={{
            // Marquee colors for pivotal choices
            ...((() => {
              const pattern = choice.pattern
              const colors = pattern && isValidPattern(pattern) ? PATTERN_MARQUEE_COLORS[pattern] : DEFAULT_MARQUEE_COLORS
              return {
                '--color-start': colors.start,
                '--color-mid': colors.mid,
                '--color-end': colors.end,
              } as React.CSSProperties
            })()),
            // D-007: Pattern preview glow for developed patterns
            ...(glass && playerPatterns && choice.pattern && isValidPattern(choice.pattern)
              ? getPatternPreviewStyles(choice.pattern, playerPatterns)
              : {})
          }}
          title={playerPatterns && choice.pattern ? (getPatternHintText(choice.pattern, playerPatterns) || undefined) : undefined}
        >
          {showPatternIcon && choice.pattern && (
            <div className="mr-3 opacity-90">
              {choice.pattern === 'analytical' && <Microscope className="w-4 h-4 text-blue-500" />}
              {choice.pattern === 'patience' && <Brain className="w-4 h-4 text-green-500" />}
              {choice.pattern === 'exploring' && <Compass className="w-4 h-4 text-purple-500" />}
              {choice.pattern === 'helping' && <Heart className="w-4 h-4 text-pink-500" />}
              {choice.pattern === 'building' && <Hammer className="w-4 h-4 text-amber-500" />}
            </div>
          )}
          <span className="flex-1 line-clamp-4">{choice.text}</span>
        </Button>
      </motion.div>
    </div>
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
export const GameChoices = memo(({ choices, isProcessing, onChoice, orbFillLevels, glass = false, playerPatterns }: GameChoicesProps) => {
  const { focusedIndex, containerRef } = useKeyboardNavigation(choices, isProcessing, onChoice)

  // ABILITY CHECK: Pattern Preview (P0)
  // FIX: Access coreGameState directly and avoid inline default array to prevent infinite loop
  const unlockedAbilities = useGameStore(state => state.coreGameState?.unlockedAbilities)
  const hasPatternPreview = (unlockedAbilities || []).includes('pattern_preview')

  if (!choices || choices.length === 0) {
    return null
  }

  // ISP UPDATE: Magnetic Sorting
  // Sort choices by Gravity Weight (descending)
  // Attracted (1.5) -> Neutral (1.0) -> Repelled (0.6)
  const sortedChoices = [...choices].sort((a, b) => {
    const wA = a.gravity?.weight || 1.0
    const wB = b.gravity?.weight || 1.0
    return wB - wA
  })

  // Determine layout strategy based on count
  // Smart column logic: avoid orphan on 3 choices (use single column)
  // 1-3 choices: single column, 4+ choices: 2 columns (pairs work better)
  const useGrid = sortedChoices.length >= 4
  const useGrouping = sortedChoices.length > 6 // Group only if many choices (6+) to avoid clutter

  if (useGrouping) {
    const groups = groupChoices(sortedChoices)
    const nonEmptyGroups = Object.entries(groups).filter(([_, groupChoices]) => groupChoices.length > 0)

    // Track global index for keyboard navigation across groups
    let globalIndex = 0

    // Safety Net: Ensure at least one choice is playable
    // If all visible choices are locked, unlock the one with the lowest threshold requirement
    const choiceStatuses = nonEmptyGroups.flatMap(([_, groupChoices]) =>
      groupChoices.map(c => ({ choice: c, locked: isChoiceLocked(c, orbFillLevels) }))
    )
    const allLocked = choiceStatuses.every(s => s.locked)
    let mercyUnlockChoice: Choice | null = null

    if (allLocked && choiceStatuses.length > 0) {
      // Find the choice with the lowest threshold to "mercy unlock"
      mercyUnlockChoice = choiceStatuses.sort((a, b) => {
        const thresholdA = a.choice.requiredOrbFill?.threshold || 0
        const thresholdB = b.choice.requiredOrbFill?.threshold || 0
        return thresholdA - thresholdB
      })[0].choice
    }

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
            <div className={`grid gap-3 p-2 w-full ${groupChoices.length >= 4 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {groupChoices.map((choice, localIndex) => {
                const currentGlobalIndex = globalIndex++
                // Apply lock unless it's the mercy override
                const isLocked = isChoiceLocked(choice, orbFillLevels) && choice !== mercyUnlockChoice

                return (
                  <ChoiceButton
                    key={`${title}-${localIndex}`}
                    choice={choice}
                    index={currentGlobalIndex}
                    onChoice={onChoice}
                    isProcessing={isProcessing}
                    isFocused={focusedIndex === currentGlobalIndex}
                    isLocked={isLocked}
                    glass={glass}
                    showPatternIcon={hasPatternPreview}
                    playerPatterns={playerPatterns}
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
      className={`grid gap-3 p-2 w-full ${useGrid ? 'md:grid-cols-2' : 'grid-cols-1'}`}
      data-testid="game-choices"
      role="listbox"
      aria-label="Choose your response"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={choices.map(c => c.text).join(',')} // Re-trigger animation on choice change
    >
      {(() => {
        // Safety Net Calculation (Duplicated for non-grouped view)
        const choiceStatuses = sortedChoices.map(c => ({ choice: c, locked: isChoiceLocked(c, orbFillLevels) }))
        const allLocked = choiceStatuses.every(s => s.locked)
        let mercyUnlockChoice: Choice | null = null

        if (allLocked && choiceStatuses.length > 0) {
          mercyUnlockChoice = choiceStatuses.sort((a, b) => {
            const thresholdA = a.choice.requiredOrbFill?.threshold || 0
            const thresholdB = b.choice.requiredOrbFill?.threshold || 0
            return thresholdA - thresholdB
          })[0].choice
        }

        return sortedChoices.map((choice, index) => {
          const isLocked = isChoiceLocked(choice, orbFillLevels) && choice !== mercyUnlockChoice
          return (
            <ChoiceButton
              key={index}
              choice={choice}
              index={index}
              onChoice={onChoice}
              isProcessing={isProcessing}
              isFocused={focusedIndex === index}
              isLocked={isLocked}
              glass={glass}
              showPatternIcon={hasPatternPreview}
              playerPatterns={playerPatterns}
            />
          )
        })
      })()}
    </motion.div>
  )
})

GameChoices.displayName = 'GameChoices'