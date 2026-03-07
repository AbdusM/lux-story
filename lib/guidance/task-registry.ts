import type { GuidanceInput, GuidanceTaskDefinition, GuidanceTaskProgress } from '@/lib/guidance/contracts'

function isTaskCompleted(progress: GuidanceTaskProgress | null): boolean {
  if (!progress) return false
  return ['completed', 'repeated', 'evidenced', 'autonomous'].includes(progress.highestProgressState)
}

export const GUIDANCE_TASKS: readonly GuidanceTaskDefinition[] = [
  {
    id: 'resume_waiting_route',
    title: 'Resume Your Route',
    summary: 'Step back into the station and pick up the route already waiting for you.',
    surface: 'resume',
    capabilityId: 'follow_through',
    difficultyBand: 1,
    adjacentTaskIds: ['review_journey_artifacts', 'open_strategy_profile'],
    evidenceTemplate: 'Returned to the station and resumed a held route.',
    dismissCooldownHours: 8,
    isReachable: (input) => input.hasJourneySave,
    getScore: (input, progress) => {
      if (isTaskCompleted(progress)) return -1
      return input.openReturnsCount > 0 ? 140 : 105
    },
    getReason: (input) =>
      input.openReturnsCount > 0
        ? `${input.currentCharacterLabel || 'A waiting route'} has something ready the next time you return.`
        : 'You already have a saved route, so the fastest next move is to re-enter the station.',
    getCtaLabel: () => 'Continue Journey',
    getDestination: () => ({ kind: 'route', href: '/' }),
  },
  {
    id: 'review_career_matches',
    title: 'Review Career Matches',
    summary: 'Open the careers view and see which paths your demonstrated strengths already support.',
    surface: 'careers',
    capabilityId: 'career_mapping',
    difficultyBand: 1,
    adjacentTaskIds: ['inspect_top_career_match', 'review_opportunities'],
    evidenceTemplate: 'Reviewed career matches derived from demonstrated skills.',
    dismissCooldownHours: 12,
    isReachable: (input) => input.careerMatchCount > 0,
    getScore: (_input, progress) => (isTaskCompleted(progress) ? -1 : 100),
    getReason: (input) =>
      input.nearReadyCareerCount > 0
        ? `You already have ${input.nearReadyCareerCount} near-ready match${input.nearReadyCareerCount === 1 ? '' : 'es'} worth checking.`
        : 'Your demonstrated skills are now strong enough to map against real paths.',
    getCtaLabel: () => 'Open Careers',
    getDestination: () => ({ kind: 'tab', tab: 'careers' }),
  },
  {
    id: 'inspect_top_career_match',
    title: 'Inspect A Top Match',
    summary: 'Open one of your stronger matches and look at the evidence, skill gaps, and employer path.',
    surface: 'careers',
    capabilityId: 'career_mapping',
    difficultyBand: 2,
    adjacentTaskIds: ['review_career_matches', 'open_strategy_profile'],
    evidenceTemplate: 'Inspected a top career match and reviewed the supporting evidence.',
    dismissCooldownHours: 12,
    isReachable: (input) => input.careerMatchCount > 0,
    getScore: (input, progress) => {
      if (isTaskCompleted(progress)) return -1
      const prerequisite = input.taskProgress.review_career_matches
      return prerequisite ? 92 : 64
    },
    getReason: (input) =>
      input.nearReadyCareerCount > 0
        ? 'One of your strongest matches is close enough to be worth a deeper look.'
        : 'Looking inside a match turns a broad path into concrete next steps.',
    getCtaLabel: () => 'Inspect A Match',
    getDestination: () => ({ kind: 'tab', tab: 'careers' }),
  },
  {
    id: 'review_opportunities',
    title: 'Review Opportunities',
    summary: 'Open the opportunities board and see which doors are currently unlocked for you.',
    surface: 'opportunities',
    capabilityId: 'opportunity_scanning',
    difficultyBand: 1,
    adjacentTaskIds: ['review_career_matches', 'visit_student_insights'],
    evidenceTemplate: 'Reviewed the current opportunity board and checked unlocked routes.',
    dismissCooldownHours: 10,
    isReachable: (input) => input.totalDemonstrations > 0,
    getScore: (input, progress) => {
      if (isTaskCompleted(progress)) return -1
      return input.unlockedOpportunityCount > 0 ? 98 : 74
    },
    getReason: (input) =>
      input.unlockedOpportunityCount > 0
        ? `${input.unlockedOpportunityCount} opportunity door${input.unlockedOpportunityCount === 1 ? '' : 's'} is already open.`
        : 'The board is worth checking again as your demonstrated patterns shift.',
    getCtaLabel: () => 'Stay In Opportunities',
    getDestination: () => ({ kind: 'tab', tab: 'opportunities' }),
  },
  {
    id: 'visit_student_insights',
    title: 'Review Your Insights',
    summary: 'Read the synthesized view of what your journey is already building.',
    surface: 'insights',
    capabilityId: 'reflection',
    difficultyBand: 1,
    adjacentTaskIds: ['review_career_matches', 'review_journey_artifacts'],
    evidenceTemplate: 'Opened the student insights summary and reviewed current growth signals.',
    dismissCooldownHours: 16,
    isReachable: (input) => input.totalDemonstrations > 0,
    getScore: (input, progress) => {
      if (isTaskCompleted(progress)) return -1
      return input.totalDemonstrations >= 6 ? 88 : 66
    },
    getReason: () => 'A quick reflection pass turns raw activity into named strengths and next steps.',
    getCtaLabel: () => 'Open Insights',
    getDestination: () => ({ kind: 'route', href: '/student/insights' }),
  },
  {
    id: 'review_journey_artifacts',
    title: 'Review Journey Artifacts',
    summary: 'Open your saved route summary and see the signals the station is already holding for you.',
    surface: 'profile',
    capabilityId: 'proof_building',
    difficultyBand: 1,
    adjacentTaskIds: ['open_strategy_profile', 'resume_waiting_route'],
    evidenceTemplate: 'Reviewed the saved journey artifacts and current route summary.',
    dismissCooldownHours: 16,
    isReachable: (input) => input.hasJourneySave,
    getScore: (_input, progress) => (isTaskCompleted(progress) ? -1 : 82),
    getReason: () => 'Your route summary is the fastest place to turn play history into visible proof.',
    getCtaLabel: () => 'Open Journey Artifacts',
    getDestination: () => ({ kind: 'route', href: '/profile' }),
  },
  {
    id: 'open_strategy_profile',
    title: 'Open Strategy Profile',
    summary: 'Jump from your saved route into the deeper strategy overlay and inspect the bigger picture.',
    surface: 'profile',
    capabilityId: 'career_strategy',
    difficultyBand: 2,
    adjacentTaskIds: ['review_journey_artifacts', 'resume_waiting_route'],
    evidenceTemplate: 'Opened the career strategy profile from the saved journey.',
    dismissCooldownHours: 20,
    isReachable: (input) => input.hasJourneySave && input.careerMatchCount > 0,
    getScore: (input, progress) => {
      if (isTaskCompleted(progress)) return -1
      const prerequisite = input.taskProgress.review_journey_artifacts
      return prerequisite ? 96 : 72
    },
    getReason: () => 'The strategy profile pulls your route, skills, and career direction into one view.',
    getCtaLabel: () => 'Open Strategy Profile',
    getDestination: () => ({ kind: 'route', href: '/profile' }),
  },
] as const

export const GUIDANCE_TASK_MAP = Object.fromEntries(
  GUIDANCE_TASKS.map((task) => [task.id, task]),
) as Record<string, GuidanceTaskDefinition>
