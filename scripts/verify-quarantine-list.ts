#!/usr/bin/env npx tsx
/**
 * Verify that the committed quarantine list matches the current raw unreachable report.
 *
 * Rationale:
 * - We exclude quarantined nodes from shipped graphs (see `content/drafts/draft-filter.ts`).
 * - We still want a CI gate that prevents silently growing disconnected content.
 *
 * Expected usage:
 * 1) Run `NEXT_PUBLIC_INCLUDE_DRAFT_CONTENT=true npm run verify:unreachable-dialogue-nodes`
 *    which writes `docs/qa/unreachable-dialogue-nodes-report.json` for the full (raw) graph set.
 * 2) Run this script to ensure `content/drafts/quarantined-node-ids.ts` matches that report.
 */

import fs from 'node:fs'
import path from 'node:path'
import { QUARANTINED_NODE_IDS_BY_GRAPH } from '../content/drafts/quarantined-node-ids'

type Report = {
  unreachable: Array<{ graphKey: string; nodeId: string }>
}

const REPORT_PATH = path.join(process.cwd(), 'docs/qa/unreachable-dialogue-nodes-report.json')

function toKey(graphKey: string, nodeId: string): string {
  return `${graphKey}/${nodeId}`
}

function loadReport(): Report {
  if (!fs.existsSync(REPORT_PATH)) {
    throw new Error(`Missing report: ${REPORT_PATH}`)
  }
  return JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8')) as Report
}

function buildSetFromQuarantine(): Set<string> {
  const s = new Set<string>()
  for (const [graphKey, ids] of Object.entries(QUARANTINED_NODE_IDS_BY_GRAPH)) {
    for (const nodeId of ids) s.add(toKey(graphKey, nodeId))
  }
  return s
}

function buildSetFromReport(report: Report): Set<string> {
  return new Set(report.unreachable.map((n) => toKey(n.graphKey, n.nodeId)))
}

function main(): void {
  const report = loadReport()
  const reportSet = buildSetFromReport(report)
  const quarantineSet = buildSetFromQuarantine()

  const missingInQuarantine = [...reportSet].filter((k) => !quarantineSet.has(k)).sort()
  const extraInQuarantine = [...quarantineSet].filter((k) => !reportSet.has(k)).sort()

  if (missingInQuarantine.length === 0 && extraInQuarantine.length === 0) {
    console.log('[verify-quarantine-list] OK')
    return
  }

  console.error('[verify-quarantine-list] FAILED')
  if (missingInQuarantine.length > 0) {
    console.error(`Missing in quarantine list: ${missingInQuarantine.length}`)
    for (const k of missingInQuarantine.slice(0, 40)) console.error(`- ${k}`)
    if (missingInQuarantine.length > 40) console.error(`... and ${missingInQuarantine.length - 40} more`)
  }
  if (extraInQuarantine.length > 0) {
    console.error(`Extra in quarantine list: ${extraInQuarantine.length}`)
    for (const k of extraInQuarantine.slice(0, 40)) console.error(`- ${k}`)
    if (extraInQuarantine.length > 40) console.error(`... and ${extraInQuarantine.length - 40} more`)
  }

  process.exit(1)
}

main()

