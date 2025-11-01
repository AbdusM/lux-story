'use client'

import { use } from 'react'
import { UrgencySection } from '@/components/admin/sections/UrgencySection'
import { useAdminDashboard } from '@/components/admin/AdminDashboardContext'

export default function UrgencyPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const { profile, adminViewMode, loading } = useAdminDashboard()

  if (loading || !profile) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return <UrgencySection userId={userId} profile={profile} adminViewMode={adminViewMode} />
}

