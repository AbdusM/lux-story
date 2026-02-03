import { redirect } from 'next/navigation'
import { AdminUserPageProps, getAdminUserId } from '@/lib/types/admin'

export default async function AdminUserPatternsPage({ params }: AdminUserPageProps) {
  const userId = await getAdminUserId(params)
  redirect(`/admin/${encodeURIComponent(userId)}`)
}
