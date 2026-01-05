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
  const sanitized = sanitize(context || {})
  const logData = {
    level,
    message,
    timestamp,
    ...(sanitized && typeof sanitized === 'object' ? sanitized : {}),
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

// Note: console.log/console.info statements below are intentional - this is the logger utility

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(formatLog('debug', message, context))
    }
  },

  info: (message: string, context?: LogContext) => {
    if (DEBUG) {
      // eslint-disable-next-line no-console
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
        const win = window as unknown as { Sentry: { captureException: (err: Error, ctx: unknown) => void } }
        if (typeof window !== 'undefined' && win.Sentry) {
          win.Sentry.captureException(error, {
            contexts: {
              custom: sanitize(context || {}),
            },
          })
        }
      } catch (sentryError) {
        console.error('Failed to send error to Sentry:', sentryError)
      }
    }

    // ISP: Remote Log Capture (Dev Mode)
    // Send critical errors to server terminal so AI Agent can see them
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const payload = {
        message,
        context: sanitize(context || {}),
        stack: error?.stack
      }
      // Fire and forget
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => { }) // Ignore transport errors
    }
  },

  verbose: (message: string, context?: LogContext) => {
    if (VERBOSE) {
      // eslint-disable-next-line no-console
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
