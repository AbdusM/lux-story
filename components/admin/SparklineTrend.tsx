'use client'

import React from 'react'

interface SparklineTrendProps {
  /**
   * Current skill level (0-1 scale)
   */
  current: number

  /**
   * Target skill level (0-1 scale)
   */
  target: number

  /**
   * Optional: Historical trend data points (0-1 scale)
   * If not provided, will generate simulated trend based on current/target
   */
  trendData?: number[]

  /**
   * Width in pixels (default: 40px)
   */
  width?: number

  /**
   * Height in pixels (default: 12px)
   */
  height?: number
}

/**
 * CSS-Only Sparkline Trend Indicator
 * Shows whether a skill gap is closing (↗), stable (→), or widening (↘)
 * Uses SVG polyline for smooth rendering at any size
 */
export function SparklineTrend({
  current,
  target,
  trendData,
  width = 40,
  height = 12
}: SparklineTrendProps) {
  // Calculate gap and trend
  const gap = target - current

  // Generate trend data if not provided (simulated historical progression)
  let dataPoints: number[]
  if (trendData && trendData.length > 0) {
    dataPoints = trendData
  } else {
    // Simulate 5-point trend based on current gap
    // Assumption: if gap is small, trend is improving; if large, trend is stable or declining
    const baseLevel = Math.max(0, current - 0.15) // Start 15% lower
    const progression = current - baseLevel
    const step = progression / 4

    dataPoints = [
      baseLevel,
      baseLevel + step,
      baseLevel + step * 2,
      baseLevel + step * 3,
      current
    ]
  }

  // Determine trend direction
  let trendDirection: 'improving' | 'stable' | 'declining'
  let trendColor: string
  let trendIcon: string

  if (dataPoints.length >= 2) {
    const first = dataPoints[0]
    const last = dataPoints[dataPoints.length - 1]
    const change = last - first

    // Improving if progressing toward target
    if (change > 0.05 && gap > 0) {
      trendDirection = 'improving'
      trendColor = 'rgb(34, 197, 94)' // green-500
      trendIcon = '↗'
    } else if (Math.abs(change) <= 0.05) {
      trendDirection = 'stable'
      trendColor = 'rgb(234, 179, 8)' // yellow-500
      trendIcon = '→'
    } else {
      trendDirection = 'declining'
      trendColor = 'rgb(239, 68, 68)' // red-500
      trendIcon = '↘'
    }
  } else {
    // Not enough data
    trendDirection = 'stable'
    trendColor = 'rgb(156, 163, 175)' // gray-400
    trendIcon = '—'
  }

  // Normalize data points to 0-100 range for SVG coordinates
  const minVal = Math.min(...dataPoints)
  const maxVal = Math.max(...dataPoints)
  const range = maxVal - minVal || 0.01 // Avoid division by zero

  const normalizedPoints = dataPoints.map(val => {
    return 100 - ((val - minVal) / range) * 100 // Invert Y for SVG (0 is top)
  })

  // Generate SVG polyline points
  const svgPoints = normalizedPoints
    .map((y, idx) => {
      const x = (idx / (dataPoints.length - 1)) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div
      className="inline-flex items-center gap-1"
      role="img"
      aria-label={`Skill trend: ${trendDirection}. ${trendIcon}`}
    >
      {/* Sparkline SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="inline-block"
        style={{ overflow: 'visible' }}
      >
        {/* Background area (optional subtle fill) */}
        <polyline
          points={`0,100 ${svgPoints} 100,100`}
          fill={trendColor}
          fillOpacity="0.1"
        />

        {/* Trend line */}
        <polyline
          points={svgPoints}
          fill="none"
          stroke={trendColor}
          strokeWidth="4"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data point dots (optional) */}
        {normalizedPoints.map((y, idx) => {
          const x = (idx / (dataPoints.length - 1)) * 100
          // Only show first and last dot for cleaner look
          if (idx === 0 || idx === normalizedPoints.length - 1) {
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="2"
                fill={trendColor}
                vectorEffect="non-scaling-stroke"
              />
            )
          }
          return null
        })}
      </svg>

      {/* Trend indicator icon */}
      <span
        className="text-xs font-bold leading-none"
        style={{ color: trendColor }}
        aria-hidden="true"
      >
        {trendIcon}
      </span>
    </div>
  )
}

/**
 * Simple text-only trend indicator (ultra-minimal fallback)
 */
export function SimpleTrendIndicator({ current, target }: { current: number; target: number }) {
  const gap = target - current

  let color: string
  let icon: string
  let label: string

  if (gap <= 0) {
    color = 'text-green-600'
    icon = '✓'
    label = 'Met'
  } else if (gap < 0.1) {
    color = 'text-green-600'
    icon = '↗'
    label = 'Improving'
  } else if (gap < 0.2) {
    color = 'text-yellow-600'
    icon = '→'
    label = 'Developing'
  } else {
    color = 'text-yellow-600'
    icon = '↘'
    label = 'Needs Work'
  }

  return (
    <span className={`text-xs font-medium ${color}`}>
      {icon} {label}
    </span>
  )
}
