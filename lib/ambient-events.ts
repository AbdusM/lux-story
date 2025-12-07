/**
 * Ambient Events System - "The Station Breathes"
 *
 * When the player pauses to think, life continues around them.
 * Like Assassin's Creed NPCs or the sloth game's idle moments.
 *
 * Events are:
 * - Purely atmospheric (no response required)
 * - Character-aware (companion reacts differently than station)
 * - Non-intrusive (1-2 sentences max)
 * - Varied (no immediate repeats)
 */

import type { PatternType } from './patterns'

export type AmbientEventType =
  | 'station_atmosphere'  // Trains, announcements, travelers
  | 'character_idle'      // Companion shifts, looks around
  | 'environmental'       // Light changes, sounds, details
  | 'distant_life'        // Other travelers, station workers

export interface AmbientEvent {
  id: string
  type: AmbientEventType
  text: string
  characterId?: string  // Only show with specific character
  weight: number        // Higher = more likely
}

/**
 * Station atmosphere - the world around you
 */
const STATION_EVENTS: AmbientEvent[] = [
  // Train movements
  { id: 'train_distant', type: 'station_atmosphere', text: 'A train rumbles through a distant platform, wheels singing against iron rails.', weight: 3 },
  { id: 'train_announce', type: 'station_atmosphere', text: 'The station announces a departure. The words echo, half-swallowed by the vaulted ceiling.', weight: 2 },
  { id: 'train_arrive', type: 'station_atmosphere', text: 'Somewhere behind you, a train sighs to a stop. Doors slide open. Footsteps scatter.', weight: 2 },
  { id: 'train_whistle', type: 'station_atmosphere', text: 'A whistle pierces the air—two notes, high then low. Someone\'s journey begins.', weight: 2 },

  // Travelers
  { id: 'traveler_hurry', type: 'distant_life', text: 'A woman rushes past clutching a leather bag, heels clicking a urgent rhythm.', weight: 3 },
  { id: 'traveler_family', type: 'distant_life', text: 'A family clusters around a bench nearby—a child pointing at the departure board, asking questions.', weight: 2 },
  { id: 'traveler_goodbye', type: 'distant_life', text: 'Across the hall, two people embrace. One boards. The other watches until the doors close.', weight: 2 },
  { id: 'traveler_lost', type: 'distant_life', text: 'A young man studies a crumpled map, turning it one way, then another.', weight: 2 },
  { id: 'traveler_old', type: 'distant_life', text: 'An elderly gentleman settles onto a bench with a newspaper, unhurried. He\'s been here before.', weight: 2 },

  // Station workers
  { id: 'worker_sweep', type: 'distant_life', text: 'A station worker pushes a wide broom across marble, collecting the day\'s small debris.', weight: 2 },
  { id: 'worker_kiosk', type: 'distant_life', text: 'The kiosk vendor arranges newspapers, straightening corners that no one will notice.', weight: 2 },

  // Environmental
  { id: 'light_shift', type: 'environmental', text: 'Light shifts through the high windows. Dust motes drift like slow thoughts.', weight: 3 },
  { id: 'clock_tick', type: 'environmental', text: 'The station clock marks another minute. The hands move so slowly they seem still.', weight: 2 },
  { id: 'echo_steps', type: 'environmental', text: 'Footsteps echo somewhere in the terminal—a rhythm that fades before you can trace it.', weight: 2 },
  { id: 'pigeons', type: 'environmental', text: 'Pigeons flutter in the rafters, settling into new perches, cooing softly.', weight: 2 },
  { id: 'coffee_smell', type: 'environmental', text: 'The smell of coffee drifts from somewhere—a small comfort in the vast space.', weight: 2 },
  { id: 'marble_cool', type: 'environmental', text: 'The marble floor holds the coolness of morning, even as afternoon light warms the air.', weight: 1 },
]

/**
 * Character idle actions - your companion lives
 */
