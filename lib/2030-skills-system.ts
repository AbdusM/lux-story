/**
 * 2030 Skills System for Future-Ready Career Exploration
 * Integrates critical 2030 skills contextually into Birmingham youth career exploration
 */

export interface FutureSkills {
  criticalThinking: number // 0-1 scale
  communication: number // 0-1 scale
  collaboration: number // 0-1 scale
  creativity: number // 0-1 scale
  adaptability: number // 0-1 scale
  leadership: number // 0-1 scale
  digitalLiteracy: number // 0-1 scale
  emotionalIntelligence: number // 0-1 scale
  culturalCompetence: number // 0-1 scale
  financialLiteracy: number // 0-1 scale
  timeManagement: number // 0-1 scale
  problemSolving: number // 0-1 scale
  
  // Expanded Skills
  systemsThinking: number
  crisisManagement: number
  instructionalDesign: number
  riskManagement: number
  courage: number
  informationLiteracy: number
  learningAgility: number
  entrepreneurship: number
  encouragement: number
  technicalLiteracy: number
  sustainability: number
  strategicThinking: number
  integrity: number
  mentorship: number
  wisdom: number
  actionOrientation: number
  psychology: number
  grounding: number
  observation: number
  urgency: number
  resilience: number
  groundedness: number
  humor: number
  pedagogy: number
  curriculumDesign: number
  marketing: number
  branding: number
  strategy: number
  deepWork: number
  pragmatism: number
  humility: number
  fairness: number
  coding: number
  respect: number
  curiosity: number
  patience: number
  triage: number
  empathy: number
  accountability: number
  visionaryThinking: number
}

export interface CareerPath2030 {
  id: string
  name: string
  description: string
  requiredSkills: (keyof FutureSkills)[]
  skillLevels: Partial<FutureSkills>
  birminghamRelevance: number // 0-1 scale
  growthProjection: 'high' | 'medium' | 'stable'
  salaryRange: [number, number]
  educationPath: string[]
  localOpportunities: string[]
}

export interface SkillContext {
  sceneId: string
  skillType: keyof FutureSkills
  context: string
  choiceText: string
  skillValue: number
  explanation: string
}

export class FutureSkillsSystem {
  private skills: FutureSkills
  private skillHistory: SkillContext[]
  private careerPaths: CareerPath2030[] = []
  private skillPrompts: Map<string, string[]> = new Map()

  constructor() {
    this.skills = {
      criticalThinking: 0.5,
      communication: 0.5,
      collaboration: 0.5,
      creativity: 0.5,
      adaptability: 0.5,
      leadership: 0.5,
      digitalLiteracy: 0.5,
      emotionalIntelligence: 0.5,
      culturalCompetence: 0.5,
      financialLiteracy: 0.5,
      timeManagement: 0.5,
      problemSolving: 0.5,
      
      systemsThinking: 0.5,
      crisisManagement: 0.5,
      instructionalDesign: 0.5,
      riskManagement: 0.5,
      courage: 0.5,
      informationLiteracy: 0.5,
      learningAgility: 0.5,
      entrepreneurship: 0.5,
      encouragement: 0.5,
      technicalLiteracy: 0.5,
      sustainability: 0.5,
      strategicThinking: 0.5,
      integrity: 0.5,
      mentorship: 0.5,
      wisdom: 0.5,
      actionOrientation: 0.5,
      psychology: 0.5,
      grounding: 0.5,
      observation: 0.5,
      urgency: 0.5,
      resilience: 0.5,
      groundedness: 0.5,
      humor: 0.5,
      pedagogy: 0.5,
      curriculumDesign: 0.5,
      marketing: 0.5,
      branding: 0.5,
      strategy: 0.5,
      deepWork: 0.5,
      pragmatism: 0.5,
      humility: 0.5,
      fairness: 0.5,
      coding: 0.5,
      respect: 0.5,
      curiosity: 0.5,
      patience: 0.5,
      triage: 0.5,
      empathy: 0.5,
      accountability: 0.5,
      visionaryThinking: 0.5
    }
    
    this.skillHistory = []
    this.initializeCareerPaths()
    this.initializeSkillPrompts()
  }

