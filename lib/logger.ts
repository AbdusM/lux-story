/**
 * Professional logging utility
 * Replaces console.log with environment-aware logging
 */

const DEBUG = process.env.NODE_ENV === 'development'
const VERBOSE = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_VERBOSE_LOGGING === 'true'

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (DEBUG) {
      console.info(`[INFO] ${message}`, ...args)
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args)
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args)
  },
  
  verbose: (message: string, ...args: any[]) => {
    if (VERBOSE) {
      console.log(`[VERBOSE] ${message}`, ...args)
    }
  }
}

// For backward compatibility during transition
export const debugLog = logger.debug
export const infoLog = logger.info
export const warnLog = logger.warn
export const errorLog = logger.error
