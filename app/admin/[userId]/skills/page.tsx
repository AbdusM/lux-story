'use client'

import { useAdminDashboard } from '@/components/admin/AdminDashboardContext'
import { SkillsAnalysisCard } from '@/components/admin/SkillsAnalysisCard'
import { SkillGapsAnalysis } from '@/components/admin/SkillGapsAnalysis'
import { SkillProgressionChart } from '@/components/admin/SkillProgressionChart'
import { PedagogicalImpactCard } from '@/components/admin/PedagogicalImpactCard'

export default function AdminSkillsPage() {
  const { profile, loading } = useAdminDashboard()

  if (loading || !profile) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
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

