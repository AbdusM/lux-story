import { createAdminMetadata } from '@/lib/metadata'

export const metadata = createAdminMetadata('Dashboard')

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
