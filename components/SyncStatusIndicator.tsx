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
  
  const [statusMessage, setStatusMessage] = useState('All synced')

  useEffect(() => {
    if (!queueStats) return

    if (isProcessing) {
      setStatusMessage('Syncing...')
    } else if (queueStats.totalActions > 0) {
      setStatusMessage(`${queueStats.totalActions} pending`)
    } else if (lastSyncResult && !lastSyncResult.success) {
      setStatusMessage('Sync failed')
    } else {
      // Fade out after success
      setStatusMessage('Saved')
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
