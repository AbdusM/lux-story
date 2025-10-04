/**
 * Retry Utility with Exponential Backoff and Circuit Breaker
 * Provides robust error handling and retry logic for network operations
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number // ms
  maxDelay?: number // ms
  backoffMultiplier?: number
  timeout?: number // ms per attempt
  shouldRetry?: (error: Error) => boolean
}

export interface CircuitBreakerOptions {
  failureThreshold?: number // Number of failures before opening circuit
  resetTimeout?: number // ms before attempting to close circuit
}

/**
 * Circuit Breaker state machine
 */
class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  private failureCount = 0
  private lastFailureTime = 0
  private readonly failureThreshold: number
  private readonly resetTimeout: number

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold || 5
    this.resetTimeout = options.resetTimeout || 60000 // 1 minute
  }

  canExecute(): boolean {
    if (this.state === 'closed') {
      return true
    }

    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime
      if (timeSinceLastFailure >= this.resetTimeout) {
        console.log('[CircuitBreaker] Attempting half-open state')
        this.state = 'half-open'
        return true
      }
      return false
    }

    // half-open state: allow one request through to test
    return true
  }

  recordSuccess(): void {
    this.failureCount = 0
    this.state = 'closed'
    console.log('[CircuitBreaker] Circuit closed (success)')
  }

  recordFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open'
      console.warn(`[CircuitBreaker] Circuit opened (${this.failureCount} failures)`)
    } else if (this.state === 'half-open') {
      this.state = 'open'
      console.warn('[CircuitBreaker] Half-open attempt failed, reopening circuit')
    }
  }

  getState(): { state: string; failureCount: number } {
    return {
      state: this.state,
      failureCount: this.failureCount
    }
  }

  reset(): void {
    this.state = 'closed'
    this.failureCount = 0
    this.lastFailureTime = 0
  }
}

/**
 * Global circuit breakers for different operations
 */
const circuitBreakers = new Map<string, CircuitBreaker>()

function getCircuitBreaker(key: string, options?: CircuitBreakerOptions): CircuitBreaker {
  if (!circuitBreakers.has(key)) {
    circuitBreakers.set(key, new CircuitBreaker(options))
  }
  return circuitBreakers.get(key)!
}

/**
 * Execute a function with exponential backoff retry logic
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    timeout = 30000,
    shouldRetry = () => true
  } = options

  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Apply timeout to each attempt
      const result = await Promise.race([
        fn(),
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error('Operation timeout')), timeout)
        )
      ])

      return result
    } catch (error) {
      lastError = error as Error

      if (attempt === maxRetries || !shouldRetry(lastError)) {
        throw lastError
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      )

      console.log(
        `[Retry] Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${delay}ms...`,
        lastError.message
      )

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

/**
 * Execute a function with circuit breaker protection
 */
export async function withCircuitBreaker<T>(
  fn: () => Promise<T>,
  circuitKey: string,
  options: CircuitBreakerOptions = {}
): Promise<T> {
  const breaker = getCircuitBreaker(circuitKey, options)

  if (!breaker.canExecute()) {
    throw new Error(`Circuit breaker open for: ${circuitKey}`)
  }

  try {
    const result = await fn()
    breaker.recordSuccess()
    return result
  } catch (error) {
    breaker.recordFailure()
    throw error
  }
}

/**
 * Combined retry with circuit breaker
 */
export async function retryWithCircuitBreaker<T>(
  fn: () => Promise<T>,
  circuitKey: string,
  retryOptions: RetryOptions = {},
  circuitOptions: CircuitBreakerOptions = {}
): Promise<T> {
  return withCircuitBreaker(
    () => retryWithBackoff(fn, retryOptions),
    circuitKey,
    circuitOptions
  )
}

/**
 * Get circuit breaker status for monitoring
 */
export function getCircuitBreakerStatus(key: string): { state: string; failureCount: number } | null {
  const breaker = circuitBreakers.get(key)
  return breaker ? breaker.getState() : null
}

/**
 * Reset circuit breaker (useful for manual intervention)
 */
export function resetCircuitBreaker(key: string): boolean {
  const breaker = circuitBreakers.get(key)
  if (breaker) {
    breaker.reset()
    console.log(`[CircuitBreaker] Reset: ${key}`)
    return true
  }
  return false
}

/**
 * Common retry predicate for network errors
 */
export function isNetworkError(error: Error): boolean {
  const networkErrors = [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ENETUNREACH',
    'Failed to fetch',
    'Network request failed',
    'timeout'
  ]

  return networkErrors.some(msg =>
    error.message.toLowerCase().includes(msg.toLowerCase())
  )
}

/**
 * Common retry predicate for server errors (5xx)
 */
export function isServerError(error: any): boolean {
  return error.status >= 500 && error.status < 600
}

/**
 * Combined predicate for retryable errors
 */
export function isRetryable(error: any): boolean {
  return isNetworkError(error) || isServerError(error)
}
