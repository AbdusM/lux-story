/**
 * Emotional Regulation System for Limbic Learning
 * Supports Birmingham youth through stress management and emotional awareness
 */

export interface EmotionalState {
  stressLevel: 'calm' | 'alert' | 'anxious' | 'overwhelmed'
  heartRateVariability: number // 0-1 scale
  vagalTone: 'low' | 'normal' | 'high'
  breathingRhythm: 'natural' | 'guided' | 'urgent'
  emotionalWeight: number // 0-1 scale
  regulationNeeded: boolean
}

export interface StressIndicators {
  rapidClicks: number
  choiceTime: number // milliseconds
  themeJumping: boolean
  hesitationCount: number
  emotionalIntensity: number
}

export class EmotionalRegulationSystem {
  private state: EmotionalState
  private stressHistory: StressIndicators[]
  private regulationStrategies: Map<string, () => void>

  constructor() {
    this.state = {
      stressLevel: 'calm',
      heartRateVariability: 0.7,
      vagalTone: 'normal',
      breathingRhythm: 'natural',
      emotionalWeight: 0.5,
      regulationNeeded: false
    }
    
    this.stressHistory = []
    this.regulationStrategies = new Map()
    this.initializeStrategies()
  }

  private initializeStrategies() {
    // Breathing support strategies
    this.regulationStrategies.set('breathing_guided', () => {
      this.state.breathingRhythm = 'guided'
      this.state.regulationNeeded = true
    })

    // Calming visual strategies
    this.regulationStrategies.set('visual_calm', () => {
      this.state.stressLevel = 'calm'
      this.state.regulationNeeded = true
    })

    // Pacing strategies
    this.regulationStrategies.set('pace_slow', () => {
      this.state.breathingRhythm = 'natural'
      this.state.regulationNeeded = true
    })
  }

  /**
   * Analyze player behavior for stress indicators
   */
  analyzeStressIndicators(indicators: StressIndicators): EmotionalState {
    this.stressHistory.push(indicators)
    
    // Keep only last 10 interactions
    if (this.stressHistory.length > 10) {
      this.stressHistory = this.stressHistory.slice(-10)
    }

    // Calculate stress level based on multiple factors
    const stressScore = this.calculateStressScore(indicators)
    
    // Update emotional state
    this.updateEmotionalState(stressScore, indicators)
    
    // Determine if regulation is needed
    this.determineRegulationNeed()

    return { ...this.state }
  }

  private calculateStressScore(indicators: StressIndicators): number {
    let score = 0

    // Rapid clicking indicates anxiety
    if (indicators.rapidClicks >= 3) score += 0.3
    if (indicators.rapidClicks >= 5) score += 0.2

    // Very fast choices indicate rushing
    if (indicators.choiceTime < 2000) score += 0.2
    if (indicators.choiceTime < 1000) score += 0.3

    // Theme jumping indicates confusion
    if (indicators.themeJumping) score += 0.2

    // High hesitation indicates decision paralysis
    if (indicators.hesitationCount >= 3) score += 0.1

    // High emotional intensity
    if (indicators.emotionalIntensity > 0.7) score += 0.2

    return Math.min(score, 1.0)
  }

  private updateEmotionalState(stressScore: number, indicators: StressIndicators) {
    // Update stress level
    if (stressScore < 0.2) {
      this.state.stressLevel = 'calm'
    } else if (stressScore < 0.4) {
      this.state.stressLevel = 'alert'
    } else if (stressScore < 0.7) {
      this.state.stressLevel = 'anxious'
    } else {
      this.state.stressLevel = 'overwhelmed'
    }

    // Update heart rate variability (inverse relationship with stress)
    this.state.heartRateVariability = Math.max(0.3, 1.0 - stressScore)

    // Update vagal tone
    if (this.state.heartRateVariability > 0.7) {
      this.state.vagalTone = 'high'
    } else if (this.state.heartRateVariability > 0.4) {
      this.state.vagalTone = 'normal'
    } else {
      this.state.vagalTone = 'low'
    }

    // Update breathing rhythm
    if (stressScore > 0.6) {
      this.state.breathingRhythm = 'urgent'
    } else if (stressScore > 0.3) {
      this.state.breathingRhythm = 'guided'
    } else {
      this.state.breathingRhythm = 'natural'
    }

    // Update emotional weight
    this.state.emotionalWeight = Math.min(0.9, indicators.emotionalIntensity + (stressScore * 0.3))
  }

