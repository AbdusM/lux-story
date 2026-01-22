"use client"

/**
 * usePatternUnlocks - Hook for tracking orb fill levels and unlocks
 *
 * Each pattern orb fills up as choices are made.
 * This hook provides:
 * - Fill percentage for each orb
 * - Which abilities are unlocked
 * - Progress to next unlock
 * - Orb visual symbols (○◔◑◐●)
 */

import { useMemo } from 'react'
import { useOrbs } from '@/hooks/useOrbs'
import { type PatternType, PATTERN_METADATA, PATTERN_TYPES } from '@/lib/patterns'
import {
  type PatternUnlock,
  type OrbFillTier,
  getOrbSymbol,
  getOrbFillTier,
  ORB_FILL_TIERS,
  getUnlocksForPattern,
  getUnlockedAbilities,
  getNextUnlock,
  getProgressToNextUnlock,
  getAllUnlockedAbilities,
  getPatternTagline,
  orbCountToFillPercent,
} from '@/lib/pattern-unlocks'
import { MAX_ORB_COUNT } from '@/lib/constants'

/**
 * State for a single pattern orb
 */
export interface OrbState {
  pattern: PatternType
  label: string
  color: string
  orbCount: number
  fillPercent: number
  symbol: string
  tier: OrbFillTier
  tierLabel: string
  tagline: string
  unlockedAbilities: PatternUnlock[]
  nextUnlock: PatternUnlock | null
  pointsToNext: number
  progressToNext: number
  hasNewGrowth: boolean  // True if this pattern grew since last Journal view (for marquee)
}

/**
 * Return type for the hook
 */
export interface UsePatternUnlocksReturn {
  // All 5 orbs
  orbs: OrbState[]

  // Quick access by pattern
  getOrb: (pattern: PatternType) => OrbState

  // All unlocked abilities across patterns
  allUnlocks: PatternUnlock[]

  // Total progress (average of all orbs)
  totalProgress: number

  // Check if specific unlock is achieved
  hasUnlock: (unlockId: string) => boolean

  // Newly unlocked (for notifications) - abilities unlocked since last check
  // Note: This would need session tracking to implement fully
}

export function usePatternUnlocks(): UsePatternUnlocksReturn {
  const { balance, patternsWithNewOrbs } = useOrbs()

  // Build orb state for each pattern
  const orbs = useMemo((): OrbState[] => {
    return PATTERN_TYPES.map(pattern => {
      const metadata = PATTERN_METADATA[pattern]
      const orbCount = balance[pattern]
      const fillPercent = orbCountToFillPercent(orbCount, MAX_ORB_COUNT)
      const tier = getOrbFillTier(fillPercent)
      const { nextUnlock, pointsNeeded, progressPercent } = getProgressToNextUnlock(pattern, fillPercent)

      return {
        pattern,
        label: metadata.label,
        color: metadata.color,
        orbCount,
        fillPercent,
        symbol: getOrbSymbol(fillPercent),
        tier,
        tierLabel: ORB_FILL_TIERS[tier].label,
        tagline: getPatternTagline(pattern),
        unlockedAbilities: getUnlockedAbilities(pattern, fillPercent),
        nextUnlock,
        pointsToNext: pointsNeeded,
        progressToNext: progressPercent,
        hasNewGrowth: patternsWithNewOrbs.has(pattern as any),
      }
    })
  }, [balance, patternsWithNewOrbs])

  // Quick lookup by pattern
  const getOrb = useMemo(() => {
    const orbMap = new Map(orbs.map(o => [o.pattern, o]))
    return (pattern: PatternType): OrbState => {
      return orbMap.get(pattern) || orbs[0] // Fallback to first orb
    }
  }, [orbs])

  // All currently unlocked abilities
  const allUnlocks = useMemo(() => {
    const fills: Record<PatternType, number> = {
      analytical: orbCountToFillPercent(balance.analytical, MAX_ORB_COUNT),
      patience: orbCountToFillPercent(balance.patience, MAX_ORB_COUNT),
      exploring: orbCountToFillPercent(balance.exploring, MAX_ORB_COUNT),
      helping: orbCountToFillPercent(balance.helping, MAX_ORB_COUNT),
      building: orbCountToFillPercent(balance.building, MAX_ORB_COUNT),
    }
    return getAllUnlockedAbilities(fills)
  }, [balance])

  // Total progress as average of all orbs
  const totalProgress = useMemo(() => {
    const sum = orbs.reduce((acc, orb) => acc + orb.fillPercent, 0)
    return Math.round(sum / orbs.length)
  }, [orbs])

  // Check if specific unlock is achieved
  const hasUnlock = useMemo(() => {
    const unlockSet = new Set(allUnlocks.map(u => u.id))
    return (unlockId: string): boolean => unlockSet.has(unlockId)
  }, [allUnlocks])

  return {
    orbs,
    getOrb,
    allUnlocks,
    totalProgress,
    hasUnlock,
  }
}
