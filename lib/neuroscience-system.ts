/**
 * Neuroscience System for Limbic Learning
 * Supports brain-based learning and neuroplasticity for Birmingham youth
 */

export interface NeuralState {
  attentionNetwork: 'alerting' | 'orienting' | 'executive' | 'integrated'
  memoryConsolidation: 'encoding' | 'consolidating' | 'retrieving' | 'integrated'
  neuroplasticity: 'low' | 'moderate' | 'high' | 'optimal'
  dopamineLevel: 'low' | 'moderate' | 'high' | 'optimal'
  stressResponse: 'calm' | 'alert' | 'stressed' | 'overwhelmed'
  cognitiveLoad: 'low' | 'moderate' | 'high' | 'overload'
  neuralEfficiency: 'developing' | 'improving' | 'efficient' | 'optimized'
}

export interface BrainMetrics {
  attentionSustained: number // 0-1 scale
  workingMemoryLoad: number // 0-1 scale
  cognitiveFlexibility: number // 0-1 scale
  inhibitoryControl: number // 0-1 scale
  processingSpeed: number // 0-1 scale
  memoryEncoding: number // 0-1 scale
  memoryRetrieval: number // 0-1 scale
  neuralConnectivity: number // 0-1 scale
}

export interface NeuroplasticityIndicators {
  learningNovelty: number // 0-1 scale
  repetitionPatterns: number // 0-1 scale
  challengeLevel: number // 0-1 scale
  rewardExpectation: number // 0-1 scale
  socialEngagement: number // 0-1 scale
  emotionalArousal: number // 0-1 scale
  sleepQuality: number // 0-1 scale
  physicalActivity: number // 0-1 scale
}

export interface BrainOptimization {
  attentionTraining: boolean
  memoryEnhancement: boolean
  executiveFunctionBoost: boolean
  stressReduction: boolean
  rewardOptimization: boolean
  socialConnection: boolean
  noveltyIntroduction: boolean
  repetitionSpacing: boolean
}

export class NeuroscienceSystem {
  private neuralState: NeuralState
  private brainHistory: BrainMetrics[]
  private neuroplasticityHistory: NeuroplasticityIndicators[]
  private brainPrompts: Map<string, string[]> = new Map()
  private optimizationStrategies: Map<string, () => void> = new Map()

  constructor() {
    this.neuralState = {
      attentionNetwork: 'alerting',
      memoryConsolidation: 'encoding',
      neuroplasticity: 'moderate',
      dopamineLevel: 'moderate',
      stressResponse: 'calm',
      cognitiveLoad: 'moderate',
      neuralEfficiency: 'developing'
    }
    
    this.brainHistory = []
    this.neuroplasticityHistory = []
    this.initializePrompts()
    this.initializeOptimizationStrategies()
  }

  private initializePrompts() {
    this.brainPrompts = new Map([
      ['attention', [
        "What's catching your attention right now?",
        "What feels most interesting to focus on?",
        "What would you like to explore more deeply?",
        "What's drawing you in?"
      ]],
      ['memory', [
        "What do you want to remember about this?",
        "What's worth keeping in mind?",
        "What would you tell someone about this?",
        "What's the key takeaway here?"
      ]],
      ['executive', [
        "What's your plan here?",
        "How do you want to approach this?",
        "What's your strategy?",
        "What's the best way forward?"
      ]],
      ['neuroplasticity', [
        "What new connections are you making?",
        "How is this changing your thinking?",
        "What patterns are you noticing?",
        "How are you growing from this?"
      ]]
    ])
  }

  private initializeOptimizationStrategies() {
    this.optimizationStrategies = new Map([
      ['attention_training', () => {
        this.neuralState.attentionNetwork = 'orienting'
        this.neuralState.neuralEfficiency = 'improving'
      }],
      ['memory_enhancement', () => {
        this.neuralState.memoryConsolidation = 'consolidating'
        this.neuralState.neuroplasticity = 'high'
      }],
      ['executive_boost', () => {
        this.neuralState.attentionNetwork = 'executive'
        this.neuralState.neuralEfficiency = 'efficient'
      }],
      ['stress_reduction', () => {
        this.neuralState.stressResponse = 'calm'
        this.neuralState.cognitiveLoad = 'low'
      }],
      ['reward_optimization', () => {
        this.neuralState.dopamineLevel = 'high'
        this.neuralState.neuroplasticity = 'optimal'
      }]
    ])
  }

