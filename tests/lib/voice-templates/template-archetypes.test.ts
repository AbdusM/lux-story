/**
 * Tests for Voice Template Archetypes
 */

import { describe, it, expect } from 'vitest'
import {
  VOICE_TEMPLATES,
  detectArchetype,
  extractSlotValues,
  fillSlots,
  getArchetypeNames,
  isValidArchetype
} from '@/lib/voice-templates/template-archetypes'

describe('VOICE_TEMPLATES', () => {
  it('has all 16 archetypes defined', () => {
    const archetypeNames = getArchetypeNames()
    expect(archetypeNames).toHaveLength(16)
  })

  it('has all 5 pattern transforms for each archetype', () => {
    const patterns = ['analytical', 'patience', 'exploring', 'helping', 'building'] as const

    for (const [archetype, template] of Object.entries(VOICE_TEMPLATES)) {
      for (const pattern of patterns) {
        expect(template.transforms[pattern]).toBeDefined()
        expect(template.transforms[pattern].length).toBeGreaterThan(0)
      }
    }
  })

  it('each archetype has matching archetype property', () => {
    for (const [key, template] of Object.entries(VOICE_TEMPLATES)) {
      expect(template.archetype).toBe(key)
    }
  })
})

describe('detectArchetype', () => {
  describe('ASK_FOR_DETAILS', () => {
    it('detects "tell me more" variants', () => {
      expect(detectArchetype('Tell me more about that')).toBe('ASK_FOR_DETAILS')
      expect(detectArchetype('Tell me more about your work')).toBe('ASK_FOR_DETAILS')
    })

    it('detects "walk me through" variants', () => {
      expect(detectArchetype('Walk me through the process')).toBe('ASK_FOR_DETAILS')
    })

    it('detects question patterns', () => {
      expect(detectArchetype("What's the story behind this?")).toBe('ASK_FOR_DETAILS')
      expect(detectArchetype('How did you get started?')).toBe('ASK_FOR_DETAILS')
      expect(detectArchetype('Why did you choose that path?')).toBe('ASK_FOR_DETAILS')
    })
  })

  describe('STAY_SILENT', () => {
    it('detects silence markers', () => {
      expect(detectArchetype('[Silence]')).toBe('STAY_SILENT')
      expect(detectArchetype('[Stay silent]')).toBe('STAY_SILENT')
      expect(detectArchetype('[Wait]')).toBe('STAY_SILENT')
      expect(detectArchetype('[Pause]')).toBe('STAY_SILENT')
    })

    it('detects "say nothing" variants', () => {
      expect(detectArchetype('Say nothing')).toBe('STAY_SILENT')
      expect(detectArchetype("Don't respond")).toBe('STAY_SILENT')
    })
  })

  describe('ACKNOWLEDGE_EMOTION', () => {
    it('detects validation phrases', () => {
      expect(detectArchetype('That sounds really hard')).toBe('ACKNOWLEDGE_EMOTION')
      expect(detectArchetype('That must be difficult')).toBe('ACKNOWLEDGE_EMOTION')
      expect(detectArchetype('I can hear how frustrated you are')).toBe('ACKNOWLEDGE_EMOTION')
    })

    it('detects observation phrases', () => {
      expect(detectArchetype('You seem upset about this')).toBe('ACKNOWLEDGE_EMOTION')
      expect(detectArchetype('I notice you look worried')).toBe('ACKNOWLEDGE_EMOTION')
    })
  })

  describe('EXPRESS_CURIOSITY', () => {
    it('detects curiosity phrases', () => {
      expect(detectArchetype("I'm curious about that")).toBe('EXPRESS_CURIOSITY')
      expect(detectArchetype('I wonder what would happen')).toBe('EXPRESS_CURIOSITY')
      expect(detectArchetype("That's interesting")).toBe('EXPRESS_CURIOSITY')
    })
  })

  describe('OFFER_SUPPORT', () => {
    it('detects support phrases', () => {
      expect(detectArchetype('Can I help you with that?')).toBe('OFFER_SUPPORT')
      expect(detectArchetype("I'm here for you")).toBe('OFFER_SUPPORT')
      expect(detectArchetype("You're not alone in this")).toBe('OFFER_SUPPORT')
    })
  })

  describe('CHALLENGE_ASSUMPTION', () => {
    it('detects challenging phrases', () => {
      expect(detectArchetype('But what if there was another way?')).toBe('CHALLENGE_ASSUMPTION')
      expect(detectArchetype("However, that doesn't explain everything")).toBe('CHALLENGE_ASSUMPTION')
      expect(detectArchetype('Have you considered the opposite?')).toBe('CHALLENGE_ASSUMPTION')
    })
  })

  describe('SHOW_UNDERSTANDING', () => {
    it('detects understanding phrases', () => {
      expect(detectArchetype('That makes sense')).toBe('SHOW_UNDERSTANDING')
      expect(detectArchetype('I understand now')).toBe('SHOW_UNDERSTANDING')
      expect(detectArchetype('Got it')).toBe('SHOW_UNDERSTANDING')
    })
  })

  describe('TAKE_ACTION', () => {
    it('detects action phrases', () => {
      expect(detectArchetype("Let's do this")).toBe('TAKE_ACTION')
      expect(detectArchetype("I'm ready")).toBe('TAKE_ACTION')
      expect(detectArchetype('Time to move')).toBe('TAKE_ACTION')
    })
  })

  describe('REFLECT_BACK', () => {
    it('detects reflection phrases', () => {
      expect(detectArchetype("So you're saying that...")).toBe('REFLECT_BACK')
      expect(detectArchetype('What I hear is...')).toBe('REFLECT_BACK')
      expect(detectArchetype('Sounds like you feel...')).toBe('REFLECT_BACK')
    })
  })

  describe('SET_BOUNDARY', () => {
    it('detects boundary phrases', () => {
      expect(detectArchetype('I need time to think')).toBe('SET_BOUNDARY')
      expect(detectArchetype('Give me a moment')).toBe('SET_BOUNDARY')
      expect(detectArchetype("I'm not ready for that yet")).toBe('SET_BOUNDARY')
    })
  })

  describe('edge cases', () => {
    it('returns null for unrecognized text', () => {
      expect(detectArchetype('Hello there')).toBeNull()
      expect(detectArchetype('Nice weather')).toBeNull()
    })

    it('handles empty string', () => {
      expect(detectArchetype('')).toBeNull()
    })

    it('handles very short text', () => {
      expect(detectArchetype('Hi')).toBeNull()
    })
  })
})

