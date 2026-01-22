/**
 * Learning Objectives Tracker
 * Tracks student engagement with learning objectives embedded in dialogue nodes
 * Supports Kolb's Learning Cycle and evidence-based assessment
 */

import { z } from 'zod'
import { safeStorage } from './safe-storage'

export interface LearningObjective {
  id: string
  title: string
  description: string
  category: 'skill' | 'career' | 'identity' | 'relationship' | 'decision' | 'meta'
  relatedSkills: string[] // WEF 2030 skills
  relatedPatterns?: ('analytical' | 'helping' | 'building' | 'patience' | 'exploring')[]
  nodeId: string // Dialogue node where this objective is addressed
  choiceId?: string // Specific choice that addresses this objective
}

// Diamond Safe Schemas
const LearningObjectiveEngagementSchema = z.object({
  objectiveId: z.string(),
  nodeId: z.string(),
  choiceId: z.string().optional(),
  engagedAt: z.number(),
  engagementType: z.enum(['viewed', 'chose', 'completed']),
  relatedSkills: z.array(z.string()),
  relatedPatterns: z.array(z.string()).optional()
})

export type LearningObjectiveEngagement = z.infer<typeof LearningObjectiveEngagementSchema>

export class LearningObjectivesTracker {
  private engagements: LearningObjectiveEngagement[] = []
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    this.loadFromStorage()
  }

  /**
   * Record engagement with a learning objective
   */
  recordEngagement(
    objectiveId: string,
    nodeId: string,
    engagementType: 'viewed' | 'chose' | 'completed',
    choiceId?: string,
    relatedSkills: string[] = [],
    relatedPatterns?: string[]
  ): void {
    const engagement: LearningObjectiveEngagement = {
      objectiveId,
      nodeId,
      choiceId,
      engagedAt: Date.now(),
      engagementType,
      relatedSkills,
      relatedPatterns
    }

    this.engagements.push(engagement)
    this.saveToStorage()
  }

  /**
   * Get all engagements for a specific objective
   */
  getEngagementsForObjective(objectiveId: string): LearningObjectiveEngagement[] {
    return this.engagements.filter(e => e.objectiveId === objectiveId)
  }

  /**
   * Get all objectives engaged with
   */
  getEngagedObjectives(): Set<string> {
    return new Set(this.engagements.map(e => e.objectiveId))
  }

  /**
   * Get engagement summary for a character arc
   */
  getArcEngagementSummary(characterArc: 'maya' | 'devon' | 'jordan'): {
    objectivesEngaged: number
    totalEngagements: number
    uniqueSkills: string[]
    dominantPatterns: string[]
  } {
    const arcNodeIds = new Set(
      this.engagements
        .filter(e => e.nodeId.startsWith(characterArc))
        .map(e => e.nodeId)
    )

    const arcEngagements = this.engagements.filter(e => arcNodeIds.has(e.nodeId))
    const uniqueSkills = new Set<string>()
    const patternCounts: Record<string, number> = {}

    arcEngagements.forEach(e => {
      e.relatedSkills.forEach(skill => uniqueSkills.add(skill))
      e.relatedPatterns?.forEach(pattern => {
        patternCounts[pattern] = (patternCounts[pattern] || 0) + 1
      })
    })

    const dominantPatterns = Object.entries(patternCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([pattern]) => pattern)

    return {
      objectivesEngaged: new Set(arcEngagements.map(e => e.objectiveId)).size,
      totalEngagements: arcEngagements.length,
      uniqueSkills: Array.from(uniqueSkills),
      dominantPatterns
    }
  }

  /**
   * Get all engagements
   */
  getAllEngagements(): LearningObjectiveEngagement[] {
    return [...this.engagements]
  }

  /**
   * Clear all data (for testing/reset)
   */
  clearAllData(): void {
    this.engagements = []
    this.saveToStorage()
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): boolean {
    if (typeof window === 'undefined') return false

    try {
      const key = `learning_objectives_${this.userId}`
      safeStorage.setItem(key, JSON.stringify(this.engagements))
      return true
    } catch (error) {
      console.error('[LearningObjectivesTracker] Failed to save:', error)
      return false
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const key = `learning_objectives_${this.userId}`
      const validatedEngagements = safeStorage.getValidatedItem(
        key,
        z.array(LearningObjectiveEngagementSchema)
      )
      if (validatedEngagements) {
        this.engagements = validatedEngagements
      } else {
        this.engagements = []
      }
    } catch (error) {
      console.error('[LearningObjectivesTracker] Failed to load:', error)
      this.engagements = []
    }
  }

  /**
   * Export engagements for dashboard
   */
  exportEngagements(): LearningObjectiveEngagement[] {
    return [...this.engagements]
  }
}

/**
 * Get learning objectives tracker instance for a user
 */
const trackerInstances: Map<string, LearningObjectivesTracker> = new Map()

export function getLearningObjectivesTracker(userId: string): LearningObjectivesTracker {
  if (!trackerInstances.has(userId)) {
    trackerInstances.set(userId, new LearningObjectivesTracker(userId))
  }
  return trackerInstances.get(userId)!
}

