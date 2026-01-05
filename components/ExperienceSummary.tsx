"use client"

import { CharacterId } from "@/lib/graph-registry"


export interface ArcLearningObjective {
    skill: string
    howYouShowedIt: string
    whyItMatters: string
}

export interface ExperienceSummaryData {
    characterName: string
    characterArc: CharacterId
    arcTheme: string
    skillsDeveloped: ArcLearningObjective[]
    keyInsights: string[]
    trustLevel: number
    relationshipStatus: string
    dominantPattern: string
    profile?: import('@/lib/skill-profile-adapter').SkillProfile
}

// Minimal implementation to satisfy build requirements
export const ExperienceSummary: React.FC<{
    data: ExperienceSummaryData
    onClose: () => void
}> = ({ data, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full">
                <h2 className="text-2xl font-bold text-white mb-4">Experience Summary: {data.characterName}</h2>
                <p className="text-slate-300 mb-4">{data.arcTheme}</p>

                <div className="space-y-4 mb-6">
                    <h3 className="text-xl font-semibold text-amber-500">Skills Developed</h3>
                    {data.skillsDeveloped.map((skill, i) => (
                        <div key={i} className="bg-slate-800 p-3 rounded">
                            <div className="font-bold text-slate-200">{skill.skill}</div>
                            <div className="text-sm text-slate-400">{skill.whyItMatters}</div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
                >
                    Continue Journey
                </button>
            </div>
        </div>
    )
}
