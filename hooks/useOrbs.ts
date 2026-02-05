"use client"

/**
 * useOrbs - Hook for managing orb state and earning logic
 *
 * TD-004: Refactored to use Zustand store instead of direct localStorage.
 * Orb state is now part of coreGameState for atomic save/load.
 *
 * Design principle: SILENT during gameplay.
 * - No toasts or notifications that break narrative flow
 * - Orbs accumulate silently as player makes choices
 * - Discovery happens when player opens Journal
 * - Samuel acknowledges milestones through dialogue (consequence echoes)
 *
 * Provides:
 * - Current orb balance
 * - Earn orbs when choices are made
 * - Track streaks and milestones
 * - Milestone flags for dialogue system to reference
 */

import { useCallback, useMemo } from 'react'
import { useGameStore, useGameSelectors } from '@/lib/game-store'
import { INITIAL_ORB_STATE, type OrbState } from '@/lib/character-state'
import {
  type OrbBalance,
  type OrbType,
  INITIAL_ORB_BALANCE,
  ORB_EARNINGS,
  getStreakBonus,
  getOrbTier
} from '@/lib/orbs'
import { type PatternType } from '@/lib/patterns'

/**
 * Milestone flags that can be checked by dialogue system
 */
export interface OrbMilestones {
  firstOrb: boolean
  tierEmerging: boolean
  tierDeveloping: boolean
  tierFlourishing: boolean
  tierMastered: boolean
  streak3: boolean
  streak5: boolean
  streak10: boolean
}

interface UseOrbsReturn {
  // State
  balance: OrbBalance
  milestones: OrbMilestones

  // Actions (silent - no UI feedback)
  earnOrb: (pattern: PatternType) => { crossedThreshold5: boolean }  // Returns whether pattern crossed threshold 5
  earnBonusOrbs: (pattern: PatternType, amount: number) => void
  markOrbsViewed: () => void  // Call when Journal is opened
  getUnacknowledgedMilestone: () => keyof OrbMilestones | null  // Get next milestone for Samuel to acknowledge
  acknowledgeMilestone: (milestone: keyof OrbMilestones) => void  // Mark milestone as acknowledged

  // Computed
  tier: ReturnType<typeof getOrbTier>
  hasOrbs: boolean
  hasNewOrbs: boolean  // True if new orbs since last Journal view
  patternsWithNewOrbs: Set<OrbType>  // Which patterns have grown since last view (for marquee)
  dominantPattern: OrbType | null
}

