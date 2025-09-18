/**
 * StoryStreamliner - Safe TypeScript Replacement for Legacy Script
 *
 * Replaces the dangerous streamline-to-career-focus.js with a safe,
 * comprehensive system that integrates all Phase 1 infrastructure:
 * - LuxStoryContext for centralized data access
 * - StoryValidator for integrity verification
 * - VisualStoryFlowAnalyzer for immediate debugging
 * - VersionedBackupSystem for rollback capability
 * - Confidence-based connection repair with human review
 */

import { GeminiContentFramework } from './gemini-content-framework'
import { StoryData, Scene, Choice, getLuxStoryContext } from './lux-story-context'
import { createStoryValidator, SchemaValidationResult } from './story-validator'
import { createVisualAnalyzer } from './visual-story-flow-analyzer'
import { createBackupSystem, BackupEntry } from './versioned-backup-system'
import fs from 'fs'
import path from 'path'

export interface StreamliningResult {
  success: boolean
  originalScenes: number
  keptScenes: number
  removedScenes: number
  repairedConnections: number
  validationResult: SchemaValidationResult
  backupEntry: BackupEntry | null
  outputPaths: {
    streamlined: string
    visualFlow: string
    report: string
  }
  errors: string[]
  warnings: string[]
}

export interface ConnectionRepairResult {
  originalChoice: Choice
  originalScene: string
  suggestedScene: string
  compatibilityScore: number
  reason: string
  analysisDetail: {
    emotionalMatch: number
    plotContinuity: number
    characterConsistency: number
  }
  requiresHumanReview: boolean
  applied: boolean
}

export interface SceneClassification {
  careerRelevance: number
  birminghamConnection: number
  narrativeImportance: number
  characterDevelopment: number
  mysticalContent: number
  isEssential: boolean
  finalScore: number
  keepRecommendation: boolean
  reasons: string[]
}

/**
 * Safe story streamlining system with comprehensive validation
 */
export class StoryStreamliner extends GeminiContentFramework {
  private context = getLuxStoryContext()
  private validator = createStoryValidator()
  private visualAnalyzer = createVisualAnalyzer()
  private backupSystem = createBackupSystem()

  private readonly paths = {
    storyData: path.join(process.cwd(), 'data', 'grand-central-story.json'),
    streamlined: path.join(process.cwd(), 'data', 'grand-central-story-streamlined.json'),
    report: path.join(process.cwd(), 'docs', 'STREAMLINING_REPORT.md')
  }

  constructor() {
    super(process.env.GEMINI_API_KEY || '', 'gemini-2.0-flash-exp')
  }

  /**
   * Main streamlining operation with full safety validation
   */
  async streamlineStory(options: {
    dryRun?: boolean
    skipBackup?: boolean
    humanReviewThreshold?: number
    generateVisuals?: boolean
  } = {}): Promise<StreamliningResult> {
    const {
      dryRun = true, // Default to dry run for safety
      skipBackup = false,
      humanReviewThreshold = 0.7,
      generateVisuals = true
    } = options

    console.log('🚀 Starting safe story streamlining...')
    console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)

    const result: StreamliningResult = {
      success: false,
      originalScenes: 0,
      keptScenes: 0,
      removedScenes: 0,
      repairedConnections: 0,
      validationResult: {} as SchemaValidationResult,
      backupEntry: null,
      outputPaths: {
        streamlined: this.paths.streamlined,
        visualFlow: '',
        report: this.paths.report
      },
      errors: [],
      warnings: []
    }

    try {
      // Initialize context and validate prerequisites
      await this.initializeAndValidate(result)

      // Create backup before any modifications
      if (!skipBackup && !dryRun) {
        result.backupEntry = await this.createSafeBackup()
      }

      // Perform streamlining analysis
      const originalStory = this.context.storyData!
      const streamlinedStory = await this.performStreamlining(originalStory, result)

      // Repair connections with confidence scoring
      await this.repairConnectionsWithConfidence(streamlinedStory, result, humanReviewThreshold)

      // Comprehensive validation
      result.validationResult = await this.validator.validateStreamlinedStory(originalStory, streamlinedStory)

      // Generate visual analysis if requested
      if (generateVisuals) {
        await this.generateVisualAnalysis(streamlinedStory, result)
      }

      // Write output files (or simulate in dry run)
      await this.writeOutputFiles(streamlinedStory, result, dryRun)

      // Generate comprehensive report
      await this.generateStreamliningReport(originalStory, streamlinedStory, result)

      result.success = result.validationResult.valid && result.errors.length === 0

      this.logFinalResults(result)

    } catch (error: any) {
      result.errors.push(`Streamlining failed: ${error.message}`)
      console.error('❌ Streamlining failed:', error.message)
    }

