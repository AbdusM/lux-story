/**
 * Tests for Voice Template Resolver
 */

import { describe, it, expect } from 'vitest'
import {
  resolveVoiceVariation,
  getVoicedText,
  getDominantPattern,
  detectArchetypeWithConfidence,
  wouldBenefitFromVoice,
  explainResolution
} from '@/lib/voice-templates/template-resolver'
import type { PlayerPatterns } from '@/lib/character-state'

// Test pattern fixtures
const highAnalytical: PlayerPatterns = {
  analytical: 7,
  patience: 2,
  exploring: 3,
  helping: 1,
  building: 2
}

const highPatience: PlayerPatterns = {
  analytical: 2,
  patience: 8,
  exploring: 3,
  helping: 2,
  building: 1
}

const highHelping: PlayerPatterns = {
  analytical: 2,
  patience: 3,
  exploring: 1,
  helping: 9,
  building: 2
}

const balanced: PlayerPatterns = {
  analytical: 3,
  patience: 3,
  exploring: 3,
  helping: 3,
  building: 3
}

const lowAll: PlayerPatterns = {
  analytical: 1,
  patience: 1,
  exploring: 1,
  helping: 1,
  building: 1
}

describe('getDominantPattern', () => {
  it('returns the highest scoring pattern', () => {
    expect(getDominantPattern(highAnalytical)).toBe('analytical')
    expect(getDominantPattern(highPatience)).toBe('patience')
    expect(getDominantPattern(highHelping)).toBe('helping')
  })

  it('returns null for balanced patterns (tie)', () => {
    expect(getDominantPattern(balanced)).toBeNull()
  })

  it('returns null for low pattern scores', () => {
    expect(getDominantPattern(lowAll)).toBeNull()
  })

  it('requires minimum score of 2', () => {
    const veryLow: PlayerPatterns = {
      analytical: 1,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }
    expect(getDominantPattern(veryLow)).toBeNull()
  })
})

describe('detectArchetypeWithConfidence', () => {
  it('returns high confidence for explicit markers', () => {
    const result = detectArchetypeWithConfidence('[Silence]')
    expect(result.archetype).toBe('STAY_SILENT')
    expect(result.confidence).toBe(1.0)
  })

  it('returns moderate confidence for regex matches', () => {
    const result = detectArchetypeWithConfidence('Tell me more about that')
    expect(result.archetype).toBe('ASK_FOR_DETAILS')
    expect(result.confidence).toBeGreaterThan(0.5)
  })

  it('boosts confidence for question marks', () => {
    const withQuestion = detectArchetypeWithConfidence('Tell me more about what happened here?')
    const withoutQuestion = detectArchetypeWithConfidence('Tell me more about what happened here')
    expect(withQuestion.confidence).toBeGreaterThan(withoutQuestion.confidence)
  })

  it('boosts confidence for longer text', () => {
    const short = detectArchetypeWithConfidence('Tell me more')
    const long = detectArchetypeWithConfidence('Tell me more about what happened with your project and the team')
    expect(long.confidence).toBeGreaterThan(short.confidence)
  })

  it('returns null for unrecognized text', () => {
    const result = detectArchetypeWithConfidence('Hello there friend')
    expect(result.archetype).toBeNull()
    expect(result.confidence).toBe(0)
  })
})

