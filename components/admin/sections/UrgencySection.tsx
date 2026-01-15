'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react'
import { getUrgencyClasses } from '@/lib/admin-urgency-classes'
import { PermissionButton } from '@/components/admin/PermissionGate'
import { formatAdminDate, type ViewMode } from '@/lib/admin-date-formatting'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { InterventionTriggers } from '@/components/admin/InterventionTriggers'

interface UrgencySectionProps {
  userId: string
  profile: SkillProfile
  adminViewMode: 'family' | 'research'
}

interface UrgencyData {
  userId: string
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | null
  urgencyScore: number
  urgencyNarrative: string
  disengagementScore: number
  confusionScore: number
  stressScore: number
  isolationScore: number
  lastActivity: string
  totalChoices: number
  uniqueScenesVisited: number
  relationshipsFormed: number
}

export function UrgencySection({ userId, profile: _profile, adminViewMode }: UrgencySectionProps) {
  const [urgencyData, setUrgencyData] = useState<UrgencyData | null>(null)
  const [urgencyLoading, setUrgencyLoading] = useState(false)
  const [urgencyError, setUrgencyError] = useState<string | null>(null)
  const [recalculating, setRecalculating] = useState(false)

  useEffect(() => {
    const fetchUrgencyData = async () => {
      setUrgencyLoading(true)
      setUrgencyError(null)

      try {
        const response = await fetch(`/api/admin-proxy/urgency?userId=${encodeURIComponent(userId)}`)

        if (!response.ok) {
          throw new Error('Failed to fetch urgency data')
        }

        const data = await response.json()

        if (data.user) {
          setUrgencyData(data.user)
        } else if (data.students && Array.isArray(data.students)) {
          const student = data.students.find((s: UrgencyData) => s.userId === userId)
          setUrgencyData(student || null)
        } else {
          setUrgencyData(null)
        }
      } catch (error) {
        console.error('Error fetching urgency data:', error)
        setUrgencyError('Unable to load urgency data')
      } finally {
        setUrgencyLoading(false)
      }
    }

    if (userId) {
      fetchUrgencyData()
    }
  }, [userId])

  const handleRecalculate = async () => {
    setRecalculating(true)
    try {
      const response = await fetch('/api/admin-proxy/urgency', {
        method: 'POST'
      })

      if (response.ok) {
        const dataResponse = await fetch(`/api/admin-proxy/urgency?userId=${encodeURIComponent(userId)}`)

        if (dataResponse.ok) {
          const data = await dataResponse.json()
          if (data.user) {
            setUrgencyData(data.user)
          } else if (data.students && Array.isArray(data.students)) {
            const student = data.students.find((s: UrgencyData) => s.userId === userId)
            setUrgencyData(student || null)
          }
        }
      }
    } catch (error) {
      console.error('Recalculation failed:', error)
    } finally {
      setRecalculating(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Intervention Priority
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your intervention priority with transparent narrative justification
              </CardDescription>
            </div>
            <PermissionButton
              permission="recalculate_urgency"
              onClick={handleRecalculate}
              disabled={recalculating}
              className="gap-2 min-h-[44px] w-full sm:w-auto px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} />
              Recalculate
            </PermissionButton>
          </div>
        </CardHeader>
        <CardContent className="min-h-[280px]">
          {urgencyLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading urgency data...
            </div>
          ) : urgencyError ? (
            <div className="text-center py-12 text-red-500">
              {urgencyError}
            </div>
          ) : !urgencyData ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-gray-600 text-sm sm:text-base">No urgency data available for you yet.</p>
              <p className="text-sm text-gray-500">
                Click "Recalculate" to generate your urgency score.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Urgency Level Badge and Score */}
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${getUrgencyClasses(urgencyData.urgencyLevel).card}`}>
                <div>
                  <p className="text-sm sm:text-base text-gray-800 mb-2">Your Priority Level</p>
                  <Badge className={getUrgencyClasses(urgencyData.urgencyLevel).badge}>
                    {urgencyData.urgencyLevel?.toUpperCase() || 'PENDING'}
                  </Badge>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-sm sm:text-base text-gray-800 mb-2">
                    {adminViewMode === 'family' ? 'Attention Needed' : 'Your Priority Score'}
                  </p>
                  <p className={`text-2xl sm:text-3xl font-bold ${getUrgencyClasses(urgencyData.urgencyLevel).percentage}`}>
                    {adminViewMode === 'family'
                      ? `${urgencyData.urgencyLevel ? urgencyData.urgencyLevel.charAt(0).toUpperCase() + urgencyData.urgencyLevel.slice(1) : 'Pending'} (${Math.max(0, Math.min(100, Math.round((urgencyData.urgencyScore || 0) * 100)))}%)`
                      : `${Math.max(0, Math.min(100, Math.round((urgencyData.urgencyScore || 0) * 100)))}%`}
                  </p>
                </div>
              </div>

              {/* Glass Box Narrative */}
              <div className="p-4 sm:p-6 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Your Priority Explanation:</h4>
                <p className="text-sm sm:text-base italic text-gray-800 leading-relaxed">
                  {urgencyData.urgencyNarrative || "No narrative generated yet."}
                </p>
              </div>

              {/* MIVA 2.0 Intervention Triggers */}
              <InterventionTriggers profile={_profile} adminViewMode={adminViewMode} />

              {/* Contributing Factors */}
              <div className="space-y-4">
                <h4 className="text-sm sm:text-base font-semibold text-gray-800">Your Contributing Factors:</h4>

                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-medium text-sm sm:text-base">Disengagement</span>
                    <span className="text-gray-600 text-xs sm:text-sm">
                      {adminViewMode === 'family'
                        ? `Most important factor (${Math.max(0, Math.min(100, Math.round((urgencyData.disengagementScore || 0) * 100)))}%)`
                        : `40% weight • ${Math.max(0, Math.min(100, Math.round((urgencyData.disengagementScore || 0) * 100)))}%`}
                    </span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, (urgencyData.disengagementScore || 0) * 100))} className="h-3" />
                </div>

                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-medium text-sm sm:text-base">Confusion</span>
                    <span className="text-gray-600 text-xs sm:text-sm">
                      {adminViewMode === 'family'
                        ? `Career uncertainty (${Math.max(0, Math.min(100, Math.round((urgencyData.confusionScore || 0) * 100)))}%)`
                        : `30% weight • ${Math.max(0, Math.min(100, Math.round((urgencyData.confusionScore || 0) * 100)))}%`}
                    </span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, (urgencyData.confusionScore || 0) * 100))} className="h-3" />
                </div>

                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-medium text-sm sm:text-base">Stress</span>
                    <span className="text-gray-600 text-xs sm:text-sm">
                      {adminViewMode === 'family'
                        ? `Decision pressure (${Math.max(0, Math.min(100, Math.round((urgencyData.stressScore || 0) * 100)))}%)`
                        : `20% weight • ${Math.max(0, Math.min(100, Math.round((urgencyData.stressScore || 0) * 100)))}%`}
                    </span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, (urgencyData.stressScore || 0) * 100))} className="h-3" />
                </div>

                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-medium text-sm sm:text-base">Isolation</span>
                    <span className="text-gray-600 text-xs sm:text-sm">
                      {adminViewMode === 'family'
                        ? `Exploring alone (${Math.max(0, Math.min(100, Math.round((urgencyData.isolationScore || 0) * 100)))}%)`
                        : `10% weight • ${Math.max(0, Math.min(100, Math.round((urgencyData.isolationScore || 0) * 100)))}%`}
                    </span>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, (urgencyData.isolationScore || 0) * 100))} className="h-3" />
                </div>
              </div>

              {/* Activity Summary */}
              <div className="pt-4 border-t space-y-3">
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Activity Summary:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Last Active</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900">
                      {urgencyData.lastActivity ? formatAdminDate(urgencyData.lastActivity, 'urgency', adminViewMode as ViewMode) : 'No activity'}
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Choices</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{Math.max(0, urgencyData.totalChoices || 0)}</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Scenes Visited</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600">{Math.max(0, urgencyData.uniqueScenesVisited || 0)}</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Relationships</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{Math.max(0, urgencyData.relationshipsFormed || 0)}</p>
                  </div>
                </div>
              </div>

              {/* High/Critical Alert */}
              {urgencyData.urgencyLevel && ['high', 'critical'].includes(urgencyData.urgencyLevel) && (
                <div className="p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 text-sm sm:text-base">Support Available</h4>
                      <p className="text-sm sm:text-base text-red-700 mt-2 leading-relaxed">
                        You show {urgencyData.urgencyLevel} priority indicators.
                        Consider reaching out for support or guidance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation suggestion */}
      <Link href={`/admin/${userId}/skills`}>
        <Button variant="ghost" className="w-full justify-center gap-2 mt-6">
          Next: View Skills
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  )
}

