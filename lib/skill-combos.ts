/**
 * Skill Combos - Layer 5 of Progressive Skill Revelation
 *
 * Defines skill combinations that unlock special content, dialogue branches,
 * and hybrid career paths. Creates emergent gameplay where players discover
 * synergies between different skill development paths.
 */

export interface SkillComboUnlock {
  type: 'dialogue' | 'career' | 'achievement' | 'ability'
  id: string
  description: string
}

export interface SkillCombo {
  id: string
  name: string
  description: string
  skills: string[]        // Required skills
  minLevels: number[]     // Minimum level for each skill (0-10 scale)
  unlocks: SkillComboUnlock[]
  characterHint?: string  // Character who can help develop this combo
  icon?: string           // Emoji or icon identifier
}

/**
 * Core Skill Combos Registry
 *
 * Each combo represents a meaningful skill synthesis that opens new opportunities.
 * Combos are designed to encourage cross-character exploration and diverse skill building.
 */
export const SKILL_COMBOS: SkillCombo[] = [
  // ===== TIER 1 COMBOS: 2-Skill Synergies =====
  {
    id: 'strategic_empathy',
    name: 'Strategic Empathy',
    description: 'The ability to understand systems AND the people within them',
    skills: ['systemsThinking', 'emotionalIntelligence'],
    minLevels: [5, 5],
    unlocks: [
      { type: 'career', id: 'change_management', description: 'Organizational Change Manager' },
      { type: 'dialogue', id: 'devon_deep_insight', description: 'Devon shares advanced systems wisdom' }
    ],
    characterHint: 'Devon + Grace',
    icon: '🔮'
  },
  {
    id: 'technical_storyteller',
    name: 'Technical Storyteller',
    description: 'Translating complex concepts into human understanding',
    skills: ['technicalLiteracy', 'communication'],
    minLevels: [5, 5],
    unlocks: [
      { type: 'career', id: 'tech_education', description: 'Technical Educator / Content Creator' },
      { type: 'dialogue', id: 'marcus_translation_master', description: 'Marcus recognizes your translation skills' }
    ],
    characterHint: 'Marcus + Lira',
    icon: '📖'
  },
  {
    id: 'ethical_analyst',
    name: 'Ethical Analyst',
    description: 'Combining data rigor with moral reasoning',
    skills: ['dataLiteracy', 'ethicalReasoning'],
    minLevels: [4, 5],
    unlocks: [
      { type: 'career', id: 'ai_ethics', description: 'AI Ethics Specialist' },
      { type: 'dialogue', id: 'zara_deep_ethics', description: 'Zara shares advanced ethical frameworks' }
    ],
    characterHint: 'Zara + Nadia',
    icon: '⚖️'
  },
  {
    id: 'resilient_leader',
    name: 'Resilient Leader',
    description: 'Leading through crisis with composure',
    skills: ['leadership', 'resilience'],
    minLevels: [5, 4],
    unlocks: [
      { type: 'career', id: 'emergency_director', description: 'Emergency Management Director' },
      { type: 'achievement', id: 'crisis_navigator', description: 'Crisis Navigator badge' }
    ],
    characterHint: 'Kai + Samuel',
    icon: '🛡️'
  },
  {
    id: 'community_architect',
    name: 'Community Architect',
    description: 'Building systems that serve people',
    skills: ['collaboration', 'systemsThinking'],
    minLevels: [5, 4],
    unlocks: [
      { type: 'career', id: 'community_development', description: 'Community Development Director' },
      { type: 'dialogue', id: 'isaiah_vision', description: 'Isaiah shares community vision' }
    ],
    characterHint: 'Isaiah + Tess',
    icon: '🏗️'
  },

  // ===== TIER 2 COMBOS: 3-Skill Synergies =====
  {
    id: 'innovation_catalyst',
    name: 'Innovation Catalyst',
    description: 'Creativity combined with technical skill and strategic thinking',
    skills: ['creativity', 'technicalLiteracy', 'strategicThinking'],
    minLevels: [5, 4, 4],
    unlocks: [
      { type: 'career', id: 'product_innovation', description: 'Product Innovation Lead' },
      { type: 'dialogue', id: 'maya_rohan_crossover', description: 'Maya and Rohan discuss your innovative approach' }
    ],
    characterHint: 'Maya + Rohan',
    icon: '💡'
  },
  {
    id: 'data_storyteller',
    name: 'Data Storyteller',
    description: 'Finding patterns in data and communicating insights effectively',
    skills: ['dataLiteracy', 'communication', 'criticalThinking'],
    minLevels: [4, 5, 4],
    unlocks: [
      { type: 'career', id: 'data_journalism', description: 'Data Journalist / Analyst' },
      { type: 'dialogue', id: 'elena_deep_synthesis', description: 'Elena shares advanced research methods' }
    ],
    characterHint: 'Elena + Marcus',
    icon: '📊'
  },
  {
    id: 'cultural_bridge',
    name: 'Cultural Bridge',
    description: 'Connecting communities through understanding and communication',
    skills: ['culturalCompetence', 'emotionalIntelligence', 'communication'],
    minLevels: [5, 4, 5],
    unlocks: [
      { type: 'career', id: 'dei_consultant', description: 'DEI Consultant / Cultural Liaison' },
      { type: 'dialogue', id: 'asha_mediation_master', description: 'Asha teaches advanced conflict resolution' }
    ],
    characterHint: 'Asha + Grace',
    icon: '🌉'
  },
  {
    id: 'financial_mentor',
    name: 'Financial Mentor',
    description: 'Understanding money and helping others navigate it',
    skills: ['financialLiteracy', 'mentorship', 'emotionalIntelligence'],
    minLevels: [5, 4, 4],
    unlocks: [
      { type: 'career', id: 'financial_coach', description: 'Financial Coach / Advisor' },
      { type: 'dialogue', id: 'quinn_wealth_wisdom', description: 'Quinn shares generational wealth insights' }
    ],
    characterHint: 'Quinn + Jordan',
    icon: '💰'
  },
  {
    id: 'adaptive_creator',
    name: 'Adaptive Creator',
    description: 'Creating content while adapting to rapid change',
    skills: ['contentCreation', 'adaptability', 'creativity'],
    minLevels: [4, 5, 4],
    unlocks: [
      { type: 'career', id: 'digital_creative', description: 'Digital Creative Director' },
      { type: 'dialogue', id: 'lira_creative_mastery', description: 'Lira reveals advanced creative techniques' }
    ],
    characterHint: 'Lira + Yaquin',
    icon: '🎨'
  },

  // ===== TIER 3 COMBOS: Expert Syntheses =====
  {
    id: 'holistic_systems_thinker',
    name: 'Holistic Systems Thinker',
    description: 'Understanding complex systems from technical, human, and ethical angles',
    skills: ['systemsThinking', 'emotionalIntelligence', 'ethicalReasoning', 'technicalLiteracy'],
    minLevels: [5, 4, 4, 4],
    unlocks: [
      { type: 'career', id: 'chief_systems_officer', description: 'Chief Systems / Strategy Officer' },
      { type: 'achievement', id: 'systems_master', description: 'Systems Master achievement' },
      { type: 'dialogue', id: 'samuel_wisdom_complete', description: 'Samuel shares his deepest wisdom' }
    ],
    characterHint: 'Devon + Zara + Samuel',
    icon: '🌐'
  },
  {
    id: 'birmingham_champion',
    name: 'Birmingham Champion',
    description: 'Deep understanding of community, finance, and leadership for local impact',
    skills: ['culturalCompetence', 'leadership', 'financialLiteracy', 'collaboration'],
    minLevels: [5, 4, 4, 5],
    unlocks: [
      { type: 'career', id: 'civic_leader', description: 'Birmingham Civic Leader / Nonprofit Director' },
      { type: 'achievement', id: 'birmingham_rising', description: 'Birmingham Rising achievement' }
    ],
    characterHint: 'Isaiah + Quinn + Tess',
    icon: '🏙️'
  }
]

