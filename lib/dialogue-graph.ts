/**
 * Dialogue Graph System
 * The narrative structure that replaces linear scenes
 *
 * CORE PRINCIPLE: Every node is conditional. Access depends on state.
 */

import {
  GameState,
  StateCondition,
  StateChange
} from './character-state'

/**
 * A single dialogue node in the narrative graph
 * Can have multiple content variations for replayability
 */
export interface DialogueNode {
  nodeId: string
  speaker: string // Character speaking or 'Narrator'

  // Multiple pre-generated content variations
  // Selected randomly or by index for variety
  content: DialogueContent[]

  // Conditions required to access this node
  requiredState?: StateCondition

  // Available choices (filtered by conditions)
  choices: ConditionalChoice[]

  // State changes applied when entering this node
  onEnter?: StateChange[]

  // State changes applied when leaving this node
  onExit?: StateChange[]

  // Metadata for content management
  tags?: string[] // e.g., ['maya_arc', 'trust_gate', 'birmingham']
  priority?: number // For sorting when multiple nodes are available
}

/**
 * Content variation for a dialogue node
 * Pre-generated at build time, not runtime
 */
export interface DialogueContent {
  text: string
  emotion?: string // Emotion tag for the dialogue (e.g., 'neutral', 'anxious', 'hopeful', 'vulnerable', etc.)
  variation_id: string // For tracking which variation was shown
}

/**
 * A choice that may or may not be visible
 * Visibility and effects depend on game state
 */
export interface ConditionalChoice {
  choiceId: string
  text: string
  nextNodeId: string // Where this choice leads

  // Condition for showing this choice
  visibleCondition?: StateCondition

  // Condition for enabling this choice (shown but grayed out if false)
  enabledCondition?: StateCondition

  // Pattern this choice represents (for tracking)
  pattern?: 'analytical' | 'helping' | 'building' | 'patience' | 'exploring'

  // WEF 2030 Skills demonstrated by this choice (for Samuel's personalization)
  skills?: Array<
    'critical_thinking' | 'creativity' | 'communication' | 'collaboration' |
    'adaptability' | 'leadership' | 'digital_literacy' | 'emotional_intelligence' |
    'cultural_competence' | 'problem_solving' | 'time_management' | 'financial_literacy'
  >

  // State changes when this choice is selected
  consequence?: StateChange

  // Preview text shown on hover (optional)
  preview?: string
}

/**
 * The complete dialogue graph structure
 * This replaces the old linear scene system
 */
export interface DialogueGraph {
  version: string
  nodes: Map<string, DialogueNode>
  startNodeId: string
  metadata: {
    title: string
    author: string
    createdAt: number
    lastModified: number
    totalNodes: number
    totalChoices: number
  }
}

/**
 * Result of evaluating which choices are available
 */
export interface EvaluatedChoice {
  choice: ConditionalChoice
  visible: boolean
  enabled: boolean
  reason?: string // Why choice is disabled (for debug/tooltips)
}

/**
 * The State Condition Evaluator
 * THIS IS THE MOST CRITICAL COMPONENT - IT MUST BE PERFECT
 * All narrative branching depends on this being bulletproof
 */
export class StateConditionEvaluator {
  /**
   * Evaluate if a condition is met given the current game state
   * Returns true if condition is met, false otherwise
   *
   * CRITICAL: This function must handle ALL edge cases perfectly
   */
  static evaluate(
    condition: StateCondition | undefined,
    gameState: GameState,
    characterId?: string
  ): boolean {
    // No condition means always true
    if (!condition) {
      return true
    }

    // Get character state if needed
    const charState = characterId ? gameState.characters.get(characterId) : undefined

    // Evaluate character-specific conditions
    if (condition.trust !== undefined) {
      if (!charState) {
        console.warn(`Trust condition requires character ${characterId} but not found`)
        return false
      }

      const trust = charState.trust

      if (condition.trust.min !== undefined && trust < condition.trust.min) {
        return false
      }
      if (condition.trust.max !== undefined && trust > condition.trust.max) {
        return false
      }
    }

    // Check relationship status
    if (condition.relationship !== undefined) {
      if (!charState) {
        console.warn(`Relationship condition requires character ${characterId} but not found`)
        return false
      }

      if (!condition.relationship.includes(charState.relationshipStatus)) {
        return false
      }
    }

    // Check knowledge flags (character must know these things)
    if (condition.hasKnowledgeFlags !== undefined) {
      if (!charState) {
        console.warn(`Knowledge condition requires character ${characterId} but not found`)
        return false
      }

      for (const flag of condition.hasKnowledgeFlags) {
        if (!charState.knowledgeFlags.has(flag)) {
          return false
        }
      }
    }

    // Check lacking knowledge flags (character must NOT know these)
    if (condition.lacksKnowledgeFlags !== undefined) {
      if (!charState) {
        console.warn(`Knowledge condition requires character ${characterId} but not found`)
        return false
      }

      for (const flag of condition.lacksKnowledgeFlags) {
        if (charState.knowledgeFlags.has(flag)) {
          return false
        }
      }
    }

    // Evaluate global conditions
    if (condition.hasGlobalFlags !== undefined) {
      for (const flag of condition.hasGlobalFlags) {
        if (!gameState.globalFlags.has(flag)) {
          return false
        }
      }
    }

    if (condition.lacksGlobalFlags !== undefined) {
      for (const flag of condition.lacksGlobalFlags) {
        if (gameState.globalFlags.has(flag)) {
          return false
        }
      }
    }

    // Evaluate pattern conditions
    if (condition.patterns !== undefined) {
      for (const [pattern, range] of Object.entries(condition.patterns)) {
        const value = gameState.patterns[pattern as keyof typeof gameState.patterns]

        if (range) {
          if (range.min !== undefined && value < range.min) {
            return false
          }
          if (range.max !== undefined && value > range.max) {
            return false
          }
        }
      }
    }

    // All conditions passed
    return true
  }

