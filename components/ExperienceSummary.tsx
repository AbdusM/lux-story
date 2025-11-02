'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Award, Lightbulb, Target, TrendingUp, BookOpen, Rocket } from 'lucide-react'
import { formatSkillName } from '@/lib/admin-dashboard-helpers'
import { useState } from 'react'
import { FrameworkInsights } from '@/components/FrameworkInsights'
import { ActionPlanBuilder } from '@/components/ActionPlanBuilder'
import type { SkillProfile } from '@/lib/skill-profile-adapter'

export interface ArcLearningObjective {
  skill: string
  howYouShowedIt: string
  whyItMatters: string
}

export interface ExperienceSummaryData {
  characterName: string
  characterArc: 'maya' | 'devon' | 'jordan'
  arcTheme: string
  skillsDeveloped: ArcLearningObjective[]
  keyInsights: string[]
  trustLevel: number
  relationshipStatus: string
  dominantPattern?: string
  profile?: SkillProfile // Optional profile for framework insights
}

interface ExperienceSummaryProps {
  data: ExperienceSummaryData
  onContinue: () => void
}

export function ExperienceSummary({ data, onContinue }: ExperienceSummaryProps) {
  const [showFrameworks, setShowFrameworks] = useState(false)
  const [showActionPlan, setShowActionPlan] = useState(false)

  const getCharacterColor = (arc: string) => {
    switch (arc) {
      case 'maya':
        return { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' }
      case 'devon':
        return { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' }
      case 'jordan':
        return { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' }
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' }
    }
  }

  const colors = getCharacterColor(data.characterArc)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 ${colors.border}`}>
        <CardHeader className={`${colors.bg} border-b ${colors.border}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Award className={`w-6 h-6 ${colors.text}`} />
                <CardTitle className={`text-2xl ${colors.text}`}>
                  Experience Summary: {data.characterName}
                </CardTitle>
              </div>
              <CardDescription className="text-base">
                Here's what you learned through your journey with {data.characterName}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onContinue} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Arc Theme */}
          <div className={`${colors.bg} rounded-lg p-4 border-l-4 ${colors.border}`}>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Target className={`w-5 h-5 ${colors.text}`} />
              The Journey
            </h3>
            <p className="text-gray-700">{data.arcTheme}</p>
          </div>

          {/* Skills Developed */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${colors.text}`} />
              Skills You Developed
            </h3>
            <div className="space-y-3">
              {data.skillsDeveloped.map((objective, idx) => (
                <div key={idx} className="bg-white border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={colors.badge}>
                      {formatSkillName(objective.skill)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">How you showed it:</span> {objective.howYouShowedIt}
                  </p>
                  <p className="text-xs text-gray-600 italic">
                    <span className="font-medium">Why it matters:</span> {objective.whyItMatters}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className={`w-5 h-5 ${colors.text}`} />
              Key Insights You Gained
            </h3>
            <ul className="space-y-2">
              {data.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white border-l-4 border-blue-400 rounded-r p-3">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-700 flex-1">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Relationship Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Your Relationship</h3>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-600">Trust Level:</span>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded ${
                        i < data.trustLevel ? colors.text.replace('text-', 'bg-').replace('-700', '-600') : 'bg-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">{data.trustLevel}/10</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className={`ml-2 ${colors.badge}`}>
                  {data.relationshipStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Encouragement */}
          <div className={`${colors.bg} rounded-lg p-4 border-l-4 ${colors.border}`}>
            <p className="text-sm text-gray-700 italic">
              Every conversation is a chance to grow. The skills you've developed here are real, 
              and they matter for your future career journey.
            </p>
          </div>

          {/* Framework Insights Button */}
          {data.profile && (
            <Button
              variant="outline"
              className="w-full border-2"
              onClick={() => setShowFrameworks(true)}
              size="lg"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Learn How Research Explains This
            </Button>
          )}

          {/* Action Plan Builder Button */}
          {data.profile && (
            <Button
              variant="outline"
              className="w-full border-2 border-green-300 text-green-700 hover:bg-green-50"
              onClick={() => setShowActionPlan(true)}
              size="lg"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Build Your Action Plan
            </Button>
          )}

          {/* Continue Button */}
          <Button 
            className={`w-full ${
              data.characterArc === 'maya' ? 'bg-purple-600 hover:bg-purple-700' :
              data.characterArc === 'devon' ? 'bg-blue-600 hover:bg-blue-700' :
              'bg-amber-600 hover:bg-amber-700'
            } text-white`}
            onClick={onContinue}
            size="lg"
          >
            Continue Your Journey
          </Button>
        </CardContent>
      </Card>

      {/* Framework Insights Modal */}
      {showFrameworks && data.profile && (
        <FrameworkInsights
          profile={data.profile}
          onClose={() => setShowFrameworks(false)}
        />
      )}

      {/* Action Plan Builder Modal */}
      {showActionPlan && data.profile && (
        <ActionPlanBuilder
          profile={data.profile}
          onClose={() => setShowActionPlan(false)}
          onSave={(plan) => {
            // Save to localStorage for now (can be enhanced to save to Supabase)
            if (typeof window !== 'undefined') {
              localStorage.setItem(`action_plan_${data.profile?.userId || 'default'}`, JSON.stringify(plan))
            }
            console.log('Action plan saved:', plan)
          }}
        />
      )}
    </div>
  )
}

