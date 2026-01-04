import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AI_TOOLS, AITool } from '@/lib/ai-tools'
import { useGameSelectors } from '@/lib/game-store'
import { Lock, Cpu, Code, PenTool, Image, Database, Mic, Video, Share2, Briefcase, Sparkles, Copy, Check } from 'lucide-react'
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
        <div className="p-6 pb-20 space-y-8">
            <header>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 font-serif mb-2">
                    Future Toolkit
                </h2>
                <p className="text-sm text-slate-400 max-w-xs">
                    Real-world technologies mirrored by your station capabilities.
                    <span className="block mt-1 text-emerald-400 font-bold">
                        Unlocked: {unlockedCount} / {AI_TOOLS.length}
                    </span>
                </p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {sortedTools.map((tool) => (
                    <ToolCard
                        key={tool.id}
                        tool={tool}
                        isUnlocked={patterns[tool.requiredPattern] >= tool.requiredLevel}
                    />
                ))}
            </div>
        </div>
    )
}

function ToolCard({ tool, isUnlocked }: { tool: AITool, isUnlocked: boolean }) {
    const CategoryIcon = getCategoryIcon(tool.category)
    const globalFlags = useGameSelectors.useGlobalFlags()

    // Key Logic: Prompt is unlocked if it has no flag OR if the flag is present
    const isPromptUnlocked = tool.goldenPrompt && (
        !tool.goldenPrompt.requiredFlag ||
        globalFlags.includes(tool.goldenPrompt.requiredFlag)
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative rounded-xl border p-4 transition-all duration-300",
                isUnlocked
                    ? "bg-slate-900/80 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : "bg-slate-900/40 border-slate-800"
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isUnlocked ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-800 text-slate-600"
                    )}>
                        <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className={cn(
                            "font-bold text-lg leading-none mb-1",
                            isUnlocked ? "text-slate-100" : "text-slate-500"
                        )}>
                            {tool.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold bg-slate-800/50 px-2 py-0.5 rounded">
                                {tool.category}
                            </span>
                            {isUnlocked && (
                                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                                    <Cpu className="w-3 h-3" />
                                    Active
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {!isUnlocked && (
                    <div className="flex items-center gap-1 text-xs text-amber-500/80 font-mono bg-amber-900/10 px-2 py-1 rounded border border-amber-500/20">
                        <Lock className="w-3 h-3" />
                        <span>{tool.requiredPattern.toUpperCase()} {tool.requiredLevel}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            {isUnlocked ? (
                <div className="space-y-3">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {tool.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                            <h4 className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold mb-1">Station Parallel</h4>
                            <p className="text-xs text-slate-400 font-mono">{tool.luxParallel}</p>
                        </div>
                        <div className="bg-emerald-950/20 rounded-lg p-3 border border-emerald-900/30">
                            <h4 className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Real World Use</h4>
                            <p className="text-xs text-emerald-100/70">{tool.realWorldUse}</p>
                        </div>
                    </div>

                    {/* GOLDEN PROMPT SECTION */}
                    {tool.goldenPrompt && (
                        isPromptUnlocked ? (
                            <GoldenPromptCard prompt={tool.goldenPrompt} />
                        ) : (
                            <div className="mt-4 border border-slate-800 bg-slate-950/30 rounded-lg p-3 flex items-center gap-3 opacity-60">
                                <Lock className="w-4 h-4 text-slate-500" />
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Golden Prompt Locked</h4>
                                    <p className="text-[10px] text-slate-500">Complete the Toolkit Simulation to unlock this artifact.</p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="mt-4 pt-4 border-t border-slate-800/50">
                    <p className="text-xs text-slate-600 italic">
                        Align your neural patterns to {tool.requiredPattern} to decrypt this capability.
                    </p>
                </div>
            )}
        </motion.div>
    )
}

function GoldenPromptCard({ prompt }: { prompt: NonNullable<AITool['goldenPrompt']> }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="mt-4 border border-amber-500/20 bg-amber-950/10 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-amber-950/30 border-b border-amber-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Golden Prompt Artifact</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[10px] font-medium text-amber-300 hover:text-amber-100 transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            Copy to Reality
                        </>
                    )}
                </button>
            </div>

            <div className="p-3 space-y-2">
                <h4 className="text-sm font-semibold text-slate-200">{prompt.title}</h4>
                <div className="relative group">
                    <pre className="text-xs font-mono text-amber-100/80 bg-black/40 p-2 rounded border border-amber-500/10 whitespace-pre-wrap break-words">
                        {prompt.content}
                    </pre>
                </div>
                <p className="text-[10px] text-slate-500 italic border-l-2 border-slate-700 pl-2">
                    Usage: {prompt.usageContext}
                </p>
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
