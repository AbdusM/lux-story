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
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(patterns).filter(([key]) => 
          ['helping', 'analytical', 'patience', 'exploring', 'building'].includes(key)
        ).map(([key, value]) => {
          const percentage = value as number
          if (percentage === 0) return null
          
          return (
            <div key={key} className="flex items-center gap-3 sm:gap-4">
              <div className="w-20 sm:w-28 text-sm font-medium text-slate-700 capitalize">
                {patternLabels[key as keyof typeof patternLabels]}
              </div>
              <div className="flex-1 bg-slate-200 rounded-full h-6 sm:h-8 overflow-hidden shadow-inner">
                <div
                  className={`h-full ${patternColors[key as keyof typeof patternColors]} flex items-center justify-end px-3 transition-all duration-700 ease-out shadow-sm`}
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-xs sm:text-sm text-white font-semibold">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-base text-slate-700">
            <span className="font-semibold text-slate-900">Pattern Analysis:</span>{' '}
            {interpretations[patterns.consistency]}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Based on {patterns.totalChoices} choices analyzed
          </p>
        </div>
      </div>
    </div>
  )
}

