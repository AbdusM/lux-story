/**
 * Platform Mapping - Maps characters to their career platforms
 * Used by Constellation view to show platform resonance indicators
 *
 * TD-005: Platform Resonance UI
 */

import type { CharacterId } from '@/lib/graph-registry'

export interface PlatformInfo {
  id: string
  name: string
  color: string  // Tailwind color for glow effect
  hue: number    // HSL hue for dynamic styling
}

/**
 * Platform definitions with visual styling
 */
export const PLATFORMS: Record<string, PlatformInfo> = {
  'platform-1': {
    id: 'platform-1',
    name: 'The Care Line',
    color: 'rose',
    hue: 350  // Rose/pink
  },
  'platform-3': {
    id: 'platform-3',
    name: "The Builder's Track",
    color: 'orange',
    hue: 30   // Orange/amber
  },
  'platform-7': {
    id: 'platform-7',
    name: 'The Data Stream',
    color: 'blue',
    hue: 210  // Blue
  },
  'platform-9': {
    id: 'platform-9',
    name: 'The Growing Garden',
    color: 'emerald',
    hue: 150  // Green
  },
  'platform-forgotten': {
    id: 'platform-forgotten',
    name: 'The Forgotten Platform',
    color: 'slate',
    hue: 220  // Blue-gray
  },
  'platform-7-half': {
    id: 'platform-7-half',
    name: 'The Creative Junction',
    color: 'purple',
    hue: 280  // Purple
  }
}

/**
 * Maps characters to their primary career platform
 * Used to show platform resonance in constellation view
 */
export const CHARACTER_PLATFORM_MAP: Partial<Record<CharacterId, string>> = {
  // Technology / Data Stream (platform-7)
  'maya': 'platform-7',
  'devon': 'platform-7',
  'rohan': 'platform-7',
  'nadia': 'platform-7',

  // Healthcare / Care Line (platform-1)
  'marcus': 'platform-1',
  'grace': 'platform-1',
  'kai': 'platform-1',

  // Engineering / Builder's Track (platform-3)
  'silas': 'platform-3',
  'alex': 'platform-3',

  // Creative / Creative Junction (platform-7-half)
  'lira': 'platform-7-half',
  'zara': 'platform-7-half',
  'yaquin': 'platform-7-half',

  // Social Impact / Growing Garden (platform-9)
  'tess': 'platform-9',
  'jordan': 'platform-9',
  'asha': 'platform-9',
  'isaiah': 'platform-9',

  // Business
  'quinn': 'platform-3',
  'dante': 'platform-3',
}

/**
 * Get platform info for a character
 */
export function getCharacterPlatform(characterId: CharacterId): PlatformInfo | null {
  const platformId = CHARACTER_PLATFORM_MAP[characterId]
  if (!platformId) return null
  return PLATFORMS[platformId] || null
}

/**
 * Get all characters for a platform
 */
export function getCharactersForPlatform(platformId: string): CharacterId[] {
  return Object.entries(CHARACTER_PLATFORM_MAP)
    .filter(([_, pid]) => pid === platformId)
    .map(([charId]) => charId as CharacterId)
}