  /**
   * Analyze brain metrics and update neural state
   */
  analyzeBrainMetrics(metrics: BrainMetrics): NeuralState {
    this.brainHistory.push(metrics)
    
    // Keep only last 20 interactions
    if (this.brainHistory.length > 20) {
      this.brainHistory = this.brainHistory.slice(-20)
    }

    // Update attention network
    this.updateAttentionNetwork(metrics)
    
    // Update memory consolidation
    this.updateMemoryConsolidation(metrics)
    
    // Update neuroplasticity
    this.updateNeuroplasticity(metrics)
    
    // Update dopamine level
    this.updateDopamineLevel(metrics)
    
    // Update stress response
    this.updateStressResponse(metrics)
    
    // Update cognitive load
    this.updateCognitiveLoad(metrics)
    
    // Update neural efficiency
    this.updateNeuralEfficiency(metrics)

    return { ...this.neuralState }
  }

  private updateAttentionNetwork(metrics: BrainMetrics) {
    const recentMetrics = this.brainHistory.slice(-5)
    const avgAttention = recentMetrics.reduce((sum, m) => sum + m.attentionSustained, 0) / recentMetrics.length
    const avgFlexibility = recentMetrics.reduce((sum, m) => sum + m.cognitiveFlexibility, 0) / recentMetrics.length
    
    if (avgAttention > 0.7 && avgFlexibility > 0.7) {
      this.neuralState.attentionNetwork = 'integrated'
    } else if (avgFlexibility > 0.5) {
      this.neuralState.attentionNetwork = 'executive'
    } else if (avgAttention > 0.5) {
      this.neuralState.attentionNetwork = 'orienting'
    } else {
      this.neuralState.attentionNetwork = 'alerting'
    }
  }

  private updateMemoryConsolidation(metrics: BrainMetrics) {
    const recentMetrics = this.brainHistory.slice(-5)
    const avgEncoding = recentMetrics.reduce((sum, m) => sum + m.memoryEncoding, 0) / recentMetrics.length
    const avgRetrieval = recentMetrics.reduce((sum, m) => sum + m.memoryRetrieval, 0) / recentMetrics.length
    
    if (avgEncoding > 0.7 && avgRetrieval > 0.7) {
      this.neuralState.memoryConsolidation = 'integrated'
    } else if (avgRetrieval > 0.5) {
      this.neuralState.memoryConsolidation = 'retrieving'
    } else if (avgEncoding > 0.5) {
      this.neuralState.memoryConsolidation = 'consolidating'
    } else {
      this.neuralState.memoryConsolidation = 'encoding'
    }
  }

  private updateNeuroplasticity(metrics: BrainMetrics) {
    const recentMetrics = this.brainHistory.slice(-5)
    const avgConnectivity = recentMetrics.reduce((sum, m) => sum + m.neuralConnectivity, 0) / recentMetrics.length
    const avgFlexibility = recentMetrics.reduce((sum, m) => sum + m.cognitiveFlexibility, 0) / recentMetrics.length
    
    const plasticityScore = (avgConnectivity + avgFlexibility) / 2
    
    if (plasticityScore > 0.8) {
      this.neuralState.neuroplasticity = 'optimal'
    } else if (plasticityScore > 0.6) {
      this.neuralState.neuroplasticity = 'high'
    } else if (plasticityScore > 0.3) {
      this.neuralState.neuroplasticity = 'moderate'
    } else {
      this.neuralState.neuroplasticity = 'low'
    }
  }

  private updateDopamineLevel(metrics: BrainMetrics) {
    const recentMetrics = this.brainHistory.slice(-5)
    const avgProcessingSpeed = recentMetrics.reduce((sum, m) => sum + m.processingSpeed, 0) / recentMetrics.length
    const avgAttention = recentMetrics.reduce((sum, m) => sum + m.attentionSustained, 0) / recentMetrics.length
    
    const dopamineScore = (avgProcessingSpeed + avgAttention) / 2
    
    if (dopamineScore > 0.8) {
      this.neuralState.dopamineLevel = 'optimal'
    } else if (dopamineScore > 0.6) {
      this.neuralState.dopamineLevel = 'high'
    } else if (dopamineScore > 0.3) {
      this.neuralState.dopamineLevel = 'moderate'
    } else {
      this.neuralState.dopamineLevel = 'low'
    }
  }

