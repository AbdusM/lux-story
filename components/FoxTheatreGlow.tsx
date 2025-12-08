"use client"

/**
 * FoxTheatreGlow - Marquee-style chase light effect
 *
 * Inspired by the Fox Theatre Birmingham's iconic marquee.
 * Used to draw attention to icons when new content is available.
 *
 * Design principle: Subtle discovery prompts, not interruptions.
 * The glow invites exploration without breaking narrative flow.
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FoxTheatreGlowProps {
  active: boolean
  color?: string
  children: React.ReactNode
  className?: string
}

export function FoxTheatreGlow({
  active,
  color = '#F59E0B', // amber-500 default
  children,
  className
}: FoxTheatreGlowProps) {
  if (!active) {
    return <>{children}</>
  }

  return (
    <div className={cn("relative", className)}>
      {/* Chase light ring */}
      <motion.div
        className="absolute inset-[-3px] rounded-full pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${color}66 15%, transparent 30%)`,
        }}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Subtle glow backdrop */}
      <motion.div
        className="absolute inset-[-2px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

/**
 * Simple pulse glow - less dramatic version
 */
export function PulseGlow({
  active,
  color = '#F59E0B',
  children,
  className
}: FoxTheatreGlowProps) {
  if (!active) {
    return <>{children}</>
  }

  return (
    <div className={cn("relative", className)}>
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-[-2px] rounded-full pointer-events-none"
        style={{
          boxShadow: `0 0 8px 2px ${color}44`
        }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
