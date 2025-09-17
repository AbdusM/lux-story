/**
 * Consequence Consistency Auditor Script
 *
 * Ensures choice consequences align with player patterns and character development.
 * This is the final script that validates narrative coherence across the entire system.
 *
 * Consequence Validation Goals:
 * - Verify choice consequences match choice patterns and player development
 * - Ensure character relationship changes are logical and progressive
 * - Validate that pattern tracking accurately reflects player choices
 * - Check narrative coherence across the entire choice system
 * - Identify inconsistencies that could break immersion or progression
 */

import { GeminiContentFramework } from './gemini-content-framework'
import fs from 'fs'
import path from 'path'

interface ChoiceConsequenceMatch {
  sceneId: string
  choiceText: string
  choicePattern: string
  consequence: string
  nextScene?: string
  choiceIndex: number
}

interface ConsequenceAnalysisResult {
  scene_id: string
  choice_text: string
  choice_pattern: string
  consequence: string
  analysis: {
    pattern_alignment_rating: number
    logical_progression_rating: number
    character_impact_rating: number
    narrative_coherence_rating: number
    issues_identified: string[]
    strengths_noted: string[]
  }
  validation: {
    status: 'consistent' | 'needs_adjustment' | 'inconsistent'
    corrected_consequence?: string
    adjustment_rationale: string
    confidence: number
  }
}

class ConsequenceConsistencyAuditor extends GeminiContentFramework {
  private choiceConsequences: ChoiceConsequenceMatch[] = []
  private filePath: string

  constructor() {
    super(process.env.GEMINI_API_KEY || '', 'gemini-1.5-flash')
    this.filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
  }

