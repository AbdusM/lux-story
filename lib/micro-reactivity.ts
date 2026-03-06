import type { CharacterId } from './graph-registry'
import type { ConsequenceEcho } from './consequence-echoes'

const MICRO_SET_TAG_PREFIX = 'micro:'
const MICRO_CALLBACK_TAG_PREFIX = 'micro-callback:'
const STORAGE_KEY = 'lux-micro-reactivity-runtime-v1'

type MicroMemoryId =
  | 'maya_competition_memory'
  | 'devon_father_memory'
  | 'nadia_model_regret'
  | 'elena_station_seven_loss'
  | 'rohan_previous_visitor_trace'
  | 'quinn_meaning_over_metrics'
  | 'tess_shop_floor_courage'

type MicroMemoryRecord = {
  setAtTurn: number
  sourceCharacter: CharacterId
}

type MicroCallbackHistoryRecord = {
  triggerCount: number
  lastTriggeredTurn: number
}

export type MicroReactivityRuntimeState = {
  memories: Record<string, MicroMemoryRecord>
  callbackHistory: Record<string, MicroCallbackHistoryRecord>
}

type MicroCallbackDefinition = {
  memoryId: MicroMemoryId
  characterId: CharacterId
  minTurnsSinceSet: number
  cooldownTurns: number
  maxTriggersPerSession: number
  echo: ConsequenceEcho
}

const CALLBACK_DEFINITIONS: readonly MicroCallbackDefinition[] = [
  {
    memoryId: 'maya_competition_memory',
    characterId: 'maya',
    minTurnsSinceSet: 2,
    cooldownTurns: 12,
    maxTriggersPerSession: 1,
    echo: {
      text: "Maya glances up from the schematics. \"Funny. I still think about that 2am rebuild after regionals. Rival teams can become your best collaborators.\"",
      emotion: 'warm',
      timing: 'immediate',
      soundCue: 'faction-engineers',
    },
  },
  {
    memoryId: 'devon_father_memory',
    characterId: 'devon',
    minTurnsSinceSet: 2,
    cooldownTurns: 12,
    maxTriggersPerSession: 1,
    echo: {
      text: "\"You were right about my dad,\" Devon says quietly. \"That wiring lesson still runs under everything I build.\"",
      emotion: 'knowing',
      timing: 'immediate',
      soundCue: 'faction-engineers',
    },
  },
  {
    memoryId: 'nadia_model_regret',
    characterId: 'nadia',
    minTurnsSinceSet: 2,
    cooldownTurns: 12,
    maxTriggersPerSession: 1,
    echo: {
      text: "Nadia folds her arms, then softens. \"I still audit every model like it's that first failure all over again. You helped me name why.\"",
      emotion: 'honest',
      timing: 'immediate',
      soundCue: 'faction-data-flow',
    },
  },
  {
    memoryId: 'elena_station_seven_loss',
    characterId: 'elena',
    minTurnsSinceSet: 2,
    cooldownTurns: 12,
    maxTriggersPerSession: 1,
    echo: {
      text: "\"Station Seven still sits behind every alert I write,\" Elena says. \"You remembered that with me.\"",
      emotion: 'vulnerable',
      timing: 'immediate',
      soundCue: 'faction-data-flow',
    },
  },
  {
    memoryId: 'rohan_previous_visitor_trace',
    characterId: 'rohan',
    minTurnsSinceSet: 2,
    cooldownTurns: 12,
    maxTriggersPerSession: 1,
    echo: {
      text: "Rohan smirks at the debugger output. \"Most people forget the old traces. You didn't. That matters.\"",
      emotion: 'approving',
      timing: 'immediate',
      soundCue: 'echo-rohan',
    },
  },
  {
    memoryId: 'quinn_meaning_over_metrics',
    characterId: 'quinn',
    minTurnsSinceSet: 2,
    cooldownTurns: 12,
    maxTriggersPerSession: 1,
    echo: {
      text: "Quinn nods toward the platform lights. \"You caught the real equation. Returns matter, but meaning compounds faster.\"",
      emotion: 'reflective',
      timing: 'immediate',
      soundCue: 'faction-market-brokerage',
    },
  },
  {
    memoryId: 'tess_shop_floor_courage',
    characterId: 'tess',
    minTurnsSinceSet: 2,
    cooldownTurns: 12,
    maxTriggersPerSession: 1,
    echo: {
      text: "\"Thanks for naming it,\" Tess says, hand on the mixer. \"Courage is easier to carry when someone else sees it too.\"",
      emotion: 'warm',
      timing: 'immediate',
      soundCue: 'pattern-helping',
    },
  },
]

const CALLBACK_BY_KEY = new Map(
  CALLBACK_DEFINITIONS.map((def) => [`${def.characterId}:${def.memoryId}`, def]),
)

let inMemoryRuntimeState: MicroReactivityRuntimeState | null = null

