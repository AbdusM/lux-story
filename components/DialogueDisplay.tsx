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
import { motion } from "framer-motion"
import { interactionAnimations, type InteractionType } from "@/lib/interaction-parser"
import { getVoiceClass } from "@/lib/voice-utils"

interface DialogueDisplayProps {
  text: string
  className?: string
  useChatPacing?: boolean // Enable sequential reveal with typing indicators
  characterName?: string // Required if useChatPacing is true
  showAvatar?: boolean // Show character avatar
  isContinuedSpeaker?: boolean // Hide avatar if same speaker as previous
  richEffects?: RichTextEffect // Optional rich text effects (terminal-style animations)
  interaction?: InteractionType // Visual interaction animation ('big', 'small', 'shake', 'nod', 'ripple', 'bloom', 'jitter')
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

  // Determine typography based on speaker (Voice Fonts)
  const voiceClass = getVoiceClass(characterName)

  // Use RichTextRenderer for all standard rendering (replacing legacy manual parsing)
  // It handles | splitting, inline interactions, and markdown internally
  const content = (
    <RichTextRenderer
      text={chunkedText}
      effects={richEffects || { mode: 'static' }}
      className={cn("text-base leading-loose", voiceClass, interactionClass)} // Changed from leading-relaxed to leading-loose for better readability
    />
  )

  return (
    <div
      className={cn(
        "space-y-6 min-h-[120px]", // Increased from space-y-4 to space-y-6 for better breathing room
        "max-w-prose", // 65ch line length - optimal for reading (Bringhurst, WCAG)
        className
      )}
      key="dialogue-chunks-container"
      style={{ transition: 'none' }}
    >
      {/* Speaker Label - DISABLED: Now shown in header instead (removes duplicate)
          Original: Roadwarden research showed need for speaker labels
          Current: Header shows character name, so this is redundant */}

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