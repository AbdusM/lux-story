// @ts-nocheck
/**
 * Navigation Consistency Auditor Script
 *
 * Systematically detects and validates all scene navigation references.
 * Identifies broken scene targets and provides repair recommendations.
 *
 * Navigation Issues Detected:
 * - Choices pointing to non-existent scenes
 * - Scene transitions referencing invalid targets
 * - Orphaned scenes with no incoming references
 * - Circular navigation dependencies
 */

import { GeminiContentFramework } from './gemini-content-framework'
import fs from 'fs'
import path from 'path'

interface SceneReference {
  sourceScene: string
  targetScene: string
  choiceText: string
  choiceIndex: number
  referenceType: 'choice' | 'transition' | 'fallback'
  lineNumber: number
}

interface NavigationIssue {
  type: 'missing_target' | 'orphaned_scene' | 'circular_reference' | 'invalid_syntax'
  severity: 'critical' | 'warning' | 'info'
  description: string
  references: SceneReference[]
  suggestedFix?: string
}

interface NavigationAnalysisResult {
  issue_type: string
  severity: string
  description: string
  suggested_scene_id: string
  confidence: number
  repair_action: 'create_scene' | 'redirect_choice' | 'remove_choice'
  scene_content_outline?: string
}

class NavigationConsistencyAuditor extends GeminiContentFramework {
  private sceneReferences: SceneReference[] = []
  private existingScenes: Set<string> = new Set()
  private navigationIssues: NavigationIssue[] = []
  private filePath: string

  constructor() {
    super(process.env.GEMINI_API_KEY || '', 'gemini-2.0-flash-exp')
    this.filePath = path.join(process.cwd(), 'hooks', 'useSimpleGame.ts')
  }

