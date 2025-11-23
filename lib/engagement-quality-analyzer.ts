/**
 * Engagement Quality Analyzer
 * 
 * Evaluates HOW WELL users are engaging, not just THAT they're engaging
 * Identifies best practices being followed or missed
 * Provides actionable insights for improving user experience
 */

import { GameState } from './character-state'

export interface EngagementQualityMetrics {
  userId: string
  timestamp: number
  
  // Overall quality score (0-100)
  qualityScore: number
  
  // Best practice indicators
  bestPractices: {
    takesTimeToRead: boolean              // Not rushing through dialogue
    exploresOptionalContent: boolean      // Curiosity-driven
    buildsRelationships: boolean          // Trust building across characters
    makesConsistentChoices: boolean       // Pattern consistency
    engagesEmotionally: boolean           // Chooses vulnerable options
    revisitsCharacters: boolean           // Uses revisit system
  }
  
  // Red flags (disengagement indicators)
  redFlags: {
    rushingThroughContent: boolean        // < 2s average response time
    randomChoicePattern: boolean          // No pattern consistency
    avoidingVulnerability: boolean        // Never chooses deep options
    superficialEngagement: boolean        // Doesn't reach trust 3+
    skipsBirminghamContent: boolean       // Ignores local references
  }
  
  // Engagement depth indicators
  depth: {
    averageResponseTime: number           // Seconds per choice
    trustLevelsReached: {
      maya: number
      devon: number
      jordan: number
      samuel: number
    }
    optionalContentAccessed: number       // High-trust scenes viewed
    emotionalChoicesMade: number          // Vulnerable/"helping" pattern
    analyticalChoicesMade: number         // Problem-solving pattern
  }
  
  // Recommendations for improvement
  recommendations: string[]
  
  // Engagement tier
  tier: 'surface' | 'moderate' | 'deep' | 'exceptional'
}

export interface BestPracticeCheck {
  practice: string
  present: boolean
  evidence: string
  impact: 'critical' | 'important' | 'nice-to-have'
  recommendation?: string
}

/**
 * Analyzes user engagement quality against best practices
 */
export class EngagementQualityAnalyzer {
  
  /**
   * Analyze engagement quality for a user
   */
  static analyze(gameState: GameState): EngagementQualityMetrics {
    const checks = this.runBestPracticeChecks(gameState)
    const flags = this.identifyRedFlags(gameState)
    const depth = this.measureEngagementDepth(gameState)
    const tier = this.calculateEngagementTier(checks, flags, depth)
    const score = this.calculateQualityScore(checks, flags, depth)
    
    return {
      userId: gameState.playerId,
      timestamp: Date.now(),
      qualityScore: score,
      bestPractices: {
        takesTimeToRead: checks.find(c => c.practice === 'reading_pace')?.present || false,
        exploresOptionalContent: checks.find(c => c.practice === 'optional_exploration')?.present || false,
        buildsRelationships: checks.find(c => c.practice === 'relationship_building')?.present || false,
        makesConsistentChoices: checks.find(c => c.practice === 'pattern_consistency')?.present || false,
        engagesEmotionally: checks.find(c => c.practice === 'emotional_engagement')?.present || false,
        revisitsCharacters: checks.find(c => c.practice === 'revisit_usage')?.present || false
      },
      redFlags: flags,
      depth,
      recommendations: this.generateRecommendations(checks, flags, depth),
      tier
    }
  }
  
