/**
 * Developmental Psychology System for Limbic Learning
 * Supports identity formation and cultural responsiveness for Birmingham youth
 */

export interface IdentityState {
  identityExploration: 'early' | 'active' | 'crystallizing' | 'committed'
  selfConcept: 'fragmented' | 'developing' | 'coherent' | 'integrated'
  culturalIdentity: 'unexplored' | 'questioning' | 'exploring' | 'affirmed'
  careerIdentity: 'unclear' | 'exploring' | 'narrowing' | 'focused'
  socialIdentity: 'isolated' | 'connecting' | 'belonging' | 'contributing'
  futureOrientation: 'present' | 'near' | 'distant' | 'integrated'
}

export interface CulturalContext {
  culturalValues: string[]
  communityConnections: number // 0-1 scale
  familyInfluence: number // 0-1 scale
  peerInfluence: number // 0-1 scale
  institutionalSupport: number // 0-1 scale
  economicFactors: number // 0-1 scale
  educationalBackground: number // 0-1 scale
  languagePreference: 'formal' | 'casual' | 'mixed' | 'adaptive'
}

export interface DevelopmentalMetrics {
  identityCommitment: number // 0-1 scale
  explorationDepth: number // 0-1 scale
  culturalAwareness: number // 0-1 scale
  futurePlanning: number // 0-1 scale
  socialConnection: number // 0-1 scale
  selfEfficacy: number // 0-1 scale
  resilience: number // 0-1 scale
  purpose: number // 0-1 scale
}

export interface YouthDevelopmentIndicators {
  autonomy: number // 0-1 scale
  competence: number // 0-1 scale
  relatedness: number // 0-1 scale
  purpose: number // 0-1 scale
  hope: number // 0-1 scale
  belonging: number // 0-1 scale
  agency: number // 0-1 scale
  meaning: number // 0-1 scale
}

export class DevelopmentalPsychologySystem {
  private identityState: IdentityState
  private culturalContext: CulturalContext
  private developmentalHistory: DevelopmentalMetrics[]
  private youthDevelopmentHistory: YouthDevelopmentIndicators[]
  private identityPrompts: Map<string, string[]> = new Map()
  private culturalPrompts: Map<string, string[]> = new Map()

  constructor() {
    this.identityState = {
      identityExploration: 'early',
      selfConcept: 'fragmented',
      culturalIdentity: 'unexplored',
      careerIdentity: 'unclear',
      socialIdentity: 'isolated',
      futureOrientation: 'present'
    }
    
    this.culturalContext = {
      culturalValues: ['community', 'family', 'resilience', 'creativity'],
      communityConnections: 0.5,
      familyInfluence: 0.7,
      peerInfluence: 0.6,
      institutionalSupport: 0.4,
      economicFactors: 0.3,
      educationalBackground: 0.5,
      languagePreference: 'adaptive'
    }
    
    this.developmentalHistory = []
    this.youthDevelopmentHistory = []
    this.initializePrompts()
  }

  private initializePrompts() {
    // Identity formation prompts
    this.identityPrompts = new Map([
      ['exploration', [
        "What feels most like you right now?",
        "What would you like to discover about yourself?",
        "What interests you most?",
        "What feels authentic to you?"
      ]],
      ['commitment', [
        "What do you value most?",
        "What would you stand up for?",
        "What feels worth your time and energy?",
        "What matters to you?"
      ]],
      ['integration', [
        "How do you want to be known?",
        "What legacy do you want to leave?",
        "How do you want to contribute?",
        "What's your vision for yourself?"
      ]]
    ])

    // Cultural responsiveness prompts
    this.culturalPrompts = new Map([
      ['community', [
        "How do you want to contribute to your community?",
        "What does your community need?",
        "How can you help others?",
        "What would make your community stronger?"
      ]],
      ['family', [
        "What would make your family proud?",
        "How do you want to honor your family?",
        "What traditions matter to you?",
        "How do you want to give back?"
      ]],
      ['identity', [
        "What makes you unique?",
        "What stories do you want to tell?",
        "How do you want to be remembered?",
        "What's your superpower?"
      ]]
    ])
  }

