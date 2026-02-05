/**
 * Pattern System Derivatives
 * Feature IDs: D-001, D-002, D-004, D-007, D-040, D-059, D-096
 *
 * This module extends the core pattern system with advanced mechanics:
 * - Trust decay influenced by patterns
 * - Pattern-gated content requirements
 * - Cross-character pattern recognition
 * - Choice pattern previews
 * - Pattern evolution tracking
 * - Achievement system
 * - Pattern voice conflicts
 */

import { PatternType, PATTERN_TYPES, PATTERN_THRESHOLDS, PATTERN_METADATA, getPatternColor, getDominantPattern } from './patterns'
import { PlayerPatterns } from './character-state'
import { } from './constants'

// ═══════════════════════════════════════════════════════════════════════════
// D-001: PATTERN-INFLUENCED TRUST DECAY RATES
// Patience = slower decay, Exploring = faster decay
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base trust decay rate (points per session of absence)
 */
export const BASE_TRUST_DECAY_RATE = 0.5

/**
 * Pattern influence on trust decay
 * Values are multipliers: <1 = slower decay, >1 = faster decay
 */
export const PATTERN_DECAY_MODIFIERS: Record<PatternType, number> = {
  patience: 0.5,    // -50% decay - patient players maintain relationships better
  helping: 0.7,     // -30% decay - helpful players stay connected
  analytical: 1.0,  // No modifier - neutral
  building: 1.0,    // No modifier - neutral
  exploring: 1.3    // +30% decay - explorers spread thin, relationships fade faster
}

/**
 * Calculate trust decay rate based on player's dominant pattern
 */
export function calculateTrustDecayRate(
  patterns: PlayerPatterns,
  baseRate: number = BASE_TRUST_DECAY_RATE
): number {
  // Use threshold 3 for early pattern detection
  const dominantPattern = getDominantPattern(patterns, 3)
  if (!dominantPattern) return baseRate

  const modifier = PATTERN_DECAY_MODIFIERS[dominantPattern]
  return baseRate * modifier
}

/**
 * Calculate trust decay for a specific character
 * @param sessionsAbsent Number of sessions since last interaction
 * @param patterns Player's pattern scores
 * @returns Trust points to decay
 */
export function calculateCharacterTrustDecay(
  sessionsAbsent: number,
  patterns: PlayerPatterns
): number {
  const decayRate = calculateTrustDecayRate(patterns)
  return Math.floor(sessionsAbsent * decayRate)
}

// ═══════════════════════════════════════════════════════════════════════════
// D-002: PATTERN-GATED TRUST CONTENT
// Some content requires BOTH Trust 8+ AND specific pattern 6+
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dual-gate requirement for special content
 */
export interface PatternTrustGate {
  trustMin: number
  pattern: PatternType
  patternMin: number
  description: string  // What this gate unlocks
}

/**
 * Predefined content gates for special character moments
 */
