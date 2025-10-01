'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loadSkillProfile, type SkillProfile } from '@/lib/skill-profile-adapter'
import SingleUserDashboard from '@/components/admin/SingleUserDashboard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { formatUserId } from '@/lib/format-user-id'

/**
 * Inner component that uses useSearchParams
 */
function SkillsProfileContent() {
  const searchParams = useSearchParams()
  const userId = searchParams?.get('userId') || ''

  const [profileData, setProfileData] = useState<SkillProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setError('No user ID provided')
      setLoading(false)
      return
    }

    try {
      // Load skill profile for this user
      const profile = loadSkillProfile(userId)

      // Validate we have data
      if (!profile || profile.totalDemonstrations === 0) {
        setError('No journey data found for this user')
      } else {
        setProfileData(profile)
      }
    } catch (err) {
      console.error('Failed to load skill profile:', err)
      setError('Failed to load skill profile')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">Loading skill profile...</p>
            <p className="text-sm text-gray-600">User: {userId}</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto pt-12">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'No data found'}
            </AlertDescription>
          </Alert>

          <div className="bg-white rounded-lg border p-6 space-y-4">
            <h2 className="text-xl font-semibold">Student: {userId ? formatUserId(userId) : 'Unknown'}</h2>
            <p className="text-gray-600">
              This student has not completed any skill demonstrations yet. They need to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>Start the Grand Central Terminus journey</li>
              <li>Make choices that demonstrate 2030 skills</li>
              <li>Complete at least 5 skill demonstrations</li>
            </ul>

            <div className="pt-4">
              <Link href="/admin">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success - render dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Button>
          </Link>
        </div>

        {/* Dashboard */}
        <SingleUserDashboard userId={userId} profile={profileData} />
      </div>
    </div>
  )
}

/**
 * Main page component with Suspense wrapper
 */
export default function SkillsProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-lg font-medium text-gray-900">Loading...</p>
        </div>
      </div>
    }>
      <SkillsProfileContent />
    </Suspense>
  )
}
