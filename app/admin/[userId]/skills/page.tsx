import { redirect } from 'next/navigation'

export default function AdminUserSkillsPage({ params }: { params: { userId: string } }) {
  redirect(`/admin/${encodeURIComponent(params.userId)}`)
}
