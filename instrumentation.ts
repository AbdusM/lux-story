/**
 * Next.js Instrumentation File
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * This file is automatically loaded by Next.js on both server and client startup.
 * Used for initializing monitoring tools and performance tracking.
 */

import { validateEnv } from './lib/env-validation'

export async function register() {
  // Validate environment variables on startup
  // Log warnings for missing config but allow server to start with degraded functionality
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      // Environment validation happens silently - errors are thrown and caught
      validateEnv('server')
    } catch (error) {
      // Log the error but DON'T exit - allow server to start with degraded functionality
      // This enables graceful degradation when optional services (AI, monitoring) aren't configured
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.warn('⚠️ Environment validation warning:')
      console.warn(errorMessage)
      console.warn('\nServer starting with degraded functionality. Some features may be unavailable.')
      // IMPORTANT: Do NOT call process.exit(1) - this kills serverless functions
      // The app should continue running with available services
    }
  }

  // Only initialize Sentry in production or when explicitly enabled
  // Skip in development to avoid ESM/CommonJS conflicts with Prisma instrumentation
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SENTRY === 'true') {
    try {
      if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Server-side initialization
        await import('./sentry.server.config');
      } else if (process.env.NEXT_RUNTIME === 'edge') {
        // Edge runtime initialization
        await import('./sentry.edge.config');
      }
    } catch (error) {
      // Silently fail if Sentry can't be initialized (e.g., ESM/CommonJS conflicts)
      // This prevents the server from crashing due to Sentry configuration issues
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Sentry initialization skipped in development:', error instanceof Error ? error.message : String(error));
      }
    }
  }
}
