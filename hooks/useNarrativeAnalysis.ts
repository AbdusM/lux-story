"use client"

import { useState, useEffect, useCallback } from 'react'
import { getNarrativeQualityReporter, NarrativeQualityReport, QualityMetrics } from '@/lib/narrative-quality-report'

/**
 * Hook for narrative analysis and quality monitoring
 * Provides insights into story arcs, character journeys, and hook effectiveness
 */
export function useNarrativeAnalysis() {
  const [report, setReport] = useState<NarrativeQualityReport | null>(null)
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const reporter = getNarrativeQualityReporter()

  // Generate comprehensive analysis report
  const generateAnalysis = useCallback(() => {
    setIsAnalyzing(true)
    try {
      const newReport = reporter.generateReport()
      const newMetrics = reporter.calculateQualityMetrics()
      setReport(newReport)
      setMetrics(newMetrics)
    } catch (error) {
      console.error('Error generating narrative analysis:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [reporter])

  // Get executive summary
  const getExecutiveSummary = useCallback(() => {
    return reporter.getExecutiveSummary()
  }, [reporter])

  // Get specific analysis sections
  const getStoryArcAnalysis = useCallback(() => {
    return report?.storyArcAnalysis || []
  }, [report])

  const getCharacterJourneyAnalysis = useCallback(() => {
    return report?.characterJourneyAnalysis || []
  }, [report])

  const getHookAnalysis = useCallback(() => {
    return report?.hookAnalysis || []
  }, [report])

  const getNaturalIntegrationSuggestions = useCallback(() => {
    return report?.naturalIntegrationSuggestions || []
  }, [report])

  const getPriorityFixes = useCallback(() => {
    return report?.priorityFixes || { immediate: [], shortTerm: [], longTerm: [] }
  }, [report])

  // Get quality insights
  const getQualityInsights = useCallback(() => {
    if (!metrics) return []

    const insights = []

    if (metrics.narrativeCompletion < 70) {
      insights.push('Story arcs need more development')
    }

    if (metrics.hookEffectiveness < 70) {
      insights.push('Hook delivery needs improvement')
    }

    if (metrics.characterDevelopment < 70) {
      insights.push('Character journeys need attention')
    }

    if (metrics.consistency < 70) {
      insights.push('Consistency issues need resolution')
    }

    if (metrics.pacing < 70) {
      insights.push('Pacing needs adjustment')
    }

    return insights
  }, [metrics])

  // Get strengths
  const getStrengths = useCallback(() => {
    return report?.strengths || []
  }, [report])

  // Get critical issues
  const getCriticalIssues = useCallback(() => {
    return report?.criticalIssues || []
  }, [report])

  // Get recommendations
  const getRecommendations = useCallback(() => {
    return report?.recommendations || []
  }, [report])

  // Auto-generate analysis on mount
  useEffect(() => {
    generateAnalysis()
  }, [generateAnalysis])

  return {
    report,
    metrics,
    isAnalyzing,
    generateAnalysis,
    getExecutiveSummary,
    getStoryArcAnalysis,
    getCharacterJourneyAnalysis,
    getHookAnalysis,
    getNaturalIntegrationSuggestions,
    getPriorityFixes,
    getQualityInsights,
    getStrengths,
    getCriticalIssues,
    getRecommendations
  }
}