  private initializeCareerPaths() {
    this.careerPaths = [
      {
        id: 'healthcare-tech',
        name: 'Healthcare Technology Specialist',
        description: 'Bridge healthcare and technology to improve patient outcomes',
        requiredSkills: ['digitalLiteracy', 'communication', 'problemSolving', 'emotionalIntelligence'],
        skillLevels: { digitalLiteracy: 0.8, communication: 0.7, problemSolving: 0.8, emotionalIntelligence: 0.9 },
        birminghamRelevance: 0.9,
        growthProjection: 'high',
        salaryRange: [55000, 85000],
        educationPath: ['UAB Health Informatics', 'Jeff State Medical Technology', 'Bootcamp + Certification'],
        localOpportunities: ['UAB Hospital', 'Children\'s Hospital', 'St. Vincent\'s', 'Innovation Depot Health Tech']
      },
      {
        id: 'sustainable-construction',
        name: 'Sustainable Construction Manager',
        description: 'Lead green building projects and sustainable development',
        requiredSkills: ['leadership', 'problemSolving', 'adaptability', 'communication'],
        skillLevels: { leadership: 0.8, problemSolving: 0.9, adaptability: 0.7, communication: 0.6 },
        birminghamRelevance: 0.8,
        growthProjection: 'high',
        salaryRange: [60000, 95000],
        educationPath: ['Jeff State Construction Management', 'UAB Civil Engineering', 'Trade School + Leadership'],
        localOpportunities: ['Brasfield & Gorrie', 'Hoar Construction', 'City of Birmingham', 'Alabama Power']
      },
      {
        id: 'data-analyst-community',
        name: 'Community Data Analyst',
        description: 'Use data to solve community problems and drive social impact',
        requiredSkills: ['criticalThinking', 'digitalLiteracy', 'communication', 'culturalCompetence'],
        skillLevels: { criticalThinking: 0.9, digitalLiteracy: 0.8, communication: 0.7, culturalCompetence: 0.8 },
        birminghamRelevance: 0.9,
        growthProjection: 'high',
        salaryRange: [50000, 80000],
        educationPath: ['UAB Data Science', 'Jeff State Computer Science', 'Bootcamp + Community Focus'],
        localOpportunities: ['City of Birmingham', 'United Way', 'Innovation Depot', 'UAB Research']
      },
      {
        id: 'creative-entrepreneur',
        name: 'Creative Entrepreneur',
        description: 'Build creative businesses that serve Birmingham\'s growing arts scene',
        requiredSkills: ['creativity', 'leadership', 'adaptability', 'financialLiteracy'],
        skillLevels: { creativity: 0.9, leadership: 0.7, adaptability: 0.8, financialLiteracy: 0.6 },
        birminghamRelevance: 0.7,
        growthProjection: 'medium',
        salaryRange: [35000, 120000],
        educationPath: ['Birmingham-Southern Business', 'Jeff State Entrepreneurship', 'Self-Directed Learning'],
        localOpportunities: ['Sidewalk Film', 'Birmingham Museum of Art', 'Local Studios', 'Food Truck Scene']
      },
      {
        id: 'cybersecurity-specialist',
        name: 'Cybersecurity Specialist',
        description: 'Protect organizations from digital threats and ensure data security',
        requiredSkills: ['digitalLiteracy', 'criticalThinking', 'problemSolving', 'adaptability'],
        skillLevels: { digitalLiteracy: 0.9, criticalThinking: 0.8, problemSolving: 0.9, adaptability: 0.7 },
        birminghamRelevance: 0.8,
        growthProjection: 'high',
        salaryRange: [65000, 110000],
        educationPath: ['UAB Computer Science', 'Jeff State IT Security', 'Certification Programs'],
        localOpportunities: ['Regions Bank', 'Alabama Power', 'UAB IT', 'Local Tech Companies']
      },
      {
        id: 'community-health-worker',
        name: 'Community Health Worker',
        description: 'Bridge healthcare and community to improve health outcomes',
        requiredSkills: ['communication', 'culturalCompetence', 'emotionalIntelligence', 'collaboration'],
        skillLevels: { communication: 0.9, culturalCompetence: 0.9, emotionalIntelligence: 0.8, collaboration: 0.8 },
        birminghamRelevance: 0.9,
        growthProjection: 'high',
        salaryRange: [35000, 55000],
        educationPath: ['Jeff State Community Health', 'UAB Public Health', 'Community College + Certification'],
        localOpportunities: ['UAB Hospital', 'Jefferson County Health', 'Community Clinics', 'Non-profits']
      }
    ]
  }

