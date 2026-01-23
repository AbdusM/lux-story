'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { SamuelQuotesSection } from './SamuelQuotesSection'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { GameErrorBoundary } from '@/components/GameErrorBoundary'

interface SkillEvidence {
  uniqueSkills: number
  hasRealData: boolean
  totalDemonstrations: number
  skillBreakdown?: Array<{ skill: string; demonstrations: number }>
}

interface CareerReadiness {
  exploredCareers: number
  hasRealData: boolean
  topMatch?: {
    career_name: string
    match_score: number
    readiness_level: string
  }
  birminghamOpportunities?: unknown[]
}

interface PatternRecognition {
  hasRealData: boolean
  totalChoices: number
  patternConsistency: number
  behavioralTrends?: string[]
}

interface TimeInvestment {
  hasRealData: boolean
  totalDays: number
  averageDemosPerDay: number
  consistencyScore: number
}

interface RelationshipFramework {
  hasRealData: boolean
  totalRelationships: number
  averageTrust: number
  relationshipDetails?: Array<{ character: string; trust: number }>
}

interface BehavioralConsistency {
  hasRealData: boolean
  focusScore: number
  explorationScore: number
  platformAlignment: number
  topThreeSkills: Array<{ count: number }>
}

interface EvidenceData {
  frameworks: {
    skillEvidence: SkillEvidence
    careerReadiness: CareerReadiness
    patternRecognition: PatternRecognition
    timeInvestment: TimeInvestment
    relationshipFramework: RelationshipFramework
    behavioralConsistency: BehavioralConsistency
  }
}

interface EvidenceSectionProps {
  userId: string
  profile: SkillProfile
  adminViewMode: 'family' | 'research'
}

// Helper component for data source indicators
function DataSourceBadge({
  hasRealData,
  minDemonstrations,
  actualDemonstrations
}: {
  hasRealData: boolean
  minDemonstrations: number
  actualDemonstrations: number
}) {
  if (hasRealData && actualDemonstrations >= minDemonstrations) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
        ✓ Real Data ({actualDemonstrations} demos)
      </Badge>
    )
  } else if (actualDemonstrations >= Math.floor(minDemonstrations / 2)) {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
        ⚠ Partial ({actualDemonstrations}/{minDemonstrations} demos)
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300 text-xs">
        ⊗ Mock Data ({actualDemonstrations}/{minDemonstrations} demos)
      </Badge>
    )
  }
}

