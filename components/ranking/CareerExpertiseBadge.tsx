'use client'

/**
 * CareerExpertiseBadge - Domain expertise display component
 *
 * Displays the player's expertise level in a career domain
 * with Demon Slayer-inspired tier styling.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CareerDomain, DomainExpertise } from '@/lib/ranking/types'
import { DOMAIN_DISPLAY, EXPERTISE_TIER_NAMES } from '@/lib/ranking/career-expertise'
import { springs } from '@/lib/animations'
import { Cpu, Heart, Briefcase, Palette, Users } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// ICON MAPPING
// ═══════════════════════════════════════════════════════════════════════════

const DomainIcons: Record<CareerDomain, typeof Cpu> = {
  technology: Cpu,
  healthcare: Heart,
  business: Briefcase,
  creative: Palette,
  social_impact: Users
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const TIER_COLORS: Record<string, {
  bg: string
  text: string
  border: string
  glow: string
}> = {
  slate: {
    bg: 'bg-slate-800/50',
    text: 'text-slate-300',
    border: 'border-slate-600/50',
    glow: ''
  },
  blue: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20'
  },
  green: {
    bg: 'bg-green-900/30',
    text: 'text-green-300',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20'
  },
  indigo: {
    bg: 'bg-indigo-900/30',
    text: 'text-indigo-300',
    border: 'border-indigo-500/30',
    glow: 'shadow-indigo-500/20'
  },
  purple: {
    bg: 'bg-purple-900/30',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/30'
  },
  amber: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/40'
  }
}

// Map tier level to color token
const TIER_LEVEL_COLORS: Record<number, string> = {
  0: 'slate',    // Curious
  1: 'blue',     // Exploring
  2: 'green',    // Apprentice
  3: 'indigo',   // Practitioner
  4: 'purple',   // Specialist
  5: 'amber'     // Champion
}

// ═══════════════════════════════════════════════════════════════════════════
// DOMAIN EXPERTISE BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface DomainExpertiseBadgeProps {
  /** Domain to display */
  domain: CareerDomain
  /** Tier level (0-5) */
  level: number
  /** Tier name (e.g., "Apprentice") */
  tierName: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show progress bar */
  showProgress?: boolean
  /** Progress percentage (0-100) */
  progressPercent?: number
  /** Optional class names */
  className?: string
  /** Show tooltip */
  showTooltip?: boolean
}

export function DomainExpertiseBadge({
  domain,
  level,
  tierName,
  size = 'md',
  showProgress = false,
  progressPercent = 0,
  className,
  showTooltip = false
}: DomainExpertiseBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayInfo = DOMAIN_DISPLAY[domain]
  const colorToken = TIER_LEVEL_COLORS[level] || 'slate'
  const colors = TIER_COLORS[colorToken]
  const IconComponent = DomainIcons[domain]

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
      className={cn('relative inline-flex flex-col', className)}
      title={showTooltip ? `${displayInfo.name}: ${tierName}` : undefined}
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
        {/* Domain Icon */}
        {IconComponent && (
          <div className={cn(colors.text)}>
            <IconComponent className={sizes.icon} />
          </div>
        )}

        {/* Domain + Tier Name */}
        <div className="flex flex-col">
          <span className={cn('font-medium leading-tight', sizes.text, colors.text)}>
            {tierName}
          </span>
          <span className="text-2xs text-slate-400 leading-tight">
            {displayInfo.name}
          </span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      {showProgress && level < 5 && (
        <div className={cn(
          'w-full rounded-full overflow-hidden mt-1',
          sizes.progress,
          'bg-slate-700/50'
        )}>
          <motion.div
            className={cn('h-full rounded-full', colors.bg.replace('/30', ''), colors.text.replace('text-', 'bg-'))}
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
// FULL DOMAIN CARD
// ═══════════════════════════════════════════════════════════════════════════

interface DomainExpertiseCardProps {
  expertise: DomainExpertise
  showEvidence?: boolean
  className?: string
}

export function DomainExpertiseCard({
  expertise,
  showEvidence = false,
  className
}: DomainExpertiseCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayInfo = DOMAIN_DISPLAY[expertise.domain]
  const colorToken = TIER_LEVEL_COLORS[expertise.level] || 'slate'
  const colors = TIER_COLORS[colorToken]
  const IconComponent = DomainIcons[expertise.domain]

  return (
    <motion.div
      className={cn(
        'rounded-xl border p-4',
        colors.bg,
        colors.border,
        expertise.isChampion && `shadow-lg ${colors.glow}`,
        className
      )}
      initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {IconComponent && (
            <div className={cn('p-2 rounded-lg', colors.bg, colors.border, 'border')}>
              <IconComponent className={cn('w-5 h-5', colors.text)} />
            </div>
          )}
          <div>
            <h3 className={cn('font-bold', colors.text)}>
              {displayInfo.name}
            </h3>
            <p className="text-xs text-slate-400">
              {displayInfo.description}
            </p>
          </div>
        </div>

        {/* Champion badge */}
        {expertise.isChampion && (
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
            Champion
          </span>
        )}
      </div>

      {/* Tier */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn('font-medium', colors.text)}>
          {expertise.tierName}
        </span>
        <span className="text-xs text-slate-400">
          {expertise.points} points
        </span>
      </div>

      {/* Progress bar */}
      {expertise.level < 5 && (
        <div className="w-full h-1.5 rounded-full bg-slate-700/50 overflow-hidden mb-3">
          <motion.div
            className={cn('h-full rounded-full', colors.text.replace('text-', 'bg-'))}
            initial={{ width: 0 }}
            animate={{ width: `${expertise.percentToNext}%` }}
            transition={springs.smooth}
          />
        </div>
      )}

      {/* Evidence */}
      {showEvidence && expertise.evidence.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-xs text-slate-500 mb-2">Evidence:</p>
          <ul className="space-y-1">
            {expertise.evidence.slice(0, 3).map((ev, i) => (
              <li key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                {ev.description}
              </li>
            ))}
            {expertise.evidence.length > 3 && (
              <li className="text-xs text-slate-500">
                +{expertise.evidence.length - 3} more
              </li>
            )}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT DOMAIN BADGE
// ═══════════════════════════════════════════════════════════════════════════

interface CompactDomainBadgeProps {
  domain: CareerDomain
  level: number
  className?: string
}

/**
 * Minimal badge showing just icon and tier level
 */
export function CompactDomainBadge({ domain, level, className }: CompactDomainBadgeProps) {
  const displayInfo = DOMAIN_DISPLAY[domain]
  const colorToken = TIER_LEVEL_COLORS[level] || 'slate'
  const colors = TIER_COLORS[colorToken]
  const IconComponent = DomainIcons[domain]
  const tierName = EXPERTISE_TIER_NAMES[level] || 'Curious'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded',
        colors.bg,
        colors.text,
        className
      )}
      title={`${displayInfo.name}: ${tierName}`}
    >
      {IconComponent && <IconComponent className="w-3 h-3" />}
      <span className="text-xs font-medium">
        {tierName.slice(0, 3)}
      </span>
    </div>
  )
}

export default DomainExpertiseBadge
