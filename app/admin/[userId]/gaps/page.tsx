import { redirect } from 'next/navigation'

export default function AdminUserGapsPage({ params }: { params: { userId: string } }) {
  redirect(`/admin/${encodeURIComponent(params.userId)}`)
}
