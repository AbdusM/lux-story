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
import { isComboUnlocked } from './pattern-combos'
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
 * Simulation phase (1-3)
 * Phase 1: Introduction - accessible early (trust 0-2)
 * Phase 2: Application - complex scenarios (trust 5+)
 * Phase 3: Mastery - expert challenges (trust 8+)
 */
export type SimulationPhase = 1 | 2 | 3

/**
 * Simulation difficulty tier
 */
export type SimulationDifficulty = 'introduction' | 'application' | 'mastery'

/**
 * Unlock requirements for simulation phases
 */
export interface SimulationUnlockRequirements {
  /** Previous phase variant ID that must be completed */
  previousPhaseCompleted?: string
  /** Minimum trust with character */
  trustMin?: number
  /** Required pattern and minimum level */
  patternRequirement?: {
    pattern: PatternType
    minLevel: number
  }
  /** Required knowledge flags */
  requiredKnowledge?: string[]
  /** Required global flags */
  requiredFlags?: string[]
}

/**
 * Configuration for Workflow Simulations
 * Renders the node as a specialized tool interface rather than standard dialogue.
 */
export interface SimulationConfig {
  type: 'terminal_coding' | 'system_architecture' | 'creative_direction' | 'data_analysis' | 'prompt_engineering' | 'code_refactor' | 'chat_negotiation' | 'dashboard_triage' | 'visual_canvas' | 'audio_studio' | 'news_feed' | 'data_ticker' | 'data_audit' | 'secure_terminal' | 'botany_grid' | 'architect_3d'
  title: string // e.g. "Prompt Refinement Protocol"
  taskDescription: string // e.g. "The model is hallucinating citations. Fix the prompt."

  // The "State" of the simulation before user input
  initialContext: {
    label?: string // e.g. "Current Prompt"
    content?: string // e.g. "Write an essay about colonization."
    displayStyle?: 'code' | 'text' | 'image_placeholder' | 'visual'
    [key: string]: unknown // Allow flexible data for specific engines (items, query, etc)
  }

  // Visual feedback when successful
  successFeedback: string // e.g. "Hallucinations eliminated. Citations verified."

  /**
   * Display Mode (ISP: Handshake Protocol)
   * - 'fullscreen': Replaces the entire dialogue card (Legacy "God Mode")
   * - 'inline': Renders as a widget below the dialogue text ("Handshake Lite")
   * @default 'fullscreen'
   */
  mode?: 'fullscreen' | 'inline'

  /**
   * Tailwind height class for inline mode
   * @default 'h-48'
   */
  inlineHeight?: string

  // === 3-PHASE SYSTEM (all optional for backwards compat) ===

  /**
   * Phase of this simulation (1, 2, or 3)
   * @default 1 - If omitted, treated as Phase 1
   */
  phase?: SimulationPhase

  /**
   * Difficulty tier for UI display
   * @default 'introduction' - If omitted, treated as introduction
   */
  difficulty?: SimulationDifficulty

  /**
   * Unique simulation variant ID for tracking
   * Format: {characterId}_{simType}_phase{N}
   * @example 'maya_servo_debugger_phase1'
   */
  variantId?: string

  /**
   * Unlock requirements for this phase
   * Phase 1: Usually no requirements (or trust >= 2)
   * Phase 2: Requires Phase 1 completion
   * Phase 3: Requires Phase 2 completion + trust >= 8
   */
  unlockRequirements?: SimulationUnlockRequirements

  /**
   * Time limit in seconds (optional)
   * Phase 1: No limit
   * Phase 2: 120s suggested
   * Phase 3: 60s suggested
   */
  timeLimit?: number

  /**
   * Success threshold percentage (0-100)
   * Phase 3 might require 95%+ accuracy vs Phase 1's 75%
   */
  successThreshold?: number
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
   * Voice variations - alternate NPC response text based on player's dominant pattern.
   * Makes NPCs respond differently to WHO the player is becoming.
   * If player has a dominant pattern (>= 5), uses that pattern's text variant.
   *
   * This is the BIDIRECTIONAL reflection system - NPCs see the player's patterns
   * just like player choices adapt to their patterns.
   *
   * @example
   * voiceVariations: {
   *   analytical: "You're looking for the pattern, aren't you?",
   *   helping: "You noticed something was off. Thank you for that.",
   *   patience: "You're not rushing me. That's rare."
   * }
   */
  voiceVariations?: Partial<Record<PatternType, string>>

  /**
   * Skill-reflective NPC responses.
   * When player has demonstrated a skill (>= minLevel), NPC dialogue changes
   * to acknowledge their competence. Makes skills VISIBLE.
   *
   * @example
   * skillReflection: [{
   *   skill: 'emotionalIntelligence',
   *   minLevel: 5,
   *   altText: "You read people well. I can tell.",
   *   altEmotion: 'impressed'
   * }]
   */
  skillReflection?: Array<{
    skill: string
    minLevel: number
    altText: string
    altEmotion?: string
  }>

