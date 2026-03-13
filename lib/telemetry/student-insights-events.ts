import { processQueueDeferred, queueInteractionEventSync } from '@/lib/sync-queue'

import {
  STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
  STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
  STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
  STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
  STUDENT_INSIGHTS_SIGNAL_SURFACE,
  STUDENT_INSIGHTS_SIGNAL_TASK_ID,
} from '@/lib/telemetry/student-insights-constants'

export {
  STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
  STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
  STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
  STUDENT_INSIGHTS_SIGNAL_SURFACE,
} from '@/lib/telemetry/student-insights-constants'

type StudentInsightsEventType =
  | 'assist_mode_selected'
  | 'task_exposed'
  | 'task_started'
  | 'task_completed'
  | 'recommendation_shown'
  | 'recommendation_clicked'
  | 'artifact_exported'

function createTelemetryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `student-insights-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function queueStudentInsightsEvent(input: {
  userId: string
  sessionId: string
  eventType: StudentInsightsEventType
  payload: Record<string, unknown>
}) {
  queueInteractionEventSync({
    user_id: input.userId,
    session_id: input.sessionId,
    event_type: input.eventType,
    node_id: null,
    character_id: null,
    payload: {
      event_id: createTelemetryId(),
      ...input.payload,
    },
  })

  void processQueueDeferred()
}

export function trackStudentInsightsRecommendationShown(input: {
  userId: string
  sessionId: string
  recommendationVersion: string
  targetCareerId: string
  targetCareerName: string
  recommendedPosture: string
  observedExposureLevel: string
  entryFrictionLevel: string
}) {
  queueStudentInsightsEvent({
    userId: input.userId,
    sessionId: input.sessionId,
    eventType: 'recommendation_shown',
    payload: {
      task_id: STUDENT_INSIGHTS_SIGNAL_TASK_ID,
      source_surface: STUDENT_INSIGHTS_SIGNAL_SURFACE,
      guidance_schema_version: STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
      recommendation_version: input.recommendationVersion,
      reason: `recommended_posture:${input.recommendedPosture}`,
      target_career_id: input.targetCareerId,
      target_career_name: input.targetCareerName,
      recommended_posture: input.recommendedPosture,
      observed_exposure_level: input.observedExposureLevel,
      entry_friction_level: input.entryFrictionLevel,
    },
  })
}

export function trackStudentInsightsRecommendationClicked(input: {
  userId: string
  sessionId: string
  recommendationVersion: string
  targetCareerId: string
  action: 'jump_to_plan'
}) {
  queueStudentInsightsEvent({
    userId: input.userId,
    sessionId: input.sessionId,
    eventType: 'recommendation_clicked',
    payload: {
      task_id: STUDENT_INSIGHTS_SIGNAL_TASK_ID,
      source_surface: STUDENT_INSIGHTS_SIGNAL_SURFACE,
      guidance_schema_version: STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
      recommendation_version: input.recommendationVersion,
      reason: input.action,
      target_career_id: input.targetCareerId,
    },
  })
}

export function trackStudentInsightsActionPlanExposed(input: {
  userId: string
  sessionId: string
  targetCareerId: string | null
  posture: string
}) {
  queueStudentInsightsEvent({
    userId: input.userId,
    sessionId: input.sessionId,
    eventType: 'task_exposed',
    payload: {
      task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
      source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
      guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
      reason: input.targetCareerId ? `target:${input.targetCareerId}` : 'target:unknown',
      target_career_id: input.targetCareerId,
      posture: input.posture,
    },
  })
}

export function trackStudentInsightsActionPlanStarted(input: {
  userId: string
  sessionId: string
  posture: string
  proofKind: string
  action: 'use_suggested_draft'
}) {
  queueStudentInsightsEvent({
    userId: input.userId,
    sessionId: input.sessionId,
    eventType: 'task_started',
    payload: {
      task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
      source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
      assist_mode: 'manual',
      guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
      reason: input.action,
      posture: input.posture,
      proof_kind: input.proofKind,
    },
  })
}

export function trackStudentInsightsAssistModeSelected(input: {
  userId: string
  sessionId: string
  posture: string
  proofKind: string
  assistMode: 'manual' | 'augmented' | 'delegated'
}) {
  queueStudentInsightsEvent({
    userId: input.userId,
    sessionId: input.sessionId,
    eventType: 'assist_mode_selected',
    payload: {
      task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
      source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
      assist_mode: input.assistMode,
      guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
      posture: input.posture,
      proof_kind: input.proofKind,
      reason: 'action_plan_authoring_mode',
    },
  })
}

export function trackStudentInsightsActionPlanCompleted(input: {
  userId: string
  sessionId: string
  posture: string
  proofKind: string
  completedFieldCount: number
  hasProofText: boolean
}) {
  queueStudentInsightsEvent({
    userId: input.userId,
    sessionId: input.sessionId,
    eventType: 'task_completed',
    payload: {
      task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
      source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
      assist_mode: 'manual',
      guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
      posture: input.posture,
      proof_kind: input.proofKind,
      completed_field_count: input.completedFieldCount,
      has_proof_text: input.hasProofText,
    },
  })
}

export function trackStudentInsightsArtifactExported(input: {
  userId: string
  sessionId: string
  posture: string
  proofKind: string
}) {
  queueStudentInsightsEvent({
    userId: input.userId,
    sessionId: input.sessionId,
    eventType: 'artifact_exported',
    payload: {
      task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
      source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
      assist_mode: 'manual',
      guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
      reason: 'proof_copied_to_clipboard',
      posture: input.posture,
      proof_kind: input.proofKind,
    },
  })
}