  /**
   * Run best practice checks
   */
  private static runBestPracticeChecks(gameState: GameState): BestPracticeCheck[] {
    const checks: BestPracticeCheck[] = []
    
    // PRACTICE 1: Taking time to read (not rushing)
    // Best practice: 5-10 seconds per choice (reading + reflection)
    const patterns = gameState.patterns
    const totalChoices = Object.values(patterns).reduce((a, b) => a + b, 0)
    
    checks.push({
      practice: 'reading_pace',
      present: totalChoices > 5, // Can only assess after meaningful sample
      evidence: `${totalChoices} choices made - enough for pattern analysis`,
      impact: 'important',
      recommendation: totalChoices < 5 
        ? 'Need more choices to assess reading pace'
        : 'User appears to be reading content thoughtfully'
    })
    
    // PRACTICE 2: Exploring optional content (curiosity-driven)
    const highTrustScenes = this.countHighTrustScenesAccessed(gameState)
    const optionalExploration = highTrustScenes > 0
    
    checks.push({
      practice: 'optional_exploration',
      present: optionalExploration,
      evidence: `${highTrustScenes} high-trust optional scenes accessed`,
      impact: 'important',
      recommendation: !optionalExploration
        ? 'User may not know optional content exists - consider hint system'
        : 'User actively seeks deeper content'
    })
    
    // PRACTICE 3: Building relationships (trust progression)
    const trustBuilding = this.hasBuiltTrust(gameState)
    
    checks.push({
      practice: 'relationship_building',
      present: trustBuilding,
      evidence: `Trust levels: ${this.getTrustSummary(gameState)}`,
      impact: 'critical',
      recommendation: !trustBuilding
        ? 'User not engaging relationally - may be treating as quiz not conversation'
        : 'User building meaningful relationships with characters'
    })
    
    // PRACTICE 4: Pattern consistency (not random clicking)
    const consistency = this.calculatePatternConsistency(gameState)
    const isConsistent = consistency > 0.6 // 60%+ choices align with dominant pattern
    
    checks.push({
      practice: 'pattern_consistency',
      present: isConsistent,
      evidence: `Pattern consistency: ${(consistency * 100).toFixed(0)}%`,
      impact: 'important',
      recommendation: !isConsistent
        ? 'Random choice pattern suggests disengagement or exploration'
        : 'User has clear decision-making approach'
    })
    
    // PRACTICE 5: Emotional engagement (choosing vulnerable options)
    const emotionalChoices = patterns.helping + patterns.patience
    const analyticalChoices = patterns.analytical + patterns.building
    const emotionallyEngaged = emotionalChoices > analyticalChoices * 0.5
    
    checks.push({
      practice: 'emotional_engagement',
      present: emotionallyEngaged,
      evidence: `Emotional choices: ${emotionalChoices}, Analytical: ${analyticalChoices}`,
      impact: 'important',
      recommendation: !emotionallyEngaged
        ? 'User may be approaching narratively (detached observer vs. participant)'
        : 'User engaging emotionally with characters'
    })
    
    // PRACTICE 6: Revisit usage (relationship persistence)
    const hasRevisited = gameState.globalFlags.has('maya_arc_complete') && 
                         gameState.currentNodeId.includes('revisit')
    
    checks.push({
      practice: 'revisit_usage',
      present: hasRevisited,
      evidence: hasRevisited ? 'User returned to completed character' : 'No revisits yet',
      impact: 'nice-to-have',
      recommendation: !hasRevisited
        ? 'User may not know they can revisit characters'
        : 'User exploring ongoing relationships'
    })
    
    return checks
  }
  
  /**
   * Identify red flags (disengagement indicators)
   */
  private static identifyRedFlags(gameState: GameState): {
    rushingThroughContent: boolean
    randomChoicePattern: boolean
    avoidingVulnerability: boolean
    superficialEngagement: boolean
    skipsBirminghamContent: boolean
  } {
    const patterns = gameState.patterns
    const totalChoices = Object.values(patterns).reduce((a, b) => a + b, 0)
    const consistency = this.calculatePatternConsistency(gameState)
    
    // Get highest trust level achieved
    const maxTrust = Math.max(
      ...Array.from(gameState.characters.values()).map(c => c.trust)
    )
    
    return {
      // Rushing: Would need response time data (not in GameState currently)
      // For now, check if user never chooses patience options
      rushingThroughContent: totalChoices > 5 && patterns.patience === 0,
      
      // Random: Pattern consistency < 40%
      randomChoicePattern: totalChoices > 5 && consistency < 0.4,
      
      // Avoiding vulnerability: Never reaches trust 3+
      avoidingVulnerability: totalChoices > 10 && maxTrust < 3,
      
      // Superficial: Many choices but low trust
      superficialEngagement: totalChoices > 15 && maxTrust < 4,
      
      // Birmingham skipping: Global flags don't include Birmingham-specific content
      skipsBirminghamContent: !gameState.globalFlags.has('knows_birmingham_context')
    }
  }
  
