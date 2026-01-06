/**
 * Assessment & Skills System Derivatives
 * Feature IDs: D-011, D-012, D-014, D-015, D-053, D-094
 *
 * This module extends the core assessment system with advanced mechanics:
 * - Dynamic career recommendations based on skill growth
 * - Skill transfer visualization across domains
 * - Skill gap identification for desired careers
 * - Pattern-skill correlation analysis
 * - Skill application challenges
 * - Skill decay mechanics
 */

import { PatternType, PATTERN_THRESHOLDS } from './patterns'
import { PlayerPatterns } from './character-state'
import { CharacterId } from './graph-registry'

// ═══════════════════════════════════════════════════════════════════════════
// SKILL & CAREER TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Skill categories
 */
export type SkillCategory =
  | 'communication'
  | 'technical'
  | 'analytical'
  | 'interpersonal'
  | 'leadership'
  | 'creative'

/**
 * Individual skill definition
 */
export interface Skill {
  id: string
  name: string
  category: SkillCategory
  description: string
  alignedPatterns: PatternType[]
  transferDomains: string[]
}

/**
 * Career field definition
 */
export interface CareerField {
  id: string
  name: string
  sector: string
  requiredSkills: { skillId: string; minLevel: number }[]
  preferredPatterns: PatternType[]
  characterExamples: CharacterId[]
  birminghamEmployers?: string[]
}

/**
 * Skill registry - 50+ skills tracked
 */
