import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar } from "@/components/ui/skeleton"

/**
 * DashboardSkeleton
 *
 * Full-page skeleton matching SharedDashboardLayout structure.
 * Prevents layout shift during initial data load.
 *
 * @see SOFTWARE-DEVELOPMENT-PLAN.md Sprint 1.1
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header skeleton - matches profile header */}
      <div className="flex items-center gap-4">
        <SkeletonAvatar size={48} />
        <div className="space-y-2 flex-1">
          <SkeletonText width="60%" className="h-6" />
          <SkeletonText width="40%" className="h-4" />
        </div>
      </div>

      {/* Badge group skeleton */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-full" />
        ))}
      </div>

      {/* Stats grid skeleton - 4 stat boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <SkeletonText width="50%" className="h-3" />
                <SkeletonText width="70%" className="h-8" />
                <SkeletonText width="60%" className="h-3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation tabs skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-10 w-24 flex-shrink-0 rounded-md" />
        ))}
      </div>

      {/* Main content skeleton */}
      <Card>
        <CardContent className="p-6 min-h-[400px]">
          <div className="space-y-4">
            <SkeletonText width="30%" className="h-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonCard key={i} height={64} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * DashboardHeaderSkeleton
 *
 * Just the header portion for partial loading states.
 */
export function DashboardHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonAvatar size={48} />
        <div className="space-y-2 flex-1">
          <SkeletonText width="60%" className="h-6" />
          <SkeletonText width="40%" className="h-4" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-full" />
        ))}
      </div>
    </div>
  )
}

/**
 * StatsGridSkeleton
 *
 * Stats section skeleton for summary numbers.
 */
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <SkeletonText width="50%" className="h-3" />
              <SkeletonText width="70%" className="h-8" />
              <SkeletonText width="60%" className="h-3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default DashboardSkeleton