/**
 * Get all skill combos
 */
export function getAllSkillCombos(): SkillCombo[] {
  return [...SKILL_COMBOS]
}

/**
 * Get combo by ID
 */
export function getSkillComboById(comboId: string): SkillCombo | undefined {
  return SKILL_COMBOS.find(combo => combo.id === comboId)
}

/**
 * Get combos that involve a specific skill
 */
export function getCombosForSkill(skillName: string): SkillCombo[] {
  return SKILL_COMBOS.filter(combo => combo.skills.includes(skillName))
}

/**
 * Get combos that unlock a specific dialogue node
 */
export function getCombosForDialogue(dialogueId: string): SkillCombo[] {
  return SKILL_COMBOS.filter(combo =>
    combo.unlocks.some(unlock => unlock.type === 'dialogue' && unlock.id === dialogueId)
  )
}

/**
 * Get combos by tier (based on number of required skills)
 */
export function getCombosByTier(tier: 1 | 2 | 3): SkillCombo[] {
  const tierRanges = {
    1: [2, 2],   // 2 skills
    2: [3, 3],   // 3 skills
    3: [4, 10]   // 4+ skills
  }
  const [min, max] = tierRanges[tier]
  return SKILL_COMBOS.filter(combo => combo.skills.length >= min && combo.skills.length <= max)
}
