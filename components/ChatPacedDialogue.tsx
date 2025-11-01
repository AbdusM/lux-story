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
  /** Emotion tag for the dialogue (e.g., 'anxious', 'excited', 'vulnerable') */
  emotion?: string
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
  emotion,
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
  const [usedBehaviors, setUsedBehaviors] = useState<string[]>([]) // Track to avoid repetition
  const [currentBehavioralIndicator, setCurrentBehavioralIndicator] = useState<string>('takes a breath')

  // Character-specific behavioral dictionaries (show, don't tell)
  const characterBehaviors: Record<string, Record<string, string[]>> = {
    'Jordan': {
      default: [
        'taps her pen',
        'checks her notes',
        'adjusts her glasses',
        'takes a breath',
        'looks at her phone'
      ],
      anxious: [
        'taps her pen quickly',
        'fidgets with her phone',
        'takes a shaky breath',
        'checks her notes nervously',
        'adjusts her glasses repeatedly'
      ],
      excited: [
        'taps her pen with energy',
        'grins while checking her notes',
        'straightens up',
        'taps fingers quickly'
      ],
      vulnerable: [
        'takes a deep breath',
        'looks away briefly',
        'runs fingers through her hair',
        'pauses to collect herself'
      ]
    },
    'Maya': {
      default: [
        'fidgets with robotics parts',
        'taps her textbook',
        'takes a deep breath',
        'looks at her scattered notes',
        'adjusts her backpack'
      ],
      anxious: [
        'fidgets nervously with parts',
        'taps her textbook quickly',
        'takes a shaky breath',
        'looks away anxiously',
        'scatters notes nervously'
      ],
      excited: [
        'picks up a robotics part with interest',
        'taps her textbook excitedly',
        'straightens up',
        'eyes light up'
      ],
      vulnerable: [
        'takes a deep breath',
        'looks down at her hands',
        'pauses mid-fidget',
        'collects her scattered thoughts'
      ]
    },
    'Samuel': {
      default: [
        'taps his clipboard',
        'checks the station board',
        'rubs his beard',
        'looks toward Platform 7',
        'adjusts his cap'
      ],
      thoughtful: [
        'rubs his beard thoughtfully',
        'checks the station board',
        'taps his clipboard slowly',
        'looks toward the tracks',
        'takes a measured breath'
      ],
      concerned: [
        'taps his clipboard quickly',
        'checks the board nervously',
        'looks around the station',
        'adjusts his cap'
      ]
    },
    'Devon': {
      default: [
        'adjusts his headset',
        'taps his keyboard',
        'checks his tablet',
        'looks at the code',
        'runs his fingers through his hair'
      ],
      focused: [
        'taps his keyboard methodically',
        'adjusts his headset',
        'studies his tablet',
        'narrows eyes at the screen'
      ],
      anxious: [
        'fidgets with his headset',
        'taps keyboard nervously',
        'checks tablet repeatedly',
        'takes a shaky breath'
      ],
      excited: [
        'taps keyboard with energy',
        'adjusts headset excitedly',
        'straightens up',
        'grins at the screen'
      ]
    }
  }

  // Update behavioral indicator when chunk index changes
  useEffect(() => {
    if (isTyping && currentChunkIndex < chunks.length) {
      const behaviors = characterBehaviors[characterName]
      if (!behaviors) {
        setCurrentBehavioralIndicator(characterName === 'Narrator' ? 'pauses' : 'takes a breath')
        return
      }

      // Determine emotion category from emotion tag
      let emotionCategory = 'default'
      if (emotion) {
        const emotionLower = emotion.toLowerCase()
        if (emotionLower.includes('anxious') || emotionLower.includes('nervous') || emotionLower.includes('worried')) {
          emotionCategory = 'anxious'
        } else if (emotionLower.includes('excited') || emotionLower.includes('enthusiastic') || emotionLower.includes('energetic')) {
          emotionCategory = 'excited'
        } else if (emotionLower.includes('vulnerable') || emotionLower.includes('raw') || emotionLower.includes('open')) {
          emotionCategory = 'vulnerable'
        } else if (emotionLower.includes('thoughtful') || emotionLower.includes('contemplative')) {
          emotionCategory = 'thoughtful'
        } else if (emotionLower.includes('focused') || emotionLower.includes('concentrated')) {
          emotionCategory = 'focused'
        } else if (emotionLower.includes('concerned') || emotionLower.includes('worried')) {
          emotionCategory = 'concerned'
        }
      }

      // Get behavior pool for this emotion category
      const behaviorPool = behaviors[emotionCategory] || behaviors.default || ['takes a breath']
      
      // Filter out recently used behaviors (avoid immediate repetition)
      const availableBehaviors = behaviorPool.filter(b => !usedBehaviors.slice(-2).includes(b))
      const poolToUse = availableBehaviors.length > 0 ? availableBehaviors : behaviorPool

      // Randomly select from pool
      const selectedBehavior = poolToUse[Math.floor(Math.random() * poolToUse.length)]
      
      setCurrentBehavioralIndicator(selectedBehavior)
      setUsedBehaviors(prev => [...prev.slice(-4), selectedBehavior])
    }
  }, [currentChunkIndex, isTyping, characterName, emotion, usedBehaviors])

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
                {characterName} {currentBehavioralIndicator}...
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

