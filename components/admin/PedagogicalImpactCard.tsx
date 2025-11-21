'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Lightbulb, Target, CheckCircle2 } from 'lucide-react'
import { useAdminDashboard } from '@/components/admin/AdminDashboardContext'
import { getLearningObjectivesForArc } from '@/lib/learning-objectives-definitions'

export function PedagogicalImpactCard() {
  const { profile } = useAdminDashboard()
  if (!profile) return null

  // Get learning objective engagements from profile
  const engagements = profile.learningObjectivesEngagement || []
  
  // Define meta-frameworks (Mental Models)
  const metaFrameworks = [
    {
      id: 'growth_mindset',
      title: 'Growth Mindset',
      description: 'Viewing challenges as opportunities to learn rather than failures.',
      relatedObjectives: ['jordan_impostor_syndrome', 'devon_grief_processing']
    },
    {
      id: 'systems_thinking',
      title: 'Systems Thinking',
      description: 'Understanding how individual parts (like emotions) fit into larger wholes.',
      relatedObjectives: ['devon_emotional_logic_integration', 'devon_systematic_communication']
    },
    {
      id: 'crisis_management',
      title: 'Crisis Management',
      description: 'Maintaining situational awareness and decisive action under high pressure.',
      relatedObjectives: ['marcus_crisis_management']
    },
    {
      id: 'cultural_competence',
      title: 'Cultural Navigation',
      description: 'Balancing personal authenticity with family and community expectations.',
      relatedObjectives: ['maya_cultural_competence', 'maya_boundary_setting']
    },
    {
      id: 'career_adaptability',
      title: 'Career Adaptability',
      description: 'Recognizing non-linear paths and transferable skills.',
      relatedObjectives: ['jordan_trade_value', 'jordan_leadership_potential']
    },
    {
      id: 'entrepreneurial_thinking',
      title: 'Entrepreneurial Thinking',
      description: 'Identifying opportunities, assessing risk, and articulating vision.',
      relatedObjectives: ['tess_entrepreneurial_spirit']
    }
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <CardTitle>Mental Model Development</CardTitle>
        </div>
        <CardDescription>
          Underlying cognitive frameworks the student is actively building
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {metaFrameworks.map(framework => {
          // Check if student has engaged with any related objectives
          const engagedCount = framework.relatedObjectives.filter(objId => 
            engagements.some(e => e.objectiveId === objId)
          ).length
          
          const isActive = engagedCount > 0
          const progressPercent = Math.min(100, (engagedCount / framework.relatedObjectives.length) * 100)

          return (
            <div key={framework.id} className={`p-4 rounded-lg border ${isActive ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    {framework.title}
                    {isActive && <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-[10px]">Active</Badge>}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">{framework.description}</p>
                </div>
                {isActive ? (
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                ) : (
                  <Target className="w-5 h-5 text-slate-300" />
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              
              {/* Evidence */}
              {isActive && (
                <div className="mt-3 pt-3 border-t border-purple-100">
                  <p className="text-xs font-medium text-purple-700 mb-1">Evidence of Adoption:</p>
                  <ul className="space-y-1">
                    {framework.relatedObjectives.map(objId => {
                      const engagement = engagements.find(e => e.objectiveId === objId)
                      if (!engagement) return null
                      
                      // Find readable name for objective (simplified)
                      const nameMap: Record<string, string> = {
                        'jordan_impostor_syndrome': 'Reframed Impostor Syndrome',
                        'devon_grief_processing': 'Navigated Grief Complexity',
                        'devon_emotional_logic_integration': 'Integrated Logic & Emotion',
                        'marcus_crisis_management': 'Executed Under Pressure',
                        'maya_cultural_competence': 'Honored Family Context',
                        'maya_boundary_setting': 'Set Healthy Boundaries',
                        'jordan_trade_value': 'Valued Practical Skills',
                        'tess_entrepreneurial_spirit': 'Evaluated Risk & Vision'
                      }
                      
                      return (
                        <li key={objId} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5" />
                          {nameMap[objId] || objId}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
