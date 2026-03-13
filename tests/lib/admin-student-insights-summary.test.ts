import { buildAdminStudentInsightsFunnelSummary } from '@/lib/telemetry/admin-student-insights-summary'
import {
  STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
  STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
  STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
  STUDENT_INSIGHTS_OUTCOME_CHECK_IN_TASK_ID,
  STUDENT_INSIGHTS_OUTCOME_SCHEMA_VERSION,
  STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
  STUDENT_INSIGHTS_SIGNAL_SURFACE,
  STUDENT_INSIGHTS_SIGNAL_TASK_ID,
} from '@/lib/telemetry/student-insights-constants'
import { describe, expect, it } from 'vitest'

describe('admin student insights funnel summary', () => {
  it('aggregates counts and rates by surface', () => {
    const summary = buildAdminStudentInsightsFunnelSummary({
      days: 30,
      eventLimit: 5000,
      truncated: false,
      interactionEvents: [
        {
          user_id: 'player_1',
          event_type: 'recommendation_shown',
          occurred_at: '2026-03-13T00:00:00.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_SIGNAL_SURFACE,
            task_id: STUDENT_INSIGHTS_SIGNAL_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_1',
          event_type: 'recommendation_clicked',
          occurred_at: '2026-03-13T00:01:00.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_SIGNAL_SURFACE,
            task_id: STUDENT_INSIGHTS_SIGNAL_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_1',
          event_type: 'task_exposed',
          occurred_at: '2026-03-13T00:02:00.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
            task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_1',
          event_type: 'assist_mode_selected',
          occurred_at: '2026-03-13T00:02:30.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
            task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_1',
          event_type: 'task_started',
          occurred_at: '2026-03-13T00:03:00.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
            task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_1',
          event_type: 'task_completed',
          occurred_at: '2026-03-13T00:04:00.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
            task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_1',
          event_type: 'artifact_exported',
          occurred_at: '2026-03-13T00:05:00.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
            task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_1',
          event_type: 'outcome_checkin_submitted',
          occurred_at: '2026-03-13T00:05:30.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
            task_id: STUDENT_INSIGHTS_OUTCOME_CHECK_IN_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_OUTCOME_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_2',
          event_type: 'recommendation_shown',
          occurred_at: '2026-03-13T00:06:00.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_SIGNAL_SURFACE,
            task_id: STUDENT_INSIGHTS_SIGNAL_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_SIGNALS_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_2',
          event_type: 'task_exposed',
          occurred_at: '2026-03-13T00:07:00.000Z',
          payload: { source_surface: 'other_surface' },
        },
        {
          user_id: 'player_2',
          event_type: 'choice_presented',
          occurred_at: '2026-03-13T00:08:00.000Z',
          payload: { source_surface: STUDENT_INSIGHTS_SIGNAL_SURFACE },
        },
      ],
    })

    const signalSurface = summary.surfaces.find((s) => s.surface === STUDENT_INSIGHTS_SIGNAL_SURFACE)
    const actionSurface = summary.surfaces.find((s) => s.surface === STUDENT_INSIGHTS_ACTION_PLAN_SURFACE)

    expect(signalSurface).toBeTruthy()
    expect(actionSurface).toBeTruthy()

    expect(summary.totals.uniqueUsers).toBe(2)
    expect(summary.totals.counts.recommendationShown).toBe(2)
    expect(summary.totals.counts.recommendationClicked).toBe(1)
    expect(summary.totals.rates.recommendationCtr).toBe(50)

    expect(summary.totals.counts.taskExposed).toBe(1)
    expect(summary.totals.counts.taskStarted).toBe(1)
    expect(summary.totals.counts.taskCompleted).toBe(1)
    expect(summary.totals.counts.artifactExported).toBe(1)
    expect(summary.totals.counts.outcomeCheckInSubmitted).toBe(1)
    expect(summary.totals.rates.startRate).toBe(100)
    expect(summary.totals.rates.completionRate).toBe(100)
    expect(summary.totals.rates.artifactExportRate).toBe(100)
    expect(summary.totals.rates.outcomeCheckInRate).toBe(100)
  })
})
