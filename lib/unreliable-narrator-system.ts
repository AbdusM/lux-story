/**
 * Unreliable Narrator Runtime System
 *
 * Lightweight runtime loop:
 * 1) collect record fragments from tagged nodes
 * 2) detect when a conflicting cluster is "ready" for verification
 * 3) verify cluster on explicit verify-tag nodes and unlock lore truth
 */

import { ArchivistState, type UnreliableRecord } from './lore-system'

export const RECORD_TAG_PREFIX = 'record:'
export const VERIFY_CONFLICT_TAG_PREFIX = 'verify-conflict:'

export interface LoreConflictCluster {
  id: string
  name: string
  description: string
  targetLoreId: string
  requiredRecordIds: string[]
  readyFlag: string
  verificationFlag: string
  verificationNodeId: string
}

export const UNRELIABLE_RECORDS: UnreliableRecord[] = [
  {
    id: 'record_rohan_vibration_log',
    targetLoreId: 'lore_platform_seven_blackout_cause',
    sourceFaction: 'engineers',
    perspective: 'Rohan log: the wall at Pillar 4 resonates at 17Hz during Quiet Hour. This is mechanical, not mystical.',
    reliability: 0.62,
    mediaType: 'data_stream',
  },
  {
    id: 'record_elena_archive_gap',
    targetLoreId: 'lore_platform_seven_blackout_cause',
    sourceFaction: 'data_flow',
    perspective: 'Elena archive memo: all records around the Platform Seven event were redacted in contiguous 12-minute windows.',
    reliability: 0.74,
    mediaType: 'text_log',
  },
  {
    id: 'record_samuel_quiet_hour_testimony',
    targetLoreId: 'lore_platform_seven_blackout_cause',
    sourceFaction: 'station_core',
    perspective: 'Samuel testimony: some timelines are buffered when the station overloads. Platform Seven is where overflow waits.',
    reliability: 0.56,
    mediaType: 'audio_fragment',
  },
  {
    id: 'record_samuel_letter_fragment',
    targetLoreId: 'lore_letter_sender_identity',
    sourceFaction: 'station_core',
    perspective: 'Samuel letter-room note: one letter is written nightly for a traveler who has not yet arrived.',
    reliability: 0.68,
    mediaType: 'text_log',
  },
  {
    id: 'record_rohan_previous_visitor_note',
    targetLoreId: 'lore_letter_sender_identity',
    sourceFaction: 'engineers',
    perspective: 'Rohan note: there was a previous visitor path with the same signature traces, then the trace was scrubbed.',
    reliability: 0.49,
    mediaType: 'text_log',
  },
  {
    id: 'record_elena_dispatch_index',
    targetLoreId: 'lore_letter_sender_identity',
    sourceFaction: 'data_flow',
    perspective: 'Elena dispatch index shows outbound messages queued before sender identity is resolved.',
    reliability: 0.72,
    mediaType: 'data_stream',
  },
]

export const LORE_CONFLICT_CLUSTERS: LoreConflictCluster[] = [
  {
    id: 'platform_seven_blackout',
    name: 'Platform Seven Blackout',
    description: 'Three factions report incompatible causes for the same event at Platform Seven.',
    targetLoreId: 'lore_platform_seven_blackout_cause',
    requiredRecordIds: [
      'record_rohan_vibration_log',
      'record_elena_archive_gap',
      'record_samuel_quiet_hour_testimony',
    ],
    readyFlag: 'lore_conflict_ready_platform_seven_blackout',
    verificationFlag: 'lore_conflict_verified_platform_seven_blackout',
    verificationNodeId: 'samuel_station_truth',
  },
  {
    id: 'letter_sender_identity',
    name: 'Letter Sender Identity',
    description: 'Fragmentary records disagree on when and how the letter system chooses recipients.',
    targetLoreId: 'lore_letter_sender_identity',
    requiredRecordIds: [
      'record_samuel_letter_fragment',
      'record_rohan_previous_visitor_note',
      'record_elena_dispatch_index',
    ],
    readyFlag: 'lore_conflict_ready_letter_sender_identity',
    verificationFlag: 'lore_conflict_verified_letter_sender_identity',
    verificationNodeId: 'samuel_letter_reveal',
  },
]

