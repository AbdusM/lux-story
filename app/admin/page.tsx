'use client'

// Agent 7: Admin Dashboard Design System CSS (Issues 1A-1C, 2A-2B, 3A-3C, 39, 32)
import '@/styles/admin-dashboard.css'

import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getAllUserIds, loadSkillProfile } from '@/lib/skill-profile-adapter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Users, TrendingUp, Award, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react'
import type { UrgentStudent } from '@/lib/types/admin'
import { formatUserIdShort, formatUserIdRelative } from '@/lib/format-user-id'

// PERFORMANCE FIX: Code-split heavy components to reduce initial bundle size
const ChoiceReviewTrigger = dynamic(
  () => import('@/components/ChoiceReviewPanel').then(mod => ({ default: mod.ChoiceReviewTrigger })),
  {
    loading: () => (
      <div className="text-center py-8 text-gray-500">
        Loading choice review panel...
      </div>
    ),
    ssr: false
  }
)

/**
 * Admin Dashboard
 * Unified interface for urgency triage, skills analytics, and live choice review
 */
export default function AdminPage() {
  console.log('[Admin] Component rendering...')
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('journeys')

  // Student Journeys state (existing)
  const [userIds, setUserIds] = useState<string[]>([])
  const [userStats, setUserStats] = useState<Map<string, {
    totalDemonstrations: number
    topSkill: [string, unknown[]]
    topCareer?: { matchScore: number }
    milestones: number
  }>>(new Map())
  const [journeysLoading, setJourneysLoading] = useState(true)

  // Urgency Triage state (NEW)
  const [urgentStudents, setUrgentStudents] = useState<UrgentStudent[]>([])
  const [urgencyLoading, setUrgencyLoading] = useState(true)
  const [recalculating, setRecalculating] = useState(false)
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'critical' | 'high' | 'all-students'>('all')

  // Agent 9: Environment validation warning
  const [dbHealthy, setDbHealthy] = useState(true)

  // Client-side only mounting check
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load student journeys (updated to use Supabase with batch loading)
  useEffect(() => {
    if (!mounted) return // Skip during SSR/SSG

    const loadUserData = async () => {
      console.log('[Admin] Starting to load user data...')
      try {
        console.log('[Admin] Calling getAllUserIds()...')
        const ids = await getAllUserIds()
        console.log('[Admin] getAllUserIds() returned:', ids)

        // Sort by recency (newest first) - user IDs contain timestamps
        const sortedIds = ids.sort((a, b) => {
          // Extract timestamp from user ID (format: player_TIMESTAMP)
          const timestampA = a.match(/player_(\d+)/)?.[1] || '0'
          const timestampB = b.match(/player_(\d+)/)?.[1] || '0'
          return parseInt(timestampB) - parseInt(timestampA) // Descending order (newest first)
        })
        console.log('[Admin] Sorted user IDs:', sortedIds)
        setUserIds(sortedIds)

        // PERFORMANCE FIX: Batch load all profiles instead of sequential N+1 queries
        console.log('[Admin] Batch loading profiles for', ids.length, 'users')
        const profilePromises = ids.map(userId => loadSkillProfile(userId))
        const profiles = await Promise.all(profilePromises)

        const stats = new Map()
        profiles.forEach((profile, index) => {
          if (profile) {
            const topSkill = Object.entries(profile.skillDemonstrations)
              .sort(([, a], [, b]) => b.length - a.length)[0] || ['none', []]

            stats.set(ids[index], {
              totalDemonstrations: profile.totalDemonstrations,
              topSkill,
              topCareer: profile.careerMatches[0],
              milestones: profile.milestones.length
            })
          }
        })

        console.log('[Admin] User stats loaded via batch:', stats.size, 'profiles')
        setUserStats(stats)
        setJourneysLoading(false)
        console.log('[Admin] User data loading complete')
      } catch (error) {
        console.error('[Admin] Failed to load user data:', error)
        setJourneysLoading(false)
      }
    }

    loadUserData()
  }, [mounted])

  // Load urgent students (NEW)
  useEffect(() => {
    if (!mounted) return // Skip during SSR/SSG
    fetchUrgentStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urgencyFilter, mounted])

  // Check database health on mount
  useEffect(() => {
    if (!mounted) return // Skip during SSR/SSG

    const checkDbHealth = async () => {
      try {
        const response = await fetch('/api/admin-proxy/urgency?limit=1')
        if (!response.ok && response.status === 503) {
          setDbHealthy(false)
        }
      } catch (error) {
        console.error('DB health check failed:', error)
        setDbHealthy(false)
      }
    }

    checkDbHealth()
  }, [mounted])

  // PERFORMANCE FIX: Memoize callbacks to prevent unnecessary re-renders
  const fetchUrgentStudents = useCallback(async () => {
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
  }, [urgencyFilter])

  const triggerRecalculation = useCallback(async () => {
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
  }, [fetchUrgentStudents])

  // PERFORMANCE FIX: Memoize sorted user IDs to avoid re-sorting on every render
  const sortedUserIds = useMemo(() => {
    return userIds.sort((a, b) => {
      const timestampA = a.match(/player_(\d+)/)?.[1] || '0'
      const timestampB = b.match(/player_(\d+)/)?.[1] || '0'
      return parseInt(timestampB) - parseInt(timestampA)
    })
  }, [userIds])

  console.log('[Admin] About to render...')

  // Show loading state during SSR/initial mount with WCAG accessibility
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center min-h-[600px]">
          <div
            className="text-center space-y-4 fade-in"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
              aria-label="Loading spinner"
            />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">Loading Admin Dashboard...</p>
              <p className="text-sm text-gray-600">Initializing student analytics</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="admin-page-title admin-text-primary mb-2">
                Grand Central Terminus Admin
              </h1>
              <p className="admin-body-text admin-text-secondary">
                Student Urgency Triage, Skills Analytics & Live Choice Review
              </p>
              {/* Debug info - only shown in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mt-2">
                  Debug: activeTab={activeTab}, userIds.length={userIds.length}, journeysLoading={journeysLoading.toString()}
                </div>
              )}
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Game
              </Button>
            </Link>
          </div>
        </div>

        {/* Database Health Warning Banner */}
        {!dbHealthy && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Database Not Configured</AlertTitle>
            <AlertDescription>
              Supabase environment variables are missing. Check .env.local configuration.
              Using local data only (no sync).
            </AlertDescription>
          </Alert>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="journeys" className="gap-2">
              <Users className="w-4 h-4" />
              Student Journeys
            </TabsTrigger>
            <TabsTrigger value="choices" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Live Choices
            </TabsTrigger>
            <TabsTrigger value="urgency" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Student Triage
            </TabsTrigger>
          </TabsList>

          {/* STUDENT JOURNEYS TAB (EXISTING) */}
          <TabsContent value="journeys" className="mt-6 admin-content-fade-in">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="admin-tab-title admin-text-primary flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Skill Journeys
                    </CardTitle>
                    <CardDescription className="admin-body-text admin-text-secondary">
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
                  <div
                    className="flex items-center justify-center py-12"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <div className="text-center space-y-4">
                      <div
                        className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"
                        aria-label="Loading spinner"
                      />
                      <p className="text-sm text-gray-600">Loading user data...</p>
                    </div>
                  </div>
                ) : userIds.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="space-y-3">
                      <p className="text-2xl">🚀</p>
                      <p className="text-lg font-medium text-gray-700">
                        Ready for students!
                      </p>
                      <p className="text-sm text-gray-600">
                        User journeys appear after students start their career exploration.
                      </p>
                    </div>
                    <Link href="/test-data">
                      <Button className="mt-4">
                        Generate Test User Data
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedUserIds.map(userId => {
                      const stats = userStats.get(userId)
                      return (
                        <UserCard key={userId} userId={userId} stats={stats} />
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LIVE CHOICES TAB (EXISTING) */}
          <TabsContent value="choices" className="mt-6 admin-content-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="admin-tab-title admin-text-primary">Live Choice Management</CardTitle>
                <CardDescription className="admin-body-text admin-text-secondary">
                  Review and validate AI-generated choices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChoiceReviewTrigger />
              </CardContent>
            </Card>

            <div className="bg-white rounded-lg border p-4 mt-4">
              <p className="admin-body-text admin-urgency-low flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Content validation runs automatically when players load the game
              </p>
            </div>
          </TabsContent>

          {/* URGENCY TRIAGE TAB (NEW) */}
          <TabsContent value="urgency" className="mt-6 space-y-4 admin-content-fade-in">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="admin-tab-title admin-text-primary flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Student Intervention Priority
                    </CardTitle>
                    <CardDescription className="admin-body-text admin-text-secondary">
                      Glass Box urgency scoring with transparent narrative justifications
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* shadcn Select Component - Better accessibility & UX */}
                    <Select
                      value={urgencyFilter}
                      onValueChange={(value) => setUrgencyFilter(value as 'all' | 'critical' | 'high' | 'all-students')}
                    >
                      <SelectTrigger className="w-[280px] h-10">
                        <SelectValue placeholder="Filter students by urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Urgent Students</SelectItem>
                        <SelectItem value="all-students">📊 All Students (includes non-urgent)</SelectItem>
                        <SelectItem value="critical">🔴 Critical Only</SelectItem>
                        <SelectItem value="high">🟠 High + Critical</SelectItem>
                      </SelectContent>
                    </Select>

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
                  <div
                    className="flex items-center justify-center py-12"
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <div className="text-center space-y-4">
                      <div
                        className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"
                        aria-label="Loading spinner"
                      />
                      <p className="text-sm text-gray-600">Loading urgent students...</p>
                    </div>
                  </div>
                ) : urgentStudents.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    {urgencyFilter === 'all-students' || urgencyFilter === 'all' ? (
                      <div className="space-y-3">
                        <p className="text-2xl">✅</p>
                        <p className="text-lg font-medium text-gray-700">
                          Great news - no urgent students!
                        </p>
                        <p className="text-sm text-gray-600">
                          Check back after students complete more scenes, or use "All Students" filter to see everyone.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-2xl">✅</p>
                        <p className="text-lg font-medium text-gray-700">
                          No {urgencyFilter} priority students
                        </p>
                        <p className="text-sm text-gray-600">
                          Try a different filter or run recalculation to update scores.
                        </p>
                      </div>
                    )}
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
        </Tabs>
      </div>
    </div>
  )
}

