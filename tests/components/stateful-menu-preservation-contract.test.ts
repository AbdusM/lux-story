import fs from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'

describe('StatefulGameInterface async state preservation contract', () => {
  it('preserves menu flags from latest state in async choice resolution', () => {
    const filePath = path.join(process.cwd(), 'components/StatefulGameInterface.tsx')
    const content = fs.readFileSync(filePath, 'utf-8')

    expect(content).toContain('setState(prev => ({')
    expect(content).toContain('showJournal: prev.showJournal')
    expect(content).toContain('showConstellation: prev.showConstellation')
    expect(content).toContain('showJourneySummary: prev.showJourneySummary')
  })
})
