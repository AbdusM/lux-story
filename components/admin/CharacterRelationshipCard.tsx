/**
 * Character Relationship Card Component
 * Displays individual character interaction timeline
 */

import type { CharacterInsight } from '@/lib/types/student-insights'

interface CharacterRelationshipCardProps {
  character: CharacterInsight
}

export function CharacterRelationshipCard({ character }: CharacterRelationshipCardProps) {
  // Generate star rating
  const stars = Array.from({ length: 10 }, (_, i) => i < character.trustLevel ? '★' : '☆')

  if (!character.met) {
    return (
      <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-slate-500 text-sm font-medium">
              {character.characterName.split(' ')[0][0]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{character.characterName}</h3>
            <p className="text-sm text-slate-500">Not yet met</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-lg font-semibold">
              {character.characterName.split(' ')[0][0]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">{character.characterName}</h3>
            <div className="text-xl text-yellow-500 mt-1">
              {stars.join('')}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-base">
        <div className="flex items-center gap-3">
          <span className="text-slate-600 font-medium min-w-fit">Trust Level:</span>
          <span className="font-semibold text-slate-900 text-lg">{character.trustLevel}/10</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-600 font-medium min-w-fit">Status:</span>
          <span className="text-slate-700 font-medium">{character.currentStatus}</span>
        </div>

        {character.vulnerabilityShared && (
          <div className="pt-4 border-t border-slate-200">
            <div className="bg-rose-50 rounded-lg p-4">
              <p className="text-rose-700 font-medium mb-2">Vulnerability Shared</p>
              <p className="text-rose-800 italic">"{character.vulnerabilityShared}"</p>
            </div>
          </div>
        )}

        {character.studentHelped && (
          <div className="pt-4 border-t border-slate-200">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-700 font-medium mb-2">Student Helped</p>
              <p className="text-green-800">{character.studentHelped}</p>
            </div>
          </div>
        )}

        {character.personalSharing && (
          <div className="pt-4 border-t border-slate-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-700 font-medium mb-2">Personal Sharing</p>
              <p className="text-blue-800 italic">"{character.personalSharing}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

