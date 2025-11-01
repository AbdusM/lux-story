"use client"

/**
 * RichTextRenderer - Terminal-style rich text with character-level animations
 * 
 * Inspired by Claude Code CLI and advanced terminal tools, this component provides:
 * - Character-level color cycling and animations
 * - Flashing/blinking effects for emphasis
 * - Rainbow/spectrum effects for active states
 * - State-based color themes (thinking, executing, warning, success)
 * - Syntax-highlighting-like effects
 * - Per-word/per-letter selective styling
 * 
 * Usage:
 *   <RichTextRenderer 
 *     text="Hello **world**" 
 *     effects={{ 
 *       mode: 'typewriter',
 *       highlightWords: ['world'],
 *       state: 'thinking'
 *     }}
 *   />
 */

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'

// Color themes for different states
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

// Rainbow color palette for spectrum effects
const RAINBOW_COLORS = [
  '#ff0000', '#ff7f00', '#ffff00', '#00ff00',
  '#0000ff', '#4b0082', '#9400d3'
]

export interface RichTextEffect {
  /** Animation mode */
  mode?: 'static' | 'typewriter' | 'fade-in' | 'line-fade-in' | 'wave' | 'rainbow'
  
  /** State-based color theme */
  state?: keyof typeof STATE_THEMES
  
  /** Words or phrases to highlight with special effects */
  highlightWords?: string[]
  
  /** Individual characters to highlight (by index) */
  highlightChars?: number[]
  
  /** Enable flashing/blinking effect on highlighted text */
  flashing?: boolean
  
  /** Enable rainbow cycling effect */
  rainbow?: boolean
  
  /** Speed of animations (1 = normal, 2 = fast, 0.5 = slow) */
  speed?: number
  
  /** Character delay for typewriter effect (ms) */
  charDelay?: number
  
  /** Enable per-character color variations */
  perCharColor?: boolean
}

interface RichTextRendererProps {
  text: string
  effects?: RichTextEffect
  className?: string
  onComplete?: () => void
  /** Enable click to skip animations */
  clickToComplete?: boolean
}

interface CharacterData {
  char: string
  index: number
  isHighlighted: boolean
  wordIndex: number
  shouldFlash: boolean
  shouldRainbow: boolean
}

/**
 * Parse text with markdown-style emphasis and extract character data
 */
function parseTextWithEffects(
  text: string,
  effects: RichTextEffect = {}
): CharacterData[] {
  const { highlightWords = [], highlightChars = [] } = effects
  
  // First, parse markdown emphasis and track positions
  const emphasisRegex = /(\*{1,3})([^*]+?)\1/g
  const emphasisRanges: Array<{ start: number; end: number; level: number }> = []
  let match: RegExpExecArray | null
  
  // Find all emphasis markers (but don't remove them yet - we need original positions)
  while ((match = emphasisRegex.exec(text)) !== null) {
    emphasisRanges.push({
      start: match.index,
      end: match.index + match[0].length,
      level: match[1].length
    })
  }
  
  // Build character array
  const chars: CharacterData[] = []
  let charIndex = 0
  let wordIndex = 0
  let currentWord = ''
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const isSpace = /\s/.test(char)
    
    if (isSpace && currentWord) {
      // End of word
      const isHighlighted = highlightWords.some(word => 
        currentWord.toLowerCase().includes(word.toLowerCase())
      )
      
      // Mark all chars in this word
      for (let j = chars.length - currentWord.length; j < chars.length; j++) {
        if (chars[j]) {
          chars[j].isHighlighted = isHighlighted
        }
      }
      
      currentWord = ''
      wordIndex++
    } else if (!isSpace) {
      currentWord += char
    }
    
    // Check if this char should be highlighted
    const shouldHighlight = highlightChars.includes(charIndex)
    const shouldFlash = (shouldHighlight || 
      highlightWords.some(word => currentWord.toLowerCase().includes(word.toLowerCase()))
    ) && effects.flashing === true
    
    const shouldRainbow = (shouldHighlight ||
      highlightWords.some(word => currentWord.toLowerCase().includes(word.toLowerCase()))
    ) && effects.rainbow === true
    
    chars.push({
      char,
      index: charIndex,
      isHighlighted: shouldHighlight,
      wordIndex,
      shouldFlash,
      shouldRainbow
    })
    
    charIndex++
  }
  
  // Handle last word
  if (currentWord) {
    const isHighlighted = highlightWords.some(word => 
      currentWord.toLowerCase().includes(word.toLowerCase())
    )
    for (let j = chars.length - currentWord.length; j < chars.length; j++) {
      if (chars[j]) {
        chars[j].isHighlighted = isHighlighted
        if (effects.flashing) chars[j].shouldFlash = true
        if (effects.rainbow) chars[j].shouldRainbow = true
      }
    }
  }
  
  return chars
}

