"use client"

import { useState, useEffect, useCallback } from 'react'
import { getAppleDesignReviewSystem, AppleDesignReview } from '@/lib/apple-design-review'

/**
 * Hook for Apple Design Review analysis
 * Implements all five Apple design agents for comprehensive UX analysis
 */
export function useAppleDesignReview() {
  const [review, setReview] = useState<AppleDesignReview | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const reviewSystem = getAppleDesignReviewSystem()

  // Generate comprehensive Apple design review
  const generateReview = useCallback(() => {
    setIsAnalyzing(true)
    try {
      const newReview = reviewSystem.generateDesignReview()
      setReview(newReview)
    } catch (error) {
      console.error('Error generating Apple design review:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [reviewSystem])

  // Get executive summary
  const getExecutiveSummary = useCallback(() => {
    return reviewSystem.getExecutiveSummary()
  }, [reviewSystem])

  // Get agent analysis
  const getAgentAnalysis = useCallback((agent: 'sculptor' | 'choreographer' | 'composer' | 'jeweler' | 'aesthete') => {
    if (!review) return null

    const agentNames = {
      sculptor: 'The Sculptor (Clarity & Simplicity)',
      choreographer: 'The Choreographer (Intuitive Interaction & Flow)',
      composer: 'The Composer (Emotional Resonance)',
      jeweler: 'The Jeweler (Craftsmanship)',
      aesthete: 'The Aesthete (Beauty & Aesthetics)'
    }

    return {
      agent: agentNames[agent],
      score: review.agentScores[agent],
      verdict: review.verdicts[agent],
      evidence: review.evidence[agent]
    }
  }, [review])

  // Get overall score
  const getOverallScore = useCallback(() => {
    return review?.overallScore || 0
  }, [review])

  // Get agent scores
  const getAgentScores = useCallback(() => {
    return review?.agentScores || {
      sculptor: 0,
      choreographer: 0,
      composer: 0,
      jeweler: 0,
      aesthete: 0
    }
  }, [review])

  // Get verdicts
  const getVerdicts = useCallback(() => {
    return review?.verdicts || {
      sculptor: '',
      choreographer: '',
      composer: '',
      jeweler: '',
      aesthete: ''
    }
  }, [review])

  // Get evidence
  const getEvidence = useCallback(() => {
    return review?.evidence || {
      sculptor: [],
      choreographer: [],
      composer: [],
      jeweler: [],
      aesthete: []
    }
  }, [review])

  // Get "One More Thing" insight
  const getOneMoreThing = useCallback(() => {
    return review?.oneMoreThing || ''
  }, [review])

  // Get critical issues
  const getCriticalIssues = useCallback(() => {
    if (!review) return []

    const issues = []
    const scores = review.agentScores

    if (scores.sculptor < 7) {
      issues.push('Clarity & Simplicity needs improvement')
    }
    if (scores.choreographer < 7) {
      issues.push('Interaction & Flow needs refinement')
    }
    if (scores.composer < 7) {
      issues.push('Emotional Resonance needs strengthening')
    }
    if (scores.jeweler < 7) {
      issues.push('Craftsmanship needs premium attention')
    }
    if (scores.aesthete < 7) {
      issues.push('Beauty & Aesthetics needs enhancement')
    }

    return issues
  }, [review])

  // Get strengths
  const getStrengths = useCallback(() => {
    if (!review) return []

    const strengths = []
    const scores = review.agentScores

    if (scores.sculptor >= 7) {
      strengths.push('Strong Clarity & Simplicity')
    }
    if (scores.choreographer >= 7) {
      strengths.push('Good Interaction & Flow')
    }
    if (scores.composer >= 7) {
      strengths.push('Strong Emotional Resonance')
    }
    if (scores.jeweler >= 7) {
      strengths.push('Good Craftsmanship')
    }
    if (scores.aesthete >= 7) {
      strengths.push('Strong Beauty & Aesthetics')
    }

    return strengths
  }, [review])

  // Get recommendations
  const getRecommendations = useCallback(() => {
    if (!review) return []

    const recommendations = []
    const scores = review.agentScores

    if (scores.sculptor < 7) {
      recommendations.push('Simplify interface and reduce visual clutter')
    }
    if (scores.choreographer < 7) {
      recommendations.push('Improve interaction flow and reduce friction')
    }
    if (scores.composer < 7) {
      recommendations.push('Strengthen emotional connection and authenticity')
    }
    if (scores.jeweler < 7) {
      recommendations.push('Enhance craftsmanship and attention to detail')
    }
    if (scores.aesthete < 7) {
      recommendations.push('Create more beautiful and confident design')
    }

    return recommendations
  }, [review])

  // Auto-generate review on mount
  useEffect(() => {
    generateReview()
  }, [generateReview])

  return {
    review,
    isAnalyzing,
    generateReview,
    getExecutiveSummary,
    getAgentAnalysis,
    getOverallScore,
    getAgentScores,
    getVerdicts,
    getEvidence,
    getOneMoreThing,
    getCriticalIssues,
    getStrengths,
    getRecommendations
  }
}
