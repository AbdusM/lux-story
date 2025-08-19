"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface StoryMessageProps {
  speaker: string
  text: string
  type?: 'narration' | 'dialogue' | 'whisper' | 'sensation'
  className?: string
  typewriter?: boolean
}

export function StoryMessage({ speaker, text, type = 'dialogue', className, typewriter = false }: StoryMessageProps) {
  const [displayedText, setDisplayedText] = useState(typewriter ? "" : text)
  const [showContinueIndicator, setShowContinueIndicator] = useState(false)
  
  const isLux = speaker === 'Lux'
  const isZippy = speaker === 'Zippy'
  const isNarration = type === 'narration'
  const isWhisper = type === 'whisper'
  const isSensation = type === 'sensation'
  
  // Character-specific styling
  const characterStyles = {
    // Grand Central Terminus characters
    'narrator': 'text-slate-600 dark:text-slate-400',
    'You': 'text-blue-600 dark:text-blue-400 font-medium',
    'Samuel': 'text-gray-700 dark:text-gray-300',
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
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(timer)
          setShowContinueIndicator(true)
        }
      }, 30)
      return () => clearInterval(timer)
    }
  }, [text, typewriter])
  
  return (
    <div className={cn(
      "animate-in fade-in-0 slide-in-from-bottom-2 duration-500",
      "story-message",
      speaker.toLowerCase().replace(' ', '-'),
      className
    )} data-type={type}>
      {!isNarration && !isWhisper && !isSensation && (
        <div className="flex items-center gap-3 mb-2">
          <span className={cn(
            "text-2xl",
            isZippy ? "animate-flutter" : "float-subtle"
          )}>
            {characterEmoji[speaker as keyof typeof characterEmoji] || '🌟'}
          </span>
          <span className={cn(
            "text-sm font-bold uppercase tracking-wider",
            characterStyles[speaker as keyof typeof characterStyles] || "text-slate-700 dark:text-slate-300"
          )}>
            {speaker}
          </span>
          {isLux && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full third-eye-glow">
              Third Eye Active
            </span>
          )}
          {isZippy && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full zippy-text-glow">
              Time Confused
            </span>
          )}
        </div>
      )}
      <div className={cn(
        "relative",
        isNarration || isWhisper || isSensation ? "text-narration" : "text-dialogue",
        type === 'dialogue' && "pokemon-text-box p-6"
      )}>
        {(isNarration || isWhisper || isSensation) ? (
          <div className={cn(
            isWhisper && "pl-4 opacity-90",
            isSensation && "italic opacity-85",
            !isWhisper && !isSensation && "bg-gradient-to-b from-slate-900/80 to-slate-900/60 dark:from-slate-100/10 dark:to-slate-100/5 rounded-lg p-6 premium-border"
          )}>
            <div className={cn(
              isWhisper && "text-purple-600 dark:text-purple-400 italic",
              isSensation && "text-red-500 dark:text-red-400",
              !isWhisper && !isSensation && "text-center italic text-slate-300 dark:text-slate-400",
              "text-premium whitespace-pre-wrap"
            )}>
              {speaker === 'Memory' && '💭 '}
              {displayedText}
            </div>
          </div>
        ) : (
          <>
            <div className={cn(
              "text-slate-800 dark:text-slate-100",
              "text-premium whitespace-pre-wrap",
              isLux && "lux-text-glow"
            )}>
              {displayedText}
            </div>
            {showContinueIndicator && typewriter && (
              <span className="absolute bottom-2 right-4 text-slate-500 animate-pulse">
                ▼
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}