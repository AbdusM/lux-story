/**
 * Live Choice Augmentation Engine
 *
 * A sophisticated three-layer system that combines curated choices with
 * real-time AI generation for hyper-personalized player experiences.
 */

import { logger } from './logger'
import { safeStorage } from './safe-storage'
import { z } from 'zod'

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

// Diamond Safe Schema Definition
const LiveChoiceResponseSchema = z.object({
  text: z.string().min(1), // Crucial: Must be non-empty to pass truncateTextForLoad
  justification: z.string(),
  confidenceScore: z.number(),
  generatedAt: z.number()
})

// Diamond Safe Schema Definition
const OrbRequirementSchema = z.object({
  pattern: z.enum(['analytical', 'patience', 'exploring', 'helping', 'building']),
  threshold: z.number()
})

const ChoiceSchema = z.object({
  text: z.string().min(1), // Enforce non-empty string. This prevents the "undefined" crash.
  consequence: z.string().optional().default(''),
  nextScene: z.string().optional(),
  stateChanges: z.unknown().optional(),
  requiredOrbFill: OrbRequirementSchema.optional()
}).passthrough() // Allow extra fields like 'id', 'pattern'

// Extended schema for approved choices with pattern and sceneId
const ApprovedChoiceSchema = ChoiceSchema.extend({
  pattern: z.string(),
  sceneId: z.string()
})

type ApprovedChoice = z.infer<typeof ApprovedChoiceSchema>

const ReviewQueueEntrySchema = z.object({
  id: z.string(),
  sceneId: z.string(),
  playerId: z.string().optional(),
  request: z.object({
    sceneContext: z.string(),
    pattern: z.string(),
    playerPersona: z.string(),
    existingChoices: z.array(z.string()),
    sceneId: z.string(),
    playerId: z.string().optional(),
  }),
  response: z.object({
    text: z.string(),
    justification: z.string(),
    confidenceScore: z.number(),
    generatedAt: z.number(),
  }),
  status: z.enum(['pending', 'approved', 'rejected', 'edited']),
  reviewedBy: z.string().optional(),
  reviewedAt: z.number().optional(),
  editedText: z.string().optional(),
  createdAt: z.number(),
})

/**
 * Core Live Choice Engine
 * Handles real-time choice generation with Gemini API
 */
export class LiveChoiceEngine {
  private static instance: LiveChoiceEngine | null = null
  private reviewQueue: ReviewQueueEntry[]
  // ...

  private approvedChoices: ApprovedChoice[]

  private constructor() {
    this.approvedChoices = []
    this.reviewQueue = []

    // Load persisted state with Diamond Safe Validation
    this.loadApprovedChoices()
    this.loadReviewQueue()
  }

  public static getInstance(): LiveChoiceEngine {
    if (!LiveChoiceEngine.instance) {
      LiveChoiceEngine.instance = new LiveChoiceEngine()
    }
    return LiveChoiceEngine.instance
  }

  /**
   * Reset the singleton instance for testing.
   * Allows tests to start with fresh state.
   */
  public static resetInstance(): void {
    LiveChoiceEngine.instance = null
  }

  /**
   * Loads choices from storage with strict schema validation.
   * Uses 'v2' key to implicitly migrate/reset corrupted legacy data.
   */
  private loadApprovedChoices() {
    if (typeof window === 'undefined') return

    const validatedChoices = safeStorage.getValidatedItem(
      'lux-story-approved-choices-v2', // Diamond Safe: Versioned Key
      z.array(ApprovedChoiceSchema)
    )

    if (validatedChoices) {
      this.approvedChoices = validatedChoices
    } else {
      logger.info('LiveChoiceEngine: Clean slate initialized (No previous valid choices found for approved choices)')
      this.approvedChoices = []
    }
  }

  /**
   * Save approved choices to storage (Diamond Safe v2)
   */
  private saveApprovedChoices() {
    safeStorage.setItem('lux-story-approved-choices-v2', JSON.stringify(this.approvedChoices))
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
        // Safe check for JSON response even on error
        const contentType = response.headers.get('content-type')
        let errorData = { error: `HTTP ${response.status}` }

        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({ error: 'Unknown JSON error' }))
        }

        logger.error('API Error:', { error: errorData.error })
        throw new Error(`API request failed: ${response.status} - ${errorData.error}`)
      }

      const generatedData = await response.json()

      // Runtime Validation of API Response (Diamond Safe Ingress)
      const validation = LiveChoiceResponseSchema.safeParse(generatedData)

      if (!validation.success) {
        logger.error('API returned invalid data:', { error: validation.error })
        return null
      }

      const validatedData = validation.data

      logger.debug('Choice generated successfully', { operation: 'live-choice-engine.success', text: validatedData.text.substring(0, 50), confidence: validatedData.confidenceScore })

      return validatedData

    } catch (error) {
      logger.error('Live choice generation failed:', { error })
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

    // Add to approved choices cache - ARRAY BASED
    const finalText = editedText || entry.response.text

    // Check for duplicates to avoid array bloat
    const existingIndex = this.approvedChoices.findIndex(c =>
      c.sceneId === entry.sceneId &&
      c.pattern === entry.request.pattern &&
      c.text === finalText
    )

    const newChoice = {
      text: finalText,
      consequence: `${entry.request.pattern}_ai_generated`,
      nextScene: 'next', // Will be overridden by story engine
      stateChanges: {
        patterns: { [entry.request.pattern]: 1 }
      },
      pattern: entry.request.pattern,
      sceneId: entry.sceneId
    }

    if (existingIndex >= 0) {
      this.approvedChoices[existingIndex] = newChoice
    } else {
      this.approvedChoices.push(newChoice)
    }

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
  getApprovedChoices(pattern: string, sceneId: string): ApprovedChoice[] {
    // Array-based filter
    return this.approvedChoices.filter(c =>
      c.pattern === pattern && c.sceneId === sceneId
    )
  }

  /**
   * Save review queue to storage (Diamond Safe v2)
   */
  private saveReviewQueue() {
    safeStorage.setItem('lux-story-review-queue-v2', JSON.stringify(this.reviewQueue))
  }

  /**
   * Load review queue from storage (Diamond Safe v2)
   */
  private loadReviewQueue() {
    if (typeof window === 'undefined') return

    const validatedQueue = safeStorage.getValidatedItem(
      'lux-story-review-queue-v2',
      z.array(ReviewQueueEntrySchema)
    )

    if (validatedQueue) {
      this.reviewQueue = validatedQueue as ReviewQueueEntry[]
    } else {
      this.reviewQueue = []
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
    const approvedChoicesCount = this.approvedChoices.length

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

export function getLiveChoiceEngine(): LiveChoiceEngine {
  return LiveChoiceEngine.getInstance()
}