  private initializeSkillPrompts() {
    // Original prompts maintained
    this.skillPrompts = new Map([
      ['criticalThinking', [
        "What would you analyze first in this situation?",
        "How would you break down this problem?",
        "What information do you need to make a good decision?",
        "What are the potential consequences of each option?"
      ]],
      ['communication', [
        "How would you explain this to someone who doesn\'t understand?",
        "What\'s the most important thing to communicate here?",
        "How would you present this idea to a group?",
        "What questions would you ask to clarify this situation?"
      ]],
      ['collaboration', [
        "How would you work with others on this?",
        "What role would you take in a team?",
        "How would you help everyone contribute?",
        "What would make this a successful group effort?"
      ]],
      ['creativity', [
        "What\'s a creative way to approach this?",
        "How could you make this more interesting?",
        "What new ideas come to mind?",
        "How would you make this stand out?"
      ]],
      ['adaptability', [
        "How would you adjust if things changed?",
        "What would you do if your first plan didn\'t work?",
        "How would you handle unexpected challenges?",
        "What backup options do you have?"
      ]],
      ['leadership', [
        "How would you guide others through this?",
        "What would you do to inspire people?",
        "How would you make tough decisions?",
        "What kind of leader would you be here?"
      ]],
      ['digitalLiteracy', [
        "What technology would help with this?",
        "How would you use digital tools here?",
        "What online resources would be useful?",
        "How would you stay current with technology?"
      ]],
      ['emotionalIntelligence', [
        "How are people feeling in this situation?",
        "What would help everyone feel heard?",
        "How would you manage your own emotions?",
        "What would create a positive atmosphere?"
      ]],
      ['culturalCompetence', [
        "How would you include different perspectives?",
        "What cultural factors might be important?",
        "How would you respect everyone\'s background?",
        "What would make this welcoming for all?"
      ]],
      ['financialLiteracy', [
        "What are the costs and benefits here?",
        "How would you budget for this?",
        "What financial factors should be considered?",
        "How would you make this financially sustainable?"
      ]],
      ['timeManagement', [
        "How would you prioritize this work?",
        "What would you do first?",
        "How would you stay on track?",
        "What deadlines are most important?"
      ]],
      ['problemSolving', [
        "What\'s the real problem here?",
        "How would you test your solution?",
        "What steps would you take?",
        "How would you know if it worked?"
      ]]
    ])
  }

  /**
   * Analyze choice for 2030 skills development
   */
  analyzeChoiceForSkills(choiceText: string, sceneContext: string): SkillContext[] {
    const skillContexts: SkillContext[] = []
    
    // Analyze each skill type
    Object.keys(this.skills).forEach(skillType => {
      const skillValue = this.calculateSkillValue(choiceText, skillType as keyof FutureSkills)
      if (skillValue > 0.3) { // Only track meaningful skill development
        const context: SkillContext = {
          sceneId: sceneContext,
          skillType: skillType as keyof FutureSkills,
          context: this.getSkillContext(skillType as keyof FutureSkills, choiceText),
          choiceText,
          skillValue,
          explanation: this.getSkillExplanation(skillType as keyof FutureSkills, skillValue)
        }
        skillContexts.push(context)
        
        // Update skill level
        this.updateSkillLevel(skillType as keyof FutureSkills, skillValue)
      }
    })

    // Add to history
    this.skillHistory.push(...skillContexts)
    
    // Keep only last 50 skill contexts
    if (this.skillHistory.length > 50) {
      this.skillHistory = this.skillHistory.slice(-50)
    }

    return skillContexts
  }

