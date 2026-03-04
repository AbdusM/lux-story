import { describe, expect, it } from 'vitest'
import {
  collectUnreliableRecords,
  extractConflictIdsFromTags,
  extractRecordIdsFromTags,
  getConflictProgress,
  getReadyConflictClusters,
  verifyLoreConflict,
} from '@/lib/unreliable-narrator-system'
import type { ArchivistState } from '@/lib/lore-system'

function makeArchivistState(): ArchivistState {
  return {
    collectedRecords: new Set(),
    verifiedLore: new Set(),
    sensoryCalibration: {
      engineers: 0,
      syn_bio: 0,
      data_flow: 0,
      station_core: 0,
    },
  }
}

describe('unreliable narrator system', () => {
  it('extracts record and conflict ids from tags', () => {
    const tags = [
      'samuel_arc',
      'record:record_rohan_vibration_log',
      'record:record_samuel_letter_fragment',
      'verify-conflict:platform_seven_blackout',
    ]
    expect(extractRecordIdsFromTags(tags)).toEqual([
      'record_rohan_vibration_log',
      'record_samuel_letter_fragment',
    ])
    expect(extractConflictIdsFromTags(tags)).toEqual(['platform_seven_blackout'])
  })

  it('collects only known records and ignores duplicates', () => {
    const initial = makeArchivistState()
    const result = collectUnreliableRecords(initial, [
      'record_rohan_vibration_log',
      'record_rohan_vibration_log',
      'unknown_record',
    ])

    expect(result.newlyCollected).toHaveLength(1)
    expect(result.unknownRecordIds).toEqual(['unknown_record'])
    expect(result.nextState.collectedRecords.has('record_rohan_vibration_log')).toBe(true)
  })

  it('marks a conflict cluster ready when all required records are collected', () => {
    let state = makeArchivistState()
    state = collectUnreliableRecords(state, [
      'record_rohan_vibration_log',
      'record_devon_power_budget_trace',
      'record_elena_archive_gap',
      'record_samuel_quiet_hour_testimony',
    ]).nextState

    const ready = getReadyConflictClusters(state)
    expect(ready.some((cluster) => cluster.id === 'platform_seven_blackout')).toBe(true)
  })

  it('verifies a ready conflict and writes verified lore', () => {
    let state = makeArchivistState()
    state = collectUnreliableRecords(state, [
      'record_samuel_letter_fragment',
      'record_rohan_previous_visitor_note',
      'record_elena_dispatch_index',
      'record_maya_signature_timing',
    ]).nextState

    const verified = verifyLoreConflict(state, 'letter_sender_identity')
    expect(verified.success).toBe(true)
    expect(verified.cluster?.targetLoreId).toBe('lore_letter_sender_identity')
    expect(verified.nextState.verifiedLore.has('lore_letter_sender_identity')).toBe(true)
  })

  it('does not verify when records are missing', () => {
    const state = makeArchivistState()
    const result = verifyLoreConflict(state, 'platform_seven_blackout')
    expect(result.success).toBe(false)
    expect(result.reason?.startsWith('missing_records:')).toBe(true)
  })

  it('computes conflict progress with ready and verified status', () => {
    let state = makeArchivistState()
    state = collectUnreliableRecords(state, [
      'record_nadia_policy_model',
      'record_devon_recycler_constraints',
      'record_elena_tax_archive_redaction',
      'record_samuel_breathing_ward_memory',
    ]).nextState

    const progress = getConflictProgress(state, new Set(['lore_conflict_ready_oxygen_tax_origin']))
    const oxygen = progress.find((item) => item.cluster.id === 'oxygen_tax_origin')
    expect(oxygen).toBeDefined()
    expect(oxygen?.isReady).toBe(true)
    expect(oxygen?.isVerified).toBe(false)
    expect(oxygen?.collectedCount).toBe(4)
  })
})
