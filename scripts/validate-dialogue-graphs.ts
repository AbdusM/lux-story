#!/usr/bin/env npx tsx
/**
 * Dialogue Graph Validator
 *
 * Static analysis tool for validating dialogue graph integrity.
 * Run before deployment to catch:
 * - Broken node references (nextNodeId points to non-existent node)
 * - Orphaned nodes (nodes with no path leading to them)
 * - Unreachable nodes (nodes blocked by impossible conditions)
 * - Missing required fields
 * - Circular references without exit
 * - Duplicate node IDs
 *
 * Usage: npx tsx scripts/validate-dialogue-graphs.ts
 */

import fs from 'node:fs'
import path from 'node:path'
import { ConditionalChoice, DialogueNode } from '../lib/dialogue-graph'
import { DIALOGUE_GRAPHS } from '../lib/graph-registry'
import { CHARACTER_PATTERN_AFFINITIES } from '../lib/pattern-affinity'
import { SKILL_COMBOS } from '../lib/skill-combos'

import { samuelWaitingEntryPoints } from '../content/samuel-waiting-dialogue'
import { samuelEntryPoints } from '../content/samuel-dialogue-graph'
import { mayaEntryPoints } from '../content/maya-dialogue-graph'
import { devonEntryPoints } from '../content/devon-dialogue-graph'
import { jordanEntryPoints } from '../content/jordan-dialogue-graph'
import { kaiEntryPoints } from '../content/kai-dialogue-graph'
import { silasEntryPoints } from '../content/silas-dialogue-graph'
import { marcusEntryPoints } from '../content/marcus-dialogue-graph'
import { tessEntryPoints } from '../content/tess-dialogue-graph'
import { rohanEntryPoints } from '../content/rohan-dialogue-graph'
import { yaquinEntryPoints } from '../content/yaquin-dialogue-graph'
import { alexEntryPoints } from '../content/alex-dialogue-graph'
import { graceEntryPoints } from '../content/grace-dialogue-graph'
import { elenaEntryPoints } from '../content/elena-dialogue-graph'
import { zaraEntryPoints } from '../content/zara-dialogue-graph'
import { ashaEntryPoints } from '../content/asha-dialogue-graph'
import { liraEntryPoints } from '../content/lira-dialogue-graph'
import { quinnEntryPoints } from '../content/quinn-dialogue-graph'
import { danteEntryPoints } from '../content/dante-dialogue-graph'
import { nadiaEntryPoints } from '../content/nadia-dialogue-graph'
import { isaiahEntryPoints } from '../content/isaiah-dialogue-graph'

import { mayaRevisitEntryPoints } from '../content/maya-revisit-graph'
import { yaquinRevisitEntryPoints } from '../content/yaquin-revisit-graph'
import { devonRevisitEntryPoints } from '../content/devon-revisit-graph'
import { graceRevisitEntryPoints } from '../content/grace-revisit-graph'
import { SYNTHESIS_PUZZLES } from '../content/synthesis-puzzles'

// ============= HELPERS =============

function truncateOneLine(input: string, maxLen: number): string {
  const s = input.replace(/\s+/g, ' ').trim()
  if (s.length <= maxLen) return s
  return `${s.slice(0, Math.max(0, maxLen - 3))}...`
}

function normalizeChoiceText(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim()
}

function isExplicitContinueChoice(text: string): boolean {
  const t = normalizeChoiceText(text)
  if (t === '...') return true
  if (t === 'continue') return true
  if (t === '[continue]') return true
  if (t.startsWith('[continue]')) return true
  return false
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value))
}

function sortKeysDeep(value: unknown): unknown {
  if (value === null) return null
  if (typeof value !== 'object') return value

  if (Array.isArray(value)) {
    const mapped = value.map(sortKeysDeep)
    // If the array is purely primitives, treat it like a set for signature purposes.
    if (mapped.every(v => v === null || ['string', 'number', 'boolean'].includes(typeof v))) {
      return [...mapped].sort((a, b) => String(a).localeCompare(String(b)))
    }
    return mapped
  }

  const obj = value as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) {
    out[key] = sortKeysDeep(obj[key])
  }
  return out
}

function computeDuplicateChoiceSignature(choice: ConditionalChoice): string {
  // Include all fields that change the choice's semantics and availability.
  // We also include the normalized display text; if the text differs, we treat it as intentional "flavor"
  // even if it converges to the same node.
  const sig = {
    nextNodeId: choice.nextNodeId,
    text: normalizeChoiceText(choice.text),
    visibleCondition: choice.visibleCondition ?? null,
    enabledCondition: choice.enabledCondition ?? null,
    pattern: choice.pattern ?? null,
    skills: choice.skills ? [...choice.skills].sort() : null,
    learningObjectiveId: choice.learningObjectiveId ?? null,
    consequence: choice.consequence ?? null,
    preview: choice.preview ? normalizeChoiceText(choice.preview) : null,
    voiceVariations: choice.voiceVariations ?? null,
    archetype: choice.archetype ?? null,
    interaction: choice.interaction ?? null,
    requiredOrbFill: choice.requiredOrbFill ?? null
  }

  return stableStringify(sig)
}

const KNOWN_ENTRY_NODE_IDS = new Set<string>([
  ...Object.values(samuelEntryPoints),
  ...Object.values(samuelWaitingEntryPoints),
  ...Object.values(mayaEntryPoints),
  ...Object.values(mayaRevisitEntryPoints),
  ...Object.values(devonEntryPoints),
  ...Object.values(devonRevisitEntryPoints),
  ...Object.values(jordanEntryPoints),
  ...Object.values(marcusEntryPoints),
  ...Object.values(tessEntryPoints),
  ...Object.values(yaquinEntryPoints),
  ...Object.values(yaquinRevisitEntryPoints),
  ...Object.values(kaiEntryPoints),
  ...Object.values(rohanEntryPoints),
  ...Object.values(silasEntryPoints),
  ...Object.values(alexEntryPoints),
  ...Object.values(elenaEntryPoints),
  ...Object.values(graceEntryPoints),
  ...Object.values(graceRevisitEntryPoints),
  ...Object.values(ashaEntryPoints),
  ...Object.values(liraEntryPoints),
  ...Object.values(zaraEntryPoints),
  ...Object.values(quinnEntryPoints),
  ...Object.values(danteEntryPoints),
  ...Object.values(nadiaEntryPoints),
  ...Object.values(isaiahEntryPoints)
])