  private calculateSkillValue(choiceText: string, skillType: keyof FutureSkills): number {
    // Basic keywords for original skills - expanded skills use defaults for now
    const skillKeywords: Partial<Record<keyof FutureSkills, string[]>> = {
      criticalThinking: ['analyze', 'consider', 'evaluate', 'think', 'reason', 'logic', 'examine', 'assess'],
      communication: ['explain', 'tell', 'share', 'present', 'discuss', 'talk', 'write', 'express'],
      collaboration: ['together', 'team', 'help', 'support', 'work with', 'partner', 'collaborate', 'cooperate'],
      creativity: ['create', 'design', 'imagine', 'innovate', 'artistic', 'unique', 'original', 'creative'],
      adaptability: ['change', 'adjust', 'flexible', 'adapt', 'modify', 'shift', 'evolve', 'pivot'],
      leadership: ['lead', 'guide', 'direct', 'manage', 'organize', 'inspire', 'motivate', 'decide'],
      digitalLiteracy: ['digital', 'online', 'tech', 'computer', 'app', 'software', 'data', 'algorithm'],
      emotionalIntelligence: ['feel', 'emotion', 'empathy', 'understand', 'care', 'support', 'listen', 'comfort'],
      culturalCompetence: ['diverse', 'culture', 'community', 'different', 'inclusive', 'respect', 'background', 'heritage'],
      financialLiteracy: ['money', 'cost', 'budget', 'financial', 'salary', 'income', 'invest', 'save'],
      timeManagement: ['time', 'schedule', 'prioritize', 'deadline', 'urgent', 'plan', 'organize', 'efficient'],
      problemSolving: ['solve', 'fix', 'resolve', 'address', 'tackle', 'approach', 'strategy', 'solution']
    }

    const text = choiceText.toLowerCase()
    const keywords = skillKeywords[skillType] || []
    if (keywords.length === 0) return 0.1 // Default for new skills if not mapped

    const matches = keywords.filter(keyword => text.includes(keyword)).length
    const baseValue = Math.min(matches / keywords.length, 1)
    
    // Adjust based on text complexity and length
    const wordCount = choiceText.split(' ').length
    const complexityFactor = Math.min(wordCount / 10, 1)
    
    return Math.min(1, baseValue + (complexityFactor * 0.2))
  }

  private getSkillContext(skillType: keyof FutureSkills, _choiceText: string): string {
    const contexts: Partial<Record<keyof FutureSkills, string>> = {
      criticalThinking: 'Analyzing and evaluating information',
      communication: 'Expressing ideas and sharing information',
      collaboration: 'Working with others toward common goals',
      creativity: 'Generating new ideas and innovative solutions',
      adaptability: 'Adjusting to changing circumstances',
      leadership: 'Guiding and inspiring others',
      digitalLiteracy: 'Using technology effectively',
      emotionalIntelligence: 'Understanding and managing emotions',
      culturalCompetence: 'Working across diverse cultures',
      financialLiteracy: 'Making informed financial decisions',
      timeManagement: 'Organizing and prioritizing tasks',
      problemSolving: 'Identifying and solving challenges'
    }
    return contexts[skillType] || 'Developing important skills'
  }

  private getSkillExplanation(skillType: keyof FutureSkills, _value: number): string {
    const explanations: Partial<Record<keyof FutureSkills, string>> = {
      criticalThinking: 'You\'re developing strong analytical thinking skills that employers value.',
      communication: 'You\'re building communication skills that help in any career.',
      collaboration: 'You\'re learning to work effectively with others.',
      creativity: 'You\'re developing creative thinking that drives innovation.',
      adaptability: 'You\'re building flexibility that helps you thrive in changing workplaces.',
      leadership: 'You\'re developing leadership qualities that open career opportunities.',
      digitalLiteracy: 'You\'re building tech skills essential for the future workforce.',
      emotionalIntelligence: 'You\'re developing emotional skills that make you a great team member.',
      culturalCompetence: 'You\'re building skills to work in diverse, global workplaces.',
      financialLiteracy: 'You\'re developing financial skills that help with career decisions.',
      timeManagement: 'You\'re building organizational skills that employers need.',
      problemSolving: 'You\'re developing problem-solving abilities that are highly valued.'
    }
    return explanations[skillType] || 'You\'re building important skills for your future career.'
  }

