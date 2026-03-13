import {
  trackStudentInsightsAssistModeSelected,
  STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
  STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
  STUDENT_INSIGHTS_OUTCOME_SCHEMA_VERSION,
  STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
  STUDENT_INSIGHTS_SIGNAL_SURFACE,
  trackStudentInsightsActionPlanCompleted,
  trackStudentInsightsActionPlanExposed,
  trackStudentInsightsActionPlanStarted,
  trackStudentInsightsArtifactExported,
  trackStudentInsightsOutcomeCheckInSubmitted,
  trackStudentInsightsRecommendationClicked,
  trackStudentInsightsRecommendationShown,
} from '@/lib/telemetry/student-insights-events'
import { processQueueDeferred, queueInteractionEventSync } from '@/lib/sync-queue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/sync-queue', () => ({
  queueInteractionEventSync: vi.fn(),
  processQueueDeferred: vi.fn(() => Promise.resolve({ success: true, processed: 1, failed: 0 })),
}))

describe('student insights telemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('queues recommendation events for the signals surface', () => {
    trackStudentInsightsRecommendationShown({
      userId: 'player_123',
      sessionId: 'session_123',
      recommendationVersion: 'observed-exposure-v1|entry-friction-v1',
      targetCareerId: 'data-analyst-community',
      targetCareerName: 'Community Data Analyst',
      recommendedPosture: 'defend',
      observedExposureLevel: 'medium',
      entryFrictionLevel: 'high',
    })

    expect(queueInteractionEventSync).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'player_123',
        session_id: 'session_123',
        event_type: 'recommendation_shown',
        payload: expect.objectContaining({
          task_id: 'review_labor_market_signals',
          source_surface: STUDENT_INSIGHTS_SIGNAL_SURFACE,
          guidance_schema_version: STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
          recommendation_version: 'observed-exposure-v1|entry-friction-v1',
          recommended_posture: 'defend',
        }),
      }),
    )
    expect(processQueueDeferred).toHaveBeenCalledTimes(1)
  })

  it('queues action-plan funnel events with stable metadata', () => {
    trackStudentInsightsActionPlanExposed({
      userId: 'player_123',
      sessionId: 'session_123',
      targetCareerId: 'data-analyst-community',
      posture: 'balance',
    })
    trackStudentInsightsActionPlanStarted({
      userId: 'player_123',
      sessionId: 'session_123',
      posture: 'attack',
      proofKind: 'resume_bullets',
      action: 'use_suggested_draft',
    })
    trackStudentInsightsAssistModeSelected({
      userId: 'player_123',
      sessionId: 'session_123',
      posture: 'attack',
      proofKind: 'resume_bullets',
      assistMode: 'augmented',
    })
    trackStudentInsightsActionPlanCompleted({
      userId: 'player_123',
      sessionId: 'session_123',
      posture: 'attack',
      proofKind: 'one_pager',
      completedFieldCount: 6,
      hasProofText: true,
    })
    trackStudentInsightsArtifactExported({
      userId: 'player_123',
      sessionId: 'session_123',
      posture: 'attack',
      proofKind: 'one_pager',
    })
    trackStudentInsightsOutcomeCheckInSubmitted({
      userId: 'player_123',
      sessionId: 'session_123',
      posture: 'attack',
      applicationsSubmitted30d: 12,
      interviewsSecured30d: 2,
      firstInterviewBooked: true,
    })
    trackStudentInsightsRecommendationClicked({
      userId: 'player_123',
      sessionId: 'session_123',
      recommendationVersion: 'observed-exposure-v1|entry-friction-v1',
      targetCareerId: 'data-analyst-community',
      action: 'jump_to_plan',
    })

    expect(queueInteractionEventSync).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        event_type: 'task_exposed',
        payload: expect.objectContaining({
          task_id: 'build_action_plan',
          source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
          guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
          posture: 'balance',
        }),
      }),
    )
    expect(queueInteractionEventSync).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        event_type: 'task_started',
        payload: expect.objectContaining({
          assist_mode: 'manual',
          proof_kind: 'resume_bullets',
          posture: 'attack',
        }),
      }),
    )
    expect(queueInteractionEventSync).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        event_type: 'assist_mode_selected',
        payload: expect.objectContaining({
          assist_mode: 'augmented',
          reason: 'action_plan_authoring_mode',
        }),
      }),
    )
    expect(queueInteractionEventSync).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        event_type: 'task_completed',
        payload: expect.objectContaining({
          completed_field_count: 6,
          has_proof_text: true,
          proof_kind: 'one_pager',
        }),
      }),
    )
    expect(queueInteractionEventSync).toHaveBeenNthCalledWith(
      5,
      expect.objectContaining({
        event_type: 'artifact_exported',
        payload: expect.objectContaining({
          reason: 'proof_copied_to_clipboard',
          source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
        }),
      }),
    )
    expect(queueInteractionEventSync).toHaveBeenNthCalledWith(
      6,
      expect.objectContaining({
        event_type: 'outcome_checkin_submitted',
        payload: expect.objectContaining({
          task_id: 'report_outcome_check_in',
          source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
          guidance_schema_version: STUDENT_INSIGHTS_OUTCOME_SCHEMA_VERSION,
          applications_submitted_30d: 12,
          interviews_secured_30d: 2,
          first_interview_booked: true,
        }),
      }),
    )
    expect(queueInteractionEventSync).toHaveBeenNthCalledWith(
      7,
      expect.objectContaining({
        event_type: 'recommendation_clicked',
        payload: expect.objectContaining({
          task_id: 'review_labor_market_signals',
          source_surface: STUDENT_INSIGHTS_SIGNAL_SURFACE,
          reason: 'jump_to_plan',
        }),
      }),
    )
    expect(processQueueDeferred).toHaveBeenCalledTimes(7)
  })
})
