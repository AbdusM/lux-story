/**
 * Ceremony System Tests
 *
 * Tests for Samuel's recognition ceremonies.
 */

import { describe, it, expect } from 'vitest'
import {
  CEREMONY_REGISTRY,
  getCeremonyById,
  getCeremoniesByType,
  getCeremonyByTriggerId,
  createDefaultCeremonyState,
  isCeremonyCompleted,
  completeCeremony,
  setPendingCeremony,
  isCeremonyCooldownActive,
  findEligibleCeremonies,
  getNextCeremony,
  getBackdropClasses,
  getLightingClasses,
  getCeremonyTypeName,
  CEREMONY_COOLDOWN
} from '@/lib/ranking/ceremonies'
import type { CeremonyState, CeremonyType } from '@/lib/ranking/types'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const createState = (overrides: Partial<CeremonyState> = {}): CeremonyState => ({
  completedCeremonies: [],
  pendingCeremony: null,
  ceremonyHistory: [],
  lastCeremonyAt: null,
  ...overrides
})

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Ceremony Registry', () => {
  it('has expected number of ceremonies', () => {
    expect(CEREMONY_REGISTRY.length).toBeGreaterThanOrEqual(7)
  })

  it('all ceremonies have required fields', () => {
    for (const ceremony of CEREMONY_REGISTRY) {
      expect(ceremony.id).toBeDefined()
      expect(ceremony.type).toBeDefined()
      expect(ceremony.name).toBeDefined()
      expect(ceremony.triggerId).toBeDefined()
      expect(ceremony.priority).toBeDefined()
      expect(ceremony.presentation).toBeDefined()
      expect(ceremony.dialogue).toBeDefined()
    }
  })

  it('all ceremonies have complete dialogue', () => {
    for (const ceremony of CEREMONY_REGISTRY) {
      expect(ceremony.dialogue.opening).toBeDefined()
      expect(ceremony.dialogue.recognition).toBeDefined()
      expect(ceremony.dialogue.reflection).toBeDefined()
      expect(ceremony.dialogue.blessing).toBeDefined()
    }
  })

  it('has unique ceremony IDs', () => {
    const ids = CEREMONY_REGISTRY.map(c => c.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(uniqueIds.size)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// LOOKUP TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getCeremonyById', () => {
  it('returns ceremony for valid ID', () => {
    const ceremony = getCeremonyById('ceremony_passenger')
    expect(ceremony).toBeDefined()
    expect(ceremony?.id).toBe('ceremony_passenger')
    expect(ceremony?.name).toBe('Passenger Recognition')
  })

  it('returns undefined for invalid ID', () => {
    const ceremony = getCeremonyById('invalid_id')
    expect(ceremony).toBeUndefined()
  })
})

describe('getCeremoniesByType', () => {
  it('returns ceremonies for rank_promotion', () => {
    const ceremonies = getCeremoniesByType('rank_promotion')
    expect(ceremonies.length).toBeGreaterThanOrEqual(4)
    expect(ceremonies.every(c => c.type === 'rank_promotion')).toBe(true)
  })

  it('returns ceremonies for elite_induction', () => {
    const ceremonies = getCeremoniesByType('elite_induction')
    expect(ceremonies.length).toBeGreaterThanOrEqual(1)
  })

  it('returns empty array for non-existent type', () => {
    const ceremonies = getCeremoniesByType('non_existent' as CeremonyType)
    expect(ceremonies).toEqual([])
  })
})

describe('getCeremonyByTriggerId', () => {
  it('returns ceremony for valid trigger', () => {
    const ceremony = getCeremonyByTriggerId('pm_passenger')
    expect(ceremony).toBeDefined()
    expect(ceremony?.id).toBe('ceremony_passenger')
  })

  it('returns undefined for invalid trigger', () => {
    const ceremony = getCeremonyByTriggerId('invalid_trigger')
    expect(ceremony).toBeUndefined()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('createDefaultCeremonyState', () => {
  it('creates empty state', () => {
    const state = createDefaultCeremonyState()
    expect(state.completedCeremonies).toEqual([])
    expect(state.pendingCeremony).toBeNull()
    expect(state.ceremonyHistory).toEqual([])
    expect(state.lastCeremonyAt).toBeNull()
  })
})

describe('isCeremonyCompleted', () => {
  it('returns false for incomplete ceremony', () => {
    const state = createState()
    expect(isCeremonyCompleted(state, 'ceremony_passenger')).toBe(false)
  })

  it('returns true for completed ceremony', () => {
    const state = createState({
      completedCeremonies: ['ceremony_passenger']
    })
    expect(isCeremonyCompleted(state, 'ceremony_passenger')).toBe(true)
  })
})

describe('completeCeremony', () => {
  const now = 1700000000000

  it('adds ceremony to completed list', () => {
    const state = createState()
    const newState = completeCeremony(state, 'ceremony_passenger', undefined, now)

    expect(newState.completedCeremonies).toContain('ceremony_passenger')
  })

  it('adds to ceremony history', () => {
    const state = createState()
    const newState = completeCeremony(state, 'ceremony_passenger', 'response_1', now)

    expect(newState.ceremonyHistory).toHaveLength(1)
    expect(newState.ceremonyHistory[0].ceremonyId).toBe('ceremony_passenger')
    expect(newState.ceremonyHistory[0].playerResponseId).toBe('response_1')
    expect(newState.ceremonyHistory[0].completedAt).toBe(now)
  })

  it('sets lastCeremonyAt', () => {
    const state = createState()
    const newState = completeCeremony(state, 'ceremony_passenger', undefined, now)

    expect(newState.lastCeremonyAt).toBe(now)
  })

  it('clears pending ceremony', () => {
    const state = createState({ pendingCeremony: 'ceremony_passenger' })
    const newState = completeCeremony(state, 'ceremony_passenger', undefined, now)

    expect(newState.pendingCeremony).toBeNull()
  })
})

describe('setPendingCeremony', () => {
  it('sets pending ceremony', () => {
    const state = createState()
    const newState = setPendingCeremony(state, 'ceremony_passenger')

    expect(newState.pendingCeremony).toBe('ceremony_passenger')
  })

  it('clears pending ceremony with null', () => {
    const state = createState({ pendingCeremony: 'ceremony_passenger' })
    const newState = setPendingCeremony(state, null)

    expect(newState.pendingCeremony).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// COOLDOWN TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('isCeremonyCooldownActive', () => {
  it('returns false when no last ceremony', () => {
    const state = createState()
    expect(isCeremonyCooldownActive(state)).toBe(false)
  })

  it('returns true during cooldown period', () => {
    const now = Date.now()
    const recentCeremony = now - (CEREMONY_COOLDOWN / 2) // Half cooldown ago
    const state = createState({ lastCeremonyAt: recentCeremony })

    expect(isCeremonyCooldownActive(state, now)).toBe(true)
  })

  it('returns false after cooldown expires', () => {
    const now = Date.now()
    const oldCeremony = now - (CEREMONY_COOLDOWN + 1000) // After cooldown
    const state = createState({ lastCeremonyAt: oldCeremony })

    expect(isCeremonyCooldownActive(state, now)).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// ELIGIBILITY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('findEligibleCeremonies', () => {
  it('returns ceremonies matching trigger IDs', () => {
    const state = createState()
    const eligible = findEligibleCeremonies(state, ['pm_passenger', 'pm_regular'])

    expect(eligible.length).toBe(2)
    expect(eligible.some(c => c.id === 'ceremony_passenger')).toBe(true)
    expect(eligible.some(c => c.id === 'ceremony_regular')).toBe(true)
  })

  it('excludes completed one-time ceremonies', () => {
    const state = createState({
      completedCeremonies: ['ceremony_passenger']
    })
    const eligible = findEligibleCeremonies(state, ['pm_passenger', 'pm_regular'])

    expect(eligible.length).toBe(1)
    expect(eligible[0].id).toBe('ceremony_regular')
  })

  it('sorts by priority (highest first)', () => {
    const state = createState()
    const eligible = findEligibleCeremonies(state, ['pm_passenger', 'pm_stationmaster'])

    expect(eligible[0].id).toBe('ceremony_stationmaster') // Priority 100
    expect(eligible[1].id).toBe('ceremony_passenger')     // Priority 80
  })

  it('returns empty array for no matches', () => {
    const state = createState()
    const eligible = findEligibleCeremonies(state, ['invalid_trigger'])

    expect(eligible).toEqual([])
  })
})

describe('getNextCeremony', () => {
  it('returns pending ceremony if exists', () => {
    const state = createState({ pendingCeremony: 'ceremony_regular' })
    const next = getNextCeremony(state, ['pm_passenger'])

    expect(next?.id).toBe('ceremony_regular')
  })

  it('returns highest priority eligible ceremony', () => {
    const state = createState()
    const next = getNextCeremony(state, ['pm_passenger', 'pm_conductor'])

    expect(next?.id).toBe('ceremony_conductor') // Higher priority
  })

  it('returns null during cooldown', () => {
    const now = Date.now()
    const state = createState({ lastCeremonyAt: now - 1000 }) // 1 second ago
    const next = getNextCeremony(state, ['pm_passenger'], now)

    expect(next).toBeNull()
  })

  it('returns null when no eligible ceremonies', () => {
    const state = createState()
    const next = getNextCeremony(state, [])

    expect(next).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY HELPER TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getBackdropClasses', () => {
  it('returns classes for all backdrop types', () => {
    expect(getBackdropClasses('station_platform')).toContain('bg-gradient')
    expect(getBackdropClasses('private_office')).toContain('bg-gradient')
    expect(getBackdropClasses('grand_hall')).toContain('indigo')
    expect(getBackdropClasses('constellation_view')).toContain('slate-950')
  })
})

describe('getLightingClasses', () => {
  it('returns classes for all lighting types', () => {
    expect(getLightingClasses('warm')).toContain('amber')
    expect(getLightingClasses('cool')).toContain('blue')
    expect(getLightingClasses('dramatic')).toContain('purple')
    expect(getLightingClasses('soft')).toContain('slate')
  })
})

describe('getCeremonyTypeName', () => {
  it('returns name for all ceremony types', () => {
    expect(getCeremonyTypeName('rank_promotion')).toBe('Rank Promotion')
    expect(getCeremonyTypeName('champion_recognition')).toBe('Champion Recognition')
    expect(getCeremonyTypeName('elite_induction')).toBe('Elite Recognition')
    expect(getCeremonyTypeName('milestone_celebration')).toBe('Milestone Celebration')
    expect(getCeremonyTypeName('resonance_event')).toBe('Resonance Event')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// DIALOGUE CONTENT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Ceremony Dialogue', () => {
  it('passenger ceremony has complete dialogue', () => {
    const ceremony = getCeremonyById('ceremony_passenger')
    expect(ceremony?.dialogue.opening).toContain('Wait')
    expect(ceremony?.dialogue.recognition).toContain('watching')
    expect(ceremony?.dialogue.blessing).toContain('Passenger')
  })

  it('stationmaster ceremony has complete dialogue', () => {
    const ceremony = getCeremonyById('ceremony_stationmaster')
    expect(ceremony?.dialogue.opening).toContain('constellations')
    expect(ceremony?.dialogue.recognition).toContain('light')
    expect(ceremony?.dialogue.blessing).toContain('universe')
  })

  it('ceremonies have player responses with patterns', () => {
    const ceremony = getCeremonyById('ceremony_passenger')
    expect(ceremony?.dialogue.responses).toBeDefined()
    expect(ceremony?.dialogue.responses?.length).toBeGreaterThanOrEqual(3)

    const response = ceremony?.dialogue.responses?.[0]
    expect(response?.text).toBeDefined()
    expect(response?.samuelReply).toBeDefined()
    expect(response?.patterns).toBeDefined()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('getCeremonyById completes quickly', () => {
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      getCeremonyById('ceremony_passenger')
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(50)
  })

  it('findEligibleCeremonies completes quickly', () => {
    const state = createState()
    const triggers = ['pm_passenger', 'pm_regular', 'pm_conductor', 'pm_stationmaster']

    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      findEligibleCeremonies(state, triggers)
    }
    const duration = performance.now() - start

    expect(duration).toBeLessThan(50)
  })
})
