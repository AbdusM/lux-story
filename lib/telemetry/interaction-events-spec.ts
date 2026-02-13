import { z } from 'zod'

export const INTERACTION_EVENT_TYPES = [
  'choice_presented',
  'choice_selected_ui',
  'choice_selected_result',
  'node_entered',
  'experiment_assigned',
  'deadlock_recovery_injected',
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
  nervous_system_state: z.string().nullable().optional(),
  mercy_unlocked_choice_id: z.string().nullable().optional(),
  choices: z.array(z.object({
    index: z.number().int(),
    choice_id: z.string().nullable(),
    pattern: z.string().nullable().optional(),
    gravity_weight: z.number().finite().nullable().optional(),
    gravity_effect: z.string().nullable().optional(),
    is_enabled: z.boolean().optional(),
    disabled_reason: z.string().nullable().optional(),
    is_locked: z.boolean().optional(),
    lock_reason: z.string().nullable().optional(),
    required_orb_fill: z.unknown().nullable().optional(),
  }).passthrough())
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
  event_id: z.string().min(1).optional(),
  selected_choice_id: z.string().nullable().optional(),
  selected_choice_text: z.string().nullable().optional(),
  selected_ui_event_id: z.string().nullable().optional(),
  click_to_dispatch_ms: z.number().finite().nullable().optional(),
  reaction_time_ms: z.number().finite().nullable().optional(),
  processing_time_ms: z.number().finite().nullable().optional(),
  earned_pattern: z.string().nullable().optional(),
  trust_delta: z.number().finite().nullable().optional(),
  result_node_id: z.string().nullable().optional(),
  outcome: z.string().min(1).optional(),
  error_code: z.string().nullable().optional(),
}).passthrough()

const NodeEnteredPayloadSchema = z.object({
  event_id: z.string().min(1),
  entered_at_ms: z.number().finite(),
  node_id: z.string().min(1),
  character_id: z.string().min(1).nullable().optional(),
  screen: z.string().nullable().optional(),
}).passthrough()

const ExperimentAssignedPayloadSchema = z.object({
  event_id: z.string().min(1),
  assigned_at_ms: z.number().finite(),
  test_id: z.string().min(1),
  variant: z.string().min(1),
  assignment_version: z.string().min(1),
}).passthrough()

const DeadlockRecoveryInjectedPayloadSchema = z.object({
  event_id: z.string().min(1),
  injected_at_ms: z.number().finite(),
  // Optional link back to `choice_presented.payload.event_id`.
  presented_event_id: z.string().min(1).nullable().optional(),
  recovery_choice_id: z.string().min(1),
  presented_choices_total: z.number().int().optional(),
  non_recovery_choices_total: z.number().int().optional(),
}).passthrough()

const InteractionEventPayloadSchemas: Record<InteractionEventType, z.ZodTypeAny> = {
  choice_presented: ChoicePresentedPayloadSchema,
  choice_selected_ui: ChoiceSelectedUiPayloadSchema,
  choice_selected_result: ChoiceSelectedResultPayloadSchema,
  node_entered: NodeEnteredPayloadSchema,
  experiment_assigned: ExperimentAssignedPayloadSchema,
  deadlock_recovery_injected: DeadlockRecoveryInjectedPayloadSchema,
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
