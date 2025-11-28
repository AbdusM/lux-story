"use client"

/**
 * CharacterAvatar Component
 * Displays character-specific emoji avatars with gradient backgrounds
 * 
 * UX Safeguards:
 * - Only renders for valid character names
 * - Mobile-responsive sizing
 * - Respects reduced motion preferences
 * - Accessible with proper ARIA labels
 */

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useMemo } from 'react'

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

// Character-specific avatar configuration using DiceBear with realistic gender alignment
const characterAvatars = {
  'Maya': { 
    seed: 'maya-chen-female-robotics', 
    backgroundColor: '3b82f6,60a5fa,93c5fd', // Blue gradient
    name: 'Maya Chen',
    style: 'avataaars'
  },
  'Devon': { 
    seed: 'devon-kumar-male-construction', 
    backgroundColor: 'f97316,fb923c,fdba74', // Orange gradient
    name: 'Devon Kumar',
    style: 'avataaars'
  },
  'Jordan': { 
    seed: 'jordan-packard-female-career', 
    backgroundColor: '8b5cf6,a78bfa,c4b5fd', // Purple gradient
    name: 'Jordan Packard',
    style: 'avataaars'
  },
  'Samuel': { 
    seed: 'samuel-washington-male-conductor', 
    backgroundColor: 'f59e0b,fbbf24,fde047', // Amber gradient
    name: 'Samuel Washington',
    style: 'avataaars'
  },
  'Kai': {
    seed: 'kai-system-admin',
    backgroundColor: '1e1b4b,312e81,4338ca', // Indigo/Dark gradient
    name: 'Kai',
    style: 'avataaars'
  },
  'You': { 
    seed: 'you-player-neutral', 
    backgroundColor: '10b981,34d399,6ee7b7', // Green gradient
    name: 'You',
    style: 'avataaars'
  }
} as const

// Helper to find partial matches (e.g. "Samuel" -> "Samuel Washington")
function getCharacterConfig(name: string) {
  const normalized = name.toLowerCase()
  const key = Object.keys(characterAvatars).find(k => 
    normalized.includes(k.toLowerCase()) || 
    characterAvatars[k as keyof typeof characterAvatars].name.toLowerCase().includes(normalized)
  )
  return key ? characterAvatars[key as keyof typeof characterAvatars] : null
}

// Size configurations (mobile-first responsive)
const sizeClasses = {
  sm: 'w-8 h-8 sm:w-10 sm:h-10',      // Mobile: 32px, Desktop: 40px
  md: 'w-10 h-10 sm:w-12 sm:h-12',     // Mobile: 40px, Desktop: 48px
  lg: 'w-12 h-12 sm:w-16 sm:h-16',     // Mobile: 48px, Desktop: 64px
  xl: 'w-20 h-20 sm:w-24 sm:h-24'      // Mobile: 80px, Desktop: 96px
}

// Map emotions/trust to DiceBear API parameters
function getExpressionParams(emotion?: AvatarEmotion, trustLevel?: number) {
  // Base defaults
  let params = {
    mouth: 'default',
    eyebrows: 'default',
    eyes: 'default'
  }

  // 1. Apply Trust Level Defaults (if no explicit emotion)
  if (!emotion && typeof trustLevel === 'number') {
    if (trustLevel >= 8) {
      params.mouth = 'smile'
      params.eyebrows = 'default'
    } else if (trustLevel <= 3) {
      params.mouth = 'serious'
      params.eyebrows = 'concerned'
    }
  }

  // 2. Apply Explicit Emotion (Overrides trust)
  if (emotion) {
    switch (emotion) {
      case 'happy':
      case 'excited':
        params.mouth = 'smile'
        params.eyebrows = 'raisedExcited'
        break
      case 'concerned':
        params.mouth = 'concerned'
        params.eyebrows = 'sad'
        break
      case 'angry':
        params.mouth = 'serious'
        params.eyebrows = 'angry'
        break
      case 'surprised':
        params.mouth = 'screamOpen'
        params.eyebrows = 'up'
        break
      case 'tired':
        params.eyes = 'closed'
        params.mouth = 'serious'
        break
      case 'neutral':
      default:
        params.mouth = 'default'
        params.eyebrows = 'default'
        break
    }
  }

  return params
}

export function CharacterAvatar({
  characterName,
  size = 'md',
  isTyping = false,
  showAvatar = true,
  className,
  emotion,
  trustLevel
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

  // Generate DiceBear avatar URL with dynamic expression
  const avatarSize = size === 'sm' ? '32' : size === 'md' ? '40' : size === 'lg' ? '64' : '96'
  const expression = getExpressionParams(emotion, trustLevel)
  
  // Construct URL with all params
  const avatarUrl = `https://api.dicebear.com/7.x/${character.style}/svg?seed=${encodeURIComponent(character.seed)}&backgroundColor=${character.backgroundColor}&backgroundType=gradientLinear&size=${avatarSize}&mouth=${expression.mouth}&eyebrows=${expression.eyebrows}&eyes=${expression.eyes}`

  return (
    <div
      className={cn(
        // Base styles
        'relative flex-shrink-0 rounded-full overflow-hidden',
        'shadow-sm border-2 border-white/20',
        
        // Size
        sizeClasses[size],
        
        // Animations (respects prefers-reduced-motion)
        'transition-all duration-300 ease-out',
        'motion-reduce:transition-none',
        
        // Typing state
        isTyping && 'animate-pulse',
        
        // Custom classes
        className
      )}
      role="img"
      aria-label={`${character.name} avatar (${emotion || 'neutral'})`}
    >
      <Image
        src={avatarUrl}
        alt={`${character.name} avatar`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 48px, 96px"
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

