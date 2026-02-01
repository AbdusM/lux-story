import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminMetadata } from '@/lib/metadata'
import { createClient } from '@/lib/supabase/server'
import { getAdminAuthStatus, isTestAdminBypass, isE2EAdminBypassEnabled } from '@/lib/admin-auth'

export const metadata = createAdminMetadata('Dashboard')

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const requestHeaders = await headers()
  const testAdminToken = requestHeaders.get('x-test-admin')
  const cookieStore = await cookies()
  const testAdminCookie = cookieStore.get('e2e_admin_bypass')?.value
  const isPlaywright = requestHeaders.get('user-agent')?.toLowerCase().includes('playwright') ?? false
  const canBypass = process.env.NODE_ENV !== 'production'

  if ((canBypass && isPlaywright) || isE2EAdminBypassEnabled() || isTestAdminBypass(testAdminToken) || isTestAdminBypass(testAdminCookie)) {
    return children
  }
  const authStatus = await getAdminAuthStatus(supabase)

  if (!authStatus.authorized) {
    redirect('/?login=true')
  }

  return children
}
