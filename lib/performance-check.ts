/**
 * Simple performance monitor for development
 * Warns when FPS drops below 30
 */

let lastTime = performance.now()
let frameCount = 0

export function checkPerformance() {
  if (process.env.NODE_ENV !== 'development') return
  
  frameCount++
  const now = performance.now()
  
  if (now - lastTime > 1000) {
    const fps = frameCount
    if (fps < 30) {
      console.warn(`Low FPS detected: ${fps}`)
    }
    frameCount = 0
    lastTime = now
  }
}

/**
 * Start performance monitoring
 * Only runs in development
 */
export function startPerformanceMonitoring() {
  if (process.env.NODE_ENV !== 'development') return
  
  function monitor() {
    checkPerformance()
    requestAnimationFrame(monitor)
  }
  
  monitor()
}