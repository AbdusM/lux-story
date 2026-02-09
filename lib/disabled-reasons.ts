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
  message: string
}

export function deriveDisabledReason(
  condition: StateCondition | undefined,
  gameState: GameState,
  characterId?: string
): DisabledReason {
  if (!condition) return { code: 'REQUIREMENTS_NOT_MET', message: 'Requirements not met' }

  const reasons: string[] = []
  const charState = characterId ? gameState.characters.get(characterId) : undefined

  // Prefer returning the "most actionable" failing reason first (AAA UX rule).

  if (condition.trust?.min !== undefined) {
    if (!charState) return { code: 'NEEDS_TRUST', message: `Need ${condition.trust.min} trust` }
    if (charState.trust < condition.trust.min) {
      return { code: 'NEEDS_TRUST', message: `Need ${condition.trust.min} trust (have ${charState.trust})` }
    }
  }

  if (condition.relationship && condition.relationship.length > 0) {
    if (!charState) return { code: 'NEEDS_RELATIONSHIP', message: `Need ${condition.relationship.join(' or ')} relationship` }
    if (!condition.relationship.includes(charState.relationshipStatus)) {
      return { code: 'NEEDS_RELATIONSHIP', message: `Need ${condition.relationship.join(' or ')} relationship` }
    }
  }

  if (condition.hasGlobalFlags && condition.hasGlobalFlags.length > 0) {
    for (const flag of condition.hasGlobalFlags) {
      if (!gameState.globalFlags.has(flag)) {
        return { code: 'NEEDS_GLOBAL_FLAG', message: `Missing requirement: ${flag}` }
      }
    }
  }

  if (condition.lacksGlobalFlags && condition.lacksGlobalFlags.length > 0) {
    for (const flag of condition.lacksGlobalFlags) {
      if (gameState.globalFlags.has(flag)) {
        return { code: 'BLOCKED_BY_GLOBAL_FLAG', message: `Blocked by: ${flag}` }
      }
    }
  }

  if (condition.hasKnowledgeFlags && condition.hasKnowledgeFlags.length > 0) {
    const flags = charState?.knowledgeFlags || new Set<string>()
    for (const flag of condition.hasKnowledgeFlags) {
      if (!flags.has(flag)) {
        return { code: 'NEEDS_KNOWLEDGE_FLAG', message: `Missing knowledge: ${flag}` }
      }
    }
  }

  if (condition.lacksKnowledgeFlags && condition.lacksKnowledgeFlags.length > 0) {
    const flags = charState?.knowledgeFlags || new Set<string>()
    for (const flag of condition.lacksKnowledgeFlags) {
      if (flags.has(flag)) {
        return { code: 'BLOCKED_BY_KNOWLEDGE_FLAG', message: `Blocked by knowledge: ${flag}` }
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
        return { code: 'NEEDS_PATTERN_LEVEL', message: `Need ${cfg.min} ${pattern} (have ${current})` }
      }
      if (cfg.max !== undefined && current > cfg.max) {
        reasons.push(`Need <=${cfg.max} ${pattern}`)
      }
    }
  }

  if (condition.requiredCombos && condition.requiredCombos.length > 0) {
    // We can’t reliably compute combo unlocks here without importing combo logic.
    // Still return an actionable code so UI/telemetry can bucket it.
    return { code: 'NEEDS_COMBO', message: 'Requires a combo unlock' }
  }

  // Fallback: preserve behavior (string is still shown), but with a canonical code.
  const message = reasons.length > 0 ? reasons.join(', ') : 'Requirements not met'
  return { code: 'REQUIREMENTS_NOT_MET', message }
}
