/**
 * Comprehensive Narrative Quality Report
 * Combines Sub-Agent 1 (Narrative Analysis) and Sub-Agent 2 (Hook Integration)
 * Provides actionable insights for improving existing hooks and narrative
 */

import { getNarrativeAnalysisSystem, StoryArc, CharacterJourney, NarrativeConsistency, PacingAnalysis } from './narrative-analysis-system'
import { getHookIntegrationSystem, NarrativeHook, HookDeliveryAssessment, NaturalIntegration } from './hook-integration-system'

export interface NarrativeQualityReport {
  overallScore: number
  strengths: string[]
  criticalIssues: string[]
  recommendations: string[]
  storyArcAnalysis: StoryArc[]
  characterJourneyAnalysis: CharacterJourney[]
  hookAnalysis: HookDeliveryAssessment[]
  naturalIntegrationSuggestions: NaturalIntegration[]
  priorityFixes: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

export interface QualityMetrics {
  narrativeCompletion: number
  hookEffectiveness: number
  characterDevelopment: number
  worldBuilding: number
  pacing: number
  consistency: number
}

export class NarrativeQualityReporter {
  private narrativeSystem = getNarrativeAnalysisSystem()
  private hookSystem = getHookIntegrationSystem()

  /**
   * Generate comprehensive narrative quality report
   */
  generateReport(): NarrativeQualityReport {
    const storyArcs = this.narrativeSystem.analyzeStoryArcs()
    const characterJourneys = this.narrativeSystem.analyzeCharacterJourneys()
    const consistencyIssues = this.narrativeSystem.getConsistencyIssues()
    const pacingAnalysis = this.narrativeSystem.getPacingAnalysis()
    const hookAssessments = this.hookSystem.getHookDeliveryAssessments()
    const naturalIntegrations = this.hookSystem.getNaturalIntegrationSuggestions()
    const hooksNeedingAttention = this.hookSystem.getHooksNeedingAttention()

    const qualityMetrics = this.calculateQualityMetrics()
    const overallScore = this.calculateOverallScore(qualityMetrics)

    return {
      overallScore,
      strengths: this.identifyStrengths(storyArcs, characterJourneys, hookAssessments),
      criticalIssues: this.identifyCriticalIssues(consistencyIssues, hooksNeedingAttention),
      recommendations: this.generateRecommendations(consistencyIssues, naturalIntegrations, pacingAnalysis),
      storyArcAnalysis: storyArcs,
      characterJourneyAnalysis: characterJourneys,
      hookAnalysis: hookAssessments,
      naturalIntegrationSuggestions: naturalIntegrations,
      priorityFixes: this.categorizePriorityFixes(consistencyIssues, hooksNeedingAttention)
    }
  }

  calculateQualityMetrics(): QualityMetrics {
    const completionStatus = this.narrativeSystem.getNarrativeCompletionStatus()
    const hooksNeedingAttention = this.hookSystem.getHooksNeedingAttention()
    const redFlagsSummary = this.hookSystem.getRedFlagsSummary()

    return {
      narrativeCompletion: completionStatus.overallCompletion,
      hookEffectiveness: this.calculateHookEffectiveness(),
      characterDevelopment: this.calculateCharacterDevelopment(),
      worldBuilding: this.calculateWorldBuilding(),
      pacing: this.calculatePacing(),
      consistency: this.calculateConsistency()
    }
  }

  private calculateHookEffectiveness(): number {
    const hooks = this.hookSystem.getNarrativeHooks()
    const activeHooks = hooks.filter(hook => hook.status === 'active')
    const wellBalancedHooks = activeHooks.filter(hook => hook.subtletyLevel === 'well-balanced')
    return Math.round((wellBalancedHooks.length / activeHooks.length) * 100)
  }

  private calculateCharacterDevelopment(): number {
    const journeys = this.narrativeSystem.analyzeCharacterJourneys()
    const onTrackJourneys = journeys.filter(journey => journey.alignment === 'on-track')
    return Math.round((onTrackJourneys.length / journeys.length) * 100)
  }

