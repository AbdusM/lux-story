import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CharacterAvatar } from './CharacterAvatar'
import { RichTextRenderer, type RichTextEffect } from './RichTextRenderer'
import { motion } from 'framer-motion'
import { interactionAnimations, type InteractionType } from '@/lib/interaction-parser'
import { getVoiceClass } from '@/lib/voice-utils'
import { getCharacterTyping } from '@/lib/character-typing'

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
  interaction?: InteractionType
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

// Interaction animation variants for Pokémon-style visual feedback
// Moved to lib/interaction-parser.ts

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
  chunkDelay: _chunkDelay = 1500,
  typingDuration: typingDurationProp,
  onComplete,
  className = '',
  interaction,
  emotion,
  playerPatterns: _playerPatterns
}: ChatPacedDialogueProps) {
  // Get character-specific typing config
  const characterTyping = getCharacterTyping(characterName)
  const typingDuration = typingDurationProp ?? characterTyping.typingDuration
  // Split text into chunks by | or \n\n
  const chunks = text
    .split(/\||\n\n/)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0)

  const [visibleChunks, setVisibleChunks] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)
  const [hasShownThinking, setHasShownThinking] = useState(false)

  // Character-specific mental states with contextual synonyms
  // Show various thinking/processing states instead of physical actions
  const getStateText = (): string => {
    // Character-specific defaults
    const characterStates: Record<string, string[]> = {
      'Jordan': ['reflecting', 'considering', 'pondering', 'mulling over'],
      'Maya': ['thinking', 'contemplating', 'processing', 'working through'],
      'Samuel': ['considering', 'reflecting', 'mulling it over', 'taking it in'],
      'Devon': ['processing', 'analyzing', 'computing', 'thinking through'],
      'Narrator': ['pausing', 'taking a moment'],
      'You': ['thinking', 'considering', 'pondering']
    }

    const baseStates = characterStates[characterName] || ['thinking']
    let selectedState = baseStates[0] // Default

    // Adjust based on emotion if provided
    if (emotion) {
      const emotionLower = emotion.toLowerCase()
      if (emotionLower.includes('anxious') || emotionLower.includes('nervous')) {
        // More uncertain/worried states
        const anxiousStates: Record<string, string[]> = {
          'Jordan': ['weighing carefully', 'considering cautiously', 'mulling it over'],
          'Maya': ['trying to process', 'thinking carefully', 'working through it'],
          'Samuel': ['taking it in', 'considering thoughtfully', 'reflecting'],
          'Devon': ['analyzing carefully', 'processing methodically']
        }
        const states = anxiousStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('excited') || emotionLower.includes('enthusiastic')) {
        // More energetic/positive states
        const excitedStates: Record<string, string[]> = {
          'Jordan': ['considering with interest', 'reflecting enthusiastically', 'thinking it over'],
          'Maya': ['thinking excitedly', 'processing with energy', 'working through eagerly'],
          'Samuel': ['taking it in', 'considering with warmth'],
          'Devon': ['analyzing with interest', 'processing enthusiastically']
        }
        const states = excitedStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('vulnerable') || emotionLower.includes('raw')) {
        // More thoughtful/careful states
        const vulnerableStates: Record<string, string[]> = {
          'Jordan': ['carefully considering', 'reflecting thoughtfully', 'taking a moment'],
          'Maya': ['thinking carefully', 'processing slowly', 'working through gently'],
          'Samuel': ['considering deeply', 'reflecting with care'],
          'Devon': ['processing thoughtfully', 'analyzing carefully'],
          'Marcus': ['measuring carefully', 'considering with precision', 'reflecting deeply']
        }
        const states = vulnerableStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('focused') || emotionLower.includes('tense')) {
        // High concentration, precision states
        const focusedStates: Record<string, string[]> = {
          'Marcus': ['concentrating precisely', 'calculating', 'monitoring vitals', 'locked in'],
          'Maya': ['analyzing deeply', 'focusing intently', 'computing', 'in the zone'],
          'Devon': ['zeroing in', 'locking focus', 'dialing in', 'getting precise'],
          'Jordan': ['focusing carefully', 'narrowing in', 'concentrating'],
          'Samuel': ['paying close attention', 'tuning in', 'listening intently']
        }
        const states = focusedStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('clinical') || emotionLower.includes('simulation')) {
        // Professional, technical mode
        const clinicalStates: Record<string, string[]> = {
          'Marcus': ['in the zone', 'running the simulation', 'visualizing the procedure', 'operating'],
          'Maya': ['running diagnostics', 'testing the system', 'debugging'],
          'Devon': ['checking the specs', 'running calculations', 'modeling it out'],
          'Jordan': ['mapping it out', 'planning the approach', 'strategizing']
        }
        const states = clinicalStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('critical') || emotionLower.includes('failure')) {
        // High-stakes crisis moments
        const criticalStates: Record<string, string[]> = {
          'Marcus': ['assessing the damage', 'calculating next move', 'staying focused'],
          'Maya': ['troubleshooting urgently', 'finding the fix', 'working fast'],
          'Devon': ['damage control', 'finding a workaround', 'pivoting quickly'],
          'Jordan': ['regrouping', 'finding a path forward', 'staying steady']
        }
        const states = criticalStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('relieved') || emotionLower.includes('triumphant')) {
        // Success, relief, accomplishment
        const relievedStates: Record<string, string[]> = {
          'Marcus': ['breathing easier', 'feeling the win', 'taking it in'],
          'Maya': ['celebrating quietly', 'soaking it in', 'feeling proud'],
          'Devon': ['riding the high', 'taking a victory lap', 'feeling it'],
          'Jordan': ['smiling', 'feeling good', 'appreciating the moment']
        }
        const states = relievedStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('conflicted') || emotionLower.includes('torn')) {
        // Internal struggle, tough decisions
        const conflictedStates: Record<string, string[]> = {
          'Marcus': ['weighing both sides', 'wrestling with it', 'torn'],
          'Maya': ['seeing both angles', 'struggling with it', 'uncertain'],
          'Devon': ['pulled both ways', 'not sure', 'grappling with it'],
          'Jordan': ['feeling the tension', 'working through it', 'finding balance']
        }
        const states = conflictedStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('inspired') || emotionLower.includes('motivated')) {
        // Energized, driven, passionate
        const inspiredStates: Record<string, string[]> = {
          'Marcus': ['feeling the drive', 'getting fired up', 'energized'],
          'Maya': ['getting excited', 'feeling the spark', 'charged up'],
          'Devon': ['pumped up', 'ready to go', 'feeling it'],
          'Jordan': ['inspired', 'feeling hopeful', 'energized']
        }
        const states = inspiredStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('grateful') || emotionLower.includes('thankful')) {
        // Appreciation, warmth
        const gratefulStates: Record<string, string[]> = {
          'Marcus': ['appreciating this', 'feeling thankful', 'touched'],
          'Maya': ['grateful', 'feeling warm', 'appreciative'],
          'Devon': ['thankful', 'feeling it', 'grateful'],
          'Jordan': ['touched', 'appreciating this moment', 'feeling grateful']
        }
        const states = gratefulStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('heavy') || emotionLower.includes('burdened') || emotionLower.includes('weighted')) {
        // Weight of responsibility, gravity
        const heavyStates: Record<string, string[]> = {
          'Marcus': ['feeling the weight', 'carrying it', 'bearing the responsibility'],
          'Maya': ['feeling the gravity', 'taking it seriously', 'understanding the weight'],
          'Devon': ['feeling it heavy', 'shouldering it', 'carrying the load'],
          'Jordan': ['feeling the heaviness', 'taking it in', 'processing the weight']
        }
        const states = heavyStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('proud')) {
        // Pride, accomplishment
        const proudStates: Record<string, string[]> = {
          'Marcus': ['feeling proud', 'standing tall', 'owning it'],
          'Maya': ['proud of this', 'feeling accomplished', 'satisfied'],
          'Devon': ['feeling good about it', 'proud', 'accomplished'],
          'Jordan': ['proud', 'feeling accomplished', 'satisfied']
        }
        const states = proudStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else if (emotionLower.includes('exhausted') || emotionLower.includes('drained')) {
        // Tired but functioning
        const exhaustedStates: Record<string, string[]> = {
          'Marcus': ['pushing through tired', 'running on fumes', 'keeping it together'],
          'Maya': ['tired but focused', 'exhausted but present', 'drained'],
          'Devon': ['running low', 'pushing through it', 'tired'],
          'Jordan': ['feeling drained', 'tired', 'pushing through']
        }
        const states = exhaustedStates[characterName] || baseStates
        selectedState = states[Math.floor(Math.random() * states.length)]
      } else {
        // Default: randomize from base states
        selectedState = baseStates[Math.floor(Math.random() * baseStates.length)]
      }
    } else {
      // No emotion: randomize from base states
      selectedState = baseStates[Math.floor(Math.random() * baseStates.length)]
    }

    return selectedState
  }

  const stateText = getStateText()

  // Get voice typography for this character
  const voiceClass = getVoiceClass(characterName)

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

    // Only show thinking indicator for the FIRST chunk (less is more)
    // Subsequent chunks flow naturally without interruption
    const shouldShowThinking = currentChunkIndex === 0 && !hasShownThinking

    if (shouldShowThinking) {
      setIsTyping(true)
      setHasShownThinking(true)

      const typingTimer = setTimeout(() => {
        setIsTyping(false)
        // Add the first chunk
        setVisibleChunks(prev => [...prev, chunks[currentChunkIndex]])
        setCurrentChunkIndex(prev => prev + 1)
      }, typingDuration)

      return () => clearTimeout(typingTimer)
    } else {
      // For subsequent chunks, just add them with a natural pause (no thinking indicator)
      const pauseTimer = setTimeout(() => {
        setVisibleChunks(prev => [...prev, chunks[currentChunkIndex]])
        setCurrentChunkIndex(prev => prev + 1)
      }, 600) // Shorter natural pause between lines

      return () => clearTimeout(pauseTimer)
    }
  }, [currentChunkIndex, chunks, typingDuration, onComplete, hasShownThinking])

  return (
    <div
      className={`chat-paced-dialogue ${className}`}
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-label={`${characterName} is speaking`}
    >
      {/* No inline avatars - handled by top bar */}
      <div className="space-y-6 sm:space-y-8">
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

          const bubbleContent = (
            <div
              key={index}
              className={cn("chat-bubble", interactionClass)}
              style={{ transition: 'none' }}
            >
              <RichTextRenderer
                text={chunk}
                effects={chatPacingEffect}
                className={cn("text-base leading-relaxed", voiceClass)}
              />
            </div>
          )

          // Apply interaction animation if specified
          if (interaction && interactionAnimations[interaction]) {
            return (
              <motion.div key={index} {...interactionAnimations[interaction]}>
                {bubbleContent}
              </motion.div>
            )
          }

          return bubbleContent
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

