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
   * Apply improvements to file with backup and validation
   */
  async applyImprovements(
    filePath: string,
    improvements: Array<{
      match: ContentMatch
      result: ImprovementResult
    }>,
    options: {
      dryRun?: boolean
      minConfidence?: number
      createBackup?: boolean
    } = {}
  ): Promise<{
    applied: number
    skipped: number
    errors: string[]
  }> {
    const { dryRun = false, minConfidence = 0.8, createBackup = true } = options

    // Create backup if requested
    if (createBackup && !dryRun) {
      this.createBackup(filePath)
    }

    // Read file content
    let fileContent = fs.readFileSync(filePath, 'utf-8')

    // Sort improvements by position (reverse to maintain indices)
    improvements.sort((a, b) => b.match.startIndex - a.match.startIndex)

    const stats = {
      applied: 0,
      skipped: 0,
      errors: [] as string[]
    }

    for (const { match, result } of improvements) {
      // Skip if confidence is too low
      if (result.confidence < minConfidence) {
        stats.skipped++
        stats.errors.push(`Skipped ${match.id}: Low confidence (${result.confidence})`)
        continue
      }

      // Skip if there are critical issues
      if (result.issues.some(issue => issue.includes('critical'))) {
        stats.skipped++
        stats.errors.push(`Skipped ${match.id}: Critical issues - ${result.issues.join(', ')}`)
        continue
      }

      if (!dryRun) {
        // Apply the improvement using exact indices
        fileContent =
          fileContent.slice(0, match.startIndex) +
          result.improved +
          fileContent.slice(match.endIndex)
      }

      stats.applied++
    }

    // Write the updated file
    if (!dryRun && stats.applied > 0) {
      fs.writeFileSync(filePath, fileContent, 'utf-8')
    }

    return stats
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