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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">{error || 'Student not found'}</p>
              <Link href="/admin">
                <Button>Back to Student List</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/admin">
          <Button variant="ghost" className="mb-2">
            ← Back to All Students
          </Button>
        </Link>

        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {formatUserIdShort(insights.userId)}
                </CardTitle>
                <CardDescription className="mt-1">
                  {formatUserIdRelative(insights.userId)}
                </CardDescription>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><span className="font-medium">Current Scene:</span> {insights.currentScene}</p>
            </div>
          </CardHeader>
        </Card>

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="text-gray-600">Loading student insights...</p>
      </div>
    </div>
  )
}
