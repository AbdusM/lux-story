'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, Target, ArrowRight } from 'lucide-react'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { formatSkillName } from '@/lib/admin-dashboard-helpers'
import Link from 'next/link'

interface NextStepsSectionProps {
  profile: SkillProfile
}

export function NextStepsSection({ profile }: NextStepsSectionProps) {
  // Get top skill gaps to suggest areas to explore
  const skillGaps = profile.skillGaps || []
  const topGaps = skillGaps.slice(0, 2)

  // Get key moments for inspiration
  const keyMoments = profile.keySkillMoments || []
  const recentMoment = keyMoments[0]

  return (
    <Card className="shadow-md border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <CardTitle className="text-xl">Your Next Steps</CardTitle>
        </div>
        <CardDescription>
          Where to go from here on your journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Insight */}
        {recentMoment && (
          <div className="bg-white/60 rounded-lg p-4 border-l-4 border-blue-400">
            <p className="text-sm font-medium text-gray-900 mb-2">💡 Recent Insight</p>
            <p className="text-sm text-gray-700 italic">
              "{recentMoment.insight}"
            </p>
          </div>
        )}

        {/* Suggested Focus Areas */}
        {topGaps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Areas to Explore</h3>
            </div>
            <div className="space-y-2">
              {topGaps.map((gap, idx) => (
                <div key={idx} className="bg-white/60 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {gap.skill ? formatSkillName(gap.skill) : `Skill ${idx + 1}`}
                  </p>
                  <p className="text-xs text-gray-600">
                    {gap.developmentPath || 
                     (gap.priority === 'high' ? 'High priority - focus on this skill' : 
                      gap.priority === 'medium' ? 'Good area to explore further' :
                      'Something to consider')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        <div className="bg-white/60 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">What You Can Do Now</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Research one career from your matches this week</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Talk to someone who works in a field that interests you</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Look for local internships or shadowing opportunities</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Button className="w-full" size="lg" asChild>
          <Link href="/">
            <span>Continue Your Journey</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

