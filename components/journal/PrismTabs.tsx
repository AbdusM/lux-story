import React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PrismTabDef<TTabId extends string> = {
  id: TTabId
  label: string
  icon: LucideIcon
}

type PrismTabsVariant = 'top' | 'bottom'

type PrismTabsProps<TTabId extends string> = {
  tabs: Array<PrismTabDef<TTabId>>
  activeTab: TTabId
  onSelect: (tabId: TTabId) => void
  tabBadges?: Partial<Record<TTabId, boolean>>
  prefersReducedMotion?: boolean
  variant?: PrismTabsVariant
  ariaLabel?: string
}

function getVariantClass(variant: PrismTabsVariant) {
  if (variant === 'bottom') {
    return {
      wrapper: 'flex-shrink-0 border-t border-white/10 overflow-x-auto no-scrollbar bg-slate-900/50',
      inner: 'flex',
      button: 'flex-1 py-3 px-2 text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[56px] relative',
      icon: 'w-4 h-4 transition-transform',
      label: 'text-2xs truncate max-w-full',
      badgePos: 'absolute top-1 right-1',
      badgeSvg: 'w-3 h-3 absolute -inset-0.5',
      badgeStrokeWidth: 1,
      badgeDot: 'w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]',
      activeIndicator: 'absolute top-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-purple-600',
    } as const
  }

  return {
    wrapper: 'flex border-b border-white/10 overflow-x-auto no-scrollbar',
    inner: undefined,
    button: 'flex-1 py-4 px-4 text-xs font-medium transition-colors flex flex-col items-center gap-1.5 min-w-[72px] relative',
    icon: 'w-5 h-5 transition-transform',
    label: undefined,
    badgePos: 'absolute top-1.5 right-1.5',
    badgeSvg: 'w-4 h-4 absolute -inset-1',
    badgeStrokeWidth: 0.75,
    badgeDot: 'w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    activeIndicator: 'absolute bottom-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-purple-600',
  } as const
}

export function PrismTabs<TTabId extends string>({
  tabs,
  activeTab,
  onSelect,
  tabBadges,
  prefersReducedMotion,
  variant = 'top',
  ariaLabel = 'Prism navigation',
}: PrismTabsProps<TTabId>) {
  const classes = getVariantClass(variant)

  return (
    <div className={classes.wrapper} role="tablist" aria-label={ariaLabel}>
      <div className={classes.inner}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            role="tab"
            id={`prism-tab-${variant}-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`prism-panel-${tab.id}`}
            className={cn(
              classes.button,
              activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <tab.icon
              className={cn(classes.icon, activeTab === tab.id && 'scale-110')}
              aria-hidden="true"
              focusable="false"
            />
            <span className={classes.label}>{tab.label}</span>

            {/* Badge indicator for new content - Marquee style */}
            {tabBadges?.[tab.id] && (
              <motion.div
                initial={prefersReducedMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                className={classes.badgePos}
              >
                <svg className={classes.badgeSvg} viewBox="0 0 20 20" aria-hidden="true">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={classes.badgeStrokeWidth}
                    strokeDasharray="2 4"
                    className={prefersReducedMotion ? '' : 'animate-[spin_4s_linear_infinite]'}
                    opacity="0.6"
                  />
                </svg>
                <div className={classes.badgeDot} />
              </motion.div>
            )}

            {activeTab === tab.id && (
              <motion.div layoutId={`prism-tab-active-${variant}`} className={classes.activeIndicator} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
