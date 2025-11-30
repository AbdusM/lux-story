'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllUserIds, loadSkillProfile } from '@/lib/skill-profile-adapter'
import { parseStudentInsights } from '@/lib/student-insights-parser'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatUserIdShort, formatUserIdRelative } from '@/lib/format-user-id'
import { PATTERN_TYPES, formatPatternName, getPatternBgClass } from '@/lib/patterns'
import type { StudentInsights } from '@/lib/types/student-insights'
import type { PatternType } from '@/lib/patterns'

/**
 * Admin Dashboard - Individual Student Insights
 * Focus on understanding each student's unique journey
 */
export default function AdminPage() {
  const [students, setStudents] = useState<StudentInsights[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSupabaseUnreachable, setIsSupabaseUnreachable] = useState(false)
  const [patternFilter, setPatternFilter] = useState<PatternType | 'all'>('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load student IDs and initial batch
  useEffect(() => {
    if (!mounted) return

    const loadStudentData = async () => {
      try {
        setError(null)
        setIsSupabaseUnreachable(false)
        
        // Get all user IDs first
        const ids = await getAllUserIds()

        // Check if Supabase is unreachable by comparing API vs localStorage
        if (ids.length === 0) {
          // Check localStorage to see if there's local data
          const localStorageKeys = Object.keys(localStorage).filter(k => k.startsWith('skill_tracker_'))
          if (localStorageKeys.length > 0) {
            // We have local data but API returned empty - Supabase is unreachable
            setIsSupabaseUnreachable(true)
            setError('Database connection issue detected. Showing local-only data from this browser.')
          } else {
            // No data anywhere - might be truly empty or Supabase unreachable
            setIsSupabaseUnreachable(true)
            setError('No student data found. Check Supabase configuration if you expect data.')
          }
        }

        // Sort by recency (newest first)
        const sortedIds = ids.sort((a, b) => {
          const timestampA = a.match(/player_(\d+)/)?.[1] || '0'
          const timestampB = b.match(/player_(\d+)/)?.[1] || '0'
          return parseInt(timestampB) - parseInt(timestampA)
        })

        // Load first batch (50 students max for performance)
        const initialBatch = sortedIds.slice(0, 50)

        // Load profiles in smaller batches to prevent UI blocking
        const batchSize = 10
        const insights: StudentInsights[] = []

        for (let i = 0; i < initialBatch.length; i += batchSize) {
          const batch = initialBatch.slice(i, i + batchSize)
          const profiles = await Promise.all(
            batch.map(id => loadSkillProfile(id))
          )

          const batchInsights = profiles
            .filter(profile => profile !== null)
            .map(profile => parseStudentInsights(profile!))

          insights.push(...batchInsights)
          
          // Update UI progressively
          setStudents([...insights])
        }

        setStudents(insights)
        
        // Clear error if we successfully loaded students (even if from localStorage)
        if (insights.length > 0) {
          setError(null)
          setIsSupabaseUnreachable(false)
        }
      } catch (error: unknown) {
        console.error('Failed to load student data:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to load student data'
        setError(errorMessage)
        setIsSupabaseUnreachable(true)
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

  // Filter students by selected pattern
  const filteredStudents = patternFilter === 'all'
    ? students
    : students.filter(student => {
        const patterns = [
          { name: 'helping', value: student.choicePatterns.helping },
          { name: 'analytical', value: student.choicePatterns.analytical },
          { name: 'patience', value: student.choicePatterns.patience },
          { name: 'exploring', value: student.choicePatterns.exploring },
          { name: 'building', value: student.choicePatterns.building }
        ].filter(p => p.value > 0).sort((a, b) => b.value - a.value)

        return patterns[0]?.name === patternFilter
      })

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Student Insights Dashboard</h1>
          <p className="text-lg text-slate-600">
            {filteredStudents.length} of {students.length} {students.length === 1 ? 'student' : 'students'}
            {patternFilter !== 'all' && ` with ${formatPatternName(patternFilter)} pattern`}
          </p>
        </div>

        {/* Pattern Filter */}
        {students.length > 0 && (
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700">Filter by Decision-Making Pattern</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={patternFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPatternFilter('all')}
                    className="text-xs"
                  >
                    All Students ({students.length})
                  </Button>
                  {PATTERN_TYPES.map(pattern => {
                    const count = students.filter(student => {
                      const patterns = [
                        { name: 'helping', value: student.choicePatterns.helping },
                        { name: 'analytical', value: student.choicePatterns.analytical },
                        { name: 'patience', value: student.choicePatterns.patience },
                        { name: 'exploring', value: student.choicePatterns.exploring },
                        { name: 'building', value: student.choicePatterns.building }
                      ].filter(p => p.value > 0).sort((a, b) => b.value - a.value)
                      return patterns[0]?.name === pattern
                    }).length

                    return (
                      <Button
                        key={pattern}
                        variant={patternFilter === pattern ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPatternFilter(pattern)}
                        className={`text-xs ${patternFilter === pattern ? getPatternBgClass(pattern) : ''}`}
                      >
                        {formatPatternName(pattern)} ({count})
                      </Button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Alert */}
        {error && (
          <Card className={`border-2 ${isSupabaseUnreachable ? 'border-amber-300 bg-amber-50' : 'border-red-300 bg-red-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-5 h-5 ${isSupabaseUnreachable ? 'text-amber-600' : 'text-red-600'}`}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold mb-1 ${isSupabaseUnreachable ? 'text-amber-900' : 'text-red-900'}`}>
                    {isSupabaseUnreachable ? 'Database Connection Issue' : 'Error Loading Data'}
                  </h3>
                  <p className={`text-sm ${isSupabaseUnreachable ? 'text-amber-800' : 'text-red-800'}`}>
                    {error}
                  </p>
                  {isSupabaseUnreachable && (
                    <p className="text-xs text-amber-700 mt-2">
                      The app is running in local-only mode. Check your Supabase configuration in <code className="bg-amber-100 px-1 rounded">.env.local</code>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student List */}
        {filteredStudents.length === 0 && students.length > 0 ? (
          <Card className="border-dashed border-2 border-slate-300">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Matching Students</h3>
                  <p className="text-base text-slate-600 mb-4">
                    No students found with {formatPatternName(patternFilter as PatternType)} as their dominant pattern.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setPatternFilter('all')}>
                    Clear Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : students.length === 0 ? (
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
                    {isSupabaseUnreachable 
                      ? 'Unable to load students from database. Check your Supabase configuration.'
                      : 'Student insights will appear here as they begin their career exploration journey.'}
                  </p>
                  {!isSupabaseUnreachable && (
                    <p className="text-sm text-slate-500">
                      Each student's unique path, choice patterns, and character relationships will be tracked and analyzed.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map(student => (
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
    <Link href={`/admin/${student.userId}/urgency`}>
      <Card className="group hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer border-slate-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3 sm:gap-6">
            {/* Left: User Info */}
            <div className="space-y-3 sm:space-y-4 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h3 className="text-base sm:text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {formatUserIdShort(student.userId)}
                </h3>
                <span className="text-xs sm:text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">
                  {formatUserIdRelative(student.userId)}
                </span>
              </div>

              {/* Character Trust Levels */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                {characterRelationships.map(char => {
                  const shortName = char.characterName.split(' ')[0]
                  return (
                    <div key={char.characterName} className="flex items-center gap-1 sm:gap-2">
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
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
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
