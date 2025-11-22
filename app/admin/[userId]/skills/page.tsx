'use client'

// TODO: This page needs to fetch profile data and pass to components
import { SkillsAnalysisCard } from '@/components/admin/SkillsAnalysisCard'
import { SkillGapsAnalysis } from '@/components/admin/SkillGapsAnalysis'
import { SkillProgressionChart } from '@/components/admin/SkillProgressionChart'
import { PedagogicalImpactCard } from '@/components/admin/PedagogicalImpactCard'

export default function AdminSkillsPage() {
  // TODO: Fetch user data based on userId from params
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* @ts-expect-error - TODO: Pass profile prop */}
        <SkillsAnalysisCard />
        {/* @ts-expect-error - TODO: Pass skillGaps and totalDemonstrations props */}
        <SkillGapsAnalysis />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* @ts-expect-error - TODO: Pass skillDemonstrations and totalDemonstrations props */}
          <SkillProgressionChart />
        </div>
        <div className="lg:col-span-1">
          <PedagogicalImpactCard />
        </div>
      </div>
    </div>
  )
}

