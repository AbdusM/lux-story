/**
 * Zod Schemas for Sync Queue Validation
 *
 * Provides runtime validation for queued actions to ensure
 * data integrity during offline-first sync operations.
 */

import { z } from 'zod'

// ============================================================================
// ACTION TYPE SCHEMAS
// ============================================================================

export const ActionTypeSchema = z.enum([
  'db_method',
  'career_analytics',
  'skill_summary',
  'skill_demonstration',
  'career_exploration',
  'pattern_demonstration',
  'relationship_progress',
  'platform_state',
  'interaction_event'
])

// ============================================================================
// ACTION-SPECIFIC DATA SCHEMAS
// ============================================================================

export const CareerAnalyticsDataSchema = z.object({
  user_id: z.string().min(1),
  platforms_explored: z.array(z.string()).optional(),
  career_interests: z.array(z.string()).optional(),
  choices_made: z.number().int().min(0).optional(),
  time_spent_seconds: z.number().min(0).optional(),
  sections_viewed: z.array(z.string()).optional(),
  birmingham_opportunities: z.array(z.string()).optional()
})

export const SkillSummaryDataSchema = z.object({
  user_id: z.string().min(1),
  skill_name: z.string().min(1),
  demonstration_count: z.number().int().min(0),
  latest_context: z.string(),
  scenes_involved: z.array(z.string()),
  scene_descriptions: z.array(z.string()).optional(),
  last_demonstrated: z.string().optional()
})

export const SkillDemonstrationDataSchema = z.object({
  user_id: z.string().min(1),
  skill_name: z.string().min(1),
  scene_id: z.string().min(1),
  scene_description: z.string().optional(),
  choice_text: z.string().min(1),
  context: z.string(),
  demonstrated_at: z.string().optional()
})

export const CareerExplorationDataSchema = z.object({
  user_id: z.string().min(1),
  career_name: z.string().min(1),
  match_score: z.number().min(0).max(100),
  readiness_level: z.enum(['exploratory', 'emerging', 'near_ready', 'ready']),
  local_opportunities: z.array(z.string()),
  education_paths: z.array(z.string()),
  explored_at: z.string().optional()
})

export const PatternDemonstrationDataSchema = z.object({
  user_id: z.string().min(1),
  pattern_name: z.string().min(1),
  choice_id: z.string().min(1),
  choice_text: z.string().min(1),
  scene_id: z.string().min(1),
  character_id: z.string().min(1),
  context: z.string(),
  demonstrated_at: z.string().optional()
})

export const RelationshipProgressDataSchema = z.object({
  user_id: z.string().min(1),
  character_name: z.string().min(1),
  trust_level: z.number().min(0).max(10),
  relationship_status: z.enum(['stranger', 'acquaintance', 'confidant']),
  last_interaction: z.string().optional(),
  interaction_count: z.number().int().min(0).optional()
})

export const PlatformStateDataSchema = z.object({
  user_id: z.string().min(1),
  current_scene: z.string().optional(),
  global_flags: z.array(z.string()).optional(),
  patterns: z.object({
    analytical: z.number().min(0).max(1),
    helping: z.number().min(0).max(1),
    building: z.number().min(0).max(1),
    patience: z.number().min(0).max(1),
    exploring: z.number().min(0).max(1)
  }).optional(),
  updated_at: z.string().optional()
})

export const InteractionEventDataSchema = z.object({
  user_id: z.string().min(1),
  session_id: z.string().min(1),
  event_type: z.string().min(1),
  node_id: z.string().optional(),
  character_id: z.string().optional(),
  ordering_variant: z.string().optional(),
  ordering_seed: z.string().optional(),
  payload: z.record(z.string(), z.unknown()),
  occurred_at: z.string().optional()
})

// ============================================================================
// QUEUED ACTION SCHEMA
// ============================================================================

/**
 * Base schema for all queued actions
 * Note: id is any non-empty string (not strictly UUID) for backward compatibility
 */
export const QueuedActionBaseSchema = z.object({
  id: z.string().min(1),
  type: ActionTypeSchema,
  timestamp: z.number().int().min(0),
  retries: z.number().int().min(0)
})

/**
 * Full QueuedAction schema with optional fields
 */
export const QueuedActionSchema = QueuedActionBaseSchema.extend({
  method: z.string().optional(),
  args: z.array(z.unknown()).optional(),
  data: z.record(z.string(), z.unknown()).optional()
})

/**
 * Discriminated union for type-safe action handling
 * This ensures the `data` field matches the `type` field
 */
