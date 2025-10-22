/**
 * Choice Pattern Bar Component
 * Visualizes student choice patterns as horizontal bar chart
 */

import type { ChoicePatternInsight } from '@/lib/types/student-insights'

interface ChoicePatternBarProps {
  patterns: ChoicePatternInsight
}

export function ChoicePatternBar({ patterns }: ChoicePatternBarProps) {
  const patternColors = {
    helping: 'bg-blue-500',
    analytical: 'bg-purple-500',
    patience: 'bg-green-500',
    exploring: 'bg-yellow-500',
    building: 'bg-orange-500'
  }

  const patternLabels = {
    helping: 'Helping',
    analytical: 'Analytical',
    patience: 'Patience',
    exploring: 'Exploring',
    building: 'Building'
  }

  const interpretations = {
    consistent: `Consistent ${patternLabels[patterns.dominantPattern as keyof typeof patternLabels].toLowerCase()} approach`,
    varied: `Varied approach with ${patternLabels[patterns.dominantPattern as keyof typeof patternLabels].toLowerCase()} tendency`,
    random: 'Exploring different approaches'
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {Object.entries(patterns).filter(([key]) => 
          ['helping', 'analytical', 'patience', 'exploring', 'building'].includes(key)
        ).map(([key, value]) => {
          const percentage = value as number
          if (percentage === 0) return null
          
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-700 capitalize">
                {patternLabels[key as keyof typeof patternLabels]}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full ${patternColors[key as keyof typeof patternColors]} flex items-center justify-end px-2 transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-2 border-t">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Pattern Analysis:</span>{' '}
          {interpretations[patterns.consistency]}
          {' '}({patterns.totalChoices} choices analyzed)
        </p>
      </div>
    </div>
  )
}

