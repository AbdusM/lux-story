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

// Modal height constants
export const MODAL_HEIGHT = {
  mobile: '50vh',
  tablet: '60vh',
  dragHandle: 40,
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
// TEXT SIZING & READABILITY
// =============================================================================

/**
 * Typography scale - Use for consistent text sizing
 * Avoid text-xs (12px) for body content - minimum text-sm (14px) for readability
 */
export const TEXT_SIZE = {
  meta: 'text-xs',      // 12px - metadata, labels only
  body: 'text-sm',      // 14px - body text, descriptions (minimum for readability)
  base: 'text-base',    // 16px - default body
  title: 'text-lg',     // 18px - card/section titles
  heading: 'text-xl',   // 20px - page headings
} as const;

/**
 * Max-widths for text containers to prevent truncation
 * Use these instead of arbitrary values like max-w-[100px]
 */
export const TEXT_CONTAINER_WIDTH = {
  compact: 'max-w-[180px]',     // Short labels, tags (increased from common 100px)
  standard: 'max-w-[280px]',    // Default text containers
  wide: 'max-w-[400px]',        // Long descriptions
  full: 'max-w-full',           // No restriction
} as const;

/**
 * IMPORTANT: Avoid `truncate` class unless absolutely necessary
 * - Use multi-line with line-clamp-2 or line-clamp-3 instead
 * - Only truncate when horizontal space is critical (breadcrumbs, nav)
 */

// =============================================================================
// OPACITY & VISIBILITY STANDARDS
// =============================================================================

/**
 * Opacity scale for visual hierarchy
 * Avoid opacity-40 or lower for interactive elements
 */
export const OPACITY = {
  disabled: 'opacity-50',        // Disabled state (minimum for visibility)
  inactive: 'opacity-70',        // Inactive but visible elements
  secondary: 'opacity-80',       // Secondary content
  primary: 'opacity-100',        // Primary content
} as const;

/**
 * Connection/line opacity for graphs and constellations
 * Increased from common low values (20-40%) for better visibility
 */
export const CONNECTION_OPACITY = {
  weak: 'opacity-40',           // Weak/dotted connections
  normal: 'opacity-80',         // Standard connections
  strong: 'opacity-100',        // Emphasized connections
} as const;

// =============================================================================
// GLASS MORPHISM SYSTEM
// =============================================================================

/**
 * Glass morphism opacity levels
 * Use these instead of arbitrary opacity values
 *
 * Created as part of architectural fix for white button backgrounds (Jan 2026)
 * See: /Users/abdusmuwwakkil/.claude/plans/humble-shimmying-hellman.md
 */
export const GLASS_OPACITY = {
  subtle: 'bg-slate-900/30',        // 30% - Subtle glass effect
  medium: 'bg-slate-900/60',        // 60% - Balanced glass
  solid: 'bg-slate-900/85',         // 85% - Solid with slight transparency
  opaque: 'bg-slate-900/95',        // 95% - Nearly opaque
} as const;

/**
 * Reusable glass styling fragments
 * Combine these for consistent glass morphism across components
 */
export const GLASS_STYLES = {
  base: `${GLASS_OPACITY.solid} backdrop-blur-md border border-white/5`,
  hover: 'hover:bg-slate-900/95 hover:border-white/10',
  text: 'text-slate-100',
  shadow: 'shadow-sm hover:shadow-lg',
  transition: 'transition-all duration-300',
} as const;

/**
 * Complete glass button styling (for Button component)
 * Single source of truth - replaces hardcoded glass variant
 */
// REMOVED: hover:-translate-y-0.5 - causes 2px jump on mobile when touch interpreted as hover
export const GLASS_BUTTON = `${GLASS_STYLES.base} ${GLASS_STYLES.text} ${GLASS_STYLES.shadow} ${GLASS_STYLES.hover} ${GLASS_STYLES.transition}`;

// =============================================================================
// CHOICE CONTAINER HEIGHT (Layout Stability)
// =============================================================================

/**
 * Container heights for choice buttons
 *
 * Updated Jan 16, 2026 - Mobile scroll fix:
 * - Reintroduced a modest min-h to reduce visible footer jumping between nodes
 * - Keep max-h caps to preserve vertical room under mobile browser chrome
 * - 4 buttons ≈ 252px (60px each + 3px gaps) → leave headroom for padding/safe-area
 *
 * @see /Users/abdusmuwwakkil/.claude/plans/humble-shimmying-hellman.md
 */
export const CHOICE_CONTAINER_HEIGHT = {
  mobileSm: 'min-h-[200px] max-h-[240px]',     // small phones: stable baseline + scroll headroom
  mobile: 'xs:min-h-[220px] xs:max-h-[280px]', // larger phones (≥ 400px)
  tablet: 'sm:min-h-[220px] sm:max-h-[240px]', // tablet (≥ 640px)
} as const;

// =============================================================================
// HELPER TYPES
// =============================================================================

export type ContainerSize = keyof typeof CONTAINERS;
export type ButtonSize = keyof typeof BUTTON_HEIGHT;
export type SpacingMode = keyof typeof SPACING;
export type UrgencyLevel = keyof typeof URGENCY_COLORS;
export type SkillState = keyof typeof SKILL_STATE_COLORS;
export type TextSize = keyof typeof TEXT_SIZE;
export type TextContainerWidth = keyof typeof TEXT_CONTAINER_WIDTH;
