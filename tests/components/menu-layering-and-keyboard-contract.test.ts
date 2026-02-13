import fs from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'

describe('Menu layering and keyboard contracts', () => {
  it('uses shared Z_INDEX layering across UnifiedMenu, Journal, and ConstellationPanel', () => {
    const unifiedMenu = fs.readFileSync(path.join(process.cwd(), 'components/UnifiedMenu.tsx'), 'utf-8')
    const journal = fs.readFileSync(path.join(process.cwd(), 'components/Journal.tsx'), 'utf-8')
    const constellation = fs.readFileSync(path.join(process.cwd(), 'components/constellation/ConstellationPanel.tsx'), 'utf-8')

    expect(unifiedMenu).toContain("import { Z_INDEX } from '@/lib/ui-constants'")
    expect(unifiedMenu).toContain('zIndex: Z_INDEX.modalBackdrop')
    expect(unifiedMenu).toContain('zIndex: Z_INDEX.popover')

    expect(journal).toContain('import { Z_INDEX } from "@/lib/ui-constants"')
    expect(journal).toContain('zIndex: Z_INDEX.modalBackdrop')
    expect(journal).toContain('zIndex: Z_INDEX.modal')

    expect(constellation).toContain("import { Z_INDEX } from '@/lib/ui-constants'")
    expect(constellation).toContain('zIndex: Z_INDEX.modalBackdrop')
    expect(constellation).toContain('zIndex: Z_INDEX.modal')
  })

  it('keeps keyboard close/navigation handlers on side menus', () => {
    const unifiedMenu = fs.readFileSync(path.join(process.cwd(), 'components/UnifiedMenu.tsx'), 'utf-8')
    const journal = fs.readFileSync(path.join(process.cwd(), 'components/Journal.tsx'), 'utf-8')
    const constellation = fs.readFileSync(path.join(process.cwd(), 'components/constellation/ConstellationPanel.tsx'), 'utf-8')

    expect(unifiedMenu).toContain("if (e.key === 'Escape' && isOpen)")
    expect(journal).toContain("if (e.key === 'Escape')")
    expect(constellation).toContain("if (e.key === 'Escape')")
    expect(constellation).toContain("if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')")
  })
})
