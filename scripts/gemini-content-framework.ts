/**
 * Generalized Gemini Content Improvement Framework
 * A robust, reusable system for AI-powered content analysis and improvement
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

interface ContentMatch {
  id: string
  content: string
  metadata: Record<string, any>
  startIndex: number
  endIndex: number
}

interface ImprovementResult {
  original: string
  improved: string
  confidence: number
  issues: string[]
}

export class GeminiContentFramework {
  private genAI: GoogleGenerativeAI
  private model: any
  private backupDir: string = 'backups'

  constructor(
    private apiKey: string = process.env.GEMINI_API_KEY || '',
    private modelName: string = 'gemini-2.0-flash-exp'
  ) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found')
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: modelName })
  }

  /**
   * Extract content from files using regex patterns
   */
  async extractContent(
    filePath: string,
    pattern: RegExp
  ): Promise<ContentMatch[]> {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const matches: ContentMatch[] = []

    let match
    while ((match = pattern.exec(fileContent)) !== null) {
      matches.push({
        id: match[1] || `match_${matches.length}`,
        content: match[2] || match[0],
        metadata: {
          groups: match.groups || {},
          index: match.index
        },
        startIndex: match.index,
        endIndex: match.index + match[0].length
      })
    }

    return matches
  }

  /**
   * Analyze content quality using customizable metrics
   */
  analyzeQuality(
    content: string,
    qualityChecks: {
      [key: string]: (content: string) => boolean | number
    }
  ): Record<string, boolean | number> {
    const results: Record<string, boolean | number> = {}

    for (const [checkName, checkFn] of Object.entries(qualityChecks)) {
      try {
        results[checkName] = checkFn(content)
      } catch (error) {
        console.error(`Quality check '${checkName}' failed:`, error)
        results[checkName] = false
      }
    }

    return results
  }

  /**
   * Improve content using Gemini with validation
   */
  async improveContent(
    content: string,
    systemPrompt: string,
    validationRules: Array<(improved: string) => { valid: boolean; reason?: string }>
  ): Promise<ImprovementResult> {
    try {
      // Generate improvement
      const result = await this.model.generateContent(`${systemPrompt}\n\nContent to improve:\n"${content}"\n\nReturn ONLY the improved content.`)
      let improved = result.response.text().trim()

      // Clean up common AI response artifacts
      improved = this.cleanAIResponse(improved)

      // Validate the improvement
      const issues: string[] = []
      for (const rule of validationRules) {
        const validation = rule(improved)
        if (!validation.valid) {
          issues.push(validation.reason || 'Validation failed')
        }
      }

      // Calculate confidence based on validation
      const confidence = issues.length === 0 ? 1 :
        Math.max(0, 1 - (issues.length / validationRules.length))

      return {
        original: content,
        improved,
        confidence,
        issues
      }
    } catch (error: any) {
      // Handle rate limiting gracefully
      if (error.status === 429) {
        const retryAfter = this.extractRetryAfter(error)
        throw new Error(`Rate limited. Retry after ${retryAfter} seconds`)
      }
      throw error
    }
  }

  /**
   * Apply scene-based improvements using robust object replacement
   */
  async applySceneImprovements(
    filePath: string,
    improvements: Array<{
      sceneId: string
      newText: string
      confidence?: number
      issues?: string[]
    }>,
    options: {
      dryRun?: boolean
      minConfidence?: number
      createBackup?: boolean
      debug?: boolean
    } = {}
  ): Promise<{
    applied: number
    skipped: number
    errors: string[]
  }> {
    const { dryRun = false, minConfidence = 0.7, createBackup = true, debug = false } = options

    console.log(`\n🔧 applySceneImprovements called with ${improvements.length} scene improvements`)
    console.log(`📁 Target file: ${filePath}`)
    console.log(`⚙️ Options: dryRun=${dryRun}, minConfidence=${minConfidence}, debug=${debug}`)

    // Create backup if requested
    if (createBackup && !dryRun) {
      this.createBackup(filePath)
      console.log(`📦 Backup created for ${filePath}`)
    }

    // Read file content
    let fileContent = fs.readFileSync(filePath, 'utf-8')
    console.log(`📖 File content read: ${fileContent.length} characters`)

    const stats = {
      applied: 0,
      skipped: 0,
      errors: [] as string[]
    }

    for (let i = 0; i < improvements.length; i++) {
      const improvement = improvements[i]
      console.log(`\n--- Processing scene improvement ${i + 1}/${improvements.length}: ${improvement.sceneId} ---`)

      // Skip if confidence is too low
      if (improvement.confidence && improvement.confidence < minConfidence) {
        stats.skipped++
        const error = `Skipped ${improvement.sceneId}: Low confidence (${improvement.confidence})`
        stats.errors.push(error)
        console.log(`⚠️ ${error}`)
        continue
      }

      // Skip if there are critical issues
      if (improvement.issues && improvement.issues.some(issue => issue.includes('critical'))) {
        stats.skipped++
        const error = `Skipped ${improvement.sceneId}: Critical issues - ${improvement.issues.join(', ')}`
        stats.errors.push(error)
        console.log(`⚠️ ${error}`)
        continue
      }

      if (!dryRun) {
        try {
          console.log(`🎯 Applying scene improvement to ${improvement.sceneId}`)

          // Safely escape the new text for JavaScript string context
          const escapedText = this.escapeForJavaScript(improvement.newText)
          console.log(`   📝 Escaped text length: ${escapedText.length}`)

          if (debug) {
            console.log(`   🔄 New text content:`)
            console.log(`      "${improvement.newText.substring(0, 100)}${improvement.newText.length > 100 ? '...' : ''}"`)
          }

          // Apply the scene replacement using robust regex
          const updatedContent = this.replaceSceneText(fileContent, improvement.sceneId, escapedText, debug)

          if (updatedContent === fileContent) {
            const error = `No changes made for ${improvement.sceneId} - scene not found or pattern failed`
            stats.errors.push(error)
            console.log(`❌ ${error}`)
            continue
          }

          fileContent = updatedContent
          console.log(`   ✅ Successfully replaced scene. New content length: ${fileContent.length}`)

        } catch (error: any) {
          const errorMsg = `Failed to apply ${improvement.sceneId}: ${error.message}`
          stats.errors.push(errorMsg)
          console.log(`❌ ${errorMsg}`)
          continue
        }
      } else {
        console.log(`🧪 DRY RUN: Would apply scene improvement to ${improvement.sceneId}`)
      }

      stats.applied++
    }

    console.log(`\n📊 Final stats: applied=${stats.applied}, skipped=${stats.skipped}, errors=${stats.errors.length}`)

    // Write the updated file with comprehensive validation
    if (!dryRun && stats.applied > 0) {
      try {
        // Create debug output file if requested
        if (debug) {
          const debugPath = filePath.replace(/\.ts$/, '.debug.ts')
          fs.writeFileSync(debugPath, fileContent, 'utf-8')
          console.log(`🐛 Debug output written to: ${debugPath}`)
        }

        // Validate the content before writing
        console.log(`🔍 Validating final content...`)
        this.validateJavaScriptSyntax(fileContent, filePath)

        fs.writeFileSync(filePath, fileContent, 'utf-8')
        console.log(`✅ Successfully wrote ${fileContent.length} characters to ${filePath}`)

      } catch (error: any) {
        const errorMsg = `Failed to write file: ${error.message}`
        stats.errors.push(errorMsg)
        console.log(`❌ ${errorMsg}`)
        throw error
      }
    } else if (!dryRun) {
      console.log(`ℹ️ No changes to apply (stats.applied = ${stats.applied})`)
    }

    return stats
  }

  /**
   * Replace text content in a specific scene using robust regex matching
   */
  private replaceSceneText(fileContent: string, sceneId: string, newText: string, debug: boolean = false): string {
    // Create a highly specific regex to find the scene object and its text property
    // This pattern matches: 'sceneId': { ... text: "current_text" ... }
    // Using capture groups to preserve the structure while replacing only the text content
    const sceneBlockPattern = new RegExp(
      // Group 1: Scene object start and everything up to text property value
      `('${sceneId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*\\{[^}]*?text:\\s*")` +
      // Group 2: The current text content (we'll replace this)
      `([^"\\\\]*(?:\\\\.[^"\\\\]*)*)` +
      // Group 3: Closing quote and rest of scene object
      `(",[^}]*?\\})`,
      'g'
    )

    if (debug) {
      console.log(`   🔍 Searching for scene pattern: ${sceneBlockPattern.source}`)
    }

    // Check how many matches we find
    const matches = [...fileContent.matchAll(sceneBlockPattern)]

    if (matches.length === 0) {
      console.log(`   ⚠️ No matches found for scene '${sceneId}'`)
      return fileContent
    }

    if (matches.length > 1) {
      console.log(`   ⚠️ Multiple matches found for scene '${sceneId}' (${matches.length}). Using first match.`)
    }

    if (debug && matches.length > 0) {
      const match = matches[0]
      console.log(`   📍 Found scene at position ${match.index}`)
      console.log(`   📜 Original text: "${match[2].substring(0, 100)}${match[2].length > 100 ? '...' : ''}"`)
    }

    // Perform the replacement using capture groups
    // $1 = everything before the text content
    // newText = our replacement content
    // $3 = everything after the text content
    return fileContent.replace(sceneBlockPattern, `$1${newText}$3`)
  }

  /**
   * Safely escape text for JavaScript string context
   */
  private escapeForJavaScript(text: string): string {
    return text
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/"/g, '\\"')    // Escape double quotes
      .replace(/\n/g, '\\n')   // Escape newlines
      .replace(/\r/g, '\\r')   // Escape carriage returns
      .replace(/\t/g, '\\t')   // Escape tabs
  }

  /**
   * Validate JavaScript syntax without executing
   */
  private validateJavaScriptSyntax(content: string, filePath: string): void {
    try {
      // Basic validation - check for unescaped quotes in string contexts
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        // Simple check for unescaped quotes in text properties
        if (line.includes('text:') && line.includes('"')) {
          const textMatch = line.match(/text:\s*"([^"]*)"/)
          if (textMatch && textMatch[1].includes('"')) {
            throw new Error(`Unescaped quote in text property at line ${i + 1}: ${line.trim()}`)
          }
        }
      }
      console.log(`✅ Basic syntax validation passed`)
    } catch (error: any) {
      console.log(`❌ Syntax validation failed: ${error.message}`)
      throw error
    }
  }

  /**
   * Batch process with rate limiting
   */
  async batchProcess<T>(
    items: T[],
    processor: (item: T) => Promise<any>,
    options: {
      batchSize?: number
      delayMs?: number
      onProgress?: (current: number, total: number) => void
    } = {}
  ): Promise<any[]> {
    const { batchSize = 5, delayMs = 1000, onProgress } = options
    const results: any[] = []

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)

      if (onProgress) {
        onProgress(i, items.length)
      }

      const batchResults = await Promise.allSettled(
        batch.map(item => processor(item))
      )

      results.push(...batchResults.map(r =>
        r.status === 'fulfilled' ? r.value : null
      ))

      // Delay between batches
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    return results
  }

  /**
   * Clean common AI response artifacts
   */
  private cleanAIResponse(text: string): string {
    return text
      .replace(/^["'`]|["'`]$/g, '') // Remove wrapping quotes
      .replace(/```[^`]*```/g, '') // Remove code blocks
      .replace(/^(Here is|Here's|This is) .*?:\s*/i, '') // Remove preambles
      .trim()
  }

  /**
   * Extract retry-after value from rate limit error
   */
  private extractRetryAfter(error: any): number {
    if (error.errorDetails) {
      for (const detail of error.errorDetails) {
        if (detail.retryDelay) {
          return parseInt(detail.retryDelay)
        }
      }
    }
    return 60 // Default to 60 seconds
  }

  /**
   * Create backup of file
   */
  private createBackup(filePath: string): string {
    const timestamp = Date.now()
    const backupPath = filePath.replace(/\.(ts|js|jsx|tsx)$/, `.backup-${timestamp}.$1`)
    fs.copyFileSync(filePath, backupPath)
    return backupPath
  }
}

// Main framework class export only