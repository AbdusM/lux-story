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
import { shouldShowAvatar } from "./CharacterAvatar"
import { RichTextRenderer, type RichTextEffect } from "./RichTextRenderer"
import { motion, type Variants } from "framer-motion"

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

// Interaction animation variants for Pokémon-style visual feedback
const interactionAnimations: Record<string, Variants> = {
  shake: {
    animate: {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5, repeat: 1 }
    }
  },
  jitter: {
    animate: {
      x: [0, -1, 1, -1, 1, 0],
      y: [0, -1, 1, -1, 1, 0],
      transition: { duration: 0.3, repeat: 2 }
    }
  },
  nod: {
    animate: {
      y: [0, -5, 0, -5, 0],
      transition: { duration: 0.6 }
    }
  },
  bloom: {
    animate: {
      scale: [0.95, 1.05, 1],
      opacity: [0.8, 1, 1],
      transition: { duration: 0.5 }
    }
  },
  ripple: {
    animate: {
      scale: [1, 1.02, 1, 1.02, 1],
      transition: { duration: 0.8, repeat: 1 }
    }
  },
  big: {
    animate: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.4 }
    }
  },
  small: {
    animate: {
      scale: [1, 0.95, 1],
      opacity: [1, 0.9, 1],
      transition: { duration: 0.4 }
    }
  }
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
  // Auto-chunk long text ONLY if NOT using richEffects
  // When richEffects is enabled, respect the original text structure completely
  const chunkedText = richEffects
    ? text  // Let RichTextRenderer handle chunking via \n\n splits
    : autoChunkDialogue(text, {
        activationThreshold: 200,
        maxChunkLength: 100
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
  // Get interaction class if provided
  const interactionClass = interaction ? `narrative-interaction-${interaction}` : null

  // If richEffects is enabled, use RichTextRenderer for the entire text
  // This allows RichTextRenderer to control chunking internally
  if (richEffects) {
    const content = (
      <RichTextRenderer
        text={chunkedText}
        effects={richEffects}
        className={cn("text-base text-slate-800 leading-relaxed", interactionClass)}
      />
    )

    return (
      <div className={cn("space-y-4 min-h-[120px]", className)} key="dialogue-chunks-container" style={{ transition: 'none' }}>
        {interaction && interactionAnimations[interaction] ? (
          <motion.div {...interactionAnimations[interaction]}>
            {content}
          </motion.div>
        ) : (
          content
        )}
      </div>
    )
  }

  // Standard display without richEffects: split by | and render paragraphs instantly
  const chunks = chunkedText.split('|').map(chunk => chunk.trim()).filter(chunk => chunk.length > 0)

  // If no chunks, return empty to maintain stable container
  if (chunks.length === 0) {
    return <div className={cn("space-y-4 min-h-[120px]", className)}></div>
  }

  const content = chunks.map((chunk, index) => (
    <p
      key={`chunk-${chunk.slice(0, 20).replace(/\s/g, '-')}-${index}`}
      className={cn(
        "text-base text-slate-800 leading-relaxed whitespace-pre-wrap",
        interactionClass
      )}
    >
      {parseEmphasisText(chunk)}
    </p>
  ))

  return (
    <div className={cn("space-y-4 min-h-[120px]", className)} key="dialogue-chunks-container" style={{ transition: 'none' }}>
      {/* Dialogue Content - No inline avatars */}
      {interaction && interactionAnimations[interaction] ? (
        <motion.div {...interactionAnimations[interaction]}>
          {content}
        </motion.div>
      ) : (
        content
      )}
    </div>
  )
}