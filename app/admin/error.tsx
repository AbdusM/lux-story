'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

/**
 * Admin Dashboard Error Page
 * Next.js error boundary for /admin routes
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for debugging
    console.error('[Admin Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-red-200 bg-red-50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-900">Dashboard Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-800">
            An unexpected error occurred while loading the admin dashboard.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-red-100 rounded-md border border-red-200">
              <p className="text-sm font-mono text-red-900 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-700 mt-1">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={reset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/admin'}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <p className="text-sm text-red-700 pt-2">
            If this problem persists, please contact your system administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
