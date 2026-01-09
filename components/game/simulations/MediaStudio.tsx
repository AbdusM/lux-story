"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Music, Waves, CheckCircle2, Heart, Zap, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationConfig } from '../SimulationRenderer'

interface MediaStudioProps {
    config: SimulationConfig
    onSuccess: (result: any) => void
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
    // Emotional parameters (0-100)
    const [tempo, setTempo] = useState(50)      // Fast/Slow
    const [mood, setMood] = useState(50)        // Dark/Bright
    const [texture, setTexture] = useState(50)  // Sparse/Dense

    // Derived state
    const [resonance, setResonance] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    // Target values (hidden from user) - based on Lira's dementia music prompt
    // "Piano melody, early dementia, the music knows something is wrong before she does"
    // = Slow tempo (30), Dark mood (25), Sparse texture (20)
    const TARGET_TEMPO = 30
    const TARGET_MOOD = 25
    const TARGET_TEXTURE = 20
    const TOLERANCE = 15

    // Generate waveform based on parameters
    const generateWaveform = useCallback(() => {
        const points: { x: number; y: number }[] = []
        const width = 400
        const height = 150
        const centerY = height / 2

        for (let x = 0; x < width; x += 4) {
            // Frequency based on tempo (higher tempo = more oscillations)
            const frequency = (tempo / 50) * 0.08
            // Amplitude based on mood (darker = smaller waves, more decay)
            const amplitude = (mood / 100) * 40 + 10
            // Noise based on texture (denser = more noise)
            const noise = (texture / 100) * 15

            const baseWave = Math.sin(x * frequency) * amplitude
            const noiseWave = Math.sin(x * 0.3) * noise
            const y = centerY + baseWave + noiseWave

            points.push({ x, y })
        }
        return points
    }, [tempo, mood, texture])

    const waveformPoints = generateWaveform()
    const pathD = waveformPoints
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ')

    // Calculate resonance (how close to target)
    useEffect(() => {
        const tempoDistance = Math.abs(tempo - TARGET_TEMPO)
        const moodDistance = Math.abs(mood - TARGET_MOOD)
        const textureDistance = Math.abs(texture - TARGET_TEXTURE)

        // Max possible distance is ~255 (3 * 85)
        const totalDistance = tempoDistance + moodDistance + textureDistance
        const newResonance = Math.max(0, Math.min(100, 100 - (totalDistance / 2)))

        setResonance(Math.round(newResonance))

        // Check for success
        if (newResonance > 85 && !isComplete) {
            setIsComplete(true)
            setTimeout(() => {
                onSuccess({ resonance: newResonance, parameters: { tempo, mood, texture } })
            }, 1500)
        }
    }, [tempo, mood, texture, isComplete, onSuccess])

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

    return (
        <div className="space-y-6">
            {/* Header / Status */}
            <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                    <Music className={cn("w-5 h-5", isComplete ? "text-emerald-400" : "text-purple-400")} />
                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">
                            {variant === 'audio_studio' ? 'Synesthesia Engine' : 'Headline Studio'}
                        </div>
                        <div className={cn("text-sm font-medium", isComplete ? "text-emerald-400" : "text-purple-400")}>
                            {isComplete ? "RESONANCE ACHIEVED" : "SEARCHING..."}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/50">Emotional Resonance</div>
                    <div className={cn("text-xl font-mono", getResonanceColor())}>
                        {resonance}%
                    </div>
                </div>
            </div>

            {/* Waveform Visualization */}
            <div className="relative h-48 bg-black/60 rounded-lg border border-white/10 overflow-hidden">
                {/* Background frequency bands */}
                <div className="absolute inset-0 flex items-end justify-around px-4 opacity-20">
                    {Array.from({ length: 32 }).map((_, i) => {
                        const height = 20 + Math.sin(i * 0.5 + tempo * 0.1) * 40 + Math.random() * 20
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
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20"
                    >
                        <div className="flex flex-col items-center text-emerald-400">
                            <CheckCircle2 className="w-12 h-12 mb-2" />
                            <span className="text-lg font-bold tracking-widest">RESONANCE FOUND</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Emotion hint */}
            <div className="text-center text-xs text-white/40 italic">
                {variant === 'audio_studio'
                    ? '"The music knows something is wrong before she does..."'
                    : '"Find the emotional truth in the headline..."'}
            </div>

            {/* Controls */}
            <div className="space-y-4">
                {/* Tempo Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/70">
                        <span className="flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            Tempo
                        </span>
                        <span className="font-mono text-white/50">
                            {tempo < 40 ? 'Slow' : tempo > 60 ? 'Fast' : 'Moderate'}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={tempo}
                        onChange={(e) => setTempo(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                        <span>Slow</span>
                        <span>Fast</span>
                    </div>
                </div>

                {/* Mood Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/70">
                        <span className="flex items-center gap-2">
                            <Heart className="w-3 h-3" />
                            Mood
                        </span>
                        <span className="font-mono text-white/50">
                            {mood < 40 ? 'Dark' : mood > 60 ? 'Bright' : 'Neutral'}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={mood}
                        onChange={(e) => setMood(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400"
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                        <span>Dark</span>
                        <span>Bright</span>
                    </div>
                </div>

                {/* Texture Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/70">
                        <span className="flex items-center gap-2">
                            <Wind className="w-3 h-3" />
                            Texture
                        </span>
                        <span className="font-mono text-white/50">
                            {texture < 40 ? 'Sparse' : texture > 60 ? 'Dense' : 'Balanced'}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={texture}
                        onChange={(e) => setTexture(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                        <span>Sparse</span>
                        <span>Dense</span>
                    </div>
                </div>
            </div>

            {/* Debug/Skip */}
            <button
                onClick={() => { setTempo(TARGET_TEMPO); setMood(TARGET_MOOD); setTexture(TARGET_TEXTURE) }}
                className="text-[10px] text-white/20 hover:text-white/50 w-full text-center mt-4"
            >
                [DEBUG] Auto-Tune
            </button>
        </div>
    )
}
