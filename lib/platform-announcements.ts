/**
 * Platform Announcements for Session Boundaries
 *
 * 21 atmospheric announcements that appear at natural pause points.
 * Announcements are categorized by session number for variety and narrative progression.
 */

export interface PlatformAnnouncement {
  /** Unique identifier */
  id: string
  /** The announcement text */
  text: string
  /** Category for announcement type */
  category: 'time' | 'atmospheric' | 'philosophical'
  /** Recommended session range */
  sessionRange: [number, number]
}

/**
 * Time-based announcements (Sessions 1-2)
 * Focus on station mechanics and orientation
 */
const timeBasedAnnouncements: PlatformAnnouncement[] = [
  {
    id: 'time_01',
    text: 'The station clock reads neither past nor future. Only the eternal now of becoming.',
    category: 'time',
    sessionRange: [1, 2]
  },
  {
    id: 'time_02',
    text: 'Between platforms, time moves differently here. Some journeys take minutes. Others, a lifetime.',
    category: 'time',
    sessionRange: [1, 2]
  },
  {
    id: 'time_03',
    text: 'The departure board flickers: "ALL TRAINS DEPARTING WHEN READY. NO SCHEDULE BUT YOUR OWN."',
    category: 'time',
    sessionRange: [1, 2]
  },
  {
    id: 'time_04',
    text: 'A voice echoes: "The platform will be here when you return. Some conversations are worth continuing."',
    category: 'time',
    sessionRange: [1, 2]
  },
  {
    id: 'time_05',
    text: 'Morning light filters through the station glass, though it seems to be perpetually dawn here.',
    category: 'time',
    sessionRange: [1, 2]
  },
  {
    id: 'time_06',
    text: 'The station hums with quiet energy. You sense you can leave and return—nothing rushes you.',
    category: 'time',
    sessionRange: [1, 2]
  },
  {
    id: 'time_07',
    text: 'Your ticket glows softly. The conductor nods: "Progress is never lost. Return when you\'re ready."',
    category: 'time',
    sessionRange: [1, 2]
  }
]

/**
 * Atmospheric announcements (Sessions 3-4)
 * Focus on mood, ambiance, character presence
 */
const atmosphericAnnouncements: PlatformAnnouncement[] = [
  {
    id: 'atmo_01',
    text: 'The platform grows quieter. You feel the weight of choices settling like evening mist.',
    category: 'atmospheric',
    sessionRange: [3, 4]
  },
  {
    id: 'atmo_02',
    text: 'Other travelers pass by, each lost in their own becoming. You wonder which paths they\'re exploring.',
    category: 'atmospheric',
    sessionRange: [3, 4]
  },
  {
    id: 'atmo_03',
    text: 'Steam rises from the tracks below. The air smells of possibility and something you can\'t quite name.',
    category: 'atmospheric',
    sessionRange: [3, 4]
  },
  {
    id: 'atmo_04',
    text: 'A distant bell chimes. Not a warning, but a reminder: you are exactly where you need to be.',
    category: 'atmospheric',
    sessionRange: [3, 4]
  },
  {
    id: 'atmo_05',
    text: 'Shadows lengthen across the platform. The characters you\'ve met seem more real than memory.',
    category: 'atmospheric',
    sessionRange: [3, 4]
  },
  {
    id: 'atmo_06',
    text: 'The station walls shimmer. For a moment, you see reflections of who you were and who you might become.',
    category: 'atmospheric',
    sessionRange: [3, 4]
  },
  {
    id: 'atmo_07',
    text: 'Outside, the city continues. Inside, time bends around the conversations that matter.',
    category: 'atmospheric',
    sessionRange: [3, 4]
  }
]

/**
 * Philosophical announcements (Sessions 5+)
 * Focus on identity, transformation, deeper themes
 */
const philosophicalAnnouncements: PlatformAnnouncement[] = [
  {
    id: 'phil_01',
    text: 'The station master once said: "We are not discovering who we are. We are deciding."',
    category: 'philosophical',
    sessionRange: [5, 99]
  },
  {
    id: 'phil_02',
    text: 'Every conversation leaves a mark. You are becoming the shape of your choices.',
    category: 'philosophical',
    sessionRange: [5, 99]
  },
  {
    id: 'phil_03',
    text: 'The tracks diverge and converge. There are no wrong platforms, only different destinations.',
    category: 'philosophical',
    sessionRange: [5, 99]
  },
  {
    id: 'phil_04',
    text: 'You notice patterns in your choices—threads of who you\'re becoming woven through every word.',
    category: 'philosophical',
    sessionRange: [5, 99]
  },
  {
    id: 'phil_05',
    text: 'The journey is not about arriving. It never was. It\'s about the shape you take while traveling.',
    category: 'philosophical',
    sessionRange: [5, 99]
  },
  {
    id: 'phil_06',
    text: 'Some travelers rush through. You\'ve chosen to linger, to listen. That choice itself is an answer.',
    category: 'philosophical',
    sessionRange: [5, 99]
  },
  {
    id: 'phil_07',
    text: 'The station doesn\'t judge. It only offers: another platform, another story, another chance to choose.',
    category: 'philosophical',
    sessionRange: [5, 99]
  }
]

/**
 * All announcements combined
 */
export const allAnnouncements: PlatformAnnouncement[] = [
  ...timeBasedAnnouncements,
  ...atmosphericAnnouncements,
  ...philosophicalAnnouncements
]

/**
 * Select appropriate announcement based on session number
 *
 * @param sessionNumber - Current session number (1-based)
 * @param lastAnnouncementId - Optional: Last announcement shown to avoid repetition
 * @returns Selected platform announcement
 */
export function selectAnnouncement(
  sessionNumber: number,
  lastAnnouncementId?: string
): PlatformAnnouncement {
  // Filter announcements by session range
  const eligible = allAnnouncements.filter(announcement => {
    const [min, max] = announcement.sessionRange
    return sessionNumber >= min && sessionNumber <= max
  })

  // If no eligible announcements (shouldn't happen), use philosophical
  if (eligible.length === 0) {
    return philosophicalAnnouncements[0]
  }

  // Filter out last announcement to avoid immediate repetition
  const candidates = lastAnnouncementId
    ? eligible.filter(a => a.id !== lastAnnouncementId)
    : eligible

  // If all were filtered (only 1 eligible), use the eligible one
  const pool = candidates.length > 0 ? candidates : eligible

  // Select random announcement from pool
  const randomIndex = Math.floor(Math.random() * pool.length)
  return pool[randomIndex]
}

/**
 * Get announcement by category (for testing/debugging)
 */
export function getAnnouncementsByCategory(category: 'time' | 'atmospheric' | 'philosophical'): PlatformAnnouncement[] {
  return allAnnouncements.filter(a => a.category === category)
}

/**
 * Get total count of announcements
 */
export function getAnnouncementCount(): { total: number; byCategory: Record<string, number> } {
  return {
    total: allAnnouncements.length,
    byCategory: {
      time: timeBasedAnnouncements.length,
      atmospheric: atmosphericAnnouncements.length,
      philosophical: philosophicalAnnouncements.length
    }
  }
}