/**
 * Get color for a character based on effects and animation state
 */
function getCharacterColor(
  charData: CharacterData,
  effects: RichTextEffect,
  animationTime: number,
  charIndex: number
): string {
  const theme = STATE_THEMES[effects.state || 'default']
  const speed = effects.speed || 1
  
  // Rainbow effect
  if (charData.shouldRainbow) {
    const rainbowIndex = Math.floor((animationTime * speed * 2 + charIndex * 0.3) % RAINBOW_COLORS.length)
    return RAINBOW_COLORS[rainbowIndex]
  }
  
  // Flashing effect
  if (charData.shouldFlash) {
    const flashPhase = Math.sin(animationTime * speed * 4) * 0.5 + 0.5
    const flashColor = flashPhase > 0.5 ? theme.pulse : theme.base
    return flashColor
  }
  
  // Per-character color variation
  if (effects.perCharColor) {
    const variation = Math.sin(animationTime * speed + charIndex * 0.2) * 0.2
    const r = parseInt(theme.base.slice(1, 3), 16)
    const g = parseInt(theme.base.slice(3, 5), 16)
    const b = parseInt(theme.base.slice(5, 7), 16)
    
    const adjustedR = Math.max(0, Math.min(255, r + variation * 255))
    const adjustedG = Math.max(0, Math.min(255, g + variation * 255))
    const adjustedB = Math.max(0, Math.min(255, b + variation * 255))
    
    return `rgb(${Math.floor(adjustedR)}, ${Math.floor(adjustedG)}, ${Math.floor(adjustedB)})`
  }
  
  // Highlighted characters use accent color
  if (charData.isHighlighted) {
    return theme.accent
  }
  
  // Default color
  return theme.base
}

