import { extractAdvisorReview } from '@/lib/action-plan/advisor-review'
import { extractActionPlanFollowUp, extractActionPlanFollowUpHistory } from '@/lib/action-plan/follow-up-status'
import { extractOutcomeCheckIn } from '@/lib/action-plan/outcome-check-in'
import { isStudentInsightsInteractionEvent, type StudentInsightsInteractionEventRow } from '@/lib/telemetry/admin-student-insights-helpers'
import type {
  AdminStudentInsightsFunnelStageCounts,
  AdminStudentInsightsQueueFlag,
  AdminStudentInsightsWorklistItem,
  AdminStudentInsightsWorklistSummary,
} from '@/lib/types/admin-api'

type ProfileSnapshot = {
  userId: string
  email: string | null
  fullName: string | null
}

type PlanSnapshot = {
  userId: string
  plan: Record<string, unknown> | null
  updatedAt: string | null
}

function createEmptyCounts(): AdminStudentInsightsFunnelStageCounts {
  return {
    recommendationShown: 0,
    recommendationClicked: 0,
    taskExposed: 0,
    taskStarted: 0,
    assistModeSelected: 0,
    taskCompleted: 0,
    artifactExported: 0,
    outcomeCheckInSubmitted: 0,
  }
}

function recordEvent(counts: AdminStudentInsightsFunnelStageCounts, eventType: string): void {
  switch (eventType) {
    case 'recommendation_shown':
      counts.recommendationShown += 1
      return
    case 'recommendation_clicked':
      counts.recommendationClicked += 1
      return
    case 'task_exposed':
      counts.taskExposed += 1
      return
    case 'task_started':
      counts.taskStarted += 1
      return
    case 'assist_mode_selected':
      counts.assistModeSelected += 1
      return
    case 'task_completed':
      counts.taskCompleted += 1
      return
    case 'artifact_exported':
      counts.artifactExported += 1
      return
    case 'outcome_checkin_submitted':
      counts.outcomeCheckInSubmitted += 1
      return
    default:
      return
  }
}

function roundAverage(total: number, count: number): number {
  if (count <= 0) return 0
  return Math.round((total / count) * 10) / 10
}

function computeFlags(item: {
  counts: AdminStudentInsightsFunnelStageCounts
  advisorReviewStatus: 'draft' | 'needs_work' | 'approved' | null
  outcomeCheckIn: ReturnType<typeof extractOutcomeCheckIn>
}): AdminStudentInsightsQueueFlag[] {
  const flags: AdminStudentInsightsQueueFlag[] = []

  if (item.counts.taskCompleted > 0 && item.advisorReviewStatus !== 'approved') {
    flags.push('needs_review')
  }

  if (item.counts.taskCompleted > 0 && !item.outcomeCheckIn) {
    flags.push('needs_outcome_check_in')
  }

  if (
    item.outcomeCheckIn &&
    item.outcomeCheckIn.applicationsSubmitted30d > 0 &&
    item.outcomeCheckIn.interviewsSecured30d === 0 &&
    !item.outcomeCheckIn.firstInterviewBooked
  ) {
    flags.push('stalled_without_interview')
  }

  if (
    item.outcomeCheckIn &&
    item.outcomeCheckIn.applicationsSubmitted30d >= 5 &&
    item.outcomeCheckIn.interviewsSecured30d === 0
  ) {
    flags.push('high_effort_no_interview')
  }

  return flags
}

function priorityScore(flags: AdminStudentInsightsQueueFlag[]): number {
  return flags.reduce((score, flag) => {
    switch (flag) {
      case 'high_effort_no_interview':
        return score + 4
      case 'needs_review':
        return score + 3
      case 'stalled_without_interview':
        return score + 2
      case 'needs_outcome_check_in':
        return score + 1
      default: {
        const exhaustive: never = flag
        return score + exhaustive
      }
    }
  }, 0)
}

function latestTimestamp(values: Array<string | null | undefined>): string | null {
  const valid = values.filter((value): value is string => typeof value === 'string' && value.length > 0)
  if (valid.length === 0) return null
  return valid.sort((left, right) => right.localeCompare(left))[0] ?? null
}

function isRecentIsoDate(value: string | null, options: {
  days: number
  referenceIso: string
}): boolean {
  if (!value) return false
  const parsed = Date.parse(value)
  const reference = Date.parse(options.referenceIso)
  if (Number.isNaN(parsed)) return false
  if (Number.isNaN(reference)) return false
  return parsed >= reference - options.days * 24 * 60 * 60 * 1000
}

