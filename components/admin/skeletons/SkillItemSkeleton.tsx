import * as React from "react"
import { Skeleton, SkeletonText, SkeletonAvatar } from "@/components/ui/skeleton"

/**
 * SkillItemSkeleton
 *
 * Single skill item placeholder matching SkillsSection item layout.
 * Height matches actual skill item (min-h-[60px]).
 *
 * @see SOFTWARE-DEVELOPMENT-PLAN.md Sprint 1.1
 */
export function SkillItemSkeleton() {
  return (
    <div className="h-16 bg-slate-50 border rounded-lg animate-pulse flex items-center gap-3 p-4">
      <SkeletonAvatar size={40} />
      <div className="flex-1 space-y-2">
        <SkeletonText width="75%" className="h-4" />
        <SkeletonText width="50%" className="h-3" />
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  )
}

/**
 * SkillsSectionSkeleton
 *
 * Multiple skill items for section loading state.
 * Default 5 items to match typical skill list length.
 */
export function SkillsSectionSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkillItemSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * SkillDetailSkeleton
 *
 * Expanded skill detail placeholder.
 */
export function SkillDetailSkeleton() {
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg animate-pulse">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <SkeletonText width="30%" className="h-3" />
          <SkeletonText width="15%" className="h-3" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <SkeletonText width="100%" className="h-4" />
        <SkeletonText width="90%" className="h-4" />
        <SkeletonText width="60%" className="h-4" />
      </div>

      {/* Evidence items */}
      <div className="space-y-2">
        <SkeletonText width="25%" className="h-3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <SkeletonText width="80%" className="h-3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillsSectionSkeleton
