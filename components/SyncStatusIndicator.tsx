'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useBackgroundSync } from '@/hooks/useBackgroundSync'

/**
 * SyncStatusIndicator
 * Displays the current synchronization status of the application
 */
export function SyncStatusIndicator() {
  const { queueStats, isProcessing, lastSyncResult } = useBackgroundSync({
    enabled: true,
    intervalMs: 10000 // Check every 10s for UI
  })
  
  const [showStatus, setShowStatus] = useState(false)
  const [statusMessage, setStatusMessage] = useState('All synced')
  const [statusColor, setStatusColor] = useState('text-slate-400')

  useEffect(() => {
    if (!queueStats) return

    if (isProcessing) {
      setShowStatus(true)
      setStatusMessage('Syncing...')
      setStatusColor('text-blue-500')
    } else if (queueStats.totalActions > 0) {
      setShowStatus(true)
      setStatusMessage(`${queueStats.totalActions} pending`)
      setStatusColor('text-amber-500')
    } else if (lastSyncResult && !lastSyncResult.success) {
      setShowStatus(true)
      setStatusMessage('Sync failed')
      setStatusColor('text-red-500')
    } else {
      // Fade out after success
      setStatusMessage('Saved')
      setStatusColor('text-emerald-500')
      const timer = setTimeout(() => setShowStatus(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [queueStats, isProcessing, lastSyncResult])

  return (
    <div
      className="flex items-center"
      title={statusMessage}
      aria-label={statusMessage}
    >
      <div className={cn(
        "w-2 h-2 rounded-full transition-colors duration-300",
        isProcessing ? "bg-blue-400 animate-pulse" :
        lastSyncResult && !lastSyncResult.success ? "bg-red-400" :
        queueStats && queueStats.totalActions > 0 ? "bg-amber-400" :
        "bg-emerald-400"
      )} />
    </div>
  )
}
