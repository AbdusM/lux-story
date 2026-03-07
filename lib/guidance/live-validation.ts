import {
  GUIDANCE_RECOMMENDATION_VERSION,
  GUIDANCE_SCHEMA_VERSION,
  type GuidancePersistenceRecord,
  type GuidanceSnapshot,
} from '@/lib/guidance/contracts'
import {
  applyGuidanceEvent,
  buildGuidanceSnapshot,
  createEmptyGuidanceRecord,
} from '@/lib/guidance/engine'
import { GUIDANCE_INTERNAL_VALIDATION_USER_ID } from '@/lib/guidance/internal-users'
import { GUIDANCE_ASSIGNMENT_VERSION } from '@/lib/guidance/rollout'
import { GUIDANCE_TASK_MAP } from '@/lib/guidance/task-registry'

export const GUIDANCE_VALIDATION_USER_ID = GUIDANCE_INTERNAL_VALIDATION_USER_ID
export const GUIDANCE_VALIDATION_SESSION_ID = 'guidance-validation-session-v1'

export type GuidanceValidationInteractionEvent = {
  user_id: string
  session_id: string
  event_type:
    | 'task_exposed'
    | 'assist_mode_selected'
    | 'task_started'
    | 'task_completed'
    | 'recommendation_shown'
    | 'recommendation_clicked'
    | 'recommendation_dismissed'
    | 'artifact_exported'
  node_id: string | null
  character_id: string | null
  ordering_variant: string | null
  ordering_seed: string | null
  payload: Record<string, unknown>
  occurred_at: string
}

export type GuidanceValidationSeed = {
  userId: string
  nowIso: string
  record: GuidancePersistenceRecord
  snapshot: GuidanceSnapshot
  playerProfile: {
    user_id: string
    current_scene: string
    total_demonstrations: number
    last_activity: string
    updated_at: string
    game_version: string
    platform: string
  }
  interactionEvents: GuidanceValidationInteractionEvent[]
  expected: {
    completedTaskIds: string[]
    stalledTaskIds: string[]
    dismissedTaskIds: string[]
    shadowArtifactCount: number
    recommendationTaskId: string | null
    eventCounts: {
      taskExposed: number
      recommendationShown: number
      recommendationClicked: number
      recommendationDismissed: number
      taskStarted: number
      taskCompleted: number
      artifactExported: number
      assistModeSelected: number
    }
  }
}

function shiftMinutes(baseIso: string, minutes: number): string {
  return new Date(new Date(baseIso).getTime() + minutes * 60_000).toISOString()
}

