import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import StatefulGameInterface from '@/components/StatefulGameInterface'
import { GameErrorBoundary } from '@/components/LayeredErrorBoundaries'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const cookieStore = await cookies()
  const isGuest = cookieStore.get('lux_guest_mode')?.value === 'true'

  if (!user && !isGuest) {
    redirect('/welcome')
  }

  return (
    <main className="min-h-screen" style={{ willChange: 'auto', contain: 'layout style paint' }}>
      <GameErrorBoundary>
        <StatefulGameInterface />
      </GameErrorBoundary>
    </main>
  )
}
