'use client'

import { useCallback, useRef } from 'react'
import {
  EvidenceEntry,
  createEvidenceEntry,
  calculateRubricScore,
} from '@/lib/evidence-schema'
import type { PatternType } from '@/lib/patterns'
import type { CharacterId } from '@/lib/graph-registry'

/**
 * useEvidence Hook
 *
 * TICKET-004: Log structured evidence for B2B value prop
 *
 * Usage:
 * ```tsx
 * const { logEvidence, getEntries } = useEvidence()
 *
 * // On choice selection
 * logEvidence({
 *   actionType: 'choice',
 *   characterId: 'maya',
 *   nodeId: 'maya_intro_01',
 *   action: { text: 'Tell me about yourself', choiceId: 'intro_friendly' },
 *   skillTags: ['helping', 'exploring'],
 * })
 * ```
 */
export function useEvidence() {
  // In-memory storage for this session
  // Future: persist to localStorage or API
  const entriesRef = useRef<EvidenceEntry[]>([])

  /**
   * Log a new evidence entry
   */
  const logEvidence = useCallback((
    params: {
      actionType: EvidenceEntry['actionType']
      characterId: CharacterId
      nodeId: string
      action: EvidenceEntry['action']
      skillTags: PatternType[]
      dominantPattern?: PatternType
      demonstratedSkills?: string[]
      narrativeContext?: string
    }
  ) => {
    const { dominantPattern, ...entryParams } = params

    // Calculate rubric score based on choice metadata
    const rubricScore = calculateRubricScore(
      { patterns: params.skillTags },
      dominantPattern
    )

    const entry = createEvidenceEntry({
      ...entryParams,
      rubricScore,
    })

    entriesRef.current.push(entry)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Evidence]', {
        type: entry.actionType,
        character: entry.characterId,
        patterns: entry.skillTags,
        score: entry.rubricScore,
      })
    }

    return entry
  }, [])

  /**
   * Get all evidence entries for this session
   */
  const getEntries = useCallback(() => {
    return [...entriesRef.current]
  }, [])

  /**
   * Get evidence summary statistics
   */
  const getSummary = useCallback(() => {
    const entries = entriesRef.current
    if (entries.length === 0) return null

    // Pattern distribution
    const patternCounts: Record<string, number> = {}
    entries.forEach(e => {
      e.skillTags.forEach(tag => {
        patternCounts[tag] = (patternCounts[tag] || 0) + 1
      })
    })

    // Average scores
    const avgScores = entries.reduce(
      (acc, e) => ({
        patternAlignment: acc.patternAlignment + e.rubricScore.patternAlignment,
        decisionQuality: acc.decisionQuality + e.rubricScore.decisionQuality,
        contextualFit: acc.contextualFit + e.rubricScore.contextualFit,
      }),
      { patternAlignment: 0, decisionQuality: 0, contextualFit: 0 }
    )

    const count = entries.length
    return {
      totalEntries: count,
      patternDistribution: patternCounts,
      averageScores: {
        patternAlignment: avgScores.patternAlignment / count,
        decisionQuality: avgScores.decisionQuality / count,
        contextualFit: avgScores.contextualFit / count,
      },
    }
  }, [])

  /**
   * Clear all evidence (for testing)
   */
  const clearEvidence = useCallback(() => {
    entriesRef.current = []
  }, [])

  return {
    logEvidence,
    getEntries,
    getSummary,
    clearEvidence,
  }
}
