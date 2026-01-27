#!/usr/bin/env npx tsx
/**
 * Dialogue Reachability Audit
 *
 * Walks all dialogue graphs from entry points (introduction nodes),
 * follows every choice's nextNodeId, and flags unreachable (orphan) nodes.
 *
 * Categories:
 * - REACHABLE: Connected to at least one entry point via choices
 * - ORPHAN: No incoming choice points to this node
 * - ENTRY_POINT: Introduction/entry nodes (roots of the graph)
 * - CROSS_GRAPH: Referenced by a nextNodeId but in a different graph
 *
 * Usage: npx tsx scripts/audit-dialogue-reachability.ts [--verbose] [--character maya]
 */

// Register path aliases
import { register } from 'tsconfig-paths'
import { resolve } from 'path'
const tsconfig = require(resolve(__dirname, '../tsconfig.json'))
register({
  baseUrl: resolve(__dirname, '..'),
  paths: tsconfig.compilerOptions.paths,
})

import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'

const args = process.argv.slice(2)
const verbose = args.includes('--verbose')
const charFilter = args.includes('--character')
  ? args[args.indexOf('--character') + 1]
  : null

interface AuditResult {
  graphId: string
  totalNodes: number
  reachable: Set<string>
  orphans: string[]
  entryPoints: string[]
  danglingRefs: string[] // nextNodeIds pointing to non-existent nodes
}

function auditGraph(graphId: string, graph: { nodes: Map<string, { nodeId: string; choices: Array<{ nextNodeId: string }> }> }): AuditResult {
  const allNodeIds = new Set<string>()
  const reachable = new Set<string>()
  const entryPoints: string[] = []
  const danglingRefs: string[] = []

  // Collect all nodes
  for (const [nodeId] of graph.nodes) {
    allNodeIds.add(nodeId)
  }

  // Find entry points (introduction nodes or first node)
  for (const [nodeId] of graph.nodes) {
    if (
      nodeId.includes('introduction') ||
      nodeId.includes('entry') ||
      nodeId.includes('_hub') ||
      nodeId.endsWith('_start')
    ) {
      entryPoints.push(nodeId)
    }
  }

  // If no entry points found, use the first node
  if (entryPoints.length === 0 && graph.nodes.size > 0) {
    const firstNode = graph.nodes.keys().next().value
    if (firstNode) entryPoints.push(firstNode)
  }

  // BFS from all entry points
  const queue = [...entryPoints]
  for (const ep of queue) {
    reachable.add(ep)
  }

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const node = graph.nodes.get(nodeId)
    if (!node) continue

    for (const choice of node.choices) {
      const next = choice.nextNodeId
      if (!next) continue

      // Check if the target is in this graph
      if (graph.nodes.has(next)) {
        if (!reachable.has(next)) {
          reachable.add(next)
          queue.push(next)
        }
      } else {
        // Could be a cross-graph reference — check all graphs
        let foundElsewhere = false
        for (const [otherGraphId, otherGraph] of Object.entries(DIALOGUE_GRAPHS)) {
          if (otherGraphId !== graphId && otherGraph.nodes.has(next)) {
            foundElsewhere = true
            break
          }
        }
        if (!foundElsewhere) {
          danglingRefs.push(`${nodeId} → ${next}`)
        }
      }
    }
  }

  // Also check onEnter/onExit for cross-graph navigation
  // (some nodes navigate via state changes, not choices)

  const orphans = [...allNodeIds].filter(id => !reachable.has(id))

  return {
    graphId,
    totalNodes: allNodeIds.size,
    reachable,
    orphans,
    entryPoints,
    danglingRefs,
  }
}

// Run audit
console.log('═══════════════════════════════════════════════════')
console.log('  DIALOGUE REACHABILITY AUDIT')
console.log('═══════════════════════════════════════════════════\n')

const allResults: AuditResult[] = []
let totalOrphans = 0
let totalDangling = 0
let totalNodes = 0

const graphEntries = Object.entries(DIALOGUE_GRAPHS).filter(([id]) => {
  if (charFilter) return id === charFilter || id.startsWith(charFilter + '_')
  return true
})

for (const [graphId, graph] of graphEntries) {
  const result = auditGraph(graphId, graph as unknown as { nodes: Map<string, { nodeId: string; choices: Array<{ nextNodeId: string }> }> })
  allResults.push(result)
  totalNodes += result.totalNodes
  totalOrphans += result.orphans.length
  totalDangling += result.danglingRefs.length

  if (result.orphans.length > 0 || result.danglingRefs.length > 0 || verbose) {
    const status = result.orphans.length === 0 && result.danglingRefs.length === 0 ? '✅' : '⚠️'
    console.log(`${status} ${graphId}: ${result.reachable.size}/${result.totalNodes} reachable`)

    if (result.orphans.length > 0) {
      console.log(`   ORPHANS (${result.orphans.length}):`)
      for (const orphan of result.orphans) {
        console.log(`     - ${orphan}`)
      }
    }

    if (result.danglingRefs.length > 0) {
      console.log(`   DANGLING REFS (${result.danglingRefs.length}):`)
      for (const ref of result.danglingRefs) {
        console.log(`     - ${ref}`)
      }
    }

    if (verbose && result.entryPoints.length > 0) {
      console.log(`   Entry points: ${result.entryPoints.join(', ')}`)
    }
    console.log()
  }
}

// Summary
console.log('═══════════════════════════════════════════════════')
console.log('  SUMMARY')
console.log('═══════════════════════════════════════════════════')
console.log(`  Total graphs:     ${allResults.length}`)
console.log(`  Total nodes:      ${totalNodes}`)
console.log(`  Total orphans:    ${totalOrphans}`)
console.log(`  Total dangling:   ${totalDangling}`)
console.log(`  Reachability:     ${((totalNodes - totalOrphans) / totalNodes * 100).toFixed(1)}%`)
console.log()

// Top offenders
const sortedByOrphans = [...allResults]
  .filter(r => r.orphans.length > 0)
  .sort((a, b) => b.orphans.length - a.orphans.length)

if (sortedByOrphans.length > 0) {
  console.log('  Top orphan sources:')
  for (const r of sortedByOrphans.slice(0, 10)) {
    console.log(`    ${r.graphId}: ${r.orphans.length} orphans`)
  }
}

process.exit(totalOrphans > 0 || totalDangling > 0 ? 1 : 0)
