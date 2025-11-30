'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function LandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with your email service (Mailchimp, ConvertKit, etc.)
    // Email signup logic will be implemented later
    setSubmitted(true)
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setEmail('')
    }, 3000)
  }

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

      {/* Email Signup Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            Coming to Steam
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Get notified when we launch on Steam + receive exclusive updates
          </p>
          
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <Button 
                type="submit" 
                size="lg"
                className="bg-slate-900 hover:bg-slate-800"
                disabled={submitted}
              >
                {submitted ? '✓' : 'Notify Me'}
              </Button>
            </div>
            {submitted && (
              <p className="mt-4 text-green-600">Thanks! We'll be in touch.</p>
            )}
          </form>
        </div>
      </section>

      {/* Screenshots Section (Placeholder) */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">
            See It In Action
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Placeholder for screenshots */}
            <div className="bg-slate-200 rounded-lg aspect-video flex items-center justify-center text-slate-500">
              Screenshot 1
            </div>
            <div className="bg-slate-200 rounded-lg aspect-video flex items-center justify-center text-slate-500">
              Screenshot 2
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
