/**
 * Evaluator Ordering Tests
 *
 * Phase 3B: Validates that consequence echo evaluators in useChoiceHandler
 * are ordered correctly to respect their implicit dependencies.
 *
 * EVALUATOR REGISTRY (23 evaluators in precedence order):
 *
 * Tier 1 - Unconditional Overwrite (can always set echo):
 *   1. trustFeedback         - Base trust change feedback
 *   2. patternEcho           - Pattern threshold crossing
 *   3. orbMilestone          - Orb milestone reached (OVERWRITES)
 *   4. transformation        - Character transformation (OVERWRITES)
 *
 * Tier 2 - First-Match-Wins (only set if !consequenceEcho):
 *   5. storyArcUnlock        - New story arc becomes available
 *   6. chapterComplete       - Story chapter progression
 *   7. synthesisPuzzle       - Puzzle completion/hint
 *   8. infoTradeAvailable    - New info trade unlocked
 *   9. knowledgeDiscovery    - Knowledge item found
 *  10. crossCharacterEcho    - Echo from another character's arc
 *  11. patternRecognition    - Character notices player pattern
 *  12. knowledgeCombination  - Knowledge pieces combine
 *  13. icebergInvestigable   - Iceberg topic becomes investigable
 *  14. patternTrustGate      - Pattern+trust gate unlocked
 *  15. magicalRealism        - High pattern magical effect
 *  16. patternAchievement    - Pattern achievement earned
 *  17. environmentalEffect   - Trust-based environment change
 *  18. crossCharacterExp     - Cross-character experience available
 *  19. cascadeEffect         - Flag cascade triggered
 *  20. metaRevelation        - Meta-narrative revelation
 *  21. delayedGift           - Delayed gift ready to deliver
 *  22. discoveryHint         - Vulnerability foreshadowing
 *  23. trustAsymmetry        - Character notices trust imbalance
 *
 * Dependencies:
 *   - patternEcho depends on trustFeedback (trust affects pattern display)
 *   - orbMilestone depends on patternEcho (checks after pattern processed)
 *   - transformation depends on orbMilestone (trust/pattern state finalized)
 *   - Tier 2 evaluators have no inter-dependencies (all check !consequenceEcho)
 */

