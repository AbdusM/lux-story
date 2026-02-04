'use client'

/**
 * PatternRankBadge - Station rank display component
 *
 * Displays the player's current pattern mastery rank with
 * station-themed naming and optional progress indicator.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { OrbTier } from '@/lib/orbs'
import type { PatternMasteryState } from '@/lib/ranking/types'
import {
  PATTERN_MASTERY_DISPLAY,
  getPatternMasteryDisplayName
} from '@/lib/ranking/pattern-mastery-display'
import { springs } from '@/lib/animations'

// ═══════════════════════════════════════════════════════════════════════════
// ICON COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const RankIcons: Record<string, React.FC<{ className?: string }>> = {
  compass: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
    </svg>
  ),
  ticket: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
    </svg>
  ),
  badge: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    </svg>
  ),
  hat: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12h20" />
      <path d="M6 12v-2a6 6 0 0 1 12 0v2" />
      <path d="M4 12v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  ),
  key: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const TIER_COLORS: Record<OrbTier, {
  bg: string
  text: string
  border: string
  glow: string
}> = {
  nascent: {
    bg: 'bg-slate-800/50',
    text: 'text-slate-300',
    border: 'border-slate-600/50',
    glow: ''
  },
  emerging: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20'
  },
  developing: {
    bg: 'bg-indigo-900/30',
    text: 'text-indigo-300',
    border: 'border-indigo-500/30',
    glow: 'shadow-indigo-500/20'
  },
  flourishing: {
    bg: 'bg-purple-900/30',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/30'
  },
  mastered: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/40'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface PatternRankBadgeProps {
  /** Current orb tier */
  tier: OrbTier
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show progress bar to next tier */
  showProgress?: boolean
  /** Progress percentage (0-100) */
  progressPercent?: number
  /** Optional additional class names */
  className?: string
  /** Show description tooltip */
  showTooltip?: boolean
}

export function PatternRankBadge({
  tier,
  size = 'md',
  showProgress = false,
  progressPercent = 0,
  className,
  showTooltip = false
}: PatternRankBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const display = PATTERN_MASTERY_DISPLAY[tier]
  const colors = TIER_COLORS[tier]
  const IconComponent = RankIcons[display.iconVariant]

  const sizeClasses = {
    sm: {
      container: 'gap-1.5 px-2 py-1',
      icon: 'w-3 h-3',
      text: 'text-xs',
      progress: 'h-0.5'
    },
    md: {
      container: 'gap-2 px-3 py-1.5',
      icon: 'w-4 h-4',
      text: 'text-sm',
      progress: 'h-1'
    },
    lg: {
      container: 'gap-2.5 px-4 py-2',
      icon: 'w-5 h-5',
      text: 'text-base',
      progress: 'h-1.5'
    }
  }

  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        'relative inline-flex flex-col',
        className
      )}
      title={showTooltip ? display.description : undefined}
    >
      <motion.div
        className={cn(
          'inline-flex items-center rounded-full border',
          sizes.container,
          colors.bg,
          colors.border,
          colors.glow && `shadow-lg ${colors.glow}`
        )}
        initial={!prefersReducedMotion ? { scale: 0.95, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={springs.gentle}
      >
        {/* Icon */}
        {IconComponent && (
          <div className={cn(colors.text)}>
            <IconComponent className={sizes.icon} />
          </div>
        )}

        {/* Rank Name */}
        <span className={cn('font-medium', sizes.text, colors.text)}>
          {display.displayName}
        </span>
      </motion.div>

      {/* Progress Bar */}
      {showProgress && progressPercent < 100 && (
        <div className={cn(
          'w-full rounded-full overflow-hidden mt-1',
          sizes.progress,
          'bg-slate-700/50'
        )}>
          <motion.div
            className={cn('h-full rounded-full', colors.bg.replace('/50', ''), colors.text.replace('text-', 'bg-'))}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={springs.smooth}
          />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL STATE BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface PatternMasteryBadgeProps {
  /** Full pattern mastery state */
  state: PatternMasteryState
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show progress bar */
  showProgress?: boolean
  /** Progress percentage override */
  progressPercent?: number
  /** Optional class names */
  className?: string
}

export function PatternMasteryBadge({
  state,
  size = 'md',
  showProgress = false,
  progressPercent,
  className
}: PatternMasteryBadgeProps) {
  return (
    <PatternRankBadge
      tier={state.overallOrbTier}
      size={size}
      showProgress={showProgress}
      progressPercent={progressPercent}
      className={className}
      showTooltip
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface CompactRankBadgeProps {
  tier: OrbTier
  className?: string
}

/**
 * Minimal badge showing just icon and abbreviated name
 */
export function CompactRankBadge({ tier, className }: CompactRankBadgeProps) {
  const display = PATTERN_MASTERY_DISPLAY[tier]
  const colors = TIER_COLORS[tier]
  const IconComponent = RankIcons[display.iconVariant]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded',
        colors.bg,
        colors.text,
        className
      )}
      title={`${display.displayName}: ${display.description}`}
    >
      {IconComponent && <IconComponent className="w-3 h-3" />}
      <span className="text-xs font-medium">
        {display.displayName.split(' ')[0]}
      </span>
    </div>
  )
}

export default PatternRankBadge
