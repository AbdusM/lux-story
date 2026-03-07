/**
 * Atmospheric Intro - authored entry point into the first loop.
 *
 * It should:
 * - establish Terminus as a world, not a quote wall
 * - teach the loop in one glance
 * - keep the CTA obvious on desktop and mobile
 */

"use client"

import { Button } from '@/components/ui/button'

interface AtmosphericIntroProps {
  onStart: () => void
}

export function AtmosphericIntro({ onStart }: AtmosphericIntroProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-amber-100/80">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.7)]" />
          Tonight&apos;s Dispatch
        </div>

        <h1
          className="mb-5 text-3xl font-bold text-slate-100 sm:text-4xl"
          data-testid="intro-title"
        >
          Terminus
        </h1>

        <div className="glass-panel rounded-xl p-6 sm:p-8">
          <p className="text-lg leading-relaxed text-slate-100 sm:text-xl">
            The board has already changed once tonight. Someone is about to follow the wrong route, and the man waiting by your door seems certain you arrived in time to notice.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            Step inside. Read the room. Answer before the moment closes, and discover which route answers back.
          </p>

          <div className="mt-5 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-left">
            <div className="text-[10px] uppercase tracking-[0.22em] text-amber-200/70">Before you enter</div>
            <div className="mt-2 grid gap-2 text-sm text-slate-200 sm:grid-cols-3">
              <p>Samuel is already watching your platform.</p>
              <p>Your first decision lands fast.</p>
              <p>The station remembers how you move.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-2 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-amber-200/70">Signal</div>
              <p className="mt-1 text-sm text-slate-200">Catch what is shifting before anyone names it for you.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-sky-200/70">Response</div>
              <p className="mt-1 text-sm text-slate-200">Choose the answer that feels true under pressure, not rehearsed.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-200/70">Route</div>
              <p className="mt-1 text-sm text-slate-200">Watch people, pathways, and returning signals start to recognize you.</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-400">
            Grand Central does not ask who you planned to become. It asks what kind of traveler answers when the board turns.
          </p>
        </div>

        <Button
          onClick={onStart}
          variant="default"
          size="lg"
          className="mt-6 min-h-[48px] w-full bg-violet-600 px-8 font-semibold text-white shadow-lg shadow-violet-900/30 hover:bg-violet-500 sm:w-auto"
          aria-label="Begin your journey at Terminus"
          data-testid="intro-cta"
        >
          Enter the Station
        </Button>
      </div>
    </div>
  )
}
