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
const characterAvatars: Record<string, { animal: AnimalType; name: string }> = {
  'Devon': { animal: 'fox', name: 'Devon' },
  'Rohan': { animal: 'owl', name: 'Rohan' },
  'Maya': { animal: 'raccoon', name: 'Maya' },
  'Tess': { animal: 'bear', name: 'Tess' },
  'Jordan': { animal: 'chameleon', name: 'Jordan' },
  'Kai': { animal: 'dog', name: 'Kai' },
  'Silas': { animal: 'mouse', name: 'Silas' },
  'Yaquin': { animal: 'parrot', name: 'Yaquin' },
  'Samuel': { animal: 'owl', name: 'Samuel Washington' }, // The conductor - wise owl
  'You': { animal: 'fox', name: 'You' } // Player - hidden anyway
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

