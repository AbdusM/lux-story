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

export { Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar }
