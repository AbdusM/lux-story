import { GameStateUtils, type GameState } from '../character-state'

export const BASELINE_EARLY_GAME_V1_ID = 'baseline_early_game_v1'

/**
 * Frozen baseline fixture used by deterministic sims and validators.
 *
 * Keep this stable. If you need a new baseline, add v2 rather than mutating v1.
 */
export function createBaselineEarlyGameV1State(): GameState {
  const state = GameStateUtils.createNewGameState(BASELINE_EARLY_GAME_V1_ID)

  // Reduce nondeterministic noise; sims don't hash these fields today, but we keep them stable anyway.
  state.lastSaved = 0
  state.sessionStartTime = 0

  return state
}

