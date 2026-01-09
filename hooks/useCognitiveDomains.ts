/**
 * useCognitiveDomains Hook
 *
 * Provides cognitive domain scores and engagement metrics for the Cognition view.
 * Aggregates skill demonstrations from the game state and calculates domain-level
 * assessments based on DSM-5 inspired cognitive framework.
 *
 * Usage:
 * ```tsx
 * const { domains, engagement, isLoading, refresh } = useCognitiveDomains()
 * ```
 */

import { useMemo, useCallback, useEffect, useState } from 'react'
import { useGameStore } from '@/lib/game-store'
import { safeStorage } from '@/lib/safe-storage'
import {
  CognitiveDomainId,
  CognitiveDomainScore,
  COGNITIVE_DOMAIN_IDS,
  createEmptyDomainScores,
  DOMAIN_METADATA,
  getCoreDomains,
  getAdvancedDomains,
  getLevelLabel,
  getLevelProgress
} from '@/lib/cognitive-domains'
import {
  calculateCognitiveDomainState,
  calculateEngagementMetrics,
  getStrongestDomains,
  getDevelopmentAreas,
  getDomainsNearThreshold,
  getCognitiveProfileSummary,
  PatternScores,
  EngagementMetrics,
  CognitiveDomainState
} from '@/lib/cognitive-domain-calculator'
import { SkillDemonstration } from '@/lib/skill-tracker'

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const STORAGE_KEY_PREFIX = 'cognitive_domains_'
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CognitiveDomainData {
  // Core domain scores
  domains: Record<CognitiveDomainId, CognitiveDomainScore>

  // Engagement metrics
  engagement: EngagementMetrics

  // Derived insights
  strongestDomains: CognitiveDomainScore[]
  developmentAreas: CognitiveDomainScore[]
  nearThreshold: CognitiveDomainScore[]

  // Profile summary
  profile: {
    averageLevel: string
    dominantCategory: 'core' | 'advanced' | 'balanced'
    overallConfidence: number
    levelDistribution: Record<string, number>
  }

  // Categories
  coreDomains: CognitiveDomainScore[]
  advancedDomains: CognitiveDomainScore[]

  // State
  isLoading: boolean
  lastUpdated: number

  // Actions
  refresh: () => void
}

// -----------------------------------------------------------------------------
// Hook Implementation
// -----------------------------------------------------------------------------

export function useCognitiveDomains(): CognitiveDomainData {
  // Get game state
  const patterns = useGameStore(state => state.patterns)
  const skills = useGameStore(state => state.skills)
  const coreGameState = useGameStore(state => state.coreGameState)

  // Local state for loading and cache
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(0)
  const [cachedState, setCachedState] = useState<CognitiveDomainState | null>(null)

  // Get user ID for storage
  const userId = useMemo(() => {
    if (typeof window !== 'undefined') {
      return safeStorage.getItem('lux_user_id') || 'anonymous'
    }
    return 'anonymous'
  }, [])

  // Load skill demonstrations from storage
  const demonstrations = useMemo<SkillDemonstration[]>(() => {
    if (typeof window === 'undefined') return []

    const storageKey = `skill_tracker_${userId}`
    const stored = safeStorage.getItem(storageKey)
    if (!stored) return []

    try {
      const parsed = JSON.parse(stored)
      return parsed.demonstrations || []
    } catch {
      return []
    }
  }, [userId])

  // Convert game store patterns to PatternScores format
  const patternScores = useMemo<PatternScores>(() => ({
    analytical: patterns?.analytical || 0,
    patience: patterns?.patience || 0,
    exploring: patterns?.exploring || 0,
    helping: patterns?.helping || 0,
    building: patterns?.building || 0
  }), [patterns])

  // Calculate cognitive domain state
  const domainState = useMemo<CognitiveDomainState>(() => {
    if (demonstrations.length === 0 && !cachedState) {
      // Return empty state if no data
      return {
        domains: createEmptyDomainScores(),
        engagement: {
          level: 'INACTIVE',
          activeDaysLast7: 0,
          totalDemonstrations: 0,
          averagePerDay: 0,
          lastActivityTimestamp: 0
        },
        lastCalculated: Date.now()
      }
    }

    // Calculate fresh state
    const context = {
      patternScores,
      // Could add trust momentum and pattern balance from derivatives here
      trustMomentum: undefined,
      patternBalance: undefined
    }

    return calculateCognitiveDomainState(demonstrations, context)
  }, [demonstrations, patternScores, cachedState])

  // Derived data
  const strongestDomains = useMemo(() =>
    getStrongestDomains(domainState.domains, 3),
    [domainState.domains]
  )

  const developmentAreas = useMemo(() =>
    getDevelopmentAreas(domainState.domains, 3),
    [domainState.domains]
  )

  const nearThreshold = useMemo(() =>
    getDomainsNearThreshold(domainState.domains, 0.2),
    [domainState.domains]
  )

  const profile = useMemo(() => {
    const summary = getCognitiveProfileSummary(domainState.domains)
    return {
      averageLevel: getLevelLabel(summary.averageLevel),
      dominantCategory: summary.dominantCategory,
      overallConfidence: summary.overallConfidence,
      levelDistribution: summary.levelDistribution as unknown as Record<string, number>
    }
  }, [domainState.domains])

  // Split into core and advanced domains
  const coreDomains = useMemo(() => {
    const coreIds = getCoreDomains()
    return coreIds.map(id => domainState.domains[id])
  }, [domainState.domains])

  const advancedDomains = useMemo(() => {
    const advancedIds = getAdvancedDomains()
    return advancedIds.map(id => domainState.domains[id])
  }, [domainState.domains])

  // Refresh function
  const refresh = useCallback(() => {
    setIsLoading(true)
    setCachedState(null)
    setLastUpdated(Date.now())
    // Force re-calculation by invalidating cache
    setTimeout(() => setIsLoading(false), 100)
  }, [])

  // Initialize loading state
  useEffect(() => {
    setIsLoading(false)
    setLastUpdated(Date.now())
  }, [domainState])

  return {
    domains: domainState.domains,
    engagement: domainState.engagement,
    strongestDomains,
    developmentAreas,
    nearThreshold,
    profile,
    coreDomains,
    advancedDomains,
    isLoading,
    lastUpdated,
    refresh
  }
}