export function buildGuidanceValidationSeed(
  params: {
    userId?: string
    nowIso?: string
  } = {},
): GuidanceValidationSeed {
  const userId = params.userId ?? GUIDANCE_VALIDATION_USER_ID
  const nowIso = params.nowIso ?? new Date().toISOString()

  let record = createEmptyGuidanceRecord('adaptive', shiftMinutes(nowIso, -12))
  record.assignmentVersion = GUIDANCE_ASSIGNMENT_VERSION

  record = applyGuidanceEvent(record, {
    taskId: 'review_career_matches',
    kind: 'viewed',
    at: shiftMinutes(nowIso, -11),
  })
  record = applyGuidanceEvent(record, {
    taskId: 'review_career_matches',
    kind: 'started',
    assistMode: 'manual',
    at: shiftMinutes(nowIso, -10),
  })
  record = applyGuidanceEvent(record, {
    taskId: 'review_career_matches',
    kind: 'completed',
    assistMode: 'manual',
    at: shiftMinutes(nowIso, -9),
  })
  record = applyGuidanceEvent(record, {
    taskId: 'review_career_matches',
    kind: 'artifact_exported',
    assistMode: 'manual',
    at: shiftMinutes(nowIso, -8),
  })

  record = applyGuidanceEvent(record, {
    taskId: 'review_journey_artifacts',
    kind: 'viewed',
    at: shiftMinutes(nowIso, -7),
  })
  record = applyGuidanceEvent(record, {
    taskId: 'review_journey_artifacts',
    kind: 'assist_mode_selected',
    assistMode: 'augmented',
    at: shiftMinutes(nowIso, -6),
  })
  record = applyGuidanceEvent(record, {
    taskId: 'review_journey_artifacts',
    kind: 'started',
    assistMode: 'augmented',
    at: shiftMinutes(nowIso, -5),
  })
  record = applyGuidanceEvent(record, {
    taskId: 'review_journey_artifacts',
    kind: 'started',
    assistMode: 'augmented',
    at: shiftMinutes(nowIso, -4),
  })

  record = applyGuidanceEvent(record, {
    taskId: 'review_opportunities',
    kind: 'viewed',
    at: shiftMinutes(nowIso, -3),
  })
  record = applyGuidanceEvent(record, {
    taskId: 'review_opportunities',
    kind: 'dismissed',
    at: shiftMinutes(nowIso, -2),
  })

  const input = {
    playerId: userId,
    totalDemonstrations: 8,
    skillCount: 5,
    careerMatchCount: 2,
    nearReadyCareerCount: 1,
    unlockedOpportunityCount: 2,
    openReturnsCount: 1,
    hasJourneySave: true,
    currentCharacterLabel: 'Noor',
    dominantPatternLabel: 'Builder',
    taskProgress: record.taskProgress,
    nowIso,
  }

  const snapshot = buildGuidanceSnapshot(input, record)
  const recommendationTaskId = snapshot.nextBestMove?.taskId ?? null

  const interactionEvents: GuidanceValidationInteractionEvent[] = [
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'task_exposed',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-task-exposed-careers',
        task_id: 'review_career_matches',
        source_surface: 'careers',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -11),
    },
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'task_started',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-task-started-careers',
        task_id: 'review_career_matches',
        source_surface: 'careers',
        assist_mode: 'manual',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -10),
    },
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'task_completed',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-task-completed-careers',
        task_id: 'review_career_matches',
        source_surface: 'careers',
        assist_mode: 'manual',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -9),
    },
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'artifact_exported',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-artifact-exported-careers',
        task_id: 'review_career_matches',
        source_surface: 'profile',
        assist_mode: 'manual',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -8),
    },
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'task_exposed',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-task-exposed-profile',
        task_id: 'review_journey_artifacts',
        source_surface: 'profile',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -7),
    },
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'assist_mode_selected',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-assist-selected-profile',
        task_id: 'review_journey_artifacts',
        source_surface: 'profile',
        assist_mode: 'augmented',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -6),
    },
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'task_started',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-task-started-profile-1',
        task_id: 'review_journey_artifacts',
        source_surface: 'profile',
        assist_mode: 'augmented',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -5),
    },
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'task_started',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-task-started-profile-2',
        task_id: 'review_journey_artifacts',
        source_surface: 'profile',
        assist_mode: 'augmented',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -4),
    },
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'task_exposed',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-task-exposed-opportunities',
        task_id: 'review_opportunities',
        source_surface: 'opportunities',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -3),
    },
    {
      user_id: userId,
      session_id: GUIDANCE_VALIDATION_SESSION_ID,
      event_type: 'recommendation_dismissed',
      node_id: null,
      character_id: null,
      ordering_variant: null,
      ordering_seed: null,
      payload: {
        event_id: 'guidance-validation-recommendation-dismissed-opportunities',
        task_id: 'review_opportunities',
        source_surface: 'opportunities',
        guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
        recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
      },
      occurred_at: shiftMinutes(nowIso, -2),
    },
  ]

  if (recommendationTaskId) {
    const recommendationTask = GUIDANCE_TASK_MAP[recommendationTaskId]
    interactionEvents.push(
      {
        user_id: userId,
        session_id: GUIDANCE_VALIDATION_SESSION_ID,
        event_type: 'recommendation_shown',
        node_id: null,
        character_id: null,
        ordering_variant: null,
        ordering_seed: null,
        payload: {
          event_id: 'guidance-validation-recommendation-shown',
          task_id: recommendationTaskId,
          source_surface: recommendationTask.surface,
          reason: snapshot.nextBestMove?.reason ?? null,
          guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
          recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
        },
        occurred_at: shiftMinutes(nowIso, -1),
      },
      {
        user_id: userId,
        session_id: GUIDANCE_VALIDATION_SESSION_ID,
        event_type: 'recommendation_clicked',
        node_id: null,
        character_id: null,
        ordering_variant: null,
        ordering_seed: null,
        payload: {
          event_id: 'guidance-validation-recommendation-clicked',
          task_id: recommendationTaskId,
          source_surface: recommendationTask.surface,
          reason: snapshot.nextBestMove?.reason ?? null,
          guidance_schema_version: GUIDANCE_SCHEMA_VERSION,
          recommendation_version: GUIDANCE_RECOMMENDATION_VERSION,
        },
        occurred_at: nowIso,
      },
    )
  }

  return {
    userId,
    nowIso,
    record,
    snapshot,
    playerProfile: {
      user_id: userId,
      current_scene: 'guidance_validation_internal',
      total_demonstrations: input.totalDemonstrations,
      last_activity: nowIso,
      updated_at: nowIso,
      game_version: '2.3.1-guidance-validation',
      platform: 'internal_validation',
    },
    interactionEvents,
    expected: {
      completedTaskIds: ['review_career_matches'],
      stalledTaskIds: ['review_journey_artifacts'],
      dismissedTaskIds: ['review_opportunities'],
      shadowArtifactCount: 1,
      recommendationTaskId,
      eventCounts: {
        taskExposed: 3,
        recommendationShown: recommendationTaskId ? 1 : 0,
        recommendationClicked: recommendationTaskId ? 1 : 0,
        recommendationDismissed: 1,
        taskStarted: 3,
        taskCompleted: 1,
        artifactExported: 1,
        assistModeSelected: 1,
      },
    },
  }
}
