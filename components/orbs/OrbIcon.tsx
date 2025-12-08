"use client"

/**
 * OrbIcon - Animated orb with pattern-based coloring
 *
 * Visual representation of insight orbs. Features:
 * - Pattern-specific colors
 * - Tier-based glow intensity
 * - Subtle pulse animation
 * - Fox Theatre marquee chase effect on milestone
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type OrbType, type OrbTier, getOrbColor, getOrbTierMetadata } from '@/lib/orbs'

interface OrbIconProps {
  type: OrbType
  tier?: OrbTier
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  showGlow?: boolean
  milestone?: boolean // Fox Theatre chase effect
  className?: string
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
}

export function OrbIcon({
  type,
  tier = 'nascent',
  size = 'md',
  animated = true,
  showGlow = true,
  milestone = false,
  className
}: OrbIconProps) {
  const pixelSize = sizeMap[size]
  const color = getOrbColor(type)
  const tierMeta = getOrbTierMetadata(tier)
  const glowIntensity = tierMeta.glowIntensity

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center justify-center',
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
      animate={animated ? {
        scale: [1, 1.05, 1],
      } : undefined}
      transition={animated ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      } : undefined}
    >
      {/* Glow effect */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}${Math.round(glowIntensity * 60).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            filter: `blur(${pixelSize / 4}px)`,
          }}
          animate={animated ? {
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.2, 1]
          } : undefined}
          transition={animated ? {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          } : undefined}
        />
      )}

      {/* Fox Theatre chase effect for milestones */}
      {milestone && (
        <motion.div
          className="absolute inset-[-4px] rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${color} 10%, transparent 20%)`,
          }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: 3,
            ease: 'linear'
          }}
        />
      )}

      {/* Main orb SVG */}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 24 24"
        className="relative z-10"
      >
        <defs>
          {/* Radial gradient for 3D effect */}
          <radialGradient id={`orb-gradient-${type}`} cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="30%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </radialGradient>

          {/* Inner shine */}
          <radialGradient id={`orb-shine-${type}`} cx="30%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Main orb circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill={`url(#orb-gradient-${type})`}
        />

        {/* Inner shine highlight */}
        <circle
          cx="9"
          cy="9"
          r="4"
          fill={`url(#orb-shine-${type})`}
        />

        {/* Subtle ring */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>
    </motion.div>
  )
}

/**
 * OrbIconStatic - Non-animated version for lists/tables
 */
export function OrbIconStatic({
  type,
  size = 'sm',
  className
}: {
  type: OrbType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <OrbIcon
      type={type}
      size={size}
      animated={false}
      showGlow={false}
      className={className}
    />
  )
}
