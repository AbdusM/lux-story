import { describe, expect, it } from 'vitest'
import {
  extractMicroMemoryTags,
  recordMicroMemories,
  resolveMicroCallbackEcho,
  type MicroReactivityRuntimeState,
} from '@/lib/micro-reactivity'

function emptyRuntime(): MicroReactivityRuntimeState {
  return { memories: {}, callbackHistory: {} }
}

describe('micro reactivity', () => {
  it('extracts set and callback tags deterministically', () => {
    const parsed = extractMicroMemoryTags([
      'mystery',
      'micro:maya_competition_memory',
      'micro-callback:maya_competition_memory',
      'micro:maya_competition_memory',
    ])

    expect(parsed.memorySetIds).toEqual(['maya_competition_memory'])
    expect(parsed.callbackIds).toEqual(['maya_competition_memory'])
  })

  it('records micro memories into global flags and runtime state', () => {
    const globalFlags = new Set<string>()
    const recorded = recordMicroMemories({
      runtimeState: emptyRuntime(),
      globalFlags,
      memorySetIds: ['devon_father_memory'],
      characterId: 'devon',
      currentTurn: 14,
    })

    expect(globalFlags.has('micro:devon_father_memory')).toBe(true)
    expect(recorded.newlyRecorded).toEqual(['devon_father_memory'])
    expect(recorded.runtimeState.memories.devon_father_memory?.setAtTurn).toBe(14)
  })

  it('enforces delay and anti-spam caps on callback echoes', () => {
    const globalFlags = new Set<string>(['micro:maya_competition_memory'])
    const runtime: MicroReactivityRuntimeState = {
      memories: {
        maya_competition_memory: {
          setAtTurn: 10,
          sourceCharacter: 'maya',
        },
      },
      callbackHistory: {},
    }

    const tooSoon = resolveMicroCallbackEcho({
      runtimeState: runtime,
      globalFlags,
      callbackIds: ['maya_competition_memory'],
      characterId: 'maya',
      currentTurn: 11,
    })
    expect(tooSoon.echo).toBeNull()

    const allowed = resolveMicroCallbackEcho({
      runtimeState: runtime,
      globalFlags,
      callbackIds: ['maya_competition_memory'],
      characterId: 'maya',
      currentTurn: 13,
    })
    expect(allowed.echo).not.toBeNull()

    const capped = resolveMicroCallbackEcho({
      runtimeState: allowed.runtimeState,
      globalFlags,
      callbackIds: ['maya_competition_memory'],
      characterId: 'maya',
      currentTurn: 30,
    })
    expect(capped.echo).toBeNull()
  })
})

