/**
 * Tests for Narrative System Derivatives
 * Feature IDs: D-008, D-020, D-061, D-062, D-064, D-065
 */

import { describe, it, expect } from 'vitest'
import {
  // D-008: Rich Text Effects
  PATTERN_TEXT_EFFECTS,
  TRUST_TEXT_EFFECTS,
  CHARACTER_TEXT_EFFECTS,
  getActiveTextEffects,

  // D-020: Magical Realism
  MAGICAL_REALISM_MANIFESTATIONS,
  getActiveMagicalRealisms,
  hasMagicalPerception,

  // D-061: Player-Generated Story Arcs
  EMERGENT_STORY_ARCS,
  isEmergentArcUnlocked,
  getNewlyDiscoveredArcs,

  // D-062: Consequence Cascades
  CASCADE_EFFECTS,
  getCascadeEffectsForFlag,
  getPendingCascadeLinks,

  // D-064: Narrative Framing
  NARRATIVE_FRAMINGS,
  getDominantPattern,
  getNarrativeFraming,
  getPatternNarrativeDescriptor,

  // D-065: Meta-Narrative
  META_NARRATIVE_REVELATIONS,
  isMetaRevelationUnlocked,
  getUnlockedMetaRevelations,
  hasMetaAwareness
} from '@/lib/narrative-derivatives'

import { GameState, GameStateUtils, PlayerPatterns } from '@/lib/character-state'
import { PATTERN_THRESHOLDS } from '@/lib/patterns'

// Helper functions
function createTestState(): GameState {
  return GameStateUtils.createNewGameState('test-player')
}

function createHighPatterns(): PlayerPatterns {
  return {
    analytical: PATTERN_THRESHOLDS.FLOURISHING,
    patience: PATTERN_THRESHOLDS.FLOURISHING,
    exploring: PATTERN_THRESHOLDS.FLOURISHING,
    helping: PATTERN_THRESHOLDS.FLOURISHING,
    building: PATTERN_THRESHOLDS.FLOURISHING
  }
}

