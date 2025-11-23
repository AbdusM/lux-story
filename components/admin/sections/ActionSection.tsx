'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, CheckCircle2, Lightbulb } from 'lucide-react'

interface ActionSectionProps {
  userId: string
  profile: any // SkillProfile
  adminViewMode: 'family' | 'research'
}

export function ActionSection({ userId, profile, adminViewMode }: ActionSectionProps) {
  const user = profile // Alias for consistency with original code

  return (
    <div className="space-y-4">
      {/* NARRATIVE BRIDGE: Gaps → Action */}
      {user.skillGaps && user.skillGaps.length > 0 && user.careerMatches && user.careerMatches.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 sm:p-6 rounded-r">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {adminViewMode === 'family' ? (
              <>Ready to bridge those gaps? Here are concrete next steps with Birmingham resources.</>
            ) : (
              <>Development pathways with evidence-based interventions and regional partnership resources.</>
            )}
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Briefcase className="w-5 h-5" />
            Your Action Plan
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">Concrete next steps for your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conversation starters */}
          <div>
            <p className="font-medium text-sm sm:text-base mb-3">Questions to Consider:</p>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="leading-relaxed">"I showed strong emotional intelligence and problem-solving skills.
                Have I thought about healthcare technology roles that use both?"</p>
              </div>
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="leading-relaxed">
                  {adminViewMode === 'family'
                    ? `"My critical thinking is strong (${Math.max(0, Math.min(100, 82))}%) but collaboration is still growing (${Math.max(0, Math.min(100, 58))}%). Would I be interested in experiences that build team skills?"`
                    : `"Critical thinking advanced (${Math.max(0, Math.min(100, 82))}% proficiency) vs collaboration developing (${Math.max(0, Math.min(100, 58))}% proficiency). Consider team-based skill development opportunities."`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Show action plan only if user has data */}
          {user.skillGaps && user.skillGaps.length > 0 && (
            <>

          {/* Immediate actions */}
          <div>
            <p className="font-medium text-sm sm:text-base mb-3">This Week - Your Actions:</p>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  {adminViewMode === 'family'
                    ? `Schedule UAB Health Informatics tour (${Math.max(0, Math.min(100, 87))}% match - you're nearly ready)`
                    : `Schedule UAB Health Informatics tour (${Math.max(0, Math.min(100, 87))}% career match score, near_ready status)`
                  }
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  {adminViewMode === 'family'
                    ? `Explore digital literacy development options (need ${Math.max(0, Math.min(100, 12))}% more to reach target)`
                    : `Explore digital literacy development options (${Math.max(0, Math.min(100, 12))}% proficiency gap vs career requirements)`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Next month */}
          <div>
            <p className="font-medium text-sm sm:text-base mb-3">Next Month - Your Goals:</p>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">Connect with UAB Hospital or Children's Hospital for shadowing</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">Explore group projects or team activities (your collaboration skill gap)</p>
              </div>
            </div>
          </div>

          {/* What to avoid */}
          <div className="border-t pt-4">
            <p className="font-medium text-sm sm:text-base mb-3 text-red-600">Be Mindful Of:</p>
            <div className="space-y-2 text-sm sm:text-base text-muted-foreground">
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="leading-relaxed">• Rushing into immediate career commitment (you're still exploring)</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="leading-relaxed">• Ignoring skill gaps (your collaboration needs work for Community Health path)</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="leading-relaxed">
                  {adminViewMode === 'family'
                    ? `• Overlooking time management needs (${Math.max(0, Math.min(100, 42))}% - may struggle with structured programs)`
                    : `• Overlooking time management weakness (${Math.max(0, Math.min(100, 42))}% proficiency - risk factor for structured programs)`
                  }
                </p>
              </div>
            </div>
          </div>
            </>
          )}

          {/* Show empty state if no skill gaps */}
          {(!user.skillGaps || user.skillGaps.length === 0) && (
            <div className="text-center py-12">
              {adminViewMode === 'family' ? (
                <div className="space-y-3">
                  <p className="text-2xl">👍</p>
                  <p className="text-lg font-medium text-gray-700">
                    All set!
                  </p>
                  <p className="text-sm text-gray-600">
                    No immediate actions needed. Check back weekly for updates.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    No evidence-based interventions required at this time
                  </p>
                  <p className="text-xs text-gray-600">
                    Scheduled review: weekly cadence.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key insights */}
      <Card className="border-2 border-blue-600">
        <CardHeader>
          <div className="flex items-baseline gap-3 mb-2">
            <CardTitle className="text-lg sm:text-xl">Your Key Insights</CardTitle>
            {user.keySkillMoments && user.keySkillMoments.length > 0 && (
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                {user.keySkillMoments.length}
              </span>
            )}
          </div>
          <CardDescription className="text-sm sm:text-base">
            Breakthrough moments from your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm sm:text-base">
          {user.keySkillMoments && user.keySkillMoments.length > 0 ? (
            <>
              {user.keySkillMoments.slice(0, 5).map((moment: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 text-lg font-bold">#{idx + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium leading-relaxed">"{moment.choice || 'Your choice'}"</p>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">{moment.insight || 'Key insight from your journey'}</p>
                    {moment.skillsDemonstrated && moment.skillsDemonstrated.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {moment.skillsDemonstrated.slice(0, 3).map((skill: string, sidx: number) => (
                          <Badge key={sidx} variant="secondary" className="text-xs">
                            {skill.replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        ))}
                        {moment.skillsDemonstrated.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{moment.skillsDemonstrated.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {user.keySkillMoments.length > 5 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    + {user.keySkillMoments.length - 5} more insights
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              {adminViewMode === 'family' ? (
                <div className="space-y-3">
                  <p className="text-2xl">💡</p>
                  <p className="text-lg font-medium text-gray-700">
                    Key insights coming soon!
                  </p>
                  <p className="text-sm text-gray-600">
                    Your most meaningful moments will appear here as you explore different story paths.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Insight extraction pending
                  </p>
                  <p className="text-xs text-gray-600">
                    Key skill moments identified through narrative choice analysis will populate after threshold interactions.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NARRATIVE BRIDGE: Action → Evidence */}
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 sm:p-6 rounded-r mt-6">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {adminViewMode === 'family' ? (
            <>Want to see the data behind these recommendations? Evidence tab shows the research.</>
          ) : (
            <>Supporting frameworks and research-backed evidence for above recommendations.</>
          )}
        </p>
      </div>
    </div>
  )
}
