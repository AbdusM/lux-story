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

interface CharacterAvatarProps {
  characterName: string
  size?: 'sm' | 'md' | 'lg'
  isTyping?: boolean
  showAvatar?: boolean // Explicit control from parent
  className?: string
}

// Character-specific avatar configuration using DiceBear with realistic gender alignment
const characterAvatars = {
  'Maya Chen': { 
    seed: 'maya-chen-female-robotics', 
    backgroundColor: '3b82f6,60a5fa,93c5fd', // Blue gradient
    name: 'Maya Chen',
    style: 'avataaars' // More realistic style
  },
  'Devon Kumar': { 
    seed: 'devon-kumar-male-construction', 
    backgroundColor: 'f97316,fb923c,fdba74', // Orange gradient
    name: 'Devon Kumar',
    style: 'avataaars' // More realistic style
  },
  'Jordan Packard': { 
    seed: 'jordan-packard-female-career', 
    backgroundColor: '8b5cf6,a78bfa,c4b5fd', // Purple gradient
    name: 'Jordan Packard',
    style: 'avataaars' // More realistic style
  },
  'Samuel Washington': { 
    seed: 'samuel-washington-male-conductor', 
    backgroundColor: 'f59e0b,fbbf24,fde047', // Amber gradient
    name: 'Samuel Washington',
    style: 'avataaars' // More realistic style
  },
  'You': { 
    seed: 'you-player-neutral', 
    backgroundColor: '10b981,34d399,6ee7b7', // Green gradient
    name: 'You',
    style: 'avataaars' // More realistic style
  }
} as const

type CharacterName = keyof typeof characterAvatars

// Size configurations (mobile-first responsive)
const sizeClasses = {
  sm: 'w-8 h-8 sm:w-10 sm:h-10',      // Mobile: 32px, Desktop: 40px
  md: 'w-10 h-10 sm:w-12 sm:h-12',     // Mobile: 40px, Desktop: 48px
  lg: 'w-12 h-12 sm:w-16 sm:h-16'      // Mobile: 48px, Desktop: 64px
}

export function CharacterAvatar({
  characterName,
  size = 'md',
  isTyping = false,
  showAvatar = true,
  className
}: CharacterAvatarProps) {
  // Safeguard: Don't render if explicitly hidden
  if (!showAvatar) return null

  // Safeguard: Check if this is a valid character (exact match)
  const character = characterAvatars[characterName as CharacterName]
  if (!character) {
    return null
  }

  // Safeguard: Don't show avatar for player
  if (characterName === 'You') return null

  // Generate DiceBear avatar URL with more realistic style
  const avatarSize = size === 'sm' ? '32' : size === 'md' ? '40' : '64'
  const avatarUrl = `https://api.dicebear.com/7.x/${character.style}/svg?seed=${encodeURIComponent(character.seed)}&backgroundColor=${character.backgroundColor}&backgroundType=gradientLinear&size=${avatarSize}`

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
      aria-label={`${character.name} avatar`}
    >
      <Image
        src={avatarUrl}
        alt={`${character.name} avatar`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 48px, 64px"
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
  
  // Check if valid character exists (exact match)
  return characterName in characterAvatars
}

