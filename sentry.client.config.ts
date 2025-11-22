/**
 * Sentry Client-Side Configuration
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Captures client-side errors, performance issues, and user interactions
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,

  // Environment detection
  environment: process.env.NODE_ENV || 'development',

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
  // In production, adjust this value to reduce volume (e.g., 0.1 for 10%)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session replay for debugging user sessions
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration({
      // Custom instrumentation
      // tracePropagationTargets: ['localhost', /^https:\/\/.*\.pages\.dev/],
    }),
  ],

  // Filter out sensitive data
  beforeSend(event, hint) {
    // Remove PII from error context
    if (event.request?.cookies) {
      delete event.request.cookies;
    }

    // Filter out localStorage/sessionStorage data
    if (event.contexts?.browser) {
      delete event.contexts.browser.storage;
    }

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    /chrome-extension/,
    /moz-extension/,

    // Network errors that are user-related
    'Network request failed',
    'Failed to fetch',

    // ResizeObserver loop errors (harmless)
    'ResizeObserver loop limit exceeded',
  ],
});
