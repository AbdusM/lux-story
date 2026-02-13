type ChoiceUiSelection = {
  selected_choice_id: string
  node_id: string
  session_id: string
  ui_event_id: string
  selected_at_ms: number
}

const MAX_BUFFER_SIZE = 128
const MAX_AGE_MS = 30_000
const selectionBuffer: ChoiceUiSelection[] = []

function prune(nowMs: number): void {
  for (let i = selectionBuffer.length - 1; i >= 0; i -= 1) {
    const age = nowMs - selectionBuffer[i].selected_at_ms
    if (age > MAX_AGE_MS) {
      selectionBuffer.splice(i, 1)
    }
  }
}

export function recordChoiceUiSelection(entry: ChoiceUiSelection): void {
  prune(entry.selected_at_ms)
  selectionBuffer.push(entry)
  if (selectionBuffer.length > MAX_BUFFER_SIZE) {
    selectionBuffer.splice(0, selectionBuffer.length - MAX_BUFFER_SIZE)
  }
}

export function consumeChoiceUiSelection(params: {
  selected_choice_id: string
  node_id: string
  session_id: string
  now_ms: number
}): ChoiceUiSelection | null {
  prune(params.now_ms)

  for (let i = selectionBuffer.length - 1; i >= 0; i -= 1) {
    const entry = selectionBuffer[i]
    if (
      entry.selected_choice_id === params.selected_choice_id &&
      entry.node_id === params.node_id &&
      entry.session_id === params.session_id
    ) {
      selectionBuffer.splice(i, 1)
      return entry
    }
  }

  return null
}

