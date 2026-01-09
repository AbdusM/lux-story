"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    CheckCircle2,
    Sprout,
    Leaf,
    AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationComponentProps } from './types'

// Grid cell representing a plant section
interface GridCell {
    id: string
    row: number
    col: number
    health: number // 0-100
    growth: 'dormant' | 'struggling' | 'growing' | 'thriving'
}

/**
 * BotanyGrid - Hydroponic nutrient optimization simulator
 *
 * For Tess: Adjust N-P-K (Nitrogen, Phosphorus, Potassium) balance
 * to optimize plant health in a grid-based cellular automata style.
 */
export function BotanyGrid({ onSuccess }: SimulationComponentProps) {
    // Nutrient levels (0-100)
    const [nitrogen, setNitrogen] = useState(30)
    const [phosphorus, setPhosphorus] = useState(50)
    const [potassium, setPotassium] = useState(50)

    // Grid state
    const [grid, setGrid] = useState<GridCell[]>([])
    const [overallHealth, setOverallHealth] = useState(40)
    const [isComplete, setIsComplete] = useState(false)

    // Target values for "Moonlight Orchid"
    const TARGET_N = 65
    const TARGET_P = 40
    const TARGET_K = 55

    // Initialize grid
    useEffect(() => {
        const cells: GridCell[] = []
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 6; col++) {
                cells.push({
                    id: `${row}-${col}`,
                    row,
                    col,
                    health: 30 + Math.random() * 20,
                    growth: 'struggling'
                })
            }
        }
        setGrid(cells)
    }, [])

    // Update grid health based on nutrient levels
    useEffect(() => {
        const nDist = Math.abs(nitrogen - TARGET_N)
        const pDist = Math.abs(phosphorus - TARGET_P)
        const kDist = Math.abs(potassium - TARGET_K)
        const totalDist = nDist + pDist + kDist

        // Calculate health (lower distance = higher health)
        const baseHealth = Math.max(0, Math.min(100, 100 - (totalDist / 1.5)))

        // Update each cell with some variation
        setGrid(prev => prev.map(cell => {
            const variation = (Math.random() - 0.5) * 10
            const cellHealth = Math.max(0, Math.min(100, baseHealth + variation))
            const growth = cellHealth > 80 ? 'thriving' :
                cellHealth > 60 ? 'growing' :
                    cellHealth > 40 ? 'struggling' : 'dormant'
            return { ...cell, health: cellHealth, growth }
        }))

        setOverallHealth(Math.round(baseHealth))

        // Check completion
        if (baseHealth > 85 && !isComplete) {
            setIsComplete(true)
            setTimeout(() => {
                onSuccess({
                    success: true,
                    data: { health: baseHealth, nutrients: { nitrogen, phosphorus, potassium } }
                })
            }, 1500)
        }
    }, [nitrogen, phosphorus, potassium, isComplete, onSuccess])

    // Get cell color based on health
    const getCellColor = (growth: string) => {
        if (growth === 'thriving') return 'bg-emerald-500/60 border-emerald-400'
        if (growth === 'growing') return 'bg-lime-500/40 border-lime-400'
        if (growth === 'struggling') return 'bg-yellow-500/30 border-yellow-500'
        return 'bg-red-900/30 border-red-500'
    }

    // Get growth icon
    const getGrowthIcon = (growth: string) => {
        if (growth === 'thriving') return <Leaf className="w-3 h-3 text-emerald-300" />
        if (growth === 'growing') return <Sprout className="w-3 h-3 text-lime-300" />
        if (growth === 'struggling') return <AlertTriangle className="w-2 h-2 text-yellow-400" />
        return null
    }

    return (
        <div className="space-y-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                    <Sprout className={cn("w-5 h-5", isComplete ? "text-emerald-400" : "text-lime-400")} />
                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">HYDROPONIC GRID</div>
                        <div className={cn("text-sm font-medium", isComplete ? "text-emerald-400" : "text-white")}>
                            {isComplete ? "GROWTH OPTIMAL" : "CALIBRATING..."}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/50">Plant Health</div>
                    <div className={cn(
                        "text-xl font-mono",
                        overallHealth > 80 ? "text-emerald-400" :
                            overallHealth > 60 ? "text-lime-400" :
                                overallHealth > 40 ? "text-yellow-400" : "text-red-400"
                    )}>
                        {overallHealth}%
                    </div>
                </div>
            </div>

            {/* Nutrient Status Bar */}
            <div className="grid grid-cols-3 gap-2">
                <NutrientCard label="N" name="Nitrogen" value={nitrogen} target={TARGET_N} color="#3B82F6" />
                <NutrientCard label="P" name="Phosphorus" value={phosphorus} target={TARGET_P} color="#F59E0B" />
                <NutrientCard label="K" name="Potassium" value={potassium} target={TARGET_K} color="#8B5CF6" />
            </div>

            {/* Grid Visualization */}
            <div className="relative bg-black/60 rounded-lg border border-white/10 p-3">
                <div className="grid grid-cols-6 gap-1.5">
                    {grid.map(cell => (
                        <motion.div
                            key={cell.id}
                            className={cn(
                                "aspect-square rounded flex items-center justify-center border transition-colors duration-500",
                                getCellColor(cell.growth)
                            )}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: (cell.row * 6 + cell.col) * 0.02 }}
                        >
                            {getGrowthIcon(cell.growth)}
                        </motion.div>
                    ))}
                </div>

                {/* Success Overlay */}
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
                    >
                        <div className="flex flex-col items-center text-emerald-400">
                            <CheckCircle2 className="w-10 h-10 mb-2" />
                            <span className="text-sm font-bold tracking-widest">PHOTOSYNTHESIS +15%</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Nutrient hint */}
            <div className="text-center text-xs text-white/40 italic">
                &quot;Moonlight Orchid requires balanced nutrition with elevated nitrogen...&quot;
            </div>

            {/* Controls */}
            <div className="space-y-3">
                {/* Nitrogen Slider */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-white/70">
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-blue-500" />
                            Nitrogen (N)
                        </span>
                        <span className="font-mono">{nitrogen}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={nitrogen}
                        onChange={(e) => setNitrogen(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Phosphorus Slider */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-white/70">
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-amber-500" />
                            Phosphorus (P)
                        </span>
                        <span className="font-mono">{phosphorus}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={phosphorus}
                        onChange={(e) => setPhosphorus(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                </div>

                {/* Potassium Slider */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs text-white/70">
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-purple-500" />
                            Potassium (K)
                        </span>
                        <span className="font-mono">{potassium}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={potassium}
                        onChange={(e) => setPotassium(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>
            </div>

            {/* Debug */}
            <button
                onClick={() => { setNitrogen(TARGET_N); setPhosphorus(TARGET_P); setPotassium(TARGET_K) }}
                className="text-[10px] text-white/20 hover:text-white/50 w-full text-center"
            >
                [DEBUG] Auto-Balance
            </button>
        </div>
    )
}

// Nutrient status card
function NutrientCard({ label, name, value, target, color }: {
    label: string
    name: string
    value: number
    target: number
    color: string
}) {
    const diff = Math.abs(value - target)
    const status = diff < 10 ? 'optimal' : diff < 20 ? 'close' : 'off'

    return (
        <div className="bg-black/30 p-2 rounded border border-white/5">
            <div className="flex items-center justify-between mb-1">
                <div
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: color }}
                >
                    {label}
                </div>
                <span className={cn(
                    "text-[10px] uppercase",
                    status === 'optimal' ? "text-emerald-400" :
                        status === 'close' ? "text-yellow-400" : "text-red-400"
                )}>
                    {status}
                </span>
            </div>
            <div className="text-lg font-mono text-white">{value}%</div>
            <div className="text-[10px] text-white/40">{name}</div>
        </div>
    )
}
