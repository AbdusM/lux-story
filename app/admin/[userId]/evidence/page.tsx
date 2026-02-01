import { redirect } from 'next/navigation'

export default function AdminUserEvidencePage({ params }: { params: { userId: string } }) {
  redirect(`/admin/${encodeURIComponent(params.userId)}`)
}
