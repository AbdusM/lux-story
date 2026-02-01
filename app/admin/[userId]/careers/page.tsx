import { redirect } from 'next/navigation'

export default function AdminUserCareersPage({ params }: { params: { userId: string } }) {
  redirect(`/admin/${encodeURIComponent(params.userId)}`)
}
