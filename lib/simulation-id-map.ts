/**
 * Simulation ID Map
 * Canonical source of truth for simulation IDs across registries
 *
 * This map ties together:
 * - content/simulation-registry.ts (God Mode "pure form" IDs + contexts)
 * - lib/simulation-registry.ts (narrative meta + entryNodeId)
 *
 * RULE: Both registries MUST use IDs from this map. If you need to add a
 * new simulation, add it here first.
 */

import { CharacterId } from './graph-registry'
import { SimulationPhase, SimulationDifficulty } from './dialogue-graph'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SimulationIdEntry {
  /** Character this simulation belongs to */
  characterId: CharacterId
  /** ID used in content/simulation-registry.ts (God Mode) */
  contentId: string
  /** ID used in lib/simulation-registry.ts (narrative meta) */
  libId: string
  /** Phase (shared across both registries) */
  phase: SimulationPhase
  /** Difficulty (shared across both registries) */
  difficulty: SimulationDifficulty
}

// ═══════════════════════════════════════════════════════════════════════════
// CANONICAL MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The single source of truth for simulation IDs.
 * Key: characterId
 * Value: ID entry with both content and lib IDs
 *
 * NOTE: contentId and libId are now unified.
 * If divergence reappears, treat it as a regression.
 */
export const SIMULATION_ID_MAP: Record<CharacterId, SimulationIdEntry> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // CORE CHARACTERS
  // ═══════════════════════════════════════════════════════════════════════════
  maya: {
    characterId: 'maya',
    contentId: 'maya_servo_debugger',
    libId: 'maya_servo_debugger',
    phase: 1,
    difficulty: 'introduction'
  },
  grace: {
    characterId: 'grace',
    contentId: 'grace_diagnostics',
    libId: 'grace_diagnostics',
    phase: 1,
    difficulty: 'introduction'
  },
  tess: {
    characterId: 'tess',
    contentId: 'tess_botany',
    libId: 'tess_botany',
    phase: 1,
    difficulty: 'introduction'
  },
  alex: {
    characterId: 'alex',
    contentId: 'alex_negotiation',
    libId: 'alex_negotiation',
    phase: 1,
    difficulty: 'introduction'
  },
  yaquin: {
    characterId: 'yaquin',
    contentId: 'yaquin_timeline',
    libId: 'yaquin_timeline',
    phase: 1,
    difficulty: 'introduction'
  },
  devon: {
    characterId: 'devon',
    contentId: 'devon_logic',
    libId: 'devon_logic',
    phase: 1,
    difficulty: 'introduction'
  },
  jordan: {
    characterId: 'jordan',
    contentId: 'jordan_structural',
    libId: 'jordan_structural',
    phase: 1,
    difficulty: 'introduction'
  },
  marcus: {
    characterId: 'marcus',
    contentId: 'marcus_triage',
    libId: 'marcus_triage',
    phase: 1,
    difficulty: 'introduction'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECONDARY CHARACTERS
  // ═══════════════════════════════════════════════════════════════════════════
  kai: {
    characterId: 'kai',
    contentId: 'kai_blueprint',
    libId: 'kai_blueprint',
    phase: 1,
    difficulty: 'introduction'
  },
  rohan: {
    characterId: 'rohan',
    contentId: 'rohan_nav',
    libId: 'rohan_nav',
    phase: 1,
    difficulty: 'introduction'
  },
  silas: {
    characterId: 'silas',
    contentId: 'silas_soil',
    libId: 'silas_soil',
    phase: 1,
    difficulty: 'introduction'
  },
  elena: {
    characterId: 'elena',
    contentId: 'elena_market',
    libId: 'elena_market',
    phase: 1,
    difficulty: 'introduction'
  },
  asha: {
    characterId: 'asha',
    contentId: 'asha_mural',
    libId: 'asha_mural',
    phase: 1,
    difficulty: 'introduction'
  },
  lira: {
    characterId: 'lira',
    contentId: 'lira_audio',
    libId: 'lira_audio',
    phase: 1,
    difficulty: 'introduction'
  },
  zara: {
    characterId: 'zara',
    contentId: 'zara_audit',
    libId: 'zara_audit',
    phase: 1,
    difficulty: 'introduction'
  },
  samuel: {
    characterId: 'samuel',
    contentId: 'samuel_ops',
    libId: 'samuel_ops',
    phase: 1,
    difficulty: 'introduction'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LINKEDIN 2026 CHARACTERS (IDs already aligned)
  // ═══════════════════════════════════════════════════════════════════════════
  quinn: {
    characterId: 'quinn',
    contentId: 'quinn_pitch',
    libId: 'quinn_pitch',
    phase: 1,
    difficulty: 'introduction'
  },
  dante: {
    characterId: 'dante',
    contentId: 'dante_pitch',
    libId: 'dante_pitch',
    phase: 1,
    difficulty: 'introduction'
  },
  nadia: {
    characterId: 'nadia',
    contentId: 'nadia_news',
    libId: 'nadia_news',
    phase: 1,
    difficulty: 'introduction'
  },
  isaiah: {
    characterId: 'isaiah',
    contentId: 'isaiah_logistics',
    libId: 'isaiah_logistics',
    phase: 1,
    difficulty: 'introduction'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NON-CHARACTER ENTRIES (station locations - no simulations)
  // ═══════════════════════════════════════════════════════════════════════════
  station_entry: {
    characterId: 'station_entry',
    contentId: '',
    libId: '',
    phase: 1,
    difficulty: 'introduction'
  },
  grand_hall: {
    characterId: 'grand_hall',
    contentId: '',
    libId: '',
    phase: 1,
    difficulty: 'introduction'
  },
  market: {
    characterId: 'market',
    contentId: '',
    libId: '',
    phase: 1,
    difficulty: 'introduction'
  },
  deep_station: {
    characterId: 'deep_station',
    contentId: '',
    libId: '',
    phase: 1,
    difficulty: 'introduction'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get simulation ID entry for a character.
 */
export function getSimulationIds(characterId: CharacterId): SimulationIdEntry | undefined {
  return SIMULATION_ID_MAP[characterId]
}

/**
 * Get content registry ID for a character.
 */
export function getContentSimulationId(characterId: CharacterId): string | undefined {
  return SIMULATION_ID_MAP[characterId]?.contentId || undefined
}

/**
 * Get lib registry ID for a character.
 */
export function getLibSimulationId(characterId: CharacterId): string | undefined {
  return SIMULATION_ID_MAP[characterId]?.libId || undefined
}

/**
 * Check if a character has a simulation defined.
 */
export function hasSimulation(characterId: CharacterId): boolean {
  const entry = SIMULATION_ID_MAP[characterId]
  return !!entry && !!entry.contentId && !!entry.libId
}

/**
 * Get all character IDs that have simulations.
 */
export function getCharactersWithSimulations(): CharacterId[] {
  return (Object.keys(SIMULATION_ID_MAP) as CharacterId[]).filter(hasSimulation)
}

/**
 * Check if IDs are aligned for a character.
 */
export function areIdsAligned(characterId: CharacterId): boolean {
  const entry = SIMULATION_ID_MAP[characterId]
  return !!entry && entry.contentId === entry.libId
}

/**
 * Get all characters with misaligned IDs.
 */
export function getMisalignedCharacters(): CharacterId[] {
  return getCharactersWithSimulations().filter(id => !areIdsAligned(id))
}
