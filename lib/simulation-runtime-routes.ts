import { SIMULATION_VARIANT_CONTRACT } from './simulation-variant-contract'

/**
 * Phase 2/3 setup nodes are entered by simulation runtime flow, not by static graph edges.
 * They appear unreachable in raw graph analysis even when they are intentionally shipped.
 */
export function getRuntimeRoutedSimulationSetupNodeIds(): Set<string> {
  const runtimeRouted = new Set<string>()

  for (const entry of SIMULATION_VARIANT_CONTRACT) {
    if (entry.phase < 2) continue
    runtimeRouted.add(`${entry.characterId}/${entry.nodeId}_setup`)
  }

  return runtimeRouted
}
