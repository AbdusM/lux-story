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
import { FutureSkills } from './2030-skills-system'
import { PatternType } from './patterns'
// Note: Emotions use string type to support compound emotions like 'anxious_hopeful'
// Use isValidEmotion() from lib/emotions.ts for runtime validation of core emotions

import { calculateGravity, GravityResult } from './narrative-gravity'

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

  // Learning objectives addressed in this node
  learningObjectives?: string[] // IDs of learning objectives covered

  /**
   * Pattern-reflective NPC responses at the node level.
   * When player has a dominant pattern (>= minLevel), NPC's dialogue changes
   * to acknowledge who the player is becoming. Makes the player feel SEEN.
   *
   * This is at the node level so it applies regardless of content variation.
   */
  patternReflection?: Array<{
    pattern: PatternType
    minLevel: number
    altText: string
    altEmotion?: string
  }>

  /**
   * Node metadata for system features
   * sessionBoundary: Marks this node as a natural pause point in the narrative
   * experienceId: Triggers a P6 Loyalty Experience (mini-game)
   */
  metadata?: {
    sessionBoundary?: boolean
    experienceId?: string
  }

  /**
   * Simulation Configuration (ISP: Workflow Simulations)
   * Transforms the node into an interactive mini-game or tool interface.
   * Used for "Golden Prompt" mastery challenges.
   */
  simulation?: SimulationConfig
}

/**
 * Configuration for Workflow Simulations
 * Renders the node as a specialized tool interface rather than standard dialogue.
 */
export interface SimulationConfig {
  type: 'terminal_coding' | 'system_architecture' | 'creative_direction' | 'data_analysis' | 'prompt_engineering' | 'code_refactor' | 'chat_negotiation' | 'dashboard_triage' | 'visual_canvas' | 'audio_studio'
  title: string // e.g. "Prompt Refinement Protocol"
  taskDescription: string // e.g. "The model is hallucinating citations. Fix the prompt."

  // The "State" of the simulation before user input
  initialContext: {
    label: string // e.g. "Current Prompt"
    content: string // e.g. "Write an essay about colonization."
    displayStyle?: 'code' | 'text' | 'image_placeholder'
  }

  // Visual feedback when successful
  successFeedback: string // e.g. "Hallucinations eliminated. Citations verified."
}

/**
 * Content variation for a dialogue node
 * Pre-generated at build time, not runtime
 */
export interface DialogueContent {
  text: string
  emotion?: string // Emotion tag - supports compound emotions like 'anxious_hopeful'
  microAction?: string
  variation_id: string // For tracking which variation was shown
  condition?: StateCondition // ISP: Allows content to be selected based on game state (e.g. hesitation)
  useChatPacing?: boolean // If true, use ChatPacedDialogue component for sequential reveal (use sparingly!)
  richEffectContext?: 'warning' | 'thinking' | 'success' | 'executing' | 'error' | 'glitch' | 'data_stream' // Optional context for rich text effects
  /**
   * Visual interaction animation to apply to this content.
   * One-shot animations that enhance emphasis without looping.
   * Applied to all chunks from this DialogueContent.
   *
   * Options:
   * - 'big': Scale up with fade (emphasis, importance)
   * - 'small': Scale down with fade (subtle, quiet)
   * - 'shake': Horizontal shake (anxiety, uncertainty, distress)
   * - 'nod': Vertical bounce (agreement, confirmation)
   * - 'ripple': Expand from center (impact, realization)
   * - 'bloom': Scale with rotation (revelation, discovery)
   * - 'jitter': Multi-directional micro-movements (nervousness, tension)
   */
  interaction?: 'big' | 'small' | 'shake' | 'nod' | 'ripple' | 'bloom' | 'jitter'

  /**
   * Pattern-reflective NPC responses.
   * When player has a dominant pattern (>= minLevel), NPC's dialogue changes
   * to acknowledge who the player is becoming. Makes the player feel SEEN.
   *
   * @example
   * patternReflection: [{
   *   pattern: 'analytical',
   *   minLevel: 5,
   *   altText: "You think things through, don't you? I can see it in how you frame questions.",
   *   altEmotion: 'knowing'
   * }]
   */
  patternReflection?: Array<{
    pattern: PatternType
    minLevel: number
    altText: string
    altEmotion?: string
  }>

  /**
   * Interrupt Window - ME2-style quick-time event during NPC speech
   *
   * Creates a brief window where player can act during NPC dialogue.
   * If triggered: branch to interrupt node, apply bonus consequence.
   * If missed: continue normally or branch to missedNodeId.
   *
   * @example
   * interrupt: {
   *   duration: 3000,
   *   type: 'connection',
   *   action: 'Reach out and touch her shoulder',
   *   targetNodeId: 'grace_interrupt_comfort',
   *   consequence: { characterId: 'grace', trustChange: 2 }
   * }
   */
  interrupt?: InterruptWindow
}

/**
 * Interrupt Window - A brief opportunity for player agency during NPC speech
 *
 * Inspired by Mass Effect 2's interrupt system. Creates emotional resonance
 * by letting players choose to act in charged moments.
 */
export interface InterruptWindow {
  /** Duration in milliseconds to respond (2000-4000 recommended) */
  duration: number

  /** Type of interrupt, affects visual styling */
  type: 'connection' | 'challenge' | 'silence' | 'comfort' | 'grounding' | 'encouragement'

  /** Visual description of the action (e.g., "Reach out") */
  action: string

  /** Where the interrupt leads if triggered */
  targetNodeId: string

  /** Optional bonus consequence for taking the interrupt */
  consequence?: StateChange

  /** Optional alternative node if interrupt is missed (defaults to continuing normally) */
  missedNodeId?: string
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
  pattern?: PatternType

