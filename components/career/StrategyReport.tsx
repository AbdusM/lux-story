import { useState } from 'react'
import { generateCareerProfile } from '@/lib/career-translation'
import { GameState } from '@/lib/character-state'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Printer, Network, FileText, TrendingUp, BarChart3, Brain } from 'lucide-react'
import { SkillTransferGraph } from '../visualizations/SkillTransferGraph'
import { NeuroHexagon } from '@/components/visualizations/NeuroHexagon'
import { SKILL_NODES, SkillCluster } from '@/lib/constellation/skill-positions'
import { CareerForecast } from '../dashboard/CareerForecast'
import { SkillGapVisualizer } from '../dashboard/SkillGapVisualizer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * STRATEGY REPORT
 * A "Reality Interface" Artifact
 * 
 * Renders the player's game journey as a professional strategic profile.
 * Now includes interactive visualizations for digital viewing.
 */

interface StrategyReportProps {
    gameState: GameState
    onClose?: () => void
}

export function StrategyReport({ gameState, onClose }: StrategyReportProps) {
    const profile = generateCareerProfile(gameState)

    // Calculate Neuro-Cognitive Cluster Stats
    const clusterStats = {
        mind: 0, heart: 0, voice: 0, hands: 0, compass: 0, craft: 0
    }
    const clusterMax = { ...clusterStats }

    SKILL_NODES.forEach(node => {
        if (node.cluster === 'center') return
        // @ts-ignore - Indexing
        const level = gameState.skills[node.id] || 0
        // @ts-ignore
        clusterStats[node.cluster] += level
        // @ts-ignore
        clusterMax[node.cluster] += 5
    })

    // Normalize
    const neuroStats = {
        mind: clusterMax.mind > 0 ? Math.round((clusterStats.mind / clusterMax.mind) * 100) : 0,
        heart: clusterMax.heart > 0 ? Math.round((clusterStats.heart / clusterMax.heart) * 100) : 0,
        voice: clusterMax.voice > 0 ? Math.round((clusterStats.voice / clusterMax.voice) * 100) : 0,
        hands: clusterMax.hands > 0 ? Math.round((clusterStats.hands / clusterMax.hands) * 100) : 0,
        compass: clusterMax.compass > 0 ? Math.round((clusterStats.compass / clusterMax.compass) * 100) : 0,
        craft: clusterMax.craft > 0 ? Math.round((clusterStats.craft / clusterMax.craft) * 100) : 0
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm overflow-y-auto print:overflow-visible print:bg-white animate-in fade-in duration-200">
            {/* Screen-only Controls */}
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800 shadow-sm print:hidden">
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-slate-100">Career Strategy Profile</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        Terminus ID: {gameState.playerId.slice(0, 8)}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose} className="border-slate-700 text-slate-300 hover:bg-slate-800">Close</Button>
                    <Button onClick={handlePrint} className="bg-emerald-600 text-white hover:bg-emerald-700">
                        <Printer className="w-4 h-4 mr-2" />
                        Export PDF
                    </Button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6">
                <Tabs defaultValue="report" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-900/50 p-1 border border-slate-800 print:hidden">
                        <TabsTrigger value="report" className="data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 text-slate-400">
                            <FileText className="w-4 h-4 mr-2" />
                            Executive Report
                        </TabsTrigger>
                        <TabsTrigger value="visuals" className="data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 text-slate-400">
                            <Network className="w-4 h-4 mr-2" />
                            Signal Visualization
                        </TabsTrigger>
                        <TabsTrigger value="neuro" className="data-[state=active]:bg-slate-800 data-[state=active]:text-purple-400 text-slate-400">
                            <Brain className="w-4 h-4 mr-2" />
                            Neuro-Cognitive
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: EXECUTIVE REPORT (The Printer Friendly Artifact) */}
                    <TabsContent value="report" className="outline-none">
                        <div className="bg-white text-slate-900 max-w-[210mm] mx-auto min-h-[297mm] p-8 sm:p-[15mm] shadow-2xl print:shadow-none print:my-0 print:p-0 print:max-w-none print:w-full">
                            {/* Header */}
                            <header className="border-b-2 border-slate-900 pb-6 mb-8">
                                <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight mb-2">
                                    Core Signal Analysis
                                </h1>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-lg font-medium text-slate-600">Operator Designation</p>
                                        <p className="text-sm text-slate-400 mt-1">Origin: Lux Story Simulation</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900">{profile.strategicRole}</p>
                                        <p className="text-slate-500 font-medium">{profile.archetypeLabel}</p>
                                    </div>
                                </div>
                            </header>

                            {/* Executive Summary */}
                            <section className="mb-10">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-1">
                                    Executive Summary
                                </h3>
                                <p className="text-slate-800 leading-relaxed text-justify">
                                    {profile.executiveSummary}
                                </p>
                            </section>

                            {/* Evidence of Capability */}
                            <section className="mb-10">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-1">
                                    Evidence of Strategic Capability
                                </h3>
                                <ul className="space-y-3">
                                    {profile.evidencePoints.map((point, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="mr-3 text-slate-900 mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-900 flex-shrink-0" />
                                            <span className="text-slate-700">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Core Competencies (2 Col) */}
                            <section className="mb-10">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-1">
                                    Verified Competencies (WEF 2030 Framework)
                                </h3>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                    {profile.coreCompetencies.map((skill, i) => (
                                        <div key={i} className="flex items-center justify-between border-b border-slate-50 py-1">
                                            <span className="text-slate-800 font-medium">{skill}</span>
                                            <span className="text-xs text-slate-400">VERIFIED</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Footer */}
                            <footer className="mt-20 pt-6 border-t border-slate-200 flex justify-between text-xs text-slate-400 animate-in fade-in">
                                <span>Confidential Assessment</span>
                                <span>Terminus • ID: {gameState.playerId.slice(0, 8)}</span>
                            </footer>
                        </div>
                    </TabsContent>

                    {/* TAB 2: INTERACTIVE VISUALIZATIONS (The Data Viz) */}
                    <TabsContent value="visuals" className="space-y-6 print:hidden">

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Col: Career Forecast */}
                            <div className="lg:col-span-1 space-y-6">
                                <CareerForecast />
                            </div>

                            {/* Right Col: The Network Graph */}
                            <div className="lg:col-span-2">
                                <Card className="bg-slate-950 border-slate-800 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-slate-100 flex items-center gap-2">
                                            <Network className="w-5 h-5 text-blue-400" />
                                            Skill Transfer Network
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 flex justify-center bg-slate-900/50 rounded-b-xl overflow-hidden min-h-[500px]">
                                        <SkillTransferGraph width={600} height={500} className="w-full h-full" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Bottom Row: Gap Analysis for Top Career */}
                        <Card className="bg-slate-950 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-slate-100 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-purple-400" />
                                    Gap Analysis (Top Match)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* We need to fetch the top career to pass to the visualizer */}
                                {/* For now, hardcoding a "smart" selection or just the first recommended */}
                                {/* In a real app, we'd lift state or use a store selector, but here we can just pick one */}
                                <SkillGapVisualizerWrapper />
                            </CardContent>
                        </Card>

                        {/* TAB 3: NEURO-COGNITIVE (The Brain Hexagon) */}
                        <TabsContent value="neuro" className="space-y-6 print:hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-slate-950 border-slate-800">
                                    <CardHeader>
                                        <CardTitle className="text-slate-100 flex items-center gap-2">
                                            <Brain className="w-5 h-5 text-purple-400" />
                                            Cognitive Architecture
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex justify-center p-6">
                                        <NeuroHexagon stats={neuroStats} />
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-950 border-slate-800">
                                    <CardHeader>
                                        <CardTitle className="text-slate-100">Profile Interpretation</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-slate-400 text-sm space-y-4">
                                        <p>
                                            Your neural profile indicates a strong inclination towards
                                            <span className="text-purple-300"> {
                                                Object.entries(neuroStats).sort(([, a], [, b]) => b - a)[0][0].toUpperCase()
                                            }</span> processing.
                                        </p>
                                        <p>
                                            The hexagon visualization maps your demonstrated competencies across six key cognitive domains. A balanced shape indicates generalist adaptability, while specific spikes indicate specialized neural pathways.
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {Object.entries(neuroStats)
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 4)
                                                .map(([key, val]) => (
                                                    <div key={key} className="flex justify-between border-b border-slate-800 py-1">
                                                        <span className="capitalize">{key}</span>
                                                        <span className="text-slate-200">{val}%</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                </Tabs>
            </div>

            {/* Print Styles helper */}
            <style jsx global>{`
                @media print {
                  @page { margin: 0; }
                  body { background: white; }
                  /* Hide all UI except the report tab content */
                  /* We can rely on print:hidden classes mostly */
                }
            `}</style>
        </div>
    )
}

import { getCareerRecommendations } from '@/lib/assessment-derivatives'
import { useGameStore } from '@/lib/game-store'

function SkillGapVisualizerWrapper() {
    // Wrapper to get the top career ID from the store logic
    const skills = useGameStore(state => state.skills)
    const patterns = useGameStore(state => state.patterns)

    // We try to find the top recommended career
    // This logic mimics CareerForecast but just grabs the first ID
    const recommendations = patterns && skills ? getCareerRecommendations(patterns, skills as unknown as Record<string, number>, 1) : []
    const topCareerId = recommendations.length > 0 ? recommendations[0].career.id : null

    if (!topCareerId) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center text-slate-500">
                Play more to unlock career insights.
            </div>
        )
    }

    return (
        <div className="h-[400px] w-full">
            <SkillGapVisualizer careerId={topCareerId} height={350} />
            <p className="text-center text-xs text-slate-500 mt-2">
                Comparing against: <span className="text-slate-300 font-medium capitalize">{topCareerId.replace(/_/g, ' ')}</span> requirements
            </p>
        </div>
    )
}
