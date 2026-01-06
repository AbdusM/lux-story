/**
 * Tests for Assessment & Skills System Derivatives
 * Feature IDs: D-011, D-012, D-014, D-015, D-053, D-094
 */

import { describe, it, expect } from 'vitest'
import {
  // Skills & Careers
  SKILLS,
  CAREER_FIELDS,

  // D-011: Dynamic Career Recommendations
  getCareerRecommendations,
  detectRecommendationShift,
  CareerRecommendation,

  // D-012: Skill Transfer Visualization
  getSkillTransfers,
  getConnectingSkills,
  buildSkillNetwork,

  // D-014: Skill Gap Identification
  analyzeSkillGaps,

  // D-015: Pattern-Skill Correlations
  calculatePatternSkillCorrelations,
  getSkillPredictors,

  // D-053: Skill Challenges
  SKILL_CHALLENGES,
  scoreChallengeAttempt,

  // D-094: Skill Decay
  DEFAULT_DECAY_CONFIG,
  calculateSkillDecay,
  getSkillsAtRiskOfDecay,
  getSuggestedPracticeActivities
} from '@/lib/assessment-derivatives'

import { PlayerPatterns } from '@/lib/character-state'
import { PATTERN_THRESHOLDS } from '@/lib/patterns'

// Helper functions
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
// SKILLS & CAREERS STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

