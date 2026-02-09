import React from 'react'
import { X, Sparkles, ArrowRight, Heart, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRISM_TAB_LABELS, type PrismTabId } from '@/lib/prism-tabs'
import type { OutcomeCardData, OutcomeItem } from '@/lib/outcome-card'

type OutcomeCardProps = {
  card: OutcomeCardData
  onDismiss: () => void
  onOpenPrismTab: (tab: PrismTabId) => void
  className?: string
}

function iconForItem(item: OutcomeItem) {
  switch (item.kind) {
    case 'trust':
      return Heart
    case 'orb':
      return Sparkles
    case 'unlock':
      return Crown
    default:
      return Sparkles
  }
}

export function OutcomeCard({ card, onDismiss, onOpenPrismTab, className }: OutcomeCardProps) {
  const deepLinkTabs = Array.from(new Set(card.items.map(i => i.prismTab).filter(Boolean))) as PrismTabId[]

  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-gradient-to-b from-slate-950/70 to-slate-900/40 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
        className
      )}
      data-testid="outcome-card"
    >
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-200">
            <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span>Outcome</span>
          </div>
          <div className="mt-2 space-y-1">
            {card.items.slice(0, 3).map((item, idx) => {
              const Icon = iconForItem(item)
              return (
                <div key={`${card.id}-${idx}`} className="flex gap-2 text-xs text-slate-200">
                  <Icon className="h-4 w-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <span className="font-semibold">{item.title}</span>
                    {item.detail && <span className="text-slate-300">: {item.detail}</span>}
                  </div>
                </div>
              )
            })}
            {card.items.length > 3 && (
              <div className="text-[11px] text-slate-400">
                +{card.items.length - 3} more
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Dismiss outcome"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {deepLinkTabs.length > 0 && (
        <div className="px-3 pb-3 pt-0 flex flex-wrap gap-2">
          {deepLinkTabs.slice(0, 2).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => onOpenPrismTab(tab)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-white/10 transition-colors"
              data-testid={`outcome-deeplink-${tab}`}
            >
              <span>Open {PRISM_TAB_LABELS[tab]}</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

