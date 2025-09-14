"use client"

import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState, useRef } from "react"

// Function to parse markdown-style emphasis in text
function parseEmphasisText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let currentIndex = 0
  
  // Regex to match ***text***, **text**, or *text*
  const emphasisRegex = /(\*{1,3})([^*]+?)\1/g
  let match: RegExpExecArray | null
  
  while ((match = emphasisRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(text.slice(currentIndex, match.index))
    }
    
    const emphasisLevel = match[1].length
    const content = match[2]
    
    if (emphasisLevel === 3) {
      // Triple asterisk: strong + em (urgent)
      parts.push(<strong key={match.index}><em>{content}</em></strong>)
    } else if (emphasisLevel === 2) {
      // Double asterisk: strong
      parts.push(<strong key={match.index}>{content}</strong>)
    } else {
      // Single asterisk: em
      parts.push(<em key={match.index}>{content}</em>)
    }
    
    currentIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex))
  }
  
  return parts.length > 0 ? parts : [text]
}

interface StreamingMessageProps {
  speaker: string
  textChunks: string[] // Array of text chunks to stream
  type?: 'narration' | 'dialogue' | 'whisper' | 'sensation'
  messageWeight?: 'primary' | 'aside' | 'critical'
  className?: string
  onComplete?: () => void // Called when all chunks are complete
  onChunkComplete?: (chunkIndex: number) => void // Called when each chunk completes
  chunkDelays?: number[] // Custom delays between chunks (ms)
  enableClickToComplete?: boolean
}