export const TypedQueuedActionSchema = z.discriminatedUnion('type', [
  QueuedActionBaseSchema.extend({
    type: z.literal('db_method'),
    method: z.string(),
    args: z.array(z.unknown())
  }),
  QueuedActionBaseSchema.extend({
    type: z.literal('career_analytics'),
    data: CareerAnalyticsDataSchema
  }),
  QueuedActionBaseSchema.extend({
    type: z.literal('skill_summary'),
    data: SkillSummaryDataSchema
  }),
  QueuedActionBaseSchema.extend({
    type: z.literal('skill_demonstration'),
    data: SkillDemonstrationDataSchema
  }),
  QueuedActionBaseSchema.extend({
    type: z.literal('career_exploration'),
    data: CareerExplorationDataSchema
  }),
  QueuedActionBaseSchema.extend({
    type: z.literal('pattern_demonstration'),
    data: PatternDemonstrationDataSchema
  }),
  QueuedActionBaseSchema.extend({
    type: z.literal('relationship_progress'),
    data: RelationshipProgressDataSchema
  }),
  QueuedActionBaseSchema.extend({
    type: z.literal('platform_state'),
    data: PlatformStateDataSchema
  }),
  QueuedActionBaseSchema.extend({
    type: z.literal('interaction_event'),
    data: InteractionEventDataSchema
  })
])

/**
 * Schema for the entire sync queue (array of actions)
 */
export const SyncQueueSchema = z.array(QueuedActionSchema)

// ============================================================================
// RESULT SCHEMAS
// ============================================================================

export const SyncResultSchema = z.object({
  success: z.boolean(),
  processed: z.number().int().min(0),
  failed: z.number().int().min(0)
})

export const QueueStatsSchema = z.object({
  totalActions: z.number().int().min(0),
  oldestAction: z.number().nullable(),
  newestAction: z.number().nullable(),
  actionsByMethod: z.record(z.string(), z.number()),
  averageRetries: z.number().min(0)
})

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ActionType = z.infer<typeof ActionTypeSchema>
export type CareerAnalyticsData = z.infer<typeof CareerAnalyticsDataSchema>
export type SkillSummaryData = z.infer<typeof SkillSummaryDataSchema>
export type SkillDemonstrationData = z.infer<typeof SkillDemonstrationDataSchema>
export type CareerExplorationData = z.infer<typeof CareerExplorationDataSchema>
export type PatternDemonstrationData = z.infer<typeof PatternDemonstrationDataSchema>
export type RelationshipProgressData = z.infer<typeof RelationshipProgressDataSchema>
export type PlatformStateData = z.infer<typeof PlatformStateDataSchema>
export type InteractionEventData = z.infer<typeof InteractionEventDataSchema>
export type QueuedAction = z.infer<typeof QueuedActionSchema>
export type TypedQueuedAction = z.infer<typeof TypedQueuedActionSchema>
export type SyncResult = z.infer<typeof SyncResultSchema>
export type QueueStats = z.infer<typeof QueueStatsSchema>

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Safely parse and validate a sync queue from a JSON string
 * Returns empty array if parsing fails or validation fails
 */
export function parseSyncQueue(jsonString: string | null): QueuedAction[] {
  if (!jsonString) return []

  try {
    const parsed = JSON.parse(jsonString)

    // Handle non-array values
    if (!Array.isArray(parsed)) {
      console.warn('[Schema] Sync queue is not an array')
      return []
    }

    // Validate each action individually to preserve valid ones
    const validActions: QueuedAction[] = []
    for (const action of parsed) {
      const result = QueuedActionSchema.safeParse(action)
      if (result.success) {
        validActions.push(result.data)
      } else {
        console.warn('[Schema] Invalid queued action:', result.error.issues)
      }
    }

    return validActions
  } catch (error) {
    console.warn('[Schema] Failed to parse sync queue:', error)
    return []
  }
}

/**
 * Validate a single queued action
 */
export function validateQueuedAction(action: unknown): QueuedAction | null {
  const result = QueuedActionSchema.safeParse(action)

  if (!result.success) {
    console.warn('[Schema] Invalid queued action:', result.error.issues)
    return null
  }

  return result.data
}

/**
 * Validate a typed queued action (strict type checking)
 */
export function validateTypedQueuedAction(action: unknown): TypedQueuedAction | null {
  const result = TypedQueuedActionSchema.safeParse(action)

  if (!result.success) {
    console.warn('[Schema] Invalid typed queued action:', result.error.issues)
    return null
  }

  return result.data
}