import { describe, test, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// Evaluator definitions with explicit dependencies
interface EvaluatorDef {
  id: string
  tier: 1 | 2
  linePattern: RegExp  // Pattern to find this evaluator in the source
  dependencies?: string[]  // Must appear before this evaluator
  description: string
}

const EVALUATOR_REGISTRY: EvaluatorDef[] = [
  // Tier 1 - Unconditional Overwrite
  {
    id: 'trustFeedback',
    tier: 1,
    linePattern: /const trustFeedback = computeTrustFeedback/,
    dependencies: [],
    description: 'Base trust change feedback'
  },
  {
    id: 'patternEcho',
    tier: 1,
    linePattern: /const patternEchoResult = computePatternEcho/,
    dependencies: ['trustFeedback'],
    description: 'Pattern threshold crossing'
  },
  {
    id: 'orbMilestone',
    tier: 1,
    linePattern: /const milestoneResult = computeOrbMilestoneEcho/,
    dependencies: ['patternEcho'],
    description: 'Orb milestone reached (can overwrite)'
  },
  {
    id: 'transformation',
    tier: 1,
    linePattern: /const eligibleTransformation = computeTransformation/,
    dependencies: ['orbMilestone'],
    description: 'Character transformation (can overwrite)'
  },

  // Tier 2 - First-Match-Wins
  {
    id: 'storyArcUnlock',
    tier: 2,
    linePattern: /if \(checkArcUnlock\(arc, newGameState\)\)/,
    dependencies: ['transformation'],
    description: 'New story arc becomes available'
  },
  {
    id: 'chapterComplete',
    tier: 2,
    linePattern: /const \{ newState: updatedArcState, arcCompleted \}/,
    dependencies: ['storyArcUnlock'],
    description: 'Story chapter progression'
  },
  {
    id: 'synthesisPuzzle',
    tier: 2,
    linePattern: /for \(const puzzle of SYNTHESIS_PUZZLES\)/,
    dependencies: ['chapterComplete'],
    description: 'Puzzle completion or hint'
  },
  {
    id: 'infoTradeAvailable',
    tier: 2,
    linePattern: /const availableTrades = getAvailableInfoTrades/,
    dependencies: ['synthesisPuzzle'],
    description: 'New info trade unlocked'
  },
  {
    id: 'knowledgeDiscovery',
    tier: 2,
    linePattern: /const matchingItem = KNOWLEDGE_ITEMS\.find/,
    dependencies: ['infoTradeAvailable'],
    description: 'Knowledge item found'
  },
  {
    id: 'crossCharacterEcho',
    tier: 2,
    linePattern: /const echoQueue = loadEchoQueue\(\)/,
    dependencies: ['knowledgeDiscovery'],
    description: 'Echo from another character arc'
  },
  {
    id: 'patternRecognition',
    tier: 2,
    linePattern: /const patternComments = getPatternRecognitionComments/,
    dependencies: ['crossCharacterEcho'],
    description: 'Character notices player pattern'
  },
  {
    id: 'knowledgeCombination',
    tier: 2,
    linePattern: /const newCombinations = getNewlyAvailableCombinations/,
    dependencies: ['patternRecognition'],
    description: 'Knowledge pieces combine'
  },
  {
    id: 'icebergInvestigable',
    tier: 2,
    linePattern: /const nowInvestigable = getInvestigableTopics/,
    dependencies: ['knowledgeCombination'],
    description: 'Iceberg topic becomes investigable'
  },
  {
    id: 'patternTrustGate',
    tier: 2,
    linePattern: /const nowUnlockedGates = getUnlockedGates/,
    dependencies: ['icebergInvestigable'],
    description: 'Pattern+trust gate unlocked'
  },
  {
    id: 'magicalRealism',
    tier: 2,
    linePattern: /const nowManifestations = getActiveMagicalRealisms/,
    dependencies: ['patternTrustGate'],
    description: 'High pattern magical effect'
  },
  {
    id: 'patternAchievement',
    tier: 2,
    linePattern: /const newAchievements = checkNewAchievements/,
    dependencies: ['magicalRealism'],
    description: 'Pattern achievement earned'
  },
  {
    id: 'environmentalEffect',
    tier: 2,
    linePattern: /const nowEffects = getActiveEnvironmentalEffects/,
    dependencies: ['patternAchievement'],
    description: 'Trust-based environment change'
  },
  {
    id: 'crossCharacterExp',
    tier: 2,
    linePattern: /const nowExperiences = getAvailableCrossCharacterExperiences/,
    dependencies: ['environmentalEffect'],
    description: 'Cross-character experience available'
  },
  {
    id: 'cascadeEffect',
    tier: 2,
    linePattern: /const cascade = getCascadeEffectsForFlag/,
    dependencies: ['crossCharacterExp'],
    description: 'Flag cascade triggered'
  },
  {
    id: 'metaRevelation',
    tier: 2,
    linePattern: /const nowRevelations = getUnlockedMetaRevelations/,
    dependencies: ['cascadeEffect'],
    description: 'Meta-narrative revelation'
  },
  {
    id: 'delayedGift',
    tier: 2,
    linePattern: /const readyGifts = getReadyGiftsForCharacter/,
    dependencies: ['metaRevelation'],
    description: 'Delayed gift ready to deliver'
  },
  {
    id: 'discoveryHint',
    tier: 2,
    linePattern: /const hint = getDiscoveryHint/,
    dependencies: ['delayedGift'],
    description: 'Vulnerability foreshadowing'
  },
  {
    id: 'trustAsymmetry',
    tier: 2,
    linePattern: /const asymmetries = analyzeTrustAsymmetry/,
    dependencies: ['discoveryHint'],
    description: 'Character notices trust imbalance'
  }
]

describe('Evaluator Order Validation', () => {
  const sourceFile = path.join(process.cwd(), 'hooks/game/useChoiceHandler.ts')
  const sourceContent = fs.readFileSync(sourceFile, 'utf-8')

  test('all evaluators exist in source file', () => {
    const missingEvaluators: string[] = []

    for (const evaluator of EVALUATOR_REGISTRY) {
      if (!evaluator.linePattern.test(sourceContent)) {
        missingEvaluators.push(evaluator.id)
      }
    }

    if (missingEvaluators.length > 0) {
      console.log('Missing evaluators:', missingEvaluators)
    }

    expect(missingEvaluators).toHaveLength(0)
  })

  test('evaluator dependencies are satisfied (appear in correct order)', () => {
    // Build a map of evaluator positions in the source
    const positions: Record<string, number> = {}

    for (const evaluator of EVALUATOR_REGISTRY) {
      const match = sourceContent.match(evaluator.linePattern)
      if (match && match.index !== undefined) {
        positions[evaluator.id] = match.index
      }
    }

    // Validate each evaluator's dependencies come before it
    const violations: string[] = []

    for (const evaluator of EVALUATOR_REGISTRY) {
      if (!evaluator.dependencies) continue

      const evalPosition = positions[evaluator.id]
      if (evalPosition === undefined) continue

      for (const dep of evaluator.dependencies) {
        const depPosition = positions[dep]
        if (depPosition === undefined) continue

        if (depPosition > evalPosition) {
          violations.push(`${evaluator.id} (line ~${Math.floor(evalPosition / 50)}) must come after ${dep} (line ~${Math.floor(depPosition / 50)})`)
        }
      }
    }

    if (violations.length > 0) {
      console.log('Dependency violations:', violations)
    }

    expect(violations).toHaveLength(0)
  })

  test('no circular dependencies exist', () => {
    // Build dependency graph
    const graph: Record<string, string[]> = {}
    for (const evaluator of EVALUATOR_REGISTRY) {
      graph[evaluator.id] = evaluator.dependencies || []
    }

    // Detect cycles using DFS
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

  test('tier 1 evaluators come before tier 2', () => {
    const tier1Positions: number[] = []
    const tier2Positions: number[] = []

    for (const evaluator of EVALUATOR_REGISTRY) {
      const match = sourceContent.match(evaluator.linePattern)
      if (match && match.index !== undefined) {
        if (evaluator.tier === 1) {
          tier1Positions.push(match.index)
        } else {
          tier2Positions.push(match.index)
        }
      }
    }

    const maxTier1 = Math.max(...tier1Positions)
    const minTier2 = Math.min(...tier2Positions)

    expect(maxTier1).toBeLessThan(minTier2)
  })

  test('evaluator count matches expected (23)', () => {
    expect(EVALUATOR_REGISTRY.length).toBe(23)
  })
})

// Export registry for documentation/tooling
export { EVALUATOR_REGISTRY }
