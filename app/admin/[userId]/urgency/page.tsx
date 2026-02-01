import { redirect } from 'next/navigation'

export default function AdminUserUrgencyPage({ params }: { params: { userId: string } }) {
  redirect(`/admin/${encodeURIComponent(params.userId)}`)
}