  private calculateWorldBuilding(): number {
    const hooks = this.hookSystem.getNarrativeHooks()
    const worldHooks = hooks.filter(hook => hook.type === 'world')
    const activeWorldHooks = worldHooks.filter(hook => hook.status === 'active')
    return Math.round((activeWorldHooks.length / worldHooks.length) * 100)
  }

  private calculatePacing(): number {
    const pacingAnalysis = this.narrativeSystem.getPacingAnalysis()
    const goodPacing = pacingAnalysis.filter(pacing => pacing.balance === 'good')
    return Math.round((goodPacing.length / pacingAnalysis.length) * 100)
  }

  private calculateConsistency(): number {
    const consistencyIssues = this.narrativeSystem.getConsistencyIssues()
    const criticalIssues = consistencyIssues.filter(issue => issue.severity === 'critical')
    const majorIssues = consistencyIssues.filter(issue => issue.severity === 'major')
    
    // Lower score for more critical issues
    let score = 100
    score -= criticalIssues.length * 20
    score -= majorIssues.length * 10
    return Math.max(0, score)
  }

  private calculateOverallScore(metrics: QualityMetrics): number {
    const weights = {
      narrativeCompletion: 0.25,
      hookEffectiveness: 0.20,
      characterDevelopment: 0.20,
      worldBuilding: 0.15,
      pacing: 0.10,
      consistency: 0.10
    }

    return Math.round(
      metrics.narrativeCompletion * weights.narrativeCompletion +
      metrics.hookEffectiveness * weights.hookEffectiveness +
      metrics.characterDevelopment * weights.characterDevelopment +
      metrics.worldBuilding * weights.worldBuilding +
      metrics.pacing * weights.pacing +
      metrics.consistency * weights.consistency
    )
  }

  private identifyStrengths(
    storyArcs: StoryArc[],
    characterJourneys: CharacterJourney[],
    hookAssessments: HookDeliveryAssessment[]
  ): string[] {
    const strengths: string[] = []

    // Story arc strengths
    const highCompletionArcs = storyArcs.filter(arc => arc.completionPercentage > 80)
    if (highCompletionArcs.length > 0) {
      strengths.push(`${highCompletionArcs.length} story arcs are well-developed (80%+ completion)`)
    }

    // Character journey strengths
    const onTrackJourneys = characterJourneys.filter(journey => journey.alignment === 'on-track')
    if (onTrackJourneys.length > 0) {
      strengths.push(`${onTrackJourneys.length} character journeys are on-track`)
    }

    // Hook strengths
    const wellBalancedHooks = hookAssessments.filter(assessment => assessment.assessment === 'well-balanced')
    if (wellBalancedHooks.length > 0) {
      strengths.push(`${wellBalancedHooks.length} narrative hooks are well-balanced`)
    }

    // Specific strengths
    strengths.push('Strong Birmingham integration with authentic local references')
    strengths.push('Compelling character crises that drive career exploration')
    strengths.push('Effective train station metaphor for career paths')
    strengths.push('Good balance of mystery and practical career guidance')

    return strengths
  }

  private identifyCriticalIssues(
    consistencyIssues: NarrativeConsistency[],
    hooksNeedingAttention: any
  ): string[] {
    const criticalIssues: string[] = []

    // Critical consistency issues
    const criticalConsistency = consistencyIssues.filter(issue => issue.severity === 'critical')
    criticalConsistency.forEach(issue => {
      criticalIssues.push(`${issue.issue} (${issue.location})`)
    })

    // Critical hook issues
    if (hooksNeedingAttention.redFlags.length > 0) {
      criticalIssues.push(`${hooksNeedingAttention.redFlags.length} red flags in hook delivery`)
    }

    // Specific critical issues
    criticalIssues.push('Platform 7 purpose needs clearer establishment')
    criticalIssues.push('Samuel\'s temporal paradoxes may confuse Birmingham youth')
    criticalIssues.push('Some high-impact hooks are buried in subtext')

    return criticalIssues
  }

