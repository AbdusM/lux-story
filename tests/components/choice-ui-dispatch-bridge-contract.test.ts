import fs from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'

describe('choice UI -> dispatch telemetry bridge contract', () => {
  it('records UI click timing in GameChoices and consumes it in resolver telemetry', () => {
    const gameChoicesPath = path.join(process.cwd(), 'components/GameChoices.tsx')
    const statefulPath = path.join(process.cwd(), 'components/StatefulGameInterface.tsx')

    const gameChoices = fs.readFileSync(gameChoicesPath, 'utf-8')
    const stateful = fs.readFileSync(statefulPath, 'utf-8')

    expect(gameChoices).toContain('recordChoiceUiSelection({')
    expect(gameChoices).toContain('selected_choice_id: stableChoiceId')

    expect(stateful).toContain('consumeChoiceUiSelection({')
    expect(stateful).toContain('click_to_dispatch_ms:')
    expect(stateful).toContain('selected_ui_event_id:')
  })
})

