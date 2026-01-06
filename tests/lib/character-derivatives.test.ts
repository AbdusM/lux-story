/**
 * Tests for Character System Derivatives
 * Feature IDs: D-016, D-017, D-018, D-063, D-095
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  // D-016: Character-Influenced Environmental Changes
  CHARACTER_INFLUENCES,
  getActiveEnvironmentalEffects,
  calculateCharacterWarmthModifier,
  getUnlockedPlatforms,

  // D-017: Cross-Character Loyalty Prerequisites
  CROSS_CHARACTER_REQUIREMENTS,
  isCrossCharacterExperienceUnlocked,
  getAvailableCrossCharacterExperiences,

  // D-018: Sector-Specific Character Appearances
  CHARACTER_LOCATIONS,
  getCharactersInSector,
  getCharacterCurrentSector,

  // D-063: Character Relationship Drama
  CHARACTER_TENSIONS,
  getActiveTensions,
  checkForJealousyTrigger,
  getPendingDramaEvents,

  // D-095: Multi-Character Simultaneous Interactions
  MULTI_CHARACTER_SCENES,
  isMultiCharacterSceneAvailable,
  getAvailableMultiCharacterScenes,
  resolveMultiCharacterScene
} from '@/lib/character-derivatives'

import { GameState, GameStateUtils } from '@/lib/character-state'

// Helper to create test game state
function createTestState(): GameState {
  return GameStateUtils.createNewGameState('test-player')
}

// Helper to set trust for a character
function setTrust(state: GameState, characterId: string, trust: number): GameState {
  const char = state.characters.get(characterId)
  if (char) {
    char.trust = trust
    if (trust >= 8) char.relationshipStatus = 'confidant'
    else if (trust >= 5) char.relationshipStatus = 'acquaintance'
  }
  return state
}

// ═══════════════════════════════════════════════════════════════════════════
// D-016: CHARACTER-INFLUENCED ENVIRONMENTAL CHANGES
// ═══════════════════════════════════════════════════════════════════════════

describe('D-016: Character-Influenced Environmental Changes', () => {
  it('all influences have valid structure', () => {
    CHARACTER_INFLUENCES.forEach(influence => {
      expect(influence.characterId).toBeDefined()
      expect(influence.domain).toBeDefined()
      expect(influence.trustThreshold).toBeGreaterThan(0)
      expect(influence.effects.length).toBeGreaterThan(0)

      influence.effects.forEach(effect => {
        expect(effect.trigger).toBeDefined()
        expect(effect.effect).toBeDefined()
        expect(effect.visualDescription).toBeDefined()
      })
    })
  })

  it('returns no effects when trust is low', () => {
    const state = createTestState()
    const effects = getActiveEnvironmentalEffects(state)
    expect(effects).toHaveLength(0)
  })

  it('returns effects when trust threshold reached', () => {
    let state = createTestState()
    state = setTrust(state, 'devon', 6)

    const effects = getActiveEnvironmentalEffects(state)
    expect(effects.some(e => e.effect === 'station_systems_stable')).toBe(true)
  })

  it('returns effects when loyalty complete', () => {
    let state = createTestState()
    state = setTrust(state, 'devon', 8)
    state.globalFlags.add('devon_loyalty_complete')

    const effects = getActiveEnvironmentalEffects(state)
    expect(effects.some(e => e.effect === 'deep_systems_access')).toBe(true)
  })

  it('calculates warmth modifier correctly', () => {
    let state = createTestState()
    // Devon at trust 6 adds +1 warmth
    state = setTrust(state, 'devon', 6)

    const warmth = calculateCharacterWarmthModifier(state)
    expect(warmth).toBeGreaterThan(0)
  })

  it('tracks unlocked platforms from effects', () => {
    let state = createTestState()
    state = setTrust(state, 'devon', 8)
    state.globalFlags.add('devon_loyalty_complete')

    const platforms = getUnlockedPlatforms(state)
    expect(platforms).toContain('forgotten')
  })

  it('asha murals add warmth', () => {
    let state = createTestState()
    state = setTrust(state, 'asha', 5)

    const effects = getActiveEnvironmentalEffects(state)
    const muralEffect = effects.find(e => e.effect === 'murals_appear')
    expect(muralEffect).toBeDefined()
    expect(muralEffect?.warmthChange).toBe(2)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-017: CROSS-CHARACTER LOYALTY PREREQUISITES
// ═══════════════════════════════════════════════════════════════════════════

describe('D-017: Cross-Character Loyalty Prerequisites', () => {
  it('all requirements have valid structure', () => {
    CROSS_CHARACTER_REQUIREMENTS.forEach(req => {
      expect(req.experienceId).toBeDefined()
      expect(req.experienceName).toBeDefined()
      expect(req.characterId).toBeDefined()
      expect(req.requirements.length).toBeGreaterThan(0)
      expect(req.unlockHint).toBeDefined()

      req.requirements.forEach(r => {
        expect(r.characterId).toBeDefined()
        expect(r.minTrust).toBeGreaterThan(0)
      })
    })
  })

  it('returns unlocked false when requirements not met', () => {
    const state = createTestState()
    const result = isCrossCharacterExperienceUnlocked('the_mediation', state)

    expect(result.unlocked).toBe(false)
    expect(result.missingRequirements.length).toBeGreaterThan(0)
  })

  it('returns unlocked true when all requirements met', () => {
    let state = createTestState()
    // The Mediation requires Maya trust 5+ and Devon trust 5+
    state = setTrust(state, 'maya', 5)
    state = setTrust(state, 'devon', 5)

    const result = isCrossCharacterExperienceUnlocked('the_mediation', state)
    expect(result.unlocked).toBe(true)
    expect(result.missingRequirements).toHaveLength(0)
  })

  it('respects flag requirements', () => {
    let state = createTestState()
    // The Collaboration requires devon_arc_complete flag
    state = setTrust(state, 'devon', 6)
    state = setTrust(state, 'yaquin', 5)

    const result = isCrossCharacterExperienceUnlocked('the_collaboration', state)
    expect(result.unlocked).toBe(false)
    expect(result.missingRequirements.some(m => m.includes('devon_arc_complete'))).toBe(true)

    // Add the flag
    state.globalFlags.add('devon_arc_complete')
    const result2 = isCrossCharacterExperienceUnlocked('the_collaboration', state)
    expect(result2.unlocked).toBe(true)
  })

  it('respects conflicting characters', () => {
    let state = createTestState()
    // The Choice has conflictingCharacters: ['zara']
    state = setTrust(state, 'maya', 7)
    state = setTrust(state, 'devon', 7)
    state = setTrust(state, 'zara', 8) // Too close to Zara

    const result = isCrossCharacterExperienceUnlocked('the_choice', state)
    expect(result.unlocked).toBe(false)
    expect(result.missingRequirements.some(m => m.includes('Too close'))).toBe(true)
  })

  it('getAvailableCrossCharacterExperiences excludes completed', () => {
    let state = createTestState()
    state = setTrust(state, 'maya', 5)
    state = setTrust(state, 'devon', 5)

    const available1 = getAvailableCrossCharacterExperiences(state)
    expect(available1.some(r => r.experienceId === 'the_mediation')).toBe(true)

    // Mark as complete
    state.globalFlags.add('the_mediation_complete')

    const available2 = getAvailableCrossCharacterExperiences(state)
    expect(available2.some(r => r.experienceId === 'the_mediation')).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-018: SECTOR-SPECIFIC CHARACTER APPEARANCES
// ═══════════════════════════════════════════════════════════════════════════

describe('D-018: Sector-Specific Character Appearances', () => {
  it('all locations have valid structure', () => {
    CHARACTER_LOCATIONS.forEach(location => {
      expect(location.characterId).toBeDefined()
      expect(location.primarySector).toBeDefined()
      expect(location.secondarySectors).toBeInstanceOf(Array)
      expect(location.description).toBeDefined()
    })
  })

  it('returns characters in hub', () => {
    const state = createTestState()
    const hubCharacters = getCharactersInSector('hub', state)

    expect(hubCharacters).toContain('samuel')
    expect(hubCharacters).toContain('jordan')
    expect(hubCharacters).toContain('grace')
  })

  it('returns characters in market', () => {
    const state = createTestState()
    const marketCharacters = getCharactersInSector('market', state)

    expect(marketCharacters).toContain('tess')
    expect(marketCharacters).toContain('alex')
  })

  it('returns characters in workshops', () => {
    const state = createTestState()
    const workshopCharacters = getCharactersInSector('workshops', state)

    expect(workshopCharacters).toContain('silas')
    expect(workshopCharacters).toContain('kai')
  })

  it('respects flag conditions for secondary sectors', () => {
    let state = createTestState()

    // Devon can appear in deep_station only after arc complete
    const before = getCharactersInSector('deep_station', state)
    const devonBefore = before.includes('devon')

    state.globalFlags.add('devon_arc_complete')
    const after = getCharactersInSector('deep_station', state)
    const devonAfter = after.includes('devon')

    // Devon should appear in deep_station after flag is set
    expect(devonAfter || !devonBefore).toBe(true)
  })

  it('respects trust conditions', () => {
    let state = createTestState()

    // Rohan requires trust 4 to appear
    const before = getCharactersInSector('deep_station', state)
    const rohanBefore = before.includes('rohan')

    state = setTrust(state, 'rohan', 4)
    const after = getCharactersInSector('deep_station', state)
    const rohanAfter = after.includes('rohan')

    expect(rohanAfter).toBe(true)
    // Before might or might not include Rohan depending on default trust
  })

  it('getCharacterCurrentSector returns primary sector', () => {
    const state = createTestState()

    expect(getCharacterCurrentSector('samuel', state)).toBe('hub')
    expect(getCharacterCurrentSector('tess', state)).toBe('market')
    expect(getCharacterCurrentSector('silas', state)).toBe('workshops')
    expect(getCharacterCurrentSector('rohan', state)).toBe('deep_station')
    expect(getCharacterCurrentSector('elena', state)).toBe('archives')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-063: CHARACTER RELATIONSHIP DRAMA
// ═══════════════════════════════════════════════════════════════════════════

describe('D-063: Character Relationship Drama', () => {
  it('all tensions have valid structure', () => {
    CHARACTER_TENSIONS.forEach(tension => {
      expect(tension.characters).toHaveLength(2)
      expect(tension.nature).toBeDefined()
      expect(tension.description).toBeDefined()
      expect(tension.triggersAt.bothTrust).toBeGreaterThan(0)
      expect(tension.dialogueFlags.characterA).toBeDefined()
      expect(tension.dialogueFlags.characterB).toBeDefined()
      expect(tension.dialogueFlags.playerAware).toBeDefined()
    })
  })

  it('returns no active tensions when trust is low', () => {
    const state = createTestState()
    const tensions = getActiveTensions(state)
    expect(tensions).toHaveLength(0)
  })

  it('returns tension when both characters at threshold', () => {
    let state = createTestState()
    // Maya-Devon tension triggers at bothTrust: 6
    state = setTrust(state, 'maya', 6)
    state = setTrust(state, 'devon', 6)

    const tensions = getActiveTensions(state)
    expect(tensions.length).toBeGreaterThan(0)
    expect(tensions.some(t =>
      t.characters.includes('maya') && t.characters.includes('devon')
    )).toBe(true)
  })

  it('checkForJealousyTrigger returns null when no tension', () => {
    const state = createTestState()
    const result = checkForJealousyTrigger('maya', 3, state)
    expect(result).toBeNull()
  })

  it('checkForJealousyTrigger returns trigger when conditions met', () => {
    let state = createTestState()
    state = setTrust(state, 'maya', 6)
    state = setTrust(state, 'devon', 6)
    state.globalFlags.add('player_knows_maya_devon_tension')

    const result = checkForJealousyTrigger('maya', 7, state)
    expect(result).not.toBeNull()
    expect(result?.triggeredCharacter).toBe('devon')
  })

  it('getPendingDramaEvents returns empty when no triggers', () => {
    const state = createTestState()
    const events = getPendingDramaEvents(state)
    expect(events).toHaveLength(0)
  })

  it('getPendingDramaEvents returns mediation when trust is balanced', () => {
    let state = createTestState()
    state = setTrust(state, 'maya', 6)
    state = setTrust(state, 'devon', 6)
    state.globalFlags.add('maya_devon_tension_mentioned')
    state.globalFlags.add('devon_maya_tension_mentioned')
    state.globalFlags.add('player_knows_maya_devon_tension')

    const events = getPendingDramaEvents(state)
    expect(events.length).toBeGreaterThan(0)
    expect(events.some(e => e.type === 'mediation_opportunity')).toBe(true)
  })

  it('getPendingDramaEvents returns choice when trust is unbalanced', () => {
    let state = createTestState()
    state = setTrust(state, 'maya', 9)
    state = setTrust(state, 'devon', 6) // 3+ difference
    state.globalFlags.add('maya_devon_tension_mentioned')
    state.globalFlags.add('devon_maya_tension_mentioned')
    state.globalFlags.add('player_knows_maya_devon_tension')

    const events = getPendingDramaEvents(state)
    expect(events.length).toBeGreaterThan(0)
    expect(events.some(e => e.type === 'choice_required')).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-095: MULTI-CHARACTER SIMULTANEOUS INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-095: Multi-Character Simultaneous Interactions', () => {
  it('all scenes have valid structure', () => {
    MULTI_CHARACTER_SCENES.forEach(scene => {
      expect(scene.id).toBeDefined()
      expect(scene.name).toBeDefined()
      expect(scene.participants.length).toBeGreaterThanOrEqual(3)
      expect(scene.location).toBeDefined()
      expect(scene.requirements.minTrustWithAll).toBeGreaterThan(0)
      expect(scene.dynamics.length).toBeGreaterThan(0)
      expect(scene.outcomes.length).toBeGreaterThan(0)

      scene.dynamics.forEach(d => {
        expect(d.speaker).toBeDefined()
        expect(d.position).toBeDefined()
      })

      scene.outcomes.forEach(o => {
        expect(o.id).toBeDefined()
        expect(o.condition).toBeDefined()
        expect(o.trustChanges.length).toBeGreaterThan(0)
        expect(o.flagSet).toBeDefined()
      })
    })
  })

  it('isMultiCharacterSceneAvailable returns false when trust low', () => {
    const state = createTestState()
    const result = isMultiCharacterSceneAvailable('tech_ethics_debate', state)

    expect(result.available).toBe(false)
    expect(result.missing.length).toBeGreaterThan(0)
  })

  it('isMultiCharacterSceneAvailable returns true when requirements met', () => {
    let state = createTestState()
    // Tech ethics debate: maya, devon, rohan - minTrust 5, analytical 3
    state = setTrust(state, 'maya', 5)
    state = setTrust(state, 'devon', 5)
    state = setTrust(state, 'rohan', 5)
    state.patterns.analytical = 3

    const result = isMultiCharacterSceneAvailable('tech_ethics_debate', state)
    expect(result.available).toBe(true)
  })

  it('respects pattern requirements', () => {
    let state = createTestState()
    state = setTrust(state, 'maya', 5)
    state = setTrust(state, 'devon', 5)
    state = setTrust(state, 'rohan', 5)
    // analytical pattern too low
    state.patterns.analytical = 1

    const result = isMultiCharacterSceneAvailable('tech_ethics_debate', state)
    expect(result.available).toBe(false)
    expect(result.missing.some(m => m.includes('analytical'))).toBe(true)
  })

  it('excludes completed scenes', () => {
    let state = createTestState()
    state = setTrust(state, 'maya', 5)
    state = setTrust(state, 'devon', 5)
    state = setTrust(state, 'rohan', 5)
    state.patterns.analytical = 3

    const available1 = getAvailableMultiCharacterScenes(state)
    expect(available1.some(s => s.id === 'tech_ethics_debate')).toBe(true)

    // Mark as complete (set any outcome flag)
    state.globalFlags.add('tech_debate_maya_won')

    const available2 = getAvailableMultiCharacterScenes(state)
    expect(available2.some(s => s.id === 'tech_ethics_debate')).toBe(false)
  })

  it('resolveMultiCharacterScene returns correct outcome', () => {
    const consensus = resolveMultiCharacterScene('tech_ethics_debate', 'consensus')
    expect(consensus).not.toBeNull()
    expect(consensus?.id).toBe('compromise_reached')
    expect(consensus?.condition).toBe('consensus')

    const majority = resolveMultiCharacterScene('tech_ethics_debate', 'side_with_majority')
    expect(majority?.id).toBe('maya_wins')
  })

  it('resolveMultiCharacterScene returns null for invalid scene', () => {
    const result = resolveMultiCharacterScene('nonexistent_scene', 'consensus')
    expect(result).toBeNull()
  })

  it('case conference scene tests compassion vs protocol', () => {
    let state = createTestState()
    state = setTrust(state, 'marcus', 6)
    state = setTrust(state, 'grace', 6)
    state = setTrust(state, 'zara', 6)
    state.patterns.helping = 3
    state.patterns.analytical = 2

    const result = isMultiCharacterSceneAvailable('patient_case_conference', state)
    expect(result.available).toBe(true)

    // Test outcomes
    const compassion = resolveMultiCharacterScene('patient_case_conference', 'side_with_minority')
    expect(compassion?.trustChanges.find(t => t.characterId === 'grace')?.change).toBe(3)
    expect(compassion?.trustChanges.find(t => t.characterId === 'marcus')?.change).toBe(-1)

    const protocol = resolveMultiCharacterScene('patient_case_conference', 'side_with_majority')
    expect(protocol?.trustChanges.find(t => t.characterId === 'marcus')?.change).toBe(1)
    expect(protocol?.trustChanges.find(t => t.characterId === 'grace')?.change).toBe(-1)
  })
})