  private updateStressResponse(metrics: BrainMetrics) {
    const recentMetrics = this.brainHistory.slice(-5)
    const avgWorkingMemory = recentMetrics.reduce((sum, m) => sum + m.workingMemoryLoad, 0) / recentMetrics.length
    const avgInhibitoryControl = recentMetrics.reduce((sum, m) => sum + m.inhibitoryControl, 0) / recentMetrics.length
    
    const stressScore = (avgWorkingMemory + (1 - avgInhibitoryControl)) / 2
    
    if (stressScore < 0.3) {
      this.neuralState.stressResponse = 'calm'
    } else if (stressScore < 0.5) {
      this.neuralState.stressResponse = 'alert'
    } else if (stressScore < 0.7) {
      this.neuralState.stressResponse = 'stressed'
    } else {
      this.neuralState.stressResponse = 'overwhelmed'
    }
  }

  private updateCognitiveLoad(metrics: BrainMetrics) {
    const recentMetrics = this.brainHistory.slice(-5)
    const avgWorkingMemory = recentMetrics.reduce((sum, m) => sum + m.workingMemoryLoad, 0) / recentMetrics.length
    const avgProcessingSpeed = recentMetrics.reduce((sum, m) => sum + m.processingSpeed, 0) / recentMetrics.length
    
    const loadScore = avgWorkingMemory + (1 - avgProcessingSpeed)
    
    if (loadScore < 0.3) {
      this.neuralState.cognitiveLoad = 'low'
    } else if (loadScore < 0.5) {
      this.neuralState.cognitiveLoad = 'moderate'
    } else if (loadScore < 0.7) {
      this.neuralState.cognitiveLoad = 'high'
    } else {
      this.neuralState.cognitiveLoad = 'overload'
    }
  }

  private updateNeuralEfficiency(metrics: BrainMetrics) {
    const recentMetrics = this.brainHistory.slice(-5)
    const avgProcessingSpeed = recentMetrics.reduce((sum, m) => sum + m.processingSpeed, 0) / recentMetrics.length
    const avgConnectivity = recentMetrics.reduce((sum, m) => sum + m.neuralConnectivity, 0) / recentMetrics.length
    
    const efficiencyScore = (avgProcessingSpeed + avgConnectivity) / 2
    
    if (efficiencyScore > 0.8) {
      this.neuralState.neuralEfficiency = 'optimized'
    } else if (efficiencyScore > 0.6) {
      this.neuralState.neuralEfficiency = 'efficient'
    } else if (efficiencyScore > 0.3) {
      this.neuralState.neuralEfficiency = 'improving'
    } else {
      this.neuralState.neuralEfficiency = 'developing'
    }
  }

  /**
   * Get appropriate brain-based prompt
   */
  getBrainPrompt(): string | null {
    const prompts = this.brainPrompts.get('attention') || []
    
    // Adjust prompt based on neural state
    if (this.neuralState.attentionNetwork === 'executive') {
      const executivePrompts = this.brainPrompts.get('executive') || []
      return executivePrompts[Math.floor(Math.random() * executivePrompts.length)]
    } else if (this.neuralState.memoryConsolidation === 'consolidating') {
      const memoryPrompts = this.brainPrompts.get('memory') || []
      return memoryPrompts[Math.floor(Math.random() * memoryPrompts.length)]
    } else if (this.neuralState.neuroplasticity === 'high') {
      const neuroplasticityPrompts = this.brainPrompts.get('neuroplasticity') || []
      return neuroplasticityPrompts[Math.floor(Math.random() * neuroplasticityPrompts.length)]
    } else {
      return prompts[Math.floor(Math.random() * prompts.length)]
    }
  }

