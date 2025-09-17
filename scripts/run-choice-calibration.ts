/**
 * Choice Calibration Script using Gemini API
 *
 * Ensures every choice in the game clearly maps to one of four performance patterns:
 * - Analytical: Logic-based, data-driven, asking "why" or "how"
 * - Helping: People-focused, supportive, empathetic
 * - Building: Creative, hands-on, systems-oriented
 * - Patience: Thoughtful, observational, long-term thinking
 */

import { GeminiContentFramework } from './gemini-content-framework'
import fs from 'fs'
import path from 'path'

interface SceneChoice {
  text: string
  next: string
  consequence?: string
  pattern: 'analytical' | 'helping' | 'building' | 'patience'
}

interface SceneMatch {
  id: string
  content: string
  choices?: SceneChoice[]
  hasChoices: boolean
  startIndex: number
  endIndex: number
}

class ChoiceCalibrator extends GeminiContentFramework {
  private scenes: SceneMatch[] = []
  private filePath: string

  constructor() {
    super()
    this.filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
  }

  /**
   * Extract all scenes with choices from the game file
   */
  async extractScenes(): Promise<void> {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8')

    // Pattern to match scene objects with choices
    const scenePattern = /'([^']+)':\s*\{[^}]*choices:\s*\[([^\]]+)\][^}]*\}/g

    let match
    while ((match = scenePattern.exec(fileContent)) !== null) {
      // Parse the choices array
      const choicesStr = match[2]
      const hasChoices = choicesStr.trim().length > 0

      this.scenes.push({
        id: match[1],
        content: match[0],
        hasChoices,
        startIndex: match.index,
        endIndex: match.index + match[0].length
      })
    }

    console.log(`📊 Found ${this.scenes.length} scenes with choices to analyze`)
  }

  /**
   * Generate calibration prompt for a scene
   */
  private getCalibrationPrompt(scene: SceneMatch): string {
    return `You are a narrative designer for Lux Story, a contemplative career exploration game.
Your task is to calibrate the choices in this scene to clearly map to performance patterns.

THE FOUR PERFORMANCE PATTERNS:
1. Analytical: Logic-based, data-driven, systematic thinking. Keywords: "analyze", "why", "how", "data", "efficiency"
2. Helping: People-focused, supportive, empathetic. Keywords: "support", "help", "comfort", "understand", "feel"
3. Building: Creative, hands-on, making things. Keywords: "create", "build", "design", "construct", "make"
4. Patience: Thoughtful, observational, long-term view. Keywords: "wait", "observe", "learn", "consider", "reflect"

CURRENT SCENE:
${scene.content}

ANALYSIS REQUIRED:
1. Does each choice clearly represent ONE distinct pattern?
2. Are the patterns correctly assigned?
3. Is there good variety (ideally all 4 patterns represented)?
4. Do the choice texts feel natural and in-character?

If improvements are needed, return the ENTIRE scene block with refined choices.
Each choice should:
- Clearly embody its assigned pattern
- Feel natural in the game's contemplative tone
- Be distinct from other options
- Maintain character voice

If the choices are already well-calibrated, return "APPROVED" only.
Otherwise, return the complete fixed scene block with improved choices.`
  }

  /**
   * Calibrate choices for a single scene
   */
  async calibrateScene(scene: SceneMatch): Promise<string | null> {
    // Quality check - skip scenes without meaningful choices
    if (!scene.hasChoices || scene.content.length < 100) {
      console.log(`  ⏭️  Skipping ${scene.id} (no substantive choices)`)
      return null
    }

    console.log(`  🎯 Calibrating choices for ${scene.id}`)

    // Validation rules for the improved content
    const validationRules = [
      (content: string) => {
        const hasAllPatterns =
          content.includes("pattern: 'analytical'") &&
          content.includes("pattern: 'helping'") &&
          content.includes("pattern: 'building'") &&
          content.includes("pattern: 'patience'")
        return {
          valid: hasAllPatterns,
          reason: hasAllPatterns ? '' : 'Not all four patterns represented'
        }
      },
      (content: string) => {
        const hasValidStructure = content.includes('choices: [') && content.includes(']')
        return {
          valid: hasValidStructure,
          reason: hasValidStructure ? '' : 'Invalid choice structure'
        }
      },
      (content: string) => {
        // Check that choices aren't too similar
        const choiceTexts = content.match(/text: "[^"]+"/g) || []
        const uniqueStarts = new Set(choiceTexts.map(c => c.substring(0, 20)))
        const tooSimilar = uniqueStarts.size < choiceTexts.length * 0.7
        return {
          valid: !tooSimilar,
          reason: tooSimilar ? 'Choices are too similar to each other' : ''
        }
      }
    ]

    const result = await this.improveContent(
      scene.content,
      this.getCalibrationPrompt(scene),
      validationRules
    )

    if (result.improved === 'APPROVED') {
      console.log(`  ✅ ${scene.id} already well-calibrated`)
      return null
    }

    if (result.confidence < 0.7) {
      console.log(`  ⚠️  Low confidence (${result.confidence}) for ${scene.id}, skipping`)
      return null
    }

    if (result.issues.length > 0) {
      console.log(`  ⚠️  Issues found: ${result.issues.join(', ')}`)
    }

    return result.improved
  }

  /**
   * Run the full calibration process
   */
  async run(): Promise<void> {
    console.log('🚀 Starting Choice Calibration with Gemini...\n')

    // Extract scenes
    await this.extractScenes()

    if (this.scenes.length === 0) {
      console.log('❌ No scenes with choices found')
      return
    }

    // Process scenes in batches
    const improvements: Array<{
      scene: SceneMatch
      improved: string
    }> = []

    const batchResults = await this.batchProcess(
      this.scenes,
      async (scene) => {
        const improved = await this.calibrateScene(scene)
        if (improved && improved !== 'APPROVED') {
          return { scene, improved }
        }
        return null
      },
      {
        batchSize: 3,
        delayMs: 2000,
        onProgress: (current, total) => {
          console.log(`\n📈 Progress: ${current}/${total} scenes processed`)
        }
      }
    )

    // Collect successful improvements
    batchResults.forEach(result => {
      if (result) improvements.push(result)
    })

    console.log(`\n✅ Found ${improvements.length} scenes needing calibration\n`)

    if (improvements.length === 0) {
      console.log('🎉 All choices are already well-calibrated!')
      return
    }

    // Apply improvements
    const stats = await this.applyImprovements(
      this.filePath,
      improvements.map(imp => ({
        match: {
          id: imp.scene.id,
          content: imp.scene.content,
          metadata: {},
          startIndex: imp.scene.startIndex,
          endIndex: imp.scene.endIndex
        },
        result: {
          original: imp.scene.content,
          improved: imp.improved,
          confidence: 0.9,
          issues: []
        }
      })),
      {
        minConfidence: 0.7,
        createBackup: true
      }
    )

    // Generate report
    const report = `Choice Calibration Report
Generated: ${new Date().toISOString()}

Scenes Analyzed: ${this.scenes.length}
Scenes Improved: ${stats.applied}
Scenes Skipped: ${stats.skipped}

Pattern Distribution Check:
- Analytical: ${this.scenes.filter(s => s.content.includes("pattern: 'analytical'")).length} scenes
- Helping: ${this.scenes.filter(s => s.content.includes("pattern: 'helping'")).length} scenes
- Building: ${this.scenes.filter(s => s.content.includes("pattern: 'building'")).length} scenes
- Patience: ${this.scenes.filter(s => s.content.includes("pattern: 'patience'")).length} scenes

Issues Encountered:
${stats.errors.join('\n')}

Summary:
The choice calibration ensures that every player choice clearly maps to one of the four
performance patterns, improving the accuracy of the invisible metrics system and making
the adaptive narrative more meaningful.
`

    fs.writeFileSync('choice-calibration-report.txt', report, 'utf-8')
    console.log('\n📄 Report saved to choice-calibration-report.txt')
    console.log('🎯 Choice calibration complete!')
  }
}

// Run if called directly
async function main() {
  try {
    const calibrator = new ChoiceCalibrator()
    await calibrator.run()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()

export { ChoiceCalibrator }