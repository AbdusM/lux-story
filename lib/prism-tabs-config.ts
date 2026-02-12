export type PrismTabId =
  | 'harmonics'
  | 'essence'
  | 'mastery'
  | 'careers'
  | 'combos'
  | 'opportunities'
  | 'mind'
  | 'toolkit'
  | 'simulations'
  | 'cognition'
  | 'analysis'
  | 'god_mode'

export type PrismTabSpec = {
  id: PrismTabId
  label: string
}

export const PRISM_BASE_TABS: readonly PrismTabSpec[] = [
  { id: 'harmonics', label: 'Harmonics' },
  { id: 'essence', label: 'Essence' },
  { id: 'mastery', label: 'Mastery' },
  { id: 'careers', label: 'Careers' },
  { id: 'combos', label: 'Combos' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'mind', label: 'Mind' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'simulations', label: 'Sims' },
  { id: 'cognition', label: 'Cognition' },
  { id: 'analysis', label: 'Analysis' },
] as const

export const PRISM_GOD_MODE_TAB: PrismTabSpec = { id: 'god_mode', label: 'GOD MODE' }

export function getPrismRuntimeTabs(showGodMode: boolean): PrismTabSpec[] {
  if (!showGodMode) return [...PRISM_BASE_TABS]
  return [...PRISM_BASE_TABS, PRISM_GOD_MODE_TAB]
}

