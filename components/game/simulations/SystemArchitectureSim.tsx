"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, CheckCircle2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationConfig } from '../SimulationRenderer'

interface SystemArchitectureSimProps {
    config: SimulationConfig
    onSuccess: (result?: any) => void
}

export function SystemArchitectureSim({ config, onSuccess }: SystemArchitectureSimProps) {
    // State for PID controller parameters
    const [pGain, setPGain] = useState(50)
    const [dGain, setDGain] = useState(50)

    // Derived state for visualization
    const [stability, setStability] = useState(42) // Start at low stability
    const [oscillation, setOscillation] = useState(100) // Start at high oscillation
    const [isStabilized, setIsStabilized] = useState(false)

    // Target values (hidden from user)
    const TARGET_P = 75 // Required P-gain
    const TARGET_D = 30 // Required D-gain
    const TOLERANCE = 10 // Allowable error range

    useEffect(() => {
        // Calculate stability based on distance from target
        const pDist = Math.abs(pGain - TARGET_P)
        const dDist = Math.abs(dGain - TARGET_D)
        const totalDist = pDist + dDist

        // Lower distance = Higher stability (Max 100%)
        // Max distance is roughly 100 + 100 = 200
        const newStability = Math.max(0, Math.min(100, 100 - (totalDist / 1.5)))

        // Oscillation is inverse of stability plus some noise
        const newOscillation = (100 - newStability)

        setStability(Math.round(newStability))
        setOscillation(newOscillation)

        // Check for success condition
        if (newStability > 95) {
            if (!isStabilized) {
                setIsStabilized(true)
                // Trigger success after a brief hold
                setTimeout(() => {
                    onSuccess()
                }, 1500)
            }
        } else {
            setIsStabilized(false)
        }
    }, [pGain, dGain, onSuccess, isStabilized])

    return (
        <div className="space-y-6">
            {/* Header / Status */}
            <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                    <Activity className={cn("w-5 h-5", isStabilized ? "text-emerald-400" : "text-amber-400")} />
                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">System Status</div>
                        <div className={cn("text-sm font-medium", isStabilized ? "text-emerald-400" : "text-amber-400")}>
                            {isStabilized ? "OPTIMAL" : "UNSTABLE"}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/50">Stability</div>
                    <div className="text-xl font-mono text-white">
                        {stability}%
                    </div>
                </div>
            </div>

            {/* Visualization Graph (Canvas/SVG proxy) */}
            <div className="relative h-48 bg-black/60 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center">
                {/* Background Grid */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-0 opacity-20 pointer-events-none">
                    {Array.from({ length: 72 }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-emerald-900/40" />
                    ))}
                </div>

                {/* The Wave */}
                <svg className="w-full h-full p-4" viewBox="0 0 400 200">
                    <motion.path
                        d={`M 0 100 Q 100 ${100 - oscillation} 200 100 T 400 100`}
                        fill="none"
                        stroke={isStabilized ? "#34d399" : "#fbbf24"}
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{
                            d: [
                                `M 0 100 Q 100 ${100 - oscillation} 200 100 T 400 100`,
                                `M 0 100 Q 100 ${100 + oscillation} 200 100 T 400 100`,
                                `M 0 100 Q 100 ${100 - oscillation} 200 100 T 400 100`
                            ]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2, /* Faster oscillation when unstable? Maybe. */
                            ease: "easeInOut"
                        }}
                    />
                    {/* Baseline */}
                    <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
                </svg>

                {isStabilized && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <div className="flex flex-col items-center text-emerald-400">
                            <CheckCircle2 className="w-12 h-12 mb-2" />
                            <span className="text-lg font-bold tracking-widest">NORMALIZED</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-6">
                {/* P-Gain Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/70">
                        <span>P-Gain (Proportional)</span>
                        <span className="font-mono">{pGain}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={pGain}
                        onChange={(e) => setPGain(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                    />
                    <div className="text-[10px] text-white/40">Adjusts reaction magnitude</div>
                </div>

                {/* D-Gain Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/70">
                        <span>D-Gain (Derivative)</span>
                        <span className="font-mono">{dGain}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={dGain}
                        onChange={(e) => setDGain(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                    />
                    <div className="text-[10px] text-white/40">Dampens oscillation rate</div>
                </div>
            </div>

            {/* Debug/Skip for Testing */}
            <button
                onClick={() => { setPGain(TARGET_P); setDGain(TARGET_D); }}
                className="text-[10px] text-white/20 hover:text-white/50 w-full text-center mt-4"
            >
                [DEBUG] Auto-Calibrate
            </button>
        </div>
    )
}
