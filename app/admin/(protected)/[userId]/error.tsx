'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react'

/**
 * Student Detail Error Page
 * Next.js error boundary for /admin/[userId]/* routes
 */
export default function StudentDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for debugging
    console.error('[Student Detail Error]', error)
  }, [error])

  // Check if this is a "not found" style error
  const isNotFound = error.message?.toLowerCase().includes('not found') ||
                     error.message?.toLowerCase().includes('no profile')

  return (
    <div className="flex items-center justify-center p-6 min-h-[400px]">
      <Card className={`max-w-lg w-full shadow-lg ${isNotFound ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isNotFound ? 'bg-amber-100' : 'bg-red-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${isNotFound ? 'text-amber-600' : 'text-red-600'}`} />
            </div>
            <CardTitle className={isNotFound ? 'text-amber-900' : 'text-red-900'}>
              {isNotFound ? 'Student Not Found' : 'Error Loading Student'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={isNotFound ? 'text-amber-800' : 'text-red-800'}>
            {isNotFound
              ? "We couldn't find this student's profile. They may not have started their journey yet, or the link may be incorrect."
              : "An error occurred while loading this student's data."
            }
          </p>

          {process.env.NODE_ENV === 'development' && !isNotFound && (
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

          <div className="flex flex-wrap gap-3 pt-2">
            {!isNotFound && (
              <Button
                variant="outline"
                onClick={reset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/admin'}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Student List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
