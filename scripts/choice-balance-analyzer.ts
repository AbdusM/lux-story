/**
 * Choice Balance Analyzer Script
 *
 * Ensures each scene offers balanced pattern distribution for inclusive representation.
 * This runs after pattern audit to optimize choice diversity across scenes.
 *
 * Goals:
 * - Each scene should ideally offer 2-4 different pattern approaches
 * - No single pattern should dominate a scene
 * - Players of all personality types should feel represented
 * - Identify scenes lacking diversity and suggest improvements
 */

import { GeminiContentFramework } from './gemini-content-framework'
import fs from 'fs'
import path from 'path'

interface SceneChoice {
  text: string
  pattern: string
  choiceIndex: number
}

interface SceneAnalysis {
  sceneId: string
  choices: SceneChoice[]
  patternDistribution: Record<string, number>
  uniquePatterns: number
  dominantPattern?: string
  missingPatterns: string[]
  balanceScore: number
}

interface BalanceRecommendation {
  sceneId: string
  current_patterns: string[]
  missing_patterns: string[]
  analysis: {
    balance_score: number
    diversity_rating: number
    inclusivity_rating: number
    recommendation_rationale: string
  }
  suggested_improvements: {
    action: 'add_choice' | 'modify_choice' | 'acceptable'
    new_choice_text?: string
    new_choice_pattern?: string
    modify_choice_index?: number
    modified_choice_text?: string
    confidence: number
  }
}

class ChoiceBalanceAnalyzer extends GeminiContentFramework {
  private scenes: Map<string, SceneAnalysis> = new Map()
  private filePath: string
  private targetPatterns = ['analytical', 'helping', 'building', 'patience']

  constructor() {
    super(process.env.GEMINI_API_KEY || '', 'gemini-1.5-flash')
    this.filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
  }

