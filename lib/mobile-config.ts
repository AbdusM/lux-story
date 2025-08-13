/**
 * Mobile optimization configuration
 * Extracted from slothman-chronicles for touch-first experience
 */
export const mobileConfig = {
  // Viewport meta tag content
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  
  // CSS properties for touch optimization
  touchAction: 'none',
  overscrollBehavior: 'none',
  
  // Responsive breakpoints
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024
  }
} as const

/**
 * Apply mobile optimizations to document head
 */
export function applyMobileOptimizations() {
  // Set viewport if not already set
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta')
    viewport.name = 'viewport'
    viewport.content = mobileConfig.viewport
    document.head.appendChild(viewport)
  }
  
  // Add touch-optimized CSS
  const style = document.createElement('style')
  style.textContent = 
    'body { ' +
      'touch-action: ' + mobileConfig.touchAction + '; ' +
      'overscroll-behavior: ' + mobileConfig.overscrollBehavior + '; ' +
      '-webkit-user-select: none; ' +
      'user-select: none; ' +
    '} ' +
    'button, [role="button"] { ' +
      'touch-action: manipulation; ' +
      'user-select: none; ' +
    '}'
  document.head.appendChild(style)
}