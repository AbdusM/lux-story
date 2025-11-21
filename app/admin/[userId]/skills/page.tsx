'use client'

import { SkillsAnalysisCard } from '@/components/admin/SkillsAnalysisCard'
import { SkillGapsAnalysis } from '@/components/admin/SkillGapsAnalysis'
import { SkillProgressionChart } from '@/components/admin/SkillProgressionChart'
import { PedagogicalImpactCard } from '@/components/admin/PedagogicalImpactCard'

export default function AdminSkillsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsAnalysisCard />
        <SkillGapsAnalysis />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkillProgressionChart />
        </div>
        <div className="lg:col-span-1">
          <PedagogicalImpactCard />
        </div>
      </div>
    </div>
  )
}

