"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  CognitiveDomainId,
  CognitiveDomainScore,
  COGNITIVE_DOMAIN_IDS,
  DOMAIN_METADATA,
  DOMAIN_THRESHOLDS,
  getLevelColor
} from "@/lib/cognitive-domains"
import { useColorBlindMode } from "@/hooks/useColorBlindMode"
import { springs } from "@/lib/animations"

interface CognitionRadarProps {
  domains: Record<CognitiveDomainId, CognitiveDomainScore>
  size?: number
  onDomainClick?: (domainId: CognitiveDomainId) => void
  highlightedDomain?: CognitiveDomainId | null
  compact?: boolean
}

/**
 * CognitionRadar - 11-axis radar chart for cognitive domain visualization
 *
 * Visual features:
 * - 11 axes radiating from center (one per domain)
 * - Filled polygon showing current domain levels
 * - Grid lines at threshold levels (EMERGING, DEVELOPING, FLOURISHING, MASTERY)
 * - Domain labels around the perimeter
 * - Optional click interaction for domain selection
 * - Colorblind-safe mode support
 */
export function CognitionRadar({
  domains,
  size = 280,
  onDomainClick,
  highlightedDomain,
  compact = false
}: CognitionRadarProps) {
  const prefersReducedMotion = useReducedMotion()
  const [colorBlindMode] = useColorBlindMode()

  // Calculate radar geometry
  const center = size / 2
  const maxRadius = (size / 2) - (compact ? 20 : 40) // Leave room for labels
  const labelRadius = maxRadius + (compact ? 15 : 30)

  // Normalize domain scores to 0-1 range (capped at MASTERY threshold)
  const normalizedScores = useMemo(() => {
    const maxScore = DOMAIN_THRESHOLDS.MASTERY + 5 // Allow some overflow
    return COGNITIVE_DOMAIN_IDS.reduce((acc, id) => {
      const score = domains[id]?.rawScore || 0
      acc[id] = Math.min(score / maxScore, 1)
      return acc
    }, {} as Record<CognitiveDomainId, number>)
  }, [domains])

  // Calculate point positions for each domain
  const domainPoints = useMemo(() => {
    const angleStep = (2 * Math.PI) / COGNITIVE_DOMAIN_IDS.length
    const startAngle = -Math.PI / 2 // Start from top

    return COGNITIVE_DOMAIN_IDS.map((id, index) => {
      const angle = startAngle + (index * angleStep)
      const value = normalizedScores[id]
      const radius = value * maxRadius

      return {
        id,
        angle,
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        labelX: center + Math.cos(angle) * labelRadius,
        labelY: center + Math.sin(angle) * labelRadius,
        axisEndX: center + Math.cos(angle) * maxRadius,
        axisEndY: center + Math.sin(angle) * maxRadius,
        value
      }
    })
  }, [normalizedScores, center, maxRadius, labelRadius])

  // Generate polygon path for the filled area
  const polygonPath = useMemo(() => {
    if (domainPoints.length === 0) return ''
    return domainPoints
      .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z'
  }, [domainPoints])

  // Generate grid circles at threshold levels
  const gridLevels = useMemo(() => {
    const maxScore = DOMAIN_THRESHOLDS.MASTERY + 5
    return [
      { label: 'Emerging', threshold: DOMAIN_THRESHOLDS.EMERGING, radius: (DOMAIN_THRESHOLDS.EMERGING / maxScore) * maxRadius },
      { label: 'Developing', threshold: DOMAIN_THRESHOLDS.DEVELOPING, radius: (DOMAIN_THRESHOLDS.DEVELOPING / maxScore) * maxRadius },
      { label: 'Flourishing', threshold: DOMAIN_THRESHOLDS.FLOURISHING, radius: (DOMAIN_THRESHOLDS.FLOURISHING / maxScore) * maxRadius },
      { label: 'Mastery', threshold: DOMAIN_THRESHOLDS.MASTERY, radius: (DOMAIN_THRESHOLDS.MASTERY / maxScore) * maxRadius }
    ]
  }, [maxRadius])

  // Get domain color (with colorblind support)
  const getDomainColor = (domainId: CognitiveDomainId): string => {
    const meta = DOMAIN_METADATA[domainId]
    return colorBlindMode !== 'default' ? meta.colorblindSafe : meta.color
  }

  // Create gradient for filled polygon
  const gradientId = `cognition-gradient-${size}`

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
      role="img"
      aria-label="Cognitive domain radar chart"
    >
      <defs>
        {/* Gradient for the filled area */}
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
        </radialGradient>

        {/* Glow filter for highlighted domain */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <circle
        cx={center}
        cy={center}
        r={maxRadius}
        fill="rgba(0,0,0,0.2)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />

      {/* Grid circles at threshold levels */}
      {gridLevels.map((level) => (
        <circle
          key={level.label}
          cx={center}
          cy={center}
          r={level.radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Axis lines */}
      {domainPoints.map((point) => (
        <line
          key={`axis-${point.id}`}
          x1={center}
          y1={center}
          x2={point.axisEndX}
          y2={point.axisEndY}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      ))}

      {/* Filled polygon (animated) */}
      <motion.path
        d={polygonPath}
        fill={`url(#${gradientId})`}
        stroke="rgba(139, 92, 246, 0.6)"
        strokeWidth="2"
        initial={!prefersReducedMotion ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={springs.smooth}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Domain points */}
      {domainPoints.map((point, index) => {
        const isHighlighted = highlightedDomain === point.id
        const color = getDomainColor(point.id)
        const domain = domains[point.id]

        return (
          <g key={point.id}>
            {/* Point circle */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={isHighlighted ? 6 : 4}
              fill={color}
              stroke="white"
              strokeWidth={isHighlighted ? 2 : 1}
              filter={isHighlighted ? "url(#glow)" : undefined}
              initial={!prefersReducedMotion ? { scale: 0 } : false}
              animate={{ scale: 1 }}
              transition={{
                ...springs.snappy,
                delay: index * 0.03
              }}
              onClick={() => onDomainClick?.(point.id)}
              className={onDomainClick ? 'cursor-pointer' : ''}
              role={onDomainClick ? 'button' : undefined}
              aria-label={`${DOMAIN_METADATA[point.id].name}: ${domain?.level || 'dormant'}`}
            />

            {/* Domain label (only if not compact) */}
            {!compact && (
              <motion.text
                x={point.labelX}
                y={point.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[9px] fill-slate-400 ${onDomainClick ? 'cursor-pointer hover:fill-white' : ''} ${isHighlighted ? 'fill-white font-medium' : ''}`}
                onClick={() => onDomainClick?.(point.id)}
                initial={!prefersReducedMotion ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{
                  ...springs.gentle,
                  delay: 0.2 + index * 0.02
                }}
              >
                {DOMAIN_METADATA[point.id].shortName}
              </motion.text>
            )}
          </g>
        )
      })}

      {/* Center dot */}
      <circle
        cx={center}
        cy={center}
        r={3}
        fill="rgba(255,255,255,0.3)"
      />
    </svg>
  )
}
