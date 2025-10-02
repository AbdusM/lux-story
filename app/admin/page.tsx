'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChoiceReviewTrigger } from '@/components/ChoiceReviewPanel'
import { getAllUserIds, loadSkillProfile } from '@/lib/skill-profile-adapter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, TrendingUp, Award, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react'
import type { UrgentStudent } from '@/lib/types/admin'
import { formatUserIdShort, formatUserIdRelative } from '@/lib/format-user-id'

/**
 * Admin Dashboard
 * Unified interface for urgency triage, skills analytics, and live choice review
 */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('urgency')

  // Student Journeys state (existing)
  const [userIds, setUserIds] = useState<string[]>([])
  const [userStats, setUserStats] = useState<Map<string, any>>(new Map())
  const [journeysLoading, setJourneysLoading] = useState(true)

  // Urgency Triage state (NEW)
  const [urgentStudents, setUrgentStudents] = useState<UrgentStudent[]>([])
  const [urgencyLoading, setUrgencyLoading] = useState(true)
  const [recalculating, setRecalculating] = useState(false)
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'critical' | 'high'>('all')

  // Load student journeys (existing logic)
  useEffect(() => {
    const ids = getAllUserIds()
    setUserIds(ids)

    const stats = new Map()
    ids.forEach(userId => {
      const profile = loadSkillProfile(userId)
      if (profile) {
        const topSkill = Object.entries(profile.skillDemonstrations)
          .sort(([, a], [, b]) => b.length - a.length)[0] || ['none', []]

        stats.set(userId, {
          totalDemonstrations: profile.totalDemonstrations,
          topSkill,
          topCareer: profile.careerMatches[0],
          milestones: profile.milestones.length
        })
      }
    })
    setUserStats(stats)
    setJourneysLoading(false)
  }, [])

  // Load urgent students (NEW)
  useEffect(() => {
    fetchUrgentStudents()
  }, [urgencyFilter])

  async function fetchUrgentStudents() {
    setUrgencyLoading(true)
    try {
      // Use server-side proxy to protect API token
      const response = await fetch(
        `/api/admin-proxy/urgency?level=${urgencyFilter}&limit=50`
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setUrgentStudents(data.students || [])
    } catch (error) {
      console.error('Failed to fetch urgent students:', error)
      // Show empty state rather than error for now
      setUrgentStudents([])
    } finally {
      setUrgencyLoading(false)
    }
  }

  async function triggerRecalculation() {
    setRecalculating(true)
    try {
      // Use server-side proxy to protect API token
      const response = await fetch('/api/admin-proxy/urgency', {
        method: 'POST'
      })

      if (response.ok) {
        // Refresh urgent students after recalculation
        await fetchUrgentStudents()
      }
    } catch (error) {
      console.error('Recalculation failed:', error)
    } finally {
      setRecalculating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Grand Central Terminus Admin
              </h1>
              <p className="text-gray-600">
                Student Urgency Triage, Skills Analytics & Live Choice Review
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Game
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="urgency" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Student Triage
            </TabsTrigger>
            <TabsTrigger value="journeys" className="gap-2">
              <Users className="w-4 h-4" />
              Student Journeys
            </TabsTrigger>
            <TabsTrigger value="choices" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Live Choices
            </TabsTrigger>
          </TabsList>

          {/* URGENCY TRIAGE TAB (NEW) */}
          <TabsContent value="urgency" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Student Intervention Priority
                    </CardTitle>
                    <CardDescription>
                      Glass Box urgency scoring with transparent narrative justifications
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Filter Dropdown */}
                    <select
                      value={urgencyFilter}
                      onChange={(e) => setUrgencyFilter(e.target.value as any)}
                      className="px-3 py-1.5 border rounded-md text-sm"
                    >
                      <option value="all">All Urgent Students</option>
                      <option value="all-students">📊 All Students (includes non-urgent)</option>
                      <option value="critical">Critical Only</option>
                      <option value="high">High + Critical</option>
                    </select>

                    {/* Recalculate Button */}
                    <Button
                      onClick={triggerRecalculation}
                      disabled={recalculating}
                      size="sm"
                      className="gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} />
                      Recalculate
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {urgencyLoading ? (
                  <div className="text-center py-12 text-gray-500">
                    Loading urgent students...
                  </div>
                ) : urgentStudents.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-gray-600">No urgent students found.</p>
                    <p className="text-sm text-gray-500">
                      {urgencyFilter !== 'all'
                        ? 'Try changing the filter or run recalculation.'
                        : 'No students have urgency scores yet. Click "Recalculate" to generate scores.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {urgentStudents.map((student) => (
                      <UrgentStudentCard key={student.userId} student={student} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* STUDENT JOURNEYS TAB (EXISTING) */}
          <TabsContent value="journeys" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Skill Journeys
                    </CardTitle>
                    <CardDescription>
                      Evidence-based career exploration analytics
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    {userIds.length} {userIds.length === 1 ? 'User' : 'Users'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {journeysLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading user data...
                  </div>
                ) : userIds.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-gray-600">No user journeys found yet.</p>
                    <p className="text-sm text-gray-500">
                      Users need to complete at least 5 skill demonstrations for data to appear here.
                    </p>
                    <Link href="/test-data">
                      <Button className="mt-4">
                        Generate Test User Data
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userIds.map(userId => {
                      const stats = userStats.get(userId)
                      return (
                        <Link key={userId} href={`/admin/skills?userId=${userId}`}>
                          <div className="block p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-500 transition group">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold text-lg">
                                    {formatUserIdShort(userId)}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    ({formatUserIdRelative(userId)})
                                  </span>
                                  {stats && (
                                    <Badge variant="outline" className="gap-1">
                                      <Award className="w-3 h-3" />
                                      {stats.milestones} milestones
                                    </Badge>
                                  )}
                                </div>

                                {stats && (
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-500">Demonstrations</p>
                                      <p className="font-medium text-blue-600">
                                        {stats.totalDemonstrations}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Most Demonstrated</p>
                                      <p className="font-medium capitalize">
                                        {stats.topSkill[0].replace(/([A-Z])/g, ' $1').trim()} ({stats.topSkill[1].length}x)
                                      </p>
                                    </div>
                                    {stats.topCareer && (
                                      <div>
                                        <p className="text-gray-500">Top Career Match</p>
                                        <p className="font-medium text-green-600">
                                          {Math.round(stats.topCareer.matchScore * 100)}%
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 group-hover:bg-blue-50"
                              >
                                View Journey
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LIVE CHOICES TAB (EXISTING) */}
          <TabsContent value="choices" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Choice Management</CardTitle>
                <CardDescription>
                  Review and validate AI-generated choices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChoiceReviewTrigger />
              </CardContent>
            </Card>

            <div className="bg-white rounded-lg border p-4 mt-4">
              <p className="text-sm text-green-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Content validation runs automatically when players load the game
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

/**
 * Urgent Student Card Component
 * Glass Box design: Narrative is the hero element
 */
function UrgentStudentCard({ student }: { student: UrgentStudent }) {
  const urgencyColors = {
    critical: {
      border: 'border-l-red-500',
      bg: 'bg-red-50',
      badge: 'bg-red-100 text-red-800',
      icon: '🔴'
    },
    high: {
      border: 'border-l-orange-500',
      bg: 'bg-orange-50',
      badge: 'bg-orange-100 text-orange-800',
      icon: '🟠'
    },
    medium: {
      border: 'border-l-yellow-500',
      bg: 'bg-yellow-50',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: '🟡'
    },
    low: {
      border: 'border-l-green-500',
      bg: 'bg-green-50',
      badge: 'bg-green-100 text-green-800',
      icon: '🟢'
    },
    pending: {
      border: 'border-l-gray-500',
      bg: 'bg-gray-50',
      badge: 'bg-gray-100 text-gray-800',
      icon: '⏳'
    }
  }

  const colors = urgencyColors[student.urgencyLevel || 'pending']
  const percentage = Math.round((student.urgencyScore || 0) * 100)

  return (
    <div className={`border-l-4 ${colors.border} ${colors.bg} rounded-lg p-6`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{colors.icon}</span>
            <div>
              <Link href={`/admin/skills?userId=${student.userId}`}>
                <h3 className="font-semibold text-lg hover:text-blue-600 hover:underline">
                  Student: {formatUserIdShort(student.userId)}
                </h3>
              </Link>
              <p className="text-sm text-gray-600">
                Last active: {formatUserIdRelative(student.lastActivity || student.userId)}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
          <Badge className={colors.badge}>
            {(student.urgencyLevel || 'pending').toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* NARRATIVE BOX - The Glass Box Hero Element */}
      <div className="my-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <p className="text-sm italic text-gray-700 leading-relaxed">
          {student.urgencyNarrative || "No narrative generated yet."}
        </p>
      </div>

      {/* Contributing Factors */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-semibold text-gray-700">Contributing Factors:</h4>
        <FactorBar label="Disengagement" value={student.disengagementScore || 0} />
        <FactorBar label="Confusion" value={student.confusionScore || 0} />
        <FactorBar label="Stress" value={student.stressScore || 0} />
        <FactorBar label="Isolation" value={student.isolationScore || 0} />
      </div>

      {/* Activity Summary */}
      <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t">
        <span>{student.totalChoices || 0} choices</span>
        <span>{student.uniqueScenesVisited || 0} scenes</span>
        <span>{student.relationshipsFormed || 0} relationships</span>
      </div>
    </div>
  )
}

/**
 * Factor Bar Component
 * Visual representation of urgency contributing factors
 */
function FactorBar({ label, value }: { label: string; value: number }) {
  const percentage = Math.round(value * 100)
  const color = value >= 0.7 ? 'bg-red-500' : value >= 0.5 ? 'bg-orange-500' : 'bg-gray-400'

  return (
    <div className="flex items-center gap-2">
      <span className="w-32 text-sm text-gray-600">{label}:</span>
      <div className="flex-1 bg-gray-200 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-12 text-sm text-gray-700 text-right">{percentage}%</span>
    </div>
  )
}