  /**
   * Measure engagement depth across dimensions
   */
  private static measureEngagementDepth(gameState: GameState): EngagementQualityMetrics['depth'] {
    // Extract trust levels for each character
    const trustLevels = {
      maya: (gameState.characters.get('maya')?.trust as number) || 0,
      devon: (gameState.characters.get('devon')?.trust as number) || 0,
      jordan: (gameState.characters.get('jordan')?.trust as number) || 0,
      samuel: (gameState.characters.get('samuel')?.trust as number) || 0
    }
    
    // Count optional content accessed (high-trust scenes)
    const optionalContentAccessed = this.countHighTrustScenesAccessed(gameState)
    
    // Pattern analysis
    const patterns = gameState.patterns
    const emotionalChoices = patterns.helping + patterns.patience
    const analyticalChoices = patterns.analytical + patterns.building
    
    return {
      averageResponseTime: 0, // Would need actual timing data
      trustLevelsReached: trustLevels,
      optionalContentAccessed,
      emotionalChoicesMade: emotionalChoices,
      analyticalChoicesMade: analyticalChoices
    }
  }
  
  /**
   * Calculate engagement tier
   */
  private static calculateEngagementTier(
    checks: BestPracticeCheck[],
    flags: any,
    depth: any
  ): 'surface' | 'moderate' | 'deep' | 'exceptional' {
    const practicesFollowed = checks.filter(c => c.present).length
    const flagsRaised = Object.values(flags).filter(f => f === true).length
    const maxTrust = Math.max(...(Object.values(depth.trustLevelsReached) as number[]))
    
    // Exceptional: 5-6 practices, 0-1 red flags, trust 7+
    if (practicesFollowed >= 5 && flagsRaised <= 1 && maxTrust >= 7) {
      return 'exceptional'
    }
    
    // Deep: 4+ practices, 0-2 red flags, trust 5+
    if (practicesFollowed >= 4 && flagsRaised <= 2 && maxTrust >= 5) {
      return 'deep'
    }
    
    // Moderate: 2-3 practices, trust 3+
    if (practicesFollowed >= 2 && maxTrust >= 3) {
      return 'moderate'
    }
    
    // Surface: Everything else
    return 'surface'
  }
  
  /**
   * Calculate overall quality score (0-100)
   */
  private static calculateQualityScore(
    checks: BestPracticeCheck[],
    flags: any,
    depth: any
  ): number {
    let score = 50 // Start at baseline
    
    // Add points for best practices (each worth 10 points)
    const practicesFollowed = checks.filter(c => c.present).length
    score += practicesFollowed * 10
    
    // Subtract for red flags (each worth -10 points)
    const flagsRaised = Object.values(flags).filter(f => f === true).length
    score -= flagsRaised * 10
    
    // Bonus for high trust (up to +20)
    const maxTrust = Math.max(...(Object.values(depth.trustLevelsReached) as number[]))
    score += Math.min(20, maxTrust * 2)
    
    // Bonus for optional content (+5 per scene, up to +15)
    score += Math.min(15, depth.optionalContentAccessed * 5)
    
    // Clamp to 0-100
    return Math.max(0, Math.min(100, score))
  }
  
