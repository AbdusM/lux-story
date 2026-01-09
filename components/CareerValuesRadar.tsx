"use client"

/**
 * CareerValuesRadar Component
 *
 * Pentagon radar chart displaying 5 career values:
 * - directImpact: Helping people directly, immediate service
 * - systemsThinking: Optimizing how things work, process improvement
 * - dataInsights: Finding patterns, security, research
 * - futureBuilding: Emerging fields, growth sectors, innovation
 * - independence: Creating new approaches, hybrid careers
 */

import { motion } from 'framer-motion'
import type { CareerValues } from '@/lib/character-state'

interface CareerValuesRadarProps {
  values: CareerValues
  size?: number
  showLabels?: boolean
}

const CAREER_VALUE_META: Record<keyof CareerValues, {
  label: string
  shortLabel: string
  icon: string
  color: string
  description: string
}> = {
  directImpact: {
    label: 'Direct Impact',
    shortLabel: 'Impact',
    icon: '🤝',
    color: '#10B981', // emerald
    description: 'Helping people directly, immediate service'
  },
  systemsThinking: {
    label: 'Systems Thinking',
    shortLabel: 'Systems',
    icon: '⚙️',
    color: '#6366F1', // indigo
    description: 'Optimizing how things work'
  },
  dataInsights: {
    label: 'Data Insights',
    shortLabel: 'Data',
    icon: '📊',
    color: '#3B82F6', // blue
    description: 'Finding patterns, research'
  },
  futureBuilding: {
    label: 'Future Building',
    shortLabel: 'Future',
    icon: '🚀',
    color: '#F59E0B', // amber
    description: 'Emerging fields, innovation'
  },
  independence: {
    label: 'Independence',
    shortLabel: 'Indie',
    icon: '✨',
    color: '#8B5CF6', // purple
    description: 'Creating new approaches'
  }
}

const VALUE_ORDER: (keyof CareerValues)[] = [
  'directImpact',
  'systemsThinking',
  'dataInsights',
  'futureBuilding',
  'independence'
]

export function CareerValuesRadar({
  values,
  size = 200,
  showLabels = true
}: CareerValuesRadarProps) {
  const center = size / 2
  const maxRadius = (size / 2) - (showLabels ? 30 : 10)
  const numValues = VALUE_ORDER.length
  const angleStep = (2 * Math.PI) / numValues
  const startAngle = -Math.PI / 2 // Start from top

  // Generate points for the background pentagon
  const getPoint = (index: number, radius: number) => {
    const angle = startAngle + index * angleStep
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    }
  }

  // Generate pentagon path for background rings
  const generatePentagonPath = (radius: number) => {
    const points = VALUE_ORDER.map((_, i) => getPoint(i, radius))
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  }

  // Generate value polygon path
  const generateValuePath = () => {
    const maxValue = 10
    const points = VALUE_ORDER.map((key, i) => {
      const value = values[key] || 0
      const normalizedValue = Math.min(value, maxValue) / maxValue
      const radius = normalizedValue * maxRadius
      return getPoint(i, radius)
    })
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  }

  // Calculate total and dominant value
  const total = Object.values(values).reduce((sum, v) => sum + v, 0)
  const dominantEntry = VALUE_ORDER.reduce((max, key) =>
    (values[key] || 0) > (values[max] || 0) ? key : max
  , VALUE_ORDER[0])

  // Check if there's any data
  const hasData = total > 0

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Background rings */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((ratio) => (
          <path
            key={ratio}
            d={generatePentagonPath(maxRadius * ratio)}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {VALUE_ORDER.map((_, i) => {
          const point = getPoint(i, maxRadius)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={1}
            />
          )
        })}

        {/* Value polygon with animation */}
        {hasData && (
          <motion.path
            d={generateValuePath()}
            fill="rgba(16, 185, 129, 0.2)"
            stroke="#10B981"
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
        )}

        {/* Value points */}
        {VALUE_ORDER.map((key, i) => {
          const value = values[key] || 0
          if (value === 0) return null
          const normalizedValue = Math.min(value, 10) / 10
          const point = getPoint(i, normalizedValue * maxRadius)
          const meta = CAREER_VALUE_META[key]

          return (
            <motion.circle
              key={key}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={meta.color}
              stroke="white"
              strokeWidth={1}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />
          )
        })}

        {/* Labels */}
        {showLabels && VALUE_ORDER.map((key, i) => {
          const labelRadius = maxRadius + 20
          const point = getPoint(i, labelRadius)
          const meta = CAREER_VALUE_META[key]
          const value = values[key] || 0

          return (
            <g key={`label-${key}`}>
              <text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] fill-slate-400 font-medium"
              >
                {meta.icon}
              </text>
              <text
                x={point.x}
                y={point.y + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[8px] fill-slate-500"
              >
                {value > 0 ? value.toFixed(0) : ''}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend below chart */}
      {hasData && (
        <div className="mt-4 space-y-1">
          <div className="text-xs text-slate-400 text-center mb-2">
            Strongest: {CAREER_VALUE_META[dominantEntry].label}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {VALUE_ORDER.map(key => {
              const meta = CAREER_VALUE_META[key]
              const value = values[key] || 0
              if (value === 0) return null

              return (
                <div
                  key={key}
                  className="flex items-center gap-1 text-[10px] text-slate-500"
                  title={meta.description}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  {meta.shortLabel}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-slate-600 text-center px-4">
            Your career values will emerge as you make choices
          </p>
        </div>
      )}
    </div>
  )
}

export { CAREER_VALUE_META, VALUE_ORDER }
