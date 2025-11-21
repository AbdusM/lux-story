'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, GraduationCap, ArrowRight } from 'lucide-react'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import Link from 'next/link'

interface CareerExplorationSectionProps {
  profile: SkillProfile
}

export function CareerExplorationSection({ profile }: CareerExplorationSectionProps) {
  const careers = profile.careerMatches || []
  const topCareers = careers.slice(0, 3)

  const getReadinessBadge = (readiness: string) => {
    switch (readiness) {
      case 'near_ready':
        return <Badge className="bg-green-100 text-green-800">Ready to Explore</Badge>
      case 'skill_gaps':
        return <Badge className="bg-yellow-100 text-yellow-800">Building Skills</Badge>
      case 'exploratory':
        return <Badge variant="outline">Exploring</Badge>
      default:
        return <Badge variant="outline">Exploring</Badge>
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-purple-600" />
          <CardTitle className="text-xl">Career Paths You're Exploring</CardTitle>
        </div>
        <CardDescription>
          Birmingham opportunities that match your skills and interests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCareers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Keep making choices to discover career paths that match your interests!</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Based on your choices, here are career paths you might want to explore:
            </p>
            <div className="space-y-4">
              {topCareers.map((career) => (
                <div
                  key={career.id || career.name}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {career.name}
                      </h3>
                      {getReadinessBadge(career.readiness || 'exploratory')}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Why this match?</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(career.requiredSkills)
                        .filter(([_, data]) => data.current >= 0.6)
                        .slice(0, 3)
                        .map(([skill]) => (
                          <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {skill.replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        ))}
                      {Object.entries(career.requiredSkills).filter(([_, data]) => data.current >= 0.6).length === 0 && (
                        <span className="text-xs text-gray-500 italic">Based on your exploration pattern</span>
                      )}
                    </div>
                  </div>

                  {career.localOpportunities && career.localOpportunities.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Birmingham Opportunities:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-5">
                        {career.localOpportunities.slice(0, 3).map((opp, idx) => (
                          <li key={idx}>• {opp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {career.educationPaths && career.educationPaths.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Education Paths:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-5">
                        {career.educationPaths.slice(0, 2).map((path, idx) => (
                          <li key={idx}>• {path}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
              <p className="text-sm text-gray-700 mb-3">
                <strong>Your Next Step:</strong> These careers are all right here in Birmingham. 
                Want to learn more? Talk to a counselor or explore these paths further.
              </p>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/">
                  <span>Continue Your Journey</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

