#!/usr/bin/env npx tsx
/**
 * Verify Simulation Phase Contract
 *
 * Enforces variant-level simulation determinism across:
 * - dialogue graphs (`simulation.variantId`, phase, difficulty)
 * - canonical contract (`lib/simulation-variant-contract.ts`)
 * - data dictionary contract block (`docs/reference/data-dictionary/06-simulations.md`)
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIALOGUE_GRAPHS, type CharacterId } from '../lib/graph-registry'
import { type SimulationDifficulty, type SimulationPhase } from '../lib/dialogue-graph'
import {
  SIMULATION_VARIANT_CONTRACT,
  type SimulationVariantContractEntry
} from '../lib/simulation-variant-contract'

type GraphVariantRecord = {
  graphKey: string
  characterId: CharacterId
  nodeId: string
  variantId: string
  phase: SimulationPhase
  difficulty: SimulationDifficulty
}

type VerificationError = {
  type:
    | 'contract_duplicate_variant'
    | 'graph_duplicate_variant'
    | 'missing_in_contract'
    | 'missing_in_graph'
    | 'character_mismatch'
    | 'phase_mismatch'
    | 'difficulty_mismatch'
    | 'node_mismatch'
    | 'doc_block_missing'
    | 'doc_parse_error'
    | 'doc_missing_entry'
    | 'doc_unexpected_entry'
    | 'doc_entry_mismatch'
  message: string
}

type DocEntry = {
  variantId: string
  characterId: CharacterId
  phase: SimulationPhase
  difficulty: SimulationDifficulty
}

const REPORT_PATH = path.join(process.cwd(), 'docs/qa/simulation-phase-contract-report.json')
const DOC_PATH = path.join(process.cwd(), 'docs/reference/data-dictionary/06-simulations.md')
const DOC_BLOCK_START = '<!-- SIMULATION_VARIANT_CONTRACT:START -->'
const DOC_BLOCK_END = '<!-- SIMULATION_VARIANT_CONTRACT:END -->'

const NON_CHARACTER_IDS = new Set<CharacterId>([
  'station_entry',
  'grand_hall',
  'market',
  'deep_station',
])

function isSimulationDifficulty(value: string): value is SimulationDifficulty {
  return value === 'introduction' || value === 'application' || value === 'mastery'
}

function collectGraphVariants(): GraphVariantRecord[] {
  const records: GraphVariantRecord[] = []

  for (const [graphKey, graph] of Object.entries(DIALOGUE_GRAPHS)) {
    // Revisit graphs should not define canonical simulation variants.
    if (graphKey.endsWith('_revisit')) continue

    const characterId = graphKey as CharacterId
    if (NON_CHARACTER_IDS.has(characterId)) continue

    for (const node of graph.nodes.values()) {
      const simulation = node.simulation
      if (!simulation?.variantId) continue

      records.push({
        graphKey,
        characterId,
        nodeId: node.nodeId,
        variantId: simulation.variantId,
        phase: simulation.phase ?? 1,
        difficulty: simulation.difficulty ?? 'introduction',
      })
    }
  }

  return records.sort((a, b) => a.variantId.localeCompare(b.variantId))
}

function parseDocContractBlock(): { entries: DocEntry[]; errors: VerificationError[] } {
  const errors: VerificationError[] = []
  const raw = fs.readFileSync(DOC_PATH, 'utf-8')

  const start = raw.indexOf(DOC_BLOCK_START)
  const end = raw.indexOf(DOC_BLOCK_END)
  if (start === -1 || end === -1 || end < start) {
    errors.push({
      type: 'doc_block_missing',
      message: `Missing simulation contract block markers in ${DOC_PATH}`,
    })
    return { entries: [], errors }
  }

  const block = raw.slice(start + DOC_BLOCK_START.length, end).trim()
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const entries: DocEntry[] = []
  for (const line of lines) {
    const match = /^- `([^`]+)` \| `([^`]+)` \| `([123])` \| `(introduction|application|mastery)`$/.exec(line)
    if (!match) {
      errors.push({
        type: 'doc_parse_error',
        message: `Unparseable contract line: ${line}`,
      })
      continue
    }

    const [, variantId, characterIdRaw, phaseRaw, difficultyRaw] = match
    const characterId = characterIdRaw as CharacterId
    const phase = Number(phaseRaw) as SimulationPhase

    if (!isSimulationDifficulty(difficultyRaw)) {
      errors.push({
        type: 'doc_parse_error',
        message: `Invalid difficulty in contract line: ${line}`,
      })
      continue
    }

    entries.push({
      variantId,
      characterId,
      phase,
      difficulty: difficultyRaw,
    })
  }

  return { entries, errors }
}

function verifySimulationPhaseContract(): {
  valid: boolean
  errors: VerificationError[]
  summary: {
    contractEntries: number
    graphVariants: number
    docEntries: number
  }
} {
  const errors: VerificationError[] = []

  const graphVariants = collectGraphVariants()
  const contractVariants = SIMULATION_VARIANT_CONTRACT
  const { entries: docEntries, errors: docParseErrors } = parseDocContractBlock()
  errors.push(...docParseErrors)

  const contractByVariant = new Map<string, SimulationVariantContractEntry>()
  for (const entry of contractVariants) {
    const existing = contractByVariant.get(entry.variantId)
    if (existing) {
      errors.push({
        type: 'contract_duplicate_variant',
        message: `Duplicate contract variantId "${entry.variantId}" (${existing.characterId} and ${entry.characterId})`,
      })
      continue
    }
    contractByVariant.set(entry.variantId, entry)
  }

  const graphByVariant = new Map<string, GraphVariantRecord>()
  for (const record of graphVariants) {
    const existing = graphByVariant.get(record.variantId)
    if (existing) {
      errors.push({
        type: 'graph_duplicate_variant',
        message: `Duplicate graph variantId "${record.variantId}" (${existing.graphKey}/${existing.nodeId} and ${record.graphKey}/${record.nodeId})`,
      })
      continue
    }
    graphByVariant.set(record.variantId, record)
  }

  for (const [variantId, graphRecord] of graphByVariant.entries()) {
    const contract = contractByVariant.get(variantId)
    if (!contract) {
      errors.push({
        type: 'missing_in_contract',
        message: `Graph variant "${variantId}" (${graphRecord.characterId}/${graphRecord.nodeId}) missing from simulation contract`,
      })
      continue
    }

    if (contract.characterId !== graphRecord.characterId) {
      errors.push({
        type: 'character_mismatch',
        message: `Character mismatch for "${variantId}": graph=${graphRecord.characterId}, contract=${contract.characterId}`,
      })
    }
    if (contract.phase !== graphRecord.phase) {
      errors.push({
        type: 'phase_mismatch',
        message: `Phase mismatch for "${variantId}": graph=${graphRecord.phase}, contract=${contract.phase}`,
      })
    }
    if (contract.difficulty !== graphRecord.difficulty) {
      errors.push({
        type: 'difficulty_mismatch',
        message: `Difficulty mismatch for "${variantId}": graph=${graphRecord.difficulty}, contract=${contract.difficulty}`,
      })
    }
    if (contract.nodeId !== graphRecord.nodeId) {
      errors.push({
        type: 'node_mismatch',
        message: `Node mismatch for "${variantId}": graph=${graphRecord.nodeId}, contract=${contract.nodeId}`,
      })
    }
  }

  for (const [variantId, contract] of contractByVariant.entries()) {
    if (!graphByVariant.has(variantId)) {
      errors.push({
        type: 'missing_in_graph',
        message: `Contract variant "${variantId}" (${contract.characterId}/${contract.nodeId}) missing from dialogue graphs`,
      })
    }
  }

  const docByVariant = new Map<string, DocEntry>()
  for (const entry of docEntries) {
    if (docByVariant.has(entry.variantId)) {
      errors.push({
        type: 'doc_parse_error',
        message: `Duplicate doc variant entry for "${entry.variantId}"`,
      })
      continue
    }
    docByVariant.set(entry.variantId, entry)
  }

  for (const contract of contractVariants) {
    const docEntry = docByVariant.get(contract.variantId)
    if (!docEntry) {
      errors.push({
        type: 'doc_missing_entry',
        message: `Doc contract is missing "${contract.variantId}"`,
      })
      continue
    }

    if (
      docEntry.characterId !== contract.characterId ||
      docEntry.phase !== contract.phase ||
      docEntry.difficulty !== contract.difficulty
    ) {
      errors.push({
        type: 'doc_entry_mismatch',
        message:
          `Doc mismatch for "${contract.variantId}": ` +
          `doc=${docEntry.characterId}/${docEntry.phase}/${docEntry.difficulty}, ` +
          `contract=${contract.characterId}/${contract.phase}/${contract.difficulty}`,
      })
    }
  }

  for (const docEntry of docEntries) {
    if (!contractByVariant.has(docEntry.variantId)) {
      errors.push({
        type: 'doc_unexpected_entry',
        message: `Doc contains unexpected variant "${docEntry.variantId}" not present in canonical contract`,
      })
    }
  }

  const valid = errors.length === 0
  return {
    valid,
    errors,
    summary: {
      contractEntries: contractVariants.length,
      graphVariants: graphVariants.length,
      docEntries: docEntries.length,
    },
  }
}

function main(): void {
  const result = verifySimulationPhaseContract()
  const report = {
    generated_at: new Date().toISOString(),
    valid: result.valid,
    summary: result.summary,
    errors: result.errors,
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf-8')

  if (!result.valid) {
    console.error('\nSimulation phase contract verification failed:\n')
    for (const error of result.errors) {
      console.error(`- [${error.type}] ${error.message}`)
    }
    console.error(`\nReport: ${REPORT_PATH}`)
    process.exit(1)
  }

  console.log('Simulation phase contract verification passed.')
  console.log(`Contract entries: ${result.summary.contractEntries}`)
  console.log(`Graph variants: ${result.summary.graphVariants}`)
  console.log(`Doc entries: ${result.summary.docEntries}`)
  console.log(`Report: ${REPORT_PATH}`)
}

main()