  /**
   * Nervous system-reflective NPC responses.
   * NPC dialogue varies based on player's current nervous system state.
   * Makes Polyvagal Theory VISIBLE in the narrative.
   *
   * @example
   * nervousSystemReflection: [{
   *   state: 'sympathetic',
   *   altText: "You seem on edge. That's okay. Take your time.",
   *   altEmotion: 'gentle'
   * }]
   */
  nervousSystemReflection?: Array<{
    state: 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal'
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
   * Template archetype hint for automatic voice variation.
   * When set, the template system uses this archetype for pattern-specific text
   * even without explicit voiceVariations. Explicit voiceVariations always win.
   *
   * Available archetypes:
   * - ASK_FOR_DETAILS: Questions asking for more info
   * - STAY_SILENT: Patience-based silence choices
   * - ACKNOWLEDGE_EMOTION: Validating feelings
   * - EXPRESS_CURIOSITY: Showing interest
   * - OFFER_SUPPORT: Offering help
   * - CHALLENGE_ASSUMPTION: Questioning assumptions
   * - SHOW_UNDERSTANDING: Confirming understanding
   * - TAKE_ACTION: Initiating action
   * - REFLECT_BACK: Mirroring what was said
   * - SET_BOUNDARY: Setting limits
   * - MAKE_OBSERVATION: Direct observations
   * - SIMPLE_CONTINUE: Continuation markers
   * - AFFIRM_CHOICE: Committing to something
   * - SHARE_PERSPECTIVE: Sharing viewpoint
   *
   * @example
   * archetype: 'ASK_FOR_DETAILS'
   */
  archetype?: import('./voice-templates/template-types').TemplateArchetype

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
    characterId?: string,
    _skillLevels?: Record<string, number>
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

    // Evaluate mystery conditions
    if (condition.mysteries !== undefined) {
      for (const [mystery, requiredValue] of Object.entries(condition.mysteries)) {
        const currentValue = gameState.mysteries[mystery as keyof typeof gameState.mysteries]
        if (currentValue !== requiredValue) {
          return false
        }
      }
    }

    // Evaluate pattern combo conditions
    // Requires specific pattern combos to be unlocked (from lib/pattern-combos.ts)
    if (condition.requiredCombos !== undefined && condition.requiredCombos.length > 0) {
      for (const comboId of condition.requiredCombos) {
        if (!isComboUnlocked(comboId, gameState.patterns)) {
          return false
        }
      }
    }

    // All conditions passed
    return true
  }