const PATTERN_UNLOCK_NODE_IDS = new Set<string>(
  Object.values(CHARACTER_PATTERN_AFFINITIES)
    .flatMap((a: any) => (a?.patternUnlocks ?? []).map((u: any) => u.unlockedNodeId))
    .filter(Boolean)
)

const SYNTHESIS_UNLOCK_NODE_IDS = new Set<string>(
  SYNTHESIS_PUZZLES
    .map((p: any) => p?.reward?.unlockNodeId)
    .filter(Boolean)
)

const SKILL_COMBO_UNLOCK_NODE_IDS = new Set<string>(
  SKILL_COMBOS
    .flatMap((c: any) => (c?.unlocks ?? []).filter((u: any) => u?.type === 'dialogue').map((u: any) => u.id))
    .filter(Boolean)
)

type GraphInput = { name: string; nodes: DialogueNode[]; startNodeId: string }

function buildNodeOwnerIndex(graphs: GraphInput[]): Map<string, string> {
  // Node IDs are expected to be globally unique in practice; if duplicates exist,
  // we pick the first owner deterministically based on graph iteration order.
  const index = new Map<string, string>()
  for (const graph of graphs) {
    for (const node of graph.nodes) {
      if (!index.has(node.nodeId)) index.set(node.nodeId, graph.name)
    }
  }
  return index
}

function inGraphRoots(graph: GraphInput, nodeMap: Map<string, DialogueNode>): string[] {
  const roots: string[] = []
  if (nodeMap.has(graph.startNodeId)) roots.push(graph.startNodeId)

  for (const entryId of KNOWN_ENTRY_NODE_IDS) {
    if (nodeMap.has(entryId)) roots.push(entryId)
  }
  for (const unlockId of PATTERN_UNLOCK_NODE_IDS) {
    if (nodeMap.has(unlockId)) roots.push(unlockId)
  }
  for (const unlockId of SYNTHESIS_UNLOCK_NODE_IDS) {
    if (nodeMap.has(unlockId)) roots.push(unlockId)
  }
  for (const unlockId of SKILL_COMBO_UNLOCK_NODE_IDS) {
    if (nodeMap.has(unlockId)) roots.push(unlockId)
  }
  for (const node of nodeMap.values()) {
    if ((node as any)?.simulation) roots.push(node.nodeId)
  }

  return Array.from(new Set(roots))
}

function outgoingTargets(node: DialogueNode): string[] {
  const targets: string[] = []

  for (const choice of node.choices ?? []) {
    if (choice.nextNodeId) targets.push(choice.nextNodeId)
  }

  for (const content of node.content ?? []) {
    const interrupt = (content as any).interrupt
    if (interrupt?.targetNodeId) targets.push(interrupt.targetNodeId)
    if (interrupt?.missedNodeId) targets.push(interrupt.missedNodeId)
  }

  return targets
}

function bfsReachable(nodeMap: Map<string, DialogueNode>, roots: string[]): Set<string> {
  const reachable = new Set<string>()
  const queue = [...roots]

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    if (reachable.has(nodeId)) continue
    const node = nodeMap.get(nodeId)
    if (!node) continue

    reachable.add(nodeId)

    for (const next of outgoingTargets(node)) {
      if (!nodeMap.has(next)) continue
      if (!reachable.has(next)) queue.push(next)
    }
  }

  return reachable
}

function computeGlobalReachability(graphs: GraphInput[]): Map<string, Set<string>> {
  const nodeOwner = buildNodeOwnerIndex(graphs)
  const nodeMaps = new Map<string, Map<string, DialogueNode>>()
  const internalRootsByGraph = new Map<string, string[]>()

  for (const g of graphs) {
    const nodeMap = new Map<string, DialogueNode>(g.nodes.map((n) => [n.nodeId, n]))
    nodeMaps.set(g.name, nodeMap)
    internalRootsByGraph.set(g.name, inGraphRoots(g, nodeMap))
  }

  let externalRootsByGraph = new Map<string, Set<string>>()
  for (const g of graphs) externalRootsByGraph.set(g.name, new Set())

  let reachableByGraph = new Map<string, Set<string>>()

  for (let iter = 0; iter < 10; iter++) {
    reachableByGraph = new Map()
    for (const g of graphs) {
      const nodeMap = nodeMaps.get(g.name)!
      const roots = [
        ...(internalRootsByGraph.get(g.name) ?? []),
        ...Array.from(externalRootsByGraph.get(g.name) ?? []),
      ]
      const uniqueRoots = Array.from(new Set(roots)).filter((id) => nodeMap.has(id))
      reachableByGraph.set(g.name, bfsReachable(nodeMap, uniqueRoots))
    }

    const nextExternalRootsByGraph = new Map<string, Set<string>>()
    for (const g of graphs) nextExternalRootsByGraph.set(g.name, new Set())

    for (const source of graphs) {
      const sourceMap = nodeMaps.get(source.name)!
      const reachable = reachableByGraph.get(source.name) ?? new Set<string>()
      for (const nodeId of reachable) {
        const node = sourceMap.get(nodeId)
        if (!node) continue
        for (const targetId of outgoingTargets(node)) {
          const owner = nodeOwner.get(targetId)
          if (!owner) continue
          if (owner === source.name) continue
          const targetMap = nodeMaps.get(owner)
          if (!targetMap?.has(targetId)) continue
          nextExternalRootsByGraph.get(owner)!.add(targetId)
        }
      }
    }

    let changed = false
    for (const g of graphs) {
      const prev = externalRootsByGraph.get(g.name) ?? new Set()
      const next = nextExternalRootsByGraph.get(g.name) ?? new Set()
      if (prev.size !== next.size) {
        changed = true
        break
      }
      for (const v of next) {
        if (!prev.has(v)) {
          changed = true
          break
        }
      }
      if (changed) break
    }

    externalRootsByGraph = nextExternalRootsByGraph
    if (!changed) break
  }

  return reachableByGraph
}

