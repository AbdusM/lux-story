/**
 * Pattern Recognition Card Component
 *
 * Agent 1: Chart Tooltips & Interactivity Engineer
 * Agent 3: Skills Tab - Pattern Recognition Visualization (Issue 13, Section 2.3)
 *
 * Displays pattern analysis for skill demonstrations with two modes:
 * - Family Mode: Plain English insights with emojis
 * - Research Mode: Technical analysis with interactive progress bars
 *
 * Enhancements:
 * - Interactive progress bars with tooltips
 * - Hover states showing detailed counts
 * - Click handlers for filtering/navigation (future)
 * - WCAG AA accessible
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { analyzeSkillPatterns, type SkillPattern } from '@/lib/admin-pattern-recognition'
import type { SkillDemonstrations } from '@/lib/skill-profile-adapter'

interface PatternRecognitionCardProps {
  skillDemonstrations: SkillDemonstrations
  adminViewMode: 'family' | 'research'
}

export function PatternRecognitionCard({
  skillDemonstrations,
  adminViewMode
}: PatternRecognitionCardProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)
  const [touchedBar, setTouchedBar] = useState<string | null>(null)

  const patterns = analyzeSkillPatterns(skillDemonstrations || {})

  if (patterns.length === 0) return null

  // Calculate pattern insights
  const sceneTypeDistribution = patterns.reduce((acc, p) => {
    p.sceneTypes.forEach(st => {
      acc[st.type] = (acc[st.type] || 0) + st.count
    })
    return acc
  }, {} as Record<string, number>)

  const characterDistribution = patterns.reduce((acc, p) => {
    p.characterContext.forEach(cc => {
      acc[cc.character] = (acc[cc.character] || 0) + cc.frequency
    })
    return acc
  }, {} as Record<string, number>)

  // Get top patterns
  const sortedSceneTypes = Object.entries(sceneTypeDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  const sortedCharacters = Object.entries(characterDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  // Find skills with recent growth (demonstrated within last 7 days)
  const recentSkills = patterns.filter(p => {
    if (!p.lastDemonstrated) return false
    const daysSince = (Date.now() - new Date(p.lastDemonstrated).getTime()) / (1000 * 60 * 60 * 24)
    return daysSince <= 7
  })

  return (
    <Card className="bg-purple-50 border-purple-200 mb-4">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          {adminViewMode === 'family' ? '🔍 Patterns We Noticed' : 'Pattern Analysis: Scene Type Distribution'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {adminViewMode === 'family' ? (
          <ul className="space-y-3">
            {sortedSceneTypes.length > 0 && (
              <li className="text-sm">
                💬 <strong>{sortedSceneTypes[0][0].replace(/_/g, ' ')}</strong> shows up most ({sortedSceneTypes[0][1]} times)
              </li>
            )}
            {sortedCharacters.length > 0 && (
              <li className="text-sm">
                🤝 Strongest interactions with <strong>{sortedCharacters[0][0]}</strong> ({sortedCharacters[0][1]} demonstrations)
              </li>
            )}
            {recentSkills.length > 0 && (
              <li className="text-sm">
                📈 <strong>Growing fast</strong> in {recentSkills[0].skillName.replace(/_/g, ' ')} ({recentSkills[0].totalDemonstrations} demonstrations this week)
              </li>
            )}
          </ul>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Scene Type Distribution:</p>
              <div className="space-y-2">
                {sortedSceneTypes.map(([type, count]) => {
                  const total = Object.values(sceneTypeDistribution).reduce((a, b) => a + b, 0)
                  const percentage = Math.round((count / total) * 100)
                  const barId = `scene-${type}`
                  const isHovered = hoveredBar === barId || touchedBar === barId

                  return (
                    <div key={type} className="relative">
                      <div
                        className="flex items-center gap-3 group"
                        onMouseEnter={() => setHoveredBar(barId)}
                        onMouseLeave={() => setHoveredBar(null)}
                        onTouchStart={() => setTouchedBar(touchedBar === barId ? null : barId)}
                        onTouchEnd={(e) => e.preventDefault()}
                        role="img"
                        aria-label={`${type.replace(/_/g, ' ')}: ${count} demonstrations, ${percentage}% of total`}
                      >
                        <span className="text-xs text-gray-600 w-32 capitalize">
                          {type.replace(/_/g, ' ')}:
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 relative cursor-help transition-all duration-200">
                          <div
                            className={`bg-purple-600 h-2.5 rounded-full transition-all duration-300 ${
                              isHovered ? 'bg-purple-700' : ''
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                          {/* Tooltip on hover */}
                          {isHovered && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white p-2 border-2 border-purple-500 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none">
                              <p className="text-xs font-semibold text-purple-900 capitalize">
                                {type.replace(/_/g, ' ')}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {count} demonstration{count !== 1 ? 's' : ''} ({percentage}%)
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {count} of {total} total
                              </p>
                            </div>
                          )}
                        </div>
                        <span className={`text-xs text-gray-600 w-12 text-right transition-all duration-200 ${
                          isHovered ? 'font-semibold text-purple-700' : ''
                        }`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Character Interaction Analysis:</p>
              <div className="space-y-2">
                {sortedCharacters.map(([character, frequency]) => {
                  const total = Object.values(characterDistribution).reduce((a, b) => a + b, 0)
                  const percentage = Math.round((frequency / total) * 100)
                  const barId = `char-${character}`
                  const isHovered = hoveredBar === barId || touchedBar === barId

                  return (
                    <div key={character} className="relative">
                      <div
                        className="flex items-center gap-3 group"
                        onMouseEnter={() => setHoveredBar(barId)}
                        onMouseLeave={() => setHoveredBar(null)}
                        onTouchStart={() => setTouchedBar(touchedBar === barId ? null : barId)}
                        onTouchEnd={(e) => e.preventDefault()}
                        role="img"
                        aria-label={`${character}: ${frequency} interactions, ${percentage}% of total`}
                      >
                        <span className="text-xs text-gray-600 w-32">{character}:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 relative cursor-help transition-all duration-200">
                          <div
                            className={`bg-purple-600 h-2.5 rounded-full transition-all duration-300 ${
                              isHovered ? 'bg-purple-700' : ''
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                          {/* Tooltip on hover */}
                          {isHovered && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white p-2 border-2 border-purple-500 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none">
                              <p className="text-xs font-semibold text-purple-900">{character}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {frequency} interaction{frequency !== 1 ? 's' : ''} ({percentage}%)
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {frequency} of {total} total
                              </p>
                            </div>
                          )}
                        </div>
                        <span className={`text-xs text-gray-600 w-12 text-right transition-all duration-200 ${
                          isHovered ? 'font-semibold text-purple-700' : ''
                        }`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
