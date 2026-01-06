/**
 * Loyalty Experience System Tests
 *
 * Tests for E2-034 to E2-039: Character loyalty experiences
 * Original 7:
 * - E2-035: Maya's "The Demo"
 * - E2-036: Devon's "The Outage"
 * - E2-037: Samuel's "The Quiet Hour"
 * - E2-038: Marcus's "The Breach"
 * - E2-039: Rohan's "The Confrontation"
 * - Tess's "The First Class"
 * - Jordan's "The Crossroads"
 *
 * Extended 9:
 * - Grace's "The Vigil"
 * - Alex's "The Honest Course"
 * - Kai's "The Inspection"
 * - Yaquin's "The Launch"
 * - Elena's "The Pattern"
 * - Silas's "The Feral Lab"
 * - Asha's "The Mural"
 * - Lira's "The Memory Song"
 * - Zara's "The Audit"
 */

import { describe, test, expect } from 'vitest'
import {
  LOYALTY_TRUST_THRESHOLD,
  LOYALTY_PATTERN_THRESHOLD,
  LOYALTY_EXPERIENCES,
  LoyaltyExperience,
  LoyaltyExperienceType,
  getLoyaltyExperienceForCharacter,
  isLoyaltyExperienceUnlocked,
  MAYA_THE_DEMO,
  DEVON_THE_OUTAGE,
  SAMUEL_THE_QUIET_HOUR,
  MARCUS_THE_BREACH,
  ROHAN_THE_CONFRONTATION,
  TESS_THE_FIRST_CLASS,
  JORDAN_THE_CROSSROADS
} from '../../lib/loyalty-experience'
import { PatternType } from '../../lib/patterns'

