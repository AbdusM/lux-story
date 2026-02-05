'use client'

/**
 * StationStandingBadge - OPM-inspired station merit display
 *
 * Displays station standing and merit breakdown.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { StationStandingTier, MeritBreakdown, BillboardState } from '@/lib/ranking/types'
import { STANDING_DISPLAY, getMeritPercentages } from '@/lib/ranking/station-billboard'
import { springs } from '@/lib/animations'
import { Building } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const STANDING_COLORS: Record<StationStandingTier, {
  bg: string
  text: string
  border: string
  glow: string
}> = {
  newcomer: {
    bg: 'bg-slate-800/50',
    text: 'text-slate-300',
    border: 'border-slate-600/50',
    glow: ''
  },
  regular: {
    bg: 'bg-green-900/30',
    text: 'text-green-300',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20'
  },
  notable: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20'
  },
  distinguished: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/40'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STANDING BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface StandingBadgeProps {
  standing: StationStandingTier
  size?: 'sm' | 'md' | 'lg'
  showMerit?: boolean
  totalMerit?: number
  className?: string
}

export function StandingBadge({
  standing,
  size = 'md',
  showMerit = false,
  totalMerit = 0,
  className
}: StandingBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const display = STANDING_DISPLAY[standing]
  const colors = STANDING_COLORS[standing]

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
        standing === 'distinguished' && `shadow-lg ${colors.glow}`,
        className
      )}
      initial={!prefersReducedMotion ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={springs.gentle}
    >
      <Building className={cn(sizes.icon, colors.text)} />
      <span className={cn(sizes.text, colors.text, 'font-medium')}>
        {display.name}
      </span>
      {showMerit && (
        <span className={cn('text-xs px-1.5 py-0.5 rounded-full', colors.bg, 'text-slate-400')}>
          {totalMerit}
        </span>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MERIT BREAKDOWN BAR
// ═══════════════════════════════════════════════════════════════════════════

interface MeritBreakdownBarProps {
  breakdown: MeritBreakdown
  size?: 'sm' | 'md'
  className?: string
}

export function MeritBreakdownBar({
  breakdown,
  size = 'md',
  className
}: MeritBreakdownBarProps) {
  const prefersReducedMotion = useReducedMotion()
  const percentages = getMeritPercentages(breakdown)

  const barColors: Record<string, string> = {
    patterns: 'bg-amber-500',
    relationships: 'bg-blue-500',
    discoveries: 'bg-green-500',
    contributions: 'bg-purple-500'
  }

  const categoryLabels: Record<string, string> = {
    patterns: 'Patterns',
    relationships: 'Relationships',
    discoveries: 'Discoveries',
    contributions: 'Contributions'
  }

  const sizeClasses = {
    sm: { height: 'h-2', text: 'text-xs' },
    md: { height: 'h-3', text: 'text-sm' }
  }

  const sizes = sizeClasses[size]

  return (
    <div className={cn('w-full', className)}>
      {/* Stacked bar */}
      <div className={cn('w-full rounded-full overflow-hidden flex', sizes.height, 'bg-slate-700/50')}>
        {Object.entries(percentages).map(([category, percent], index) => (
          <motion.div
            key={category}
            className={cn(barColors[category] || 'bg-slate-500')}
            style={{ width: `${percent}%` }}
            initial={!prefersReducedMotion ? { width: 0 } : false}
            animate={{ width: `${percent}%` }}
            transition={{ delay: index * 0.05, ...springs.smooth }}
            title={`${categoryLabels[category] || category}: ${breakdown[category as keyof MeritBreakdown] || 0}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(percentages).filter(([, p]) => p > 0).map(([category, percent]) => (
          <div key={category} className="flex items-center gap-1">
            <div className={cn('w-2 h-2 rounded-full', barColors[category] || 'bg-slate-500')} />
            <span className="text-xs text-slate-400">
              {categoryLabels[category] || category} ({Math.round(percent)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// BILLBOARD CARD
// ═══════════════════════════════════════════════════════════════════════════

interface BillboardCardProps {
  state: BillboardState
  showBreakdown?: boolean
  showHighlights?: boolean
  className?: string
}

export function BillboardCard({
  state,
  showBreakdown = true,
  showHighlights = true,
  className
}: BillboardCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const colors = STANDING_COLORS[state.standing]
  const display = STANDING_DISPLAY[state.standing]

  return (
    <motion.div
      className={cn(
        'rounded-xl border p-4',
        colors.bg,
        colors.border,
        state.standing === 'distinguished' && `shadow-lg ${colors.glow}`,
        className
      )}
      initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg border', colors.bg, colors.border)}>
            <Building className={cn('w-5 h-5', colors.text)} />
          </div>
          <div>
            <h3 className={cn('font-bold', colors.text)}>
              {display.name}
            </h3>
            <p className="text-xs text-slate-400">
              Station Standing
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={cn('text-2xl font-bold', colors.text)}>
            {state.meritPoints}
          </span>
          <p className="text-xs text-slate-400">merit</p>
        </div>
      </div>

      {/* Merit breakdown */}
      {showBreakdown && (
        <div className="mb-4">
          <MeritBreakdownBar breakdown={state.meritBreakdown} size="md" />
        </div>
      )}

      {/* Highlights */}
      {showHighlights && state.highlights.length > 0 && (
        <div className="pt-3 border-t border-white/5">
          <p className="text-xs text-slate-500 mb-2">Highlights:</p>
          <div className="flex flex-wrap gap-1.5">
            {state.highlights.slice(0, 3).map((highlight, i) => (
              <span
                key={i}
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  colors.bg,
                  colors.text.replace('-300', '-400')
                )}
              >
                {highlight.label}: {highlight.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Progress info (merit-based progression) */}
      {state.standing !== 'distinguished' && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Last updated</span>
            <span>{new Date(state.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT STANDING BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface CompactStandingBadgeProps {
  standing: StationStandingTier
  className?: string
}

export function CompactStandingBadge({ standing, className }: CompactStandingBadgeProps) {
  const colors = STANDING_COLORS[standing]
  const display = STANDING_DISPLAY[standing]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded',
        colors.bg,
        colors.text,
        className
      )}
      title={`${display.name}: ${display.description}`}
    >
      <Building className="w-3 h-3" />
      <span className="text-xs font-medium">
        {display.name.slice(0, 3)}
      </span>
    </div>
  )
}

export default BillboardCard
