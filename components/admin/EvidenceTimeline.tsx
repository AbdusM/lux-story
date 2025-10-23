/**
 * Evidence Timeline Component
 * Shows skill demonstrations with supporting evidence and quotes
 */

import type { KeySkillMoment } from '@/lib/skill-profile-adapter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Quote, Calendar, MapPin, ExternalLink, Lightbulb } from 'lucide-react'

interface EvidenceTimelineProps {
  keySkillMoments: KeySkillMoment[]
  totalDemonstrations: number
}

export function EvidenceTimeline({ keySkillMoments, totalDemonstrations }: EvidenceTimelineProps) {
  // Sort moments by timestamp (most recent first)
  const sortedMoments = [...keySkillMoments].sort((a, b) => b.timestamp - a.timestamp)
  
  // Group by scene for better organization
  const momentsByScene = sortedMoments.reduce((acc, moment) => {
    const scene = moment.scene
    if (!acc[scene]) acc[scene] = []
    acc[scene].push(moment)
    return acc
  }, {} as Record<string, KeySkillMoment[]>)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-purple-600" />
          Their Journey in Their Own Words
        </CardTitle>
        <CardDescription>
          What they said and how they showed their skills through their choices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-purple-900">Breakthrough Moments</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{keySkillMoments.length}</p>
            <p className="text-sm text-purple-700">times they really showed their skills</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-900">Stories Shared</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{Object.keys(momentsByScene).length}</p>
            <p className="text-sm text-blue-700">different conversations</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-900">Total Moments</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{totalDemonstrations}</p>
            <p className="text-sm text-green-700">times they showed their skills</p>
          </div>
        </div>

        {/* Evidence Timeline */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">What They Said and Did</h4>
          <div className="space-y-6">
            {Object.entries(momentsByScene).map(([scene, moments]) => (
              <div key={scene} className="border-l-4 border-purple-200 pl-4">
                <div className="mb-3">
                  <h5 className="font-medium text-slate-900 capitalize">
                    {scene.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                  </h5>
                  <p className="text-sm text-slate-600">
                    {moments.length} time{moments.length !== 1 ? 's' : ''} they showed their skills
                  </p>
                </div>
                
                <div className="space-y-3">
                  {moments.map((moment, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {moment.skillsDemonstrated.length} skill{moment.skillsDemonstrated.length !== 1 ? 's' : ''} shown
                          </Badge>
                          <span className="text-sm text-slate-600">
                            {new Date(moment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Student Quote */}
                      <div className="bg-white rounded p-3 mb-3 border-l-4 border-purple-300">
                        <div className="flex items-start gap-2">
                          <Quote className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-slate-800 italic">
                              "{moment.choice}"
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              What they actually said
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Skills Demonstrated */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-slate-700 mb-2">Skills they showed:</p>
                        <div className="flex flex-wrap gap-1">
                          {moment.skillsDemonstrated.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill.replace(/([A-Z])/g, ' $1').trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Analysis/Insight */}
                      <div className="bg-blue-50 rounded p-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">What this tells us:</p>
                        <p className="text-sm text-blue-800">
                          {moment.insight}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research References */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-4 h-4 text-slate-600" />
            <h4 className="font-semibold text-slate-900">Learn More About This Approach</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm font-medium text-slate-900">Evidence-Based Assessment</p>
              <p className="text-xs text-slate-600">Messick (1995). Performance-based validation methodology</p>
              <Button variant="link" size="sm" className="h-auto p-0 text-blue-600" onClick={() => window.open('/docs/RESEARCH_FOUNDATION.md#6-evidence-based-assessment-methodology', '_blank')}>
                View Research →
              </Button>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm font-medium text-slate-900">Narrative Assessment Framework</p>
              <p className="text-xs text-slate-600">McAdams (2001). Identity through storytelling methodology</p>
              <Button variant="link" size="sm" className="h-auto p-0 text-blue-600" onClick={() => window.open('/docs/RESEARCH_FOUNDATION.md#7-narrative-assessment-framework', '_blank')}>
                View Research →
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