  private generateRecommendations(
    consistencyIssues: NarrativeConsistency[],
    naturalIntegrations: NaturalIntegration[],
    pacingAnalysis: PacingAnalysis[]
  ): string[] {
    const recommendations: string[] = []

    // Consistency recommendations
    consistencyIssues.forEach(issue => {
      recommendations.push(issue.suggestedFix)
    })

    // Natural integration recommendations
    naturalIntegrations.forEach(integration => {
      recommendations.push(`Convert ${integration.hookId} from ${integration.currentMethod} to ${integration.suggestedMethod}`)
    })

    // Pacing recommendations
    pacingAnalysis.forEach(pacing => {
      if (pacing.balance === 'too-intense') {
        recommendations.push(`Add more quiet moments to ${pacing.chapter}`)
      }
      if (pacing.balance === 'too-slow') {
        recommendations.push(`Increase intensity in ${pacing.chapter}`)
      }
    })

    // General recommendations
    recommendations.push('Simplify Samuel\'s language while maintaining train conductor metaphor')
    recommendations.push('Add transitional scenes between character crises and career exploration')
    recommendations.push('Increase visibility of environmental storytelling elements')
    recommendations.push('Use more character subtext and less direct exposition')

    return recommendations
  }

  private categorizePriorityFixes(
    consistencyIssues: NarrativeConsistency[],
    hooksNeedingAttention: any
  ): {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  } {
    const immediate: string[] = []
    const shortTerm: string[] = []
    const longTerm: string[] = []

    // Critical issues are immediate
    const criticalIssues = consistencyIssues.filter(issue => issue.severity === 'critical')
    criticalIssues.forEach(issue => {
      immediate.push(issue.suggestedFix)
    })

    // Major issues are short-term
    const majorIssues = consistencyIssues.filter(issue => issue.severity === 'major')
    majorIssues.forEach(issue => {
      shortTerm.push(issue.suggestedFix)
    })

    // Minor issues are long-term
    const minorIssues = consistencyIssues.filter(issue => issue.severity === 'minor')
    minorIssues.forEach(issue => {
      longTerm.push(issue.suggestedFix)
    })

    // Hook improvements
    if (hooksNeedingAttention.tooExplicit.length > 0) {
      shortTerm.push('Convert explicit hook delivery to natural storytelling')
    }
    if (hooksNeedingAttention.tooBuried.length > 0) {
      shortTerm.push('Increase visibility of buried hooks')
    }

    return { immediate, shortTerm, longTerm }
  }

  /**
   * Get executive summary
   */
  getExecutiveSummary(): string {
    const report = this.generateReport()
    const metrics = this.calculateQualityMetrics()

    return `
NARRATIVE QUALITY EXECUTIVE SUMMARY

Overall Score: ${report.overallScore}/100

STRENGTHS:
${report.strengths.map(strength => `• ${strength}`).join('\n')}

CRITICAL ISSUES:
${report.criticalIssues.map(issue => `• ${issue}`).join('\n')}

TOP RECOMMENDATIONS:
${report.recommendations.slice(0, 5).map(rec => `• ${rec}`).join('\n')}

QUALITY METRICS:
• Narrative Completion: ${metrics.narrativeCompletion}%
• Hook Effectiveness: ${metrics.hookEffectiveness}%
• Character Development: ${metrics.characterDevelopment}%
• World Building: ${metrics.worldBuilding}%
• Pacing: ${metrics.pacing}%
• Consistency: ${metrics.consistency}%

PRIORITY ACTIONS:
IMMEDIATE: ${report.priorityFixes.immediate.length} critical fixes needed
SHORT-TERM: ${report.priorityFixes.shortTerm.length} improvements recommended
LONG-TERM: ${report.priorityFixes.longTerm.length} enhancements planned
    `.trim()
  }
}

// Singleton instance
let narrativeQualityReporter: NarrativeQualityReporter | null = null

export function getNarrativeQualityReporter(): NarrativeQualityReporter {
  if (!narrativeQualityReporter) {
    narrativeQualityReporter = new NarrativeQualityReporter()
  }
  return narrativeQualityReporter
}
