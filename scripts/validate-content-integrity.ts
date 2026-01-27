#!/usr/bin/env npx tsx

import { DIALOGUE_GRAPHS } from '../lib/graph-registry'

interface ValidationError {
  graph: string
  sourceNode: string
  referenceType: 'choice' | 'interrupt-target' | 'interrupt-missed' | 'start-node'
  brokenId: string
  context: string
}

const VIRTUAL_NODES = new Set(['TRAVEL_PENDING', 'SIMULATION_PENDING'])

// 1. Collect all valid nodeIds across all graphs
const allNodeIds = new Set<string>(VIRTUAL_NODES)
const nodeSources = new Map<string, string[]>() // nodeId → graph keys (for duplicate detection)

const graphs = Object.entries(DIALOGUE_GRAPHS) as [string, (typeof DIALOGUE_GRAPHS)[keyof typeof DIALOGUE_GRAPHS]][]

for (const [graphKey, graph] of graphs) {
  for (const nodeId of graph.nodes.keys()) {
    allNodeIds.add(nodeId)
    const sources = nodeSources.get(nodeId) || []
    sources.push(graphKey)
    nodeSources.set(nodeId, sources)
  }
}

// 2. Detect duplicate nodeIds across graphs
const warnings: string[] = []
for (const [nodeId, sources] of nodeSources) {
  if (sources.length > 1) {
    warnings.push(`Duplicate nodeId '${nodeId}' found in graphs: ${sources.join(', ')}`)
  }
}

// 3. Validate all references
const errors: ValidationError[] = []
let totalReferences = 0

for (const [graphKey, graph] of graphs) {
  // Validate startNodeId
  totalReferences++
  if (!allNodeIds.has(graph.startNodeId)) {
    errors.push({
      graph: graphKey,
      sourceNode: '(graph root)',
      referenceType: 'start-node',
      brokenId: graph.startNodeId,
      context: 'startNodeId',
    })
  }

  for (const [nodeId, node] of graph.nodes) {
    // Validate choices
    for (const choice of node.choices) {
      totalReferences++
      if (!allNodeIds.has(choice.nextNodeId)) {
        errors.push({
          graph: graphKey,
          sourceNode: nodeId,
          referenceType: 'choice',
          brokenId: choice.nextNodeId,
          context: choice.choiceId,
        })
      }
    }

    // Validate interrupt references in content
    for (const content of node.content) {
      if (content.interrupt) {
        totalReferences++
        if (!allNodeIds.has(content.interrupt.targetNodeId)) {
          errors.push({
            graph: graphKey,
            sourceNode: nodeId,
            referenceType: 'interrupt-target',
            brokenId: content.interrupt.targetNodeId,
            context: content.interrupt.type,
          })
        }

        if (content.interrupt.missedNodeId) {
          totalReferences++
          if (!allNodeIds.has(content.interrupt.missedNodeId)) {
            errors.push({
              graph: graphKey,
              sourceNode: nodeId,
              referenceType: 'interrupt-missed',
              brokenId: content.interrupt.missedNodeId,
              context: content.interrupt.type,
            })
          }
        }
      }
    }
  }
}

// 4. Report
const totalNodes = Array.from(graphs).reduce((sum, [, g]) => sum + g.nodes.size, 0)

console.log('')
console.log('Content Integrity Check')
console.log('=======================')
console.log(`Graphs scanned: ${graphs.length}`)
console.log(`Total nodes: ${totalNodes.toLocaleString()}`)
console.log(`Total references checked: ${totalReferences.toLocaleString()}`)
console.log(`Errors: ${errors.length} | Warnings: ${warnings.length}`)
console.log('')

if (warnings.length > 0) {
  console.log(`Warnings:`)
  for (const w of warnings) {
    console.log(`  - ${w}`)
  }
  console.log('')
}

if (errors.length === 0) {
  console.log('✓ All node references valid.')
  process.exit(0)
} else {
  console.log(`✗ Found ${errors.length} broken references:`)
  for (const e of errors) {
    console.log(`  - [${e.graph}:${e.sourceNode}] ${e.referenceType} '${e.context}' → '${e.brokenId}' NOT FOUND`)
  }
  process.exit(1)
}
