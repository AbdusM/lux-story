/**
 * Evaluator Ordering Tests
 *
 * Phase 4B: Validates consequence echo evaluator ordering across two files:
 * - Tier 1 evaluators: inline in useChoiceHandler.ts
 * - Tier 2 evaluators: consolidated in derivative-orchestrator.ts
 *
 * EVALUATOR REGISTRY (24 entries):
 *
 * Tier 1 - Unconditional Overwrite (in useChoiceHandler.ts):
 *   1. trustFeedback         - Base trust change feedback
 *   2. patternEcho           - Pattern threshold crossing
 *   3. orbMilestone          - Orb milestone reached (OVERWRITES)
 *   4. transformation        - Character transformation (OVERWRITES)
 *
 * Tier 2 - Derivative Orchestrator (in derivative-orchestrator.ts):
 *   5. derivativeOrchestrator - Entry point from useChoiceHandler
 *   6-24. Individual processors (order enforced by orchestrator implementation)
 *
 * Dependencies:
 *   - patternEcho depends on trustFeedback (trust affects pattern display)
 *   - orbMilestone depends on patternEcho (checks after pattern processed)
 *   - transformation depends on orbMilestone (trust/pattern state finalized)
 *   - derivativeOrchestrator depends on transformation (Tier 1 must complete)
 *   - Tier 2 internal order enforced by orchestrator code, not position
 */

