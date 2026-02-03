import { UrgencySection } from '@/components/admin/sections/UrgencySection'
import { AdminUserPageProps, getAdminUserId } from '@/lib/types/admin'

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  const userId = await getAdminUserId(params)
  return <UrgencySection userId={userId} />
}
