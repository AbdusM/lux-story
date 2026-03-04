import { describe, it, expect, beforeEach } from 'vitest'
import { useOverlayStore } from '@/lib/overlay-store'
import { OVERLAY_CONFIG } from '@/lib/overlay-config'

describe('overlay-store', () => {
  beforeEach(() => {
    useOverlayStore.setState({ overlayStack: [] })
  })

  it('pushes and pops overlays with reason-based dismissal', () => {
    const { pushOverlay, popOverlay, getTopOverlayId } = useOverlayStore.getState()

    pushOverlay('journal')
    expect(getTopOverlayId()).toBe('journal')

    popOverlay({ reason: 'escape' })
    expect(getTopOverlayId()).toBe(null)
  })

  it('enforces exclusiveGroup replacement for Tier-1 surfaces', () => {
    const { pushOverlay, isOverlayOpen } = useOverlayStore.getState()

    pushOverlay('journal')
    expect(isOverlayOpen('journal')).toBe(true)

    pushOverlay('constellation')
    expect(isOverlayOpen('journal')).toBe(false)
    expect(isOverlayOpen('constellation')).toBe(true)
  })

  it('does not dismiss non-dismissible overlays on escape/backdrop, but allows programmatic close', () => {
    const { pushOverlay, popOverlay, closeOverlay, isOverlayOpen } = useOverlayStore.getState()

    pushOverlay('identityCeremony')
    expect(isOverlayOpen('identityCeremony')).toBe(true)

    popOverlay({ reason: 'backdrop' })
    expect(isOverlayOpen('identityCeremony')).toBe(true)

    popOverlay({ reason: 'escape' })
    expect(isOverlayOpen('identityCeremony')).toBe(true)

    closeOverlay('identityCeremony')
    expect(isOverlayOpen('identityCeremony')).toBe(false)
  })

  it('computes blocking selectors from overlay config', () => {
    const { pushOverlay, getHasBlockingGameplayInput, getHasBlockingGlobalShortcuts } = useOverlayStore.getState()

    expect(getHasBlockingGameplayInput()).toBe(false)
    expect(getHasBlockingGlobalShortcuts()).toBe(false)

    pushOverlay('shortcutsHelp')
    expect(getHasBlockingGameplayInput()).toBe(true)
    expect(getHasBlockingGlobalShortcuts()).toBe(true)
  })

  it('computes allowed shortcut allowlist from blocking overlays', () => {
    const { pushOverlay, getAllowedShortcutsWhenBlocked } = useOverlayStore.getState()

    expect(getAllowedShortcutsWhenBlocked()).toEqual([])

    pushOverlay('journal')
    expect(getAllowedShortcutsWhenBlocked()).toEqual(['escape'])
  })

  it('allowlists choice selection shortcuts while the bottom sheet blocks global shortcuts', () => {
    const { pushOverlay, getAllowedShortcutsWhenBlocked } = useOverlayStore.getState()

    pushOverlay('bottomSheet')
    const allowed = getAllowedShortcutsWhenBlocked()
    expect(allowed).toContain('escape')
    expect(allowed).toContain('selectChoice1')
    expect(allowed).toContain('selectChoice9')
    expect(allowed).not.toContain('toggleJournal')
  })

  it('auto-dismisses transient overlays when pushing another overlay', () => {
    const { pushOverlay, isOverlayOpen } = useOverlayStore.getState()

    pushOverlay('bottomSheet')
    expect(isOverlayOpen('bottomSheet')).toBe(true)

    pushOverlay('report')
    expect(isOverlayOpen('bottomSheet')).toBe(false)
    expect(isOverlayOpen('report')).toBe(true)
  })

  it('maintains tier ordering when pushing a lower-tier overlay under a higher-tier one', () => {
    const { pushOverlay, getTopOverlayId } = useOverlayStore.getState()

    pushOverlay('shortcutsHelp') // modal (tier 2)
    pushOverlay('journal') // panel (tier 1)

    expect(getTopOverlayId()).toBe('shortcutsHelp')
    expect(useOverlayStore.getState().overlayStack.map((e) => e.id)).toEqual(['journal', 'shortcutsHelp'])
  })

  it('replaces an exclusiveGroup panel beneath an existing modal without disturbing the modal', () => {
    const { pushOverlay, getTopOverlayId } = useOverlayStore.getState()

    pushOverlay('journal')
    pushOverlay('shortcutsHelp') // modal on top
    pushOverlay('constellation') // same exclusiveGroup as journal, should replace under modal

    expect(getTopOverlayId()).toBe('shortcutsHelp')
    expect(useOverlayStore.getState().overlayStack.map((e) => e.id)).toEqual(['constellation', 'shortcutsHelp'])
  })

  it('respects closeAffordance=none for closeButton dismissals', () => {
    const original = OVERLAY_CONFIG.error.closeAffordance
    OVERLAY_CONFIG.error.closeAffordance = 'none'

    try {
      const { pushOverlay, closeOverlay, isOverlayOpen } = useOverlayStore.getState()
      pushOverlay('error')
      expect(isOverlayOpen('error')).toBe(true)

      closeOverlay('error', { reason: 'closeButton' })
      expect(isOverlayOpen('error')).toBe(true)

      closeOverlay('error', { reason: 'programmatic' })
      expect(isOverlayOpen('error')).toBe(false)
    } finally {
      OVERLAY_CONFIG.error.closeAffordance = original
    }
  })
})
