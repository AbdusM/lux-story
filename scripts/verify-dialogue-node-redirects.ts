#!/usr/bin/env npx tsx
/**
 * Dialogue Node Redirect Verification
 *
 * Minimal save-compatibility gate for topology changes:
 * - redirect targets must exist in current dialogue graphs
 * - no self-redirects
 * - no cycles
 *
 * Report is written to docs/qa/dialogue-node-redirects-report.json.
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import { DIALOGUE_NODE_REDIRECTS, resolveDialogueNodeRedirect } from '../lib/dialogue-node-redirects'

type RedirectStatus = {
  fromNodeId: string
  toNodeId: string
  targetExists: boolean
  targetGraphKey: string | null
  isSelfRedirect: boolean
  cycleDetected: boolean
  truncated: boolean
  hops: number
  path: string[]
}

type RedirectReport = {
  generated_at: string
  totals: {
    redirects: number
    invalidTargets: number
    selfRedirects: number
    cycles: number
    truncated: number
  }
  statuses: RedirectStatus[]
}

function writeJson(p: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

function findOwnerGraph(nodeId: string): string | null {
  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    if (graph.nodes.has(nodeId)) return graphKey
  }
  return null
}

function main(): void {
  const reportPath = path.join(process.cwd(), 'docs/qa/dialogue-node-redirects-report.json')

  const statuses: RedirectStatus[] = Object.entries(DIALOGUE_NODE_REDIRECTS)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fromNodeId, redirect]) => {
      const resolution = resolveDialogueNodeRedirect(fromNodeId)
      const targetGraphKey = findOwnerGraph(redirect.toNodeId)
      return {
        fromNodeId,
        toNodeId: redirect.toNodeId,
        targetExists: Boolean(targetGraphKey),
        targetGraphKey,
        isSelfRedirect: fromNodeId === redirect.toNodeId,
        cycleDetected: resolution.cycleDetected,
        truncated: resolution.truncated,
        hops: resolution.hops,
        path: resolution.path,
      }
    })

  const totals = statuses.reduce(
    (acc, s) => {
      if (!s.targetExists) acc.invalidTargets++
      if (s.isSelfRedirect) acc.selfRedirects++
      if (s.cycleDetected) acc.cycles++
      if (s.truncated) acc.truncated++
      return acc
    },
    {
      redirects: statuses.length,
      invalidTargets: 0,
      selfRedirects: 0,
      cycles: 0,
      truncated: 0,
    },
  )

  const report: RedirectReport = {
    generated_at: new Date().toISOString(),
    totals,
    statuses,
  }

  writeJson(reportPath, report)

  console.log(`[verify-dialogue-node-redirects] report: ${reportPath}`)
  console.log(`[verify-dialogue-node-redirects] redirects=${totals.redirects}`)
  console.log(`[verify-dialogue-node-redirects] invalidTargets=${totals.invalidTargets}`)
  console.log(`[verify-dialogue-node-redirects] selfRedirects=${totals.selfRedirects}`)
  console.log(`[verify-dialogue-node-redirects] cycles=${totals.cycles}`)
  console.log(`[verify-dialogue-node-redirects] truncated=${totals.truncated}`)

  if (
    totals.invalidTargets > 0 ||
    totals.selfRedirects > 0 ||
    totals.cycles > 0 ||
    totals.truncated > 0
  ) {
    process.exit(1)
  }
}

main()

