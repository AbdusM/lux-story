"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

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
} as const

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
} as const

// Character-specific avatar background styles
const characterAvatarStyles = {
  'Samuel': 'bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 border-amber-600 dark:border-amber-400',
  'Maya': 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border-blue-600 dark:border-blue-400',
  'Devon': 'bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 border-orange-600 dark:border-orange-400',
  'Jordan': 'bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 border-purple-600 dark:border-purple-400',
  'You': 'bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 border-emerald-600 dark:border-emerald-400',
} as const

interface GameMessageProps {
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

export function GameMessage({
  speaker,
  text,
  type = 'dialogue',
  messageWeight = 'primary',
  buttonText,
  className,
  typewriter = false,
  isContinuedSpeaker = false,
  streamingMode = 'traditional',
  onComplete
}: GameMessageProps) {
  const [displayedText, setDisplayedText] = useState(typewriter ? "" : text)
  const [showContinueIndicator, setShowContinueIndicator] = useState(false)

  const isNarration = type === 'narration'
  const isWhisper = type === 'whisper'
  const isSensation = type === 'sensation'
  const isUserMessage = speaker === 'You'

  // Typewriter effect
  useEffect(() => {
    if (typewriter && text) {
      let index = 0
      let timer: NodeJS.Timeout

      const typeNextChar = () => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
          // Chatbot mode: ultra-fast for short chunks (15ms), Traditional: original speed (40ms)
          const delay = streamingMode === 'chatbot' ? 15 : 40
          timer = setTimeout(typeNextChar, delay)
        } else {
          setShowContinueIndicator(true)
          onComplete?.() // Notify when complete
        }
      }

      timer = setTimeout(typeNextChar, streamingMode === 'chatbot' ? 10 : 100) // Minimal initial delay for snappy feel
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

  // Determine if we should show character avatar
  const showCharacterAvatar = !isNarration && !isWhisper && !isSensation && !isUserMessage && !isContinuedSpeaker

  // Normalize speaker name for consistent lookups (capitalize first letter)
  const normalizedSpeaker = speaker.charAt(0).toUpperCase() + speaker.slice(1).toLowerCase()

  // Get character-specific styles
  const characterColor = characterStyles[normalizedSpeaker as keyof typeof characterStyles] || 'text-slate-800 dark:text-slate-200'
  const characterIcon = characterEmoji[normalizedSpeaker as keyof typeof characterEmoji] || '🌟'
  const avatarStyle = characterAvatarStyles[normalizedSpeaker as keyof typeof characterAvatarStyles] || 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 border-slate-600 dark:border-slate-400'

  // Determine typography variant based on message type
  const getTypographyVariant = () => {
    if (isNarration) return 'narrator'
    if (isWhisper) return 'whisper'
    return 'dialogue'
  }

  // Determine typography color based on speaker
  const getTypographyColor = () => {
    const lowerSpeaker = speaker.toLowerCase()
    if (lowerSpeaker === 'samuel') return 'samuel'
    if (lowerSpeaker === 'maya') return 'maya'
    if (lowerSpeaker === 'devon') return 'devon'
    if (lowerSpeaker === 'jordan') return 'jordan'
    if (lowerSpeaker === 'you') return 'you'
    return 'default'
  }

  return (
    <div className={cn(
      "w-full",
      isContinuedSpeaker ? "mb-3" : "mb-6", // Tighter spacing for continued speakers
      "animate-in slide-in-from-bottom-4 duration-700",
      speaker.toLowerCase().replace(' ', '-'),
      isContinuedSpeaker && "continued-speaker",
      className
    )} data-type={type}>

      <Card className={cn(
        "relative w-full max-w-xl mx-auto transition-all duration-300",
        messageWeight === 'critical' && "border-red-500 shadow-red-500/20 shadow-lg",
        messageWeight === 'primary' && "border-slate-200 dark:border-slate-700",
        messageWeight === 'aside' && "border-slate-100 dark:border-slate-800 opacity-90",
        isUserMessage && "border-emerald-500 shadow-emerald-500/20",
        typewriter && displayedText.length < text.length && "cursor-pointer",
        // Pokemon-style box shadow
        "shadow-[0_2px_0_0_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.2),inset_0_1px_0_0_#ffffff,inset_0_0_0_1px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.3)]"
      )}
      onClick={handleClick}
      role="article"
      aria-label={`Message from ${speaker}`}
      >

        {/* Character Header */}
        {showCharacterAvatar && (
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              {/* Character Avatar */}
              <Avatar className={cn(
                "w-16 h-16 border-4 shadow-lg relative",
                avatarStyle,
                "before:content-[''] before:absolute before:inset-1 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:rounded-full"
              )} style={{
                boxShadow: `
                  0 2px 0 0 #92400e,
                  0 4px 8px rgba(146, 64, 14, 0.3),
                  inset 0 2px 4px rgba(255, 255, 255, 0.3)
                `
              }}
              role="img"
              aria-label={`${speaker} speaking`}
              >
                <AvatarFallback className="text-2xl bg-transparent" aria-hidden="true">
                  {characterIcon}
                </AvatarFallback>
              </Avatar>

              {/* Character Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Typography
                    variant="large"
                    font="mono"
                    className={cn(
                      "uppercase tracking-wider",
                      characterColor
                    )}
                    style={{
                      fontFamily: "'Courier New', monospace, 'Pokemon GB'",
                      textShadow: "1px 1px 0px rgba(0,0,0,0.3)"
                    }}
                  >
                    {speaker}
                  </Typography>

                  {/* Birmingham Role Badge for Samuel */}
                  {speaker === 'Samuel' && (
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold uppercase",
                      "bg-gradient-to-r from-amber-400 to-amber-500",
                      "text-amber-900 border-2 border-amber-600",
                      "shadow-sm"
                    )}>
                      <span aria-hidden="true">🚂</span> <span className="sr-only">Station Keeper</span>Station Keeper
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        )}

        {/* Message Content */}
        <CardContent className={cn(
          showCharacterAvatar ? "pt-0" : "pt-6"
        )}>
          <Typography
            variant={getTypographyVariant()}
            color={getTypographyColor()}
            align={isNarration ? "center" : "left"}
            className={cn(
              "whitespace-pre-wrap",
              isWhisper && "opacity-90",
              isSensation && "opacity-85 text-red-600 dark:text-red-400",
              className?.includes('semantic-') ? className : "font-medium",
              "text-base leading-relaxed"
            )}
            style={{
              fontFamily: "'Inter', 'Pokemon GB', monospace",
              textShadow: className?.includes('semantic-') ? undefined : "0 1px 2px rgba(0,0,0,0.1)"
            }}
            aria-live={typewriter ? "polite" : "off"}
            aria-busy={typewriter && displayedText.length < text.length}
          >
            {speaker === 'Memory' && <span className="text-2xl mr-2">💭</span>}
            {parseEmphasisText(displayedText)}

            {/* Typing cursor */}
            {typewriter && displayedText.length < text.length && (
              streamingMode === 'chatbot' ? (
                <span className="animate-pulse text-gray-600 text-lg ml-1 opacity-70">▋</span>
              ) : (
                <span className="animate-pulse text-gray-600 text-2xl ml-1">|</span>
              )
            )}
          </Typography>

          {/* Custom button text */}
          {(!typewriter || showContinueIndicator) && buttonText && (
            <div className="flex justify-center mt-6">
              <Typography variant="small" color="muted" className="text-center">
                {buttonText}
              </Typography>
            </div>
          )}
        </CardContent>

        {/* User Choice Indicator */}
        {isUserMessage && (
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">{characterIcon}</span>
          </div>
        )}
      </Card>
    </div>
  )
}