  /**
   * Get brain optimization strategies
   */
  getBrainOptimization(): BrainOptimization {
    const optimization: BrainOptimization = {
      attentionTraining: false,
      memoryEnhancement: false,
      executiveFunctionBoost: false,
      stressReduction: false,
      rewardOptimization: false,
      socialConnection: false,
      noveltyIntroduction: false,
      repetitionSpacing: false
    }

    // Attention training
    if (this.neuralState.attentionNetwork === 'alerting') {
      optimization.attentionTraining = true
    }

    // Memory enhancement
    if (this.neuralState.memoryConsolidation === 'encoding') {
      optimization.memoryEnhancement = true
    }

    // Executive function boost
    if (this.neuralState.attentionNetwork === 'orienting') {
      optimization.executiveFunctionBoost = true
    }

    // Stress reduction
    if (this.neuralState.stressResponse === 'stressed' || this.neuralState.stressResponse === 'overwhelmed') {
      optimization.stressReduction = true
    }

    // Reward optimization
    if (this.neuralState.dopamineLevel === 'low' || this.neuralState.dopamineLevel === 'moderate') {
      optimization.rewardOptimization = true
    }

    // Social connection
    if (this.neuralState.neuroplasticity === 'low') {
      optimization.socialConnection = true
    }

    // Novelty introduction
    if (this.neuralState.neuroplasticity === 'moderate') {
      optimization.noveltyIntroduction = true
    }

    // Repetition spacing
    if (this.neuralState.memoryConsolidation === 'consolidating') {
      optimization.repetitionSpacing = true
    }

    return optimization
  }

  /**
   * Get neuroplasticity support
   */
  getNeuroplasticitySupport(): Record<string, any> {
    const support: Record<string, any> = {}

    // Learning novelty
    if (this.neuralState.neuroplasticity === 'low') {
      support.noveltyEncouragement = "Let's try something new and different!"
      support.explorationBoost = "What would you like to discover?"
    }

    // Challenge optimization
    if (this.neuralState.cognitiveLoad === 'low') {
      support.challengeIncrease = "Ready for something more challenging?"
    } else if (this.neuralState.cognitiveLoad === 'overload') {
      support.challengeReduction = "Let's simplify this for now."
    }

    // Reward optimization
    if (this.neuralState.dopamineLevel === 'low') {
      support.rewardBoost = "You're doing great! Keep going!"
      support.achievementRecognition = "That was a smart choice!"
    }

    // Memory consolidation
    if (this.neuralState.memoryConsolidation === 'encoding') {
      support.memorySupport = "What do you want to remember about this?"
      support.consolidationHelp = "Let's make this stick in your memory."
    }

    return support
  }

  /**
   * Get neural efficiency tips
   */
  getNeuralEfficiencyTips(): Record<string, any> {
    const tips: Record<string, any> = {}

    // Attention optimization
    if (this.neuralState.attentionNetwork === 'alerting') {
      tips.attentionFocus = "Focus on one thing at a time."
      tips.distractionReduction = "Let's minimize distractions."
    }

    // Processing speed
    if (this.neuralState.neuralEfficiency === 'developing') {
      tips.processingSupport = "Take your time to process this."
      tips.patienceEncouragement = "Your brain is learning and growing."
    }

    // Working memory
    if (this.neuralState.cognitiveLoad === 'high') {
      tips.memoryChunking = "Let's break this into smaller pieces."
      tips.loadReduction = "One step at a time."
    }

    return tips
  }

  /**
   * Reset neural state
   */
  reset() {
    this.neuralState = {
      attentionNetwork: 'alerting',
      memoryConsolidation: 'encoding',
      neuroplasticity: 'moderate',
      dopamineLevel: 'moderate',
      stressResponse: 'calm',
      cognitiveLoad: 'moderate',
      neuralEfficiency: 'developing'
    }
    this.brainHistory = []
    this.neuroplasticityHistory = []
  }

  /**
   * Get current neural state
   */
  getNeuralState(): NeuralState {
    return { ...this.neuralState }
  }
}

// Singleton instance
let neuroscienceSystem: NeuroscienceSystem | null = null

export function getNeuroscienceSystem(): NeuroscienceSystem {
  if (!neuroscienceSystem) {
    neuroscienceSystem = new NeuroscienceSystem()
  }
  return neuroscienceSystem
}
