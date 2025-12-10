'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Map, Heart, Award } from 'lucide-react'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { formatSkillName } from '@/lib/admin-dashboard-helpers'

interface YourJourneySectionProps {
  profile: SkillProfile
}

export function YourJourneySection({ profile }: YourJourneySectionProps) {
  const topSkills = Object.entries(profile.skillDemonstrations || {})
    .map(([skill, demos]) => ({ 
      skill, 
      count: Array.isArray(demos) ? demos.length : 0 
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const milestones = profile.milestones || []
  const recentMilestone = milestones[milestones.length - 1]

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-xl">Your Journey So Far</CardTitle>
        </div>
        <CardDescription>
          A look at how you've been growing through your choices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-pink-500" />
            <h3 className="text-lg font-semibold text-gray-900">Your Growth</h3>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your strongest skills so far:
          </p>
          <div className="flex flex-wrap gap-2">
            {topSkills.slice(0, 3).map(({ skill }) => (
              <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800">
                {formatSkillName(skill)}
              </Badge>
            ))}
            {topSkills.length > 3 && (
              <Badge variant="outline" className="text-gray-600">
                +{topSkills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Milestones */}
        {recentMilestone && (
          <div className="border-l-4 border-purple-400 bg-purple-50 rounded-r-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Recent Milestone</span>
            </div>
            <p className="text-gray-700">{recentMilestone}</p>
          </div>
        )}

      </CardContent>
    </Card>
  )
}

