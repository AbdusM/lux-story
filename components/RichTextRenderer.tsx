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
import { parseInlineInteractions, interactionAnimations } from '@/lib/interaction-parser'
import { calculateChunkDelay } from '@/lib/character-typing'

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
          const delay = calculateChunkDelay(characterName, chunkLength)
          
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
    // First, parse interactions like <shake>text</shake>
    const segments = parseInlineInteractions(chunkText)
    
    return segments.map((segment, index) => {
      // Parse markdown within the segment content
      const content = parseMarkdown(segment.content)
      
      if (segment.type === 'interaction' && segment.interaction) {
        // If it's an interaction, wrap in motion.span
        const animation = interactionAnimations[segment.interaction]
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
      
      // Regular text segment
      return <React.Fragment key={`text-${index}`}>{content}</React.Fragment>
    })
  }
  
  // Simple markdown parser (bold ** and italic *)
  const parseMarkdown = (mdText: string) => {
    const parts = mdText.split(/(\*{1,3}[^*]+\*{1,3})/g)
    
    return parts.map((part, i) => {
      if (part.startsWith('***') && part.endsWith('***')) {
        return <strong key={i} className="italic">{part.slice(3, -3)}</strong>
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>
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
          {/* Subtle visual divider between chunks (Instagram-style) */}
          {index > 0 && index < visibleChunks && (
            <div className="flex items-center justify-center py-4" aria-hidden="true">
              <div className="w-12 h-px bg-slate-300/40" />
              <span className="px-2 text-slate-400 text-xs">·</span>
              <div className="w-12 h-px bg-slate-300/40" />
            </div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: index < visibleChunks ? 1 : 0
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "leading-relaxed text-slate-700",
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
