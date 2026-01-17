/**
 * Simulation ID Drift Detection Tests
 * Ensures content/ and lib/ simulation registries stay aligned with the canonical map.
 *
 * These tests FAIL if IDs drift, forcing developers to update SIMULATION_ID_MAP first.
 */

import { describe, it, expect } from 'vitest'
import { SIMULATION_ID_MAP, getCharactersWithSimulations, getMisalignedCharacters } from '@/lib/simulation-id-map'
import { SIMULATION_REGISTRY as CONTENT_REGISTRY } from '@/content/simulation-registry'
import { SIMULATION_REGISTRY as LIB_REGISTRY } from '@/lib/simulation-registry'

// ═══════════════════════════════════════════════════════════════════════════
// ID ALIGNMENT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Simulation ID alignment', () => {
  it('content registry IDs match canonical map', () => {
    const errors: string[] = []

    for (const sim of CONTENT_REGISTRY) {
      const expected = SIMULATION_ID_MAP[sim.characterId as keyof typeof SIMULATION_ID_MAP]?.contentId
      if (expected && sim.id !== expected) {
        errors.push(`${sim.characterId}: expected "${expected}", got "${sim.id}"`)
      }
    }

    if (errors.length > 0) {
      throw new Error(
        `Content registry IDs do not match SIMULATION_ID_MAP:\n` +
        errors.map(e => `  - ${e}`).join('\n') +
        `\n\nTo fix: Update SIMULATION_ID_MAP in lib/simulation-id-map.ts or fix the registry ID.`
      )
    }
  })

  it('lib registry IDs match canonical map', () => {
    const errors: string[] = []

    for (const sim of LIB_REGISTRY) {
      const expected = SIMULATION_ID_MAP[sim.characterId]?.libId
      if (expected && sim.id !== expected) {
        errors.push(`${sim.characterId}: expected "${expected}", got "${sim.id}"`)
      }
    }

    if (errors.length > 0) {
      throw new Error(
        `Lib registry IDs do not match SIMULATION_ID_MAP:\n` +
        errors.map(e => `  - ${e}`).join('\n') +
        `\n\nTo fix: Update SIMULATION_ID_MAP in lib/simulation-id-map.ts or fix the registry ID.`
      )
    }
  })

  it('all characters with simulations are in both registries', () => {
    const charactersWithSims = getCharactersWithSimulations()
    const contentCharacters = new Set(CONTENT_REGISTRY.map(s => s.characterId))
    const libCharacters = new Set(LIB_REGISTRY.map(s => s.characterId))

    const missingFromContent = charactersWithSims.filter(c => !contentCharacters.has(c))
    const missingFromLib = charactersWithSims.filter(c => !libCharacters.has(c))

    const errors: string[] = []

    if (missingFromContent.length > 0) {
      errors.push(`Missing from content/simulation-registry: ${missingFromContent.join(', ')}`)
    }
    if (missingFromLib.length > 0) {
      errors.push(`Missing from lib/simulation-registry: ${missingFromLib.join(', ')}`)
    }

    if (errors.length > 0) {
      throw new Error(
        `Registry coverage mismatch:\n` +
        errors.map(e => `  - ${e}`).join('\n')
      )
    }
  })

  it('both registries have same number of simulations', () => {
    expect(CONTENT_REGISTRY.length).toBe(LIB_REGISTRY.length)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// MISALIGNMENT REPORTING
// ═══════════════════════════════════════════════════════════════════════════

describe('Misalignment reporting', () => {
  it('reports misaligned characters (informational)', () => {
    const misaligned = getMisalignedCharacters()

    // This test is informational — it passes but logs misalignments
    if (misaligned.length > 0) {
      console.log(
        `\n📊 Characters with different IDs in content/ vs lib/ registries:\n` +
        misaligned.map(c => {
          const entry = SIMULATION_ID_MAP[c]
          return `  - ${c}: content="${entry.contentId}" vs lib="${entry.libId}"`
        }).join('\n') +
        `\n\nThis is expected for historical reasons. IDs will be unified over time.`
      )
    }

    // Always passes — this is just for visibility
    expect(true).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// CANONICAL MAP INTEGRITY
// ═══════════════════════════════════════════════════════════════════════════

describe('Canonical map integrity', () => {
  it('all entries have required fields', () => {
    for (const [characterId, entry] of Object.entries(SIMULATION_ID_MAP)) {
      // Skip non-character entries (station locations)
      if (!entry.contentId && !entry.libId) continue

      expect(entry.characterId).toBe(characterId)
      expect(entry.phase).toBeGreaterThanOrEqual(1)
      expect(entry.phase).toBeLessThanOrEqual(3)
      expect(['introduction', 'application', 'mastery']).toContain(entry.difficulty)
    }
  })

  it('has entries for all 20 character simulations', () => {
    const charactersWithSims = getCharactersWithSimulations()
    expect(charactersWithSims.length).toBe(20)
  })
})
