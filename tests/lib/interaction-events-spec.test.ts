import { describe, expect, it } from 'vitest'

import { validateInteractionEventPayload } from '@/lib/telemetry/interaction-events-spec'

describe('interaction-events-spec choice_selected_result', () => {
  it('accepts outcome presentation metadata fields', () => {
    const issues = validateInteractionEventPayload('choice_selected_result', {
      event_id: 'evt_1',
      selected_choice_id: 'choice_1',
      processing_time_ms: 120,
      outcome: 'resolved',
      presentation_mode: 'card',
      hidden_count: 1,
      reward_count: 2,
    })

    expect(issues).toEqual([])
  })

  it('rejects invalid presentation metadata values', () => {
    const issues = validateInteractionEventPayload('choice_selected_result', {
      event_id: 'evt_2',
      processing_time_ms: 120,
      outcome: 'resolved',
      presentation_mode: 'overlay',
      hidden_count: -1,
      reward_count: -1,
    })

    expect(issues.join(' ')).toContain('presentation_mode')
    expect(issues.join(' ')).toContain('hidden_count')
    expect(issues.join(' ')).toContain('reward_count')
  })

  it('accepts guidance interaction payloads', () => {
    const issues = validateInteractionEventPayload('recommendation_clicked', {
      event_id: 'guidance_evt_1',
      task_id: 'review_career_matches',
      source_surface: 'opportunities',
      assist_mode: 'augmented',
      reason: 'You already have near-ready matches.',
      guidance_schema_version: '2026-03-v1',
      recommendation_version: '2026-03-v1',
    })

    expect(issues).toEqual([])
  })

  it('rejects malformed guidance interaction payloads', () => {
    const issues = validateInteractionEventPayload('task_completed', {
      event_id: '',
      task_id: '',
      source_surface: '',
      assist_mode: 'magic',
    })

    expect(issues.join(' ')).toContain('event_id')
    expect(issues.join(' ')).toContain('task_id')
    expect(issues.join(' ')).toContain('source_surface')
    expect(issues.join(' ')).toContain('assist_mode')
  })
})
