"use client"

/**
 * useOrbs - Hook for managing orb state and earning logic
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
import { useLocalStorage } from '@/hooks/useLocalStorage'
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
  dominantPattern: OrbType | null
}

export function useOrbs(): UseOrbsReturn {
  // Persist orb balance to localStorage
  const [balance, setBalance] = useLocalStorage<OrbBalance>(
    'lux-orb-balance',
    INITIAL_ORB_BALANCE
  )

  // Track which milestones have been reached (for dialogue triggers)
  const [milestones, setMilestones] = useLocalStorage<OrbMilestones>(
    'lux-orb-milestones',
    {
      firstOrb: false,
      tierEmerging: false,
      tierDeveloping: false,
      tierFlourishing: false,
      tierMastered: false,
      streak3: false,
      streak5: false,
      streak10: false
    }
  )

  // Track last viewed total for FoxTheatreGlow discovery prompt
  const [lastViewedTotal, setLastViewedTotal] = useLocalStorage<number>(
    'lux-orb-last-viewed',
    0
  )

  // Track which milestones Samuel has acknowledged (so he doesn't repeat)
  const [acknowledgedMilestones, setAcknowledgedMilestones] = useLocalStorage<Partial<OrbMilestones>>(
    'lux-orb-acknowledged',
    {}
  )

  /**
   * Earn orb from a choice - SILENT, no UI feedback
   */
  const earnOrb = useCallback((pattern: PatternType): { crossedThreshold5: boolean } => {
    const orbType = pattern as OrbType
    let crossedThreshold5 = false

    setBalance(prev => {
      const previousCount = prev[orbType]  // Store count before earning
      let amount = ORB_EARNINGS.choice

      // Check for streak
      let newStreak = 1
      let newStreakType: OrbType | null = orbType

      if (prev.currentStreakType === orbType) {
        newStreak = prev.currentStreak + 1

        // Add streak bonus
        const streakBonus = getStreakBonus(newStreak) - getStreakBonus(prev.currentStreak)
        if (streakBonus > 0) {
          amount += streakBonus
        }
      }

      const newTotal = prev.totalEarned + amount
      const newCount = previousCount + amount

      // Check if crossed threshold 5 (for identity offering)
      if (previousCount < 5 && newCount >= 5) {
        crossedThreshold5 = true
      }

      // Update milestones (for dialogue system to check)
      const newTier = getOrbTier(newTotal)
      setMilestones(m => ({
        ...m,
        firstOrb: true,
        tierEmerging: newTier !== 'nascent' || m.tierEmerging,
        tierDeveloping: ['developing', 'flourishing', 'mastered'].includes(newTier) || m.tierDeveloping,
        tierFlourishing: ['flourishing', 'mastered'].includes(newTier) || m.tierFlourishing,
        tierMastered: newTier === 'mastered' || m.tierMastered,
        streak3: newStreak >= 3 || m.streak3,
        streak5: newStreak >= 5 || m.streak5,
        streak10: newStreak >= 10 || m.streak10
      }))

      return {
        ...prev,
        [orbType]: prev[orbType] + amount,
        totalEarned: newTotal,
        currentStreak: newStreak,
        currentStreakType: newStreakType,
        bestStreak: Math.max(prev.bestStreak, newStreak)
      }
    })

    return { crossedThreshold5 }
  }, [setBalance, setMilestones])

  /**
   * Earn bonus orbs (milestones, arc completion) - SILENT
   */
  const earnBonusOrbs = useCallback((pattern: PatternType, amount: number) => {
    const orbType = pattern as OrbType

    setBalance(prev => ({
      ...prev,
      [orbType]: prev[orbType] + amount,
      totalEarned: prev.totalEarned + amount
    }))
  }, [setBalance])

  /**
   * Mark orbs as viewed - call when Journal is opened
   * This clears the FoxTheatreGlow "new orbs" indicator
   */
  const markOrbsViewed = useCallback(() => {
    setLastViewedTotal(balance.totalEarned)
  }, [setLastViewedTotal, balance.totalEarned])

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
    setAcknowledgedMilestones(prev => ({
      ...prev,
      [milestone]: true
    }))
  }, [setAcknowledgedMilestones])

  // Computed values
  const tier = useMemo(() => getOrbTier(balance.totalEarned), [balance.totalEarned])

  const hasOrbs = balance.totalEarned > 0

  // Check if there are new orbs since last Journal view
  const hasNewOrbs = balance.totalEarned > lastViewedTotal

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
    dominantPattern
  }
}