describe('resolveVoiceVariation', () => {
  describe('priority 1: custom override', () => {
    it('uses custom override when provided', () => {
      const result = resolveVoiceVariation({
        baseText: 'Tell me more',
        customOverride: { analytical: 'Custom analytical text' }
      }, highAnalytical)

      expect(result.text).toBe('Custom analytical text')
      expect(result.source).toBe('custom')
    })

    it('custom override wins over template', () => {
      const result = resolveVoiceVariation({
        baseText: 'Tell me more about this',
        customOverride: { analytical: 'My custom text' },
        archetype: 'ASK_FOR_DETAILS'
      }, highAnalytical)

      expect(result.text).toBe('My custom text')
      expect(result.source).toBe('custom')
    })
  })

  describe('priority 2: character override', () => {
    it('uses character-specific override when available', () => {
      const result = resolveVoiceVariation({
        baseText: 'Tell me more',
        characterId: 'devon',
        archetype: 'ASK_FOR_DETAILS'
      }, highAnalytical)

      expect(result.text).toContain('[QUERY]')
      expect(result.source).toBe('character')
    })

    it('uses character override for STAY_SILENT', () => {
      const result = resolveVoiceVariation({
        baseText: '[Silence]',
        characterId: 'devon',
        archetype: 'STAY_SILENT'
      }, highAnalytical)

      expect(result.text).toContain('[PAUSE]')
      expect(result.source).toBe('character')
    })
  })

  describe('priority 3: template', () => {
    it('uses template when no overrides', () => {
      const result = resolveVoiceVariation({
        baseText: 'Tell me more about this topic',
        archetype: 'ASK_FOR_DETAILS'
      }, highAnalytical)

      expect(result.text).toContain('Walk me through')
      expect(result.source).toBe('template')
      expect(result.archetype).toBe('ASK_FOR_DETAILS')
    })

    it('fills slots in templates', () => {
      const result = resolveVoiceVariation({
        baseText: 'Tell me more about your journey',
        archetype: 'ASK_FOR_DETAILS'
      }, highAnalytical)

      expect(result.text).toContain('your journey')
    })

    it('uses patience template for patience-dominant player', () => {
      const result = resolveVoiceVariation({
        baseText: 'Tell me more about this',
        archetype: 'ASK_FOR_DETAILS'
      }, highPatience)

      expect(result.text).toContain('Take your time')
      expect(result.pattern).toBe('patience')
    })
  })

  describe('priority 4: base text fallback', () => {
    it('falls back to base text for balanced patterns', () => {
      const result = resolveVoiceVariation({
        baseText: 'Original text here'
      }, balanced)

      expect(result.text).toBe('Original text here')
      expect(result.source).toBe('base')
    })

    it('falls back when detection confidence too low', () => {
      const result = resolveVoiceVariation({
        baseText: 'Hmm'
      }, highAnalytical)

      expect(result.text).toBe('Hmm')
      expect(result.source).toBe('base')
    })
  })

  describe('pattern variations', () => {
    it('produces different text for different patterns', () => {
      const context = {
        baseText: 'Tell me more about this',
        archetype: 'ASK_FOR_DETAILS' as const
      }

      const analyticalResult = resolveVoiceVariation(context, highAnalytical)
      const patienceResult = resolveVoiceVariation(context, highPatience)
      const helpingResult = resolveVoiceVariation(context, highHelping)

      expect(analyticalResult.text).not.toBe(patienceResult.text)
      expect(patienceResult.text).not.toBe(helpingResult.text)
    })
  })
})

describe('getVoicedText', () => {
  it('returns voiced text for dominant pattern', () => {
    const text = getVoicedText(
      'Tell me more about this',
      highAnalytical,
      { archetype: 'ASK_FOR_DETAILS' }
    )

    expect(text).toContain('Walk me through')
  })

  it('uses custom voiceVariations when provided', () => {
    const text = getVoicedText(
      'Tell me more',
      highAnalytical,
      { voiceVariations: { analytical: 'My custom text' } }
    )

    expect(text).toBe('My custom text')
  })

  it('uses character overrides', () => {
    const text = getVoicedText(
      'Tell me more',
      highAnalytical,
      { characterId: 'devon', archetype: 'ASK_FOR_DETAILS' }
    )

    expect(text).toContain('[QUERY]')
  })
})

describe('wouldBenefitFromVoice', () => {
  it('returns false when already has custom variations', () => {
    const result = wouldBenefitFromVoice('Tell me more', true)
    expect(result.shouldHaveVoice).toBe(false)
    expect(result.reason).toContain('custom voiceVariations')
  })

  it('returns true for detectable archetypes', () => {
    const result = wouldBenefitFromVoice('Tell me more about this project', false)
    expect(result.shouldHaveVoice).toBe(true)
    expect(result.detectedArchetype).toBe('ASK_FOR_DETAILS')
  })

  it('suggests annotation for low confidence', () => {
    const result = wouldBenefitFromVoice('Hmm okay', false)
    expect(result.reason).toContain('annotation')
  })
})

describe('explainResolution', () => {
  it('provides detailed explanation', () => {
    const explanation = explainResolution({
      baseText: 'Tell me more about this',
      characterId: 'maya',
      archetype: 'ASK_FOR_DETAILS'
    }, highAnalytical)

    expect(explanation).toContain('Voice Resolution')
    expect(explanation).toContain('analytical')
    expect(explanation).toContain('ASK_FOR_DETAILS')
  })
})
