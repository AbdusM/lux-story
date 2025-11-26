/**
 * Application Constants
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Only values used in multiple places to avoid unnecessary indirection.
 */

// Choice handler safety timeout (10 seconds)
// Used in: StatefulGameInterface.tsx
export const CHOICE_HANDLER_TIMEOUT_MS = 10_000

// Sync queue configuration
// Used in: sync-queue.ts
export const SYNC_QUEUE_MAX_SIZE = 500
export const SYNC_QUEUE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
