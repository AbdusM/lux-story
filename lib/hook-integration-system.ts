/**
 * Hook Integration & Subtlety Monitor
 * Sub-Agent 2: Ensures natural, implicit storytelling through proper hook delivery
 */

export interface NarrativeHook {
  id: string
  type: 'mystery' | 'foreshadowing' | 'question' | 'tension' | 'character' | 'world'
  content: string
  setupScene: string
  payoffScene?: string
  deliveryMethod: 'dialogue' | 'environmental' | 'action' | 'subtext' | 'exposition'
  subtletyLevel: 'too-explicit' | 'well-balanced' | 'too-buried'
  status: 'active' | 'resolved' | 'abandoned'
  impact: 'high' | 'medium' | 'low'
}

export interface HookDeliveryAssessment {
  hookId: string
  currentDelivery: string
  assessment: 'too-explicit' | 'well-balanced' | 'too-buried'
  issues: string[]
  suggestions: string[]
  explicitPermission: boolean
}

export interface NaturalIntegration {
  hookId: string
  currentMethod: string
  suggestedMethod: string
  implementation: string
  reasoning: string
}

export class HookIntegrationSystem {
  private hooks: Map<string, NarrativeHook>
  private deliveryAssessments: Map<string, HookDeliveryAssessment>
  private naturalIntegrations: Map<string, NaturalIntegration>
  private redFlags: string[]

  constructor() {
    this.hooks = new Map()
    this.deliveryAssessments = new Map()
    this.naturalIntegrations = new Map()
    this.redFlags = []
    this.initializeHooks()
    this.assessHookDelivery()
  }

  private initializeHooks() {
    // Mystery hooks
    this.hooks.set('mysterious-letter', {
      id: 'mysterious-letter',
      type: 'mystery',
      content: 'Who sent the letter and why?',
      setupScene: '1-1',
      payoffScene: '3-20',
      deliveryMethod: 'environmental',
      subtletyLevel: 'well-balanced',
      status: 'active',
      impact: 'high'
    })

    this.hooks.set('platform-7-purpose', {
      id: 'platform-7-purpose',
      type: 'mystery',
      content: 'What is Platform 7 and why does it exist?',
      setupScene: '1-8',
      payoffScene: '2-8',
      deliveryMethod: 'dialogue',
      subtletyLevel: 'too-buried',
      status: 'active',
      impact: 'high'
    })

    this.hooks.set('samuel-identity', {
      id: 'samuel-identity',
      type: 'mystery',
      content: 'Who is Samuel really and what is his role?',
      setupScene: '1-3b',
      payoffScene: '3-17',
      deliveryMethod: 'subtext',
      subtletyLevel: 'well-balanced',
      status: 'active',
      impact: 'medium'
    })

    // Foreshadowing hooks
    this.hooks.set('career-crisis-foreshadowing', {
      id: 'career-crisis-foreshadowing',
      type: 'foreshadowing',
      content: 'Characters will face career-defining moments',
      setupScene: '1-2',
      payoffScene: '2-3a2',
      deliveryMethod: 'dialogue',
      subtletyLevel: 'well-balanced',
      status: 'resolved',
      impact: 'high'
    })

    this.hooks.set('birmingham-opportunities', {
      id: 'birmingham-opportunities',
      type: 'foreshadowing',
      content: 'Real Birmingham opportunities will be revealed',
      setupScene: '2-1',
      payoffScene: '3-2a',
      deliveryMethod: 'environmental',
      subtletyLevel: 'well-balanced',
      status: 'resolved',
      impact: 'high'
    })

    // Character tension hooks
    this.hooks.set('maya-financial-stress', {
      id: 'maya-financial-stress',
      type: 'tension',
      content: 'Maya\'s financial struggles and family responsibilities',
      setupScene: '2-3a2',
      payoffScene: '3-2a',
      deliveryMethod: 'dialogue',
      subtletyLevel: 'well-balanced',
      status: 'active',
      impact: 'high'
    })

    this.hooks.set('jordan-trade-validation', {
      id: 'jordan-trade-validation',
      type: 'tension',
      content: 'Jordan\'s need for validation of trade school path',
      setupScene: '2-3a2',
      payoffScene: '3-2c',
      deliveryMethod: 'subtext',
      subtletyLevel: 'well-balanced',
      status: 'active',
      impact: 'medium'
    })

    // World-building hooks
    this.hooks.set('train-station-metaphor', {
      id: 'train-station-metaphor',
      type: 'world',
      content: 'Train station as metaphor for career exploration',
      setupScene: '1-1',
      payoffScene: '3-20',
      deliveryMethod: 'environmental',
      subtletyLevel: 'well-balanced',
      status: 'active',
      impact: 'high'
    })

    this.hooks.set('platform-warming-cooling', {
      id: 'platform-warming-cooling',
      type: 'world',
      content: 'Platforms respond to player choices with temperature changes',
      setupScene: '1-8',
      payoffScene: '2-8',
      deliveryMethod: 'environmental',
      subtletyLevel: 'too-buried',
      status: 'active',
      impact: 'medium'
    })
  }

