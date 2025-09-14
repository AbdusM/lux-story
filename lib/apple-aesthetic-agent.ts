/**
 * The Guardian of Beauty - Apple Aesthetic Agent
 * The fifth and most crucial pillar of Apple design ethos
 * Ensures the product is not just usable, but *desirable*
 */

export interface AestheticAssessment {
  stillLifeTest: {
    score: number // 0-10
    issues: string[]
    strengths: string[]
  }
  materialHonesty: {
    score: number // 0-10
    issues: string[]
    strengths: string[]
  }
  typographyAsArt: {
    score: number // 0-10
    issues: string[]
    strengths: string[]
  }
  colorAsAtmosphere: {
    score: number // 0-10
    issues: string[]
    strengths: string[]
  }
  soulQuestion: {
    score: number // 0-10
    issues: string[]
    strengths: string[]
  }
  overallBeauty: number // 0-10
}

export interface ScreenComposition {
  screenId: string
  name: string
  balance: 'harmonious' | 'unbalanced' | 'chaotic'
  hierarchy: 'clear' | 'confused' | 'missing'
  whitespace: 'generous' | 'adequate' | 'cramped'
  visualWeight: 'balanced' | 'top-heavy' | 'bottom-heavy' | 'left-heavy' | 'right-heavy'
  colorHarmony: 'sophisticated' | 'functional' | 'jarring'
  typographyFlow: 'elegant' | 'readable' | 'awkward'
  aestheticPleasure: number // 0-10
}

export interface DigitalMaterial {
  shadows: 'authentic' | 'generic' | 'missing'
  gradients: 'deliberate' | 'cheap' | 'overused'
  transparencies: 'purposeful' | 'gimmicky' | 'excessive'
  borders: 'refined' | 'harsh' | 'inconsistent'
  spacing: 'breathing' | 'adequate' | 'cramped'
  overallQuality: 'premium' | 'standard' | 'cheap'
}

export interface TypographyArt {
  character: 'distinctive' | 'generic' | 'inconsistent'
  hierarchy: 'elegant' | 'functional' | 'confusing'
  spacing: 'breathing' | 'adequate' | 'cramped'
  rhythm: 'musical' | 'mechanical' | 'broken'
  personality: 'confident' | 'safe' | 'timid'
}

export interface ColorAtmosphere {
  palette: 'sophisticated' | 'functional' | 'garish'
  mood: 'enhancing' | 'neutral' | 'detracting'
  consistency: 'cohesive' | 'inconsistent' | 'chaotic'
  accessibility: 'inclusive' | 'adequate' | 'exclusive'
  narrativeFit: 'perfect' | 'adequate' | 'mismatched'
}

export interface SoulAssessment {
  pointOfView: 'confident' | 'uncertain' | 'missing'
  personality: 'distinctive' | 'generic' | 'bland'
  confidence: 'bold' | 'safe' | 'timid'
  authenticity: 'genuine' | 'manufactured' | 'fake'
  emotionalResonance: 'powerful' | 'mild' | 'absent'
}

export class AppleAestheticAgent {
  private screenCompositions: Map<string, ScreenComposition>
  private digitalMaterials: Map<string, DigitalMaterial>
  private typographyArt: Map<string, TypographyArt>
  private colorAtmosphere: Map<string, ColorAtmosphere>
  private soulAssessments: Map<string, SoulAssessment>

  constructor() {
    this.screenCompositions = new Map()
    this.digitalMaterials = new Map()
    this.typographyArt = new Map()
    this.colorAtmosphere = new Map()
    this.soulAssessments = new Map()
    this.initializeAssessments()
  }

