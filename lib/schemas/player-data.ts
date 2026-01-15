/**
 * Zod Schemas for Player Data Validation
 *
 * Provides runtime validation for localStorage data to prevent corruption
 * and ensure data integrity during sync operations.
 */

import { z } from 'zod'

// ============================================================================
// PRIMITIVE SCHEMAS
// ============================================================================

export const ResponseSpeedSchema = z.enum(['deliberate', 'moderate', 'quick', 'impulsive'])
export const StressResponseSchema = z.enum(['calm', 'adaptive', 'reactive', 'overwhelmed'])
export const SocialOrientationSchema = z.enum(['helper', 'collaborator', 'independent', 'observer'])
export const ProblemApproachSchema = z.enum(['analytical', 'creative', 'practical', 'intuitive'])
export const CommunicationStyleSchema = z.enum(['direct', 'thoughtful', 'expressive', 'reserved'])
export const ReadinessLevelSchema = z.enum(['exploratory', 'emerging', 'near_ready', 'ready'])
export const RelationshipStatusSchema = z.enum(['stranger', 'acquaintance', 'confidant'])

export const MilestoneTypeSchema = z.enum([
  'journey_start',
  'first_demonstration',
  'five_demonstrations',
  'ten_demonstrations',
  'fifteen_demonstrations',
  'character_trust_gained',
  'platform_discovered',
  'arc_completed'
])

export const PatternNameSchema = z.enum([
  'helping',
  'analyzing',
  'analytical', // Legacy name
  'building',
  'exploring',
  'patience',
  'rushing'
])

// ============================================================================
// COMPOUND SCHEMAS
// ============================================================================

export const BehavioralProfileSchema = z.object({
  responseSpeed: ResponseSpeedSchema.optional(),
  stressResponse: StressResponseSchema.optional(),
  socialOrientation: SocialOrientationSchema.optional(),
  problemApproach: ProblemApproachSchema.optional(),
  communicationStyle: CommunicationStyleSchema.optional(),
  culturalAlignment: z.number().min(0).max(1).optional(),
  totalChoices: z.number().int().min(0).optional(),
  avgResponseTimeMs: z.number().min(0).optional(),
  summaryText: z.string().optional(),
  updatedAt: z.string().optional()
})

export const SkillDemonstrationItemSchema = z.object({
  skill: z.string().min(1),
  scene: z.string().min(1),
  choice: z.string().min(1),
  context: z.string(),
  timestamp: z.string()
})

export const CareerExplorationItemSchema = z.object({
  name: z.string().min(1),
  matchScore: z.number().min(0).max(100),
  readiness: z.string(),
  localOpportunities: z.array(z.string()),
  educationPaths: z.array(z.string()),
  exploredAt: z.string()
})

// KeyMoments in localStorage are stored with string timestamps (JSON serialized)
// The interface in database-service.ts expects Date, but localStorage stores strings
// We validate as strings and let consumers handle conversion
export const KeyMomentSchema = z.object({
  scene: z.string(),
  choice: z.string(),
  timestamp: z.string() // Stored as ISO string in localStorage
})

export const RelationshipSchema = z.object({
  trust: z.number().min(0).max(10),
  lastInteraction: z.string(),
  keyMoments: z.array(KeyMomentSchema)
})

export const ChoiceHistoryItemSchema = z.object({
  sceneId: z.string(),
  choiceId: z.string(),
  choiceText: z.string(),
  chosenAt: z.string()
})

export const PatternValueSchema = z.object({
  value: z.number().min(0).max(1),
  demonstrationCount: z.number().int().min(0),
  updatedAt: z.string()
})

export const MilestoneItemSchema = z.object({
  milestoneType: z.string(),
  milestoneContext: z.string().optional(),
  reachedAt: z.string()
})

// ============================================================================
// MAIN LOCALSTORAGE SCHEMA
// ============================================================================

/**
 * Schema for LocalPlayerData stored in localStorage
 *
 * This is the main schema used to validate data retrieved from localStorage.
 * All fields are optional because:
 * 1. New users may have empty/partial data
 * 2. Data may be incrementally built up over time
 * 3. Migrations may add new fields
 */
export const LocalPlayerDataSchema = z.object({
  currentScene: z.string().optional(),
  totalDemonstrations: z.number().int().min(0).optional(),
  lastActivity: z.string().optional(),
  skillDemonstrations: z.array(SkillDemonstrationItemSchema).optional(),
  careerExplorations: z.array(CareerExplorationItemSchema).optional(),
  relationships: z.record(z.string(), RelationshipSchema).optional(),
  visitedScenes: z.array(z.string()).optional(),
  choiceHistory: z.array(ChoiceHistoryItemSchema).optional(),
  patterns: z.record(z.string(), PatternValueSchema).optional(),
  behavioralProfile: BehavioralProfileSchema.optional(),
  milestones: z.array(MilestoneItemSchema).optional()
}).passthrough() // Allow additional unknown fields for forward compatibility

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ResponseSpeed = z.infer<typeof ResponseSpeedSchema>
export type StressResponse = z.infer<typeof StressResponseSchema>
export type SocialOrientation = z.infer<typeof SocialOrientationSchema>
export type ProblemApproach = z.infer<typeof ProblemApproachSchema>
export type CommunicationStyle = z.infer<typeof CommunicationStyleSchema>
export type ReadinessLevel = z.infer<typeof ReadinessLevelSchema>
export type RelationshipStatus = z.infer<typeof RelationshipStatusSchema>
export type MilestoneType = z.infer<typeof MilestoneTypeSchema>
export type PatternName = z.infer<typeof PatternNameSchema>
export type BehavioralProfile = z.infer<typeof BehavioralProfileSchema>
export type SkillDemonstrationItem = z.infer<typeof SkillDemonstrationItemSchema>
export type CareerExplorationItem = z.infer<typeof CareerExplorationItemSchema>
export type KeyMoment = z.infer<typeof KeyMomentSchema>
export type Relationship = z.infer<typeof RelationshipSchema>
export type ChoiceHistoryItem = z.infer<typeof ChoiceHistoryItemSchema>
export type PatternValue = z.infer<typeof PatternValueSchema>
export type MilestoneItem = z.infer<typeof MilestoneItemSchema>
export type LocalPlayerData = z.infer<typeof LocalPlayerDataSchema>

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Safely parse and validate LocalPlayerData from a JSON string
 * Returns null if parsing fails or validation fails
 */
export function parseLocalPlayerData(jsonString: string | null): LocalPlayerData | null {
  if (!jsonString) return null

  try {
    const parsed = JSON.parse(jsonString)
    const result = LocalPlayerDataSchema.safeParse(parsed)

    if (!result.success) {
      console.warn('[Schema] Invalid LocalPlayerData:', result.error.issues)
      return null
    }

    return result.data
  } catch (error) {
    console.warn('[Schema] Failed to parse LocalPlayerData:', error)
    return null
  }
}

/**
 * Validate an existing object against LocalPlayerDataSchema
 * Returns the validated data or null if invalid
 */
export function validateLocalPlayerData(data: unknown): LocalPlayerData | null {
  const result = LocalPlayerDataSchema.safeParse(data)

  if (!result.success) {
    console.warn('[Schema] Invalid LocalPlayerData:', result.error.issues)
    return null
  }

  return result.data
}
