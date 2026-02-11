import { z } from 'zod'

export const INTERACTION_EVENT_TYPES = [
  'node_entered',
  'choice_presented',
  'choice_compact_toggled',
  'choice_selected_ui',
  'choice_selected_result',
  'experiment_assigned',
] as const

export type InteractionEventType = (typeof INTERACTION_EVENT_TYPES)[number]

export function isInteractionEventType(v: string): v is InteractionEventType {
  return (INTERACTION_EVENT_TYPES as readonly string[]).includes(v)
}

// Payload schemas are intentionally permissive (`passthrough`) so we can validate
// core invariants without blocking gameplay telemetry writes.
const ChoicePresentedPayloadSchema = z.object({
  event_id: z.string().min(1),
  presented_at_ms: z.number().finite(),
  presentation_mode: z.enum(['full', 'compact']).optional(),
  hidden_count: z.number().int().optional(),
  hidden_reason: z.enum(['compact_mode']).nullable().optional(),
  nervous_system_state: z.string().nullable().optional(),
  mercy_unlocked_choice_id: z.string().nullable().optional(),
  choices_total_count: z.number().int().optional(),
  choices_shown_count: z.number().int().optional(),
  compact_mode_enabled: z.boolean().optional(),
  compact_mode_expanded: z.boolean().optional(),
  compact_mode_max_shown: z.number().int().nullable().optional(),
  compact_hidden_count: z.number().int().optional(),
  choices: z.array(z.object({
    index: z.number().int(),
    choice_id: z.string().nullable(),
    pattern: z.string().nullable().optional(),
    gravity_weight: z.number().finite().nullable().optional(),
    gravity_effect: z.string().nullable().optional(),
    is_enabled: z.boolean().optional(),
    is_locked: z.boolean().optional(),
    lock_reason: z.string().nullable().optional(),
    lock_reason_details: z.object({
      code: z.string().min(1).optional(),
      why: z.string().min(1),
      how: z.string().min(1),
      progress: z.object({ current: z.number().finite(), required: z.number().finite() }).optional(),
    }).nullable().optional(),
    disabled_reason_code: z.string().nullable().optional(),
    disabled_reason: z.string().nullable().optional(),
    disabled_reason_details: z.object({
      code: z.string().min(1).nullable().optional(),
      why: z.string().min(1),
      how: z.string().min(1),
      progress: z.object({ current: z.number().finite(), required: z.number().finite() }).optional(),
    }).nullable().optional(),
    required_orb_fill: z.unknown().nullable().optional(),
  }).passthrough())
}).passthrough()

const ChoiceCompactToggledPayloadSchema = z.object({
  event_id: z.string().min(1),
  toggled_at_ms: z.number().finite(),
  presented_event_id: z.string().nullable().optional(),
  expanded: z.boolean(),
  choices_total_count: z.number().int().optional(),
  choices_shown_count: z.number().int().optional(),
  compact_max_shown: z.number().int().nullable().optional(),
  compact_hidden_count: z.number().int().optional(),
}).passthrough()

const NodeEnteredPayloadSchema = z.object({
  event_id: z.string().min(1),
  entered_at_ms: z.number().finite(),
  from_node_id: z.string().nullable().optional(),
  reason: z.enum(['init', 'choice', 'return', 'unknown']).nullable().optional(),
}).passthrough()

const ChoiceSelectedUiPayloadSchema = z.object({
  event_id: z.string().min(1),
  presented_event_id: z.string().nullable(),
  selected_choice_id: z.string().min(1),
  selected_index: z.number().int().nullable(),
  reaction_time_ms: z.number().finite(),
}).passthrough()

const ChoiceSelectedResultPayloadSchema = z.object({
  // Authoritative game-logic telemetry; keep permissive.
  reaction_time_ms: z.number().finite().nullable().optional(),
  earned_pattern: z.string().nullable().optional(),
  trust_delta: z.number().finite().nullable().optional(),
}).passthrough()

const ExperimentAssignedPayloadSchema = z.object({
  event_id: z.string().min(1),
  assigned_at_ms: z.number().finite(),
  test_id: z.string().min(1),
  variant: z.string().min(1),
  assignment_version: z.string().min(1),
}).passthrough()

const InteractionEventPayloadSchemas: Record<InteractionEventType, z.ZodTypeAny> = {
  node_entered: NodeEnteredPayloadSchema,
  choice_presented: ChoicePresentedPayloadSchema,
  choice_compact_toggled: ChoiceCompactToggledPayloadSchema,
  choice_selected_ui: ChoiceSelectedUiPayloadSchema,
  choice_selected_result: ChoiceSelectedResultPayloadSchema,
  experiment_assigned: ExperimentAssignedPayloadSchema,
}

export function validateInteractionEventPayload(eventType: string, payload: unknown): string[] {
  if (!isInteractionEventType(eventType)) {
    return [`unknown event_type "${eventType}"`]
  }

  const schema = InteractionEventPayloadSchemas[eventType]
  const result = schema.safeParse(payload)
  if (result.success) return []

  return result.error.issues.slice(0, 24).map((i) => {
    const path = i.path.length > 0 ? i.path.join('.') : '(root)'
    return `${path}: ${i.message}`
  })
}
