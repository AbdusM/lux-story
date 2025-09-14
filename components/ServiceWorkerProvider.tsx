"use client"

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/service-worker'

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker on client side
    registerServiceWorker()
  }, [])

  return <>{children}</>
}
