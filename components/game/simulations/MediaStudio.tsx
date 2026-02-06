import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Music, Heart, Zap, Wind, AlertTriangle, Megaphone, FileText, Newspaper } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationComponentProps } from './types'
import { useSynesthesiaEngine } from '@/lib/hooks/use-synesthesia-engine'
import { SynesthesiaTarget } from '@/lib/visualizers/synesthesia-types'

interface MediaStudioProps extends SimulationComponentProps {
    variant?: 'audio_studio' | 'news_feed' // Lira vs Nadia
}

/**
 * MediaStudio - Synesthesia Engine Visualizer
 *
 * For Lira: Audio emotional direction - teaching players to communicate
 * emotional intent to AI audio generators.
 *
 * For Nadia: Headline emotional tone - teaching players to craft
 * emotionally resonant news headlines.
 */
export function MediaStudio({ config, onSuccess, variant = 'audio_studio' }: MediaStudioProps) {
    // Extract target from config or use defaults
    const usingDefaultTarget = !config.initialContext?.target
    const targetConfig: SynesthesiaTarget = (config.initialContext?.target as SynesthesiaTarget) || {
        targetState: {
            tempo: 30,    // Slow
            mood: 25,     // Dark
            texture: 20   // Sparse
        },
        tolerance: 10
    }

    useEffect(() => {
        if (!usingDefaultTarget) return
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[MediaStudio] Missing initialContext.target; using default target profile.', { variant })
        }
    }, [usingDefaultTarget, variant])

    const [state, updateState, { resonance, waveform, isLocked }] = useSynesthesiaEngine({
        target: targetConfig,
        initialState: { tempo: 50, mood: 50, texture: 50 } // Start at neutral
    })

    const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false)

    // Handle Success
    useEffect(() => {
        if (isLocked && !hasTriggeredSuccess) {
            setHasTriggeredSuccess(true)
            setTimeout(() => {
                onSuccess({
                    success: true,
                    score: resonance,
                    data: { parameters: state }
                })
            }, 2000) // 2s delay to admire the lock-in
        }
    }, [isLocked, hasTriggeredSuccess, onSuccess, resonance, state])

    const pathD = waveform
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ')

    // Color based on resonance
    const getResonanceColor = () => {
        if (resonance > 80) return 'text-emerald-400'
        if (resonance > 60) return 'text-amber-400'
        return 'text-slate-400'
    }

    const getWaveColor = () => {
        if (resonance > 80) return '#34d399'
        if (resonance > 60) return '#fbbf24'
        return '#94a3b8'
    }

    // --- VARIANT CONFIGURATION ---
    const isAudio = variant === 'audio_studio'

    const labels = isAudio ? {
        title: 'Synesthesia Engine',
        param1: { label: 'Tempo', low: 'Slow', high: 'Fast', icon: Zap },
        param2: { label: 'Mood', low: 'Dark', high: 'Bright', icon: Heart },
        param3: { label: 'Texture', low: 'Sparse', high: 'Dense', icon: Wind },
        hint: '"The music knows something is wrong before she does..."',
        mainIcon: Music
    } : {
        title: 'Headline Studio',
        param1: { label: 'Urgency', low: 'Calm', high: 'Panic', icon: AlertTriangle },
        param2: { label: 'Tone', low: 'Objective', high: 'Sensational', icon: Megaphone },
        param3: { label: 'Nuance', low: 'Simple', high: 'Complex', icon: FileText },
        hint: '"Find the emotional truth in the headline..."',
        mainIcon: Newspaper
    }

    // Param 1 (Tempo/Urgency) Slider Class
    const param1Color = isAudio ? "accent-purple-500 hover:accent-purple-400" : "accent-orange-500 hover:accent-orange-400"
    // Param 2 (Mood/Tone) Slider Class
    const param2Color = isAudio ? "accent-rose-500 hover:accent-rose-400" : "accent-red-500 hover:accent-red-400"
    // Param 3 (Texture/Nuance) Slider Class
    const param3Color = isAudio ? "accent-cyan-500 hover:accent-cyan-400" : "accent-blue-500 hover:accent-blue-400"


    return (
        <div className="space-y-6">
            {/* Header / Status */}
            <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                    <labels.mainIcon className={cn("w-5 h-5", isLocked ? "text-emerald-400" : "text-purple-400")} />
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs uppercase tracking-widest text-white/50">
                                {labels.title}
                            </div>
                            {usingDefaultTarget && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300/80 border border-amber-500/20 uppercase tracking-widest font-mono">
                                    Default
                                </span>
                            )}
                        </div>
                        <div className={cn("text-sm font-medium", isLocked ? "text-emerald-400" : "text-purple-400")}>
                            {isLocked ? "RESONANCE ACHIEVED" : "SEARCHING..."}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/50">
                        {isAudio ? "Emotional Resonance" : "Public Sentiment"}
                    </div>
                    <div className={cn("text-xl font-mono", getResonanceColor())}>
                        {Math.round(resonance)}%
                    </div>
                </div>
            </div>

            {/* Waveform Visualization */}
            <div className="relative h-48 bg-black/60 rounded-lg border border-white/10 overflow-hidden">
                {/* Background frequency bands */}
                <div className="absolute inset-0 flex items-end justify-around px-4 opacity-20">
                    {Array.from({ length: 32 }).map((_, i) => {
                        const height = 20 + Math.sin(i * 0.5 + state.tempo * 0.1) * 40 + Math.random() * 20
                        return (
                            <motion.div
                                key={i}
                                className="w-2 bg-purple-500 rounded-t"
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                        )
                    })}
                </div>

                {/* Main waveform */}
                <svg className="w-full h-full p-4 relative z-10" viewBox="0 0 400 150">
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke={getWaveColor()}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    {/* Baseline */}
                    <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                </svg>

                {/* Success overlay */}
                {isLocked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20"
                    >
                        <div className="flex flex-col items-center text-emerald-400">
                            <CheckCircle2 className="w-12 h-12 mb-2" />
                            <span className="text-lg font-bold tracking-widest">
                                {isAudio ? "RESONANCE FOUND" : "SENTIMENT ALIGNED"}
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Emotion hint */}
            <div className="text-center text-xs text-white/40 italic">
                {labels.hint}
            </div>

            {/* Controls */}
            <div className="space-y-4">
                {/* Param 1: Tempo / Urgency */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/70">
                        <span className="flex items-center gap-2">
                            <labels.param1.icon className="w-3 h-3" />
                            {labels.param1.label}
                        </span>
                        <span className="font-mono text-white/50">
                            {state.tempo < 40 ? labels.param1.low : state.tempo > 60 ? labels.param1.high : 'Moderate'}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.tempo}
                        onChange={(e) => updateState({ tempo: parseInt(e.target.value) })}
                        className={cn("w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer", param1Color)}
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                        <span>{labels.param1.low}</span>
                        <span>{labels.param1.high}</span>
                    </div>
                </div>

                {/* Param 2: Mood / Tone */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/70">
                        <span className="flex items-center gap-2">
                            <labels.param2.icon className="w-3 h-3" />
                            {labels.param2.label}
                        </span>
                        <span className="font-mono text-white/50">
                            {state.mood < 40 ? labels.param2.low : state.mood > 60 ? labels.param2.high : 'Neutral'}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.mood}
                        onChange={(e) => updateState({ mood: parseInt(e.target.value) })}
                        className={cn("w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer", param2Color)}
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                        <span>{labels.param2.low}</span>
                        <span>{labels.param2.high}</span>
                    </div>
                </div>

                {/* Param 3: Texture / Nuance */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/70">
                        <span className="flex items-center gap-2">
                            <labels.param3.icon className="w-3 h-3" />
                            {labels.param3.label}
                        </span>
                        <span className="font-mono text-white/50">
                            {state.texture < 40 ? labels.param3.low : state.texture > 60 ? labels.param3.high : 'Balanced'}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.texture}
                        onChange={(e) => updateState({ texture: parseInt(e.target.value) })}
                        className={cn("w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer", param3Color)}
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                        <span>{labels.param3.low}</span>
                        <span>{labels.param3.high}</span>
                    </div>
                </div>
            </div>

            {/* Debug/Skip */}
            <button
                onClick={() => updateState(targetConfig.targetState)}
                className="text-[10px] text-white/20 hover:text-white/50 w-full text-center mt-4"
            >
                [DEBUG] Auto-Tune (Target: {targetConfig.targetState.tempo}/{targetConfig.targetState.mood}/{targetConfig.targetState.texture})
            </button>
        </div>
    )
}
