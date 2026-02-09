// Shared Prism tab ids (used for deep-linking into the Journal/Prism UI).
// Keep this in lib/ so gameplay UI can reference it without importing components.

export type PrismTabId =
  | 'harmonics'
  | 'essence'
  | 'mastery'
  | 'ranks'
  | 'careers'
  | 'combos'
  | 'opportunities'
  | 'mind'
  | 'toolkit'
  | 'simulations'
  | 'cognition'
  | 'analysis'
  | 'mysteries'
  | 'god_mode'

export const PRISM_TAB_LABELS: Record<PrismTabId, string> = {
  harmonics: 'Harmonics',
  essence: 'Essence',
  mastery: 'Mastery',
  ranks: 'Ranks',
  careers: 'Careers',
  combos: 'Combos',
  opportunities: 'Opportunities',
  mind: 'Mind',
  toolkit: 'Toolkit',
  simulations: 'Sims',
  cognition: 'Cognition',
  analysis: 'Analysis',
  mysteries: 'Mysteries',
  god_mode: 'GOD MODE',
}
