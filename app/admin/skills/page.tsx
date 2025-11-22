'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loadSkillProfile } from '@/lib/skill-profile-adapter'
import { parseStudentInsights } from '@/lib/student-insights-parser'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatUserIdShort, formatUserIdRelative } from '@/lib/format-user-id'
import { ChoicePatternBar } from '@/components/admin/ChoicePatternBar'
import { CharacterRelationshipCard } from '@/components/admin/CharacterRelationshipCard'
import { BreakthroughTimeline } from '@/components/admin/BreakthroughTimeline'
import { CareerDiscoveryCard } from '@/components/admin/CareerDiscoveryCard'
import { SkillsAnalysisCard } from '@/components/admin/SkillsAnalysisCard'
import { SkillGapsAnalysis } from '@/components/admin/SkillGapsAnalysis'
import { EvidenceTimeline } from '@/components/admin/EvidenceTimeline'
import type { StudentInsights } from '@/lib/types/student-insights'

/**
 * Individual Student Detail Page
 * Deep dive into one student's journey
 */
export default function StudentDetailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StudentDetailContent />
    </Suspense>
  )
}

function StudentDetailContent() {
  const searchParams = useSearchParams()
  const userId = searchParams?.get('userId') || ''

  const [insights, setInsights] = useState<StudentInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setError('No user ID provided')
      setLoading(false)
      return
    }

    const loadStudentInsights = async () => {
      try {
        const profile = await loadSkillProfile(userId)
        
        if (!profile) {
          setError('Student not found')
          return
        }

        const parsedInsights = parseStudentInsights(profile)
        setInsights(parsedInsights)
      } catch (err) {
        console.error('Failed to load student insights:', err)
        setError('Failed to load student data')
      } finally {
        setLoading(false)
      }
    }

    loadStudentInsights()
  }, [userId])

  if (loading) {
    return <LoadingState />
  }

  if (error || !insights) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Student</h3>
                  <p className="text-base text-red-700 mb-6">{error || 'Student not found'}</p>
                  <Link href="/admin">
                    <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                      Back to Student List
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <Link href="/admin">
          <Button variant="ghost" className="mb-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            ← Back to All Students
          </Button>
        </Link>

        {/* Header */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl text-slate-900">
                  {formatUserIdShort(insights.userId)}
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  {formatUserIdRelative(insights.userId)}
                </CardDescription>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-base text-slate-700">
                <span className="font-semibold text-slate-900">Current Scene:</span> {insights.currentScene}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Skills Analysis */}
          // @ts-expect-error - Type conversion needed
        <SkillsAnalysisCard profile={insights} />

        {/* Skill Gaps Analysis - NEW FOCUS */}
        <SkillGapsAnalysis 
          skillGaps={insights.skillGaps || []} 
          totalDemonstrations={insights.totalDemonstrations || 0} 
        />

        {/* Evidence Timeline - NEW FOCUS */}
        <EvidenceTimeline 
          keySkillMoments={insights.keySkillMoments || []} 
          totalDemonstrations={insights.totalDemonstrations || 0} 
        />

        {/* Choice Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Choice Patterns</CardTitle>
            <CardDescription>
              How this student approaches decisions and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChoicePatternBar patterns={insights.choicePatterns} />
          </CardContent>
        </Card>

        {/* Character Relationships */}
        <Card>
          <CardHeader>
            <CardTitle>Character Relationships</CardTitle>
            <CardDescription>
              Trust levels and interactions with Maya, Devon, and Jordan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.characterRelationships.map(character => (
                <CharacterRelationshipCard 
                  key={character.characterName} 
                  character={character} 
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Discovery */}
        <Card>
          <CardHeader>
            <CardTitle>Career Discovery</CardTitle>
            <CardDescription>
              Career matches and Birmingham opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CareerDiscoveryCard career={insights.careerDiscovery} />
          </CardContent>
        </Card>

        {/* Breakthrough Moments */}
        <Card>
          <CardHeader>
            <CardTitle>Breakthrough Moments</CardTitle>
            <CardDescription>
              Key moments of vulnerability, decision, and growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BreakthroughTimeline moments={insights.breakthroughMoments} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-slate-200 border-t-blue-600 mx-auto" />
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 opacity-20" />
        </div>
        <div>
          <p className="text-lg font-medium text-slate-900 mb-2">Loading Student Profile</p>
          <p className="text-base text-slate-600">Analyzing choice patterns and character relationships...</p>
        </div>
      </div>
    </div>
  )
}
