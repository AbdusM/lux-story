'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 text-slate-900">
            Lux Story
          </h1>
          <p className="text-2xl text-slate-700 mb-4">
            A contemplative game where nothing is urgent
          </p>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Discover your career path through calm choices with Lux, a sloth in a digital forest.
            No scores, no achievements, no pressure—just contemplation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/play">
              <Button size="lg" className="text-lg px-8 py-6 bg-slate-900 hover:bg-slate-800">
                Play Free
              </Button>
            </Link>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="text-3xl mb-3">🦥</div>
              <h3 className="font-semibold text-lg mb-2">Meet Lux</h3>
              <p className="text-slate-600">
                A sloth who moves at the speed of contemplation. No rush, no urgency, just presence.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="text-3xl mb-3">🌲</div>
              <h3 className="font-semibold text-lg mb-2">Digital Forest</h3>
              <p className="text-slate-600">
                Explore a contemplative space where career insights emerge naturally through your choices.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-lg mb-2">Career Discovery</h3>
              <p className="text-slate-600">
                Discover your natural career affinities through play, not testing. No pressure, just exploration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Play Now CTA Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            Ready to Explore?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Start your journey through Terminus today
          </p>

          <Link href="/play">
            <Button size="lg" className="text-lg px-12 py-6 bg-slate-900 hover:bg-slate-800">
              Begin Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
            What Awaits You
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-8 border border-slate-200">
              <div className="text-4xl mb-4">🚂</div>
              <h3 className="font-semibold text-lg mb-2">Mysterious Platforms</h3>
              <p className="text-slate-600">Each platform reveals a different career path through immersive storytelling</p>
            </div>
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-8 border border-slate-200">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold text-lg mb-2">Pattern Discovery</h3>
              <p className="text-slate-600">Your choices reveal your natural strengths and decision-making style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-slate-500 border-t border-slate-200">
        <p className="mb-4">Made with 🦥 by Lux Story Team</p>
        <div className="flex justify-center gap-4">
          {/* Add social links here */}
          <a href="#" className="hover:text-slate-700">Twitter</a>
          <a href="#" className="hover:text-slate-700">TikTok</a>
          {/* Add Steam wishlist link when ready */}
        </div>
      </footer>
    </main>
  )
}
