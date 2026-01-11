
import React from 'react'
import { motion } from 'framer-motion'

interface NeuroHexagonProps {
    stats: {
        mind: number
        heart: number
        voice: number
        hands: number
        compass: number
        craft: number
    }
}

export function NeuroHexagon({ stats }: NeuroHexagonProps) {
    const size = 300
    const center = size / 2
    const radius = 100

    // 6 Points of the Hexagon
    const axes = [
        { id: 'mind', label: 'Mind', angle: -90 }, // Top
        { id: 'heart', label: 'Heart', angle: -30 }, // Top Right
        { id: 'voice', label: 'Voice', angle: 30 }, // Bottom Right
        { id: 'hands', label: 'Hands', angle: 90 }, // Bottom
        { id: 'compass', label: 'Compass', angle: 150 }, // Bottom Left
        { id: 'craft', label: 'Craft', angle: 210 } // Top Left
    ]

    // Calculate coordinates for a value on an axis
    const getPoint = (angle: number, value: number) => {
        const rad = (angle * Math.PI) / 180
        // Value 0-100 mapped to 0-radius
        const r = (value / 100) * radius
        return {
            x: center + r * Math.cos(rad),
            y: center + r * Math.sin(rad)
        }
    }

    // Generate Polygon Path
    const polygonPoints = axes.map(axis => {
        const value = stats[axis.id as keyof typeof stats] || 0
        const point = getPoint(axis.angle, value)
        return `${point.x},${point.y}`
    }).join(' ')

    // Background Webs (20%, 40%, 60%, 80%, 100%)
    const webs = [20, 40, 60, 80, 100].map(level => {
        return axes.map(axis => {
            const point = getPoint(axis.angle, level)
            return `${point.x},${point.y}`
        }).join(' ')
    })

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800">
            <h3 className="text-slate-200 font-semibold mb-2">Neuro-Cognitive Profile</h3>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Grids */}
                {webs.map((points, i) => (
                    <polygon
                        key={i}
                        points={points}
                        fill="none"
                        stroke="#1e293b" // slate-800
                        strokeWidth="1"
                    />
                ))}

                {/* Axis Lines */}
                {axes.map(axis => {
                    const end = getPoint(axis.angle, 100)
                    return (
                        <line
                            key={axis.id}
                            x1={center}
                            y1={center}
                            x2={end.x}
                            y2={end.y}
                            stroke="#334155" // slate-700
                            strokeWidth="1"
                        />
                    )
                })}

                {/* Labels */}
                {axes.map(axis => {
                    const pos = getPoint(axis.angle, 115) // Slightly outside
                    return (
                        <text
                            key={axis.id}
                            x={pos.x}
                            y={pos.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-slate-400 text-xs font-medium uppercase tracking-wider"
                            style={{ fontSize: '10px' }}
                        >
                            {axis.label}
                        </text>
                    )
                })}

                {/* The Data Polygon */}
                <motion.polygon
                    points={polygonPoints}
                    fill="rgba(16, 185, 129, 0.2)" // Emerald-500/20
                    stroke="#10b981" // Emerald-500
                    strokeWidth="2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, type: 'spring' }}
                />

                {/* Data Points */}
                {axes.map(axis => {
                    const value = stats[axis.id as keyof typeof stats] || 0
                    const point = getPoint(axis.angle, value)
                    return (
                        <circle
                            key={axis.id}
                            cx={point.x}
                            cy={point.y}
                            r="3"
                            fill="#10b981"
                        />
                    )
                })}
            </svg>
            <div className="text-xs text-slate-500 mt-2">
                Based on aggregate skill cluster proficiency
            </div>
        </div>
    )
}
