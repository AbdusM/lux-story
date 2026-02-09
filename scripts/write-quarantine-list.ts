#!/usr/bin/env npx tsx
/**
 * Write `content/drafts/quarantined-node-ids.ts` from the latest unreachable report.
 *
 * Typical workflow:
 * 1) `NEXT_PUBLIC_INCLUDE_DRAFT_CONTENT=true npm run verify:unreachable-dialogue-nodes`
 * 2) `npm run write:content-quarantine`
 */

import fs from 'node:fs'
import path from 'node:path'

type Report = {
  unreachable: Array<{ graphKey: string; nodeId: string }>
}

const REPORT_PATH = path.join(process.cwd(), 'docs/qa/unreachable-dialogue-nodes-report.json')
const OUT_PATH = path.join(process.cwd(), 'content/drafts/quarantined-node-ids.ts')

function loadReport(): Report {
  if (!fs.existsSync(REPORT_PATH)) {
    throw new Error(`Missing report: ${REPORT_PATH}`)
  }
  return JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8')) as Report
}

function main(): void {
  const report = loadReport()

  const byGraph = new Map<string, Set<string>>()
  for (const { graphKey, nodeId } of report.unreachable) {
    if (!byGraph.has(graphKey)) byGraph.set(graphKey, new Set())
    byGraph.get(graphKey)!.add(nodeId)
  }

  const graphKeys = [...byGraph.keys()].sort()

  const lines: string[] = []
  lines.push('// AUTO-GENERATED FROM docs/qa/unreachable-dialogue-nodes-report.json')
  lines.push('// This is the current quarantine list for non-shipped (draft) content nodes.')
  lines.push('// Regenerate by running: NEXT_PUBLIC_INCLUDE_DRAFT_CONTENT=true npm run verify:unreachable-dialogue-nodes')
  lines.push('')
  lines.push('export const QUARANTINED_NODE_IDS_BY_GRAPH: Record<string, readonly string[]> = {')
  for (const graphKey of graphKeys) {
    const ids = [...(byGraph.get(graphKey) ?? new Set())].sort()
    lines.push(`  ${JSON.stringify(graphKey)}: [`)
    for (const nodeId of ids) {
      lines.push(`    ${JSON.stringify(nodeId)},`)
    }
    lines.push('  ],')
  }
  lines.push('} as const')
  lines.push('')

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, lines.join('\n'), 'utf-8')
  console.log(`[write-quarantine-list] Wrote ${OUT_PATH}`)
}

main()

