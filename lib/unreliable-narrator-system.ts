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
  perspectives: LoreConflictPerspective[]
  readyFlag: string
  verificationFlag: string
  verificationNodeId: string
}

export interface LoreConflictPerspective {
  id: string
  name: string
  recordIds: string[]
}

export interface LoreConflictProgress {
  cluster: LoreConflictCluster
  collectedCount: number
  requiredCount: number
  collectedRecordIds: string[]
  missingRecordIds: string[]
  isReady: boolean
  isVerified: boolean
  completionRatio: number
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
    id: 'record_devon_power_budget_trace',
    targetLoreId: 'lore_platform_seven_blackout_cause',
    sourceFaction: 'engineers',
    perspective: 'Devon power audit: blackout windows align with unmetered draw rerouted from recycler control rails.',
    reliability: 0.63,
    mediaType: 'data_stream',
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
  {
    id: 'record_maya_signature_timing',
    targetLoreId: 'lore_letter_sender_identity',
    sourceFaction: 'engineers',
    perspective: 'Maya timing trace: envelope signatures are stamped before platform clocks reconcile with local time.',
    reliability: 0.58,
    mediaType: 'data_stream',
  },
  {
    id: 'record_nadia_policy_model',
    targetLoreId: 'lore_oxygen_tax_origin',
    sourceFaction: 'data_flow',
    perspective: 'Nadia policy model: Oxygen tax first appeared as an algorithmic stability surcharge, not as an emergency levy.',
    reliability: 0.66,
    mediaType: 'text_log',
  },
  {
    id: 'record_devon_recycler_constraints',
    targetLoreId: 'lore_oxygen_tax_origin',
    sourceFaction: 'engineers',
    perspective: 'Devon constraints notebook: recycler throughput dropped years before tax rollout, but repair requests were denied.',
    reliability: 0.64,
    mediaType: 'text_log',
  },
  {
    id: 'record_elena_tax_archive_redaction',
    targetLoreId: 'lore_oxygen_tax_origin',
    sourceFaction: 'data_flow',
    perspective: 'Elena archive note: oxygen ordinance debate minutes are redacted exactly where rationing exceptions are named.',
    reliability: 0.77,
    mediaType: 'text_log',
  },
  {
    id: 'record_samuel_breathing_ward_memory',
    targetLoreId: 'lore_oxygen_tax_origin',
    sourceFaction: 'station_core',
    perspective: 'Samuel oral history: temporary breathing wards were established before pricing changed, then quietly dissolved.',
    reliability: 0.57,
    mediaType: 'audio_fragment',
  },
  {
    id: 'record_maya_heatmap_snapshot',
    targetLoreId: 'lore_burned_district_cause',
    sourceFaction: 'engineers',
    perspective: 'Maya stress heatmap: thermal runaway began in maintenance conduits, not in residential blocks.',
    reliability: 0.61,
    mediaType: 'data_stream',
  },
  {
    id: 'record_rohan_firebreak_patchnote',
    targetLoreId: 'lore_burned_district_cause',
    sourceFaction: 'engineers',
    perspective: 'Rohan patchnote: firebreak firmware deploy was rolled back one hour before the district ignition cascade.',
    reliability: 0.69,
    mediaType: 'text_log',
  },
  {
    id: 'record_elena_burn_notice_chain',
    targetLoreId: 'lore_burned_district_cause',
    sourceFaction: 'data_flow',
    perspective: 'Elena notice chain: evacuation bulletins were drafted, timestamped, then withheld from public channels.',
    reliability: 0.82,
    mediaType: 'text_log',
  },
  {
    id: 'record_samuel_evacuation_oral_history',
    targetLoreId: 'lore_burned_district_cause',
    sourceFaction: 'station_core',
    perspective: 'Samuel testimony: guides were told to keep people calm and stationary, even as smoke spread inward.',
    reliability: 0.59,
    mediaType: 'audio_fragment',
  },
  {
    id: 'record_devon_shift_roster_gap',
    targetLoreId: 'lore_silent_shift_protocol',
    sourceFaction: 'engineers',
    perspective: 'Devon roster export: whole maintenance shifts are replaced by blank signatures during Quiet Hour intervals.',
    reliability: 0.71,
    mediaType: 'data_stream',
  },
  {
    id: 'record_nadia_latency_window',
    targetLoreId: 'lore_silent_shift_protocol',
    sourceFaction: 'data_flow',
    perspective: 'Nadia latency audit: governance commands pause exactly when those blank maintenance shifts begin.',
    reliability: 0.67,
    mediaType: 'data_stream',
  },
  {
    id: 'record_rohan_manual_override_stamp',
    targetLoreId: 'lore_silent_shift_protocol',
    sourceFaction: 'engineers',
    perspective: 'Rohan override ledger: manual override stamps exist with no operator identity, only checksum ghosts.',
    reliability: 0.62,
    mediaType: 'text_log',
  },
  {
    id: 'record_samuel_quiet_shift_prayer',
    targetLoreId: 'lore_silent_shift_protocol',
    sourceFaction: 'station_core',
    perspective: 'Samuel note: the elders called it the silent shift, when maintenance is done without names and without witness.',
    reliability: 0.54,
    mediaType: 'audio_fragment',
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
      'record_devon_power_budget_trace',
      'record_elena_archive_gap',
      'record_samuel_quiet_hour_testimony',
    ],
    perspectives: [
      {
        id: 'infrastructure-overload',
        name: 'Infrastructure Overload Narrative',
        recordIds: ['record_rohan_vibration_log', 'record_devon_power_budget_trace'],
      },
      {
        id: 'archive-buffer-narrative',
        name: 'Archive Buffer Narrative',
        recordIds: ['record_elena_archive_gap', 'record_samuel_quiet_hour_testimony'],
      },
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
      'record_maya_signature_timing',
    ],
    perspectives: [
      {
        id: 'automated-dispatch-theory',
        name: 'Automated Dispatch Theory',
        recordIds: ['record_samuel_letter_fragment', 'record_elena_dispatch_index'],
      },
      {
        id: 'traveler-echo-theory',
        name: 'Traveler Echo Theory',
        recordIds: ['record_rohan_previous_visitor_note', 'record_maya_signature_timing'],
      },
    ],
    readyFlag: 'lore_conflict_ready_letter_sender_identity',
    verificationFlag: 'lore_conflict_verified_letter_sender_identity',
    verificationNodeId: 'samuel_letter_reveal',
  },
  {
    id: 'oxygen_tax_origin',
    name: 'Oxygen Tax Origin',
    description: 'Records disagree on whether the Oxygen Tax started as scarcity management or governance leverage.',
    targetLoreId: 'lore_oxygen_tax_origin',
    requiredRecordIds: [
      'record_nadia_policy_model',
      'record_devon_recycler_constraints',
      'record_elena_tax_archive_redaction',
      'record_samuel_breathing_ward_memory',
    ],
    perspectives: [
      {
        id: 'fiscal-control-narrative',
        name: 'Fiscal Control Narrative',
        recordIds: ['record_nadia_policy_model', 'record_elena_tax_archive_redaction'],
      },
      {
        id: 'scarcity-maintenance-narrative',
        name: 'Scarcity and Maintenance Narrative',
        recordIds: ['record_devon_recycler_constraints', 'record_samuel_breathing_ward_memory'],
      },
    ],
    readyFlag: 'lore_conflict_ready_oxygen_tax_origin',
    verificationFlag: 'lore_conflict_verified_oxygen_tax_origin',
    verificationNodeId: 'nadia_mystery_response',
  },
  {
    id: 'burned_district_cause',
    name: 'Burned District Cause',
    description: 'Witness and infrastructure records conflict on whether the Burned District was an accident, rollback failure, or suppression event.',
    targetLoreId: 'lore_burned_district_cause',
    requiredRecordIds: [
      'record_maya_heatmap_snapshot',
      'record_rohan_firebreak_patchnote',
      'record_elena_burn_notice_chain',
      'record_samuel_evacuation_oral_history',
    ],
    perspectives: [
      {
        id: 'infrastructure-collapse-narrative',
        name: 'Infrastructure Collapse Narrative',
        recordIds: ['record_maya_heatmap_snapshot', 'record_rohan_firebreak_patchnote'],
      },
      {
        id: 'suppression-memory-narrative',
        name: 'Suppression and Memory Narrative',
        recordIds: ['record_elena_burn_notice_chain', 'record_samuel_evacuation_oral_history'],
      },
    ],
    readyFlag: 'lore_conflict_ready_burned_district_cause',
    verificationFlag: 'lore_conflict_verified_burned_district_cause',
    verificationNodeId: 'maya_mystery_response_1',
  },
  {
    id: 'silent_shift_protocol',
    name: 'Silent Shift Protocol',
    description: 'Multiple records imply an undocumented Quiet Hour operating protocol executed without named operators.',
    targetLoreId: 'lore_silent_shift_protocol',
    requiredRecordIds: [
      'record_devon_shift_roster_gap',
      'record_nadia_latency_window',
      'record_rohan_manual_override_stamp',
      'record_samuel_quiet_shift_prayer',
    ],
    perspectives: [
      {
        id: 'maintenance-cover-narrative',
        name: 'Maintenance Cover Narrative',
        recordIds: ['record_devon_shift_roster_gap', 'record_rohan_manual_override_stamp'],
      },
      {
        id: 'governance-window-narrative',
        name: 'Governance Window Narrative',
        recordIds: ['record_nadia_latency_window', 'record_samuel_quiet_shift_prayer'],
      },
    ],
    readyFlag: 'lore_conflict_ready_silent_shift_protocol',
    verificationFlag: 'lore_conflict_verified_silent_shift_protocol',
    verificationNodeId: 'devon_mystery_response_1',
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

export function getAllConflictClusters(): LoreConflictCluster[] {
  return LORE_CONFLICT_CLUSTERS
}

export function getUnreliableRecordById(recordId: string): UnreliableRecord | undefined {
  return RECORD_BY_ID.get(recordId)
}

export function getConflictProgress(
  state: ArchivistState,
  globalFlags?: Set<string>,
): LoreConflictProgress[] {
  return LORE_CONFLICT_CLUSTERS.map((cluster) => {
    const collectedRecordIds = cluster.requiredRecordIds.filter((recordId) => state.collectedRecords.has(recordId))
    const missingRecordIds = cluster.requiredRecordIds.filter((recordId) => !state.collectedRecords.has(recordId))
    const isVerified = state.verifiedLore.has(cluster.targetLoreId) || Boolean(globalFlags?.has(cluster.verificationFlag))
    const isReady = !isVerified && (missingRecordIds.length === 0 || Boolean(globalFlags?.has(cluster.readyFlag)))

    return {
      cluster,
      collectedCount: collectedRecordIds.length,
      requiredCount: cluster.requiredRecordIds.length,
      collectedRecordIds,
      missingRecordIds,
      isReady,
      isVerified,
      completionRatio: cluster.requiredRecordIds.length > 0
        ? collectedRecordIds.length / cluster.requiredRecordIds.length
        : 0,
    }
  }).sort((a, b) => a.cluster.name.localeCompare(b.cluster.name))
}
