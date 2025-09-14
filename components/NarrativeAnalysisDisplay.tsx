"use client"

import { useState } from 'react'
import { useNarrativeAnalysis } from '@/hooks/useNarrativeAnalysis'

/**
 * Narrative Analysis Display Component
 * Shows comprehensive analysis of story arcs, character journeys, and hook effectiveness
 */
export function NarrativeAnalysisDisplay() {
  const {
    report,
    metrics,
    isAnalyzing,
    getExecutiveSummary,
    getQualityInsights,
    getStrengths,
    getCriticalIssues,
    getRecommendations,
    getPriorityFixes
  } = useNarrativeAnalysis()

  const [activeTab, setActiveTab] = useState<'overview' | 'arcs' | 'characters' | 'hooks' | 'recommendations'>('overview')

  if (isAnalyzing) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing narrative quality...</p>
        </div>
      </div>
    )
  }

  if (!report || !metrics) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <p className="text-gray-600">No analysis data available</p>
      </div>
    )
  }

  const qualityInsights = getQualityInsights()
  const strengths = getStrengths()
  const criticalIssues = getCriticalIssues()
  const recommendations = getRecommendations()
  const priorityFixes = getPriorityFixes()

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📊 Narrative Quality Analysis
        </h2>
        <p className="text-gray-600">
          Comprehensive analysis of story arcs, character journeys, and hook effectiveness
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'arcs', label: 'Story Arcs' },
          { id: 'characters', label: 'Characters' },
          { id: 'hooks', label: 'Hooks' },
          { id: 'recommendations', label: 'Recommendations' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Overall Quality Score</h3>
              <div className="text-3xl font-bold text-blue-600">{report.overallScore}/100</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{metrics.narrativeCompletion}%</div>
                <div className="text-sm text-gray-600">Narrative Completion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{metrics.hookEffectiveness}%</div>
                <div className="text-sm text-gray-600">Hook Effectiveness</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{metrics.characterDevelopment}%</div>
                <div className="text-sm text-gray-600">Character Development</div>
              </div>
            </div>
          </div>

          {/* Quality Insights */}
          {qualityInsights.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Quality Insights</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {qualityInsights.map((insight, index) => (
                  <li key={index}>• {insight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">✅ Strengths</h4>
              <ul className="text-sm text-green-700 space-y-1">
                {strengths.map((strength, index) => (
                  <li key={index}>• {strength}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Critical Issues */}
          {criticalIssues.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">🚨 Critical Issues</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {criticalIssues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Story Arcs Tab */}
      {activeTab === 'arcs' && (
        <div className="space-y-4">
          {report.storyArcAnalysis.map(arc => (
            <div key={arc.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{arc.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  arc.status === 'complete' ? 'bg-green-100 text-green-800' :
                  arc.status === 'resolution' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {arc.status}
                </span>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Completion</span>
                  <span>{arc.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${arc.completionPercentage}%` }}
                  />
                </div>
              </div>
              {arc.unresolvedElements.length > 0 && (
                <div className="text-sm text-red-600">
                  <strong>Unresolved:</strong> {arc.unresolvedElements.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Characters Tab */}
      {activeTab === 'characters' && (
        <div className="space-y-4">
          {report.characterJourneyAnalysis.map(character => (
            <div key={character.characterId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{character.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  character.alignment === 'on-track' ? 'bg-green-100 text-green-800' :
                  character.alignment === 'needs-adjustment' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {character.alignment}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Current State:</strong> {character.emotionalState}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Progression:</strong> {character.progression.current}
              </div>
              {character.unresolved.length > 0 && (
                <div className="text-sm text-red-600">
                  <strong>Unresolved:</strong> {character.unresolved.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hooks Tab */}
      {activeTab === 'hooks' && (
        <div className="space-y-4">
          {report.hookAnalysis.map(hook => (
            <div key={hook.hookId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{hook.hookId}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  hook.assessment === 'well-balanced' ? 'bg-green-100 text-green-800' :
                  hook.assessment === 'too-explicit' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {hook.assessment}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Current Delivery:</strong> {hook.currentDelivery}
              </div>
              {hook.issues.length > 0 && (
                <div className="text-sm text-red-600 mb-2">
                  <strong>Issues:</strong> {hook.issues.join(', ')}
                </div>
              )}
              {hook.suggestions.length > 0 && (
                <div className="text-sm text-blue-600">
                  <strong>Suggestions:</strong> {hook.suggestions.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Priority Fixes */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Priority Fixes</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h5 className="font-medium text-red-800 mb-2">Immediate ({priorityFixes.immediate.length})</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  {priorityFixes.immediate.map((fix, index) => (
                    <li key={index}>• {fix}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">Short-term ({priorityFixes.shortTerm.length})</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {priorityFixes.shortTerm.map((fix, index) => (
                    <li key={index}>• {fix}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Long-term ({priorityFixes.longTerm.length})</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {priorityFixes.longTerm.map((fix, index) => (
                    <li key={index}>• {fix}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* All Recommendations */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">All Recommendations</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
