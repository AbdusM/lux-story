import { describe, expect, it } from 'vitest'

import { createEmptyGuidanceRecord } from '@/lib/guidance/engine'
import { buildGuidanceSnapshot } from '@/lib/guidance/engine'
import {
  getGuidanceSessionStorageKey,
  getGuidanceStorageKey,
  extractGuidancePlanEnvelope,
  extractRemoteGuidanceSnapshot,
  loadLocalGuidanceRecord,
  loadGuidanceSessionState,
  saveGuidanceSessionState,
  mergePlanWithGuidanceRecord,
} from '@/lib/guidance/storage'

describe('guidance storage envelope', () => {
  it('persists and extracts record + snapshot together', () => {
    const record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')
    const snapshot = buildGuidanceSnapshot(
      {
        playerId: 'player_123',
        totalDemonstrations: 6,
        skillCount: 6,
        careerMatchCount: 2,
        nearReadyCareerCount: 1,
        unlockedOpportunityCount: 2,
        openReturnsCount: 1,
        hasJourneySave: true,
        currentCharacterLabel: 'Maya',
        dominantPatternLabel: 'Builder',
        taskProgress: record.taskProgress,
        nowIso: '2026-03-07T12:00:00.000Z',
      },
      record,
    )

    const mergedPlan = mergePlanWithGuidanceRecord(
      { preserveMe: { ok: true } },
      record,
      snapshot,
    )
    const envelope = extractGuidancePlanEnvelope(mergedPlan)

    expect(mergedPlan.preserveMe).toEqual({ ok: true })
    expect(envelope?.adaptiveGuidance?.record.updatedAt).toBe('2026-03-07T12:00:00.000Z')
    expect(extractRemoteGuidanceSnapshot(envelope)?.schemaVersion).toBe(snapshot.schemaVersion)
    expect(extractRemoteGuidanceSnapshot(envelope)?.experimentVariant).toBe('adaptive')
  })

  it('versions local and session storage keys by assignment version', () => {
    expect(getGuidanceStorageKey('player_123', '2026-03-v2-control')).toBe(
      'lux-guidance:2026-03-v2-control:player_123',
    )
    expect(getGuidanceSessionStorageKey('player_123', '2026-03-v2-control')).toBe(
      'lux-guidance-session:2026-03-v2-control:player_123',
    )
  })

  it('loads session pin state from versioned session storage', () => {
    const sessionState = {
      sessionId: 'guidance_session_1',
      assignmentVersion: '2026-03-v2-control',
      experimentVariant: 'adaptive' as const,
      pinnedTaskId: 'review_career_matches',
      status: 'active' as const,
      updatedAt: '2026-03-07T12:00:00.000Z',
    }

    saveGuidanceSessionState(
      'player_123',
      '2026-03-v2-control',
      sessionState,
    )

    expect(
      loadGuidanceSessionState('player_123', '2026-03-v2-control'),
    ).toEqual(sessionState)
  })

  it('does not load legacy local guidance residue across assignment versions', () => {
    window.localStorage.setItem(
      'lux-guidance:player_123',
      JSON.stringify(createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')),
    )

    expect(
      loadLocalGuidanceRecord('player_123', '2026-03-v2-control'),
    ).toBeNull()
  })
})