export const PATTERN_TRUST_GATES: Record<string, PatternTrustGate> = {
  // Maya's secret workshop - needs trust AND building pattern
  maya_secret_workshop: {
    trustMin: 8,
    pattern: 'building',
    patternMin: 6,
    description: 'Maya invites you to her hidden workshop where she builds her real projects'
  },

  // Samuel's true history - needs trust AND patience pattern
  samuel_true_past: {
    trustMin: 8,
    pattern: 'patience',
    patternMin: 6,
    description: 'Samuel reveals what he was before the station'
  },

  // Devon's vulnerability - needs trust AND analytical pattern
  devon_core_fear: {
    trustMin: 8,
    pattern: 'analytical',
    patternMin: 6,
    description: 'Devon confesses his fear of becoming what he builds'
  },

  // Marcus's moral dilemma - needs trust AND helping pattern
  marcus_impossible_choice: {
    trustMin: 8,
    pattern: 'helping',
    patternMin: 6,
    description: 'Marcus shares the patient he couldn\'t save'
  },

  // Rohan's hidden truth - needs trust AND exploring pattern
  rohan_conspiracy: {
    trustMin: 8,
    pattern: 'exploring',
    patternMin: 6,
    description: 'Rohan shows you what he\'s really been investigating'
  },

  // Tess's demo tape - needs trust AND building pattern
  tess_lost_album: {
    trustMin: 8,
    pattern: 'building',
    patternMin: 6,
    description: 'Tess plays you the album she never released'
  },

  // Kai's prevention story - needs trust AND building pattern
  kai_the_one_saved: {
    trustMin: 8,
    pattern: 'building',
    patternMin: 6,
    description: 'Kai tells you about the disaster they prevented'
  },

  // Yaquin's father - needs trust AND patience pattern
  yaquin_father_letter: {
    trustMin: 8,
    pattern: 'patience',
    patternMin: 6,
    description: 'Yaquin shows you the letter from her father'
  },

  // Jordan's crossroads - needs trust AND exploring pattern
  jordan_the_road_not_taken: {
    trustMin: 8,
    pattern: 'exploring',
    patternMin: 6,
    description: 'Jordan reveals the path they almost took'
  },

  // Alex's mentor - needs trust AND exploring pattern
  alex_mentor_memory: {
    trustMin: 8,
    pattern: 'exploring',
    patternMin: 6,
    description: 'Alex tells you about the person who believed in them'
  },

  // Silas's failure - needs trust AND analytical pattern
  silas_the_collapse: {
    trustMin: 8,
    pattern: 'analytical',
    patternMin: 6,
    description: 'Silas reveals the system failure he couldn\'t prevent'
  },

  // Grace's breaking point - needs trust AND helping pattern
  grace_the_hardest_night: {
    trustMin: 8,
    pattern: 'helping',
    patternMin: 6,
    description: 'Grace shares her darkest professional moment'
  },

  // Elena's discovery - needs trust AND analytical pattern
  elena_the_pattern: {
    trustMin: 8,
    pattern: 'analytical',
    patternMin: 6,
    description: 'Elena shows you the pattern she found in the data'
  },

  // Asha's first mural - needs trust AND building pattern
  asha_grandmother_technique: {
    trustMin: 8,
    pattern: 'building',
    patternMin: 6,
    description: 'Asha teaches you her grandmother\'s secret technique'
  },

  // Lira's voice - needs trust AND patience pattern
  lira_silence_song: {
    trustMin: 8,
    pattern: 'patience',
    patternMin: 6,
    description: 'Lira performs the song she wrote in silence'
  },

  // Zara's algorithm - needs trust AND analytical pattern
  zara_the_bias_discovered: {
    trustMin: 8,
    pattern: 'analytical',
    patternMin: 6,
    description: 'Zara shows you the bias she found in the system'
  }
}

/**
 * Check if a pattern-trust gate is satisfied
 */
export function checkPatternTrustGate(
  gateId: string,
  trust: number,
  patterns: PlayerPatterns
): boolean {
  const gate = PATTERN_TRUST_GATES[gateId]
  if (!gate) return false

  return trust >= gate.trustMin && patterns[gate.pattern] >= gate.patternMin
}

/**
 * Get all unlocked pattern-trust gates for a character
 */
export function getUnlockedGates(
  characterId: string,
  trust: number,
  patterns: PlayerPatterns
): string[] {
  return Object.entries(PATTERN_TRUST_GATES)
    .filter(([gateId, _gate]) => {
      // Gate belongs to this character (check prefix)
      if (!gateId.startsWith(characterId)) return false
      return checkPatternTrustGate(gateId, trust, patterns)
    })
    .map(([gateId]) => gateId)
}

// ═══════════════════════════════════════════════════════════════════════════
// D-004: CROSS-CHARACTER PATTERN RECOGNITION
// Characters comment on your pattern development
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pattern recognition comments from characters
 * Triggered when player reaches certain pattern thresholds
 */
export interface PatternRecognitionComment {
  characterId: string
  pattern: PatternType
  threshold: number  // Minimum pattern level to trigger
  comment: string
  emotion: string
}

/**
 * Character comments on player's developing patterns
 */
