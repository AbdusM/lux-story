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

// ============================================================================
// Next.js 15 Dynamic Route Props
// ============================================================================

/**
 * Next.js 15 requires params to be Promise<T> in dynamic routes
 * Single base type - derive layout from it to prevent drift
 *
 * @see https://nextjs.org/docs/app/building-your-application/upgrading/version-15
 */
export type AdminUserParams = Promise<{ userId: string }>

export type AdminUserPageProps = {
  params: AdminUserParams
}

export type AdminUserLayoutProps = AdminUserPageProps & {
  children: React.ReactNode
}

/**
 * Helper to unwrap params with validation
 * Used by all admin pages with [userId] dynamic segment
 */
export async function getAdminUserId(params: AdminUserParams): Promise<string> {
  const { userId } = await params
  if (!userId || userId.trim() === '') {
    throw new Error('Invalid userId')
  }
  return userId
}
