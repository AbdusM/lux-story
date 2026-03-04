#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import {
  extractMicroMemoryTags,
  getMicroCallbackDefinitions,
} from '../lib/micro-reactivity'

type ValidatorMode = 'warn' | 'enforce'
type IssueSeverity = 'error' | 'warning'

type ValidatorIssue = {
  severity: IssueSeverity
  code: string
  message: string
}

type Report = {
  generated_at: string
  mode: ValidatorMode
  thresholds: {
    min_memory_ids: number
    min_callback_characters: number
  }
  summary: {
    memory_set_tags: number
    callback_tags: number
    unique_memory_ids: number
    callback_characters: number
    callback_nodes: number
  }
  coverage: {
    memory_ids: string[]
    callback_characters: string[]
    callbacks_per_character: Record<string, string[]>
  }
  issues: ValidatorIssue[]
  valid: boolean
}

const REPO_ROOT = process.cwd()
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/micro-reactivity-report.json')

const MODE: ValidatorMode = process.env.MICRO_REACTIVITY_VALIDATOR_MODE === 'enforce' ? 'enforce' : 'warn'
const MIN_MEMORY_IDS = Number(process.env.MICRO_REACTIVITY_MIN_MEMORY_IDS ?? 5)
const MIN_CALLBACK_CHARACTERS = Number(process.env.MICRO_REACTIVITY_MIN_CALLBACK_CHARACTERS ?? 5)

function baseCharacterId(graphKey: string): string {
  return graphKey.replace(/_revisit$/, '')
}

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

function main(): void {
  const callbackDefs = getMicroCallbackDefinitions()
  const callbackDefKeys = new Set(callbackDefs.map((def) => `${def.characterId}:${def.memoryId}`))
  const callbackDefMap = new Map<string, Set<string>>()
  for (const def of callbackDefs) {
    const char = String(def.characterId)
    const bucket = callbackDefMap.get(char) ?? new Set<string>()
    bucket.add(def.memoryId)
    callbackDefMap.set(char, bucket)
  }

  const memoryIds = new Set<string>()
  const callbackCharacters = new Set<string>()
  const callbackNodes = new Set<string>()
  const callbackOccurrenceKeys = new Set<string>()
  let memorySetTags = 0
  let callbackTags = 0

  const callbacksPerCharacter = new Map<string, Set<string>>()

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    const characterId = baseCharacterId(graphKey)
    for (const node of graph.nodes.values()) {
      const parsed = extractMicroMemoryTags(node.tags)

      for (const memoryId of parsed.memorySetIds) {
        memorySetTags += 1
        memoryIds.add(memoryId)
      }

      for (const callbackId of parsed.callbackIds) {
        callbackTags += 1
        callbackCharacters.add(characterId)
        callbackNodes.add(`${graphKey}:${node.nodeId}`)
        callbackOccurrenceKeys.add(`${characterId}:${callbackId}`)
        const bucket = callbacksPerCharacter.get(characterId) ?? new Set<string>()
        bucket.add(callbackId)
        callbacksPerCharacter.set(characterId, bucket)
      }
    }
  }

  const issues: ValidatorIssue[] = []

  for (const occurrenceKey of uniqueSorted(callbackOccurrenceKeys)) {
    const [, callbackId] = occurrenceKey.split(':')
    if (!memoryIds.has(callbackId)) {
      issues.push({
        severity: 'error',
        code: 'callback-without-memory',
        message: `Callback tag references memory id with no set tag: ${occurrenceKey}`,
      })
    }
    if (!callbackDefKeys.has(occurrenceKey)) {
      issues.push({
        severity: 'error',
        code: 'callback-missing-definition',
        message: `Callback tag has no runtime definition: ${occurrenceKey}`,
      })
    }
  }

  for (const memoryId of uniqueSorted(memoryIds)) {
    const hasAnyCallback = [...callbackOccurrenceKeys].some((key) => key.endsWith(`:${memoryId}`))
    if (!hasAnyCallback) {
      issues.push({
        severity: 'warning',
        code: 'memory-without-callback',
        message: `Memory tag has no callback tag: ${memoryId}`,
      })
    }
  }

  for (const [characterId, memoryIdsForCharacter] of callbackDefMap.entries()) {
    for (const memoryId of memoryIdsForCharacter.values()) {
      if (!callbackOccurrenceKeys.has(`${characterId}:${memoryId}`)) {
        issues.push({
          severity: 'warning',
          code: 'definition-without-callback-tag',
          message: `Runtime callback definition has no matching callback tag: ${characterId}:${memoryId}`,
        })
      }
    }
  }

  if (memoryIds.size < MIN_MEMORY_IDS) {
    issues.push({
      severity: 'error',
      code: 'memory-id-threshold',
      message: `Expected at least ${MIN_MEMORY_IDS} unique micro memory ids; found ${memoryIds.size}.`,
    })
  }

  if (callbackCharacters.size < MIN_CALLBACK_CHARACTERS) {
    issues.push({
      severity: 'error',
      code: 'callback-character-threshold',
      message: `Expected at least ${MIN_CALLBACK_CHARACTERS} callback-covered characters; found ${callbackCharacters.size}.`,
    })
  }

  const errorCount = issues.filter((issue) => issue.severity === 'error').length
  const report: Report = {
    generated_at: new Date().toISOString(),
    mode: MODE,
    thresholds: {
      min_memory_ids: MIN_MEMORY_IDS,
      min_callback_characters: MIN_CALLBACK_CHARACTERS,
    },
    summary: {
      memory_set_tags: memorySetTags,
      callback_tags: callbackTags,
      unique_memory_ids: memoryIds.size,
      callback_characters: callbackCharacters.size,
      callback_nodes: callbackNodes.size,
    },
    coverage: {
      memory_ids: uniqueSorted(memoryIds),
      callback_characters: uniqueSorted(callbackCharacters),
      callbacks_per_character: Object.fromEntries(
        [...callbacksPerCharacter.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([characterId, ids]) => [characterId, uniqueSorted(ids)]),
      ),
    },
    issues,
    valid: errorCount === 0,
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  const level = report.valid ? 'OK' : (MODE === 'enforce' ? 'FAILED' : 'WARN')
  console.log(`[verify-micro-reactivity] ${level}`)
  console.log(`- mode: ${MODE}`)
  console.log(`- unique_memory_ids: ${report.summary.unique_memory_ids}`)
  console.log(`- callback_characters: ${report.summary.callback_characters}`)
  console.log(`- issues: ${report.issues.length} (errors: ${errorCount})`)
  console.log(`- report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)

  if (!report.valid && MODE === 'enforce') {
    process.exit(1)
  }
}

main()

