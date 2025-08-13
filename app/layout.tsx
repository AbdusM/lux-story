import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './globals.css'
import '../styles/accessibility.css'
import '../styles/game-juice.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Lux's Journey",
  description: 'A meditative adventure through the digital forest',
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
      <body className={inter.className} style={{ 
        fontSize: 'var(--font-size-base, 1rem)',
        touchAction: 'none',
        overscrollBehavior: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}>
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
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