describe('Loyalty Experience System', () => {
  describe('Constants', () => {
    test('loyalty trust threshold should require high trust', () => {
      expect(LOYALTY_TRUST_THRESHOLD).toBe(8)
      // Should be 80% of max trust (10)
      expect(LOYALTY_TRUST_THRESHOLD / 10).toBeGreaterThanOrEqual(0.8)
    })

    test('loyalty pattern threshold should require significant investment', () => {
      expect(LOYALTY_PATTERN_THRESHOLD).toBe(5)
    })
  })

  describe('Experience Registry', () => {
    test('should have all 16 loyalty experiences', () => {
      expect(Object.keys(LOYALTY_EXPERIENCES)).toHaveLength(16)
    })

    test('each experience should have unique character', () => {
      const characters = Object.values(LOYALTY_EXPERIENCES).map(exp => exp.characterId)
      const uniqueCharacters = new Set(characters)
      expect(uniqueCharacters.size).toBe(16)
    })

    test('all experience types should be registered', () => {
      const types: LoyaltyExperienceType[] = [
        // Original 7
        'the_demo',
        'the_outage',
        'the_quiet_hour',
        'the_breach',
        'the_confrontation',
        'the_first_class',
        'the_crossroads',
        // Extended 9
        'the_vigil',
        'the_honest_course',
        'the_inspection',
        'the_launch',
        'the_pattern',
        'the_feral_lab',
        'the_mural',
        'the_memory_song',
        'the_audit'
      ]
      types.forEach(type => {
        expect(LOYALTY_EXPERIENCES[type]).toBeDefined()
      })
    })
  })

  describe('getLoyaltyExperienceForCharacter', () => {
    test('should return Maya\'s experience', () => {
      const exp = getLoyaltyExperienceForCharacter('maya')
      expect(exp?.id).toBe('the_demo')
    })

    test('should return Devon\'s experience', () => {
      const exp = getLoyaltyExperienceForCharacter('devon')
      expect(exp?.id).toBe('the_outage')
    })

    test('should return Samuel\'s experience', () => {
      const exp = getLoyaltyExperienceForCharacter('samuel')
      expect(exp?.id).toBe('the_quiet_hour')
    })

    test('should return Marcus\'s experience', () => {
      const exp = getLoyaltyExperienceForCharacter('marcus')
      expect(exp?.id).toBe('the_breach')
    })

    test('should return Rohan\'s experience', () => {
      const exp = getLoyaltyExperienceForCharacter('rohan')
      expect(exp?.id).toBe('the_confrontation')
    })

    test('should return Tess\'s experience', () => {
      const exp = getLoyaltyExperienceForCharacter('tess')
      expect(exp?.id).toBe('the_first_class')
    })

    test('should return Jordan\'s experience', () => {
      const exp = getLoyaltyExperienceForCharacter('jordan')
      expect(exp?.id).toBe('the_crossroads')
    })

    test('should return Grace\'s experience', () => {
      const exp = getLoyaltyExperienceForCharacter('grace')
      expect(exp?.id).toBe('the_vigil')
    })

    test('should return undefined for location without loyalty experience', () => {
      const exp = getLoyaltyExperienceForCharacter('station_entry')
      expect(exp).toBeUndefined()
    })
  })

  describe('isLoyaltyExperienceUnlocked', () => {
    const basePatterns: Record<PatternType, number> = {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    }

    test('should be locked when trust is too low', () => {
      const unlocked = isLoyaltyExperienceUnlocked(
        MAYA_THE_DEMO,
        5, // Below threshold
        { ...basePatterns, building: 10 },
        new Set(['maya_arc_complete'])
      )
      expect(unlocked).toBe(false)
    })

    test('should be locked when pattern level is too low', () => {
      const unlocked = isLoyaltyExperienceUnlocked(
        MAYA_THE_DEMO,
        10,
        { ...basePatterns, building: 2 }, // Below threshold
        new Set(['maya_arc_complete'])
      )
      expect(unlocked).toBe(false)
    })

    test('should be locked when required flags are missing', () => {
      const unlocked = isLoyaltyExperienceUnlocked(
        MAYA_THE_DEMO,
        10,
        { ...basePatterns, building: 10 },
        new Set() // Missing maya_arc_complete
      )
      expect(unlocked).toBe(false)
    })

    test('should be unlocked when all requirements met', () => {
      const unlocked = isLoyaltyExperienceUnlocked(
        MAYA_THE_DEMO,
        10,
        { ...basePatterns, building: 10 },
        new Set(['maya_arc_complete'])
      )
      expect(unlocked).toBe(true)
    })

    test('should unlock exactly at thresholds', () => {
      const unlocked = isLoyaltyExperienceUnlocked(
        MAYA_THE_DEMO,
        LOYALTY_TRUST_THRESHOLD,
        { ...basePatterns, building: LOYALTY_PATTERN_THRESHOLD },
        new Set(['maya_arc_complete'])
      )
      expect(unlocked).toBe(true)
    })
  })

  describe('Maya - The Demo (E2-035)', () => {
    test('should have correct structure', () => {
      expect(MAYA_THE_DEMO.id).toBe('the_demo')
      expect(MAYA_THE_DEMO.characterId).toBe('maya')
      expect(MAYA_THE_DEMO.title).toBe('The Demo')
    })

    test('should require building pattern', () => {
      expect(MAYA_THE_DEMO.requirements.patternRequirement?.pattern).toBe('building')
    })

    test('should have multiple phases', () => {
      expect(MAYA_THE_DEMO.phases.length).toBeGreaterThanOrEqual(3)
    })

    test('each phase should have choices', () => {
      MAYA_THE_DEMO.phases.forEach(phase => {
        expect(phase.choices.length).toBeGreaterThanOrEqual(2)
      })
    })

    test('should have success and failure endings', () => {
      expect(MAYA_THE_DEMO.successEnding).toBeDefined()
      expect(MAYA_THE_DEMO.failureEnding).toBeDefined()
      expect(MAYA_THE_DEMO.successEnding.trustBonus).toBeGreaterThan(0)
    })

    test('success should unlock flag', () => {
      expect(MAYA_THE_DEMO.successEnding.unlockedFlag).toBe('maya_loyalty_complete')
    })
  })

  describe('Devon - The Outage (E2-036)', () => {
    test('should have correct structure', () => {
      expect(DEVON_THE_OUTAGE.id).toBe('the_outage')
      expect(DEVON_THE_OUTAGE.characterId).toBe('devon')
      expect(DEVON_THE_OUTAGE.title).toBe('The Outage')
    })

    test('should require analytical pattern', () => {
      expect(DEVON_THE_OUTAGE.requirements.patternRequirement?.pattern).toBe('analytical')
    })

    test('should include crisis management skills', () => {
      expect(DEVON_THE_OUTAGE.skills).toContain('Crisis Management')
    })

    test('phases should have time context for pressure', () => {
      const phasesWithTimeContext = DEVON_THE_OUTAGE.phases.filter(p => p.timeContext)
      expect(phasesWithTimeContext.length).toBeGreaterThan(0)
    })
  })

  describe('Samuel - The Quiet Hour (E2-037)', () => {
    test('should have correct structure', () => {
      expect(SAMUEL_THE_QUIET_HOUR.id).toBe('the_quiet_hour')
      expect(SAMUEL_THE_QUIET_HOUR.characterId).toBe('samuel')
      expect(SAMUEL_THE_QUIET_HOUR.title).toBe('The Quiet Hour')
    })

    test('should require patience pattern', () => {
      expect(SAMUEL_THE_QUIET_HOUR.requirements.patternRequirement?.pattern).toBe('patience')
    })

    test('should emphasize silence as gameplay', () => {
      const silentChoices = SAMUEL_THE_QUIET_HOUR.phases.flatMap(p =>
        p.choices.filter(c => c.text.includes('[') && c.text.includes('silent'))
      )
      expect(silentChoices.length).toBeGreaterThan(0)
    })

    test('should test active listening skills', () => {
      expect(SAMUEL_THE_QUIET_HOUR.skills).toContain('Active Listening')
    })
  })

  describe('Marcus - The Breach (E2-038)', () => {
    test('should have correct structure', () => {
      expect(MARCUS_THE_BREACH.id).toBe('the_breach')
      expect(MARCUS_THE_BREACH.characterId).toBe('marcus')
      expect(MARCUS_THE_BREACH.title).toBe('The Breach')
    })

    test('should require analytical pattern', () => {
      expect(MARCUS_THE_BREACH.requirements.patternRequirement?.pattern).toBe('analytical')
    })

    test('should involve ethical decisions', () => {
      // Check that choices involve ethics vs pragmatism
      const allChoices = MARCUS_THE_BREACH.phases.flatMap(p => p.choices)
      const hasEthicalChoices = allChoices.some(c =>
        c.text.toLowerCase().includes('patient') ||
        c.text.toLowerCase().includes('notify') ||
        c.text.toLowerCase().includes('immediate')
      )
      expect(hasEthicalChoices).toBe(true)
    })
  })

  describe('Rohan - The Confrontation (E2-039)', () => {
    test('should have correct structure', () => {
      expect(ROHAN_THE_CONFRONTATION.id).toBe('the_confrontation')
      expect(ROHAN_THE_CONFRONTATION.characterId).toBe('rohan')
      expect(ROHAN_THE_CONFRONTATION.title).toBe('The Confrontation')
    })

    test('should require analytical pattern', () => {
      expect(ROHAN_THE_CONFRONTATION.requirements.patternRequirement?.pattern).toBe('analytical')
    })

    test('should test courage skill', () => {
      expect(ROHAN_THE_CONFRONTATION.skills).toContain('Courage')
    })

    test('should involve standing by data', () => {
      const allChoiceTexts = ROHAN_THE_CONFRONTATION.phases
        .flatMap(p => p.choices.map(c => c.text.toLowerCase()))
        .join(' ')
      expect(
        allChoiceTexts.includes('data') ||
        allChoiceTexts.includes('methodology') ||
        allChoiceTexts.includes('truth')
      ).toBe(true)
    })
  })

  describe('Tess - The First Class (Extended)', () => {
    test('should have correct structure', () => {
      expect(TESS_THE_FIRST_CLASS.id).toBe('the_first_class')
      expect(TESS_THE_FIRST_CLASS.characterId).toBe('tess')
      expect(TESS_THE_FIRST_CLASS.title).toBe('The First Class')
    })

    test('should require helping pattern', () => {
      expect(TESS_THE_FIRST_CLASS.requirements.patternRequirement?.pattern).toBe('helping')
    })

    test('should test crisis management skill', () => {
      expect(TESS_THE_FIRST_CLASS.skills).toContain('Crisis Management')
    })

    test('should have education-focused phases', () => {
      const allSituations = TESS_THE_FIRST_CLASS.phases
        .map(p => p.situation.toLowerCase())
        .join(' ')
      expect(
        allSituations.includes('student') ||
        allSituations.includes('inspection') ||
        allSituations.includes('class')
      ).toBe(true)
    })
  })

  describe('Jordan - The Crossroads (Extended)', () => {
    test('should have correct structure', () => {
      expect(JORDAN_THE_CROSSROADS.id).toBe('the_crossroads')
      expect(JORDAN_THE_CROSSROADS.characterId).toBe('jordan')
      expect(JORDAN_THE_CROSSROADS.title).toBe('The Crossroads')
    })

    test('should require helping pattern', () => {
      expect(JORDAN_THE_CROSSROADS.requirements.patternRequirement?.pattern).toBe('helping')
    })

    test('should test boundary setting skill', () => {
      expect(JORDAN_THE_CROSSROADS.skills).toContain('Boundary Setting')
    })

    test('should involve career counseling scenarios', () => {
      const allSituations = JORDAN_THE_CROSSROADS.phases
        .map(p => p.situation.toLowerCase())
        .join(' ')
      expect(
        allSituations.includes('resume') ||
        allSituations.includes('job') ||
        allSituations.includes('client')
      ).toBe(true)
    })
  })

  describe('Experience Structure Consistency', () => {
    const allExperiences = Object.values(LOYALTY_EXPERIENCES)

    test('all experiences should have introduction text', () => {
      allExperiences.forEach(exp => {
        expect(exp.introduction).toBeDefined()
        expect(exp.introduction.length).toBeGreaterThan(50)
      })
    })

    test('all experiences should have at least 3 phases', () => {
      allExperiences.forEach(exp => {
        expect(exp.phases.length).toBeGreaterThanOrEqual(3)
      })
    })

    test('all phase choices should have outcomes', () => {
      allExperiences.forEach(exp => {
        exp.phases.forEach(phase => {
          phase.choices.forEach(choice => {
            expect(choice.outcome).toBeDefined()
            expect(choice.outcome.feedback).toBeDefined()
          })
        })
      })
    })

    test('all experiences should have success flag', () => {
      allExperiences.forEach(exp => {
        expect(exp.successEnding.unlockedFlag).toBeDefined()
        expect(exp.successEnding.unlockedFlag).toContain('loyalty_complete')
      })
    })

    test('all experiences should be retryable on failure', () => {
      allExperiences.forEach(exp => {
        expect(exp.failureEnding.canRetry).toBe(true)
      })
    })

    test('success should grant trust bonus', () => {
      allExperiences.forEach(exp => {
        expect(exp.successEnding.trustBonus).toBeGreaterThanOrEqual(2)
      })
    })
  })

  describe('Pattern Attribution', () => {
    test('choices should be attributed to valid patterns', () => {
      const validPatterns: PatternType[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

      Object.values(LOYALTY_EXPERIENCES).forEach(exp => {
        exp.phases.forEach(phase => {
          phase.choices.forEach(choice => {
            if (choice.pattern) {
              expect(validPatterns).toContain(choice.pattern)
            }
          })
        })
      })
    })

    test('each experience should reward multiple patterns', () => {
      Object.values(LOYALTY_EXPERIENCES).forEach(exp => {
        const patternsUsed = new Set<PatternType>()
        exp.phases.forEach(phase => {
          phase.choices.forEach(choice => {
            if (choice.pattern) {
              patternsUsed.add(choice.pattern)
            }
          })
        })
        // Each experience should involve at least 2 different patterns
        expect(patternsUsed.size).toBeGreaterThanOrEqual(2)
      })
    })
  })
})
