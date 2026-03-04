import { describe, expect, it } from 'vitest'
import { WORLD_CANON_CONTRACT } from '../../content/world-canon'

describe('world canon contract', () => {
  it('declares canonical and timeline docs', () => {
    expect(WORLD_CANON_CONTRACT.canonicalDocs.length).toBeGreaterThan(0)
    expect(WORLD_CANON_CONTRACT.timelineDocs.length).toBeGreaterThan(0)
  })

  it('keeps timeline eras contiguous and open-ended at present', () => {
    const eras = WORLD_CANON_CONTRACT.eras
    expect(eras.length).toBeGreaterThan(0)
    expect(eras[0].startAS).toBe(0)
    expect(eras[eras.length - 1].endAS).toBeNull()

    for (let i = 0; i < eras.length - 1; i += 1) {
      expect(eras[i].endAS).not.toBeNull()
      expect(eras[i].endAS).toBe(eras[i + 1].startAS)
    }
  })

  it('defines phrase anchors with target documents', () => {
    expect(WORLD_CANON_CONTRACT.requiredAnchors.length).toBeGreaterThan(0)
    for (const anchor of WORLD_CANON_CONTRACT.requiredAnchors) {
      expect(anchor.id.length).toBeGreaterThan(0)
      expect(anchor.phrase.length).toBeGreaterThan(0)
      expect(anchor.docPaths.length).toBeGreaterThan(0)
    }
  })
})
