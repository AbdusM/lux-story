'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { loadSkillProfile } from '@/lib/skill-profile-adapter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Users, GraduationCap, ChevronRight, TrendingUp } from 'lucide-react'
import { AdvisorBriefingButton } from '@/components/admin/AdvisorBriefingButton'
import { ExportButton } from '@/components/admin/ExportButton'
import { getTopSkills, getReadinessPercentage, getReadinessDisplay } from '@/lib/admin-dashboard-helpers'
import { AdminDashboardProvider } from '@/components/admin/AdminDashboardContext'
import { DashboardSkeleton } from '@/components/admin/skeletons'
import type { SkillProfile } from '@/lib/skill-profile-adapter'

interface SharedDashboardLayoutProps {
  children: React.ReactNode
  userId: string
}

const NAV_SECTIONS = [
  { id: 'urgency', label: 'Urgency', path: 'urgency' },
  { id: 'patterns', label: 'Patterns', path: 'patterns' },
  { id: 'skills', label: 'Skills', path: 'skills' },
  { id: 'careers', label: 'Careers', path: 'careers' },
  { id: 'evidence', label: 'Evidence', path: 'evidence' },
  { id: 'gaps', label: 'Gaps', path: 'gaps' },
  { id: 'action', label: 'Action', path: 'action' },
]

export function SharedDashboardLayout({ children, userId }: SharedDashboardLayoutProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<SkillProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminViewMode, setAdminViewMode] = useState<'family' | 'research'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('admin_view_preference') as 'family' | 'research') || 'family'
    }
    return 'family'
  })

  // Client-side mount guard
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_view_preference', adminViewMode)
    }
  }, [adminViewMode])

  // Load profile after client-side mount
  useEffect(() => {
    if (!mounted || !userId) return

    const loadProfile = async () => {
      try {
        setLoading(true)
        const loaded = await loadSkillProfile(userId)
        if (!loaded) {
          console.warn(`[SharedDashboardLayout] No profile found for ${userId}`)
        }
        setProfile(loaded)
      } catch (error) {
        console.error('[SharedDashboardLayout] Failed to load profile:', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId, mounted])

  // Determine current section from pathname
  // e.g., /admin/player-123/urgency -> 'urgency'
  // e.g., /admin/player-123 -> 'urgency' (default)
  // Safely handle pathname (may be null during initial render)
  const pathParts = (pathname || '').split('/').filter(Boolean)
  const currentSection = pathParts[pathParts.length - 1] === 'admin' || pathParts[pathParts.length - 1] === userId 
    ? 'urgency' // Default to urgency if at /admin/[userId]
    : pathParts[pathParts.length - 1] || 'urgency'

  // Always provide context, even if profile is loading/null
  const contextValue = {
    profile,
    adminViewMode,
    setAdminViewMode,
    loading: loading || !mounted,
  }

  const topSkills = profile ? getTopSkills(profile) : []
  const readinessPercent = profile ? getReadinessPercentage(profile) : null

  return (
    <AdminDashboardProvider value={contextValue}>
      <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
        {/* Show loading state if profile not loaded */}
        {(!mounted || loading) ? (
          <DashboardSkeleton />
        ) : !profile ? (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-900">Profile Not Found</h3>
                <p className="text-red-800">Unable to load profile for user: {userId}</p>
                <p className="text-sm text-red-700 mt-2">This user may not exist or there may be a connection issue.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Header */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">{profile.userName}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Skills-Based Career Profile</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {profile.careerMatches && profile.careerMatches.length > 0 && (
                      <Badge variant={getReadinessDisplay(profile.careerMatches[0].readiness).variant} className="text-sm sm:text-lg">
                        {getReadinessDisplay(profile.careerMatches[0].readiness).text}
                      </Badge>
                    )}
                    <AdvisorBriefingButton profile={profile} variant="default" size="default" />
                    <ExportButton profile={profile} variant="outline" />
                  </div>
                </div>
              </CardHeader>
            </Card>

      {/* Quick Summary Bar */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-blue-200">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                {profile.totalDemonstrations || 0}
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                {adminViewMode === 'family' ? 'choices aligned with skills' : 'choices aligned with skills'}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {adminViewMode === 'family' ? 'Building' : 'Top Skills'}
              </div>
              <div className="text-sm sm:text-base text-gray-600 space-y-1">
                {topSkills.length > 0 ? (
                  topSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="capitalize">{skill}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 italic">Just getting started</span>
                )}
              </div>
            </div>
            {readinessPercent !== null && (
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
                  {readinessPercent}%
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {adminViewMode === 'family' ? 'ready for top career' : 'readiness score'}
                </div>
                {profile.careerMatches && profile.careerMatches.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {profile.careerMatches[0].name}
                  </div>
                )}
              </div>
            )}
            <div className="text-center sm:text-left">
              <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {adminViewMode === 'family' ? 'Currently' : 'Status'}
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                <span>Exploring story paths</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm font-medium text-gray-700">Dashboard View:</p>
            <RadioGroup
              value={adminViewMode}
              onValueChange={(value) => setAdminViewMode(value as 'family' | 'research')}
              className="flex gap-2"
            >
              <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-md hover:bg-white/50 transition-colors cursor-pointer min-h-[44px] border border-transparent hover:border-purple-300">
                <RadioGroupItem value="family" id="global-mode-family" />
                <label htmlFor="global-mode-family" className="flex items-center gap-1.5 cursor-pointer">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-xs sm:text-sm font-medium">Family</span>
                  {adminViewMode === 'family' && (
                    <Badge variant="default" className="text-xs ml-1">Active</Badge>
                  )}
                </label>
              </div>
              <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-md hover:bg-white/50 transition-colors cursor-pointer min-h-[44px] border border-transparent hover:border-blue-300">
                <RadioGroupItem value="research" id="global-mode-research" />
                <label htmlFor="global-mode-research" className="flex items-center gap-1.5 cursor-pointer">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium">Analysis</span>
                  {adminViewMode === 'research' && (
                    <Badge variant="default" className="text-xs ml-1">Active</Badge>
                  )}
                </label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/admin" className="hover:text-blue-600 transition-colors">
              All Students
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">{profile?.userName || 'Student'}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium capitalize">{currentSection}</span>
          </div>
          
          <nav className="grid grid-cols-4 sm:grid-cols-7 gap-1 sm:gap-2">
            {NAV_SECTIONS.map((section) => {
              const isActive = currentSection === section.path
              // Validate userId before creating href
              if (!userId || typeof userId !== 'string') {
                return null
              }
              const href = `/admin/${encodeURIComponent(userId)}/${section.path}`
              return (
                <Link key={section.id} href={href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full text-xs sm:text-sm px-1 sm:px-3 min-h-[40px] ${isActive ? 'bg-blue-50 border-t-2 border-t-blue-600 font-semibold' : ''}`}
                  >
                    {section.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Page Content */}
      <div data-view-mode={adminViewMode}>
        {children}
      </div>
          </>
        )}
      </div>
    </AdminDashboardProvider>
  )
}

