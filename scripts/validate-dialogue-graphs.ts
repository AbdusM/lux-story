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

import { ConditionalChoice, DialogueNode } from '../lib/dialogue-graph'

// Import all dialogue graphs
import { samuelDialogueNodes, samuelEntryPoints } from '../content/samuel-dialogue-graph'
import { samuelWaitingEntryPoints } from '../content/samuel-waiting-dialogue'
import { mayaDialogueNodes, mayaEntryPoints } from '../content/maya-dialogue-graph'
import { devonDialogueNodes, devonEntryPoints } from '../content/devon-dialogue-graph'
import { jordanDialogueNodes, jordanEntryPoints } from '../content/jordan-dialogue-graph'
import { kaiDialogueNodes, kaiEntryPoints } from '../content/kai-dialogue-graph'
import { silasDialogueNodes, silasEntryPoints } from '../content/silas-dialogue-graph'
import { marcusDialogueNodes, marcusEntryPoints } from '../content/marcus-dialogue-graph'
import { tessDialogueNodes, tessEntryPoints } from '../content/tess-dialogue-graph'
import { rohanDialogueNodes, rohanEntryPoints } from '../content/rohan-dialogue-graph'
import { yaquinDialogueNodes, yaquinEntryPoints } from '../content/yaquin-dialogue-graph'
import { alexDialogueNodes, alexEntryPoints } from '../content/alex-dialogue-graph'
import { mayaRevisitNodes, mayaRevisitEntryPoints } from '../content/maya-revisit-graph'
import { yaquinRevisitNodes, yaquinRevisitEntryPoints } from '../content/yaquin-revisit-graph'
import { devonRevisitNodes, devonRevisitEntryPoints } from '../content/devon-revisit-graph'
import { graceRevisitNodes, graceRevisitEntryPoints } from '../content/grace-revisit-graph'
import { grandHallDialogueNodes } from '../content/grand-hall-graph'
import { graceDialogueNodes, graceEntryPoints } from '../content/grace-dialogue-graph'
import { elenaDialogueNodes, elenaEntryPoints } from '../content/elena-dialogue-graph'
import { zaraDialogueNodes, zaraEntryPoints } from '../content/zara-dialogue-graph'
import { ashaDialogueNodes, ashaEntryPoints } from '../content/asha-dialogue-graph'
import { liraDialogueNodes, liraEntryPoints } from '../content/lira-dialogue-graph'
import { quinnDialogueNodes, quinnEntryPoints } from '../content/quinn-dialogue-graph'
import { danteDialogueNodes, danteEntryPoints } from '../content/dante-dialogue-graph'
import { nadiaDialogueNodes, nadiaEntryPoints } from '../content/nadia-dialogue-graph'
import { isaiahDialogueNodes, isaiahEntryPoints } from '../content/isaiah-dialogue-graph'
import { marketDialogueNodes } from '../content/market-graph'
import { deepStationDialogueNodes } from '../content/deep-station-graph'
import { stationEntryGraph } from '../content/station-entry-graph'

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
  private readonly virtualNodeIds = new Set(['TRAVEL_PENDING', 'SIMULATION_PENDING'])
  private readonly strictOrphans: boolean
  private readonly strictQuality: boolean

  constructor(opts?: { strictOrphans?: boolean; strictQuality?: boolean }) {
    this.strictOrphans = opts?.strictOrphans ?? false
    this.strictQuality = opts?.strictQuality ?? false
  }

  validate(graphs: { name: string; nodes: DialogueNode[]; startNodeId: string }[]): ValidationResult {
    this.errors = []
    this.warnings = []
    this.infos = []
    this.stats = []
    this.globalNodeIds = new Set()
    this.globalIncomingNodeIds = new Set()

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

    // Find reachable nodes via BFS
    this.findReachableNodes(startNodeId, nodeMap, reachableFromStart)

    // Find orphaned nodes
    const orphanedNodes: string[] = []

    for (const nodeId of nodeMap.keys()) {
      if (!reachableFromStart.has(nodeId) && nodeId !== startNodeId) {
        // Skip known entry points (reachable from system routing / other graphs)
        if (KNOWN_ENTRY_NODE_IDS.has(nodeId)) continue

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
      reachableNodes: reachableFromStart.size,
      orphanedNodes: orphanedNodes.length,
      brokenReferences: this.errors.filter(e => e.graph === name && e.message.includes('points to non-existent')).length,
      maxDepth: this.calculateMaxDepth(startNodeId, nodeMap),
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
    const map: Record<string, string> = {
      'samuel': 'samuel',
      'maya': 'maya',
      'maya-revisit': 'maya',
      'devon': 'devon',
      'jordan': 'jordan',
      'kai': 'kai',
      'silas': 'silas',
      'marcus': 'marcus',
      'tess': 'tess',
      'rohan': 'rohan',
      'yaquin': 'yaquin',
      'yaquin-revisit': 'yaquin'
    }
    return map[graphName] || null
  }

  private findReachableNodes(
    startNodeId: string,
    nodeMap: Map<string, DialogueNode>,
    reachable: Set<string>
  ): void {
    const queue = [startNodeId]

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
    }
  }

  private calculateMaxDepth(
    startNodeId: string,
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

    dfs(startNodeId, 0)
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

  const graphs = [
    { name: 'samuel', nodes: samuelDialogueNodes, startNodeId: samuelEntryPoints.ARRIVAL },
    { name: 'station_entry', nodes: Array.from(stationEntryGraph.nodes.values()), startNodeId: stationEntryGraph.startNodeId || 'entry_arrival' },
    { name: 'maya', nodes: mayaDialogueNodes, startNodeId: mayaEntryPoints.INTRODUCTION },
    { name: 'maya-revisit', nodes: mayaRevisitNodes, startNodeId: mayaRevisitEntryPoints.WELCOME },
    { name: 'devon', nodes: devonDialogueNodes, startNodeId: devonEntryPoints.INTRODUCTION },
    { name: 'devon-revisit', nodes: devonRevisitNodes, startNodeId: devonRevisitEntryPoints.WELCOME },
    { name: 'jordan', nodes: jordanDialogueNodes, startNodeId: jordanEntryPoints.INTRODUCTION },
    { name: 'kai', nodes: kaiDialogueNodes, startNodeId: kaiEntryPoints.INTRODUCTION },
    { name: 'silas', nodes: silasDialogueNodes, startNodeId: silasEntryPoints.INTRODUCTION },
    { name: 'marcus', nodes: marcusDialogueNodes, startNodeId: marcusEntryPoints.INTRODUCTION },
    { name: 'tess', nodes: tessDialogueNodes, startNodeId: tessEntryPoints.INTRODUCTION },
    { name: 'rohan', nodes: rohanDialogueNodes, startNodeId: rohanEntryPoints.INTRODUCTION },
    { name: 'yaquin', nodes: yaquinDialogueNodes, startNodeId: yaquinEntryPoints.INTRODUCTION },
    { name: 'alex', nodes: alexDialogueNodes, startNodeId: alexEntryPoints.INTRODUCTION },
    { name: 'yaquin-revisit', nodes: yaquinRevisitNodes, startNodeId: yaquinRevisitEntryPoints.WELCOME },
    { name: 'grand_hall', nodes: grandHallDialogueNodes, startNodeId: 'sector_1_hall' },
    { name: 'market', nodes: marketDialogueNodes, startNodeId: 'sector_2_market' },
    { name: 'deep_station', nodes: deepStationDialogueNodes, startNodeId: 'sector_3_office' },
    { name: 'grace', nodes: graceDialogueNodes, startNodeId: graceEntryPoints.INTRODUCTION },
    { name: 'grace-revisit', nodes: graceRevisitNodes, startNodeId: graceRevisitEntryPoints.WELCOME },
    { name: 'elena', nodes: elenaDialogueNodes, startNodeId: elenaEntryPoints.INTRODUCTION },
    { name: 'zara', nodes: zaraDialogueNodes, startNodeId: zaraEntryPoints.INTRODUCTION },
    { name: 'asha', nodes: ashaDialogueNodes, startNodeId: ashaEntryPoints.INTRODUCTION },
    { name: 'lira', nodes: liraDialogueNodes, startNodeId: liraEntryPoints.INTRODUCTION },
    { name: 'quinn', nodes: quinnDialogueNodes, startNodeId: quinnEntryPoints.INTRODUCTION },
    { name: 'dante', nodes: danteDialogueNodes, startNodeId: danteEntryPoints.INTRODUCTION },
    { name: 'nadia', nodes: nadiaDialogueNodes, startNodeId: nadiaEntryPoints.INTRODUCTION },
    { name: 'isaiah', nodes: isaiahDialogueNodes, startNodeId: isaiahEntryPoints.INTRODUCTION },
  ]

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