export function StreamingMessage({ 
  speaker, 
  textChunks, 
  type = 'dialogue', 
  messageWeight = 'primary', 
  className,
  onComplete,
  onChunkComplete,
  chunkDelays = [0, 800, 1200], // Default delays between chunks
  enableClickToComplete = true
}: StreamingMessageProps) {
  // ONLY state that triggers re-renders
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  
  // ALL control flow uses refs to prevent re-render loops
  const currentChunkIndexRef = useRef(0)
  const currentCharIndexRef = useRef(0)
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const chunkTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)
  const isMountedRef = useRef(true)
  
  const isNarration = type === 'narration'
  const isWhisper = type === 'whisper'
  const isSensation = type === 'sensation'
  
  // Character-specific styling (same as StoryMessage)
  const characterStyles = {
    'narrator': 'text-slate-600 dark:text-slate-400',
    'You': 'text-emerald-600 dark:text-emerald-400 font-medium',
    'Samuel': 'text-amber-700 dark:text-amber-300',
    'Maya': 'text-blue-600 dark:text-blue-400',
    'Devon': 'text-orange-600 dark:text-orange-400',
    'Jordan': 'text-purple-600 dark:text-purple-400',
    'Alex': 'text-green-600 dark:text-green-400',
    'Dr. Sarah Martinez': 'text-blue-700 dark:text-blue-300',
    'Marcus Thompson': 'text-indigo-600 dark:text-indigo-400',
    'Community Organizer': 'text-teal-600 dark:text-teal-400',
    'Technical Mentor': 'text-cyan-600 dark:text-cyan-400',
    'Collaboration Specialist': 'text-pink-600 dark:text-pink-400',
    'Business Strategist': 'text-emerald-600 dark:text-emerald-400',
    'Entrepreneur': 'text-yellow-600 dark:text-yellow-400',
    'Potential Mentor': 'text-violet-600 dark:text-violet-400',
    'Skills Counselor': 'text-rose-600 dark:text-rose-400',
    'Young Traveler': 'text-amber-600 dark:text-amber-400',
    'Community Leader': 'text-red-600 dark:text-red-400',
    'Career Advisor': 'text-lime-600 dark:text-lime-400',
    // Legacy characters
    'Lux': 'lux-text-glow text-purple-600 dark:text-purple-400',
    'Zippy': 'zippy-text-glow text-blue-500 dark:text-blue-400',
    'Swift': 'swift-text-glow text-green-600 dark:text-green-400',
    'Sage': 'sage-text-glow text-orange-600 dark:text-orange-400',
    'Buzz': 'buzz-text-glow text-cyan-600 dark:text-cyan-400',
    'Inner Voice': 'text-purple-600 dark:text-purple-400 italic',
    'Memory': 'text-gray-600 dark:text-gray-400',
    'Forest': 'text-green-600 dark:text-green-400',
    'Body': 'text-red-500 dark:text-red-400 italic',
  }
  
  const characterEmoji = {
    'narrator': '📖',
    'You': '👤',
    'Samuel': '🚂',
    'Maya': '🔬',
    'Devon': '🔧',
    'Jordan': '💼',
    'Alex': '🌱',
    'Dr. Sarah Martinez': '🏥',
    'Marcus Thompson': '🚀',
    'Community Organizer': '🤝',
    'Technical Mentor': '💻',
    'Collaboration Specialist': '🔗',
    'Business Strategist': '📊',
    'Entrepreneur': '💡',
    'Potential Mentor': '🎯',
    'Skills Counselor': '🎓',
    'Young Traveler': '🗺️',
    'Community Leader': '🏛️',
    'Career Advisor': '📈',
    // Legacy characters
    'Lux': '🦥',
    'Zippy': '🦋',
    'Swift': '🏃‍♀️',
    'Sage': '👻',
    'Buzz': '🤖',
    'Inner Voice': '🧘',
    'Memory': '💭',
    'Forest': '🌲',
    'Body': '❤️',
  }

  // Cleanup function - clears all timeouts safely
  const cleanup = useCallback(() => {
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current)
      streamingTimeoutRef.current = null
    }
    if (chunkTimeoutRef.current) {
      clearTimeout(chunkTimeoutRef.current)
      chunkTimeoutRef.current = null
    }
  }, [])

  // Complete streaming immediately with all text
  const completeStreaming = useCallback(() => {
    if (!isMountedRef.current) return
    
    cleanup()
    const allText = textChunks.join(' ')
    setDisplayedText(allText)
    setIsStreaming(false)
    setIsComplete(true)
    onComplete?.()
  }, [textChunks, cleanup, onComplete])

  // Stream single character - pure function with no external dependencies
  const streamNextChar = useCallback(() => {
    if (!isMountedRef.current) return
    
    // Bounds checking for safety
    if (currentChunkIndexRef.current >= textChunks.length) {
      completeStreaming()
      return
    }
    
    const currentChunk = textChunks[currentChunkIndexRef.current]
    if (!currentChunk || typeof currentChunk !== 'string') {
      completeStreaming()
      return
    }

    // Calculate full text up to current position
    const completedChunks = textChunks.slice(0, currentChunkIndexRef.current)
    const currentChunkText = currentChunk.slice(0, currentCharIndexRef.current + 1)
    const fullText = [...completedChunks, currentChunkText].join(' ')
    
    setDisplayedText(fullText)
    currentCharIndexRef.current++
    
    // Check if current chunk is complete
    if (currentCharIndexRef.current >= currentChunk.length) {
      // Chunk completed
      onChunkComplete?.(currentChunkIndexRef.current)
      
      // Move to next chunk
      currentChunkIndexRef.current++
      currentCharIndexRef.current = 0
      
      // Check if all chunks are done
      if (currentChunkIndexRef.current >= textChunks.length) {
        setIsStreaming(false)
        setIsComplete(true)
        onComplete?.()
        return
      }
      
      // Schedule next chunk with delay - with bounds checking
      const safeDelay = Math.max(0, chunkDelays?.[currentChunkIndexRef.current] || 800)
      chunkTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          streamNextChar()
        }
      }, safeDelay)
    } else {
      // Continue with next character
      streamingTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          streamNextChar()
        }
      }, 25) // Fast streaming like chatbots
    }
  }, [textChunks, chunkDelays, onChunkComplete, onComplete, completeStreaming])

  // Initialize streaming once on mount
  useEffect(() => {
    // Safety guards for edge cases
    if (isInitializedRef.current || !textChunks?.length || textChunks.some(chunk => typeof chunk !== 'string')) {
      return
    }
    
    isInitializedRef.current = true
    setIsStreaming(true)
    
    // Start streaming with initial delay
    const initialDelay = Math.max(0, chunkDelays?.[0] || 0) // Ensure non-negative delay
    streamingTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        streamNextChar()
      }
    }, initialDelay)
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false
      cleanup()
    }
  }, []) // Empty dependency array - runs once on mount only

  // Click to complete handler
  const handleClick = useCallback(() => {
    if (!enableClickToComplete || isComplete) return
    completeStreaming()
  }, [enableClickToComplete, isComplete, completeStreaming])

  const isUserMessage = speaker === 'You'
  const showCharacterAvatar = !isNarration && !isWhisper && !isSensation && !isUserMessage

  return (
    <div className={cn(
      "pokemon-message-container w-full mb-6",
      "animate-in slide-in-from-bottom-4 duration-700",
      speaker.toLowerCase().replace(' ', '-'),
      className
    )} data-type={type}>
      
      {/* Pokemon-Style Text Box */}
      <div 
        className={cn(
          "pokemon-textbox relative w-full max-w-2xl mx-auto",
          "bg-white dark:bg-gray-50",
          "border-2 border-gray-800/20",
          "rounded-lg",
          "p-6 md:p-8",
          "shadow-pokemon",
          enableClickToComplete && !isComplete && "cursor-pointer",
          // Multiple layered borders for authentic Game Boy feel
          "before:content-[''] before:absolute before:inset-1 before:border-1 before:border-gray-300/40 before:rounded",
          "after:content-[''] after:absolute after:inset-3 after:border-1 after:border-gray-200/30 after:rounded-sm"
        )} 
        style={{
          boxShadow: `
            0 2px 0 0 rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 0 #ffffff,
            inset 0 0 0 1px rgba(0, 0, 0, 0.2),
            0 4px 8px rgba(0, 0, 0, 0.3)
          `
        }}
        onClick={handleClick}
      >
        
        {/* Character Section */}
        {showCharacterAvatar && (
          <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-gray-200">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-2xl",
              "bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300",
              "border-4 border-amber-600 dark:border-amber-400",
              "shadow-lg relative",
              "before:content-[''] before:absolute before:inset-1 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:rounded-full"
            )} style={{
              boxShadow: `
                0 2px 0 0 #92400e,
                0 4px 8px rgba(146, 64, 14, 0.3),
                inset 0 2px 4px rgba(255, 255, 255, 0.3)
              `
            }}>
              {characterEmoji[speaker as keyof typeof characterEmoji] || '🌟'}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={cn(
                  "text-lg font-bold uppercase tracking-wider",
                  "font-mono",
                  characterStyles[speaker as keyof typeof characterStyles] || "text-slate-800"
                )} style={{
                  fontFamily: "'Courier New', monospace, 'Pokemon GB'",
                  textShadow: "1px 1px 0px rgba(0,0,0,0.3)"
                }}>
                  {speaker}
                </span>
                
                {/* Birmingham Role Badge */}
                {speaker === 'Samuel' && (
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold uppercase",
                    "bg-gradient-to-r from-amber-400 to-amber-500",
                    "text-amber-900 border-2 border-amber-600",
                    "shadow-sm"
                  )} style={{
                    textShadow: "none"
                  }}>
                    🚂 Station Keeper
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Streaming Text Content */}
        <div className={cn(
          "pokemon-text", 
          !className?.includes('semantic-') && "text-base leading-relaxed text-gray-900 dark:text-gray-800 font-medium",
          isNarration && "text-center italic",
          isWhisper && "italic opacity-90 text-purple-700",
          isSensation && "italic opacity-85 text-red-600",
          messageWeight === 'aside' && "message-aside",
          messageWeight === 'critical' && "message-critical",
          className
        )} style={{
          fontFamily: "'Inter', 'Pokemon GB', monospace",
          textShadow: className?.includes('semantic-') ? undefined : "0 1px 2px rgba(0,0,0,0.1)"
        }}>
          {speaker === 'Memory' && <span className="text-2xl mr-2">💭</span>}
          <span className="whitespace-pre-wrap">
            {parseEmphasisText(displayedText)}
          </span>
          
          {/* Chatbot-style streaming cursor */}
          {isStreaming && !isComplete && (
            <span className="animate-pulse text-gray-600 text-lg ml-1 opacity-70">▋</span>
          )}
        </div>
        
        {/* User Choice Styling */}
        {isUserMessage && (
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">{characterEmoji['You']}</span>
          </div>
        )}
      </div>
    </div>
  )
}