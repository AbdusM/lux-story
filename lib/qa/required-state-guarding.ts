/**
 * Required State Guarding (shared core)
 *
 * Goal:
 * - Identify nodes that declare `requiredState` but can be reached via at least one
 *   incoming edge that does not imply/enforce that required state.
 *
 * Notes:
 * - This is a *static* contract check. It does not evaluate dynamic reachability under
 *   particular player state; it checks whether edges guard the declared requirement.
 * - Some enforcement is "derived": a source node's requiredState, onEnter effects, and
 *   choice consequences can imply the requiredState of the destination node.
 */

import type { DialogueNode } from '../dialogue-graph'
import type { StateCondition, StateChange } from '../character-state'

export type IncomingEdge = {
  fromGraph: string
  fromNodeId: string
  choiceId: string
  visibleCondition?: StateCondition
  enabledCondition?: StateCondition
  consequence?: StateChange
  pattern?: string
  fromNodeRequiredState?: StateCondition
  fromNodeOnEnter?: StateChange[]
}

export type UnguardedNode = {
  graphKey: string
  nodeId: string
  requiredState: StateCondition
  unguardedIncomingCount: number
  exampleIncoming: IncomingEdge | null
}

export type RequiredStateGuardingReport = {
  generated_at: string
  totals: {
    graphs: number
    nodes_with_required_state: number
    unguarded_nodes: number
  }
  by_graph: Record<string, { required_state_nodes: number; unguarded_nodes: number }>
  unguarded: UnguardedNode[]
}

export type DialogueGraphsIndex = Record<string, { nodes: Map<string, DialogueNode>; startNodeId: string }>

function stripRevisitSuffix(graphKey: string): string {
  return graphKey.replace(/_revisit$/, '')
}

function siblingGraphKey(graphKey: string): string {
  const base = stripRevisitSuffix(graphKey)
  return graphKey.endsWith('_revisit') ? base : `${base}_revisit`
}

function baseCharacterIdForGraphKey(graphKey: string): string {
  return stripRevisitSuffix(graphKey)
}

function collectIncomingEdges(dialogueGraphs: DialogueGraphsIndex): Map<string, IncomingEdge[]> {
  const incoming = new Map<string, IncomingEdge[]>()
  for (const [graphKey, graph] of Object.entries(dialogueGraphs)) {
    for (const node of graph.nodes.values()) {
      for (const choice of node.choices ?? []) {
        const edge: IncomingEdge = {
          fromGraph: graphKey,
          fromNodeId: node.nodeId,
          choiceId: choice.choiceId,
          visibleCondition: choice.visibleCondition,
          enabledCondition: choice.enabledCondition,
          consequence: choice.consequence,
          pattern: choice.pattern,
          fromNodeRequiredState: node.requiredState,
          fromNodeOnEnter: node.onEnter,
        }
        const list = incoming.get(choice.nextNodeId) ?? []
        list.push(edge)
        incoming.set(choice.nextNodeId, list)
      }
    }
  }
  return incoming
}

function edgesForGraphVariant(
  dialogueGraphs: DialogueGraphsIndex,
  graphKey: string,
  nodeId: string,
  edges: IncomingEdge[],
): IncomingEdge[] {
  // Many nodeIds intentionally exist in both base + revisit graphs (variant overrides).
  // In runtime, edges originating from the sibling variant cannot target this variant.
  // Treat them as irrelevant to avoid false positives (e.g., loyalty triggers).
  const sibKey = siblingGraphKey(graphKey)
  const sibGraph = dialogueGraphs[sibKey]
  if (!sibGraph) return edges
  if (!sibGraph.nodes.has(nodeId)) return edges
  return edges.filter(e => e.fromGraph !== sibKey)
}

function conditionGuards(required: StateCondition, visible?: StateCondition): boolean {
  if (!visible) return false

  if (required.trust) {
    const v = visible.trust
    if (!v) return false
    if (required.trust.min !== undefined && (v.min === undefined || v.min < required.trust.min)) return false
    if (required.trust.max !== undefined && (v.max === undefined || v.max > required.trust.max)) return false
  }

  if (required.hasGlobalFlags) {
    const v = visible.hasGlobalFlags
    if (!v) return false
    for (const flag of required.hasGlobalFlags) {
      if (!v.includes(flag)) return false
    }
  }

  if (required.lacksGlobalFlags) {
    const v = visible.lacksGlobalFlags
    if (!v) return false
    for (const flag of required.lacksGlobalFlags) {
      if (!v.includes(flag)) return false
    }
  }

  if (required.hasKnowledgeFlags) {
    const v = visible.hasKnowledgeFlags
    if (!v) return false
    for (const flag of required.hasKnowledgeFlags) {
      if (!v.includes(flag)) return false
    }
  }

  if (required.lacksKnowledgeFlags) {
    const v = visible.lacksKnowledgeFlags
    if (!v) return false
    for (const flag of required.lacksKnowledgeFlags) {
      if (!v.includes(flag)) return false
    }
  }

  if (required.patterns) {
    const v = visible.patterns
    if (!v) return false
    for (const [pattern, range] of Object.entries(required.patterns)) {
      const vr = v[pattern as keyof typeof v]
      if (!vr) return false
      if (range?.min !== undefined && (vr.min === undefined || vr.min < range.min)) return false
      if (range?.max !== undefined && (vr.max === undefined || vr.max > range.max)) return false
    }
  }

  if (required.mysteries) {
    const v = visible.mysteries
    if (!v) return false
    for (const [key, value] of Object.entries(required.mysteries)) {
      if (v[key as keyof typeof v] !== value) return false
    }
  }

  if (required.requiredCombos) {
    const v = visible.requiredCombos
    if (!v) return false
    for (const combo of required.requiredCombos) {
      if (!v.includes(combo)) return false
    }
  }

  return true
}

