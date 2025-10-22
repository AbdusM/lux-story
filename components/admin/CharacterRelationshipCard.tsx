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
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-gray-900">{character.characterName}</h3>
        <p className="text-sm text-gray-500 mt-1">Not yet met</p>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg hover:border-blue-300 transition">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{character.characterName}</h3>
        <div className="text-xl text-yellow-500">
          {stars.join('')}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-gray-500 min-w-fit">Trust Level:</span>
          <span className="font-medium text-gray-900">{character.trustLevel}/10</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-gray-500 min-w-fit">Status:</span>
          <span className="text-gray-700">{character.currentStatus}</span>
        </div>

        {character.vulnerabilityShared && (
          <div className="pt-2 border-t">
            <p className="text-gray-500 mb-1">Vulnerability shared:</p>
            <p className="text-gray-700 italic">"{character.vulnerabilityShared}"</p>
          </div>
        )}

        {character.studentHelped && (
          <div className="pt-2 border-t">
            <p className="text-gray-500 mb-1">Student helped:</p>
            <p className="text-gray-700">{character.studentHelped}</p>
          </div>
        )}

        {character.personalSharing && (
          <div className="pt-2 border-t">
            <p className="text-gray-500 mb-1">Personal sharing:</p>
            <p className="text-gray-700 italic">"{character.personalSharing}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

