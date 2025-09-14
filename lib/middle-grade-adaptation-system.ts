/**
 * Middle-Grade Adaptation System for Birmingham Youth Career Exploration
 * Based on Ember Orchard evaluation principles for ages 9-13 (adapted for 16-24)
 * Focuses on clarity, age-appropriateness, and learning transfer
 */

export interface MiddleGradeAdaptation {
  languageLevel: 'simple' | 'intermediate' | 'complex'
  concreteExamples: string[]
  familiarContexts: string[]
  feedbackStyle: 'strength-need-next' | 'growth-mindset' | 'contextual'
  reflectionPrompts: string[]
  engagementLoops: {
    micro: string // immediate read->choose->feedback
    macro: string // long-term progression
  }
}

export interface AgeAppropriateFeedback {
  strength: string
  need: string
  nextStep: string
  context: string
  motivational: string
}

export interface ReflectionPrompt {
  id: string
  question: string
  scaffolding: string[]
  context: string
  metacognitive: boolean
}

export interface EngagementLoop {
  type: 'micro' | 'macro'
  trigger: string
  reward: string
  progression: string
}

export class MiddleGradeAdaptationSystem {
  private adaptations: Map<string, MiddleGradeAdaptation>
  private feedbackTemplates: Map<string, AgeAppropriateFeedback>
  private reflectionPrompts: Map<string, ReflectionPrompt>
  private engagementLoops: Map<string, EngagementLoop>

  constructor() {
    this.adaptations = new Map()
    this.feedbackTemplates = new Map()
    this.reflectionPrompts = new Map()
    this.engagementLoops = new Map()
    this.initializeAdaptations()
    this.initializeFeedbackTemplates()
    this.initializeReflectionPrompts()
    this.initializeEngagementLoops()
  }

  private initializeAdaptations() {
    // Language level adaptations for Birmingham youth
    this.adaptations.set('language', {
      languageLevel: 'intermediate',
      concreteExamples: [
        'like working at Target',
        'like your phone bill',
        'like community college',
        'like helping your family',
        'like Birmingham neighborhoods'
      ],
      familiarContexts: [
        'Birmingham neighborhoods',
        'community college',
        'part-time jobs',
        'family responsibilities',
        'local businesses',
        'UAB campus',
        'Innovation Depot'
      ],
      feedbackStyle: 'strength-need-next',
      reflectionPrompts: [
        'What was the easiest part of this choice?',
        'What was the hardest part?',
        'What would you do differently next time?',
        'How does this connect to your real life?'
      ],
      engagementLoops: {
        micro: 'read choice -> make decision -> get feedback -> see consequence',
        macro: 'complete chapter -> unlock new career path -> build skills -> see progress'
      }
    })

    // Career exploration adaptations
    this.adaptations.set('career', {
      languageLevel: 'simple',
      concreteExamples: [
        'like a nurse helping patients',
        'like a construction worker building houses',
        'like a tech person fixing computers',
        'like a teacher helping students'
      ],
      familiarContexts: [
        'Birmingham hospitals',
        'local construction sites',
        'tech companies downtown',
        'schools in your neighborhood',
        'family members\' jobs',
        'jobs you see around town'
      ],
      feedbackStyle: 'growth-mindset',
      reflectionPrompts: [
        'What job sounds most interesting to you?',
        'What skills do you already have for this?',
        'What would you need to learn?',
        'Who do you know who does this kind of work?'
      ],
      engagementLoops: {
        micro: 'explore career -> learn about skills -> see salary -> plan next steps',
        macro: 'discover interests -> build skills -> find opportunities -> take action'
      }
    })

    // Skills development adaptations
    this.adaptations.set('skills', {
      languageLevel: 'intermediate',
      concreteExamples: [
        'like solving problems with friends',
        'like learning to use your phone',
        'like helping your family',
        'like working on a team project'
      ],
      familiarContexts: [
        'school projects',
        'part-time jobs',
        'family situations',
        'friend groups',
        'community activities',
        'online learning'
      ],
      feedbackStyle: 'contextual',
      reflectionPrompts: [
        'What skills did you use in this situation?',
        'How did you figure out what to do?',
        'What would help you get better at this?',
        'How is this useful in real life?'
      ],
      engagementLoops: {
        micro: 'practice skill -> get feedback -> see improvement -> try again',
        macro: 'develop skills -> match to careers -> find opportunities -> succeed'
      }
    })
  }

