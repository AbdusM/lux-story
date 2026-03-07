import { describe, expect, it } from 'vitest'

import { buildAdminGuidanceCohortSummary } from '@/lib/guidance/cohort-summary'
import { applyGuidanceEvent, buildGuidanceSnapshot, createEmptyGuidanceRecord } from '@/lib/guidance/engine'
import { GUIDANCE_INTERNAL_VALIDATION_USER_ID } from '@/lib/guidance/internal-users'
import { mergePlanWithGuidanceRecord } from '@/lib/guidance/storage'

describe('buildAdminGuidanceCohortSummary', () => {
  it('aggregates control and adaptive cohorts separately', () => {
    const adaptiveRecord = applyGuidanceEvent(
      applyGuidanceEvent(
        createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z'),
        {
          taskId: 'review_career_matches',
          kind: 'started',
          assistMode: 'manual',
          at: '2026-03-07T12:01:00.000Z',
        },
      ),
      {
        taskId: 'review_career_matches',
        kind: 'completed',
        assistMode: 'manual',
        at: '2026-03-07T12:02:00.000Z',
      },
    )

    const adaptiveSnapshot = buildGuidanceSnapshot(
      {
        playerId: 'adaptive_user',
        totalDemonstrations: 8,
        skillCount: 6,
        careerMatchCount: 3,
        nearReadyCareerCount: 1,
        unlockedOpportunityCount: 2,
        openReturnsCount: 1,
        hasJourneySave: true,
        currentCharacterLabel: 'Maya',
        dominantPatternLabel: 'Builder',
        taskProgress: adaptiveRecord.taskProgress,
        nowIso: '2026-03-07T12:02:00.000Z',
      },
      adaptiveRecord,
    )

    const controlRecord = applyGuidanceEvent(
      createEmptyGuidanceRecord('control', '2026-03-07T12:00:00.000Z'),
      {
        taskId: 'resume_waiting_route',
        kind: 'dismissed',
        at: '2026-03-07T12:03:00.000Z',
      },
    )

    const controlSnapshot = buildGuidanceSnapshot(
      {
        playerId: 'control_user',
        totalDemonstrations: 5,
        skillCount: 4,
        careerMatchCount: 2,
        nearReadyCareerCount: 1,
        unlockedOpportunityCount: 1,
        openReturnsCount: 1,
        hasJourneySave: true,
        currentCharacterLabel: 'Noor',
        dominantPatternLabel: 'Helping',
        taskProgress: controlRecord.taskProgress,
        nowIso: '2026-03-07T12:03:00.000Z',
      },
      controlRecord,
    )

    const summary = buildAdminGuidanceCohortSummary({
      planRows: [
        {
          user_id: 'adaptive_user',
          plan_data: mergePlanWithGuidanceRecord({}, adaptiveRecord, adaptiveSnapshot),
        },
        {
          user_id: 'control_user',
          plan_data: mergePlanWithGuidanceRecord({}, controlRecord, controlSnapshot),
        },
      ],
      interactionEvents: [
        {
          user_id: 'adaptive_user',
          event_type: 'recommendation_shown',
          occurred_at: '2026-03-07T12:02:10.000Z',
          payload: { task_id: adaptiveSnapshot.nextBestMove?.taskId, source_surface: 'careers' },
        },
        {
          user_id: 'adaptive_user',
          event_type: 'recommendation_clicked',
          occurred_at: '2026-03-07T12:02:20.000Z',
          payload: { task_id: adaptiveSnapshot.nextBestMove?.taskId, source_surface: 'careers' },
        },
        {
          user_id: 'adaptive_user',
          event_type: 'task_completed',
          occurred_at: '2026-03-07T12:02:30.000Z',
          payload: { task_id: 'review_career_matches', source_surface: 'careers' },
        },
        {
          user_id: 'control_user',
          event_type: 'recommendation_shown',
          occurred_at: '2026-03-07T12:03:10.000Z',
          payload: { task_id: controlSnapshot.nextBestMove?.taskId, source_surface: 'opportunities' },
        },
        {
          user_id: 'control_user',
          event_type: 'recommendation_dismissed',
          occurred_at: '2026-03-07T12:03:20.000Z',
          payload: { task_id: 'resume_waiting_route', source_surface: 'opportunities' },
        },
      ],
      days: 30,
      userLimit: 200,
      generatedAt: '2026-03-07T13:00:00.000Z',
      rolloutConfig: {
        experimentId: 'adaptive_guidance_v1',
        assignmentVersion: '2026-03-v2-control',
        mode: 'experiment',
        adaptivePercentage: 50,
        controlPercentage: 50,
        weights: [50, 50],
        forcedVariant: null,
        isKillSwitchActive: false,
      },
    })

    expect(summary.totals.usersWithGuidance).toBe(2)
    expect(summary.totals.adaptiveUsers).toBe(1)
    expect(summary.totals.controlUsers).toBe(1)

    const adaptive = summary.cohorts.find((cohort) => cohort.cohort === 'adaptive')
    const control = summary.cohorts.find((cohort) => cohort.cohort === 'control')

    expect(adaptive).toMatchObject({
      userCount: 1,
      recommendationShown: 1,
      recommendationClicked: 1,
      taskCompleted: 1,
      ctr: 100,
      completionRate: 100,
    })
    expect(control).toMatchObject({
      userCount: 1,
      recommendationShown: 1,
      recommendationDismissed: 1,
      dismissRate: 100,
    })
    expect(summary.rollout.mode).toBe('experiment')
    expect(summary.metadata.truncated).toBe(false)
  })

  it('excludes internal validation users from cohort metrics by default', () => {
    const validationRecord = applyGuidanceEvent(
      applyGuidanceEvent(
        createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z'),
        {
          taskId: 'review_career_matches',
          kind: 'started',
          assistMode: 'manual',
          at: '2026-03-07T12:01:00.000Z',
        },
      ),
      {
        taskId: 'review_career_matches',
        kind: 'completed',
        assistMode: 'manual',
        at: '2026-03-07T12:02:00.000Z',
      },
    )

    const validationSnapshot = buildGuidanceSnapshot(
      {
        playerId: GUIDANCE_INTERNAL_VALIDATION_USER_ID,
        totalDemonstrations: 8,
        skillCount: 6,
        careerMatchCount: 3,
        nearReadyCareerCount: 1,
        unlockedOpportunityCount: 2,
        openReturnsCount: 1,
        hasJourneySave: true,
        currentCharacterLabel: 'Maya',
        dominantPatternLabel: 'Builder',
        taskProgress: validationRecord.taskProgress,
        nowIso: '2026-03-07T12:02:00.000Z',
      },
      validationRecord,
    )

    const defaultSummary = buildAdminGuidanceCohortSummary({
      planRows: [
        {
          user_id: GUIDANCE_INTERNAL_VALIDATION_USER_ID,
          plan_data: mergePlanWithGuidanceRecord({}, validationRecord, validationSnapshot),
        },
      ],
      interactionEvents: [
        {
          user_id: GUIDANCE_INTERNAL_VALIDATION_USER_ID,
          event_type: 'recommendation_shown',
          occurred_at: '2026-03-07T12:02:10.000Z',
          payload: { task_id: validationSnapshot.nextBestMove?.taskId, source_surface: 'careers' },
        },
      ],
      days: 30,
      userLimit: 200,
      generatedAt: '2026-03-07T13:00:00.000Z',
    })

    expect(defaultSummary.totals.usersWithGuidance).toBe(0)
    expect(defaultSummary.totals.adaptiveUsers).toBe(0)

    const includedSummary = buildAdminGuidanceCohortSummary({
      planRows: [
        {
          user_id: GUIDANCE_INTERNAL_VALIDATION_USER_ID,
          plan_data: mergePlanWithGuidanceRecord({}, validationRecord, validationSnapshot),
        },
      ],
      interactionEvents: [
        {
          user_id: GUIDANCE_INTERNAL_VALIDATION_USER_ID,
          event_type: 'recommendation_shown',
          occurred_at: '2026-03-07T12:02:10.000Z',
          payload: { task_id: validationSnapshot.nextBestMove?.taskId, source_surface: 'careers' },
        },
      ],
      days: 30,
      userLimit: 200,
      generatedAt: '2026-03-07T13:00:00.000Z',
      includeInternalUsers: true,
    })

    expect(includedSummary.totals.usersWithGuidance).toBe(1)
    expect(includedSummary.totals.adaptiveUsers).toBe(1)
  })
})
