import type { Metadata, Viewport } from 'next'
import { ErrorBoundary } from '@/components/ErrorBoundary'

import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'
import { SVGFilterProvider } from '@/lib/svg-filters'
import { GodModeBootstrap } from '@/components/GodModeBootstrap'
import { DevFeatureFlagsGlobal } from '@/components/DevFeatureFlagsGlobal'
import { ToastProvider } from '@/components/ui/toast'
// Sentry config is auto-loaded by Next.js - don't import directly
import './globals.css'
import '../styles/accessibility.css'
import '../styles/game-juice.css'
import '../styles/grand-central.css'
import '../styles/environmental-response.css'
import '../styles/narrative-interactions.css'
// Initialize experience content to avoid circular dependencies
import '@/lib/init-experiences'

// Helper to safely create URL for metadataBase
function getMetadataBase(): URL {
  try {
    const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://lux-story.com'
    return new URL(url)
  } catch {
    // Fallback if URL parsing fails
    return new URL('https://lux-story.com')
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "Lux Story - Career Exploration Game",
  description: 'A contemplative career exploration game. Discover your path through calm choices with Lux, a sloth in a digital forest.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lux Story'
  },
  openGraph: {
    title: 'Lux Story - Career Exploration Game',
    description: 'A contemplative career exploration game. Discover your path through calm choices.',
    type: 'website',
    url: 'https://lux-story.com',
    siteName: 'Lux Story',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lux Story - Career Exploration Game'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lux Story - Career Exploration Game',
    description: 'A contemplative career exploration game. Discover your path through calm choices.',
    images: ['/og-image.png']
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1d4ed8',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="grand-central-terminus" suppressHydrationWarning style={{
        fontSize: 'var(--font-size-base, 1rem)'
      }}>
        {/* Global SVG filter definitions for gooey/glow effects */}
        <SVGFilterProvider />
        {/* God Mode API - Development only */}
        <GodModeBootstrap />
        {/* Feature flag console helpers - Development only */}
        <DevFeatureFlagsGlobal />
        <ServiceWorkerProvider>

          <ErrorBoundary>
            <ToastProvider>
              <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 environment-responsive"
                style={{
                  backgroundColor: 'var(--bg-primary, inherit)',
                  color: 'var(--text-primary, inherit)'
                }}>
                {children}
              </div>
            </ToastProvider>
          </ErrorBoundary>
        </ServiceWorkerProvider>
      </body>
    </html>
  )
}
