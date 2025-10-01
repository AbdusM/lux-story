'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

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
}

interface TimelinePoint {
  timestamp: number
  cumulativeCount: number
  label: string
}

/**
 * CSS-Only Skill Progression Timeline Chart
 * Shows cumulative skill demonstrations over time
 * Mobile-responsive and accessible
 */
export function SkillProgressionChart({ skillDemonstrations, totalDemonstrations }: SkillProgressionChartProps) {
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
            aria-label={`Skill progression chart showing growth from ${uniquePoints[0].cumulativeCount} to ${uniquePoints[uniquePoints.length - 1].cumulativeCount} demonstrations`}
          >
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
                />

                {/* Data points */}
                {uniquePoints.map((point, idx) => {
                  const x = (idx / (uniquePoints.length - 1)) * 100
                  const y = 100 - (point.cumulativeCount / maxCount) * 100
                  return (
                    <circle
                      key={idx}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r={pointRadius}
                      fill="rgb(59, 130, 246)"
                      stroke="white"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  )
                })}
              </svg>

              {/* Point labels */}
              {uniquePoints.map((point, idx) => {
                const x = (idx / (uniquePoints.length - 1)) * 100
                const y = 100 - (point.cumulativeCount / maxCount) * 100

                return (
                  <div
                    key={idx}
                    className="absolute text-xs font-medium text-blue-700 bg-white px-1 rounded transform -translate-x-1/2"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      marginTop: '-20px'
                    }}
                  >
                    {point.cumulativeCount}
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
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalDemonstrations}</p>
              <p className="text-xs text-gray-600">Total Growth</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {sortedDemos.length > 1
                  ? Math.round(
                      (sortedDemos.length /
                        ((sortedDemos[sortedDemos.length - 1].timestamp! - sortedDemos[0].timestamp!) /
                        (1000 * 60 * 60 * 24))) * 10
                    ) / 10
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

          {/* Accessibility Text */}
          <p className="text-xs text-gray-500 italic sr-only" role="status">
            The student has demonstrated {totalDemonstrations} skills over time,
            showing {uniquePoints[uniquePoints.length - 1].cumulativeCount > uniquePoints[0].cumulativeCount ? 'positive' : 'steady'} growth
            from {new Date(firstTimestamp).toLocaleDateString()} to present.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
