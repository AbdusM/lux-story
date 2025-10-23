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

interface CharacterAvatarProps {
  characterName: string
  size?: 'sm' | 'md' | 'lg'
  isTyping?: boolean
  showAvatar?: boolean // Explicit control from parent
  className?: string
}

// Character-specific avatar configuration
const characterAvatars = {
  Maya: { emoji: '🤖', gradient: 'from-blue-400 to-blue-600', name: 'Maya Chen' },
  Devon: { emoji: '🏗️', gradient: 'from-orange-400 to-orange-600', name: 'Devon Kumar' },
  Jordan: { emoji: '💼', gradient: 'from-purple-400 to-purple-600', name: 'Jordan Packard' },
  Samuel: { emoji: '🚂', gradient: 'from-amber-400 to-amber-600', name: 'Samuel' },
  You: { emoji: '👤', gradient: 'from-emerald-400 to-emerald-600', name: 'You' }
} as const

type CharacterName = keyof typeof characterAvatars

// Size configurations (mobile-first responsive)
const sizeClasses = {
  sm: 'w-8 h-8 sm:w-10 sm:h-10 text-lg sm:text-xl',      // Mobile: 32px, Desktop: 40px
  md: 'w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl',   // Mobile: 40px, Desktop: 48px
  lg: 'w-12 h-12 sm:w-16 sm:h-16 text-2xl sm:text-3xl'   // Mobile: 48px, Desktop: 64px
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

  // Safeguard: Normalize character name (handle case variations)
  const normalizedName = characterName.charAt(0).toUpperCase() + characterName.slice(1).toLowerCase()
  
  // Safeguard: Check if this is a valid character
  const character = characterAvatars[normalizedName as CharacterName]
  if (!character) return null

  // Safeguard: Don't show avatar for player
  if (normalizedName === 'You') return null

  return (
    <div
      className={cn(
        // Base styles
        'flex-shrink-0 rounded-full flex items-center justify-center',
        'bg-gradient-to-br',
        character.gradient,
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
      <span className="select-none" aria-hidden="true">
        {character.emoji}
      </span>
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
  
  // Check if valid character exists
  const normalizedName = characterName.charAt(0).toUpperCase() + characterName.slice(1).toLowerCase()
  return normalizedName in characterAvatars
}

