"use client"

/**
 * OrbBalance - Display player's orb collection
 *
 * Shows:
 * - Total orbs with tier indicator
 * - Distribution across pattern types
 * - Current streak if active
 */

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OrbIcon, OrbIconStatic } from './OrbIcon'
import {
  type OrbBalance as OrbBalanceType,
  type OrbType,
  getOrbTier,
  getOrbTierMetadata,
  formatOrbCount,
  getOrbDistribution
} from '@/lib/orbs'
import { PATTERN_METADATA } from '@/lib/patterns'

interface OrbBalanceProps {
  balance: OrbBalanceType
  compact?: boolean
  showDistribution?: boolean
  className?: string
}

const ORB_TYPES: OrbType[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

export function OrbBalance({
  balance,
  compact = false,
  showDistribution = true,
  className
}: OrbBalanceProps) {
  const tier = getOrbTier(balance.totalEarned)
  const tierMeta = getOrbTierMetadata(tier)
  const distribution = getOrbDistribution(balance)
  const dominantType = getDominantType(balance)

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {dominantType && (
          <OrbIcon type={dominantType} size="sm" tier={tier} />
        )}
        <span className="text-sm font-medium" style={{ color: tierMeta.color }}>
          {formatOrbCount(balance.totalEarned)}
        </span>
        {balance.currentStreak >= 3 && (
          <span className="flex items-center gap-0.5 text-orange-500">
            <Flame className="w-3 h-3" />
            <span className="text-xs">{balance.currentStreak}</span>
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header with total and tier */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {dominantType && (
            <OrbIcon type={dominantType} size="lg" tier={tier} />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: tierMeta.color }}>
                {formatOrbCount(balance.totalEarned)}
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-wide">
                Insight Orbs
              </span>
            </div>
            <p className="text-xs text-slate-400">{tierMeta.description}</p>
          </div>
        </div>

        {/* Streak indicator */}
        {balance.currentStreak >= 3 && (
          <motion.div
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-500">{balance.currentStreak}</span>
          </motion.div>
        )}
      </div>

      {/* Distribution bars */}
      {showDistribution && balance.totalEarned > 0 && (
        <div className="space-y-2">
          <h4 className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
            Your Approach
          </h4>
          <div className="space-y-1.5">
            {ORB_TYPES.map(type => {
              const count = balance[type]
              const percentage = distribution[type]
              const meta = PATTERN_METADATA[type]

              if (count === 0) return null

              return (
                <div key={type} className="flex items-center gap-2">
                  <OrbIconStatic type={type} size="sm" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 w-16 truncate">
                    {meta.shortLabel}
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: meta.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-2xs font-mono text-slate-400 w-8 text-right">
                    {percentage}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {balance.totalEarned === 0 && (
        <div className="text-center py-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
          <p className="text-xs text-slate-400">
            Make choices to earn insight orbs
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Get the dominant orb type from balance
 */
function getDominantType(balance: OrbBalanceType): OrbType | null {
  let maxType: OrbType | null = null
  let maxCount = 0

  for (const type of ORB_TYPES) {
    if (balance[type] > maxCount) {
      maxCount = balance[type]
      maxType = type
    }
  }

  return maxType
}

/**
 * OrbBalanceMini - Tiny display for header
 */
export function OrbBalanceMini({
  balance,
  className
}: {
  balance: OrbBalanceType
  className?: string
}) {
  const tier = getOrbTier(balance.totalEarned)
  const tierMeta = getOrbTierMetadata(tier)
  const dominantType = getDominantType(balance)

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {dominantType ? (
        <OrbIcon type={dominantType} size="sm" tier={tier} animated={false} />
      ) : (
        <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600" />
      )}
      <span
        className="text-xs font-medium tabular-nums"
        style={{ color: balance.totalEarned > 0 ? tierMeta.color : undefined }}
      >
        {formatOrbCount(balance.totalEarned)}
      </span>
    </div>
  )
}