  /**
   * Analyze developmental metrics and update identity state
   */
  analyzeDevelopmentalMetrics(metrics: DevelopmentalMetrics): IdentityState {
    this.developmentalHistory.push(metrics)
    
    // Keep only last 20 interactions
    if (this.developmentalHistory.length > 20) {
      this.developmentalHistory = this.developmentalHistory.slice(-20)
    }

    // Update identity exploration
    this.updateIdentityExploration(metrics)
    
    // Update self-concept
    this.updateSelfConcept(metrics)
    
    // Update cultural identity
    this.updateCulturalIdentity(metrics)
    
    // Update career identity
    this.updateCareerIdentity(metrics)
    
    // Update social identity
    this.updateSocialIdentity(metrics)
    
    // Update future orientation
    this.updateFutureOrientation(metrics)

    return { ...this.identityState }
  }

  private updateIdentityExploration(metrics: DevelopmentalMetrics) {
    const recentMetrics = this.developmentalHistory.slice(-5)
    const avgExploration = recentMetrics.reduce((sum, m) => sum + m.explorationDepth, 0) / recentMetrics.length
    const avgCommitment = recentMetrics.reduce((sum, m) => sum + m.identityCommitment, 0) / recentMetrics.length
    
    if (avgCommitment > 0.7) {
      this.identityState.identityExploration = 'committed'
    } else if (avgExploration > 0.6) {
      this.identityState.identityExploration = 'crystallizing'
    } else if (avgExploration > 0.3) {
      this.identityState.identityExploration = 'active'
    } else {
      this.identityState.identityExploration = 'early'
    }
  }

  private updateSelfConcept(metrics: DevelopmentalMetrics) {
    const recentMetrics = this.developmentalHistory.slice(-5)
    const avgSelfEfficacy = recentMetrics.reduce((sum, m) => sum + m.selfEfficacy, 0) / recentMetrics.length
    const avgPurpose = recentMetrics.reduce((sum, m) => sum + m.purpose, 0) / recentMetrics.length
    
    const coherenceScore = (avgSelfEfficacy + avgPurpose) / 2
    
    if (coherenceScore > 0.8) {
      this.identityState.selfConcept = 'integrated'
    } else if (coherenceScore > 0.6) {
      this.identityState.selfConcept = 'coherent'
    } else if (coherenceScore > 0.3) {
      this.identityState.selfConcept = 'developing'
    } else {
      this.identityState.selfConcept = 'fragmented'
    }
  }

  private updateCulturalIdentity(metrics: DevelopmentalMetrics) {
    const recentMetrics = this.developmentalHistory.slice(-5)
    const avgCulturalAwareness = recentMetrics.reduce((sum, m) => sum + m.culturalAwareness, 0) / recentMetrics.length
    
    if (avgCulturalAwareness > 0.7) {
      this.identityState.culturalIdentity = 'affirmed'
    } else if (avgCulturalAwareness > 0.5) {
      this.identityState.culturalIdentity = 'exploring'
    } else if (avgCulturalAwareness > 0.2) {
      this.identityState.culturalIdentity = 'questioning'
    } else {
      this.identityState.culturalIdentity = 'unexplored'
    }
  }

  private updateCareerIdentity(metrics: DevelopmentalMetrics) {
    const recentMetrics = this.developmentalHistory.slice(-5)
    const avgPurpose = recentMetrics.reduce((sum, m) => sum + m.purpose, 0) / recentMetrics.length
    const avgFuturePlanning = recentMetrics.reduce((sum, m) => sum + m.futurePlanning, 0) / recentMetrics.length
    
    const careerClarity = (avgPurpose + avgFuturePlanning) / 2
    
    if (careerClarity > 0.7) {
      this.identityState.careerIdentity = 'focused'
    } else if (careerClarity > 0.5) {
      this.identityState.careerIdentity = 'narrowing'
    } else if (careerClarity > 0.2) {
      this.identityState.careerIdentity = 'exploring'
    } else {
      this.identityState.careerIdentity = 'unclear'
    }
  }