import { describe, test, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// Evaluator definitions with explicit dependencies
interface EvaluatorDef {
  id: string
  tier: 1 | 2
  linePattern: RegExp  // Pattern to find this evaluator
  searchFile: 'handler' | 'orchestrator' | 'both'  // Which file to search
  dependencies?: string[]  // Must appear before this evaluator (within same file)
  description: string
}

const EVALUATOR_REGISTRY: EvaluatorDef[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // Tier 1 - Unconditional Overwrite (in useChoiceHandler.ts)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'trustFeedback',
    tier: 1,
    linePattern: /const trustFeedback = computeTrustFeedback/,
    searchFile: 'handler',
    dependencies: [],
    description: 'Base trust change feedback'
  },
  {
    id: 'patternEcho',
    tier: 1,
    linePattern: /const patternEchoResult = computePatternEcho/,
    searchFile: 'handler',
    dependencies: ['trustFeedback'],
    description: 'Pattern threshold crossing'
  },
  {
    id: 'orbMilestone',
    tier: 1,
    linePattern: /const milestoneResult = computeOrbMilestoneEcho/,
    searchFile: 'handler',
    dependencies: ['patternEcho'],
    description: 'Orb milestone reached (can overwrite)'
  },
  {
    id: 'transformation',
    tier: 1,
    linePattern: /const eligibleTransformation = computeTransformation/,
    searchFile: 'handler',
    dependencies: ['orbMilestone'],
    description: 'Character transformation (can overwrite)'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Tier 2 - Derivative Processor Orchestrator (in derivative-orchestrator.ts)
  // Phase 4B: All Tier 2 evaluators consolidated into single orchestrator.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'derivativeOrchestrator',
    tier: 2,
    linePattern: /DERIVATIVE PROCESSOR ORCHESTRATOR|runAllDerivativeProcessors\(/,
    searchFile: 'handler',
    dependencies: ['transformation'],  // Must come after Tier 1
    description: 'Derivative processor orchestrator (consolidates Tier 2)'
  },
  // The following entries validate orchestrator internal structure.
  // Order is guaranteed by the orchestrator's sequential execution.
  {
    id: 'storyArcUnlock',
    tier: 2,
    linePattern: /1\. STORY ARC PROGRESSION/,
    searchFile: 'orchestrator',
    dependencies: [],  // First in orchestrator
    description: 'New story arc becomes available'
  },
  {
    id: 'synthesisPuzzle',
    tier: 2,
    linePattern: /2\. SYNTHESIS PUZZLES/,
    searchFile: 'orchestrator',
    dependencies: ['storyArcUnlock'],
    description: 'Puzzle completion or hint'
  },
  {
    id: 'knowledgeDiscovery',
    tier: 2,
    linePattern: /3\. KNOWLEDGE DISCOVERY/,
    searchFile: 'orchestrator',
    dependencies: ['synthesisPuzzle'],
    description: 'Knowledge item found'
  },
  {
    id: 'crossCharacterEcho',
    tier: 2,
    linePattern: /4\. CROSS-CHARACTER ECHOES/,
    searchFile: 'orchestrator',
    dependencies: ['knowledgeDiscovery'],
    description: 'Echo from another character arc'
  },
  {
    id: 'tier2Registry',
    tier: 2,
    linePattern: /5\. TIER 2 EVALUATOR REGISTRY/,
    searchFile: 'orchestrator',
    dependencies: ['crossCharacterEcho'],
    description: 'Pattern recognition, knowledge combination, etc.'
  },
  {
    id: 'icebergReferences',
    tier: 2,
    linePattern: /6\. ICEBERG REFERENCES/,
    searchFile: 'orchestrator',
    dependencies: ['tier2Registry'],
    description: 'Iceberg topic tracking'
  },
  {
    id: 'delayedGifts',
    tier: 2,
    linePattern: /7\. DELAYED GIFTS/,
    searchFile: 'orchestrator',
    dependencies: ['icebergReferences'],
    description: 'Delayed gift ready to deliver'
  },
  {
    id: 'arcCompletion',
    tier: 2,
    linePattern: /8\. ARC COMPLETION/,
    searchFile: 'orchestrator',
    dependencies: ['delayedGifts'],
    description: 'Arc completion rewards'
  }
]

describe('Evaluator Order Validation', () => {
  const handlerFile = path.join(process.cwd(), 'hooks/game/useChoiceHandler.ts')
  const handlerContent = fs.readFileSync(handlerFile, 'utf-8')

  const orchestratorFile = path.join(process.cwd(), 'lib/choice-processors/derivative-orchestrator.ts')
  const orchestratorContent = fs.readFileSync(orchestratorFile, 'utf-8')

  const getContent = (searchFile: 'handler' | 'orchestrator' | 'both') => {
    if (searchFile === 'handler') return handlerContent
    if (searchFile === 'orchestrator') return orchestratorContent
    return handlerContent + orchestratorContent
  }

  test('all evaluators exist in their designated files', () => {
    const missingEvaluators: string[] = []

    for (const evaluator of EVALUATOR_REGISTRY) {
      const content = getContent(evaluator.searchFile)
      if (!evaluator.linePattern.test(content)) {
        missingEvaluators.push(`${evaluator.id} (in ${evaluator.searchFile})`)
      }
    }

    if (missingEvaluators.length > 0) {
      console.log('Missing evaluators:', missingEvaluators)
    }

    expect(missingEvaluators).toHaveLength(0)
  })

  test('Tier 1 evaluators are in correct order in useChoiceHandler', () => {
    const tier1Evaluators = EVALUATOR_REGISTRY.filter(e => e.tier === 1)
    const positions: Record<string, number> = {}

    for (const evaluator of tier1Evaluators) {
      const match = handlerContent.match(evaluator.linePattern)
      if (match && match.index !== undefined) {
        positions[evaluator.id] = match.index
      }
    }

    const violations: string[] = []
    for (const evaluator of tier1Evaluators) {
      if (!evaluator.dependencies) continue
      const evalPosition = positions[evaluator.id]
      if (evalPosition === undefined) continue

      for (const dep of evaluator.dependencies) {
        const depPosition = positions[dep]
        if (depPosition === undefined) continue
        if (depPosition > evalPosition) {
          violations.push(`${evaluator.id} must come after ${dep}`)
        }
      }
    }

    if (violations.length > 0) {
      console.log('Tier 1 dependency violations:', violations)
    }
    expect(violations).toHaveLength(0)
  })

  test('orchestrator is called after Tier 1 evaluators in useChoiceHandler', () => {
    const tier1Positions: number[] = []
    for (const evaluator of EVALUATOR_REGISTRY.filter(e => e.tier === 1)) {
      const match = handlerContent.match(evaluator.linePattern)
      if (match && match.index !== undefined) {
        tier1Positions.push(match.index)
      }
    }

    const orchestratorEntry = EVALUATOR_REGISTRY.find(e => e.id === 'derivativeOrchestrator')!
    const orchestratorMatch = handlerContent.match(orchestratorEntry.linePattern)
    const orchestratorPosition = orchestratorMatch?.index ?? -1

    const maxTier1 = Math.max(...tier1Positions)
    expect(orchestratorPosition).toBeGreaterThan(maxTier1)
  })

  test('orchestrator processors are in correct order', () => {
    const orchestratorEvaluators = EVALUATOR_REGISTRY.filter(
      e => e.tier === 2 && e.searchFile === 'orchestrator'
    )
    const positions: Record<string, number> = {}

    for (const evaluator of orchestratorEvaluators) {
      const match = orchestratorContent.match(evaluator.linePattern)
      if (match && match.index !== undefined) {
        positions[evaluator.id] = match.index
      }
    }

    const violations: string[] = []
    for (const evaluator of orchestratorEvaluators) {
      if (!evaluator.dependencies || evaluator.dependencies.length === 0) continue
      const evalPosition = positions[evaluator.id]
      if (evalPosition === undefined) continue

      for (const dep of evaluator.dependencies) {
        const depPosition = positions[dep]
        if (depPosition === undefined) continue
        if (depPosition > evalPosition) {
          violations.push(`${evaluator.id} must come after ${dep}`)
        }
      }
    }

    if (violations.length > 0) {
      console.log('Orchestrator dependency violations:', violations)
    }
    expect(violations).toHaveLength(0)
  })

  test('no circular dependencies exist', () => {
    const graph: Record<string, string[]> = {}
    for (const evaluator of EVALUATOR_REGISTRY) {
      graph[evaluator.id] = evaluator.dependencies || []
    }

    const visited = new Set<string>()
    const recStack = new Set<string>()
    const cycles: string[] = []

    function hasCycle(node: string, path: string[]): boolean {
      if (recStack.has(node)) {
        cycles.push([...path, node].join(' -> '))
        return true
      }
      if (visited.has(node)) return false

      visited.add(node)
      recStack.add(node)

      for (const dep of graph[node] || []) {
        if (hasCycle(dep, [...path, node])) return true
      }

      recStack.delete(node)
      return false
    }

    for (const evaluator of EVALUATOR_REGISTRY) {
      if (!visited.has(evaluator.id)) {
        hasCycle(evaluator.id, [])
      }
    }

    if (cycles.length > 0) {
      console.log('Circular dependencies detected:', cycles)
    }

    expect(cycles).toHaveLength(0)
  })

  test('evaluator count matches expected (13)', () => {
    // 4 Tier 1 + 1 orchestrator entry + 8 orchestrator processors = 13
    expect(EVALUATOR_REGISTRY.length).toBe(13)
  })
})

// Export registry for documentation/tooling
export { EVALUATOR_REGISTRY }