export function RichTextRenderer({
  text,
  effects = {},
  className,
  onComplete,
  clickToComplete = true
}: RichTextRendererProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [animationTime, setAnimationTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  
  const mode = effects.mode || 'static'
  const charDelay = effects.charDelay || (effects.mode === 'typewriter' ? 30 : 0)
  
  // Parse text into character data
  const characterData = useMemo(
    () => parseTextWithEffects(text, effects),
    [text, effects.highlightWords, effects.highlightChars]
  )
  
  // Fade-in and typewriter effects
  useEffect(() => {
    if (mode === 'fade-in') {
      // Fade-in: show text immediately with CSS animation
      setDisplayedText(text)
      setIsComplete(true)
      // Call onComplete after animation delay (400ms typical fade duration)
      setTimeout(() => onComplete?.(), 400)
      return
    }
    
    // Note: line-fade-in mode removed - was over-complicated
    // Use simple fade-in instead for clean, non-distracting animations
    
    if (mode !== 'typewriter') {
      setDisplayedText(text)
      setIsComplete(true)
      onComplete?.()
      return
    }
    
    let charIndex = 0
    const timer = setInterval(() => {
      if (charIndex < characterData.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        onComplete?.()
      }
    }, charDelay)
    
    return () => clearInterval(timer)
  }, [text, mode, charDelay, characterData.length, onComplete])
  
  // Animation loop for continuous effects (rainbow, flashing, etc.)
  useEffect(() => {
    if (effects.rainbow || effects.flashing || effects.perCharColor) {
      startTimeRef.current = performance.now()
      
      // For perCharColor, limit animation duration (stop after 3 seconds)
      const maxDuration = effects.perCharColor ? 3 : Infinity
      
      const animate = () => {
        if (startTimeRef.current) {
          const elapsed = (performance.now() - startTimeRef.current) / 1000
          
          // Stop perCharColor animation after maxDuration
          if (effects.perCharColor && elapsed >= maxDuration) {
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current)
            }
            return
          }
          
          setAnimationTime(elapsed)
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate)
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [effects.rainbow, effects.flashing, effects.perCharColor])
  
  // Click to complete
  const handleClick = () => {
    if (clickToComplete && !isComplete && mode === 'typewriter') {
      setDisplayedText(text)
      setIsComplete(true)
      onComplete?.()
    }
  }
  
  // Render characters with effects
  const renderText = () => {
    const displayLength = displayedText.length
    const chars = characterData.slice(0, displayLength)
    
    // Parse markdown-style emphasis in displayed text
    const emphasisRegex = /(\*{1,3})([^*]+?)\1/g
    const emphasisParts: Array<{ text: string; level: number; startIndex: number }> = []
    let match: RegExpExecArray | null
    
    while ((match = emphasisRegex.exec(displayedText)) !== null) {
      emphasisParts.push({
        text: match[2],
        level: match[1].length,
        startIndex: match.index
      })
    }
    
    // If no emphasis or effects, render simply
    if (!effects.rainbow && !effects.flashing && !effects.perCharColor && emphasisParts.length === 0) {
      // Check if we have any highlights
      const hasHighlights = chars.some(c => c.isHighlighted)
      
      if (!hasHighlights) {
        // Simple rendering
        return <>{displayedText}</>
      }
    }
    
    // Render with effects
    return chars.map((charData, index) => {
      // Check if this character is part of an emphasis marker
      let isInEmphasis = false
      let emphasisLevel = 0
      
      for (const emphasis of emphasisParts) {
        const endIndex = emphasis.startIndex + emphasis.text.length + emphasis.level * 2
        if (index >= emphasis.startIndex && index < endIndex) {
          // Check if we're in the actual text part (not the asterisks)
          if (index >= emphasis.startIndex + emphasis.level && 
              index < emphasis.startIndex + emphasis.level + emphasis.text.length) {
            isInEmphasis = true
            emphasisLevel = emphasis.level
          }
        }
      }
      
      const color = getCharacterColor(charData, effects, animationTime, index)
      const isSpace = /\s/.test(charData.char)
      
      // Skip rendering spaces with special effects (keep them normal)
      if (isSpace && !charData.isHighlighted && !isInEmphasis) {
        return <span key={index}>{charData.char}</span>
      }
      
      // Determine styling based on emphasis and effects
      let fontWeight = 'normal'
      let fontStyle = 'normal'
      
      if (emphasisLevel === 3) {
        fontWeight = 'bold'
        fontStyle = 'italic'
      } else if (emphasisLevel === 2) {
        fontWeight = 'bold'
      } else if (emphasisLevel === 1) {
        fontStyle = 'italic'
      }
      
      const hasEffect = charData.isHighlighted || charData.shouldFlash || charData.shouldRainbow
      
      return (
        <span
          key={index}
          style={{
            color: hasEffect ? color : undefined,
            fontWeight,
            fontStyle,
            transition: effects.rainbow || effects.flashing ? 'none' : 'color 0.1s ease',
          }}
          className={cn(
            charData.shouldFlash && 'flash-char',
            charData.shouldRainbow && 'rainbow-char',
            charData.isHighlighted && !charData.shouldFlash && !charData.shouldRainbow && 'font-semibold'
          )}
        >
          {charData.char}
        </span>
      )
    })
  }
  
  return (
    <div
      className={cn(
        'rich-text-renderer',
        clickToComplete && mode === 'typewriter' && !isComplete && 'cursor-pointer',
        // Only apply fade-in class if not already in className (for split fade-in support)
        mode === 'fade-in' && !className?.includes('fade-in-text') && 'fade-in-text',
        className
      )}
      onClick={handleClick}
      style={{ transition: 'none' }}
    >
      <span className="whitespace-pre-wrap" style={{ transition: 'none' }}>
        {renderText()}
      </span>
      
      {/* Typing cursor */}
      {mode === 'typewriter' && !isComplete && (
        <span
          className="animate-pulse text-gray-600 ml-1"
          style={{
            color: STATE_THEMES[effects.state || 'default'].accent
          }}
        >
          ▋
        </span>
      )}
    </div>
  )
}
