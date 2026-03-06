import { describe, expect, it } from 'vitest'
import { DIALOGUE_GRAPHS } from '@/lib/graph-registry'
import { getRuntimeRoutedSimulationSetupNodeIds } from '@/lib/simulation-runtime-routes'

const EXPECTED_RUNTIME_ROUTED_SETUP_IDS = [
  'dante/dante_simulation_phase2_setup',
  'dante/dante_simulation_phase3_setup',
  'devon/devon_simulation_phase2_setup',
  'devon/devon_simulation_phase3_setup',
  'isaiah/isaiah_simulation_phase2_setup',
  'isaiah/isaiah_simulation_phase3_setup',
  'jordan/jordan_simulation_phase2_setup',
  'jordan/jordan_simulation_phase3_setup',
  'nadia/nadia_simulation_phase2_setup',
  'nadia/nadia_simulation_phase3_setup',
] as const

describe('simulation runtime routes', () => {
  it('returns the expected phase 2/3 runtime-routed setup nodes', () => {
    const runtimeRoutedIds = [...getRuntimeRoutedSimulationSetupNodeIds()].sort()
    expect(runtimeRoutedIds).toEqual([...EXPECTED_RUNTIME_ROUTED_SETUP_IDS])
  })

  it('points only to setup nodes that exist in shipped graphs', () => {
    const missingNodes = EXPECTED_RUNTIME_ROUTED_SETUP_IDS.filter((entry) => {
      const [characterId, nodeId] = entry.split('/')
      return !DIALOGUE_GRAPHS[characterId as keyof typeof DIALOGUE_GRAPHS].nodes.has(nodeId)
    })

    expect(missingNodes).toEqual([])
  })
})
