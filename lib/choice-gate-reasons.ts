import { PATTERN_METADATA, type PatternType } from '@/lib/patterns'

export type ChoiceGateReason =
  | {
      kind: 'locked'
      code: 'NEEDS_ORB_FILL'
      pattern: PatternType
      required: number
      current: number
      why: string
      how: string
    }
  | {
      kind: 'disabled'
      code: 'DISABLED_BY_CONDITION'
      why: string
      how: string | null
    }

export type ChoiceGateInputs = {
  enabled?: boolean
  disabledReason?: string
  requiredOrbFill?: { pattern: PatternType; threshold: number }
}

export type OrbFillLevels = Record<PatternType, number>

export function deriveChoiceGateReason(
  choice: ChoiceGateInputs,
  orbFillLevels?: OrbFillLevels,
): ChoiceGateReason | null {
  if (choice.enabled === false) {
    const why = choice.disabledReason || 'Requirements not met'
    return {
      kind: 'disabled',
      code: 'DISABLED_BY_CONDITION',
      why,
      how: null,
    }
  }

  if (choice.requiredOrbFill && orbFillLevels) {
    const { pattern, threshold } = choice.requiredOrbFill
    const current = orbFillLevels[pattern] ?? 0
    if (current < threshold) {
      const label = PATTERN_METADATA[pattern].label
      return {
        kind: 'locked',
        code: 'NEEDS_ORB_FILL',
        pattern,
        required: threshold,
        current,
        why: `Requires ${label} resonance (${threshold}%)`,
        how: `Choose more ${label}-aligned responses to build this orb.`,
      }
    }
  }

  return null
}

