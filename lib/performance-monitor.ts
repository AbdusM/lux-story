/**
 * Performance Monitoring System
 * Tracks Core Web Vitals and performance metrics
 */

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  fcp: number | null // First Contentful Paint
  ttfb: number | null // Time to First Byte
  
  // Additional metrics
  fmp: number | null // First Meaningful Paint
  si: number | null // Speed Index
  tbt: number | null // Total Blocking Time
  
  // Custom game metrics
  gameLoadTime: number | null
  sceneTransitionTime: number | null
  choiceResponseTime: number | null
  memoryUsage: number | null
}

interface PerformanceBudget {
  lcp: number // 2.5s
  fid: number // 100ms
  cls: number // 0.1
  fcp: number // 1.8s
  ttfb: number // 600ms
  gameLoadTime: number // 3s
  sceneTransitionTime: number // 500ms
  choiceResponseTime: number // 200ms
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    fmp: null,
    si: null,
    tbt: null,
    gameLoadTime: null,
    sceneTransitionTime: null,
    choiceResponseTime: null,
    memoryUsage: null
  }

  private budget: PerformanceBudget = {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    ttfb: 600,
    gameLoadTime: 3000,
    sceneTransitionTime: 500,
    choiceResponseTime: 200
  }

  private observers: Map<string, PerformanceObserver> = new Map()
  private isInitialized = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize() {
    if (this.isInitialized) return

    // Track Core Web Vitals
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    this.observeFCP()
    this.observeTTFB()
    this.observeFMP()
    this.observeSI()
    this.observeTBT()

    // Track custom game metrics
    this.trackGameLoadTime()
    this.trackMemoryUsage()

    this.isInitialized = true
  }

  private observeLCP() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.lcp = lastEntry.startTime
        this.logMetric('LCP', lastEntry.startTime, this.budget.lcp)
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.set('lcp', observer)
    } catch (error) {
      console.warn('Failed to observe LCP:', error)
    }
  }

  private observeFID() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime
          this.logMetric('FID', this.metrics.fid, this.budget.fid)
        })
      })
      
      observer.observe({ entryTypes: ['first-input'] })
      this.observers.set('fid', observer)
    } catch (error) {
      console.warn('Failed to observe FID:', error)
    }
  }

  private observeCLS() {
    if (!('PerformanceObserver' in window)) return

    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.metrics.cls = clsValue
        this.logMetric('CLS', clsValue, this.budget.cls)
      })
      
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.set('cls', observer)
    } catch (error) {
      console.warn('Failed to observe CLS:', error)
    }
  }

  private observeFCP() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.fcp = entry.startTime
          this.logMetric('FCP', entry.startTime, this.budget.fcp)
        })
      })
      
      observer.observe({ entryTypes: ['paint'] })
      this.observers.set('fcp', observer)
    } catch (error) {
      console.warn('Failed to observe FCP:', error)
    }
  }

  private observeTTFB() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.ttfb = entry.responseStart - entry.requestStart
          this.logMetric('TTFB', this.metrics.ttfb, this.budget.ttfb)
        })
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      this.observers.set('ttfb', observer)
    } catch (error) {
      console.warn('Failed to observe TTFB:', error)
    }
  }

  private observeFMP() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.name === 'first-meaningful-paint') {
            this.metrics.fmp = entry.startTime
            this.logMetric('FMP', entry.startTime, 1800) // 1.8s budget
          }
        })
      })
      
      observer.observe({ entryTypes: ['paint'] })
      this.observers.set('fmp', observer)
    } catch (error) {
      console.warn('Failed to observe FMP:', error)
    }
  }

  private observeSI() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.name === 'speed-index') {
            this.metrics.si = entry.value
            this.logMetric('SI', entry.value, 3000) // 3s budget
          }
        })
      })
      
      observer.observe({ entryTypes: ['measure'] })
      this.observers.set('si', observer)
    } catch (error) {
      console.warn('Failed to observe SI:', error)
    }
  }

  private observeTBT() {
    if (!('PerformanceObserver' in window)) return

    try {
      let tbt = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.duration > 50) {
            tbt += entry.duration - 50
          }
        })
        this.metrics.tbt = tbt
        this.logMetric('TBT', tbt, 200) // 200ms budget
      })
      
      observer.observe({ entryTypes: ['longtask'] })
      this.observers.set('tbt', observer)
    } catch (error) {
      console.warn('Failed to observe TBT:', error)
    }
  }

  private trackGameLoadTime() {
    const startTime = performance.now()
    
    window.addEventListener('load', () => {
      this.metrics.gameLoadTime = performance.now() - startTime
      this.logMetric('Game Load Time', this.metrics.gameLoadTime, this.budget.gameLoadTime)
    })
  }

  private trackMemoryUsage() {
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory
        this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
        this.logMetric('Memory Usage', this.metrics.memoryUsage, 100) // 100MB budget (more realistic for React app)
      }

      updateMemoryUsage()
      setInterval(updateMemoryUsage, 10000) // Update every 10 seconds
    }
  }

  private logMetric(name: string, value: number, budget: number) {
    const status = value <= budget ? '✅' : '⚠️'
    const percentage = ((value / budget) * 100).toFixed(1)
    
    console.log(`${status} ${name}: ${value.toFixed(2)}ms (${percentage}% of budget)`)
    
    // Report to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        budget_value: budget,
        status: value <= budget ? 'good' : 'needs_improvement'
      })
    }
  }

  // Public methods
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  public getBudget(): PerformanceBudget {
    return { ...this.budget }
  }

  public getScore(): { overall: number; details: Record<string, number> } {
    const metrics = this.getMetrics()
    const budget = this.getBudget()
    const details: Record<string, number> = {}
    let totalScore = 0
    let metricCount = 0

    // Calculate scores for each metric
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== null && key in budget) {
        const budgetValue = budget[key as keyof PerformanceBudget]
        const score = Math.max(0, Math.min(100, (1 - value / budgetValue) * 100))
        details[key] = score
        totalScore += score
        metricCount++
      }
    })

    return {
      overall: metricCount > 0 ? totalScore / metricCount : 0,
      details
    }
  }

  public trackSceneTransition(startTime: number) {
    const endTime = performance.now()
    this.metrics.sceneTransitionTime = endTime - startTime
    this.logMetric('Scene Transition', this.metrics.sceneTransitionTime, this.budget.sceneTransitionTime)
  }

  public trackChoiceResponse(startTime: number) {
    const endTime = performance.now()
    this.metrics.choiceResponseTime = endTime - startTime
    this.logMetric('Choice Response', this.metrics.choiceResponseTime, this.budget.choiceResponseTime)
  }

  public cleanup() {
    this.observers.forEach((observer) => {
      observer.disconnect()
    })
    this.observers.clear()
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor()
  }
  return performanceMonitor
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = getPerformanceMonitor()
  
  return {
    getMetrics: () => monitor.getMetrics(),
    getScore: () => monitor.getScore(),
    trackSceneTransition: (startTime: number) => monitor.trackSceneTransition(startTime),
    trackChoiceResponse: (startTime: number) => monitor.trackChoiceResponse(startTime)
  }
}