// -----------------------------------------------------------------------------
// Selector Hooks (for optimized re-renders)
// -----------------------------------------------------------------------------

/**
 * Get a single domain score
 */
export function useDomainScore(domainId: CognitiveDomainId): CognitiveDomainScore | null {
  const { domains } = useCognitiveDomains()
  return domains[domainId] || null
}

/**
 * Get engagement metrics only
 */
export function useEngagementMetrics(): EngagementMetrics {
  const { engagement } = useCognitiveDomains()
  return engagement
}

/**
 * Check if meeting ISP engagement threshold (3x/week)
 */
export function useIsEngaged(): boolean {
  const { engagement } = useCognitiveDomains()
  return engagement.level === 'MODERATE' ||
         engagement.level === 'HIGH' ||
         engagement.level === 'INTENSIVE'
}

/**
 * Get domain color for UI
 */
export function useDomainColor(domainId: CognitiveDomainId, colorblindMode: boolean = false): string {
  const meta = DOMAIN_METADATA[domainId]
  return colorblindMode ? meta.colorblindSafe : meta.color
}

// -----------------------------------------------------------------------------
// Utility Hooks
// -----------------------------------------------------------------------------

/**
 * Get progress to next level for a domain
 */
export function useDomainProgress(domainId: CognitiveDomainId): {
  progress: number
  currentLevel: string
  nextLevel: string | null
} {
  const { domains } = useCognitiveDomains()
  const domain = domains[domainId]

  if (!domain) {
    return { progress: 0, currentLevel: 'Dormant', nextLevel: 'Emerging' }
  }

  const progress = getLevelProgress(domain.rawScore)
  const currentLevel = getLevelLabel(domain.level)

  const levelOrder = ['dormant', 'emerging', 'developing', 'flourishing', 'mastery']
  const currentIndex = levelOrder.indexOf(domain.level)
  const nextLevel = currentIndex < levelOrder.length - 1
    ? getLevelLabel(levelOrder[currentIndex + 1] as typeof domain.level)
    : null

  return { progress, currentLevel, nextLevel }
}

/**
 * Check if any domains have new activity (for badge display)
 */
export function useHasNewActivity(): boolean {
  const { engagement, lastUpdated } = useCognitiveDomains()

  // Consider "new" if there's been activity in the last session
  const sessionStart = Date.now() - (30 * 60 * 1000) // 30 minutes
  return engagement.lastActivityTimestamp > sessionStart
}
