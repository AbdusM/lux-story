"use client"

import { useState, useEffect } from 'react'
import { FutureSkills, CareerPath2030 } from '@/lib/2030-skills-system'

interface SkillData {
  name: string
  level: number
  count?: number
}

interface SkillsSummary {
  topSkills?: SkillData[]
  developingSkills?: SkillData[]
  overallLevel?: string
  progression?: string
  [key: string]: unknown
}

interface ContextualFeedback {
  message?: string
  type?: string
  [key: string]: unknown
}

interface FutureSkillsSupportProps {
  skills: FutureSkills
  matchingCareerPaths: CareerPath2030[]
  skillPrompt: string | null
  skillsSummary: SkillsSummary
  skillDevelopmentSuggestions: string[]
  contextualFeedback: ContextualFeedback
  onDismiss?: () => void
}

/**
 * Future Skills Support Component
 * Provides 2030 skills development and career path guidance for Birmingham youth
 */
export function FutureSkillsSupport({ 
  skills, 
  matchingCareerPaths,
  skillPrompt, 
  skillsSummary,
  skillDevelopmentSuggestions,
  contextualFeedback,
  onDismiss 
}: FutureSkillsSupportProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedCareerPath, setSelectedCareerPath] = useState<CareerPath2030 | null>(null)

  // Handle escape key to close modal
  useEffect(() => {
    if (!isVisible) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false)
        onDismiss?.()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isVisible, onDismiss])

  // Show support when appropriate
  useEffect(() => {
    const shouldShow = (
      skillPrompt ||
      matchingCareerPaths.length > 0 ||
      skillDevelopmentSuggestions.length > 0 ||
      contextualFeedback
    )
    
    if (shouldShow) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [skillPrompt, matchingCareerPaths, skillDevelopmentSuggestions, contextualFeedback])

  if (!isVisible) return null

  const getSkillLevelColor = (value: number) => {
    if (value > 0.8) return 'text-green-600'
    if (value > 0.6) return 'text-blue-600'
    if (value > 0.4) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getSkillLevelIcon = (value: number) => {
    if (value > 0.8) return '🌟'
    if (value > 0.6) return '⭐'
    if (value > 0.4) return '🌱'
    return '💭'
  }

  const getGrowthProjectionColor = (projection: string) => {
    switch (projection) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-blue-600'
      case 'stable': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getGrowthProjectionIcon = (projection: string) => {
    switch (projection) {
      case 'high': return '📈'
      case 'medium': return '📊'
      case 'stable': return '📋'
      default: return '📋'
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={() => {
        setIsVisible(false)
        onDismiss?.()
      }}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-4xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              🚀 Your 2030 Skills Profile
            </h2>
            <p className="text-gray-600">
              Building the skills you'll need for the future workforce
            </p>
          </div>

          {/* Skill prompt */}
          {skillPrompt && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                💭 {skillPrompt}
              </p>
            </div>
          )}

          {/* Contextual feedback */}
          {contextualFeedback && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">
                ✨ {contextualFeedback.explanation as React.ReactNode}
              </p>
            </div>
          )}

          {/* Skills overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Skill Development
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(skills).map(([skill, value]) => (
                <div key={skill} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {skill.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}
                    </span>
                    <span className="text-lg">{getSkillLevelIcon(value)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getSkillLevelColor(value).replace('text-', 'bg-')}`}
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round(value * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matching career paths */}
          {matchingCareerPaths.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Career Paths That Match Your Skills
              </h3>
              <div className="space-y-4">
                {matchingCareerPaths.slice(0, 3).map((path, index) => (
                  <div 
                    key={path.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCareerPath(path)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {path.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {path.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className={`flex items-center ${getGrowthProjectionColor(path.growthProjection)}`}>
                            {getGrowthProjectionIcon(path.growthProjection)} {path.growthProjection} growth
                          </span>
                          <span>
                            ${path.salaryRange[0].toLocaleString()} - ${path.salaryRange[1].toLocaleString()}
                          </span>
                          <span>
                            {Math.round(path.birminghamRelevance * 100)}% Birmingham relevant
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-sm font-medium text-blue-600">
                          {Math.round((path as any).matchScore * 100)}% match
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected career path details */}
          {selectedCareerPath && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">
                {selectedCareerPath.name} - Detailed Information
              </h4>
              <div className="text-sm text-blue-700 space-y-2">
                <div>
                  <strong>Required Skills:</strong> {selectedCareerPath.requiredSkills.join(', ')}
                </div>
                <div>
                  <strong>Education Paths:</strong> {selectedCareerPath.educationPath.join(', ')}
                </div>
                <div>
                  <strong>Local Opportunities:</strong> {selectedCareerPath.localOpportunities.join(', ')}
                </div>
                <div>
                  <strong>Salary Range:</strong> ${selectedCareerPath.salaryRange[0].toLocaleString()} - ${selectedCareerPath.salaryRange[1].toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedCareerPath(null)}
                className="mt-3 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Close details
              </button>
            </div>
          )}

          {/* Skill development suggestions */}
          {skillDevelopmentSuggestions.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                💡 Skill Development Suggestions
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {skillDevelopmentSuggestions.map((suggestion, index) => (
                  <li key={index}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills summary details (collapsible) */}
          <div className="mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {showDetails ? 'Hide' : 'Show'} detailed skills summary
            </button>
            
            {showDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">Top Skills:</h5>
                    <ul className="space-y-1">
                      {skillsSummary.topSkills?.map((skill, index) => (
                        <li key={index}>
                          {skill.name}: {skill.level}% {skill.count ? `(${skill.count})` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Developing Skills:</h5>
                    <ul className="space-y-1">
                      {skillsSummary.developingSkills?.map((skill, index) => (
                        <li key={index}>
                          {skill.name}: {skill.level}%
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span><strong>Overall Level:</strong> {skillsSummary.overallLevel}</span>
                    <span><strong>Career Readiness:</strong> {skillsSummary.careerReadiness as React.ReactNode}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setIsVisible(false)}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              I'm ready
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