export const PATTERN_RECOGNITION_COMMENTS: PatternRecognitionComment[] = [
  // Samuel recognizes patience
  {
    characterId: 'samuel',
    pattern: 'patience',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You've learned to wait. Most never do.",
    emotion: 'warm'
  },
  {
    characterId: 'samuel',
    pattern: 'patience',
    threshold: PATTERN_THRESHOLDS.FLOURISHING,
    comment: "Stillness has become your strength. The station responds to that.",
    emotion: 'impressed'
  },

  // Maya recognizes building
  {
    characterId: 'maya',
    pattern: 'building',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You make things. I can see it in how you approach problems.",
    emotion: 'approving'
  },
  {
    characterId: 'maya',
    pattern: 'building',
    threshold: PATTERN_THRESHOLDS.FLOURISHING,
    comment: "You're a maker, like me. The real kind, not the ones who just talk.",
    emotion: 'warm'
  },

  // Devon recognizes analytical
  {
    characterId: 'devon',
    pattern: 'analytical',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You think in systems. I noticed.",
    emotion: 'neutral'
  },
  {
    characterId: 'devon',
    pattern: 'analytical',
    threshold: PATTERN_THRESHOLDS.FLOURISHING,
    comment: "Your mind... it traces the connections others miss. That's rare.",
    emotion: 'impressed'
  },

  // Marcus recognizes helping
  {
    characterId: 'marcus',
    pattern: 'helping',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You care. Actually care. Not everyone does.",
    emotion: 'warm'
  },
  {
    characterId: 'marcus',
    pattern: 'helping',
    threshold: PATTERN_THRESHOLDS.FLOURISHING,
    comment: "The way you show up for people... that's a gift. Don't let anyone tell you otherwise.",
    emotion: 'grateful'
  },

  // Rohan recognizes exploring
  {
    characterId: 'rohan',
    pattern: 'exploring',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You question things. Good. Most accept too easily.",
    emotion: 'approving'
  },
  {
    characterId: 'rohan',
    pattern: 'exploring',
    threshold: PATTERN_THRESHOLDS.FLOURISHING,
    comment: "Your curiosity cuts deep. You don't just scratch surfaces—you dig.",
    emotion: 'impressed'
  },

  // Tess recognizes building
  {
    characterId: 'tess',
    pattern: 'building',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You've got maker energy. I can spot it.",
    emotion: 'approving'
  },

  // Jordan recognizes exploring
  {
    characterId: 'jordan',
    pattern: 'exploring',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You're not afraid to try new paths. That's half the battle.",
    emotion: 'encouraging'
  },

  // Kai recognizes analytical
  {
    characterId: 'kai',
    pattern: 'analytical',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You assess before you act. In my field, that's survival.",
    emotion: 'approving'
  },

  // Yaquin recognizes patience
  {
    characterId: 'yaquin',
    pattern: 'patience',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You don't rush. That's... refreshing.",
    emotion: 'relieved'
  },

  // Silas recognizes analytical
  {
    characterId: 'silas',
    pattern: 'analytical',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You see the system, not just the symptoms.",
    emotion: 'impressed'
  },

  // Alex recognizes exploring
  {
    characterId: 'alex',
    pattern: 'exploring',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "Fellow adventurer, huh? Always nice to meet someone who asks 'what if'.",
    emotion: 'excited'
  },

  // Grace recognizes helping
  {
    characterId: 'grace',
    pattern: 'helping',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You've got a healer's instinct. The caring kind.",
    emotion: 'warm'
  },

  // Elena recognizes analytical
  {
    characterId: 'elena',
    pattern: 'analytical',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You follow the data. Even when it's uncomfortable.",
    emotion: 'approving'
  },

  // Asha recognizes building
  {
    characterId: 'asha',
    pattern: 'building',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You understand creation. Not everyone does.",
    emotion: 'warm'
  },

  // Lira recognizes patience
  {
    characterId: 'lira',
    pattern: 'patience',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You listen to silences. Most people fill them.",
    emotion: 'soft'
  },

  // Zara recognizes analytical
  {
    characterId: 'zara',
    pattern: 'analytical',
    threshold: PATTERN_THRESHOLDS.DEVELOPING,
    comment: "You question the algorithm. That's step one.",
    emotion: 'approving'
  }
]

/**
 * Get pattern recognition comments for a character based on player's patterns
 */
export function getPatternRecognitionComments(
  characterId: string,
  patterns: PlayerPatterns,
  alreadyShown: Set<string> = new Set()
): PatternRecognitionComment[] {
  return PATTERN_RECOGNITION_COMMENTS
    .filter(comment => {
      if (comment.characterId !== characterId) return false
      if (patterns[comment.pattern] < comment.threshold) return false

      // Create unique key for deduplication
      const key = `${comment.characterId}_${comment.pattern}_${comment.threshold}`
      if (alreadyShown.has(key)) return false

      return true
    })
}

