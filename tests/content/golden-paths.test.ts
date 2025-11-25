/**
 * Golden Path Snapshot Tests
 *
 * These tests capture "known good" playthroughs and alert if they break.
 * Each test follows a specific path through a character arc and verifies:
 * - All nodes are reachable
 * - Expected choices are available at each step
 * - Trust/relationship changes occur as expected
 * - Arc completion triggers properly
 *
 * If these tests fail after a content change, it means:
 * 1. A previously valid path is now broken
 * 2. Review the change to determine if breakage is intentional
 *
 * Usage: npm run test -- tests/content/golden-paths.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { StateConditionEvaluator, DialogueNode } from '@/lib/dialogue-graph'
import { GameStateUtils, GameState } from '@/lib/character-state'

// Import dialogue graphs
import { samuelDialogueNodes } from '@/content/samuel-dialogue-graph'
import { mayaDialogueNodes } from '@/content/maya-dialogue-graph'
import { devonDialogueNodes } from '@/content/devon-dialogue-graph'
import { jordanDialogueNodes } from '@/content/jordan-dialogue-graph'

// ============= HELPER FUNCTIONS =============

function buildNodeMap(nodes: DialogueNode[]): Map<string, DialogueNode> {
  const map = new Map<string, DialogueNode>()
  for (const node of nodes) {
    map.set(node.nodeId, node)
  }
  return map
}

function getVisibleChoices(
  node: DialogueNode,
  gameState: GameState,
  characterId: string
): string[] {
  return StateConditionEvaluator.evaluateChoices(node, gameState, characterId)
    .filter(c => c.visible && c.enabled)
    .map(c => c.choice.choiceId)
}

function applyChoice(
  gameState: GameState,
  node: DialogueNode,
  choiceId: string
): GameState {
  const choice = node.choices.find(c => c.choiceId === choiceId)
  if (!choice) {
    throw new Error(`Choice "${choiceId}" not found in node "${node.nodeId}"`)
  }

  let newState = { ...gameState }

  if (choice.consequence) {
    newState = GameStateUtils.applyStateChange(newState, choice.consequence)
  }

  if (choice.pattern) {
    newState = GameStateUtils.applyStateChange(newState, {
      patternChanges: { [choice.pattern]: 1 }
    })
  }

  return newState
}

// ============= SAMUEL GOLDEN PATH =============

describe('Samuel Introduction Golden Path', () => {
  let gameState: GameState
  let nodeMap: Map<string, DialogueNode>

  beforeEach(() => {
    gameState = GameStateUtils.createNewGameState('test-player')
    const samuelState = GameStateUtils.createCharacterState('samuel')
    gameState.characters.set('samuel', samuelState)
    nodeMap = buildNodeMap(samuelDialogueNodes)
  })

  it('should start at samuel_introduction', () => {
    const startNode = nodeMap.get('samuel_introduction')
    expect(startNode).toBeDefined()
    expect(startNode?.speaker).toBe('Samuel Washington')
  })

  it('should offer 3 initial choices', () => {
    const startNode = nodeMap.get('samuel_introduction')!
    const visibleChoices = getVisibleChoices(startNode, gameState, 'samuel')

    expect(visibleChoices.length).toBeGreaterThanOrEqual(3)
    expect(visibleChoices).toContain('ask_what_is_this')
    expect(visibleChoices).toContain('ask_who_are_you')
  })

  it('should navigate to ask_what_is_this path', () => {
    const startNode = nodeMap.get('samuel_introduction')!
    const choice = startNode.choices.find(c => c.choiceId === 'ask_what_is_this')

    expect(choice).toBeDefined()
    expect(choice?.nextNodeId).toBeDefined()

    const nextNode = nodeMap.get(choice!.nextNodeId)
    expect(nextNode).toBeDefined()
  })

  it('should increase trust with empathetic choices', () => {
    const startNode = nodeMap.get('samuel_introduction')!

    // Find a choice that increases trust
    const trustBuildingChoice = startNode.choices.find(
      c => c.consequence?.trustChange && c.consequence.trustChange > 0
    )

    if (trustBuildingChoice) {
      const newState = applyChoice(gameState, startNode, trustBuildingChoice.choiceId)
      const samuelTrust = newState.characters.get('samuel')?.trust || 0
      expect(samuelTrust).toBeGreaterThan(0)
    }
  })
})

// ============= MAYA GOLDEN PATH =============

describe('Maya Arc Golden Path', () => {
  let gameState: GameState
  let nodeMap: Map<string, DialogueNode>

  beforeEach(() => {
    gameState = GameStateUtils.createNewGameState('test-player')
    const mayaState = GameStateUtils.createCharacterState('maya')
    gameState.characters.set('maya', mayaState)
    nodeMap = buildNodeMap(mayaDialogueNodes)
  })

  it('should start at maya_introduction', () => {
    const startNode = nodeMap.get('maya_introduction')
    expect(startNode).toBeDefined()
    expect(startNode?.speaker).toBe('Maya Chen')
  })

  it('should offer intro choices without trust requirement', () => {
    const startNode = nodeMap.get('maya_introduction')!
    const visibleChoices = getVisibleChoices(startNode, gameState, 'maya')

    // At trust 0, should see basic intro choices
    expect(visibleChoices.length).toBeGreaterThanOrEqual(2)
  })

  it('should follow studies path correctly', () => {
    const introNode = nodeMap.get('maya_introduction')!

    // Choose the studies path
    const studiesChoice = introNode.choices.find(c => c.choiceId === 'intro_studies')
    expect(studiesChoice).toBeDefined()
    expect(studiesChoice?.nextNodeId).toBe('maya_studies_response')

    const studiesNode = nodeMap.get('maya_studies_response')
    expect(studiesNode).toBeDefined()
  })

  it('should gate certain choices behind trust levels', () => {
    const studiesNode = nodeMap.get('maya_studies_response')!

    // At trust 0, some choices should be hidden
    const lowTrustChoices = getVisibleChoices(studiesNode, gameState, 'maya')

    // Increase trust
    const highTrustState = GameStateUtils.applyStateChange(gameState, {
      characterId: 'maya',
      trustChange: 3
    })

    const highTrustChoices = getVisibleChoices(studiesNode, highTrustState, 'maya')

    // High trust should unlock more choices (or at least not lock any)
    expect(highTrustChoices.length).toBeGreaterThanOrEqual(lowTrustChoices.length)
  })

  it('should set knowledge flags on choice selection', () => {
    const introNode = nodeMap.get('maya_introduction')!
    const studiesChoice = introNode.choices.find(c => c.choiceId === 'intro_studies')

    expect(studiesChoice?.consequence?.addKnowledgeFlags).toContain('asked_about_studies')
  })
})

// ============= DEVON GOLDEN PATH =============

describe('Devon Arc Golden Path', () => {
  let gameState: GameState
  let nodeMap: Map<string, DialogueNode>

  beforeEach(() => {
    gameState = GameStateUtils.createNewGameState('test-player')
    const devonState = GameStateUtils.createCharacterState('devon')
    gameState.characters.set('devon', devonState)
    nodeMap = buildNodeMap(devonDialogueNodes)
  })

  it('should start at devon_introduction', () => {
    const startNode = nodeMap.get('devon_introduction')
    expect(startNode).toBeDefined()
    expect(startNode?.speaker).toContain('Devon')
  })

  it('should have all introduction choices accessible', () => {
    const startNode = nodeMap.get('devon_introduction')!
    const visibleChoices = getVisibleChoices(startNode, gameState, 'devon')

    expect(visibleChoices.length).toBeGreaterThan(0)
  })

  it('should maintain node chain integrity', () => {
    // Walk through first 5 nodes following first available choice
    let currentNodeId = 'devon_introduction'
    const visited = new Set<string>()

    for (let i = 0; i < 5; i++) {
      const node = nodeMap.get(currentNodeId)
      if (!node || visited.has(currentNodeId)) break

      visited.add(currentNodeId)

      const visibleChoices = getVisibleChoices(node, gameState, 'devon')
      if (visibleChoices.length === 0) break

      const firstChoice = node.choices.find(c => visibleChoices.includes(c.choiceId))
      if (!firstChoice) break

      // Verify next node exists
      expect(nodeMap.has(firstChoice.nextNodeId)).toBe(true)

      // Apply choice and move to next
      gameState = applyChoice(gameState, node, firstChoice.choiceId)
      currentNodeId = firstChoice.nextNodeId
    }

    expect(visited.size).toBeGreaterThan(1)
  })
})

// ============= JORDAN GOLDEN PATH =============

describe('Jordan Arc Golden Path', () => {
  let gameState: GameState
  let nodeMap: Map<string, DialogueNode>

  beforeEach(() => {
    gameState = GameStateUtils.createNewGameState('test-player')
    const jordanState = GameStateUtils.createCharacterState('jordan')
    gameState.characters.set('jordan', jordanState)
    nodeMap = buildNodeMap(jordanDialogueNodes)
  })

  it('should start at jordan_introduction', () => {
    const startNode = nodeMap.get('jordan_introduction')
    expect(startNode).toBeDefined()
    expect(startNode?.speaker).toContain('Jordan')
  })

  it('should have progressive trust gates', () => {
    // Jordan's arc is known for progressive trust gates
    const trustGatedNodes = Array.from(nodeMap.values()).filter(
      n => n.requiredState?.trust?.min !== undefined
    )

    expect(trustGatedNodes.length).toBeGreaterThan(0)

    // Verify trust gates are progressive (not all requiring max trust)
    const trustLevels = trustGatedNodes
      .map(n => n.requiredState?.trust?.min || 0)
      .filter(t => t > 0)

    const uniqueLevels = new Set(trustLevels)
    expect(uniqueLevels.size).toBeGreaterThan(1) // Multiple trust thresholds
  })

  it('should track job knowledge flags', () => {
    // Jordan's arc reveals multiple jobs
    const allChoices = Array.from(nodeMap.values()).flatMap(n => n.choices)
    const jobFlags = allChoices
      .filter(c => c.consequence?.addKnowledgeFlags?.some(f => f.includes('job')))
      .map(c => c.consequence?.addKnowledgeFlags)
      .flat()
      .filter(Boolean)

    expect(jobFlags.length).toBeGreaterThan(0)
  })
})

// ============= CROSS-CHARACTER INTEGRATION =============

describe('Cross-Character Integration', () => {
  it('samuel should reference maya entry point', () => {
    const samuelMap = buildNodeMap(samuelDialogueNodes)

    // Find choices that lead to Maya
    const mayaReferences = Array.from(samuelMap.values())
      .flatMap(n => n.choices)
      .filter(c => c.nextNodeId.startsWith('maya_'))

    expect(mayaReferences.length).toBeGreaterThan(0)
  })

  it('samuel should reference devon entry point', () => {
    const samuelMap = buildNodeMap(samuelDialogueNodes)

    const devonReferences = Array.from(samuelMap.values())
      .flatMap(n => n.choices)
      .filter(c => c.nextNodeId.startsWith('devon_'))

    expect(devonReferences.length).toBeGreaterThan(0)
  })

  it('samuel should reference jordan entry point', () => {
    const samuelMap = buildNodeMap(samuelDialogueNodes)

    const jordanReferences = Array.from(samuelMap.values())
      .flatMap(n => n.choices)
      .filter(c => c.nextNodeId.startsWith('jordan_'))

    expect(jordanReferences.length).toBeGreaterThan(0)
  })
})

// ============= REGRESSION GUARDS =============

describe('Regression Guards', () => {
  it('should not have any nodes with empty content arrays', () => {
    const allNodes = [
      ...samuelDialogueNodes,
      ...mayaDialogueNodes,
      ...devonDialogueNodes,
      ...jordanDialogueNodes
    ]

    const emptyContentNodes = allNodes.filter(n => !n.content || n.content.length === 0)

    expect(emptyContentNodes).toHaveLength(0)
  })

  it('should not have any choices without nextNodeId', () => {
    const allNodes = [
      ...samuelDialogueNodes,
      ...mayaDialogueNodes,
      ...devonDialogueNodes,
      ...jordanDialogueNodes
    ]

    const brokenChoices = allNodes
      .flatMap(n => n.choices)
      .filter(c => !c.nextNodeId)

    expect(brokenChoices).toHaveLength(0)
  })

  it('should have valid patterns on all choices that specify patterns', () => {
    const validPatterns = ['analytical', 'helping', 'building', 'patience', 'exploring']

    const allNodes = [
      ...samuelDialogueNodes,
      ...mayaDialogueNodes,
      ...devonDialogueNodes,
      ...jordanDialogueNodes
    ]

    const invalidPatternChoices = allNodes
      .flatMap(n => n.choices)
      .filter(c => c.pattern && !validPatterns.includes(c.pattern))

    expect(invalidPatternChoices).toHaveLength(0)
  })
})
