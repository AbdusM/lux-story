/**
 * Sentry Edge Runtime Configuration
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Captures errors in edge functions and middleware
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,

  // Environment detection
  environment: process.env.NODE_ENV || 'development',

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Add custom tags
  initialScope: {
    tags: {
      runtime: 'edge',
      app: 'grand-central-terminus',
    },
  },
});