// ═══════════════════════════════════════════════════════════════════════════
// D-007: DIALOGUE CHOICE PATTERN PREVIEWS
// Subtle color glow hints which pattern a choice aligns with
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pattern preview configuration
 */
export interface PatternPreviewConfig {
  enabled: boolean           // Whether to show pattern hints
  opacity: number           // 0-1 opacity for the hint glow
  showOnlyDeveloped: boolean // Only show hints for patterns player has developed
  developedThreshold: number // Minimum pattern level to show hint
}

/**
 * Default pattern preview settings
 */
export const DEFAULT_PATTERN_PREVIEW_CONFIG: PatternPreviewConfig = {
  enabled: true,
  opacity: 0.15,           // Very subtle - 15% opacity
  showOnlyDeveloped: true, // Only hint patterns the player is already developing
  developedThreshold: PATTERN_THRESHOLDS.EMERGING
}

/**
 * Get CSS styles for pattern preview glow
 */
export function getPatternPreviewStyles(
  pattern: PatternType | undefined,
  patterns: PlayerPatterns,
  config: PatternPreviewConfig = DEFAULT_PATTERN_PREVIEW_CONFIG
): { boxShadow?: string; borderColor?: string } {
  if (!config.enabled || !pattern) return {}

  // Check if we should show based on player's development
  if (config.showOnlyDeveloped && patterns[pattern] < config.developedThreshold) {
    return {}
  }

  const color = getPatternColor(pattern)

  return {
    boxShadow: `inset 0 0 20px ${color}${Math.round(config.opacity * 255).toString(16).padStart(2, '0')}`,
    borderColor: `${color}40` // 25% opacity border
  }
}

/**
 * Get pattern hint text for accessibility
 */
export function getPatternHintText(
  pattern: PatternType | undefined,
  patterns: PlayerPatterns,
  config: PatternPreviewConfig = DEFAULT_PATTERN_PREVIEW_CONFIG
): string | null {
  if (!config.enabled || !pattern) return null

  if (config.showOnlyDeveloped && patterns[pattern] < config.developedThreshold) {
    return null
  }

  const metadata = PATTERN_METADATA[pattern]
  return `This choice aligns with ${metadata.label}`
}

// ═══════════════════════════════════════════════════════════════════════════
// D-040: PATTERN EVOLUTION HEATMAP
// Visual showing when/where patterns grew
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Single data point for pattern evolution tracking
 */
export interface PatternEvolutionPoint {
  timestamp: number
  nodeId: string
  characterId: string
  pattern: PatternType
  delta: number           // Change in pattern value
  runningTotal: number    // Pattern total at this point
  choiceText?: string     // Optional: what choice triggered this
}

/**
 * Complete pattern evolution history
 */
export interface PatternEvolutionHistory {
  points: PatternEvolutionPoint[]
  patternTotals: PlayerPatterns
  milestones: PatternMilestone[]
}

/**
 * Milestone achieved in pattern development
 */
export interface PatternMilestone {
  pattern: PatternType
  threshold: 'EMERGING' | 'DEVELOPING' | 'FLOURISHING'
  achievedAt: number
  nodeId: string
  characterId: string
}

/**
 * Create empty evolution history
 */
export function createPatternEvolutionHistory(): PatternEvolutionHistory {
  return {
    points: [],
    patternTotals: {
      analytical: 0,
      patience: 0,
      exploring: 0,
      helping: 0,
      building: 0
    },
    milestones: []
  }
}

/**
 * Record a pattern change in evolution history
 */