  private initializeFeedbackTemplates() {
    // Strength-Need-Next feedback format
    this.feedbackTemplates.set('strength-need-next', {
      strength: 'Great job figuring out that {skill} is important for {career}!',
      need: 'The next challenge is understanding how {skill} works in real jobs.',
      nextStep: 'Maybe think about {concrete_example} or talk to someone who does this work.',
      context: 'This is exactly how professionals in {career} think about problems.',
      motivational: 'You\'re building the kind of thinking that gets people hired!'
    })

    // Growth mindset feedback
    this.feedbackTemplates.set('growth-mindset', {
      strength: 'You tried a new approach - that\'s how you learn!',
      need: 'This solution didn\'t work yet, but it taught us something important.',
      nextStep: 'What if you tried {alternative_approach}? You\'re getting closer!',
      context: 'Even professionals have to try different things before they succeed.',
      motivational: 'Every attempt makes you smarter and more ready for real challenges.'
    })

    // Contextual feedback
    this.feedbackTemplates.set('contextual', {
      strength: 'You used {skill} just like {familiar_context} - smart thinking!',
      need: 'Now think about how this applies to {career_context}.',
      nextStep: 'Consider {real_world_example} to see this skill in action.',
      context: 'This is exactly what {career} professionals do every day.',
      motivational: 'You\'re thinking like someone who could succeed in {career}!'
    })
  }

  private initializeReflectionPrompts() {
    // Concrete reflection prompts for career exploration
    this.reflectionPrompts.set('career-exploration', {
      id: 'career-exploration',
      question: 'What career path interests you most right now?',
      scaffolding: [
        'Think about the jobs you saw in this chapter.',
        'Which one sounds most interesting?',
        'What makes it interesting to you?',
        'What would you need to learn to do this job?'
      ],
      context: 'career discovery',
      metacognitive: true
    })

    this.reflectionPrompts.set('skill-development', {
      id: 'skill-development',
      question: 'What skills did you practice in this chapter?',
      scaffolding: [
        'Look at the choices you made.',
        'What skills did you use?',
        'How did you figure out what to do?',
        'What would help you get better at this?'
      ],
      context: 'skill building',
      metacognitive: true
    })

    this.reflectionPrompts.set('real-world-connection', {
      id: 'real-world-connection',
      question: 'How does this connect to your real life?',
      scaffolding: [
        'Think about your family, friends, or community.',
        'Have you seen this kind of work before?',
        'Who do you know who does something similar?',
        'How could this help you in the future?'
      ],
      context: 'learning transfer',
      metacognitive: true
    })

    this.reflectionPrompts.set('problem-solving', {
      id: 'problem-solving',
      question: 'What was the hardest problem you solved?',
      scaffolding: [
        'Think about a choice that was difficult.',
        'What made it hard?',
        'How did you figure it out?',
        'What would you do differently next time?'
      ],
      context: 'problem solving',
      metacognitive: true
    })
  }

  private initializeEngagementLoops() {
    // Micro-engagement loops (immediate satisfaction)
    this.engagementLoops.set('choice-feedback', {
      type: 'micro',
      trigger: 'Player makes a choice',
      reward: 'Immediate feedback and story progression',
      progression: 'Choice -> Feedback -> Consequence -> Next Choice'
    })

    this.engagementLoops.set('skill-recognition', {
      type: 'micro',
      trigger: 'Player demonstrates a skill',
      reward: 'Skill level increase and recognition',
      progression: 'Action -> Skill Recognition -> Progress Bar -> Motivation'
    })

    // Macro-engagement loops (long-term progression)
    this.engagementLoops.set('career-discovery', {
      type: 'macro',
      trigger: 'Complete career exploration chapter',
      reward: 'Unlock new career paths and opportunities',
      progression: 'Explore -> Discover -> Match -> Plan -> Act'
    })

    this.engagementLoops.set('skill-building', {
      type: 'macro',
      trigger: 'Develop skills over multiple chapters',
      reward: 'Career readiness score and recommendations',
      progression: 'Practice -> Improve -> Assess -> Match -> Succeed'
    })
  }

