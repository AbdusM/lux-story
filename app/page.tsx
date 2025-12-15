import StatefulGameInterface from '@/components/StatefulGameInterface'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ willChange: 'auto', contain: 'layout style paint' }}>
      <ErrorBoundary>
        <StatefulGameInterface />
      </ErrorBoundary>
    </main>
  )
}