export function recordPatternEvolution(
  history: PatternEvolutionHistory,
  nodeId: string,
  characterId: string,
  pattern: PatternType,
  delta: number,
  choiceText?: string
): PatternEvolutionHistory {
  const newTotal = history.patternTotals[pattern] + delta

  const point: PatternEvolutionPoint = {
    timestamp: Date.now(),
    nodeId,
    characterId,
    pattern,
    delta,
    runningTotal: newTotal,
    choiceText
  }

  // Check for milestone achievements
  const newMilestones: PatternMilestone[] = []
  const oldTotal = history.patternTotals[pattern]

  if (oldTotal < PATTERN_THRESHOLDS.EMERGING && newTotal >= PATTERN_THRESHOLDS.EMERGING) {
    newMilestones.push({
      pattern,
      threshold: 'EMERGING',
      achievedAt: Date.now(),
      nodeId,
      characterId
    })
  }

  if (oldTotal < PATTERN_THRESHOLDS.DEVELOPING && newTotal >= PATTERN_THRESHOLDS.DEVELOPING) {
    newMilestones.push({
      pattern,
      threshold: 'DEVELOPING',
      achievedAt: Date.now(),
      nodeId,
      characterId
    })
  }

  if (oldTotal < PATTERN_THRESHOLDS.FLOURISHING && newTotal >= PATTERN_THRESHOLDS.FLOURISHING) {
    newMilestones.push({
      pattern,
      threshold: 'FLOURISHING',
      achievedAt: Date.now(),
      nodeId,
      characterId
    })
  }

  return {
    points: [...history.points, point],
    patternTotals: {
      ...history.patternTotals,
      [pattern]: newTotal
    },
    milestones: [...history.milestones, ...newMilestones]
  }
}

/**
 * Get heatmap data for visualization
 * Groups pattern changes by character for visual display
 */
export function getPatternHeatmapData(
  history: PatternEvolutionHistory
): Map<string, Map<PatternType, number>> {
  const heatmap = new Map<string, Map<PatternType, number>>()

  for (const point of history.points) {
    if (!heatmap.has(point.characterId)) {
      heatmap.set(point.characterId, new Map())
    }

    const charMap = heatmap.get(point.characterId)!
    const current = charMap.get(point.pattern) || 0
    charMap.set(point.pattern, current + point.delta)
  }

  return heatmap
}

// ═══════════════════════════════════════════════════════════════════════════
// D-059: ACHIEVEMENT SYSTEM WITH PATTERN DIVERSITY
// Rewards for developing all patterns ("Renaissance Mind")
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Achievement definition
 */
export interface PatternAchievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (patterns: PlayerPatterns) => boolean
  reward?: string  // Optional narrative reward
}

/**
 * All pattern-based achievements
 */
