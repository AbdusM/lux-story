"use client"

import React, { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// Function to parse markdown-style emphasis in text
// Returns a single React fragment to preserve whitespace structure
function parseEmphasisText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let currentIndex = 0

  // Regex to match ***text***, **text**, or *text*
  const emphasisRegex = /(\*{1,3})([^*]+?)\1/g
  let match: RegExpExecArray | null

  while ((match = emphasisRegex.exec(text)) !== null) {
    // Add text before the match (wrap in Fragment to preserve whitespace)
    if (match.index > currentIndex) {
      parts.push(
        <React.Fragment key={`text-${currentIndex}`}>
          {text.slice(currentIndex, match.index)}
        </React.Fragment>
      )
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

  // Add remaining text (wrap in Fragment to preserve whitespace)
  if (currentIndex < text.length) {
    parts.push(
      <React.Fragment key="text-end">
        {text.slice(currentIndex)}
      </React.Fragment>
    )
  }

  // Return single fragment containing all parts
  return parts.length > 0 ? <>{parts}</> : text
}

interface StoryMessageProps {
  speaker: string
  text: string
  type?: 'narration' | 'dialogue' | 'whisper' | 'sensation'
  messageWeight?: 'primary' | 'aside' | 'critical' // Visual hierarchy for cinematic information staging
  buttonText?: string // Custom button text for special moments
  className?: string
  typewriter?: boolean
  isContinuedSpeaker?: boolean // Visual grouping for same speaker messages
  streamingMode?: 'chatbot' | 'traditional' // Streaming style selection
  onComplete?: () => void // Called when text display is complete
}

export function StoryMessage({ speaker, text, type = 'dialogue', messageWeight = 'primary', buttonText, className, typewriter = false, isContinuedSpeaker = false, streamingMode = 'traditional', onComplete }: StoryMessageProps) {
  const [displayedText, setDisplayedText] = useState(typewriter ? "" : text)
  const [showContinueIndicator, setShowContinueIndicator] = useState(false)
  
  const isLux = speaker === 'Lux'
  const isZippy = speaker === 'Zippy'
  const isNarration = type === 'narration'
  const isWhisper = type === 'whisper'
  const isSensation = type === 'sensation'
  
  // Character-specific styling with Birmingham-inspired colors
  const characterStyles = {
    // Grand Central Terminus characters
    'narrator': 'text-slate-600 dark:text-slate-400',
    'You': 'text-emerald-600 dark:text-emerald-400 font-medium', // Birmingham green
    'Samuel': 'text-amber-700 dark:text-amber-300', // Station conductor gold
    'Maya': 'text-blue-600 dark:text-blue-400', // Medical blue
    'Devon': 'text-orange-600 dark:text-orange-400', // Construction orange
    'Jordan': 'text-purple-600 dark:text-purple-400', // Career guidance purple
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
    // Legacy characters (for backward compatibility)
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
    // Grand Central Terminus characters
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
    // Legacy characters (for backward compatibility)
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
  
  useEffect(() => {
    if (typewriter && text) {
      let index = 0
      let timer: NodeJS.Timeout
      
      const typeNextChar = () => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
          // Chatbot mode: faster streaming (25ms), Traditional: original speed (40ms)
          const delay = streamingMode === 'chatbot' ? 25 : 40
          timer = setTimeout(typeNextChar, delay)
        } else {
          setShowContinueIndicator(true)
          onComplete?.() // Notify when complete
        }
      }
      
      timer = setTimeout(typeNextChar, streamingMode === 'chatbot' ? 50 : 100) // Initial delay
      return () => clearTimeout(timer)
    } else if (!typewriter) {
      // Non-typewriter text is immediately complete
      onComplete?.()
    }
  }, [text, typewriter, streamingMode, onComplete])
  
  // Enhanced click to skip typewriter effect
  const handleClick = useCallback(() => {
    if (typewriter && displayedText.length < text.length) {
      setDisplayedText(text)
      setShowContinueIndicator(true)
      onComplete?.() // Notify completion when skipped
    }
  }, [typewriter, displayedText.length, text, onComplete])
  
  // Pokemon-style design - full width, game-like presentation
  const isUserMessage = speaker === 'You'
  const showCharacterAvatar = !isNarration && !isWhisper && !isSensation && !isUserMessage && !isContinuedSpeaker
  
  return (
    <div className={cn(
      "pokemon-message-container w-full",
      isContinuedSpeaker ? "mb-3" : "mb-6", // Tighter spacing for continued speakers
      "animate-in slide-in-from-bottom-4 duration-700",
      speaker.toLowerCase().replace(' ', '-'),
      isContinuedSpeaker && "continued-speaker", // CSS class for continued speakers
      className
    )} data-type={type}>
      
      {/* Pokemon-Style Text Box */}
      <div
        className={cn(
          "pokemon-textbox-enhanced relative w-full max-w-xl mx-auto",
          "message-enter",
          messageWeight === 'critical' && "message-critical",
          messageWeight === 'primary' && "message-primary", 
          messageWeight === 'aside' && "message-aside",
          speaker.toLowerCase() && `message-${speaker.toLowerCase()}`,
          typewriter && displayedText.length < text.length && "cursor-pointer"
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
        
        {/* Character Section - Top of text box like Pokemon */}
        {showCharacterAvatar && (
          <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-gray-200">
            {/* Large Character Avatar - Pokemon NPC style */}
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
            
            {/* Character Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={cn(
                  "text-lg font-bold uppercase tracking-wider",
                  "font-mono", // Pokemon-style typography
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
        
        {/* Message Text - Enhanced with Semantic Hierarchy */}
        <div className={cn(
          "pokemon-text", // Base Pokemon text styling
          // Conditional Tailwind overrides based on semantic classes
          !className?.includes('semantic-') && "text-base leading-[1.7] text-gray-900 dark:text-gray-800 font-medium",
          isNarration && "text-center italic",
          isWhisper && "italic opacity-90 text-purple-700",
          isSensation && "italic opacity-85 text-red-600",
          messageWeight === 'aside' && "message-aside",
          messageWeight === 'critical' && "message-critical",
          className // Semantic styling classes take priority
        )} style={{
          fontFamily: "'Inter', 'Pokemon GB', monospace",
          // Allow semantic classes to override text shadow
          textShadow: className?.includes('semantic-') ? undefined : "0 1px 2px rgba(0,0,0,0.1)"
        }}>
          {speaker === 'Memory' && <span className="text-2xl mr-2">💭</span>}
          <span className="whitespace-pre-wrap">
            {parseEmphasisText(displayedText)}
          </span>
          
          {/* Typing cursor - different styles for different modes */}
          {typewriter && displayedText.length < text.length && (
            streamingMode === 'chatbot' ? (
              <span className="animate-pulse text-gray-600 text-lg ml-1 opacity-70">▋</span>
            ) : (
              <span className="animate-pulse text-gray-600 text-2xl ml-1">|</span>
            )
          )}
        </div>
        
        {/* Custom button text only (no arrow needed since we have Continue button) */}
        {(!typewriter || showContinueIndicator) && buttonText && (
          <div className="flex justify-center mt-6">
            <div className="text-center">
              <div className="text-xs text-gray-500 mt-1 font-medium">
                {buttonText}
              </div>
            </div>
          </div>
        )}
        
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