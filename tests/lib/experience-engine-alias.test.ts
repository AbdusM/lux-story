import { describe, expect, it } from 'vitest'
import { ExperienceEngine } from '@/lib/experience-engine'

// Ensure adapter-registered experiences exist in the registry for this test.
import '@/lib/loyalty-adapter'

describe('ExperienceEngine.startExperience (alias support)', () => {
  it('accepts node metadata ids like the_honest_course and resolves to an engine id', () => {
    const s = ExperienceEngine.startExperience('the_honest_course')
    expect(s).not.toBeNull()
    expect(s!.experienceId).toBe('honest_course_exp')
  })

  it('accepts the_quiet_hour and resolves to samuel_quiet_hour', () => {
    const s = ExperienceEngine.startExperience('the_quiet_hour')
    expect(s).not.toBeNull()
    expect(s!.experienceId).toBe('samuel_quiet_hour')
  })
})

