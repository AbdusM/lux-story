import { describe, expect, it } from 'vitest'

import {
  applyGuidanceEvent,
  buildGuidanceSnapshot,
  createEmptyGuidanceRecord,
  mergeGuidanceRecords,
} from '@/lib/guidance/engine'
import type { GuidanceInput } from '@/lib/guidance/contracts'

function createInput(overrides: Partial<GuidanceInput> = {}): GuidanceInput {
  return {
    playerId: 'player-1',
    totalDemonstrations: 8,
    skillCount: 4,
    careerMatchCount: 3,
    nearReadyCareerCount: 1,
    unlockedOpportunityCount: 2,
    openReturnsCount: 1,
    hasJourneySave: true,
    currentCharacterLabel: 'Maya Chen',
    dominantPatternLabel: 'Helping',
    taskProgress: {},
    nowIso: '2026-03-07T12:00:00.000Z',
    ...overrides,
  }
}

describe('guidance engine', () => {
  it('recommends resuming the route first when returns are waiting', () => {
    const record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')
    const snapshot = buildGuidanceSnapshot(createInput(), record)

    expect(snapshot.nextBestMove?.taskId).toBe('resume_waiting_route')
    expect(snapshot.reachableTaskIds).toContain('review_career_matches')
  })

  it('moves a task into evidenced after completion and artifact export', () => {
    let record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')

    record = applyGuidanceEvent(record, {
      taskId: 'review_career_matches',
      kind: 'started',
      assistMode: 'manual',
      at: '2026-03-07T12:04:00.000Z',
    })
    record = applyGuidanceEvent(record, {
      taskId: 'review_career_matches',
      kind: 'completed',
      assistMode: 'manual',
      at: '2026-03-07T12:05:00.000Z',
    })
    record = applyGuidanceEvent(record, {
      taskId: 'review_career_matches',
      kind: 'artifact_exported',
      at: '2026-03-07T12:06:00.000Z',
    })

    const progress = record.taskProgress.review_career_matches
    const snapshot = buildGuidanceSnapshot(createInput({ taskProgress: record.taskProgress }), record)

    expect(progress.highestProgressState).toBe('evidenced')
    expect(snapshot.shadowArtifacts[0]?.taskId).toBe('review_career_matches')
  })

  it('treats viewed as exposure only and does not manufacture completion state', () => {
    let record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')

    record = applyGuidanceEvent(record, {
      taskId: 'review_opportunities',
      kind: 'viewed',
      assistMode: 'manual',
      at: '2026-03-07T12:01:00.000Z',
    })

    const progress = record.taskProgress.review_opportunities
    const snapshot = buildGuidanceSnapshot(
      createInput({ taskProgress: record.taskProgress }),
      record,
    )

    expect(progress.highestProgressState).toBe('exposed')
    expect(progress.completionCount).toBe(0)
    expect(progress.evidenceCount).toBe(0)
    expect(snapshot.shadowArtifacts).toHaveLength(0)
  })

  it('counts a started then completed task as one successful attempt', () => {
    let record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')

    record = applyGuidanceEvent(record, {
      taskId: 'review_career_matches',
      kind: 'started',
      assistMode: 'manual',
      at: '2026-03-07T12:01:00.000Z',
    })
    record = applyGuidanceEvent(record, {
      taskId: 'review_career_matches',
      kind: 'completed',
      assistMode: 'manual',
      at: '2026-03-07T12:02:00.000Z',
    })

    const progress = record.taskProgress.review_career_matches
    const snapshot = buildGuidanceSnapshot(
      createInput({ taskProgress: record.taskProgress }),
      record,
    )

    expect(progress.attemptCount).toBe(1)
    expect(progress.completionCount).toBe(1)
    expect(snapshot.dimensions.followThrough).toBe(100)
  })

  it('merges divergent task progress without dropping counters on the same task', () => {
    let localRecord = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')
    localRecord = applyGuidanceEvent(localRecord, {
      taskId: 'review_career_matches',
      kind: 'started',
      assistMode: 'augmented',
      at: '2026-03-07T12:01:00.000Z',
    })
    localRecord = applyGuidanceEvent(localRecord, {
      taskId: 'review_career_matches',
      kind: 'started',
      assistMode: 'augmented',
      at: '2026-03-07T12:03:00.000Z',
    })

    let remoteRecord = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')
    remoteRecord = applyGuidanceEvent(remoteRecord, {
      taskId: 'review_career_matches',
      kind: 'completed',
      assistMode: 'manual',
      at: '2026-03-07T12:02:00.000Z',
    })
    remoteRecord = applyGuidanceEvent(remoteRecord, {
      taskId: 'review_career_matches',
      kind: 'artifact_exported',
      at: '2026-03-07T12:02:30.000Z',
    })

    const merged = mergeGuidanceRecords(localRecord, remoteRecord)
    const progress = merged?.taskProgress.review_career_matches

    expect(progress?.attemptCount).toBe(2)
    expect(progress?.completionCount).toBe(1)
    expect(progress?.evidenceCount).toBe(1)
    expect(progress?.highestProgressState).toBe('evidenced')
  })

  it('suppresses a dismissed task until its cooldown passes', () => {
    let record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')
    record = applyGuidanceEvent(record, {
      taskId: 'resume_waiting_route',
      kind: 'dismissed',
      at: '2026-03-07T11:30:00.000Z',
    })

    const immediate = buildGuidanceSnapshot(createInput({ taskProgress: record.taskProgress }), record)
    expect(immediate.nextBestMove?.taskId).not.toBe('resume_waiting_route')

    const afterCooldown = buildGuidanceSnapshot(
      createInput({
        taskProgress: record.taskProgress,
        nowIso: '2026-03-08T08:30:00.000Z',
      }),
      record,
    )

    expect(afterCooldown.nextBestMove?.taskId).toBe('resume_waiting_route')
  })
})