  /**
   * Adapt text for middle-grade readability
   */
  adaptTextForAge(text: string, context: string): string {
    const adaptation = this.adaptations.get(context)
    if (!adaptation) return text

    let adaptedText = text

    // Replace complex terms with familiar contexts
    adaptation.familiarContexts.forEach(context => {
      // This would be more sophisticated in practice
      adaptedText = adaptedText.replace(/workplace/g, 'job')
      adaptedText = adaptedText.replace(/professional/g, 'worker')
      adaptedText = adaptedText.replace(/career development/g, 'finding a job')
    })

    // Add concrete examples
    if (adaptation.concreteExamples.length > 0) {
      const example = adaptation.concreteExamples[0]
      adaptedText += ` (like ${example})`
    }

    return adaptedText
  }

  /**
   * Generate age-appropriate feedback
   */
  generateFeedback(
    choice: string,
    skill: string,
    career: string,
    style: 'strength-need-next' | 'growth-mindset' | 'contextual'
  ): AgeAppropriateFeedback {
    const template = this.feedbackTemplates.get(style)
    if (!template) {
      return {
        strength: 'Good job!',
        need: 'Keep trying.',
        nextStep: 'What\'s next?',
        context: 'You\'re learning.',
        motivational: 'Keep going!'
      }
    }

    return {
      strength: template.strength.replace('{skill}', skill).replace('{career}', career),
      need: template.need.replace('{skill}', skill).replace('{career}', career),
      nextStep: template.nextStep.replace('{concrete_example}', 'talking to someone who does this work'),
      context: template.context.replace('{career}', career),
      motivational: template.motivational.replace('{career}', career)
    }
  }

  /**
   * Get reflection prompt for current context
   */
  getReflectionPrompt(context: string): ReflectionPrompt | null {
    return this.reflectionPrompts.get(context) || null
  }

  /**
   * Get engagement loop information
   */
  getEngagementLoop(type: 'micro' | 'macro'): EngagementLoop[] {
    return Array.from(this.engagementLoops.values()).filter(loop => loop.type === type)
  }

  /**
   * Check if text is age-appropriate
   */
  isAgeAppropriate(text: string, targetAge: number = 16): boolean {
    // Simple heuristic - in practice, would use more sophisticated analysis
    const complexWords = ['paradigm', 'leverage', 'facilitate', 'implement', 'optimize']
    const hasComplexWords = complexWords.some(word => text.toLowerCase().includes(word))
    
    const sentenceLength = text.split('.').length
    const avgWordsPerSentence = text.split(' ').length / sentenceLength
    
    // Age 16-24 should handle moderate complexity
    return !hasComplexWords && avgWordsPerSentence < 20
  }

  /**
   * Suggest concrete examples for abstract concepts
   */
  suggestConcreteExamples(abstractConcept: string): string[] {
    const examples: Record<string, string[]> = {
      'critical thinking': [
        'like figuring out why your phone isn\'t working',
        'like deciding which job to apply for',
        'like solving problems with friends'
      ],
      'communication': [
        'like explaining something to your family',
        'like asking for help at work',
        'like working on a group project'
      ],
      'leadership': [
        'like organizing a family event',
        'like helping friends with homework',
        'like taking charge of a group project'
      ],
      'problem solving': [
        'like fixing something that\'s broken',
        'like figuring out how to get somewhere',
        'like dealing with a difficult situation'
      ]
    }

    return examples[abstractConcept.toLowerCase()] || [
      'like something you do in your daily life',
      'like a situation you\'ve been in before',
      'like something you see people do around you'
    ]
  }

  /**
   * Create Birmingham-specific context
   */
  createBirminghamContext(concept: string): string {
    const birminghamContexts: Record<string, string> = {
      'healthcare': 'UAB Hospital or Children\'s Hospital',
      'technology': 'Innovation Depot or downtown tech companies',
      'construction': 'Birmingham construction sites or home building',
      'education': 'Jeff State or UAB or local schools',
      'business': 'Regions Bank or local Birmingham businesses',
      'trades': 'Birmingham trade schools or local contractors'
    }

    return birminghamContexts[concept.toLowerCase()] || 'Birmingham area'
  }
}

// Singleton instance
let middleGradeAdaptationSystem: MiddleGradeAdaptationSystem | null = null

export function getMiddleGradeAdaptationSystem(): MiddleGradeAdaptationSystem {
  if (!middleGradeAdaptationSystem) {
    middleGradeAdaptationSystem = new MiddleGradeAdaptationSystem()
  }
  return middleGradeAdaptationSystem
}
