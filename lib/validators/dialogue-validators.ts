/**
 * Dialogue Validators
 * Detects gating issues, missing nodes, and pattern unlock integrity.
 *
 * ISP: Evidence-Based — validators must produce actionable diagnostics.
 */

import { DialogueGraph, StateConditionEvaluator } from '../dialogue-graph'
import { CHARACTER_PATTERN_AFFINITIES } from '../pattern-affinity'
import { GameState } from '../character-state'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface GatingIssue {
  nodeId: string
  characterId: string
  issueType: 'all_choices_gated' | 'no_choices' | 'unreachable_next_node'
  details: string
  severity: 'error' | 'warning'
}

export interface PatternUnlockIssue {
  characterId: string
  pattern: string
  threshold: number
  nodeId: string
  issueType: 'missing_node' | 'empty_description' | 'invalid_threshold'
  details: string
}

export interface ValidationResult {
  valid: boolean
  gatingIssues: GatingIssue[]
  patternUnlockIssues: PatternUnlockIssue[]
  summary: string
}

// ═══════════════════════════════════════════════════════════════════════════
// GATING VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Node IDs that are intentionally gated off (e.g., simulation-only, dev-only).
 * Add to this list to suppress false positives.
 */
const ALLOW_LISTED_GATED_NODES = new Set<string>([
  // Simulation entry points often have no visible choices
  'samuel_conductor_god_mode',
  // Add others as needed
])

/**
 * Validate a dialogue graph for gating issues.
 * Detects nodes where all choices are gated off under default state.
 */
