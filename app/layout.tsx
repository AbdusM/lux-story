import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { EnvironmentalEffects } from '@/components/EnvironmentalEffects'
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'
import { GameContextProvider } from '@/contexts/GameContext'
import './globals.css'
import '../styles/accessibility.css'
import '../styles/game-juice.css'
import '../styles/grand-central.css'
import '../styles/environmental-response.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Grand Central Terminus - Birmingham Career Exploration",
  description: 'A contemplative career exploration game for Birmingham youth',
  manifest: '/manifest.json',
  themeColor: '#1d4ed8',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Grand Central Terminus'
  }
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
        <ServiceWorkerProvider>
          <GameContextProvider>
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
          </GameContextProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  )
}