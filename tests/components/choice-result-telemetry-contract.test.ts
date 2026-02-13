import fs from 'fs'
import path from 'path'
import { describe, it, expect } from 'vitest'

describe('choice_selected_result telemetry contract', () => {
  it('emits processing latency and outcome fields from runtime choice resolution', () => {
    const filePath = path.join(process.cwd(), 'components/StatefulGameInterface.tsx')
    const content = fs.readFileSync(filePath, 'utf-8')

    expect(content).toContain("event_type: 'choice_selected_result'")
    expect(content).toContain('processing_time_ms: Date.now() - choiceProcessingStartedAt')
    expect(content).toContain('selected_ui_event_id:')
    expect(content).toContain('click_to_dispatch_ms:')
    expect(content).toContain('outcome,')
    expect(content).toContain('result_node_id:')
    expect(content).toContain('error_code:')
  })
})
