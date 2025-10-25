import React, { useState, useEffect } from 'react'
import { CharacterAvatar } from './CharacterAvatar'

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
}

/**
 * ChatPacedDialogue - Sequential message display with typing indicators
 * 
 * Simulates a real-time messaging experience by:
 * 1. Showing typing indicator ("...") 
 * 2. Revealing one chunk at a time
 * 3. Adding natural pauses between messages
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
  className = ''
}: ChatPacedDialogueProps) {
  // Split text into chunks by | or \n\n
  const chunks = text
    .split(/\||\n\n/)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0)

  const [visibleChunks, setVisibleChunks] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)

  useEffect(() => {
    if (currentChunkIndex >= chunks.length) {
      // All chunks displayed
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
        {/* Visible chunks */}
        {visibleChunks.map((chunk, index) => (
          <div
            key={index}
            className="chat-bubble animate-fade-in"
            style={{
              animation: 'fadeIn 0.3s ease-in'
            }}
          >
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {chunk}
            </p>
          </div>
        ))}

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
                {characterName} is typing...
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

