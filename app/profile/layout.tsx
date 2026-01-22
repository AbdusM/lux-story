import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata(
  'Your Profile',
  'Manage your settings, accessibility preferences, and account for Grand Central Terminus.'
)

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