function createLowPatterns(): PlayerPatterns {
  return {
    analytical: 2,
    patience: 2,
    exploring: 2,
    helping: 2,
    building: 2
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// D-008: RICH TEXT EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-008: Rich Text Effects Triggered by State', () => {
  it('all pattern text effects have valid structure', () => {
    Object.entries(PATTERN_TEXT_EFFECTS).forEach(([pattern, effect]) => {
      expect(effect.type).toBeDefined()
      expect(effect.trigger).toBeDefined()
      expect(effect.trigger.condition).toBe('pattern_level')
      expect(effect.trigger.pattern).toBe(pattern)
      expect(effect.trigger.minLevel).toBeGreaterThan(0)
    })
  })

  it('trust text effects have valid structure', () => {
    TRUST_TEXT_EFFECTS.forEach(({ minTrust, effect }) => {
      expect(minTrust).toBeGreaterThan(0)
      expect(effect.type).toBeDefined()
      expect(effect.trigger.condition).toBe('trust_level')
    })
  })

  it('character text effects have valid structure', () => {
    Object.entries(CHARACTER_TEXT_EFFECTS).forEach(([charId, effect]) => {
      expect(effect.type).toBeDefined()
      expect(effect.trigger.condition).toBe('character_speaking')
      expect(effect.trigger.characterId).toBe(charId)
    })
  })

  it('returns no effects for low patterns', () => {
    const state = createTestState()
    state.patterns = createLowPatterns()
    const effects = getActiveTextEffects(state)
    expect(effects.length).toBe(0)
  })

  it('returns pattern effects for high patterns', () => {
    const state = createTestState()
    state.patterns = createHighPatterns()
    const effects = getActiveTextEffects(state)
    expect(effects.length).toBeGreaterThan(0)
  })

  it('returns character-specific effects when speaker specified', () => {
    const state = createTestState()
    const effects = getActiveTextEffects(state, 'samuel')
    expect(effects.some(e => e.trigger.characterId === 'samuel')).toBe(true)
  })

  it('returns trust effects for high trust speaker', () => {
    const state = createTestState()
    const charState = state.characters.get('samuel')!
    charState.trust = 8

    const effects = getActiveTextEffects(state, 'samuel')
    expect(effects.some(e => e.type === 'handwritten')).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-020: MAGICAL REALISM
// ═══════════════════════════════════════════════════════════════════════════

describe('D-020: Magical Realism at High Pattern Levels', () => {
  it('all manifestations have valid structure', () => {
    MAGICAL_REALISM_MANIFESTATIONS.forEach(m => {
      expect(m.id).toBeDefined()
      expect(m.name).toBeDefined()
      expect(m.description).toBeDefined()
      expect(m.triggerPattern).toBeDefined()
      expect(m.minLevel).toBeGreaterThan(0)
      expect(m.manifestation).toBeDefined()
    })
  })

  it('each pattern has at least one manifestation', () => {
    const patterns = ['analytical', 'patience', 'exploring', 'helping', 'building']
    patterns.forEach(pattern => {
      const manifestations = MAGICAL_REALISM_MANIFESTATIONS.filter(
        m => m.triggerPattern === pattern
      )
      expect(manifestations.length).toBeGreaterThan(0)
    })
  })

  it('returns no manifestations for low patterns', () => {
    const patterns = createLowPatterns()
    const active = getActiveMagicalRealisms(patterns)
    expect(active).toHaveLength(0)
  })

  it('returns manifestations for flourishing patterns', () => {
    const patterns = createHighPatterns()
    const active = getActiveMagicalRealisms(patterns)
    expect(active.length).toBeGreaterThan(0)
  })

  it('hasMagicalPerception is false for low patterns', () => {
    const patterns = createLowPatterns()
    expect(hasMagicalPerception(patterns)).toBe(false)
  })

  it('hasMagicalPerception is true for high patterns', () => {
    const patterns = createHighPatterns()
    expect(hasMagicalPerception(patterns)).toBe(true)
  })

  it('some manifestations have character reactions', () => {
    const withReactions = MAGICAL_REALISM_MANIFESTATIONS.filter(
      m => m.characterReaction
    )
    expect(withReactions.length).toBeGreaterThan(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-061: PLAYER-GENERATED STORY ARCS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-061: Player-Generated Story Arcs', () => {
  it('all emergent arcs have valid structure', () => {
    EMERGENT_STORY_ARCS.forEach(arc => {
      expect(arc.id).toBeDefined()
      expect(arc.name).toBeDefined()
      expect(arc.requiredChoices.length).toBeGreaterThanOrEqual(2)
      expect(arc.unlockFlag).toBeDefined()
      expect(arc.arcContent).toBeDefined()
      expect(arc.arcContent.introductionNodeId).toBeDefined()
      expect(arc.arcContent.climaxNodeId).toBeDefined()
      expect(arc.reward).toBeDefined()
      expect(arc.reward.specialFlag).toBeDefined()
    })
  })

  it('returns unlocked false when requirements not met', () => {
    const state = createTestState()
    const result = isEmergentArcUnlocked('the_old_project', state)

    expect(result.unlocked).toBe(false)
    expect(result.missingPieces.length).toBeGreaterThan(0)
  })

  it('returns unlocked true when all flags present', () => {
    const state = createTestState()
    // Add all required flags for 'the_old_project'
    state.globalFlags.add('maya_past_failure')
    state.globalFlags.add('devon_past_failure')
    state.globalFlags.add('rohan_data_truth')

    const result = isEmergentArcUnlocked('the_old_project', state)
    expect(result.unlocked).toBe(true)
    expect(result.missingPieces).toHaveLength(0)
  })

  it('detects newly discovered arcs', () => {
    const oldFlags = new Set(['maya_past_failure', 'devon_past_failure'])
    const newFlags = new Set(['maya_past_failure', 'devon_past_failure', 'rohan_data_truth'])

    const discovered = getNewlyDiscoveredArcs(oldFlags, newFlags)
    expect(discovered.some(a => a.id === 'the_old_project')).toBe(true)
  })

  it('excludes already discovered arcs', () => {
    const oldFlags = new Set(['maya_past_failure', 'devon_past_failure', 'arc_old_project_discovered'])
    const newFlags = new Set(['maya_past_failure', 'devon_past_failure', 'rohan_data_truth', 'arc_old_project_discovered'])

    const discovered = getNewlyDiscoveredArcs(oldFlags, newFlags)
    expect(discovered.some(a => a.id === 'the_old_project')).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-062: CONSEQUENCE CASCADES
// ═══════════════════════════════════════════════════════════════════════════

describe('D-062: Consequence Cascade Chains', () => {
  it('all cascades have valid structure', () => {
    CASCADE_EFFECTS.forEach(cascade => {
      expect(cascade.id).toBeDefined()
      expect(cascade.trigger.flagSet).toBeDefined()
      expect(cascade.trigger.characterId).toBeDefined()
      expect(cascade.chain.length).toBeGreaterThanOrEqual(2)

      cascade.chain.forEach((link, i) => {
        expect(link.degree).toBe(i + 1)
        expect(link.characterAffected).toBeDefined()
        expect(link.description).toBeDefined()
        // At least one effect
        expect(
          link.effect.trustChange !== undefined ||
          link.effect.flagSet !== undefined ||
          link.effect.dialogueUnlock !== undefined
        ).toBe(true)
      })
    })
  })

  it('chains have at least 3 degrees of effect', () => {
    CASCADE_EFFECTS.forEach(cascade => {
      const maxDegree = Math.max(...cascade.chain.map(l => l.degree))
      expect(maxDegree).toBeGreaterThanOrEqual(3)
    })
  })

  it('getCascadeEffectsForFlag returns cascade when matching', () => {
    const cascade = getCascadeEffectsForFlag('helped_maya_deeply', 'maya')
    expect(cascade).not.toBeNull()
    expect(cascade?.id).toBe('maya_trust_cascade')
  })

  it('getCascadeEffectsForFlag returns null when not matching', () => {
    const cascade = getCascadeEffectsForFlag('nonexistent_flag', 'maya')
    expect(cascade).toBeNull()
  })

  it('getPendingCascadeLinks returns links for triggered cascade', () => {
    const state = createTestState()
    state.globalFlags.add('helped_maya_deeply')

    const pending = getPendingCascadeLinks(state, 5)
    expect(pending.length).toBeGreaterThan(0)
  })

  it('getPendingCascadeLinks excludes already-applied effects', () => {
    const state = createTestState()
    state.globalFlags.add('helped_maya_deeply')
    state.globalFlags.add('maya_vouches_for_player')

    const pending = getPendingCascadeLinks(state, 5)
    const hasFirstDegree = pending.some(l => l.effect.flagSet === 'maya_vouches_for_player')
    expect(hasFirstDegree).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-064: NARRATIVE FRAMING
// ═══════════════════════════════════════════════════════════════════════════

describe('D-064: Narrative Framing Based on Dominant Pattern', () => {
  it('all framings have valid structure', () => {
    Object.entries(NARRATIVE_FRAMINGS).forEach(([pattern, framing]) => {
      expect(framing.pattern).toBe(pattern)
      expect(framing.stationMetaphor).toBeDefined()
      expect(framing.visualTheme).toBeDefined()
      expect(framing.primaryColors.length).toBeGreaterThan(0)
      expect(framing.characterFocus.length).toBeGreaterThan(0)
      expect(framing.narrativeVoice).toBeDefined()
      expect(framing.descriptors.length).toBeGreaterThan(0)
    })
  })

  it('each framing has unique station metaphor', () => {
    const metaphors = Object.values(NARRATIVE_FRAMINGS).map(f => f.stationMetaphor)
    const uniqueMetaphors = new Set(metaphors)
    expect(uniqueMetaphors.size).toBe(metaphors.length)
  })

  it('getDominantPattern returns highest pattern', () => {
    const patterns: PlayerPatterns = {
      analytical: 5,
      patience: 3,
      exploring: 8,
      helping: 4,
      building: 6
    }
    expect(getDominantPattern(patterns)).toBe('exploring')
  })

  it('getNarrativeFraming returns framing for dominant pattern', () => {
    const patterns: PlayerPatterns = {
      analytical: 1,
      patience: 1,
      exploring: 1,
      helping: 10,
      building: 1
    }
    const framing = getNarrativeFraming(patterns)
    expect(framing.pattern).toBe('helping')
    expect(framing.stationMetaphor).toContain('community')
  })

  it('getPatternNarrativeDescriptor returns valid descriptor', () => {
    const patterns: PlayerPatterns = {
      analytical: 10,
      patience: 1,
      exploring: 1,
      helping: 1,
      building: 1
    }
    const descriptor = getPatternNarrativeDescriptor(patterns)
    expect(NARRATIVE_FRAMINGS.analytical.descriptors).toContain(descriptor)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-065: META-NARRATIVE
// ═══════════════════════════════════════════════════════════════════════════

describe('D-065: Meta-Narrative at Pattern Mastery', () => {
  it('all revelations have valid structure', () => {
    META_NARRATIVE_REVELATIONS.forEach(r => {
      expect(r.id).toBeDefined()
      expect(r.name).toBeDefined()
      expect(r.requirement).toBeDefined()
      expect(r.revelation).toBeDefined()
      expect(r.characterAcknowledgement).toBeDefined()
      expect(r.characterAcknowledgement.characterId).toBeDefined()
      expect(r.characterAcknowledgement.dialogue).toBeDefined()
      expect(r.unlocksDialogue.length).toBeGreaterThan(0)
    })
  })

  it('isMetaRevelationUnlocked false for low patterns', () => {
    const patterns = createLowPatterns()
    const unlocked = isMetaRevelationUnlocked('station_awareness', patterns)
    expect(unlocked).toBe(false)
  })

  it('isMetaRevelationUnlocked true when any pattern at level', () => {
    const patterns: PlayerPatterns = {
      ...createLowPatterns(),
      exploring: PATTERN_THRESHOLDS.FLOURISHING
    }
    const unlocked = isMetaRevelationUnlocked('station_awareness', patterns)
    expect(unlocked).toBe(true)
  })

  it('checks total pattern sum requirement', () => {
    // Pattern truth requires 35 total
    const lowTotal: PlayerPatterns = {
      analytical: 5,
      patience: 5,
      exploring: 5,
      helping: 5,
      building: 5
    } // = 25
    expect(isMetaRevelationUnlocked('pattern_truth', lowTotal)).toBe(false)

    const highTotal: PlayerPatterns = {
      analytical: 7,
      patience: 7,
      exploring: 7,
      helping: 7,
      building: 7
    } // = 35
    expect(isMetaRevelationUnlocked('pattern_truth', highTotal)).toBe(true)
  })

  it('checks specific pattern requirements', () => {
    // Character nature requires helping 6+ and exploring 6+
    const missing: PlayerPatterns = {
      analytical: 10,
      patience: 10,
      exploring: 4, // Too low
      helping: 4, // Too low
      building: 10
    }
    expect(isMetaRevelationUnlocked('character_nature', missing)).toBe(false)

    const hasIt: PlayerPatterns = {
      analytical: 2,
      patience: 2,
      exploring: PATTERN_THRESHOLDS.DEVELOPING,
      helping: PATTERN_THRESHOLDS.DEVELOPING,
      building: 2
    }
    expect(isMetaRevelationUnlocked('character_nature', hasIt)).toBe(true)
  })

  it('getUnlockedMetaRevelations returns all unlocked', () => {
    const patterns = createHighPatterns()
    const unlocked = getUnlockedMetaRevelations(patterns)
    expect(unlocked.length).toBeGreaterThan(0)
  })

  it('hasMetaAwareness false for low patterns', () => {
    const patterns = createLowPatterns()
    expect(hasMetaAwareness(patterns)).toBe(false)
  })

  it('hasMetaAwareness true for high patterns', () => {
    const patterns = createHighPatterns()
    expect(hasMetaAwareness(patterns)).toBe(true)
  })
})
