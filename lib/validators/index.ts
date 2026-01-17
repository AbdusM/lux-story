/**
 * Validators Index
 * Central export for all validation utilities
 */

// Dialogue validators
export {
  validateDialogueGating,
  validatePatternUnlocks,
  validateDialogueGraph,
  validateAllDialogueGraphs,
  type GatingIssue,
  type PatternUnlockIssue,
  type ValidationResult
} from './dialogue-validators'

// Simulation validators
export {
  buildSimulationAlignmentMap,
  validateEntryNodes,
  validatePhaseAndDifficulty,
  validateSimulations,
  CONTENT_REGISTRY,
  LIB_REGISTRY,
  type SimulationAlignmentIssue,
  type EntryNodeIssue,
  type SimulationValidationResult,
  type SimulationAlignmentMap
} from './simulation-validators'
