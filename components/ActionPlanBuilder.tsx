'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Rocket, Target, Calendar, CheckCircle2, X, Lightbulb, MapPin, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { formatSkillName } from '@/lib/admin-dashboard-helpers'

interface ActionPlanBuilderProps {
  profile: SkillProfile
  onClose: () => void
  onSave?: (plan: ActionPlan) => void
}

export interface ActionPlan {
  purposeStatement: string
  shortTermGoals: ActionGoal[]
  longTermGoals: ActionGoal[]
  skillsToDevelop: string[]
  birminghamOpportunities: string[]
  createdAt: number
}

export interface ActionGoal {
  id: string
  text: string
  timeframe: 'thisWeek' | 'thisMonth' | 'thisSemester' | 'thisYear'
  completed: boolean
  deadline?: string
}

export function ActionPlanBuilder({ profile, onClose, onSave }: ActionPlanBuilderProps) {
  const [purposeStatement, setPurposeStatement] = useState('')
  const [shortTermGoals, setShortTermGoals] = useState<ActionGoal[]>([])
  const [longTermGoals, setLongTermGoals] = useState<ActionGoal[]>([])
  const [newGoalText, setNewGoalText] = useState('')
  const [newGoalTimeframe, setNewGoalTimeframe] = useState<ActionGoal['timeframe']>('thisWeek')
  const [isAddingGoal, setIsAddingGoal] = useState(false)

  // Get top skills and career matches for suggestions
  const topSkills = Object.entries(profile.skillDemonstrations || {})
    .map(([skill, demos]) => ({
      skill,
      count: Array.isArray(demos) ? demos.length : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(s => formatSkillName(s.skill))

  const topCareer = profile.careerMatches?.[0]
  const birminghamOpportunities = topCareer?.localOpportunities?.slice(0, 3) || []

  // Generate purpose statement suggestions based on profile
  const purposeSuggestions = [
    `Use my ${topSkills[0] || 'skills'} to help others in ${topCareer?.name || 'a meaningful career'}`,
    `Build a career that combines ${topSkills.slice(0, 2).join(' and ') || 'my strengths'} with my passion for helping people`,
    `Explore ${topCareer?.name || 'career paths'} in Birmingham and find my path`
  ]

  const timeframeLabels: Record<ActionGoal['timeframe'], string> = {
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisSemester: 'This Semester',
    thisYear: 'This Year'
  }

  const addGoal = () => {
    if (!newGoalText.trim()) return

    const goal: ActionGoal = {
      id: `goal-${Date.now()}`,
      text: newGoalText,
      timeframe: newGoalTimeframe,
      completed: false
    }

    if (newGoalTimeframe === 'thisWeek' || newGoalTimeframe === 'thisMonth') {
      setShortTermGoals([...shortTermGoals, goal])
    } else {
      setLongTermGoals([...longTermGoals, goal])
    }

    setNewGoalText('')
    setIsAddingGoal(false)
  }

  const toggleGoal = (id: string, isShortTerm: boolean) => {
    if (isShortTerm) {
      setShortTermGoals(shortTermGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g))
    } else {
      setLongTermGoals(longTermGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g))
    }
  }

  const removeGoal = (id: string, isShortTerm: boolean) => {
    if (isShortTerm) {
      setShortTermGoals(shortTermGoals.filter(g => g.id !== id))
    } else {
      setLongTermGoals(longTermGoals.filter(g => g.id !== id))
    }
  }

  const handleSave = () => {
    const plan: ActionPlan = {
      purposeStatement,
      shortTermGoals,
      longTermGoals,
      skillsToDevelop: topSkills,
      birminghamOpportunities,
      createdAt: Date.now()
    }
    onSave?.(plan)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-green-200 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-6 h-6 text-green-600" />
                <CardTitle className="text-2xl text-green-900">
                  Build Your Action Plan
                </CardTitle>
              </div>
              <CardDescription className="text-base">
                Turn your journey insights into concrete next steps
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Purpose Statement */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Your Purpose Statement</CardTitle>
            </div>
            <CardDescription className="mb-2">
              What do you want to achieve? Write a sentence or two about your career goals based on what you've learned.
            </CardDescription>
            
            <Textarea
              aria-label="Purpose statement for your career goals"
              placeholder="Example: I want to use my emotional intelligence and communication skills to help young people navigate career decisions..."
              value={purposeStatement}
              onChange={(e) => setPurposeStatement(e.target.value)}
              className="min-h-[100px] mb-3"
            />

            {purposeSuggestions.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                <p className="text-xs font-medium text-gray-700 mb-2">💡 Suggestions based on your journey:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  {purposeSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Short-Term Goals */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Short-Term Goals</CardTitle>
            </div>
            <CardDescription className="mb-3">
              What can you do this week or month to move toward your purpose?
            </CardDescription>

            <div className="space-y-2 mb-3">
              {shortTermGoals.map((goal) => (
                <div key={goal.id} className="flex items-start gap-3 bg-white border rounded-lg p-3">
                  <Checkbox
                    checked={goal.completed}
                    onCheckedChange={() => toggleGoal(goal.id, true)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${goal.completed ? 'line-through text-gray-600' : 'text-gray-900'}`}>
                      {goal.text}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {timeframeLabels[goal.timeframe]}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(goal.id, true)}
                    className="h-6 w-6 p-0 text-gray-400"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {!isAddingGoal ? (
              <Button
                variant="outline"
                onClick={() => setIsAddingGoal(true)}
                className="w-full"
              >
                + Add Short-Term Goal
              </Button>
            ) : (
              <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                <Input
                  aria-label="New goal description"
                  placeholder="What do you want to accomplish?"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      addGoal()
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Select value={newGoalTimeframe} onValueChange={(value) => setNewGoalTimeframe(value as ActionGoal['timeframe'])}>
                    <SelectTrigger className="flex-1" aria-label="Goal timeframe">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="thisSemester">This Semester</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addGoal} size="sm">Add</Button>
                  <Button variant="ghost" onClick={() => setIsAddingGoal(false)} size="sm">Cancel</Button>
                </div>
              </div>
            )}
          </div>

          {/* Long-Term Goals */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Long-Term Goals</CardTitle>
            </div>
            <CardDescription className="mb-3">
              What are your bigger goals for this semester or year?
            </CardDescription>

            <div className="space-y-2 mb-3">
              {longTermGoals.map((goal) => (
                <div key={goal.id} className="flex items-start gap-3 bg-white border rounded-lg p-3">
                  <Checkbox
                    checked={goal.completed}
                    onCheckedChange={() => toggleGoal(goal.id, false)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${goal.completed ? 'line-through text-gray-600' : 'text-gray-900'}`}>
                      {goal.text}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {timeframeLabels[goal.timeframe]}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(goal.id, false)}
                    className="h-6 w-6 p-0 text-gray-400"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setIsAddingGoal(true)
                setNewGoalTimeframe('thisSemester')
              }}
              className="w-full"
            >
              + Add Long-Term Goal
            </Button>
          </div>

          {/* Birmingham Opportunities */}
          {birminghamOpportunities.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Birmingham Opportunities to Explore</h3>
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                {birminghamOpportunities.map((opp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-600 mt-0.5" />
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Action Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