describe('extractSlotValues', () => {
  describe('subject slot', () => {
    it('extracts subject from "about X" pattern', () => {
      const slots = extractSlotValues('Tell me more about your journey', 'ASK_FOR_DETAILS')
      expect(slots.subject).toBe('your journey')
    })

    it('extracts subject from noun phrases', () => {
      const slots = extractSlotValues('Walk me through the process', 'ASK_FOR_DETAILS')
      expect(slots.subject).toBe('process')
    })

    it('defaults to "this" for unclear subjects', () => {
      const slots = extractSlotValues('Explain', 'ASK_FOR_DETAILS')
      expect(slots.subject).toBe('this')
    })
  })

  describe('emotion slot', () => {
    it('extracts emotion words', () => {
      const slots = extractSlotValues('That sounds really hard', 'ACKNOWLEDGE_EMOTION')
      expect(slots.emotion).toBe('hard')
    })

    it('extracts various emotion words', () => {
      expect(extractSlotValues('That sounds overwhelming', 'ACKNOWLEDGE_EMOTION').emotion).toBe('overwhelming')
      expect(extractSlotValues('That seems frustrating', 'ACKNOWLEDGE_EMOTION').emotion).toBe('frustrating')
    })

    it('defaults to "heavy" for unclear emotions', () => {
      const slots = extractSlotValues('That sounds intense', 'ACKNOWLEDGE_EMOTION')
      expect(slots.emotion).toBe('heavy')
    })
  })

  describe('content slot', () => {
    it('extracts content after "saying"', () => {
      const slots = extractSlotValues("So you're saying: this is important", 'REFLECT_BACK')
      expect(slots.content).toBe('this is important')
    })

    it('cleans up prefix patterns', () => {
      const slots = extractSlotValues("So you're saying the work matters", 'REFLECT_BACK')
      expect(slots.content).toBeTruthy()
    })
  })
})

describe('fillSlots', () => {
  it('fills single slot', () => {
    const result = fillSlots('Tell me about {subject}', { subject: 'your work' })
    expect(result).toBe('Tell me about your work')
  })

  it('fills multiple slots', () => {
    const result = fillSlots('{subject} feels {emotion}', { subject: 'This', emotion: 'heavy' })
    expect(result).toBe('This feels heavy')
  })

  it('uses defaults for missing slots', () => {
    const result = fillSlots('Tell me about {subject}', {})
    expect(result).toBe('Tell me about this')
  })

  it('fills same slot multiple times', () => {
    const result = fillSlots('{subject} is {subject}', { subject: 'life' })
    expect(result).toBe('life is life')
  })
})

describe('isValidArchetype', () => {
  it('returns true for valid archetypes', () => {
    expect(isValidArchetype('ASK_FOR_DETAILS')).toBe(true)
    expect(isValidArchetype('STAY_SILENT')).toBe(true)
    expect(isValidArchetype('TAKE_ACTION')).toBe(true)
  })

  it('returns false for invalid archetypes', () => {
    expect(isValidArchetype('INVALID')).toBe(false)
    expect(isValidArchetype('')).toBe(false)
    expect(isValidArchetype('ask_for_details')).toBe(false)
  })
})
