/**
 * Missing Scene Generator Script
 *
 * Uses Gemini to automatically generate missing scenes identified by the Navigation Consistency Auditor.
 * Creates contextually appropriate scenes based on choice text and source scene context.
 *
 * Generation Strategy:
 * - Analyze choice text to understand user intent
 * - Extract context from source scene
 * - Generate scene following Grand Central Terminus narrative style
 * - Ensure Birmingham career focus and pattern consistency
 */

import { GeminiContentFramework } from './gemini-content-framework'
import fs from 'fs'
import path from 'path'

interface MissingScene {
  sceneId: string
  references: Array<{
    choiceText: string
    sourceScene: string
    lineNumber: number
  }>
}

interface GeneratedScene {
  sceneId: string
  content: string
  confidence: number
  reasoning: string
}

class MissingSceneGenerator extends GeminiContentFramework {
  private missingScenes: MissingScene[] = []
  private filePath: string
  private existingContent: string

  constructor() {
    super(process.env.GEMINI_API_KEY || '', 'gemini-2.0-flash-exp')
    this.filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
    this.existingContent = fs.readFileSync(this.filePath, 'utf-8')
  }

  /**
   * Parse navigation audit report to extract missing scenes
   */
  private parseMissingScenes(): void {
    const reportPath = path.join(process.cwd(), 'navigation-consistency-audit-report.md')
    const reportContent = fs.readFileSync(reportPath, 'utf-8')

    // Extract scene information from the report
    const sceneBlocks = reportContent.split('### Scene "').slice(1)

    sceneBlocks.forEach(block => {
      const lines = block.split('\n')
      const sceneId = lines[0].split('" is referenced')[0]

      if (sceneId === '${fallback}') return // Skip template literal issues

      const references: MissingScene['references'] = []

      // Extract references
      let inReferences = false
      for (const line of lines) {
        if (line.includes('**Affected References:**')) {
          inReferences = true
          continue
        }
        if (line.includes('**Suggested Fix:**')) {
          break
        }
        if (inReferences && line.startsWith('- "')) {
          const match = line.match(/- "([^"]+)" from `([^`]+)` \(line (\d+)\)/)
          if (match) {
            references.push({
              choiceText: match[1],
              sourceScene: match[2],
              lineNumber: parseInt(match[3])
            })
          }
        }
      }

      if (references.length > 0) {
        this.missingScenes.push({ sceneId, references })
      }
    })

