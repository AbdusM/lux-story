/**
 * Live Choice Augmentation Engine
 *
 * A sophisticated three-layer system that combines curated choices with
 * real-time AI generation for hyper-personalized player experiences.
 */

import type { Choice } from './story-engine'
import { logger } from './logger'

// Live Choice Engine now uses Next.js API routes for secure server-side generation
// No direct API configuration needed - handled by /api/live-choices route

export interface LiveChoiceRequest {
  sceneContext: string
  pattern: string
  playerPersona: string
  existingChoices: string[]
  sceneId: string
  playerId?: string
}

export interface LiveChoiceResponse {
  text: string
  justification: string
  confidenceScore: number
  generatedAt: number
}

export interface ReviewQueueEntry {
  id: string
  sceneId: string
  playerId?: string
  request: LiveChoiceRequest
  response: LiveChoiceResponse
  status: 'pending' | 'approved' | 'rejected' | 'edited'
  reviewedBy?: string
  reviewedAt?: number
  editedText?: string
  createdAt: number
}

/**
 * Core Live Choice Engine
 * Handles real-time choice generation with Gemini API
 */
export class LiveChoiceEngine {
  private reviewQueue: ReviewQueueEntry[] = []
  private approvedChoices: Map<string, Choice[]> = new Map()

  constructor() {
    this.loadApprovedChoices()
  }

  /**
   * Load previously approved choices from storage
   */
  private loadApprovedChoices() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('lux-story-approved-choices')
        if (stored) {
          const data = JSON.parse(stored)
          this.approvedChoices = new Map(Object.entries(data))
        }
      }
    } catch (error) {
      console.warn('Failed to load approved choices:', error)
    }
  }

  /**
   * Save approved choices to storage
   */
  private saveApprovedChoices() {
    try {
      const data = Object.fromEntries(this.approvedChoices)
      localStorage.setItem('lux-story-approved-choices', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save approved choices:', error)
    }
  }

  // Prompt engineering is now handled server-side in /api/live-choices
  // This keeps client-side code clean and secure

  /**
   * Generate a choice using secure Next.js API route
   */
  async generateChoice(request: LiveChoiceRequest): Promise<LiveChoiceResponse | null> {
    try {
      logger.debug('Calling internal API for choice generation', { operation: 'live-choice-engine.generate' })

      const response = await fetch('/api/live-choices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ API Error:', errorData.error)
        throw new Error(`API request failed: ${response.status} - ${errorData.error}`)
      }

      const generatedData = await response.json()

      logger.debug('Choice generated successfully', { operation: 'live-choice-engine.success', text: generatedData.text.substring(0, 50), confidence: generatedData.confidenceScore })

      return generatedData

    } catch (error) {
      console.error('Live choice generation failed:', error)
      return null
    }
  }

  /**
   * Add generated choice to review queue
   */
  addToReviewQueue(request: LiveChoiceRequest, response: LiveChoiceResponse): string {
    const entry: ReviewQueueEntry = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sceneId: request.sceneId,
      playerId: request.playerId,
      request,
      response,
      status: 'pending',
      createdAt: Date.now()
    }

    this.reviewQueue.push(entry)
    this.saveReviewQueue()

    logger.debug('Added to review queue', { operation: 'live-choice-engine.review-queue', entryId: entry.id })
    return entry.id
  }

  /**
   * Approve a choice from the review queue
   */
  approveChoice(entryId: string, editedText?: string): boolean {
    const entry = this.reviewQueue.find(e => e.id === entryId)
    if (!entry) return false

    entry.status = editedText ? 'edited' : 'approved'
    entry.reviewedAt = Date.now()
    entry.editedText = editedText

    // Add to approved choices cache
    const finalText = editedText || entry.response.text
    const cacheKey = `${entry.request.pattern}-${entry.sceneId}`

    if (!this.approvedChoices.has(cacheKey)) {
      this.approvedChoices.set(cacheKey, [])
    }

    const choices = this.approvedChoices.get(cacheKey)!
    choices.push({
      text: finalText,
      consequence: `${entry.request.pattern}_ai_generated`,
      nextScene: 'next', // Will be overridden by story engine
      stateChanges: {
        patterns: { [entry.request.pattern]: 1 }
      }
    })

    this.saveApprovedChoices()
    this.saveReviewQueue()

    logger.debug('Choice approved and cached', { operation: 'live-choice-engine.approve', text: finalText.substring(0, 50) })
    return true
  }

  /**
   * Reject a choice from the review queue
   */
  rejectChoice(entryId: string): boolean {
    const entry = this.reviewQueue.find(e => e.id === entryId)
    if (!entry) return false

    entry.status = 'rejected'
    entry.reviewedAt = Date.now()
    this.saveReviewQueue()

    logger.debug('Choice rejected', { operation: 'live-choice-engine.reject', text: entry.response.text.substring(0, 50) })
    return true
  }

  /**
   * Get pending review queue entries
   */
  getPendingReviews(): ReviewQueueEntry[] {
    return this.reviewQueue.filter(e => e.status === 'pending')
  }

  /**
   * Get approved choices for a pattern/scene
   */
  getApprovedChoices(pattern: string, sceneId: string): Choice[] {
    const cacheKey = `${pattern}-${sceneId}`
    return this.approvedChoices.get(cacheKey) || []
  }

  /**
   * Save review queue to storage
   */
  private saveReviewQueue() {
    try {
      localStorage.setItem('lux-story-review-queue', JSON.stringify(this.reviewQueue))
    } catch (error) {
      console.warn('Failed to save review queue:', error)
    }
  }

  /**
   * Load review queue from storage
   */
  private loadReviewQueue() {
    try {
      const stored = localStorage.getItem('lux-story-review-queue')
      if (stored) {
        this.reviewQueue = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load review queue:', error)
    }
  }

  /**
   * Get statistics about the system
   */
  getStatistics() {
    const total = this.reviewQueue.length
    const pending = this.reviewQueue.filter(e => e.status === 'pending').length
    const approved = this.reviewQueue.filter(e => e.status === 'approved' || e.status === 'edited').length
    const rejected = this.reviewQueue.filter(e => e.status === 'rejected').length
    const approvedChoicesCount = Array.from(this.approvedChoices.values())
      .reduce((sum, choices) => sum + choices.length, 0)

    return {
      totalGenerated: total,
      pending,
      approved,
      rejected,
      approvalRate: total > 0 ? approved / total : 0,
      cachedChoices: approvedChoicesCount
    }
  }
}

// Singleton instance
let liveChoiceEngine: LiveChoiceEngine | null = null

export function getLiveChoiceEngine(): LiveChoiceEngine {
  if (!liveChoiceEngine) {
    liveChoiceEngine = new LiveChoiceEngine()
  }
  return liveChoiceEngine
}