const CHARACTER_IDLE_EVENTS: Record<string, AmbientEvent[]> = {
  samuel: [
    { id: 'samuel_watch', type: 'character_idle', text: 'Samuel watches a departing train, something unreadable in his expression.', characterId: 'samuel', weight: 3 },
    { id: 'samuel_smile', type: 'character_idle', text: 'Samuel\'s gaze drifts to a family nearby. A small smile crosses his face.', characterId: 'samuel', weight: 2 },
    { id: 'samuel_adjust', type: 'character_idle', text: 'Samuel adjusts his cap, a gesture worn smooth by years.', characterId: 'samuel', weight: 2 },
    { id: 'samuel_hum', type: 'character_idle', text: 'Samuel hums a few notes—a song from somewhere long ago.', characterId: 'samuel', weight: 2 },
    { id: 'samuel_wait', type: 'character_idle', text: 'Samuel stands quietly, comfortable with silence. He\'s learned to wait.', characterId: 'samuel', weight: 3 },
  ],
  maya: [
    { id: 'maya_sketch', type: 'character_idle', text: 'Maya traces an invisible pattern on her palm, thinking.', characterId: 'maya', weight: 3 },
    { id: 'maya_look', type: 'character_idle', text: 'Maya\'s eyes follow a child running across the terminal. Something softens in her face.', characterId: 'maya', weight: 2 },
    { id: 'maya_shift', type: 'character_idle', text: 'Maya shifts her weight, restless even when still.', characterId: 'maya', weight: 2 },
    { id: 'maya_distant', type: 'character_idle', text: 'Maya gazes at the departure board, but her eyes are seeing somewhere else.', characterId: 'maya', weight: 2 },
  ],
  devon: [
    { id: 'devon_observe', type: 'character_idle', text: 'Devon watches the crowd flow, noting patterns only they can see.', characterId: 'devon', weight: 3 },
    { id: 'devon_think', type: 'character_idle', text: 'Devon tilts their head slightly, working through something invisible.', characterId: 'devon', weight: 2 },
    { id: 'devon_check', type: 'character_idle', text: 'Devon glances at the station clock, then back at you, patient.', characterId: 'devon', weight: 2 },
    { id: 'devon_note', type: 'character_idle', text: 'Devon\'s fingers tap a rhythm on their bag—thinking in frequencies.', characterId: 'devon', weight: 2 },
  ],
  jordan: [
    { id: 'jordan_watch', type: 'character_idle', text: 'Jordan studies the arriving passengers like each one holds a story.', characterId: 'jordan', weight: 3 },
    { id: 'jordan_stretch', type: 'character_idle', text: 'Jordan stretches, arms overhead, comfortable in their skin.', characterId: 'jordan', weight: 2 },
    { id: 'jordan_smile', type: 'character_idle', text: 'Jordan catches someone\'s eye across the hall and offers an easy nod.', characterId: 'jordan', weight: 2 },
    { id: 'jordan_curious', type: 'character_idle', text: 'Jordan leans toward a sound—always curious about what happens next.', characterId: 'jordan', weight: 2 },
  ],
  marcus: [
    { id: 'marcus_hands', type: 'character_idle', text: 'Marcus examines his hands—the calluses, the small scars of honest work.', characterId: 'marcus', weight: 3 },
    { id: 'marcus_nod', type: 'character_idle', text: 'Marcus nods to a passing worker, one craftsman acknowledging another.', characterId: 'marcus', weight: 2 },
    { id: 'marcus_notice', type: 'character_idle', text: 'Marcus notices a loose tile on the floor, makes a mental note.', characterId: 'marcus', weight: 2 },
    { id: 'marcus_quiet', type: 'character_idle', text: 'Marcus stands solid, quiet—a man who measures twice.', characterId: 'marcus', weight: 2 },
  ],
  kai: [
    { id: 'kai_listen', type: 'character_idle', text: 'Kai listens to fragments of conversation drifting past—other people\'s stories.', characterId: 'kai', weight: 3 },
    { id: 'kai_consider', type: 'character_idle', text: 'Kai\'s expression shifts through something private, then settles again.', characterId: 'kai', weight: 2 },
    { id: 'kai_observe', type: 'character_idle', text: 'Kai watches a reunion across the hall. Their eyes are kind.', characterId: 'kai', weight: 2 },
    { id: 'kai_quiet', type: 'character_idle', text: 'Kai breathes slowly, present in the moment. Therapy teaches that.', characterId: 'kai', weight: 2 },
  ],
  tess: [
    { id: 'tess_arrange', type: 'character_idle', text: 'Tess straightens her bag, everything in its place.', characterId: 'tess', weight: 3 },
    { id: 'tess_help', type: 'character_idle', text: 'Tess notices someone struggling with luggage. Her instinct is to help.', characterId: 'tess', weight: 2 },
    { id: 'tess_scan', type: 'character_idle', text: 'Tess scans the information boards, cataloging updates automatically.', characterId: 'tess', weight: 2 },
    { id: 'tess_wait', type: 'character_idle', text: 'Tess waits, organized even in stillness.', characterId: 'tess', weight: 2 },
  ],
  yaquin: [
    { id: 'yaquin_dream', type: 'character_idle', text: 'Yaquin\'s gaze goes soft, seeing something beyond the station walls.', characterId: 'yaquin', weight: 3 },
    { id: 'yaquin_listen', type: 'character_idle', text: 'Yaquin tilts her head, listening to music only she can hear.', characterId: 'yaquin', weight: 2 },
    { id: 'yaquin_sketch', type: 'character_idle', text: 'Yaquin\'s fingers move, sketching invisible notes in the air.', characterId: 'yaquin', weight: 2 },
    { id: 'yaquin_smile', type: 'character_idle', text: 'Yaquin smiles at nothing—or everything.', characterId: 'yaquin', weight: 2 },
  ],
}