  private updateSocialIdentity(metrics: DevelopmentalMetrics) {
    const recentMetrics = this.developmentalHistory.slice(-5)
    const avgSocialConnection = recentMetrics.reduce((sum, m) => sum + m.socialConnection, 0) / recentMetrics.length
    
    if (avgSocialConnection > 0.7) {
      this.identityState.socialIdentity = 'contributing'
    } else if (avgSocialConnection > 0.5) {
      this.identityState.socialIdentity = 'belonging'
    } else if (avgSocialConnection > 0.2) {
      this.identityState.socialIdentity = 'connecting'
    } else {
      this.identityState.socialIdentity = 'isolated'
    }
  }

  private updateFutureOrientation(metrics: DevelopmentalMetrics) {
    const recentMetrics = this.developmentalHistory.slice(-5)
    const avgFuturePlanning = recentMetrics.reduce((sum, m) => sum + m.futurePlanning, 0) / recentMetrics.length
    const avgPurpose = recentMetrics.reduce((sum, m) => sum + m.purpose, 0) / recentMetrics.length
    
    const futureIntegration = (avgFuturePlanning + avgPurpose) / 2
    
    if (futureIntegration > 0.7) {
      this.identityState.futureOrientation = 'integrated'
    } else if (futureIntegration > 0.5) {
      this.identityState.futureOrientation = 'distant'
    } else if (futureIntegration > 0.2) {
      this.identityState.futureOrientation = 'near'
    } else {
      this.identityState.futureOrientation = 'present'
    }
  }

  /**
   * Get appropriate identity formation prompt
   */
  getIdentityPrompt(): string | null {
    const prompts = this.identityPrompts.get('exploration') || []
    
    // Adjust prompt based on identity state
    if (this.identityState.identityExploration === 'committed') {
      const commitmentPrompts = this.identityPrompts.get('commitment') || []
      return commitmentPrompts[Math.floor(Math.random() * commitmentPrompts.length)]
    } else if (this.identityState.identityExploration === 'crystallizing') {
      const integrationPrompts = this.identityPrompts.get('integration') || []
      return integrationPrompts[Math.floor(Math.random() * integrationPrompts.length)]
    } else {
      return prompts[Math.floor(Math.random() * prompts.length)]
    }
  }

  /**
   * Get cultural responsiveness prompt
   */
  getCulturalPrompt(): string | null {
    const prompts = this.culturalPrompts.get('community') || []
    
    // Adjust prompt based on cultural identity state
    if (this.identityState.culturalIdentity === 'affirmed') {
      const identityPrompts = this.culturalPrompts.get('identity') || []
      return identityPrompts[Math.floor(Math.random() * identityPrompts.length)]
    } else if (this.identityState.culturalIdentity === 'exploring') {
      const familyPrompts = this.culturalPrompts.get('family') || []
      return familyPrompts[Math.floor(Math.random() * familyPrompts.length)]
    } else {
      return prompts[Math.floor(Math.random() * prompts.length)]
    }
  }

