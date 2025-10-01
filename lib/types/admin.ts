/**
 * Admin Dashboard Types
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * TypeScript interfaces for admin urgency triage system
 */

export interface UrgentStudent {
  // Player identity
  userId: string
  currentScene: string
  totalDemonstrations: number
  lastActivity: string

  // Urgency assessment (Glass Box Principle)
  urgencyScore: number
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  urgencyNarrative: string // THE CRITICAL PIECE - human-readable explanation

  // Contributing factor scores
  disengagementScore: number
  confusionScore: number
  stressScore: number
  isolationScore: number

  // Activity summary
  totalChoices: number
  uniqueScenesVisited: number
  totalSceneVisits: number

  // Pattern summary
  helpingPattern: number | null
  rushingPattern: number | null
  exploringPattern: number | null

  // Relationship summary
  relationshipsFormed: number
  avgTrustLevel: number | null

  // Milestone summary
  milestonesReached: number

  // Metadata
  lastCalculated: string | null
}

export interface UrgencyAPIResponse {
  students: UrgentStudent[]
  count: number
  timestamp: string
}

export interface RecalculationResponse {
  message: string
  playersProcessed: number
  timestamp: string
}

export type UrgencyLevel = 'all' | 'low' | 'medium' | 'high' | 'critical'
