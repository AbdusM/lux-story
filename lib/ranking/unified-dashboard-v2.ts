/**
 * Unified Dashboard V2 (Flagged)
 *
 * A deliberately small "beta lane" wrapper around the canonical calculator.
 * Keeps determinism + type stability while allowing staged algorithm tweaks.
 *
 * NOTE: This should only be used behind `RANKING_V2=beta`.
 */

import type { UnifiedDashboardInput } from './unified-dashboard'
import type { UnifiedDashboardState } from './types'

import { calculateUnifiedDashboard } from './unified-dashboard'

/**
 * Beta ranking calculator.
 *
 * Current V2 delta (small + safe):
 * - Slightly increases overall progression to make incremental progress feel less flat.
 *   This is display-only and does not affect core game state.
 */
export function calculateUnifiedDashboardV2Beta(
  input: UnifiedDashboardInput,
  now: number = Date.now()
): UnifiedDashboardState {
  const base = calculateUnifiedDashboard(input, now)

  // Keep deterministic and bounded.
  const boosted = Math.min(100, Math.max(0, Math.round(base.overallProgression * 1.02)))

  return {
    ...base,
    overallProgression: boosted,
  }
}

