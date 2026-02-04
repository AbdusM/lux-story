'use client'

/**
 * ChallengeRatingBadge - JJK-inspired challenge grade display
 *
 * Displays player readiness grade and content matching.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ChallengeGrade, PlayerReadiness, ReadinessMatch } from '@/lib/ranking/types'
import { GRADE_DISPLAY, MATCH_DISPLAY } from '@/lib/ranking/challenge-rating'
import { springs } from '@/lib/animations'
import { Swords, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const GRADE_COLORS: Record<ChallengeGrade, {
  bg: string
  text: string
  border: string
  glow: string
}> = {
  D: {
    bg: 'bg-slate-800/50',
    text: 'text-slate-300',
    border: 'border-slate-600/50',
    glow: ''
  },
  C: {
    bg: 'bg-green-900/30',
    text: 'text-green-300',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20'
  },
  B: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20'
  },
  A: {
    bg: 'bg-purple-900/30',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/30'
  },
  S: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/40'
  }
}

const MATCH_ICONS: Record<ReadinessMatch, typeof CheckCircle> = {
  perfect: CheckCircle,
  comfortable: CheckCircle,
  challenging: AlertCircle,
  overreach: XCircle,
  trivial: XCircle
}

const MATCH_COLORS: Record<ReadinessMatch, string> = {
  perfect: 'text-green-400',
  comfortable: 'text-blue-400',
  challenging: 'text-amber-400',
  overreach: 'text-red-400',
  trivial: 'text-slate-400'
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADE BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface GradeBadgeProps {
  grade: ChallengeGrade
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  className?: string
}

export function GradeBadge({
  grade,
  size = 'md',
  showName = false,
  className
}: GradeBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const display = GRADE_DISPLAY[grade]
  const colors = GRADE_COLORS[grade]

  const sizeClasses = {
    sm: {
      container: 'w-6 h-6',
      text: 'text-xs font-bold',
      name: 'text-2xs'
    },
    md: {
      container: 'w-8 h-8',
      text: 'text-sm font-bold',
      name: 'text-xs'
    },
    lg: {
      container: 'w-10 h-10',
      text: 'text-lg font-bold',
      name: 'text-sm'
    },
    xl: {
      container: 'w-14 h-14',
      text: 'text-2xl font-bold',
      name: 'text-base'
    }
  }

  const sizes = sizeClasses[size]

  return (
    <div className={cn('inline-flex flex-col items-center gap-1', className)}>
      <motion.div
        className={cn(
          'flex items-center justify-center rounded-lg border',
          sizes.container,
          colors.bg,
          colors.border,
          grade === 'S' && `shadow-lg ${colors.glow}`
        )}
        initial={!prefersReducedMotion ? { scale: 0, rotate: -10 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={springs.snappy}
      >
        <span className={cn(sizes.text, colors.text)}>
          {grade}
        </span>
      </motion.div>
      {showName && (
        <span className={cn(sizes.name, colors.text)}>
          {display.name}
        </span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// READINESS BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface ReadinessBadgeProps {
  readiness: PlayerReadiness
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
  className?: string
}

export function ReadinessBadge({
  readiness,
  size = 'md',
  showScore = false,
  className
}: ReadinessBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const colors = GRADE_COLORS[readiness.grade]
  const display = GRADE_DISPLAY[readiness.grade]

  const sizeClasses = {
    sm: { container: 'gap-1.5 px-2 py-1', icon: 'w-3 h-3', grade: 'w-5 h-5', text: 'text-xs' },
    md: { container: 'gap-2 px-3 py-1.5', icon: 'w-4 h-4', grade: 'w-6 h-6', text: 'text-sm' },
    lg: { container: 'gap-2.5 px-4 py-2', icon: 'w-5 h-5', grade: 'w-8 h-8', text: 'text-base' }
  }

  const sizes = sizeClasses[size]

  return (
    <motion.div
      className={cn(
        'inline-flex items-center rounded-full border',
        sizes.container,
        colors.bg,
        colors.border,
        readiness.grade === 'S' && `shadow-lg ${colors.glow}`,
        className
      )}
      initial={!prefersReducedMotion ? { opacity: 0, x: -10 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={springs.gentle}
    >
      <Swords className={cn(sizes.icon, colors.text)} />

      <div className={cn(
        'flex items-center justify-center rounded border',
        sizes.grade,
        colors.bg,
        colors.border
      )}>
        <span className={cn('font-bold', colors.text)}>
          {readiness.grade}
        </span>
      </div>

      <span className={cn(sizes.text, colors.text, 'font-medium')}>
        {display.name}
      </span>

      {showScore && (
        <span className={cn('text-xs px-1.5 py-0.5 rounded-full', colors.bg, 'text-slate-400')}>
          {readiness.percentToNext}%
        </span>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MATCH INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

interface MatchIndicatorProps {
  match: ReadinessMatch
  contentGrade: ChallengeGrade
  playerGrade: ChallengeGrade
  size?: 'sm' | 'md'
  className?: string
}

export function MatchIndicator({
  match,
  contentGrade,
  playerGrade,
  size = 'md',
  className
}: MatchIndicatorProps) {
  const display = MATCH_DISPLAY[match]
  const IconComponent = MATCH_ICONS[match]
  const iconColor = MATCH_COLORS[match]

  const sizeClasses = {
    sm: { container: 'gap-1.5 px-2 py-1', icon: 'w-3 h-3', text: 'text-xs' },
    md: { container: 'gap-2 px-3 py-1.5', icon: 'w-4 h-4', text: 'text-sm' }
  }

  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg bg-slate-800/50 border border-slate-700/50',
        sizes.container,
        className
      )}
    >
      <IconComponent className={cn(sizes.icon, iconColor)} />
      <span className={cn(sizes.text, iconColor, 'font-medium')}>
        {display.label}
      </span>
      <span className="text-xs text-slate-500">
        ({playerGrade} vs {contentGrade})
      </span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// READINESS CARD
// ═══════════════════════════════════════════════════════════════════════════

interface ReadinessCardProps {
  readiness: PlayerReadiness
  showDimensions?: boolean
  className?: string
}

export function ReadinessCard({
  readiness,
  showDimensions = true,
  className
}: ReadinessCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const colors = GRADE_COLORS[readiness.grade]

  return (
    <motion.div
      className={cn(
        'rounded-xl border p-4',
        colors.bg,
        colors.border,
        readiness.grade === 'S' && `shadow-lg ${colors.glow}`,
        className
      )}
      initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <GradeBadge grade={readiness.grade} size="lg" />
          <div>
            <h3 className={cn('font-bold', colors.text)}>
              {GRADE_DISPLAY[readiness.grade].name}
            </h3>
            <p className="text-xs text-slate-400">
              Challenge Rating
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={cn('text-2xl font-bold', colors.text)}>
            {readiness.percentToNext}%
          </span>
          <p className="text-xs text-slate-400">to next</p>
        </div>
      </div>

      {/* Dimension breakdown */}
      {showDimensions && (
        <div className="space-y-2">
          {Object.entries(readiness.dimensions).map(([dim, value]) => (
            <div key={dim} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-24 capitalize">
                {dim.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', colors.text.replace('text-', 'bg-'))}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={springs.smooth}
                />
              </div>
              <span className="text-xs text-slate-500 w-8 text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT GRADE BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface CompactGradeBadgeProps {
  grade: ChallengeGrade
  className?: string
}

export function CompactGradeBadge({ grade, className }: CompactGradeBadgeProps) {
  const colors = GRADE_COLORS[grade]

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center w-5 h-5 rounded font-bold text-xs',
        colors.bg,
        colors.text,
        colors.border,
        'border',
        className
      )}
      title={`Grade ${grade}: ${GRADE_DISPLAY[grade].name}`}
    >
      {grade}
    </div>
  )
}

export default ReadinessBadge
