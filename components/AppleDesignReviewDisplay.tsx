"use client"

import { useState } from 'react'
import { useAppleDesignReview } from '@/hooks/useAppleDesignReview'

/**
 * Apple Design Review Display Component
 * Shows comprehensive analysis from all five Apple design agents
 */
export function AppleDesignReviewDisplay() {
  const {
    review,
    isAnalyzing,
    getExecutiveSummary: _getExecutiveSummary,
    getAgentAnalysis: _getAgentAnalysis,
    getOverallScore,
    getAgentScores,
    getVerdicts,
    getEvidence,
    getOneMoreThing,
    getCriticalIssues,
    getStrengths,
    getRecommendations
  } = useAppleDesignReview()

  const [activeAgent, setActiveAgent] = useState<'sculptor' | 'choreographer' | 'composer' | 'jeweler' | 'aesthete'>('sculptor')

  if (isAnalyzing) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Conducting Apple design review...</p>
        </div>
      </div>
    )
  }

  if (!review) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <p className="text-gray-600">No design review data available</p>
      </div>
    )
  }

  const overallScore = getOverallScore()
  const agentScores = getAgentScores()
  const verdicts = getVerdicts()
  const evidence = getEvidence()
  const oneMoreThing = getOneMoreThing()
  const criticalIssues = getCriticalIssues()
  const strengths = getStrengths()
  const recommendations = getRecommendations()

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100'
    if (score >= 6) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const agents = [
    { id: 'sculptor', name: 'The Sculptor', description: 'Clarity & Simplicity' },
    { id: 'choreographer', name: 'The Choreographer', description: 'Intuitive Interaction & Flow' },
    { id: 'composer', name: 'The Composer', description: 'Emotional Resonance' },
    { id: 'jeweler', name: 'The Jeweler', description: 'Craftsmanship' },
    { id: 'aesthete', name: 'The Aesthete', description: 'Beauty & Aesthetics' }
  ] as const

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🍎 Apple Design Review
        </h2>
        <p className="text-gray-600">
          Comprehensive analysis from all five Apple design agents
        </p>
      </div>

      {/* Overall Score */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Overall Design Score</h3>
          <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}/10
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${getScoreBgColor(overallScore).replace('bg-', 'bg-')}`}
            style={{ width: `${overallScore * 10}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {overallScore >= 8 ? 'Apple-level quality' : 
           overallScore >= 6 ? 'Good foundation, needs refinement' : 
           'Needs significant improvement'}
        </p>
      </div>

      {/* Agent Scores Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {agents.map(agent => (
            <div key={agent.id} className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(agentScores[agent.id])}`}>
                {agentScores[agent.id]}/10
              </div>
              <div className="text-sm text-gray-600">{agent.name}</div>
              <div className="text-xs text-gray-500">{agent.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeAgent === agent.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {agent.name}
            </button>
          ))}
        </div>

        {/* Active Agent Analysis */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              {agents.find(a => a.id === activeAgent)?.name}
            </h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(agentScores[activeAgent])} ${getScoreColor(agentScores[activeAgent])}`}>
              {agentScores[activeAgent]}/10
            </div>
          </div>
          
          <div className="mb-4">
            <h5 className="font-medium text-gray-700 mb-2">Verdict</h5>
            <p className="text-gray-600">{verdicts[activeAgent]}</p>
          </div>

          <div className="mb-4">
            <h5 className="font-medium text-gray-700 mb-2">Evidence</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              {evidence[activeAgent].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      {criticalIssues.length > 0 && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">🚨 Critical Issues</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {criticalIssues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">✅ Strengths</h4>
          <ul className="text-sm text-green-700 space-y-1">
            {strengths.map((strength, index) => (
              <li key={index}>• {strength}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Recommendations</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index}>• {rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* One More Thing */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-3">One More Thing...</h4>
        <p className="text-purple-700 leading-relaxed">{oneMoreThing}</p>
      </div>
    </div>
  )
}
