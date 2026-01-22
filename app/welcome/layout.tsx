import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata(
  'Welcome',
  'Begin your journey through Grand Central Terminus - a magical realist career exploration experience.'
)

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