const RECORD_BY_ID = new Map(UNRELIABLE_RECORDS.map((record) => [record.id, record]))
const CLUSTER_BY_ID = new Map(LORE_CONFLICT_CLUSTERS.map((cluster) => [cluster.id, cluster]))

export function extractRecordIdsFromTags(tags: string[] | undefined): string[] {
  if (!tags || tags.length === 0) return []
  return tags
    .filter((tag) => tag.startsWith(RECORD_TAG_PREFIX))
    .map((tag) => tag.slice(RECORD_TAG_PREFIX.length))
    .filter((id) => id.length > 0)
}

export function extractConflictIdsFromTags(tags: string[] | undefined): string[] {
  if (!tags || tags.length === 0) return []
  return tags
    .filter((tag) => tag.startsWith(VERIFY_CONFLICT_TAG_PREFIX))
    .map((tag) => tag.slice(VERIFY_CONFLICT_TAG_PREFIX.length))
    .filter((id) => id.length > 0)
}

export function collectUnreliableRecords(
  state: ArchivistState,
  recordIds: string[],
): {
  nextState: ArchivistState
  newlyCollected: UnreliableRecord[]
  unknownRecordIds: string[]
} {
  if (recordIds.length === 0) {
    return {
      nextState: state,
      newlyCollected: [],
      unknownRecordIds: [],
    }
  }

  const nextCollected = new Set(state.collectedRecords)
  const newlyCollected: UnreliableRecord[] = []
  const unknownRecordIds: string[] = []

  for (const recordId of recordIds) {
    const record = RECORD_BY_ID.get(recordId)
    if (!record) {
      unknownRecordIds.push(recordId)
      continue
    }
    if (!nextCollected.has(record.id)) {
      nextCollected.add(record.id)
      newlyCollected.push(record)
    }
  }

  const changed = newlyCollected.length > 0
  return {
    nextState: changed
      ? {
          ...state,
          collectedRecords: nextCollected,
        }
      : state,
    newlyCollected,
    unknownRecordIds,
  }
}

export function getReadyConflictClusters(state: ArchivistState): LoreConflictCluster[] {
  const ready: LoreConflictCluster[] = []
  for (const cluster of LORE_CONFLICT_CLUSTERS) {
    const hasAllRecords = cluster.requiredRecordIds.every((recordId) => state.collectedRecords.has(recordId))
    if (!hasAllRecords) continue
    if (state.verifiedLore.has(cluster.targetLoreId)) continue
    ready.push(cluster)
  }
  return ready
}

export function verifyLoreConflict(
  state: ArchivistState,
  conflictId: string,
): {
  success: boolean
  cluster?: LoreConflictCluster
  nextState: ArchivistState
  reason?: string
} {
  const cluster = CLUSTER_BY_ID.get(conflictId)
  if (!cluster) {
    return {
      success: false,
      nextState: state,
      reason: `unknown_conflict:${conflictId}`,
    }
  }

  const missingRecords = cluster.requiredRecordIds.filter((recordId) => !state.collectedRecords.has(recordId))
  if (missingRecords.length > 0) {
    return {
      success: false,
      cluster,
      nextState: state,
      reason: `missing_records:${missingRecords.join(',')}`,
    }
  }

  if (state.verifiedLore.has(cluster.targetLoreId)) {
    return {
      success: true,
      cluster,
      nextState: state,
      reason: 'already_verified',
    }
  }

  return {
    success: true,
    cluster,
    nextState: {
      ...state,
      verifiedLore: new Set([...state.verifiedLore, cluster.targetLoreId]),
    },
  }
}

export function getAllUnreliableRecordIds(): string[] {
  return UNRELIABLE_RECORDS.map((record) => record.id)
}

export function getAllConflictClusterIds(): string[] {
  return LORE_CONFLICT_CLUSTERS.map((cluster) => cluster.id)
}