export const PATTERN_ACHIEVEMENTS: PatternAchievement[] = [
  // Single pattern mastery
  {
    id: 'weaver_awakened',
    name: 'The Weaver Awakened',
    description: 'Developed the Analytical pattern to Flourishing',
    icon: '🕸️',
    condition: (p) => p.analytical >= PATTERN_THRESHOLDS.FLOURISHING,
    reward: 'The station\'s logic puzzles feel clearer now'
  },
  {
    id: 'anchor_set',
    name: 'The Anchor Set',
    description: 'Developed the Patience pattern to Flourishing',
    icon: '⚓',
    condition: (p) => p.patience >= PATTERN_THRESHOLDS.FLOURISHING,
    reward: 'Time moves differently around you in the station'
  },
  {
    id: 'voyager_path',
    name: 'The Voyager\'s Path',
    description: 'Developed the Exploring pattern to Flourishing',
    icon: '🧭',
    condition: (p) => p.exploring >= PATTERN_THRESHOLDS.FLOURISHING,
    reward: 'Hidden paths in the station reveal themselves to you'
  },
  {
    id: 'harmonic_resonance',
    name: 'Harmonic Resonance',
    description: 'Developed the Helping pattern to Flourishing',
    icon: '🎵',
    condition: (p) => p.helping >= PATTERN_THRESHOLDS.FLOURISHING,
    reward: 'Characters share secrets they\'ve never told anyone'
  },
  {
    id: 'architect_vision',
    name: 'The Architect\'s Vision',
    description: 'Developed the Building pattern to Flourishing',
    icon: '🏗️',
    condition: (p) => p.building >= PATTERN_THRESHOLDS.FLOURISHING,
    reward: 'You can see how the station was constructed'
  },

  // Multi-pattern achievements
  {
    id: 'balanced_approach',
    name: 'Balanced Approach',
    description: 'Developed 3 patterns to Emerging level',
    icon: '⚖️',
    condition: (p) => {
      const emerging = PATTERN_TYPES.filter(t => p[t] >= PATTERN_THRESHOLDS.EMERGING)
      return emerging.length >= 3
    }
  },
  {
    id: 'versatile_mind',
    name: 'Versatile Mind',
    description: 'Developed all 5 patterns to Emerging level',
    icon: '🌟',
    condition: (p) => {
      return PATTERN_TYPES.every(t => p[t] >= PATTERN_THRESHOLDS.EMERGING)
    }
  },
  {
    id: 'renaissance_soul',
    name: 'Renaissance Soul',
    description: 'Developed all 5 patterns to Developing level',
    icon: '✨',
    condition: (p) => {
      return PATTERN_TYPES.every(t => p[t] >= PATTERN_THRESHOLDS.DEVELOPING)
    },
    reward: 'The station recognizes you as something rare'
  },
  {
    id: 'transcendent_mind',
    name: 'Transcendent Mind',
    description: 'Developed all 5 patterns to Flourishing level',
    icon: '🌌',
    condition: (p) => {
      return PATTERN_TYPES.every(t => p[t] >= PATTERN_THRESHOLDS.FLOURISHING)
    },
    reward: 'You see the station as it truly is'
  },

  // Contrast achievements
  {
    id: 'analyst_and_helper',
    name: 'Head and Heart',
    description: 'Developed both Analytical and Helping to Developing',
    icon: '💡❤️',
    condition: (p) => {
      return p.analytical >= PATTERN_THRESHOLDS.DEVELOPING &&
        p.helping >= PATTERN_THRESHOLDS.DEVELOPING
    }
  },
  {
    id: 'patient_explorer',
    name: 'The Patient Explorer',
    description: 'Developed both Patience and Exploring to Developing',
    icon: '🐢🔭',
    condition: (p) => {
      return p.patience >= PATTERN_THRESHOLDS.DEVELOPING &&
        p.exploring >= PATTERN_THRESHOLDS.DEVELOPING
    }
  },
  {
    id: 'thoughtful_maker',
    name: 'The Thoughtful Maker',
    description: 'Developed both Building and Patience to Developing',
    icon: '🔨⏳',
    condition: (p) => {
      return p.building >= PATTERN_THRESHOLDS.DEVELOPING &&
        p.patience >= PATTERN_THRESHOLDS.DEVELOPING
    }
  }
]

/**
 * Check which achievements a player has earned
 */
export function getEarnedAchievements(patterns: PlayerPatterns): PatternAchievement[] {
  return PATTERN_ACHIEVEMENTS.filter(a => a.condition(patterns))
}

/**
 * Check for newly earned achievements
 */
export function checkNewAchievements(
  oldPatterns: PlayerPatterns,
  newPatterns: PlayerPatterns
): PatternAchievement[] {
  const oldEarned = new Set(getEarnedAchievements(oldPatterns).map(a => a.id))
  const newEarned = getEarnedAchievements(newPatterns)

  return newEarned.filter(a => !oldEarned.has(a.id))
}

// ═══════════════════════════════════════════════════════════════════════════
// D-096: PATTERN VOICE CONFLICTS
// Voices disagree, forcing player to choose
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Voice conflict scenario
 */
export interface VoiceConflict {
  id: string
  situation: string
  voices: {
    pattern: PatternType
    argument: string
    tone: 'urging' | 'warning' | 'questioning' | 'suggesting'
  }[]
  resolution: {
    pattern: PatternType
    outcome: string
  }[]
}

/**
 * Predefined voice conflict scenarios
 */
