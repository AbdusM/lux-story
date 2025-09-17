/**
 * Choice Quality Enhancer Script
 *
 * Elevates psychological sophistication and career guidance effectiveness of choices.
 * This runs after pattern audit and balance analysis to improve choice depth and professionalism.
 *
 * Quality Enhancement Goals:
 * - Increase psychological depth and emotional intelligence
 * - Enhance career guidance value and professional insight
 * - Improve nuanced understanding of workplace dynamics
 * - Strengthen decision-making frameworks
 * - Maintain narrative voice while increasing sophistication
 */

import { GeminiContentFramework } from './gemini-content-framework'
import fs from 'fs'
import path from 'path'

interface ChoiceQualityMatch {
  sceneId: string
  choiceText: string
  pattern: string
  choiceIndex: number
  context: string // Scene description for context
}

interface QualityAnalysisResult {
  choice_text: string
  pattern: string
  scene_context: string
  analysis: {
    psychological_depth_rating: number
    career_guidance_rating: number
    emotional_intelligence_rating: number
    professional_insight_rating: number
    overall_sophistication: number
    current_strengths: string[]
    improvement_areas: string[]
  }
  enhancement: {
    action: 'keep' | 'enhance' | 'rewrite'
    improved_text: string
    enhancement_rationale: string
    confidence: number
  }
}

class ChoiceQualityEnhancer extends GeminiContentFramework {
  private choices: ChoiceQualityMatch[] = []
  private filePath: string

  constructor() {
    super(process.env.GEMINI_API_KEY || '', 'gemini-1.5-flash')
    this.filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
  }

