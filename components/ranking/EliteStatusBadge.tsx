'use client'

/**
 * EliteStatusBadge - Bleach-inspired elite designation display
 *
 * Displays elite designations and overall tier with visual flourishes.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { EliteDesignation, EliteStatusState } from '@/lib/ranking/types'
import { DESIGNATION_DISPLAY, getEliteTier } from '@/lib/ranking/elite-status'
import { springs } from '@/lib/animations'
import { Compass, GitBranch, Heart, Zap, Crown, Award } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// ICON MAPPING
// ═══════════════════════════════════════════════════════════════════════════

const DesignationIcons: Record<EliteDesignation, typeof Compass> = {
  pathfinder: Compass,
  bridge_builder: GitBranch,
  mentor_heart: Heart,
  pattern_sage: Zap,
  station_pillar: Crown
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const DESIGNATION_COLORS: Record<string, {
  bg: string
  text: string
  border: string
  glow: string
}> = {
  blue: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20'
  },
  purple: {
    bg: 'bg-purple-900/30',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20'
  },
  pink: {
    bg: 'bg-pink-900/30',
    text: 'text-pink-300',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20'
  },
  amber: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/20'
  },
  gold: {
    bg: 'bg-yellow-900/30',
    text: 'text-yellow-300',
    border: 'border-yellow-500/40',
    glow: 'shadow-yellow-500/30'
  }
}

// Elite tier colors
const ELITE_TIER_COLORS: Record<string, {
  bg: string
  text: string
  border: string
  glow: string
}> = {
  Standard: {
    bg: 'bg-slate-800/50',
    text: 'text-slate-300',
    border: 'border-slate-600/50',
    glow: ''
  },
  Recognized: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20'
  },
  Elite: {
    bg: 'bg-purple-900/30',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/30'
  },
  Legendary: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/40'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLE DESIGNATION BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface DesignationBadgeProps {
  designation: EliteDesignation
  unlocked: boolean
  progress?: number
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  className?: string
}

export function DesignationBadge({
  designation,
  unlocked,
  progress = 0,
  size = 'md',
  showProgress = false,
  className
}: DesignationBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const display = DESIGNATION_DISPLAY[designation]
  const colors = unlocked
    ? DESIGNATION_COLORS[display.colorToken]
    : { bg: 'bg-slate-800/30', text: 'text-slate-500', border: 'border-slate-700/30', glow: '' }
  const IconComponent = DesignationIcons[designation]

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
    <div className={cn('relative inline-flex flex-col', className)}>
      <motion.div
        className={cn(
          'inline-flex items-center rounded-full border',
          sizes.container,
          colors.bg,
          colors.border,
          unlocked && colors.glow && `shadow-lg ${colors.glow}`
        )}
        initial={!prefersReducedMotion ? { scale: 0.95, opacity: 0 } : false}
        animate={{ scale: 1, opacity: unlocked ? 1 : 0.6 }}
        transition={springs.gentle}
      >
        <IconComponent className={cn(sizes.icon, colors.text)} />
        <span className={cn(sizes.text, colors.text, 'font-medium')}>
          {display.name}
        </span>
      </motion.div>

      {/* Progress bar for locked designations */}
      {showProgress && !unlocked && progress > 0 && (
        <div className={cn(
          'w-full rounded-full overflow-hidden mt-1',
          sizes.progress,
          'bg-slate-700/50'
        )}>
          <motion.div
            className={cn('h-full rounded-full bg-slate-500')}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={springs.smooth}
          />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ELITE TIER BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface EliteTierBadgeProps {
  unlockedCount: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function EliteTierBadge({
  unlockedCount,
  size = 'md',
  className
}: EliteTierBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const tier = getEliteTier(unlockedCount)
  const colors = ELITE_TIER_COLORS[tier.name] || ELITE_TIER_COLORS.Standard

  const sizeClasses = {
    sm: { container: 'gap-1.5 px-2 py-1', icon: 'w-3 h-3', text: 'text-xs' },
    md: { container: 'gap-2 px-3 py-1.5', icon: 'w-4 h-4', text: 'text-sm' },
    lg: { container: 'gap-2.5 px-4 py-2', icon: 'w-5 h-5', text: 'text-base' }
  }

  const sizes = sizeClasses[size]

  return (
    <motion.div
      className={cn(
        'inline-flex items-center rounded-full border',
        sizes.container,
        colors.bg,
        colors.border,
        tier.level >= 2 && colors.glow && `shadow-lg ${colors.glow}`,
        className
      )}
      initial={!prefersReducedMotion ? { scale: 0.95, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={springs.gentle}
    >
      <Award className={cn(sizes.icon, colors.text)} />
      <span className={cn(sizes.text, colors.text, 'font-medium')}>
        {tier.name}
      </span>
      {unlockedCount > 0 && (
        <span className={cn('text-xs px-1.5 py-0.5 rounded-full', colors.bg, colors.text)}>
          {unlockedCount}/5
        </span>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL ELITE STATUS CARD
// ═══════════════════════════════════════════════════════════════════════════

interface EliteStatusCardProps {
  state: EliteStatusState
  showProgress?: boolean
  className?: string
}

export function EliteStatusCard({
  state,
  showProgress = true,
  className
}: EliteStatusCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const tier = getEliteTier(state.unlockedDesignations.length)
  const colors = ELITE_TIER_COLORS[tier.name] || ELITE_TIER_COLORS.Standard

  return (
    <motion.div
      className={cn(
        'rounded-xl border p-4',
        colors.bg,
        colors.border,
        tier.level >= 3 && `shadow-lg ${colors.glow}`,
        className
      )}
      initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Award className={cn('w-6 h-6', colors.text)} />
          <div>
            <h3 className={cn('font-bold', colors.text)}>
              Elite Status: {tier.name}
            </h3>
            <p className="text-xs text-slate-400">
              {state.unlockedDesignations.length} of 5 designations earned
            </p>
          </div>
        </div>
      </div>

      {/* Designation grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {(['pathfinder', 'bridge_builder', 'mentor_heart', 'pattern_sage', 'station_pillar'] as EliteDesignation[]).map(d => (
          <DesignationBadge
            key={d}
            designation={d}
            unlocked={state.unlockedDesignations.includes(d)}
            progress={state.progress[d]}
            size="sm"
            showProgress={showProgress}
          />
        ))}
      </div>

      {/* Pending designations hint */}
      {state.pendingDesignations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-xs text-slate-400">
            Closest to unlock: {DESIGNATION_DISPLAY[state.pendingDesignations[0]].name}
            ({state.progress[state.pendingDesignations[0]]}%)
          </p>
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT ELITE BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface CompactEliteBadgeProps {
  unlockedCount: number
  className?: string
}

export function CompactEliteBadge({ unlockedCount, className }: CompactEliteBadgeProps) {
  const tier = getEliteTier(unlockedCount)
  const colors = ELITE_TIER_COLORS[tier.name] || ELITE_TIER_COLORS.Standard

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded',
        colors.bg,
        colors.text,
        className
      )}
      title={`${tier.name}: ${unlockedCount}/5 designations`}
    >
      <Award className="w-3 h-3" />
      <span className="text-xs font-medium">{unlockedCount}</span>
    </div>
  )
}

export default EliteStatusCard