/**
 * Pattern-influenced observations
 * When player leans heavily into a pattern, the station reflects it back
 */
const PATTERN_OBSERVATIONS: Record<PatternType, AmbientEvent[]> = {
  analytical: [
    { id: 'pattern_analytical_1', type: 'environmental', text: 'You notice the departure board update—a cascade of flipping letters, each one a decision made.', weight: 2 },
    { id: 'pattern_analytical_2', type: 'environmental', text: 'The crowd moves in patterns. You see them now—the rushing, the waiting, the deciding.', weight: 2 },
  ],
  patience: [
    { id: 'pattern_patience_1', type: 'environmental', text: 'Time moves differently here. The station has its own rhythm, slower than the world outside.', weight: 2 },
    { id: 'pattern_patience_2', type: 'environmental', text: 'A moment of stillness. The station seems to breathe with you.', weight: 2 },
  ],
  exploring: [
    { id: 'pattern_exploring_1', type: 'environmental', text: 'A corridor you hadn\'t noticed before catches your eye. Where does it lead?', weight: 2 },
    { id: 'pattern_exploring_2', type: 'environmental', text: 'Each platform holds different stories. You wonder about the ones you haven\'t heard yet.', weight: 2 },
  ],
  helping: [
    { id: 'pattern_helping_1', type: 'distant_life', text: 'A station worker helps an elderly woman with her bag. Small kindnesses, witnessed.', weight: 2 },
    { id: 'pattern_helping_2', type: 'distant_life', text: 'Two strangers share directions, phones out, heads together. Connection finds a way.', weight: 2 },
  ],
  building: [
    { id: 'pattern_building_1', type: 'environmental', text: 'The station\'s architecture reveals itself—each beam placed with intention, each tile a choice.', weight: 2 },
    { id: 'pattern_building_2', type: 'environmental', text: 'Someone has carved initials into a bench. Years ago. The mark remains.', weight: 2 },
  ],
}

// Track recently shown events to avoid repetition
let recentEventIds: string[] = []
const MAX_RECENT = 8

/**
 * Select a random ambient event appropriate for the current context
 */
export function selectAmbientEvent(
  characterId: string,
  dominantPattern?: PatternType
): AmbientEvent | null {
  // Build pool of available events
  const pool: AmbientEvent[] = []

  // Always include station atmosphere
  pool.push(...STATION_EVENTS)

  // Add character-specific idles if available
  const characterIdles = CHARACTER_IDLE_EVENTS[characterId]
  if (characterIdles) {
    pool.push(...characterIdles)
  }

  // Add pattern observations if player has strong pattern
  if (dominantPattern && Math.random() < 0.3) { // 30% chance for pattern-specific
    const patternEvents = PATTERN_OBSERVATIONS[dominantPattern]
    if (patternEvents) {
      pool.push(...patternEvents)
    }
  }

  // Filter out recently shown events
  const available = pool.filter(e => !recentEventIds.includes(e.id))

  if (available.length === 0) {
    // Reset if we've exhausted the pool
    recentEventIds = []
    return selectAmbientEvent(characterId, dominantPattern)
  }

  // Weighted random selection
  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0)
  let random = Math.random() * totalWeight

  for (const event of available) {
    random -= event.weight
    if (random <= 0) {
      // Track this event as recently shown
      recentEventIds.push(event.id)
      if (recentEventIds.length > MAX_RECENT) {
        recentEventIds.shift()
      }
      return event
    }
  }

  // Fallback
  const fallback = available[0]
  recentEventIds.push(fallback.id)
  return fallback
}

/**
 * Configuration for idle timing
 */
export const IDLE_CONFIG = {
  FIRST_IDLE_MS: 12000,      // 12 seconds before first ambient event
  SUBSEQUENT_IDLE_MS: 18000, // 18 seconds between subsequent events
  MAX_IDLE_EVENTS: 3,        // Maximum ambient events before going quiet
}

/**
 * Reset the recent events tracking (e.g., on new game)
 */
export function resetAmbientHistory() {
  recentEventIds = []
}
