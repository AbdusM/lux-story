/**
 * Tests for Cognitive Domain Scoring System
 *
 * Tests the DSM-5 inspired cognitive domain mappings and scoring algorithms.
 */

import { describe, it, expect } from 'vitest'
import {
  // Types
  COGNITIVE_DOMAIN_IDS,
  CognitiveDomainId,
  DomainLevel,

  // Metadata
  DOMAIN_METADATA,
  DOMAIN_THRESHOLDS,
  DOMAIN_COLORS,
  PATTERN_DOMAIN_BOOSTS,

  // Helper functions
  isValidCognitiveDomainId,
  getSkillsForDomain,
  getDomainsForSkill,
  getPatternBoostForDomain,
  determineDomainLevel,
  determineEngagementLevel,
  getLevelColor,
  getLevelLabel,
  getLevelProgress,
  getCoreDomains,
  getAdvancedDomains,
  createEmptyDomainScores
} from '@/lib/cognitive-domains'

import {
  calculateDomainScore,
  calculateAllDomainScores,
  calculateEngagementMetrics,
  calculateCognitiveDomainState,
  getAffectedDomains,
  getStrongestDomains,
  getDevelopmentAreas,
  getDomainsNearThreshold,
  getCognitiveProfileSummary,
  createResearchExport,
  PatternScores
} from '@/lib/cognitive-domain-calculator'

import { SkillDemonstration } from '@/lib/skill-tracker'

// ═══════════════════════════════════════════════════════════════════════════
// Test Helpers
// ═══════════════════════════════════════════════════════════════════════════

function createMockDemonstration(skills: string[], timestamp?: number): SkillDemonstration {
  return {
    scene: 'test_scene',
    sceneDescription: 'Test scene description',
    choice: 'Test choice',
    skillsDemonstrated: skills,
    context: 'Test context',
    timestamp: timestamp || Date.now()
  }
}

function createMockDemonstrations(skillCounts: Record<string, number>): SkillDemonstration[] {
  const demos: SkillDemonstration[] = []

  for (const [skill, count] of Object.entries(skillCounts)) {
    for (let i = 0; i < count; i++) {
      demos.push(createMockDemonstration([skill]))
    }
  }

  return demos
}

const defaultPatternScores: PatternScores = {
  analytical: 0,
  patience: 0,
  exploring: 0,
  helping: 0,
  building: 0
}