  private assessHookDelivery() {
    // Assess each hook's delivery
    this.hooks.forEach((hook, hookId) => {
      const assessment = this.assessHook(hook)
      this.deliveryAssessments.set(hookId, assessment)
    })
  }

  private assessHook(hook: NarrativeHook): HookDeliveryAssessment {
    const issues: string[] = []
    const suggestions: string[] = []
    let assessment: 'too-explicit' | 'well-balanced' | 'too-buried' = 'well-balanced'

    // Check for red flags
    if (hook.deliveryMethod === 'exposition') {
      issues.push('Uses direct exposition instead of natural storytelling')
      suggestions.push('Convert to environmental storytelling or character dialogue')
      assessment = 'too-explicit'
    }

    if (hook.content.includes('as you know') || hook.content.includes('remember when')) {
      issues.push('Contains forced "as you know" dialogue')
      suggestions.push('Remove exposition dumps and use subtext instead')
      assessment = 'too-explicit'
    }

    if (hook.deliveryMethod === 'subtext' && hook.impact === 'high') {
      issues.push('High-impact hook buried in subtext')
      suggestions.push('Increase visibility through environmental cues or character reactions')
      assessment = 'too-buried'
    }

    if (hook.deliveryMethod === 'dialogue' && hook.content.length > 100) {
      issues.push('Hook delivery is too verbose')
      suggestions.push('Simplify dialogue and use visual cues')
      assessment = 'too-explicit'
    }

    // Check for natural integration opportunities
    if (hook.deliveryMethod === 'exposition' || hook.deliveryMethod === 'dialogue') {
      const naturalMethod = this.suggestNaturalIntegration(hook)
      if (naturalMethod) {
        suggestions.push(`Consider using ${naturalMethod} instead`)
      }
    }

    return {
      hookId: hook.id,
      currentDelivery: hook.deliveryMethod,
      assessment,
      issues,
      suggestions,
      explicitPermission: this.shouldAllowExplicit(hook)
    }
  }

  private suggestNaturalIntegration(hook: NarrativeHook): string | null {
    switch (hook.type) {
      case 'mystery':
        return 'environmental storytelling with visual cues'
      case 'foreshadowing':
        return 'character subtext and subtle dialogue'
      case 'tension':
        return 'character actions and reactions'
      case 'world':
        return 'environmental details and player discovery'
      default:
        return null
    }
  }

  private shouldAllowExplicit(hook: NarrativeHook): boolean {
    // Allow explicit delivery for high-impact, resolved hooks
    return hook.impact === 'high' && hook.status === 'resolved'
  }

  /**
   * Get all narrative hooks
   */
  getNarrativeHooks(): NarrativeHook[] {
    return Array.from(this.hooks.values())
  }

  /**
   * Get hook delivery assessments
   */
  getHookDeliveryAssessments(): HookDeliveryAssessment[] {
    return Array.from(this.deliveryAssessments.values())
  }

