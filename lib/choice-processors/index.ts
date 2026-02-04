/**
 * Choice Processors Module
 *
 * Phase 4B: Extracted from useChoiceHandler to reduce file size.
 * Pure functions for processing game systems during choice handling.
 *
 * USAGE:
 * ```typescript
 * import {
 *   runAllDerivativeProcessors,
 *   readLocalStorageSnapshot,
 *   buildChoiceUiPatch,
 * } from '@/lib/choice-processors'
 * ```
 */

// Individual processors (for testing/direct use)
export * from './story-arc-processor'
export * from './puzzle-processor'
export * from './knowledge-processor'
export * from './iceberg-processor'
export * from './arc-completion-processor'

// Orchestrator (consolidates all processor calls)
export * from './derivative-orchestrator'

// UI patch builder (consolidates setState)
export * from './ui-patch-builder'
