'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { formatAdminDate } from '@/lib/admin-date-formatting'

// Generic skill demonstration interface compatible with both tracker and adapter types
interface SkillDemo {
  scene: string
  context: string
  timestamp?: number
  [key: string]: any // Allow additional properties
}

interface SkillProgressionChartProps {
  skillDemonstrations: Record<string, SkillDemo[]>
  totalDemonstrations: number
  viewMode?: 'family' | 'research'
  onDataPointClick?: (data: { timestamp: number; count: number; skill?: string }) => void
}

interface TimelinePoint {
  timestamp: number
  cumulativeCount: number
  label: string
}

/**
 * Interactive Skill Progression Timeline Chart
 * Shows cumulative skill demonstrations over time
 * Features: Tooltips, clickable data points, keyboard navigation
 * Mobile-responsive and WCAG AA accessible
 */
export function SkillProgressionChart({
  skillDemonstrations,
  totalDemonstrations,
  viewMode = 'family',
  onDataPointClick
}: SkillProgressionChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [focusedPoint, setFocusedPoint] = useState<number | null>(null)
  // Extract all demonstrations with timestamps
  const allDemos: SkillDemo[] = []
  Object.values(skillDemonstrations).forEach(demos => {
    allDemos.push(...demos)
  })

  // Sort by timestamp
  const sortedDemos = allDemos
    .filter(demo => demo.timestamp)
    .sort((a, b) => a.timestamp! - b.timestamp!)

  if (sortedDemos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Skill Growth Timeline
          </CardTitle>
          <CardDescription>Cumulative skill demonstrations over time</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          No timeline data available yet. Timestamps will be recorded as the student progresses.
        </CardContent>
      </Card>
    )
  }

  // Create timeline points (start + milestones + current)
  const timelinePoints: TimelinePoint[] = []

  // Start point
  const firstTimestamp = sortedDemos[0].timestamp!
  timelinePoints.push({
    timestamp: firstTimestamp,
    cumulativeCount: 0,
    label: 'Start'
  })

  // Add milestone points (every 25% of journey)
  const milestoneIntervals = [0.25, 0.5, 0.75, 1.0]
  milestoneIntervals.forEach(interval => {
    const index = Math.floor((sortedDemos.length - 1) * interval)
    if (index >= 0 && index < sortedDemos.length) {
      const demo = sortedDemos[index]
      timelinePoints.push({
        timestamp: demo.timestamp!,
        cumulativeCount: index + 1,
        label: interval === 1.0 ? 'Current' : `${Math.round(interval * 100)}%`
      })
    }
  })

  // Remove duplicates and sort
  const uniquePoints = Array.from(
    new Map(timelinePoints.map(p => [p.timestamp, p])).values()
  ).sort((a, b) => a.timestamp - b.timestamp)

  // Calculate chart dimensions
  const maxCount = totalDemonstrations
  const chartHeight = 120 // pixels
  const pointRadius = 4

  // Custom Tooltip Component
  const CustomTooltip = ({ point, _index }: { point: TimelinePoint; _index: number }) => {
    if (viewMode === 'family') {
      return (
        <div className="absolute z-50 bg-white p-3 border-2 border-blue-500 rounded-lg shadow-xl transform -translate-x-1/2 pointer-events-none"
             style={{ minWidth: '200px' }}>
          <p className="font-semibold text-sm text-gray-900">{point.cumulativeCount} Skills Shown</p>
          <p className="text-xs text-gray-600 mt-1">
            {formatAdminDate(point.timestamp, 'evidence', viewMode)}
          </p>
          <p className="text-xs text-blue-600 mt-2 font-medium">🔗 Click to see details</p>
        </div>
      )
    } else {
      // Research mode - more technical details
      const demos = sortedDemos.slice(0, point.cumulativeCount)
      const sceneTypes = demos.reduce((acc, demo) => {
        const scene = demo.scene || 'Unknown'
        acc[scene] = (acc[scene] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      const topScenes = Object.entries(sceneTypes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)

      return (
        <div className="absolute z-50 bg-white p-3 border-2 border-blue-500 rounded-lg shadow-xl transform -translate-x-1/2 pointer-events-none"
             style={{ minWidth: '240px' }}>
          <p className="font-semibold text-sm text-gray-900">Demonstration #{point.cumulativeCount}</p>
          <p className="text-xs text-gray-600 mt-1">
            Timestamp: {point.timestamp}
          </p>
          <p className="text-xs text-gray-600">
            Date: {formatAdminDate(point.timestamp, 'evidence', viewMode)}
          </p>
          {topScenes.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs text-gray-500 font-medium">Scene Types:</p>
              {topScenes.map(([scene, count]) => (
                <p key={scene} className="text-xs text-gray-600">• {scene}: {count}</p>
              ))}
            </div>
          )}
          <p className="text-xs text-blue-600 mt-2 font-medium">Click to view raw data →</p>
        </div>
      )
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleDataPointClick(uniquePoints[index])
    } else if (e.key === 'ArrowRight' && index < uniquePoints.length - 1) {
      e.preventDefault()
      setFocusedPoint(index + 1)
      // Focus next point
      const nextButton = document.querySelector(`[data-point-index="${index + 1}"]`) as HTMLElement
      nextButton?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      setFocusedPoint(index - 1)
      // Focus previous point
      const prevButton = document.querySelector(`[data-point-index="${index - 1}"]`) as HTMLElement
      prevButton?.focus()
    }
  }

  // Handle data point click
  const handleDataPointClick = (point: TimelinePoint) => {
    if (onDataPointClick) {
      onDataPointClick({
        timestamp: point.timestamp,
        count: point.cumulativeCount
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Skill Growth Timeline
        </CardTitle>
        <CardDescription>
          Cumulative skill demonstrations from first to most recent ({totalDemonstrations} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Container */}
          <div
            className="relative w-full bg-gradient-to-b from-blue-50 to-white rounded-lg p-4 border"
            style={{ height: `${chartHeight + 40}px` }}
            role="img"
            aria-label={`Interactive skill progression chart showing growth from ${uniquePoints[0].cumulativeCount} to ${uniquePoints[uniquePoints.length - 1].cumulativeCount} demonstrations. Use tab to navigate, enter to view details.`}
          >
            {/* Accessibility description */}
            <desc>
              Skill progression chart showing cumulative demonstrations over time.
              The student progressed from {uniquePoints[0].cumulativeCount} to {uniquePoints[uniquePoints.length - 1].cumulativeCount} skill demonstrations
              between {formatAdminDate(uniquePoints[0].timestamp, 'evidence', viewMode)} and {formatAdminDate(uniquePoints[uniquePoints.length - 1].timestamp, 'evidence', viewMode)}.
              Data points are clickable and keyboard navigable.
            </desc>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>{maxCount}</span>
              <span>{Math.round(maxCount * 0.5)}</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="ml-8 mr-4 relative" style={{ height: `${chartHeight}px` }}>
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2].map(i => (
                  <div key={i} className="border-b border-gray-200" />
                ))}
              </div>

              {/* Timeline path */}
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                {/* Growth line */}
                <polyline
                  points={uniquePoints.map((point, idx) => {
                    const x = (idx / (uniquePoints.length - 1)) * 100
                    const y = 100 - (point.cumulativeCount / maxCount) * 100
                    return `${x}%,${y}%`
                  }).join(' ')}
                  fill="none"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  className="transition-all duration-200"
                />
              </svg>

              {/* Interactive data points - rendered on top */}
              {uniquePoints.map((point, idx) => {
                const x = (idx / (uniquePoints.length - 1)) * 100
                const y = 100 - (point.cumulativeCount / maxCount) * 100
                const isHovered = hoveredPoint === idx
                const isFocused = focusedPoint === idx

                return (
                  <div
                    key={idx}
                    className="absolute"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Tooltip */}
                    {(isHovered || isFocused) && (
                      <div
                        className="absolute bottom-full mb-2"
                        style={{ left: '50%' }}
                      >
                        <CustomTooltip point={point} _index={idx} />
                      </div>
                    )}

                    {/* Interactive button for data point */}
                    <button
                      type="button"
                      data-point-index={idx}
                      onClick={() => handleDataPointClick(point)}
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onFocus={() => setFocusedPoint(idx)}
                      onBlur={() => setFocusedPoint(null)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className="relative group focus:outline-none"
                      style={{
                        width: `${(isHovered || isFocused) ? pointRadius * 4 : pointRadius * 3}px`,
                        height: `${(isHovered || isFocused) ? pointRadius * 4 : pointRadius * 3}px`,
                        transition: 'all 0.2s ease'
                      }}
                      aria-label={
                        viewMode === 'family'
                          ? `${point.cumulativeCount} skills shown on ${formatAdminDate(point.timestamp, 'evidence', viewMode)}. Click for details.`
                          : `Demonstration ${point.cumulativeCount} at timestamp ${point.timestamp} on ${formatAdminDate(point.timestamp, 'evidence', viewMode)}. Click to view raw data.`
                      }
                    >
                      {/* SVG circle for the data point */}
                      <svg
                        className="absolute inset-0"
                        style={{ overflow: 'visible' }}
                      >
                        {/* Glow effect on hover/focus */}
                        {(isHovered || isFocused) && (
                          <circle
                            cx="50%"
                            cy="50%"
                            r={pointRadius * 2}
                            fill="rgb(59, 130, 246)"
                            opacity="0.2"
                            className="animate-pulse"
                          />
                        )}
                        {/* Main data point */}
                        <circle
                          cx="50%"
                          cy="50%"
                          r={pointRadius}
                          fill="rgb(59, 130, 246)"
                          stroke="white"
                          strokeWidth="2"
                          className={`transition-all duration-200 ${isHovered || isFocused ? 'stroke-blue-300' : ''}`}
                        />
                      </svg>

                      {/* Focus ring for accessibility */}
                      {isFocused && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-blue-400 ring-offset-2" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* X-axis labels */}
            <div className="ml-8 mr-4 flex justify-between text-xs text-gray-500 mt-2">
              {uniquePoints.map((point, idx) => (
                <div key={idx} className="text-center" style={{ flex: 1 }}>
                  <div className="font-medium">{point.label}</div>
                  <div className="text-gray-400">
                    {new Date(point.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalDemonstrations}</p>
              <p className="text-xs text-gray-600">Total Growth</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {sortedDemos.length > 1
                  ? (() => {
                      const timeDiffMs = sortedDemos[sortedDemos.length - 1].timestamp! - sortedDemos[0].timestamp!
                      const timeDiffDays = timeDiffMs / (1000 * 60 * 60 * 24)
                      // Prevent division by zero if all demos on same day
                      return timeDiffDays > 0
                        ? Math.round((sortedDemos.length / timeDiffDays) * 10) / 10
                        : sortedDemos.length
                    })()
                  : '—'
                }
              </p>
              <p className="text-xs text-gray-600">Demos/Day</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(
                  (sortedDemos[sortedDemos.length - 1].timestamp! - sortedDemos[0].timestamp!) /
                  (1000 * 60 * 60 * 24)
                )}
              </p>
              <p className="text-xs text-gray-600">Days Active</p>
            </div>
          </div>

          {/* Accessibility Instructions */}
          <div className="text-xs text-gray-500 italic mt-2 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="font-medium mb-1">Chart Navigation:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Hover over data points to see details</li>
              <li>Click data points to view demonstration details</li>
              <li>Use Tab to navigate between points</li>
              <li>Press Enter or Space to activate selected point</li>
              <li>Use Arrow keys (← →) to move between points</li>
            </ul>
          </div>

          {/* Screen reader only status */}
          <p className="sr-only" role="status">
            Interactive skill progression chart. The student has demonstrated {totalDemonstrations} skills over time,
            showing {uniquePoints[uniquePoints.length - 1].cumulativeCount > uniquePoints[0].cumulativeCount ? 'positive' : 'steady'} growth
            from {formatAdminDate(firstTimestamp, 'evidence', viewMode)} to present.
            Chart contains {uniquePoints.length} interactive data points. Use tab key to navigate.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
