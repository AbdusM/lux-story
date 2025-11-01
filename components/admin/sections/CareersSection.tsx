'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, Lightbulb, ChevronRight, ArrowRight } from 'lucide-react'

interface CareersSectionProps {
  userId: string
  profile: any // SkillProfile
  adminViewMode: 'family' | 'research'
}

export function CareersSection({ userId, profile, adminViewMode }: CareersSectionProps) {
  const user = profile // Alias for consistency with original code
  const [showMetRequirements, setShowMetRequirements] = useState(false)
  const [highlightedCareer, setHighlightedCareer] = useState<string | null>(null)
  const [evidenceData, setEvidenceData] = useState<any>(null)
  const [evidenceLoading, setEvidenceLoading] = useState(false)

  // Fetch Evidence frameworks data for career exploration
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

  // Cross-tab navigation to skills tab with highlighting
  const jumpToSkillsTab = (skillName: string) => {
    // In the new architecture, navigate to skills page with hash
    const skillId = skillName.toLowerCase().replace(/\s+/g, '-')
    window.location.href = `/admin/${userId}/skills#skill-${skillId}`
  }

  // Helper to get skill color based on demonstration count
  const getSkillGapColor = (gap: number, demoCount: number): string => {
    if (demoCount === 0) return 'text-red-600' // 0 demonstrations - critical gap
    if (demoCount <= 2) return 'text-yellow-600' // 1-2 demonstrations - developing
    return 'text-green-600' // 3+ demonstrations - strong
  }

  // Get directive readiness badge
  const getDirectiveBadge = (readiness: string, gapCount: number) => {
    if (readiness === 'near_ready' && gapCount === 0) {
      return <Badge className="bg-green-600 text-white">Strong Match!</Badge>
    }
    if (readiness === 'near_ready' || gapCount <= 1) {
      return <Badge className="bg-blue-600 text-white">Good Foundation</Badge>
    }
    return <Badge className="bg-orange-600 text-white">Build This Skill</Badge>
  }

  // Generate inline match explanation
  const getMatchExplanation = (score: number, gapSkills: [string, any][]) => {
    const gapNames = gapSkills.slice(0, 2).map(([skill]) =>
      skill.replace(/([A-Z])/g, ' $1').trim().toLowerCase()
    ).join(', ')

    // Fix: Ensure score is valid and consistent
    const validScore = Math.max(0, Math.min(100, Math.round(score * 100)))

    if (gapSkills.length === 0) {
      return `${validScore}% match - All requirements met`
    }
    if (gapSkills.length === 1) {
      return `${validScore}% match - Strong fit, needs ${gapNames}`
    }
    return `${validScore}% match - Solid base, developing ${gapNames}`
  }

  return (
    <div className="space-y-4">
      {/* NARRATIVE BRIDGE: Skills → Careers */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-r">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {adminViewMode === 'family' ? (
            <>{user.userName}'s shown {user.totalDemonstrations} skills—here's where they lead in Birmingham. Focus on 'Near Ready' careers first.</>
          ) : (
            <>{user.totalDemonstrations} choices aligned with skills → Birmingham labor market alignment. Match = skills (40%) + education (30%) + local (30%).</>
          )}
        </p>
      </div>

      {/* At a Glance Summary Card */}
      {user.careerMatches && user.careerMatches.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">
                  {user.careerMatches.length}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {adminViewMode === 'family' ? 'careers explored' : 'career matches'}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
                  {Math.round(user.careerMatches[0].matchScore * 100)}%
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {adminViewMode === 'family' ? 'top match score' : 'highest match'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {user.careerMatches[0].name}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {user.careerMatches[0].readiness === 'near_ready' ? '✓ Nearly Ready' :
                   user.careerMatches[0].readiness === 'skill_gaps' ? 'Building Skills' :
                   'Exploring'}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {adminViewMode === 'family' ? 'for your top career' : 'readiness status'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show Evidence-based career exploration or message if no data */}
      {evidenceLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Loading career exploration data...</p>
          </CardContent>
        </Card>
      ) : evidenceData && evidenceData.careerExploration ? (
        <Card>
          <CardHeader>
            {/* Personalized section header */}
            <CardTitle>Your Career Exploration Progress</CardTitle>
            <CardDescription>
              Paths explored: {evidenceData.careerExploration.totalExplorations} |
              Skills indicated by choices: {evidenceData.careerExploration.skillsDemonstrated}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evidenceData.careerExploration.paths?.map((path: any, idx: number) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 sm:pl-6 p-3 sm:p-4 bg-blue-50 rounded-r-lg">
                  <h3 className="font-semibold text-base sm:text-lg">{path.category || `Career Path ${idx + 1}`}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">{path.description || 'Exploring your career opportunities'}</p>
                  {path.opportunities && (
                    <div className="mt-3 text-xs sm:text-sm text-gray-500 bg-white p-2 rounded">
                      <strong>Your Birmingham opportunities:</strong> {path.opportunities.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : user.careerMatches && user.careerMatches.length > 0 ? (
        <>
        {user.careerMatches.map((career: any) => {
          // Separate skills into gaps and met requirements
          const gapSkills = Object.entries(career.requiredSkills).filter(([_, data]: [string, any]) => (data as any).gap > 0)
          const metSkills = Object.entries(career.requiredSkills).filter(([_, data]: [string, any]) => (data as any).gap === 0)

          return (
          <Card
            key={career.id}
            id={`career-${career.id}`}
            className={highlightedCareer === career.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
          >
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  {/* Improved typography hierarchy */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <CardTitle className="text-lg sm:text-xl">{career.name}</CardTitle>
                    <span className="text-2xl sm:text-3xl font-bold text-green-600">
                      {Math.round(career.matchScore * 100)}%
                    </span>
                  </div>
                  {/* Inline match explanation */}
                  <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                    {getMatchExplanation(career.matchScore, gapSkills)}
                  </p>
                </div>
                {/* Directive readiness badge */}
                <div className="flex-shrink-0">
                  {getDirectiveBadge(career.readiness, gapSkills.length)}
                </div>
              </div>
              <CardDescription className="text-sm sm:text-base mt-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span>${career.salaryRange[0].toLocaleString()} - ${career.salaryRange[1].toLocaleString()}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>
                    {adminViewMode === 'family'
                      ? `${career.localOpportunities.length} Birmingham employers (${Math.max(0, Math.min(100, Math.round(career.birminghamRelevance * 100)))}% local)`
                      : `${Math.max(0, Math.min(100, Math.round(career.birminghamRelevance * 100)))}% Birmingham relevance (${career.localOpportunities.length} local employers)`
                    }
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Skill gaps shown first */}
              {gapSkills.length > 0 && (
                <div>
                  <p className="text-sm sm:text-base font-medium mb-3">Skills to Develop:</p>
                  <div className="space-y-3">
                    {gapSkills
                      .sort((a: any, b: any) => (b[1] as any).gap - (a[1] as any).gap) // Sort by largest gap first
                      .map(([skill, data]: [string, any]) => {
                        // Color-coded by demonstration count
                        const demoCount = user.skillDemonstrations[skill]?.length || 0
                        const gapColor = getSkillGapColor((data as any).gap, demoCount)
                        const bgColor = demoCount === 0 ? 'bg-red-50' : demoCount <= 2 ? 'bg-yellow-50' : 'bg-green-50'

                        return (
                        <div key={skill} className={`space-y-2 p-3 sm:p-4 rounded-lg ${bgColor}`}>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            {/* Clickable skill names to jump to Skills tab */}
                            <button
                              onClick={() => jumpToSkillsTab(skill)}
                              className="capitalize font-medium text-sm sm:text-base text-left text-blue-600 hover:underline"
                            >
                              {skill.replace(/([A-Z])/g, ' $1').trim()}
                            </button>
                            <span className={`text-xs sm:text-sm ${gapColor}`}>
                              {adminViewMode === 'family'
                                ? `Need to develop (${Math.max(0, Math.min(100, Math.round((data as any).gap * 100)))}% gap, ${demoCount} shown)`
                                : `Gap: ${Math.max(0, Math.min(100, Math.round((data as any).gap * 100)))}% (${demoCount} demonstrations)`
                              }
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                              <div
                                className={`h-2 sm:h-3 rounded-full ${
                                  demoCount === 0 ? 'bg-red-500' : demoCount <= 2 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.max(0, Math.min(100, ((data as any).current / (data as any).required) * 100))}%` }}
                              />
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground w-16 sm:w-20 text-right">
                              {Math.max(0, Math.round((data as any).current * 100))}/{Math.max(1, Math.round((data as any).required * 100))}
                            </span>
                          </div>
                        </div>
                      )})}
                  </div>
                </div>
              )}

              {/* Met requirements collapsible - Mobile optimized */}
              {metSkills.length > 0 && (
                <div className="pt-3 border-t">
                  <button
                    onClick={() => setShowMetRequirements(!showMetRequirements)}
                    className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors min-h-[44px] w-full text-left"
                  >
                    <ChevronRight className={`w-5 h-5 transition-transform ${showMetRequirements ? 'rotate-90' : ''}`} />
                    <span>Your {metSkills.length} strengths</span>
                  </button>

                  {showMetRequirements && (
                    <div className="mt-3 space-y-2">
                      {metSkills.map(([skill, data]) => {
                        const demoCount = user.skillDemonstrations[skill]?.length || 0
                        return (
                          <div key={skill} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm bg-green-50 p-3 rounded-lg">
                            {/* Clickable skill names to jump to Skills tab */}
                            <button
                              onClick={() => jumpToSkillsTab(skill)}
                              className="capitalize font-medium text-left text-blue-600 hover:underline"
                            >
                              {skill.replace(/([A-Z])/g, ' $1').trim()}
                            </button>
                            <span className="text-green-600 font-medium">✓ Strong ({demoCount} demos)</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Education paths - Mobile optimized */}
              <div>
                <p className="text-sm sm:text-base font-medium mb-3">Education Pathways:</p>
                <div className="flex flex-wrap gap-2">
                  {career.educationPaths.map((path: string) => (
                    <Badge key={path} variant="secondary" className="text-xs sm:text-sm px-2 py-1">{path}</Badge>
                  ))}
                </div>
              </div>

              {/* Local opportunities - Mobile optimized */}
              <div>
                <p className="text-sm sm:text-base font-medium mb-3">Birmingham Employers:</p>
                <div className="flex flex-wrap gap-2">
                  {career.localOpportunities.map((opp: string) => (
                    <Badge key={opp} variant="outline" className="text-xs sm:text-sm px-2 py-1">{opp}</Badge>
                  ))}
                </div>
              </div>

              {/* Readiness - Mobile optimized */}
              <div className="pt-3 border-t">
                {career.readiness === 'near_ready' && (
                  <div className="flex items-start gap-3 text-sm sm:text-base p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-green-600 leading-relaxed">
                      <strong>You're Nearly Ready:</strong> Small skill gaps. Consider exploratory experiences.
                    </p>
                  </div>
                )}
                {career.readiness === 'skill_gaps' && (
                  <div className="flex items-start gap-3 text-sm sm:text-base p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-600 leading-relaxed">
                      <strong>Building Your Skills:</strong> Good foundation but needs development. See Gaps tab.
                    </p>
                  </div>
                )}
                {career.readiness === 'exploratory' && (
                  <div className="flex items-start gap-3 text-sm sm:text-base p-3 bg-blue-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-600 leading-relaxed">
                      <strong>Worth Exploring:</strong> Moderate match. Consider informational interviews.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
        </>
    ) : (
      <Card>
        <CardContent className="py-12 text-center">
          {adminViewMode === 'family' ? (
            <div className="space-y-3">
              <p className="text-2xl">✨</p>
              <p className="text-lg font-medium text-gray-700">
                Career possibilities ahead!
              </p>
              <p className="text-sm text-gray-600">
                Careers appear as you explore different story paths.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Career exploration module active
              </p>
              <p className="text-xs text-gray-600">
                Data generation contingent on platform interaction and scene completion.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )}

      {/* Navigation suggestion */}
      <Link href={`/admin/${userId}/evidence`}>
        <Button variant="ghost" className="w-full justify-center gap-2 mt-6">
          Next: View Evidence
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  )
}
