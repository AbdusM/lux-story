#!/usr/bin/env npx tsx
/**
 * Generate Coverage Matrix
 * Auto-generates docs/03_PROCESS/18-dialogue-menu-simulations-matrix.csv
 * from content and lib registries.
 *
 * Usage:
 *   npx tsx scripts/generate-coverage-matrix.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { SIMULATION_REGISTRY as CONTENT_REGISTRY } from '../content/simulation-registry'
import { SIMULATION_REGISTRY as LIB_REGISTRY } from '../lib/simulation-registry'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface MatrixRow {
  character: string
  dialogueChoiceNodes: number
  dialogueConditionRefs: number
  interrupts: 'Y' | 'N'
  contentSimId: string
  libSimId: string
  simIdMatch: 'Y' | 'N'
}

function countChoiceNodes(characterId: string): number {
  const graph = DIALOGUE_GRAPHS[characterId as keyof typeof DIALOGUE_GRAPHS]
  if (!graph) return 0
  let count = 0
  for (const node of graph.nodes.values()) {
    if (node.choices && node.choices.length > 0) {
      count += node.choices.length
    }
  }
  return count
}

function countConditionRefs(characterId: string): number {
  const graph = DIALOGUE_GRAPHS[characterId as keyof typeof DIALOGUE_GRAPHS]
  if (!graph) return 0
  let count = 0
  for (const node of graph.nodes.values()) {
    if (node.requiredState) count++
    if (node.choices) {
      for (const choice of node.choices) {
        if (choice.condition) count++
      }
    }
  }
  return count
}

function hasInterrupts(characterId: string): boolean {
  const graph = DIALOGUE_GRAPHS[characterId as keyof typeof DIALOGUE_GRAPHS]
  if (!graph) return false
  for (const node of graph.nodes.values()) {
    if (node.tags?.includes('interrupt')) return true
    // Also check for interrupt blocks in content array
    for (const content of node.content || []) {
      if ((content as { interrupt?: unknown }).interrupt) return true
    }
  }
  return false
}

function generateMatrix(): MatrixRow[] {
  const rows: MatrixRow[] = []

  // Get all unique character IDs from both registries
  const allCharacterIds = new Set<string>()
  for (const sim of CONTENT_REGISTRY) allCharacterIds.add(sim.characterId)
  for (const sim of LIB_REGISTRY) allCharacterIds.add(sim.characterId)

  for (const characterId of allCharacterIds) {
    const contentSim = CONTENT_REGISTRY.find(s => s.characterId === characterId)
    const libSim = LIB_REGISTRY.find(s => s.characterId === characterId)

    const contentSimId = contentSim?.id || ''
    const libSimId = libSim?.id || ''

    rows.push({
      character: characterId,
      dialogueChoiceNodes: countChoiceNodes(characterId),
      dialogueConditionRefs: countConditionRefs(characterId),
      interrupts: hasInterrupts(characterId) ? 'Y' : 'N',
      contentSimId,
      libSimId,
      simIdMatch: contentSimId === libSimId ? 'Y' : 'N'
    })
  }

  // Sort by dialogue choice nodes descending
  rows.sort((a, b) => b.dialogueChoiceNodes - a.dialogueChoiceNodes)

  return rows
}

function toCSV(rows: MatrixRow[]): string {
  const header = 'character,dialogue_choice_nodes,dialogue_condition_refs,interrupts,content_sim_id,lib_sim_id,sim_id_match'
  const lines = rows.map(r =>
    `${r.character},${r.dialogueChoiceNodes},${r.dialogueConditionRefs},${r.interrupts},${r.contentSimId},${r.libSimId},${r.simIdMatch}`
  )
  return [header, ...lines].join('\n') + '\n'
}

function toMarkdown(rows: MatrixRow[]): string {
  const lines: string[] = [
    '# Dialogue, Menu, and Simulation Coverage Matrix',
    '',
    'Sources: `content/*-dialogue-graph.ts`, `lib/dialogue-graph.ts`, `lib/story-engine.ts`, `lib/choice-generator.ts`, `components/UnifiedMenu.tsx`, `components/Journal.tsx`, `content/simulation-registry.ts`, `lib/simulation-registry.ts`.',
    '',
    '## Character Coverage',
    '',
    '| character | choice_nodes | condition_refs | interrupts | content_sim_id | lib_sim_id | sim_id_match |',
    '|---|---:|---:|:---:|---|---|:---:|'
  ]

  for (const r of rows) {
    lines.push(`| ${r.character} | ${r.dialogueChoiceNodes} | ${r.dialogueConditionRefs} | ${r.interrupts} | ${r.contentSimId} | ${r.libSimId} | ${r.simIdMatch} |`)
  }

  lines.push('')
  lines.push('Notes:')
  lines.push('- `choice_nodes`: Total choices across all dialogue nodes for this character.')
  lines.push('- `condition_refs`: Nodes or choices with `requiredState` or `condition` gating.')
  lines.push('- `interrupts`: Whether the character has interrupt-tagged nodes or interrupt blocks.')
  lines.push('- `sim_id_match`: Whether content and lib simulation IDs are unified.')
  lines.push('')
  lines.push(`_Generated: ${new Date().toISOString().split('T')[0]}_`)
  lines.push('')

  return lines.join('\n')
}

function main() {
  const rows = generateMatrix()

  const csvPath = path.join(__dirname, '../docs/03_PROCESS/18-dialogue-menu-simulations-matrix.csv')
  const mdPath = path.join(__dirname, '../docs/03_PROCESS/18-dialogue-menu-simulations-matrix.md')

  fs.writeFileSync(csvPath, toCSV(rows), 'utf-8')
  fs.writeFileSync(mdPath, toMarkdown(rows), 'utf-8')

  console.log('\n=== Coverage Matrix Generated ===\n')
  console.log(`CSV: ${csvPath}`)
  console.log(`MD:  ${mdPath}`)
  console.log(`\nCharacters: ${rows.length}`)
  console.log(`All IDs unified: ${rows.every(r => r.simIdMatch === 'Y') ? '✅ Yes' : '❌ No'}`)
  console.log('')
}

main()
