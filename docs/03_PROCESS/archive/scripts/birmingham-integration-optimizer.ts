/**
 * Birmingham Integration Optimizer Script
 *
 * Strengthens local career connections and ensures authentic Birmingham integration.
 * This runs after quality enhancement to weave compelling local context into choices and dialogue.
 *
 * Birmingham Integration Goals:
 * - Make local opportunities compelling and actionable
 * - Ensure authentic representation of Birmingham's economy and culture
 * - Connect career paths to real local organizations and programs
 * - Strengthen the "local relevance" value proposition
 * - Maintain narrative flow while adding substantive local content
 */

import { GeminiContentFramework } from './gemini-content-framework'
import fs from 'fs'
import path from 'path'

interface BirminghamMatch {
  sceneId: string
  content: string
  contentType: 'scene_text' | 'choice_text'
  choiceIndex?: number
  hasLocalReference: boolean
  localReferences: string[]
}

interface BirminghamAnalysisResult {
  content: string
  content_type: string
  scene_id: string
  analysis: {
    local_relevance_rating: number
    authenticity_rating: number
    actionability_rating: number
    compelling_factor_rating: number
    current_birmingham_elements: string[]
    missing_opportunities: string[]
  }
  optimization: {
    action: 'keep' | 'enhance' | 'add_references'
    enhanced_content: string
    local_elements_added: string[]
    optimization_rationale: string
    confidence: number
  }
}

class BirminghamIntegrationOptimizer extends GeminiContentFramework {
  private matches: BirminghamMatch[] = []
  private filePath: string

  // Birmingham career ecosystem knowledge
  private birminghamContext = {
    majorEmployers: [
      'UAB (University of Alabama at Birmingham)',
      'Regions Bank',
      'Southern Company',
      'Children\'s of Alabama',
      'Protective Life',
      'ACIPCO (American Cast Iron Pipe Company)',
      'Shipt',
      'Innovation Depot',
      'Birmingham Business Alliance'
    ],
    healthcareHub: [
      'UAB Medical Center',
      'St. Vincent\'s Health System',
      'Children\'s of Alabama',
      'HealthSouth',
      'Medical device manufacturing'
    ],
    techEcosystem: [
      'Innovation Depot (startup incubator)',
      'Shipt (acquired by Target)',
      'Daxko',
      'Fleetio',
      'TechBirmingham',
      'UAB Collat School of Business'
    ],
    engineeringManufacturing: [
      'Southern Company (energy/utilities)',
      'ACIPCO (manufacturing)',
      'Brasfield & Gorrie (construction)',
      'Honda Manufacturing',
      'Vulcan Materials'
    ],
    educationNonprofit: [
      'Birmingham City Schools',
      'UAB',
      'Samford University',
      'Birmingham Promise',
      'Community Foundation Greater Birmingham'
    ],
    neighborhoods: [
      'Downtown/Five Points South',
      'Highland Park',
      'Avondale',
      'Homewood',
      'Mountain Brook',
      'Vestavia Hills'
    ],
    culturalAssets: [
      'Civil Rights District',
      'Railroad Park',
      'Sloss Furnaces',
      'Red Mountain',
      'Magic City'
    ]
  }

  constructor() {
    super(process.env.GEMINI_API_KEY || '', 'gemini-1.5-flash')
    this.filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
  }

