'use client'

import React from 'react'
import { X, Sparkles, ArrowRight, Heart, Crown, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRISM_TAB_LABELS, type PrismTabId } from '@/lib/prism-tabs'
import type { RewardFeedItem } from '@/lib/reward-feed'

type RewardFeedProps = {
  items: RewardFeedItem[]
  onDismissItem: (id: string) => void
  onOpenPrismTab: (tab: PrismTabId) => void
  className?: string
}

function iconFor(kind: RewardFeedItem['kind']) {
  switch (kind) {
    case 'trust':
      return Heart
    case 'orb':
      return Sparkles
    case 'unlock':
      return Crown
    default:
      return Info
  }
}

export function RewardFeed({ items, onDismissItem, onOpenPrismTab, className }: RewardFeedProps) {
  if (!items || items.length === 0) return null

  const shown = items.slice(-2).reverse() // Most recent first.

  return (
    <div className={cn('space-y-2', className)} data-testid="reward-feed">
      {shown.map((item) => {
        const Icon = iconFor(item.kind)
        const countSuffix = item.count && item.count > 1 ? ` x${item.count}` : ''
        return (
          <div
            key={item.id}
            className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-md px-3 py-2 flex items-start gap-2"
            data-testid="reward-feed-item"
          >
            <Icon className="h-4 w-4 text-slate-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-slate-200">
                {item.title}{countSuffix}
              </div>
              {item.detail && (
                <div className="text-[11px] text-slate-300">
                  {item.detail}
                </div>
              )}
              {item.prismTab && item.prismTab !== 'god_mode' && (
                <button
                  type="button"
                  onClick={() => onOpenPrismTab(item.prismTab as PrismTabId)}
                  className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-200 hover:text-white"
                  data-testid={`reward-feed-open-${item.prismTab}`}
                >
                  <span>Open {PRISM_TAB_LABELS[item.prismTab]}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismissItem(item.id)}
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Dismiss reward"
              data-testid="reward-feed-dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

