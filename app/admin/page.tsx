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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-slate-200 border-t-blue-600 mx-auto" />
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 opacity-20" />
            </div>
          <div>
            <p className="text-lg font-medium text-slate-900 mb-2">Loading Student Insights</p>
            <p className="text-base text-slate-600">Analyzing student journeys and career patterns...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Student Insights Dashboard</h1>
          <p className="text-lg text-slate-600">
            {students.length} {students.length === 1 ? 'student' : 'students'} exploring their career paths
          </p>
        </div>

        {/* Student List */}
        {students.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-300">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Students Yet</h3>
                  <p className="text-base text-slate-600 mb-4">
                    Student insights will appear here as they begin their career exploration journey.
                  </p>
                  <p className="text-sm text-slate-500">
                    Each student's unique path, choice patterns, and character relationships will be tracked and analyzed.
                      </p>
                    </div>
                  </div>
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
      <Card className="group hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-6">
            {/* Left: User Info */}
            <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {formatUserIdShort(student.userId)}
              </h3>
                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {formatUserIdRelative(student.userId)}
              </span>
            </div>

              {/* Character Trust Levels */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                {characterRelationships.map(char => {
                  const shortName = char.characterName.split(' ')[0]
                  return (
                    <div key={char.characterName} className="flex items-center gap-2">
                      <span className="text-slate-600 font-medium">{shortName}:</span>
                      <span className={`font-semibold ${char.met ? 'text-slate-900' : 'text-slate-400'}`}>
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
                    <Badge key={pattern.name} variant="secondary" className="text-xs font-medium">
                      {pattern.name} {pattern.value}%
                    </Badge>
                  ))}
                </div>
              )}

              {/* Current Activity */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  {currentActivity}
                </p>
              </div>
          </div>

            {/* Right: View Details Arrow */}
            <div className="text-slate-400 group-hover:text-blue-600 transition-all duration-200 group-hover:translate-x-1">
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