export const SKILLS: Record<string, Skill> = {
  // Communication Skills
  active_listening: {
    id: 'active_listening',
    name: 'Active Listening',
    category: 'communication',
    description: 'Fully concentrating on and understanding what is being said',
    alignedPatterns: ['patience', 'helping'],
    transferDomains: ['healthcare', 'counseling', 'education', 'sales', 'management']
  },
  persuasion: {
    id: 'persuasion',
    name: 'Persuasion',
    category: 'communication',
    description: 'Convincing others to change their minds or behavior',
    alignedPatterns: ['helping', 'building'],
    transferDomains: ['sales', 'marketing', 'law', 'politics', 'entrepreneurship']
  },
  public_speaking: {
    id: 'public_speaking',
    name: 'Public Speaking',
    category: 'communication',
    description: 'Delivering presentations effectively',
    alignedPatterns: ['building', 'helping'],
    transferDomains: ['education', 'training', 'leadership', 'consulting']
  },
  written_communication: {
    id: 'written_communication',
    name: 'Written Communication',
    category: 'communication',
    description: 'Conveying information clearly in writing',
    alignedPatterns: ['analytical', 'patience'],
    transferDomains: ['journalism', 'marketing', 'research', 'legal']
  },

  // Technical Skills
  data_analysis: {
    id: 'data_analysis',
    name: 'Data Analysis',
    category: 'technical',
    description: 'Interpreting data to extract meaningful insights',
    alignedPatterns: ['analytical', 'patience'],
    transferDomains: ['research', 'finance', 'healthcare', 'marketing']
  },
  programming: {
    id: 'programming',
    name: 'Programming',
    category: 'technical',
    description: 'Writing code to solve problems',
    alignedPatterns: ['analytical', 'building'],
    transferDomains: ['software', 'automation', 'research', 'finance']
  },
  cybersecurity: {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'technical',
    description: 'Protecting systems and data from threats',
    alignedPatterns: ['analytical', 'patience'],
    transferDomains: ['healthcare', 'finance', 'government', 'enterprise']
  },
  systems_thinking: {
    id: 'systems_thinking',
    name: 'Systems Thinking',
    category: 'technical',
    description: 'Understanding how parts interact within a whole',
    alignedPatterns: ['analytical', 'exploring'],
    transferDomains: ['engineering', 'management', 'ecology', 'healthcare']
  },

  // Analytical Skills
  critical_thinking: {
    id: 'critical_thinking',
    name: 'Critical Thinking',
    category: 'analytical',
    description: 'Objectively analyzing and evaluating an issue',
    alignedPatterns: ['analytical', 'exploring'],
    transferDomains: ['research', 'law', 'medicine', 'consulting', 'journalism']
  },
  problem_solving: {
    id: 'problem_solving',
    name: 'Problem Solving',
    category: 'analytical',
    description: 'Finding solutions to difficult issues',
    alignedPatterns: ['analytical', 'building'],
    transferDomains: ['engineering', 'consulting', 'healthcare', 'entrepreneurship']
  },
  research: {
    id: 'research',
    name: 'Research',
    category: 'analytical',
    description: 'Systematic investigation to establish facts',
    alignedPatterns: ['analytical', 'exploring'],
    transferDomains: ['academia', 'healthcare', 'law', 'journalism', 'marketing']
  },

  // Interpersonal Skills
  empathy: {
    id: 'empathy',
    name: 'Empathy',
    category: 'interpersonal',
    description: 'Understanding and sharing others\' feelings',
    alignedPatterns: ['helping', 'patience'],
    transferDomains: ['healthcare', 'counseling', 'education', 'HR', 'social work']
  },
  conflict_resolution: {
    id: 'conflict_resolution',
    name: 'Conflict Resolution',
    category: 'interpersonal',
    description: 'Managing and resolving disagreements',
    alignedPatterns: ['patience', 'helping'],
    transferDomains: ['management', 'HR', 'law', 'counseling', 'diplomacy']
  },
  teamwork: {
    id: 'teamwork',
    name: 'Teamwork',
    category: 'interpersonal',
    description: 'Working effectively with others',
    alignedPatterns: ['helping', 'building'],
    transferDomains: ['all']
  },

  // Leadership Skills
  decision_making: {
    id: 'decision_making',
    name: 'Decision Making',
    category: 'leadership',
    description: 'Choosing between alternatives effectively',
    alignedPatterns: ['analytical', 'patience'],
    transferDomains: ['management', 'entrepreneurship', 'military', 'healthcare']
  },
  mentoring: {
    id: 'mentoring',
    name: 'Mentoring',
    category: 'leadership',
    description: 'Guiding and supporting others\' development',
    alignedPatterns: ['helping', 'patience'],
    transferDomains: ['education', 'management', 'coaching', 'HR']
  },
  crisis_management: {
    id: 'crisis_management',
    name: 'Crisis Management',
    category: 'leadership',
    description: 'Handling emergencies and high-pressure situations',
    alignedPatterns: ['analytical', 'helping'],
    transferDomains: ['healthcare', 'management', 'emergency services', 'PR']
  },

  // Creative Skills
  design_thinking: {
    id: 'design_thinking',
    name: 'Design Thinking',
    category: 'creative',
    description: 'Human-centered approach to innovation',
    alignedPatterns: ['building', 'exploring'],
    transferDomains: ['product', 'UX', 'architecture', 'consulting']
  },
  innovation: {
    id: 'innovation',
    name: 'Innovation',
    category: 'creative',
    description: 'Creating new ideas and approaches',
    alignedPatterns: ['building', 'exploring'],
    transferDomains: ['entrepreneurship', 'R&D', 'marketing', 'engineering']
  }
}

/**
 * Career fields registry
 */