export const VOICE_CONFLICTS: VoiceConflict[] = [
  {
    id: 'help_or_analyze',
    situation: 'Someone is struggling, but something feels off about their story.',
    voices: [
      {
        pattern: 'helping',
        argument: 'They need you now. Trust can come later.',
        tone: 'urging'
      },
      {
        pattern: 'analytical',
        argument: 'Wait. The details don\'t add up. Look closer.',
        tone: 'warning'
      }
    ],
    resolution: [
      {
        pattern: 'helping',
        outcome: 'You reached out. Whether wise or not, you showed up.'
      },
      {
        pattern: 'analytical',
        outcome: 'You paused to examine. Understanding before action.'
      }
    ]
  },
  {
    id: 'wait_or_build',
    situation: 'A problem has a quick fix, but the real issue runs deeper.',
    voices: [
      {
        pattern: 'building',
        argument: 'Fix it now. Ships don\'t sail while you theorize.',
        tone: 'urging'
      },
      {
        pattern: 'patience',
        argument: 'A patch over rot. The foundation matters more than speed.',
        tone: 'questioning'
      }
    ],
    resolution: [
      {
        pattern: 'building',
        outcome: 'You built the solution. Progress over perfection.'
      },
      {
        pattern: 'patience',
        outcome: 'You waited for understanding. Foundation before walls.'
      }
    ]
  },
  {
    id: 'explore_or_patience',
    situation: 'A door opens, but your companion isn\'t ready.',
    voices: [
      {
        pattern: 'exploring',
        argument: 'The door won\'t stay open. Discovery waits for no one.',
        tone: 'urging'
      },
      {
        pattern: 'patience',
        argument: 'What good is finding something if you lose someone?',
        tone: 'questioning'
      }
    ],
    resolution: [
      {
        pattern: 'exploring',
        outcome: 'You went ahead. Some paths must be walked alone.'
      },
      {
        pattern: 'patience',
        outcome: 'You waited. The door will open again; trust might not.'
      }
    ]
  },
  {
    id: 'analyze_or_help_crisis',
    situation: 'In crisis, someone asks for help, but the data suggests they\'re wrong.',
    voices: [
      {
        pattern: 'analytical',
        argument: 'The numbers are clear. Helping them do the wrong thing isn\'t help.',
        tone: 'warning'
      },
      {
        pattern: 'helping',
        argument: 'Being right means nothing if they feel abandoned.',
        tone: 'suggesting'
      }
    ],
    resolution: [
      {
        pattern: 'analytical',
        outcome: 'You gave them truth, not comfort. Sometimes that\'s harder.'
      },
      {
        pattern: 'helping',
        outcome: 'You stood with them. Right or wrong, they weren\'t alone.'
      }
    ]
  },
  {
    id: 'build_or_explore',
    situation: 'Your project is almost done, but you\'ve glimpsed something that changes everything.',
    voices: [
      {
        pattern: 'building',
        argument: 'Finish what you started. Perfect is the enemy of done.',
        tone: 'urging'
      },
      {
        pattern: 'exploring',
        argument: 'What if "done" is the wrong thing? The new path calls.',
        tone: 'questioning'
      }
    ],
    resolution: [
      {
        pattern: 'building',
        outcome: 'You completed the work. Creation finished.'
      },
      {
        pattern: 'exploring',
        outcome: 'You pivoted. Some discoveries are worth starting over.'
      }
    ]
  }
]

/**
 * Check if a voice conflict should trigger based on player's patterns
 */
export function shouldTriggerVoiceConflict(
  conflict: VoiceConflict,
  patterns: PlayerPatterns,
  minThreshold: number = PATTERN_THRESHOLDS.DEVELOPING
): boolean {
  // Both conflicting patterns must be at least at the threshold
  return conflict.voices.every(voice => patterns[voice.pattern] >= minThreshold)
}

/**
 * Get active voice conflicts for player's current state
 */
export function getActiveVoiceConflicts(
  patterns: PlayerPatterns,
  shownConflicts: Set<string> = new Set()
): VoiceConflict[] {
  return VOICE_CONFLICTS.filter(conflict => {
    if (shownConflicts.has(conflict.id)) return false
    return shouldTriggerVoiceConflict(conflict, patterns)
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate pattern distribution balance
 * Returns 0-1 where 1 is perfectly balanced across all patterns
 */
export function calculatePatternBalance(patterns: PlayerPatterns): number {
  const values = Object.values(patterns)
  const total = values.reduce((a, b) => a + b, 0)

  if (total === 0) return 1 // Perfect balance at zero

  const ideal = total / PATTERN_TYPES.length
  const deviations = values.map(v => Math.abs(v - ideal))
  const avgDeviation = deviations.reduce((a, b) => a + b, 0) / PATTERN_TYPES.length

  // Normalize: 0 deviation = 1.0 balance, max deviation = 0.0 balance
  const maxPossibleDeviation = total * (1 - 1 / PATTERN_TYPES.length)
  return 1 - (avgDeviation / (maxPossibleDeviation || 1))
}
