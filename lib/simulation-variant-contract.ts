/**
 * Simulation Variant Contract
 *
 * Canonical contract for graph-level simulation variants (`simulation.variantId`).
 * This complements `SIMULATION_ID_MAP`:
 * - `SIMULATION_ID_MAP` remains the stable phase-1 registry binding
 * - this contract defines multi-phase variant progression
 */

import type { SimulationDifficulty, SimulationPhase } from './dialogue-graph'
import type { CharacterId } from './graph-registry'

export interface SimulationVariantContractEntry {
  characterId: CharacterId
  phase: SimulationPhase
  difficulty: SimulationDifficulty
  variantId: string
  nodeId: string
}

const SIMULATION_VARIANT_CONTRACT_RAW: SimulationVariantContractEntry[] = [
  // Dante
  {
    characterId: 'dante',
    phase: 1,
    difficulty: 'introduction',
    variantId: 'dante_active_listening_phase1',
    nodeId: 'dante_simulation_phase1',
  },
  {
    characterId: 'dante',
    phase: 2,
    difficulty: 'application',
    variantId: 'dante_ethical_persuasion_phase2',
    nodeId: 'dante_simulation_phase2',
  },
  {
    characterId: 'dante',
    phase: 3,
    difficulty: 'mastery',
    variantId: 'dante_authentic_pitch_phase3',
    nodeId: 'dante_simulation_phase3',
  },

  // Devon
  {
    characterId: 'devon',
    phase: 1,
    difficulty: 'introduction',
    variantId: 'devon_hvac_debug_phase1',
    nodeId: 'devon_simulation_phase1',
  },
  {
    characterId: 'devon',
    phase: 2,
    difficulty: 'application',
    variantId: 'devon_life_support_phase2',
    nodeId: 'devon_simulation_phase2',
  },
  {
    characterId: 'devon',
    phase: 3,
    difficulty: 'mastery',
    variantId: 'devon_human_system_phase3',
    nodeId: 'devon_simulation_phase3',
  },

  // Isaiah
  {
    characterId: 'isaiah',
    phase: 1,
    difficulty: 'introduction',
    variantId: 'isaiah_donor_cultivation_phase1',
    nodeId: 'isaiah_simulation_phase1',
  },
  {
    characterId: 'isaiah',
    phase: 2,
    difficulty: 'application',
    variantId: 'isaiah_emergency_ask_phase2',
    nodeId: 'isaiah_simulation_phase2',
  },
  {
    characterId: 'isaiah',
    phase: 3,
    difficulty: 'mastery',
    variantId: 'isaiah_marcus_memorial_phase3',
    nodeId: 'isaiah_simulation_phase3',
  },

  // Jordan
  {
    characterId: 'jordan',
    phase: 1,
    difficulty: 'introduction',
    variantId: 'jordan_choice_paralysis_phase1',
    nodeId: 'jordan_simulation_phase1',
  },
  {
    characterId: 'jordan',
    phase: 2,
    difficulty: 'application',
    variantId: 'jordan_industry_pivot_phase2',
    nodeId: 'jordan_simulation_phase2',
  },
  {
    characterId: 'jordan',
    phase: 3,
    difficulty: 'mastery',
    variantId: 'jordan_unanswerable_phase3',
    nodeId: 'jordan_simulation_phase3',
  },

  // Nadia
  {
    characterId: 'nadia',
    phase: 1,
    difficulty: 'introduction',
    variantId: 'nadia_bias_detection_phase1',
    nodeId: 'nadia_simulation_phase1',
  },
  {
    characterId: 'nadia',
    phase: 2,
    difficulty: 'application',
    variantId: 'nadia_ethical_constraints_phase2',
    nodeId: 'nadia_simulation_phase2',
  },
  {
    characterId: 'nadia',
    phase: 3,
    difficulty: 'mastery',
    variantId: 'nadia_whistleblower_phase3',
    nodeId: 'nadia_simulation_phase3',
  },
]

export const SIMULATION_VARIANT_CONTRACT: SimulationVariantContractEntry[] =
  SIMULATION_VARIANT_CONTRACT_RAW.slice().sort((a, b) => {
    if (a.characterId !== b.characterId) {
      return a.characterId.localeCompare(b.characterId)
    }
    if (a.phase !== b.phase) return a.phase - b.phase
    return a.variantId.localeCompare(b.variantId)
  })

export function getSimulationVariantContractByCharacter(
  characterId: CharacterId
): SimulationVariantContractEntry[] {
  return SIMULATION_VARIANT_CONTRACT.filter((entry) => entry.characterId === characterId)
}

export function getSimulationVariantContractEntry(
  variantId: string
): SimulationVariantContractEntry | undefined {
  return SIMULATION_VARIANT_CONTRACT.find((entry) => entry.variantId === variantId)
}

