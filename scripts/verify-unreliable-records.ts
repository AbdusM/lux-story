#!/usr/bin/env npx tsx
/**
 * Verify Unreliable Narrator Record Tags
 *
 * Validates:
 * - `record:<recordId>` tags map to known unreliable records
 * - `verify-conflict:<conflictId>` tags map to known conflict clusters
 * - minimum runtime coverage thresholds
 *
 * Env:
 * - `UNRELIABLE_RECORD_VALIDATOR_MODE=warn|enforce` (default warn)
 * - `UNRELIABLE_RECORD_MIN_TAGS` (default 12)
 * - `UNRELIABLE_RECORD_MIN_UNIQUE_RECORD_IDS` (default 12)
 * - `UNRELIABLE_RECORD_MIN_CHARACTERS` (default 5)
 * - `UNRELIABLE_RECORD_MIN_VERIFY_TAGS` (default 5)
 * - `UNRELIABLE_RECORD_MIN_CONFLICT_CLUSTERS` (default 5)
 * - `UNRELIABLE_RECORD_MIN_RECORDS_PER_PERSPECTIVE` (default 2)
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS, type CharacterId } from '../lib/graph-registry'
import {
  getAllConflictClusters,
  getAllConflictClusterIds,
  getAllUnreliableRecordIds,
  RECORD_TAG_PREFIX,
  VERIFY_CONFLICT_TAG_PREFIX,
} from '../lib/unreliable-narrator-system'

type ValidatorMode = 'warn' | 'enforce'

type RecordTagHit = {
  graphKey: string
  characterId: CharacterId
  nodeId: string
  tag: string
  recordId: string
}

type VerifyTagHit = {
  graphKey: string
  characterId: CharacterId
  nodeId: string
  tag: string
  conflictId: string
}

type VerificationIssue = {
  type:
    | 'unknown_record'
    | 'unknown_conflict'
    | 'below_min_tags'
    | 'below_min_unique_record_ids'
    | 'below_min_characters'
    | 'below_min_verify_tags'
    | 'below_min_conflict_clusters'
    | 'conflict_missing_perspectives'
    | 'conflict_perspective_too_shallow'
    | 'conflict_perspective_not_required'
    | 'conflict_required_not_covered'
  message: string
  severity: 'error' | 'warning'
}

const REPORT_PATH = path.join(process.cwd(), 'docs/qa/unreliable-record-report.json')
const NON_CHARACTER_IDS = new Set<CharacterId>(['station_entry', 'grand_hall', 'market', 'deep_station'])

function readMode(): ValidatorMode {
  const raw = (process.env.UNRELIABLE_RECORD_VALIDATOR_MODE ?? 'warn').trim().toLowerCase()
  return raw === 'enforce' ? 'enforce' : 'warn'
}

function readIntEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed < 0) return fallback
  return Math.floor(parsed)
}

function collectTags(): { recordHits: RecordTagHit[]; verifyHits: VerifyTagHit[] } {
  const recordHits: RecordTagHit[] = []
  const verifyHits: VerifyTagHit[] = []

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    if (graphKey.endsWith('_revisit')) continue
    const characterId = graphKey as CharacterId
    if (NON_CHARACTER_IDS.has(characterId)) continue

    for (const node of graph.nodes.values()) {
      const tags = node.tags ?? []
      for (const tag of tags) {
        if (tag.startsWith(RECORD_TAG_PREFIX)) {
          const recordId = tag.slice(RECORD_TAG_PREFIX.length)
          recordHits.push({ graphKey, characterId, nodeId: node.nodeId, tag, recordId })
          continue
        }
        if (tag.startsWith(VERIFY_CONFLICT_TAG_PREFIX)) {
          const conflictId = tag.slice(VERIFY_CONFLICT_TAG_PREFIX.length)
          verifyHits.push({ graphKey, characterId, nodeId: node.nodeId, tag, conflictId })
        }
      }
    }
  }

  return {
    recordHits: recordHits.sort((a, b) => a.tag.localeCompare(b.tag) || a.nodeId.localeCompare(b.nodeId)),
    verifyHits: verifyHits.sort((a, b) => a.tag.localeCompare(b.tag) || a.nodeId.localeCompare(b.nodeId)),
  }
}

function main(): void {
  const mode = readMode()
  const minTags = readIntEnv('UNRELIABLE_RECORD_MIN_TAGS', 12)
  const minUniqueRecordIds = readIntEnv('UNRELIABLE_RECORD_MIN_UNIQUE_RECORD_IDS', 12)
  const minCharacters = readIntEnv('UNRELIABLE_RECORD_MIN_CHARACTERS', 5)
  const minVerifyTags = readIntEnv('UNRELIABLE_RECORD_MIN_VERIFY_TAGS', 5)
  const minConflictClusters = readIntEnv('UNRELIABLE_RECORD_MIN_CONFLICT_CLUSTERS', 5)
  const minRecordsPerPerspective = readIntEnv('UNRELIABLE_RECORD_MIN_RECORDS_PER_PERSPECTIVE', 2)
  const conflictClusters = getAllConflictClusters()
  const knownRecords = new Set(getAllUnreliableRecordIds())
  const knownConflicts = new Set(getAllConflictClusterIds())

  const { recordHits, verifyHits } = collectTags()
  const issues: VerificationIssue[] = []

  const unknownRecords = recordHits.filter((hit) => !knownRecords.has(hit.recordId))
  if (unknownRecords.length > 0) {
    const ids = Array.from(new Set(unknownRecords.map((hit) => hit.recordId))).sort()
    issues.push({
      type: 'unknown_record',
      severity: 'error',
      message: `Unknown unreliable record id(s): ${ids.join(', ')}`,
    })
  }

  const unknownConflicts = verifyHits.filter((hit) => !knownConflicts.has(hit.conflictId))
  if (unknownConflicts.length > 0) {
    const ids = Array.from(new Set(unknownConflicts.map((hit) => hit.conflictId))).sort()
    issues.push({
      type: 'unknown_conflict',
      severity: 'error',
      message: `Unknown verify-conflict id(s): ${ids.join(', ')}`,
    })
  }

  const taggedCharacters = new Set(recordHits.map((hit) => hit.characterId))
  const uniqueRecordIds = new Set(recordHits.map((hit) => hit.recordId))
  const uniqueConflictIds = new Set(verifyHits.map((hit) => hit.conflictId))

  if (recordHits.length < minTags) {
    issues.push({
      type: 'below_min_tags',
      severity: mode === 'enforce' ? 'error' : 'warning',
      message: `Record tag count below threshold: current=${recordHits.length}, required=${minTags}`,
    })
  }
  if (uniqueRecordIds.size < minUniqueRecordIds) {
    issues.push({
      type: 'below_min_unique_record_ids',
      severity: mode === 'enforce' ? 'error' : 'warning',
      message: `Unique record id coverage below threshold: current=${uniqueRecordIds.size}, required=${minUniqueRecordIds}`,
    })
  }
  if (taggedCharacters.size < minCharacters) {
    issues.push({
      type: 'below_min_characters',
      severity: mode === 'enforce' ? 'error' : 'warning',
      message: `Tagged character count below threshold: current=${taggedCharacters.size}, required=${minCharacters}`,
    })
  }
  if (verifyHits.length < minVerifyTags) {
    issues.push({
      type: 'below_min_verify_tags',
      severity: mode === 'enforce' ? 'error' : 'warning',
      message: `Verify tag count below threshold: current=${verifyHits.length}, required=${minVerifyTags}`,
    })
  }
  if (conflictClusters.length < minConflictClusters) {
    issues.push({
      type: 'below_min_conflict_clusters',
      severity: mode === 'enforce' ? 'error' : 'warning',
      message: `Conflict cluster count below threshold: current=${conflictClusters.length}, required=${minConflictClusters}`,
    })
  }

  for (const cluster of conflictClusters) {
    if (cluster.perspectives.length < 2) {
      issues.push({
        type: 'conflict_missing_perspectives',
        severity: 'error',
        message: `Conflict "${cluster.id}" must define at least 2 perspectives (current=${cluster.perspectives.length})`,
      })
      continue
    }

    const perspectiveRecordIds = new Set<string>()
    for (const perspective of cluster.perspectives) {
      if (perspective.recordIds.length < minRecordsPerPerspective) {
        issues.push({
          type: 'conflict_perspective_too_shallow',
          severity: 'error',
          message: `Conflict "${cluster.id}" perspective "${perspective.id}" has ${perspective.recordIds.length} record(s), required=${minRecordsPerPerspective}`,
        })
      }
      for (const recordId of perspective.recordIds) {
        perspectiveRecordIds.add(recordId)
        if (!cluster.requiredRecordIds.includes(recordId)) {
          issues.push({
            type: 'conflict_perspective_not_required',
            severity: 'error',
            message: `Conflict "${cluster.id}" perspective "${perspective.id}" references "${recordId}" not present in requiredRecordIds`,
          })
        }
      }
    }

    for (const requiredRecordId of cluster.requiredRecordIds) {
      if (!perspectiveRecordIds.has(requiredRecordId)) {
        issues.push({
          type: 'conflict_required_not_covered',
          severity: 'error',
          message: `Conflict "${cluster.id}" required record "${requiredRecordId}" is not covered by any perspective`,
        })
      }
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    mode,
    thresholds: {
      min_tags: minTags,
      min_unique_record_ids: minUniqueRecordIds,
      min_characters: minCharacters,
      min_verify_tags: minVerifyTags,
      min_conflict_clusters: minConflictClusters,
      min_records_per_perspective: minRecordsPerPerspective,
    },
    summary: {
      total_record_tags: recordHits.length,
      tagged_characters: taggedCharacters.size,
      total_verify_tags: verifyHits.length,
      unique_record_ids: uniqueRecordIds.size,
      unique_conflict_ids: uniqueConflictIds.size,
      defined_conflict_clusters: conflictClusters.length,
    },
    record_tags: recordHits,
    verify_tags: verifyHits,
    conflict_clusters: conflictClusters,
    issues,
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf-8')

  const hasErrors = issues.some((issue) => issue.severity === 'error')
  if (hasErrors) {
    console.error('\nUnreliable record tag verification failed:\n')
    for (const issue of issues) {
      if (issue.severity === 'error') {
        console.error(`- [${issue.type}] ${issue.message}`)
      }
    }
    console.error(`\nReport: ${REPORT_PATH}`)
    process.exit(1)
  }

  console.log('Unreliable record tag verification completed.')
  console.log(`Mode: ${mode}`)
  console.log(`Record tags: ${recordHits.length}`)
  console.log(`Verify tags: ${verifyHits.length}`)
  console.log(`Tagged characters: ${taggedCharacters.size}`)
  console.log(`Report: ${REPORT_PATH}`)
  if (issues.length > 0) {
    for (const issue of issues) {
      if (issue.severity === 'warning') {
        console.warn(`- [${issue.type}] ${issue.message}`)
      }
    }
  }
}

main()
