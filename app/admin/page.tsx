'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllUserIds, loadSkillProfile } from '@/lib/skill-profile-adapter'
import { parseStudentInsights } from '@/lib/student-insights-parser'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatUserIdShort, formatUserIdRelative } from '@/lib/format-user-id'
import type { StudentInsights } from '@/lib/types/student-insights'

/**
 * Admin Dashboard - Individual Student Insights
 * Focus on understanding each student's unique journey
 */
export default function AdminPage() {
  const [students, setStudents] = useState<StudentInsights[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load and parse all student data
  useEffect(() => {
    if (!mounted) return

    const loadStudentData = async () => {
      try {
        // Get all user IDs
        const ids = await getAllUserIds()
        
        // Sort by recency (newest first)
        const sortedIds = ids.sort((a, b) => {
          const timestampA = a.match(/player_(\d+)/)?.[1] || '0'
          const timestampB = b.match(/player_(\d+)/)?.[1] || '0'
          return parseInt(timestampB) - parseInt(timestampA)
        })

        // Load profiles in parallel
        const profiles = await Promise.all(
          sortedIds.map(id => loadSkillProfile(id))
        )

        // Parse into insights
        const insights = profiles
          .filter(profile => profile !== null)
          .map(profile => parseStudentInsights(profile!))

        setStudents(insights)
      } catch (error) {
        console.error('Failed to load student data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStudentData()
  }, [mounted])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-600">Loading student insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Students</h1>
          <p className="text-gray-600 mt-1">
            {students.length} {students.length === 1 ? 'student' : 'students'} exploring their career paths
          </p>
        </div>

        {/* Student List */}
        {students.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No students yet. Student data will appear here as they begin their journey.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {students.map(student => (
              <StudentCard key={student.userId} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Individual Student Card
 */
function StudentCard({ student }: { student: StudentInsights }) {
  const { choicePatterns, characterRelationships } = student

  // Get dominant pattern and percentage
  const patterns = [
    { name: 'Helping', value: choicePatterns.helping },
    { name: 'Analytical', value: choicePatterns.analytical },
    { name: 'Patience', value: choicePatterns.patience },
    { name: 'Exploring', value: choicePatterns.exploring },
    { name: 'Building', value: choicePatterns.building }
  ].filter(p => p.value > 0).sort((a, b) => b.value - a.value)

  // Get current activity from character relationships
  const currentActivity = characterRelationships.find(c => c.met && c.currentStatus !== 'Not yet met')?.currentStatus || 'Starting journey'

  return (
    <Link href={`/admin/skills?userId=${student.userId}`}>
      <Card className="hover:shadow-lg hover:border-blue-300 transition cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Left: User Info */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatUserIdShort(student.userId)}
                </h3>
                <span className="text-sm text-gray-500">
                  ({formatUserIdRelative(student.userId)})
                </span>
              </div>

              {/* Character Trust Levels */}
              <div className="flex items-center gap-4 text-sm">
                {characterRelationships.map(char => {
                  const shortName = char.characterName.split(' ')[0]
                  return (
                    <div key={char.characterName} className="flex items-center gap-1">
                      <span className="text-gray-600">{shortName}:</span>
                      <span className={char.met ? 'font-medium text-gray-900' : 'text-gray-400'}>
                        {char.trustLevel}/10
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Choice Patterns */}
              {patterns.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {patterns.slice(0, 2).map(pattern => (
                    <Badge key={pattern.name} variant="secondary">
                      {pattern.name} {pattern.value}%
                    </Badge>
                  ))}
                </div>
              )}

              {/* Current Activity */}
              <p className="text-sm text-gray-600">
                → {currentActivity}
              </p>
            </div>

            {/* Right: View Details Arrow */}
            <div className="text-gray-400 group-hover:text-blue-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
