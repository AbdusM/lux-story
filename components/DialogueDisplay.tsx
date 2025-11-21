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
import { CharacterAvatar, shouldShowAvatar } from "./CharacterAvatar"
import { RichTextRenderer, type RichTextEffect } from "./RichTextRenderer"

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
  showAvatar?: boolean // Show character avatar
  isContinuedSpeaker?: boolean // Hide avatar if same speaker as previous
  richEffects?: RichTextEffect // Optional rich text effects (terminal-style animations)
  interaction?: string // Visual interaction animation ('big', 'small', 'shake', 'nod', 'ripple', 'bloom', 'jitter')
  emotion?: string // Emotion tag for the dialogue (e.g., 'anxious', 'excited', 'vulnerable')
  playerPatterns?: {
    analytical?: number
    helping?: number
    building?: number
    patience?: number
    exploring?: number
  }
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
export function DialogueDisplay({ 
  text, 
  className, 
  useChatPacing, 
  characterName,
  showAvatar = true,
  isContinuedSpeaker = false,
  richEffects,
  interaction,
  emotion,
  playerPatterns
}: DialogueDisplayProps) {
  // Auto-chunk long text for chat pacing, then split by | separator
  const chunkedText = autoChunkDialogue(text, { 
    activationThreshold: 200,  // Only chunk longer paragraphs (increased to prevent over-chunking)
    maxChunkLength: 100        // Allow complete sentences
  })
  
  // Determine if avatar should be displayed
  const displayAvatar = showAvatar && shouldShowAvatar(characterName, isContinuedSpeaker, false)
  
  // Auto-enable chat pacing ONLY if explicitly set (useChatPacing: true)
  // Removed auto-activation to prevent breaking choice flow
  // Future: can re-enable with very conservative heuristics if needed
  const shouldUseChatPacing = useChatPacing || false
  
  // If chat pacing is enabled, use ChatPacedDialogue for sequential reveal
  if (shouldUseChatPacing && characterName) {
    return (
      <ChatPacedDialogue
        text={chunkedText}
        characterName={characterName}
        showAvatar={displayAvatar}
        className={className}
        interaction={interaction}
        emotion={emotion}
        playerPatterns={playerPatterns}
      />
    )
  }

  // Otherwise, use standard instant display
  const chunks = chunkedText.split('|').map(chunk => chunk.trim()).filter(chunk => chunk.length > 0)

  // If no chunks, return empty to maintain stable container
  if (chunks.length === 0) {
    return <div className={cn("space-y-4", className)}></div>
  }

  // Get interaction class if provided
  const interactionClass = interaction ? `narrative-interaction-${interaction}` : null

  return (
    <div className={cn("space-y-4", className)} key="dialogue-chunks-container" style={{ transition: 'none' }}>
      {/* Dialogue Content - No inline avatars */}
      {chunks.map((chunk, index) => {
        const ChunkWrapper = richEffects ? 'div' : 'p'
        
        return (
          <ChunkWrapper
            key={`chunk-${chunk.slice(0, 20).replace(/\s/g, '-')}-${index}`}
            className={cn(
              "text-base text-slate-800 leading-relaxed whitespace-pre-wrap",
              interactionClass
            )}
          >
            {richEffects ? (
              <RichTextRenderer
                text={chunk}
                effects={richEffects}
                className="text-base text-slate-800 leading-relaxed"
              />
            ) : (
              parseEmphasisText(chunk)
            )}
          </ChunkWrapper>
        )
      })}
    </div>
  )
}