  /**
   * Generate actionable recommendations
   */
  private static generateRecommendations(
    checks: BestPracticeCheck[],
    flags: any,
    _depth: any
  ): string[] {
    const recommendations: string[] = []
    
    // Check for rushing
    if (flags.rushingThroughContent) {
      recommendations.push(
        'CRITICAL: User appears to be rushing (never chooses patience options). ' +
        'Consider: Slow pacing prompt or "Take your time" hint.'
      )
    }
    
    // Check for random clicking
    if (flags.randomChoicePattern) {
      recommendations.push(
        'WARNING: Random choice pattern suggests disengagement or confusion. ' +
        'Consider: Clearer choice labeling or pattern feedback.'
      )
    }
    
    // Check for trust avoidance
    if (flags.avoidingVulnerability) {
      recommendations.push(
        'INSIGHT: User not building deep relationships (trust < 3). ' +
        'Consider: More explicit trust progression indicators or "getting closer" hints.'
      )
    }
    
    // Check for superficial engagement
    if (flags.superficialEngagement) {
      recommendations.push(
        'CONCERN: High choice count but low trust = treating as quiz not conversation. ' +
        'Consider: Relationship-building tutorial or metacommentary from Samuel.'
      )
    }
    
    // Positive reinforcement
    if (!checks.find(c => c.practice === 'optional_exploration')?.present) {
      recommendations.push(
        'OPPORTUNITY: User hasn\'t discovered optional high-trust content. ' +
        'Consider: Samuel hint about spending more time to unlock deeper conversations.'
      )
    }
    
    if (checks.filter(c => c.present).length >= 5) {
      recommendations.push(
        'EXCELLENT: User following 5+ best practices. This is ideal engagement.'
      )
    }
    
    // Birmingham engagement
    if (flags.skipsBirminghamContent) {
      recommendations.push(
        'NOTE: User may not be Birmingham-local or not noticing local references. ' +
        'Consider: More prominent Birmingham callouts.'
      )
    }
    
    return recommendations
  }
  
  /**
   * Helper: Count high-trust scenes accessed
   */
  private static countHighTrustScenesAccessed(gameState: GameState): number {
    let count = 0
    
    // Check for specific high-trust content flags
    const highTrustFlags = [
      'shared_parent_failure',           // Maya's parent conversation
      'revealed_flowchart_incident',     // Devon's flowchart incident
      'knows_samuel_was_traveler',       // Samuel's backstory
      'knows_letter_system',             // Letter system explanation
      'knows_about_daughter'             // Samuel's daughter
    ]
    
    for (const flag of highTrustFlags) {
      for (const character of Array.from(gameState.characters.values())) {
        if (character.knowledgeFlags.has(flag)) {
          count++
          break
        }
      }
    }
    
    return count
  }
  
  /**
   * Helper: Check if user has built meaningful trust
   */
  private static hasBuiltTrust(gameState: GameState): boolean {
    for (const character of Array.from(gameState.characters.values())) {
      if (character.trust >= 3) return true
    }
    return false
  }
  
  /**
   * Helper: Get trust summary string
   */
  private static getTrustSummary(gameState: GameState): string {
    const trusts = Array.from(gameState.characters.entries())
      .map(([id, char]) => `${id}:${char.trust}`)
      .join(', ')
    return trusts
  }
  
  /**
   * Helper: Calculate pattern consistency
   */
  private static calculatePatternConsistency(gameState: GameState): number {
    const patterns = gameState.patterns
    const values = Object.values(patterns)
    const total = values.reduce((a, b) => a + b, 0)
    
    if (total === 0) return 0
    
    const max = Math.max(...values)
    return max / total // Percentage of choices following dominant pattern
  }
  