  private initializeAssessments() {
    // Screen Composition Analysis
    this.screenCompositions.set('game-interface', {
      screenId: 'game-interface',
      name: 'Main Game Interface',
      balance: 'unbalanced',
      hierarchy: 'confused',
      whitespace: 'cramped',
      visualWeight: 'top-heavy',
      colorHarmony: 'functional',
      typographyFlow: 'readable',
      aestheticPleasure: 4
    })

    this.screenCompositions.set('story-message', {
      screenId: 'story-message',
      name: 'Story Message Display',
      balance: 'harmonious',
      hierarchy: 'clear',
      whitespace: 'generous',
      visualWeight: 'balanced',
      colorHarmony: 'sophisticated',
      typographyFlow: 'elegant',
      aestheticPleasure: 7
    })

    this.screenCompositions.set('choice-buttons', {
      screenId: 'choice-buttons',
      name: 'Choice Buttons',
      balance: 'unbalanced',
      hierarchy: 'confused',
      whitespace: 'cramped',
      visualWeight: 'bottom-heavy',
      colorHarmony: 'functional',
      typographyFlow: 'awkward',
      aestheticPleasure: 3
    })

    // Digital Material Analysis
    this.digitalMaterials.set('pokemon-interface', {
      shadows: 'generic',
      gradients: 'overused',
      transparencies: 'gimmicky',
      borders: 'harsh',
      spacing: 'cramped',
      overallQuality: 'standard'
    })

    this.digitalMaterials.set('enhanced-ui', {
      shadows: 'authentic',
      gradients: 'deliberate',
      transparencies: 'purposeful',
      borders: 'refined',
      spacing: 'breathing',
      overallQuality: 'premium'
    })

    // Typography Art Analysis
    this.typographyArt.set('main-text', {
      character: 'generic',
      hierarchy: 'functional',
      spacing: 'adequate',
      rhythm: 'mechanical',
      personality: 'safe'
    })

    this.typographyArt.set('pokemon-text', {
      character: 'distinctive',
      hierarchy: 'elegant',
      spacing: 'breathing',
      rhythm: 'musical',
      personality: 'confident'
    })

    // Color Atmosphere Analysis
    this.colorAtmosphere.set('current-palette', {
      palette: 'functional',
      mood: 'neutral',
      consistency: 'inconsistent',
      accessibility: 'adequate',
      narrativeFit: 'adequate'
    })

    this.colorAtmosphere.set('birmingham-theme', {
      palette: 'sophisticated',
      mood: 'enhancing',
      consistency: 'cohesive',
      accessibility: 'inclusive',
      narrativeFit: 'perfect'
    })

    // Soul Assessment
    this.soulAssessments.set('overall-design', {
      pointOfView: 'uncertain',
      personality: 'generic',
      confidence: 'safe',
      authenticity: 'manufactured',
      emotionalResonance: 'mild'
    })
  }

  /**
   * The "Still Life" Test - Is each screen a well-composed piece of graphic design?
   */
  assessStillLifeTest(screenId: string): { score: number; issues: string[]; strengths: string[] } {
    const composition = this.screenCompositions.get(screenId)
    if (!composition) {
      return { score: 0, issues: ['Screen not found'], strengths: [] }
    }

    const issues: string[] = []
    const strengths: string[] = []
    let score = 0

    // Balance assessment
    if (composition.balance === 'harmonious') {
      score += 2
      strengths.push('Harmonious visual balance')
    } else if (composition.balance === 'unbalanced') {
      score += 1
      issues.push('Visual balance needs improvement')
    } else {
      issues.push('Chaotic visual composition')
    }

    // Hierarchy assessment
    if (composition.hierarchy === 'clear') {
      score += 2
      strengths.push('Clear visual hierarchy')
    } else if (composition.hierarchy === 'confused') {
      score += 1
      issues.push('Confusing visual hierarchy')
    } else {
      issues.push('Missing visual hierarchy')
    }

    // Whitespace assessment
    if (composition.whitespace === 'generous') {
      score += 2
      strengths.push('Generous whitespace creates breathing room')
    } else if (composition.whitespace === 'adequate') {
      score += 1
    } else {
      issues.push('Cramped layout needs more whitespace')
    }

    // Visual weight assessment
    if (composition.visualWeight === 'balanced') {
      score += 2
      strengths.push('Balanced visual weight distribution')
    } else {
      score += 1
      issues.push(`Unbalanced visual weight: ${composition.visualWeight}`)
    }

    // Color harmony assessment
    if (composition.colorHarmony === 'sophisticated') {
      score += 2
      strengths.push('Sophisticated color harmony')
    } else if (composition.colorHarmony === 'functional') {
      score += 1
      issues.push('Color palette is functional but not sophisticated')
    } else {
      issues.push('Jarring color combinations')
    }

    return { score, issues, strengths }
  }

  /**
   * Material Honesty - Do digital materials feel authentic and high-quality?
   */
  assessMaterialHonesty(materialId: string): { score: number; issues: string[]; strengths: string[] } {
    const material = this.digitalMaterials.get(materialId)
    if (!material) {
      return { score: 0, issues: ['Material not found'], strengths: [] }
    }

    const issues: string[] = []
    const strengths: string[] = []
    let score = 0

    // Shadow assessment
    if (material.shadows === 'authentic') {
      score += 2
      strengths.push('Authentic shadow rendering')
    } else if (material.shadows === 'generic') {
      score += 1
      issues.push('Generic shadow effects')
    } else {
      issues.push('Missing shadow depth')
    }

    // Gradient assessment
    if (material.gradients === 'deliberate') {
      score += 2
      strengths.push('Deliberate gradient usage')
    } else if (material.gradients === 'cheap') {
      score += 1
      issues.push('Cheap gradient effects')
    } else {
      issues.push('Overused gradients')
    }

    // Transparency assessment
    if (material.transparencies === 'purposeful') {
      score += 2
      strengths.push('Purposeful transparency effects')
    } else if (material.transparencies === 'gimmicky') {
      score += 1
      issues.push('Gimmicky transparency effects')
    } else {
      issues.push('Excessive transparency usage')
    }

    // Border assessment
    if (material.borders === 'refined') {
      score += 2
      strengths.push('Refined border treatment')
    } else if (material.borders === 'harsh') {
      score += 1
      issues.push('Harsh border treatment')
    } else {
      issues.push('Inconsistent border styling')
    }

    // Spacing assessment
    if (material.spacing === 'breathing') {
      score += 2
      strengths.push('Breathing room in spacing')
    } else if (material.spacing === 'adequate') {
      score += 1
    } else {
      issues.push('Cramped spacing needs improvement')
    }

    return { score, issues, strengths }
  }

