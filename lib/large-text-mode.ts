/**
 * D-080: Large Text Mode
 * 2x text without breaking layout
 *
 * Provides text scaling that respects container boundaries
 * Uses CSS clamp() and container queries for responsive scaling
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Text size presets
 */
export type TextSizePreset = 'default' | 'large' | 'x-large' | 'xx-large'

/**
 * Text size configuration
 */
export interface TextSizeConfig {
  preset: TextSizePreset
  baseSize: number           // Base font size in rem
  scaleMultiplier: number    // Scale factor (1 = 100%, 2 = 200%)
  lineHeightMultiplier: number
  containerAware: boolean    // Use container queries
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Text size configurations
 */
export const TEXT_SIZE_CONFIGS: Record<TextSizePreset, TextSizeConfig> = {
  default: {
    preset: 'default',
    baseSize: 1,
    scaleMultiplier: 1,
    lineHeightMultiplier: 1,
    containerAware: false
  },
  large: {
    preset: 'large',
    baseSize: 1.25,
    scaleMultiplier: 1.25,
    lineHeightMultiplier: 1.1,
    containerAware: true
  },
  'x-large': {
    preset: 'x-large',
    baseSize: 1.5,
    scaleMultiplier: 1.5,
    lineHeightMultiplier: 1.2,
    containerAware: true
  },
  'xx-large': {
    preset: 'xx-large',
    baseSize: 2,
    scaleMultiplier: 2,
    lineHeightMultiplier: 1.3,
    containerAware: true
  }
}

/**
 * Labels for UI
 */
export const TEXT_SIZE_LABELS: Record<TextSizePreset, string> = {
  default: '100%',
  large: '125%',
  'x-large': '150%',
  'xx-large': '200%'
}

/**
 * Descriptions for accessibility settings
 */
export const TEXT_SIZE_DESCRIPTIONS: Record<TextSizePreset, string> = {
  default: 'Standard text size',
  large: 'Slightly larger text for easier reading',
  'x-large': 'Large text for low vision users',
  'xx-large': 'Maximum text size (2x normal)'
}

// ═══════════════════════════════════════════════════════════════════════════
// CSS GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate CSS custom properties for text size
 */
export function getTextSizeCSSProperties(preset: TextSizePreset): Record<string, string> {
  const config = TEXT_SIZE_CONFIGS[preset]

  return {
    '--text-scale': config.scaleMultiplier.toString(),
    '--text-base': `${config.baseSize}rem`,
    '--text-sm': `${config.baseSize * 0.875}rem`,
    '--text-xs': `${config.baseSize * 0.75}rem`,
    '--text-lg': `${config.baseSize * 1.125}rem`,
    '--text-xl': `${config.baseSize * 1.25}rem`,
    '--text-2xl': `${config.baseSize * 1.5}rem`,
    '--text-3xl': `${config.baseSize * 1.875}rem`,
    '--line-height-scale': config.lineHeightMultiplier.toString(),
    '--line-height-tight': `${1.25 * config.lineHeightMultiplier}`,
    '--line-height-normal': `${1.5 * config.lineHeightMultiplier}`,
    '--line-height-relaxed': `${1.625 * config.lineHeightMultiplier}`
  }
}

/**
 * Get CSS class for text size preset
 */
export function getTextSizeClass(preset: TextSizePreset): string {
  if (preset === 'default') return ''
  return `text-size-${preset}`
}

/**
 * Generate container-aware text size (uses clamp for responsive scaling)
 */
export function getResponsiveTextSize(
  baseSize: number,
  preset: TextSizePreset,
  minViewport: number = 320,
  maxViewport: number = 1200
): string {
  const config = TEXT_SIZE_CONFIGS[preset]
  const scaled = baseSize * config.scaleMultiplier

  // Use clamp to prevent text from getting too large on small screens
  // or too small on large screens
  const minSize = Math.max(baseSize * 0.75, scaled * 0.8)
  const maxSize = scaled

  return `clamp(${minSize}rem, ${scaled}rem, ${maxSize}rem)`
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT PRESERVATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate if text will fit in container
 */
export function willTextFit(
  text: string,
  containerWidthPx: number,
  fontSizeRem: number,
  baseFontSizePx: number = 16
): boolean {
  // Rough estimate: average character width is ~0.5em
  const avgCharWidth = fontSizeRem * baseFontSizePx * 0.5
  const estimatedWidth = text.length * avgCharWidth

  return estimatedWidth <= containerWidthPx
}

/**
 * Calculate maximum safe font size for container
 */
export function getMaxSafeFontSize(
  text: string,
  containerWidthPx: number,
  baseFontSizePx: number = 16,
  maxPreset: TextSizePreset = 'xx-large'
): TextSizePreset {
  const presets: TextSizePreset[] = ['xx-large', 'x-large', 'large', 'default']
  const maxIndex = presets.indexOf(maxPreset)

  for (let i = maxIndex; i < presets.length; i++) {
    const preset = presets[i]
    const config = TEXT_SIZE_CONFIGS[preset]
    const fontSize = config.baseSize

    if (willTextFit(text, containerWidthPx, fontSize, baseFontSizePx)) {
      return preset
    }
  }

  return 'default'
}

/**
 * Text overflow strategy
 */
export type OverflowStrategy = 'truncate' | 'wrap' | 'scale-down' | 'scroll'

/**
 * Get recommended overflow strategy for large text
 */
export function getOverflowStrategy(
  preset: TextSizePreset,
  containerType: 'button' | 'card' | 'dialogue' | 'choice'
): OverflowStrategy {
  const isLarge = preset === 'x-large' || preset === 'xx-large'

  switch (containerType) {
    case 'button':
      return isLarge ? 'scale-down' : 'truncate'
    case 'card':
      return 'wrap'
    case 'dialogue':
      return 'wrap'
    case 'choice':
      return isLarge ? 'scroll' : 'wrap'
    default:
      return 'wrap'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get next larger text size
 */
export function getNextLargerSize(current: TextSizePreset): TextSizePreset {
  const sizes: TextSizePreset[] = ['default', 'large', 'x-large', 'xx-large']
  const currentIndex = sizes.indexOf(current)

  if (currentIndex === -1 || currentIndex === sizes.length - 1) {
    return current
  }

  return sizes[currentIndex + 1]
}

/**
 * Get next smaller text size
 */
export function getNextSmallerSize(current: TextSizePreset): TextSizePreset {
  const sizes: TextSizePreset[] = ['default', 'large', 'x-large', 'xx-large']
  const currentIndex = sizes.indexOf(current)

  if (currentIndex <= 0) {
    return current
  }

  return sizes[currentIndex - 1]
}

/**
 * Check if text size is considered "large text" (for WCAG)
 * WCAG defines "large text" as 18pt (24px) or 14pt bold (18.66px)
 */
export function isWCAGLargeText(preset: TextSizePreset): boolean {
  const config = TEXT_SIZE_CONFIGS[preset]
  const basePx = config.baseSize * 16 // Assuming 16px root font size

  return basePx >= 24 // 18pt = 24px
}

/**
 * Get available text sizes
 */
export function getAvailableTextSizes(): TextSizePreset[] {
  return ['default', 'large', 'x-large', 'xx-large']
}
