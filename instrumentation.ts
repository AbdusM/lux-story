/**
 * Next.js Instrumentation File
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * This file is automatically loaded by Next.js on both server and client startup.
 * Used for initializing monitoring tools and performance tracking.
 */

import { validateEnv } from './lib/env-validation'

export async function register() {
  // Fail-fast: Validate environment variables on startup
  // This prevents the server from starting with missing/invalid configuration
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      console.log('🔍 Validating environment configuration...')
      validateEnv('server')
      console.log('✅ Environment validation passed')
    } catch (error) {
      console.error('❌ Environment validation failed:')
      console.error((error as Error).message)
      console.error('\nServer startup aborted. Please fix the configuration errors above.')
      // In development, we log the error but continue (Next.js will show the error page)
      // In production, we should exit to prevent broken deployments
      if (process.env.NODE_ENV === 'production') {
        process.exit(1)
      }
    }
  }

  // Only initialize Sentry in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SENTRY === 'true') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      // Server-side initialization
      await import('./sentry.server.config');
    } else if (process.env.NEXT_RUNTIME === 'edge') {
      // Edge runtime initialization
      await import('./sentry.edge.config');
    }
  }
}
