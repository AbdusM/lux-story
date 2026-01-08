"use client"

/**
 * usePlayerAnalysis Hook
 *
 * Aggregates real game state data for the Analysis tab.
 * Replaces the hardcoded useNarrativeAnalysis hook.
 */

import { useMemo } from 'react'
import { useInsights } from './useInsights'
import { useGameSelectors } from '@/lib/game-store'
import { useConstellationData } from './useConstellationData'
import {
  getEarnedAchievements,
  calculatePatternBalance,
  type PatternAchievement
} from '@/lib/pattern-derivatives'
import {
  getTrustTrend,
  type TrustTimeline
} from '@/lib/trust-derivatives'
import {
  getCareerRecommendations,
  analyzeSkillGaps,
  type CareerRecommendation,
  type SkillGapAnalysis
} from '@/lib/assessment-derivatives'
import type { PlayerPatterns } from '@/lib/character-state'
import type { CharacterId } from '@/lib/graph-registry'

// TrustTrend matches return type of getTrustTrend
export type TrustTrend = 'improving' | 'stable' | 'declining'

// ============================================
// TYPES
// ============================================

export interface PatternData {
  /** Current pattern scores */
  patterns: PlayerPatterns
  /** 0-100 score of how balanced patterns are */
  balanceScore: number
  /** Dominant pattern type */
  dominantPattern: keyof PlayerPatterns | null
  /** Earned achievements */
  achievements: PatternAchievement[]
}

export interface CharacterTrustData {
  characterId: CharacterId
  name: string
  trust: number
  hasMet: boolean
  trend: TrustTrend
}

export interface RelationshipsData {
  /** All characters with trust data */
  characters: CharacterTrustData[]
  /** Top 5 by trust */
  topBonds: CharacterTrustData[]
  /** Characters with declining trust */
  declining: CharacterTrustData[]
  /** Trust asymmetry insights */
  asymmetryInsights: string[]
}

export interface CareerData {
  /** Top career matches */
  recommendations: CareerRecommendation[]
  /** Skill gaps for top career */
  skillGaps: SkillGapAnalysis | null
}

export interface MysteryProgress {
  letterSender: { state: string; progress: number }
  platformSeven: { state: string; progress: number }
  samuelsPast: { state: string; progress: number }
  stationNature: { state: string; progress: number }
}

export interface PlayerAnalysisData {
  /** From useInsights - decision style, journey, relationships */
  insights: ReturnType<typeof useInsights>
  /** Pattern balance and achievements */
  patternData: PatternData
  /** Character relationships and trust */
  relationshipsData: RelationshipsData
  /** Career recommendations and skill gaps */
  careerData: CareerData
  /** Station mysteries progress */
  mysteryProgress: MysteryProgress
  /** Whether enough data for meaningful analysis */
  hasEnoughData: boolean
}

// ============================================
// HOOK
// ============================================

