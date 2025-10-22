"use client"

/**
 * DialogueDisplay Component
 * Universal text renderer for narrative pacing
 *
 * Philosophy: Narrative pacing is a core mechanic
 * This component is our orchestra conductor for controlled, deliberate storytelling
 */

import { cn } from "@/lib/utils"
import { autoChunkDialogue } from "@/lib/auto-chunk-dialogue"
import { ChatPacedDialogue } from "./ChatPacedDialogue"

// Parse markdown-style emphasis in text (from StoryMessage pattern)
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

interface DialogueDisplayProps {
  text: string
  className?: string
  useChatPacing?: boolean // Enable sequential reveal with typing indicators
  characterName?: string // Required if useChatPacing is true
}

/**
 * DialogueDisplay - Universal text rendering with pacing control
 *
 * Features:
 * - Parses | separator into line breaks with breathing room
 * - Handles markdown-style emphasis (**bold**, *italic*)
 * - Consistent typography rhythm across all narrative text
 * - Optional sequential reveal with typing indicators (ChatPacedDialogue)
 */
export function DialogueDisplay({ text, className, useChatPacing, characterName }: DialogueDisplayProps) {
  // Auto-chunk long text for chat pacing, then split by | separator
  const chunkedText = autoChunkDialogue(text, { 
    activationThreshold: 120,  // Chat pacing: catch medium text
    maxChunkLength: 60         // Netflix-style: ~2 lines max
  })
  
  // If chat pacing is enabled, use ChatPacedDialogue for sequential reveal
  if (useChatPacing && characterName) {
    return (
      <ChatPacedDialogue
        text={chunkedText}
        characterName={characterName}
        className={className}
      />
    )
  }

  // Otherwise, use standard instant display
  const chunks = chunkedText.split('|').map(chunk => chunk.trim()).filter(chunk => chunk.length > 0)

  return (
    <div className={cn("space-y-4", className)}>
      {chunks.map((chunk, index) => (
        <p
          key={index}
          className="text-sm sm:text-base text-slate-800 leading-relaxed sm:leading-loose"
        >
          {parseEmphasisText(chunk)}
        </p>
      ))}
    </div>
  )
}