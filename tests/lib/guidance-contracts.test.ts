import { describe, expect, it } from 'vitest'

import { GuidancePersistenceRecordSchema } from '@/lib/guidance/contracts'
import { createEmptyGuidanceRecord } from '@/lib/guidance/engine'

describe('guidance contracts', () => {
  it('validates the empty persistence record shape', () => {
    const record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')

    const result = GuidancePersistenceRecordSchema.safeParse(record)

    expect(result.success).toBe(true)
  })
})
