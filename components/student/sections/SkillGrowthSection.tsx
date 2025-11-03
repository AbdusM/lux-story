'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Sparkles } from 'lucide-react'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { formatSkillName } from '@/lib/admin-dashboard-helpers'

interface SkillGrowthSectionProps {
  profile: SkillProfile
}

export function SkillGrowthSection({ profile }: SkillGrowthSectionProps) {
  const skills = Object.entries(profile.skillDemonstrations || {})
    .map(([skillName, demos]) => {
      const demosArray = Array.isArray(demos) ? demos : []
      return {
        skillName,
        count: demosArray.length,
        latestContext: demosArray[0]?.context || 'Through your choices',
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const maxCount = Math.max(...skills.map(s => s.count), 1)

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <CardTitle className="text-xl">Your Skills Growth</CardTitle>
        </div>
        <CardDescription>
          Skills you've been developing through your journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p>Make some choices in the game to see your skills grow!</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              These are skills your choices have been aligned with. The more you explore, 
              the more you'll see these grow.
            </p>
            <div className="space-y-3">
              {skills.map(({ skillName, count, latestContext }) => {
                const percentage = (count / maxCount) * 100
                return (
                  <div key={skillName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {formatSkillName(skillName)}
                        </span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {count} {count === 1 ? 'time' : 'times'}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    {latestContext && (
                      <p className="text-xs text-gray-500 italic pl-2">
                        "{latestContext}"
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
              <p className="text-sm text-gray-700">
                <strong>Remember:</strong> These aren't test scores—they're evidence of skills 
                you've shown through your choices. Every interaction is a chance to grow.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