  /**
   * Get hooks that need attention
   */
  getHooksNeedingAttention(): {
    tooExplicit: NarrativeHook[]
    tooBuried: NarrativeHook[]
    redFlags: string[]
  } {
    const tooExplicit: NarrativeHook[] = []
    const tooBuried: NarrativeHook[] = []
    const redFlags: string[] = []

    this.hooks.forEach(hook => {
      const assessment = this.deliveryAssessments.get(hook.id)
      if (assessment) {
        if (assessment.assessment === 'too-explicit') {
          tooExplicit.push(hook)
        }
        if (assessment.assessment === 'too-buried') {
          tooBuried.push(hook)
        }
        redFlags.push(...assessment.issues)
      }
    })

    return { tooExplicit, tooBuried, redFlags }
  }

  /**
   * Get natural integration suggestions
   */
  getNaturalIntegrationSuggestions(): NaturalIntegration[] {
    const suggestions: NaturalIntegration[] = []

    this.hooks.forEach(hook => {
      const assessment = this.deliveryAssessments.get(hook.id)
      if (assessment && assessment.suggestions.length > 0) {
        const naturalMethod = this.suggestNaturalIntegration(hook)
        if (naturalMethod) {
          suggestions.push({
            hookId: hook.id,
            currentMethod: hook.deliveryMethod,
            suggestedMethod: naturalMethod,
            implementation: this.getImplementationExample(hook, naturalMethod),
            reasoning: this.getReasoningForMethod(hook, naturalMethod)
          })
        }
      }
    })

    return suggestions
  }

  private getImplementationExample(hook: NarrativeHook, method: string): string {
    switch (method) {
      case 'environmental storytelling with visual cues':
        return `Show ${hook.content} through visual details, environmental changes, or character reactions rather than dialogue`
      case 'character subtext and subtle dialogue':
        return `Have characters hint at ${hook.content} through their actions, reactions, or subtle dialogue`
      case 'character actions and reactions':
        return `Show ${hook.content} through what characters do and how they respond to situations`
      case 'environmental details and player discovery':
        return `Let players discover ${hook.content} through exploration and environmental clues`
      default:
        return `Implement ${hook.content} using ${method}`
    }
  }

  private getReasoningForMethod(hook: NarrativeHook, method: string): string {
    switch (method) {
      case 'environmental storytelling with visual cues':
        return 'Environmental storytelling is more immersive and allows players to discover information naturally'
      case 'character subtext and subtle dialogue':
        return 'Subtext creates depth and allows players to piece together information themselves'
      case 'character actions and reactions':
        return 'Actions show character development and create emotional investment'
      case 'environmental details and player discovery':
        return 'Player discovery creates agency and makes information feel earned'
      default:
        return 'Natural integration creates better player engagement and immersion'
    }
  }

  /**
   * Get explicit permission zones
   */
  getExplicitPermissionZones(): NarrativeHook[] {
    return Array.from(this.hooks.values()).filter(hook => {
      const assessment = this.deliveryAssessments.get(hook.id)
      return assessment?.explicitPermission === true
    })
  }

  /**
   * Update hook status
   */
  updateHookStatus(hookId: string, status: 'active' | 'resolved' | 'abandoned'): void {
    const hook = this.hooks.get(hookId)
    if (hook) {
      hook.status = status
    }
  }

  /**
   * Add new hook
   */
  addHook(hook: NarrativeHook): void {
    this.hooks.set(hook.id, hook)
    const assessment = this.assessHook(hook)
    this.deliveryAssessments.set(hook.id, assessment)
  }

  /**
   * Get red flags summary
   */
  getRedFlagsSummary(): {
    totalRedFlags: number
    criticalIssues: string[]
    commonProblems: string[]
  } {
    const allRedFlags = Array.from(this.deliveryAssessments.values())
      .flatMap(assessment => assessment.issues)

    const criticalIssues = allRedFlags.filter(flag => 
      flag.includes('exposition') || flag.includes('as you know')
    )

    const commonProblems = allRedFlags.filter(flag => 
      flag.includes('verbose') || flag.includes('buried')
    )

    return {
      totalRedFlags: allRedFlags.length,
      criticalIssues,
      commonProblems
    }
  }
}

// Singleton instance
let hookIntegrationSystem: HookIntegrationSystem | null = null

export function getHookIntegrationSystem(): HookIntegrationSystem {
  if (!hookIntegrationSystem) {
    hookIntegrationSystem = new HookIntegrationSystem()
  }
  return hookIntegrationSystem
}