// ═══════════════════════════════════════════════════════════════════════════
// COGNITIVE DOMAIN TYPES & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Cognitive Domain Types & Constants', () => {
  it('defines exactly 11 cognitive domains', () => {
    expect(COGNITIVE_DOMAIN_IDS.length).toBe(11)
  })

  it('includes all 6 core DSM-5 domains', () => {
    const coreDomains = ['complexAttention', 'executiveFunctions', 'learningMemory',
                         'language', 'perceptualMotor', 'socialCognition']
    for (const domain of coreDomains) {
      expect(COGNITIVE_DOMAIN_IDS).toContain(domain)
    }
  })

  it('includes all 5 advanced domains', () => {
    const advancedDomains = ['metacognition', 'wisdomJudgment', 'creativitySynthesis',
                             'emotionalIntelligence', 'adaptiveFunctioning']
    for (const domain of advancedDomains) {
      expect(COGNITIVE_DOMAIN_IDS).toContain(domain)
    }
  })

  it('all domains have complete metadata', () => {
    for (const domainId of COGNITIVE_DOMAIN_IDS) {
      const meta = DOMAIN_METADATA[domainId]
      expect(meta).toBeDefined()
      expect(meta.id).toBe(domainId)
      expect(meta.name).toBeTruthy()
      expect(meta.shortName).toBeTruthy()
      expect(meta.description).toBeTruthy()
      expect(['core', 'advanced']).toContain(meta.category)
      expect(meta.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(meta.icon).toBeTruthy()
      expect(meta.skills.length).toBeGreaterThan(0)
    }
  })

  it('all domains have color definitions', () => {
    for (const domainId of COGNITIVE_DOMAIN_IDS) {
      expect(DOMAIN_COLORS[domainId]).toBeDefined()
      expect(DOMAIN_COLORS[domainId].primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DOMAIN_COLORS[domainId].colorblind).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })

  it('thresholds are in ascending order', () => {
    expect(DOMAIN_THRESHOLDS.DORMANT).toBeLessThan(DOMAIN_THRESHOLDS.EMERGING)
    expect(DOMAIN_THRESHOLDS.EMERGING).toBeLessThan(DOMAIN_THRESHOLDS.DEVELOPING)
    expect(DOMAIN_THRESHOLDS.DEVELOPING).toBeLessThan(DOMAIN_THRESHOLDS.FLOURISHING)
    expect(DOMAIN_THRESHOLDS.FLOURISHING).toBeLessThan(DOMAIN_THRESHOLDS.MASTERY)
  })

  it('pattern domain boosts cover all 5 patterns', () => {
    const patterns = PATTERN_DOMAIN_BOOSTS.map(b => b.pattern)
    expect(patterns).toContain('analytical')
    expect(patterns).toContain('patience')
    expect(patterns).toContain('exploring')
    expect(patterns).toContain('helping')
    expect(patterns).toContain('building')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('Validation Functions', () => {
  describe('isValidCognitiveDomainId', () => {
    it('returns true for valid domain IDs', () => {
      expect(isValidCognitiveDomainId('complexAttention')).toBe(true)
      expect(isValidCognitiveDomainId('executiveFunctions')).toBe(true)
      expect(isValidCognitiveDomainId('metacognition')).toBe(true)
    })

    it('returns false for invalid domain IDs', () => {
      expect(isValidCognitiveDomainId('invalidDomain')).toBe(false)
      expect(isValidCognitiveDomainId('')).toBe(false)
      expect(isValidCognitiveDomainId('COMPLEXATTENTION')).toBe(false)
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// SKILL-DOMAIN MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

describe('Skill-Domain Mappings', () => {
  describe('getSkillsForDomain', () => {
    it('returns skills for a valid domain', () => {
      const skills = getSkillsForDomain('executiveFunctions')
      expect(skills.length).toBeGreaterThan(0)
      expect(skills.some(s => s.skillId === 'strategicThinking')).toBe(true)
      expect(skills.some(s => s.skillId === 'problemSolving')).toBe(true)
    })

    it('includes weight for each skill', () => {
      const skills = getSkillsForDomain('socialCognition')
      for (const skill of skills) {
        expect(skill.weight).toBeGreaterThan(0)
        expect(skill.weight).toBeLessThanOrEqual(1)
      }
    })
  })

  describe('getDomainsForSkill', () => {
    it('returns domains a skill contributes to', () => {
      // emotionalIntelligence maps to multiple domains
      const domains = getDomainsForSkill('emotionalIntelligence')
      expect(domains.length).toBeGreaterThan(0)
      expect(domains.some(d => d.domainId === 'socialCognition')).toBe(true)
      expect(domains.some(d => d.domainId === 'emotionalIntelligence')).toBe(true)
    })

    it('returns empty array for unmapped skill', () => {
      const domains = getDomainsForSkill('nonexistentSkill')
      expect(domains).toEqual([])
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN BOOST CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('Pattern Boost Calculations', () => {
  describe('getPatternBoostForDomain', () => {
    it('returns 0 with no pattern scores', () => {
      const boost = getPatternBoostForDomain('executiveFunctions', defaultPatternScores)
      expect(boost).toBe(0)
    })

    it('boosts executive functions with analytical pattern', () => {
      const scores: PatternScores = { ...defaultPatternScores, analytical: 10 }
      const boost = getPatternBoostForDomain('executiveFunctions', scores)
      expect(boost).toBeGreaterThan(0)
    })

    it('boosts social cognition with helping pattern', () => {
      const scores: PatternScores = { ...defaultPatternScores, helping: 10 }
      const boost = getPatternBoostForDomain('socialCognition', scores)
      expect(boost).toBeGreaterThan(0)
    })

    it('combines multiple pattern boosts', () => {
      const scores: PatternScores = {
        analytical: 5,
        patience: 5,
        exploring: 5,
        helping: 5,
        building: 5
      }
      const boost = getPatternBoostForDomain('emotionalIntelligence', scores)
      // emotionalIntelligence is boosted by both patience and helping
      expect(boost).toBeGreaterThan(0)
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL DETERMINATION
// ═══════════════════════════════════════════════════════════════════════════

describe('Level Determination', () => {
  describe('determineDomainLevel', () => {
    it('returns dormant for score 0', () => {
      expect(determineDomainLevel(0)).toBe('dormant')
    })

    it('returns emerging at threshold', () => {
      expect(determineDomainLevel(DOMAIN_THRESHOLDS.EMERGING)).toBe('emerging')
    })

    it('returns developing at threshold', () => {
      expect(determineDomainLevel(DOMAIN_THRESHOLDS.DEVELOPING)).toBe('developing')
    })

    it('returns flourishing at threshold', () => {
      expect(determineDomainLevel(DOMAIN_THRESHOLDS.FLOURISHING)).toBe('flourishing')
    })

    it('returns mastery at threshold', () => {
      expect(determineDomainLevel(DOMAIN_THRESHOLDS.MASTERY)).toBe('mastery')
    })

    it('returns correct level for scores between thresholds', () => {
      expect(determineDomainLevel(1)).toBe('dormant')
      expect(determineDomainLevel(5)).toBe('emerging')
      expect(determineDomainLevel(12)).toBe('developing')
      expect(determineDomainLevel(20)).toBe('flourishing')
      expect(determineDomainLevel(30)).toBe('mastery')
    })
  })

  describe('getLevelLabel', () => {
    it('returns human-readable labels', () => {
      expect(getLevelLabel('dormant')).toBe('Dormant')
      expect(getLevelLabel('emerging')).toBe('Emerging')
      expect(getLevelLabel('developing')).toBe('Developing')
      expect(getLevelLabel('flourishing')).toBe('Flourishing')
      expect(getLevelLabel('mastery')).toBe('Mastery')
    })
  })

  describe('getLevelColor', () => {
    it('returns valid hex colors', () => {
      const levels: DomainLevel[] = ['dormant', 'emerging', 'developing', 'flourishing', 'mastery']
      for (const level of levels) {
        expect(getLevelColor(level)).toMatch(/^#[0-9A-Fa-f]{6}$/)
      }
    })
  })

  describe('getLevelProgress', () => {
    it('returns 0 for score 0', () => {
      expect(getLevelProgress(0)).toBe(0)
    })

    it('returns progress within current level', () => {
      // Score of 5 is between EMERGING (3) and DEVELOPING (8)
      const progress = getLevelProgress(5)
      expect(progress).toBeGreaterThan(0)
      expect(progress).toBeLessThan(1)
    })

    it('returns close to 1 near next threshold', () => {
      // Score of 7 is close to DEVELOPING (8)
      const progress = getLevelProgress(7)
      expect(progress).toBeGreaterThan(0.5)
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// ENGAGEMENT METRICS
// ═══════════════════════════════════════════════════════════════════════════

describe('Engagement Metrics', () => {
  describe('determineEngagementLevel', () => {
    it('returns INACTIVE for 0 days', () => {
      expect(determineEngagementLevel(0)).toBe('INACTIVE')
    })

    it('returns LOW for 1-2 days', () => {
      expect(determineEngagementLevel(1)).toBe('LOW')
      expect(determineEngagementLevel(2)).toBe('LOW')
    })

    it('returns MODERATE for 3-4 days (ISP threshold)', () => {
      expect(determineEngagementLevel(3)).toBe('MODERATE')
      expect(determineEngagementLevel(4)).toBe('MODERATE')
    })

    it('returns HIGH for 5-6 days', () => {
      expect(determineEngagementLevel(5)).toBe('HIGH')
      expect(determineEngagementLevel(6)).toBe('HIGH')
    })

    it('returns INTENSIVE for 7 days', () => {
      expect(determineEngagementLevel(7)).toBe('INTENSIVE')
    })
  })

  describe('calculateEngagementMetrics', () => {
    it('returns INACTIVE for empty demonstrations', () => {
      const metrics = calculateEngagementMetrics([])
      expect(metrics.level).toBe('INACTIVE')
      expect(metrics.activeDaysLast7).toBe(0)
      expect(metrics.totalDemonstrations).toBe(0)
    })

    it('counts unique active days correctly', () => {
      const now = Date.now()
      const demos = [
        createMockDemonstration(['skill1'], now),
        createMockDemonstration(['skill2'], now),
        createMockDemonstration(['skill3'], now - 24 * 60 * 60 * 1000), // 1 day ago
        createMockDemonstration(['skill4'], now - 48 * 60 * 60 * 1000), // 2 days ago
      ]

      const metrics = calculateEngagementMetrics(demos)
      expect(metrics.activeDaysLast7).toBe(3)
      expect(metrics.totalDemonstrations).toBe(4)
    })

    it('excludes demonstrations older than 7 days from active days', () => {
      const now = Date.now()
      const demos = [
        createMockDemonstration(['skill1'], now),
        createMockDemonstration(['skill2'], now - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      ]

      const metrics = calculateEngagementMetrics(demos)
      expect(metrics.activeDaysLast7).toBe(1)
      expect(metrics.totalDemonstrations).toBe(2) // Still counts total
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// DOMAIN SCORE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

describe('Domain Score Calculation', () => {
  describe('calculateDomainScore', () => {
    it('returns dormant level with no demonstrations', () => {
      const score = calculateDomainScore('executiveFunctions', [], { patternScores: defaultPatternScores })
      expect(score.level).toBe('dormant')
      expect(score.rawScore).toBe(0)
      expect(score.confidence).toBe(0)
    })

    it('accumulates score from skill demonstrations', () => {
      const demos = createMockDemonstrations({
        strategicThinking: 5,
        problemSolving: 3
      })

      const score = calculateDomainScore('executiveFunctions', demos, { patternScores: defaultPatternScores })
      expect(score.rawScore).toBeGreaterThan(0)
      expect(score.evidence.length).toBeGreaterThan(0)
    })

    it('applies pattern boost correctly', () => {
      const demos = createMockDemonstrations({ strategicThinking: 5 })
      const baseScore = calculateDomainScore('executiveFunctions', demos, { patternScores: defaultPatternScores })

      const boostedPatterns: PatternScores = { ...defaultPatternScores, analytical: 10 }
      const boostedScore = calculateDomainScore('executiveFunctions', demos, { patternScores: boostedPatterns })

      expect(boostedScore.rawScore).toBeGreaterThan(baseScore.rawScore)
    })

    it('calculates confidence based on evidence breadth', () => {
      // Single skill demonstrated
      const narrowDemos = createMockDemonstrations({ strategicThinking: 10 })
      const narrowScore = calculateDomainScore('executiveFunctions', narrowDemos, { patternScores: defaultPatternScores })

      // Multiple skills demonstrated
      const broadDemos = createMockDemonstrations({
        strategicThinking: 3,
        problemSolving: 3,
        systemsThinking: 2,
        criticalThinking: 2
      })
      const broadScore = calculateDomainScore('executiveFunctions', broadDemos, { patternScores: defaultPatternScores })

      expect(broadScore.confidence).toBeGreaterThan(narrowScore.confidence)
    })

    it('includes correct metadata', () => {
      const score = calculateDomainScore('socialCognition', [], { patternScores: defaultPatternScores })
      expect(score.domainId).toBe('socialCognition')
      expect(score.name).toBe('Social Cognition')
      expect(score.shortName).toBe('Social')
    })
  })

  describe('calculateAllDomainScores', () => {
    it('returns scores for all 11 domains', () => {
      const scores = calculateAllDomainScores([], { patternScores: defaultPatternScores })
      expect(Object.keys(scores).length).toBe(11)

      for (const domainId of COGNITIVE_DOMAIN_IDS) {
        expect(scores[domainId]).toBeDefined()
      }
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// AFFECTED DOMAINS
// ═══════════════════════════════════════════════════════════════════════════

describe('Affected Domains', () => {
  describe('getAffectedDomains', () => {
    it('returns domains affected by a skill', () => {
      const affected = getAffectedDomains(['emotionalIntelligence'])
      expect(affected.length).toBeGreaterThan(0)
      expect(affected).toContain('socialCognition')
      expect(affected).toContain('emotionalIntelligence')
    })

    it('returns unique domains for multiple skills', () => {
      const affected = getAffectedDomains(['emotionalIntelligence', 'empathy'])
      const uniqueCount = new Set(affected).size
      expect(uniqueCount).toBe(affected.length)
    })

    it('returns empty array for unmapped skills', () => {
      const affected = getAffectedDomains(['nonexistentSkill'])
      expect(affected).toEqual([])
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('Analysis Functions', () => {
  const createTestScores = () => {
    const demos = createMockDemonstrations({
      strategicThinking: 10,  // executiveFunctions
      emotionalIntelligence: 8,  // socialCognition, emotionalIntelligence
      creativity: 5,  // creativitySynthesis
      deepWork: 3,  // complexAttention
    })
    return calculateAllDomainScores(demos, { patternScores: defaultPatternScores })
  }

  describe('getStrongestDomains', () => {
    it('returns top N domains by score', () => {
      const scores = createTestScores()
      const strongest = getStrongestDomains(scores, 3)
      expect(strongest.length).toBe(3)

      // Should be sorted by rawScore descending
      for (let i = 1; i < strongest.length; i++) {
        expect(strongest[i - 1].rawScore).toBeGreaterThanOrEqual(strongest[i].rawScore)
      }
    })
  })

  describe('getDevelopmentAreas', () => {
    it('returns bottom N domains by score', () => {
      const scores = createTestScores()
      const weakest = getDevelopmentAreas(scores, 3)
      expect(weakest.length).toBe(3)

      // Should be sorted by rawScore ascending
      for (let i = 1; i < weakest.length; i++) {
        expect(weakest[i - 1].rawScore).toBeLessThanOrEqual(weakest[i].rawScore)
      }
    })
  })

  describe('getCognitiveProfileSummary', () => {
    it('returns profile with all required fields', () => {
      const scores = createTestScores()
      const summary = getCognitiveProfileSummary(scores)

      expect(summary.averageLevel).toBeDefined()
      expect(['core', 'advanced', 'balanced']).toContain(summary.dominantCategory)
      expect(summary.overallConfidence).toBeGreaterThanOrEqual(0)
      expect(summary.overallConfidence).toBeLessThanOrEqual(1)
      expect(summary.levelDistribution).toBeDefined()
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

describe('Category Helpers', () => {
  describe('getCoreDomains', () => {
    it('returns exactly 6 core domains', () => {
      const core = getCoreDomains()
      expect(core.length).toBe(6)
    })

    it('all returned domains have core category', () => {
      const core = getCoreDomains()
      for (const domainId of core) {
        expect(DOMAIN_METADATA[domainId].category).toBe('core')
      }
    })
  })

  describe('getAdvancedDomains', () => {
    it('returns exactly 5 advanced domains', () => {
      const advanced = getAdvancedDomains()
      expect(advanced.length).toBe(5)
    })

    it('all returned domains have advanced category', () => {
      const advanced = getAdvancedDomains()
      for (const domainId of advanced) {
        expect(DOMAIN_METADATA[domainId].category).toBe('advanced')
      }
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE CREATION
// ═══════════════════════════════════════════════════════════════════════════

describe('Empty State Creation', () => {
  describe('createEmptyDomainScores', () => {
    it('creates scores for all 11 domains', () => {
      const scores = createEmptyDomainScores()
      expect(Object.keys(scores).length).toBe(11)
    })

    it('all domains start at dormant level', () => {
      const scores = createEmptyDomainScores()
      for (const domainId of COGNITIVE_DOMAIN_IDS) {
        expect(scores[domainId].level).toBe('dormant')
        expect(scores[domainId].rawScore).toBe(0)
        expect(scores[domainId].confidence).toBe(0)
      }
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH EXPORT
// ═══════════════════════════════════════════════════════════════════════════

describe('Research Export', () => {
  describe('createResearchExport', () => {
    it('includes all required fields', () => {
      const state = calculateCognitiveDomainState([], { patternScores: defaultPatternScores })
      const exportData = createResearchExport('test-user', state, defaultPatternScores)

      expect(exportData.userId).toBe('test-user')
      expect(exportData.timestamp).toBeGreaterThan(0)
      expect(exportData.domains.length).toBe(11)
      expect(exportData.engagement).toBeDefined()
      expect(exportData.profile).toBeDefined()
      expect(exportData.patternCorrelations).toBeDefined()
    })

    it('includes skill breakdown in domain data', () => {
      const demos = createMockDemonstrations({ strategicThinking: 5, problemSolving: 3 })
      const state = calculateCognitiveDomainState(demos, { patternScores: defaultPatternScores })
      const exportData = createResearchExport('test-user', state, defaultPatternScores)

      const execFunctions = exportData.domains.find(d => d.domainId === 'executiveFunctions')
      expect(execFunctions?.skillBreakdown).toBeDefined()
      expect(execFunctions?.skillBreakdown['strategicThinking']).toBe(5)
      expect(execFunctions?.skillBreakdown['problemSolving']).toBe(3)
    })
  })
})
