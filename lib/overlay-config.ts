import { z } from 'zod'
import { ShortcutActionSchema } from '@/lib/keyboard-shortcuts'

export const OverlayIdSchema = z.enum([
  'journal',
  'constellation',
  'settings',
  'bottomSheet',
  'report',
  'journeySummary',
  'shortcutsHelp',
  'loginModal',
  'detailModal',
  'identityCeremony',
  'journeyComplete',
  'idleWarning',
  'error',
])

export type OverlayId = z.infer<typeof OverlayIdSchema>

export const OverlayIntentSchema = z.enum(['panel', 'modal', 'cinematic', 'critical'])
export type OverlayIntent = z.infer<typeof OverlayIntentSchema>

export const OverlayDismissReasonSchema = z.enum(['escape', 'backdrop', 'closeButton', 'programmatic'])
export type OverlayDismissReason = z.infer<typeof OverlayDismissReasonSchema>

export const OverlayRenderModeSchema = z.enum(['host', 'anchored'])
export type OverlayRenderMode = z.infer<typeof OverlayRenderModeSchema>

export const OverlayCloseAffordanceSchema = z.enum(['x', 'explicit', 'none'])
export type OverlayCloseAffordance = z.infer<typeof OverlayCloseAffordanceSchema>

export const OverlayLockBodyScrollSchema = z.enum(['never', 'mobile', 'always'])
export type OverlayLockBodyScroll = z.infer<typeof OverlayLockBodyScrollSchema>

export type OverlayRenderModeConfig =
  | OverlayRenderMode
  | { desktop: OverlayRenderMode; mobile: OverlayRenderMode }

export const OverlayRenderModeConfigSchema = z.union([
  OverlayRenderModeSchema,
  z.object({
    desktop: OverlayRenderModeSchema,
    mobile: OverlayRenderModeSchema,
  }),
])

export const OverlayConfigSchema = z.object({
  intent: OverlayIntentSchema,
  exclusiveGroup: z.string().optional(),
  dismissOnEscape: z.boolean(),
  dismissOnBackdrop: z.boolean(),
  // When true, this overlay is automatically dismissed when any other overlay is pushed.
  // Use for ephemeral/transient surfaces like the choice bottom sheet.
  autoDismissOnOverlayPush: z.boolean(),
  blocksGameplayInput: z.boolean(),
  blocksGlobalShortcuts: z.boolean(),
  // ShortcutAction allowlist while global shortcuts are blocked.
  allowedShortcutsWhenBlocked: z.array(ShortcutActionSchema),
  lockBodyScroll: OverlayLockBodyScrollSchema,
  renderMode: OverlayRenderModeConfigSchema,
  closeAffordance: OverlayCloseAffordanceSchema,
})

export type OverlayConfig = z.infer<typeof OverlayConfigSchema>

export const OVERLAY_INTENT_TIER: Record<OverlayIntent, number> = {
  panel: 1,
  modal: 2,
  cinematic: 3,
  critical: 4,
} as const

export const OVERLAY_CONFIG: Record<OverlayId, OverlayConfig> = {
  journal: {
    intent: 'panel',
    exclusiveGroup: 'primaryPanel',
    dismissOnEscape: true,
    dismissOnBackdrop: true,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'mobile',
    renderMode: 'host',
    closeAffordance: 'x',
  },
  constellation: {
    intent: 'panel',
    exclusiveGroup: 'primaryPanel',
    dismissOnEscape: true,
    dismissOnBackdrop: true,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'mobile',
    renderMode: 'host',
    closeAffordance: 'x',
  },
  settings: {
    intent: 'panel',
    exclusiveGroup: 'primaryPanel',
    dismissOnEscape: true,
    dismissOnBackdrop: true,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'mobile',
    renderMode: { desktop: 'anchored', mobile: 'host' },
    closeAffordance: 'explicit',
  },
  bottomSheet: {
    intent: 'panel',
    exclusiveGroup: 'primaryPanel',
    dismissOnEscape: true,
    dismissOnBackdrop: true,
    autoDismissOnOverlayPush: true,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    // Choice selection should remain available while the sheet is open.
    allowedShortcutsWhenBlocked: [
      'escape',
      'selectChoice1',
      'selectChoice2',
      'selectChoice3',
      'selectChoice4',
      'selectChoice5',
      'selectChoice6',
      'selectChoice7',
      'selectChoice8',
      'selectChoice9',
    ],
    lockBodyScroll: 'mobile',
    renderMode: 'host',
    closeAffordance: 'explicit',
  },

  report: {
    intent: 'modal',
    dismissOnEscape: true,
    dismissOnBackdrop: false,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'mobile',
    renderMode: 'host',
    closeAffordance: 'explicit',
  },
  journeySummary: {
    intent: 'modal',
    dismissOnEscape: true,
    dismissOnBackdrop: true,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'mobile',
    renderMode: 'host',
    closeAffordance: 'x',
  },
  shortcutsHelp: {
    intent: 'modal',
    dismissOnEscape: true,
    dismissOnBackdrop: true,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'never',
    renderMode: 'host',
    closeAffordance: 'x',
  },
  loginModal: {
    intent: 'modal',
    dismissOnEscape: true,
    dismissOnBackdrop: true,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'never',
    renderMode: 'host',
    closeAffordance: 'x',
  },
  detailModal: {
    intent: 'modal',
    dismissOnEscape: true,
    dismissOnBackdrop: true,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'mobile',
    renderMode: 'host',
    closeAffordance: 'explicit',
  },

  identityCeremony: {
    intent: 'cinematic',
    exclusiveGroup: 'cinematic',
    dismissOnEscape: false,
    dismissOnBackdrop: false,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'always',
    renderMode: 'host',
    closeAffordance: 'explicit',
  },
  journeyComplete: {
    intent: 'cinematic',
    exclusiveGroup: 'cinematic',
    dismissOnEscape: false,
    dismissOnBackdrop: false,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'always',
    renderMode: 'host',
    closeAffordance: 'explicit',
  },

  idleWarning: {
    intent: 'critical',
    exclusiveGroup: 'critical',
    dismissOnEscape: false,
    dismissOnBackdrop: false,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'never',
    renderMode: 'host',
    closeAffordance: 'explicit',
  },
  error: {
    intent: 'critical',
    exclusiveGroup: 'critical',
    dismissOnEscape: false,
    dismissOnBackdrop: false,
    autoDismissOnOverlayPush: false,
    blocksGameplayInput: true,
    blocksGlobalShortcuts: true,
    allowedShortcutsWhenBlocked: ['escape'],
    lockBodyScroll: 'never',
    renderMode: 'host',
    closeAffordance: 'explicit',
  },
}

// Runtime validation to prevent config drift in production builds.
Object.entries(OVERLAY_CONFIG).forEach(([id, config]) => {
  OverlayIdSchema.parse(id)
  OverlayConfigSchema.parse(config)
})
