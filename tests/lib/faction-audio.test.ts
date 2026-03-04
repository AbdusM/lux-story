import { describe, expect, it } from 'vitest'
import {
  extractFactionFromTags,
  getFactionLeitmotifSoundCue,
  inferFactionAudioContext,
  shouldTriggerFactionLeitmotif,
} from '@/lib/faction-audio'

describe('faction audio context', () => {
  it('extracts explicit faction tags', () => {
    expect(extractFactionFromTags(['mystery', 'faction:data_flow'])).toBe('data_flow')
    expect(extractFactionFromTags(['faction:technocrats'])).toBe('technocrats')
  })

  it('infers faction from source faction first', () => {
    expect(inferFactionAudioContext({ sourceFaction: 'station_core' })).toBe('station_core')
    expect(inferFactionAudioContext({ sourceFaction: 'syn-bio' })).toBe('syn_bio')
  })

  it('falls back to character mapping', () => {
    expect(inferFactionAudioContext({ characterId: 'samuel' })).toBe('station_core')
    expect(inferFactionAudioContext({ characterId: 'market' })).toBe('market_brokerage')
  })

  it('returns leitmotif cues for mapped factions', () => {
    expect(getFactionLeitmotifSoundCue('engineers')).toBe('faction-engineers')
    expect(getFactionLeitmotifSoundCue('market_brokerage')).toBe('faction-market-brokerage')
  })

  it('triggers on explicit faction tags and mystery context', () => {
    expect(shouldTriggerFactionLeitmotif(['faction:naturalists'])).toBe(true)
    expect(shouldTriggerFactionLeitmotif(['mystery', 'breadcrumb'])).toBe(true)
    expect(shouldTriggerFactionLeitmotif(['terminal'])).toBe(false)
  })
})
