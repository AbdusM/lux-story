"use client"

/**
 * CharacterAvatar Component
 * Displays character-specific pixel art avatars (Zootopia-style animals)
 *
 * UX Safeguards:
 * - Only renders for valid character names
 * - Mobile-responsive sizing
 * - Respects reduced motion preferences
 * - Accessible with proper ARIA labels
 */

import { cn } from '@/lib/utils'
import { PixelAvatar, type AnimalType } from './PixelAvatar'

export type AvatarEmotion = 'happy' | 'neutral' | 'concerned' | 'angry' | 'surprised' | 'tired' | 'excited'

interface CharacterAvatarProps {
  characterName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isTyping?: boolean
  showAvatar?: boolean // Explicit control from parent
  className?: string
  emotion?: AvatarEmotion
  trustLevel?: number // 0-10
}

// Character-specific avatar configuration mapping names to animal types
// Updated Dec 2024: Correct character-to-animal mappings per design spec
const characterAvatars: Record<string, { animal: AnimalType; name: string }> = {
  'Samuel': { animal: 'owl', name: 'Samuel Washington' },    // The conductor - wise owl
  'Maya': { animal: 'cat', name: 'Maya' },                   // Clever, resourceful - gray tabby cat
  'Tess': { animal: 'fox', name: 'Tess' },                   // Warm, guiding - red fox
  'Devon': { animal: 'deer', name: 'Devon' },                // Gentle, thoughtful - deer
  'Marcus': { animal: 'bear', name: 'Marcus' },              // Warm, nurturing - brown bear
  'Rohan': { animal: 'raven', name: 'Rohan' },               // Mysterious, introspective - raven
  'Yaquin': { animal: 'rabbit', name: 'Yaquin' },            // Gentle, curious - cream rabbit
  'Lira': { animal: 'butterfly', name: 'Lira' },             // Ethereal, transformative - butterfly
  'Jordan': { animal: 'chameleon', name: 'Jordan' },         // Adaptable, versatile
  'Kai': { animal: 'dog', name: 'Kai' },                     // Loyal, protective
  'Alex': { animal: 'raccoon', name: 'Alex' },               // Credential skeptic - clever raccoon
  'Silas': { animal: 'mouse', name: 'Silas' },               // Precise, detail-oriented
  'Elena': { animal: 'owl', name: 'Elena' },                 // Wise, archival - barn owl variant
  'Grace': { animal: 'rabbit', name: 'Grace' },              // Gentle, caring - soft rabbit
  'Asha': { animal: 'owl', name: 'Asha' },                    // Peaceful, mediating - wise observer
  'Zara': { animal: 'cat', name: 'Zara' },                   // Observant, ethical - sleek cat
  // LinkedIn 2026 Career Expansion
  'Quinn': { animal: 'hedgehog', name: 'Quinn Montgomery' }, // Analytical, protected - hedgehog
  'Dante': { animal: 'peacock', name: 'Dante Reyes' },       // Charismatic, colorful - peacock
  'Nadia': { animal: 'barnowl', name: 'Nadia Okonkwo' },     // Wise, observant - barn owl
  'Isaiah': { animal: 'elephant', name: 'Isaiah Brooks' },   // Strong, community - elephant
  // Player and location avatars
  'You': { animal: 'player', name: 'You' },                   // Player avatar
  'Player': { animal: 'player', name: 'Player' },              // Player avatar alias
  'Sector 0': { animal: 'owl', name: 'The Station' },
  'Sector 1: The Grand Hall': { animal: 'owl', name: 'The Hall' },
  'Sector 2: The Asset Exchange': { animal: 'owl', name: 'The Broker' },
  'Sector 3: The Core': { animal: 'owl', name: 'The Origin' }
}

// Helper to find partial matches (e.g. "Devon Kumar" -> "Devon")
function getCharacterConfig(name: string) {
  const normalized = name.toLowerCase()
  const key = Object.keys(characterAvatars).find(k =>
    normalized.includes(k.toLowerCase()) ||
    characterAvatars[k].name.toLowerCase().includes(normalized)
  )
  return key ? characterAvatars[key] : null
}

// Size configurations mapping to pixel sizes
const sizeMap = {
  sm: 32,   // Small: 32px
  md: 40,   // Medium: 40px
  lg: 48,   // Large: 48px
  xl: 64    // Extra large: 64px
}

export function CharacterAvatar({
  characterName,
  size = 'md',
  isTyping = false,
  showAvatar = true,
  className,
}: CharacterAvatarProps) {
  // Safeguard: Don't render if explicitly hidden
  if (!showAvatar) return null

  // Fuzzy match character config
  const character = getCharacterConfig(characterName)

  // Safeguard: Check if valid character found
  if (!character) {
    return null
  }

  // Safeguard: Don't show avatar for player
  if (character.name === 'You') return null

  // Get pixel size for avatar
  const pixelSize = sizeMap[size]

  return (
    <div
      className={cn(
        // Base styles
        'relative flex-shrink-0',

        // Animations (respects prefers-reduced-motion)
        'transition-all duration-300 ease-out',
        'motion-reduce:transition-none',

        // Typing state
        isTyping && 'animate-pulse',

        // Custom classes
        className
      )}
      role="img"
      aria-label={`${character.name} avatar`}
    >
      <PixelAvatar
        animal={character.animal}
        size={pixelSize}
      />
    </div>
  )
}

/**
 * Helper function to determine if avatar should be shown
 * Call this from parent components to check before rendering
 */
export function shouldShowAvatar(
  characterName: string | undefined,
  isContinuedSpeaker: boolean = false,
  isNarration: boolean = false
): boolean {
  // Don't show if no character name
  if (!characterName) return false

  // Don't show for continued speakers (avoid duplication)
  if (isContinuedSpeaker) return false

  // Don't show for narration
  if (isNarration) return false

  // Don't show for player
  if (characterName.toLowerCase() === 'you') return false

  // Check if valid character exists (fuzzy match)
  return !!getCharacterConfig(characterName)
}

/**
 * PlayerAvatar Component
 * Displays the player's own avatar (human silhouette)
 */
interface PlayerAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function PlayerAvatar({
  size = 'md',
  className,
}: PlayerAvatarProps) {
  const pixelSize = sizeMap[size]

  return (
    <div
      className={cn(
        'relative flex-shrink-0',
        'transition-all duration-300 ease-out',
        'motion-reduce:transition-none',
        className
      )}
      role="img"
      aria-label="Your avatar"
    >
      <PixelAvatar
        animal="player"
        size={pixelSize}
      />
    </div>
  )
}