function createEmptyRuntimeState(): MicroReactivityRuntimeState {
  return { memories: {}, callbackHistory: {} }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function sanitizeRuntimeState(raw: unknown): MicroReactivityRuntimeState {
  if (!isPlainObject(raw)) return createEmptyRuntimeState()

  const memories: Record<string, MicroMemoryRecord> = {}
  const callbackHistory: Record<string, MicroCallbackHistoryRecord> = {}

  const rawMemories = isPlainObject(raw.memories) ? raw.memories : {}
  for (const [key, value] of Object.entries(rawMemories)) {
    if (!isPlainObject(value)) continue
    const setAtTurn = Number(value.setAtTurn)
    const sourceCharacter = String(value.sourceCharacter ?? '')
    if (!Number.isFinite(setAtTurn) || !sourceCharacter) continue
    memories[key] = { setAtTurn, sourceCharacter: sourceCharacter as CharacterId }
  }

  const rawHistory = isPlainObject(raw.callbackHistory) ? raw.callbackHistory : {}
  for (const [key, value] of Object.entries(rawHistory)) {
    if (!isPlainObject(value)) continue
    const triggerCount = Number(value.triggerCount)
    const lastTriggeredTurn = Number(value.lastTriggeredTurn)
    if (!Number.isFinite(triggerCount) || !Number.isFinite(lastTriggeredTurn)) continue
    callbackHistory[key] = { triggerCount, lastTriggeredTurn }
  }

  return { memories, callbackHistory }
}

export function loadMicroReactivityRuntimeState(): MicroReactivityRuntimeState {
  if (typeof window === 'undefined') {
    if (!inMemoryRuntimeState) inMemoryRuntimeState = createEmptyRuntimeState()
    return inMemoryRuntimeState
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return createEmptyRuntimeState()

  try {
    return sanitizeRuntimeState(JSON.parse(raw))
  } catch {
    return createEmptyRuntimeState()
  }
}

export function saveMicroReactivityRuntimeState(state: MicroReactivityRuntimeState): void {
  const sanitized = sanitizeRuntimeState(state)

  if (typeof window === 'undefined') {
    inMemoryRuntimeState = sanitized
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized))
  } catch {
    // Non-fatal: runtime still works without persistence.
  }
}

function normalizeMemoryId(raw: string): string | null {
  const normalized = raw.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '')
  return normalized.length > 0 ? normalized : null
}

export function extractMicroMemoryTags(tags: string[] | undefined): {
  memorySetIds: string[]
  callbackIds: string[]
} {
  if (!tags || tags.length === 0) {
    return { memorySetIds: [], callbackIds: [] }
  }

  const memorySetIds: string[] = []
  const callbackIds: string[] = []

  for (const tag of tags) {
    if (tag.startsWith(MICRO_CALLBACK_TAG_PREFIX)) {
      const normalized = normalizeMemoryId(tag.slice(MICRO_CALLBACK_TAG_PREFIX.length))
      if (normalized) callbackIds.push(normalized)
      continue
    }
    if (tag.startsWith(MICRO_SET_TAG_PREFIX)) {
      const normalized = normalizeMemoryId(tag.slice(MICRO_SET_TAG_PREFIX.length))
      if (normalized) memorySetIds.push(normalized)
    }
  }

  return {
    memorySetIds: [...new Set(memorySetIds)],
    callbackIds: [...new Set(callbackIds)],
  }
}

function callbackHistoryKey(characterId: CharacterId, memoryId: string): string {
  return `${characterId}:${memoryId}`
}

export function recordMicroMemories(input: {
  runtimeState: MicroReactivityRuntimeState
  globalFlags: Set<string>
  memorySetIds: string[]
  characterId: CharacterId
  currentTurn: number
}): {
  runtimeState: MicroReactivityRuntimeState
  newlyRecorded: string[]
} {
  if (input.memorySetIds.length === 0) {
    return { runtimeState: input.runtimeState, newlyRecorded: [] }
  }

  const nextState: MicroReactivityRuntimeState = {
    memories: { ...input.runtimeState.memories },
    callbackHistory: { ...input.runtimeState.callbackHistory },
  }
  const newlyRecorded: string[] = []

  for (const memoryId of input.memorySetIds) {
    input.globalFlags.add(`${MICRO_SET_TAG_PREFIX}${memoryId}`)
    if (!nextState.memories[memoryId]) {
      nextState.memories[memoryId] = {
        setAtTurn: input.currentTurn,
        sourceCharacter: input.characterId,
      }
      newlyRecorded.push(memoryId)
    }
  }

  return { runtimeState: nextState, newlyRecorded }
}

export function resolveMicroCallbackEcho(input: {
  runtimeState: MicroReactivityRuntimeState
  globalFlags: Set<string>
  callbackIds: string[]
  characterId: CharacterId
  currentTurn: number
}): {
  runtimeState: MicroReactivityRuntimeState
  echo: ConsequenceEcho | null
} {
  if (input.callbackIds.length === 0) {
    return { runtimeState: input.runtimeState, echo: null }
  }

  const nextState: MicroReactivityRuntimeState = {
    memories: { ...input.runtimeState.memories },
    callbackHistory: { ...input.runtimeState.callbackHistory },
  }

  for (const memoryId of input.callbackIds) {
    const requiredFlag = `${MICRO_SET_TAG_PREFIX}${memoryId}`
    if (!input.globalFlags.has(requiredFlag)) continue

    const def = CALLBACK_BY_KEY.get(`${input.characterId}:${memoryId}`)
    if (!def) continue

    const memoryRecord = nextState.memories[memoryId]
    if (!memoryRecord) continue

    const turnsSinceSet = input.currentTurn - memoryRecord.setAtTurn
    if (turnsSinceSet < def.minTurnsSinceSet) continue

    const historyKey = callbackHistoryKey(input.characterId, memoryId)
    const history = nextState.callbackHistory[historyKey]

    if (history && history.triggerCount >= def.maxTriggersPerSession) continue
    if (history && (input.currentTurn - history.lastTriggeredTurn) < def.cooldownTurns) continue

    nextState.callbackHistory[historyKey] = {
      triggerCount: (history?.triggerCount ?? 0) + 1,
      lastTriggeredTurn: input.currentTurn,
    }

    return {
      runtimeState: nextState,
      echo: def.echo,
    }
  }

  return { runtimeState: nextState, echo: null }
}

export function getMicroCallbackDefinitions(): readonly MicroCallbackDefinition[] {
  return CALLBACK_DEFINITIONS
}
