import { GameInterface } from '@/components/GameInterface'

// Load demo utils in development mode only
if (process.env.NODE_ENV === 'development') {
  import('@/lib/demo-utils')
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <GameInterface />
    </main>
  )
}