  private updateSkillLevel(skillType: keyof FutureSkills, value: number) {
    // Gradual skill improvement with diminishing returns
    const currentValue = this.skills[skillType]
    const improvement = (value - currentValue) * 0.1 // 10% of the difference
    this.skills[skillType] = Math.min(1, Math.max(0, currentValue + improvement))
  }

  /**
   * Get career paths that match current skills
   * Returns top matches even for early-stage players (evidence-first approach)
   */
  getMatchingCareerPaths(): CareerPath2030[] {
    return this.careerPaths
      .map(path => ({
        ...path,
        matchScore: this.calculateCareerMatch(path)
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6) // Return top 6 matches, no minimum threshold
  }

  private calculateCareerMatch(careerPath: CareerPath2030): number {
    const requiredSkills = careerPath.requiredSkills
    const totalScore = requiredSkills.reduce((sum, skill) => {
      return sum + (this.skills[skill] || 0)
    }, 0)
    return totalScore / requiredSkills.length
  }

  /**
   * Get skill development prompt
   */
  getSkillPrompt(skillType: keyof FutureSkills): string | null {
    const prompts = this.skillPrompts.get(skillType)
    if (!prompts) return null
    
    // Return a random prompt for this skill type
    return prompts[Math.floor(Math.random() * prompts.length)]
  }

  /**
   * Get skills summary for career profile
   */
  getSkillsSummary(): Record<string, any> {
    const topSkills = Object.entries(this.skills)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, value]) => ({
        skill: skill.replace(/([A-Z])/g, ' $1').toLowerCase().trim(),
        value: Math.round(value * 100),
        level: value > 0.8 ? 'Advanced' : value > 0.6 ? 'Intermediate' : 'Developing'
      }))

    const developingSkills = Object.entries(this.skills)
      .filter(([, value]) => value < 0.6)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([skill, value]) => ({
        skill: skill.replace(/([A-Z])/g, ' $1').toLowerCase().trim(),
        value: Math.round(value * 100)
      }))

    return {
      topSkills,
      developingSkills,
      overallLevel: this.getOverallSkillLevel(),
      careerReadiness: this.calculateCareerReadiness()
    }
  }

  private getOverallSkillLevel(): string {
    const avgSkill = Object.values(this.skills).reduce((sum, skill) => sum + skill, 0) / Object.keys(this.skills).length
    if (avgSkill > 0.8) return 'Advanced'
    if (avgSkill > 0.6) return 'Intermediate'
    if (avgSkill > 0.4) return 'Developing'
    return 'Beginning'
  }

  private calculateCareerReadiness(): number {
    const avgSkill = Object.values(this.skills).reduce((sum, skill) => sum + skill, 0) / Object.keys(this.skills).length
    return Math.round(avgSkill * 100)
  }

  /**
   * Get current skills
   */
  getSkills(): FutureSkills {
    return { ...this.skills }
  }

  /**
   * Reset skills
   */
  reset() {
    // Reset to default
    const defaultSkill = 0.5
    // @ts-expect-error - Efficient reset using dynamic key access
    Object.keys(this.skills).forEach(key => this.skills[key] = defaultSkill)
    this.skillHistory = []
  }
}

// Singleton instance
let futureSkillsSystem: FutureSkillsSystem | null = null

export function getFutureSkillsSystem(): FutureSkillsSystem {
  if (!futureSkillsSystem) {
    futureSkillsSystem = new FutureSkillsSystem()
  }
  return futureSkillsSystem
}