export const CAREER_FIELDS: CareerField[] = [
  {
    id: 'healthcare_tech',
    name: 'Healthcare Technology',
    sector: 'Healthcare',
    requiredSkills: [
      { skillId: 'cybersecurity', minLevel: 3 },
      { skillId: 'empathy', minLevel: 2 },
      { skillId: 'systems_thinking', minLevel: 3 }
    ],
    preferredPatterns: ['analytical', 'helping'],
    characterExamples: ['marcus', 'grace'],
    birminghamEmployers: ['UAB Hospital', 'Children\'s of Alabama', 'Encompass Health']
  },
  {
    id: 'software_engineering',
    name: 'Software Engineering',
    sector: 'Technology',
    requiredSkills: [
      { skillId: 'programming', minLevel: 4 },
      { skillId: 'problem_solving', minLevel: 3 },
      { skillId: 'teamwork', minLevel: 2 }
    ],
    preferredPatterns: ['analytical', 'building'],
    characterExamples: ['maya', 'devon'],
    birminghamEmployers: ['Shipt', 'Daxko', 'Motion Industries']
  },
  {
    id: 'education',
    name: 'Education',
    sector: 'Education',
    requiredSkills: [
      { skillId: 'public_speaking', minLevel: 3 },
      { skillId: 'empathy', minLevel: 4 },
      { skillId: 'mentoring', minLevel: 3 }
    ],
    preferredPatterns: ['helping', 'patience'],
    characterExamples: ['tess', 'yaquin'],
    birminghamEmployers: ['Birmingham City Schools', 'UAB', 'Jefferson State']
  },
  {
    id: 'data_science',
    name: 'Data Science',
    sector: 'Technology',
    requiredSkills: [
      { skillId: 'data_analysis', minLevel: 4 },
      { skillId: 'critical_thinking', minLevel: 3 },
      { skillId: 'research', minLevel: 3 }
    ],
    preferredPatterns: ['analytical', 'exploring'],
    characterExamples: ['elena', 'rohan'],
    birminghamEmployers: ['EBSCO', 'Southern Research', 'UAB']
  },
  {
    id: 'counseling',
    name: 'Career Counseling',
    sector: 'Human Services',
    requiredSkills: [
      { skillId: 'active_listening', minLevel: 4 },
      { skillId: 'empathy', minLevel: 4 },
      { skillId: 'conflict_resolution', minLevel: 3 }
    ],
    preferredPatterns: ['helping', 'patience'],
    characterExamples: ['jordan', 'grace'],
    birminghamEmployers: ['Alabama Career Center', 'WorkForce Development', 'United Way']
  },
  {
    id: 'creative_arts',
    name: 'Creative Arts',
    sector: 'Arts & Culture',
    requiredSkills: [
      { skillId: 'design_thinking', minLevel: 3 },
      { skillId: 'innovation', minLevel: 3 },
      { skillId: 'written_communication', minLevel: 2 }
    ],
    preferredPatterns: ['building', 'exploring'],
    characterExamples: ['asha', 'lira'],
    birminghamEmployers: ['Alabama Symphony', 'Birmingham Museum of Art', 'WBHM']
  },
  {
    id: 'compliance_ethics',
    name: 'Compliance & Ethics',
    sector: 'Professional Services',
    requiredSkills: [
      { skillId: 'critical_thinking', minLevel: 4 },
      { skillId: 'research', minLevel: 3 },
      { skillId: 'decision_making', minLevel: 3 }
    ],
    preferredPatterns: ['analytical', 'patience'],
    characterExamples: ['zara', 'kai'],
    birminghamEmployers: ['Regions Bank', 'BBVA', 'Blue Cross Blue Shield']
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// D-011: DYNAMIC CAREER RECOMMENDATIONS
// Career recommendations update live as you play
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Career recommendation with confidence score
 */
export interface CareerRecommendation {
  career: CareerField
  confidenceScore: number // 0-100
  matchReasons: string[]
  growthAreas: string[]
  characterToTalkTo?: CharacterId
}

/**
 * Calculate career match score based on patterns
 */
function calculatePatternMatch(
  patterns: PlayerPatterns,
  career: CareerField
): number {
  let score = 0
  const maxPerPattern = 100 / career.preferredPatterns.length

  career.preferredPatterns.forEach(pattern => {
    const patternValue = patterns[pattern]
    const contribution = Math.min(patternValue / 10, 1) * maxPerPattern
    score += contribution
  })

  return Math.round(score)
}

/**
 * Get dynamic career recommendations based on current patterns
 */
export function getCareerRecommendations(
  patterns: PlayerPatterns,
  skillLevels: Record<string, number>,
  limit: number = 5
): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = []

  CAREER_FIELDS.forEach(career => {
    const patternScore = calculatePatternMatch(patterns, career)

    // Calculate skill match
    let skillMatch = 0
    let totalRequired = 0
    const missingSkills: string[] = []

    career.requiredSkills.forEach(req => {
      totalRequired += req.minLevel
      const playerLevel = skillLevels[req.skillId] ?? 0
      skillMatch += Math.min(playerLevel, req.minLevel)

      if (playerLevel < req.minLevel) {
        const skill = SKILLS[req.skillId]
        missingSkills.push(`${skill.name} (${playerLevel}/${req.minLevel})`)
      }
    })

    const skillScore = totalRequired > 0 ? (skillMatch / totalRequired) * 100 : 50

    // Combined confidence
    const confidenceScore = Math.round(patternScore * 0.6 + skillScore * 0.4)

    // Build reasons
    const matchReasons: string[] = []
    career.preferredPatterns.forEach(pattern => {
      if (patterns[pattern] >= PATTERN_THRESHOLDS.DEVELOPING) {
        matchReasons.push(`Strong ${pattern} pattern`)
      }
    })

    recommendations.push({
      career,
      confidenceScore,
      matchReasons,
      growthAreas: missingSkills,
      characterToTalkTo: career.characterExamples[0]
    })
  })

  // Sort by confidence and limit
  return recommendations
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    .slice(0, limit)
}

/**
 * Track how recommendations change over time
 */
export interface RecommendationHistory {
  timestamp: number
  sessionNumber: number
  topRecommendation: string
  topConfidence: number
}

/**
 * Detect significant recommendation changes
 */
export function detectRecommendationShift(
  oldRecs: CareerRecommendation[],
  newRecs: CareerRecommendation[]
): { shifted: boolean; message?: string } {
  if (oldRecs.length === 0 || newRecs.length === 0) {
    return { shifted: false }
  }

  const oldTop = oldRecs[0]
  const newTop = newRecs[0]

  if (oldTop.career.id !== newTop.career.id) {
    return {
      shifted: true,
      message: `Your top career match shifted from ${oldTop.career.name} to ${newTop.career.name}`
    }
  }

  const confidenceChange = newTop.confidenceScore - oldTop.confidenceScore
  if (Math.abs(confidenceChange) >= 10) {
    const direction = confidenceChange > 0 ? 'strengthened' : 'weakened'
    return {
      shifted: true,
      message: `Your match with ${newTop.career.name} has ${direction}`
    }
  }

  return { shifted: false }
}

// ═══════════════════════════════════════════════════════════════════════════
// D-012: SKILL TRANSFER VISUALIZATION
// Show how skills connect across domains
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Skill transfer connection
 */
export interface SkillTransfer {
  skillId: string
  fromDomain: string
  toDomains: string[]
  transferStrength: 'high' | 'medium' | 'low'
  description: string
}

/**
 * Get skill transfers for a skill
 */
export function getSkillTransfers(skillId: string): SkillTransfer | null {
  const skill = SKILLS[skillId]
  if (!skill) return null

  return {
    skillId,
    fromDomain: skill.category,
    toDomains: skill.transferDomains,
    transferStrength: skill.transferDomains.length > 4 ? 'high' :
                      skill.transferDomains.length > 2 ? 'medium' : 'low',
    description: `${skill.name} transfers across ${skill.transferDomains.length} domains`
  }
}

/**
 * Get skills that connect two career fields
 */
export function getConnectingSkills(
  careerA: string,
  careerB: string
): Skill[] {
  const fieldA = CAREER_FIELDS.find(c => c.id === careerA)
  const fieldB = CAREER_FIELDS.find(c => c.id === careerB)

  if (!fieldA || !fieldB) return []

  const skillsA = new Set(fieldA.requiredSkills.map(s => s.skillId))
  const skillsB = new Set(fieldB.requiredSkills.map(s => s.skillId))

  // Find common skills
  const common = [...skillsA].filter(s => skillsB.has(s))

  return common.map(id => SKILLS[id]).filter(Boolean)
}

/**
 * Build skill network for visualization
 */
export interface SkillNetworkNode {
  id: string
  type: 'skill' | 'career' | 'domain'
  label: string
  size: number
}

export interface SkillNetworkEdge {
  source: string
  target: string
  weight: number
}

export function buildSkillNetwork(
  playerSkills: Record<string, number>
): { nodes: SkillNetworkNode[]; edges: SkillNetworkEdge[] } {
  const nodes: SkillNetworkNode[] = []
  const edges: SkillNetworkEdge[] = []
  const addedDomains = new Set<string>()

  // Add skill nodes
  Object.entries(playerSkills).forEach(([skillId, level]) => {
    if (level <= 0) return

    const skill = SKILLS[skillId]
    if (!skill) return

    nodes.push({
      id: skillId,
      type: 'skill',
      label: skill.name,
      size: level * 10
    })

    // Add domain nodes and edges
    skill.transferDomains.forEach(domain => {
      if (!addedDomains.has(domain)) {
        nodes.push({
          id: `domain_${domain}`,
          type: 'domain',
          label: domain,
          size: 20
        })
        addedDomains.add(domain)
      }

      edges.push({
        source: skillId,
        target: `domain_${domain}`,
        weight: level
      })
    })
  })

  return { nodes, edges }
}

// ═══════════════════════════════════════════════════════════════════════════
// D-014: SKILL GAP IDENTIFICATION
// System identifies missing skills for desired career
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Skill gap analysis result
 */
export interface SkillGapAnalysis {
  careerId: string
  careerName: string
  overallReadiness: number // 0-100%
  gaps: {
    skillId: string
    skillName: string
    currentLevel: number
    requiredLevel: number
    gapSize: number
    suggestedCharacter?: CharacterId
    suggestedActivity?: string
  }[]
  strengths: {
    skillId: string
    skillName: string
    level: number
  }[]
}

/**
 * Analyze skill gaps for a career
 */
export function analyzeSkillGaps(
  careerId: string,
  skillLevels: Record<string, number>
): SkillGapAnalysis | null {
  const career = CAREER_FIELDS.find(c => c.id === careerId)
  if (!career) return null

  const gaps: SkillGapAnalysis['gaps'] = []
  const strengths: SkillGapAnalysis['strengths'] = []
  let totalRequired = 0
  let totalAchieved = 0

  career.requiredSkills.forEach(req => {
    const skill = SKILLS[req.skillId]
    if (!skill) return

    const currentLevel = skillLevels[req.skillId] ?? 0
    totalRequired += req.minLevel
    totalAchieved += Math.min(currentLevel, req.minLevel)

    if (currentLevel < req.minLevel) {
      // Find suggested character based on skill
      const suggestedChar = career.characterExamples.find(charId => {
        // Characters who exemplify this skill
        return skill.alignedPatterns.some(p => {
          // Simplified: suggest career example characters
          return true
        })
      })

      gaps.push({
        skillId: req.skillId,
        skillName: skill.name,
        currentLevel,
        requiredLevel: req.minLevel,
        gapSize: req.minLevel - currentLevel,
        suggestedCharacter: suggestedChar,
        suggestedActivity: getSuggestedActivity(req.skillId)
      })
    } else {
      strengths.push({
        skillId: req.skillId,
        skillName: skill.name,
        level: currentLevel
      })
    }
  })

  const overallReadiness = totalRequired > 0
    ? Math.round((totalAchieved / totalRequired) * 100)
    : 0

  return {
    careerId,
    careerName: career.name,
    overallReadiness,
    gaps: gaps.sort((a, b) => b.gapSize - a.gapSize),
    strengths
  }
}

/**
 * Get suggested activity for skill development
 */
function getSuggestedActivity(skillId: string): string {
  const suggestions: Record<string, string> = {
    active_listening: 'Practice in Samuel\'s Quiet Hour',
    cybersecurity: 'Explore Marcus\'s security scenarios',
    data_analysis: 'Work with Elena on pattern recognition',
    empathy: 'Support Grace\'s patients',
    programming: 'Help Maya with her demo',
    public_speaking: 'Join Tess\'s class sessions',
    design_thinking: 'Collaborate with Asha on murals',
    critical_thinking: 'Debate ethics with Zara'
  }

  return suggestions[skillId] ?? 'Explore relevant character conversations'
}

// ═══════════════════════════════════════════════════════════════════════════
// D-015: PATTERN-SKILL CORRELATION ANALYSIS
// Admin sees which patterns predict which skills
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pattern-skill correlation
 */
export interface PatternSkillCorrelation {
  pattern: PatternType
  skills: {
    skillId: string
    skillName: string
    correlationStrength: number // -1 to 1
  }[]
}

/**
 * Calculate pattern-skill correlations from player data
 */
export function calculatePatternSkillCorrelations(
  patterns: PlayerPatterns,
  skillLevels: Record<string, number>
): PatternSkillCorrelation[] {
  const correlations: PatternSkillCorrelation[] = []

  const patternKeys: PatternType[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

  patternKeys.forEach(pattern => {
    const patternValue = patterns[pattern]
    const skillCorrelations: PatternSkillCorrelation['skills'] = []

    Object.entries(SKILLS).forEach(([skillId, skill]) => {
      const skillLevel = skillLevels[skillId] ?? 0

      // Calculate correlation based on alignment
      let correlation = 0
      if (skill.alignedPatterns.includes(pattern)) {
        // Positive correlation expected
        correlation = skillLevel > 0 && patternValue > 0
          ? Math.min(skillLevel / 5, 1) * Math.min(patternValue / 10, 1)
          : 0
      } else {
        // Weak or no correlation
        correlation = 0.1 * (skillLevel > 0 ? 1 : 0)
      }

      skillCorrelations.push({
        skillId,
        skillName: skill.name,
        correlationStrength: correlation
      })
    })

    correlations.push({
      pattern,
      skills: skillCorrelations.sort((a, b) => b.correlationStrength - a.correlationStrength)
    })
  })

  return correlations
}

/**
 * Get strongest predictors for a skill
 */
export function getSkillPredictors(skillId: string): PatternType[] {
  const skill = SKILLS[skillId]
  if (!skill) return []
  return skill.alignedPatterns
}

// ═══════════════════════════════════════════════════════════════════════════
// D-053: SKILL APPLICATION CHALLENGES
// Mini-challenges testing specific skills
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Skill challenge definition
 */
export interface SkillChallenge {
  id: string
  skillTested: string
  characterId: CharacterId
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit?: number // seconds
  scenarios: ChallengeScenario[]
  passingScore: number // 0-100
}

/**
 * Challenge scenario
 */
export interface ChallengeScenario {
  situation: string
  options: {
    text: string
    skillDemonstration: number // 0-3
    feedback: string
  }[]
}

/**
 * Challenge result
 */
export interface ChallengeResult {
  challengeId: string
  passed: boolean
  score: number
  skillGain: number
  feedback: string
}

/**
 * Skill challenges registry
 */
export const SKILL_CHALLENGES: SkillChallenge[] = [
  {
    id: 'active_listening_samuel',
    skillTested: 'active_listening',
    characterId: 'samuel',
    name: 'The Quiet Hour',
    description: 'Listen carefully to Samuel\'s story without interrupting',
    difficulty: 'medium',
    scenarios: [
      {
        situation: 'Samuel pauses mid-sentence, looking at something distant...',
        options: [
          { text: 'Wait in comfortable silence', skillDemonstration: 3, feedback: 'You gave him space to continue.' },
          { text: 'Ask what he\'s thinking about', skillDemonstration: 1, feedback: 'Sometimes silence says more.' },
          { text: 'Change the subject', skillDemonstration: 0, feedback: 'The moment was lost.' }
        ]
      }
    ],
    passingScore: 60
  },
  {
    id: 'crisis_management_devon',
    skillTested: 'crisis_management',
    characterId: 'devon',
    name: 'The Outage',
    description: 'Help Devon manage a system crisis under pressure',
    difficulty: 'hard',
    timeLimit: 120,
    scenarios: [
      {
        situation: 'Multiple systems are failing. Where do you focus first?',
        options: [
          { text: 'Triage: Identify the root cause', skillDemonstration: 3, feedback: 'Smart. Find the source.' },
          { text: 'Fix the most visible problem first', skillDemonstration: 1, feedback: 'Band-aids won\'t hold.' },
          { text: 'Call for backup immediately', skillDemonstration: 2, feedback: 'Good, but you should assess first.' }
        ]
      }
    ],
    passingScore: 70
  },
  {
    id: 'empathy_grace',
    skillTested: 'empathy',
    characterId: 'grace',
    name: 'The Vigil',
    description: 'Support a worried family member',
    difficulty: 'medium',
    scenarios: [
      {
        situation: 'A worried parent is asking questions you can\'t answer.',
        options: [
          { text: 'Acknowledge their fear, stay present', skillDemonstration: 3, feedback: 'Sometimes presence is enough.' },
          { text: 'Promise everything will be okay', skillDemonstration: 0, feedback: 'Don\'t make promises you can\'t keep.' },
          { text: 'Explain the medical process', skillDemonstration: 1, feedback: 'Information helps, but they needed comfort.' }
        ]
      }
    ],
    passingScore: 60
  }
]

/**
 * Score a challenge attempt
 */
export function scoreChallengeAttempt(
  challengeId: string,
  responses: number[] // Index of chosen option for each scenario
): ChallengeResult {
  const challenge = SKILL_CHALLENGES.find(c => c.id === challengeId)
  if (!challenge) {
    return { challengeId, passed: false, score: 0, skillGain: 0, feedback: 'Challenge not found' }
  }

  let totalScore = 0
  let maxScore = 0

  challenge.scenarios.forEach((scenario, i) => {
    maxScore += 3 // Max demonstration per scenario
    const choice = responses[i]
    if (choice !== undefined && scenario.options[choice]) {
      totalScore += scenario.options[choice].skillDemonstration
    }
  })

  const score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  const passed = score >= challenge.passingScore

  return {
    challengeId,
    passed,
    score,
    skillGain: passed ? (challenge.difficulty === 'hard' ? 2 : 1) : 0,
    feedback: passed
      ? `Well done! You demonstrated strong ${SKILLS[challenge.skillTested]?.name}.`
      : `Keep practicing. ${SKILLS[challenge.skillTested]?.name} takes time to develop.`
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// D-094: SKILL DECAY MECHANICS
// Skills atrophy without practice
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Skill decay configuration
 */
export interface SkillDecayConfig {
  decayRate: number // Points per session without use
  minimumLevel: number // Skills don't decay below this
  protectedSkills: string[] // Skills that don't decay
  decayGracePeriod: number // Sessions before decay starts
}

export const DEFAULT_DECAY_CONFIG: SkillDecayConfig = {
  decayRate: 0.5,
  minimumLevel: 1,
  protectedSkills: [], // Could include 'core' skills
  decayGracePeriod: 3
}

/**
 * Track skill usage
 */
export interface SkillUsageRecord {
  skillId: string
  lastUsedSession: number
  usageCount: number
}

/**
 * Calculate skill decay for a session
 */
export function calculateSkillDecay(
  skillLevels: Record<string, number>,
  usageRecords: Map<string, SkillUsageRecord>,
  currentSession: number,
  config: SkillDecayConfig = DEFAULT_DECAY_CONFIG
): Record<string, number> {
  const newLevels = { ...skillLevels }

  Object.entries(skillLevels).forEach(([skillId, level]) => {
    // Skip protected skills
    if (config.protectedSkills.includes(skillId)) return

    // Skip if at minimum
    if (level <= config.minimumLevel) return

    const usage = usageRecords.get(skillId)
    const sessionsSinceUse = usage
      ? currentSession - usage.lastUsedSession
      : currentSession

    // Apply decay after grace period
    if (sessionsSinceUse > config.decayGracePeriod) {
      const decayAmount = (sessionsSinceUse - config.decayGracePeriod) * config.decayRate
      newLevels[skillId] = Math.max(config.minimumLevel, level - decayAmount)
    }
  })

  return newLevels
}

/**
 * Get skills at risk of decay
 */
export function getSkillsAtRiskOfDecay(
  usageRecords: Map<string, SkillUsageRecord>,
  currentSession: number,
  warningThreshold: number = 2 // Sessions before grace period ends
): string[] {
  const config = DEFAULT_DECAY_CONFIG
  const atRisk: string[] = []

  usageRecords.forEach((record, skillId) => {
    const sessionsSinceUse = currentSession - record.lastUsedSession
    const sessionsUntilDecay = config.decayGracePeriod - sessionsSinceUse

    if (sessionsUntilDecay <= warningThreshold && sessionsUntilDecay > 0) {
      atRisk.push(skillId)
    }
  })

  return atRisk
}

/**
 * Suggest activities to prevent decay
 */
export function getSuggestedPracticeActivities(
  atRiskSkills: string[]
): { skillId: string; activity: string; character: CharacterId }[] {
  return atRiskSkills.map(skillId => ({
    skillId,
    activity: getSuggestedActivity(skillId),
    character: getCharacterForSkill(skillId)
  }))
}

/**
 * Get character associated with a skill
 */
function getCharacterForSkill(skillId: string): CharacterId {
  const skill = SKILLS[skillId]
  if (!skill) return 'samuel'

  // Find career that uses this skill, return example character
  const career = CAREER_FIELDS.find(c =>
    c.requiredSkills.some(s => s.skillId === skillId)
  )

  return career?.characterExamples[0] ?? 'samuel'
}
