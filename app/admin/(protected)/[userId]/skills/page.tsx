import { redirect } from 'next/navigation'
import { AdminUserPageProps, getAdminUserId } from '@/lib/types/admin'

export default async function AdminUserSkillsPage({ params }: AdminUserPageProps) {
  const userId = await getAdminUserId(params)
  redirect(`/admin/${encodeURIComponent(userId)}`)
}
