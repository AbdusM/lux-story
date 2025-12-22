'use client'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, TrendingDown, Lock, Clock } from 'lucide-react'
import type { SkillProfile } from '@/lib/skill-profile-adapter'

interface InterventionTriggersProps {
    profile: SkillProfile
    adminViewMode: 'family' | 'research'
}

export function InterventionTriggers({ profile, adminViewMode }: InterventionTriggersProps) {
    const triggers: React.ReactNode[] = []

    // Logic 1: High Potential, Low Readiness (The "Gap Trap")
    // User matches well with a career but has significant skill gaps
    const topMatch = profile.careerMatches.sort((a, b) => b.matchScore - a.matchScore)[0]
    if (topMatch && topMatch.matchScore > 85 && topMatch.readiness === 'skill_gaps') {
        triggers.push(
            <Alert key="potential-risk" className="border-amber-500 bg-amber-50">
                <Lock className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-900 font-semibold">High Potential / Skill Gap</AlertTitle>
                <AlertDescription className="text-amber-800 text-sm">
                    {adminViewMode === 'family'
                        ? `Great match for "${topMatch.name}" but key skills need practice.`
                        : `High Match (${topMatch.matchScore}%) for "${topMatch.name}" obstructed by skill gaps.`}
                </AlertDescription>
            </Alert>
        )
    }

    // Logic 2: Stagnation (Velocity Drop)
    // Check if last activity was > 7 days ago (using profile.skillEvolution if available, or just a rough check)
    // We can use the last milestone timestamp if available, or just rely on UrgencySection's data. 
    // But here we only have profile. Let's look at skillDemonstrations timestamps.
    const allDemos = Object.values(profile.skillDemonstrations).flat()
    if (allDemos.length > 0) {
        const lastDemoTime = Math.max(...allDemos.map(d => d.timestamp || 0))
        const daysSinceActive = (Date.now() - lastDemoTime) / (1000 * 60 * 60 * 24)

        if (daysSinceActive > 7) {
            triggers.push(
                <Alert key="stagnation" className="border-red-400 bg-red-50">
                    <Clock className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-900 font-semibold">Engagement Alert</AlertTitle>
                    <AlertDescription className="text-red-800 text-sm">
                        {adminViewMode === 'family'
                            ? 'It’s been over a week since the last career step.'
                            : `Disengagement detected: ${Math.round(daysSinceActive)} days inactive.`}
                    </AlertDescription>
                </Alert>
            )
        }
    }

    // Logic 3: Tunnel Vision (Low Diversity - approximated by skill spread)
    // detailed diversity is in PatternProfile, but we can check if only 1-2 skills are being demoed
    const activeSkillsCount = Object.keys(profile.skillDemonstrations).length
    if (profile.totalDemonstrations > 10 && activeSkillsCount < 4) {
        triggers.push(
            <Alert key="tunnel-vision" className="border-blue-400 bg-blue-50">
                <TrendingDown className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900 font-semibold">Narrow Focus</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm">
                    {adminViewMode === 'family'
                        ? 'Practicing the same few skills repeatedly. Try new scenarios.'
                        : 'Low skill diversity detected. Encourage exploration of new domains.'}
                </AlertDescription>
            </Alert>
        )
    }

    if (triggers.length === 0) return null

    return (
        <div className="space-y-3 mt-4">
            <h4 className="text-sm font-semibold text-gray-700">MIVA 2.0 Intervention Signals</h4>
            {triggers}
        </div>
    )
}