  private determineRegulationNeed() {
    this.state.regulationNeeded = (
      this.state.stressLevel === 'anxious' ||
      this.state.stressLevel === 'overwhelmed' ||
      this.state.vagalTone === 'low' ||
      this.state.breathingRhythm === 'urgent'
    )
  }

  /**
   * Get appropriate regulation strategy for current state
   */
  getRegulationStrategy(): string | null {
    if (!this.state.regulationNeeded) return null

    if (this.state.stressLevel === 'overwhelmed') {
      return 'breathing_guided'
    } else if (this.state.vagalTone === 'low') {
      return 'visual_calm'
    } else if (this.state.breathingRhythm === 'urgent') {
      return 'pace_slow'
    }

    return null
  }

  /**
   * Get emotional support message for current state
   */
  getEmotionalSupportMessage(): string | null {
    if (!this.state.regulationNeeded) return null

    const messages = {
      anxious: [
        "Take a moment to breathe. You're doing great.",
        "There's no rush. Take your time with this choice.",
        "It's okay to feel uncertain. That's part of exploring."
      ],
      overwhelmed: [
        "Let's slow down together. One choice at a time.",
        "You don't have to figure everything out right now.",
        "Breathe with me. In... and out..."
      ],
      low_vagal: [
        "Notice how your body feels right now.",
        "What would feel most comfortable for you?",
        "Trust your instincts. They know the way."
      ]
    }

    if (this.state.stressLevel === 'anxious') {
      return messages.anxious[Math.floor(Math.random() * messages.anxious.length)]
    } else if (this.state.stressLevel === 'overwhelmed') {
      return messages.overwhelmed[Math.floor(Math.random() * messages.overwhelmed.length)]
    } else if (this.state.vagalTone === 'low') {
      return messages.low_vagal[Math.floor(Math.random() * messages.low_vagal.length)]
    }

    return null
  }

  /**
   * Get visual/UI adjustments for emotional state
   */
  getVisualAdjustments(): Record<string, any> {
    const adjustments: Record<string, any> = {}

    if (this.state.stressLevel === 'anxious') {
      adjustments.spacing = 'increased'
      adjustments.animationSpeed = 'slower'
      adjustments.colorTemperature = 'warmer'
    } else if (this.state.stressLevel === 'overwhelmed') {
      adjustments.spacing = 'maximum'
      adjustments.animationSpeed = 'slowest'
      adjustments.colorTemperature = 'warmest'
      adjustments.blurBackground = true
    }

    if (this.state.breathingRhythm === 'guided') {
      adjustments.breathingCue = true
      adjustments.rhythmVisual = 'gentle'
    } else if (this.state.breathingRhythm === 'urgent') {
      adjustments.breathingCue = true
      adjustments.rhythmVisual = 'calming'
    }

    return adjustments
  }

  /**
   * Reset emotional state (useful for scene transitions)
   */
  reset() {
    this.state = {
      stressLevel: 'calm',
      heartRateVariability: 0.7,
      vagalTone: 'normal',
      breathingRhythm: 'natural',
      emotionalWeight: 0.5,
      regulationNeeded: false
    }
    this.stressHistory = []
  }

  /**
   * Get current emotional state
   */
  getState(): EmotionalState {
    return { ...this.state }
  }
}

// Singleton instance
let emotionalRegulationSystem: EmotionalRegulationSystem | null = null

export function getEmotionalRegulationSystem(): EmotionalRegulationSystem {
  if (!emotionalRegulationSystem) {
    emotionalRegulationSystem = new EmotionalRegulationSystem()
  }
  return emotionalRegulationSystem
}
