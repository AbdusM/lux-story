/**
 * Cognitive Development System for Limbic Learning
 * Provides metacognitive scaffolding and flow state optimization for Birmingham youth
 */

export interface CognitiveState {
  flowState: 'struggle' | 'flow' | 'boredom' | 'anxiety'
  challengeLevel: number // 0-1 scale
  skillLevel: number // 0-1 scale
  metacognitiveAwareness: 'low' | 'medium' | 'high'
  executiveFunction: 'developing' | 'adequate' | 'strong'
  workingMemory: 'limited' | 'normal' | 'expanded'
  attentionSpan: 'short' | 'medium' | 'long'
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
}

export interface LearningMetrics {
  choiceComplexity: number // 0-1 scale
  decisionTime: number // milliseconds
  patternRecognition: number // 0-1 scale
  abstractionLevel: number // 0-1 scale
  transferAbility: number // 0-1 scale
  reflectionDepth: number // 0-1 scale
}

export interface FlowStateIndicators {
  challengeSkillRatio: number
  clearGoals: boolean
  immediateFeedback: boolean
  concentration: number // 0-1 scale
  timeDistortion: boolean
  intrinsicMotivation: number // 0-1 scale
}

export class CognitiveDevelopmentSystem {
  private state: CognitiveState
  private learningHistory: LearningMetrics[]
  private flowHistory: FlowStateIndicators[]
  private metacognitivePrompts: Map<string, string[]> = new Map()

  constructor() {
    this.state = {
      flowState: 'struggle',
      challengeLevel: 0.5,
      skillLevel: 0.3,
      metacognitiveAwareness: 'low',
      executiveFunction: 'developing',
      workingMemory: 'normal',
      attentionSpan: 'medium',
      learningStyle: 'mixed'
    }
    
    this.learningHistory = []
    this.flowHistory = []
    this.initializeMetacognitivePrompts()
  }

  private initializeMetacognitivePrompts() {
    this.metacognitivePrompts = new Map([
      ['planning', [
        "What do you want to explore first?",
        "What feels most interesting to you right now?",
        "What would you like to learn about?",
        "What catches your attention?"
      ]],
      ['monitoring', [
        "How is this going for you?",
        "What are you noticing about yourself?",
        "What feels right about this choice?",
        "What would you do differently?"
      ]],
      ['evaluating', [
        "What did you learn about yourself?",
        "What surprised you?",
        "What would you tell a friend about this?",
        "What matters most to you here?"
      ]],
      ['reflecting', [
        "What patterns do you see in your choices?",
        "What feels like the real you?",
        "What would make you proud?",
        "How do you want to grow?"
      ]]
    ])
  }

  /**
   * Analyze learning metrics and update cognitive state
   */
  analyzeLearningMetrics(metrics: LearningMetrics): CognitiveState {
    this.learningHistory.push(metrics)
    
    // Keep only last 20 interactions
    if (this.learningHistory.length > 20) {
      this.learningHistory = this.learningHistory.slice(-20)
    }

    // Update skill level based on pattern recognition and transfer ability
    this.updateSkillLevel(metrics)
    
    // Update challenge level based on choice complexity and abstraction
    this.updateChallengeLevel(metrics)
    
    // Determine flow state
    this.updateFlowState()
    
    // Update metacognitive awareness
    this.updateMetacognitiveAwareness(metrics)
    
    // Update executive function
    this.updateExecutiveFunction(metrics)
    
    // Update working memory
    this.updateWorkingMemory(metrics)
    
    // Update attention span
    this.updateAttentionSpan(metrics)
    
    // Update learning style
    this.updateLearningStyle(metrics)

    return { ...this.state }
  }

  private updateSkillLevel(metrics: LearningMetrics) {
    const recentMetrics = this.learningHistory.slice(-5)
    const avgPatternRecognition = recentMetrics.reduce((sum, m) => sum + m.patternRecognition, 0) / recentMetrics.length
    const avgTransferAbility = recentMetrics.reduce((sum, m) => sum + m.transferAbility, 0) / recentMetrics.length
    
    // Skill level increases with pattern recognition and transfer ability
    this.state.skillLevel = Math.min(1.0, (avgPatternRecognition + avgTransferAbility) / 2)
  }

