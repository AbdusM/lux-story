/**
 * Evidence Schema Definition
 *
 * TICKET-004: Ensure data capture for B2B value prop
 *
 * Every meaningful choice logs structured evidence that can demonstrate:
 * - Pattern alignment (what behaviors the player exhibits)
 * - Skill demonstration (competencies shown through choices)
 * - Decision quality (rubric scoring for assessment)
 */

import type { PatternType } from './patterns'
import type { CharacterId } from './graph-registry'

/**
 * A single evidence entry capturing a meaningful player action
 */
export interface EvidenceEntry {
  /** Unique identifier for this evidence entry */
  id: string

  /** When this evidence was captured (ISO timestamp) */
  timestamp: string

  /** The action type that generated this evidence */
  actionType: 'choice' | 'interrupt' | 'simulation_complete' | 'relationship_milestone'

  /** Context: which character interaction produced this */
  characterId: CharacterId

  /** Context: the dialogue node where this occurred */
  nodeId: string

  /** The specific choice or action taken */
  action: {
    /** Choice text or action description */
    text: string
    /** Choice ID if from a dialogue choice */
    choiceId?: string
  }

  /** Pattern tags demonstrated by this action */
  skillTags: PatternType[]

  /** Rubric scoring (0-5 scale for assessment) */
  rubricScore: {
    /** How well this demonstrates the tagged patterns */
    patternAlignment: number
    /** Quality of decision-making shown */
    decisionQuality: number
    /** Appropriateness for the context */
    contextualFit: number
  }

  /** Optional: specific skills demonstrated */
  demonstratedSkills?: string[]

  /** Optional: narrative context for qualitative assessment */
  narrativeContext?: string
}

/**
 * Summary of evidence for a session or export
 */
export interface EvidenceSummary {
  /** Session or user identifier */
  userId: string

  /** Total entries collected */
  totalEntries: number

  /** Date range of evidence */
  dateRange: {
    start: string
    end: string
  }

  /** Pattern distribution */
  patternDistribution: Record<PatternType, number>

  /** Average rubric scores */
  averageScores: {
    patternAlignment: number
    decisionQuality: number
    contextualFit: number
  }

  /** Top demonstrated skills */
  topSkills: Array<{ skill: string; count: number }>

  /** Character engagement summary */
  characterEngagement: Array<{ characterId: CharacterId; interactions: number }>
}

/**
 * Create a new evidence entry with defaults
 */
export function createEvidenceEntry(
  partial: Pick<EvidenceEntry, 'actionType' | 'characterId' | 'nodeId' | 'action' | 'skillTags'> &
    Partial<EvidenceEntry>
): EvidenceEntry {
  return {
    id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    rubricScore: {
      patternAlignment: 3, // Default neutral score
      decisionQuality: 3,
      contextualFit: 3,
    },
    ...partial,
  }
}

/**
 * Calculate rubric score from choice metadata
 */
export function calculateRubricScore(
  choice: { patterns?: PatternType[]; weight?: number },
  dominantPattern?: PatternType
): EvidenceEntry['rubricScore'] {
  const patterns = choice.patterns || []
  const weight = choice.weight || 1

  // Pattern alignment: higher if choice patterns match dominant
  const patternAlignment = dominantPattern && patterns.includes(dominantPattern)
    ? Math.min(5, 3 + weight)
    : 3

  // Decision quality: based on weight (higher weight = more meaningful choice)
  const decisionQuality = Math.min(5, 2 + weight)

  // Contextual fit: neutral by default, can be enhanced with more context
  const contextualFit = 3

  return { patternAlignment, decisionQuality, contextualFit }
}
