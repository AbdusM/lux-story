/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API routes
 *
 * Usage:
 * ```ts
 * const limiter = rateLimit({
 *   interval: 60 * 1000, // 1 minute
 *   uniqueTokenPerInterval: 500, // Max 500 IPs tracked
 * })
 *
 * await limiter.check(ip, 10) // 10 requests per interval
 * ```
 */

export interface RateLimitOptions {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval?: number // Max number of unique tokens to track
}

interface TokenData {
  timestamps: number[]
  lastCleanup: number
}

export function rateLimit(options: RateLimitOptions) {
  // Simple Map-based cache (no external dependencies)
  const tokenCache = new Map<string, TokenData>()
  const maxTokens = options.uniqueTokenPerInterval || 500

  return {
    check: (token: string, limit: number): Promise<void> =>
      new Promise((resolve, reject) => {
        const now = Date.now()

        // Cleanup old entries periodically to prevent memory leaks
        if (tokenCache.size > maxTokens) {
          const cutoff = now - options.interval
          for (const [key, data] of tokenCache.entries()) {
            if (data.lastCleanup < cutoff) {
              tokenCache.delete(key)
            }
          }
        }

        const tokenData = tokenCache.get(token) || {
          timestamps: [],
          lastCleanup: now,
        }

        // Remove timestamps outside the current interval
        const validTokens = tokenData.timestamps.filter(
          (timestamp) => now - timestamp < options.interval
        )

        // Check if limit exceeded
        if (validTokens.length >= limit) {
          reject(new Error('Rate limit exceeded'))
        } else {
          // Add current timestamp
          validTokens.push(now)
          tokenCache.set(token, {
            timestamps: validTokens,
            lastCleanup: now,
          })
          resolve()
        }
      }),
  }
}

/**
 * Get client IP address from request headers
 * Handles various proxy headers (Cloudflare, Vercel, etc.)
 */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers)

  // Try various headers in order of preference
  const possibleHeaders = [
    'cf-connecting-ip', // Cloudflare
    'x-real-ip', // Nginx
    'x-forwarded-for', // General proxy
  ]

  for (const header of possibleHeaders) {
    const value = headers.get(header)
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return value.split(',')[0].trim()
    }
  }

  return 'unknown'
}
