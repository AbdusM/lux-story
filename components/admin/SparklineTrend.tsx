'use client'

import React, { useState } from 'react'

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

  /**
   * View mode for tooltip content (family vs research)
   */
  viewMode?: 'family' | 'research'

  /**
   * Optional skill name for context in tooltips
   */
  skillName?: string

  /**
   * Optional click handler
   */
  onClick?: () => void
}

/**
 * Interactive Sparkline Trend Indicator
 * Shows whether a skill gap is closing (↗), stable (→), or widening (↘)
 * Features: Tooltips on hover, clickable, keyboard accessible
 * Uses SVG polyline for smooth rendering at any size
 */
export function SparklineTrend({
  current,
  target,
  trendData,
  width = 40,
  height = 12,
  viewMode = 'family',
  skillName,
  onClick
}: SparklineTrendProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
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

  // Custom Tooltip
  const showTooltip = isHovered || isFocused
  const Tooltip = () => {
    if (!showTooltip) return null

    const gapPercentage = Math.round(gap * 100)
    const currentPercentage = Math.round(current * 100)
    const targetPercentage = Math.round(target * 100)

    if (viewMode === 'family') {
      return (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white p-2 border-2 border-blue-500 rounded shadow-xl pointer-events-none whitespace-nowrap">
          {skillName && <p className="font-semibold text-xs mb-1">{skillName}</p>}
          <p className="text-xs">
            <span style={{ color: trendColor }}>
              {trendDirection === 'improving' ? '📈 Improving' : trendDirection === 'declining' ? '📉 Needs work' : '➡️ Steady'}
            </span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            You: {currentPercentage}% → Goal: {targetPercentage}%
          </p>
          {onClick && <p className="text-xs text-blue-600 mt-1">Click for details</p>}
        </div>
      )
    } else {
      // Research mode
      return (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white p-2 border-2 border-blue-500 rounded shadow-xl pointer-events-none" style={{ minWidth: '180px' }}>
          {skillName && <p className="font-semibold text-xs mb-1">{skillName}</p>}
          <p className="text-xs">
            Status: <span style={{ color: trendColor }} className="font-medium">{trendDirection}</span>
          </p>
          <div className="text-xs text-gray-600 mt-1 space-y-0.5">
            <p>Current Level: {currentPercentage}%</p>
            <p>Target Level: {targetPercentage}%</p>
            <p>Gap: {gapPercentage}%</p>
            <p>Trend Data: {dataPoints.length} points</p>
          </div>
          {onClick && <p className="text-xs text-blue-600 mt-1">Click to view analysis →</p>}
        </div>
      )
    }
  }

  const Component = onClick ? 'button' : 'div'
  const interactiveProps = onClick ? {
    onClick,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    className: "inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 rounded px-1",
    type: "button" as const,
    'aria-label': skillName
      ? `${skillName} trend: ${trendDirection}. Current ${Math.round(current * 100)}%, target ${Math.round(target * 100)}%. Click for details.`
      : `Skill trend: ${trendDirection}. Current ${Math.round(current * 100)}%, target ${Math.round(target * 100)}%. Click for details.`
  } : {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    className: "inline-flex items-center gap-1 relative",
    role: "img" as const,
    'aria-label': `Skill trend: ${trendDirection}. Current ${Math.round(current * 100)}%, target ${Math.round(target * 100)}%`
  }

  return (
    <Component {...interactiveProps as any}>
      <Tooltip />

      {/* Sparkline SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={`inline-block transition-all duration-200 ${showTooltip ? 'scale-110' : ''}`}
        style={{ overflow: 'visible' }}
      >
        <desc>
          Sparkline showing {trendDirection} trend.
          Current level: {Math.round(current * 100)}%,
          Target level: {Math.round(target * 100)}%,
          Gap: {Math.round(gap * 100)}%
        </desc>

        {/* Background area (optional subtle fill) */}
        <polyline
          points={`0,100 ${svgPoints} 100,100`}
          fill={trendColor}
          fillOpacity={showTooltip ? "0.2" : "0.1"}
          className="transition-all duration-200"
        />

        {/* Trend line */}
        <polyline
          points={svgPoints}
          fill="none"
          stroke={trendColor}
          strokeWidth={showTooltip ? "5" : "4"}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-200"
        />

        {/* Data point dots */}
        {normalizedPoints.map((y, idx) => {
          const x = (idx / (dataPoints.length - 1)) * 100
          // Show first, last, and all points on hover
          if (showTooltip || idx === 0 || idx === normalizedPoints.length - 1) {
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r={showTooltip ? "3" : "2"}
                fill={trendColor}
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-200"
              />
            )
          }
          return null
        })}
      </svg>

      {/* Trend indicator icon */}
      <span
        className={`text-xs font-bold leading-none transition-all duration-200 ${showTooltip ? 'scale-125' : ''}`}
        style={{ color: trendColor }}
        aria-hidden="true"
      >
        {trendIcon}
      </span>
    </Component>
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
