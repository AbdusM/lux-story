#!/usr/bin/env node
/* eslint-disable no-console */

import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

type Warning = {
  warning_id: string
  code: string
  graph?: string
  nodeId?: string
  message?: string
  suggestion?: string
  details?: unknown
}

function readArg(name: string): string | null {
  const ix = process.argv.indexOf(name)
  if (ix < 0) return null
  return process.argv[ix + 1] ?? null
}

function guessGraphFile(graph: string): string | null {
  if (graph === 'station_entry') return 'content/station-entry-graph.ts'
  if (graph === 'grand_hall') return 'content/grand-hall-graph.ts'
  if (graph === 'deep_station') return 'content/deep-station-graph.ts'
  if (graph === 'market') return 'content/market-graph.ts'
  if (graph.endsWith('_revisit')) {
    const base = graph.replace(/_revisit$/, '')
    return `content/${base}-revisit-graph.ts`
  }
  return `content/${graph}-dialogue-graph.ts`
}

function findNodeLine(filePath: string, nodeId: string): number | null {
  try {
    const abs = filePath.startsWith('/') ? filePath : join(process.cwd(), filePath)
    const src = readFileSync(abs, 'utf8')
    const needle1 = `nodeId: '${nodeId}'`
    const needle2 = `nodeId: \"${nodeId}\"`
    let ix = src.indexOf(needle1)
    if (ix < 0) ix = src.indexOf(needle2)
    if (ix < 0) return null
    return src.slice(0, ix).split('\n').length
  } catch {
    return null
  }
}

const qaDir = join(process.cwd(), 'docs', 'qa')
mkdirSync(qaDir, { recursive: true })

const warningsPath = readArg('--warnings') ?? join(qaDir, 'dialogue-graph-warnings.report.json')
const outJson = readArg('--out') ?? join(qaDir, 'orphan-triage.report.json')
const outMd = readArg('--out-md') ?? join(qaDir, 'orphan-triage.report.md')
const graphs = (readArg('--graphs')?.split(',') ?? ['samuel', 'devon', 'maya']).filter(Boolean)

const warnings: Warning[] = (() => {
  try {
    const parsed = JSON.parse(readFileSync(warningsPath, 'utf8'))
    return Array.isArray(parsed?.warnings) ? parsed.warnings : []
  } catch {
    return []
  }
})()

const orphans = warnings
  .filter((w) => w.code === 'ORPHAN_NODE')
  .filter((w) => w.graph && graphs.includes(w.graph))
  .filter((w) => w.nodeId)

const rows = orphans.map((w) => {
  const graph = w.graph!
  const nodeId = w.nodeId!
  const file = guessGraphFile(graph)
  const line = file ? findNodeLine(file, nodeId) : null
  const groupKey = nodeId.split('_').slice(0, 3).join('_')
  return {
    warning_id: w.warning_id,
    graph,
    node_id: nodeId,
    group_key: groupKey,
    message: w.message ?? null,
    suggestion: w.suggestion ?? null,
    file: file,
    line,
  }
})

rows.sort((a, b) => {
  if (a.graph !== b.graph) return a.graph.localeCompare(b.graph)
  if (a.group_key !== b.group_key) return a.group_key.localeCompare(b.group_key)
  return a.node_id.localeCompare(b.node_id)
})

const report = {
  version: 1,
  generated_at: new Date().toISOString(),
  warnings_source: warningsPath,
  graphs,
  orphan_count: rows.length,
  orphans: rows,
}

writeFileSync(outJson, JSON.stringify(report, null, 2) + '\n', 'utf8')

// Author-friendly markdown view.
const mdLines: string[] = []
mdLines.push(`# Orphan Triage Report`)
mdLines.push(``)
mdLines.push(`Generated: \`${report.generated_at}\``)
mdLines.push(`Source: \`${warningsPath}\``)
mdLines.push(`Graphs: ${graphs.map(g => `\`${g}\``).join(', ')}`)
mdLines.push(`Total ORPHAN_NODE: **${rows.length}**`)
mdLines.push(``)

let currentGraph: string | null = null
for (const r of rows) {
  if (r.graph !== currentGraph) {
    currentGraph = r.graph
    mdLines.push(`## ${currentGraph}`)
    mdLines.push(``)
  }
  const loc = r.file ? `${r.file}${r.line ? `:${r.line}` : ''}` : '(unknown file)'
  mdLines.push(`- \`${r.node_id}\` (${loc})`)
  if (r.message) mdLines.push(`  - ${r.message}`)
  if (r.suggestion) mdLines.push(`  - Suggestion: ${r.suggestion}`)
}
mdLines.push(``)

writeFileSync(outMd, mdLines.join('\n') + '\n', 'utf8')

console.log(`[orphan-triage] graphs=${graphs.length}`)
console.log(`[orphan-triage] orphans=${rows.length}`)
console.log(`[orphan-triage] out_json=${outJson}`)
console.log(`[orphan-triage] out_md=${outMd}`)
