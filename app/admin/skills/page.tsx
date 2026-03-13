import { redirect } from 'next/navigation'

interface LegacyAdminSkillsPageProps {
  searchParams: Promise<{ userId?: string }>
}

export default async function LegacyAdminSkillsPage({
  searchParams,
}: LegacyAdminSkillsPageProps) {
  const { userId } = await searchParams

  if (typeof userId === 'string' && userId.length > 0) {
    redirect(`/admin/${encodeURIComponent(userId)}/skills`)
  }

  redirect('/admin/users')
}