  /**
   * Evaluate all choices for a node and determine visibility/availability
   */
  static evaluateChoices(
    node: DialogueNode,
    gameState: GameState,
    characterId?: string
  ): EvaluatedChoice[] {
    return node.choices.map(choice => {
      // Check if choice should be visible
      const visible = this.evaluate(choice.visibleCondition, gameState, characterId)

      // Check if choice should be enabled (only matters if visible)
      const enabled = visible && this.evaluate(choice.enabledCondition, gameState, characterId)

      // Generate reason if disabled but visible
      let reason: string | undefined
      if (visible && !enabled) {
        reason = this.generateDisabledReason(choice.enabledCondition, gameState, characterId)
      }

      return {
        choice,
        visible,
        enabled,
        reason
      }
    })
  }

  /**
   * Generate human-readable reason why a choice is disabled
   * Used for tooltips/debugging
   */
  private static generateDisabledReason(
    condition: StateCondition | undefined,
    gameState: GameState,
    characterId?: string
  ): string {
    if (!condition) return 'Unknown reason'

    const reasons: string[] = []
    const charState = characterId ? gameState.characters.get(characterId) : undefined

    if (condition.trust?.min !== undefined && charState) {
      if (charState.trust < condition.trust.min) {
        reasons.push(`Need ${condition.trust.min} trust (have ${charState.trust})`)
      }
    }

    if (condition.relationship && charState) {
      if (!condition.relationship.includes(charState.relationshipStatus)) {
        reasons.push(`Need ${condition.relationship.join(' or ')} relationship`)
      }
    }

    if (condition.hasGlobalFlags) {
      for (const flag of condition.hasGlobalFlags) {
        if (!gameState.globalFlags.has(flag)) {
          reasons.push(`Missing requirement: ${flag}`)
        }
      }
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Requirements not met'
  }
}

/**
 * Dialogue Graph Navigator
 * Handles traversal through the graph based on state
 */
export class DialogueGraphNavigator {
  /**
   * Get the next available nodes from current position
   * Filters by state conditions
   */
  static getAvailableNodes(
    graph: DialogueGraph,
    gameState: GameState,
    fromNodeId?: string
  ): DialogueNode[] {
    const availableNodes: DialogueNode[] = []

    // If no starting point, return start node
    if (!fromNodeId) {
      const startNode = graph.nodes.get(graph.startNodeId)
      if (startNode) {
        availableNodes.push(startNode)
      }
      return availableNodes
    }

    // Get current node
    const currentNode = graph.nodes.get(fromNodeId)
    if (!currentNode) {
      console.error(`Node ${fromNodeId} not found in graph`)
      return []
    }

    // Check each choice's destination
    for (const choice of currentNode.choices) {
      const nextNode = graph.nodes.get(choice.nextNodeId)
      if (!nextNode) {
        console.warn(`Choice points to non-existent node: ${choice.nextNodeId}`)
        continue
      }

      // Check if we meet the conditions for this node
      const characterId = this.getCharacterIdFromNode(nextNode)
      if (StateConditionEvaluator.evaluate(nextNode.requiredState, gameState, characterId)) {
        availableNodes.push(nextNode)
      }
    }

    // Sort by priority if specified
    availableNodes.sort((a, b) => (b.priority || 0) - (a.priority || 0))

    return availableNodes
  }

  /**
   * Extract character ID from node speaker
   * e.g., "Maya Chen (Pre-med Student)" -> "maya"
   */
  private static getCharacterIdFromNode(node: DialogueNode): string | undefined {
    const speaker = node.speaker.toLowerCase()
    if (speaker.includes('maya')) return 'maya'
    if (speaker.includes('samuel')) return 'samuel'
    if (speaker.includes('devon')) return 'devon'
    if (speaker.includes('jordan')) return 'jordan'
    return undefined
  }

  /**
   * Select a content variation for a node
   * Can be random or sequential for variety
   */
  static selectContent(node: DialogueNode, previousVariations?: string[]): DialogueContent {
    if (node.content.length === 0) {
      console.error(`Node ${node.nodeId} has no content`)
      return { text: '[Missing content]', variation_id: 'error' }
    }

    // If only one variation, return it
    if (node.content.length === 1) {
      return node.content[0]
    }

    // Try to pick a variation that hasn't been used recently
    if (previousVariations && previousVariations.length > 0) {
      const unused = node.content.filter(c => !previousVariations.includes(c.variation_id))
      if (unused.length > 0) {
        return unused[Math.floor(Math.random() * unused.length)]
      }
    }

    // Random selection
    return node.content[Math.floor(Math.random() * node.content.length)]
  }
}