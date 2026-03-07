import type { SerializableGameState } from '@/lib/character-state'
import { getDominantPattern } from '@/lib/narrative-derivatives'

const CHARACTER_LABELS: Record<string, string> = {
  samuel: 'Samuel Washington',
  maya: 'Maya Chen',
  devon: 'Devon Brooks',
  jordan: 'Jordan Ellis',
  marcus: 'Marcus Chen',
  tess: 'Tess Monroe',
  yaquin: 'Yaquin Vega',
  kai: 'Kai Rowan',
  alex: 'Alex Mercer',
  rohan: 'Rohan Iqbal',
  silas: 'Silas Reed',
  elena: 'Elena Torres',
  grace: 'Grace Holloway',
  asha: 'Asha Raman',
  lira: 'Lira Vale',
  zara: 'Zara Okafor',
  quinn: 'Quinn Mercer',
  dante: 'Dante Brooks',
  nadia: 'Nadia Rahman',
  isaiah: 'Isaiah Cole',
  station_entry: 'Station Entry',
  grand_hall: 'Grand Hall',
  market: 'Market District',
  deep_station: 'Deep Station',
}

const PATTERN_COPY = {
  analytical: {
    label: 'Analytical',
    summary: 'You look for structure before you commit to a path.',
  },
  helping: {
    label: 'Helping',
    summary: 'You notice the people in the room before the system around them.',
  },
  building: {
    label: 'Building',
    summary: 'You want to shape the route with your own hands.',
  },
  patience: {
    label: 'Patience',
    summary: 'You hold the moment long enough to hear what it is really asking.',
  },
  exploring: {
    label: 'Exploring',
    summary: 'You move toward what might open next instead of what looks settled.',
  },
} as const

const NON_TRAVELER_IDS = new Set(['station_entry', 'grand_hall', 'market', 'deep_station'])

function humanizeCharacterLabel(characterId: string): string {
  if (CHARACTER_LABELS[characterId]) {
    return CHARACTER_LABELS[characterId]
  }

  return characterId
    .split(/[_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export interface JourneyLaneSummary {
  hasJourney: boolean
  episodeNumber: number
  heldRouteLabel: string
  heldRouteNote: string
  dominantPatternLabel: string
  dominantPatternSummary: string
  dominantPatternScore: number
  voicesReachedCount: number
  openReturnsCount: number
  nextReturnLabel: string | null
  openReturnsNote: string
  unlockedAbilitiesCount: number
}

export function deriveJourneyLaneSummary(
  snapshot: SerializableGameState | null | undefined
): JourneyLaneSummary {
  if (!snapshot) {
    return {
      hasJourney: false,
      episodeNumber: 0,
      heldRouteLabel: 'No saved route',
      heldRouteNote: 'Start a journey on this device and the station will hold your place here.',
      dominantPatternLabel: 'Unread',
      dominantPatternSummary: 'The station has not seen enough yet to name your strongest signal.',
      dominantPatternScore: 0,
      voicesReachedCount: 0,
      openReturnsCount: 0,
      nextReturnLabel: null,
      openReturnsNote: 'No held returns yet.',
      unlockedAbilitiesCount: 0,
    }
  }

  const dominantPattern = getDominantPattern(snapshot.patterns)
  const patternCopy = PATTERN_COPY[dominantPattern]
  const readyReturns = snapshot.pendingCheckIns.filter((checkIn) => checkIn.sessionsRemaining <= 0)
  const nextReturnLabel = readyReturns[0]
    ? humanizeCharacterLabel(readyReturns[0].characterId)
    : null
  const heldRouteLabel = humanizeCharacterLabel(snapshot.currentCharacterId)
  const voicesReachedCount = snapshot.characters.filter((character) => {
    if (NON_TRAVELER_IDS.has(character.characterId)) return false
    return character.conversationHistory.length > 0
  }).length

  return {
    hasJourney: true,
    episodeNumber: snapshot.episodeNumber || 1,
    heldRouteLabel,
    heldRouteNote: readyReturns.length > 0
      ? `${heldRouteLabel} is where the station last held you before another return signal arrived.`
      : `${heldRouteLabel} is the last route the station held in your hands.`,
    dominantPatternLabel: patternCopy.label,
    dominantPatternSummary: patternCopy.summary,
    dominantPatternScore: snapshot.patterns[dominantPattern] ?? 0,
    voicesReachedCount,
    openReturnsCount: readyReturns.length,
    nextReturnLabel,
    openReturnsNote: nextReturnLabel
      ? `${nextReturnLabel} has something ready when you step back onto the platform.`
      : 'No held route is waiting on this device right now.',
    unlockedAbilitiesCount: snapshot.unlockedAbilities.length,
  }
}