  // WEF 2030 Skills demonstrated by this choice (for Samuel's personalization)
  skills?: (keyof FutureSkills)[]

  // Learning objective addressed by this specific choice (optional - more granular than node-level)
  learningObjectiveId?: string

  // State changes when this choice is selected
  consequence?: StateChange

  // Preview text shown on hover (optional)
  preview?: string

  /**
   * Voice variations - alternate choice text based on player's dominant pattern.
   * Makes the player's voice consistent with who they're becoming.
   * If player has a dominant pattern (>= 5), uses that pattern's text variant.
   *
   * @example
   * voiceVariations: {
   *   analytical: "Walk me through the details.",
   *   helping: "That sounds hard. What happened?",
   *   patience: "Take your time. I'm listening."
   * }
   */
  voiceVariations?: Partial<Record<PatternType, string>>

  /**
   * Visual interaction animation to apply to this choice button.
   * One-shot animations that enhance emphasis when the choice appears.
   *
   * Options:
   * - 'big': Scale up with fade (important choice, emphasis)
   * - 'small': Scale down with fade (subtle option)
   * - 'shake': Horizontal shake (uncertainty, risk)
   * - 'nod': Vertical bounce (agreement, safe choice)
   * - 'ripple': Expand from center (significant impact)
   * - 'bloom': Scale with rotation (revealing choice)
   * - 'jitter': Multi-directional micro-movements (tension)
   */
  interaction?: 'big' | 'small' | 'shake' | 'nod' | 'ripple' | 'bloom' | 'jitter'

  /**
   * KOTOR-style orb fill requirement.
   * Choice is shown but locked (grayed out) until player's orb fill level meets threshold.
   * This creates aspirational choices that encourage building specific patterns.
   *
   * @example
   * requiredOrbFill: { pattern: 'analytical', threshold: 25 }
   * // Choice appears but is locked until player has 25% analytical orb fill
   */
  requiredOrbFill?: {
    pattern: PatternType
    threshold: number // 0-100 fill percentage required
  }
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
  gravity?: GravityResult // ISP: Narrative Gravity Weight
}

// FloatingModule interface removed - feature disabled for dialogue immersion

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
   * INCLUDES AUTO-FALLBACK SAFETY: If no choices visible, shows all as fallback
   */
  static evaluateChoices(
    node: DialogueNode,
    gameState: GameState,
    characterId?: string
  ): EvaluatedChoice[] {
    const evaluated = node.choices.map(choice => {
      // Check if choice should be visible
      const visible = this.evaluate(choice.visibleCondition, gameState, characterId)

      // Check if choice should be enabled (only matters if visible)
      const enabled = visible && this.evaluate(choice.enabledCondition, gameState, characterId)

      // Generate reason if disabled but visible
      let reason: string | undefined
      if (visible && !enabled) {
        reason = this.generateDisabledReason(choice.enabledCondition, gameState, characterId)
      }

      // ISP UPDATE: Calculate Narrative Gravity
      // The Physics of Emotion (Sympathetic pulls Analytical, etc.)
      const gravity = characterId
        ? calculateGravity(choice.pattern, gameState, characterId)
        : undefined

      return {
        choice,
        visible,
        enabled,
        reason,
        gravity
      }
    })

    // SAFETY NET: If NO choices are visible, show ALL choices as fallbacks
    // This prevents dead ends from misconfigured gating
    const visibleCount = evaluated.filter(c => c.visible).length

    if (visibleCount === 0 && node.choices.length > 0) {
      console.warn(
        `[AUTO-FALLBACK] No visible choices at node "${node.nodeId}". ` +
        `Showing all ${node.choices.length} choices as fallback to prevent deadlock.`
      )

      // Return all choices as visible and enabled
      return node.choices.map(choice => ({
        choice,
        visible: true,
        enabled: true,
        reason: undefined
      }))
    }

    return evaluated
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
  static selectContent(node: DialogueNode, previousVariations?: string[], state?: GameState): DialogueContent {
    if (node.content.length === 0) {
      console.error(`Node ${node.nodeId} has no content`)
      return { text: '[Missing content]', variation_id: 'error' }
    }

    // ISP: Check for conditional content first (e.g. hesitation)
    if (state) {
      // Find FIRST content where condition is met
      // We use finding the first one to allow priority override (assuming content is ordered by priority)
      // or just filtering. Let's find matches.
      const conditionalMatches = node.content.filter(c =>
        c.condition && StateConditionEvaluator.evaluate(c.condition, state, this.getCharacterIdFromNode(node))
      )

      if (conditionalMatches.length > 0) {
        // If multiple matches, pick random or first? 
        // Usually conditional content is specific. Let's pick the first one to allow ordering control in the array.
        return conditionalMatches[0]
      }
    }

    // If only one variation, return it
    if (node.content.length === 1) {
      return node.content[0]
    }

    // Try to pick a variation that hasn't been used recently
    // Filter out conditional content from general rotation to avoid showing specific reactions out of context?
    // Actually, if a content has a condition, it should ONLY be shown if condition matches.
    // So we should filter out content that HAS a condition but wasn't selected above.
    const availableContent = node.content.filter(c => !c.condition)

    if (availableContent.length === 0) {
      // Fallback if all content is conditional but none matched (shouldn't happen with proper design)
      return node.content[0]
    }

    if (previousVariations && previousVariations.length > 0) {
      const unused = availableContent.filter(c => !previousVariations.includes(c.variation_id))
      if (unused.length > 0) {
        return unused[Math.floor(Math.random() * unused.length)]
      }
    }

    // Random selection from available
    return availableContent[Math.floor(Math.random() * availableContent.length)]
  }
}