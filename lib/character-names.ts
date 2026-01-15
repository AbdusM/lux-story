/**
 * Character Name Utilities
 * Single source of truth for character display names
 *
 * Derives from CHARACTER_NODES in constellation/character-positions.ts
 */

import { CHARACTER_NODES } from '@/lib/constellation/character-positions'
import type { CharacterId } from '@/lib/graph-registry'

/**
 * Pre-computed name lookup maps for O(1) access
 * Generated from CHARACTER_NODES at module load time
 */
const nameMap = new Map<string, string>()
const fullNameMap = new Map<string, string>()

// Build lookup maps from authoritative source
CHARACTER_NODES.forEach(node => {
  nameMap.set(node.id, node.name)
  fullNameMap.set(node.id, node.fullName)
})

/**
 * Get character's short display name (e.g., "Samuel", "Maya")
 * Falls back to capitalizing the ID if not found
 */
export function getCharacterName(characterId: string): string {
  return nameMap.get(characterId.toLowerCase())
    ?? characterId.charAt(0).toUpperCase() + characterId.slice(1)
}

/**
 * Get character's full display name (e.g., "Samuel Washington", "Maya Chen")
 * Falls back to short name if full name not available
 */
export function getCharacterFullName(characterId: string): string {
  return fullNameMap.get(characterId.toLowerCase())
    ?? getCharacterName(characterId)
}

/**
 * Type-safe version for known CharacterIds
 */
export function getCharacterNameTyped(characterId: CharacterId): string {
  return nameMap.get(characterId) ?? characterId
}

/**
 * Lookup map for backward compatibility
 * @deprecated Use getCharacterName() or getCharacterFullName() instead
 */
export const CHARACTER_NAMES: Record<string, string> = Object.fromEntries(nameMap)

/**
 * Full names lookup for backward compatibility
 * @deprecated Use getCharacterFullName() instead
 */
export const CHARACTER_FULL_NAMES: Record<string, string> = Object.fromEntries(fullNameMap)