  private updateChallengeLevel(metrics: LearningMetrics) {
    const recentMetrics = this.learningHistory.slice(-5)
    const avgComplexity = recentMetrics.reduce((sum, m) => sum + m.choiceComplexity, 0) / recentMetrics.length
    const avgAbstraction = recentMetrics.reduce((sum, m) => sum + m.abstractionLevel, 0) / recentMetrics.length
    
    // Challenge level based on complexity and abstraction
    this.state.challengeLevel = Math.min(1.0, (avgComplexity + avgAbstraction) / 2)
  }

  private updateFlowState() {
    const ratio = this.state.challengeLevel / Math.max(this.state.skillLevel, 0.1)
    
    if (ratio < 0.5) {
      this.state.flowState = 'boredom'
    } else if (ratio > 2.0) {
      this.state.flowState = 'anxiety'
    } else if (ratio >= 0.8 && ratio <= 1.2) {
      this.state.flowState = 'flow'
    } else {
      this.state.flowState = 'struggle'
    }
  }

  private updateMetacognitiveAwareness(metrics: LearningMetrics) {
    const recentMetrics = this.learningHistory.slice(-10)
    const avgReflectionDepth = recentMetrics.reduce((sum, m) => sum + m.reflectionDepth, 0) / recentMetrics.length
    
    if (avgReflectionDepth > 0.7) {
      this.state.metacognitiveAwareness = 'high'
    } else if (avgReflectionDepth > 0.4) {
      this.state.metacognitiveAwareness = 'medium'
    } else {
      this.state.metacognitiveAwareness = 'low'
    }
  }

  private updateExecutiveFunction(metrics: LearningMetrics) {
    const recentMetrics = this.learningHistory.slice(-10)
    const avgDecisionTime = recentMetrics.reduce((sum, m) => sum + m.decisionTime, 0) / recentMetrics.length
    const avgComplexity = recentMetrics.reduce((sum, m) => sum + m.choiceComplexity, 0) / recentMetrics.length
    
    // Executive function improves with thoughtful decision-making
    const executiveScore = (avgComplexity * 0.6) + ((10000 - Math.min(avgDecisionTime, 10000)) / 10000 * 0.4)
    
    if (executiveScore > 0.7) {
      this.state.executiveFunction = 'strong'
    } else if (executiveScore > 0.4) {
      this.state.executiveFunction = 'adequate'
    } else {
      this.state.executiveFunction = 'developing'
    }
  }

  private updateWorkingMemory(metrics: LearningMetrics) {
    const recentMetrics = this.learningHistory.slice(-5)
    const avgComplexity = recentMetrics.reduce((sum, m) => sum + m.choiceComplexity, 0) / recentMetrics.length
    
    if (avgComplexity > 0.7) {
      this.state.workingMemory = 'expanded'
    } else if (avgComplexity > 0.4) {
      this.state.workingMemory = 'normal'
    } else {
      this.state.workingMemory = 'limited'
    }
  }

  private updateAttentionSpan(metrics: LearningMetrics) {
    const recentMetrics = this.learningHistory.slice(-10)
    const avgDecisionTime = recentMetrics.reduce((sum, m) => sum + m.decisionTime, 0) / recentMetrics.length
    
    if (avgDecisionTime > 8000) {
      this.state.attentionSpan = 'long'
    } else if (avgDecisionTime > 3000) {
      this.state.attentionSpan = 'medium'
    } else {
      this.state.attentionSpan = 'short'
    }
  }

  private updateLearningStyle(metrics: LearningMetrics) {
    // This would be determined by analyzing choice patterns
    // For now, we'll use a simple heuristic based on decision time and complexity
    const recentMetrics = this.learningHistory.slice(-10)
    const avgDecisionTime = recentMetrics.reduce((sum, m) => sum + m.decisionTime, 0) / recentMetrics.length
    const avgComplexity = recentMetrics.reduce((sum, m) => sum + m.choiceComplexity, 0) / recentMetrics.length
    
    if (avgDecisionTime < 2000 && avgComplexity > 0.6) {
      this.state.learningStyle = 'kinesthetic' // Quick, complex decisions
    } else if (avgDecisionTime > 5000) {
      this.state.learningStyle = 'visual' // Longer, more contemplative
    } else if (avgComplexity > 0.5) {
      this.state.learningStyle = 'auditory' // Moderate complexity, moderate time
    } else {
      this.state.learningStyle = 'mixed'
    }
  }

