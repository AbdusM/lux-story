'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, TrendingUp, Lightbulb, AlertCircle, CheckCircle2, Target } from 'lucide-react'
import type { PatternProfile } from '@/lib/pattern-profile-adapter'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { formatPatternName, getPatternDescription, getPatternBgClass } from '@/lib/patterns'

interface PatternSectionProps {
  userId: string
  profile: SkillProfile
  adminViewMode: 'family' | 'research'
}

/**
 * Pattern Analytics Section - Admin-facing pattern insights
 * Shows decision-making patterns, evolution, and recommendations for advisors
 */
export function PatternSection({ userId, profile, adminViewMode }: PatternSectionProps) {
  const [patternProfile, setPatternProfile] = useState<PatternProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPatternProfile() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/user/pattern-profile?userId=${encodeURIComponent(userId)}&mode=full`)

        if (!response.ok) {
          const errorData = await response.json()

          // Handle gracefully if database not configured
          if (response.status === 503 && errorData.error === 'Database not configured') {
            setError('Pattern tracking requires database configuration. Migration pending.')
            return
          }

          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const data = await response.json()

        if (!data.success || !data.profile) {
          setError('No pattern data available yet. Student needs to make more choices.')
          return
        }

        setPatternProfile(data.profile)
      } catch (err) {
        console.error('Failed to load pattern profile:', err)
        setError('Unable to load pattern data. Check database configuration.')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadPatternProfile()
    }
  }, [userId])

  if (loading) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading pattern analytics...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !patternProfile || patternProfile.totalDemonstrations === 0) {
    return (
      <Card className="shadow-md border-2 border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-slate-600" />
            <CardTitle className="text-xl">Decision-Making Patterns</CardTitle>
          </div>
          <CardDescription>
            How this student approaches choices and problem-solving
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-gray-600 mb-2">
            {error || 'Pattern data will appear as the student makes choices in the narrative.'}
          </p>
          <p className="text-sm text-gray-500">
            {adminViewMode === 'family'
              ? 'Each choice reveals how they naturally approach decisions and relationships.'
              : 'Tracking 5 decision-making patterns: analytical, patient, exploring, helping, building.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  const { summaries, decisionStyle, diversityScore, skillCorrelations, totalDemonstrations } = patternProfile

  return (
    <div className="space-y-6">
      {/* Pattern Overview Card */}
      <Card className="shadow-md border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl">Decision-Making Style</CardTitle>
            </div>
            <Badge className="bg-blue-600 text-white">
              {totalDemonstrations} {totalDemonstrations === 1 ? 'choice' : 'choices'} analyzed
            </Badge>
          </div>
          <CardDescription>
            {adminViewMode === 'family'
              ? 'Understanding how they naturally approach decisions'
              : 'Behavioral pattern analysis from choice data'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Decision Style */}
          {decisionStyle && (
            <div className="bg-white/80 rounded-lg p-5 border-2 border-blue-300 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{decisionStyle.styleName}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {adminViewMode === 'family'
                      ? decisionStyle.description
                      : `Primary pattern: ${formatPatternName(decisionStyle.dominantPattern)} (${Math.round(decisionStyle.dominantPercentage)}% of choices)`}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-blue-600 text-white">
                      {formatPatternName(decisionStyle.dominantPattern)} {Math.round(decisionStyle.dominantPercentage)}%
                    </Badge>
                    {decisionStyle.secondaryPattern && decisionStyle.secondaryPercentage && (
                      <Badge variant="outline" className="border-blue-400 text-blue-700">
                        {formatPatternName(decisionStyle.secondaryPattern)} {Math.round(decisionStyle.secondaryPercentage)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pattern Breakdown */}
          {summaries.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Pattern Distribution</h3>
              </div>
              <div className="space-y-3">
                {summaries.map((summary) => (
                  <div key={summary.patternName} className="bg-white/60 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {formatPatternName(summary.patternName)}
                        </span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          {summary.demonstrationCount}×
                        </Badge>
                      </div>
                      <span className="text-sm font-semibold text-blue-700">
                        {Math.round(summary.percentage)}%
                      </span>
                    </div>
                    <Progress value={summary.percentage} className="h-2 mb-2" />
                    {adminViewMode === 'research' && (
                      <p className="text-xs text-gray-600 italic">
                        {getPatternDescription(summary.patternName)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diversity & Skills Card */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <CardTitle className="text-xl">Pattern Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Diversity Score */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Decision Diversity</h3>
                  <Badge className={`${
                    diversityScore.score >= 70 ? 'bg-green-600' :
                    diversityScore.score >= 40 ? 'bg-amber-600' :
                    'bg-red-600'
                  } text-white`}>
                    {diversityScore.score}/100
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {adminViewMode === 'family' ? (
                    diversityScore.score >= 70 ? (
                      'They explore different approaches to decision-making.'
                    ) : diversityScore.score >= 40 ? (
                      'They show some variety in how they approach decisions.'
                    ) : (
                      'They tend to rely on familiar decision-making patterns.'
                    )
                  ) : (
                    `Using ${diversityScore.totalPatterns}/5 patterns. Entropy: ${diversityScore.entropy}`
                  )}
                </p>
                {diversityScore.recommendation && (
                  <div className="flex items-start gap-2 bg-white/70 rounded px-3 py-2 mt-2">
                    {diversityScore.score < 50 ? (
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium text-gray-800">
                      {adminViewMode === 'family'
                        ? diversityScore.recommendation
                        : `Recommendation: ${diversityScore.recommendation}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pattern-Skill Connections */}
          {skillCorrelations.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Pattern-Skill Development</h3>
              <p className="text-sm text-gray-600 mb-3">
                {adminViewMode === 'family'
                  ? 'How their decision-making patterns connect to skill development:'
                  : 'WEF 2030 skill correlations by pattern:'}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {skillCorrelations.slice(0, 5).map((correlation) => (
                  <div key={correlation.patternName} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {formatPatternName(correlation.patternName)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {correlation.skillCount} uses
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {correlation.topSkills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs border-slate-300 text-slate-700">
                          {skill.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advisor Notes */}
      <Card className="shadow-md border-2 border-slate-200">
        <CardContent className="p-4">
          <p className="text-sm text-gray-700">
            <strong>{adminViewMode === 'family' ? 'Note for families:' : 'Research note:'}</strong>{' '}
            {adminViewMode === 'family' ? (
              <>
                Decision-making patterns are descriptive, not prescriptive. There's no "best" style.
                Each approach has unique strengths. The goal is self-awareness and flexibility.
              </>
            ) : (
              <>
                Pattern data aggregated from choice metadata. Minimum 5 demonstrations required for pattern unlock.
                Diversity score calculated using Shannon entropy (max: log₂(5) ≈ 2.32).
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
