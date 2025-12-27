'use client'

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { SkillEvolutionPoint } from '@/lib/skill-profile-adapter'
import { format } from 'date-fns'

interface SkillAcquisitionTimelineProps {
    data: SkillEvolutionPoint[]
    adminViewMode: 'family' | 'research'
}

export function SkillAcquisitionTimeline({ data, adminViewMode }: SkillAcquisitionTimelineProps) {
    // Format data for chart
    const formattedData = data.map(point => ({
        ...point,
        date: format(new Date(point.timestamp), 'MMM d'),
        label: point.checkpoint
    }))

    return (
        <Card className="shadow-md border-2 border-slate-200">
            <CardHeader>
                <CardTitle className="text-xl">Skill Acquisition Velocity</CardTitle>
                <CardDescription>
                    {adminViewMode === 'family'
                        ? 'Tracking the pace of skill development over their journey.'
                        : 'Longitudinal analysis of skill unlock velocity (MIVA 2.0 Standard).'}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={formattedData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorDemos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                            formatter={(value) => [`${value} Skills`, 'Total Demonstrations']}
                        />
                        <Area
                            type="monotone"
                            dataKey="totalDemonstrations"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorDemos)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