  /**
   * Get youth development support
   */
  getYouthDevelopmentSupport(): Record<string, any> {
    const support: Record<string, any> = {}

    // Autonomy support
    if (this.identityState.identityExploration === 'early') {
      support.autonomySupport = true
      support.choiceExpansion = "What would you like to explore?"
      support.selfDirection = "You're in charge of your journey."
    }

    // Competence support
    if (this.identityState.selfConcept === 'fragmented') {
      support.competenceSupport = true
      support.skillBuilding = "Let's build on what you're good at."
      support.achievementRecognition = "You're making great progress!"
    }

    // Relatedness support
    if (this.identityState.socialIdentity === 'isolated') {
      support.relatednessSupport = true
      support.connectionBuilding = "How do you want to connect with others?"
      support.communityFocus = "What does your community need?"
    }

    // Purpose support
    if (this.identityState.careerIdentity === 'unclear') {
      support.purposeSupport = true
      support.meaningMaking = "What gives your life meaning?"
      support.contributionFocus = "How do you want to make a difference?"
    }

    return support
  }

  /**
   * Get cultural responsiveness adaptations
   */
  getCulturalAdaptations(): Record<string, any> {
    const adaptations: Record<string, any> = {}

    // Language adaptations
    switch (this.culturalContext.languagePreference) {
      case 'formal':
        adaptations.formalLanguage = true
        adaptations.professionalTone = true
        break
      case 'casual':
        adaptations.casualLanguage = true
        adaptations.conversationalTone = true
        break
      case 'mixed':
        adaptations.adaptiveLanguage = true
        adaptations.contextualTone = true
        break
      case 'adaptive':
        adaptations.dynamicLanguage = true
        adaptations.responsiveTone = true
        break
    }

    // Cultural value integration
    if (this.culturalContext.culturalValues.includes('community')) {
      adaptations.communityFocus = true
      adaptations.collectiveValues = true
    }
    if (this.culturalContext.culturalValues.includes('family')) {
      adaptations.familyHonor = true
      adaptations.intergenerationalValues = true
    }
    if (this.culturalContext.culturalValues.includes('resilience')) {
      adaptations.resilienceBuilding = true
      adaptations.strengthFocus = true
    }
    if (this.culturalContext.culturalValues.includes('creativity')) {
      adaptations.creativeExpression = true
      adaptations.innovationFocus = true
    }

    return adaptations
  }

  /**
   * Get identity formation scaffolding
   */
  getIdentityScaffolding(): Record<string, any> {
    const scaffolding: Record<string, any> = {}

    // Exploration scaffolding
    if (this.identityState.identityExploration === 'early') {
      scaffolding.explorationSupport = true
      scaffolding.curiosityEncouragement = "What interests you most?"
      scaffolding.safeExploration = "There are no wrong answers here."
    }

    // Commitment scaffolding
    if (this.identityState.identityExploration === 'crystallizing') {
      scaffolding.commitmentSupport = true
      scaffolding.valueClarification = "What do you value most?"
      scaffolding.decisionSupport = "Trust your instincts."
    }

    // Integration scaffolding
    if (this.identityState.identityExploration === 'committed') {
      scaffolding.integrationSupport = true
      scaffolding.legacyBuilding = "How do you want to be remembered?"
      scaffolding.contributionFocus = "How do you want to contribute?"
    }

    return scaffolding
  }

  /**
   * Reset developmental state
   */
  reset() {
    this.identityState = {
      identityExploration: 'early',
      selfConcept: 'fragmented',
      culturalIdentity: 'unexplored',
      careerIdentity: 'unclear',
      socialIdentity: 'isolated',
      futureOrientation: 'present'
    }
    this.developmentalHistory = []
    this.youthDevelopmentHistory = []
  }

  /**
   * Get current identity state
   */
  getIdentityState(): IdentityState {
    return { ...this.identityState }
  }

  /**
   * Get current cultural context
   */
  getCulturalContext(): CulturalContext {
    return { ...this.culturalContext }
  }
}

// Singleton instance
let developmentalPsychologySystem: DevelopmentalPsychologySystem | null = null

export function getDevelopmentalPsychologySystem(): DevelopmentalPsychologySystem {
  if (!developmentalPsychologySystem) {
    developmentalPsychologySystem = new DevelopmentalPsychologySystem()
  }
  return developmentalPsychologySystem
}
