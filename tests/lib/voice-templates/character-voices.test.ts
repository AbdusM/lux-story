/**
 * Tests for Character Voice Profiles
 */

import { describe, it, expect } from 'vitest'
import {
  CHARACTER_VOICE_PROFILES,
  getCharacterVoice,
  hasPatternOverride,
  getCharactersWithArchetypeOverride
} from '@/lib/voice-templates/character-voices'

describe('CHARACTER_VOICE_PROFILES', () => {
  it('has profiles for all 16 characters', () => {
    const characterIds = Object.keys(CHARACTER_VOICE_PROFILES)
    expect(characterIds).toHaveLength(16)
  })

  it('includes all required fields', () => {
    for (const [charId, profile] of Object.entries(CHARACTER_VOICE_PROFILES)) {
      expect(profile.characterId).toBe(charId)
      expect(profile.vocabulary).toBeDefined()
      expect(profile.vocabulary.preferred).toBeInstanceOf(Array)
      expect(profile.vocabulary.avoided).toBeInstanceOf(Array)
      expect(profile.syntax).toBeDefined()
      expect(profile.syntax.structure).toBeDefined()
      expect(profile.syntax.brevity).toBeDefined()
    }
  })

  describe('tier 1 characters have rich overrides', () => {
    it('samuel has pattern overrides', () => {
      const samuel = CHARACTER_VOICE_PROFILES.samuel
      expect(samuel.patternOverrides).toBeDefined()
      expect(Object.keys(samuel.patternOverrides!).length).toBeGreaterThanOrEqual(3)
    })

    it('maya has pattern overrides', () => {
      const maya = CHARACTER_VOICE_PROFILES.maya
      expect(maya.patternOverrides).toBeDefined()
      expect(Object.keys(maya.patternOverrides!).length).toBeGreaterThanOrEqual(3)
    })

    it('devon has unique syntax in overrides', () => {
      const devon = CHARACTER_VOICE_PROFILES.devon
      expect(devon.patternOverrides).toBeDefined()
      expect(devon.patternOverrides?.analytical?.ASK_FOR_DETAILS).toContain('[QUERY]')
      expect(devon.patternOverrides?.analytical?.STAY_SILENT).toContain('[PAUSE]')
    })
  })

  describe('character voice distinctiveness', () => {
    it('samuel uses station metaphors', () => {
      const samuel = CHARACTER_VOICE_PROFILES.samuel
      expect(samuel.vocabulary.preferred).toContain('station')
      expect(samuel.vocabulary.preferred).toContain('path')
    })

    it('maya uses tech vocabulary', () => {
      const maya = CHARACTER_VOICE_PROFILES.maya
      expect(maya.vocabulary.preferred).toContain('prototype')
      expect(maya.vocabulary.preferred).toContain('iterate')
    })

    it('devon uses system vocabulary', () => {
      const devon = CHARACTER_VOICE_PROFILES.devon
      expect(devon.vocabulary.preferred).toContain('system')
      expect(devon.vocabulary.preferred).toContain('debug')
    })

    it('marcus uses care vocabulary', () => {
      const marcus = CHARACTER_VOICE_PROFILES.marcus
      expect(marcus.vocabulary.preferred).toContain('care')
      expect(marcus.vocabulary.preferred).toContain('patient')
    })

    it('elena uses archive vocabulary', () => {
      const elena = CHARACTER_VOICE_PROFILES.elena
      expect(elena.vocabulary.preferred).toContain('archive')
      expect(elena.vocabulary.preferred).toContain('knowledge')
    })
  })

  describe('syntax preferences', () => {
    it('devon is terse', () => {
      expect(CHARACTER_VOICE_PROFILES.devon.syntax.brevity).toBe('terse')
    })

    it('elena is verbose', () => {
      expect(CHARACTER_VOICE_PROFILES.elena.syntax.brevity).toBe('verbose')
    })

    it('tess uses interrogative structure', () => {
      expect(CHARACTER_VOICE_PROFILES.tess.syntax.structure).toBe('interrogative')
    })

    it('maya uses fragmented structure', () => {
      expect(CHARACTER_VOICE_PROFILES.maya.syntax.structure).toBe('fragmented')
    })
  })
})

describe('getCharacterVoice', () => {
  it('returns profile for valid character', () => {
    const profile = getCharacterVoice('samuel')
    expect(profile.characterId).toBe('samuel')
    expect(profile.vocabulary).toBeDefined()
  })

  it('returns profile for all characters', () => {
    const characterIds = [
      'samuel', 'maya', 'devon', 'marcus', 'kai', 'tess', 'rohan',
      'yaquin', 'grace', 'alex', 'elena', 'jordan', 'silas', 'asha', 'lira', 'zara'
    ] as const

    for (const charId of characterIds) {
      const profile = getCharacterVoice(charId)
      expect(profile.characterId).toBe(charId)
    }
  })
})

describe('hasPatternOverride', () => {
  it('returns true for characters with overrides', () => {
    expect(hasPatternOverride('devon', 'analytical')).toBe(true)
    expect(hasPatternOverride('samuel', 'patience')).toBe(true)
    expect(hasPatternOverride('maya', 'exploring')).toBe(true)
  })

  it('returns false for characters without specific overrides', () => {
    const profile = CHARACTER_VOICE_PROFILES.yaquin
    if (!profile.patternOverrides?.patience) {
      expect(hasPatternOverride('yaquin', 'patience')).toBe(false)
    }
  })
})

describe('getCharactersWithArchetypeOverride', () => {
  it('finds characters with ASK_FOR_DETAILS overrides', () => {
    const characters = getCharactersWithArchetypeOverride('ASK_FOR_DETAILS')
    expect(characters).toContain('devon')
    expect(characters).toContain('maya')
    expect(characters).toContain('samuel')
  })

  it('finds characters with STAY_SILENT overrides', () => {
    const characters = getCharactersWithArchetypeOverride('STAY_SILENT')
    expect(characters).toContain('devon')
    expect(characters).toContain('samuel')
  })

  it('returns empty array for non-existent archetype', () => {
    const characters = getCharactersWithArchetypeOverride('NONEXISTENT')
    expect(characters).toHaveLength(0)
  })
})

describe('pattern override content quality', () => {
  it('devon analytical overrides contain brackets', () => {
    const devon = CHARACTER_VOICE_PROFILES.devon
    const overrides = devon.patternOverrides?.analytical

    expect(overrides?.ASK_FOR_DETAILS).toMatch(/^\[/)
    expect(overrides?.STAY_SILENT).toMatch(/^\[/)
    expect(overrides?.SHOW_UNDERSTANDING).toMatch(/^\[/)
  })

  it('samuel overrides mention station themes', () => {
    const samuel = CHARACTER_VOICE_PROFILES.samuel
    const allOverrides = Object.values(samuel.patternOverrides || {}).flatMap(
      p => Object.values(p || {})
    ).join(' ')

    expect(allOverrides.toLowerCase()).toMatch(/station|platform|train|path/)
  })

  it('marcus overrides emphasize care', () => {
    const marcus = CHARACTER_VOICE_PROFILES.marcus
    const patienceOverrides = marcus.patternOverrides?.patience

    expect(patienceOverrides?.ACKNOWLEDGE_EMOTION).toContain("I'm here")
    expect(patienceOverrides?.STAY_SILENT).toContain('Presence')
  })
})