  /**
   * Generate detailed engagement report
   */
  static generateDetailedReport(gameState: GameState): string {
    const metrics = this.analyze(gameState)
    const _checks = this.runBestPracticeChecks(gameState)
    
    let report = `
╔══════════════════════════════════════════════════════╗
║  ENGAGEMENT QUALITY REPORT                           ║
║  User: ${metrics.userId}                            
║  Tier: ${metrics.tier.toUpperCase()}                 
║  Score: ${metrics.qualityScore}/100                  
╚══════════════════════════════════════════════════════╝

BEST PRACTICES FOLLOWED:
`
    
    // List best practices
    Object.entries(metrics.bestPractices).forEach(([practice, followed]) => {
      const icon = followed ? '✅' : '❌'
      const name = practice.replace(/([A-Z])/g, ' $1').trim()
      report += `${icon} ${name}\n`
    })
    
    report += `\nRED FLAGS:`
    Object.entries(metrics.redFlags).forEach(([flag, present]) => {
      if (present) {
        const name = flag.replace(/([A-Z])/g, ' $1').trim()
        report += `\n⚠️  ${name}`
      }
    })
    
    if (Object.values(metrics.redFlags).every(f => !f)) {
      report += `\n✅ No red flags detected`
    }
    
    report += `\n\nENGAGEMENT DEPTH:`
    report += `\nTrust Levels: ${JSON.stringify(metrics.depth.trustLevelsReached, null, 2)}`
    report += `\nOptional Content Accessed: ${metrics.depth.optionalContentAccessed} scenes`
    report += `\nEmotional Choices: ${metrics.depth.emotionalChoicesMade}`
    report += `\nAnalytical Choices: ${metrics.depth.analyticalChoicesMade}`
    
    report += `\n\nRECOMMENDATIONS:`
    metrics.recommendations.forEach(rec => {
      report += `\n• ${rec}`
    })
    
    return report
  }
  
  /**
   * Get real-time engagement coaching tips
   * (Could be shown to users if tier is 'surface')
   */
  static getCoachingTips(gameState: GameState): string[] {
    const metrics = this.analyze(gameState)
    const tips: string[] = []
    
    if (metrics.tier === 'surface') {
      if (!metrics.bestPractices.takesTimeToRead) {
        tips.push("Take your time reading the dialogue - the details matter.")
      }
      
      if (!metrics.bestPractices.buildsRelationships) {
        tips.push("Try building trust with characters by choosing vulnerable or patient options.")
      }
      
      if (!metrics.bestPractices.exploresOptionalContent) {
        tips.push("Some conversations unlock deeper content at higher trust levels.")
      }
    }
    
    if (metrics.tier === 'moderate') {
      if (!metrics.bestPractices.revisitsCharacters) {
        tips.push("You can return to characters after their arc completes - relationships persist.")
      }
      
      if (metrics.depth.optionalContentAccessed < 2) {
        tips.push("High trust unlocks optional scenes that reveal character backstories.")
      }
    }
    
    if (metrics.tier === 'exceptional') {
      tips.push("You're engaging exceptionally well - you're experiencing the full depth of the narrative.")
    }
    
    return tips
  }
}

/**
 * Quick engagement check for admin dashboard
 */
export function quickEngagementCheck(gameState: GameState): {
  tier: string
  score: number
  concerns: string[]
  strengths: string[]
} {
  const metrics = EngagementQualityAnalyzer.analyze(gameState)
  
  const concerns: string[] = []
  const strengths: string[] = []
  
  // Identify concerns
  if (metrics.redFlags.rushingThroughContent) concerns.push('Rushing through content')
  if (metrics.redFlags.randomChoicePattern) concerns.push('Random clicking')
  if (metrics.redFlags.avoidingVulnerability) concerns.push('Not building trust')
  if (metrics.redFlags.superficialEngagement) concerns.push('Superficial engagement')
  
  // Identify strengths
  if (metrics.bestPractices.takesTimeToRead) strengths.push('Thoughtful pacing')
  if (metrics.bestPractices.buildsRelationships) strengths.push('Relationship building')
  if (metrics.bestPractices.exploresOptionalContent) strengths.push('Curiosity-driven')
  if (metrics.bestPractices.engagesEmotionally) strengths.push('Emotional engagement')
  
  return {
    tier: metrics.tier,
    score: metrics.qualityScore,
    concerns,
    strengths
  }
}