export function usePlayerAnalysis(): PlayerAnalysisData {
  // Get insights from existing hook
  const insights = useInsights()

  // Get patterns from store (via insights raw data)
  const patterns = insights.raw.patterns
  const characterTrust = insights.raw.characterTrust

  // Get character constellation data
  const { characters: constellationChars } = useConstellationData()

  // Get core game state for mysteries
  const coreGameState = useGameSelectors.useCoreGameState()

  // Calculate pattern data
  const patternData = useMemo<PatternData>(() => {
    const playerPatterns: PlayerPatterns = {
      analytical: patterns.analytical || 0,
      patience: patterns.patience || 0,
      exploring: patterns.exploring || 0,
      helping: patterns.helping || 0,
      building: patterns.building || 0
    }

    const balanceScore = calculatePatternBalance(playerPatterns)
    const achievements = getEarnedAchievements(playerPatterns)

    // Find dominant pattern
    const entries = Object.entries(playerPatterns) as [keyof PlayerPatterns, number][]
    const sorted = entries.sort((a, b) => b[1] - a[1])
    const dominantPattern = sorted[0][1] > 0 ? sorted[0][0] : null

    return {
      patterns: playerPatterns,
      balanceScore: Math.round(balanceScore * 100),
      dominantPattern,
      achievements
    }
  }, [patterns])

  // Calculate relationships data
  const relationshipsData = useMemo<RelationshipsData>(() => {
    const characterData: CharacterTrustData[] = constellationChars.map(char => {
      const trust = characterTrust[char.id] || 0
      const timeline: TrustTimeline = {
        characterId: char.id,
        points: [],
        peakTrust: trust,
        peakTimestamp: Date.now(),
        lowestTrust: 0,
        lowestTimestamp: Date.now(),
        currentStreak: 0
      }

      return {
        characterId: char.id as CharacterId,
        name: char.name,
        trust,
        hasMet: char.hasMet,
        trend: getTrustTrend(timeline)
      }
    })

    // Sort by trust for top bonds
    const sortedByTrust = [...characterData]
      .filter(c => c.hasMet)
      .sort((a, b) => b.trust - a.trust)

    const topBonds = sortedByTrust.slice(0, 5)
    const declining = characterData.filter(c => c.trend === 'declining' && c.hasMet)

    // Generate asymmetry insights from computed data
    const asymmetryInsights: string[] = []

    // If we have top bonds, note the strongest connection
    if (topBonds.length > 0 && topBonds[0].trust > 3) {
      asymmetryInsights.push(
        `You've connected most with ${topBonds[0].name}`
      )
    }

    // Note any declining relationships
    if (declining.length > 0) {
      asymmetryInsights.push(
        `${declining.length} relationship${declining.length > 1 ? 's' : ''} may need attention`
      )
    }

    return {
      characters: characterData,
      topBonds,
      declining,
      asymmetryInsights
    }
  }, [constellationChars, characterTrust])

  // Calculate career data
  const careerData = useMemo<CareerData>(() => {
    const playerPatterns: PlayerPatterns = {
      analytical: patterns.analytical || 0,
      patience: patterns.patience || 0,
      exploring: patterns.exploring || 0,
      helping: patterns.helping || 0,
      building: patterns.building || 0
    }

    // Use empty skills for now - would come from game store
    const skillLevels: Record<string, number> = {}
    const recommendations = getCareerRecommendations(playerPatterns, skillLevels)

    // Get skill gaps for top career
    let skillGaps: SkillGapAnalysis | null = null
    if (recommendations.length > 0) {
      skillGaps = analyzeSkillGaps(recommendations[0].career.id, skillLevels)
    }

    return {
      recommendations: recommendations.slice(0, 3),
      skillGaps
    }
  }, [patterns])

  // Calculate mystery progress from MysteryState string enums
  const mysteryProgress = useMemo<MysteryProgress>(() => {
    const mysteries = coreGameState?.mysteries || {
      letterSender: 'unknown',
      platformSeven: 'flickering',
      samuelsPast: 'hidden',
      stationNature: 'unknown'
    }

    // Progress mapping based on state progression
    const letterSenderProgress: Record<string, number> = {
      'unknown': 0, 'investigating': 25, 'trusted': 50,
      'rejected': 50, 'samuel_knows': 75, 'self_revealed': 100
    }
    const platformSevenProgress: Record<string, number> = {
      'stable': 50, 'flickering': 25, 'error': 40,
      'denied': 60, 'revealed': 100
    }
    const samuelsPastProgress: Record<string, number> = {
      'hidden': 0, 'hinted': 50, 'revealed': 100
    }
    const stationNatureProgress: Record<string, number> = {
      'unknown': 0, 'sensing': 33, 'understanding': 66, 'mastered': 100
    }

    return {
      letterSender: {
        state: mysteries.letterSender,
        progress: letterSenderProgress[mysteries.letterSender] || 0
      },
      platformSeven: {
        state: mysteries.platformSeven,
        progress: platformSevenProgress[mysteries.platformSeven] || 0
      },
      samuelsPast: {
        state: mysteries.samuelsPast,
        progress: samuelsPastProgress[mysteries.samuelsPast] || 0
      },
      stationNature: {
        state: mysteries.stationNature,
        progress: stationNatureProgress[mysteries.stationNature] || 0
      }
    }
  }, [coreGameState?.mysteries])

  // Check if enough data
  const hasEnoughData = insights.hasEnoughData

  return {
    insights,
    patternData,
    relationshipsData,
    careerData,
    mysteryProgress,
    hasEnoughData
  }
}

// Helper
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
