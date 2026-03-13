import { buildAdminStudentInsightsWorklist } from '@/lib/telemetry/admin-student-insights-worklist'
import {
  STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
  STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
  STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
  STUDENT_INSIGHTS_OUTCOME_CHECK_IN_TASK_ID,
  STUDENT_INSIGHTS_OUTCOME_SCHEMA_VERSION,
} from '@/lib/telemetry/student-insights-constants'
import { describe, expect, it } from 'vitest'

describe('admin student insights worklist', () => {
  it('flags learners who need review and follow-up', () => {
    const summary = buildAdminStudentInsightsWorklist({
      days: 30,
      limit: 10,
      interactionEvents: [
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
          user_id: 'player_2',
          event_type: 'task_completed',
          occurred_at: '2026-03-13T00:04:00.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
            task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
          },
        },
        {
          user_id: 'player_2',
          event_type: 'outcome_checkin_submitted',
          occurred_at: '2026-03-13T00:06:00.000Z',
          payload: {
            source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
            task_id: STUDENT_INSIGHTS_OUTCOME_CHECK_IN_TASK_ID,
            guidance_schema_version: STUDENT_INSIGHTS_OUTCOME_SCHEMA_VERSION,
          },
        },
      ],
      profiles: [
        { userId: 'player_1', fullName: 'Amina Carter', email: 'amina@example.com' },
        { userId: 'player_2', fullName: 'Jordan Price', email: 'jordan@example.com' },
      ],
      plans: [
        {
          userId: 'player_1',
          updatedAt: '2026-03-13T00:05:00.000Z',
          plan: {
            updatedAt: '2026-03-13T00:05:00.000Z',
          },
        },
        {
          userId: 'player_2',
          updatedAt: '2026-03-13T00:06:00.000Z',
          plan: {
            updatedAt: '2026-03-13T00:06:00.000Z',
            advisorReview: {
              status: 'approved',
              feedback: 'Ready to use.',
              updatedAt: '2026-03-13T00:06:30.000Z',
            },
            outcomeCheckIn: {
              applicationsSubmitted30d: 8,
              interviewsSecured30d: 0,
              firstInterviewBooked: false,
              updatedAt: '2026-03-13T00:06:00.000Z',
            },
            followUpStatus: {
              status: 'follow_up_due',
              updatedAt: '2026-03-13T00:07:00.000Z',
              note: 'Call after portfolio revision.',
              updatedBy: {
                userId: 'admin_2',
                email: 'advisor@example.com',
                fullName: 'Avery Advisor',
              },
            },
            followUpHistory: [
              {
                status: 'follow_up_due',
                updatedAt: '2026-03-13T00:07:00.000Z',
                note: 'Call after portfolio revision.',
                updatedBy: {
                  userId: 'admin_2',
                  email: 'advisor@example.com',
                  fullName: 'Avery Advisor',
                },
              },
              {
                status: 'contacted',
                updatedAt: '2026-03-12T00:07:00.000Z',
                note: 'Initial outreach complete.',
                updatedBy: {
                  userId: 'admin_1',
                  email: 'coach@example.com',
                  fullName: 'Chris Coach',
                },
              },
            ],
          },
        },
      ],
    })

    expect(summary.totalUsersConsidered).toBe(2)
    expect(summary.flaggedUsers).toBe(2)
    expect(summary.flags.needs_review).toBe(1)
    expect(summary.flags.needs_outcome_check_in).toBe(1)
    expect(summary.flags.high_effort_no_interview).toBe(1)
    expect(summary.flags.stalled_without_interview).toBe(1)
    expect(summary.outcomeSnapshot.reporters).toBe(1)
    expect(summary.outcomeSnapshot.averageApplicationsSubmitted30d).toBe(8)
    expect(summary.followUpSummary.untracked).toBe(1)
    expect(summary.followUpSummary.followUpDue).toBe(1)
    expect(summary.followUpSummary.resolved).toBe(0)

    expect(summary.items[0]?.userId).toBe('player_2')
    expect(summary.items[0]?.flags).toContain('high_effort_no_interview')
    expect(summary.items[0]?.followUpStatus).toBe('follow_up_due')
    expect(summary.items[0]?.followUpNote).toBe('Call after portfolio revision.')
    expect(summary.items[0]?.followUpUpdatedBy?.userId).toBe('admin_2')
    expect(summary.items[0]?.followUpHistory).toHaveLength(2)
    expect(summary.items[1]?.userId).toBe('player_1')
    expect(summary.items[1]?.flags).toContain('needs_review')
    expect(summary.items[1]?.flags).toContain('needs_outcome_check_in')
  })
})