export function buildAdminStudentInsightsWorklist(params: {
  interactionEvents: StudentInsightsInteractionEventRow[]
  profiles?: ProfileSnapshot[]
  plans?: PlanSnapshot[]
  days: number
  limit: number
  generatedAt?: string
}): AdminStudentInsightsWorklistSummary {
  const generatedAt = params.generatedAt ?? new Date().toISOString()
  const filteredEvents = params.interactionEvents.filter(isStudentInsightsInteractionEvent)
  const userSummaries = new Map<string, {
    counts: AdminStudentInsightsFunnelStageCounts
    latestEventAt: string | null
  }>()

  for (const event of filteredEvents) {
    const current = userSummaries.get(event.user_id) ?? {
      counts: createEmptyCounts(),
      latestEventAt: null,
    }

    recordEvent(current.counts, event.event_type)
    current.latestEventAt = latestTimestamp([current.latestEventAt, event.occurred_at])
    userSummaries.set(event.user_id, current)
  }

  const profilesByUserId = new Map((params.profiles ?? []).map((profile) => [profile.userId, profile]))
  const plansByUserId = new Map((params.plans ?? []).map((plan) => [plan.userId, plan]))

  const items: AdminStudentInsightsWorklistItem[] = [...userSummaries.entries()].map(([userId, summary]) => {
    const profile = profilesByUserId.get(userId)
    const planSnapshot = plansByUserId.get(userId)
    const advisorReview = extractAdvisorReview(planSnapshot?.plan)
    const followUpStatus = extractActionPlanFollowUp(planSnapshot?.plan)
    const followUpHistory = extractActionPlanFollowUpHistory(planSnapshot?.plan)
    const outcomeCheckIn = extractOutcomeCheckIn(planSnapshot?.plan)
    const flags = computeFlags({
      counts: summary.counts,
      advisorReviewStatus: advisorReview?.status ?? null,
      outcomeCheckIn,
    })

    return {
      userId,
      email: profile?.email ?? null,
      fullName: profile?.fullName ?? null,
      latestEventAt: summary.latestEventAt,
      actionPlanUpdatedAt: latestTimestamp([planSnapshot?.updatedAt, typeof planSnapshot?.plan?.updatedAt === 'string' ? planSnapshot.plan.updatedAt : null]),
      advisorReviewStatus: advisorReview?.status ?? null,
      advisorReviewUpdatedAt: advisorReview?.updatedAt ?? null,
      followUpStatus: followUpStatus?.status ?? null,
      followUpUpdatedAt: followUpStatus?.updatedAt ?? null,
      followUpNote: typeof followUpStatus?.note === 'string' ? followUpStatus.note : null,
      followUpUpdatedBy: followUpStatus?.updatedBy
        ? {
            userId: followUpStatus.updatedBy.userId,
            email: typeof followUpStatus.updatedBy.email === 'string' ? followUpStatus.updatedBy.email : null,
            fullName: typeof followUpStatus.updatedBy.fullName === 'string' ? followUpStatus.updatedBy.fullName : null,
          }
        : null,
      followUpHistory: followUpHistory.map((entry) => ({
        status: entry.status,
        updatedAt: entry.updatedAt,
        note: typeof entry.note === 'string' ? entry.note : null,
        updatedBy: entry.updatedBy
          ? {
              userId: entry.updatedBy.userId,
              email: typeof entry.updatedBy.email === 'string' ? entry.updatedBy.email : null,
              fullName: typeof entry.updatedBy.fullName === 'string' ? entry.updatedBy.fullName : null,
            }
          : null,
      })),
      counts: summary.counts,
      outcomeCheckIn: outcomeCheckIn
        ? {
            applicationsSubmitted30d: outcomeCheckIn.applicationsSubmitted30d,
            interviewsSecured30d: outcomeCheckIn.interviewsSecured30d,
            firstInterviewBooked: outcomeCheckIn.firstInterviewBooked,
            updatedAt: outcomeCheckIn.updatedAt,
          }
        : null,
      flags,
      priorityScore: priorityScore(flags),
    }
  })

  const flaggedItems = items
    .filter((item) => item.flags.length > 0)
    .sort((left, right) => {
      if (right.priorityScore !== left.priorityScore) return right.priorityScore - left.priorityScore
      return (right.latestEventAt ?? '').localeCompare(left.latestEventAt ?? '')
    })

  const reporters = items.filter((item) => item.outcomeCheckIn)
  const firstInterviewBooked = reporters.filter((item) => item.outcomeCheckIn?.firstInterviewBooked).length
  const zeroInterviewCheckIns = reporters.filter((item) => (item.outcomeCheckIn?.interviewsSecured30d ?? 0) === 0).length
  const averageApplicationsSubmitted30d = roundAverage(
    reporters.reduce((sum, item) => sum + (item.outcomeCheckIn?.applicationsSubmitted30d ?? 0), 0),
    reporters.length,
  )
  const averageInterviewsSecured30d = roundAverage(
    reporters.reduce((sum, item) => sum + (item.outcomeCheckIn?.interviewsSecured30d ?? 0), 0),
    reporters.length,
  )

  const flags = flaggedItems.reduce<Record<AdminStudentInsightsQueueFlag, number>>(
    (acc, item) => {
      item.flags.forEach((flag) => {
        acc[flag] += 1
      })
      return acc
    },
    {
      needs_review: 0,
      needs_outcome_check_in: 0,
      high_effort_no_interview: 0,
      stalled_without_interview: 0,
    },
  )

  const followUpSummary = items.reduce(
    (acc, item) => {
      switch (item.followUpStatus) {
        case 'contacted':
          acc.contacted += 1
          break
        case 'follow_up_due':
          acc.followUpDue += 1
          break
        case 'resolved':
          acc.resolved += 1
          break
        default:
          acc.untracked += 1
          break
      }

      if (isRecentIsoDate(item.followUpUpdatedAt, { days: 7, referenceIso: generatedAt })) {
        acc.updatedLast7d += 1
      }

      return acc
    },
    {
      untracked: 0,
      contacted: 0,
      followUpDue: 0,
      resolved: 0,
      updatedLast7d: 0,
    },
  )

  return {
    generatedAt,
    days: params.days,
    limit: params.limit,
    totalUsersConsidered: items.length,
    flaggedUsers: flaggedItems.length,
    flags,
    followUpSummary,
    outcomeSnapshot: {
      reporters: reporters.length,
      firstInterviewBooked,
      zeroInterviewCheckIns,
      averageApplicationsSubmitted30d,
      averageInterviewsSecured30d,
    },
    items: flaggedItems.slice(0, params.limit),
  }
}