export function useOrbs(): UseOrbsReturn {
  // TD-004: Read orb state from Zustand (single source of truth)
  const orbState = useGameSelectors.useOrbs()
  const updateOrbs = useGameStore((state) => state.updateOrbs)

  // Extract state with fallbacks for migration
  const balance = orbState?.balance ?? INITIAL_ORB_BALANCE
  const milestones = orbState?.milestones ?? INITIAL_ORB_STATE.milestones
  const lastViewedTotal = orbState?.lastViewed ?? 0
  const lastViewedBalance = orbState?.lastViewedBalance ?? {}
  const acknowledgedMilestones = orbState?.acknowledged ?? {}

  /**
   * Earn orb from a choice - SILENT, no UI feedback
   */
  const earnOrb = useCallback((pattern: PatternType): { crossedThreshold5: boolean } => {
    const orbType = pattern as OrbType
    let crossedThreshold5 = false

    updateOrbs((prev: OrbState) => {
      const prevBalance = prev.balance
      const previousCount = prevBalance[orbType]
      let amount = ORB_EARNINGS.choice

      // Check for streak
      let newStreak = 1
      const newStreakType: OrbType | null = orbType

      if (prevBalance.currentStreakType === orbType) {
        newStreak = prevBalance.currentStreak + 1

        // Add streak bonus
        const streakBonus = getStreakBonus(newStreak) - getStreakBonus(prevBalance.currentStreak)
        if (streakBonus > 0) {
          amount += streakBonus
        }
      }

      const newTotal = prevBalance.totalEarned + amount
      const newCount = previousCount + amount

      // Check if crossed threshold 5 (for identity offering)
      if (previousCount < 5 && newCount >= 5) {
        crossedThreshold5 = true
      }

      // Update milestones (for dialogue system to check)
      const newTier = getOrbTier(newTotal)
      const newMilestones = {
        ...prev.milestones,
        firstOrb: true,
        tierEmerging: newTier !== 'nascent' || prev.milestones.tierEmerging,
        tierDeveloping: ['developing', 'flourishing', 'mastered'].includes(newTier) || prev.milestones.tierDeveloping,
        tierFlourishing: ['flourishing', 'mastered'].includes(newTier) || prev.milestones.tierFlourishing,
        tierMastered: newTier === 'mastered' || prev.milestones.tierMastered,
        streak3: newStreak >= 3 || prev.milestones.streak3,
        streak5: newStreak >= 5 || prev.milestones.streak5,
        streak10: newStreak >= 10 || prev.milestones.streak10
      }

      return {
        ...prev,
        balance: {
          ...prevBalance,
          [orbType]: newCount,
          totalEarned: newTotal,
          currentStreak: newStreak,
          currentStreakType: newStreakType,
          bestStreak: Math.max(prevBalance.bestStreak, newStreak)
        },
        milestones: newMilestones
      }
    })

    return { crossedThreshold5 }
  }, [updateOrbs])

  /**
   * Earn bonus orbs (milestones, arc completion) - SILENT
   */
  const earnBonusOrbs = useCallback((pattern: PatternType, amount: number) => {
    const orbType = pattern as OrbType

    updateOrbs((prev: OrbState) => ({
      ...prev,
      balance: {
        ...prev.balance,
        [orbType]: prev.balance[orbType] + amount,
        totalEarned: prev.balance.totalEarned + amount
      }
    }))
  }, [updateOrbs])

  /**
   * Mark orbs as viewed - call when Journal is opened
   * This clears the FoxTheatreGlow "new orbs" indicator
   */
  const markOrbsViewed = useCallback(() => {
    updateOrbs((prev: OrbState) => ({
      ...prev,
      lastViewed: prev.balance.totalEarned,
      lastViewedBalance: {
        analytical: prev.balance.analytical,
        patience: prev.balance.patience,
        exploring: prev.balance.exploring,
        helping: prev.balance.helping,
        building: prev.balance.building
      }
    }))
  }, [updateOrbs])

  /**
   * Get the next unacknowledged milestone for Samuel to recognize
   * Returns null if no new milestones to acknowledge
   * Priority order: tiers first, then streaks
   */
  const getUnacknowledgedMilestone = useCallback((): keyof OrbMilestones | null => {
    // Priority order for acknowledgment
    const orderedMilestones: (keyof OrbMilestones)[] = [
      'firstOrb',
      'tierEmerging',
      'tierDeveloping',
      'tierFlourishing',
      'tierMastered',
      'streak3',
      'streak5',
      'streak10'
    ]

    for (const milestone of orderedMilestones) {
      if (milestones[milestone] && !acknowledgedMilestones[milestone]) {
        return milestone
      }
    }

    return null
  }, [milestones, acknowledgedMilestones])

  /**
   * Mark a milestone as acknowledged by Samuel
   */
  const acknowledgeMilestone = useCallback((milestone: keyof OrbMilestones) => {
    updateOrbs((prev: OrbState) => ({
      ...prev,
      acknowledged: {
        ...prev.acknowledged,
        [milestone]: true
      }
    }))
  }, [updateOrbs])

  // Computed values
  const tier = useMemo(() => getOrbTier(balance.totalEarned), [balance.totalEarned])

  const hasOrbs = balance.totalEarned > 0

  // Check if there are new orbs since last Journal view
  const hasNewOrbs = balance.totalEarned > lastViewedTotal

  // Compute which specific patterns have new orbs (for strategic marquee)
  const patternsWithNewOrbs = useMemo((): Set<OrbType> => {
    const newPatterns = new Set<OrbType>()
    const types: OrbType[] = ['analytical', 'patience', 'exploring', 'helping', 'building']
    for (const type of types) {
      const lastViewed = lastViewedBalance[type] ?? 0
      if (balance[type] > lastViewed) {
        newPatterns.add(type)
      }
    }
    return newPatterns
  }, [balance, lastViewedBalance])

  const dominantPattern = useMemo((): OrbType | null => {
    const types: OrbType[] = ['analytical', 'patience', 'exploring', 'helping', 'building']
    let maxType: OrbType | null = null
    let maxCount = 0

    for (const type of types) {
      if (balance[type] > maxCount) {
        maxCount = balance[type]
        maxType = type
      }
    }

    return maxType
  }, [balance])

  return {
    balance,
    milestones,
    earnOrb,
    earnBonusOrbs,
    markOrbsViewed,
    getUnacknowledgedMilestone,
    acknowledgeMilestone,
    tier,
    hasOrbs,
    hasNewOrbs,
    patternsWithNewOrbs,
    dominantPattern
  }
}