type ImpliedState = {
  trustMin: number
  trustMax: number | null
  hasGlobalFlags: Set<string>
  lacksGlobalFlags: Set<string>
  hasKnowledgeFlags: Set<string>
  lacksKnowledgeFlags: Set<string>
  patternsMin: Record<string, number>
  patternsMax: Record<string, number>
}

function buildEmptyImplied(): ImpliedState {
  return {
    trustMin: 0,
    trustMax: null,
    hasGlobalFlags: new Set(),
    lacksGlobalFlags: new Set(),
    hasKnowledgeFlags: new Set(),
    lacksKnowledgeFlags: new Set(),
    patternsMin: {},
    patternsMax: {},
  }
}

function mergeConditionIntoImplied(implied: ImpliedState, cond: StateCondition | undefined): void {
  if (!cond) return

  if (cond.trust?.min !== undefined) implied.trustMin = Math.max(implied.trustMin, cond.trust.min)
  if (cond.trust?.max !== undefined) implied.trustMax = implied.trustMax === null ? cond.trust.max : Math.min(implied.trustMax, cond.trust.max)

  for (const f of cond.hasGlobalFlags ?? []) implied.hasGlobalFlags.add(f)
  for (const f of cond.lacksGlobalFlags ?? []) implied.lacksGlobalFlags.add(f)
  for (const f of cond.hasKnowledgeFlags ?? []) implied.hasKnowledgeFlags.add(f)
  for (const f of cond.lacksKnowledgeFlags ?? []) implied.lacksKnowledgeFlags.add(f)

  if (cond.patterns) {
    for (const [pattern, range] of Object.entries(cond.patterns)) {
      if (!range) continue
      if (range.min !== undefined) {
        implied.patternsMin[pattern] = Math.max(implied.patternsMin[pattern] ?? 0, range.min)
      }
      if (range.max !== undefined) {
        implied.patternsMax[pattern] = Math.min(implied.patternsMax[pattern] ?? Number.POSITIVE_INFINITY, range.max)
      }
    }
  }
}

function applyStateChangeToImplied(implied: ImpliedState, change: StateChange | undefined, targetCharacterId: string): void {
  if (!change) return

  for (const f of change.addGlobalFlags ?? []) {
    implied.hasGlobalFlags.add(f)
    implied.lacksGlobalFlags.delete(f)
  }
  for (const f of change.removeGlobalFlags ?? []) {
    implied.hasGlobalFlags.delete(f)
    implied.lacksGlobalFlags.add(f)
  }

  if (change.characterId === targetCharacterId) {
    for (const f of change.addKnowledgeFlags ?? []) {
      implied.hasKnowledgeFlags.add(f)
      implied.lacksKnowledgeFlags.delete(f)
    }
    for (const f of change.removeKnowledgeFlags ?? []) {
      implied.hasKnowledgeFlags.delete(f)
      implied.lacksKnowledgeFlags.add(f)
    }

    if (typeof change.trustChange === 'number') {
      implied.trustMin = Math.max(0, implied.trustMin + change.trustChange)
      if (implied.trustMax !== null) implied.trustMax = Math.max(0, implied.trustMax + change.trustChange)
    }
  }
}

function applyOnEnterToImplied(implied: ImpliedState, onEnter: StateChange[] | undefined, targetCharacterId: string): void {
  for (const ch of onEnter ?? []) {
    applyStateChangeToImplied(implied, ch, targetCharacterId)
  }
}

function applyChoiceEffectsToImplied(implied: ImpliedState, edge: IncomingEdge, targetCharacterId: string): void {
  // Choice consequence is applied before navigation (GameLogic.processChoice).
  applyStateChangeToImplied(implied, edge.consequence, targetCharacterId)

  // Patterns increment on choice selection (handled by GameLogic). Included for completeness.
  if (edge.pattern) {
    implied.patternsMin[edge.pattern] = Math.max(implied.patternsMin[edge.pattern] ?? 0, 1)
  }
}

