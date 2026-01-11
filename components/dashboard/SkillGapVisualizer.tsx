"use client"

import React, { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { analyzeSkillGaps } from '@/lib/assessment-derivatives'
import { useGameStore } from '@/lib/game-store'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'

interface SkillGapVisualizerProps {
    careerId: string
    height?: number
}

export function SkillGapVisualizer({ careerId, height = 300 }: SkillGapVisualizerProps) {
    const skills = useGameStore(state => state.skills)

    const analysis = useMemo(() => {
        if (!skills) return null
        return analyzeSkillGaps(careerId, skills as unknown as Record<string, number>)
    }, [careerId, skills])

    if (!analysis) return null

    // Transform data for Radar Chart
    // Combine strengths and gaps
    const chartData = [
        ...analysis.strengths.map(s => ({
            subject: s.skillName,
            A: s.level, // Current
            B: 5,       // Max Scale (assuming 5 is mastery for viz) // Ideally should be req.measure but using 5 for radar scale
            fullMark: 5
        })),
        ...analysis.gaps.map(g => ({
            subject: g.skillName,
            A: g.currentLevel,
            B: g.requiredLevel, // Required
            fullMark: 5
        }))
    ]

    // If chartData is empty, return message
    if (chartData.length === 0) return null

    return (
        <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                    <Radar
                        name="You"
                        dataKey="A"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                    />
                    <Radar
                        name="Required"
                        dataKey="B"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0} // Outline only for requirement
                        strokeDasharray="4 4"
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
