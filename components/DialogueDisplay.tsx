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
import { interactionAnimations, isKineticInteraction, type InteractionType, type MotionInteractionType } from "@/lib/interaction-parser"
import { getVoiceClass } from "@/lib/voice-utils"
import { useUnlockEffects } from "@/hooks/useUnlockEffects"
import { EmotionTag, TrustDisplay, Subtext } from "./unlock-enhancements"
import type { GameState } from "@/lib/character-state"

interface DialogueDisplayProps {
  text: string
  className?: string
  useChatPacing?: boolean // Enable sequential reveal with typing indicators
  characterName?: string // Required if useChatPacing is true
  characterId?: string // Character ID for unlock effects (trust display, etc.)
  gameState?: GameState // Game state for unlock effects
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
  characterId,
  gameState,
  showAvatar = true,
  isContinuedSpeaker = false,
  richEffects,
  interaction,
  emotion,
  playerPatterns
}: DialogueDisplayProps) {
  // Get unlock-based content enhancements
  const enhancements = useUnlockEffects(text, emotion, characterId, characterName, gameState)
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

  // Auto-enable chat pacing for nodes >40 words (Twitter-like threshold)
  // Twitter max is ~50 words, so 40 words creates engaging progressive reveal
  const wordCount = text.split(/\s+/).length
  // DISABLED: ChatPacedDialogue has critical rendering bugs (blank screen).
  // We are forcing this to false globally to ensure content is always visible via RichTextRenderer.
  // This overrides both the auto-detection and explicit content flags.
  const shouldUseChatPacing = false // useChatPacing || (wordCount > 40 && characterName)

  // If chat pacing is enabled, use ChatPacedDialogue for sequential reveal
  if (shouldUseChatPacing && characterName) {
    return (
      <ChatPacedDialogue
        text={chunkedText}
        characterName={characterName}
        characterId={characterId}
        gameState={gameState}
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
      className={cn("text-lg leading-loose text-[color:var(--text-dialogue)] narrative-text", voiceClass, interactionClass)} // WCAG AA warm cream from --text-dialogue
    />
  )

  return (
    <div
      className={cn(
        "space-y-8 sm:space-y-10 min-h-[120px]", // Increased spacing for Twitter/Instagram-like breathing room (was space-y-6)
        "max-w-prose", // 65ch line length - optimal for reading (Bringhurst, WCAG)
        className
      )}
      key="dialogue-chunks-container"
      style={{ transition: 'none' }}
    >
      {/* Speaker Label - DISABLED: Now shown in header instead (removes duplicate)
          Original: Roadwarden research showed need for speaker labels
          Current: Header shows character name, so this is redundant */}

      {/* Motion-based interactions only - kinetic types handled by RichTextRenderer */}
      {interaction && !isKineticInteraction(interaction) && interactionAnimations[interaction as MotionInteractionType] ? (
        <motion.div {...interactionAnimations[interaction as MotionInteractionType]}>
          {content}
        </motion.div>
      ) : (
        content
      )}

      {/* Unlock-based content enhancements */}
      <div className="space-y-2 mt-3">
        {/* Emotion tag (Analytical unlock) - Hidden for immersion */}
        {/* {enhancements.showEmotionTag && emotion && (
          <div className="flex items-center gap-2">
            <EmotionTag emotion={emotion} />
          </div>
        )} */}

        {/* Trust level display (Helping unlock) - Hidden for immersion */}
        {/* {enhancements.showTrustLevel && enhancements.trustValue !== undefined && (
          <TrustDisplay
            trust={enhancements.trustValue}
            characterName={characterName}
          />
        )} */}

        {/* Analytical subtext hints */}
        {enhancements.subtextHint && (
          <Subtext text={enhancements.subtextHint} />
        )}
      </div>
    </div>
  )
}