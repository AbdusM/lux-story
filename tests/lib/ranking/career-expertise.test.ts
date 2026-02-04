/**
 * Career Expertise Tests
 *
 * Tests for the domain expertise calculation system.
 */

import { describe, it, expect } from 'vitest'
import {
  CHARACTER_DOMAIN_MAP,
  EXCLUDED_CHARACTERS,
  DOMAIN_DISPLAY,
  EXPERTISE_TIER_NAMES,
  getCharactersForDomain,
  getDomainForCharacter,
  calculateDomainPoints,
  calculateCareerExpertiseState,
  getDomainTierName,
  isChampionInDomain,
  getSamuelExpertiseMessage
} from '@/lib/ranking/career-expertise'
import type { CareerExpertiseInput } from '@/lib/ranking/career-expertise'
import { CAREER_DOMAINS } from '@/lib/ranking/types'
import { CHARACTER_IDS } from '@/lib/graph-registry'
import { TRUST_THRESHOLDS } from '@/lib/constants'

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const makeInput = (overrides: Partial<CareerExpertiseInput> = {}): CareerExpertiseInput => ({
  characterTrust: {},
  completedArcs: [],
  skills: {},
  ...overrides
})

// ═══════════════════════════════════════════════════════════════════════════
// CHARACTER-DOMAIN MAPPING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Character-Domain Mapping', () => {
  it('maps 19 characters to 5 domains (all non-excluded)', () => {
    const mappedCharacters = Object.keys(CHARACTER_DOMAIN_MAP)
    // 24 total CHARACTER_IDS - 5 excluded (samuel + 4 locations) = 19
    expect(mappedCharacters.length).toBe(19)
  })

  it('each domain has at least 3 characters', () => {
    for (const domain of CAREER_DOMAINS) {
      const chars = getCharactersForDomain(domain)
      expect(chars.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('all non-excluded CharacterIds are mapped', () => {
    const allCharIds = CHARACTER_IDS.filter(id => !EXCLUDED_CHARACTERS.has(id))
    const mappedChars = new Set(Object.keys(CHARACTER_DOMAIN_MAP))

    for (const charId of allCharIds) {
      expect(mappedChars.has(charId)).toBe(true)
    }
  })

  it('excluded characters are not mapped', () => {
    for (const excluded of EXCLUDED_CHARACTERS) {
      expect(CHARACTER_DOMAIN_MAP[excluded]).toBeUndefined()
    }
  })

  it('getCharactersForDomain returns correct characters', () => {
    const techChars = getCharactersForDomain('technology')
    expect(techChars).toContain('maya')
    expect(techChars).toContain('devon')
    expect(techChars).toContain('rohan')
    expect(techChars).toContain('nadia')

    const healthChars = getCharactersForDomain('healthcare')
    expect(healthChars).toContain('marcus')
    expect(healthChars).toContain('grace')
    expect(healthChars).toContain('kai')
  })

  it('getDomainForCharacter returns correct domain', () => {
    expect(getDomainForCharacter('maya')).toBe('technology')
    expect(getDomainForCharacter('marcus')).toBe('healthcare')
    expect(getDomainForCharacter('quinn')).toBe('business')
    expect(getDomainForCharacter('lira')).toBe('creative')
    expect(getDomainForCharacter('tess')).toBe('social_impact')
  })

  it('getDomainForCharacter returns null for excluded characters', () => {
    expect(getDomainForCharacter('samuel')).toBeNull()
    expect(getDomainForCharacter('station_entry')).toBeNull()
    expect(getDomainForCharacter('grand_hall')).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// DOMAIN DISPLAY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Domain Display Info', () => {
  it('all domains have display info', () => {
    for (const domain of CAREER_DOMAINS) {
      expect(DOMAIN_DISPLAY[domain]).toBeDefined()
      expect(DOMAIN_DISPLAY[domain].name).toBeDefined()
      expect(DOMAIN_DISPLAY[domain].description).toBeDefined()
      expect(DOMAIN_DISPLAY[domain].iconVariant).toBeDefined()
    }
  })

  it('expertise tier names are defined', () => {
    expect(EXPERTISE_TIER_NAMES.length).toBe(6)
    expect(EXPERTISE_TIER_NAMES[0]).toBe('Curious')
    expect(EXPERTISE_TIER_NAMES[5]).toBe('Champion')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// POINT CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateDomainPoints', () => {
  it('returns 0 points for empty input', () => {
    const input = makeInput()
    const { points } = calculateDomainPoints('technology', input)
    expect(points).toBe(0)
  })

  it('awards points for trusted characters', () => {
    const input = makeInput({
      characterTrust: {
        maya: TRUST_THRESHOLDS.trusted,
        devon: TRUST_THRESHOLDS.trusted
      }
    })

    const { points, evidence } = calculateDomainPoints('technology', input)

    // 5 points per trusted character
    expect(points).toBe(10)
    expect(evidence.length).toBe(2)
    expect(evidence[0].type).toBe('trust_built')
  })

  it('does not award points for low trust characters', () => {
    const input = makeInput({
      characterTrust: {
        maya: 3 // Below threshold
      }
    })

    const { points } = calculateDomainPoints('technology', input)
    expect(points).toBe(0)
  })

  it('awards points for completed arcs', () => {
    const input = makeInput({
      completedArcs: ['maya_main', 'devon_insight']
    })

    const { points, evidence } = calculateDomainPoints('technology', input)

    // 8 points per arc
    expect(points).toBe(16)
    expect(evidence.filter(e => e.type === 'arc_completed').length).toBe(2)
  })

  it('only counts arcs for domain characters', () => {
    const input = makeInput({
      completedArcs: ['maya_main', 'marcus_main'] // marcus is healthcare
    })

    const { points } = calculateDomainPoints('technology', input)
    expect(points).toBe(8) // Only maya arc
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// STATE CALCULATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateCareerExpertiseState', () => {
  it('returns state for all domains', () => {
    const input = makeInput()
    const state = calculateCareerExpertiseState(input)

    expect(Object.keys(state.domains).length).toBe(5)
    for (const domain of CAREER_DOMAINS) {
      expect(state.domains[domain]).toBeDefined()
      expect(state.domains[domain].domain).toBe(domain)
    }
  })

  it('identifies primary domain', () => {
    const input = makeInput({
      characterTrust: {
        maya: TRUST_THRESHOLDS.trusted,
        devon: TRUST_THRESHOLDS.trusted
      }
    })

    const state = calculateCareerExpertiseState(input)
    expect(state.primaryDomain).toBe('technology')
  })

  it('calculates breadth correctly', () => {
    // Narrow: 0-1 domains with points
    const narrowState = calculateCareerExpertiseState(makeInput())
    expect(narrowState.breadth).toBe('narrow')

    // Moderate: 2-3 domains
    const moderateState = calculateCareerExpertiseState(makeInput({
      characterTrust: {
        maya: TRUST_THRESHOLDS.trusted,
        marcus: TRUST_THRESHOLDS.trusted
      }
    }))
    expect(moderateState.breadth).toBe('moderate')

    // Broad: 4+ domains
    const broadState = calculateCareerExpertiseState(makeInput({
      characterTrust: {
        maya: TRUST_THRESHOLDS.trusted,
        marcus: TRUST_THRESHOLDS.trusted,
        quinn: TRUST_THRESHOLDS.trusted,
        lira: TRUST_THRESHOLDS.trusted
      }
    }))
    expect(broadState.breadth).toBe('broad')
  })

  it('tracks champion status', () => {
    // Champion threshold is 35 points
    // Need trusted chars (4 * 5 = 20) + arcs (2 * 8 = 16) = 36 total
    const input = makeInput({
      characterTrust: {
        maya: TRUST_THRESHOLDS.trusted,
        devon: TRUST_THRESHOLDS.trusted,
        rohan: TRUST_THRESHOLDS.trusted,
        nadia: TRUST_THRESHOLDS.trusted
      },
      completedArcs: ['maya_main', 'devon_insight'] // 16 more points = 36 total
    })

    const state = calculateCareerExpertiseState(input)
    expect(state.domains.technology.isChampion).toBe(true)
    expect(state.championDomains).toContain('technology')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Helper Functions', () => {
  it('getDomainTierName returns correct tier', () => {
    const emptyInput = makeInput()
    expect(getDomainTierName('technology', emptyInput)).toBe('Curious')

    const withTrust = makeInput({
      characterTrust: {
        maya: TRUST_THRESHOLDS.trusted
      }
    })
    expect(getDomainTierName('technology', withTrust)).toBe('Exploring')
  })

  it('isChampionInDomain returns correct status', () => {
    const input = makeInput()
    expect(isChampionInDomain('technology', input)).toBe(false)
  })

  it('getSamuelExpertiseMessage returns a string', () => {
    for (const tierName of EXPERTISE_TIER_NAMES) {
      const message = getSamuelExpertiseMessage(tierName)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Performance', () => {
  it('calculateCareerExpertiseState completes in <5ms', () => {
    const input = makeInput({
      characterTrust: {
        maya: 8,
        devon: 7,
        marcus: 6
      },
      completedArcs: ['maya_main', 'devon_insight', 'marcus_path'],
      skills: { 'data_analysis': 3, 'coding': 2 }
    })

    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      calculateCareerExpertiseState(input)
    }
    const duration = performance.now() - start

    // 100 calls in <500ms (5ms average)
    expect(duration).toBeLessThan(500)
  })
})