    return result
  }

  /**
   * Analyze single scene for classification
   */
  async classifyScene(scene: Scene): Promise<SceneClassification> {
    const classification: SceneClassification = {
      careerRelevance: 0,
      birminghamConnection: 0,
      narrativeImportance: 0,
      characterDevelopment: 0,
      mysticalContent: 0,
      isEssential: this.context.isEssentialScene(scene.id),
      finalScore: 0,
      keepRecommendation: false,
      reasons: []
    }

    // Essential scenes are always kept
    if (classification.isEssential) {
      classification.finalScore = 1.0
      classification.keepRecommendation = true
      classification.reasons.push('Essential scene')
      return classification
    }

    if (!this.context.configuration) {
      classification.reasons.push('No configuration available')
      return classification
    }

    const config = this.context.configuration
    const text = scene.text?.toLowerCase() || ''

    // Career relevance scoring
    const careerKeywords = [
      ...config.streamlining.careerKeywords.general,
      ...config.streamlining.careerKeywords.birmingham
    ]

    let careerMatches = 0
    for (const keyword of careerKeywords) {
      if (text.includes(keyword.toLowerCase())) {
        const weight = config.streamlining.careerKeywords.weights[keyword] || 1.0
        careerMatches += weight
      }
    }
    classification.careerRelevance = Math.min(careerMatches / 5, 1.0) // Normalize to 0-1

    // Birmingham connection scoring
    const birminghamRefs = this.context.getBirminghamReferences(scene)
    classification.birminghamConnection = Math.min(birminghamRefs.length / 3, 1.0)

    // Narrative importance (choice scenes, character interactions)
    if (scene.type === 'choice' && scene.choices && scene.choices.length > 0) {
      classification.narrativeImportance += 0.3
    }
    if (scene.speaker && scene.speaker !== 'Narrator') {
      classification.narrativeImportance += 0.2
    }
    if (text.includes('first') || text.includes('final') || text.includes('ending')) {
      classification.narrativeImportance += 0.3
    }

    // Character development scoring
    if (scene.speaker && scene.speaker !== 'Narrator') {
      classification.characterDevelopment += 0.4
    }
    if (text.includes('trust') || text.includes('relationship') || text.includes('confidence')) {
      classification.characterDevelopment += 0.3
    }

    // Mystical content detection (negative scoring)
    const mysticalWords = ['cosmic', 'eternal', 'mystical', 'magical', 'shimmer', 'glow', 'ethereal', 'divine']
    let mysticalCount = 0
    for (const word of mysticalWords) {
      if (text.includes(word)) {
        mysticalCount++
      }
    }
    classification.mysticalContent = Math.min(mysticalCount / mysticalWords.length, 1.0)

    // Calculate final score
    classification.finalScore =
      (classification.careerRelevance * 0.4) +
      (classification.birminghamConnection * 0.3) +
      (classification.narrativeImportance * 0.2) +
      (classification.characterDevelopment * 0.1) -
      (classification.mysticalContent * 0.2)

    // Apply minimum threshold
    const threshold = config.streamlining.thresholds.careerRelevance
    classification.keepRecommendation = classification.finalScore >= threshold

    // Generate reasons
    if (classification.careerRelevance > 0.5) {
      classification.reasons.push('High career relevance')
    }
    if (classification.birminghamConnection > 0.3) {
      classification.reasons.push('Birmingham connection')
    }
    if (classification.narrativeImportance > 0.5) {
      classification.reasons.push('Important for story flow')
    }
    if (classification.mysticalContent > 0.5) {
      classification.reasons.push('High mystical content (negative)')
    }

    return classification
  }

  /**
   * Generate connection repair with confidence scoring
   */
  async repairConnectionWithConfidence(
    fromScene: string,
    choice: Choice,
    availableScenes: string[]
  ): Promise<ConnectionRepairResult | null> {
    if (!choice.nextScene || availableScenes.includes(choice.nextScene)) {
      return null // No repair needed
    }

    console.log(`🔧 Repairing broken connection: ${fromScene} -> ${choice.nextScene}`)

    try {
      const prompt = this.buildConnectionRepairPrompt(fromScene, choice, availableScenes)
      const response = await this.model.generateContent(prompt)
      const analysisText = response.response.text().trim()

      // Parse the AI response
      const analysis = this.parseConnectionRepairResponse(analysisText)
      if (!analysis) {
        return null
      }

      // Calculate overall compatibility score
      const compatibilityScore = (
        analysis.emotionalMatch +
        analysis.plotContinuity +
        analysis.characterConsistency
      ) / 3

      const result: ConnectionRepairResult = {
        originalChoice: choice,
        originalScene: fromScene,
        suggestedScene: analysis.suggestedScene,
        compatibilityScore,
        reason: analysis.reason,
        analysisDetail: {
          emotionalMatch: analysis.emotionalMatch,
          plotContinuity: analysis.plotContinuity,
          characterConsistency: analysis.characterConsistency
        },
        requiresHumanReview: compatibilityScore < 0.9,
        applied: false
      }

      return result

    } catch (error: any) {
      console.log(`⚠️ Failed to analyze connection repair: ${error.message}`)
      return null
    }
  }

  // Private implementation methods

  private async initializeAndValidate(result: StreamliningResult): Promise<void> {
    // Initialize context
    if (!this.context.storyData) {
      await this.context.initialize()
    }

    // Validate original story
    const validation = this.context.validate()
    if (!validation.valid) {
      result.errors.push(...validation.errors)
      throw new Error('Original story validation failed')
    }

    result.originalScenes = validation.summary.totalScenes
    console.log(`✅ Initialized context: ${result.originalScenes} scenes`)
  }

  private async createSafeBackup(): Promise<BackupEntry> {
    console.log('📦 Creating versioned backup...')

    const backupEntry = await this.backupSystem.createBackup(this.paths.storyData, {
      description: 'Pre-streamlining backup',
      operation: 'streamlining',
      author: 'story-streamliner',
      tags: ['automated', 'pre-streamlining']
    })

    console.log(`✅ Backup created: ${backupEntry.id}`)
    return backupEntry
  }

  private async performStreamlining(originalStory: StoryData, result: StreamliningResult): Promise<StoryData> {
    console.log('🎯 Performing scene classification and filtering...')

    const streamlinedStory: StoryData = {
      title: originalStory.title,
      author: originalStory.author,
      version: originalStory.version + '-streamlined',
      chapters: []
    }

    for (const chapter of originalStory.chapters) {
      const streamlinedChapter = {
        id: chapter.id,
        title: chapter.title,
        scenes: [] as Scene[]
      }

      for (const scene of chapter.scenes) {
        const classification = await this.classifyScene(scene)

        if (classification.keepRecommendation) {
          streamlinedChapter.scenes.push(scene)
          result.keptScenes++
        } else {
          result.removedScenes++
          console.log(`   Removed: ${scene.id} (score: ${classification.finalScore.toFixed(2)})`)
        }
      }

      // Only include chapters that have scenes
      if (streamlinedChapter.scenes.length > 0) {
        streamlinedStory.chapters.push(streamlinedChapter)
      }
    }

    console.log(`📊 Streamlining complete: ${result.keptScenes} kept, ${result.removedScenes} removed`)
    return streamlinedStory
  }

  private async repairConnectionsWithConfidence(
    story: StoryData,
    result: StreamliningResult,
    humanReviewThreshold: number
  ): Promise<void> {
    console.log('🔗 Repairing scene connections with confidence scoring...')

    const allSceneIds = this.getAllSceneIds(story)
    const repairResults: ConnectionRepairResult[] = []

    for (const chapter of story.chapters) {
      for (const scene of chapter.scenes) {
        if (scene.choices) {
          for (const choice of scene.choices) {
            const repair = await this.repairConnectionWithConfidence(scene.id, choice, allSceneIds)
            if (repair) {
              repairResults.push(repair)

              // Apply repair if confidence is high enough
              if (repair.compatibilityScore >= 0.9) {
                choice.nextScene = repair.suggestedScene
                repair.applied = true
                result.repairedConnections++
                console.log(`   ✅ Auto-repaired: ${repair.originalScene} -> ${repair.suggestedScene} (${repair.compatibilityScore.toFixed(2)})`)
              } else {
                result.warnings.push(`Connection ${repair.originalScene} -> ${repair.suggestedScene} requires human review (confidence: ${repair.compatibilityScore.toFixed(2)})`)
                console.log(`   ⚠️ Review needed: ${repair.originalScene} -> ${repair.suggestedScene} (${repair.compatibilityScore.toFixed(2)})`)
              }
            }
          }
        }
      }
    }

    // Report repairs needing human review
    const needsReview = repairResults.filter(r => r.requiresHumanReview && !r.applied)
    if (needsReview.length > 0) {
      result.warnings.push(`${needsReview.length} connection repairs require human review`)
    }
  }

  private async generateVisualAnalysis(story: StoryData, result: StreamliningResult): Promise<void> {
    console.log('🎨 Generating visual flow analysis...')

    try {
      // Generate DOT file
      this.visualAnalyzer.generateDotFile(story)

      // Create visualization
      await this.visualAnalyzer.visualizeConnections()

      // Detect issues
      const deadEnds = this.visualAnalyzer.detectDeadEnds(story)
      const loops = this.visualAnalyzer.findNarrativeLoops(story)

      if (deadEnds.length > 0) {
        result.warnings.push(`Found ${deadEnds.length} narrative dead ends`)
      }

      if (loops.length > 0) {
        result.warnings.push(`Found ${loops.length} narrative loops`)
      }

      result.outputPaths.visualFlow = path.join(process.cwd(), 'visual-output', 'story-flow.svg')
      console.log(`✅ Visual analysis complete`)

    } catch (error: any) {
      result.warnings.push(`Visual analysis failed: ${error.message}`)
    }
  }

  private async writeOutputFiles(story: StoryData, result: StreamliningResult, dryRun: boolean): Promise<void> {
    if (dryRun) {
      console.log('🧪 DRY RUN: Would write streamlined story file')
      return
    }

    console.log('📝 Writing streamlined story file...')

    const storyJson = JSON.stringify(story, null, 2)
    fs.writeFileSync(this.paths.streamlined, storyJson, 'utf-8')

    console.log(`✅ Streamlined story written: ${this.paths.streamlined}`)
  }

  private async generateStreamliningReport(
    originalStory: StoryData,
    streamlinedStory: StoryData,
    result: StreamliningResult
  ): Promise<void> {
    console.log('📋 Generating comprehensive report...')

    const reductionPercentage = ((result.removedScenes / result.originalScenes) * 100).toFixed(1)
    const timestamp = new Date().toISOString()

    const report = `# Story Streamlining Report

Generated: ${timestamp}
Operation: ${result.success ? 'SUCCESS' : 'FAILED'}

## Summary Statistics
- **Original Scenes**: ${result.originalScenes}
- **Scenes Kept**: ${result.keptScenes} (${((result.keptScenes / result.originalScenes) * 100).toFixed(1)}%)
- **Scenes Removed**: ${result.removedScenes} (${reductionPercentage}%)
- **Connections Repaired**: ${result.repairedConnections}

## Validation Results
- **Overall Valid**: ${result.validationResult.valid ? '✅' : '❌'}
- **Critical Errors**: ${result.validationResult.errors?.filter(e => e.severity === 'critical').length || 0}
- **High Errors**: ${result.validationResult.errors?.filter(e => e.severity === 'high').length || 0}
- **Warnings**: ${result.validationResult.warnings?.length || 0}

## Safety Measures Applied
- **Backup Created**: ${result.backupEntry ? '✅ ' + result.backupEntry.id : '❌ Skipped'}
- **Pre-validation**: ✅ Passed
- **Post-validation**: ${result.validationResult.valid ? '✅ Passed' : '❌ Failed'}
- **Visual Analysis**: ${result.outputPaths.visualFlow ? '✅ Generated' : '⚠️ Skipped'}

## Issues Requiring Attention
${result.errors.length > 0 ? `
### Errors (${result.errors.length})
${result.errors.map(error => `- ❌ ${error}`).join('\\n')}
` : '### No Errors ✅'}

${result.warnings.length > 0 ? `
### Warnings (${result.warnings.length})
${result.warnings.map(warning => `- ⚠️ ${warning}`).join('\\n')}
` : '### No Warnings ✅'}

## File Outputs
- **Streamlined Story**: \`${result.outputPaths.streamlined}\`
- **Visual Flow**: \`${result.outputPaths.visualFlow || 'Not generated'}\`
- **This Report**: \`${result.outputPaths.report}\`

## Next Steps
${result.success ? `
✅ **Streamlining completed successfully**

1. Review any warnings above
2. Test the streamlined story in the game interface
3. Run additional validation scripts if needed
4. Consider running visual analysis for deeper insights
` : `
❌ **Streamlining failed - manual intervention required**

1. Review errors above and fix underlying issues
2. Restore from backup if needed: \`${result.backupEntry?.id || 'no backup'}\`
3. Re-run streamlining after fixes
4. Consider adjusting streamlining thresholds
`}

