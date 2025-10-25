/**
 * Skills Analysis Card Component
 * Deep dive into 2030 Skills framework with evidence linking
 */

import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Clock, Target, BookOpen } from 'lucide-react'

interface SkillsAnalysisCardProps {
  profile: SkillProfile
}

export function SkillsAnalysisCard({ profile }: SkillsAnalysisCardProps) {
  // Extract skills from demonstrations
  const skillDemonstrations = profile.skillDemonstrations || {}
  const totalDemonstrations = profile.totalDemonstrations || 0
  
  // Calculate skill development metrics
  const skillMetrics = Object.entries(skillDemonstrations).map(([skill, demos]) => ({
    skill,
    demonstrations: demos.length,
    latestContext: demos[demos.length - 1]?.context || '',
    latestScene: demos[demos.length - 1]?.scene || '',
    firstDemonstration: demos[0]?.timestamp || 0,
    lastDemonstration: demos[demos.length - 1]?.timestamp || 0,
    developmentSpan: demos.length > 1 ? 
      (demos[demos.length - 1]?.timestamp || 0) - (demos[0]?.timestamp || 0) : 0
  })).sort((a, b) => b.demonstrations - a.demonstrations)

  // Top 5 skills by demonstration count
  const topSkills = skillMetrics.slice(0, 5)
  
  // Skills with evidence (quotes/context)
  const skillsWithEvidence = skillMetrics.filter(skill => skill.latestContext.length > 20)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Target className="w-6 h-6 text-blue-600" />
          What Skills Are They Building?
        </CardTitle>
        <CardDescription className="text-base mt-2 leading-relaxed mb-3">
          A look at the skills this student is developing through their choices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Skills Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-900">Skills in Action</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalDemonstrations}</p>
            <p className="text-sm text-blue-700 leading-relaxed">
              {totalDemonstrations === 1 ? 'time' : 'times'} they showed skills like communication and emotional intelligence
              {Object.keys(skillDemonstrations).length > 0 && ` across ${Object.keys(skillDemonstrations).length} ${Object.keys(skillDemonstrations).length === 1 ? 'area' : 'areas'}`}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-900">Learning Journey</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {skillMetrics.length > 0 ? Math.round(skillMetrics[0].developmentSpan / (1000 * 60 * 60 * 24)) : 0}
            </p>
            <p className="text-sm text-green-700 leading-relaxed">
              {skillMetrics.length > 0 && Math.round(skillMetrics[0].developmentSpan / (1000 * 60 * 60 * 24)) > 0 
                ? 'days of active skill development' 
                : 'Just started today'}
            </p>
          </div>
        </div>

        {/* Top Skills with Evidence - Only show if there are skills */}
        {topSkills.length > 0 ? (
          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-lg">Their Strongest Skills</h4>
            <div className="space-y-4">
              {topSkills.map((skill, index) => (
              <div key={skill.skill} className="border border-slate-200 rounded-lg p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      #{index + 1}
                    </Badge>
                    <span className="font-semibold text-slate-900 text-lg capitalize">
                      {skill.skill.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {skill.demonstrations} demonstrations
                  </span>
                </div>
                
                {/* Evidence Quote */}
                {skill.latestContext && (
                  <div className="bg-slate-50 rounded p-4 mt-2 space-y-2">
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      "{skill.latestContext.length > 100 
                        ? skill.latestContext.substring(0, 100) + '...' 
                        : skill.latestContext}"
                    </p>
                    <p className="text-xs text-slate-500">
                      From: {skill.latestScene.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()).replace(/Hub/g, 'Conversation')}
                    </p>
                  </div>
                )}
              </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-base text-slate-600 leading-relaxed">
              Just getting started - skills will show as they make choices in the game
            </p>
          </div>
        )}

        {/* Skill Development Timeline */}
        {profile.skillEvolution && profile.skillEvolution.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">How Their Skills Have Grown</h4>
            <div className="space-y-2">
              {profile.skillEvolution.map((checkpoint, index) => (
                <div key={checkpoint.checkpoint} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{checkpoint.checkpoint}</p>
                    <p className="text-sm text-slate-600">{checkpoint.totalDemonstrations} skill moments</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      {new Date(checkpoint.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research References */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <h4 className="font-semibold text-slate-900">Learn More About These Skills</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-slate-900">WEF 2030 Skills Framework</p>
              <p className="text-xs text-slate-600 leading-relaxed">World Economic Forum (2023) identifies the skills this student is building for future careers</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-slate-900">Evidence-Based Assessment</p>
              <p className="text-xs text-slate-600 leading-relaxed">Messick (1995) validates that their choices demonstrate real skill development</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-slate-900">Cognitive Load Theory</p>
              <p className="text-xs text-slate-600 leading-relaxed">Sweller (1988) explains why their learning approach is effective</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-slate-900">Self-Determination Theory</p>
              <p className="text-xs text-slate-600 leading-relaxed">Deci & Ryan (2000) shows how their intrinsic motivation drives skill growth</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
