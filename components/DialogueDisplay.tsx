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
// ChatPacedDialogue DISABLED: Critical rendering bugs (blank screen).
// Code preserved in ChatPacedDialogue.DISABLED.tsx for future debugging.
import { shouldShowAvatar } from "./CharacterAvatar"
import { RichTextRenderer, type RichTextEffect } from "./RichTextRenderer"
import { motion } from "framer-motion"
import { interactionAnimations, isKineticInteraction, type InteractionType, type MotionInteractionType } from "@/lib/interaction-parser"
import { getVoiceClass } from "@/lib/voice-utils"
import { useUnlockEffects } from "@/hooks/useUnlockEffects"
import type { GameState } from "@/lib/character-state"

interface DialogueDisplayProps {
  text: string
  className?: string
  // useChatPacing removed - feature disabled due to rendering bugs
  characterName?: string
  characterId?: string // Character ID for unlock effects (trust display, etc.)
  gameState?: GameState // Game state for unlock effects
  showAvatar?: boolean // Show character avatar
  isContinuedSpeaker?: boolean // Hide avatar if same speaker as previous
  richEffects?: RichTextEffect // Optional rich text effects (terminal-style animations)
  interaction?: InteractionType // Visual interaction animation ('big', 'small', 'shake', 'nod', 'ripple', 'bloom', 'jitter')
  emotion?: string // Emotion tag for the dialogue
  microAction?: string // Physiological micro-action (e.g., 'He rubs his temples.')
  patternSensation?: string | null // Atmospheric feedback after pattern choices (30% probability)
  playerPatterns?: {
    analytical?: number
    helping?: number
    building?: number
    patience?: number
    exploring?: number
  }
  // D-008: Rich text state effects
  textEffectClasses?: string // CSS classes from getTextEffectClasses()
  textEffectStyles?: React.CSSProperties // Inline styles from getTextEffectStyles()
}

/**
 * DialogueDisplay - Universal text rendering with pacing control
 *
 * Features:
 * - Parses | separator into line breaks with breathing room
 * - Handles markdown-style emphasis (**bold**, *italic*)
 * - Consistent typography rhythm across all narrative text
 *
 * NOTE: ChatPacedDialogue (sequential reveal) disabled due to rendering bugs.
 * Code preserved in ChatPacedDialogue.DISABLED.tsx for future debugging.
 */
export function DialogueDisplay({
  text,
  className,
  characterName,
  characterId,
  gameState,
  showAvatar = true,
  isContinuedSpeaker = false,
  richEffects,
  interaction,
  emotion,
  microAction,
  patternSensation: _patternSensation,
  playerPatterns: _playerPatterns,
  textEffectClasses,
  textEffectStyles
}: DialogueDisplayProps) {
  // Get unlock-based content enhancements
  const _enhancements = useUnlockEffects(text, emotion,
    microAction, characterId, gameState)
  // Auto-chunk long text ONLY if NOT using richEffects
  // When richEffects is enabled, respect the original text structure completely
  const chunkedText = richEffects
    ? text  // Let RichTextRenderer handle chunking via \n\n splits
    : autoChunkDialogue(text, {
      activationThreshold: 200,
      maxChunkLength: 100
    })

  // Determine if avatar should be displayed (reserved for future use)
  const _displayAvatar = showAvatar && shouldShowAvatar(characterName, isContinuedSpeaker, false)
  // Get interaction class if provided
  const interactionClass = interaction ? `narrative-interaction-${interaction}` : null

  // Determine typography based on speaker (Voice Fonts)
  const voiceClass = getVoiceClass(characterName)

  // Use RichTextRenderer for all standard rendering (replacing legacy manual parsing)
  // It handles | splitting, inline interactions, and markdown internally
  // D-008: Wrap in span with text effect classes/styles if provided
  const rendererContent = (
    <RichTextRenderer
      text={chunkedText}
      effects={richEffects || { mode: 'static' }}
      className={cn("text-lg leading-loose tracking-wide text-[color:var(--text-dialogue)] narrative-text font-serif", voiceClass, interactionClass)} // WCAG AA warm cream from --text-dialogue
    />
  )

  // D-008: Full-text effects DISABLED - too obstructive
  // Text effects should only apply to inline words (via RichTextRenderer), not entire blocks
  const content = rendererContent

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

      {/* Micro-Action: Immersive narrative action (Novel style) */}
      {microAction && (
        <p className="text-amber-200/60 mb-4 font-serif italic text-[0.95rem] leading-relaxed opacity-90">
          {microAction}
        </p>
      )}

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

      {/* Subtext hints - surfaced through text per Expedition 33 design (HIDDEN per UX simplification) */}
      {/* {enhancements.subtextHint && (
        <div className="mt-3">
          <Subtext text={enhancements.subtextHint} />
        </div>
      )} */}

      {/* Pattern sensation - atmospheric feedback after pattern choices (HIDDEN per UX simplification) */}
      {/* {patternSensation && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 text-sm italic text-amber-200/60"
        >
          {patternSensation}
        </motion.p>
      )} */}
    </div>
  )
}