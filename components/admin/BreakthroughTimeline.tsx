/**
 * Breakthrough Timeline Component
 * Chronological display of key student moments
 */

import type { BreakthroughMoment } from '@/lib/types/student-insights'

interface BreakthroughTimelineProps {
  moments: BreakthroughMoment[]
}

export function BreakthroughTimeline({ moments }: BreakthroughTimelineProps) {
  const typeIcons = {
    vulnerability: '🎯',
    decision: '✨',
    personal_sharing: '💡',
    mutual_recognition: '🤝'
  }

  const typeLabels = {
    vulnerability: 'Vulnerability Reveal',
    decision: 'Key Decision',
    personal_sharing: 'Personal Sharing',
    mutual_recognition: 'Mutual Recognition'
  }

  if (moments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No breakthrough moments yet</p>
        <p className="text-sm mt-1">These will appear as the student progresses</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {moments.map((moment, index) => (
        <div key={index} className="flex gap-3 p-4 border rounded-lg hover:bg-gray-50 transition">
          <div className="text-3xl flex-shrink-0">
            {typeIcons[moment.type]}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium text-gray-900">
                  {typeLabels[moment.type]}
                </h4>
                {moment.characterName && (
                  <p className="text-sm text-gray-600">{moment.characterName}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {moment.scene}
              </span>
            </div>

            <div className="text-sm">
              <p className="text-gray-700 italic">"{moment.quote}"</p>
              
              {moment.studentResponse && (
                <p className="text-gray-600 mt-2">
                  → Student: "{moment.studentResponse}"
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

