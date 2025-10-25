/**
 * Skill Gaps Analysis Component
 * Detailed analysis of skill gaps with development pathways
 */

import type { SkillGap } from '@/lib/skill-profile-adapter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, TrendingUp, BookOpen, Target } from 'lucide-react'

interface SkillGapsAnalysisProps {
  skillGaps: SkillGap[]
  totalDemonstrations: number
}

export function SkillGapsAnalysis({ skillGaps, totalDemonstrations }: SkillGapsAnalysisProps) {
  // Categorize gaps by priority
  const highPriorityGaps = skillGaps.filter(gap => gap.priority === 'high')
  const mediumPriorityGaps = skillGaps.filter(gap => gap.priority === 'medium')
  const lowPriorityGaps = skillGaps.filter(gap => gap.priority === 'low')

  // Calculate overall readiness
  const totalGaps = skillGaps.length
  const criticalGaps = highPriorityGaps.length
  const readinessScore = totalGaps > 0 ? Math.round(((totalGaps - criticalGaps) / totalGaps) * 100) : 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-600" />
          Where They Can Grow
        </CardTitle>
        <CardDescription>
          Skills they're developing and areas where they could strengthen their abilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Overall Readiness */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900">How Ready Are They?</h4>
            <Badge variant={readinessScore >= 70 ? "default" : readinessScore >= 40 ? "secondary" : "destructive"}>
              {readinessScore}%
            </Badge>
          </div>
          <Progress value={readinessScore} className="mb-2" />
            <p className="text-sm text-slate-600">
              Based on {totalGaps} skill areas and {totalDemonstrations} moments of skill building
            </p>
        </div>

        {/* High Priority Gaps */}
        {highPriorityGaps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h4 className="font-semibold text-red-900">Skills They're Working On</h4>
            </div>
            <div className="space-y-3">
              {highPriorityGaps.map((gap, index) => (
                <div key={gap.skill} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">HIGH</Badge>
                      <span className="font-medium text-red-900 capitalize">
                        {gap.skill.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">
                        {Math.round(gap.gap * 100)}% to go
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-red-700 mb-1">Current Level</p>
                      <div className="flex items-center gap-2">
                        <Progress value={gap.currentLevel * 100} className="flex-1" />
                        <span className="text-xs text-red-600">{Math.round(gap.currentLevel * 100)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-red-700 mb-1">Target Level</p>
                      <div className="flex items-center gap-2">
                        <Progress value={gap.targetForTopCareers * 100} className="flex-1" />
                        <span className="text-xs text-red-600">{Math.round(gap.targetForTopCareers * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded p-4 space-y-2">
                    <p className="text-sm text-red-800 font-medium">How to help them grow:</p>
                    <p className="text-sm text-red-700 leading-relaxed">
                      {gap.developmentPath.replace(/Healthcare Technology Specialist, Sustainable Construction Manager/g, 'healthcare tech and construction careers they\'re exploring')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medium Priority Gaps */}
        {mediumPriorityGaps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <h4 className="font-semibold text-amber-900">Skills They're Exploring</h4>
            </div>
            <div className="space-y-2">
              {mediumPriorityGaps.map((gap, index) => (
                <div key={gap.skill} className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">MEDIUM</Badge>
                      <span className="font-medium text-amber-900 capitalize">
                        {gap.skill.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-amber-600">
                        {Math.round(gap.gap * 100)}% gap
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">{gap.developmentPath}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Priority Gaps */}
        {lowPriorityGaps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-green-900">Skills They're Already Strong In</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {lowPriorityGaps.map((gap, index) => (
                <div key={gap.skill} className="border border-green-200 bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs text-green-600 border-green-300">LOW</Badge>
                      <span className="font-medium text-green-900 capitalize text-sm">
                        {gap.skill.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className="text-xs text-green-600">
                      {Math.round(gap.gap * 100)}% gap
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Development Resources */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <h4 className="font-semibold text-slate-900">Resources to Help Them Grow</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-slate-900">WEF 2030 Skills Framework</p>
              <p className="text-xs text-slate-600 leading-relaxed">World Economic Forum (2023) identifies skills needed for careers this student is exploring</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-slate-900">Birmingham Workforce Context</p>
              <p className="text-xs text-slate-600 leading-relaxed">AL Dept of Labor (2023) shows local opportunities matching their skill development</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
