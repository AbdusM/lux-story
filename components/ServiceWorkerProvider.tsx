"use client"

import { useEffect } from 'react'

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force unregister to clear stale caches - ensures latest deployment is served
    import('@/lib/service-worker').then(mod => mod.unregisterServiceWorker())
  }, [])

  return <>{children}</>
}
