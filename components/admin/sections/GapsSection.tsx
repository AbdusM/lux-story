'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { SparklineTrend } from '@/components/admin/SparklineTrend'
import { formatAdminDateWithLabel, type ViewMode } from '@/lib/admin-date-formatting'
import type { SkillProfile, SkillGap } from '@/lib/skill-profile-adapter'
import { GameErrorBoundary } from '@/components/GameErrorBoundary'

interface SkillSummary {
  skill_name: string
  demonstration_count: number
  last_demonstrated: string
  latest_context?: string
  scenes_involved?: string[]
}

interface EvidenceData {
  skillSummaries?: SkillSummary[]
  careerExploration?: {
    totalExplorations: number
  }
}

interface GapsSectionProps {
  userId: string
  profile: SkillProfile
  adminViewMode: 'family' | 'research'
}

export function GapsSection({ userId, profile, adminViewMode }: GapsSectionProps) {
  const user = profile // Alias for consistency with original code
  const [evidenceData, setEvidenceData] = useState<EvidenceData | null>(null)
  const [evidenceLoading, setEvidenceLoading] = useState(false)

  // Fetch Evidence frameworks data for career exploration and skill summaries
  useEffect(() => {
    const fetchEvidenceData = async () => {
      setEvidenceLoading(true)

      try {
        const response = await fetch(`/api/admin/evidence/${userId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch evidence data')
        }

        const data = await response.json()
        setEvidenceData(data)
      } catch (error) {
        console.error('Error fetching evidence data:', error)
      } finally {
        setEvidenceLoading(false)
      }
    }

    if (userId) {
      fetchEvidenceData()
    }
  }, [userId])

  return (
    <GameErrorBoundary componentName="GapsSection">
    <div className="space-y-4">
      {/* NARRATIVE BRIDGE: Careers → Gaps */}
      {evidenceData?.careerExploration && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 sm:p-6 rounded-r">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {adminViewMode === 'family' ? (
              <>Looking at {evidenceData.careerExploration.totalExplorations} careers {user.userName}'s interested in, here's what to unlock next. Think: opportunities, not problems.</>
            ) : (
              <>Gap analysis for {evidenceData.careerExploration.totalExplorations} career targets. Priority = career impact × proficiency × development time.</>
            )}
          </p>
        </div>
      )}

      {/* Focus on These First - Priority Gaps */}
      {user.skillGaps && user.skillGaps.length > 0 && (
        <Alert className="border-orange-500 bg-orange-50">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <AlertDescription className="mt-2 space-y-3">
            <div className="flex items-baseline gap-3 mb-3">
              <p className="text-lg sm:text-xl font-semibold text-orange-900">Your Priority Skills to Develop</p>
              {user.skillGaps.length > 0 && (
                <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {user.skillGaps.length}
                </span>
              )}
            </div>
            {user.skillGaps
              .sort((a: SkillGap, b: SkillGap) => {
                const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
                return priorityOrder[b.priority] - priorityOrder[a.priority]
              })
              .slice(0, 3)
              .map((gap: SkillGap, idx: number) => (
                <div key={idx} className="border-l-4 border-orange-400 pl-3 sm:pl-4 p-3 sm:p-4 bg-orange-25 rounded-r-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-orange-900 capitalize text-sm sm:text-base">
                      {gap.skill?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown Skill'}
                    </div>
                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                      {gap.priority?.toUpperCase() || 'MEDIUM'}
                    </Badge>
                  </div>
                  <div className="text-sm sm:text-base text-orange-800 mt-1">
                    Try: Scene {12 + idx * 4} (Hospital Volunteer) or Scene {8 + idx * 3} (Maya Family Meeting)
                  </div>
                  <div className="text-xs sm:text-sm text-orange-700 mt-2">
                    📍 Birmingham: UAB Medicine Youth Mentorship Program
                  </div>
                </div>
              ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Show Evidence-based skill progression or message if no data */}
      {evidenceLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Loading skill development data...</p>
          </CardContent>
        </Card>
      ) : evidenceData && evidenceData.skillSummaries && evidenceData.skillSummaries.length > 0 ? (
        <Card>
          <CardHeader>
            {/* Personalized section header */}
            <CardTitle className="text-lg sm:text-xl">Your Skill Development Progress</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Choices aligned with skills from your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evidenceData.skillSummaries.map((skill, idx) => (
                <Card key={idx} className="p-3 sm:p-4">
                  <CardContent className="p-0 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-medium capitalize text-sm sm:text-base">
                        {skill.skill_name?.replace(/_/g, ' ') || `Skill ${idx + 1}`}
                      </span>
                      <Badge variant={(skill.demonstration_count || 0) >= 5 ? 'default' : 'secondary'} className="text-xs">
                        {Math.max(0, skill.demonstration_count || 0)} choices aligned
                      </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                      <span className="text-muted-foreground text-xs sm:text-sm">Progress:</span>
                      <Progress value={Math.max(0, Math.min(100, (skill.demonstration_count || 0) * 10))} className="flex-1 h-2 sm:h-3" />
                      <span className="font-medium text-xs sm:text-sm">{Math.max(0, skill.demonstration_count || 0)}/10</span>
                    </div>

                    {skill.last_demonstrated && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatAdminDateWithLabel(skill.last_demonstrated, 'activity', adminViewMode as ViewMode, 'Last aligned with this skill')}
                      </p>
                    )}

                    {(skill.demonstration_count || 0) < 5 && (
                      <p className="text-xs sm:text-sm text-amber-600 italic">
                        Keep making choices to develop this skill
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : user.skillGaps && user.skillGaps.length > 0 ? (
        <Card>
          <CardHeader>
            {/* Personalized section header */}
            <CardTitle className="text-lg sm:text-xl">Your Skill Development Priorities</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Skills to develop for your top career matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.skillGaps
                .sort((a: SkillGap, b: SkillGap) => {
                  const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
                  return priorityOrder[b.priority] - priorityOrder[a.priority]
                })
                .map((gap: SkillGap, idx: number) => (
                  <Card key={idx} className="p-3 sm:p-4">
                    <CardContent className="p-0 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize text-sm sm:text-base">
                            {gap.skill?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown Skill'}
                          </span>
                          {/* Sparkline Trend Indicator - Enhanced with tooltips */}
                          <SparklineTrend
                            current={gap.currentLevel}
                            target={gap.targetForTopCareers}
                            width={40}
                            height={12}
                            viewMode={adminViewMode}
                            skillName={gap.skill?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown Skill'}
                          />
                        </div>
                        <Badge variant={gap.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {gap.priority} priority
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                        <span className="text-muted-foreground text-xs sm:text-sm">
                          {adminViewMode === 'family' ? 'Where you are now:' : 'Your Current Level:'}
                        </span>
                        <Progress value={Math.max(0, Math.min(100, gap.currentLevel * 100))} className="flex-1 h-2 sm:h-3" />
                        <span className="font-medium text-xs sm:text-sm">
                          {adminViewMode === 'family'
                            ? `${Math.max(0, Math.min(100, Math.round(gap.currentLevel * 100)))}%`
                            : `${Math.max(0, Math.min(100, Math.round(gap.currentLevel * 100)))}% current proficiency`
                          }
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                        <span className="text-muted-foreground text-xs sm:text-sm">
                          {adminViewMode === 'family' ? 'Where you need to be:' : 'Your Target Level:'}
                        </span>
                        <div className="flex-1 bg-green-100 rounded-full h-2 sm:h-3">
                          <div className="bg-green-600 h-2 sm:h-3 rounded-full" style={{ width: '100%' }} />
                        </div>
                        <span className="font-medium text-xs sm:text-sm">
                          {adminViewMode === 'family'
                            ? `${Math.max(0, Math.min(100, Math.round(gap.targetForTopCareers * 100)))}%`
                            : `${Math.max(0, Math.min(100, Math.round(gap.targetForTopCareers * 100)))}% for top careers`
                          }
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground italic">
                        {gap.developmentPath}
                      </p>

                      {/* Scene-specific development paths */}
                      <div className="text-sm sm:text-base text-gray-600 mt-2 bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <strong>Your Development Path:</strong> Try Scene {Math.floor(Math.random() * 15) + 1}:{' '}
                        {gap.skill?.toLowerCase().includes('communication') ? 'Maya Family Meeting' :
                         gap.skill?.toLowerCase().includes('technical') || gap.skill?.toLowerCase().includes('digital') ? 'Devon System Building' :
                         gap.skill?.toLowerCase().includes('leadership') ? 'Jordan Mentorship Panel' :
                         gap.skill?.toLowerCase().includes('emotional') || gap.skill?.toLowerCase().includes('empathy') ? 'Samuel Trust Building' :
                         'Healthcare Scenarios'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            {adminViewMode === 'family' ? (
              <div className="space-y-3">
                <p className="text-2xl">🎉</p>
                <p className="text-lg font-medium text-gray-700">
                  Looking strong!
                </p>
                <p className="text-sm text-gray-600">
                  No major skill gaps detected for top career matches.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Skill-to-career alignment optimal
                </p>
                <p className="text-xs text-gray-600">
                  Current competency profile meets requirements for identified career targets.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation suggestion */}
      <Link href={`/admin/${userId}/action`}>
        <Button variant="ghost" className="w-full justify-center gap-2 mt-6 min-h-[44px]">
          Next: View Action Plan
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
    </GameErrorBoundary>
  )
}
