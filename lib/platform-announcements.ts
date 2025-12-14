/**
 * Platform Announcements for Session Boundaries
 *
 * Atmospheric narrator dialogue that appears at session boundaries.
 * Simple array with modulo-based selection for variety.
 */

/**
 * 21 atmospheric announcements (7 per phase)
 * Evolve from time-based → atmospheric → philosophical as player progresses
 */
export const announcements: string[] = [
  // Phase 1: Time & Orientation (boundaries 0-6)
  'The station clock reads neither past nor future. Only the eternal now of becoming.',
  'Between platforms, time moves differently here. Some journeys take minutes. Others, a lifetime.',
  'The departure board flickers: "ALL TRAINS DEPARTING WHEN READY. NO SCHEDULE BUT YOUR OWN."',
  'A voice echoes: "The platform will be here when you return. Some conversations are worth continuing."',
  'Morning light filters through the station glass, though it seems to be perpetually dawn here.',
  'The station hums with quiet energy. You sense you can leave and return—nothing rushes you.',
  'Your ticket glows softly. The conductor nods: "Progress is never lost. Return when you\'re ready."',

  // Phase 2: Atmosphere & Mood (boundaries 7-13)
  'The platform grows quieter. You feel the weight of choices settling like evening mist.',
  'Other travelers pass by, each lost in their own becoming. You wonder which paths they\'re exploring.',
  'Steam rises from the tracks below. The air smells of possibility and something you can\'t quite name.',
  'A distant bell chimes. Not a warning, but a reminder: you are exactly where you need to be.',
  'Shadows lengthen across the platform. The characters you\'ve met seem more real than memory.',
  'The station walls shimmer. For a moment, you see reflections of who you were and who you might become.',
  'Outside, the city continues. Inside, time bends around the conversations that matter.',

  // Phase 3: Philosophy & Identity (boundaries 14+)
  'The station master once said: "We are not discovering who we are. We are deciding."',
  'Every conversation leaves a mark. You are becoming the shape of your choices.',
  'The tracks diverge and converge. There are no wrong platforms, only different destinations.',
  'You notice patterns in your choices—threads of who you\'re becoming woven through every word.',
  'The journey is not about arriving. It never was. It\'s about the shape you take while traveling.',
  'Some travelers rush through. You\'ve chosen to linger, to listen. That choice itself is an answer.',
  'The station doesn\'t judge. It only offers: another platform, another story, another chance to choose.'
]

/**
 * Select announcement based on total boundaries crossed
 * Uses modulo for variety without complex logic
 *
 * @param boundariesCrossed - Total session boundaries player has crossed (0-based)
 * @returns Atmospheric announcement text
 */
export function selectAnnouncement(boundariesCrossed: number): string {
  // Modulo ensures we cycle through announcements if player crosses 21+ boundaries
  const index = boundariesCrossed % announcements.length
  return announcements[index]
}

/**
 * Get announcement count (for testing/debugging)
 */
export function getAnnouncementCount(): number {
  return announcements.length
}
