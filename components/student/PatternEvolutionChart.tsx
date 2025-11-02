'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import type { PatternEvolutionPoint } from '@/lib/pattern-profile-adapter'
import { getPatternBgClass, formatPatternName, PATTERN_TYPES } from '@/lib/patterns'

interface PatternEvolutionChartProps {
  evolution: PatternEvolutionPoint[]
}

/**
 * Pattern Evolution Chart - Shows how decision-making patterns change over time
 * Simple bar chart visualization of weekly pattern usage
 */
export function PatternEvolutionChart({ evolution }: PatternEvolutionChartProps) {
  if (!evolution || evolution.length === 0) {
    return null
  }

  // Group by week
  const weeklyData = evolution.reduce((acc, point) => {
    const week = point.weekStart
    if (!acc[week]) {
      acc[week] = {}
    }
    acc[week][point.patternName] = point.weeklyCount
    return acc
  }, {} as Record<string, Record<string, number>>)

  const weeks = Object.keys(weeklyData).sort()

  // Only show if we have at least 2 weeks of data
  if (weeks.length < 2) {
    return null
  }

  // Calculate max for scaling
  const maxCount = Math.max(
    ...weeks.flatMap(week =>
      Object.values(weeklyData[week])
    ),
    1
  )

  // Format week label
  const formatWeekLabel = (weekStart: string): string => {
    const date = new Date(weekStart)
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const day = date.getDate()
    return `${month} ${day}`
  }

  // Calculate trend
  const calculateTrend = (): string | null => {
    if (weeks.length < 2) return null

    const firstWeek = weeklyData[weeks[0]]
    const lastWeek = weeklyData[weeks[weeks.length - 1]]

    // Find dominant pattern in each week
    const getTopPattern = (weekData: Record<string, number>) => {
      return Object.entries(weekData).reduce((top, [pattern, count]) =>
        count > top.count ? { pattern, count } : top,
        { pattern: '', count: 0 }
      )
    }

    const firstTop = getTopPattern(firstWeek)
    const lastTop = getTopPattern(lastWeek)

    if (firstTop.pattern !== lastTop.pattern) {
      return `You're exploring ${formatPatternName(lastTop.pattern)} approaches more than before`
    }

    // Check if diversity is increasing
    const firstDiversity = Object.keys(firstWeek).length
    const lastDiversity = Object.keys(lastWeek).length

    if (lastDiversity > firstDiversity) {
      return `You're exploring more diverse decision-making approaches`
    }

    return `You're consistently using ${formatPatternName(firstTop.pattern)} approaches`
  }

  const trend = calculateTrend()

  return (
    <Card className="shadow-md border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <CardTitle className="text-xl">Your Pattern Evolution</CardTitle>
        </div>
        <CardDescription>
          How your decision-making approaches have changed over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trend insight */}
        {trend && (
          <div className="bg-indigo-100 rounded-lg p-3 border-l-4 border-indigo-500">
            <p className="text-sm font-medium text-indigo-900">
              📈 {trend}
            </p>
          </div>
        )}

        {/* Simple stacked bar chart */}
        <div className="space-y-3">
          {weeks.map((week) => {
            const weekData = weeklyData[week]
            const totalCount = Object.values(weekData).reduce((sum, count) => sum + count, 0)

            return (
              <div key={week} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="font-medium">{formatWeekLabel(week)}</span>
                  <span>{totalCount} {totalCount === 1 ? 'choice' : 'choices'}</span>
                </div>
                <div className="flex h-8 rounded-lg overflow-hidden bg-gray-200">
                  {Object.entries(weekData).map(([pattern, count]) => {
                    const percentage = (count / totalCount) * 100
                    return (
                      <div
                        key={pattern}
                        className={`${getPatternBgClass(pattern)} flex items-center justify-center text-white text-xs font-semibold`}
                        style={{ width: `${percentage}%` }}
                        title={`${formatPatternName(pattern)}: ${count} (${Math.round(percentage)}%)`}
                      >
                        {percentage > 15 && count}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-indigo-200">
          {PATTERN_TYPES.map((pattern) => (
            <div key={pattern} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${getPatternBgClass(pattern)}`} />
              <span className="text-xs text-gray-700">{formatPatternName(pattern)}</span>
            </div>
          ))}
        </div>

        {/* Educational note */}
        <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
          <p className="text-xs text-gray-700">
            <strong>Note:</strong> Your patterns naturally evolve as you encounter different
            situations. Changes in your approach are normal and healthy!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