  /**
   * Evaluate all choices for a node and determine visibility/availability
   * INCLUDES AUTO-FALLBACK SAFETY: If no choices visible, shows all as fallback
   *
   * @param skillLevels - Optional skill levels for combo-gated content (from Zustand store)
   */
  static evaluateChoices(
    node: DialogueNode,
    gameState: GameState,
    characterId?: string,
    skillLevels?: Record<string, number>
  ): EvaluatedChoice[] {
    const evaluated = node.choices.map(choice => {
      // Check if choice should be visible
      const visible = this.evaluate(choice.visibleCondition, gameState, characterId, skillLevels)

      // Check if choice should be enabled (only matters if visible)
      const enabled = visible && this.evaluate(choice.enabledCondition, gameState, characterId, skillLevels)

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
      if (StateConditionEvaluator.evaluate(nextNode.requiredState, gameState, characterId, gameState.skillLevels)) {
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
        c.condition && StateConditionEvaluator.evaluate(c.condition, state, this.getCharacterIdFromNode(node), state.skillLevels)
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

// ═══════════════════════════════════════════════════════════════════════════
// SIMULATION ACCESS EVALUATION
// Phase unlock logic for 3-phase simulation system
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result of simulation access evaluation
 */
export interface SimulationAccessResult {
  /** Whether the simulation phase is accessible */
  canAccess: boolean
  /** Reason code for inaccessibility */
  reason?: 'trust_too_low' | 'previous_phase_incomplete' | 'pattern_requirement_not_met' | 'missing_knowledge' | 'missing_flag'
  /** Human-readable explanation */
  message?: string
  /** Progress towards unlock (0-1) */
  progress?: number
}

/**
 * Evaluate whether a player can access a simulation phase
 *
 * @param requirements - Unlock requirements from SimulationConfig
 * @param gameState - Current game state
 * @param characterId - Character ID for trust lookup
 * @returns Access result with reason if blocked
 *
 * @example
 * ```typescript
 * const result = evaluateSimulationAccess(
 *   simulation.unlockRequirements,
 *   gameState,
 *   'maya'
 * )
 * if (!result.canAccess) {
 *   console.log(`Blocked: ${result.message}`)
 * }
 * ```
 */
export function evaluateSimulationAccess(
  requirements: SimulationUnlockRequirements | undefined,
  gameState: GameState,
  characterId: string
): SimulationAccessResult {
  // No requirements = always accessible (Phase 1 default)
  if (!requirements) {
    return { canAccess: true }
  }

  // Check trust minimum
  if (requirements.trustMin !== undefined) {
    const characterState = gameState.characters.get(characterId)
    const currentTrust = characterState?.trust ?? 0
    if (currentTrust < requirements.trustMin) {
      return {
        canAccess: false,
        reason: 'trust_too_low',
        message: `Requires trust level ${requirements.trustMin} (current: ${currentTrust})`,
        progress: currentTrust / requirements.trustMin
      }
    }
  }

  // Check previous phase completion
  if (requirements.previousPhaseCompleted) {
    const completionFlag = requirements.previousPhaseCompleted
    const characterState = gameState.characters.get(characterId)
    const hasFlag = characterState?.knowledgeFlags?.has(completionFlag) ?? false
    if (!hasFlag) {
      return {
        canAccess: false,
        reason: 'previous_phase_incomplete',
        message: `Complete Phase 1 to unlock this phase`,
        progress: 0
      }
    }
  }

  // Check pattern requirement
  if (requirements.patternRequirement) {
    const { pattern, minLevel } = requirements.patternRequirement
    const currentLevel = gameState.patterns[pattern] ?? 0
    if (currentLevel < minLevel) {
      return {
        canAccess: false,
        reason: 'pattern_requirement_not_met',
        message: `Requires ${pattern} pattern level ${minLevel} (current: ${currentLevel})`,
        progress: currentLevel / minLevel
      }
    }
  }

  // Check required knowledge flags
  if (requirements.requiredKnowledge && requirements.requiredKnowledge.length > 0) {
    const characterState = gameState.characters.get(characterId)
    const knowledgeFlags = characterState?.knowledgeFlags ?? new Set<string>()
    const missingKnowledge = requirements.requiredKnowledge.filter(
      flag => !knowledgeFlags.has(flag)
    )
    if (missingKnowledge.length > 0) {
      return {
        canAccess: false,
        reason: 'missing_knowledge',
        message: `Missing required knowledge: ${missingKnowledge.join(', ')}`,
        progress: (requirements.requiredKnowledge.length - missingKnowledge.length) / requirements.requiredKnowledge.length
      }
    }
  }

  // Check required global flags
  if (requirements.requiredFlags && requirements.requiredFlags.length > 0) {
    const globalFlags = gameState.globalFlags ?? new Set<string>()
    const missingFlags = requirements.requiredFlags.filter(
      flag => !globalFlags.has(flag)
    )
    if (missingFlags.length > 0) {
      return {
        canAccess: false,
        reason: 'missing_flag',
        message: `Missing required progress: ${missingFlags.join(', ')}`,
        progress: (requirements.requiredFlags.length - missingFlags.length) / requirements.requiredFlags.length
      }
    }
  }

  // All requirements met
  return { canAccess: true }
}

/**
 * Get all available simulation phases for a character
 * Returns phases the player can currently access
 *
 * @param simulations - Array of SimulationConfig objects for a character
 * @param gameState - Current game state
 * @param characterId - Character ID for trust lookup
 * @returns Array of accessible simulations with their phase info
 */
export function getAvailableSimulationPhases(
  simulations: SimulationConfig[],
  gameState: GameState,
  characterId: string
): Array<{ simulation: SimulationConfig; accessResult: SimulationAccessResult }> {
  return simulations.map(simulation => ({
    simulation,
    accessResult: evaluateSimulationAccess(
      simulation.unlockRequirements,
      gameState,
      characterId
    )
  })).filter(result => result.accessResult.canAccess)
}

/**
 * Get the next locked simulation phase for a character
 * Useful for showing "coming soon" or progress indicators
 *
 * @param simulations - Array of SimulationConfig objects for a character
 * @param gameState - Current game state
 * @param characterId - Character ID for trust lookup
 * @returns The next locked phase with unlock requirements, or null if all unlocked
 */
export function getNextLockedSimulationPhase(
  simulations: SimulationConfig[],
  gameState: GameState,
  characterId: string
): { simulation: SimulationConfig; accessResult: SimulationAccessResult } | null {
  // Sort by phase to get lowest locked phase
  const sortedByPhase = [...simulations].sort((a, b) => (a.phase ?? 1) - (b.phase ?? 1))

  for (const simulation of sortedByPhase) {
    const accessResult = evaluateSimulationAccess(
      simulation.unlockRequirements,
      gameState,
      characterId
    )
    if (!accessResult.canAccess) {
      return { simulation, accessResult }
    }
  }

  return null // All phases unlocked
}