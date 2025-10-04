/**
 * Sentry Server-Side Configuration
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Captures server-side errors, API failures, and database issues
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
  // In production, adjust this value to reduce volume (e.g., 0.1 for 10%)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Remove environment variables from context
    if (event.contexts?.runtime?.env) {
      delete event.contexts.runtime.env;
    }

    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }

    return event;
  },

  // Add custom tags for filtering
  initialScope: {
    tags: {
      app: 'grand-central-terminus',
      region: 'birmingham',
    },
  },
});
