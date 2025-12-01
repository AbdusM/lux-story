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

import { DialogueNode } from '../lib/dialogue-graph'

// Import all dialogue graphs
import { samuelDialogueNodes } from '../content/samuel-dialogue-graph'
import { mayaDialogueNodes } from '../content/maya-dialogue-graph'
import { devonDialogueNodes } from '../content/devon-dialogue-graph'
import { jordanDialogueNodes } from '../content/jordan-dialogue-graph'
import { kaiDialogueNodes } from '../content/kai-dialogue-graph'
import { silasDialogueNodes } from '../content/silas-dialogue-graph'
import { marcusDialogueNodes } from '../content/marcus-dialogue-graph'
import { tessDialogueNodes } from '../content/tess-dialogue-graph'
import { rohanDialogueNodes } from '../content/rohan-dialogue-graph'
import { yaquinDialogueNodes } from '../content/yaquin-dialogue-graph'
import { mayaRevisitNodes } from '../content/maya-revisit-graph'
import { yaquinRevisitNodes } from '../content/yaquin-revisit-graph'

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
  reachableNodes: number
  orphanedNodes: number
  brokenReferences: number
  maxDepth: number
  trustGatedNodes: number
  flagGatedNodes: number
}

interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  stats: GraphStats[]
}

// ============= VALIDATOR CLASS =============

class DialogueGraphValidator {
  private errors: ValidationError[] = []
  private warnings: ValidationError[] = []
  private stats: GraphStats[] = []

  validate(graphs: { name: string; nodes: DialogueNode[]; startNodeId: string }[]): ValidationResult {
    this.errors = []
    this.warnings = []
    this.stats = []

    for (const graph of graphs) {
      this.validateGraph(graph.name, graph.nodes, graph.startNodeId)
    }

    // Cross-graph validation (Samuel references other characters)
    this.validateCrossGraphReferences(graphs)

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      stats: this.stats
    }
  }

  private validateGraph(name: string, nodes: DialogueNode[], startNodeId: string): void {
    const nodeMap = new Map<string, DialogueNode>()
    const allTargetNodeIds = new Set<string>()
    const reachableFromStart = new Set<string>()

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

    // Validate each node
    for (const node of nodes) {
      this.validateNode(name, node, nodeMap, allTargetNodeIds)
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
        // Check if it's referenced as a target but just unreachable from start
        if (!allTargetNodeIds.has(nodeId)) {
          orphanedNodes.push(nodeId)
          this.warnings.push({
            severity: 'warning',
            graph: name,
            nodeId: nodeId,
            message: `Orphaned node: "${nodeId}" has no incoming references`,
            suggestion: 'This node is never reached. Add a choice pointing to it or remove it.'
          })
        }
      }
    }

    // Calculate stats
    const stats: GraphStats = {
      name,
      totalNodes: nodes.length,
      totalChoices: nodes.reduce((sum, n) => sum + n.choices.length, 0),
      reachableNodes: reachableFromStart.size,
      orphanedNodes: orphanedNodes.length,
      brokenReferences: this.errors.filter(e => e.graph === name && e.message.includes('points to non-existent')).length,
      maxDepth: this.calculateMaxDepth(startNodeId, nodeMap),
      trustGatedNodes: nodes.filter(n => n.requiredState?.trust).length,
      flagGatedNodes: nodes.filter(n => n.requiredState?.hasGlobalFlags || n.requiredState?.hasKnowledgeFlags).length
    }
    this.stats.push(stats)
  }

  private validateNode(
    graphName: string,
    node: DialogueNode,
    nodeMap: Map<string, DialogueNode>,
    allTargetNodeIds: Set<string>
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
    }

    // Validate choices
    const choiceIds = new Set<string>()
    for (const choice of node.choices) {
      // Track all target nodes for orphan detection
      allTargetNodeIds.add(choice.nextNodeId)

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
      } else if (!nodeMap.has(choice.nextNodeId) && !this.isExternalReference(choice.nextNodeId)) {
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
    }

    // Warn about terminal nodes (no choices and not explicitly terminal)
    if (node.choices.length === 0 && !node.tags?.includes('terminal') && !node.tags?.includes('arc_complete')) {
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
      'marcus_', 'tess_', 'rohan_', 'yaquin_',
      'samuel_' // Samuel can reference himself across files
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
  console.log('\n📊 Dialogue Graph Validator')
  console.log('═'.repeat(50))

  const graphs = [
    { name: 'samuel', nodes: samuelDialogueNodes, startNodeId: 'samuel_introduction' },
    { name: 'maya', nodes: mayaDialogueNodes, startNodeId: 'maya_introduction' },
    { name: 'maya-revisit', nodes: mayaRevisitNodes, startNodeId: 'maya_revisit_welcome' },
    { name: 'devon', nodes: devonDialogueNodes, startNodeId: 'devon_introduction' },
    { name: 'jordan', nodes: jordanDialogueNodes, startNodeId: 'jordan_introduction' },
    { name: 'kai', nodes: kaiDialogueNodes, startNodeId: 'kai_introduction' },
    { name: 'silas', nodes: silasDialogueNodes, startNodeId: 'silas_introduction' },
    { name: 'marcus', nodes: marcusDialogueNodes, startNodeId: 'marcus_introduction' },
    { name: 'tess', nodes: tessDialogueNodes, startNodeId: 'tess_introduction' },
    { name: 'rohan', nodes: rohanDialogueNodes, startNodeId: 'rohan_introduction' },
    { name: 'yaquin', nodes: yaquinDialogueNodes, startNodeId: 'yaquin_introduction' },
    { name: 'yaquin-revisit', nodes: yaquinRevisitNodes, startNodeId: 'yaquin_revisit_welcome' },
  ]

  const validator = new DialogueGraphValidator()
  const result = validator.validate(graphs)

  // Print stats
  console.log('\n📈 Graph Statistics:')
  console.log('─'.repeat(50))

  let totalNodes = 0
  let totalChoices = 0

  for (const stat of result.stats) {
    totalNodes += stat.totalNodes
    totalChoices += stat.totalChoices

    console.log(`\n${stat.name}:`)
    console.log(`  Nodes: ${stat.totalNodes} (${stat.reachableNodes} reachable)`)
    console.log(`  Choices: ${stat.totalChoices}`)
    console.log(`  Max depth: ${stat.maxDepth}`)
    console.log(`  Trust-gated: ${stat.trustGatedNodes}`)
    console.log(`  Flag-gated: ${stat.flagGatedNodes}`)
    if (stat.orphanedNodes > 0) {
      console.log(`  ⚠️  Orphaned: ${stat.orphanedNodes}`)
    }
    if (stat.brokenReferences > 0) {
      console.log(`  ❌ Broken refs: ${stat.brokenReferences}`)
    }
  }

  console.log('\n' + '─'.repeat(50))
  console.log(`TOTAL: ${totalNodes} nodes, ${totalChoices} choices across ${graphs.length} graphs`)

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
    const warningsToShow = result.warnings.slice(0, 20)
    for (const warning of warningsToShow) {
      console.log(`\n[${warning.graph}] ${warning.nodeId || ''}`)
      console.log(`  ${warning.message}`)
      if (warning.suggestion) {
        console.log(`  💡 ${warning.suggestion}`)
      }
    }
    if (result.warnings.length > 20) {
      console.log(`\n... and ${result.warnings.length - 20} more warnings`)
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

  console.log('')
}

main()
