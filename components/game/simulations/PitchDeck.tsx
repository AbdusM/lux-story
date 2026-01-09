import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    Presentation,
    ChevronLeft,
    ChevronRight,
    PieChart,
    TrendingUp,
    Users,
    Target,
    Lightbulb,
    BarChart3,
    DollarSign,
    Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimulationComponentProps } from './types'

interface PitchDeckProps extends SimulationComponentProps { }

// Slide types
type SlideType = 'problem' | 'solution' | 'market' | 'traction' | 'team' | 'ask'

interface SlideContent {
    id: SlideType
    title: string
    icon: React.ComponentType<{ className?: string }>
    elements: SlideElement[]
    requiredElements: number
}

interface SlideElement {
    id: string
    label: string
    type: 'text' | 'metric' | 'chart'
    filled: boolean
    value?: string
}

/**
 * PitchDeck - Investment pitch builder simulator
 *
 * For Quinn: Build a compelling pitch deck by filling in key slides
 * with data points, metrics, and narrative elements.
 */
export function PitchDeck({ onSuccess }: PitchDeckProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [slides, setSlides] = useState<SlideContent[]>([
        {
            id: 'problem',
            title: 'THE PROBLEM',
            icon: Target,
            elements: [
                { id: 'pain_point', label: 'Pain Point', type: 'text', filled: false },
                { id: 'market_gap', label: 'Market Gap', type: 'text', filled: false },
            ],
            requiredElements: 2
        },
        {
            id: 'solution',
            title: 'OUR SOLUTION',
            icon: Lightbulb,
            elements: [
                { id: 'value_prop', label: 'Value Prop', type: 'text', filled: false },
                { id: 'differentiator', label: 'Differentiator', type: 'text', filled: false },
            ],
            requiredElements: 2
        },
        {
            id: 'market',
            title: 'MARKET SIZE',
            icon: PieChart,
            elements: [
                { id: 'tam', label: 'TAM', type: 'metric', filled: false, value: '$12B' },
                { id: 'sam', label: 'SAM', type: 'metric', filled: false, value: '$3.2B' },
                { id: 'som', label: 'SOM', type: 'metric', filled: false, value: '$800M' },
            ],
            requiredElements: 3
        },
        {
            id: 'traction',
            title: 'TRACTION',
            icon: TrendingUp,
            elements: [
                { id: 'users', label: 'Active Users', type: 'metric', filled: false, value: '12K' },
                { id: 'growth', label: 'MoM Growth', type: 'chart', filled: false, value: '32%' },
                { id: 'revenue', label: 'ARR', type: 'metric', filled: false, value: '$420K' },
            ],
            requiredElements: 2
        },
        {
            id: 'ask',
            title: 'THE ASK',
            icon: DollarSign,
            elements: [
                { id: 'amount', label: 'Raising', type: 'metric', filled: false, value: '$2.5M' },
                { id: 'use', label: 'Use of Funds', type: 'text', filled: false },
            ],
            requiredElements: 2
        }
    ])
    const [isComplete, setIsComplete] = useState(false)

    const currentSlideData = slides[currentSlide]
    const totalRequired = slides.reduce((sum, s) => sum + s.requiredElements, 0)
    const totalFilled = slides.reduce((sum, s) => s.elements.filter(e => e.filled).length, 0)

    // Fill an element
    const handleFillElement = useCallback((elementId: string) => {
        setSlides(prev => prev.map((slide, i) => {
            if (i !== currentSlide) return slide
            return {
                ...slide,
                elements: slide.elements.map(el => {
                    if (el.id !== elementId) return el
                    return { ...el, filled: true }
                })
            }
        }))

        const newScore = Math.min(100, Math.round(100 - (totalFilled * 2.5)))
        // Score calculation only)

        // Check completion (need at least 80% filled)
        if (newScore >= totalRequired * 0.8 && !isComplete) {
            setIsComplete(true)
            setTimeout(() => {
                onSuccess({
                    slidesFilled: newScore,
                    totalSlides: slides.length,
                    completionRate: Math.round((newScore / totalRequired) * 100)
                })
            }, 1500)
        }
    }, [currentSlide, totalFilled, totalRequired, isComplete, slides.length, onSuccess])

    // Navigate slides
    const prevSlide = () => setCurrentSlide(Math.max(0, currentSlide - 1))
    const nextSlide = () => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))

    // Get slide completion status
    const getSlideStatus = (slide: SlideContent) => {
        const filled = slide.elements.filter(e => e.filled).length
        if (filled >= slide.requiredElements) return 'complete'
        if (filled > 0) return 'partial'
        return 'empty'
    }

    return (
        <div className="space-y-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                    <Presentation className={cn("w-5 h-5", isComplete ? "text-emerald-400" : "text-amber-400")} />
                    <div>
                        <div className="text-xs uppercase tracking-widest text-white/50">PITCH DECK BUILDER</div>
                        <div className={cn("text-sm font-medium", isComplete ? "text-emerald-400" : "text-white")}>
                            {isComplete ? "INVESTORS IMPRESSED" : "BUILDING NARRATIVE"}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/50">Completion</div>
                    <div className={cn(
                        "text-xl font-mono",
                        totalFilled >= totalRequired * 0.8 ? "text-emerald-400" :
                            totalFilled >= totalRequired * 0.5 ? "text-amber-400" : "text-red-400"
                    )}>
                        {Math.round((totalFilled / totalRequired) * 100)}%
                    </div>
                </div>
            </div>

            {/* Slide Navigation Dots */}
            <div className="flex justify-center gap-2">
                {slides.map((slide, i) => {
                    const status = getSlideStatus(slide)
                    const Icon = slide.icon
                    return (
                        <button
                            key={slide.id}
                            onClick={() => setCurrentSlide(i)}
                            className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                                i === currentSlide
                                    ? "bg-amber-500/30 border-2 border-amber-400"
                                    : "bg-white/5 border border-white/10 hover:bg-white/10",
                                status === 'complete' && "border-emerald-400/50",
                                status === 'partial' && "border-amber-400/30"
                            )}
                        >
                            <Icon className={cn(
                                "w-4 h-4",
                                status === 'complete' ? "text-emerald-400" :
                                    status === 'partial' ? "text-amber-400" : "text-white/50"
                            )} />
                        </button>
                    )
                })}
            </div>

            {/* Current Slide */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-white/10 p-6 min-h-[280px]"
                >
                    {/* Slide Header */}
                    <div className="flex items-center gap-3 mb-6">
                        {(() => {
                            const Icon = currentSlideData.icon
                            return <Icon className="w-6 h-6 text-amber-400" />
                        })()}
                        <h3 className="text-lg font-bold text-white tracking-wide">{currentSlideData.title}</h3>
                    </div>

                    {/* Slide Elements */}
                    <div className="space-y-3">
                        {currentSlideData.elements.map(element => (
                            <motion.button
                                key={element.id}
                                onClick={() => !element.filled && handleFillElement(element.id)}
                                disabled={element.filled}
                                className={cn(
                                    "w-full p-4 rounded-lg border text-left transition-all",
                                    element.filled
                                        ? "bg-emerald-900/20 border-emerald-500/30"
                                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-400/50 cursor-pointer"
                                )}
                                whileHover={!element.filled ? { scale: 1.02 } : undefined}
                                whileTap={!element.filled ? { scale: 0.98 } : undefined}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {element.type === 'metric' && <BarChart3 className="w-4 h-4 text-blue-400" />}
                                        {element.type === 'chart' && <TrendingUp className="w-4 h-4 text-purple-400" />}
                                        {element.type === 'text' && <Users className="w-4 h-4 text-amber-400" />}
                                        <span className="text-sm text-white/80">{element.label}</span>
                                    </div>
                                    {element.filled ? (
                                        <div className="flex items-center gap-2">
                                            {element.value && (
                                                <span className="text-emerald-400 font-mono text-sm">{element.value}</span>
                                            )}
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        </div>
                                    ) : (
                                        <span className="text-xs text-white/30 italic">Click to add data</span>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded text-sm",
                        currentSlide === 0
                            ? "text-white/20 cursor-not-allowed"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <div className="text-xs text-white/40">
                    Slide {currentSlide + 1} of {slides.length}
                </div>

                <button
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded text-sm",
                        currentSlide === slides.length - 1
                            ? "text-white/20 cursor-not-allowed"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Success Overlay */}
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
                >
                    <div className="flex flex-col items-center text-emerald-400 bg-black/60 p-8 rounded-xl border border-emerald-500/30">
                        <Sparkles className="w-12 h-12 mb-3" />
                        <span className="text-xl font-bold tracking-widest mb-2">FUNDING SECURED</span>
                        <span className="text-sm text-emerald-300/60">Investors are ready to talk terms</span>
                    </div>
                </motion.div>
            )}

            {/* Debug */}
            <button
                onClick={() => {
                    // Auto-fill all elements
                    setSlides(prev => prev.map(slide => ({
                        ...slide,
                        elements: slide.elements.map(el => ({ ...el, filled: true }))
                    })))
                    setSlides(prev => prev.map(slide => ({
                        ...slide,
                        elements: slide.elements.map(el => ({ ...el, filled: true }))
                    })))
                    setIsComplete(true)
                    setTimeout(() => {
                        onSuccess({ slidesFilled: totalRequired, totalSlides: slides.length, completionRate: 100 })
                    }, 1500)
                }}
                className="text-[10px] text-white/20 hover:text-white/50 w-full text-center"
            >
                [DEBUG] Auto-Fill Deck
            </button>
        </div>
    )
}
