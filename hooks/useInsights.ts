/**
 * useInsights Hook
 *
 * React hook that provides interpreted insights from game state.
 * Uses the insights-engine to transform raw data into meaningful interpretations.
 */

import { useMemo } from 'react'
import { useGameStore, type PatternTracking, type ChoiceRecord } from '@/lib/game-store'
import {
  generateCombinedInsights,
  type CombinedInsights,
  type DecisionStyleInsight,
  type RelationshipInsight,
  type ChoicePatternInsight,
  type JourneyInsight,
  type RelationshipPatternInsight
} from '@/lib/insights-engine'

export interface InsightsData {
  /**
   * Primary decision-making style based on pattern analysis
   */
  decisionStyle: DecisionStyleInsight

  /**
   * Journey progress insight
   */
  journey: JourneyInsight

  /**
   * Pattern in which characters the player connects with
   */
  relationshipPattern: RelationshipPatternInsight | null

  /**
   * Behavioral patterns detected from choice text analysis
   */
  choicePatterns: ChoicePatternInsight[]

  /**
   * Top character relationships with insights
   */
  topRelationships: RelationshipInsight[]

  /**
   * Whether the player has enough data for meaningful insights
   */
  hasEnoughData: boolean

  /**
   * Raw data for components that still need it
   */
  raw: {
    patterns: PatternTracking
    characterTrust: Record<string, number>
    choiceHistory: ChoiceRecord[]
  }
}

/**
 * Hook that provides interpreted insights from game state
 *
 * @example
 * const { decisionStyle, topRelationships, hasEnoughData } = useInsights()
 *
 * if (decisionStyle.primaryPattern) {
 *   console.log(`You're a ${decisionStyle.primaryPattern.label}!`)
 * }
 */
export function useInsights(): InsightsData {
  const patterns = useGameStore(state => state.patterns)
  const characterTrust = useGameStore(state => state.characterTrust)
  const choiceHistory = useGameStore(state => state.choiceHistory)

  const insights = useMemo<CombinedInsights>(() => {
    return generateCombinedInsights(patterns, characterTrust, choiceHistory)
  }, [patterns, characterTrust, choiceHistory])

  // Determine if we have enough data for meaningful insights
  const hasEnoughData = useMemo(() => {
    const totalPatternCount = Object.values(patterns).reduce((sum, val) => sum + val, 0)
    return totalPatternCount >= 3 || choiceHistory.length >= 5
  }, [patterns, choiceHistory])

  return {
    ...insights,
    hasEnoughData,
    raw: {
      patterns,
      characterTrust,
      choiceHistory
    }
  }
}

// Re-export types for convenience
export type {
  DecisionStyleInsight,
  RelationshipInsight,
  ChoicePatternInsight,
  JourneyInsight,
  RelationshipPatternInsight
}