  /**
   * Extract and analyze all scenes
   */
  async extractScenes(): Promise<void> {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8')

    // Enhanced pattern to capture complete scenes with choices
    const scenePattern = /'([^']+)':\s*\{[^}]*?choices:\s*\[([\s\S]*?)\]/g

    let sceneMatch
    while ((sceneMatch = scenePattern.exec(fileContent)) !== null) {
      const sceneId = sceneMatch[1]
      const choicesBlock = sceneMatch[2]

      // Extract individual choices within this scene
      const choicePattern = /\{\s*text:\s*"([^"]*(?:\\.[^"]*)*)"\s*,[^}]*?pattern:\s*'([^']+)'/g

      const choices: SceneChoice[] = []
      const patternDistribution: Record<string, number> = {}

      let choiceMatch
      let choiceIndex = 0
      while ((choiceMatch = choicePattern.exec(choicesBlock)) !== null) {
        const choiceText = choiceMatch[1]
        const pattern = choiceMatch[2]

        choices.push({
          text: choiceText,
          pattern,
          choiceIndex
        })

        patternDistribution[pattern] = (patternDistribution[pattern] || 0) + 1
        choiceIndex++
      }

      if (choices.length > 0) {
        const analysis = this.analyzeSceneBalance(sceneId, choices, patternDistribution)
        this.scenes.set(sceneId, analysis)
      }
    }

    console.log(`📊 Found ${this.scenes.size} scenes with choices to analyze`)
  }

  /**
   * Analyze balance for a single scene
   */
  private analyzeSceneBalance(sceneId: string, choices: SceneChoice[], patternDistribution: Record<string, number>): SceneAnalysis {
    const uniquePatterns = Object.keys(patternDistribution).length
    const totalChoices = choices.length

    // Find dominant pattern (if any)
    let dominantPattern: string | undefined
    let maxCount = 0
    for (const [pattern, count] of Object.entries(patternDistribution)) {
      if (count > maxCount) {
        maxCount = count
        dominantPattern = pattern
      }
    }

    // A pattern is dominant if it represents >50% of choices
    if (maxCount / totalChoices <= 0.5) {
      dominantPattern = undefined
    }

    // Find missing target patterns
    const presentPatterns = new Set(Object.keys(patternDistribution))
    const missingPatterns = this.targetPatterns.filter(p => !presentPatterns.has(p))

    // Calculate balance score (0-10)
    // Higher score = better balance
    let balanceScore = 0

    // Diversity component (0-4): More unique patterns = higher score
    balanceScore += Math.min(uniquePatterns, 4)

    // Distribution component (0-3): Even distribution = higher score
    if (uniquePatterns > 1) {
      const maxRatio = Math.max(...Object.values(patternDistribution)) / totalChoices
      balanceScore += (1 - maxRatio) * 3
    }

    // Coverage component (0-3): Covering target patterns = higher score
    const targetCoverage = (this.targetPatterns.length - missingPatterns.length) / this.targetPatterns.length
    balanceScore += targetCoverage * 3

    return {
      sceneId,
      choices,
      patternDistribution,
      uniquePatterns,
      dominantPattern,
      missingPatterns,
      balanceScore: Math.round(balanceScore * 10) / 10
    }
  }

  /**
   * Generate balance improvement prompt
   */
  private getBalanceAnalysisPrompt(scene: SceneAnalysis): string {
    const patternList = Object.entries(scene.patternDistribution)
      .map(([pattern, count]) => `${pattern}: ${count}`)
      .join(', ')

    return `Analyze choice balance for this career exploration scene.

TARGET PATTERNS (ideally 2-4 per scene):
- analytical: Logic, data, systematic thinking
- helping: People-focused, empathetic, supportive
- building: Creative, hands-on, solution-making
- patience: Thoughtful, reflective, long-term

CURRENT SCENE: ${scene.sceneId}
Current Patterns: ${patternList}
Total Choices: ${scene.choices.length}
Missing Patterns: ${scene.missingPatterns.join(', ') || 'None'}
Balance Score: ${scene.balanceScore}/10

SCENE CHOICES:
${scene.choices.map((c, i) => `${i + 1}. "${c.text}" (${c.pattern})`).join('\n')}

Rate 1-10:
- Balance: How well distributed are the patterns?
- Diversity: Does this offer options for different personality types?
- Inclusivity: Would all players feel represented?

Recommend action:
- add_choice: Scene needs additional choice for missing pattern
- modify_choice: Change existing choice pattern for better balance
- acceptable: Current balance is adequate

Format as:
BALANCE: [1-10]
DIVERSITY: [1-10]
INCLUSIVITY: [1-10]
ACTION: [add_choice/modify_choice/acceptable]
NEW_TEXT: [text for new choice if adding]
NEW_PATTERN: [pattern for new choice if adding]
MODIFY_INDEX: [choice number to modify if changing]
MODIFY_TEXT: [new text if modifying]
CONFIDENCE: [0.1-1.0]
REASON: [brief explanation]`
  }

  /**
   * Analyze balance for a single scene using AI
   */
  async analyzeSceneBalanceWithAI(scene: SceneAnalysis): Promise<BalanceRecommendation | null> {
    console.log(`  ⚖️  Analyzing: ${scene.sceneId} (${scene.uniquePatterns} patterns, score: ${scene.balanceScore})`)

    try {
      const result = await this.model.generateContent(this.getBalanceAnalysisPrompt(scene))
      const responseText = result.response.text().trim()

      // Parse the simplified format
      const lines = responseText.split('\n').filter((line: string) => line.trim())
      const data: Record<string, string> = {}

      lines.forEach((line: string) => {
        const match = line.match(/^(\w+):\s*(.+)$/)
        if (match) {
          data[match[1].toLowerCase()] = match[2].trim()
        }
      })

      // Validate required fields
      if (!data.balance || !data.diversity || !data.inclusivity || !data.action || !data.confidence) {
        console.log(`  ⚠️ Missing required fields for ${scene.sceneId}`)
        return null
      }

      const confidence = parseFloat(data.confidence)
      if (confidence < 0.7) {
        console.log(`  ⚠️ Low confidence (${confidence}) for ${scene.sceneId}`)
        return null
      }

      // Create recommendation structure
      const recommendation: BalanceRecommendation = {
        sceneId: scene.sceneId,
        current_patterns: Object.keys(scene.patternDistribution),
        missing_patterns: scene.missingPatterns,
        analysis: {
          balance_score: parseInt(data.balance),
          diversity_rating: parseInt(data.diversity),
          inclusivity_rating: parseInt(data.inclusivity),
          recommendation_rationale: data.reason || 'No specific reason provided'
        },
        suggested_improvements: {
          action: data.action as 'add_choice' | 'modify_choice' | 'acceptable',
          new_choice_text: data.new_text || undefined,
          new_choice_pattern: data.new_pattern || undefined,
          modify_choice_index: data.modify_index ? parseInt(data.modify_index) - 1 : undefined, // Convert to 0-based
          modified_choice_text: data.modify_text || undefined,
          confidence: confidence
        }
      }

      // Log the analysis result
      const avgRating = (recommendation.analysis.balance_score + recommendation.analysis.diversity_rating + recommendation.analysis.inclusivity_rating) / 3
      if (avgRating < 7) {
        console.log(`  📈 Low rating (${avgRating.toFixed(1)}) - Action: ${recommendation.suggested_improvements.action}`)
      } else {
        console.log(`  ✅ Good rating (${avgRating.toFixed(1)}) - ${recommendation.suggested_improvements.action}`)
      }

      return recommendation

    } catch (error: any) {
      console.log(`  ❌ Failed to analyze ${scene.sceneId}: ${error.message}`)
      return null
    }
  }

  /**
   * Generate comprehensive balance report
   */
  private generateBalanceReport(
    sceneAnalyses: SceneAnalysis[],
    recommendations: BalanceRecommendation[]
  ): string {
    const totalScenes = sceneAnalyses.length
    const unbalancedScenes = sceneAnalyses.filter(s => s.balanceScore < 7).length
    const scenesNeedingAdditions = recommendations.filter(r => r.suggested_improvements.action === 'add_choice').length
    const scenesNeedingModifications = recommendations.filter(r => r.suggested_improvements.action === 'modify_choice').length

    // Pattern coverage analysis
    const patternCoverage: Record<string, number> = {}
    this.targetPatterns.forEach(pattern => {
      patternCoverage[pattern] = sceneAnalyses.filter(s =>
        Object.keys(s.patternDistribution).includes(pattern)
      ).length
    })

    // Balance score distribution
    const scoreRanges = {
      'Excellent (8-10)': sceneAnalyses.filter(s => s.balanceScore >= 8).length,
      'Good (6-7.9)': sceneAnalyses.filter(s => s.balanceScore >= 6 && s.balanceScore < 8).length,
      'Fair (4-5.9)': sceneAnalyses.filter(s => s.balanceScore >= 4 && s.balanceScore < 6).length,
      'Poor (0-3.9)': sceneAnalyses.filter(s => s.balanceScore < 4).length
    }

    let report = `# Choice Balance Analysis Report

Generated: ${new Date().toISOString()}

## Executive Summary
- Total Scenes Analyzed: ${totalScenes}
- Scenes with Poor Balance (<7): ${unbalancedScenes} (${((unbalancedScenes/totalScenes)*100).toFixed(1)}%)
- Scenes Needing New Choices: ${scenesNeedingAdditions}
- Scenes Needing Choice Modifications: ${scenesNeedingModifications}

## Pattern Coverage Across All Scenes
${Object.entries(patternCoverage).map(([pattern, count]) =>
  `- **${pattern}**: ${count}/${totalScenes} scenes (${((count/totalScenes)*100).toFixed(1)}%)`
).join('\n')}

## Balance Score Distribution
${Object.entries(scoreRanges).map(([range, count]) =>
  `- **${range}**: ${count} scenes (${((count/totalScenes)*100).toFixed(1)}%)`
).join('\n')}

## Scenes Requiring Attention

### High Priority: Poor Balance (Score < 4)
${sceneAnalyses.filter(s => s.balanceScore < 4).map(scene => {
  const rec = recommendations.find(r => r.sceneId === scene.sceneId)
  return `**${scene.sceneId}** (Score: ${scene.balanceScore}/10)
- Current Patterns: ${Object.keys(scene.patternDistribution).join(', ')}
- Missing Patterns: ${scene.missingPatterns.join(', ') || 'None'}
- Recommendation: ${rec?.suggested_improvements.action || 'No recommendation'}
${rec?.suggested_improvements.new_choice_text ? `- Suggested Addition: "${rec.suggested_improvements.new_choice_text}" (${rec.suggested_improvements.new_choice_pattern})` : ''}
`
}).join('\n')}

### Medium Priority: Fair Balance (Score 4-5.9)
${sceneAnalyses.filter(s => s.balanceScore >= 4 && s.balanceScore < 6).map(scene => {
  const rec = recommendations.find(r => r.sceneId === scene.sceneId)
  return `**${scene.sceneId}** (Score: ${scene.balanceScore}/10)
- Current Patterns: ${Object.keys(scene.patternDistribution).join(', ')}
- Missing Patterns: ${scene.missingPatterns.join(', ') || 'None'}
- Recommendation: ${rec?.suggested_improvements.action || 'No recommendation'}
`
}).join('\n')}

### New Choice Recommendations
${recommendations.filter(r => r.suggested_improvements.action === 'add_choice').map(rec =>
  `**${rec.sceneId}**
- Missing Patterns: ${rec.missing_patterns.join(', ')}
- Suggested Addition: "${rec.suggested_improvements.new_choice_text}"
- Pattern: ${rec.suggested_improvements.new_choice_pattern}
- Rationale: ${rec.analysis.recommendation_rationale}
`).join('\n')}

### Choice Modification Recommendations
${recommendations.filter(r => r.suggested_improvements.action === 'modify_choice').map(rec =>
  `**${rec.sceneId}**
- Choice to Modify: #${(rec.suggested_improvements.modify_choice_index || 0) + 1}
- New Text: "${rec.suggested_improvements.modified_choice_text}"
- Rationale: ${rec.analysis.recommendation_rationale}
`).join('\n')}

## Pattern Representation Issues

### Under-represented Patterns
${this.targetPatterns.filter(pattern => patternCoverage[pattern] < totalScenes * 0.6).map(pattern =>
  `- **${pattern}**: Only in ${patternCoverage[pattern]}/${totalScenes} scenes (${((patternCoverage[pattern]/totalScenes)*100).toFixed(1)}%)`
).join('\n')}

### Over-represented Patterns
${this.targetPatterns.filter(pattern => patternCoverage[pattern] > totalScenes * 0.8).map(pattern =>
  `- **${pattern}**: In ${patternCoverage[pattern]}/${totalScenes} scenes (${((patternCoverage[pattern]/totalScenes)*100).toFixed(1)}%)`
).join('\n')}

## Recommendations for Implementation

1. **Immediate Actions**:
   - Add ${scenesNeedingAdditions} new choices to improve pattern diversity
   - Modify ${scenesNeedingModifications} existing choices for better balance

2. **Pattern Balancing**:
   - Focus on under-represented patterns in future content
   - Ensure each major scene offers at least 3 different patterns

3. **Inclusivity Goals**:
   - Target 85%+ pattern coverage across all scenes
   - Maintain balance scores above 6.0 for all scenes

4. **Quality Assurance**:
   - Review scenes with dominant patterns (>50% single pattern)
   - Ensure pattern assignments are psychologically accurate

## Next Steps in Pipeline

After implementing balance improvements:
1. Run choice-quality-enhancer.ts to improve psychological sophistication
2. Run birmingham-integration-optimizer.ts for local relevance
3. Run consequence-consistency-auditor.ts for narrative coherence
`

    return report
  }

  /**
   * Run the full balance analysis
   */
  async run(): Promise<void> {
    console.log('⚖️  Starting Choice Balance Analysis...\n')

    // Extract all scenes
    await this.extractScenes()

    // Analyze balance for each scene
    const allRecommendations: BalanceRecommendation[] = []
    const sceneAnalyses = Array.from(this.scenes.values())

    // Sort by balance score (worst first)
    sceneAnalyses.sort((a, b) => a.balanceScore - b.balanceScore)

    console.log(`\n📊 Balance Score Distribution:`)
    console.log(`  Poor (<4): ${sceneAnalyses.filter(s => s.balanceScore < 4).length}`)
    console.log(`  Fair (4-6): ${sceneAnalyses.filter(s => s.balanceScore >= 4 && s.balanceScore < 6).length}`)
    console.log(`  Good (6-8): ${sceneAnalyses.filter(s => s.balanceScore >= 6 && s.balanceScore < 8).length}`)
    console.log(`  Excellent (8+): ${sceneAnalyses.filter(s => s.balanceScore >= 8).length}`)

    // Focus on scenes that need improvement (score < 7)
    const scenesToImprove = sceneAnalyses.filter(s => s.balanceScore < 7).slice(0, 10) // Limit for testing

    console.log(`\n⚖️  Analyzing ${scenesToImprove.length} scenes needing balance improvements`)

    const results = await this.batchProcess(
      scenesToImprove,
      async (scene) => {
        const recommendation = await this.analyzeSceneBalanceWithAI(scene)
        return recommendation
      },
      {
        batchSize: 2,
        delayMs: 5000,
        onProgress: (current, total) => {
          if (current % 2 === 0) {
            console.log(`   Progress: ${current}/${total}`)
          }
        }
      }
    )

    results.forEach(r => {
      if (r) allRecommendations.push(r)
    })

    console.log(`\n✅ Analyzed ${allRecommendations.length} scenes for balance improvements\n`)

    // No automatic implementation for balance - this requires manual review
    // Generate comprehensive report instead
    const report = this.generateBalanceReport(sceneAnalyses, allRecommendations)
    fs.writeFileSync('choice-balance-analysis-report.md', report, 'utf-8')
    console.log('📄 Report saved to choice-balance-analysis-report.md')
    console.log('⚖️  Choice balance analysis complete!')
    console.log('\n💡 Next step: Review recommendations and manually implement balance improvements')
  }
}

// Run if called directly
async function main() {
  try {
    const analyzer = new ChoiceBalanceAnalyzer()
    await analyzer.run()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()

export { ChoiceBalanceAnalyzer }