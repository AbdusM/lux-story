import type { CharacterId } from './graph-registry'
import type { SoundType } from './audio-feedback'
import type { FactionId } from './lore-system'

export type FactionAudioId =
  | FactionId
  | 'technocrats'
  | 'naturalists'
  | 'market_brokerage'

export interface FactionLeitmotifProfile {
  id: FactionAudioId
  label: string
  instrumentation: string
  ambience: string
  soundCue: SoundType
  tagAliases: string[]
}

export const FACTION_LEITMOTIF_PROFILES: readonly FactionLeitmotifProfile[] = [
  {
    id: 'engineers',
    label: 'Engineers',
    instrumentation: 'Percussive metal, pump rhythms',
    ambience: 'Mechanical hum, relay clicks',
    soundCue: 'faction-engineers',
    tagAliases: ['engineers', 'guild_of_engineers', 'hands'],
  },
  {
    id: 'syn_bio',
    label: 'Syn-Bio Collective',
    instrumentation: 'Pulse strings, soft organic synth',
    ambience: 'Incubator hum, wet resonance',
    soundCue: 'faction-syn-bio',
    tagAliases: ['syn_bio', 'syn-bio', 'collective', 'blood'],
  },
  {
    id: 'data_flow',
    label: 'Data-Flow Syndicate',
    instrumentation: 'Glitch sine bursts, modem chirps',
    ambience: 'White noise, packet jitter',
    soundCue: 'faction-data-flow',
    tagAliases: ['data_flow', 'data-flow', 'syndicate', 'ghosts'],
  },
  {
    id: 'station_core',
    label: 'Station Core',
    instrumentation: 'Low drone, sparse harmonic tone',
    ambience: 'Subsonic ventilation rumble',
    soundCue: 'faction-station-core',
    tagAliases: ['station_core', 'station-core', 'core'],
  },
  {
    id: 'technocrats',
    label: 'Technocrats',
    instrumentation: 'Clean synth pings, clipped relays',
    ambience: 'Server room fan wash',
    soundCue: 'faction-technocrats',
    tagAliases: ['technocrats', 'technocrat'],
  },
  {
    id: 'naturalists',
    label: 'Naturalists',
    instrumentation: 'Warm sine flute-like tones',
    ambience: 'Breath, wind-through-vents texture',
    soundCue: 'faction-naturalists',
    tagAliases: ['naturalists', 'naturalist'],
  },
  {
    id: 'market_brokerage',
    label: 'Market Brokerage',
    instrumentation: 'Soft piano-like chime',
    ambience: 'Hushed chamber resonance',
    soundCue: 'faction-market-brokerage',
    tagAliases: ['market_brokerage', 'market-brokerage', 'brokerage'],
  },
]

const PROFILE_BY_ID = new Map(FACTION_LEITMOTIF_PROFILES.map((profile) => [profile.id, profile]))

const CHARACTER_FACTION_MAP: Record<CharacterId, FactionAudioId> = {
  samuel: 'station_core',
  maya: 'engineers',
  devon: 'engineers',
  jordan: 'market_brokerage',
  marcus: 'station_core',
  tess: 'market_brokerage',
  yaquin: 'naturalists',
  kai: 'engineers',
  alex: 'market_brokerage',
  rohan: 'engineers',
  silas: 'naturalists',
  elena: 'data_flow',
  grace: 'naturalists',
  asha: 'naturalists',
  lira: 'naturalists',
  zara: 'data_flow',
  quinn: 'market_brokerage',
  dante: 'market_brokerage',
  nadia: 'data_flow',
  isaiah: 'naturalists',
  station_entry: 'station_core',
  grand_hall: 'station_core',
  market: 'market_brokerage',
  deep_station: 'station_core',
}

function normalizeFaction(value: string): FactionAudioId | null {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_:-]+/g, '')
  if (!normalized) return null

  for (const profile of FACTION_LEITMOTIF_PROFILES) {
    if (profile.id === normalized) return profile.id
    if (profile.tagAliases.includes(normalized)) return profile.id
  }
  return null
}

export function getFactionLeitmotifProfile(factionId: FactionAudioId): FactionLeitmotifProfile | undefined {
  return PROFILE_BY_ID.get(factionId)
}

export function getFactionLeitmotifSoundCue(factionId: FactionAudioId): SoundType | null {
  return getFactionLeitmotifProfile(factionId)?.soundCue ?? null
}

export function extractFactionFromTags(tags: string[] | undefined): FactionAudioId | null {
  if (!tags || tags.length === 0) return null

  for (const tag of tags) {
    if (!tag.startsWith('faction:')) continue
    const maybe = normalizeFaction(tag.slice('faction:'.length))
    if (maybe) return maybe
  }
  return null
}

function hasNarrativeFactionTag(tags: string[]): boolean {
  const triggerTags = new Set([
    'mystery',
    'revelation',
    'climax',
    'station_seven',
    'station_nature',
  ])

  return tags.some((tag) => triggerTags.has(tag) || tag.startsWith('iceberg:'))
}

export function shouldTriggerFactionLeitmotif(tags: string[] | undefined): boolean {
  if (!tags || tags.length === 0) return false
  if (tags.some((tag) => tag.startsWith('faction:'))) return true
  return hasNarrativeFactionTag(tags)
}

export interface InferFactionAudioContextInput {
  tags?: string[]
  characterId?: CharacterId | null
  sourceFaction?: string | null
}

export function inferFactionAudioContext(input: InferFactionAudioContextInput): FactionAudioId | null {
  if (input.sourceFaction) {
    const normalized = normalizeFaction(input.sourceFaction)
    if (normalized) return normalized
  }

  const fromTags = extractFactionFromTags(input.tags)
  if (fromTags) return fromTags

  if (input.characterId) {
    return CHARACTER_FACTION_MAP[input.characterId] ?? null
  }

  return null
}