export function EvidenceSection({ userId, profile, adminViewMode }: EvidenceSectionProps) {
  const user = profile // Alias for consistency with original code
  const [evidenceData, setEvidenceData] = useState<EvidenceData | null>(null)
  const [evidenceLoading, setEvidenceLoading] = useState(false)
  const [evidenceError, setEvidenceError] = useState<string | null>(null)

  // Fetch Evidence frameworks data
  useEffect(() => {
    const fetchEvidenceData = async () => {
      setEvidenceLoading(true)
      setEvidenceError(null)

      try {
        const response = await fetch(`/api/admin/evidence/${userId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch evidence data')
        }

        const data = await response.json()
        setEvidenceData(data)
      } catch (error) {
        console.error('Error fetching evidence data:', error)
        setEvidenceError('Unable to load evidence frameworks')
      } finally {
        setEvidenceLoading(false)
      }
    }

    if (userId) {
      fetchEvidenceData()
    }
  }, [userId])

  return (
    <GameErrorBoundary componentName="EvidenceSection">
    <div className="space-y-4">
      {/* DATA SOURCE INDICATOR - Sticky positioning */}
      <div className="sticky top-0 z-10">
        <Alert className={
          user.totalDemonstrations >= 10 ? "bg-blue-50 border-blue-400" :
          user.totalDemonstrations >= 5 ? "bg-yellow-50 border-yellow-400" :
          "bg-gray-50 border-gray-400"
        }>
          <AlertCircle className={`h-4 w-4 ${
            user.totalDemonstrations >= 10 ? "text-blue-600" :
            user.totalDemonstrations >= 5 ? "text-yellow-600" :
            "text-gray-600"
          }`} />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Your Progress:</strong>{" "}
                {user.totalDemonstrations >= 10 ? (
                  <span className="text-blue-700">
                    Strong Foundation ({user.totalDemonstrations} choices aligned with skills)
                  </span>
                ) : user.totalDemonstrations >= 5 ? (
                  <span className="text-yellow-700">
                    Building Skills ({user.totalDemonstrations} choices aligned with skills - keep going for deeper insights)
                  </span>
                ) : (
                  <span className="text-gray-700">
                    Getting Started ({user.totalDemonstrations} choices aligned with skills - explore more to unlock insights)
                  </span>
                )}
              </div>
              {user.totalDemonstrations < 10 && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Sample Insights Below
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Your Growth Insights</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Evidence of your skills and progress through your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loading/Error States */}
          {evidenceLoading ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 mx-auto animate-spin mb-2" />
              <p className="text-sm sm:text-base">Loading your insights...</p>
            </div>
          ) : evidenceError ? (
            <Alert className="bg-red-50 border-red-400">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>Error:</strong> {evidenceError}
              </AlertDescription>
            </Alert>
          ) : !evidenceData || !evidenceData.frameworks ? (
            <div className="text-center py-12">
              {adminViewMode === 'family' ? (
                <div className="space-y-3">
                  <p className="text-2xl">📊</p>
                  <p className="text-lg font-medium text-gray-700">
                    Building your evidence!
                  </p>
                  <p className="text-sm text-gray-600">
                    Frameworks become more accurate as you make more choices (need 5+ demonstrations).
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Insufficient sample size for statistical significance
                  </p>
                  <p className="text-xs text-gray-600">
                    Minimum threshold: 5 choices aligned with skills.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Framework 1: Skill Evidence */}
              <Card className="p-3 sm:p-4">
                <CardHeader className="p-0 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm sm:text-base">Your Skill Development</p>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                        {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default" className="text-xs">{Math.max(0, evidenceData.frameworks.skillEvidence.uniqueSkills)} Skills Tracked</Badge>
                      <DataSourceBadge
                        hasRealData={evidenceData.frameworks.skillEvidence.hasRealData}
                        minDemonstrations={10}
                        actualDemonstrations={evidenceData.frameworks.skillEvidence.totalDemonstrations}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {adminViewMode === 'family' ? (
                      <span><strong>What this means:</strong> Every time you make a choice in your journey, we track what skills your choice aligns with (like problem-solving or creativity). This shows real evidence of your growing abilities.</span>
                    ) : (
                      <span><strong>Framework:</strong> Tracked choices aligned with skills showing concrete evidence of capability development.</span>
                    )}
                  </p>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <p className="font-medium mb-2 text-sm sm:text-base">Your Progress:</p>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p>• Total Choices Aligned with Skills: <strong>{Math.max(0, evidenceData.frameworks.skillEvidence.totalDemonstrations)}</strong></p>
                      <p>• Unique Skills: <strong>{Math.max(0, evidenceData.frameworks.skillEvidence.uniqueSkills)}</strong></p>
                      {evidenceData.frameworks.skillEvidence.skillBreakdown?.slice(0, 3).map((skill) => (
                        <p key={skill.skill}>
                          • {skill.skill || 'Unknown Skill'}: {Math.max(0, skill.demonstrations || 0)} choices aligned
                        </p>
                      )) || (
                        adminViewMode === 'family' ? (
                          <p className="text-gray-600">• Keep exploring to discover your skills!</p>
                        ) : (
                          <p className="text-gray-600">• Skill breakdown pending (requires ≥3 choices aligned with skills)</p>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Framework 2: Career Readiness */}
              <Card className="p-3 sm:p-4">
                <CardHeader className="p-0 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm sm:text-base">Your Career Exploration</p>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                        {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default" className="text-xs">{Math.max(0, evidenceData.frameworks.careerReadiness.exploredCareers)} Careers Explored</Badge>
                      <DataSourceBadge
                        hasRealData={evidenceData.frameworks.careerReadiness.hasRealData}
                        minDemonstrations={1}
                        actualDemonstrations={evidenceData.frameworks.careerReadiness.exploredCareers}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {adminViewMode === 'family' ? (
                      <span><strong>What this means:</strong> We track which careers you explore and how well your current skills match each one. This helps you see where you're headed and what you need to get there.</span>
                    ) : (
                      <span><strong>Framework:</strong> Career exploration and match quality showing pathway clarity.</span>
                    )}
                  </p>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <p className="font-medium mb-2 text-sm sm:text-base">Your Career Progress:</p>
                    <div className="space-y-2 text-xs sm:text-sm">
                      {evidenceData.frameworks.careerReadiness.topMatch ? (
                        <>
                          <p>• Top Match: <strong>{evidenceData.frameworks.careerReadiness.topMatch.career_name}</strong></p>
                          <p>• Match Score: <strong>
                            {adminViewMode === 'family'
                              ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.careerReadiness.topMatch.match_score || 0) * 100)))}% fit with your skills`
                              : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.careerReadiness.topMatch.match_score || 0) * 100)))}% (skills + education + local factors)`
                            }
                          </strong></p>
                          <p>• Readiness: <strong>{evidenceData.frameworks.careerReadiness.topMatch.readiness_level}</strong></p>
                        </>
                      ) : (
                        <p>• Discovering career paths - keep exploring!</p>
                      )}
                      <p>• Birmingham Opportunities: <strong>{Math.max(0, evidenceData.frameworks.careerReadiness.birminghamOpportunities?.length || 0)}</strong></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Framework 3: Pattern Recognition */}
              <Card className="p-3 sm:p-4">
                <CardHeader className="p-0 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm sm:text-base">Your Decision Patterns</p>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                        {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default" className="text-xs">Behavioral Analysis</Badge>
                      <DataSourceBadge
                        hasRealData={evidenceData.frameworks.patternRecognition.hasRealData}
                        minDemonstrations={15}
                        actualDemonstrations={evidenceData.frameworks.patternRecognition.totalChoices}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {adminViewMode === 'family' ? (
                      <span><strong>What this means:</strong> We look for patterns in your choices. Are you consistently helping others? Do you prefer solving problems alone or with others? These patterns reveal your natural strengths.</span>
                    ) : (
                      <span><strong>Framework:</strong> Consistency and progression patterns in choice behavior.</span>
                    )}
                  </p>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <p className="font-medium mb-2 text-sm sm:text-base">Your Patterns:</p>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p>• Pattern Consistency: <strong>
                        {adminViewMode === 'family'
                          ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.patternRecognition.patternConsistency || 0) * 100)))}% - How steady your choices are`
                          : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.patternRecognition.patternConsistency || 0) * 100)))}% (behavioral trend reliability)`
                        }
                      </strong></p>
                      <p>• Total Choices: <strong>{Math.max(0, evidenceData.frameworks.patternRecognition.totalChoices)}</strong></p>
                      {evidenceData.frameworks.patternRecognition.behavioralTrends?.map((trend: string, i: number) => (
                        <p key={i}>• {trend || 'Pattern analysis in progress'}</p>
                      )) || <p>• No behavioral patterns identified yet</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Framework 4: Time Investment */}
              <Card className="p-3 sm:p-4">
                <CardHeader className="p-0 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm sm:text-base">Your Engagement Journey</p>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                        {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default" className="text-xs">Engagement Tracking</Badge>
                      <DataSourceBadge
                        hasRealData={evidenceData.frameworks.timeInvestment.hasRealData}
                        minDemonstrations={10}
                        actualDemonstrations={evidenceData.frameworks.timeInvestment.totalDays}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {adminViewMode === 'family' ? (
                      <span><strong>What this means:</strong> We track how often you use the tool and whether you're staying engaged. Consistent engagement shows you're actively thinking about your future.</span>
                    ) : (
                      <span><strong>Framework:</strong> Sustained engagement and consistency over time.</span>
                    )}
                  </p>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <p className="font-medium mb-2 text-sm sm:text-base">Your Engagement:</p>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p>• Days Active: <strong>{Math.max(0, evidenceData.frameworks.timeInvestment.totalDays)}</strong></p>
                      <p>• Avg Demos/Day: <strong>{Math.max(0, evidenceData.frameworks.timeInvestment.averageDemosPerDay).toFixed(1)}</strong></p>
                      <p>• Consistency Score: <strong>
                        {adminViewMode === 'family'
                          ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.timeInvestment.consistencyScore || 0) * 100)))}% - How regularly you engage`
                          : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.timeInvestment.consistencyScore || 0) * 100)))}% (engagement regularity across ${Math.max(0, evidenceData.frameworks.timeInvestment.totalDays)} days)`
                        }
                      </strong></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Framework 5: Relationship Framework */}
              <Card className="p-3 sm:p-4">
                <CardHeader className="p-0 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm sm:text-base">Your Relationships</p>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                        {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default" className="text-xs">{Math.max(0, evidenceData.frameworks.relationshipFramework.totalRelationships)} Relationships</Badge>
                      <DataSourceBadge
                        hasRealData={evidenceData.frameworks.relationshipFramework.hasRealData}
                        minDemonstrations={1}
                        actualDemonstrations={evidenceData.frameworks.relationshipFramework.totalRelationships}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {adminViewMode === 'family' ? (
                      <span><strong>What this means:</strong> You build relationships with characters in your journey (like Maya or Samuel). How you interact shows your social skills and emotional intelligence.</span>
                    ) : (
                      <span><strong>Framework:</strong> Social-emotional learning through character relationships.</span>
                    )}
                  </p>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <p className="font-medium mb-2 text-sm sm:text-base">Your Relationships:</p>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p>• Average Trust: <strong>{Math.max(0, Math.min(10, evidenceData.frameworks.relationshipFramework.averageTrust)).toFixed(1)}/10</strong></p>
                      {evidenceData.frameworks.relationshipFramework.relationshipDetails?.slice(0, 3).map((rel) => (
                        <p key={rel.character}>• {rel.character || 'Unknown Character'}: Trust {Math.max(0, Math.min(10, rel.trust || 0))}/10</p>
                      )) || <p>• No relationship data available yet</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Framework 6: Behavioral Consistency */}
              <Card className="p-3 sm:p-4">
                <CardHeader className="p-0 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm sm:text-base">Your Learning Style</p>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                        {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="default" className="text-xs">Focus Analysis</Badge>
                      <DataSourceBadge
                        hasRealData={evidenceData.frameworks.behavioralConsistency.hasRealData}
                        minDemonstrations={20}
                        actualDemonstrations={evidenceData.frameworks.behavioralConsistency.topThreeSkills.reduce((sum, s) => sum + s.count, 0)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {adminViewMode === 'family' ? (
                      <span><strong>What this means:</strong> We check if you focus deeply on a few skills or explore many different ones. Both approaches are valid - this helps you understand your style.</span>
                    ) : (
                      <span><strong>Framework:</strong> Focus vs exploration balance analysis.</span>
                    )}
                  </p>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <p className="font-medium mb-2 text-sm sm:text-base">Your Learning Style:</p>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p>• Focus Score: <strong>
                        {adminViewMode === 'family'
                          ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.behavioralConsistency.focusScore || 0) * 100)))}% - Deep diving into skills`
                          : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.behavioralConsistency.focusScore || 0) * 100)))}% (depth over breadth preference)`
                        }
                      </strong></p>
                      <p>• Exploration Score: <strong>
                        {adminViewMode === 'family'
                          ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.behavioralConsistency.explorationScore || 0) * 100)))}% - Trying new things`
                          : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.behavioralConsistency.explorationScore || 0) * 100)))}% (breadth over depth preference)`
                        }
                      </strong></p>
                      <p>• Platform Alignment: <strong>{Math.max(0, evidenceData.frameworks.behavioralConsistency.platformAlignment)}</strong> platforms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>

      {/* Samuel's Wisdom Section */}
      <SamuelQuotesSection
        quotes={profile.samuelQuotes || []}
        adminViewMode={adminViewMode}
        userName={user.userName || 'Student'}
      />

      {/* Scientific Literature Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Research Foundation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs sm:text-sm text-muted-foreground">
          <p className="font-semibold text-slate-900 mb-2">Core Frameworks</p>
          <p>• <strong>WEF 2030 Skills:</strong> World Economic Forum (2023). Future of Jobs Report 2023</p>
          <p>• <strong>Career Theory:</strong> Holland, J. L. (1997). Making Vocational Choices</p>
          <p>• <strong>Identity Development:</strong> Erikson, E. H. (1968). Identity: Youth and Crisis</p>
          <p>• <strong>Flow Theory:</strong> Csíkszentmihályi, M. (1990). Flow: The Psychology of Optimal Experience</p>
          <p>• <strong>Self-Efficacy:</strong> Bandura, A. (1986). Social Foundations of Thought and Action</p>
          <p>• <strong>Evidence Assessment:</strong> Messick, S. (1995). Validity of psychological assessment</p>
          <p>• <strong>Narrative Assessment:</strong> McAdams, D. P. (2001). Psychology of life stories</p>
          <p>• <strong>Birmingham Context:</strong> AL Dept of Labor (2023). Birmingham Labor Market Report</p>

          <p className="font-semibold text-slate-900 mt-4 mb-2">Supporting Research</p>
          <p>• <strong>Cognitive Load:</strong> Sweller, J. (1988). Cognitive load during problem solving</p>
          <p>• <strong>Self-Determination:</strong> Deci, E. L., & Ryan, R. M. (2000). Self-determination theory</p>
          <p>• <strong>Limbic Learning:</strong> Immordino-Yang & Damasio (2007). We feel, therefore we learn</p>
        </CardContent>
      </Card>

      {/* Navigation suggestion */}
      <Link href={`/admin/${userId}/gaps`}>
        <Button variant="ghost" className="w-full justify-center gap-2 mt-6 min-h-[44px]">
          Next: View Skill Gaps
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
    </GameErrorBoundary>
  )
}
