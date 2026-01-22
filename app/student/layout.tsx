import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata(
  'Your Insights',
  'Explore your journey patterns, skill growth, and career discoveries from Grand Central Terminus.'
)

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
