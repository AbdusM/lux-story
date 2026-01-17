/**
 * Simulation Validators
 * Aligns content/simulation-registry.ts ↔ lib/simulation-registry.ts
 * Validates entry nodes exist in character graphs.
 *
 * ISP: Evidence-Based — validators must produce actionable diagnostics.
 */

import { SIMULATION_REGISTRY as CONTENT_REGISTRY, SimulationDefinition } from '@/content/simulation-registry'
import { SIMULATION_REGISTRY as LIB_REGISTRY, SimulationMeta } from '@/lib/simulation-registry'
import { DialogueGraph } from '../dialogue-graph'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SimulationAlignmentIssue {
  characterId: string
  contentId?: string
  libId?: string
  issueType: 'missing_in_content' | 'missing_in_lib' | 'id_mismatch' | 'phase_mismatch' | 'difficulty_mismatch'
  details: string
  severity: 'error' | 'warning'
}

export interface EntryNodeIssue {
  simulationId: string
  characterId: string
  entryNodeId: string
  issueType: 'missing_entry_node'
  details: string
}

export interface SimulationValidationResult {
  valid: boolean
  alignmentIssues: SimulationAlignmentIssue[]
  entryNodeIssues: EntryNodeIssue[]
  alignmentMap: SimulationAlignmentMap[]
  summary: string
}

export interface SimulationAlignmentMap {
  characterId: string
  contentId: string | null
  libId: string | null
  aligned: boolean
  contentTitle?: string
  libTitle?: string
  phase?: number
  difficulty?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY ALIGNMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build a mapping table linking content ↔ lib registries by characterId.
 * Returns alignment status and any mismatches.
 */
export function buildSimulationAlignmentMap(): {
  map: SimulationAlignmentMap[]
  issues: SimulationAlignmentIssue[]
} {
  const map: SimulationAlignmentMap[] = []
  const issues: SimulationAlignmentIssue[] = []

  // Index registries by characterId
  const contentByCharacter = new Map<string, SimulationDefinition>()
  const libByCharacter = new Map<string, SimulationMeta>()

  for (const sim of CONTENT_REGISTRY) {
    contentByCharacter.set(sim.characterId, sim)
  }

  for (const sim of LIB_REGISTRY) {
    libByCharacter.set(sim.characterId, sim)
  }

  // Get all unique character IDs
  const allCharacterIds = new Set([
    ...contentByCharacter.keys(),
    ...libByCharacter.keys()
  ])

  for (const characterId of allCharacterIds) {
    const contentSim = contentByCharacter.get(characterId)
    const libSim = libByCharacter.get(characterId)

    const entry: SimulationAlignmentMap = {
      characterId,
      contentId: contentSim?.id ?? null,
      libId: libSim?.id ?? null,
      aligned: false,
      contentTitle: contentSim?.title,
      libTitle: libSim?.title,
      phase: contentSim?.phase,
      difficulty: contentSim?.difficulty
    }

    // Check alignment
    if (!contentSim) {
      issues.push({
        characterId,
        libId: libSim?.id,
        issueType: 'missing_in_content',
        details: `Character "${characterId}" has simulation in lib/ but not in content/`,
        severity: 'warning'
      })
    } else if (!libSim) {
      issues.push({
        characterId,
        contentId: contentSim.id,
        issueType: 'missing_in_lib',
        details: `Character "${characterId}" has simulation in content/ but not in lib/`,
        severity: 'warning'
      })
    } else {
      // Both exist — check for ID mismatch (expected divergence)
      if (contentSim.id !== libSim.id) {
        issues.push({
          characterId,
          contentId: contentSim.id,
          libId: libSim.id,
          issueType: 'id_mismatch',
          details: `ID mismatch: content="${contentSim.id}" vs lib="${libSim.id}"`,
          severity: 'warning'
        })
      } else {
        entry.aligned = true
      }
    }

    map.push(entry)
  }

  return { map, issues }
}

// ═══════════════════════════════════════════════════════════════════════════
// ENTRY NODE VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate that entry nodes exist in their respective character graphs.
 * Requires a map of characterId -> DialogueGraph.
 */
export function validateEntryNodes(
  graphs: Map<string, DialogueGraph>
): EntryNodeIssue[] {
  const issues: EntryNodeIssue[] = []

  for (const sim of LIB_REGISTRY) {
    const graph = graphs.get(sim.characterId)

    if (!graph) {
      // Graph not provided — can't validate
      continue
    }

    if (!graph.nodes.has(sim.entryNodeId)) {
      issues.push({
        simulationId: sim.id,
        characterId: sim.characterId,
        entryNodeId: sim.entryNodeId,
        issueType: 'missing_entry_node',
        details: `Entry node "${sim.entryNodeId}" does not exist in ${sim.characterId} graph`
      })
    }
  }

  return issues
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE/DIFFICULTY VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate that all simulations in content/ have phase and difficulty defined.
 */
export function validatePhaseAndDifficulty(): SimulationAlignmentIssue[] {
  const issues: SimulationAlignmentIssue[] = []

  for (const sim of CONTENT_REGISTRY) {
    if (sim.phase === undefined || sim.phase === null) {
      issues.push({
        characterId: sim.characterId,
        contentId: sim.id,
        issueType: 'phase_mismatch',
        details: `Simulation "${sim.id}" is missing phase`,
        severity: 'error'
      })
    }

    if (!sim.difficulty) {
      issues.push({
        characterId: sim.characterId,
        contentId: sim.id,
        issueType: 'difficulty_mismatch',
        details: `Simulation "${sim.id}" is missing difficulty`,
        severity: 'error'
      })
    }
  }

  return issues
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Run all simulation validators.
 */
export function validateSimulations(
  graphs?: Map<string, DialogueGraph>
): SimulationValidationResult {
  const { map, issues: alignmentIssues } = buildSimulationAlignmentMap()
  const phaseIssues = validatePhaseAndDifficulty()
  const entryNodeIssues = graphs ? validateEntryNodes(graphs) : []

  const allAlignmentIssues = [...alignmentIssues, ...phaseIssues]

  const errorCount = allAlignmentIssues.filter(i => i.severity === 'error').length + entryNodeIssues.length
  const warningCount = allAlignmentIssues.filter(i => i.severity === 'warning').length

  const alignedCount = map.filter(m => m.aligned).length
  const totalCount = map.length

  const valid = errorCount === 0

  return {
    valid,
    alignmentIssues: allAlignmentIssues,
    entryNodeIssues,
    alignmentMap: map,
    summary: `Simulations: ${alignedCount}/${totalCount} aligned, ${errorCount} errors, ${warningCount} warnings`
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS FOR CONVENIENCE
// ═══════════════════════════════════════════════════════════════════════════

export { CONTENT_REGISTRY, LIB_REGISTRY }
