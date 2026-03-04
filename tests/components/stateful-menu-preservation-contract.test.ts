import fs from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'

describe('StatefulGameInterface async state preservation contract', () => {
  it('does not use legacy panel booleans for Journal/Constellation (overlay-store is canonical)', () => {
    const filePath = path.join(process.cwd(), 'components/StatefulGameInterface.tsx')
    const content = fs.readFileSync(filePath, 'utf-8')

    expect(content).not.toContain('showJournal')
    expect(content).not.toContain('showConstellation')
  })

  it('locks background choice interactions while blocking overlays are open', () => {
    const filePath = path.join(process.cwd(), 'components/StatefulGameInterface.tsx')
    const content = fs.readFileSync(filePath, 'utf-8')

    expect(content).toContain('const hasBlockingGameplayInput =')
    expect(content).toContain('const hasBlockingGameplayInput = overlayBlocksGameplayInput')
    expect(content).not.toContain('state.showJournal')
    expect(content).not.toContain('state.showConstellation')
    expect(content).toContain('isProcessing={state.isProcessing || hasBlockingGameplayInput}')
  })
})
