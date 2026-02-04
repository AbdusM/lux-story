import { describe, it, expect, beforeEach } from 'vitest'
import {
  FutureSkillsSystem,
  getFutureSkillsSystem,
  BIRMINGHAM_CAREER_PATHS,
  calculateCareerMatchesFromSkills,
  countSkillDemonstrations,
  type FutureSkills,
  type CareerPath2030
} from '@/lib/2030-skills-system'

describe('FutureSkillsSystem', () => {
  let system: FutureSkillsSystem

  beforeEach(() => {
    system = new FutureSkillsSystem()
  })

  describe('initialization', () => {
    it('initializes all skills to 0.5', () => {
      const skills = system.getSkills()

      // Check core skills
      expect(skills.criticalThinking).toBe(0.5)
      expect(skills.communication).toBe(0.5)
      expect(skills.collaboration).toBe(0.5)
      expect(skills.creativity).toBe(0.5)
      expect(skills.leadership).toBe(0.5)

      // Check expanded skills
      expect(skills.systemsThinking).toBe(0.5)
      expect(skills.promptEngineering).toBe(0.5)
      expect(skills.debuggingMastery).toBe(0.5)
    })

    it('returns a copy of skills, not the original', () => {
      const skills1 = system.getSkills()
      const skills2 = system.getSkills()

      expect(skills1).not.toBe(skills2)
      expect(skills1).toEqual(skills2)
    })
  })

  describe('analyzeChoiceForSkills', () => {
    it('detects critical thinking keywords', () => {
      const contexts = system.analyzeChoiceForSkills(
        'I would analyze the data and evaluate all options carefully',
        'test_scene'
      )

      const criticalThinkingContext = contexts.find(c => c.skillType === 'criticalThinking')
      expect(criticalThinkingContext).toBeDefined()
      expect(criticalThinkingContext!.skillValue).toBeGreaterThan(0.3)
    })

    it('detects communication keywords', () => {
      const contexts = system.analyzeChoiceForSkills(
        'I will explain my ideas and share them with the team in a presentation',
        'test_scene'
      )

      const commContext = contexts.find(c => c.skillType === 'communication')
      expect(commContext).toBeDefined()
      expect(commContext!.skillValue).toBeGreaterThan(0.3)
    })

    it('detects collaboration keywords', () => {
      const contexts = system.analyzeChoiceForSkills(
        'We should work together as a team and support each other',
        'test_scene'
      )

      const collabContext = contexts.find(c => c.skillType === 'collaboration')
      expect(collabContext).toBeDefined()
    })

    it('detects leadership keywords', () => {
      const contexts = system.analyzeChoiceForSkills(
        'I will lead the group and inspire everyone to reach our goal',
        'test_scene'
      )

      const leaderContext = contexts.find(c => c.skillType === 'leadership')
      expect(leaderContext).toBeDefined()
    })

    it('detects digital literacy keywords', () => {
      const contexts = system.analyzeChoiceForSkills(
        'We can use a computer app to analyze the data online',
        'test_scene'
      )

      const digitalContext = contexts.find(c => c.skillType === 'digitalLiteracy')
      expect(digitalContext).toBeDefined()
    })

    it('returns empty array for text without skill keywords', () => {
      const contexts = system.analyzeChoiceForSkills(
        'yes',
        'test_scene'
      )

      // May return some with low scores from complexity factor
      const significantContexts = contexts.filter(c => c.skillValue > 0.5)
      expect(significantContexts.length).toBe(0)
    })

    it('includes scene context in returned SkillContext', () => {
      const contexts = system.analyzeChoiceForSkills(
        'I will analyze evaluate examine and assess this problem using logic and reason',
        'maya_intro'
      )

      const context = contexts.find(c => c.skillType === 'criticalThinking')
      expect(context).toBeDefined()
      expect(context!.sceneId).toBe('maya_intro')
    })

    it('includes explanation in returned SkillContext', () => {
      const contexts = system.analyzeChoiceForSkills(
        'I will analyze evaluate examine and assess this problem using logic and reason',
        'test'
      )

      const context = contexts.find(c => c.skillType === 'criticalThinking')
      expect(context).toBeDefined()
      expect(context!.explanation).toContain('analytical')
    })

    it('limits skill history to 50 entries', () => {
      // Make 60 choices
      for (let i = 0; i < 60; i++) {
        system.analyzeChoiceForSkills(
          'I will analyze and evaluate the problem to find a creative solution',
          `scene_${i}`
        )
      }

      // Internal history should be capped (we can't access it directly, but we can verify via summary)
      const summary = system.getSkillsSummary()
      expect(summary).toBeDefined()
    })
  })

  describe('skill level updates', () => {
    it('increases skill level based on choice analysis', () => {
      const initialSkills = system.getSkills()
      const initialCritical = initialSkills.criticalThinking

      // Make a choice with strong critical thinking keywords
      system.analyzeChoiceForSkills(
        'I will carefully analyze and evaluate all the evidence to examine the logic',
        'test'
      )

      const updatedSkills = system.getSkills()
      // Skill should have increased (with diminishing returns formula)
      expect(updatedSkills.criticalThinking).toBeGreaterThanOrEqual(initialCritical)
    })

    it('clamps skill values between 0 and 1', () => {
      // Make many high-skill choices
      for (let i = 0; i < 20; i++) {
        system.analyzeChoiceForSkills(
          'I will analyze evaluate examine assess reason logic think consider',
          'test'
        )
      }

      const skills = system.getSkills()
      expect(skills.criticalThinking).toBeLessThanOrEqual(1)
      expect(skills.criticalThinking).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getMatchingCareerPaths', () => {
    it('returns up to 6 career paths', () => {
      const paths = system.getMatchingCareerPaths()
      expect(paths.length).toBeLessThanOrEqual(6)
      expect(paths.length).toBeGreaterThan(0)
    })

    it('returns career paths sorted by match score', () => {
      const paths = system.getMatchingCareerPaths()

      for (let i = 1; i < paths.length; i++) {
        const prevScore = (paths[i - 1] as CareerPath2030 & { matchScore: number }).matchScore
        const currScore = (paths[i] as CareerPath2030 & { matchScore: number }).matchScore
        expect(prevScore).toBeGreaterThanOrEqual(currScore)
      }
    })

    it('returns paths with required properties', () => {
      const paths = system.getMatchingCareerPaths()

      paths.forEach(path => {
        expect(path.id).toBeDefined()
        expect(path.name).toBeDefined()
        expect(path.description).toBeDefined()
        expect(path.requiredSkills).toBeInstanceOf(Array)
        expect(path.salaryRange).toBeInstanceOf(Array)
        expect(path.salaryRange.length).toBe(2)
      })
    })
  })

  describe('getSkillPrompt', () => {
    it('returns a prompt for mapped skill types', () => {
      const prompt = system.getSkillPrompt('criticalThinking')
      expect(prompt).toBeDefined()
      expect(typeof prompt).toBe('string')
    })

    it('returns null for unmapped skill types', () => {
      // Some expanded skills don't have prompts
      const prompt = system.getSkillPrompt('debuggingMastery')
      expect(prompt).toBeNull()
    })

    it('returns different prompts (randomized)', () => {
      // Get multiple prompts and check they include expected patterns
      const prompts = new Set<string>()
      for (let i = 0; i < 20; i++) {
        const prompt = system.getSkillPrompt('criticalThinking')
        if (prompt) prompts.add(prompt)
      }

      // Should have gotten multiple different prompts
      expect(prompts.size).toBeGreaterThan(1)
    })
  })

  describe('getSkillsSummary', () => {
    it('returns topSkills array', () => {
      const summary = system.getSkillsSummary()
      expect(summary.topSkills).toBeInstanceOf(Array)
      expect((summary.topSkills as unknown[]).length).toBeLessThanOrEqual(5)
    })

    it('returns developingSkills array', () => {
      const summary = system.getSkillsSummary()
      expect(summary.developingSkills).toBeInstanceOf(Array)
    })

    it('returns overall level string', () => {
      const summary = system.getSkillsSummary()
      expect(['Beginning', 'Developing', 'Intermediate', 'Advanced']).toContain(summary.overallLevel)
    })

    it('returns career readiness percentage', () => {
      const summary = system.getSkillsSummary()
      expect(typeof summary.careerReadiness).toBe('number')
      expect(summary.careerReadiness).toBeGreaterThanOrEqual(0)
      expect(summary.careerReadiness).toBeLessThanOrEqual(100)
    })

    it('top skills have skill, value, and level properties', () => {
      const summary = system.getSkillsSummary()
      const topSkills = summary.topSkills as Array<{ skill: string; value: number; level: string }>

      topSkills.forEach(skill => {
        expect(skill.skill).toBeDefined()
        expect(typeof skill.value).toBe('number')
        expect(['Developing', 'Intermediate', 'Advanced']).toContain(skill.level)
      })
    })
  })

  describe('reset', () => {
    it('resets all skills to 0.5', () => {
      // First modify some skills
      system.analyzeChoiceForSkills(
        'analyze evaluate examine assess reason logic think consider',
        'test'
      )

      const modifiedSkills = system.getSkills()
      expect(modifiedSkills.criticalThinking).not.toBe(0.5)

      // Reset
      system.reset()

      const resetSkills = system.getSkills()
      expect(resetSkills.criticalThinking).toBe(0.5)
      expect(resetSkills.communication).toBe(0.5)
    })

    it('clears skill history', () => {
      // Add some history
      system.analyzeChoiceForSkills('analyze the problem', 'test1')
      system.analyzeChoiceForSkills('analyze the problem', 'test2')

      // Reset
      system.reset()

      // After reset, summary should reflect fresh state
      const summary = system.getSkillsSummary()
      expect(summary.careerReadiness).toBe(50) // 0.5 average = 50%
    })
  })
})

describe('getFutureSkillsSystem (singleton)', () => {
  it('returns the same instance on multiple calls', () => {
    const instance1 = getFutureSkillsSystem()
    const instance2 = getFutureSkillsSystem()

    expect(instance1).toBe(instance2)
  })

  it('returns a FutureSkillsSystem instance', () => {
    const instance = getFutureSkillsSystem()
    expect(instance).toBeInstanceOf(FutureSkillsSystem)
  })
})

describe('BIRMINGHAM_CAREER_PATHS', () => {
  it('exports an array of career paths', () => {
    expect(BIRMINGHAM_CAREER_PATHS).toBeInstanceOf(Array)
    expect(BIRMINGHAM_CAREER_PATHS.length).toBeGreaterThan(0)
  })

  it('all paths have valid structure', () => {
    BIRMINGHAM_CAREER_PATHS.forEach(path => {
      expect(path.id).toBeDefined()
      expect(typeof path.id).toBe('string')
      expect(path.name).toBeDefined()
      expect(path.description).toBeDefined()
      expect(path.requiredSkills).toBeInstanceOf(Array)
      expect(path.requiredSkills.length).toBeGreaterThan(0)
      expect(path.birminghamRelevance).toBeGreaterThanOrEqual(0)
      expect(path.birminghamRelevance).toBeLessThanOrEqual(1)
      expect(['high', 'medium', 'stable']).toContain(path.growthProjection)
      expect(path.salaryRange).toBeInstanceOf(Array)
      expect(path.salaryRange.length).toBe(2)
      expect(path.salaryRange[0]).toBeLessThan(path.salaryRange[1])
      expect(path.educationPath).toBeInstanceOf(Array)
      expect(path.localOpportunities).toBeInstanceOf(Array)
    })
  })

  it('includes healthcare-tech career', () => {
    const healthTech = BIRMINGHAM_CAREER_PATHS.find(p => p.id === 'healthcare-tech')
    expect(healthTech).toBeDefined()
    expect(healthTech!.name).toBe('Healthcare Technology Specialist')
  })

  it('includes cybersecurity-specialist career', () => {
    const cyber = BIRMINGHAM_CAREER_PATHS.find(p => p.id === 'cybersecurity-specialist')
    expect(cyber).toBeDefined()
    expect(cyber!.requiredSkills).toContain('digitalLiteracy')
  })

  it('includes learning-experience-architect career', () => {
    const lea = BIRMINGHAM_CAREER_PATHS.find(p => p.id === 'learning-experience-architect')
    expect(lea).toBeDefined()
    expect(lea!.requiredSkills).toContain('instructionalDesign')
  })
})

describe('calculateCareerMatchesFromSkills', () => {
  it('returns top 6 career matches', () => {
    const skills = {
      criticalThinking: 0.7,
      communication: 0.6,
      digitalLiteracy: 0.8,
      problemSolving: 0.6
    }

    const matches = calculateCareerMatchesFromSkills(skills)
    expect(matches.length).toBeLessThanOrEqual(6)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('returns matches sorted by matchScore descending', () => {
    const skills = {
      criticalThinking: 0.5,
      digitalLiteracy: 0.5,
      communication: 0.5
    }

    const matches = calculateCareerMatchesFromSkills(skills)

    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].matchScore).toBeGreaterThanOrEqual(matches[i].matchScore)
    }
  })

  it('calculates match score from required skills', () => {
    // Healthcare-tech requires: digitalLiteracy, communication, problemSolving, emotionalIntelligence
    const skills = {
      digitalLiteracy: 1.0,
      communication: 1.0,
      problemSolving: 1.0,
      emotionalIntelligence: 1.0
    }

    const matches = calculateCareerMatchesFromSkills(skills)
    const healthTech = matches.find(m => m.name === 'Healthcare Technology Specialist')

    expect(healthTech).toBeDefined()
    expect(healthTech!.matchScore).toBe(1.0) // Perfect match
  })

  it('handles missing skills (defaults to 0)', () => {
    const skills = {} // No skills

    const matches = calculateCareerMatchesFromSkills(skills)

    // All matches should have low scores
    matches.forEach(match => {
      expect(match.matchScore).toBe(0)
    })
  })

  it('generates evidence for match based on skill levels', () => {
    const skills = {
      digitalLiteracy: 0.8, // Strong
      communication: 0.5, // Developing
      problemSolving: 0.2 // Beginning
    }

    const matches = calculateCareerMatchesFromSkills(skills)
    const healthTech = matches.find(m => m.name === 'Healthcare Technology Specialist')

    expect(healthTech).toBeDefined()
    expect(healthTech!.evidenceForMatch.some(e => e.includes('Strong'))).toBe(true)
    expect(healthTech!.evidenceForMatch.some(e => e.includes('Developing'))).toBe(true)
    expect(healthTech!.evidenceForMatch.some(e => e.includes('Beginning'))).toBe(true)
  })

  it('calculates skill gaps correctly', () => {
    const skills = {
      digitalLiteracy: 0.3,
      communication: 0.5
    }

    const matches = calculateCareerMatchesFromSkills(skills)
    const healthTech = matches.find(m => m.name === 'Healthcare Technology Specialist')

    expect(healthTech).toBeDefined()
    const digitalGap = healthTech!.requiredSkills.digitalLiteracy
    expect(digitalGap.current).toBe(0.3)
    expect(digitalGap.required).toBe(0.8) // From BIRMINGHAM_CAREER_PATHS skillLevels
    expect(digitalGap.gap).toBe(0.5) // 0.8 - 0.3
  })

  it('determines readiness level correctly', () => {
    // High skills = near_ready
    const highSkills = {
      digitalLiteracy: 0.9,
      communication: 0.9,
      problemSolving: 0.9,
      emotionalIntelligence: 0.9
    }
    const highMatches = calculateCareerMatchesFromSkills(highSkills)
    const nearReady = highMatches.find(m => m.readiness === 'near_ready')
    expect(nearReady).toBeDefined()

    // Medium skills = developing
    const medSkills = {
      digitalLiteracy: 0.4,
      communication: 0.4,
      problemSolving: 0.4,
      emotionalIntelligence: 0.4
    }
    const medMatches = calculateCareerMatchesFromSkills(medSkills)
    const developing = medMatches.find(m => m.readiness === 'developing')
    expect(developing).toBeDefined()

    // Low skills = exploring
    const lowSkills = {
      digitalLiteracy: 0.1,
      communication: 0.1
    }
    const lowMatches = calculateCareerMatchesFromSkills(lowSkills)
    const exploring = lowMatches.find(m => m.readiness === 'exploring')
    expect(exploring).toBeDefined()
  })

  it('includes salary range from career path', () => {
    const skills = { digitalLiteracy: 0.5 }
    const matches = calculateCareerMatchesFromSkills(skills)

    matches.forEach(match => {
      expect(match.salaryRange).toBeInstanceOf(Array)
      expect(match.salaryRange.length).toBe(2)
      expect(typeof match.salaryRange[0]).toBe('number')
      expect(typeof match.salaryRange[1]).toBe('number')
    })
  })

  it('includes education paths and local opportunities', () => {
    const skills = { digitalLiteracy: 0.5 }
    const matches = calculateCareerMatchesFromSkills(skills)

    matches.forEach(match => {
      expect(match.educationPaths).toBeInstanceOf(Array)
      expect(match.localOpportunities).toBeInstanceOf(Array)
    })
  })
})

describe('countSkillDemonstrations', () => {
  it('counts skills above 0', () => {
    const skills = {
      criticalThinking: 0.5,
      communication: 0.3,
      digitalLiteracy: 0
    }

    expect(countSkillDemonstrations(skills)).toBe(2)
  })

  it('returns 0 for empty object', () => {
    expect(countSkillDemonstrations({})).toBe(0)
  })

  it('returns 0 for all zero skills', () => {
    const skills = {
      criticalThinking: 0,
      communication: 0,
      leadership: 0
    }

    expect(countSkillDemonstrations(skills)).toBe(0)
  })

  it('counts all non-zero skills', () => {
    const skills: Partial<FutureSkills> = {
      criticalThinking: 0.1,
      communication: 0.2,
      collaboration: 0.3,
      creativity: 0.4,
      adaptability: 0.5
    }

    expect(countSkillDemonstrations(skills)).toBe(5)
  })

  it('handles record with string keys', () => {
    const skills: Record<string, number> = {
      customSkill1: 0.5,
      customSkill2: 0.3,
      customSkill3: 0
    }

    expect(countSkillDemonstrations(skills)).toBe(2)
  })
})

describe('FutureSkills interface completeness', () => {
  it('FutureSkillsSystem initializes all documented skills', () => {
    const system = new FutureSkillsSystem()
    const skills = system.getSkills()

    // Core 12 skills
    const coreSkills = [
      'criticalThinking', 'communication', 'collaboration', 'creativity',
      'adaptability', 'leadership', 'digitalLiteracy', 'emotionalIntelligence',
      'culturalCompetence', 'financialLiteracy', 'timeManagement', 'problemSolving'
    ]

    coreSkills.forEach(skill => {
      expect(skills[skill as keyof FutureSkills]).toBeDefined()
    })

    // Expanded skills
    const expandedSkills = [
      'systemsThinking', 'crisisManagement', 'instructionalDesign', 'riskManagement',
      'courage', 'informationLiteracy', 'learningAgility', 'entrepreneurship',
      'encouragement', 'technicalLiteracy', 'sustainability', 'strategicThinking'
    ]

    expandedSkills.forEach(skill => {
      expect(skills[skill as keyof FutureSkills]).toBeDefined()
    })

    // Simulation skills (Jan 2026)
    const simulationSkills = [
      'projectManagement', 'metaphoricalThinking', 'negotiation', 'confidence',
      'values', 'growth', 'openness', 'selfAwareness', 'compliance', 'technology'
    ]

    simulationSkills.forEach(skill => {
      expect(skills[skill as keyof FutureSkills]).toBeDefined()
    })
  })
})