export function validateDialogueGating(
  graph: DialogueGraph,
  characterId: string,
  defaultState?: GameState
): GatingIssue[] {
  const issues: GatingIssue[] = []

  // Create a minimal default state for evaluation
  const testState: GameState = defaultState ?? createMinimalGameState(characterId)

  for (const [nodeId, node] of graph.nodes) {
    // Skip allow-listed nodes
    if (ALLOW_LISTED_GATED_NODES.has(nodeId)) continue

    // Check for nodes with no choices at all
    if (!node.choices || node.choices.length === 0) {
      // This is only an issue if the node doesn't have a simulation or auto-advance
      if (!node.simulation && !node.metadata?.sessionBoundary) {
        issues.push({
          nodeId,
          characterId,
          issueType: 'no_choices',
          details: `Node has no choices defined. May be a dead end.`,
          severity: 'warning'
        })
      }
      continue
    }

    // Evaluate choices under default state WITHOUT auto-fallback
    const visibleCount = node.choices.filter(choice => (
      StateConditionEvaluator.evaluate(choice.visibleCondition, testState, characterId)
    )).length

    // If all choices are gated off, flag it
    // Note: evaluateChoices has auto-fallback, so this checks pre-fallback state
    if (visibleCount === 0) {
      issues.push({
        nodeId,
        characterId,
        issueType: 'all_choices_gated',
        details: `All ${node.choices.length} choices are gated off under default state. Auto-fallback will show them, but this may indicate misconfiguration.`,
        severity: 'warning'
      })
    }

    // Check for unreachable next nodes
    for (const choice of node.choices) {
      if (choice.nextNodeId && !graph.nodes.has(choice.nextNodeId)) {
        issues.push({
          nodeId,
          characterId,
          issueType: 'unreachable_next_node',
          details: `Choice "${choice.text?.slice(0, 30)}..." points to non-existent node "${choice.nextNodeId}"`,
          severity: 'error'
        })
      }
    }
  }

  return issues
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN UNLOCK VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate pattern unlock integrity for a character.
 * Ensures unlocked nodes exist and descriptions are non-empty.
 */
export function validatePatternUnlocks(
  characterId: string,
  graph: DialogueGraph
): PatternUnlockIssue[] {
  const issues: PatternUnlockIssue[] = []

  const affinity = CHARACTER_PATTERN_AFFINITIES[characterId]
  if (!affinity?.patternUnlocks || affinity.patternUnlocks.length === 0) {
    // No pattern unlocks defined — not an issue, just no validation needed
    return issues
  }

  for (const unlock of affinity.patternUnlocks) {
    // Check threshold validity
    if (unlock.threshold < 0 || unlock.threshold > 100) {
      issues.push({
        characterId,
        pattern: unlock.pattern,
        threshold: unlock.threshold,
        nodeId: unlock.unlockedNodeId,
        issueType: 'invalid_threshold',
        details: `Threshold ${unlock.threshold} is out of valid range (0-100)`
      })
    }

    // Check description
    if (!unlock.description || unlock.description.trim() === '') {
      issues.push({
        characterId,
        pattern: unlock.pattern,
        threshold: unlock.threshold,
        nodeId: unlock.unlockedNodeId,
        issueType: 'empty_description',
        details: `Pattern unlock has no description`
      })
    }

    // Check node existence
    if (!graph.nodes.has(unlock.unlockedNodeId)) {
      issues.push({
        characterId,
        pattern: unlock.pattern,
        threshold: unlock.threshold,
        nodeId: unlock.unlockedNodeId,
        issueType: 'missing_node',
        details: `Unlocked node "${unlock.unlockedNodeId}" does not exist in ${characterId} graph`
      })
    }
  }

  return issues
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Run all validators on a dialogue graph.
 */
export function validateDialogueGraph(
  graph: DialogueGraph,
  characterId: string,
  defaultState?: GameState
): ValidationResult {
  const gatingIssues = validateDialogueGating(graph, characterId, defaultState)
  const patternUnlockIssues = validatePatternUnlocks(characterId, graph)

  const errorCount = gatingIssues.filter(i => i.severity === 'error').length + patternUnlockIssues.filter(i => i.issueType === 'missing_node').length
  const warningCount = gatingIssues.filter(i => i.severity === 'warning').length + patternUnlockIssues.filter(i => i.issueType !== 'missing_node').length

  const valid = errorCount === 0

  return {
    valid,
    gatingIssues,
    patternUnlockIssues,
    summary: `${characterId}: ${errorCount} errors, ${warningCount} warnings`
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a minimal GameState for validation purposes.
 */
function createMinimalGameState(characterId: string): GameState {
  return {
    saveVersion: 'validation',
    playerId: 'validator',
    currentNodeId: '',
    lastSaved: Date.now(),
    currentCharacterId: 'samuel',
    thoughts: [],
    episodeNumber: 1,
    sessionStartTime: Date.now(),
    sessionBoundariesCrossed: 0,

    characters: new Map([[characterId, {
      characterId,
      trust: 0,
      anxiety: 0,
      nervousSystemState: 'ventral_vagal',
      lastReaction: null,
      conversationHistory: [],
      relationshipStatus: 'stranger',
      knowledgeFlags: new Set(),
      visitedPatternUnlocks: new Set()
    }]]),

    globalFlags: new Set(),
    patterns: {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    },

    skillLevels: {},
    skillUsage: new Map(),

    mysteries: {
      letterSender: 'unknown',
      platformSeven: 'flickering',
      samuelsPast: 'hidden',
      stationNature: 'unknown'
    },

    platforms: {
      p1: { id: 'p1', warmth: 0, accessible: true, discovered: false, resonance: 0 },
      p3: { id: 'p3', warmth: 0, accessible: true, discovered: false, resonance: 0 },
      p7: { id: 'p7', warmth: 0, accessible: true, discovered: false, resonance: 0 },
      p9: { id: 'p9', warmth: 0, accessible: true, discovered: false, resonance: 0 },
      forgotten: { id: 'forgotten', warmth: 0, accessible: false, discovered: false, resonance: 0 }
    },

    careerValues: {
      directImpact: 0,
      systemsThinking: 0,
      dataInsights: 0,
      futureBuilding: 0,
      independence: 0
    },

    time: {
      currentDisplay: "00:00",
      minutesRemaining: 0,
      flowRate: 1,
      isStopped: false
    },

    quietHour: {
      potential: false,
      experienced: []
    },

    overdensity: 0,
    items: {
      letter: 'kept',
      discoveredPaths: []
    },

    pendingCheckIns: [],
    unlockedAbilities: [],

    archivistState: {
      collectedRecords: new Set(),
      verifiedLore: new Set(),
      sensoryCalibration: {
        engineers: 0,
        syn_bio: 0,
        data_flow: 0,
        station_core: 0
      }
    }
  }
}

/**
 * Batch validate all dialogue graphs.
 * Returns a map of characterId -> ValidationResult.
 */
export function validateAllDialogueGraphs(
  graphs: Map<string, DialogueGraph>
): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>()

  for (const [characterId, graph] of graphs) {
    results.set(characterId, validateDialogueGraph(graph, characterId))
  }

  return results
}