// ============= TYPES =============

interface ValidationError {
  severity: 'error' | 'warning' | 'info'
  graph: string
  nodeId?: string
  choiceId?: string
  message: string
  suggestion?: string
}

interface GraphStats {
  name: string
  totalNodes: number
  totalChoices: number
  totalInterrupts: number
  reachableNodes: number
  orphanedNodes: number
  structurallyUnreachableNodes: number
  brokenReferences: number
  maxDepth: number
  trustGatedNodes: number
  flagGatedNodes: number
  fakeChoiceClusters: number
  patternCounts: Record<string, number>
}

interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  infos: ValidationError[]
  stats: GraphStats[]
}

// ============= VALIDATOR CLASS =============

class DialogueGraphValidator {
  private errors: ValidationError[] = []
  private warnings: ValidationError[] = []
  private infos: ValidationError[] = []
  private stats: GraphStats[] = []
  private globalNodeIds: Set<string> = new Set()
  private globalIncomingNodeIds: Set<string> = new Set()
  private reachableByGraph: Map<string, Set<string>> | null = null
  private readonly virtualNodeIds = new Set(['TRAVEL_PENDING', 'SIMULATION_PENDING'])
  private readonly strictOrphans: boolean
  private readonly strictQuality: boolean

  constructor(opts?: { strictOrphans?: boolean; strictQuality?: boolean }) {
    this.strictOrphans = opts?.strictOrphans ?? false
    this.strictQuality = opts?.strictQuality ?? false
  }

