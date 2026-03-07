import { describe, expect, it } from 'vitest'

import {
  classifyGuidancePlan,
  isMissingColumnError,
  summarizeGuidanceCandidates,
} from '@/lib/guidance/backfill'
import {
  applyGuidanceEvent,
  buildGuidanceSnapshot,
  createEmptyGuidanceRecord,
} from '@/lib/guidance/engine'
import { mergePlanWithGuidanceRecord } from '@/lib/guidance/storage'

function createGuidancePlan() {
  let record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')
  record = applyGuidanceEvent(record, {
    taskId: 'review_career_matches',
    kind: 'started',
    assistMode: 'manual',
    at: '2026-03-07T12:05:00.000Z',
  })
  record = applyGuidanceEvent(record, {
    taskId: 'review_career_matches',
    kind: 'completed',
    assistMode: 'manual',
    at: '2026-03-07T12:06:00.000Z',
  })

  const snapshot = buildGuidanceSnapshot({
    playerId: 'player_123',
    totalDemonstrations: 7,
    skillCount: 5,
    careerMatchCount: 2,
    nearReadyCareerCount: 1,
    unlockedOpportunityCount: 2,
    openReturnsCount: 1,
    hasJourneySave: true,
    currentCharacterLabel: 'Noor',
    dominantPatternLabel: 'Builder',
    taskProgress: record.taskProgress,
    nowIso: '2026-03-07T12:10:00.000Z',
  }, record)

  return { record, snapshot }
}

describe('guidance backfill helpers', () => {
  it('returns null when a plan has no adaptive guidance envelope', () => {
    expect(classifyGuidancePlan({
      userId: 'player_123',
      source: 'user_action_plans',
      plan: { unrelated: true },
    })).toBeNull()
  })

  it('classifies a valid adaptive guidance envelope as migratable', () => {
    const { record, snapshot } = createGuidancePlan()
    const plan = mergePlanWithGuidanceRecord({ existing: 'value' }, record, snapshot)

    expect(classifyGuidancePlan({
      userId: 'player_123',
      source: 'user_action_plans',
      plan,
    })).toMatchObject({
      userId: 'player_123',
      source: 'user_action_plans',
      hasRecord: true,
      hasSnapshot: true,
      valid: true,
      reason: 'ok',
    })
  })

  it('marks record-only envelopes as missing snapshots', () => {
    const { record } = createGuidancePlan()
    const plan = mergePlanWithGuidanceRecord({}, record)

    expect(classifyGuidancePlan({
      userId: 'player_123',
      source: 'user_action_plans',
      plan,
    })).toMatchObject({
      hasRecord: true,
      hasSnapshot: false,
      valid: false,
      reason: 'missing_snapshot',
    })
  })

  it('marks empty adaptive envelopes as missing both record and snapshot', () => {
    expect(classifyGuidancePlan({
      userId: 'player_123',
      source: 'player_profiles.last_action_plan',
      plan: {
        adaptiveGuidance: {},
      },
    })).toMatchObject({
      hasRecord: false,
      hasSnapshot: false,
      valid: false,
      reason: 'missing_both',
    })
  })

  it('summarizes valid and invalid candidate counts by reason', () => {
    const { record, snapshot } = createGuidancePlan()
    const validPlan = mergePlanWithGuidanceRecord({}, record, snapshot)
    const recordOnlyPlan = mergePlanWithGuidanceRecord({}, record)

    const summary = summarizeGuidanceCandidates([
      classifyGuidancePlan({
        userId: 'player_valid',
        source: 'user_action_plans',
        plan: validPlan,
      })!,
      classifyGuidancePlan({
        userId: 'player_partial',
        source: 'user_action_plans',
        plan: recordOnlyPlan,
      })!,
      classifyGuidancePlan({
        userId: 'player_empty',
        source: 'player_profiles.last_action_plan',
        plan: { adaptiveGuidance: {} },
      })!,
    ])

    expect(summary).toEqual({
      total: 3,
      valid: 1,
      invalid: 2,
      invalidReasons: {
        missing_snapshot: 1,
        missing_both: 1,
      },
    })
  })

  it('detects missing-column database errors by code', () => {
    expect(isMissingColumnError({ code: '42703' })).toBe(true)
    expect(isMissingColumnError({ code: '42P01' })).toBe(false)
    expect(isMissingColumnError(null)).toBe(false)
  })
})