  /**
   * Typography as Art - Does typography have character and create beautiful text blocks?
   */
  assessTypographyArt(typographyId: string): { score: number; issues: string[]; strengths: string[] } {
    const typography = this.typographyArt.get(typographyId)
    if (!typography) {
      return { score: 0, issues: ['Typography not found'], strengths: [] }
    }

    const issues: string[] = []
    const strengths: string[] = []
    let score = 0

    // Character assessment
    if (typography.character === 'distinctive') {
      score += 2
      strengths.push('Distinctive typographic character')
    } else if (typography.character === 'generic') {
      score += 1
      issues.push('Generic typography lacks character')
    } else {
      issues.push('Inconsistent typographic character')
    }

    // Hierarchy assessment
    if (typography.hierarchy === 'elegant') {
      score += 2
      strengths.push('Elegant typographic hierarchy')
    } else if (typography.hierarchy === 'functional') {
      score += 1
      issues.push('Functional but not elegant hierarchy')
    } else {
      issues.push('Confusing typographic hierarchy')
    }

    // Spacing assessment
    if (typography.spacing === 'breathing') {
      score += 2
      strengths.push('Breathing typographic spacing')
    } else if (typography.spacing === 'adequate') {
      score += 1
    } else {
      issues.push('Cramped typographic spacing')
    }

    // Rhythm assessment
    if (typography.rhythm === 'musical') {
      score += 2
      strengths.push('Musical typographic rhythm')
    } else if (typography.rhythm === 'mechanical') {
      score += 1
      issues.push('Mechanical typographic rhythm')
    } else {
      issues.push('Broken typographic rhythm')
    }

    // Personality assessment
    if (typography.personality === 'confident') {
      score += 2
      strengths.push('Confident typographic personality')
    } else if (typography.personality === 'safe') {
      score += 1
      issues.push('Safe but uninspiring typography')
    } else {
      issues.push('Timid typography lacks confidence')
    }

    return { score, issues, strengths }
  }

  /**
   * Color as Atmosphere - Does color palette create sophisticated mood?
   */
  assessColorAtmosphere(colorId: string): { score: number; issues: string[]; strengths: string[] } {
    const color = this.colorAtmosphere.get(colorId)
    if (!color) {
      return { score: 0, issues: ['Color not found'], strengths: [] }
    }

    const issues: string[] = []
    const strengths: string[] = []
    let score = 0

    // Palette assessment
    if (color.palette === 'sophisticated') {
      score += 2
      strengths.push('Sophisticated color palette')
    } else if (color.palette === 'functional') {
      score += 1
      issues.push('Functional but not sophisticated palette')
    } else {
      issues.push('Garish color palette')
    }

    // Mood assessment
    if (color.mood === 'enhancing') {
      score += 2
      strengths.push('Color enhances narrative mood')
    } else if (color.mood === 'neutral') {
      score += 1
      issues.push('Color palette is neutral but not enhancing')
    } else {
      issues.push('Color palette detracts from experience')
    }

    // Consistency assessment
    if (color.consistency === 'cohesive') {
      score += 2
      strengths.push('Cohesive color consistency')
    } else if (color.consistency === 'inconsistent') {
      score += 1
      issues.push('Inconsistent color usage')
    } else {
      issues.push('Chaotic color application')
    }

    // Accessibility assessment
    if (color.accessibility === 'inclusive') {
      score += 2
      strengths.push('Inclusive color accessibility')
    } else if (color.accessibility === 'adequate') {
      score += 1
      issues.push('Adequate but not inclusive color accessibility')
    } else {
      issues.push('Poor color accessibility')
    }

    // Narrative fit assessment
    if (color.narrativeFit === 'perfect') {
      score += 2
      strengths.push('Perfect color-narrative alignment')
    } else if (color.narrativeFit === 'adequate') {
      score += 1
      issues.push('Adequate color-narrative fit')
    } else {
      issues.push('Color palette mismatched with narrative')
    }

    return { score, issues, strengths }
  }