  /**
   * Extract content with potential Birmingham integration opportunities
   */
  async extractBirminghamContent(): Promise<void> {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8')

    // Extract scene texts and choices that mention Birmingham or could benefit from local integration
    const scenePattern = /'([^']+)':\s*\{\s*id:\s*'[^']+',\s*text:\s*"([^"]*(?:\\.[^"]*)*)",[\s\S]*?choices:\s*\[([\s\S]*?)\]/g

    let sceneMatch
    while ((sceneMatch = scenePattern.exec(fileContent)) !== null) {
      const sceneId = sceneMatch[1]
      const sceneText = sceneMatch[2]
      const choicesBlock = sceneMatch[3]

      // Check scene text for Birmingham content
      const sceneHasLocal = this.hasLocalReferences(sceneText)
      const sceneLocalRefs = this.extractLocalReferences(sceneText)

      this.matches.push({
        sceneId,
        content: sceneText,
        contentType: 'scene_text',
        hasLocalReference: sceneHasLocal,
        localReferences: sceneLocalRefs
      })

      // Extract choices within this scene
      const choicePattern = /\{\s*text:\s*"([^"]*(?:\\.[^"]*)*)"/g

      let choiceMatch
      let choiceIndex = 0
      while ((choiceMatch = choicePattern.exec(choicesBlock)) !== null) {
        const choiceText = choiceMatch[1]
        const choiceHasLocal = this.hasLocalReferences(choiceText)
        const choiceLocalRefs = this.extractLocalReferences(choiceText)

        this.matches.push({
          sceneId,
          content: choiceText,
          contentType: 'choice_text',
          choiceIndex,
          hasLocalReference: choiceHasLocal,
          localReferences: choiceLocalRefs
        })
        choiceIndex++
      }
    }

    const withLocalRefs = this.matches.filter(m => m.hasLocalReference).length
    const totalContent = this.matches.length

    console.log(`🏙️ Found ${totalContent} content pieces to analyze for Birmingham integration`)
    console.log(`📍 ${withLocalRefs} already have local references (${((withLocalRefs/totalContent)*100).toFixed(1)}%)`)
  }

  /**
   * Check if content has Birmingham references
   */
  private hasLocalReferences(content: string): boolean {
    const lowerContent = content.toLowerCase()
    const keywords = [
      'birmingham', 'uab', 'regions', 'southern company', 'innovation depot',
      'shipt', 'magic city', 'sloss', 'vulcan', 'acipco', 'protective life'
    ]
    return keywords.some(keyword => lowerContent.includes(keyword))
  }

  /**
   * Extract specific local references from content
   */
  private extractLocalReferences(content: string): string[] {
    const references: string[] = []
    const lowerContent = content.toLowerCase()

    Object.values(this.birminghamContext).flat().forEach(entity => {
      if (lowerContent.includes(entity.toLowerCase())) {
        references.push(entity)
      }
    })

    return references
  }

  /**
   * Generate Birmingham integration optimization prompt
   */
  private getBirminghamOptimizationPrompt(match: BirminghamMatch): string {
    const contextInfo = `
BIRMINGHAM CAREER ECOSYSTEM:
- Major Employers: ${this.birminghamContext.majorEmployers.join(', ')}
- Healthcare Hub: ${this.birminghamContext.healthcareHub.join(', ')}
- Tech Ecosystem: ${this.birminghamContext.techEcosystem.join(', ')}
- Engineering/Manufacturing: ${this.birminghamContext.engineeringManufacturing.join(', ')}
- Education/Nonprofit: ${this.birminghamContext.educationNonprofit.join(', ')}
- Key Neighborhoods: ${this.birminghamContext.neighborhoods.join(', ')}
- Cultural Assets: ${this.birminghamContext.culturalAssets.join(', ')}
`

    return `Optimize this career exploration content for authentic Birmingham integration.

${contextInfo}

CONTENT TO OPTIMIZE:
Type: ${match.contentType}
Scene: ${match.sceneId}
Content: "${match.content}"
Current Local References: ${match.localReferences.join(', ') || 'None'}

OPTIMIZATION GOALS:
1. Local Relevance: Connect to real Birmingham career opportunities
2. Authenticity: Use accurate, current information about local economy
3. Actionability: Make local connections concrete and accessible
4. Compelling Factor: Make Birmingham opportunities feel attractive and viable

REQUIREMENTS:
- Maintain original meaning and narrative flow
- Add specific, accurate Birmingham references where appropriate
- Ensure local organizations/programs mentioned are real and current
- Keep tone consistent with career exploration game
- Make local connections feel natural, not forced

Rate current content 1-10 on each criterion, then provide optimization.

Format as:
LOCAL_RELEVANCE: [1-10]
AUTHENTICITY: [1-10]
ACTIONABILITY: [1-10]
COMPELLING: [1-10]
CURRENT_ELEMENTS: [existing Birmingham elements, comma-separated]
MISSING_OPPORTUNITIES: [missed local connections, comma-separated]
ACTION: [keep/enhance/add_references]
ENHANCED: [optimized version of the content]
ELEMENTS_ADDED: [new Birmingham elements added, comma-separated]
RATIONALE: [why this optimization improves Birmingham integration]
CONFIDENCE: [0.1-1.0]`
  }

  /**
   * Optimize a single piece of content for Birmingham integration
   */
  async optimizeBirminghamIntegration(match: BirminghamMatch): Promise<BirminghamAnalysisResult | null> {
    console.log(`  🏙️ Optimizing: ${match.sceneId} (${match.contentType}) - "${match.content.substring(0, 50)}..."`)

    try {
      const result = await this.model.generateContent(this.getBirminghamOptimizationPrompt(match))
      const responseText = result.response.text().trim()

      // Parse the simplified format
      const lines = responseText.split('\n').filter((line: string) => line.trim())
      const data: Record<string, string> = {}

      lines.forEach((line: string) => {
        const match = line.match(/^(\w+(?:_\w+)*):\s*(.+)$/)
        if (match) {
          data[match[1].toLowerCase()] = match[2].trim()
        }
      })

      // Validate required fields
      const requiredFields = ['local_relevance', 'authenticity', 'actionability', 'compelling', 'action', 'enhanced', 'confidence']
      for (const field of requiredFields) {
        if (!data[field]) {
          console.log(`  ⚠️ Missing required field ${field} for ${match.sceneId}`)
          return null
        }
      }

      const confidence = parseFloat(data.confidence)
      if (confidence < 0.7) {
        console.log(`  ⚠️ Low confidence (${confidence}) for ${match.sceneId}`)
        return null
      }

      // Create analysis result structure
      const analysis: BirminghamAnalysisResult = {
        content: match.content,
        content_type: match.contentType,
        scene_id: match.sceneId,
        analysis: {
          local_relevance_rating: parseInt(data.local_relevance),
          authenticity_rating: parseInt(data.authenticity),
          actionability_rating: parseInt(data.actionability),
          compelling_factor_rating: parseInt(data.compelling),
          current_birmingham_elements: data.current_elements ? data.current_elements.split(',').map(s => s.trim()) : [],
          missing_opportunities: data.missing_opportunities ? data.missing_opportunities.split(',').map(s => s.trim()) : []
        },
        optimization: {
          action: data.action as 'keep' | 'enhance' | 'add_references',
          enhanced_content: data.enhanced,
          local_elements_added: data.elements_added ? data.elements_added.split(',').map(s => s.trim()) : [],
          optimization_rationale: data.rationale || 'No specific rationale provided',
          confidence: confidence
        }
      }

      // Log the analysis result
      const avgRating = (
        analysis.analysis.local_relevance_rating +
        analysis.analysis.authenticity_rating +
        analysis.analysis.actionability_rating +
        analysis.analysis.compelling_factor_rating
      ) / 4

      if (avgRating < 6) {
        console.log(`  📈 Low Birmingham integration (${avgRating.toFixed(1)}) - Action: ${analysis.optimization.action}`)
      } else if (analysis.optimization.action !== 'keep') {
        console.log(`  🔧 Good integration (${avgRating.toFixed(1)}) - Enhancement possible`)
      } else {
        console.log(`  ✅ Strong Birmingham integration (${avgRating.toFixed(1)}) - Keep as-is`)
      }

      return analysis

    } catch (error: any) {
      console.log(`  ❌ Failed to analyze ${match.sceneId}: ${error.message}`)
      return null
    }
  }

  /**
   * Generate comprehensive Birmingham integration report
   */
  private generateBirminghamReport(analyses: BirminghamAnalysisResult[]): string {
    const totalAnalyzed = analyses.length
    const keepAsIs = analyses.filter(a => a.optimization.action === 'keep').length
    const enhanceCount = analyses.filter(a => a.optimization.action === 'enhance').length
    const addReferencesCount = analyses.filter(a => a.optimization.action === 'add_references').length

    // Calculate average scores
    const avgScores = {
      local_relevance: analyses.reduce((sum, a) => sum + a.analysis.local_relevance_rating, 0) / totalAnalyzed,
      authenticity: analyses.reduce((sum, a) => sum + a.analysis.authenticity_rating, 0) / totalAnalyzed,
      actionability: analyses.reduce((sum, a) => sum + a.analysis.actionability_rating, 0) / totalAnalyzed,
      compelling_factor: analyses.reduce((sum, a) => sum + a.analysis.compelling_factor_rating, 0) / totalAnalyzed
    }

    // Count all Birmingham elements mentioned
    const allCurrentElements: Record<string, number> = {}
    const allNewElements: Record<string, number> = {}

    analyses.forEach(a => {
      a.analysis.current_birmingham_elements.forEach(element => {
        allCurrentElements[element] = (allCurrentElements[element] || 0) + 1
      })
      a.optimization.local_elements_added.forEach(element => {
        allNewElements[element] = (allNewElements[element] || 0) + 1
      })
    })

    let report = `# Birmingham Integration Optimization Report

Generated: ${new Date().toISOString()}

## Executive Summary
- Total Content Analyzed: ${totalAnalyzed}
- Keep As-Is: ${keepAsIs} (${((keepAsIs/totalAnalyzed)*100).toFixed(1)}%)
- Enhance Integration: ${enhanceCount} (${((enhanceCount/totalAnalyzed)*100).toFixed(1)}%)
- Add References: ${addReferencesCount} (${((addReferencesCount/totalAnalyzed)*100).toFixed(1)}%)

## Birmingham Integration Metrics (Average Scores)
- **Local Relevance**: ${avgScores.local_relevance.toFixed(1)}/10
- **Authenticity**: ${avgScores.authenticity.toFixed(1)}/10
- **Actionability**: ${avgScores.actionability.toFixed(1)}/10
- **Compelling Factor**: ${avgScores.compelling_factor.toFixed(1)}/10

## Current Birmingham Elements in Game
${Object.entries(allCurrentElements)
  .sort(([,a], [,b]) => b - a)
  .map(([element, count]) => `- **${element}**: ${count} mentions`)
  .join('\n')}

## Proposed Birmingham Elements to Add
${Object.entries(allNewElements)
  .sort(([,a], [,b]) => b - a)
  .map(([element, count]) => `- **${element}**: ${count} recommendations`)
  .join('\n')}

## High-Impact Optimizations

### Content Needing Birmingham References (${addReferencesCount})
${analyses.filter(a => a.optimization.action === 'add_references').slice(0, 5).map(a => {
  const avgIntegration = (a.analysis.local_relevance_rating + a.analysis.authenticity_rating +
                         a.analysis.actionability_rating + a.analysis.compelling_factor_rating) / 4
  return `**Scene**: ${a.scene_id} (${a.content_type})
**Integration Score**: ${avgIntegration.toFixed(1)}/10
**Original**: "${a.content.substring(0, 100)}..."
**Enhanced**: "${a.optimization.enhanced_content.substring(0, 100)}..."
**Elements Added**: ${a.optimization.local_elements_added.join(', ')}
**Rationale**: ${a.optimization.optimization_rationale}
`
}).join('\n')}

### Content for Enhancement (${enhanceCount})
${analyses.filter(a => a.optimization.action === 'enhance').slice(0, 5).map(a => {
  const avgIntegration = (a.analysis.local_relevance_rating + a.analysis.authenticity_rating +
                         a.analysis.actionability_rating + a.analysis.compelling_factor_rating) / 4
  return `**Scene**: ${a.scene_id} (${a.content_type})
**Integration Score**: ${avgIntegration.toFixed(1)}/10
**Original**: "${a.content.substring(0, 100)}..."
**Enhanced**: "${a.optimization.enhanced_content.substring(0, 100)}..."
**Elements Added**: ${a.optimization.local_elements_added.join(', ')}
**Rationale**: ${a.optimization.optimization_rationale}
`
}).join('\n')}

## Birmingham Career Ecosystem Coverage

### Healthcare Sector Integration
${this.analyzeSectorCoverage(analyses, this.birminghamContext.healthcareHub)}

### Technology Sector Integration
${this.analyzeSectorCoverage(analyses, this.birminghamContext.techEcosystem)}

### Engineering/Manufacturing Sector Integration
${this.analyzeSectorCoverage(analyses, this.birminghamContext.engineeringManufacturing)}

### Education/Nonprofit Sector Integration
${this.analyzeSectorCoverage(analyses, this.birminghamContext.educationNonprofit)}

## Implementation Strategy

### Immediate Actions
1. **Add Birmingham references** to ${addReferencesCount} content pieces lacking local connections
2. **Enhance integration** in ${enhanceCount} pieces with weak local ties
3. **Focus on underrepresented sectors** to ensure comprehensive coverage

### Authenticity Guidelines
- Verify all organizational references are current and accurate
- Include specific program names and contact information where appropriate
- Reference real Birmingham neighborhoods and cultural assets authentically
- Maintain professional tone while celebrating local opportunities

### Narrative Integration
- Weave local references naturally into existing dialogue
- Use Birmingham history and culture to enhance character backgrounds
- Connect career paths to actual local success stories
- Ensure local elements enhance rather than disrupt narrative flow

## Quality Assurance Checklist

Before implementing optimizations:
- [ ] Verify all Birmingham organizations and programs mentioned are real and current
- [ ] Ensure contact information and program details are accurate
- [ ] Check that local references enhance rather than interrupt narrative flow
- [ ] Confirm cultural and historical references are respectful and accurate
- [ ] Validate that salary ranges and opportunity descriptions are realistic

## Next Steps in Pipeline

After implementing Birmingham integration:
1. Run consequence-consistency-auditor.ts to ensure narrative coherence
2. Conduct local expert review of Birmingham references
3. Test with Birmingham residents for authenticity validation

## Strategic Impact

Enhanced Birmingham integration will:
- **Strengthen Local Value Proposition**: Make the game uniquely valuable to Birmingham users
- **Increase Actionability**: Connect players to real, accessible local opportunities
- **Build Community Engagement**: Foster connections between players and local career ecosystem
- **Enhance Authenticity**: Demonstrate genuine understanding of Birmingham's economy and culture
`

    return report
  }

  /**
   * Analyze how well a specific sector is covered
   */
  private analyzeSectorCoverage(analyses: BirminghamAnalysisResult[], sectorEntities: string[]): string {
    const mentionedEntities = new Set()
    analyses.forEach(a => {
      [...a.analysis.current_birmingham_elements, ...a.optimization.local_elements_added].forEach(element => {
        if (sectorEntities.some(entity => entity.toLowerCase().includes(element.toLowerCase()) || element.toLowerCase().includes(entity.toLowerCase()))) {
          mentionedEntities.add(element)
        }
      })
    })

    const coveragePercent = (mentionedEntities.size / sectorEntities.length) * 100

    return `- **Coverage**: ${mentionedEntities.size}/${sectorEntities.length} entities (${coveragePercent.toFixed(1)}%)
- **Mentioned**: ${Array.from(mentionedEntities).join(', ') || 'None'}
- **Missing**: ${sectorEntities.filter(entity =>
    !Array.from(mentionedEntities).some((mentioned: any) =>
      entity.toLowerCase().includes(mentioned.toLowerCase()) || mentioned.toLowerCase().includes(entity.toLowerCase())
    )
  ).join(', ')}`
  }

  /**
   * Run the full Birmingham integration optimization
   */
  async run(): Promise<void> {
    console.log('🏙️ Starting Birmingham Integration Optimization...\n')

    // Extract all content with potential for Birmingham integration
    await this.extractBirminghamContent()

    // Focus on content that could benefit most from Birmingham integration
    const contentToOptimize = this.matches
      .filter(m =>
        // Include content with minimal local references or high improvement potential
        m.localReferences.length < 2 ||
        m.sceneId.includes('birmingham') ||
        m.sceneId.includes('opportunity') ||
        m.sceneId.includes('partnership') ||
        m.content.toLowerCase().includes('career') ||
        m.content.toLowerCase().includes('job')
      )
      .slice(0, 12) // Test with 12 pieces of content

    console.log(`\n🏙️ Analyzing ${contentToOptimize.length} content pieces for Birmingham optimization`)

    const results = await this.batchProcess(
      contentToOptimize,
      async (match) => {
        const analysis = await this.optimizeBirminghamIntegration(match)
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

    const validAnalyses = results.filter(r => r !== null) as BirminghamAnalysisResult[]

    console.log(`\n✅ Analyzed ${validAnalyses.length} content pieces for Birmingham optimization\n`)

    // Note: Birmingham integration often requires manual review for accuracy
    console.log(`💡 Found ${validAnalyses.filter(a => a.optimization.action !== 'keep').length} opportunities for Birmingham integration enhancement`)
    console.log(`Note: Birmingham integrations require expert review for accuracy before implementation`)

    // Generate comprehensive report
    const report = this.generateBirminghamReport(validAnalyses)
    fs.writeFileSync('birmingham-integration-report.md', report, 'utf-8')
    console.log('📄 Report saved to birmingham-integration-report.md')
    console.log('🏙️ Birmingham integration optimization complete!')
    console.log('\n💡 Next step: Review recommendations with local experts before implementation')
  }
}

// Run if called directly
async function main() {
  try {
    const optimizer = new BirminghamIntegrationOptimizer()
    await optimizer.run()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()

export { BirminghamIntegrationOptimizer }