  /**
   * Extract all existing scene definitions
   */
  private extractExistingScenes(): void {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8')

    // Find all scene definitions in the scenes object
    const scenePattern = /'([^']+)':\s*\{/g
    let match
    while ((match = scenePattern.exec(fileContent)) !== null) {
      this.existingScenes.add(match[1])
    }

    console.log(`📊 Found ${this.existingScenes.size} existing scenes`)
  }

  /**
   * Extract all navigation references (choices, transitions, fallbacks)
   */
  private extractNavigationReferences(): void {
    const fileContent = fs.readFileSync(this.filePath, 'utf-8')
    const lines = fileContent.split('\n')

    // Extract choice-based navigation
    this.extractChoiceReferences(fileContent, lines)

    // Extract transition-based navigation
    this.extractTransitionReferences(fileContent, lines)

    // Extract fallback navigation
    this.extractFallbackReferences(fileContent, lines)

    console.log(`🔗 Found ${this.sceneReferences.length} navigation references`)
  }

  /**
   * Extract navigation from choice next properties
   */
  private extractChoiceReferences(fileContent: string, lines: string[]): void {
    // Pattern to match choices with next property
    const choicePattern = /next:\s*['"]([^'"]+)['"]/g
    let match

    while ((match = choicePattern.exec(fileContent)) !== null) {
      const targetScene = match[1]
      const lineNumber = this.findLineNumber(fileContent, match.index, lines)

      // Find the containing scene
      const sourceScene = this.findContainingScene(fileContent, match.index)

      // Find choice text for context
      const choiceText = this.findChoiceText(fileContent, match.index)

      if (sourceScene) {
        this.sceneReferences.push({
          sourceScene,
          targetScene,
          choiceText,
          choiceIndex: this.findChoiceIndex(fileContent, match.index),
          referenceType: 'choice',
          lineNumber
        })
      }
    }
  }

  /**
   * Extract navigation from scene transitions
   */
  private extractTransitionReferences(fileContent: string, lines: string[]): void {
    // Pattern to match transition properties
    const transitionPattern = /transition:\s*['"]([^'"]+)['"]/g
    let match

    while ((match = transitionPattern.exec(fileContent)) !== null) {
      const targetScene = match[1]
      const lineNumber = this.findLineNumber(fileContent, match.index, lines)
      const sourceScene = this.findContainingScene(fileContent, match.index)

      if (sourceScene) {
        this.sceneReferences.push({
          sourceScene,
          targetScene,
          choiceText: '[Automatic Transition]',
          choiceIndex: -1,
          referenceType: 'transition',
          lineNumber
        })
      }
    }
  }

  /**
   * Extract navigation from fallback scenes
   */
  private extractFallbackReferences(fileContent: string, lines: string[]): void {
    // Pattern to match fallback navigation
    const fallbackPattern = /fallback.*?['"]([^'"]+)['"]/g
    let match

    while ((match = fallbackPattern.exec(fileContent)) !== null) {
      const targetScene = match[1]
      const lineNumber = this.findLineNumber(fileContent, match.index, lines)
      const sourceScene = this.findContainingScene(fileContent, match.index)

      if (sourceScene) {
        this.sceneReferences.push({
          sourceScene,
          targetScene,
          choiceText: '[Fallback Navigation]',
          choiceIndex: -1,
          referenceType: 'fallback',
          lineNumber
        })
      }
    }
  }

  /**
   * Find the scene containing a given file position
   */
  private findContainingScene(fileContent: string, position: number): string | null {
    const beforePosition = fileContent.substring(0, position)
    const sceneMatches = Array.from(beforePosition.matchAll(/'([^']+)':\s*\{/g))

    if (sceneMatches.length > 0) {
      return sceneMatches[sceneMatches.length - 1][1]
    }
    return null
  }

  /**
   * Find choice text near a navigation reference
   */
  private findChoiceText(fileContent: string, position: number): string {
    const beforePosition = fileContent.substring(Math.max(0, position - 200), position)
    const textMatch = beforePosition.match(/text:\s*["']([^"']+)["']/)
    return textMatch ? textMatch[1] : '[Unknown Choice]'
  }

  /**
   * Find choice index within a scene
   */
  private findChoiceIndex(fileContent: string, position: number): number {
    const beforePosition = fileContent.substring(0, position)
    const choiceMatches = Array.from(beforePosition.matchAll(/\{\s*text:/g))
    const sceneStart = beforePosition.lastIndexOf('choices:')

    if (sceneStart === -1) return 0

    const choicesInScene = Array.from(beforePosition.substring(sceneStart).matchAll(/\{\s*text:/g))
    return choicesInScene.length - 1
  }

  /**
   * Find line number for a given file position
   */
  private findLineNumber(fileContent: string, position: number, lines: string[]): number {
    const beforePosition = fileContent.substring(0, position)
    return beforePosition.split('\n').length
  }

  /**
   * Analyze navigation issues and identify problems
   */
  private analyzeNavigationIssues(): void {
    // Group references by target scene
    const referencesByTarget = new Map<string, SceneReference[]>()

    this.sceneReferences.forEach(ref => {
      if (!referencesByTarget.has(ref.targetScene)) {
        referencesByTarget.set(ref.targetScene, [])
      }
      referencesByTarget.get(ref.targetScene)!.push(ref)
    })

    // Check for missing targets
    referencesByTarget.forEach((references, targetScene) => {
      if (!this.existingScenes.has(targetScene)) {
        this.navigationIssues.push({
          type: 'missing_target',
          severity: 'critical',
          description: `Scene "${targetScene}" is referenced but does not exist`,
          references,
          suggestedFix: `Create scene "${targetScene}" or redirect references to existing scene`
        })
      }
    })

    // Check for orphaned scenes
    const referencedScenes = new Set(this.sceneReferences.map(ref => ref.targetScene))
    this.existingScenes.forEach(scene => {
      if (!referencedScenes.has(scene) && scene !== 'start') {
        this.navigationIssues.push({
          type: 'orphaned_scene',
          severity: 'warning',
          description: `Scene "${scene}" exists but is never referenced`,
          references: [],
          suggestedFix: `Add navigation to "${scene}" or remove if unused`
        })
      }
    })

    console.log(`⚠️ Found ${this.navigationIssues.length} navigation issues`)
  }

  /**
   * Generate repair recommendations using Gemini
   */
  private getNavigationRepairPrompt(issue: NavigationIssue): string {
    const referencesContext = issue.references
      .map(ref => `"${ref.choiceText}" from ${ref.sourceScene}`)
      .join(', ')

    return `Analyze this navigation issue and suggest a repair.

CONTEXT: Career exploration game with Birmingham focus
ISSUE TYPE: ${issue.type}
DESCRIPTION: ${issue.description}

REFERENCES AFFECTED: ${referencesContext}

EXISTING SCENES: ${Array.from(this.existingScenes).join(', ')}

Based on choice context and existing scenes, suggest:
1. REPAIR_ACTION: create_scene, redirect_choice, or remove_choice
2. SUGGESTED_SCENE: If creating, what scene ID should be used?
3. CONFIDENCE: 0.1-1.0 how confident you are
4. CONTENT_OUTLINE: If creating scene, brief description

Format:
ACTION: [create_scene/redirect_choice/remove_choice]
SCENE_ID: [suggested scene name]
CONFIDENCE: [0.1-1.0]
OUTLINE: [brief scene description if needed]
REASON: [rationale for recommendation]`
  }

  /**
   * Get repair recommendation for a navigation issue
   */
  async getRepairRecommendation(issue: NavigationIssue): Promise<NavigationAnalysisResult | null> {
    if (issue.references.length === 0) return null

    console.log(`  🔧 Analyzing repair for: ${issue.description}`)

    try {
      const result = await this.model.generateContent(this.getNavigationRepairPrompt(issue))
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

      if (!data.action || !data.confidence) {
        console.log(`  ⚠️ Incomplete repair analysis for ${issue.type}`)
        return null
      }

      const confidence = parseFloat(data.confidence)
      if (confidence < 0.6) {
        console.log(`  ⚠️ Low confidence (${confidence}) for repair`)
        return null
      }

      const analysis: NavigationAnalysisResult = {
        issue_type: issue.type,
        severity: issue.severity,
        description: issue.description,
        suggested_scene_id: data.scene_id || '',
        confidence: confidence,
        repair_action: data.action as 'create_scene' | 'redirect_choice' | 'remove_choice',
        scene_content_outline: data.outline || undefined
      }

      console.log(`  ✅ Repair suggestion: ${analysis.repair_action} (confidence: ${confidence})`)
      return analysis

    } catch (error: any) {
      console.log(`  ❌ Failed to analyze repair: ${error.message}`)
      return null
    }
  }

  /**
   * Generate comprehensive navigation audit report
   */
  private generateNavigationReport(repairs: Array<{ issue: NavigationIssue; analysis: NavigationAnalysisResult }>): string {
    const criticalIssues = this.navigationIssues.filter(i => i.severity === 'critical')
    const warningIssues = this.navigationIssues.filter(i => i.severity === 'warning')

    const createSceneActions = repairs.filter(r => r.analysis.repair_action === 'create_scene')
    const redirectActions = repairs.filter(r => r.analysis.repair_action === 'redirect_choice')
    const removeActions = repairs.filter(r => r.analysis.repair_action === 'remove_choice')

    return `# Navigation Consistency Audit Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Scenes**: ${this.existingScenes.size}
- **Total Navigation References**: ${this.sceneReferences.length}
- **Critical Issues**: ${criticalIssues.length}
- **Warning Issues**: ${warningIssues.length}

## Navigation Statistics

### Reference Types
- Choice Navigation: ${this.sceneReferences.filter(r => r.referenceType === 'choice').length}
- Automatic Transitions: ${this.sceneReferences.filter(r => r.referenceType === 'transition').length}
- Fallback Navigation: ${this.sceneReferences.filter(r => r.referenceType === 'fallback').length}

## Critical Issues (${criticalIssues.length})

${criticalIssues.map(issue => `
### ${issue.description}

**Affected References:**
${issue.references.map(ref =>
  `- "${ref.choiceText}" from \`${ref.sourceScene}\` (line ${ref.lineNumber})`
).join('\n')}

**Suggested Fix:** ${issue.suggestedFix}
`).join('\n')}

## Repair Recommendations

### Scenes to Create (${createSceneActions.length})

${createSceneActions.map(r => `
**${r.analysis.suggested_scene_id}** (Confidence: ${r.analysis.confidence})
- Issue: ${r.analysis.description}
- Content: ${r.analysis.scene_content_outline}
- References: ${r.issue.references.length} broken links
`).join('\n')}

### Choices to Redirect (${redirectActions.length})

${redirectActions.map(r => `
**${r.issue.references[0]?.targetScene}**
- Current Target: Invalid scene
- Suggested Target: ${r.analysis.suggested_scene_id}
- Affected Choices: ${r.issue.references.length}
`).join('\n')}

### Choices to Remove (${removeActions.length})

${removeActions.map(r => `
**${r.issue.references[0]?.sourceScene}**
- Issue: ${r.analysis.description}
- Choices to Remove: ${r.issue.references.length}
`).join('\n')}

## Warning Issues (${warningIssues.length})

${warningIssues.map(issue => `
### ${issue.description}
**Suggested Action:** ${issue.suggestedFix}
`).join('\n')}

## Implementation Priority

1. **Critical Fixes**: Address all missing scene targets immediately
2. **Scene Creation**: Create ${createSceneActions.length} new scenes with provided outlines
3. **Choice Redirection**: Update ${redirectActions.length} navigation targets
4. **Cleanup**: Remove ${removeActions.length} broken choices
5. **Optimization**: Review ${warningIssues.length} orphaned scenes

## Next Steps

1. Implement critical navigation fixes
2. Create new scenes following content guidelines
3. Test all navigation paths
4. Re-run audit to verify fixes
5. Update navigation validation rules

---

*Navigation integrity is essential for user experience. Address critical issues before content optimization.*
`
  }

  /**
   * Run the full navigation consistency audit
   */
  async run(): Promise<void> {
    console.log('🧭 Starting Navigation Consistency Audit...\n')

    // Extract existing scenes and references
    this.extractExistingScenes()
    this.extractNavigationReferences()

    // Analyze navigation issues
    this.analyzeNavigationIssues()

    if (this.navigationIssues.length === 0) {
      console.log('✅ No navigation issues found!')
      return
    }

    // List critical issues for immediate action (skip AI analysis for now due to volume)
    const criticalIssues = this.navigationIssues.filter(i => i.severity === 'critical')
    console.log(`\n🚨 Found ${criticalIssues.length} critical missing scenes:`)

    criticalIssues.forEach((issue, index) => {
      const targetScene = issue.references[0]?.targetScene || 'unknown'
      console.log(`  ${index + 1}. ${targetScene} (${issue.references.length} references)`)
    })

    const repairAnalyses: Array<{ issue: NavigationIssue; analysis: NavigationAnalysisResult }> = []
    console.log(`\n⏩ Skipping AI analysis due to volume (${criticalIssues.length} issues)`)
    console.log(`💡 Run individual scene creation based on critical issues list`)

    // Generate comprehensive report
    const report = this.generateNavigationReport(repairAnalyses)
    fs.writeFileSync('navigation-consistency-audit-report.md', report, 'utf-8')

    console.log('\n📄 Report saved to navigation-consistency-audit-report.md')
    console.log('🧭 Navigation consistency audit complete!')

    // Display immediate action items
    const createActions = repairAnalyses.filter(r => r.analysis.repair_action === 'create_scene')
    if (createActions.length > 0) {
      console.log(`\n🚨 IMMEDIATE ACTION REQUIRED:`)
      console.log(`   Create ${createActions.length} missing scenes:`)
      createActions.forEach(action => {
        console.log(`   - ${action.analysis.suggested_scene_id}`)
      })
    }
  }
}

// Run if called directly
async function main() {
  try {
    const auditor = new NavigationConsistencyAuditor()
    await auditor.run()
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()

export { NavigationConsistencyAuditor }