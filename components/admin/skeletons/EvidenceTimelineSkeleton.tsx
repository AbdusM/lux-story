import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

/**
 * EvidenceTimelineSkeleton
 *
 * Skeleton for EvidenceTimeline component.
 * Matches stats grid + timeline items layout.
 *
 * @see SOFTWARE-DEVELOPMENT-PLAN.md Sprint 1.1
 */
export function EvidenceTimelineSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1 flex-1">
                <SkeletonText width="60%" className="h-6" />
                <SkeletonText width="40%" className="h-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline header skeleton */}
      <div className="flex items-center justify-between">
        <SkeletonText width="120px" className="h-5" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      {/* Timeline items skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <TimelineItemSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * TimelineItemSkeleton
 *
 * Single timeline item placeholder.
 */
export function TimelineItemSkeleton() {
  return (
    <div className="flex gap-4 animate-pulse">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-16 w-0.5" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 space-y-2">
        <div className="flex items-center gap-2">
          <SkeletonText width="80px" className="h-3" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <SkeletonText width="90%" className="h-4" />
        <SkeletonText width="70%" className="h-4" />
      </div>
    </div>
  )
}

export default EvidenceTimelineSkeleton
