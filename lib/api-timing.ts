/**
 * API Timing Utilities
 * Lightweight performance tracking for server-side API routes
 */

import { logger } from './logger'

interface TimingResult {
  operation: string
  durationMs: number
  metadata?: Record<string, unknown>
}

/**
 * Time an async operation and log the result
 * @param operation - Name of the operation being timed
 * @param fn - Async function to execute
 * @param metadata - Additional context to log
 */
export async function timeOperation<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<{ result: T; timing: TimingResult }> {
  const start = performance.now()

  try {
    const result = await fn()
    const durationMs = Math.round((performance.now() - start) * 100) / 100

    const timing: TimingResult = {
      operation,
      durationMs,
      metadata
    }

    // Log slow operations (> 1 second) as warnings
    if (durationMs > 1000) {
      logger.warn('Slow operation detected', { operation, durationMs, ...metadata, threshold: 1000 })
    } else {
      logger.debug('Operation timing', { operation, durationMs, ...metadata })
    }

    return { result, timing }
  } catch (error) {
    const durationMs = Math.round((performance.now() - start) * 100) / 100
    logger.error('Operation failed', { operation, durationMs, metadata }, error instanceof Error ? error : undefined)
    throw error
  }
}

/**
 * Create a simple timer for manual timing
 */
export function createTimer(operation: string, metadata?: Record<string, unknown>) {
  const start = performance.now()

  return {
    /** Get elapsed time without stopping */
    elapsed: () => Math.round((performance.now() - start) * 100) / 100,

    /** Stop and log the timing */
    stop: () => {
      const durationMs = Math.round((performance.now() - start) * 100) / 100
      const timing: TimingResult = { operation, durationMs, metadata }

      if (durationMs > 1000) {
        logger.warn('Slow operation detected', { operation, durationMs, ...metadata, threshold: 1000 })
      } else {
        logger.debug('Operation timing', { operation, durationMs, ...metadata })
      }

      return timing
    }
  }
}

/**
 * Aggregate timing stats for batch operations
 */
export class TimingAggregator {
  private timings: Map<string, number[]> = new Map()

  add(operation: string, durationMs: number) {
    if (!this.timings.has(operation)) {
      this.timings.set(operation, [])
    }
    this.timings.get(operation)!.push(durationMs)
  }

  getStats(operation: string) {
    const times = this.timings.get(operation)
    if (!times || times.length === 0) return null

    const sorted = [...times].sort((a, b) => a - b)
    return {
      operation,
      count: times.length,
      min: Math.round(sorted[0] * 100) / 100,
      max: Math.round(sorted[sorted.length - 1] * 100) / 100,
      avg: Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 100) / 100,
      p50: Math.round(sorted[Math.floor(times.length * 0.5)] * 100) / 100,
      p95: Math.round(sorted[Math.floor(times.length * 0.95)] * 100) / 100
    }
  }

  getAllStats() {
    const stats: Record<string, ReturnType<typeof this.getStats>> = {}
    for (const operation of this.timings.keys()) {
      stats[operation] = this.getStats(operation)
    }
    return stats
  }

  clear() {
    this.timings.clear()
  }
}
