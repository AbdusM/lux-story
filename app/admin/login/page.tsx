'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, ArrowRight } from 'lucide-react'

/**
 * Admin Login Redirect Page
 *
 * Redirects to main login - admin access is now role-based
 * No separate password needed
 */
export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main page after 3 seconds
    const timeout = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-2xl">Admin Access</CardTitle>
          </div>
          <CardDescription>
            Redirecting to login...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">
              Admin access is now integrated with your user account.
            </p>
            <p className="text-sm text-blue-800">
              Please sign in with your educator or admin account credentials.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>Redirecting to main page</span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>

          <div className="pt-4 border-t text-sm text-gray-600">
            <p className="font-medium mb-2">For Birmingham educators and administrators:</p>
            <p>If you don't have an account with admin or educator permissions, contact your program coordinator.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
