import { z } from 'zod'

export const ActionPlanFollowUpStatusSchema = z.enum([
  'contacted',
  'follow_up_due',
  'resolved',
])

export const ActionPlanFollowUpActorSchema = z
  .object({
    userId: z.string().min(1).max(160),
    email: z.string().email().max(320).nullable().optional(),
    fullName: z.string().max(160).nullable().optional(),
  })
  .passthrough()

export const ActionPlanFollowUpSchema = z
  .object({
    status: ActionPlanFollowUpStatusSchema,
    updatedAt: z.string().datetime(),
    note: z.string().max(2_000).optional(),
    updatedBy: ActionPlanFollowUpActorSchema.optional(),
  })
  .passthrough()

export const ActionPlanFollowUpHistorySchema = z
  .array(ActionPlanFollowUpSchema)
  .max(20)

export type ActionPlanFollowUp = z.infer<typeof ActionPlanFollowUpSchema>

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function extractActionPlanFollowUp(plan: unknown): ActionPlanFollowUp | null {
  if (!isPlainObject(plan)) return null

  const result = ActionPlanFollowUpSchema.safeParse(plan.followUpStatus)
  if (!result.success) return null
  return result.data
}

export function extractActionPlanFollowUpHistory(plan: unknown): ActionPlanFollowUp[] {
  if (!isPlainObject(plan)) return []

  const result = ActionPlanFollowUpHistorySchema.safeParse(plan.followUpHistory)
  if (!result.success) return []
  return result.data
}

export function stripFollowUpStatusFromPlan(
  plan: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!isPlainObject(plan)) return {}

  const {
    followUpStatus: _followUpStatus,
    followUpHistory: _followUpHistory,
    ...rest
  } = plan
  return rest
}

export function withFollowUpStatus(
  plan: Record<string, unknown> | null | undefined,
  followUpStatus: ActionPlanFollowUp,
): Record<string, unknown> {
  const existingHistory = extractActionPlanFollowUpHistory(plan)
  return {
    ...(isPlainObject(plan) ? plan : {}),
    followUpStatus,
    followUpHistory: [followUpStatus, ...existingHistory].slice(0, 20),
  }
}
