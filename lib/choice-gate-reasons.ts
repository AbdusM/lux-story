import { PATTERN_METADATA, type PatternType } from '@/lib/patterns'
import type { OrbFillLevels } from '@/lib/choice-adapter'

export type ChoiceGateReason =
  | {
    kind: 'locked'
    code: 'NEEDS_ORB_FILL'
    pattern: PatternType
    why: string
    how: string
    progress: { current: number; required: number }
  }

export function deriveOrbFillGateReason(args: {
  requiredOrbFill: { pattern: PatternType; threshold: number }
  orbFillLevels: OrbFillLevels | undefined
  narrativeLockMessage?: string
  lockActionHint?: string
}): ChoiceGateReason {
  const { pattern, threshold } = args.requiredOrbFill
  const label = PATTERN_METADATA[pattern].label
  const current = args.orbFillLevels?.[pattern] ?? 0

  const why = `Requires ${label} resonance (${threshold}%)`

  // Prefer explicit author hint; fall back to a generic, consistent instruction.
  const how = args.lockActionHint?.trim()
    ? `To unlock: ${args.lockActionHint.trim()}`
    : `To unlock: Choose more ${PATTERN_METADATA[pattern].shortLabel} options.`

  return {
    kind: 'locked',
    code: 'NEEDS_ORB_FILL',
    pattern,
    why,
    how,
    progress: { current, required: threshold },
  }
}
