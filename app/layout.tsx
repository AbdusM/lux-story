import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { EnvironmentalEffects } from '@/components/EnvironmentalEffects'
import './globals.css'
import '../styles/accessibility.css'
import '../styles/game-juice.css'
import '../styles/grand-central.css'
import '../styles/environmental-response.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Grand Central Terminus",
  description: 'Career exploration platform for Birmingham workforce development',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} grand-central-terminus`} style={{ 
        fontSize: 'var(--font-size-base, 1rem)',
        touchAction: 'none',
        overscrollBehavior: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}>
        <EnvironmentalEffects />
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 environment-responsive"
               style={{ 
                 backgroundColor: 'var(--bg-primary, inherit)',
                 color: 'var(--text-primary, inherit)'
               }}>
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}