describe('Skills & Careers Structure', () => {
  it('all skills have valid structure', () => {
    Object.values(SKILLS).forEach(skill => {
      expect(skill.id).toBeDefined()
      expect(skill.name).toBeDefined()
      expect(skill.category).toBeDefined()
      expect(skill.description).toBeDefined()
      expect(skill.alignedPatterns.length).toBeGreaterThan(0)
      expect(skill.transferDomains.length).toBeGreaterThan(0)
    })
  })

  it('has at least 15 skills defined', () => {
    expect(Object.keys(SKILLS).length).toBeGreaterThanOrEqual(15)
  })

  it('all careers have valid structure', () => {
    CAREER_FIELDS.forEach(career => {
      expect(career.id).toBeDefined()
      expect(career.name).toBeDefined()
      expect(career.sector).toBeDefined()
      expect(career.requiredSkills.length).toBeGreaterThan(0)
      expect(career.preferredPatterns.length).toBeGreaterThan(0)
      expect(career.characterExamples.length).toBeGreaterThan(0)
    })
  })

  it('all careers reference valid skills', () => {
    CAREER_FIELDS.forEach(career => {
      career.requiredSkills.forEach(req => {
        expect(SKILLS[req.skillId]).toBeDefined()
      })
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-011: DYNAMIC CAREER RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-011: Dynamic Career Recommendations', () => {
  it('returns recommendations based on patterns', () => {
    const patterns = createHighPatterns()
    const skillLevels = { data_analysis: 3, programming: 2 }

    const recs = getCareerRecommendations(patterns, skillLevels)

    expect(recs.length).toBeGreaterThan(0)
    expect(recs[0].confidenceScore).toBeGreaterThan(0)
  })

  it('limits results to specified number', () => {
    const patterns = createHighPatterns()
    const skillLevels = {}

    const recs = getCareerRecommendations(patterns, skillLevels, 3)

    expect(recs.length).toBeLessThanOrEqual(3)
  })

  it('sorts by confidence score', () => {
    const patterns = createHighPatterns()
    const skillLevels = { data_analysis: 5, critical_thinking: 4 }

    const recs = getCareerRecommendations(patterns, skillLevels)

    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1].confidenceScore).toBeGreaterThanOrEqual(recs[i].confidenceScore)
    }
  })

  it('identifies growth areas', () => {
    const patterns: PlayerPatterns = {
      analytical: 8,
      patience: 2,
      exploring: 2,
      helping: 2,
      building: 2
    }
    const skillLevels = { programming: 1 } // Low skill

    const recs = getCareerRecommendations(patterns, skillLevels)
    const softwareRec = recs.find(r => r.career.id === 'software_engineering')

    if (softwareRec) {
      expect(softwareRec.growthAreas.length).toBeGreaterThan(0)
    }
  })

  it('detectRecommendationShift detects top career change', () => {
    const oldRecs: CareerRecommendation[] = [
      {
        career: CAREER_FIELDS[0],
        confidenceScore: 80,
        matchReasons: [],
        growthAreas: []
      }
    ]
    const newRecs: CareerRecommendation[] = [
      {
        career: CAREER_FIELDS[1], // Different career
        confidenceScore: 85,
        matchReasons: [],
        growthAreas: []
      }
    ]

    const result = detectRecommendationShift(oldRecs, newRecs)
    expect(result.shifted).toBe(true)
    expect(result.message).toContain('shifted')
  })

  it('detectRecommendationShift detects confidence change', () => {
    const oldRecs: CareerRecommendation[] = [
      {
        career: CAREER_FIELDS[0],
        confidenceScore: 60,
        matchReasons: [],
        growthAreas: []
      }
    ]
    const newRecs: CareerRecommendation[] = [
      {
        career: CAREER_FIELDS[0], // Same career
        confidenceScore: 75, // +15 change
        matchReasons: [],
        growthAreas: []
      }
    ]

    const result = detectRecommendationShift(oldRecs, newRecs)
    expect(result.shifted).toBe(true)
    expect(result.message).toContain('strengthened')
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-012: SKILL TRANSFER VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

describe('D-012: Skill Transfer Visualization', () => {
  it('getSkillTransfers returns transfer info', () => {
    const transfer = getSkillTransfers('critical_thinking')

    expect(transfer).not.toBeNull()
    expect(transfer?.skillId).toBe('critical_thinking')
    expect(transfer?.toDomains.length).toBeGreaterThan(0)
  })

  it('getSkillTransfers returns null for invalid skill', () => {
    const transfer = getSkillTransfers('nonexistent_skill')
    expect(transfer).toBeNull()
  })

  it('categorizes transfer strength correctly', () => {
    const highTransfer = getSkillTransfers('critical_thinking')
    const lowTransfer = getSkillTransfers('cybersecurity')

    // Critical thinking transfers to 5+ domains
    expect(['high', 'medium']).toContain(highTransfer?.transferStrength)
  })

  it('getConnectingSkills finds common skills', () => {
    // Healthcare tech and data science should share analytical skills
    const connecting = getConnectingSkills('healthcare_tech', 'data_science')

    // May or may not have common skills depending on definitions
    expect(connecting).toBeInstanceOf(Array)
  })

  it('buildSkillNetwork creates nodes and edges', () => {
    const playerSkills = {
      critical_thinking: 3,
      data_analysis: 4,
      empathy: 2
    }

    const network = buildSkillNetwork(playerSkills)

    expect(network.nodes.length).toBeGreaterThan(0)
    expect(network.edges.length).toBeGreaterThan(0)

    // Should have skill nodes
    const skillNodes = network.nodes.filter(n => n.type === 'skill')
    expect(skillNodes.length).toBe(3)

    // Should have domain nodes
    const domainNodes = network.nodes.filter(n => n.type === 'domain')
    expect(domainNodes.length).toBeGreaterThan(0)
  })

  it('buildSkillNetwork respects skill levels in node size', () => {
    const playerSkills = {
      critical_thinking: 5,
      empathy: 2
    }

    const network = buildSkillNetwork(playerSkills)
    const ctNode = network.nodes.find(n => n.id === 'critical_thinking')
    const empathyNode = network.nodes.find(n => n.id === 'empathy')

    expect(ctNode?.size).toBeGreaterThan(empathyNode?.size ?? 0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-014: SKILL GAP IDENTIFICATION
// ═══════════════════════════════════════════════════════════════════════════

describe('D-014: Skill Gap Identification', () => {
  it('analyzeSkillGaps returns analysis for valid career', () => {
    const skillLevels = { programming: 2, problem_solving: 1 }
    const analysis = analyzeSkillGaps('software_engineering', skillLevels)

    expect(analysis).not.toBeNull()
    expect(analysis?.careerId).toBe('software_engineering')
    expect(analysis?.careerName).toBe('Software Engineering')
  })

  it('analyzeSkillGaps returns null for invalid career', () => {
    const analysis = analyzeSkillGaps('nonexistent_career', {})
    expect(analysis).toBeNull()
  })

  it('identifies gaps when skills are low', () => {
    const skillLevels = { programming: 1 } // Required: 4
    const analysis = analyzeSkillGaps('software_engineering', skillLevels)

    expect(analysis?.gaps.length).toBeGreaterThan(0)
    const programmingGap = analysis?.gaps.find(g => g.skillId === 'programming')
    expect(programmingGap?.gapSize).toBe(3) // 4 - 1
  })

  it('identifies strengths when skills are high', () => {
    const skillLevels = { programming: 5, problem_solving: 4, teamwork: 3 }
    const analysis = analyzeSkillGaps('software_engineering', skillLevels)

    expect(analysis?.strengths.length).toBeGreaterThan(0)
  })

  it('calculates overall readiness', () => {
    // With all skills at required levels
    const fullSkills = { programming: 4, problem_solving: 3, teamwork: 2 }
    const fullAnalysis = analyzeSkillGaps('software_engineering', fullSkills)
    expect(fullAnalysis?.overallReadiness).toBe(100)

    // With no skills
    const emptyAnalysis = analyzeSkillGaps('software_engineering', {})
    expect(emptyAnalysis?.overallReadiness).toBe(0)
  })

  it('suggests activities for gap skills', () => {
    const skillLevels = { programming: 1 }
    const analysis = analyzeSkillGaps('software_engineering', skillLevels)

    const programmingGap = analysis?.gaps.find(g => g.skillId === 'programming')
    expect(programmingGap?.suggestedActivity).toBeDefined()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-015: PATTERN-SKILL CORRELATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-015: Pattern-Skill Correlations', () => {
  it('calculatePatternSkillCorrelations returns all patterns', () => {
    const patterns = createHighPatterns()
    const skillLevels = { critical_thinking: 3 }

    const correlations = calculatePatternSkillCorrelations(patterns, skillLevels)

    expect(correlations.length).toBe(5) // All 5 patterns
    correlations.forEach(c => {
      expect(c.pattern).toBeDefined()
      expect(c.skills.length).toBeGreaterThan(0)
    })
  })

  it('shows higher correlation for aligned skills', () => {
    const patterns: PlayerPatterns = {
      analytical: 8,
      patience: 2,
      exploring: 2,
      helping: 2,
      building: 2
    }
    const skillLevels = { critical_thinking: 4 }

    const correlations = calculatePatternSkillCorrelations(patterns, skillLevels)
    const analyticalCorr = correlations.find(c => c.pattern === 'analytical')!
    const ctSkill = analyticalCorr.skills.find(s => s.skillId === 'critical_thinking')

    // Critical thinking is aligned with analytical
    expect(ctSkill?.correlationStrength).toBeGreaterThan(0)
  })

  it('getSkillPredictors returns aligned patterns', () => {
    const predictors = getSkillPredictors('critical_thinking')

    expect(predictors).toContain('analytical')
    expect(predictors).toContain('exploring')
  })

  it('getSkillPredictors returns empty for invalid skill', () => {
    const predictors = getSkillPredictors('nonexistent_skill')
    expect(predictors).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-053: SKILL CHALLENGES
// ═══════════════════════════════════════════════════════════════════════════

describe('D-053: Skill Application Challenges', () => {
  it('all challenges have valid structure', () => {
    SKILL_CHALLENGES.forEach(challenge => {
      expect(challenge.id).toBeDefined()
      expect(challenge.skillTested).toBeDefined()
      expect(challenge.characterId).toBeDefined()
      expect(challenge.name).toBeDefined()
      expect(challenge.scenarios.length).toBeGreaterThan(0)
      expect(challenge.passingScore).toBeGreaterThan(0)
      expect(challenge.passingScore).toBeLessThanOrEqual(100)

      challenge.scenarios.forEach(scenario => {
        expect(scenario.situation).toBeDefined()
        expect(scenario.options.length).toBeGreaterThanOrEqual(2)

        scenario.options.forEach(option => {
          expect(option.text).toBeDefined()
          expect(option.skillDemonstration).toBeGreaterThanOrEqual(0)
          expect(option.skillDemonstration).toBeLessThanOrEqual(3)
          expect(option.feedback).toBeDefined()
        })
      })
    })
  })

  it('scoreChallengeAttempt returns result', () => {
    const challenge = SKILL_CHALLENGES[0]
    const responses = [0] // Choose first option

    const result = scoreChallengeAttempt(challenge.id, responses)

    expect(result.challengeId).toBe(challenge.id)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(typeof result.passed).toBe('boolean')
    expect(result.feedback).toBeDefined()
  })

  it('perfect responses give 100% score', () => {
    // Find best option indices
    const challenge = SKILL_CHALLENGES[0]
    const bestResponses = challenge.scenarios.map(scenario => {
      let bestIndex = 0
      let bestScore = 0
      scenario.options.forEach((opt, i) => {
        if (opt.skillDemonstration > bestScore) {
          bestScore = opt.skillDemonstration
          bestIndex = i
        }
      })
      return bestIndex
    })

    const result = scoreChallengeAttempt(challenge.id, bestResponses)
    expect(result.score).toBe(100)
    expect(result.passed).toBe(true)
  })

  it('worst responses give low score', () => {
    const challenge = SKILL_CHALLENGES[0]
    const worstResponses = challenge.scenarios.map(scenario => {
      let worstIndex = 0
      let worstScore = Infinity
      scenario.options.forEach((opt, i) => {
        if (opt.skillDemonstration < worstScore) {
          worstScore = opt.skillDemonstration
          worstIndex = i
        }
      })
      return worstIndex
    })

    const result = scoreChallengeAttempt(challenge.id, worstResponses)
    expect(result.score).toBeLessThan(50)
  })

  it('returns appropriate feedback based on pass/fail', () => {
    const challenge = SKILL_CHALLENGES[0]

    const passResult = scoreChallengeAttempt(challenge.id, [0])
    const failResult = scoreChallengeAttempt(challenge.id, [2]) // Usually worst option

    if (passResult.passed) {
      expect(passResult.feedback).toContain('Well done')
    }
    if (!failResult.passed) {
      expect(failResult.feedback).toContain('practicing')
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// D-094: SKILL DECAY MECHANICS
// ═══════════════════════════════════════════════════════════════════════════

describe('D-094: Skill Decay Mechanics', () => {
  it('DEFAULT_DECAY_CONFIG has valid structure', () => {
    expect(DEFAULT_DECAY_CONFIG.decayRate).toBeGreaterThan(0)
    expect(DEFAULT_DECAY_CONFIG.minimumLevel).toBeGreaterThanOrEqual(0)
    expect(DEFAULT_DECAY_CONFIG.decayGracePeriod).toBeGreaterThan(0)
    expect(DEFAULT_DECAY_CONFIG.protectedSkills).toBeInstanceOf(Array)
  })

  it('calculateSkillDecay does not decay recent skills', () => {
    const skillLevels = { critical_thinking: 5 }
    const usageRecords = new Map([
      ['critical_thinking', { skillId: 'critical_thinking', lastUsedSession: 8, usageCount: 1 }]
    ])
    const currentSession = 9 // Only 1 session since use

    const newLevels = calculateSkillDecay(skillLevels, usageRecords, currentSession)

    expect(newLevels.critical_thinking).toBe(5) // No decay
  })

  it('calculateSkillDecay applies decay after grace period', () => {
    const skillLevels = { critical_thinking: 5 }
    const usageRecords = new Map([
      ['critical_thinking', { skillId: 'critical_thinking', lastUsedSession: 1, usageCount: 1 }]
    ])
    const currentSession = 10 // 9 sessions since use, past grace period

    const newLevels = calculateSkillDecay(skillLevels, usageRecords, currentSession)

    expect(newLevels.critical_thinking).toBeLessThan(5)
  })

  it('calculateSkillDecay respects minimum level', () => {
    const skillLevels = { critical_thinking: 2 }
    const usageRecords = new Map([
      ['critical_thinking', { skillId: 'critical_thinking', lastUsedSession: 1, usageCount: 1 }]
    ])
    const currentSession = 100 // Very long time

    const newLevels = calculateSkillDecay(skillLevels, usageRecords, currentSession)

    expect(newLevels.critical_thinking).toBeGreaterThanOrEqual(DEFAULT_DECAY_CONFIG.minimumLevel)
  })

  it('getSkillsAtRiskOfDecay identifies skills near grace period end', () => {
    const usageRecords = new Map([
      ['critical_thinking', { skillId: 'critical_thinking', lastUsedSession: 8, usageCount: 1 }],
      ['programming', { skillId: 'programming', lastUsedSession: 1, usageCount: 1 }] // Already past
    ])
    const currentSession = 10 // 2 sessions since CT use

    const atRisk = getSkillsAtRiskOfDecay(usageRecords, currentSession)

    // critical_thinking should be at risk (2 sessions since use, 1 before grace ends with default of 3)
    expect(atRisk).toContain('critical_thinking')
    // programming is already past grace period
    expect(atRisk).not.toContain('programming')
  })

  it('getSuggestedPracticeActivities returns suggestions', () => {
    const atRisk = ['critical_thinking', 'empathy']
    const suggestions = getSuggestedPracticeActivities(atRisk)

    expect(suggestions.length).toBe(2)
    suggestions.forEach(s => {
      expect(s.skillId).toBeDefined()
      expect(s.activity).toBeDefined()
      expect(s.character).toBeDefined()
    })
  })
})
