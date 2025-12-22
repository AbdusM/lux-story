"use client"

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/service-worker'

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // FORCE UNREGISTER to clear stale caches - The user is seeing old interface elements
    // We are currently disabling PWA features to ensure the latest deployment is always served
    import('@/lib/service-worker').then(mod => mod.unregisterServiceWorker())

    // Legacy logic preserved but disabled for now:
    /*
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/service-worker').then(mod => mod.unregisterServiceWorker())
    } else {
      registerServiceWorker()
    }
    */
  }, [])

  return <>{children}</>
}
