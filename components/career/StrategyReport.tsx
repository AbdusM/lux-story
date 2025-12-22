import { generateCareerProfile } from '@/lib/career-translation'
import { GameState } from '@/lib/character-state'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

/**
 * STRATEGY REPORT
 * A "Reality Interface" Artifact
 * 
 * Renders the player's game journey as a professional strategic profile.
 * Optimized for @media print to export as PDF.
 */

interface StrategyReportProps {
    gameState: GameState
    onClose?: () => void
}

export function StrategyReport({ gameState, onClose }: StrategyReportProps) {
    const profile = generateCareerProfile(gameState)

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto print:overflow-visible print:bg-white animate-in fade-in duration-200">
            {/* Screen-only Controls */}
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white border-b shadow-sm print:hidden">
                <h2 className="font-semibold text-slate-800">Career Strategy Profile</h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={handlePrint} className="bg-slate-900 text-white hover:bg-slate-700">
                        <Printer className="w-4 h-4 mr-2" />
                        Export to PDF
                    </Button>
                </div>
            </div>

            {/* The Document A4 / Letter */}
            <div className="max-w-[210mm] w-full mx-auto min-h-[297mm] p-6 sm:p-[15mm] bg-white shadow-2xl my-4 sm:my-8 print:shadow-none print:my-0 print:p-0 print:max-w-none">

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
                <footer className="mt-20 pt-6 border-t border-slate-200 flex justify-between text-xs text-slate-400">
                    <span>Confidential Assessment</span>
                    <span>Grand Central Terminus • ID: {gameState.playerId.slice(0, 8)}</span>
                </footer>

            </div>

            {/* Print Styles helper */}
            <style jsx global>{`
        @media print {
          @page { margin: 15mm; }
          body { background: white; }
        }
      `}</style>
        </div>
    )
}