/**
 * PERFORMANCE FIX: Memoized User Card Component
 * Prevents re-rendering when parent updates
 */
const UserCard = memo(({ userId, stats }: {
  userId: string
  stats?: {
    totalDemonstrations: number
    topSkill: [string, unknown[]]
    topCareer?: { matchScore: number }
    milestones: number
  }
}) => {
  return (
    <Link href={`/admin/skills?userId=${userId}`}>
      <div className="block p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-500 transition group">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="admin-section-title admin-text-primary">
                {formatUserIdShort(userId)}
              </h3>
              <span className="admin-body-text admin-text-muted">
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
                  <p className="admin-body-text admin-text-secondary">Demonstrations</p>
                  <p className="admin-subsection-title admin-interactive">
                    {stats.totalDemonstrations}
                  </p>
                </div>
                <div>
                  <p className="admin-body-text admin-text-secondary">Most Demonstrated</p>
                  <p className="admin-subsection-title capitalize">
                    {stats.topSkill[0].replace(/([A-Z])/g, ' $1').trim()} ({stats.topSkill[1].length}x)
                  </p>
                </div>
                {stats.topCareer && (
                  <div>
                    <p className="admin-body-text admin-text-secondary">Top Career Match</p>
                    <p className="admin-subsection-title admin-urgency-low">
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
})

UserCard.displayName = 'UserCard'

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
                <h3 className="admin-section-title admin-text-primary hover:admin-interactive hover:underline">
                  Student: {formatUserIdShort(student.userId)}
                </h3>
              </Link>
              <p className="admin-body-text admin-text-secondary">
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
        <p className="admin-body-text italic admin-text-primary leading-relaxed">
          {student.urgencyNarrative || "No narrative generated yet."}
        </p>
      </div>

      {/* Contributing Factors */}
      <div className="space-y-2 mb-4">
        <h4 className="admin-subsection-title admin-text-primary">Contributing Factors:</h4>
        <FactorBar label="Disengagement" value={student.disengagementScore || 0} />
        <FactorBar label="Confusion" value={student.confusionScore || 0} />
        <FactorBar label="Stress" value={student.stressScore || 0} />
        <FactorBar label="Isolation" value={student.isolationScore || 0} />
      </div>

      {/* Activity Summary */}
      <div className="flex items-center gap-6 admin-body-text admin-text-secondary pt-4 border-t">
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
      <span className="w-32 admin-body-text admin-text-secondary">{label}:</span>
      <div className="flex-1 bg-gray-200 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-12 admin-body-text admin-text-primary text-right">{percentage}%</span>
    </div>
  )
}
