import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CharacterAvatar } from './CharacterAvatar'
import { RichTextRenderer, type RichTextEffect } from './RichTextRenderer'

interface ChatPacedDialogueProps {
  /** The dialogue text with chunks separated by | or \n\n */
  text: string
  /** Character name for the typing indicator */
  characterName: string
  /** Show character avatar */
  showAvatar?: boolean
  /** Delay between chunks in milliseconds (default: 1500) */
  chunkDelay?: number
  /** Typing indicator duration in milliseconds (default: 800) */
  typingDuration?: number
  /** Callback when all chunks are displayed */
  onComplete?: () => void
  /** Additional CSS classes */
  className?: string
  /** Visual interaction animation ('big', 'small', 'shake', 'nod', 'ripple', 'bloom', 'jitter') */
  interaction?: string
  /** Player behavior patterns - used to show contextual states */
  playerPatterns?: {
    analytical?: number
    helping?: number
    building?: number
    patience?: number
    exploring?: number
  }
}

/**
 * ChatPacedDialogue - Sequential message display with contextual thinking indicators
 * 
 * Train station context-aware states that subtly reflect player behaviors:
 * 1. Shows contextual state based on character and player patterns
 * 2. Reveals one chunk at a time
 * 3. Adds natural pauses between messages
 * 
 * Use sparingly for high-impact moments to avoid slowing pacing.
 */
export function ChatPacedDialogue({
  text,
  characterName,
  showAvatar = true,
  chunkDelay = 1500,
  typingDuration = 800,
  onComplete,
  className = '',
  interaction,
  playerPatterns
}: ChatPacedDialogueProps) {
  // Split text into chunks by | or \n\n
  const chunks = text
    .split(/\||\n\n/)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0)

  const [visibleChunks, setVisibleChunks] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)

  // Determine contextual state text based on character and player behaviors
  // Train station context: characters are considering, thinking, reflecting - not "typing"
  const getStateText = (): string => {
    // Character-specific defaults for train station context
    const characterStates: Record<string, string> = {
      'Samuel': 'considering',     // Station keeper - thoughtful consideration
      'Maya': 'thinking',          // Student - introspective
      'Devon': 'processing',        // Technical - systematic
      'Jordan': 'reflecting',       // Career advisor - contemplative
      'Narrator': 'pausing',        // Story pauses for emphasis
      'You': 'thinking'             // Player - internal reflection
    }

    let baseState = characterStates[characterName] || 'thinking'

    // Adjust based on player patterns (subtle behavioral reflection)
    // This subtly shows the game recognizing player behaviors without explicit UI
    if (playerPatterns) {
      const dominantPattern = Object.entries(playerPatterns)
        .filter(([_, value]) => value && value > 0)
        .sort(([_, a], [__, b]) => (b || 0) - (a || 0))[0]?.[0]

      // Map player patterns to character states (shows system is aware of player approach)
      if (dominantPattern === 'analytical' && (playerPatterns.analytical || 0) > 2) {
        // Player makes analytical choices - character reflects this in their state
        if (characterName === 'Samuel' || characterName === 'Devon') {
          baseState = 'analyzing'
        }
      } else if (dominantPattern === 'helping' && (playerPatterns.helping || 0) > 2) {
        // Player shows helping behavior - character considers responses carefully
        baseState = 'considering'
      } else if (dominantPattern === 'exploring' && (playerPatterns.exploring || 0) > 2) {
        // Player is curious - character matches exploratory energy
        if (characterName === 'Jordan' || characterName === 'Maya') {
          baseState = 'exploring'
        }
      } else if (dominantPattern === 'patience' && (playerPatterns.patience || 0) > 2) {
        // Player is patient - character takes time to reflect
        baseState = 'reflecting'
      }
    }

    return baseState
  }

  const stateText = getStateText()

  useEffect(() => {
    // If text is empty (loading state), show thinking indicator indefinitely
    if (chunks.length === 0) {
      setIsTyping(true)
      return
    }

    if (currentChunkIndex >= chunks.length) {
      // All chunks displayed
      setIsTyping(false)
      if (onComplete) onComplete()
      return
    }

    // Show typing indicator
    setIsTyping(true)
    
    const typingTimer = setTimeout(() => {
      setIsTyping(false)
      // Add the next chunk
      setVisibleChunks(prev => [...prev, chunks[currentChunkIndex]])
      setCurrentChunkIndex(prev => prev + 1)
    }, typingDuration)

    return () => clearTimeout(typingTimer)
  }, [currentChunkIndex, chunks, typingDuration, onComplete])

  return (
    <div className={`chat-paced-dialogue ${className}`}>
      {/* No inline avatars - handled by top bar */}
      <div className="space-y-3">
        {/* Visible chunks - fade-in for clean text introduction */}
        {visibleChunks.map((chunk, index) => {
          // Use fade-in for clean, elegant text introduction (not typewriter)
          const chatPacingEffect: RichTextEffect = {
            mode: 'fade-in',
            speed: 1.0,
            state: 'default'
          }

          // Get interaction class if provided (applies to all chunks)
          const interactionClass = interaction ? `narrative-interaction-${interaction}` : null

          return (
            <div
              key={index}
              className={cn("chat-bubble", interactionClass)}
              style={{ transition: 'none' }}
            >
              <RichTextRenderer
                text={chunk}
                effects={chatPacingEffect}
                className="text-base leading-relaxed"
              />
            </div>
          )
        })}

        {/* Typing indicator with avatar */}
        {isTyping && (
          <div className="flex items-center gap-2 chat-typing-indicator">
            {showAvatar && (
              <CharacterAvatar 
                characterName={characterName} 
                size="sm"
                isTyping={true}
                showAvatar={showAvatar}
              />
            )}
            <div className="flex-1">
              <span className="text-xs text-muted-foreground italic">
                {characterName} is {stateText}...
              </span>
              <div className="typing-dots">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .chat-bubble {
          background: rgba(255, 255, 255, 0.05);
          border-left: 2px solid rgba(255, 255, 255, 0.2);
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }

        .chat-typing-indicator {
          padding: 0.5rem 0;
          opacity: 0.7;
        }

        .typing-dots {
          display: flex;
          gap: 0.25rem;
        }

        .typing-dots .dot {
          animation: typingDot 1.4s infinite;
          opacity: 0;
        }

        .typing-dots .dot:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-dots .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingDot {
          0%, 60%, 100% {
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

