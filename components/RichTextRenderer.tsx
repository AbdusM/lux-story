"use client"

/**
 * RichTextRenderer - Cognitive-friendly text rendering
 *
 * PHILOSOPHY: "Kill the Typewriter"
 * Humans read by scanning word shapes (saccades), not letter-by-letter.
 * Character-level typing increases cognitive load and breaks reading flow.
 *
 * STRATEGY: Staggered Fade-In
 * - Reveal text by **Paragraph** or **Phrase** (chunks).
 * - Instant skip on click.
 * - Respects "Speed of Thought".
 */

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { motion, useReducedMotion } from 'framer-motion'
import { parseInlineInteractions, interactionAnimations, isKineticInteraction, type MotionInteractionType } from '@/lib/interaction-parser'
import { calculateChunkDelay } from '@/lib/character-typing'
import { KineticText, type KineticEffect } from '@/components/KineticText'

// Color themes for different states (kept for compatibility)
const STATE_THEMES = {
  thinking: {
    base: '#3b82f6',      // Blue
    accent: '#60a5fa',    // Light blue
    pulse: '#93c5fd',     // Lighter blue
  },
  executing: {
    base: '#10b981',      // Green
    accent: '#34d399',    // Light green
    pulse: '#6ee7b7',     // Lighter green
  },
  warning: {
    base: '#f59e0b',      // Amber
    accent: '#fbbf24',    // Light amber
    pulse: '#fcd34d',     // Lighter amber
  },
  error: {
    base: '#ef4444',      // Red
    accent: '#f87171',    // Light red
    pulse: '#fca5a5',     // Lighter red
  },
  success: {
    base: '#22c55e',      // Green
    accent: '#4ade80',    // Light green
    pulse: '#86efac',     // Lighter green
  },
  default: {
    base: '#374151',      // Gray
    accent: '#6b7280',    // Light gray
    pulse: '#9ca3af',     // Lighter gray
  },
} as const

export interface RichTextEffect {
  /** Animation mode - 'typewriter' is deprecated and maps to 'staggered' */
  mode?: 'static' | 'typewriter' | 'fade-in' | 'staggered' | 'line-fade-in'

  /** State-based color theme */
  state?: keyof typeof STATE_THEMES

  /** Words or phrases to highlight */
  highlightWords?: string[]

  /** Speed of animations (1 = normal) */
  speed?: number

  /** Enable flashing/blinking effect on highlighted text */
  flashing?: boolean

  /** Enable rainbow cycling effect */
  rainbow?: boolean
}

interface RichTextRendererProps {
  text: string
  effects?: RichTextEffect
  className?: string
  onComplete?: () => void
  /** Enable click to skip animations */
  clickToComplete?: boolean
  /** Character name for timing personality (affects chunk reveal speed) */
  characterName?: string
}