---
*Generated by StoryStreamliner v2.0 - Safe TypeScript Implementation*
`

    fs.writeFileSync(this.paths.report, report, 'utf-8')
    console.log(`✅ Report generated: ${this.paths.report}`)
  }

  private buildConnectionRepairPrompt(fromScene: string, choice: Choice, availableScenes: string[]): string {
    return `Analyze the best scene connection for narrative coherence.

CONTEXT:
- From Scene: ${fromScene}
- Broken Choice: "${choice.text}"
- Original Target: ${choice.nextScene} (removed)
- Available Scenes: ${availableScenes.slice(0, 10).join(', ')}${availableScenes.length > 10 ? '...' : ''}

ANALYZE:
Rate 0.0-1.0 for each factor:
1. Emotional Match: Does the choice emotion/tone match the target scene?
2. Plot Continuity: Does this maintain logical story progression?
3. Character Consistency: Are character states/relationships preserved?

RESPONSE FORMAT:
SUGGESTED_SCENE: [scene_id]
EMOTIONAL_MATCH: [0.0-1.0]
PLOT_CONTINUITY: [0.0-1.0]
CHARACTER_CONSISTENCY: [0.0-1.0]
REASON: [brief explanation]

Choose the best available scene that maintains narrative coherence.`
  }

  private parseConnectionRepairResponse(response: string): {
    suggestedScene: string
    emotionalMatch: number
    plotContinuity: number
    characterConsistency: number
    reason: string
  } | null {
    try {
      const lines = response.split('\n').filter(line => line.trim())
      const data: Record<string, string> = {}

      for (const line of lines) {
        const match = line.match(/^(\w+):\s*(.+)$/)
        if (match) {
          data[match[1].toLowerCase()] = match[2].trim()
        }
      }

      if (!data.suggested_scene || !data.emotional_match || !data.plot_continuity || !data.character_consistency) {
        return null
      }

      return {
        suggestedScene: data.suggested_scene,
        emotionalMatch: parseFloat(data.emotional_match),
        plotContinuity: parseFloat(data.plot_continuity),
        characterConsistency: parseFloat(data.character_consistency),
        reason: data.reason || 'No reason provided'
      }
    } catch (error) {
      return null
    }
  }

  private getAllSceneIds(story: StoryData): string[] {
    const sceneIds: string[] = []
    for (const chapter of story.chapters) {
      for (const scene of chapter.scenes) {
        sceneIds.push(scene.id)
      }
    }
    return sceneIds
  }

  private logFinalResults(result: StreamliningResult): void {
    console.log('\n🎯 Streamlining Results:')
    console.log(`   ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`)
    console.log(`   Scenes: ${result.originalScenes} → ${result.keptScenes} (${((result.keptScenes / result.originalScenes) * 100).toFixed(1)}%)`)
    console.log(`   Connections repaired: ${result.repairedConnections}`)
    console.log(`   Errors: ${result.errors.length}`)
    console.log(`   Warnings: ${result.warnings.length}`)

    if (result.backupEntry) {
      console.log(`   Backup: ${result.backupEntry.id}`)
    }

    console.log(`\n📋 Report: ${result.outputPaths.report}`)
  }
}

// Export convenience function
export const createStoryStreamliner = () => new StoryStreamliner()

// CLI execution
async function main() {
  const args = process.argv.slice(2)
  const dryRun = !args.includes('--live')
  const skipBackup = args.includes('--skip-backup')
  const skipVisuals = args.includes('--skip-visuals')

  console.log('🚀 Story Streamliner - Safe TypeScript Implementation')
  console.log(`   Mode: ${dryRun ? 'DRY RUN (use --live for actual execution)' : 'LIVE EXECUTION'}`)

  try {
    const streamliner = createStoryStreamliner()
    const result = await streamliner.streamlineStory({
      dryRun,
      skipBackup,
      generateVisuals: !skipVisuals
    })

    if (result.success) {
      console.log('\n🎉 Streamlining completed successfully!')
      process.exit(0)
    } else {
      console.log('\n💥 Streamlining failed - see report for details')
      process.exit(1)
    }
  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}