  validate(graphs: GraphInput[]): ValidationResult {
    this.errors = []
    this.warnings = []
    this.infos = []
    this.stats = []
    this.globalNodeIds = new Set()
    this.globalIncomingNodeIds = new Set()
    this.reachableByGraph = computeGlobalReachability(graphs)

    // Build a master set of node IDs across all loaded graphs so per-graph validation
    // doesn't incorrectly fail for intentional cross-graph references.
    for (const graph of graphs) {
      for (const node of graph.nodes) {
        this.globalNodeIds.add(node.nodeId)
      }
    }

    // Build a global incoming-reference set across all graphs so orphan detection
    // doesn't incorrectly warn for nodes that are only reached from other graphs.
    for (const graph of graphs) {
      for (const node of graph.nodes) {
        for (const choice of node.choices) {
          this.globalIncomingNodeIds.add(choice.nextNodeId)
        }
        for (const content of node.content || []) {
          const interrupt = content.interrupt
          if (interrupt?.targetNodeId) this.globalIncomingNodeIds.add(interrupt.targetNodeId)
          if (interrupt?.missedNodeId) this.globalIncomingNodeIds.add(interrupt.missedNodeId)
        }
      }
    }

    for (const graph of graphs) {
      this.validateGraph(graph.name, graph.nodes, graph.startNodeId)
    }

    // Cross-graph validation (Samuel references other characters)
    this.validateCrossGraphReferences(graphs)

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      infos: this.infos,
      stats: this.stats
    }
  }

  private validateGraph(name: string, nodes: DialogueNode[], startNodeId: string): void {
    const nodeMap = new Map<string, DialogueNode>()
    const reachableFromStart = new Set<string>()
    const patternCounts: Record<string, number> = {
      analytical: 0,
      helping: 0,
      building: 0,
      patience: 0,
      exploring: 0
    }
    let fakeChoiceClusters = 0

    // Build node map and check for duplicates
    for (const node of nodes) {
      if (nodeMap.has(node.nodeId)) {
        this.errors.push({
          severity: 'error',
          graph: name,
          nodeId: node.nodeId,
          message: `Duplicate node ID: "${node.nodeId}"`,
          suggestion: 'Each node must have a unique ID within its graph'
        })
      }
      nodeMap.set(node.nodeId, node)
    }

    // Validate each node and detect fake choice clusters
    for (const node of nodes) {
      this.validateNode(name, node, nodeMap)

      // Count patterns
      for (const choice of node.choices) {
        if (choice.pattern && patternCounts[choice.pattern] !== undefined) {
          patternCounts[choice.pattern]++
        }
      }

      // Detect fake choice clusters (duplicate choices converging to same destination).
      //
      // Old behavior: warn on ANY 2+ choices that lead to the same nextNodeId.
      // That produced extremely noisy output for intentional narrative convergence
      // (different flavor lines that all acknowledge and continue).
      //
      // New behavior: warn only when the choices are effectively duplicates:
      // same destination AND same normalized label AND same conditions/effects.
      const candidates = node.choices.filter(c => !isExplicitContinueChoice(c.text))
      if (candidates.length >= 2) {
        const byDest = new Map<string, ConditionalChoice[]>()
        for (const choice of candidates) {
          const existing = byDest.get(choice.nextNodeId) || []
          existing.push(choice)
          byDest.set(choice.nextNodeId, existing)
        }

        for (const [dest, choicesToSameDest] of byDest) {
          if (choicesToSameDest.length < 2) continue

          const bySignature = new Map<string, ConditionalChoice[]>()
          for (const choice of choicesToSameDest) {
            const sig = computeDuplicateChoiceSignature(choice)
            const existing = bySignature.get(sig) || []
            existing.push(choice)
            bySignature.set(sig, existing)
          }

          for (const dupChoices of bySignature.values()) {
            if (dupChoices.length < 2) continue
            fakeChoiceClusters++
            const choiceTexts = dupChoices
              .map(c => `"${truncateOneLine(c.text, 60)}"`)
              .join(', ')

            this.warnings.push({
              severity: 'warning',
              graph: name,
              nodeId: node.nodeId,
              message: `FAKE CHOICE: ${dupChoices.length} duplicate choices all lead to "${dest}"`,
              suggestion: `Choices: ${choiceTexts}. Dedupe or change conditions/effects if they are meant to differ.`
            })
          }
        }
      }
    }

    // Check start node exists
    if (!nodeMap.has(startNodeId)) {
      this.errors.push({
        severity: 'error',
        graph: name,
        message: `Start node "${startNodeId}" does not exist`,
        suggestion: 'Ensure the startNodeId matches an actual node'
      })
    }

    // Find structurally reachable nodes via BFS.
    //
    // AAA content pipeline reality: many graphs have multiple "entry points" that are
    // connected via system routing (Samuel hub travel, revisit mounts, etc.), not via a
    // single linear start chain. Treat known entry nodes as additional roots so we don't
    // drown authors in false orphan reports.
    const extraRoots: string[] = []
    for (const entryId of KNOWN_ENTRY_NODE_IDS) {
      if (nodeMap.has(entryId)) extraRoots.push(entryId)
    }
    for (const unlockId of PATTERN_UNLOCK_NODE_IDS) {
      if (nodeMap.has(unlockId)) extraRoots.push(unlockId)
    }
    for (const unlockId of SYNTHESIS_UNLOCK_NODE_IDS) {
      if (nodeMap.has(unlockId)) extraRoots.push(unlockId)
    }
    for (const unlockId of SKILL_COMBO_UNLOCK_NODE_IDS) {
      if (nodeMap.has(unlockId)) extraRoots.push(unlockId)
    }
    for (const node of nodeMap.values()) {
      if ((node as any)?.simulation) extraRoots.push(node.nodeId)
    }
    const roots = Array.from(new Set([startNodeId, ...extraRoots]))
    this.findReachableNodes(roots, nodeMap, reachableFromStart)
    const reachableForStats = this.reachableByGraph?.get(name) ?? reachableFromStart

    // Find orphaned nodes
    const orphanedNodes: string[] = []

    for (const nodeId of nodeMap.keys()) {
      if (!reachableForStats.has(nodeId) && nodeId !== startNodeId) {
        // Skip known entry points (reachable from system routing / other graphs)
        if (KNOWN_ENTRY_NODE_IDS.has(nodeId)) continue
        if (PATTERN_UNLOCK_NODE_IDS.has(nodeId)) continue
        if (SYNTHESIS_UNLOCK_NODE_IDS.has(nodeId)) continue
        if (SKILL_COMBO_UNLOCK_NODE_IDS.has(nodeId)) continue
        if ((nodeMap.get(nodeId) as any)?.simulation) continue

        // Check if it's referenced as a target anywhere (including other graphs)
        if (!this.globalIncomingNodeIds.has(nodeId)) {
          orphanedNodes.push(nodeId)
          const severity: ValidationError['severity'] = this.strictOrphans ? 'warning' : 'info'
          const issue: ValidationError = {
            severity,
            graph: name,
            nodeId: nodeId,
            message: `Orphaned node: "${nodeId}" has no incoming references`,
            suggestion: 'This node is never reached. Add a choice pointing to it or remove it.'
          }
          if (severity === 'warning') this.warnings.push(issue)
          else this.infos.push(issue)
        }
      }
    }

    // Calculate stats
    const totalInterrupts = nodes.reduce((sum, n) =>
      sum + (n.content || []).filter(c => c.interrupt).length, 0
    )

    const stats: GraphStats = {
      name,
      totalNodes: nodes.length,
      totalChoices: nodes.reduce((sum, n) => sum + n.choices.length, 0),
      totalInterrupts,
      reachableNodes: reachableForStats.size,
      orphanedNodes: orphanedNodes.length,
      structurallyUnreachableNodes: Math.max(0, nodes.length - reachableForStats.size),
      brokenReferences: this.errors.filter(e => e.graph === name && e.message.includes('points to non-existent')).length,
      maxDepth: this.calculateMaxDepth(roots, nodeMap),
      trustGatedNodes: nodes.filter(n => n.requiredState?.trust).length,
      flagGatedNodes: nodes.filter(n => n.requiredState?.hasGlobalFlags || n.requiredState?.hasKnowledgeFlags).length,
      fakeChoiceClusters,
      patternCounts
    }
    this.stats.push(stats)

    // Warn about pattern imbalance (if any pattern has <10% share)
    const totalPatterns = Object.values(patternCounts).reduce((a, b) => a + b, 0)
    if (totalPatterns >= 10) { // Only check if there are enough patterns to be meaningful
      for (const [pattern, count] of Object.entries(patternCounts)) {
        const share = count / totalPatterns
        if (share < 0.1 && count > 0) {
          const severity: ValidationError['severity'] = this.strictQuality ? 'warning' : 'info'
          const issue: ValidationError = {
            severity,
            graph: name,
            message: `Pattern imbalance: "${pattern}" only has ${(share * 100).toFixed(1)}% of choices (${count}/${totalPatterns})`,
            suggestion: 'Consider adding more choices with this pattern for balance'
          }
          if (severity === 'warning') this.warnings.push(issue)
          else this.infos.push(issue)
        }
      }
    }
  }

  private validateNode(
    graphName: string,
    node: DialogueNode,
    nodeMap: Map<string, DialogueNode>
  ): void {
    // Check required fields
    if (!node.nodeId) {
      this.errors.push({
        severity: 'error',
        graph: graphName,
        message: 'Node missing nodeId',
        suggestion: 'Every node must have a unique nodeId'
      })
      return
    }

    if (!node.speaker) {
      this.warnings.push({
        severity: 'warning',
        graph: graphName,
        nodeId: node.nodeId,
        message: 'Node missing speaker',
        suggestion: 'Add a speaker field (character name or "Narrator")'
      })
    }

    if (!node.content || node.content.length === 0) {
      this.errors.push({
        severity: 'error',
        graph: graphName,
        nodeId: node.nodeId,
        message: 'Node has no content',
        suggestion: 'Add at least one content variation'
      })
    }

    // Validate content variations
    const variationIds = new Set<string>()
    for (const content of node.content || []) {
      if (!content.text) {
        this.errors.push({
          severity: 'error',
          graph: graphName,
          nodeId: node.nodeId,
          message: 'Content variation has empty text',
          suggestion: 'Add text to the content variation'
        })
      }

      if (!content.variation_id) {
        this.warnings.push({
          severity: 'warning',
          graph: graphName,
          nodeId: node.nodeId,
          message: 'Content missing variation_id',
          suggestion: 'Add a unique variation_id for tracking'
        })
      } else if (variationIds.has(content.variation_id)) {
        this.warnings.push({
          severity: 'warning',
          graph: graphName,
          nodeId: node.nodeId,
          message: `Duplicate variation_id: "${content.variation_id}"`,
          suggestion: 'Each variation should have a unique ID'
        })
      }
      variationIds.add(content.variation_id)

      // Validate interrupt windows in content
      if (content.interrupt) {
        const interrupt = content.interrupt

        // Check interrupt targetNodeId exists
        if (!interrupt.targetNodeId) {
          this.errors.push({
            severity: 'error',
            graph: graphName,
            nodeId: node.nodeId,
            message: 'Interrupt missing targetNodeId',
            suggestion: 'Every interrupt must point to a target node'
          })
        } else if (
          !nodeMap.has(interrupt.targetNodeId) &&
          !this.virtualNodeIds.has(interrupt.targetNodeId) &&
          !this.globalNodeIds.has(interrupt.targetNodeId) &&
          !this.isExternalReference(interrupt.targetNodeId)
        ) {
          this.errors.push({
            severity: 'error',
            graph: graphName,
            nodeId: node.nodeId,
            message: `Interrupt points to non-existent node: "${interrupt.targetNodeId}"`,
            suggestion: `Create node "${interrupt.targetNodeId}" or fix the reference`
          })
        }

        // Validate interrupt trust change is within bounds
        const interruptTrustChange = interrupt.consequence?.trustChange
        if (interruptTrustChange !== undefined) {
          if (interruptTrustChange < -2 || interruptTrustChange > 2) {
            const severity: ValidationError['severity'] = this.strictQuality ? 'warning' : 'info'
            const issue: ValidationError = {
              severity,
              graph: graphName,
              nodeId: node.nodeId,
              message: `Interrupt trust change ${interruptTrustChange} is outside recommended range [-2, 2]`,
              suggestion: 'Large trust changes can feel jarring. Consider smaller incremental changes.'
            }
            if (severity === 'warning') this.warnings.push(issue)
            else this.infos.push(issue)
          }
        }

        // Validate interrupt duration
        if (interrupt.duration && (interrupt.duration < 1000 || interrupt.duration > 10000)) {
          const severity: ValidationError['severity'] = this.strictQuality ? 'warning' : 'info'
          const issue: ValidationError = {
            severity,
            graph: graphName,
            nodeId: node.nodeId,
            message: `Interrupt duration ${interrupt.duration}ms is outside recommended range [1000, 10000]`,
            suggestion: 'Duration should give players time to react (2000-4000ms recommended)'
          }
          if (severity === 'warning') this.warnings.push(issue)
          else this.infos.push(issue)
        }
      }
    }

    // Validate choices
    const choiceIds = new Set<string>()
    for (const choice of node.choices) {
      // Check choice ID
      if (!choice.choiceId) {
        this.errors.push({
          severity: 'error',
          graph: graphName,
          nodeId: node.nodeId,
          message: 'Choice missing choiceId',
          suggestion: 'Every choice must have a unique choiceId'
        })
      } else if (choiceIds.has(choice.choiceId)) {
        this.errors.push({
          severity: 'error',
          graph: graphName,
          nodeId: node.nodeId,
          choiceId: choice.choiceId,
          message: `Duplicate choice ID: "${choice.choiceId}"`,
          suggestion: 'Each choice within a node must have a unique ID'
        })
      }
      choiceIds.add(choice.choiceId)

      // Check choice text
      if (!choice.text) {
        this.errors.push({
          severity: 'error',
          graph: graphName,
          nodeId: node.nodeId,
          choiceId: choice.choiceId,
          message: 'Choice has empty text',
          suggestion: 'Add display text for the choice'
        })
      }

      // Check nextNodeId exists (within same graph)
      if (!choice.nextNodeId) {
        this.errors.push({
          severity: 'error',
          graph: graphName,
          nodeId: node.nodeId,
          choiceId: choice.choiceId,
          message: 'Choice missing nextNodeId',
          suggestion: 'Every choice must point to a next node'
        })
      } else if (
        !nodeMap.has(choice.nextNodeId) &&
        !this.virtualNodeIds.has(choice.nextNodeId) &&
        !this.globalNodeIds.has(choice.nextNodeId) &&
        !this.isExternalReference(choice.nextNodeId)
      ) {
        this.errors.push({
          severity: 'error',
          graph: graphName,
          nodeId: node.nodeId,
          choiceId: choice.choiceId,
          message: `Choice points to non-existent node: "${choice.nextNodeId}"`,
          suggestion: `Create node "${choice.nextNodeId}" or fix the reference`
        })
      }

      // Validate pattern
      const validPatterns = ['analytical', 'helping', 'building', 'patience', 'exploring']
      if (choice.pattern && !validPatterns.includes(choice.pattern)) {
        this.warnings.push({
          severity: 'warning',
          graph: graphName,
          nodeId: node.nodeId,
          choiceId: choice.choiceId,
          message: `Invalid pattern: "${choice.pattern}"`,
          suggestion: `Use one of: ${validPatterns.join(', ')}`
        })
      }

      // Check consequence characterId matches graph
      if (choice.consequence?.characterId) {
        const expectedChar = this.getExpectedCharacter(graphName)
        if (expectedChar && choice.consequence.characterId !== expectedChar && choice.consequence.characterId !== 'samuel') {
          this.warnings.push({
            severity: 'warning',
            graph: graphName,
            nodeId: node.nodeId,
            choiceId: choice.choiceId,
            message: `Consequence targets "${choice.consequence.characterId}" but graph is for "${expectedChar}"`,
            suggestion: 'Ensure consequence characterId matches the graph character'
          })
        }
      }

      // Validate trust change is within reasonable bounds [-2, 2]
      const trustChange = choice.consequence?.trustChange
      if (trustChange !== undefined) {
        if (trustChange < -2 || trustChange > 2) {
          const severity: ValidationError['severity'] = this.strictQuality ? 'warning' : 'info'
          const issue: ValidationError = {
            severity,
            graph: graphName,
            nodeId: node.nodeId,
            choiceId: choice.choiceId,
            message: `Trust change ${trustChange} is outside recommended range [-2, 2]`,
            suggestion: 'Large trust changes can feel jarring. Consider smaller incremental changes.'
          }
          if (severity === 'warning') this.warnings.push(issue)
          else this.infos.push(issue)
        }
      }
    }

    // Warn about terminal nodes (no choices and not explicitly terminal)
    const isExperienceBoundary = Boolean(node.metadata?.experienceId)
    const isSessionBoundary = Boolean(node.metadata?.sessionBoundary)
    const isSimulationNode = Boolean(node.simulation)

    if (
      node.choices.length === 0 &&
      !isExperienceBoundary &&
      !isSessionBoundary &&
      !isSimulationNode &&
      !node.tags?.includes('terminal') &&
      !node.tags?.includes('arc_complete')
    ) {
      this.warnings.push({
        severity: 'warning',
        graph: graphName,
        nodeId: node.nodeId,
        message: 'Node has no choices (dead end)',
        suggestion: 'Add choices or mark with "terminal" tag if intentional'
      })
    }
  }

  private isExternalReference(nodeId: string): boolean {
    // Known cross-graph entry points (Samuel references other character arcs)
    const externalPatterns = [
      'maya_', 'devon_', 'jordan_', 'kai_', 'silas_',
      'marcus_', 'tess_', 'rohan_', 'yaquin_', 'alex_',
      'marcus_', 'tess_', 'rohan_', 'yaquin_', 'alex_',
      'samuel_', 'sector_', 'market_', 'grand_', 'deep_', 'wall_', 'trade_'
    ]

    // Check if this is likely a cross-graph reference
    // This is intentionally permissive - we validate cross-graph separately
    return externalPatterns.some(p => nodeId.startsWith(p))
  }

  private getExpectedCharacter(graphName: string): string | null {
    // Graph names match DIALOGUE_GRAPHS keys (e.g. `maya_revisit`), but this function
    // should be resilient to older hyphen naming (e.g. `maya-revisit`).
    const normalized = graphName.replace(/-/g, '_')
    const base = normalized.replace(/_revisit$/, '')

    const known = new Set([
      'samuel',
      'maya',
      'devon',
      'jordan',
      'kai',
      'silas',
      'marcus',
      'tess',
      'rohan',
      'yaquin',
      'alex',
      'grace',
      'elena',
      'zara',
      'asha',
      'lira',
      'quinn',
      'dante',
      'nadia',
      'isaiah',
    ])

    return known.has(base) ? base : null
  }

  private findReachableNodes(
    rootNodeIds: string[],
    nodeMap: Map<string, DialogueNode>,
    reachable: Set<string>
  ): void {
    const queue = [...rootNodeIds]

    while (queue.length > 0) {
      const nodeId = queue.shift()!
      if (reachable.has(nodeId)) continue

      const node = nodeMap.get(nodeId)
      if (!node) continue

      reachable.add(nodeId)

      for (const choice of node.choices) {
        if (nodeMap.has(choice.nextNodeId) && !reachable.has(choice.nextNodeId)) {
          queue.push(choice.nextNodeId)
        }
      }

      // Interrupts are also structural edges.
      for (const content of node.content || []) {
        const interrupt = content.interrupt
        if (interrupt?.targetNodeId && nodeMap.has(interrupt.targetNodeId) && !reachable.has(interrupt.targetNodeId)) {
          queue.push(interrupt.targetNodeId)
        }
        if (interrupt?.missedNodeId && nodeMap.has(interrupt.missedNodeId) && !reachable.has(interrupt.missedNodeId)) {
          queue.push(interrupt.missedNodeId)
        }
      }
    }
  }

  private calculateMaxDepth(
    rootNodeIds: string[],
    nodeMap: Map<string, DialogueNode>,
    maxIterations = 1000
  ): number {
    const visited = new Set<string>()
    let maxDepth = 0
    let iterations = 0

    const dfs = (nodeId: string, depth: number): void => {
      if (iterations++ > maxIterations) return // Prevent infinite loops
      if (visited.has(nodeId)) return

      visited.add(nodeId)
      maxDepth = Math.max(maxDepth, depth)

      const node = nodeMap.get(nodeId)
      if (!node) return

      for (const choice of node.choices) {
        if (nodeMap.has(choice.nextNodeId)) {
          dfs(choice.nextNodeId, depth + 1)
        }
      }

      visited.delete(nodeId) // Allow revisiting for different paths
    }

    for (const rootId of rootNodeIds) {
      dfs(rootId, 0)
    }
    return maxDepth
  }

  private validateCrossGraphReferences(
    graphs: { name: string; nodes: DialogueNode[]; startNodeId: string }[]
  ): void {
    // Build a master map of all node IDs across all graphs
    const allNodeIds = new Set<string>()
    const nodeToGraph = new Map<string, string>()

    for (const graph of graphs) {
      for (const node of graph.nodes) {
        allNodeIds.add(node.nodeId)
        nodeToGraph.set(node.nodeId, graph.name)
      }
    }

    // Check all cross-graph references
    for (const graph of graphs) {
      for (const node of graph.nodes) {
        for (const choice of node.choices) {
          if (!choice.nextNodeId) continue // Already validated in validateNode
          if (this.virtualNodeIds.has(choice.nextNodeId)) continue

          // If the reference is external (not in this graph) but also doesn't exist anywhere
          const existsInThisGraph = graph.nodes.some(n => n.nodeId === choice.nextNodeId)
          const existsAnywhere = allNodeIds.has(choice.nextNodeId)

          if (!existsInThisGraph && !existsAnywhere) {
            // Cross-graph reference that doesn't exist - report as error
            this.errors.push({
              severity: 'error',
              graph: graph.name,
              nodeId: node.nodeId,
              choiceId: choice.choiceId,
              message: `Choice points to non-existent node: "${choice.nextNodeId}"`,
              suggestion: `Create node "${choice.nextNodeId}" in the appropriate graph or fix the reference`
            })
          } else if (!existsInThisGraph && existsAnywhere) {
            // Valid cross-graph reference - just info (no warning needed)
            const targetGraph = nodeToGraph.get(choice.nextNodeId)
            // Cross-graph references are intentional (e.g., Samuel → character introductions)
          }
        }
      }
    }
  }
}

