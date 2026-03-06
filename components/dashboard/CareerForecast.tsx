"use client"

import React, { useMemo } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  getCanonicalCareerRecommendations,
  type CanonicalCareerRecommendation,
} from '@/lib/canonical-career-analysis'
import { useGameStore } from '@/lib/game-store'
import { motion } from 'framer-motion'
import { Briefcase, TrendingUp, AlertCircle, User } from 'lucide-react'

interface CareerForecastProps {
    className?: string
    limit?: number
}

export function CareerForecast({ className, limit = 3 }: CareerForecastProps) {
    const skills = useGameStore(state => state.skills)
    const patterns = useGameStore(state => state.patterns)

    // Calculate recommendations
    const recommendations = useMemo(() => {
        if (!skills || !patterns) return []
        return getCanonicalCareerRecommendations(skills, limit)
    }, [skills, limit, patterns])

    if (recommendations.length === 0) {
        return (
            <Card className={`${className} bg-slate-950 border-slate-800`}>
                <CardContent className="pt-6 text-center text-slate-500">
                    Not enough data for career forecast yet.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`${className} bg-slate-950 border-slate-800`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                    Career Forecast
                </CardTitle>
                <CardDescription>
                    Based on your current patterns and skill development
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {recommendations.map((rec, index) => (
                    <CareerItem key={rec.id} recommendation={rec} index={index} />
                ))}
            </CardContent>
        </Card>
    )
}

function CareerItem({
    recommendation,
    index,
}: {
    recommendation: CanonicalCareerRecommendation
    index: number
}) {
    const gapCount = Object.values(recommendation.requiredSkills).filter(({ gap }) => gap > 0).length

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h4 className="font-medium text-slate-200">{recommendation.name}</h4>
                    <p className="text-xs text-slate-500">{recommendation.sector}</p>
                </div>
                <div className="text-right">
                    <span className={`text-lg font-bold ${getScoreColor(recommendation.confidenceScore)}`}>
                        {recommendation.confidenceScore}%
                    </span>
                    <span className="text-xs text-slate-500 block">Match</span>
                </div>
            </div>

            <Progress
                value={recommendation.confidenceScore}
                className="h-2 bg-slate-800"
                indicatorClassName={getProgressBarColor(recommendation.confidenceScore)}
            />

            <div className="flex flex-wrap gap-2 mt-2">
                {recommendation.evidenceForMatch.slice(0, 2).map((reason, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] bg-emerald-950/30 border-emerald-900 text-emerald-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {reason}
                    </Badge>
                ))}
                <Badge variant="outline" className="text-[10px] bg-sky-950/30 border-sky-900 text-sky-300">
                    {formatReadiness(recommendation.readiness)}
                </Badge>
                {gapCount > 0 && (
                    <Badge variant="outline" className="text-[10px] bg-amber-950/30 border-amber-900 text-amber-400">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Gaps: {gapCount}
                    </Badge>
                )}
            </div>

            {recommendation.localOpportunities[0] && (
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Next stop: <span className="text-slate-300">{recommendation.localOpportunities[0]}</span></span>
                </div>
            )}
        </motion.div>
    )
}

function formatReadiness(readiness: CanonicalCareerRecommendation['readiness']): string {
    if (readiness === 'near_ready') return 'Near Ready'
    if (readiness === 'developing') return 'Developing'
    return 'Exploring'
}

function getScoreColor(score: number): string {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-slate-400'
}

function getProgressBarColor(score: number): string {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-slate-500'
}
