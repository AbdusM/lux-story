import { z } from 'zod'

export const ActionPlanFollowUpStatusSchema = z.enum([
  'contacted',
  'follow_up_due',
  'resolved',
])

export const ActionPlanFollowUpSchema = z
  .object({
    status: ActionPlanFollowUpStatusSchema,
    updatedAt: z.string().datetime(),
  })
  .passthrough()

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

export function stripFollowUpStatusFromPlan(
  plan: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  if (!isPlainObject(plan)) return {}

  const { followUpStatus: _followUpStatus, ...rest } = plan
  return rest
}

export function withFollowUpStatus(
  plan: Record<string, unknown> | null | undefined,
  followUpStatus: ActionPlanFollowUp,
): Record<string, unknown> {
  return {
    ...(isPlainObject(plan) ? plan : {}),
    followUpStatus,
  }
}
