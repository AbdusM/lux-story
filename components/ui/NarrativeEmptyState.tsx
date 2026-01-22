'use client'

/**
 * NarrativeEmptyState - Keep users in the fiction
 *
 * Sprint 4: Replace generic empty states with narrative-appropriate text
 *
 * Instead of "No Dossiers", show "Scanning for signals..."
 * Instead of "No data", show "No active traces detected."
 */

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Radio, Radar, FileSearch, Users, Compass, Sparkles, Brain } from 'lucide-react'

export type EmptyStateType =
  | 'scanning'       // Actively searching
  | 'no-traces'      // Nothing found
  | 'awaiting'       // Waiting for user action
  | 'dormant'        // Feature not yet unlocked
  | 'characters'     // No characters met yet
  | 'skills'         // No skills demonstrated
  | 'patterns'       // No patterns revealed
  | 'quests'         // No active quests

interface NarrativeEmptyStateProps {
  /** Type of empty state to display */
  type: EmptyStateType
  /** Custom message override */
  message?: string
  /** Custom subtitle override */
  subtitle?: string
  /** Additional className */
  className?: string
  /** Whether to show animation */
  animated?: boolean
}

const EMPTY_STATE_CONFIG: Record<EmptyStateType, {
  icon: typeof Radio
  message: string
  subtitle: string
  animation?: 'pulse' | 'spin' | 'bounce'
}> = {
  scanning: {
    icon: Radar,
    message: 'Scanning for signals...',
    subtitle: 'The Station is listening.',
    animation: 'pulse',
  },
  'no-traces': {
    icon: Radio,
    message: 'No active traces detected.',
    subtitle: 'The void between platforms holds nothing... yet.',
  },
  awaiting: {
    icon: FileSearch,
    message: 'Awaiting your input.',
    subtitle: 'The Station responds to those who act.',
  },
  dormant: {
    icon: Sparkles,
    message: 'This space is dormant.',
    subtitle: 'Some doors only open to those who have walked certain paths.',
  },
  characters: {
    icon: Users,
    message: 'No connections yet.',
    subtitle: 'The platforms are waiting. Who will you meet first?',
  },
  skills: {
    icon: Brain,
    message: 'Your abilities are waiting to emerge.',
    subtitle: 'Make choices in conversations to reveal what you can do.',
  },
  patterns: {
    icon: Compass,
    message: 'Your patterns are forming.',
    subtitle: 'Every choice shapes who you become.',
    animation: 'pulse',
  },
  quests: {
    icon: Compass,
    message: 'No active journeys.',
    subtitle: 'Talk to the people at the Station. They may need your help.',
  },
}

export function NarrativeEmptyState({
  type,
  message,
  subtitle,
  className,
  animated = true,
}: NarrativeEmptyStateProps) {
  const prefersReducedMotion = useReducedMotion()
  const config = EMPTY_STATE_CONFIG[type]
  const Icon = config.icon

  const shouldAnimate = animated && !prefersReducedMotion
  const animationClass = config.animation === 'pulse' ? 'animate-pulse' :
    config.animation === 'spin' ? 'animate-spin' :
    config.animation === 'bounce' ? 'animate-bounce' : ''

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 min-h-[200px]',
        className
      )}
      initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={cn(
        'w-12 h-12 mb-4 text-slate-500',
        shouldAnimate && animationClass
      )}>
        <Icon className="w-full h-full" />
      </div>
      <p className="text-base text-slate-300 font-medium mb-1">
        {message || config.message}
      </p>
      <p className="text-sm text-slate-500 max-w-[280px]">
        {subtitle || config.subtitle}
      </p>
    </motion.div>
  )
}

/**
 * Shorthand components for common empty states
 */
export const ScanningState = (props: Omit<NarrativeEmptyStateProps, 'type'>) => (
  <NarrativeEmptyState type="scanning" {...props} />
)

export const NoTracesState = (props: Omit<NarrativeEmptyStateProps, 'type'>) => (
  <NarrativeEmptyState type="no-traces" {...props} />
)

export const AwaitingState = (props: Omit<NarrativeEmptyStateProps, 'type'>) => (
  <NarrativeEmptyState type="awaiting" {...props} />
)

export const DormantState = (props: Omit<NarrativeEmptyStateProps, 'type'>) => (
  <NarrativeEmptyState type="dormant" {...props} />
)

export default NarrativeEmptyState
