'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react'
import { loadSkillProfile } from '@/lib/skill-profile-adapter'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { YourJourneySection } from '@/components/student/sections/YourJourneySection'
import { PatternInsightsSection } from '@/components/student/sections/PatternInsightsSection'
import { SkillGrowthSection } from '@/components/student/sections/SkillGrowthSection'
import { CareerExplorationSection } from '@/components/student/sections/CareerExplorationSection'
import { NextStepsSection } from '@/components/student/sections/NextStepsSection'
// import { FrameworkInsights } from '@/components/FrameworkInsights'
// import { ActionPlanBuilder } from '@/components/ActionPlanBuilder'


export default function StudentInsightsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<SkillProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get userId from localStorage (same as game uses)
    if (typeof window !== 'undefined') {
      // Try multiple possible keys (for compatibility)
      const savedUserId =
        localStorage.getItem('lux-player-id') ||
        localStorage.getItem('playerId') ||
        localStorage.getItem('gameUserId')

      if (!savedUserId) {
        setError('No user ID found. Please start playing the game first.')
        setLoading(false)
        return
      }
      setUserId(savedUserId)
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const loadProfile = async () => {
      try {
        setLoading(true)
        const loaded = await loadSkillProfile(userId)
        if (!loaded) {
          setError('Unable to load your journey data. Make some choices in the game first!')
          return
        }
        setProfile(loaded)
      } catch (err) {
        console.error('Failed to load student profile:', err)
        setError('Failed to load your journey data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 border-t-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your journey...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Unable to Load Your Journey</CardTitle>
            <CardDescription>{error || 'No data found'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              To see your journey insights, you need to play the game and make some choices first.
            </p>
            <Button onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game
          </Button>
        </div>

        {/* Welcome Card */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl text-gray-900">
                  Your Journey
                </CardTitle>
                <CardDescription className="text-base">
                  Discover what you've been building through your choices
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Your Progress</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{profile.totalDemonstrations || 0}</p>
                <p className="text-xs text-gray-600">Choices aligned with skills</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">Career Paths</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{profile.careerMatches?.length || 0}</p>
                <p className="text-xs text-gray-600">Discoveries you're exploring</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-gray-900">Skills Growing</span>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {Object.keys(profile.skillDemonstrations || {}).length}
                </p>
                <p className="text-xs text-gray-600">Different skills you've shown</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <YourJourneySection profile={profile} />
        {userId && <PatternInsightsSection userId={userId} />}
        <SkillGrowthSection profile={profile} />
        <CareerExplorationSection profile={profile} />
        <NextStepsSection profile={profile} />

        {/* Framework Insights & Action Plan Buttons - DISABLED (Missing Components) */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-md border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-6 text-center">
              <p className="text-gray-700 mb-4">
                Want to understand the science behind your journey?
              </p>
              <Button
                // onClick={() => setShowFrameworks(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                size="lg"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Learn How Research Explains Your Journey
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6 text-center">
              <p className="text-gray-700 mb-4">
                Ready to turn insights into action?
              </p>
              <Button
                // onClick={() => setShowActionPlan(true)}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                size="lg"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Build Your Action Plan
              </Button>
            </CardContent>
          </Card>
        </div> */}
      </div>

      {/* Framework Insights Modal */}
      {/* {showFrameworks && profile && (
        <FrameworkInsights
          profile={profile}
          onClose={() => setShowFrameworks(false)}
        />
      )} */}

      {/* Action Plan Builder Modal */}
      {/* {showActionPlan && profile && (
        <ActionPlanBuilder
          profile={profile}
          onClose={() => setShowActionPlan(false)}
          onSave={(plan) => {
            // Save to localStorage
            if (typeof window !== 'undefined' && userId) {
              localStorage.setItem(`action_plan_${userId}`, JSON.stringify(plan))
            }
            logger.debug('Action plan saved', { operation: 'student-insights.save-plan', plan: typeof plan === 'object' ? Object.keys(plan) : 'unknown' })
          }}
        />
      )} */}
    </div>
  )
}