    console.log(`📝 Found ${this.missingScenes.length} missing scenes to generate`)
  }

  /**
   * Extract context from source scene
   */
  private extractSourceContext(sourceScene: string): string {
    const scenePattern = new RegExp(`'${sourceScene}':\\s*\\{([^}]*(?:\\{[^}]*\\}[^}]*)*)\\}`, 's')
    const match = this.existingContent.match(scenePattern)

    if (match) {
      return match[1].trim()
    }
    return 'No source context found'
  }

  /**
   * Generate scene content using Gemini
   */
  private getSceneGenerationPrompt(scene: MissingScene): string {
    const primaryReference = scene.references[0]
    const sourceContext = this.extractSourceContext(primaryReference.sourceScene)

    return `Generate a missing scene for the Grand Central Terminus career exploration game.

SCENE ID: ${scene.sceneId}
CHOICE TEXT: "${primaryReference.choiceText}"
SOURCE SCENE: ${primaryReference.sourceScene}

SOURCE CONTEXT:
${sourceContext}

GAME CONTEXT:
- Setting: Grand Central Terminus - a liminal train station for career exploration
- Location: Birmingham, Alabama career ecosystem
- Characters: Maya (pre-med/robotics), Devon (engineering), Jordan (career changer), Samuel (station keeper)
- Patterns: analytical, helping, building, patience
- Focus: Real Birmingham opportunities, authentic career guidance

REQUIREMENTS:
1. Scene must respond to the choice text meaningfully
2. Include 3-4 choices with different pattern types
3. Birmingham career focus when relevant
4. Match existing dialogue style and depth
5. Include consequence tracking and pattern assignment

FORMAT:
SCENE_ID: ${scene.sceneId}
TEXT: [scene dialogue text]
CHOICE1: [choice text] | NEXT: [scene] | PATTERN: [pattern] | CONSEQUENCE: [consequence]
CHOICE2: [choice text] | NEXT: [scene] | PATTERN: [pattern] | CONSEQUENCE: [consequence]
CHOICE3: [choice text] | NEXT: [scene] | PATTERN: [pattern] | CONSEQUENCE: [consequence]
CHOICE4: [choice text] | NEXT: [scene] | PATTERN: [pattern] | CONSEQUENCE: [consequence]
CONFIDENCE: [0.1-1.0]
REASONING: [why this scene makes sense]

Generate authentic, engaging content that advances the narrative meaningfully.`
  }

  /**
   * Generate a single scene using Gemini
   */
  async generateScene(scene: MissingScene): Promise<GeneratedScene | null> {
    console.log(`  🎭 Generating scene: ${scene.sceneId}`)

    try {
      const result = await this.model.generateContent(this.getSceneGenerationPrompt(scene))
      const responseText = result.response.text().trim()

      // Parse the response
      const lines = responseText.split('\n')
      const data: Record<string, string> = {}

      lines.forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/)
        if (match) {
          data[match[1].toLowerCase()] = match[2].trim()
        }
      })

      if (!data.text || !data.confidence) {
        console.log(`  ⚠️ Incomplete scene generation for ${scene.sceneId}`)
        return null
      }

      const confidence = parseFloat(data.confidence)
      if (confidence < 0.7) {
        console.log(`  ⚠️ Low confidence (${confidence}) for ${scene.sceneId}`)
        return null
      }

      // Build the scene object
      const choices = []
      for (let i = 1; i <= 4; i++) {
        const choiceKey = `choice${i}`
        if (data[choiceKey]) {
          const parts = data[choiceKey].split(' | ')
          if (parts.length >= 4) {
            choices.push({
              text: parts[0],
              next: parts[1].replace('NEXT: ', ''),
              pattern: parts[2].replace('PATTERN: ', ''),
              consequence: parts[3].replace('CONSEQUENCE: ', '')
            })
          }
        }
      }

      const sceneContent = `  '${scene.sceneId}': {
    text: "${data.text}",
    choices: [
${choices.map(choice =>
  `      { text: "${choice.text}", next: '${choice.next}', consequence: '${choice.consequence}', pattern: '${choice.pattern}' }`
).join(',\n')}
    ]
  }`

      console.log(`  ✅ Generated scene ${scene.sceneId} (confidence: ${confidence})`)

      return {
        sceneId: scene.sceneId,
        content: sceneContent,
        confidence,
        reasoning: data.reasoning || 'No reasoning provided'
      }

    } catch (error: any) {
      console.log(`  ❌ Failed to generate ${scene.sceneId}: ${error.message}`)
      return null
    }
  }

  /**
   * Apply generated scenes to the game file
   */
  private async applyGeneratedScenes(scenes: GeneratedScene[]): Promise<void> {
    if (scenes.length === 0) {
      console.log('No scenes to apply')
      return
    }

    // Create backup
    const backupPath = `${this.filePath}.scene-generation-backup-${Date.now()}`
    fs.writeFileSync(backupPath, this.existingContent, 'utf-8')
    console.log(`📁 Backup created: ${backupPath}`)

    // Find the end of the scenes object
    const scenesEndPattern = /(\s*}\s*};?\s*)/
    const match = this.existingContent.match(scenesEndPattern)

    if (!match) {
      console.log('❌ Could not find scenes object end')
      return
    }

    // Insert new scenes before the closing brace
    const insertPoint = this.existingContent.lastIndexOf(match[0])
    const newScenesContent = scenes.map(scene => scene.content).join(',\n\n')

    const updatedContent =
      this.existingContent.substring(0, insertPoint) +
      ',\n\n' + newScenesContent +
      this.existingContent.substring(insertPoint)

    // Write updated content
    fs.writeFileSync(this.filePath, updatedContent, 'utf-8')

    console.log(`✅ Applied ${scenes.length} generated scenes to game file`)
  }

  /**
   * Generate summary report
   */
  private generateReport(scenes: GeneratedScene[]): void {
    const report = `# Missing Scene Generation Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Missing Scenes Identified**: ${this.missingScenes.length}
- **Scenes Successfully Generated**: ${scenes.length}
- **Success Rate**: ${((scenes.length / this.missingScenes.length) * 100).toFixed(1)}%

## Generated Scenes

${scenes.map(scene => `
### ${scene.sceneId}

**Confidence**: ${scene.confidence}
**Reasoning**: ${scene.reasoning}

\`\`\`typescript
${scene.content}
\`\`\`
`).join('\n')}

## Next Steps

1. Test the generated scenes in the game
2. Re-run navigation consistency auditor to verify fixes
3. Review and refine any low-confidence scenes
4. Continue with remaining missing scenes if needed

---

*Generated scenes follow Grand Central Terminus narrative style and Birmingham career focus.*
`

    fs.writeFileSync('missing-scene-generation-report.md', report, 'utf-8')
    console.log('📄 Report saved to missing-scene-generation-report.md')
  }

  /**
   * Run the missing scene generation process
   */
  async run(limit: number = 10): Promise<void> {
    console.log('🎭 Starting Missing Scene Generation...\n')

    // Parse missing scenes from audit report
    this.parseMissingScenes()

    if (this.missingScenes.length === 0) {
      console.log('✅ No missing scenes found!')
      return
    }

    // Limit for initial batch
    const scenesToGenerate = this.missingScenes.slice(0, limit)
    console.log(`🎯 Generating first ${scenesToGenerate.length} scenes (out of ${this.missingScenes.length} total)`)

    // Generate scenes
    const generatedScenes: GeneratedScene[] = []

    const results = await this.batchProcess(
      scenesToGenerate,
      async (scene) => {
        return await this.generateScene(scene)
      },
      {
        batchSize: 3,
        delayMs: 4000,
        onProgress: (current, total) => {
          console.log(`   Progress: ${current}/${total}`)
        }
      }
    )

    results.forEach(result => {
      if (result) generatedScenes.push(result)
    })

    console.log(`\n✅ Generated ${generatedScenes.length} scenes successfully`)

    // Apply scenes to game file
    if (generatedScenes.length > 0) {
      await this.applyGeneratedScenes(generatedScenes)
    }

    // Generate report
    this.generateReport(generatedScenes)

    console.log('🎭 Missing scene generation complete!')
    console.log(`\n📊 Remaining missing scenes: ${this.missingScenes.length - generatedScenes.length}`)
  }
}

// Run if called directly
async function main() {
  try {
    const generator = new MissingSceneGenerator()

    // Generate first 10 scenes as a test
    await generator.run(10)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()

export { MissingSceneGenerator }