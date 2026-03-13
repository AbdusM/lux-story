import { z } from 'zod'

export const OutcomeCheckInSchema = z.object({
  applicationsSubmitted30d: z.number().int().min(0).max(500),
  interviewsSecured30d: z.number().int().min(0).max(100),
  firstInterviewBooked: z.boolean(),
  updatedAt: z.string().datetime(),
})

export type OutcomeCheckIn = z.infer<typeof OutcomeCheckInSchema>

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function extractOutcomeCheckIn(plan: unknown): OutcomeCheckIn | null {
  if (!isPlainObject(plan)) return null
  const result = OutcomeCheckInSchema.safeParse(plan.outcomeCheckIn)
  if (!result.success) return null
  return result.data
}

export function withOutcomeCheckIn(
  plan: Record<string, unknown> | null | undefined,
  outcomeCheckIn: OutcomeCheckIn,
): Record<string, unknown> {
  return {
    ...(isPlainObject(plan) ? plan : {}),
    outcomeCheckIn,
  }
}

