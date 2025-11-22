'use client'

import { SkillsAnalysisCard } from '@/components/admin/SkillsAnalysisCard'
import { SkillGapsAnalysis } from '@/components/admin/SkillGapsAnalysis'
import { SkillProgressionChart } from '@/components/admin/SkillProgressionChart'
import { PedagogicalImpactCard } from '@/components/admin/PedagogicalImpactCard'
import { useAdminDashboard } from '@/components/admin/AdminDashboardContext'

export default function AdminSkillsPage() {
  const { profile, loading } = useAdminDashboard()

  if (loading || !profile) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsAnalysisCard profile={profile} />
        <SkillGapsAnalysis
          skillGaps={profile.skillGaps}
          totalDemonstrations={profile.totalDemonstrations}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkillProgressionChart
            skillDemonstrations={profile.skillDemonstrations}
            totalDemonstrations={profile.totalDemonstrations}
          />
        </div>
        <div className="lg:col-span-1">
          <PedagogicalImpactCard />
        </div>
      </div>
    </div>
  )
}

