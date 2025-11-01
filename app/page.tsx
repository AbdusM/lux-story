import StatefulGameInterface from '@/components/StatefulGameInterface'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ willChange: 'auto', contain: 'layout style paint' }}>
      <StatefulGameInterface />
    </main>
  )
}