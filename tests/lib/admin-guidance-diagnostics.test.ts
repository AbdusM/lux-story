import { describe, expect, it } from 'vitest'

import { buildAdminGuidanceDiagnostics } from '@/lib/guidance/admin-diagnostics'
import { applyGuidanceEvent, buildGuidanceSnapshot, createEmptyGuidanceRecord } from '@/lib/guidance/engine'
import { mergePlanWithGuidanceRecord } from '@/lib/guidance/storage'

describe('buildAdminGuidanceDiagnostics', () => {
  it('summarizes record, snapshot, and guidance telemetry', () => {
    const baseRecord = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')
    const attemptedRecord = applyGuidanceEvent(baseRecord, {
      taskId: 'review_career_matches',
      kind: 'started',
      assistMode: 'augmented',
      at: '2026-03-07T12:01:00.000Z',
    })
    const stalledRecord = applyGuidanceEvent(attemptedRecord, {
      taskId: 'review_career_matches',
      kind: 'started',
      assistMode: 'augmented',
      at: '2026-03-07T12:01:30.000Z',
    })
    const completedRecord = applyGuidanceEvent(stalledRecord, {
      taskId: 'review_journey_artifacts',
      kind: 'completed',
      assistMode: 'manual',
      at: '2026-03-07T12:02:00.000Z',
    })

    const snapshot = buildGuidanceSnapshot(
      {
        playerId: 'player_123',
        totalDemonstrations: 8,
        skillCount: 8,
        careerMatchCount: 3,
        nearReadyCareerCount: 1,
        unlockedOpportunityCount: 2,
        openReturnsCount: 1,
        hasJourneySave: true,
        currentCharacterLabel: 'Maya',
        dominantPatternLabel: 'Analyzer',
        taskProgress: completedRecord.taskProgress,
        nowIso: '2026-03-07T12:02:00.000Z',
      },
      completedRecord,
    )

    const plan = mergePlanWithGuidanceRecord({}, completedRecord, snapshot)
    const diagnostics = buildAdminGuidanceDiagnostics({
      plan,
      interactionEvents: [
        {
          event_type: 'recommendation_shown',
          occurred_at: '2026-03-07T12:02:10.000Z',
          payload: {
            task_id: snapshot.nextBestMove?.taskId ?? 'review_career_matches',
            source_surface: 'careers',
          },
        },
        {
          event_type: 'recommendation_clicked',
          occurred_at: '2026-03-07T12:02:15.000Z',
          payload: {
            task_id: snapshot.nextBestMove?.taskId ?? 'review_career_matches',
            source_surface: 'careers',
          },
        },
        {
          event_type: 'task_completed',
          occurred_at: '2026-03-07T12:02:30.000Z',
          payload: {
            task_id: 'review_journey_artifacts',
            source_surface: 'profile',
          },
        },
      ],
    })

    expect(diagnostics.experimentVariant).toBe('adaptive')
    expect(diagnostics.eventCounts.recommendationShown).toBe(1)
    expect(diagnostics.eventCounts.recommendationClicked).toBe(1)
    expect(diagnostics.eventCounts.taskCompleted).toBe(1)
    expect(diagnostics.completedTasks[0]?.taskId).toBe('review_journey_artifacts')
    expect(diagnostics.stalledTasks[0]?.taskId).toBe('review_career_matches')
    expect(diagnostics.currentRecommendation?.taskId).toBe(snapshot.nextBestMove?.taskId ?? null)
    expect(diagnostics.recentEvents[0]?.eventType).toBe('task_completed')
  })

  it('hides the latent next move for control cohorts', () => {
    const controlRecord = createEmptyGuidanceRecord('control', '2026-03-07T12:00:00.000Z')
    const controlSnapshot = buildGuidanceSnapshot(
      {
        playerId: 'player_control',
        totalDemonstrations: 6,
        skillCount: 6,
        careerMatchCount: 2,
        nearReadyCareerCount: 1,
        unlockedOpportunityCount: 1,
        openReturnsCount: 1,
        hasJourneySave: true,
        currentCharacterLabel: 'Noor',
        dominantPatternLabel: 'Builder',
        taskProgress: controlRecord.taskProgress,
        nowIso: '2026-03-07T12:00:00.000Z',
      },
      controlRecord,
    )

    const diagnostics = buildAdminGuidanceDiagnostics({
      plan: mergePlanWithGuidanceRecord({}, controlRecord, controlSnapshot),
      interactionEvents: [],
    })

    expect(controlSnapshot.nextBestMove).not.toBeNull()
    expect(diagnostics.experimentVariant).toBe('control')
    expect(diagnostics.currentRecommendation).toBeNull()
  })
})
