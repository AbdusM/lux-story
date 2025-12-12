/**
 * Choice Pattern Audit Script
 *
 * Ensures every choice accurately maps to its intended psychological pattern.
 * This is the foundation script that must run first to establish correct categorization.
 *
 * Pattern Definitions:
 * - analytical: Logic-based, data-driven, systematic thinking
 * - helping: People-focused, supportive, empathetic responses
 * - building: Creative, hands-on, solution-oriented actions
 * - patience: Thoughtful, long-term, contemplative approaches
 */

import { GeminiContentFramework } from './gemini-content-framework'
import fs from 'fs'
import path from 'path'

interface ChoiceMatch {
  sceneId: string
  choiceText: string
  assignedPattern: string
  choiceIndex: number
  fullMatch: string
  startIndex: number
  endIndex: number
}

interface PatternAnalysisResult {
  current_pattern: string
  choice_text: string
  analysis: {
    pattern_accuracy_rating: number
    psychological_consistency_rating: number
    rationale: string
    issues_identified: string[]
  }
  recommendation: {
    action: 'keep' | 'revise_text' | 'change_pattern'
    improved_text?: string
    suggested_pattern?: string
    confidence: number
  }
}

class ChoicePatternAuditor extends GeminiContentFramework {
  private choices: ChoiceMatch[] = []
  private filePath: string

  constructor() {
    super(process.env.GEMINI_API_KEY || '', 'gemini-1.5-flash') // Use more stable model
    this.filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
  }

