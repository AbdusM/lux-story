import { redirect } from 'next/navigation'

export default function AdminUserActionPage({ params }: { params: { userId: string } }) {
  redirect(`/admin/${encodeURIComponent(params.userId)}`)
}