// ============= MAIN EXECUTION =============

function main(): void {
  const args = new Set(process.argv.slice(2))
  const showInfo = args.has('--info') || args.has('--all')
  const showAllWarnings = args.has('--all')
  const strictOrphans = args.has('--strict-orphans')
  const strictQuality = args.has('--strict-quality')

  console.log('\n📊 Dialogue Graph Validator')
  console.log('═'.repeat(50))

  const graphs = Object.entries(DIALOGUE_GRAPHS)
    .map(([name, graph]) => ({
      name,
      nodes: Array.from(graph.nodes.values()),
      startNodeId: graph.startNodeId,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const validator = new DialogueGraphValidator({ strictOrphans, strictQuality })
  const result = validator.validate(graphs)

  // Print stats
  console.log('\n📈 Graph Statistics:')
  console.log('─'.repeat(50))

  let totalNodes = 0
  let totalChoices = 0
  let totalInterrupts = 0

  for (const stat of result.stats) {
    totalNodes += stat.totalNodes
    totalChoices += stat.totalChoices
    totalInterrupts += stat.totalInterrupts

    console.log(`\n${stat.name}:`)
    console.log(`  Nodes: ${stat.totalNodes} (${stat.reachableNodes} reachable)`)
    console.log(`  Choices: ${stat.totalChoices}`)
    if (stat.totalInterrupts > 0) {
      console.log(`  Interrupts: ${stat.totalInterrupts}`)
    }
    console.log(`  Max depth: ${stat.maxDepth}`)
    console.log(`  Trust-gated: ${stat.trustGatedNodes}`)
    console.log(`  Flag-gated: ${stat.flagGatedNodes}`)
    if (stat.orphanedNodes > 0) {
      console.log(`  ⚠️  Orphaned: ${stat.orphanedNodes}`)
    }
    if (stat.structurallyUnreachableNodes > 0) {
      console.log(`  ℹ️  Unreachable (structural): ${stat.structurallyUnreachableNodes}`)
    }
    if (stat.brokenReferences > 0) {
      console.log(`  ❌ Broken refs: ${stat.brokenReferences}`)
    }
    if (stat.fakeChoiceClusters > 0) {
      console.log(`  🎭 Fake choices: ${stat.fakeChoiceClusters} clusters`)
    }
    // Show pattern distribution
    const totalP = Object.values(stat.patternCounts).reduce((a, b) => a + b, 0)
    if (totalP > 0) {
      const dist = Object.entries(stat.patternCounts)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${k.charAt(0).toUpperCase()}:${v}`)
        .join(' ')
      console.log(`  📊 Patterns: ${dist}`)
    }
  }

  console.log('\n' + '─'.repeat(50))
  console.log(`TOTAL: ${totalNodes} nodes, ${totalChoices} choices, ${totalInterrupts} interrupts across ${graphs.length} graphs`)

  // Make the output actionable: show baseline deltas for structural reachability and incoming references.
  // This does not fail validation; CI gates exist as separate regression-only scripts.
  printContentDebtDelta(graphs)

  // Print errors
  if (result.errors.length > 0) {
    console.log('\n❌ ERRORS (' + result.errors.length + '):')
    console.log('─'.repeat(50))
    for (const error of result.errors) {
      console.log(`\n[${error.graph}] ${error.nodeId || ''}${error.choiceId ? `/${error.choiceId}` : ''}`)
      console.log(`  ${error.message}`)
      if (error.suggestion) {
        console.log(`  💡 ${error.suggestion}`)
      }
    }
  }

  // Print warnings (limit to first 20)
  if (result.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (' + result.warnings.length + '):')
    console.log('─'.repeat(50))
    const warningsToShow = showAllWarnings ? result.warnings : result.warnings.slice(0, 20)
    for (const warning of warningsToShow) {
      console.log(`\n[${warning.graph}] ${warning.nodeId || ''}`)
      console.log(`  ${warning.message}`)
      if (warning.suggestion) {
        console.log(`  💡 ${warning.suggestion}`)
      }
    }
    if (!showAllWarnings && result.warnings.length > 20) {
      console.log(`\n... and ${result.warnings.length - 20} more warnings`)
    }
  }

  // Print infos (off by default to reduce noise)
  if (showInfo && result.infos.length > 0) {
    console.log('\nℹ️  INFO (' + result.infos.length + '):')
    console.log('─'.repeat(50))
    const infosToShow = args.has('--all') ? result.infos : result.infos.slice(0, 20)
    for (const info of infosToShow) {
      console.log(`\n[${info.graph}] ${info.nodeId || ''}`)
      console.log(`  ${info.message}`)
      if (info.suggestion) {
        console.log(`  💡 ${info.suggestion}`)
      }
    }
    if (!args.has('--all') && result.infos.length > 20) {
      console.log(`\n... and ${result.infos.length - 20} more info`)
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(50))
  if (result.valid) {
    console.log('✅ VALIDATION PASSED - No errors found')
  } else {
    console.log(`❌ VALIDATION FAILED - ${result.errors.length} error(s) found`)
    process.exit(1)
  }

  if (result.warnings.length > 0) {
    console.log(`⚠️  ${result.warnings.length} warning(s) - review recommended`)
  }
  if (result.infos.length > 0) {
    console.log(`ℹ️  ${result.infos.length} info item(s)`)
  }

  console.log('')
}

main()

type Baseline = {
  generated_at: string
  nodes: Array<{ graphKey: string; nodeId: string }>
}

function toBaselineGraphKey(graphName: string): string {
  // scripts/verify-*-dialogue-nodes.ts use DIALOGUE_GRAPHS keys (`maya_revisit`), while this validator
  // uses human-readable names (`maya-revisit`).
  return graphName.replace(/-/g, '_')
}

function readBaselineJson(p: string): Baseline | null {
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as Baseline
}

function printContentDebtDelta(graphs: { name: string; nodes: DialogueNode[]; startNodeId: string }[]): void {
  // Baselines are snapshots of the raw (draft-inclusive) content debt.
  // When drafts are excluded (default), the delta is not actionable and can be misleading.
  if (process.env.NEXT_PUBLIC_INCLUDE_DRAFT_CONTENT !== 'true') return

  const unrefBaselinePath = path.join(process.cwd(), 'docs/qa/unreferenced-dialogue-nodes-baseline.json')
  const unreachableBaselinePath = path.join(process.cwd(), 'docs/qa/unreachable-dialogue-nodes-baseline.json')

  const unrefBaseline = readBaselineJson(unrefBaselinePath)
  const unreachableBaseline = readBaselineJson(unreachableBaselinePath)

  if (!unrefBaseline && !unreachableBaseline) return

  // Build global incoming reference set (choices + interrupts) across all loaded graphs.
  const globalIncoming = new Set<string>()
  for (const g of graphs) {
    for (const node of g.nodes) {
      for (const choice of node.choices) {
        if (choice.nextNodeId) globalIncoming.add(choice.nextNodeId)
      }
      for (const content of node.content || []) {
        const interrupt = content.interrupt
        if (interrupt?.targetNodeId) globalIncoming.add(interrupt.targetNodeId)
        if (interrupt?.missedNodeId) globalIncoming.add(interrupt.missedNodeId)
      }
    }
  }

  // Compute current unreferenced nodes.
  const currentUnref = new Set<string>()
  for (const g of graphs) {
    const graphKey = toBaselineGraphKey(g.name)
    for (const node of g.nodes) {
      if (node.nodeId === g.startNodeId) continue
      if (KNOWN_ENTRY_NODE_IDS.has(node.nodeId)) continue
      if (PATTERN_UNLOCK_NODE_IDS.has(node.nodeId)) continue
      if ((node as any)?.simulation) continue
      if (!globalIncoming.has(node.nodeId)) {
        currentUnref.add(`${graphKey}/${node.nodeId}`)
      }
    }
  }

  // Compute current unreachable nodes (structural reachability).
  const currentUnreachable = new Set<string>()
  for (const g of graphs) {
    const graphKey = toBaselineGraphKey(g.name)
    const nodeMap = new Map<string, DialogueNode>()
    for (const n of g.nodes) nodeMap.set(n.nodeId, n)

    const roots: string[] = []
    if (nodeMap.has(g.startNodeId)) roots.push(g.startNodeId)
    for (const entryId of KNOWN_ENTRY_NODE_IDS) {
      if (nodeMap.has(entryId)) roots.push(entryId)
    }
    for (const unlockId of PATTERN_UNLOCK_NODE_IDS) {
      if (nodeMap.has(unlockId)) roots.push(unlockId)
    }
    for (const node of nodeMap.values()) {
      if ((node as any)?.simulation) roots.push(node.nodeId)
    }
    const uniqueRoots = Array.from(new Set(roots))

    const reachable = new Set<string>()
    // Reuse the same reachability logic as the validator: choices + interrupts.
    const queue = [...uniqueRoots]
    while (queue.length > 0) {
      const nodeId = queue.shift()!
      if (reachable.has(nodeId)) continue
      const node = nodeMap.get(nodeId)
      if (!node) continue
      reachable.add(nodeId)

      for (const choice of node.choices) {
        if (nodeMap.has(choice.nextNodeId) && !reachable.has(choice.nextNodeId)) {
          queue.push(choice.nextNodeId)
        }
      }
      for (const content of node.content || []) {
        const interrupt = content.interrupt
        if (interrupt?.targetNodeId && nodeMap.has(interrupt.targetNodeId) && !reachable.has(interrupt.targetNodeId)) {
          queue.push(interrupt.targetNodeId)
        }
        if (interrupt?.missedNodeId && nodeMap.has(interrupt.missedNodeId) && !reachable.has(interrupt.missedNodeId)) {
          queue.push(interrupt.missedNodeId)
        }
      }
    }

    for (const nodeId of nodeMap.keys()) {
      if (uniqueRoots.includes(nodeId)) continue
      if (!reachable.has(nodeId)) currentUnreachable.add(`${graphKey}/${nodeId}`)
    }
  }

  console.log('\n📎 Content Debt (Baseline Deltas)')
  console.log('─'.repeat(50))

  if (unrefBaseline) {
    const baselineSet = new Set(unrefBaseline.nodes.map(n => `${n.graphKey}/${n.nodeId}`))
    const newOnes = [...currentUnref].filter(k => !baselineSet.has(k))
    const delta = currentUnref.size - baselineSet.size
    console.log(`Unreferenced nodes: ${currentUnref.size} (baseline ${baselineSet.size}, delta ${delta >= 0 ? '+' : ''}${delta})`)
    if (newOnes.length > 0) {
      console.log(`  New since baseline: ${newOnes.length}`)
      for (const k of newOnes.slice(0, 10)) console.log(`  - ${k}`)
      if (newOnes.length > 10) console.log(`  ... and ${newOnes.length - 10} more`)
    }
  }

  if (unreachableBaseline) {
    const baselineSet = new Set(unreachableBaseline.nodes.map(n => `${n.graphKey}/${n.nodeId}`))
    const newOnes = [...currentUnreachable].filter(k => !baselineSet.has(k))
    const delta = currentUnreachable.size - baselineSet.size
    console.log(`Unreachable nodes:   ${currentUnreachable.size} (baseline ${baselineSet.size}, delta ${delta >= 0 ? '+' : ''}${delta})`)
    if (newOnes.length > 0) {
      console.log(`  New since baseline: ${newOnes.length}`)
      for (const k of newOnes.slice(0, 10)) console.log(`  - ${k}`)
      if (newOnes.length > 10) console.log(`  ... and ${newOnes.length - 10} more`)
    }
  }

  console.log('Run:')
  console.log('  - npm run verify:unreferenced-dialogue-nodes')
  console.log('  - npm run verify:unreachable-dialogue-nodes')
}
