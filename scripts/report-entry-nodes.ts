#!/usr/bin/env npx tsx
/**
 * Report: Simulation Entry Node Audit
 * Lists all simulation entry nodes and whether they exist in their character's dialogue graph.
 *
 * Usage:
 *   npx tsx scripts/report-entry-nodes.ts
 */

import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import { SIMULATION_REGISTRY } from '../lib/simulation-registry'

interface EntryNodeReport {
  characterId: string
  simulationId: string
  entryNodeId: string
  exists: boolean
}

function auditEntryNodes(): EntryNodeReport[] {
  const reports: EntryNodeReport[] = []

  for (const sim of SIMULATION_REGISTRY) {
    const graph = DIALOGUE_GRAPHS[sim.characterId as keyof typeof DIALOGUE_GRAPHS]
    const exists = graph ? graph.nodes.has(sim.entryNodeId) : false

    reports.push({
      characterId: sim.characterId,
      simulationId: sim.id,
      entryNodeId: sim.entryNodeId,
      exists
    })
  }

  return reports
}

function main() {
  const reports = auditEntryNodes()
  const missing = reports.filter(r => !r.exists)
  const valid = reports.filter(r => r.exists)

  console.log('\n=== Simulation Entry Node Audit ===\n')

  if (missing.length === 0) {
    console.log('✅ All entry nodes exist in their respective dialogue graphs.\n')
  } else {
    console.log(`❌ ${missing.length} missing entry node(s):\n`)
    for (const r of missing) {
      console.log(`  - ${r.characterId}: "${r.entryNodeId}" (sim: ${r.simulationId})`)
    }
    console.log('')
  }

  console.log(`Summary: ${valid.length}/${reports.length} valid\n`)

  // Exit with error code if any missing
  if (missing.length > 0) {
    process.exit(1)
  }
}

main()
