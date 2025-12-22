"use client"

import { useRef, ReactNode } from "react"
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from "framer-motion"

interface SwipeablePanelProps {
    children: ReactNode
    onClose: () => void
    threshold?: number // Distance to drag before verify dismiss (default 100)
    velocityThreshold?: number // Speed to flick to dismiss (default 500)
    className?: string
}

export function SwipeablePanel({
    children,
    onClose,
    threshold = 100,
    velocityThreshold = 500,
    className
}: SwipeablePanelProps) {
    const x = useMotionValue(0)
    const controls = useAnimation()
    const constraintsRef = useRef<HTMLDivElement>(null)

    // State Debouncing: Prevent multiple close calls
    const isDismissing = useRef(false)
    // Directional Lock: Once we commit to a direction, stick to it
    const isDraggingRef = useRef(false)

    // Map opacity to drag distance (fade out as you swipe)
    const opacity = useTransform(x, [0, threshold * 2], [1, 0.5])
    // Map scale slightly for "detaching" feel
    const scale = useTransform(x, [0, threshold * 2], [1, 0.95])

    const handleDragStart = () => {
        isDraggingRef.current = true
    }

    const handleDragEnd = async (_: any, info: PanInfo) => {
        isDraggingRef.current = false
        const { offset, velocity } = info

        // 1. Velocity Check (Flick)
        const isFlick = velocity.x > velocityThreshold

        // 2. Position Check (Drag & Hold)
        const isPastThreshold = offset.x > threshold

        if ((isFlick || isPastThreshold) && !isDismissing.current) {
            // SUCCESS: Dismiss
            isDismissing.current = true

            // Animate off screen
            await controls.start({
                x: "100%",
                opacity: 0,
                transition: { type: "tween", ease: "anticipate", duration: 0.3 }
            })

            onClose()
        } else {
            // FAILURE: Snap back (Rubber Band)
            controls.start({
                x: 0,
                opacity: 1,
                scale: 1,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30, // High damping for solid "thud" return
                    mass: 1
                }
            })
        }
    }

    return (
        <motion.div
            ref={constraintsRef}
            style={{ x, opacity, scale }}
            drag="x"
            dragControls={undefined} // Auto-attached
            // Only allow dragging RIGHT to dismiss (prevent dragging Left)
            dragConstraints={{ left: 0, right: 1000 }}
            dragElastic={{ left: 0.1, right: 0.5 }} // Stiff resistance left (Rubber band), loose right
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={controls}
            className={className}
        >
            {/* 
        Visual Handle Recommendation: 
        A subtle pill on the left edge can hint "Swipe Me", 
        but usually content movement is enough.
      */}
            {children}
        </motion.div>
    )
}
