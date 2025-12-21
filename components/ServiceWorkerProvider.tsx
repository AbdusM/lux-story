"use client"

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/service-worker'

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // FORCE UNREGISTER for development debugging
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/service-worker').then(mod => mod.unregisterServiceWorker())
    } else {
      registerServiceWorker()
    }
  }, [])

  return <>{children}</>
}
