import type { GameState, StateCondition } from '@/lib/character-state'

export type DisabledReasonCode =
  | 'NEEDS_TRUST'
  | 'NEEDS_RELATIONSHIP'
  | 'NEEDS_GLOBAL_FLAG'
  | 'BLOCKED_BY_GLOBAL_FLAG'
  | 'NEEDS_PATTERN_LEVEL'
  | 'NEEDS_KNOWLEDGE_FLAG'
  | 'BLOCKED_BY_KNOWLEDGE_FLAG'
  | 'NEEDS_COMBO'
  | 'REQUIREMENTS_NOT_MET'

export type DisabledReason = {
  code: DisabledReasonCode
  /**
   * Back-compat summary string used in tooltips/telemetry.
   * Prefer `why`/`how` for player-facing messaging.
   */
  message: string
  /**
   * Player-facing explanation. Keep short and stable.
   * Example: "Requires Trust 3"
   */
  why?: string
  /**
   * Player-facing hint for how to unlock. Keep actionable.
   * Example: "To unlock: Choose more supportive responses with Samuel."
   */
  how?: string
  /**
   * Optional progress for UI (e.g. trust/pattern levels).
   */
  progress?: { current: number; required: number }
}

export function deriveDisabledReason(
  condition: StateCondition | undefined,
  gameState: GameState,
  characterId?: string
): DisabledReason {
  if (!condition) {
    return {
      code: 'REQUIREMENTS_NOT_MET',
      message: 'Requirements not met',
      why: 'Requirements not met',
      how: 'To unlock: Continue the story and explore other options.',
    }
  }

  const reasons: string[] = []
  const charState = characterId ? gameState.characters.get(characterId) : undefined

  // Prefer returning the "most actionable" failing reason first (AAA UX rule).

  if (condition.trust?.min !== undefined) {
    const required = condition.trust.min
    if (!charState) {
      return {
        code: 'NEEDS_TRUST',
        message: `Need ${required} trust`,
        why: `Requires Trust ${required}`,
        how: 'To unlock: Build trust through supportive, consistent choices.',
        progress: { current: 0, required },
      }
    }
    if (charState.trust < condition.trust.min) {
      return {
        code: 'NEEDS_TRUST',
        message: `Need ${required} trust (have ${charState.trust})`,
        why: `Requires Trust ${required}`,
        how: 'To unlock: Build trust through supportive, consistent choices.',
        progress: { current: charState.trust, required },
      }
    }
  }

  if (condition.relationship && condition.relationship.length > 0) {
    if (!charState) {
      const rel = condition.relationship.join(' or ')
      return {
        code: 'NEEDS_RELATIONSHIP',
        message: `Need ${rel} relationship`,
        why: `Requires relationship: ${rel}`,
        how: 'To unlock: Deepen your bond through aligned choices and follow-ups.',
      }
    }
    if (!condition.relationship.includes(charState.relationshipStatus)) {
      const rel = condition.relationship.join(' or ')
      return {
        code: 'NEEDS_RELATIONSHIP',
        message: `Need ${rel} relationship`,
        why: `Requires relationship: ${rel}`,
        how: 'To unlock: Deepen your bond through aligned choices and follow-ups.',
      }
    }
  }

  if (condition.hasGlobalFlags && condition.hasGlobalFlags.length > 0) {
    for (const flag of condition.hasGlobalFlags) {
      if (!gameState.globalFlags.has(flag)) {
        return {
          code: 'NEEDS_GLOBAL_FLAG',
          message: `Missing requirement: ${flag}`,
          why: `Requires: ${flag}`,
          how: 'To unlock: Progress the story to earn this unlock.',
        }
      }
    }
  }

  if (condition.lacksGlobalFlags && condition.lacksGlobalFlags.length > 0) {
    for (const flag of condition.lacksGlobalFlags) {
      if (gameState.globalFlags.has(flag)) {
        return {
          code: 'BLOCKED_BY_GLOBAL_FLAG',
          message: `Blocked by: ${flag}`,
          why: `Blocked by: ${flag}`,
          how: 'To unlock: Try a different approach or route.',
        }
      }
    }
  }

  if (condition.hasKnowledgeFlags && condition.hasKnowledgeFlags.length > 0) {
    const flags = charState?.knowledgeFlags || new Set<string>()
    for (const flag of condition.hasKnowledgeFlags) {
      if (!flags.has(flag)) {
        return {
          code: 'NEEDS_KNOWLEDGE_FLAG',
          message: `Missing knowledge: ${flag}`,
          why: `Requires knowledge: ${flag}`,
          how: 'To unlock: Ask questions and explore related topics to learn this.',
        }
      }
    }
  }

  if (condition.lacksKnowledgeFlags && condition.lacksKnowledgeFlags.length > 0) {
    const flags = charState?.knowledgeFlags || new Set<string>()
    for (const flag of condition.lacksKnowledgeFlags) {
      if (flags.has(flag)) {
        return {
          code: 'BLOCKED_BY_KNOWLEDGE_FLAG',
          message: `Blocked by knowledge: ${flag}`,
          why: `Blocked by knowledge: ${flag}`,
          how: 'To unlock: Choose a different route or reconsider earlier assumptions.',
        }
      }
    }
  }

  if (condition.patterns) {
    const patternCfg = condition.patterns
    for (const pattern of Object.keys(patternCfg) as Array<keyof typeof gameState.patterns>) {
      const cfg = patternCfg[pattern]
      if (!cfg) continue

      const current = gameState.patterns[pattern] ?? 0
      if (cfg.min !== undefined && current < cfg.min) {
        const required = cfg.min
        return {
          code: 'NEEDS_PATTERN_LEVEL',
          message: `Need ${required} ${pattern} (have ${current})`,
          why: `Requires ${String(pattern)} ${required}`,
          how: `To unlock: Choose more ${String(pattern)} options.`,
          progress: { current, required },
        }
      }
      if (cfg.max !== undefined && current > cfg.max) {
        reasons.push(`Need <=${cfg.max} ${pattern}`)
      }
    }
  }

  if (condition.requiredCombos && condition.requiredCombos.length > 0) {
    // This is machine-checkable in the evaluator, but we keep the reason copy generic here.
    return {
      code: 'NEEDS_COMBO',
      message: 'Requires a combo unlock',
      why: 'Requires a combo unlock',
      how: 'To unlock: Develop multiple patterns and follow advanced routes.',
    }
  }

  // Fallback: preserve behavior (string is still shown), but with a canonical code.
  const message = reasons.length > 0 ? reasons.join(', ') : 'Requirements not met'
  return {
    code: 'REQUIREMENTS_NOT_MET',
    message,
    why: 'Requirements not met',
    how: 'To unlock: Continue the story and explore other options.',
  }
}
