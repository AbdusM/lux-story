import { useState } from 'react'
import { motion } from 'framer-motion'
import { DialogueNode } from '@/lib/dialogue-graph'
import { Card } from '@/components/ui/card'
import {
    Terminal, Cpu, MessageSquare, Activity,
    Palette, LayoutDashboard, Code, MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SimulationRendererProps {
    node: DialogueNode
    onChoice: (choiceIndex: number) => void
}

export function SimulationRenderer({ node, onChoice }: SimulationRendererProps) {
    const config = node.simulation
    if (!config) return null

    // --- RENDER HELPERS ---

    const renderHeaderIcon = () => {
        switch (config.type) {
            case 'chat_negotiation':
                return <MessageSquare className="w-5 h-5 text-emerald-400" />
            case 'dashboard_triage':
            case 'data_analysis':
                return <Activity className="w-5 h-5 text-blue-400" />
            case 'visual_canvas':
            case 'creative_direction':
                return <Palette className="w-5 h-5 text-purple-400" />
            default: // code, prompt, system
                return <Terminal className="w-5 h-5 text-indigo-400" />
        }
    }

    const renderHeadeTitle = () => {
        return config.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }

    const renderContentArea = () => {
        const content = config.initialContext.content

        // 1. CHAT INTERFACE (Slack/Teams/SMS style)
        if (config.type === 'chat_negotiation') {
            return (
                <div className="flex flex-col gap-3 p-4 bg-slate-900/40 min-h-[200px]">
                    <div className="flex items-start gap-3 opacity-70">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-300">SYS</span>
                        </div>
                        <div className="bg-slate-800 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                            <p className="text-xs text-slate-400 mb-1">System • Now</p>
                            <p className="text-sm text-slate-300">{content}</p>
                        </div>
                    </div>
                    {/* Mock "Typing" indicator to make it feel alive */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-2 mt-auto text-xs text-slate-500 pl-1"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Channel active
                    </motion.div>
                </div>
            )
        }

        // 2. DASHBOARD / TRIAGE (Grid of cards)
        if (config.type === 'dashboard_triage' || config.type === 'data_analysis') {
            return (
                <div className="p-4 bg-slate-950/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Status</div>
                            <div className="text-lg font-mono text-emerald-400">ONLINE</div>
                        </div>
                        <div className="bg-slate-900/80 p-3 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Pending</div>
                            <div className="text-lg font-mono text-amber-400">ACTIVE</div>
                        </div>
                    </div>
                    <div className="font-mono text-sm text-slate-300 bg-slate-900/50 p-3 rounded border border-slate-800/50">
                        {content.split('\n').map((line, i) => (
                            <div key={i} className={cn("mb-1", line.includes('ERROR') ? "text-red-400" : "")}>
                                {line}
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        // 3. VISUAL CANVAS (Placeholder for image gen)
        if (config.type === 'visual_canvas' || config.type === 'creative_direction') {
            return (
                <div className="relative min-h-[200px] flex items-center justify-center bg-grid-white/[0.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
                    <div className="text-center space-y-2 p-6">
                        <Palette className="w-8 h-8 text-purple-500/40 mx-auto" />
                        <p className="text-sm text-purple-200/60 font-medium italic">
                            "{content}"
                        </p>
                        <div className="text-xs text-slate-500 border border-slate-800 rounded-full px-3 py-1 inline-block mt-4">
                            Canvas Empty • Awaiting Prompt
                        </div>
                    </div>
                </div>
            )
        }

        // 4. AUDIO STUDIO (Suno/Udio Waveform)
        if (config.type === 'audio_studio') {
            return (
                <div className="relative min-h-[200px] flex flex-col items-center justify-center bg-slate-950/50">
                    <div className="flex items-end gap-1 h-12 mb-4 opacity-50">
                        {[40, 60, 30, 80, 50, 90, 40, 60, 20, 70, 40, 60].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: '20%' }}
                                animate={{ height: `${h}%` }}
                                transition={{
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    duration: 0.5,
                                    delay: i * 0.1
                                }}
                                className="w-2 bg-indigo-500/50 rounded-full"
                            />
                        ))}
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-xs font-mono text-indigo-300/60 uppercase tracking-widest">
                            Synthesizing Audio...
                        </p>
                        <p className="text-sm text-indigo-200 italic">
                            "{content}"
                        </p>
                    </div>
                </div>
            )
        }

        // DEFAULT: CODE / TERMINAL VIEW
        return (
            <div className="flex flex-col">
                <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-700/50 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">{config.initialContext.label || 'terminal'}</span>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                </div>
                <div className="p-6 font-mono text-sm overflow-y-auto min-h-[150px] max-h-[300px]">
                    <pre className="text-emerald-300 whitespace-pre-wrap">
                        <code>{content}</code>
                    </pre>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 mb-6">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-slate-800",
                        config.type.includes('chat') ? "bg-emerald-500/10" :
                            config.type.includes('visual') ? "bg-purple-500/10" :
                                "bg-indigo-500/10"
                    )}>
                        {renderHeaderIcon()}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                            {renderHeadeTitle()}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">
                            SESSION: {node.nodeId.split('_').pop()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                    <Cpu className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                        LIVE
                    </span>
                </div>
            </div>

            {/* OBJECTIVE CARD */}
            <div className="bg-slate-900/30 p-4 rounded-lg border-l-2 border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Mission Objective</h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                    {config.taskDescription}
                </p>
            </div>

            {/* MAIN INTERFACE CONTAINER */}
            <Card className="flex-1 bg-black/40 border-slate-700/50 overflow-hidden flex flex-col shadow-xl">
                {renderContentArea()}
            </Card>
        </div>
    )
}
