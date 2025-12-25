/**
 * UI Constants Library
 *
 * Centralized design tokens for consistent styling across the app.
 * Use these constants instead of hardcoding values.
 *
 * @see SOFTWARE-DEVELOPMENT-PLAN.md Sprint 2.1
 */

// =============================================================================
// CONTAINER WIDTHS
// =============================================================================

export const CONTAINERS = {
  sm: 'max-w-sm',     // 384px
  md: 'max-w-md',     // 448px
  lg: 'max-w-lg',     // 512px
  xl: 'max-w-xl',     // 576px
  '2xl': 'max-w-2xl', // 672px
  '4xl': 'max-w-4xl', // 896px
  full: 'max-w-full',
} as const;

// =============================================================================
// TOUCH TARGETS (BUTTON HEIGHTS)
// =============================================================================

// Apple HIG: Minimum 44px for touch targets
// Material Design: 48px recommended
export const BUTTON_HEIGHT = {
  sm: 'min-h-[36px]',   // Small buttons (icon-only, compact)
  md: 'min-h-[44px]',   // Default - Apple HIG minimum
  lg: 'min-h-[52px]',   // Large CTAs
} as const;

// Numeric values for calculations
export const BUTTON_HEIGHT_PX = {
  sm: 36,
  md: 44,
  lg: 52,
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const SPACING = {
  mobile: {
    padding: 'p-4',
    paddingX: 'px-4',
    paddingY: 'py-4',
    gap: 'space-y-4',
    gapX: 'gap-4',
  },
  tablet: {
    padding: 'p-6',
    paddingX: 'px-6',
    paddingY: 'py-6',
    gap: 'space-y-6',
    gapX: 'gap-6',
  },
  desktop: {
    padding: 'p-8',
    paddingX: 'px-8',
    paddingY: 'py-8',
    gap: 'space-y-8',
    gapX: 'gap-8',
  },
} as const;

// =============================================================================
// SAFE AREAS
// =============================================================================

export const SAFE_AREA = {
  bottom: 'max(16px, env(safe-area-inset-bottom))',
  top: 'env(safe-area-inset-top)',
  left: 'env(safe-area-inset-left)',
  right: 'env(safe-area-inset-right)',
} as const;

// Padding class for bottom safe area
export const SAFE_AREA_PADDING = {
  bottom: 'pb-[max(16px,env(safe-area-inset-bottom))]',
} as const;

// =============================================================================
// ANIMATION DURATIONS
// =============================================================================

// Matches springs.ts timing for consistency
export const ANIMATION_DURATION = {
  instant: 0,
  fast: 150,
  normal: 200,
  slow: 300,
  message: 400,
  page: 500,
} as const;

// Stagger delay - USE lib/animations.ts stagger instead
// Removed duplicate: import { stagger } from '@/lib/animations'

// =============================================================================
// MIN HEIGHTS (LAYOUT STABILITY)
// =============================================================================

// Prevent layout shift with consistent min-heights
export const MIN_HEIGHT = {
  card: 'min-h-[200px]',
  cardLarge: 'min-h-[300px]',
  section: 'min-h-[400px]',
  chart: 'min-h-[160px]',
  list: 'min-h-[300px]',
  modal: 'min-h-[200px]',
} as const;

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

export const Z_INDEX = {
  dropdown: 50,
  sticky: 60,
  fixed: 70,
  modalBackdrop: 100,
  modal: 110,
  popover: 120,
  tooltip: 130,
  toast: 140,
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const RADIUS = {
  sm: 'rounded-sm',    // 2px
  md: 'rounded-md',    // 6px
  lg: 'rounded-lg',    // 8px
  xl: 'rounded-xl',    // 12px
  '2xl': 'rounded-2xl', // 16px
  full: 'rounded-full',
} as const;

// =============================================================================
// URGENCY COLORS (for admin dashboard)
// =============================================================================

export const URGENCY_COLORS = {
  critical: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-500',
    badge: 'bg-red-500 text-white',
  },
  high: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-500',
    badge: 'bg-orange-500 text-white',
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-500',
    badge: 'bg-yellow-500 text-white',
  },
  low: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-500',
    badge: 'bg-green-500 text-white',
  },
} as const;

// =============================================================================
// SKILL STATE COLORS
// =============================================================================

export const SKILL_STATE_COLORS = {
  dormant: {
    bg: 'bg-slate-200',
    text: 'text-slate-500',
  },
  emerging: {
    bg: 'bg-blue-200',
    text: 'text-blue-700',
  },
  developing: {
    bg: 'bg-purple-200',
    text: 'text-purple-700',
  },
  strong: {
    bg: 'bg-green-200',
    text: 'text-green-700',
  },
} as const;

// =============================================================================
// BREAKPOINTS (for reference, matches Tailwind defaults)
// =============================================================================

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// =============================================================================
// HELPER TYPES
// =============================================================================

export type ContainerSize = keyof typeof CONTAINERS;
export type ButtonSize = keyof typeof BUTTON_HEIGHT;
export type SpacingMode = keyof typeof SPACING;
export type UrgencyLevel = keyof typeof URGENCY_COLORS;
export type SkillState = keyof typeof SKILL_STATE_COLORS;
