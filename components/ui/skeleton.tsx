import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Skeleton Component
 *
 * Provides placeholder loading states to prevent layout shift.
 * Use to reserve space while content loads.
 *
 * @see SOFTWARE-DEVELOPMENT-PLAN.md Sprint 1
 */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-slate-200 animate-pulse",
          variant === 'default' && "rounded-md",
          variant === 'circular' && "rounded-full",
          variant === 'text' && "h-4 rounded",
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

/**
 * SkeletonCard - Full card placeholder with fixed height
 */
interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number;
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, height = 80, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-slate-100 rounded-lg animate-pulse",
          className
        )}
        style={{ height, minHeight: height, ...style }}
        {...props}
      />
    )
  }
)
SkeletonCard.displayName = "SkeletonCard"

/**
 * SkeletonText - Text line placeholder
 */
interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, width, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("h-4 bg-slate-200 rounded animate-pulse", className)}
        style={{ width, ...style }}
        {...props}
      />
    )
  }
)
SkeletonText.displayName = "SkeletonText"

/**
 * SkeletonAvatar - Circular avatar placeholder
 */
interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ className, size = 40, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-slate-200 rounded-full animate-pulse", className)}
        style={{ width: size, height: size, minWidth: size, ...style }}
        {...props}
      />
    )
  }
)
SkeletonAvatar.displayName = "SkeletonAvatar"

/**
 * DialogueSkeleton - Placeholder for dialogue loading state
 * Matches the glass morphism aesthetic of the game
 */
interface DialogueSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show micro-action placeholder line */
  showMicroAction?: boolean
  /** Number of text lines to display */
  lines?: number
  /** Use glass/dark theme (default: true for game context) */
  glass?: boolean
}

const DialogueSkeleton = React.forwardRef<HTMLDivElement, DialogueSkeletonProps>(
  ({ className, showMicroAction = false, lines = 3, glass = true, ...props }, ref) => {
    const baseColor = glass ? "bg-white/10" : "bg-slate-200"

    return (
      <div
        ref={ref}
        className={cn(
          "space-y-4 min-h-[120px] max-w-prose animate-pulse",
          className
        )}
        aria-busy="true"
        aria-label="Loading dialogue..."
        {...props}
      >
        {/* Micro-action placeholder */}
        {showMicroAction && (
          <div className={cn("h-4 rounded w-3/5", baseColor, "opacity-50")} />
        )}

        {/* Text lines with varying widths for natural feel */}
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-5 rounded",
              baseColor,
              // Vary widths: full, full, shorter
              i === lines - 1 ? "w-2/3" : i % 2 === 0 ? "w-full" : "w-11/12"
            )}
          />
        ))}
      </div>
    )
  }
)
DialogueSkeleton.displayName = "DialogueSkeleton"

/**
 * ChoiceSkeleton - Placeholder for choice buttons loading state
 */
interface ChoiceSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of choice buttons to show */
  count?: number
  /** Use glass/dark theme (default: true for game context) */
  glass?: boolean
}

const ChoiceSkeleton = React.forwardRef<HTMLDivElement, ChoiceSkeletonProps>(
  ({ className, count = 3, glass = true, ...props }, ref) => {
    const baseColor = glass ? "bg-white/5 border border-white/10" : "bg-slate-100 border border-slate-200"

    return (
      <div
        ref={ref}
        className={cn("space-y-3 animate-pulse", className)}
        aria-busy="true"
        aria-label="Loading choices..."
        {...props}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-[60px] rounded-xl",
              baseColor
            )}
          />
        ))}
      </div>
    )
  }
)
ChoiceSkeleton.displayName = "ChoiceSkeleton"

export { Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar, DialogueSkeleton, ChoiceSkeleton }
