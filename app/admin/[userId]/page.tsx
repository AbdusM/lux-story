import { UrgencySection } from '@/components/admin/sections/UrgencySection'

export default function AdminUserPage({ params }: { params: { userId: string } }) {
  return <UrgencySection userId={params.userId} />
}
