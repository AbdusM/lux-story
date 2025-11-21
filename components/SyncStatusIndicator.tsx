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
    } else if (queueStats.pending > 0) {
      setShowStatus(true)
      setStatusMessage(`${queueStats.pending} pending`)
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
    <div className={cn(
      "flex items-center gap-1.5 text-[10px] font-medium transition-opacity duration-300",
      showStatus ? "opacity-100" : "opacity-0"
    )}>
      <div className={cn(
        "w-1.5 h-1.5 rounded-full",
        isProcessing ? "bg-blue-500 animate-pulse" :
        statusColor.replace('text-', 'bg-')
      )} />
      <span className={statusColor}>{statusMessage}</span>
    </div>
  )
}