  /**
   * Extract all choices from the game file
   */
  async extractChoices(): Promise<void> {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8')

    // Enhanced pattern to capture scene context and choices
    const scenePattern = /'([^']+)':\s*\{[^}]*?choices:\s*\[([\s\S]*?)\]/g

    let sceneMatch
    while ((sceneMatch = scenePattern.exec(fileContent)) !== null) {
      const sceneId = sceneMatch[1]
      const choicesBlock = sceneMatch[2]

      // Extract individual choices within this scene
      const choicePattern = /\{\s*text:\s*"([^"]*(?:\\.[^"]*)*)"\s*,\s*[^}]*?pattern:\s*'([^']+)'/g

      let choiceMatch
      let choiceIndex = 0
      while ((choiceMatch = choicePattern.exec(choicesBlock)) !== null) {
        const choiceText = choiceMatch[1]
        const assignedPattern = choiceMatch[2]

        this.choices.push({
          sceneId,
          choiceText,
          assignedPattern,
          choiceIndex,
          fullMatch: choiceMatch[0],
          startIndex: sceneMatch.index + choiceMatch.index,
          endIndex: sceneMatch.index + choiceMatch.index + choiceMatch[0].length
        })
        choiceIndex++
      }
    }

    console.log(`📊 Found ${this.choices.length} choices to audit across scenes`)
  }

  /**
   * Generate simplified pattern analysis prompt
   */
  private getPatternAnalysisPrompt(choice: ChoiceMatch): string {
    return `Analyze this career exploration choice for pattern accuracy.

PATTERNS:
- analytical: Logic, data, systematic thinking
- helping: People-focused, empathetic, supportive
- building: Creative, hands-on, solution-making
- patience: Thoughtful, reflective, long-term

CHOICE TO ANALYZE:
Text: "${choice.choiceText}"
Assigned Pattern: ${choice.assignedPattern}

Rate 1-10:
- Pattern Accuracy: How well does the text match the assigned pattern?
- Psychological Fit: Is this realistic for that thinking style?

Then provide:
- Action: keep, revise_text, or change_pattern
- If revise_text: suggest better wording
- If change_pattern: suggest correct pattern
- Confidence: 0.1-1.0

Format as:
ACCURACY: [number]
PSYCHOLOGY: [number]
ACTION: [keep/revise_text/change_pattern]
IMPROVED: [better text if needed]
PATTERN: [correct pattern if needed]
CONFIDENCE: [0.1-1.0]
REASON: [brief explanation]`
  }

  /**
   * Audit a single choice for pattern accuracy
   */
  async auditChoice(choice: ChoiceMatch): Promise<PatternAnalysisResult | null> {
    console.log(`  🔍 Auditing: "${choice.choiceText.substring(0, 50)}..." (${choice.assignedPattern})`)

    try {
      const result = await this.model.generateContent(this.getPatternAnalysisPrompt(choice))
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
      if (!data.accuracy || !data.psychology || !data.action || !data.confidence) {
        console.log(`  ⚠️ Missing required fields for ${choice.sceneId}`)
        return null
      }

      const confidence = parseFloat(data.confidence)
      if (confidence < 0.7) {
        console.log(`  ⚠️ Low confidence (${confidence}) for ${choice.sceneId}`)
        return null
      }

      // Create PatternAnalysisResult structure
      const analysis: PatternAnalysisResult = {
        current_pattern: choice.assignedPattern,
        choice_text: choice.choiceText,
        analysis: {
          pattern_accuracy_rating: parseInt(data.accuracy),
          psychological_consistency_rating: parseInt(data.psychology),
          rationale: data.reason || 'No specific reason provided',
          issues_identified: data.reason ? [data.reason] : []
        },
        recommendation: {
          action: data.action as 'keep' | 'revise_text' | 'change_pattern',
          improved_text: data.improved || undefined,
          suggested_pattern: data.pattern || undefined,
          confidence: confidence
        }
      }

      // Log the analysis result
      const avgRating = (analysis.analysis.pattern_accuracy_rating + analysis.analysis.psychological_consistency_rating) / 2
      if (avgRating < 7) {
        console.log(`  📈 Low rating (${avgRating.toFixed(1)}) - Action: ${analysis.recommendation.action}`)
      } else {
        console.log(`  ✅ Good rating (${avgRating.toFixed(1)}) - ${analysis.recommendation.action}`)
      }

      return analysis

    } catch (error: any) {
      console.log(`  ❌ Failed to analyze ${choice.sceneId}: ${error.message}`)
      return null
    }
  }

  /**
   * Generate summary report of pattern audit findings
   */
  private generateAuditReport(results: Array<{ choice: ChoiceMatch; analysis: PatternAnalysisResult }>): string {
    const totalChoices = results.length
    const keepCount = results.filter(r => r.analysis.recommendation.action === 'keep').length
    const reviseTextCount = results.filter(r => r.analysis.recommendation.action === 'revise_text').length
    const changePatternCount = results.filter(r => r.analysis.recommendation.action === 'change_pattern').length

    const patternStats: Record<string, number> = {}
    results.forEach(r => {
      const pattern = r.choice.assignedPattern
      patternStats[pattern] = (patternStats[pattern] || 0) + 1
    })

    const lowRatingChoices = results.filter(r => {
      const avgRating = (r.analysis.analysis.pattern_accuracy_rating + r.analysis.analysis.psychological_consistency_rating) / 2
      return avgRating < 7
    })

    let report = `# Choice Pattern Audit Report

Generated: ${new Date().toISOString()}

## Summary
- Total Choices Analyzed: ${totalChoices}
- Keep As-Is: ${keepCount} (${((keepCount/totalChoices)*100).toFixed(1)}%)
- Revise Text: ${reviseTextCount} (${((reviseTextCount/totalChoices)*100).toFixed(1)}%)
- Change Pattern: ${changePatternCount} (${((changePatternCount/totalChoices)*100).toFixed(1)}%)

## Pattern Distribution
${Object.entries(patternStats).map(([pattern, count]) =>
  `- **${pattern}**: ${count} choices`
).join('\n')}

## Issues Requiring Attention

### Choices Needing Text Revision (${reviseTextCount})
${results.filter(r => r.analysis.recommendation.action === 'revise_text').map(r =>
  `**${r.choice.sceneId}**
- Current: "${r.choice.choiceText}"
- Pattern: ${r.choice.assignedPattern}
- Issue: ${r.analysis.analysis.rationale}
- Suggested: "${r.analysis.recommendation.improved_text || 'See analysis'}"
`).join('\n')}

### Choices Needing Pattern Change (${changePatternCount})
${results.filter(r => r.analysis.recommendation.action === 'change_pattern').map(r =>
  `**${r.choice.sceneId}**
- Text: "${r.choice.choiceText}"
- Current Pattern: ${r.choice.assignedPattern}
- Suggested Pattern: ${r.analysis.recommendation.suggested_pattern}
- Rationale: ${r.analysis.analysis.rationale}
`).join('\n')}

## Low-Rating Choices (${lowRatingChoices.length})
${lowRatingChoices.map(r => {
  const avgRating = (r.analysis.analysis.pattern_accuracy_rating + r.analysis.analysis.psychological_consistency_rating) / 2
  return `**${r.choice.sceneId}** (Rating: ${avgRating.toFixed(1)}/10)
- Text: "${r.choice.choiceText}"
- Pattern: ${r.choice.assignedPattern}
- Issues: ${r.analysis.analysis.issues_identified.join(', ')}
`
}).join('\n')}

## Recommended Actions

1. **Immediate Priority**: Address the ${changePatternCount} pattern misassignments
2. **Content Quality**: Revise the ${reviseTextCount} choices with unclear text
3. **Overall Quality**: Focus on low-rating choices for maximum impact
4. **Pattern Balance**: Ensure each scene offers diverse pattern options

## Next Steps

After implementing these pattern corrections:
1. Run choice-balance-analyzer.ts to ensure pattern distribution
2. Run choice-quality-enhancer.ts to improve psychological sophistication
3. Run birmingham-integration-optimizer.ts for local relevance
4. Run consequence-consistency-auditor.ts for narrative coherence
`

    return report
  }

  /**
   * Run the full pattern audit
   */
  async run(): Promise<void> {
    console.log('🎯 Starting Choice Pattern Audit...\n')

    // Extract all choices
    await this.extractChoices()

    // Group choices by pattern for organized processing
    const patternGroups: Record<string, ChoiceMatch[]> = {}
    this.choices.forEach(choice => {
      if (!patternGroups[choice.assignedPattern]) {
        patternGroups[choice.assignedPattern] = []
      }
      patternGroups[choice.assignedPattern].push(choice)
    })

    console.log(`\n📊 Pattern Distribution:`)
    Object.entries(patternGroups).forEach(([pattern, choices]) => {
      console.log(`  ${pattern}: ${choices.length} choices`)
    })

    // Process each pattern group (limit to first 10 choices for testing)
    const allResults: Array<{ choice: ChoiceMatch; analysis: PatternAnalysisResult }> = []

    for (const [pattern, choices] of Object.entries(patternGroups)) {
      const limitedChoices = choices.slice(0, 5) // Test with first 5 choices per pattern
      console.log(`\n🔍 Auditing ${pattern} patterns (${limitedChoices.length}/${choices.length} choices - testing)`)

      const results = await this.batchProcess(
        limitedChoices,
        async (choice) => {
          const analysis = await this.auditChoice(choice)
          if (analysis) {
            return { choice, analysis }
          }
          return null
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
        if (r) allResults.push(r)
      })
    }

    console.log(`\n✅ Analyzed ${allResults.length} choices\n`)

    // Collect choices that need text improvements
    const textImprovements = allResults
      .filter(r => r.analysis.recommendation.action === 'revise_text' && r.analysis.recommendation.improved_text)
      .map(r => ({
        sceneId: r.choice.sceneId,
        newText: r.analysis.recommendation.improved_text!,
        confidence: r.analysis.recommendation.confidence,
        issues: r.analysis.analysis.issues_identified
      }))

    if (textImprovements.length > 0) {
      console.log(`\n🔧 Applying ${textImprovements.length} choice text improvements...`)

      const stats = await this.applySceneImprovements(
        this.filePath,
        textImprovements,
        {
          minConfidence: 0.7,
          createBackup: true,
          debug: true
        }
      )

      console.log(`📊 Applied ${stats.applied} improvements, skipped ${stats.skipped}`)
    }

    // Generate detailed report
    const report = this.generateAuditReport(allResults)
    fs.writeFileSync('choice-pattern-audit-report.md', report, 'utf-8')
    console.log('\n📄 Report saved to choice-pattern-audit-report.md')
    console.log('🎯 Choice pattern audit complete!')
  }
}

// Run if called directly
async function main() {
  try {
    const auditor = new ChoicePatternAuditor()
    await auditor.run()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()

export { ChoicePatternAuditor }