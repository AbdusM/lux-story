'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, TrendingUp, Lightbulb, Target, Sparkles } from 'lucide-react'
import type { PatternProfile } from '@/lib/pattern-profile-adapter'
import { PatternEvolutionChart } from '@/components/student/PatternEvolutionChart'
import { formatPatternName, getPatternDescription } from '@/lib/patterns'

interface PatternInsightsSectionProps {
  userId: string
}

/**
 * Pattern Insights Section - Student-facing pattern analytics
 * Shows decision-making style, pattern breakdown, and recommendations
 */
export function PatternInsightsSection({ userId }: PatternInsightsSectionProps) {
  const [patternProfile, setPatternProfile] = useState<PatternProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPatternProfile() {
      try {
        setLoading(true)
        setError(null)

        // Fetch pattern profile from API
        const response = await fetch(`/api/user/pattern-profile?userId=${encodeURIComponent(userId)}&mode=full`)

        if (!response.ok) {
          const errorData = await response.json()

          // Handle gracefully if database not configured (local dev without migration)
          if (response.status === 503 && errorData.error === 'Database not configured') {
            setError('Pattern tracking will be available after database setup. Keep playing to collect data!')
            return
          }

          throw new Error(errorData.error || `HTTP ${response.status}`)
        }

        const data = await response.json()

        if (!data.success || !data.profile) {
          setError('Make some choices first to see your decision-making style!')
          return
        }

        setPatternProfile(data.profile)
      } catch (err) {
        console.error('Failed to load pattern profile:', err)
        // Don't show error if it's just no data yet
        if (err instanceof Error && err.message.includes('404')) {
          setError('Make some choices first to see your decision-making style!')
        } else {
          setError('Pattern insights will be available soon. Keep playing!')
        }
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
          <p className="text-sm text-gray-600">Loading pattern insights...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !patternProfile || patternProfile.totalDemonstrations === 0) {
    return (
      <Card className="shadow-md border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-xl">Your Decision-Making Style</CardTitle>
          </div>
          <CardDescription>
            Discover how you approach choices and solve problems
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-300" />
          <p className="text-gray-600 mb-2">
            {error || 'Make some choices in the game to discover your decision-making style!'}
          </p>
          <p className="text-sm text-gray-500">
            Your decision-making patterns will appear here as you progress.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { summaries, decisionStyle, diversityScore, skillCorrelations, evolution } = patternProfile

  return (
    <>
    <Card className="shadow-md border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <CardTitle className="text-xl">Your Decision-Making Style</CardTitle>
        </div>
        <CardDescription>
          Understanding how you approach choices and solve problems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Decision Style */}
        {decisionStyle && (
          <div className="bg-white/80 rounded-lg p-6 border-2 border-purple-300 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{decisionStyle.styleName}</h3>
                <p className="text-sm text-gray-600">Your primary decision-making approach</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {decisionStyle.description}
            </p>
            <div className="mt-4 flex gap-2">
              <Badge className="bg-purple-600 text-white">
                {formatPatternName(decisionStyle.dominantPattern)} ({Math.round(decisionStyle.dominantPercentage)}%)
              </Badge>
              {decisionStyle.secondaryPattern && decisionStyle.secondaryPercentage && (
                <Badge variant="outline" className="border-purple-400 text-purple-700">
                  {formatPatternName(decisionStyle.secondaryPattern)} ({Math.round(decisionStyle.secondaryPercentage)}%)
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Pattern Breakdown */}
        {summaries.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Your Pattern Breakdown</h3>
            </div>
            <div className="space-y-3">
              {summaries.map((summary) => (
                <div key={summary.patternName} className="bg-white/60 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {formatPatternName(summary.patternName)}
                      </span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                        {summary.demonstrationCount} {summary.demonstrationCount === 1 ? 'time' : 'times'}
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold text-purple-700">
                      {Math.round(summary.percentage)}%
                    </span>
                  </div>
                  <Progress value={summary.percentage} className="h-2 mb-2" />
                  <p className="text-xs text-gray-600 italic">
                    {getPatternDescription(summary.patternName)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diversity Score */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-l-4 border-purple-500">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-full">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Decision Diversity</h3>
                <Badge className="bg-purple-600 text-white">
                  {diversityScore.score}/100
                </Badge>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                {diversityScore.score >= 70 ? (
                  'Great! You explore different approaches to decision-making.'
                ) : diversityScore.score >= 40 ? (
                  'You have a moderate range of decision-making approaches.'
                ) : (
                  'You tend to stick to familiar approaches. Try exploring new perspectives!'
                )}
              </p>
              {diversityScore.recommendation && (
                <p className="text-sm font-medium text-purple-800 bg-white/70 rounded px-3 py-2 mt-2">
                  💡 {diversityScore.recommendation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pattern-Skill Connections */}
        {skillCorrelations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900">How Patterns Connect to Skills</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Your decision-making patterns help you develop specific skills:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skillCorrelations.slice(0, 4).map((correlation) => (
                <div key={correlation.patternName} className="bg-white/60 rounded-lg p-3 border border-purple-200">
                  <div className="font-medium text-gray-900 mb-1">
                    {formatPatternName(correlation.patternName)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {correlation.topSkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs border-purple-300 text-purple-700">
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

    {/* Pattern Evolution Chart (if we have time-series data) */}
    {evolution && evolution.length > 0 && (
      <PatternEvolutionChart evolution={evolution} />
    )}
  </>
  )
}