function impliedSatisfiesRequired(required: StateCondition, implied: ImpliedState): boolean {
  if (required.trust?.min !== undefined && implied.trustMin < required.trust.min) return false
  if (required.trust?.max !== undefined && implied.trustMax !== null && implied.trustMax > required.trust.max) return false

  for (const f of required.hasGlobalFlags ?? []) {
    if (!implied.hasGlobalFlags.has(f)) return false
    if (implied.lacksGlobalFlags.has(f)) return false
  }
  for (const f of required.lacksGlobalFlags ?? []) {
    if (!implied.lacksGlobalFlags.has(f)) return false
    if (implied.hasGlobalFlags.has(f)) return false
  }

  for (const f of required.hasKnowledgeFlags ?? []) {
    if (!implied.hasKnowledgeFlags.has(f)) return false
    if (implied.lacksKnowledgeFlags.has(f)) return false
  }
  for (const f of required.lacksKnowledgeFlags ?? []) {
    if (!implied.lacksKnowledgeFlags.has(f)) return false
    if (implied.hasKnowledgeFlags.has(f)) return false
  }

  if (required.patterns) {
    for (const [pattern, range] of Object.entries(required.patterns)) {
      if (!range) continue
      const min = implied.patternsMin[pattern] ?? 0
      const max = implied.patternsMax[pattern] ?? Number.POSITIVE_INFINITY
      if (range.min !== undefined && min < range.min) return false
      if (range.max !== undefined && max > range.max) return false
    }
  }

  // mysteries/requiredCombos are not modeled here; rely on explicit conditions.
  if (required.mysteries && Object.keys(required.mysteries).length > 0) return false
  if (required.requiredCombos && required.requiredCombos.length > 0) return false

  return true
}

function edgeGuardsRequiredState(required: StateCondition, edge: IncomingEdge, targetCharacterId: string): boolean {
  if (conditionGuards(required, edge.visibleCondition)) return true
  if (conditionGuards(required, edge.enabledCondition)) return true

  const implied = buildEmptyImplied()
  mergeConditionIntoImplied(implied, edge.fromNodeRequiredState)
  mergeConditionIntoImplied(implied, edge.visibleCondition)
  mergeConditionIntoImplied(implied, edge.enabledCondition)
  applyOnEnterToImplied(implied, edge.fromNodeOnEnter, targetCharacterId)
  applyChoiceEffectsToImplied(implied, edge, targetCharacterId)
  return impliedSatisfiesRequired(required, implied)
}

function hasRequiredState(node: DialogueNode): node is DialogueNode & { requiredState: StateCondition } {
  return Boolean(node.requiredState && Object.keys(node.requiredState).length > 0)
}

export function buildRequiredStateGuardingReport(dialogueGraphs: DialogueGraphsIndex): RequiredStateGuardingReport {
  const incoming = collectIncomingEdges(dialogueGraphs)
  const startNodeIds = new Set(Object.values(dialogueGraphs).map(g => g.startNodeId))

  const byGraph: Record<string, { required_state_nodes: number; unguarded_nodes: number }> = {}
  const unguarded: UnguardedNode[] = []
  let totalRequired = 0

  for (const [graphKey, graph] of Object.entries(dialogueGraphs)) {
    let graphRequired = 0
    let graphUnguarded = 0

    for (const node of graph.nodes.values()) {
      if (!hasRequiredState(node)) continue
      if (startNodeIds.has(node.nodeId)) continue
      graphRequired++
      totalRequired++

      const allEdges = incoming.get(node.nodeId) ?? []
      const edges = edgesForGraphVariant(dialogueGraphs, graphKey, node.nodeId, allEdges)
      if (edges.length === 0) continue

      const targetCharacterId = baseCharacterIdForGraphKey(graphKey)
      const unguardedEdges = edges.filter(edge => !edgeGuardsRequiredState(node.requiredState, edge, targetCharacterId))
      if (unguardedEdges.length > 0) {
        graphUnguarded++
        unguarded.push({
          graphKey,
          nodeId: node.nodeId,
          requiredState: node.requiredState,
          unguardedIncomingCount: unguardedEdges.length,
          exampleIncoming: unguardedEdges[0] ?? null,
        })
      }
    }

    byGraph[graphKey] = {
      required_state_nodes: graphRequired,
      unguarded_nodes: graphUnguarded,
    }
  }

  unguarded.sort((a, b) => `${a.graphKey}/${a.nodeId}`.localeCompare(`${b.graphKey}/${b.nodeId}`))

  return {
    generated_at: new Date().toISOString(),
    totals: {
      graphs: Object.keys(dialogueGraphs).length,
      nodes_with_required_state: totalRequired,
      unguarded_nodes: unguarded.length,
    },
    by_graph: byGraph,
    unguarded,
  }
}
