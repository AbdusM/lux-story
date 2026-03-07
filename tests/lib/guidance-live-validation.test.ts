import { describe, expect, it } from 'vitest'

import {
  buildGuidanceValidationSeed,
  GUIDANCE_VALIDATION_USER_ID,
} from '@/lib/guidance/live-validation'

describe('guidance live validation seed', () => {
  it('builds a deterministic adaptive validation seed with completed, stalled, and dismissed tasks', () => {
    const seed = buildGuidanceValidationSeed({
      userId: GUIDANCE_VALIDATION_USER_ID,
      nowIso: '2026-03-07T16:00:00.000Z',
    })

    expect(seed.record.assignmentVersion).toBe('2026-03-v2-control')
    expect(seed.record.experimentVariant).toBe('adaptive')
    expect(seed.snapshot.experimentVariant).toBe('adaptive')
    expect(seed.snapshot.shadowArtifacts).toHaveLength(1)
    expect(seed.snapshot.frictionFlags).toEqual(
      expect.arrayContaining([
        'stalled:review_journey_artifacts',
        'dismissed:review_opportunities',
      ]),
    )
    expect(seed.expected.completedTaskIds).toEqual(['review_career_matches'])
    expect(seed.expected.stalledTaskIds).toEqual(['review_journey_artifacts'])
    expect(seed.expected.dismissedTaskIds).toEqual(['review_opportunities'])
    expect(seed.expected.eventCounts).toEqual({
      taskExposed: 3,
      recommendationShown: 1,
      recommendationClicked: 1,
      recommendationDismissed: 1,
      taskStarted: 3,
      taskCompleted: 1,
      artifactExported: 1,
      assistModeSelected: 1,
    })
    expect(seed.interactionEvents).toHaveLength(12)
    expect(seed.snapshot.nextBestMove?.taskId).toBe(seed.expected.recommendationTaskId)
  })
})
