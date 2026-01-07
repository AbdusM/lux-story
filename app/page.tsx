import StatefulGameInterface from '@/components/StatefulGameInterface'
import { GameErrorBoundary } from '@/components/LayeredErrorBoundaries'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ willChange: 'auto', contain: 'layout style paint' }}>
      <GameErrorBoundary>
        <StatefulGameInterface />
      </GameErrorBoundary>
    </main>
  )
}