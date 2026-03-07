import { z } from 'zod'

export const GUIDANCE_SCHEMA_VERSION = '2026-03-v1'
export const GUIDANCE_ONTOLOGY_VERSION = '2026-03-v1'
export const GUIDANCE_RECOMMENDATION_VERSION = '2026-03-v1'
export const GUIDANCE_EXPERIMENT_ID = 'adaptive_guidance_v1'

export const GuidanceSurfaceSchema = z.enum([
  'careers',
  'opportunities',
  'profile',
  'insights',
  'resume',
])

export type GuidanceSurface = z.infer<typeof GuidanceSurfaceSchema>

export const ProgressStateSchema = z.enum([
  'unseen',
  'exposed',
  'attempted',
  'assisted',
  'completed',
  'repeated',
  'evidenced',
  'autonomous',
])

export type ProgressState = z.infer<typeof ProgressStateSchema>

export const AssistModeSchema = z.enum(['manual', 'augmented', 'delegated'])

export type AssistMode = z.infer<typeof AssistModeSchema>

export const GuidanceDestinationSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('none'),
  }),
  z.object({
    kind: z.literal('route'),
    href: z.string().min(1),
  }),
  z.object({
    kind: z.literal('tab'),
    tab: z.enum(['careers', 'opportunities']),
  }),
])

export type GuidanceDestination = z.infer<typeof GuidanceDestinationSchema>

export const GuidanceTaskProgressSchema = z.object({
  taskId: z.string().min(1),
  highestProgressState: ProgressStateSchema,
  latestAssistMode: AssistModeSchema.nullable(),
  attemptCount: z.number().int().nonnegative(),
  abandonCount: z.number().int().nonnegative(),
  completionCount: z.number().int().nonnegative(),
  evidenceCount: z.number().int().nonnegative(),
  lastTouchedAt: z.string().datetime(),
  lastCompletedAt: z.string().datetime().nullable().optional(),
  lastDismissedAt: z.string().datetime().nullable().optional(),
})

export type GuidanceTaskProgress = z.infer<typeof GuidanceTaskProgressSchema>

export const GuidanceDimensionsSchema = z.object({
  initiative: z.number().int().min(0).max(100),
  followThrough: z.number().int().min(0).max(100),
  assistedCompletion: z.number().int().min(0).max(100),
  independentCompletion: z.number().int().min(0).max(100),
  recoveryAfterFriction: z.number().int().min(0).max(100),
})

export type GuidanceDimensions = z.infer<typeof GuidanceDimensionsSchema>

export const GuidanceRecommendationSchema = z.object({
  taskId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  reason: z.string().min(1),
  ctaLabel: z.string().min(1),
  destination: GuidanceDestinationSchema,
  surface: GuidanceSurfaceSchema,
  score: z.number(),
})

export type GuidanceRecommendation = z.infer<typeof GuidanceRecommendationSchema>

export const ShadowArtifactSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  taskId: z.string().min(1),
  completedAt: z.string().datetime(),
  assistMode: AssistModeSchema.nullable(),
})

export type ShadowArtifact = z.infer<typeof ShadowArtifactSchema>

export const GuidanceSnapshotSchema = z.object({
  schemaVersion: z.string().min(1),
  ontologyVersion: z.string().min(1),
  recommendationVersion: z.string().min(1),
  experimentVariant: z.enum(['control', 'adaptive']),
  dimensions: GuidanceDimensionsSchema,
  nextBestMove: GuidanceRecommendationSchema.nullable(),
  missedDoors: z.array(GuidanceRecommendationSchema),
  shadowArtifacts: z.array(ShadowArtifactSchema),
  reachableTaskIds: z.array(z.string().min(1)),
  frictionFlags: z.array(z.string().min(1)),
})

export type GuidanceSnapshot = z.infer<typeof GuidanceSnapshotSchema>

export const GuidancePersistenceRecordSchema = z.object({
  schemaVersion: z.string().min(1),
  ontologyVersion: z.string().min(1),
  recommendationVersion: z.string().min(1),
  assignmentVersion: z.string().min(1).optional(),
  experimentVariant: z.enum(['control', 'adaptive']),
  taskProgress: z.record(z.string().min(1), GuidanceTaskProgressSchema),
  dismissedAtByTaskId: z.record(z.string().min(1), z.string().datetime()),
  updatedAt: z.string().datetime(),
})

export type GuidancePersistenceRecord = z.infer<typeof GuidancePersistenceRecordSchema>

// Guidance event invariants:
// - viewed: surface exposure only; never counts as success.
// - started: user initiated a meaningful attempt.
// - completed: explicit user success; should not manufacture extra attempts.
// - dismissed: user explicitly rejected the pinned recommendation for this session.
// - artifact_exported: evidence/export action tied to an already-real artifact.
export const GuidanceEventSchema = z.object({
  taskId: z.string().min(1),
  kind: z.enum([
    'viewed',
    'assist_mode_selected',
    'started',
    'completed',
    'dismissed',
    'artifact_exported',
  ]),
  assistMode: AssistModeSchema.nullable().optional(),
  at: z.string().datetime().optional(),
})

export type GuidanceEvent = z.infer<typeof GuidanceEventSchema>

export const GuidanceSessionStateSchema = z.object({
  sessionId: z.string().min(1),
  assignmentVersion: z.string().min(1),
  experimentVariant: z.enum(['control', 'adaptive']),
  pinnedTaskId: z.string().min(1).nullable(),
  status: z.enum(['active', 'dismissed', 'completed']),
  updatedAt: z.string().datetime(),
})

export type GuidanceSessionState = z.infer<typeof GuidanceSessionStateSchema>

export interface GuidanceInput {
  playerId: string
  totalDemonstrations: number
  skillCount: number
  careerMatchCount: number
  nearReadyCareerCount: number
  unlockedOpportunityCount: number
  openReturnsCount: number
  hasJourneySave: boolean
  currentCharacterLabel: string | null
  dominantPatternLabel: string | null
  taskProgress: Record<string, GuidanceTaskProgress>
  nowIso?: string
}

export type GuidanceTaskDefinition = {
  id: string
  title: string
  summary: string
  surface: GuidanceSurface
  capabilityId: string
  difficultyBand: 1 | 2 | 3
  adjacentTaskIds: string[]
  evidenceTemplate: string
  dismissCooldownHours: number
  isReachable: (input: GuidanceInput) => boolean
  getScore: (input: GuidanceInput, progress: GuidanceTaskProgress | null) => number
  getReason: (input: GuidanceInput) => string
  getCtaLabel: (input: GuidanceInput) => string
  getDestination: (input: GuidanceInput) => GuidanceDestination
}
