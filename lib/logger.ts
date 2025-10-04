/**
 * Professional Structured Logging Utility
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Production-safe logging with:
 * - Structured JSON output
 * - Context tracking (userId, operation, etc.)
 * - PII filtering
 * - Log levels
 * - Sentry integration for errors
 */

const DEBUG = process.env.NODE_ENV === 'development'
const VERBOSE = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_VERBOSE_LOGGING === 'true'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  userId?: string
  operation?: string
  timestamp?: string
  [key: string]: unknown
}

/**
 * Sanitize log data to remove sensitive information
 */
function sanitize(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data
  }

  const sanitized = { ...data } as Record<string, unknown>
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization', 'cookie']

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitize(sanitized[key])
    }
  }

  return sanitized
}

/**
 * Format log message with context
 */
function formatLog(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString()
  const logData = {
    level,
    message,
    timestamp,
    ...sanitize(context || {}),
  }

  if (process.env.NODE_ENV === 'production') {
    // Structured JSON in production
    return JSON.stringify(logData)
  } else {
    // Human-readable in development
    const prefix = `[${level.toUpperCase()}]`
    const ctx = context ? ` ${JSON.stringify(sanitize(context))}` : ''
    return `${prefix} ${message}${ctx}`
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (DEBUG) {
      console.log(formatLog('debug', message, context))
    }
  },

  info: (message: string, context?: LogContext) => {
    if (DEBUG) {
      console.info(formatLog('info', message, context))
    }
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(formatLog('warn', message, context))
  },

  error: (message: string, context?: LogContext, error?: Error) => {
    console.error(formatLog('error', message, context))

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production' && error) {
      try {
        // Sentry will be initialized if available
        if (typeof window !== 'undefined' && (window as any).Sentry) {
          (window as any).Sentry.captureException(error, {
            contexts: {
              custom: sanitize(context || {}),
            },
          })
        }
      } catch (sentryError) {
        console.error('Failed to send error to Sentry:', sentryError)
      }
    }
  },

  verbose: (message: string, context?: LogContext) => {
    if (VERBOSE) {
      console.log(formatLog('debug', message, context))
    }
  },
}

// For backward compatibility during transition
export const debugLog = (message: string, ...args: unknown[]) =>
  logger.debug(message, { args: sanitize(args) })

export const infoLog = (message: string, ...args: unknown[]) =>
  logger.info(message, { args: sanitize(args) })

export const warnLog = (message: string, ...args: unknown[]) =>
  logger.warn(message, { args: sanitize(args) })

export const errorLog = (message: string, ...args: unknown[]) =>
  logger.error(message, { args: sanitize(args) })