  /**
   * The "Soul" Question - Does this design have a point of view and confidence?
   */
  assessSoul(soulId: string): { score: number; issues: string[]; strengths: string[] } {
    const soul = this.soulAssessments.get(soulId)
    if (!soul) {
      return { score: 0, issues: ['Soul assessment not found'], strengths: [] }
    }

    const issues: string[] = []
    const strengths: string[] = []
    let score = 0

    // Point of view assessment
    if (soul.pointOfView === 'confident') {
      score += 2
      strengths.push('Confident design point of view')
    } else if (soul.pointOfView === 'uncertain') {
      score += 1
      issues.push('Uncertain design point of view')
    } else {
      issues.push('Missing design point of view')
    }

    // Personality assessment
    if (soul.personality === 'distinctive') {
      score += 2
      strengths.push('Distinctive design personality')
    } else if (soul.personality === 'generic') {
      score += 1
      issues.push('Generic design personality')
    } else {
      issues.push('Bland design personality')
    }

    // Confidence assessment
    if (soul.confidence === 'bold') {
      score += 2
      strengths.push('Bold design confidence')
    } else if (soul.confidence === 'safe') {
      score += 1
      issues.push('Safe but uninspiring design')
    } else {
      issues.push('Timid design lacks confidence')
    }

    // Authenticity assessment
    if (soul.authenticity === 'genuine') {
      score += 2
      strengths.push('Genuine design authenticity')
    } else if (soul.authenticity === 'manufactured') {
      score += 1
      issues.push('Manufactured design feel')
    } else {
      issues.push('Fake design authenticity')
    }

    // Emotional resonance assessment
    if (soul.emotionalResonance === 'powerful') {
      score += 2
      strengths.push('Powerful emotional resonance')
    } else if (soul.emotionalResonance === 'mild') {
      score += 1
      issues.push('Mild emotional resonance')
    } else {
      issues.push('Absent emotional resonance')
    }

    return { score, issues, strengths }
  }

  /**
   * Generate comprehensive aesthetic assessment
   */
  generateAestheticAssessment(): AestheticAssessment {
    const stillLifeTest = this.assessStillLifeTest('game-interface')
    const materialHonesty = this.assessMaterialHonesty('pokemon-interface')
    const typographyAsArt = this.assessTypographyArt('main-text')
    const colorAsAtmosphere = this.assessColorAtmosphere('current-palette')
    const soulQuestion = this.assessSoul('overall-design')

    const overallBeauty = Math.round(
      (stillLifeTest.score + materialHonesty.score + typographyAsArt.score + 
       colorAsAtmosphere.score + soulQuestion.score) / 5
    )

    return {
      stillLifeTest,
      materialHonesty,
      typographyAsArt,
      colorAsAtmosphere,
      soulQuestion,
      overallBeauty
    }
  }

  /**
   * Get Apple-level design recommendations
   */
  getAppleLevelRecommendations(): string[] {
    return [
      'Implement sophisticated color palette with Birmingham-specific mood',
      'Create breathing room with generous whitespace and refined spacing',
      'Develop distinctive typographic character with musical rhythm',
      'Establish confident design point of view with authentic personality',
      'Enhance digital materials with authentic shadows and deliberate gradients',
      'Create harmonious visual balance with clear hierarchy',
      'Build emotional resonance through purposeful aesthetic choices',
      'Ensure inclusive accessibility while maintaining sophisticated design',
      'Develop cohesive design language that tells Birmingham\'s story',
      'Create premium feel through attention to every detail'
    ]
  }

  /**
   * Get critical aesthetic issues
   */
  getCriticalAestheticIssues(): string[] {
    return [
      'Visual hierarchy is confused and needs clarification',
      'Color palette is functional but not sophisticated',
      'Typography lacks distinctive character and personality',
      'Design point of view is uncertain and needs confidence',
      'Whitespace is cramped and needs breathing room',
      'Digital materials feel generic rather than authentic',
      'Overall aesthetic pleasure is low (4/10)',
      'Missing emotional resonance and soul',
      'Inconsistent design language across components',
      'Safe design choices lack boldness and confidence'
    ]
  }

  /**
   * Get aesthetic strengths to preserve
   */
  getAestheticStrengths(): string[] {
    return [
      'Pokemon-style interface has distinctive character',
      'Enhanced UI components show premium quality',
      'Story message display has elegant typography',
      'Birmingham theme shows narrative alignment',
      'Some components demonstrate breathing room',
      'Typography rhythm shows musical quality in places',
      'Color consistency exists in some areas',
      'Authentic shadow rendering in enhanced components',
      'Purposeful transparency effects in some areas',
      'Refined border treatment in enhanced UI'
    ]
  }
}

// Singleton instance
let appleAestheticAgent: AppleAestheticAgent | null = null

export function getAppleAestheticAgent(): AppleAestheticAgent {
  if (!appleAestheticAgent) {
    appleAestheticAgent = new AppleAestheticAgent()
  }
  return appleAestheticAgent
}
