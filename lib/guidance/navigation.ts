import { UI_STORAGE_KEYS } from '@/lib/ui-constants'
import type { GuidanceDestination } from '@/lib/guidance/contracts'

type PushRouter = {
  push: (href: string) => void
}

export function routeToGuidanceDestination(options: {
  destination: GuidanceDestination
  router: PushRouter
  onRequestTab?: (tab: 'careers' | 'opportunities') => void
}): void {
  const { destination, router, onRequestTab } = options

  if (destination.kind === 'none') return

  if (destination.kind === 'tab') {
    if (onRequestTab) {
      onRequestTab(destination.tab)
      return
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(UI_STORAGE_KEYS.resumeToPrism, 'true')
      localStorage.setItem(UI_STORAGE_KEYS.resumeToPrismTab, destination.tab)
    }
    router.push('/')
    return
  }

  router.push(destination.href)
}