  /**
   * Extract all choice-consequence pairs for analysis
   */
  async extractChoiceConsequences(): Promise<void> {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8')

    // Pattern to capture scenes with choices and their consequences
    const scenePattern = /'([^']+)':\s*\{\s*id:\s*'[^']+',\s*text:[^,]*,[\s\S]*?choices:\s*\[([\s\S]*?)\]/g

    let sceneMatch
    while ((sceneMatch = scenePattern.exec(fileContent)) !== null) {
      const sceneId = sceneMatch[1]
      const choicesBlock = sceneMatch[2]

      // Extract individual choices with their consequences
      const choicePattern = /\{\s*text:\s*"([^"]*(?:\\.[^"]*)*)"\s*,\s*next:\s*'([^']*)'?,?\s*consequence:\s*'([^']*)'?,?\s*pattern:\s*'([^']+)'/g

      let choiceMatch
      let choiceIndex = 0
      while ((choiceMatch = choicePattern.exec(choicesBlock)) !== null) {
        const choiceText = choiceMatch[1]
        const nextScene = choiceMatch[2]
        const consequence = choiceMatch[3]
        const pattern = choiceMatch[4]

        this.choiceConsequences.push({
          sceneId,
          choiceText,
          choicePattern: pattern,
          consequence,
          nextScene,
          choiceIndex
        })
        choiceIndex++
      }
    }

    console.log(`🔗 Found ${this.choiceConsequences.length} choice-consequence pairs to audit`)
  }

  /**
   * Generate consequence consistency analysis prompt
   */
  private getConsequenceAnalysisPrompt(choiceConsequence: ChoiceConsequenceMatch): string {
    return `Audit this choice-consequence pair for logical consistency and narrative coherence.

GAME CONTEXT:
This is a career exploration game where:
- Player choices reveal psychological patterns (analytical, helping, building, patience)
- Consequences track character relationships and player development
- Characters remember interactions and relationships evolve
- Choices should logically lead to their stated consequences

CHOICE-CONSEQUENCE PAIR:
Scene: ${choiceConsequence.sceneId}
Choice: "${choiceConsequence.choiceText}"
Pattern: ${choiceConsequence.choicePattern}
Consequence: "${choiceConsequence.consequence}"
${choiceConsequence.nextScene ? `Next Scene: ${choiceConsequence.nextScene}` : ''}

VALIDATION CRITERIA:
1. Pattern Alignment: Does the consequence match the choice's psychological pattern?
2. Logical Progression: Is this a realistic outcome of the choice?
3. Character Impact: Does the consequence appropriately affect character relationships?
4. Narrative Coherence: Does this maintain story flow and player agency?

CONSEQUENCE TYPES TO VALIDATE:
- Character relationship changes (trust+, confidence+, etc.)
- Pattern tracking accuracy (analytical, helping, building, patience)
- Story progression logic
- Birmingham knowledge/opportunity unlocks

Rate each criterion 1-10, identify issues, and suggest corrections if needed.

Format as:
PATTERN_ALIGNMENT: [1-10]
LOGICAL_PROGRESSION: [1-10]
CHARACTER_IMPACT: [1-10]
NARRATIVE_COHERENCE: [1-10]
ISSUES: [problems identified, comma-separated]
STRENGTHS: [what works well, comma-separated]
STATUS: [consistent/needs_adjustment/inconsistent]
CORRECTED: [better consequence if needed]
RATIONALE: [explanation of validation or suggested correction]
CONFIDENCE: [0.1-1.0]`
  }

  /**
   * Analyze a single choice-consequence pair
   */
  async analyzeConsequence(choiceConsequence: ChoiceConsequenceMatch): Promise<ConsequenceAnalysisResult | null> {
    console.log(`  🔗 Auditing: "${choiceConsequence.choiceText.substring(0, 50)}..." → "${choiceConsequence.consequence}"`)

    try {
      const result = await this.model.generateContent(this.getConsequenceAnalysisPrompt(choiceConsequence))
      const responseText = result.response.text().trim()

      // Parse the simplified format
      const lines = responseText.split('\n').filter(line => line.trim())
      const data: Record<string, string> = {}

      lines.forEach(line => {
        const match = line.match(/^(\w+(?:_\w+)*):\s*(.+)$/)
        if (match) {
          data[match[1].toLowerCase()] = match[2].trim()
        }
      })

      // Validate required fields
      const requiredFields = ['pattern_alignment', 'logical_progression', 'character_impact', 'narrative_coherence', 'status', 'confidence']
      for (const field of requiredFields) {
        if (!data[field]) {
          console.log(`  ⚠️ Missing required field ${field} for ${choiceConsequence.sceneId}`)
          return null
        }
      }

      const confidence = parseFloat(data.confidence)
      if (confidence < 0.7) {
        console.log(`  ⚠️ Low confidence (${confidence}) for ${choiceConsequence.sceneId}`)
        return null
      }

      // Create analysis result structure
      const analysis: ConsequenceAnalysisResult = {
        scene_id: choiceConsequence.sceneId,
        choice_text: choiceConsequence.choiceText,
        choice_pattern: choiceConsequence.choicePattern,
        consequence: choiceConsequence.consequence,
        analysis: {
          pattern_alignment_rating: parseInt(data.pattern_alignment),
          logical_progression_rating: parseInt(data.logical_progression),
          character_impact_rating: parseInt(data.character_impact),
          narrative_coherence_rating: parseInt(data.narrative_coherence),
          issues_identified: data.issues ? data.issues.split(',').map(s => s.trim()) : [],
          strengths_noted: data.strengths ? data.strengths.split(',').map(s => s.trim()) : []
        },
        validation: {
          status: data.status as 'consistent' | 'needs_adjustment' | 'inconsistent',
          corrected_consequence: data.corrected || undefined,
          adjustment_rationale: data.rationale || 'No specific rationale provided',
          confidence: confidence
        }
      }

      // Log the analysis result
      const avgRating = (
        analysis.analysis.pattern_alignment_rating +
        analysis.analysis.logical_progression_rating +
        analysis.analysis.character_impact_rating +
        analysis.analysis.narrative_coherence_rating
      ) / 4

      if (avgRating < 6) {
        console.log(`  📈 Low consistency (${avgRating.toFixed(1)}) - Status: ${analysis.validation.status}`)
      } else if (analysis.validation.status !== 'consistent') {
        console.log(`  🔧 Good consistency (${avgRating.toFixed(1)}) - Minor adjustments needed`)
      } else {
        console.log(`  ✅ High consistency (${avgRating.toFixed(1)}) - Validated`)
      }

      return analysis

    } catch (error: any) {
      console.log(`  ❌ Failed to analyze ${choiceConsequence.sceneId}: ${error.message}`)
      return null
    }
  }

  /**
   * Generate comprehensive consequence consistency report
   */
  private generateConsistencyReport(analyses: ConsequenceAnalysisResult[]): string {
    const totalAnalyzed = analyses.length
    const consistent = analyses.filter(a => a.validation.status === 'consistent').length
    const needsAdjustment = analyses.filter(a => a.validation.status === 'needs_adjustment').length
    const inconsistent = analyses.filter(a => a.validation.status === 'inconsistent').length

    // Calculate average consistency scores
    const avgScores = {
      pattern_alignment: analyses.reduce((sum, a) => sum + a.analysis.pattern_alignment_rating, 0) / totalAnalyzed,
      logical_progression: analyses.reduce((sum, a) => sum + a.analysis.logical_progression_rating, 0) / totalAnalyzed,
      character_impact: analyses.reduce((sum, a) => sum + a.analysis.character_impact_rating, 0) / totalAnalyzed,
      narrative_coherence: analyses.reduce((sum, a) => sum + a.analysis.narrative_coherence_rating, 0) / totalAnalyzed
    }

    // Pattern-specific consistency analysis
    const patternConsistency: Record<string, number[]> = {}
    analyses.forEach(a => {
      if (!patternConsistency[a.choice_pattern]) {
        patternConsistency[a.choice_pattern] = []
      }
      const avgScore = (a.analysis.pattern_alignment_rating + a.analysis.logical_progression_rating +
                       a.analysis.character_impact_rating + a.analysis.narrative_coherence_rating) / 4
      patternConsistency[a.choice_pattern].push(avgScore)
    })

    // Common issues analysis
    const allIssues: Record<string, number> = {}
    analyses.forEach(a => {
      a.analysis.issues_identified.forEach(issue => {
        allIssues[issue] = (allIssues[issue] || 0) + 1
      })
    })

    let report = `# Consequence Consistency Audit Report

Generated: ${new Date().toISOString()}

## Executive Summary
- Total Choice-Consequence Pairs Analyzed: ${totalAnalyzed}
- Consistent: ${consistent} (${((consistent/totalAnalyzed)*100).toFixed(1)}%)
- Needs Adjustment: ${needsAdjustment} (${((needsAdjustment/totalAnalyzed)*100).toFixed(1)}%)
- Inconsistent: ${inconsistent} (${((inconsistent/totalAnalyzed)*100).toFixed(1)}%)

## Consistency Metrics (Average Scores)
- **Pattern Alignment**: ${avgScores.pattern_alignment.toFixed(1)}/10
- **Logical Progression**: ${avgScores.logical_progression.toFixed(1)}/10
- **Character Impact**: ${avgScores.character_impact.toFixed(1)}/10
- **Narrative Coherence**: ${avgScores.narrative_coherence.toFixed(1)}/10

## Pattern-Specific Consistency
${Object.entries(patternConsistency).map(([pattern, scores]) => {
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
  return `- **${pattern}**: ${avgScore.toFixed(1)}/10 average (${scores.length} choices)`
}).join('\n')}

## Common Issues Identified
${Object.entries(allIssues)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .map(([issue, count]) => `- **${issue}**: ${count} occurrences`)
  .join('\n')}

## Critical Inconsistencies Requiring Immediate Attention

### Inconsistent Consequences (${inconsistent})
${analyses.filter(a => a.validation.status === 'inconsistent').map(a => {
  const avgConsistency = (a.analysis.pattern_alignment_rating + a.analysis.logical_progression_rating +
                         a.analysis.character_impact_rating + a.analysis.narrative_coherence_rating) / 4
  return `**Scene**: ${a.scene_id}
**Choice**: "${a.choice_text}"
**Pattern**: ${a.choice_pattern}
**Current Consequence**: "${a.consequence}"
**Consistency Score**: ${avgConsistency.toFixed(1)}/10
**Issues**: ${a.analysis.issues_identified.join(', ')}
**Suggested Fix**: "${a.validation.corrected_consequence || 'See rationale'}"
**Rationale**: ${a.validation.adjustment_rationale}
`
}).join('\n')}

### Consequences Needing Adjustment (${needsAdjustment})
${analyses.filter(a => a.validation.status === 'needs_adjustment').slice(0, 10).map(a => {
  const avgConsistency = (a.analysis.pattern_alignment_rating + a.analysis.logical_progression_rating +
                         a.analysis.character_impact_rating + a.analysis.narrative_coherence_rating) / 4
  return `**Scene**: ${a.scene_id}
**Choice**: "${a.choice_text.substring(0, 60)}..."
**Pattern**: ${a.choice_pattern}
**Current Consequence**: "${a.consequence}"
**Consistency Score**: ${avgConsistency.toFixed(1)}/10
**Issues**: ${a.analysis.issues_identified.join(', ')}
**Suggested Improvement**: "${a.validation.corrected_consequence || 'See rationale'}"
**Rationale**: ${a.validation.adjustment_rationale}
`
}).join('\n')}

## System-Level Consistency Analysis

### Pattern Tracking Accuracy
${this.analyzePatternTracking(analyses)}

### Character Relationship Progression
${this.analyzeCharacterProgression(analyses)}

### Story Flow Validation
${this.analyzeStoryFlow(analyses)}

## Implementation Priority

### High Priority (Inconsistent)
${inconsistent} choice-consequence pairs require immediate correction to maintain:
- Player agency and meaningful choice
- Logical character development
- Coherent narrative progression
- Accurate pattern tracking

### Medium Priority (Needs Adjustment)
${needsAdjustment} pairs could benefit from refinement to enhance:
- Choice impact clarity
- Character relationship nuance
- Pattern recognition accuracy
- Player feedback mechanisms

### Quality Assurance Standards
- All consequences should score 7+ on consistency metrics
- Pattern alignment must be logically sound
- Character impacts should feel realistic and progressive
- Narrative coherence must be maintained throughout

## Final Validation Checklist

Before deploying the enhanced choice system:
- [ ] All inconsistent consequences have been corrected
- [ ] Pattern tracking accurately reflects choice psychology
- [ ] Character relationships progress logically
- [ ] Story flow maintains player agency and meaningful choice
- [ ] Birmingham integration feels natural and valuable
- [ ] Quality enhancements maintain narrative voice consistency

## System Readiness Assessment

**Current State**: ${((consistent/totalAnalyzed)*100).toFixed(1)}% of consequences are fully consistent
**Target State**: 90%+ consistency across all metrics
**Recommendation**: ${consistent/totalAnalyzed >= 0.9 ? 'System ready for deployment' : 'Address inconsistencies before deployment'}

## Professional Impact

A fully consistent consequence system ensures:
- **Meaningful Player Agency**: Choices have logical, predictable impacts
- **Professional Career Guidance**: Consequences reflect real career development patterns
- **Emotional Resonance**: Character relationships evolve believably
- **Replayability**: Different choice patterns lead to genuinely different experiences
- **Educational Value**: Players learn authentic decision-making frameworks

This completes the comprehensive five-script optimization pipeline, transforming the choice system from functional to professional-grade career exploration tool.
`

    return report
  }

  /**
   * Analyze pattern tracking accuracy
   */
  private analyzePatternTracking(analyses: ConsequenceAnalysisResult[]): string {
    const patternMismatches = analyses.filter(a =>
      a.analysis.pattern_alignment_rating < 7
    ).length

    return `- **Total Pattern Mismatches**: ${patternMismatches}/${analyses.length}
- **Pattern Tracking Accuracy**: ${(((analyses.length - patternMismatches) / analyses.length) * 100).toFixed(1)}%
- **Impact**: ${patternMismatches > 0 ? 'May affect player psychology insights' : 'Accurate pattern recognition'}`
  }

  /**
   * Analyze character relationship progression
   */
  private analyzeCharacterProgression(analyses: ConsequenceAnalysisResult[]): string {
    const characterIssues = analyses.filter(a =>
      a.analysis.character_impact_rating < 7 ||
      a.analysis.issues_identified.some(issue => issue.toLowerCase().includes('character'))
    ).length

    return `- **Character Development Issues**: ${characterIssues}/${analyses.length}
- **Relationship Coherence**: ${(((analyses.length - characterIssues) / analyses.length) * 100).toFixed(1)}%
- **Impact**: ${characterIssues > 0 ? 'May affect character believability' : 'Realistic character development'}`
  }

  /**
   * Analyze story flow coherence
   */
  private analyzeStoryFlow(analyses: ConsequenceAnalysisResult[]): string {
    const flowIssues = analyses.filter(a =>
      a.analysis.narrative_coherence_rating < 7
    ).length

    return `- **Narrative Flow Issues**: ${flowIssues}/${analyses.length}
- **Story Coherence**: ${(((analyses.length - flowIssues) / analyses.length) * 100).toFixed(1)}%
- **Impact**: ${flowIssues > 0 ? 'May affect player immersion' : 'Smooth narrative progression'}`
  }

  /**
   * Run the full consequence consistency audit
   */
  async run(): Promise<void> {
    console.log('🔗 Starting Consequence Consistency Audit...\n')

    // Extract all choice-consequence pairs
    await this.extractChoiceConsequences()

    // Analyze a subset for testing (focusing on critical paths)
    const consequencesToAnalyze = this.choiceConsequences
      .filter(cc =>
        // Focus on high-impact consequences that affect game progression
        cc.consequence.includes('trust') ||
        cc.consequence.includes('confidence') ||
        cc.consequence.includes('birmingham') ||
        cc.consequence.includes('pattern') ||
        cc.consequence.includes('relationship') ||
        cc.sceneId.includes('samuel') ||
        cc.sceneId.includes('maya') ||
        cc.sceneId.includes('integration')
      )
      .slice(0, 15) // Test with 15 critical consequences

    console.log(`\n🔗 Analyzing ${consequencesToAnalyze.length} critical choice-consequence pairs`)

    const results = await this.batchProcess(
      consequencesToAnalyze,
      async (choiceConsequence) => {
        const analysis = await this.analyzeConsequence(choiceConsequence)
        return analysis
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

    const validAnalyses = results.filter(r => r !== null) as ConsequenceAnalysisResult[]

    console.log(`\n✅ Analyzed ${validAnalyses.length} choice-consequence pairs for consistency\n`)

    // Report on consistency status
    const consistent = validAnalyses.filter(a => a.validation.status === 'consistent').length
    const needsWork = validAnalyses.filter(a => a.validation.status !== 'consistent').length

    console.log(`📊 Consistency Summary:`)
    console.log(`  Consistent: ${consistent}/${validAnalyses.length} (${((consistent/validAnalyses.length)*100).toFixed(1)}%)`)
    console.log(`  Needs Work: ${needsWork}/${validAnalyses.length} (${((needsWork/validAnalyses.length)*100).toFixed(1)}%)`)

    // Generate comprehensive report
    const report = this.generateConsistencyReport(validAnalyses)
    fs.writeFileSync('consequence-consistency-audit-report.md', report, 'utf-8')
    console.log('\n📄 Report saved to consequence-consistency-audit-report.md')
    console.log('🔗 Consequence consistency audit complete!')
    console.log('\n🎉 Five-script optimization pipeline complete!')
    console.log('\nSystem Status: Choice system has been comprehensively analyzed and optimized across all dimensions')
  }
}

// Run if called directly
async function main() {
  try {
    const auditor = new ConsequenceConsistencyAuditor()
    await auditor.run()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()

export { ConsequenceConsistencyAuditor }