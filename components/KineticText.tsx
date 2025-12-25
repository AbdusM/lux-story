"use client"

/**
 * KineticText - Animated Typography Effects
 *
 * Adds dynamic text animations for emotional emphasis in dialogue:
 * - wave: Letter-by-letter bounce animation
 * - shadow: Pulsing glow effect
 * - weight: Font weight shift (requires variable font)
 * - spacing: Letter-spacing breathing effect
 *
 * All effects respect prefers-reduced-motion.
 * Mobile-safe: Uses transform and opacity only.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useMemo } from 'react'
import { getPatternColor, type PatternType } from '@/lib/patterns'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type KineticEffect = 'wave' | 'shadow' | 'weight' | 'spacing'

interface KineticTextProps {
  /** Text content to animate */
  children: string
  /** Type of kinetic effect */
  effect: KineticEffect
  /** Delay before animation starts (seconds) */
  delay?: number
  /** Pattern type for color (affects shadow glow) */
  pattern?: PatternType
  /** Custom glow color (overrides pattern) */
  glowColor?: string
  /** Duration multiplier (1 = default, 2 = twice as long) */
  duration?: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Animated text with kinetic effects
 *
 * @example
 * ```tsx
 * <KineticText effect="wave">Hello!</KineticText>
 * <KineticText effect="shadow" pattern="exploring">Discover</KineticText>
 * ```
 */
export function KineticText({
  children,
  effect,
  delay = 0,
  pattern,
  glowColor,
  duration = 1,
}: KineticTextProps) {
  const prefersReducedMotion = useReducedMotion()

  // Get glow color from pattern or use custom
  const effectiveGlowColor = useMemo(() => {
    if (glowColor) return glowColor
    if (pattern) return getPatternColor(pattern)
    return '#8B5CF6' // Default purple
  }, [glowColor, pattern])

  // Return static text if reduced motion preferred
  if (prefersReducedMotion) {
    return <span>{children}</span>
  }

  switch (effect) {
    case 'wave':
      return <WaveText text={children} delay={delay} duration={duration} />
    case 'shadow':
      return (
        <ShadowPulseText
          text={children}
          delay={delay}
          glowColor={effectiveGlowColor}
          duration={duration}
        />
      )
    case 'weight':
      return <WeightShiftText text={children} delay={delay} duration={duration} />
    case 'spacing':
      return <SpacingBreatheText text={children} delay={delay} duration={duration} />
    default:
      return <span>{children}</span>
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// WAVE EFFECT - Letter-by-letter bounce
// ═══════════════════════════════════════════════════════════════════════════════

interface WaveTextProps {
  text: string
  delay: number
  duration: number
}

function WaveText({ text, delay, duration }: WaveTextProps) {
  const letters = text.split('')

  return (
    <span style={{ display: 'inline-flex' }} aria-label={text}>
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          style={{ display: 'inline-block' }}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 0.5 * duration,
            delay: delay + i * 0.03,
            repeat: 1,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOW PULSE EFFECT - Animated text-shadow glow
// ═══════════════════════════════════════════════════════════════════════════════

interface ShadowPulseTextProps {
  text: string
  delay: number
  glowColor: string
  duration: number
}

function ShadowPulseText({ text, delay, glowColor, duration }: ShadowPulseTextProps) {
  // Create RGBA version of color with transparency
  const glowRgba = hexToRgba(glowColor, 0.6)

  return (
    <motion.span
      style={{ display: 'inline-block' }}
      animate={{
        textShadow: [
          '0 0 0px transparent',
          `0 0 15px ${glowRgba}`,
          `0 0 30px ${glowRgba}`,
          `0 0 15px ${glowRgba}`,
          '0 0 0px transparent',
        ],
      }}
      transition={{
        duration: 2 * duration,
        delay,
        ease: 'easeInOut',
      }}
    >
      {text}
    </motion.span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEIGHT SHIFT EFFECT - Font weight animation
// ═══════════════════════════════════════════════════════════════════════════════

interface WeightShiftTextProps {
  text: string
  delay: number
  duration: number
}

function WeightShiftText({ text, delay, duration }: WeightShiftTextProps) {
  return (
    <motion.span
      style={{
        display: 'inline-block',
        fontWeight: 400,
      }}
      animate={{
        fontWeight: [400, 700, 400],
      }}
      transition={{
        duration: 1.2 * duration,
        delay,
        ease: 'easeInOut',
      }}
    >
      {text}
    </motion.span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPACING BREATHE EFFECT - Letter-spacing animation
// ═══════════════════════════════════════════════════════════════════════════════

interface SpacingBreatheTextProps {
  text: string
  delay: number
  duration: number
}

function SpacingBreatheText({ text, delay, duration }: SpacingBreatheTextProps) {
  return (
    <motion.span
      style={{ display: 'inline-block' }}
      animate={{
        letterSpacing: ['0em', '0.06em', '0em'],
      }}
      transition={{
        duration: 2 * duration,
        delay,
        ease: 'easeInOut',
      }}
    >
      {text}
    </motion.span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert hex color to rgba
 */
function hexToRgba(hex: string, alpha: number): string {
  // Handle shorthand hex
  let color = hex.replace('#', '')
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('')
  }

  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOUND EFFECTS - Multiple animations combined
// ═══════════════════════════════════════════════════════════════════════════════

interface EmphasisTextProps {
  children: string
  /** Intensity level (1-3) */
  intensity?: 1 | 2 | 3
  pattern?: PatternType
}

/**
 * Pre-configured emphasis effect combining wave + shadow
 * Use for important dialogue moments
 */
export function EmphasisText({
  children,
  intensity = 1,
  pattern,
}: EmphasisTextProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <strong>{children}</strong>
  }

  const glowColor = pattern ? getPatternColor(pattern) : '#8B5CF6'

  // Intensity affects animation duration and glow strength
  const duration = 1 + (intensity - 1) * 0.3
  const glowOpacity = 0.4 + intensity * 0.2

  return (
    <motion.strong
      style={{
        display: 'inline-block',
        textShadow: `0 0 ${intensity * 10}px ${hexToRgba(glowColor, glowOpacity)}`,
      }}
      animate={{
        scale: [1, 1.02, 1],
        textShadow: [
          `0 0 ${intensity * 5}px ${hexToRgba(glowColor, glowOpacity * 0.5)}`,
          `0 0 ${intensity * 15}px ${hexToRgba(glowColor, glowOpacity)}`,
          `0 0 ${intensity * 5}px ${hexToRgba(glowColor, glowOpacity * 0.5)}`,
        ],
      }}
      transition={{
        duration: 1.5 * duration,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.strong>
  )
}
