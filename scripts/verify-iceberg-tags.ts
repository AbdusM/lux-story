#!/usr/bin/env npx tsx
/**
 * Verify Iceberg Tags
 *
 * Checks that `iceberg:<topicId>` tags are present and valid in dialogue graphs.
 * Supports staged rollout:
 * - `warn` mode (default): reports low coverage but does not fail
 * - `enforce` mode: fails when thresholds are not met
 *
 * Env:
 * - `ICEBERG_VALIDATOR_MODE=warn|enforce`
 * - `ICEBERG_MIN_TAGS` (default: 12)
 * - `ICEBERG_MIN_CHARACTERS` (default: 4)
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS, type CharacterId } from '../lib/graph-registry'
import { ICEBERG_TOPICS } from '../lib/knowledge-derivatives'

type ValidatorMode = 'warn' | 'enforce'

type IcebergTagHit = {
  graphKey: string
  characterId: CharacterId
  nodeId: string
  tag: string
  topicId: string
}

type VerificationIssue = {
  type: 'unknown_topic' | 'below_min_tags' | 'below_min_characters'
  message: string
  severity: 'error' | 'warning'
}

const REPORT_PATH = path.join(process.cwd(), 'docs/qa/iceberg-tag-report.json')
const NON_CHARACTER_IDS = new Set<CharacterId>([
  'station_entry',
  'grand_hall',
  'market',
  'deep_station',
])

function readMode(): ValidatorMode {
  const raw = (process.env.ICEBERG_VALIDATOR_MODE ?? 'warn').trim().toLowerCase()
  return raw === 'enforce' ? 'enforce' : 'warn'
}

function readIntEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed < 0) return fallback
  return Math.floor(parsed)
}

function collectIcebergTags(): IcebergTagHit[] {
  const hits: IcebergTagHit[] = []

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    if (graphKey.endsWith('_revisit')) continue

    const characterId = graphKey as CharacterId
    if (NON_CHARACTER_IDS.has(characterId)) continue

    for (const node of graph.nodes.values()) {
      const tags = node.tags ?? []
      for (const tag of tags) {
        if (!tag.startsWith('iceberg:')) continue
        const topicId = tag.slice('iceberg:'.length)
        hits.push({
          graphKey,
          characterId,
          nodeId: node.nodeId,
          tag,
          topicId,
        })
      }
    }
  }

  return hits.sort((a, b) => {
    if (a.characterId !== b.characterId) return a.characterId.localeCompare(b.characterId)
    if (a.topicId !== b.topicId) return a.topicId.localeCompare(b.topicId)
    return a.nodeId.localeCompare(b.nodeId)
  })
}

function main(): void {
  const mode = readMode()
  const minTags = readIntEnv('ICEBERG_MIN_TAGS', 12)
  const minCharacters = readIntEnv('ICEBERG_MIN_CHARACTERS', 4)

  const hits = collectIcebergTags()
  const validTopics = new Set(ICEBERG_TOPICS.map((topic) => topic.id))
  const issues: VerificationIssue[] = []

  const unknownHits = hits.filter((hit) => !validTopics.has(hit.topicId))
  if (unknownHits.length > 0) {
    const ids = Array.from(new Set(unknownHits.map((hit) => hit.topicId))).sort()
    issues.push({
      type: 'unknown_topic',
      severity: 'error',
      message: `Unknown iceberg topic id(s): ${ids.join(', ')}`,
    })
  }

  const taggedCharacters = new Set(hits.map((hit) => hit.characterId))
  const tagsByTopic: Record<string, number> = {}
  for (const hit of hits) {
    tagsByTopic[hit.topicId] = (tagsByTopic[hit.topicId] ?? 0) + 1
  }

  const belowTags = hits.length < minTags
  const belowCharacters = taggedCharacters.size < minCharacters

  if (belowTags) {
    issues.push({
      type: 'below_min_tags',
      severity: mode === 'enforce' ? 'error' : 'warning',
      message: `Iceberg tag count below threshold: current=${hits.length}, required=${minTags}`,
    })
  }

  if (belowCharacters) {
    issues.push({
      type: 'below_min_characters',
      severity: mode === 'enforce' ? 'error' : 'warning',
      message: `Tagged character count below threshold: current=${taggedCharacters.size}, required=${minCharacters}`,
    })
  }

  const report = {
    generated_at: new Date().toISOString(),
    mode,
    thresholds: {
      min_tags: minTags,
      min_characters: minCharacters,
    },
    summary: {
      total_tags: hits.length,
      tagged_characters: taggedCharacters.size,
      tagged_topics: Object.keys(tagsByTopic).length,
    },
    tags_by_topic: tagsByTopic,
    tags: hits,
    issues,
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf-8')

  const hasErrors = issues.some((issue) => issue.severity === 'error')
  if (hasErrors) {
    console.error('\nIceberg tag verification failed:\n')
    for (const issue of issues) {
      if (issue.severity === 'error') {
        console.error(`- [${issue.type}] ${issue.message}`)
      }
    }
    console.error(`\nReport: ${REPORT_PATH}`)
    process.exit(1)
  }

  console.log('Iceberg tag verification completed.')
  console.log(`Mode: ${mode}`)
  console.log(`Total tags: ${hits.length}`)
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

