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
  },

  // Neuro & Behavioral Sciences (New Addition)
  neuroscience_literacy: {
    id: 'neuroscience_literacy',
    name: 'Neuroscience Literacy',
    category: 'technical',
    description: 'Understanding brain function and cognitive processes',
    alignedPatterns: ['analytical', 'exploring'],
    transferDomains: ['healthcare', 'research', 'education', 'tech_bio']
  },
  behavioral_psychology: {
    id: 'behavioral_psychology',
    name: 'Behavioral Psychology',
    category: 'analytical',
    description: 'Analyzing human behavior and decision patterns',
    alignedPatterns: ['analytical', 'patience'],
    transferDomains: ['marketing', 'UX', 'policy', 'healthcare']
  },
  cognitive_flexibility: {
    id: 'cognitive_flexibility',
    name: 'Cognitive Flexibility',
    category: 'interpersonal',
    description: 'Adapting thinking to new and unexpected situations',
    alignedPatterns: ['exploring', 'building'],
    transferDomains: ['leadership', 'innovation', 'crisis_management']
  },

  // Expanded Skills for Visualization & Hexagon
  creativity: {
    id: 'creativity',
    name: 'Creativity',
    category: 'creative',
    description: 'Thinking outside the box',
    alignedPatterns: ['building', 'exploring'],
    transferDomains: ['arts', 'innovation', 'marketing']
  },
  leadership: {
    id: 'leadership',
    name: 'Leadership',
    category: 'leadership',
    description: 'Guiding and motivating others',
    alignedPatterns: ['helping', 'building'],
    transferDomains: ['management', 'politics', 'education']
  },
  adaptability: {
    id: 'adaptability',
    name: 'Adaptability',
    category: 'interpersonal',
    description: 'Adjusting to new conditions',
    alignedPatterns: ['exploring', 'patience'],
    transferDomains: ['consulting', 'crisis_management', 'startups']
  },
  deep_work: {
    id: 'deep_work',
    name: 'Deep Work',
    category: 'technical',
    description: 'Focusing on demanding tasks',
    alignedPatterns: ['analytical', 'patience'],
    transferDomains: ['research', 'programming', 'writing']
  },
  emotional_intelligence: {
    id: 'emotional_intelligence',
    name: 'Emotional Intelligence',
    category: 'interpersonal',
    description: 'Managing own and others emotions',
    alignedPatterns: ['helping', 'patience'],
    transferDomains: ['leadership', 'counseling', 'hr']
  },
  strategic_thinking: {
    id: 'strategic_thinking',
    name: 'Strategic Thinking',
    category: 'leadership',
    description: 'Planning for the future',
    alignedPatterns: ['analytical', 'exploring'],
    transferDomains: ['management', 'chess', 'policy']
  },

  // Literacy Cluster
  digital_literacy: { id: 'digital_literacy', name: 'Digital Literacy', category: 'technical', description: '', alignedPatterns: ['analytical'], transferDomains: ['all'] },
  technical_literacy: { id: 'technical_literacy', name: 'Technical Literacy', category: 'technical', description: '', alignedPatterns: ['building'], transferDomains: ['engineering'] },
  information_literacy: { id: 'information_literacy', name: 'Information Literacy', category: 'analytical', description: '', alignedPatterns: ['exploring'], transferDomains: ['research'] },

  // Others required by Visualizer
  cultural_competence: { id: 'cultural_competence', name: 'Cultural Competence', category: 'interpersonal', description: '', alignedPatterns: ['helping'], transferDomains: ['diplomacy'] },
  encouragement: { id: 'encouragement', name: 'Encouragement', category: 'interpersonal', description: '', alignedPatterns: ['helping'], transferDomains: ['coaching'] },
  respect: { id: 'respect', name: 'Respect', category: 'interpersonal', description: '', alignedPatterns: ['patience'], transferDomains: ['all'] },
  collaboration: { id: 'collaboration', name: 'Collaboration', category: 'interpersonal', description: '', alignedPatterns: ['helping'], transferDomains: ['teamwork'] },
  marketing: { id: 'marketing', name: 'Marketing', category: 'communication', description: '', alignedPatterns: ['building'], transferDomains: ['sales'] },
  curriculum_design: { id: 'curriculum_design', name: 'Curriculum Design', category: 'creative', description: '', alignedPatterns: ['building'], transferDomains: ['education'] },
  wisdom: { id: 'wisdom', name: 'Wisdom', category: 'leadership', description: '', alignedPatterns: ['patience'], transferDomains: ['life'] },
  curiosity: { id: 'curiosity', name: 'Curiosity', category: 'analytical', description: '', alignedPatterns: ['exploring'], transferDomains: ['research'] },
  observation: { id: 'observation', name: 'Observation', category: 'analytical', description: '', alignedPatterns: ['patience'], transferDomains: ['science'] },
  triage: { id: 'triage', name: 'Triage', category: 'leadership', description: '', alignedPatterns: ['analytical'], transferDomains: ['healthcare'] },
  courage: { id: 'courage', name: 'Courage', category: 'leadership', description: '', alignedPatterns: ['helping'], transferDomains: ['leadership'] },
  resilience: { id: 'resilience', name: 'Resilience', category: 'interpersonal', description: '', alignedPatterns: ['patience'], transferDomains: ['life'] },
  action_orientation: { id: 'action_orientation', name: 'Action Orientation', category: 'leadership', description: '', alignedPatterns: ['building'], transferDomains: ['entrepreneurship'] },
  risk_management: { id: 'risk_management', name: 'Risk Management', category: 'analytical', description: '', alignedPatterns: ['analytical'], transferDomains: ['finance'] },
  urgency: { id: 'urgency', name: 'Urgency', category: 'leadership', description: '', alignedPatterns: ['building'], transferDomains: ['crisis'] },
  learning_agility: { id: 'learning_agility', name: 'Learning Agility', category: 'analytical', description: '', alignedPatterns: ['exploring'], transferDomains: ['learning'] },
  humility: { id: 'humility', name: 'Humility', category: 'interpersonal', description: '', alignedPatterns: ['patience'], transferDomains: ['leadership'] },
  fairness: { id: 'fairness', name: 'Fairness', category: 'interpersonal', description: '', alignedPatterns: ['patience'], transferDomains: ['justice'] },
  pragmatism: { id: 'pragmatism', name: 'Pragmatism', category: 'analytical', description: '', alignedPatterns: ['building'], transferDomains: ['engineering'] },
  integrity: { id: 'integrity', name: 'Integrity', category: 'leadership', description: '', alignedPatterns: ['patience'], transferDomains: ['ethics'] },
  accountability: { id: 'accountability', name: 'Accountability', category: 'leadership', description: '', alignedPatterns: ['building'], transferDomains: ['management'] },
  time_management: { id: 'time_management', name: 'Time Management', category: 'technical', description: '', alignedPatterns: ['analytical'], transferDomains: ['productivity'] },
  financial_literacy: { id: 'financial_literacy', name: 'Financial Literacy', category: 'technical', description: '', alignedPatterns: ['analytical'], transferDomains: ['finance'] },

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
  },

  // LinkedIn 2026 Career Expansion Fields
  {
    id: 'finance_investment',
    name: 'Finance & Investment',
    sector: 'Financial Services',
    requiredSkills: [
      { skillId: 'data_analysis', minLevel: 4 },
      { skillId: 'critical_thinking', minLevel: 4 },
      { skillId: 'decision_making', minLevel: 4 },
      { skillId: 'mentoring', minLevel: 2 }
    ],
    preferredPatterns: ['analytical', 'building'],
    characterExamples: ['quinn', 'marcus'],
    birminghamEmployers: ['Regions Financial', 'Protective Life', 'Birmingham Angel Network', 'Harbert Management']
  },
  {
    id: 'sales_business_dev',
    name: 'Sales & Business Development',
    sector: 'Commercial',
    requiredSkills: [
      { skillId: 'persuasion', minLevel: 4 },
      { skillId: 'teamwork', minLevel: 4 },
      { skillId: 'active_listening', minLevel: 3 },
      { skillId: 'conflict_resolution', minLevel: 3 }
    ],
    preferredPatterns: ['helping', 'building'],
    characterExamples: ['dante', 'jordan'],
    birminghamEmployers: ['Shipt', 'Southern Company', 'Birmingham Business Alliance', 'Innovation Depot']
  },
  {
    id: 'ai_strategy',
    name: 'AI Strategy & Consulting',
    sector: 'Technology',
    requiredSkills: [
      { skillId: 'systems_thinking', minLevel: 4 },
      { skillId: 'decision_making', minLevel: 4 },
      { skillId: 'crisis_management', minLevel: 3 },
      { skillId: 'critical_thinking', minLevel: 4 }
    ],
    preferredPatterns: ['analytical', 'exploring'],
    characterExamples: ['nadia', 'rohan', 'maya'],
    birminghamEmployers: ['UAB Health System', 'Alabama AI Initiative', 'Southern Research', 'Innovation Depot']
  },
  {
    id: 'nonprofit_fundraising',
    name: 'Nonprofit & Fundraising',
    sector: 'Social Impact',
    requiredSkills: [
      { skillId: 'written_communication', minLevel: 4 },
      { skillId: 'teamwork', minLevel: 4 },
      { skillId: 'empathy', minLevel: 4 },
      { skillId: 'public_speaking', minLevel: 3 }
    ],
    preferredPatterns: ['helping', 'patience'],
    characterExamples: ['isaiah', 'asha', 'grace'],
    birminghamEmployers: ['Community Foundation of Greater Birmingham', 'United Way of Central Alabama', 'Birmingham Promise', 'Urban Ministry']
  },
  {
    id: 'manufacturing',
    name: 'Advanced Manufacturing',
    sector: 'Industrial',
    requiredSkills: [
      { skillId: 'problem_solving', minLevel: 4 },
      { skillId: 'systems_thinking', minLevel: 3 },
      { skillId: 'crisis_management', minLevel: 3 },
      { skillId: 'teamwork', minLevel: 3 }
    ],
    preferredPatterns: ['building', 'analytical'],
    characterExamples: ['silas', 'devon', 'kai'],
    birminghamEmployers: ['Mercedes-Benz', 'Honda Manufacturing', 'Austal USA', 'Vulcan Materials']
  },

  {
    id: 'logistics_supply_chain',
    name: 'Logistics & Supply Chain',
    sector: 'Operations',
    requiredSkills: [
      { skillId: 'systems_thinking', minLevel: 4 },
      { skillId: 'data_analysis', minLevel: 3 },
      { skillId: 'problem_solving', minLevel: 4 },
      { skillId: 'decision_making', minLevel: 3 }
    ],
    preferredPatterns: ['analytical', 'building'],
    characterExamples: ['alex', 'devon'],
    birminghamEmployers: ['Amazon', 'FedEx', 'UPS', 'Norfolk Southern']
  },

  // Neuro & Behavioral Expansions
  {
    id: 'neuro_technology',
    name: 'Neuro-Technology & BCI',
    sector: 'Technology',
    requiredSkills: [
      { skillId: 'neuroscience_literacy', minLevel: 4 },
      { skillId: 'programming', minLevel: 3 },
      { skillId: 'data_analysis', minLevel: 3 },
      { skillId: 'innovation', minLevel: 3 }
    ],
    preferredPatterns: ['analytical', 'exploring'],
    characterExamples: ['maya', 'elena'],
    birminghamEmployers: ['UAB Neuroengineering', 'Southern Research', 'Innovation Depot']
  },
  {
    id: 'organizational_psychology',
    name: 'Organizational Psychology',
    sector: 'Human Services',
    requiredSkills: [
      { skillId: 'behavioral_psychology', minLevel: 4 },
      { skillId: 'systems_thinking', minLevel: 3 },
      { skillId: 'empathy', minLevel: 3 },
      { skillId: 'data_analysis', minLevel: 2 }
    ],
    preferredPatterns: ['analytical', 'helping'],
    characterExamples: ['jordan', 'grace', 'zara'],
    birminghamEmployers: ['Leadership Birmingham', 'Regions HR', 'UAB Medicine']
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
    // Max pattern level is 5, so we divide by 5 to get 0-1 ratio
    const contribution = Math.min(patternValue / 5, 1) * maxPerPattern
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
      const suggestedChar = career.characterExamples.find(_charId => {
        // Characters who exemplify this skill
        return skill.alignedPatterns.some(_p => {
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
 * Each skill has at least one challenge tied to a character
 */
export const SKILL_CHALLENGES: SkillChallenge[] = [
  // Communication Skills
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
    id: 'persuasion_dante',
    skillTested: 'persuasion',
    characterId: 'dante',
    name: 'The Reluctant Buyer',
    description: 'Convince a skeptical client through genuine connection',
    difficulty: 'hard',
    scenarios: [
      {
        situation: 'The client has had bad experiences with salespeople before. They\'re guarded.',
        options: [
          { text: 'Ask about their previous experiences and concerns', skillDemonstration: 3, feedback: 'Understanding before selling. Smart.' },
          { text: 'Launch into your pitch immediately', skillDemonstration: 0, feedback: 'You pushed when they needed space.' },
          { text: 'Offer a discount to sweeten the deal', skillDemonstration: 1, feedback: 'Price isn\'t their concern - trust is.' }
        ]
      }
    ],
    passingScore: 70
  },
  {
    id: 'public_speaking_tess',
    skillTested: 'public_speaking',
    characterId: 'tess',
    name: 'The First Day',
    description: 'Help Tess address a classroom of skeptical students',
    difficulty: 'medium',
    scenarios: [
      {
        situation: 'The students look bored before you\'ve even started speaking.',
        options: [
          { text: 'Open with a personal story that shows vulnerability', skillDemonstration: 3, feedback: 'Authenticity captures attention.' },
          { text: 'Start with the lesson plan and objectives', skillDemonstration: 1, feedback: 'Technically correct, but you lost them.' },
          { text: 'Tell a joke to break the ice', skillDemonstration: 2, feedback: 'Good instinct, but substance matters more.' }
        ]
      }
    ],
    passingScore: 60
  },
  {
    id: 'written_communication_isaiah',
    skillTested: 'written_communication',
    characterId: 'isaiah',
    name: 'The Grant Deadline',
    description: 'Help Isaiah craft a compelling grant proposal under pressure',
    difficulty: 'hard',
    timeLimit: 180,
    scenarios: [
      {
        situation: 'The grant requires demonstrating community impact in 250 words.',
        options: [
          { text: 'Lead with a specific person\'s story, then show broader impact', skillDemonstration: 3, feedback: 'Personal stories make data memorable.' },
          { text: 'List statistics and metrics of your organization', skillDemonstration: 1, feedback: 'Numbers alone don\'t move hearts.' },
          { text: 'Describe your programs in general terms', skillDemonstration: 0, feedback: 'Too vague. Specificity creates trust.' }
        ]
      }
    ],
    passingScore: 70
  },

  // Technical Skills
  {
    id: 'data_analysis_elena',
    skillTested: 'data_analysis',
    characterId: 'elena',
    name: 'The Pattern',
    description: 'Help Elena find meaning in fragmented historical records',
    difficulty: 'hard',
    scenarios: [
      {
        situation: 'Elena shows you three seemingly unrelated documents. "What do you see?"',
        options: [
          { text: 'Look for dates, names, and locations that repeat', skillDemonstration: 3, feedback: 'You see the threads connecting them.' },
          { text: 'Focus on the most complete document first', skillDemonstration: 1, feedback: 'Context requires comparison.' },
          { text: 'Ask what she\'s looking for specifically', skillDemonstration: 2, feedback: 'Good, but sometimes discovery comes first.' }
        ]
      }
    ],
    passingScore: 70
  },
  {
    id: 'programming_maya',
    skillTested: 'programming',
    characterId: 'maya',
    name: 'The Demo',
    description: 'Debug Maya\'s robotics code before the demonstration',
    difficulty: 'hard',
    timeLimit: 120,
    scenarios: [
      {
        situation: 'The robot moves erratically. The demo is in 10 minutes.',
        options: [
          { text: 'Check the sensor inputs and calibration first', skillDemonstration: 3, feedback: 'Garbage in, garbage out. Good instinct.' },
          { text: 'Rewrite the movement algorithm', skillDemonstration: 0, feedback: 'No time for complete rewrites.' },
          { text: 'Add print statements to trace the logic', skillDemonstration: 2, feedback: 'Debugging helps, but start with inputs.' }
        ]
      }
    ],
    passingScore: 70
  },
  {
    id: 'cybersecurity_marcus',
    skillTested: 'cybersecurity',
    characterId: 'marcus',
    name: 'The Breach',
    description: 'Help Marcus contain a hospital data breach',
    difficulty: 'hard',
    timeLimit: 90,
    scenarios: [
      {
        situation: 'Suspicious network activity detected. Patient records may be at risk.',
        options: [
          { text: 'Isolate affected systems immediately', skillDemonstration: 3, feedback: 'Containment first. Smart.' },
          { text: 'Try to identify the attacker\'s methods', skillDemonstration: 1, feedback: 'Important, but stop the bleeding first.' },
          { text: 'Notify all staff via email', skillDemonstration: 0, feedback: 'That could alert the attacker.' }
        ]
      }
    ],
    passingScore: 80
  },
  {
    id: 'systems_thinking_alex',
    skillTested: 'systems_thinking',
    characterId: 'alex',
    name: 'The Bottleneck',
    description: 'Help Alex optimize a supply chain disruption',
    difficulty: 'medium',
    scenarios: [
      {
        situation: 'Deliveries are delayed. Alex shows you the logistics map.',
        options: [
          { text: 'Trace backwards from the delay to find dependencies', skillDemonstration: 3, feedback: 'Following the chain reveals the weak link.' },
          { text: 'Speed up the final delivery step', skillDemonstration: 0, feedback: 'The problem is upstream.' },
          { text: 'Ask which vendors are performing well', skillDemonstration: 2, feedback: 'Good data, but you need the whole picture.' }
        ]
      }
    ],
    passingScore: 60
  },

  // Analytical Skills
  {
    id: 'critical_thinking_zara',
    skillTested: 'critical_thinking',
    characterId: 'zara',
    name: 'The Algorithm',
    description: 'Help Zara evaluate a hiring algorithm for hidden bias',
    difficulty: 'hard',
    scenarios: [
      {
        situation: 'The algorithm rejects 40% more candidates from certain zip codes.',
        options: [
          { text: 'Examine what other factors correlate with zip code', skillDemonstration: 3, feedback: 'You see through the proxy discrimination.' },
          { text: 'The zip code isn\'t a protected class, so it\'s legal', skillDemonstration: 0, feedback: 'Legal doesn\'t mean ethical.' },
          { text: 'Suggest removing zip code from the inputs', skillDemonstration: 2, feedback: 'Good start, but the bias may persist elsewhere.' }
        ]
      }
    ],
    passingScore: 70
  },
  {
    id: 'problem_solving_kai',
    skillTested: 'problem_solving',
    characterId: 'kai',
    name: 'The Inspection',
    description: 'Help Kai find the root cause of a safety concern',
    difficulty: 'medium',
    scenarios: [
      {
        situation: 'A worker reported feeling dizzy in Section C. No obvious cause.',
        options: [
          { text: 'Check ventilation, gas levels, and recent changes systematically', skillDemonstration: 3, feedback: 'Methodical approach finds hidden dangers.' },
          { text: 'Close Section C until someone figures it out', skillDemonstration: 1, feedback: 'Safe but reactive. We need answers.' },
          { text: 'Ask if the worker is feeling better now', skillDemonstration: 0, feedback: 'The symptom may return if the cause persists.' }
        ]
      }
    ],
    passingScore: 60
  },
  {
    id: 'research_rohan',
    skillTested: 'research',
    characterId: 'rohan',
    name: 'The Dataset',
    description: 'Help Rohan validate research findings under scrutiny',
    difficulty: 'hard',
    scenarios: [
      {
        situation: 'A reviewer questions your methodology. Your data supports your conclusion.',
        options: [
          { text: 'Review methodology for potential confounds before responding', skillDemonstration: 3, feedback: 'Intellectual honesty strengthens your position.' },
          { text: 'Defend your work by showing the statistical significance', skillDemonstration: 1, feedback: 'Significance doesn\'t prove methodology was sound.' },
          { text: 'Request clarification on what specifically concerns them', skillDemonstration: 2, feedback: 'Good, but self-examination comes first.' }
        ]
      }
    ],
    passingScore: 70
  },

  // Interpersonal Skills
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
  },
  {
    id: 'conflict_resolution_asha',
    skillTested: 'conflict_resolution',
    characterId: 'asha',
    name: 'The Mural',
    description: 'Help Asha mediate between community members with opposing visions',
    difficulty: 'hard',
    scenarios: [
      {
        situation: 'Two groups want completely different themes for the mural. Voices are rising.',
        options: [
          { text: 'Ask each side to share what the theme means to them personally', skillDemonstration: 3, feedback: 'Finding the deeper "why" reveals common ground.' },
          { text: 'Propose a compromise: split the wall in half', skillDemonstration: 1, feedback: 'Division isn\'t resolution.' },
          { text: 'Let the majority vote decide', skillDemonstration: 0, feedback: 'The minority will feel unheard.' }
        ]
      }
    ],
    passingScore: 70
  },
  {
    id: 'teamwork_jordan',
    skillTested: 'teamwork',
    characterId: 'jordan',
    name: 'The Build',
    description: 'Coordinate a construction crew with different skill levels',
    difficulty: 'medium',
    scenarios: [
      {
        situation: 'An experienced worker is frustrated with a new hire\'s pace.',
        options: [
          { text: 'Pair them together so the veteran can teach', skillDemonstration: 3, feedback: 'Mentorship transforms friction into growth.' },
          { text: 'Assign them to separate tasks', skillDemonstration: 1, feedback: 'Avoids conflict but wastes the teaching opportunity.' },
          { text: 'Tell the veteran to be more patient', skillDemonstration: 0, feedback: 'Directives don\'t build understanding.' }
        ]
      }
    ],
    passingScore: 60
  },

  // Leadership Skills
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
    id: 'decision_making_quinn',
    skillTested: 'decision_making',
    characterId: 'quinn',
    name: 'The Portfolio',
    description: 'Help Quinn make an investment decision with incomplete information',
    difficulty: 'hard',
    scenarios: [
      {
        situation: 'A promising startup needs an answer by tomorrow. The due diligence is 70% complete.',
        options: [
          { text: 'Identify the remaining unknowns and their potential impact', skillDemonstration: 3, feedback: 'You know what you don\'t know. That\'s wisdom.' },
          { text: 'Pass on the deal - too much uncertainty', skillDemonstration: 1, feedback: 'Risk-averse but you might miss opportunities.' },
          { text: 'Invest at a lower valuation to compensate for risk', skillDemonstration: 2, feedback: 'Creative, but doesn\'t address the unknowns.' }
        ]
      }
    ],
    passingScore: 70
  },
  {
    id: 'mentoring_samuel',
    skillTested: 'mentoring',
    characterId: 'samuel',
    name: 'The Crossroads',
    description: 'Guide someone facing a difficult career decision',
    difficulty: 'medium',
    scenarios: [
      {
        situation: 'A traveler asks: "Should I take the safe job or follow my passion?"',
        options: [
          { text: 'Ask what makes each option feel meaningful to them', skillDemonstration: 3, feedback: 'The answer is always within them.' },
          { text: 'Share what you would do in their situation', skillDemonstration: 1, feedback: 'Your path isn\'t their path.' },
          { text: 'Present a pros and cons analysis', skillDemonstration: 2, feedback: 'Logic helps, but meaning matters more.' }
        ]
      }
    ],
    passingScore: 60
  },

  // Creative Skills
  {
    id: 'design_thinking_lira',
    skillTested: 'design_thinking',
    characterId: 'lira',
    name: 'The Soundscape',
    description: 'Help Lira design an audio experience for a community space',
    difficulty: 'medium',
    scenarios: [
      {
        situation: 'The space needs to feel welcoming but also energizing.',
        options: [
          { text: 'Observe how people currently use the space first', skillDemonstration: 3, feedback: 'Design starts with understanding.' },
          { text: 'Test different music styles and see what sticks', skillDemonstration: 2, feedback: 'Experimentation helps, but context matters.' },
          { text: 'Research what sounds work in similar spaces', skillDemonstration: 1, feedback: 'This space is unique. Start there.' }
        ]
      }
    ],
    passingScore: 60
  },
  {
    id: 'innovation_yaquin',
    skillTested: 'innovation',
    characterId: 'yaquin',
    name: 'The Launch',
    description: 'Help Yaquin iterate on EdTech product feedback',
    difficulty: 'hard',
    scenarios: [
      {
        situation: 'Beta users love the concept but engagement drops after Day 3.',
        options: [
          { text: 'Interview Day 3 dropoffs to understand what changed', skillDemonstration: 3, feedback: 'The answer is in the moment of friction.' },
          { text: 'Add more gamification features', skillDemonstration: 1, feedback: 'Features without understanding are noise.' },
          { text: 'Shorten the onboarding process', skillDemonstration: 2, feedback: 'Day 3 isn\'t onboarding - it\'s retention.' }
        ]
      }
    ],
    passingScore: 70
  },

  // LinkedIn 2026 Character Challenges
  {
    id: 'strategic_thinking_nadia',
    skillTested: 'critical_thinking',
    characterId: 'nadia',
    name: 'The Hype Meeting',
    description: 'Help Nadia manage stakeholder expectations about AI capabilities',
    difficulty: 'hard',
    scenarios: [
      {
        situation: 'Executives want AI to "fix everything" but don\'t understand the limitations.',
        options: [
          { text: 'Ask what specific problem they\'re trying to solve', skillDemonstration: 3, feedback: 'Specificity defeats vague expectations.' },
          { text: 'Show demos of what AI can actually do', skillDemonstration: 2, feedback: 'Demos help, but alignment on goals comes first.' },
          { text: 'Agree to the project and manage expectations later', skillDemonstration: 0, feedback: 'Setting up for failure.' }
        ]
      }
    ],
    passingScore: 70
  },
  {
    id: 'manufacturing_silas',
    skillTested: 'problem_solving',
    characterId: 'silas',
    name: 'The Calibration',
    description: 'Help Silas diagnose a precision manufacturing issue',
    difficulty: 'hard',
    scenarios: [
      {
        situation: 'Parts are consistently 0.02mm off spec. The machine passed calibration.',
        options: [
          { text: 'Check environmental factors: temperature, humidity, vibration', skillDemonstration: 3, feedback: 'Precision requires controlling what others overlook.' },
          { text: 'Recalibrate the machine more frequently', skillDemonstration: 1, feedback: 'Treating symptoms, not causes.' },
          { text: 'Adjust the spec tolerance to accept the deviation', skillDemonstration: 0, feedback: 'Compromising quality isn\'t problem-solving.' }
        ]
      }
    ],
    passingScore: 70
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

// ═══════════════════════════════════════════════════════════════════════════
// D-016: SKILL DECAY NARRATIVE
// Internal monologue generation for decaying skills
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get internal monologue text for a decaying skill
 */
export function getSkillDecayNarrative(skillId: string): string {
  const skill = SKILLS[skillId]
  if (!skill) return "You feel a part of yourself fading, but you can't quite place what it is."

  const narratives: Record<SkillCategory, string[]> = {
    communication: [
      `Your ability to articulate [${skill.name}] feels heavy on your tongue today.`,
      `Words regarding [${skill.name}] don't come as easily as they used to.`,
      `You struggle to find the right phrasing for [${skill.name}]. It's been too long.`
    ],
    technical: [
      `The precise details of [${skill.name}] seem a bit blurry in your mind.`,
      `Your technical grasp on [${skill.name}] feels rusty. Like a machine left in the rain.`,
      `You reach for a concept related to [${skill.name}], but it slips through your fingers.`
    ],
    analytical: [
      `Your [${skill.name}] pathways feel slower. Connections aren't sparking as fast.`,
      `The sharp edge of your [${skill.name}] has dulled from disuse.`,
      `It takes you a moment longer to process [${skill.name}] than it did last week.`
    ],
    interpersonal: [
      `Your connection to [${skill.name}] feels distant. A wall has grown.`,
      `Reading the emotional nuance of [${skill.name}] feels like reading a foreign language today.`,
      `You feel a bit out of sync with [${skill.name}]. The rhythm is off.`
    ],
    leadership: [
      `The weight of [${skill.name}] feels heavier. Your command is slipping.`,
      `Your instinct for [${skill.name}] hesitates. Confidence has eroded.`,
      `You question your own authority on [${skill.name}]. The certainty is gone.`
    ],
    creative: [
      `The spark of [${skill.name}] is dim. The ideas aren't flowing.`,
      `Your vision for [${skill.name}] is static. The colors have faded.`,
      `You try to summon [${skill.name}], but the muse is silent.`
    ]
  }

  const options = narratives[skill.category] || narratives.analytical
  const template = options[Math.floor(Math.random() * options.length)]

  // Clean up bracketed name if template uses it, otherwise just return text
  return template.replace(`[${skill.name}]`, skill.name)
}
