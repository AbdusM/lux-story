'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

/**
 * Profile Page Error Boundary
 * Handles errors in the profile route gracefully
 */
export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Profile Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-900/30 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Something went wrong</h2>
        </div>

        <p className="text-slate-400">
          We couldn&apos;t load your profile. Your progress is safely stored.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 bg-slate-800 rounded-md border border-slate-700">
            <p className="text-sm font-mono text-red-400 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={reset}
            className="flex items-center gap-2 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  )
}