export function RichTextRenderer({
  text,
  effects = {},
  className,
  onComplete,
  clickToComplete = true,
  characterName
}: RichTextRendererProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [visibleChunks, setVisibleChunks] = useState<number>(0)
  const shouldReduceMotion = useReducedMotion()

  // Default to staggered if 'typewriter' is requested (migration strategy)
  const mode = effects.mode === 'typewriter' ? 'staggered' : (effects.mode || 'static')

  // FORCE DISABLE FLASHING: User feedback indicates it's confusing/weird.
  // We override the prop to ensure stable text rendering.
  const _isFlashing = false // was: effects.flashing

  // Split text into chunks respecting author intent
  // Priority: 1) Manual | separators, 2) Paragraph breaks (\n\n), 3) Keep as single chunk
  const chunks = React.useMemo(() => {
    if (!text) return []

    // If author used | separator, respect it
    if (text.includes('|')) {
      return text.split('|').map(c => c.trim()).filter(Boolean)
    }

    // Otherwise split by paragraph breaks
    const paragraphs = text.split(/\n\n+/).filter(Boolean)

    // If only one paragraph and it's very short, keep as single chunk
    if (paragraphs.length === 1 && paragraphs[0].length < 150) {
      return [text]
    }

    return paragraphs
  }, [text])

  useEffect(() => {
    // Reset state when text changes
    setIsComplete(false)
    setVisibleChunks(0)

    if (shouldReduceMotion || mode === 'static' || mode === 'fade-in') {
      setVisibleChunks(chunks.length)
      setIsComplete(true)
      onComplete?.()
      return
    }

    // Staggered reveal logic
    if (mode === 'staggered') {
      let currentChunk = 0

      const revealNextChunk = () => {
        if (currentChunk < chunks.length) {
          setVisibleChunks(prev => prev + 1)
          currentChunk++

          // Calculate delay based on chunk length and character personality
          // Uses character-specific timing from lib/character-typing.ts
          const chunkLength = chunks[currentChunk - 1]?.length || 0
          const calculatedDelay = calculateChunkDelay(characterName, chunkLength)

          // ISP FIX: Enforce a visual floor to prevent "clumping" of paragraphs
          // The CSS fade duration is 200ms. If delay < 300ms, paragraphs appear simultaneously.
          // We enforce 350ms minimum to ensure each paragraph has a distinct "beat".
          const delay = Math.max(calculatedDelay, 350)

          if (currentChunk < chunks.length) {
            setTimeout(revealNextChunk, delay)
          } else {
            setIsComplete(true)
            onComplete?.()
          }
        }
      }

      // Start revealing immediately
      revealNextChunk()
    }
  }, [text, mode, chunks, onComplete, shouldReduceMotion, clickToComplete, characterName])

  // Click to skip
  const handleSkip = () => {
    if (clickToComplete && !isComplete) {
      setVisibleChunks(chunks.length)
      setIsComplete(true)
      onComplete?.()
    }
  }

  // Helper to highlight words and render inline interactions
  const renderChunkWithHighlights = (chunkText: string) => {
    // First, parse interactions like <shake>text</shake> or <wave>text</wave>
    const segments = parseInlineInteractions(chunkText)

    return segments.map((segment, index) => {
      // Parse markdown within the segment content
      const content = parseMarkdown(segment.content)

      if (segment.type === 'interaction' && segment.interaction) {
        // Check if it's a kinetic typography effect (wave, shadow, weight, spacing)
        if (isKineticInteraction(segment.interaction)) {
          // Map interaction type to KineticEffect
          const kineticEffect = segment.interaction as KineticEffect
          return (
            <KineticText
              key={`kinetic-${index}`}
              effect={kineticEffect}
              delay={0.1 * index} // Stagger kinetic effects slightly
            >
              {segment.content}
            </KineticText>
          )
        }

        // Motion-based interaction (shake, jitter, nod, bloom, ripple, big, small, glitch)
        const animation = interactionAnimations[segment.interaction as MotionInteractionType]
        if (animation) {
          return (
            <motion.span
              key={`interaction-${index}`}
              {...animation}
              style={{ display: 'inline-block' }}
            >
              {content}
            </motion.span>
          )
        }
      }

      // Regular text segment
      return <React.Fragment key={`text-${index}`}>{content}</React.Fragment>
    })
  }

  // Simple markdown parser (bold ** and italic *)
  const parseMarkdown = (mdText: string) => {
    // Check for Internal Log pattern first: *[Internal Log: ...]* or just [Internal Log: ...]
    // We strip the wrapping italics if present
    const logMatch = mdText.match(/\*?\[Internal Log: (.*?)\]\*?/)
    if (logMatch) {
      return (
        <span className="font-mono text-xs text-emerald-400 block my-3 p-3 bg-black/40 rounded border-l-2 border-emerald-500/30 whitespace-pre-wrap font-medium tracking-wide shadow-inner">
          <span className="opacity-50 mr-2 uppercase tracking-widest text-2xs select-none">System Log</span>
          {logMatch[1]}
        </span>
      )
    }

    const parts = mdText.split(/(\*{1,3}[^*]+\*{1,3})/g)

    return parts.map((part, i) => {
      if (part.startsWith('***') && part.endsWith('***')) {
        return <strong key={i} className="italic">{part.slice(3, -3)}</strong>
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        const text = part.slice(1, -1)
        // Heuristic: If it looks like a full sentence (starts with capital, > 20 chars), treat as narrative action
        // This separates "He shuts down the hologram." (Action) from "I *really* mean it" (Emphasis)
        const isAction = /^[A-Z]/.test(text) && text.length > 20
        return (
          <em
            key={i}
            className={cn(
              isAction
                ? "text-amber-200/60 font-serif opacity-90 block my-2" // Block display for actions creates separation
                : "font-semibold text-amber-100" // Brighter for emphasis
            )}
          >
            {text}
          </em>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  // Get theme color
  const theme = STATE_THEMES[effects.state || 'default']

  return (
    <div
      className={cn(
        "rich-text-renderer space-y-4",
        !isComplete && clickToComplete && "cursor-pointer",
        className
      )}
      onClick={handleSkip}
    >
      {chunks.map((chunk, index) => (
        <React.Fragment key={`${text.substring(0, 10)}-${index}`}>
          {/* Whitespace divider between chunks - let spacing do the work */}
          {index > 0 && index < visibleChunks && (
            <div className="h-6" aria-hidden="true" />
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: index < visibleChunks ? 1 : 0
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "leading-relaxed",  // Color inherited from parent className (--text-dialogue)
              // Use invisible (not hidden) to reserve layout space and prevent CLS
              // This keeps the container height stable as chunks reveal
              index >= visibleChunks && "invisible pointer-events-none"
            )}
          >
            {renderChunkWithHighlights(chunk)}
          </motion.div>
        </React.Fragment>
      ))}

      {/* Thinking indicator (pulsing block) if processing */}
      {!isComplete && mode === 'staggered' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inline-block w-2 h-4 ml-1 bg-slate-400 animate-pulse"
          style={{ backgroundColor: theme.accent }}
        />
      )}
    </div>
  )
}