  /**
   * Get appropriate metacognitive prompt for current state
   */
  getMetacognitivePrompt(): string | null {
    const prompts = this.metacognitivePrompts.get('monitoring') || []
    
    // Adjust prompt based on cognitive state
    if (this.state.flowState === 'anxiety') {
      return "What feels most comfortable for you right now?"
    } else if (this.state.flowState === 'boredom') {
      return "What would make this more interesting for you?"
    } else if (this.state.metacognitiveAwareness === 'low') {
      return prompts[0] // Basic monitoring prompt
    } else if (this.state.metacognitiveAwareness === 'high') {
      return prompts[2] // Deeper reflection prompt
    } else {
      return prompts[1] // Standard monitoring prompt
    }
  }

  /**
   * Get flow state optimization suggestions
   */
  getFlowOptimization(): Record<string, any> {
    const suggestions: Record<string, any> = {}

    if (this.state.flowState === 'anxiety') {
      suggestions.challengeReduction = true
      suggestions.skillBuilding = true
      suggestions.breakSuggestion = "Let's take a step back and try something simpler."
    } else if (this.state.flowState === 'boredom') {
      suggestions.challengeIncrease = true
      suggestions.complexityBoost = true
      suggestions.engagementBoost = "Ready for something more interesting?"
    } else if (this.state.flowState === 'struggle') {
      suggestions.guidanceIncrease = true
      suggestions.hintLevel = 'medium'
      suggestions.encouragement = "You're learning! This is exactly how growth happens."
    } else if (this.state.flowState === 'flow') {
      suggestions.maintainFlow = true
      suggestions.celebration = "You're in the zone! Keep going!"
    }

    return suggestions
  }

  /**
   * Get cognitive scaffolding based on current state
   */
  getCognitiveScaffolding(): Record<string, any> {
    const scaffolding: Record<string, any> = {}

    // Executive function support
    if (this.state.executiveFunction === 'developing') {
      scaffolding.decisionSupport = true
      scaffolding.choiceClarification = true
      scaffolding.goalSetting = "What do you want to explore?"
    }

    // Working memory support
    if (this.state.workingMemory === 'limited') {
      scaffolding.chunking = true
      scaffolding.oneThingAtATime = true
      scaffolding.reminder = "Focus on one choice at a time."
    }

    // Attention span support
    if (this.state.attentionSpan === 'short') {
      scaffolding.quickWins = true
      scaffolding.frequentBreaks = true
      scaffolding.engagement = "Let's keep this moving!"
    }

    // Metacognitive awareness support
    if (this.state.metacognitiveAwareness === 'low') {
      scaffolding.reflectionPrompts = true
      scaffolding.patternHighlighting = true
      scaffolding.selfAwareness = "Notice what you're learning about yourself."
    }

    return scaffolding
  }

  /**
   * Get learning style adaptations
   */
  getLearningStyleAdaptations(): Record<string, any> {
    const adaptations: Record<string, any> = {}

    switch (this.state.learningStyle) {
      case 'visual':
        adaptations.visualCues = true
        adaptations.diagrams = true
        adaptations.colorCoding = true
        break
      case 'auditory':
        adaptations.verbalCues = true
        adaptations.soundFeedback = true
        adaptations.dialogue = true
        break
      case 'kinesthetic':
        adaptations.interactiveElements = true
        adaptations.movement = true
        adaptations.tactileFeedback = true
        break
      case 'mixed':
        adaptations.multimodal = true
        adaptations.flexiblePresentation = true
        break
    }

    return adaptations
  }

  /**
   * Reset cognitive state (useful for scene transitions)
   */
  reset() {
    this.state = {
      flowState: 'struggle',
      challengeLevel: 0.5,
      skillLevel: 0.3,
      metacognitiveAwareness: 'low',
      executiveFunction: 'developing',
      workingMemory: 'normal',
      attentionSpan: 'medium',
      learningStyle: 'mixed'
    }
    this.learningHistory = []
    this.flowHistory = []
  }

  /**
   * Get current cognitive state
   */
  getState(): CognitiveState {
    return { ...this.state }
  }
}

// Singleton instance
let cognitiveDevelopmentSystem: CognitiveDevelopmentSystem | null = null

export function getCognitiveDevelopmentSystem(): CognitiveDevelopmentSystem {
  if (!cognitiveDevelopmentSystem) {
    cognitiveDevelopmentSystem = new CognitiveDevelopmentSystem()
  }
  return cognitiveDevelopmentSystem
}
