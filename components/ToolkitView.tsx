import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AI_TOOLS, AITool } from '@/lib/ai-tools'
import { useGameSelectors } from '@/lib/game-store'
import { Lock, Cpu, Code, PenTool, Image, Database, Mic, Video, Share2, Briefcase, Sparkles, Terminal, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ToolkitView() {
    const patterns = useGameSelectors.usePatterns()

    // Sort tools: Unlocked first, then by required level
    const sortedTools = useMemo(() => {
        return [...AI_TOOLS].sort((a, b) => {
            const aUnlocked = patterns[a.requiredPattern] >= a.requiredLevel
            const bUnlocked = patterns[b.requiredPattern] >= b.requiredLevel
            if (aUnlocked && !bUnlocked) return -1
            if (!aUnlocked && bUnlocked) return 1
            return a.requiredLevel - b.requiredLevel
        })
    }, [patterns])

    const unlockedCount = AI_TOOLS.filter(t => patterns[t.requiredPattern] >= t.requiredLevel).length

    return (
        <div className="relative p-6 pb-20 space-y-8 min-h-full">
            {/* Background Schematic Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('/grid-pattern.svg')] bg-[size:50px_50px]" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />

            <header className="relative">
                <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-5 h-5 text-emerald-500 animate-pulse" />
                    <h2 className="text-xs font-bold text-emerald-500/80 uppercase tracking-[0.2em] font-mono">
                        System Architecture
                    </h2>
                </div>
                <h1 className="text-3xl font-bold text-white font-mono tracking-tighter mb-2">
                    NEURAL<span className="text-emerald-500">_DECK</span>
                </h1>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        ONLINE: {unlockedCount}
                    </span>
                    <span className="flex items-center gap-1.5 opacity-60">
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                        OFFLINE: {AI_TOOLS.length - unlockedCount}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 relative z-10">
                {sortedTools.map((tool, i) => (
                    <ToolSchematic
                        key={tool.id}
                        tool={tool}
                        index={i}
                        isUnlocked={patterns[tool.requiredPattern] >= tool.requiredLevel}
                    />
                ))}
            </div>
        </div>
    )
}

function ToolSchematic({ tool, isUnlocked, index }: { tool: AITool, isUnlocked: boolean, index: number }) {
    const CategoryIcon = getCategoryIcon(tool.category)
    const globalFlags = useGameSelectors.useGlobalFlags()

    const isPromptUnlocked = tool.goldenPrompt && (
        !tool.goldenPrompt.requiredFlag ||
        globalFlags.includes(tool.goldenPrompt.requiredFlag)
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "relative group overflow-hidden transition-all duration-500",
                "border-l-2 bg-slate-950/80 backdrop-blur-sm",
                isUnlocked
                    ? "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                    : "border-slate-800 opacity-70 grayscale-[0.5]"
            )}
        >
            {/* Corner Markers (Tech UI) */}
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20" />

            <div className="p-5">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 flex items-center justify-center border",
                            "bg-gradient-to-br from-black to-slate-900",
                            isUnlocked ? "border-emerald-500/30 text-emerald-400" : "border-slate-800 text-slate-600"
                        )}>
                            <CategoryIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={cn(
                                    "text-lg font-bold font-mono tracking-tight",
                                    isUnlocked ? "text-white" : "text-slate-500"
                                )}>
                                    {tool.name}
                                </h3>
                                {isUnlocked && <Shield className="w-3 h-3 text-emerald-500" />}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm uppercase font-bold tracking-widest text-slate-500 bg-slate-900 px-2 py-0.5 border border-slate-800 rounded-sm">
                                    REQ: {tool.requiredPattern} {tool.requiredLevel}
                                </span>
                                <span className="text-xs font-mono text-slate-600">
                                    v.{tool.requiredLevel}.0.1
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status indicator */}
                    <div className={cn(
                        "px-2 py-1 text-xs font-bold uppercase tracking-widest border",
                        isUnlocked
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/30"
                            : "border-slate-800 text-slate-600 bg-black/50"
                    )}>
                        {isUnlocked ? "INSTALLED" : "LOCKED"}
                    </div>
                </div>

                {isUnlocked ? (
                    <div className="space-y-4 relative">
                        {/* Connecting Line Decoration */}
                        <div className="absolute top-0 left-6 bottom-0 w-px bg-emerald-500/10 -z-10" />

                        <div className="pl-6 space-y-4">
                            <p className="text-sm text-slate-300 leading-relaxed font-sans border-l-2 border-emerald-500/20 pl-4">
                                {tool.description}
                            </p>

                            {/* Data Modules */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-800/50 border border-slate-800">
                                <div className="bg-slate-950 p-3 relative group/mod">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/mod:opacity-100 transition-opacity" />
                                    <h4 className="text-xs text-emerald-500/70 uppercase tracking-widest font-bold mb-1 font-mono">
                                        {'// STATION_PROTOCOL'}
                                    </h4>
                                    <p className="text-xs text-slate-400 font-mono">{tool.luxParallel}</p>
                                </div>
                                <div className="bg-slate-950 p-3 relative group/mod">
                                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover/mod:opacity-100 transition-opacity" />
                                    <h4 className="text-xs text-cyan-500/70 uppercase tracking-widest font-bold mb-1 font-mono">
                                        {'// REALITY_LINK'}
                                    </h4>
                                    <p className="text-xs text-slate-400">{tool.realWorldUse}</p>
                                </div>
                            </div>

                            {/* GOLDEN PROMPT SECTION */}
                            {tool.goldenPrompt && (
                                isPromptUnlocked ? (
                                    <GoldenPromptSchematic prompt={tool.goldenPrompt} />
                                ) : (
                                    <div className="mt-4 border border-dashed border-slate-800 bg-black/30 p-3 flex items-center gap-3">
                                        <Lock className="w-4 h-4 text-slate-600" />
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Golden Prompt Encrypted</h4>
                                            <p className="text-sm text-slate-600">Run simulation to decrypt artifact.</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 p-3 bg-black/40 border border-slate-800/50">
                        <p className="text-xs text-slate-500">
                            {tool.description}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

function GoldenPromptSchematic({ prompt }: { prompt: NonNullable<AITool['goldenPrompt']> }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="mt-4 border border-amber-500/20 bg-amber-950/5 relative overflow-hidden group">
            {/* Header */}
            <div className="px-3 py-1.5 bg-amber-950/20 border-b border-amber-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-sm font-bold text-amber-500 uppercase tracking-widest font-mono">
                        GOLDEN_ARTIFACT.txt
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400/70 hover:text-amber-200 transition-colors"
                >
                    {copied ? "COPIED" : "EXTRACT"}
                </button>
            </div>

            <div className="p-3">
                <h4 className="text-xs font-bold text-slate-300 mb-2">{prompt.title}</h4>
                <div className="relative">
                    <pre className="text-sm font-mono leading-relaxed text-amber-100/70 whitespace-pre-wrap break-words border-l-2 border-amber-500/20 pl-3">
                        {prompt.content}
                    </pre>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center bg-black/20 p-1.5">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mr-2">CONTEXT:</span>
                    <p className="text-sm text-slate-400 italic">
                        {prompt.usageContext}
                    </p>
                </div>
            </div>
        </div>
    )
}

function getCategoryIcon(category: string) {
    switch (category) {
        case 'coding': return Code
        case 'writing': return PenTool
        case 'image': return Image
        case 'data': return Database
        case 'audio': return Mic
        case 'video': return Video
        case 'marketing': return Share2
        case 'productivity': return Briefcase
        default: return Cpu
    }
}
