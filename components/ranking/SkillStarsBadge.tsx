'use client'

/**
 * SkillStarsBadge - HxH-inspired skill star display
 *
 * Displays skill stars in 6 dimensions with constellation view.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { StarLevel, StarType, SkillStarsState, SkillStar } from '@/lib/ranking/types'
import { STAR_LEVEL_DISPLAY } from '@/lib/ranking/skill-stars'
import { springs } from '@/lib/animations'
import { Star, Target, Puzzle, Search, Heart, TrendingUp, Shield } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// ICON MAPPING
// ═══════════════════════════════════════════════════════════════════════════

const StarTypeIcons: Record<StarType, typeof Star> = {
  mastery: Target,
  synthesis: Puzzle,
  discovery: Search,
  connection: Heart,
  growth: TrendingUp,
  resilience: Shield
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const STAR_LEVEL_COLORS: Record<StarLevel, {
  bg: string
  text: string
  border: string
  fill: string
}> = {
  0: {
    bg: 'bg-slate-800/50',
    text: 'text-slate-400',
    border: 'border-slate-600/50',
    fill: 'fill-slate-600'
  },
  1: {
    bg: 'bg-orange-900/30',
    text: 'text-orange-300',
    border: 'border-orange-500/30',
    fill: 'fill-orange-400'
  },
  2: {
    bg: 'bg-slate-700/50',
    text: 'text-slate-200',
    border: 'border-slate-400/30',
    fill: 'fill-slate-300'
  },
  3: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    fill: 'fill-amber-400'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLE STAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface SkillStarIconProps {
  star: SkillStar
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function SkillStarIcon({
  star,
  size = 'md',
  showLabel = false,
  className
}: SkillStarIconProps) {
  const colors = STAR_LEVEL_COLORS[star.level]
  const TypeIcon = StarTypeIcons[star.type]
  const levelDisplay = STAR_LEVEL_DISPLAY[star.level]

  const sizeClasses = {
    sm: { icon: 'w-4 h-4', star: 'w-3 h-3', text: 'text-xs', container: 'gap-1' },
    md: { icon: 'w-5 h-5', star: 'w-4 h-4', text: 'text-sm', container: 'gap-1.5' },
    lg: { icon: 'w-6 h-6', star: 'w-5 h-5', text: 'text-base', container: 'gap-2' }
  }

  const sizes = sizeClasses[size]

  return (
    <div
      className={cn('inline-flex items-center', sizes.container, className)}
      title={`${star.name}: ${levelDisplay.name}`}
    >
      <div className="relative">
        <TypeIcon className={cn(sizes.icon, colors.text)} />
        {star.level > 0 && (
          <Star className={cn(
            'absolute -top-1 -right-1',
            sizes.star,
            colors.fill,
            'stroke-current',
            colors.text
          )} />
        )}
      </div>
      {showLabel && (
        <span className={cn(sizes.text, colors.text, 'font-medium')}>
          {star.name}
        </span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STAR ROW - Shows all 6 stars in a row
// ═══════════════════════════════════════════════════════════════════════════

interface SkillStarsRowProps {
  state: SkillStarsState
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SkillStarsRow({
  state,
  size = 'md',
  className
}: SkillStarsRowProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {Object.values(state.stars).map((star, index) => (
        <motion.div
          key={star.type}
          initial={!prefersReducedMotion ? { scale: 0, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, ...springs.gentle }}
        >
          <SkillStarIcon star={star} size={size} />
        </motion.div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTELLATION BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface ConstellationBadgeProps {
  state: SkillStarsState
  size?: 'sm' | 'md' | 'lg'
  showStars?: boolean
  className?: string
}

export function ConstellationBadge({
  state,
  size = 'md',
  showStars = true,
  className
}: ConstellationBadgeProps) {
  const prefersReducedMotion = useReducedMotion()

  // Determine constellation color based on total stars
  const getConstellationColor = () => {
    if (state.totalStars >= 15) return STAR_LEVEL_COLORS[3] // Gold
    if (state.totalStars >= 9) return STAR_LEVEL_COLORS[2]  // Silver
    if (state.totalStars >= 3) return STAR_LEVEL_COLORS[1]  // Bronze
    return STAR_LEVEL_COLORS[0] // Unstarred
  }

  const colors = getConstellationColor()

  const sizeClasses = {
    sm: { container: 'px-2 py-1 gap-2', text: 'text-xs', count: 'text-sm' },
    md: { container: 'px-3 py-1.5 gap-2.5', text: 'text-sm', count: 'text-base' },
    lg: { container: 'px-4 py-2 gap-3', text: 'text-base', count: 'text-lg' }
  }

  const sizes = sizeClasses[size]

  return (
    <motion.div
      className={cn(
        'inline-flex items-center rounded-xl border',
        sizes.container,
        colors.bg,
        colors.border,
        state.totalStars >= 15 && 'shadow-lg shadow-amber-500/20',
        className
      )}
      initial={!prefersReducedMotion ? { opacity: 0, y: 5 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      {/* Star count */}
      <div className="flex items-center gap-1">
        <Star className={cn('w-4 h-4', colors.fill)} />
        <span className={cn(sizes.count, colors.text, 'font-bold')}>
          {state.totalStars}
        </span>
      </div>

      {/* Constellation name */}
      <span className={cn(sizes.text, colors.text)}>
        {state.constellation}
      </span>

      {/* Individual stars (optional) */}
      {showStars && (
        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/10">
          {Object.values(state.stars).map(star => (
            <div
              key={star.type}
              className={cn(
                'w-2 h-2 rounded-full',
                star.level === 0 && 'bg-slate-600',
                star.level === 1 && 'bg-orange-400',
                star.level === 2 && 'bg-slate-300',
                star.level === 3 && 'bg-amber-400'
              )}
              title={`${star.name}: ${STAR_LEVEL_DISPLAY[star.level].name}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT CONSTELLATION BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface CompactConstellationBadgeProps {
  totalStars: number
  constellation: string
  className?: string
}

export function CompactConstellationBadge({
  totalStars,
  constellation,
  className
}: CompactConstellationBadgeProps) {
  const getColor = () => {
    if (totalStars >= 15) return 'text-amber-300 bg-amber-900/30'
    if (totalStars >= 9) return 'text-slate-200 bg-slate-700/50'
    if (totalStars >= 3) return 'text-orange-300 bg-orange-900/30'
    return 'text-slate-400 bg-slate-800/50'
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded',
        getColor(),
        className
      )}
      title={constellation}
    >
      <Star className="w-3 h-3 fill-current" />
      <span className="text-xs font-medium">{totalStars}</span>
    </div>
  )
}

export default ConstellationBadge
