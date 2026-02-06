import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminMetadata } from '@/lib/metadata'
import { createClient } from '@/lib/supabase/server'
import { getAdminAuthStatus, isTestAdminBypass } from '@/lib/admin-auth'

export const metadata = createAdminMetadata('Dashboard')

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const requestHeaders = await headers()
  const testAdminToken = requestHeaders.get('x-test-admin')
  const cookieStore = await cookies()
  const testAdminCookie = cookieStore.get('e2e_admin_bypass')?.value
  const isPlaywright = requestHeaders.get('user-agent')?.toLowerCase().includes('playwright') ?? false

  // E2E bypass (token-based) is allowed in production mode because Playwright runs
  // a production build via `next start`. Non-production builds also allow a
  // Playwright user-agent shortcut for local iteration.
  const nonProdPlaywrightBypass = process.env.NODE_ENV !== 'production' && isPlaywright
  const tokenBypass = isTestAdminBypass(testAdminToken) || isTestAdminBypass(testAdminCookie)

  if (nonProdPlaywrightBypass || tokenBypass) {
    return children
  }

  // Only create Supabase client when we know we need real auth checks.
  const supabase = await createClient()
  const authStatus = await getAdminAuthStatus(supabase)

  if (!authStatus.authorized) {
    redirect('/?login=true')
  }

  return children
}