  /**
   * Extract choices with their scene context
   */
  async extractChoicesWithContext(): Promise<void> {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8')

    // Enhanced pattern to capture scenes with their text and choices
    const scenePattern = /'([^']+)':\s*\{\s*id:\s*'[^']+',\s*text:\s*"([^"]*(?:\\.[^"]*)*)",[\s\S]*?choices:\s*\[([\s\S]*?)\]/g

    let sceneMatch
    while ((sceneMatch = scenePattern.exec(fileContent)) !== null) {
      const sceneId = sceneMatch[1]
      const sceneText = sceneMatch[2]
      const choicesBlock = sceneMatch[3]

      // Extract individual choices within this scene
      const choicePattern = /\{\s*text:\s*"([^"]*(?:\\.[^"]*)*)"\s*,[^}]*?pattern:\s*'([^']+)'/g

      let choiceMatch
      let choiceIndex = 0
      while ((choiceMatch = choicePattern.exec(choicesBlock)) !== null) {
        const choiceText = choiceMatch[1]
        const pattern = choiceMatch[2]

        this.choices.push({
          sceneId,
          choiceText,
          pattern,
          choiceIndex,
          context: sceneText
        })
        choiceIndex++
      }
    }

    console.log(`💎 Found ${this.choices.length} choices to analyze for quality enhancement`)
  }

  /**
   * Generate quality enhancement prompt
   */
  private getQualityEnhancementPrompt(choice: ChoiceQualityMatch): string {
    return `Enhance this career exploration choice for psychological sophistication and professional guidance value.

SCENE CONTEXT: ${choice.sceneId}
"${choice.context.substring(0, 200)}..."

CURRENT CHOICE:
Text: "${choice.choiceText}"
Pattern: ${choice.pattern}

ENHANCEMENT CRITERIA:
1. Psychological Depth: Does it show understanding of complex human motivations?
2. Career Guidance: Does it provide valuable professional insight or direction?
3. Emotional Intelligence: Does it demonstrate awareness of emotions and relationships?
4. Professional Insight: Does it reflect real workplace dynamics and career realities?
5. Overall Sophistication: Is it nuanced, thoughtful, and professionally mature?

REQUIREMENTS:
- Maintain the original pattern and meaning
- Keep career exploration focus
- Preserve narrative voice consistency
- Enhance without becoming overly complex
- Ensure actionable career guidance value

Rate current choice 1-10 on each criterion, then provide enhancement.

Format as:
PSYCH_DEPTH: [1-10]
CAREER_GUIDANCE: [1-10]
EMOTIONAL_IQ: [1-10]
PROFESSIONAL: [1-10]
SOPHISTICATION: [1-10]
STRENGTHS: [current strengths, comma-separated]
IMPROVEMENTS: [areas needing work, comma-separated]
ACTION: [keep/enhance/rewrite]
ENHANCED: [improved version of the choice text]
RATIONALE: [why this enhancement improves quality]
CONFIDENCE: [0.1-1.0]`
  }

  /**
   * Analyze and enhance a single choice
   */
  async enhanceChoice(choice: ChoiceQualityMatch): Promise<QualityAnalysisResult | null> {
    console.log(`  💎 Enhancing: "${choice.choiceText.substring(0, 60)}..." (${choice.pattern})`)

    try {
      const result = await this.model.generateContent(this.getQualityEnhancementPrompt(choice))
      const responseText = result.response.text().trim()

      // Parse the simplified format
      const lines = responseText.split('\n').filter(line => line.trim())
      const data: Record<string, string> = {}

      lines.forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/)
        if (match) {
          data[match[1].toLowerCase()] = match[2].trim()
        }
      })

      // Validate required fields
      const requiredFields = ['psych_depth', 'career_guidance', 'emotional_iq', 'professional', 'sophistication', 'action', 'enhanced', 'confidence']
      for (const field of requiredFields) {
        if (!data[field]) {
          console.log(`  ⚠️ Missing required field ${field} for ${choice.sceneId}`)
          return null
        }
      }

      const confidence = parseFloat(data.confidence)
      if (confidence < 0.7) {
        console.log(`  ⚠️ Low confidence (${confidence}) for ${choice.sceneId}`)
        return null
      }

      // Create analysis result structure
      const analysis: QualityAnalysisResult = {
        choice_text: choice.choiceText,
        pattern: choice.pattern,
        scene_context: choice.context,
        analysis: {
          psychological_depth_rating: parseInt(data.psych_depth),
          career_guidance_rating: parseInt(data.career_guidance),
          emotional_intelligence_rating: parseInt(data.emotional_iq),
          professional_insight_rating: parseInt(data.professional),
          overall_sophistication: parseInt(data.sophistication),
          current_strengths: data.strengths ? data.strengths.split(',').map(s => s.trim()) : [],
          improvement_areas: data.improvements ? data.improvements.split(',').map(s => s.trim()) : []
        },
        enhancement: {
          action: data.action as 'keep' | 'enhance' | 'rewrite',
          improved_text: data.enhanced,
          enhancement_rationale: data.rationale || 'No specific rationale provided',
          confidence: confidence
        }
      }

      // Log the analysis result
      const avgRating = (
        analysis.analysis.psychological_depth_rating +
        analysis.analysis.career_guidance_rating +
        analysis.analysis.emotional_intelligence_rating +
        analysis.analysis.professional_insight_rating +
        analysis.analysis.overall_sophistication
      ) / 5

      if (avgRating < 6) {
        console.log(`  📈 Low quality (${avgRating.toFixed(1)}) - Action: ${analysis.enhancement.action}`)
      } else if (analysis.enhancement.action !== 'keep') {
        console.log(`  🔧 Good quality (${avgRating.toFixed(1)}) - Enhancement possible`)
      } else {
        console.log(`  ✅ High quality (${avgRating.toFixed(1)}) - Keep as-is`)
      }

      return analysis

    } catch (error: any) {
      console.log(`  ❌ Failed to analyze ${choice.sceneId}: ${error.message}`)
      return null
    }
  }

  /**
   * Generate comprehensive quality enhancement report
   */
  private generateQualityReport(analyses: QualityAnalysisResult[]): string {
    const totalAnalyzed = analyses.length
    const keepAsIs = analyses.filter(a => a.enhancement.action === 'keep').length
    const enhanceCount = analyses.filter(a => a.enhancement.action === 'enhance').length
    const rewriteCount = analyses.filter(a => a.enhancement.action === 'rewrite').length

    // Calculate average scores across all criteria
    const avgScores = {
      psychological_depth: analyses.reduce((sum, a) => sum + a.analysis.psychological_depth_rating, 0) / totalAnalyzed,
      career_guidance: analyses.reduce((sum, a) => sum + a.analysis.career_guidance_rating, 0) / totalAnalyzed,
      emotional_intelligence: analyses.reduce((sum, a) => sum + a.analysis.emotional_intelligence_rating, 0) / totalAnalyzed,
      professional_insight: analyses.reduce((sum, a) => sum + a.analysis.professional_insight_rating, 0) / totalAnalyzed,
      overall_sophistication: analyses.reduce((sum, a) => sum + a.analysis.overall_sophistication, 0) / totalAnalyzed
    }

    // Quality distribution
    const qualityRanges = {
      'Excellent (8-10)': analyses.filter(a => {
        const avg = (a.analysis.psychological_depth_rating + a.analysis.career_guidance_rating +
                    a.analysis.emotional_intelligence_rating + a.analysis.professional_insight_rating +
                    a.analysis.overall_sophistication) / 5
        return avg >= 8
      }).length,
      'Good (6-7.9)': analyses.filter(a => {
        const avg = (a.analysis.psychological_depth_rating + a.analysis.career_guidance_rating +
                    a.analysis.emotional_intelligence_rating + a.analysis.professional_insight_rating +
                    a.analysis.overall_sophistication) / 5
        return avg >= 6 && avg < 8
      }).length,
      'Fair (4-5.9)': analyses.filter(a => {
        const avg = (a.analysis.psychological_depth_rating + a.analysis.career_guidance_rating +
                    a.analysis.emotional_intelligence_rating + a.analysis.professional_insight_rating +
                    a.analysis.overall_sophistication) / 5
        return avg >= 4 && avg < 6
      }).length,
      'Poor (0-3.9)': analyses.filter(a => {
        const avg = (a.analysis.psychological_depth_rating + a.analysis.career_guidance_rating +
                    a.analysis.emotional_intelligence_rating + a.analysis.professional_insight_rating +
                    a.analysis.overall_sophistication) / 5
        return avg < 4
      }).length
    }

    // Common improvement areas
    const improvementAreas: Record<string, number> = {}
    analyses.forEach(a => {
      a.analysis.improvement_areas.forEach(area => {
        improvementAreas[area] = (improvementAreas[area] || 0) + 1
      })
    })

    let report = `# Choice Quality Enhancement Report

Generated: ${new Date().toISOString()}

## Executive Summary
- Total Choices Analyzed: ${totalAnalyzed}
- Keep As-Is: ${keepAsIs} (${((keepAsIs/totalAnalyzed)*100).toFixed(1)}%)
- Enhance: ${enhanceCount} (${((enhanceCount/totalAnalyzed)*100).toFixed(1)}%)
- Rewrite: ${rewriteCount} (${((rewriteCount/totalAnalyzed)*100).toFixed(1)}%)

## Quality Metrics (Average Scores)
- **Psychological Depth**: ${avgScores.psychological_depth.toFixed(1)}/10
- **Career Guidance**: ${avgScores.career_guidance.toFixed(1)}/10
- **Emotional Intelligence**: ${avgScores.emotional_intelligence.toFixed(1)}/10
- **Professional Insight**: ${avgScores.professional_insight.toFixed(1)}/10
- **Overall Sophistication**: ${avgScores.overall_sophistication.toFixed(1)}/10

## Quality Distribution
${Object.entries(qualityRanges).map(([range, count]) =>
  `- **${range}**: ${count} choices (${((count/totalAnalyzed)*100).toFixed(1)}%)`
).join('\n')}

## Common Improvement Areas
${Object.entries(improvementAreas)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .map(([area, count]) => `- **${area}**: ${count} choices`)
  .join('\n')}

## High-Impact Enhancements

### Choices Requiring Rewrite (${rewriteCount})
${analyses.filter(a => a.enhancement.action === 'rewrite').slice(0, 5).map(a => {
  const avgQuality = (a.analysis.psychological_depth_rating + a.analysis.career_guidance_rating +
                     a.analysis.emotional_intelligence_rating + a.analysis.professional_insight_rating +
                     a.analysis.overall_sophistication) / 5
  return `**Original**: "${a.choice_text}"
**Pattern**: ${a.pattern}
**Quality Score**: ${avgQuality.toFixed(1)}/10
**Enhanced**: "${a.enhancement.improved_text}"
**Rationale**: ${a.enhancement.enhancement_rationale}
**Strengths**: ${a.analysis.current_strengths.join(', ')}
**Improvements**: ${a.analysis.improvement_areas.join(', ')}
`
}).join('\n')}

### Choices for Enhancement (${enhanceCount})
${analyses.filter(a => a.enhancement.action === 'enhance').slice(0, 5).map(a => {
  const avgQuality = (a.analysis.psychological_depth_rating + a.analysis.career_guidance_rating +
                     a.analysis.emotional_intelligence_rating + a.analysis.professional_insight_rating +
                     a.analysis.overall_sophistication) / 5
  return `**Original**: "${a.choice_text}"
**Pattern**: ${a.pattern}
**Quality Score**: ${avgQuality.toFixed(1)}/10
**Enhanced**: "${a.enhancement.improved_text}"
**Rationale**: ${a.enhancement.enhancement_rationale}
`
}).join('\n')}

## Pattern-Specific Quality Analysis

### Analytical Pattern Quality
${this.analyzePatternQuality(analyses, 'analytical')}

### Helping Pattern Quality
${this.analyzePatternQuality(analyses, 'helping')}

### Building Pattern Quality
${this.analyzePatternQuality(analyses, 'building')}

### Patience Pattern Quality
${this.analyzePatternQuality(analyses, 'patience')}

## Implementation Recommendations

### Immediate Priority
1. **Rewrite ${rewriteCount} low-quality choices** that scored below professional standards
2. **Enhance ${enhanceCount} good choices** to elevate overall sophistication
3. **Focus on common improvement areas**: ${Object.entries(improvementAreas).sort(([,a], [,b]) => b - a).slice(0, 3).map(([area]) => area).join(', ')}

### Quality Standards
- Target minimum score of 6.0 across all quality criteria
- Ensure 80%+ of choices demonstrate professional-level career guidance
- Maintain psychological depth while preserving narrative accessibility

### Validation Process
- Review enhanced choices for pattern consistency
- Ensure career guidance remains actionable and realistic
- Verify emotional intelligence enhancements feel authentic

## Next Steps in Pipeline

After implementing quality enhancements:
1. Run birmingham-integration-optimizer.ts to strengthen local career connections
2. Run consequence-consistency-auditor.ts to ensure narrative coherence
3. Conduct user testing to validate enhanced choice quality

## Professional Impact

These enhancements will elevate the choice system from functional to professional-grade:
- **Career Counseling Quality**: Choices now provide genuine professional guidance
- **Psychological Sophistication**: Demonstrates understanding of complex workplace dynamics
- **Decision Framework**: Helps players develop nuanced career decision-making skills
- **Emotional Intelligence**: Acknowledges the emotional aspects of career transitions
`

    return report
  }

  /**
   * Analyze quality for a specific pattern
   */
  private analyzePatternQuality(analyses: QualityAnalysisResult[], pattern: string): string {
    const patternAnalyses = analyses.filter(a => a.pattern === pattern)
    if (patternAnalyses.length === 0) return `No ${pattern} choices analyzed.`

    const avgQuality = patternAnalyses.reduce((sum, a) => {
      return sum + (a.analysis.psychological_depth_rating + a.analysis.career_guidance_rating +
                   a.analysis.emotional_intelligence_rating + a.analysis.professional_insight_rating +
                   a.analysis.overall_sophistication) / 5
    }, 0) / patternAnalyses.length

    const needsWork = patternAnalyses.filter(a => a.enhancement.action !== 'keep').length

    return `- **Count**: ${patternAnalyses.length} choices
- **Average Quality**: ${avgQuality.toFixed(1)}/10
- **Needs Enhancement**: ${needsWork} choices (${((needsWork/patternAnalyses.length)*100).toFixed(1)}%)`
  }

  /**
   * Run the full quality enhancement analysis
   */
  async run(): Promise<void> {
    console.log('💎 Starting Choice Quality Enhancement Analysis...\n')

    // Extract all choices with context
    await this.extractChoicesWithContext()

    // Analyze quality for a subset of choices (testing phase)
    const choicesToAnalyze = this.choices
      .filter(c => ['analytical', 'helping', 'building', 'patience'].includes(c.pattern))
      .slice(0, 15) // Test with 15 choices

    console.log(`\n💎 Analyzing ${choicesToAnalyze.length} choices for quality enhancement`)

    const results = await this.batchProcess(
      choicesToAnalyze,
      async (choice) => {
        const analysis = await this.enhanceChoice(choice)
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

    const validAnalyses = results.filter(r => r !== null) as QualityAnalysisResult[]

    console.log(`\n✅ Analyzed ${validAnalyses.length} choices for quality enhancement\n`)

    // Collect choices that need enhancement
    const enhancements = validAnalyses
      .filter(a => a.enhancement.action !== 'keep')
      .map(a => ({
        sceneId: a.choice_text, // We'll need to map this back to scene ID
        newText: a.enhancement.improved_text,
        confidence: a.enhancement.confidence,
        issues: a.analysis.improvement_areas
      }))

    if (enhancements.length > 0) {
      console.log(`\n💡 Found ${enhancements.length} choices for quality enhancement`)
      console.log(`Note: Quality enhancements require manual review before application`)
    }

    // Generate comprehensive report
    const report = this.generateQualityReport(validAnalyses)
    fs.writeFileSync('choice-quality-enhancement-report.md', report, 'utf-8')
    console.log('📄 Report saved to choice-quality-enhancement-report.md')
    console.log('💎 Choice quality enhancement analysis complete!')
    console.log('\n💡 Next step: Review enhancement recommendations and apply selectively')
  }
}

// Run if called directly
async function main() {
  try {
    const enhancer = new ChoiceQualityEnhancer()
    await enhancer.run()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()

export { ChoiceQualityEnhancer }