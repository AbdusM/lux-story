/**
 * Next.js Instrumentation File
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * This file is automatically loaded by Next.js on both server and client startup.
 * Used for initializing monitoring tools and performance tracking.
 */

export async function register() {
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
