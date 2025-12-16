# User Story Mapping - All Personas
**Content Beast Sprint - December 14, 2024**

---

## Persona 1: The Student (Primary User, Age 14-24)

### Profile
- **Demographics:** 14-24 years old, exploring career options
- **Tech savvy:** Mobile-first, short attention spans
- **Pain point:** Don't know what careers exist, let alone which to pursue
- **Motivation:** Discover what they're actually good at, avoid wasting time/money on wrong path

### BEST CASE SCENARIO

**User Journey:**
1. Opens Lux Story on phone (linked from Urban Chamber or friend referral)
2. Plays through Samuel's intro, immediately sees patterns appearing
3. Talks to Maya, relates to her medical journey struggle
4. After 3 characters (45 minutes), sees clear pattern emerging (high helping + patience)
5. Journey Summary shows: "You exhibited strong helping and patience patterns. Careers that match: healthcare, education, counseling, social work."
6. Student thinks: "I never considered healthcare but this makes sense"
7. Reaches out to real doctor on LinkedIn (prompted by game)
8. Returns next week to try different choices (New Game+)
9. Shares journey card with friends: "I'm The Compassionate Guide"
10. 3 friends download and play

**Metrics:**
- Completion rate: 80%+
- Time to first insight: <10 minutes
- Return rate: 50%+ within 7 days
- Viral coefficient: 1.5 (each player brings 1.5 more)
- Career action taken: 30%+ (contacted professional, researched career, took course)

**Software Requirements:**
```typescript
// Pattern visibility from minute 1 ✅ DONE (Week 1)
// Journey Summary with career mapping (Month 2 Week 8)
export interface JourneySummary {
  patterns: {
    analytical: number
    helping: number
    building: number
    patience: number
    exploring: number
  }
  dominantPatterns: PatternType[]
  careerClusters: {
    cluster: string  // "Healthcare (helping+patience)"
    careers: string[]  // ["Doctor", "Nurse", "Therapist", "Social Worker"]
    matchScore: number  // 0-100
  }[]
  actionPrompts: {
    type: 'contact_professional' | 'take_course' | 'research_career'
    text: string
    link?: string
  }[]
  shareableCard: {
    archetype: string  // "The Compassionate Guide"
    quote: string  // Samuel quote about player
    imageUrl: string  // Generated card for social media
  }
}

// Shareable journey cards (Month 4 if pure game)
// Social proof: Show how many others have similar patterns
// Engagement hooks: Celebrations at 25%, 50%, 75%, 100%
```

---

### WORST CASE SCENARIO

**User Journey:**
1. Opens Lux Story, sees walls of text
2. Doesn't understand what patterns mean
3. Makes choices randomly, doesn't see connection to career
4. Gets bored after 2 characters (30 minutes)
5. Closes app, never returns
6. Tells friends "it's just a lot of reading"

**Why This Happens:**
- Tutorial too long or unclear
- Pattern system feels arbitrary (hidden, not explained)
- Career relevance not obvious
- No natural stopping points (drops off mid-session)
- Mobile UX poor (scrolling, small text, slow load)
- No immediate feedback (patterns feel disconnected from choices)

**Metrics:**
- Completion rate: <20%
- Time to dropout: <15 minutes
- Return rate: <5%
- Negative word of mouth

**Mitigations:**
```typescript
// Session boundaries every 8-12 nodes ✅ WEEK 3 PRIORITY
export interface SessionBoundary {
  nodeId: string
  platformAnnouncement: string
  savePrompt: boolean
  durationSinceLastBoundary: number
}

// Tutorial that shows patterns IN ACTION (not just explains)
// Week 1 fixes already implemented:
// - Orbs visible immediately ✅
// - Pattern toasts show "+1 Analytical" ✅
// - Samuel comments on patterns ✅

// Additional mitigations:
// - Skip dialogue option for repeat players
// - Auto-save every choice (prevent lost progress)
// - Mobile optimization (<100ms choice response)
// - First 3 minutes hook (Samuel intro already good ✅)

// Engagement tracking to catch dropoffs
export function trackDropoff(nodeId: string, reason: string) {
  analytics.track('user_dropout', {
    nodeId,
    reason,
    timeSpent: sessionDuration,
    nodesCompleted: nodeCount,
    patterns: currentPatterns
  })
}
```

---

## Persona 2: The Educator (Anthony, Urban Chamber)

### Profile
- **Role:** Executive Director, Urban Chamber of Commerce
- **Facility:** 17,000 sq ft, Las Vegas
- **Cohort:** 16 graduates completing AI coursework
- **Need:** Career exploration that complements training, shows ROI
- **Budget:** $5,000-15,000 for pilot

### BEST CASE SCENARIO

**User Journey:**
1. Receives pilot proposal, likes positioning as "career exploration through storytelling"
2. Agrees to $7,500 pilot fee (February 2025)
3. Sends access links to 16 students
4. Checks admin dashboard weekly, sees progress:
   - 14/16 students actively engaged
   - Avg completion: 65% after week 1
   - Pattern distribution shows clear trends
5. Week 3: 12/16 students complete full experience
6. Debrief session: Students report insights
   - "I never knew healthcare systems engineering existed"
   - "The helping pattern thing made sense, now I'm looking at education programs"
7. Anthony sees data: Clear pattern clusters emerged
8. Follow-up: Students taking action (3 reached out to professionals, 5 researching careers)
9. Anthony's assessment: "This did in one month what career counseling couldn't do in 10 hours"
10. Signs annual license: $10,000/year for future cohorts
11. Refers to 3 other workforce development orgs

**Metrics:**
- Student completion: 75%+ (12/16)
- Pattern data clarity: Distinct clusters visible
- Career action rate: 30%+ (5/16 students)
- Anthony satisfaction: 9/10
- Referrals generated: 3
- Revenue: $7,500 pilot + $10,000/year recurring

**Software Requirements:**
```typescript
// Admin Dashboard (Month 2 Week 7-8)
export interface AdminDashboard {
  // Overview metrics
  cohortId: string
  orgName: string
  studentCount: number
  completionRate: number  // 75%+
  avgSessionDuration: number
  avgNodesCompleted: number

  // Engagement tracking
  activeStudents: number  // Played in last 7 days
  completedStudents: number
  dropoffPoints: {
    nodeId: string
    characterId: string
    studentCount: number
  }[]

  // Pattern insights (THE VALUE PROP)
  patternDistribution: {
    analytical: { min: number; max: number; avg: number; distribution: number[] }
    helping: { min: number; max: number; avg: number; distribution: number[] }
    building: { min: number; max: number; avg: number; distribution: number[] }
    patience: { min: number; max: number; avg: number; distribution: number[] }
    exploring: { min: number; max: number; avg: number; distribution: number[] }
  }

  // Career clusters (AUTOMATED INSIGHTS)
  careerClusters: {
    cluster: string  // "Healthcare (helping+patience)"
    studentCount: number
    percentage: number
    careers: string[]
  }[]

  // Individual student view (privacy-conscious)
  students: {
    anonymousId: string  // "Student A", "Student B" (no PII)
    completionPercent: number
    dominantPatterns: PatternType[]
    suggestedCareers: string[]
  }[]

  // Export & Actions
  exportCSV: () => void  // For Anthony's records
  sendReminders: (studentIds: string[]) => void  // Re-engage dropoffs
  generateReport: () => PDF  // Summary for Anthony's board
}

// Email reminder system
export async function sendCohortReminders(cohortId: string) {
  const inactive = await getInactiveStudents(cohortId, 7) // 7 days inactive

  for (const student of inactive) {
    await sendEmail({
      to: student.email,
      subject: "Your pattern journey is waiting",
      body: `You're ${student.completionPercent}% through. ${16 - student.nodesRemaining} characters left to discover.`
    })
  }
}
```

---

### WORST CASE SCENARIO

**User Journey:**
1. Pilot launches, students get links
2. Only 6/16 students start playing
3. Of those 6, only 2 complete more than 30%
4. Admin dashboard shows:
   - Low engagement (37% started)
   - High dropout (87% of starters didn't finish)
   - Messy pattern data (no clear clusters)
5. Debrief session: Students say "it was okay but didn't help me pick a career"
6. Anthony's assessment: "Fun storytelling but not worth $7,500 for career exploration"
7. Asks for steep discount or refund
8. Tells network "tried this, didn't work for career guidance"
9. No renewal, no referrals

**Why This Happens:**
- Poor positioning: Students thought it was a game, didn't take seriously
- Too long: 20-30 min sessions too much time commitment
- Unclear value: Pattern system felt arbitrary, not connected to careers
- No follow-through: Game ended, no actionable next steps
- Technical issues: Slow load times, mobile bugs, lost progress
- Timing: Mid-semester, students too busy

**Metrics:**
- Start rate: <40% (6/16)
- Completion rate: <15% (2/16)
- Anthony satisfaction: <5/10
- Revenue: Refund or steep discount
- Referrals: 0 or negative

**Mitigations:**
```typescript
// Positioning clarity (Month 2 Week 8)
// - Educator guide PDF explains how to introduce to students
// - Frame as "career pattern discovery" not "game"
// - Set expectations: 2-4 sessions, 20-30 min each, insights at end

// Engagement optimization
// - Session boundaries make it feel shorter ✅ WEEK 3
// - Email reminders for inactive students
// - Progress tracking visible to Anthony
// - Mid-experience check-in (Week 2 survey)

// Career connection strengthening
// - Journey Summary explicitly maps patterns → careers
// - Action prompts: "Based on your patterns, here are 3 next steps"
// - Connect to Anthony's existing curriculum (AI coursework → AI careers in game)

// Technical reliability
// - Load time <2 seconds
// - Auto-save prevents lost progress
// - Mobile testing on various devices
// - Support system (Discord, email, FAQ)

// Timing optimization
// - Launch at cohort start (not mid-program)
// - Integrate into curriculum (make it required or incentivized)
// - Flexible deadline (4 weeks to complete)

// Backup plan if data is unclear
export async function salvagePilot(cohortId: string) {
  // Offer free extension: "Let's get more students to complete"
  // Or: Qualitative interviews with students who did complete
  // Or: Refund with learning report (what went wrong, how we'd fix it)
  // Goal: Preserve relationship even if pilot "fails"
}
```

---

## Persona 3: The Gamer (Indie Narrative Game Audience)

### Profile
- **Demographics:** 18-35, PC/mobile gamers
- **Influences:** Disco Elysium, Hades, Persona, visual novels
- **Discovery:** itch.io, Steam, gaming subreddits, Twitch
- **Values:** Story quality, character depth, replayability, no microtransactions
- **Spending:** $10-30 for indie games they love

### BEST CASE SCENARIO

**User Journey:**
1. Discovers Lux Story on itch.io (free) or Steam ($9.99)
2. Drawn by positioning: "Disco Elysium meets Persona, but about becoming"
3. Plays Maya's arc, emotionally connected
4. Realizes pattern system is like skill checks but for identity
5. Completes 5 characters in first session (3 hours)
6. Journey Summary hits hard: "You ARE The Analytical Observer. That's not random—you chose that."
7. Starts New Game+ immediately, wants to try different build
8. Screenshots journey card, posts to r/narrativegames
9. Writes Steam review: "This game knows me better than I know myself"
10. Streams on Twitch, chat loves the character interactions
11. Buys Station 2 DLC when it launches
12. Active in Discord community, creates fan art

**Metrics:**
- Retention: 60%+ finish first character
- Session length: 2-4 hours (binge-worthy)
- Replay rate: 40%+ start NG+ within 24 hours
- Review score: 85%+ positive on Steam
- Revenue: $9.99 × high volume = sustainable
- Community: Active Discord, fan creations
- DLC sales: 50%+ of players buy Station 2

**Software Requirements:**
```typescript
// New Game+ system (Month 3)
export interface NewGamePlus {
  preserves: {
    thoughts: ActiveThought[]  // Internalized identities carry over
    metaAchievements: Achievement[]
    unlockedContent: string[]
  }
  resets: {
    patterns: PlayerPatterns  // Back to 0
    characterRelationships: Map<string, CharacterState>
    currentDay: number
  }
  bonuses: {
    higherPatternGates: boolean  // 5→7 for rare scenes
    secretDialogue: string[]  // NG+ exclusive content
    speedrunMode: boolean  // Skip seen dialogue
  }
}

// Achievement system
export const ACHIEVEMENTS = {
  'all-confidants': {
    name: 'Everyone\'s Friend',
    description: 'Reach confidant status with all 11 characters',
    reward: 'Unlocks Samuel\'s "Conductor" ending'
  },
  'pattern-master': {
    name: 'The Complete Self',
    description: 'Reach level 10 in all 5 patterns (across all runs)',
    reward: 'Unlocks "The Philosopher" archetype'
  },
  'thought-collector': {
    name: 'Cabinet Completionist',
    description: 'Collect all 100 thoughts',
    reward: 'Unlocks director commentary mode'
  }
}

// Pattern Voices (Month 4 if pure game, Disco Elysium feature)
export const PATTERN_VOICES = {
  analytical: {
    voice: 'THE ANALYTICAL OBSERVER',
    interjections: [
      {
        trigger: (context) => context.hasContradiction,
        text: "Wait. She said her parents paid for college. But she also has student loans. Which is it?"
      },
      {
        trigger: (context) => context.choiceHasNumericData,
        text: "Do the math. $120K debt on a teacher's salary? That's decades of payment."
      }
    ]
  },
  helping: {
    voice: 'THE COMPASSIONATE HEART',
    interjections: [
      {
        trigger: (context) => context.characterEmotionNegative,
        text: "She's trying not to cry. You can see it in how she's looking away."
      },
      {
        trigger: (context) => context.choiceHurtsSomeone,
        text: "This will hurt her. You can feel it. Choose differently."
      }
    ]
  }
  // ... 3 more voices
}

// Shareable content (viral mechanics)
export interface ShareableJourneyCard {
  archetype: string  // "The Empathetic Builder"
  dominantPatterns: PatternType[]
  samuelQuote: string  // Personalized based on choices
  definingMoment: {
    nodeId: string
    text: string  // "When Maya showed you the unsent email, you sat in silence"
  }
  pathNotTaken: {
    characterId: string
    text: string  // "Marcus was waiting on Platform 4, but you never visited"
  }
  statsVisual: string  // Generated card image
  inviteCode: string  // "LUX-M4Y2" for friend referrals
}
```

---

### WORST CASE SCENARIO

**User Journey:**
1. Buys on Steam for $9.99 (or tries free on itch.io)
2. Sees "career exploration" in description, immediately turned off
3. Plays 30 minutes, feels like edutainment
4. Compares to Disco Elysium: "This has 11 characters, DE had 24 skills and full city"
5. Feels shallow, requests refund within 2 hours
6. Writes negative review: "Boring career advice disguised as a game"
7. Reddit thread: "Don't waste money on this"
8. Other gamers avoid based on reviews
9. No community forms

**Why This Happens:**
- Wrong positioning: Marketed as career tool, not narrative game
- Expectations mismatch: Compared to AAA instead of indie
- Price point wrong: $14.99 feels expensive for "only 11 characters"
- No hook: First hour doesn't showcase best writing
- Career framing: Breaks immersion, feels preachy
- Limited content: 8-12 hours first run, $1/hour bad value in gamer math
- No depth systems: Missing what makes Disco Elysium replayable

**Mitigations:**
```typescript
// Positioning for Steam (separate from B2B)
// - Title: "Lux Story: The Station Between Who You Were and Who You're Becoming"
// - Tags: Narrative, Character-Driven, Choices Matter, Replay Value
// - NO mention of "career" in Steam description
// - Comparison: Disco Elysium (identity) + Hades (replay) + Persona (calendar)

// Price point optimization
// - $9.99 on Steam (not $14.99)
// - Free on itch.io (acquisition funnel)
// - Season Pass: $24.99 for all stations (better value perception)

// Content density focus
// - Quality over quantity (11 characters but 35+ nodes each = depth)
// - Intersection scenes (character × character interactions = exponential content)
// - New Game+ doubles playtime (different patterns unlock different scenes)

// Demo strategy
// - First character (Samuel) free
// - Shows best writing upfront (Maya's unsent email scene in demo)
// - Pattern system demonstrated, not explained
// - Hook in 15 minutes: Identity revelation moment

// Refund window messaging
// - Steam description: "Best experienced after 2+ hours (first character completion)"
// - Tutorial message: "The pattern revelation happens after you meet 3 characters"
// - Genre expectation: "Slow burn narrative, not action game"

// Depth systems for replay
// - Pattern voices (Month 4)
// - New Game+ with meta-progression
// - Hidden achievements
// - Multiple endings based on internalized identities
```

---

## Persona 4: The Professional (LinkedIn, Podcast Guests)

### Profile
- **Demographics:** 30-50, established in career
- **Platform:** LinkedIn active, podcast listeners
- **Motivation:** Thought leadership, giving back, networking
- **Time:** 15-30 min for interview, minimal ongoing commitment
- **Value exchange:** Exposure, connection to next generation, portfolio piece

### BEST CASE SCENARIO

**User Journey:**
1. Receives LinkedIn message about podcast interview
2. Likes mission: "Help young people discover careers through storytelling"
3. Records 20-min interview about career journey
4. Receives AI-generated character draft 1 week later
5. Reviews draft, provides feedback: "This captures my story well"
6. Approves character for publication
7. Podcast episode goes live featuring their interview
8. Game character goes live same week
9. Shares on LinkedIn: "I'm now a character in a career exploration game!"
10. 200+ LinkedIn connections engage with post
11. 5 students reach out after playing character arc
12. Professional has 1-2 coffee chats with interested students
13. One student ends up interning at professional's company
14. Professional becomes advocate: "This connected me to amazing young talent"
15. Sponsors next podcast season ($5K)
16. Refers 3 colleagues to be characters

**Metrics:**
- Conversion: 60%+ of invites agree to interview
- Approval rate: 90%+ approve character draft
- Share rate: 70%+ share on LinkedIn
- Student connection: 5-10 students reach out per character
- Advocacy: 30%+ become active advocates
- Sponsorship: 10%+ sponsor future content
- Revenue: $5K sponsorships, character licensing fees

**Software Requirements:**
```typescript
// Character approval workflow
export interface CharacterApproval {
  professionalId: string
  characterDraft: DialogueNode[]
  approvalStatus: 'pending' | 'approved' | 'needs_revision' | 'rejected'
  feedback: string
  consentGiven: {
    storyRights: boolean
    attribution: boolean
    studentContact: boolean  // Opt-in for LinkedIn connections
  }
}

// Professional analytics dashboard
export interface ProfessionalDashboard {
  characterId: string
  professionalName: string

  // Engagement metrics
  studentsWhoPlayed: number
  avgRating: number  // Students rate character quality
  completionRate: number  // % who finished their arc

  // LinkedIn integration
  linkedInProfile: string
  connectionRequests: {
    studentId: string
    timestamp: Date
    accepted: boolean
  }[]

  // Value tracking
  linkedInPostEngagement: {
    views: number
    likes: number
    comments: number
    shares: number
  }

  // Opt-in features
  allowStudentContact: boolean
  maxConnectionsPerMonth: number  // Prevent spam
  autoResponseTemplate: string  // Template for student outreach
}

// LinkedIn integration
export async function facilitateConnection(
  studentId: string,
  professionalId: string
) {
  const professional = await getProfessional(professionalId)

  if (!professional.allowStudentContact) {
    return { success: false, reason: 'Professional opted out of student contact' }
  }

  if (professional.connectionsThisMonth >= professional.maxConnectionsPerMonth) {
    return { success: false, reason: 'Monthly connection limit reached' }
  }

  // Generate personalized message template for student
  const message = `
    Hi ${professional.name},

    I just played your character arc in Lux Story and was inspired by your journey from ${professional.careerStart} to ${professional.currentRole}.

    [Student adds personal note here]

    Would you be open to a brief conversation about your experience in ${professional.industry}?
  `

  return {
    success: true,
    linkedInUrl: professional.linkedInProfile,
    messageTemplate: message
  }
}
```

---

### WORST CASE SCENARIO

**User Journey:**
1. Receives LinkedIn invite, agrees to interview
2. Records 20 minutes
3. Character draft feels generic, doesn't capture their voice
4. Provides extensive feedback, revision takes 2 weeks
5. Approves reluctantly
6. Character goes live, students play
7. Professional feels misrepresented
8. Students reach out on LinkedIn, professional feels spammed
9. Negative experience, regrets participating
10. Tells network "they misused my story"

**Why This Happens:**
- AI-generated dialogue too generic
- Human polish insufficient (voice inconsistency)
- No boundaries on student contact (inbox flooded)
- Unclear value exchange (time investment not worth outcome)
- Attribution unclear (feels exploited)
- No ongoing relationship (one-and-done)

**Mitigations:**
```typescript
// Quality control process
export async function generateCharacterArc(interview: InterviewTranscript) {
  // Step 1: AI first draft
  const draft = await aiGenerate(interview)

  // Step 2: Human polish (mandatory 2 hour minimum)
  const polished = await humanPolish(draft, interview)

  // Step 3: Voice consistency check
  const voiceScore = await checkVoiceConsistency(polished, interview.speakerStyle)
  if (voiceScore < 0.8) {
    // Flag for additional polish
  }

  // Step 4: Professional review (1 week)
  await sendForApproval(polished, professionalId)

  // Step 5: Revision if needed
  // Step 6: Final approval
}

// Contact boundaries
export const STUDENT_CONTACT_RULES = {
  maxPerMonth: 5,  // Professional can adjust
  requiresContext: true,  // Student must include which character arc
  templateProvided: true,  // Guide students to write good messages
  optOut: true  // Professional can disable anytime
}

// Value exchange clarity
export const PROFESSIONAL_BENEFITS = {
  upfront: [
    'Podcast episode (20-30 min) on your career journey',
    'Character in game played by 100s-1000s of students',
    'LinkedIn content (shareable post announcing character)',
    'Thought leadership positioning'
  ],
  ongoing: [
    'Connection to talented students exploring your field',
    'Analytics on character engagement',
    'Optional sponsorship opportunities',
    'Community of fellow professionals (network effect)'
  ]
}

// Attribution system
export interface CharacterAttribution {
  characterId: string
  realPerson: {
    name: string
    title: string
    company: string
    linkedIn: string
  }
  credits: {
    inGame: string  // "Based on the career journey of [Name]"
    podcast: string  // Episode link
    consent: boolean
  }
}
```

---

## Persona 5: The Creator (Future State - Q3 2025+)

### Profile
- **Role:** Educator, content creator, professional
- **Goal:** Create custom characters for specific audience
- **Tech skill:** Low to medium (needs no-code tools)
- **Time:** 2-4 hours per character
- **Revenue:** Passive income from marketplace sales

### BEST CASE SCENARIO

**User Journey:**
1. Educator at community college discovers Lux Story
2. Wants custom character: "Meet Dr. Sarah Johnson" (local surgeon)
3. Signs up for Lux Story Studio ($29/month)
4. Uses template: "Healthcare Professional"
5. Interviews Dr. Johnson, records 15 minutes
6. Uploads transcript, AI generates draft (10 nodes)
7. Spends 2 hours polishing dialogue
8. Uses pattern mapping wizard (makes sense, easy)
9. Previews character in test mode
10. Publishes to private library (students at their school only)
11. 30 students play, love it
12. Dr. Johnson visits class, students already know her story
13. Educator publishes to marketplace ($1.99)
14. 50 other schools license the character
15. Educator makes $500/month passive income
16. Creates 5 more characters (local professionals)
17. Builds reputation as content creator
18. Other educators reach out for collaboration

**Metrics:**
- Creator signup: 100+ creators by Q4 2025
- Character quality: 90%+ approval rate
- Marketplace sales: 50+ characters available
- Revenue: 70/30 split (creator gets $1.40 per $1.99 sale)
- Community: Active Discord, templates shared
- Support satisfaction: 95%+

**Software Requirements (Phase 2 - Q3 2025):**
```typescript
// Lux Story Studio (Creator Platform)
export interface StudioInterface {
  // Character creation wizard
  characterBuilder: {
    step1: 'Choose template' // Healthcare, Tech, Arts, Trades, etc.
    step2: 'Upload source material' // Interview transcript, LinkedIn profile
    step3: 'AI generation' // 10 nodes in 5 minutes
    step4: 'Edit & polish' // Visual dialogue editor
    step5: 'Pattern mapping' // Drag-drop patterns to choices
    step6: 'Preview & test' // Play as character
    step7: 'Publish' // Private or marketplace
  }

  // Content management
  myCharacters: Character[]
  drafts: Character[]
  published: Character[]
  analytics: CharacterAnalytics[]

  // Marketplace
  earnings: number
  payouts: PayoutHistory[]
  pricing: number  // Set own price or use platform default

  // Support
  documentation: string
  videoTutorials: string[]
  communityForum: string
  supportTickets: SupportTicket[]
}

// AI assistance
export async function generateFromTranscript(
  transcript: string,
  template: CharacterTemplate
): Promise<DialogueNode[]> {
  const prompt = `
    Template: ${template.name}
    Structure: ${template.nodeStructure}
    Pattern focus: ${template.patternDistribution}

    Transcript: ${transcript}

    Generate 10 dialogue nodes that:
    1. Match the template structure
    2. Use speaker's authentic voice
    3. Map choices to appropriate patterns
    4. Provide career insights
    5. Feel like natural conversation

    Return: TypeScript DialogueNode array
  `

  return await callGPT4(prompt)
}

// Pattern mapping wizard
export interface PatternMappingWizard {
  choice: string
  suggestedPatterns: PatternType[]  // AI suggests based on choice text
  creatorOverride: PatternType  // Creator can change
  validation: {
    balanced: boolean  // All patterns represented across character?
    logical: boolean  // Pattern matches choice context?
    warnings: string[]
  }
}
```

---

### WORST CASE SCENARIO

**User Journey:**
1. Educator signs up for Studio
2. Interface overwhelming (too many options)
3. AI-generated dialogue terrible (generic, voice wrong)
4. Pattern mapping confusing (doesn't understand system)
5. Preview doesn't work (bugs)
6. Publishes character anyway, students complain
7. Marketplace rejection (quality too low)
8. Educator frustrated, cancels subscription
9. Tells colleagues "Studio is too complicated"

**Why This Happens:**
- No-code claims false (actually requires technical knowledge)
- AI quality inconsistent
- Templates too rigid or too open-ended
- No validation system (garbage in, garbage out)
- Poor documentation
- Support slow or nonexistent
- Marketplace flooded with low-quality characters

**Mitigations:**
```typescript
// Onboarding flow
export const STUDIO_ONBOARDING = {
  step1: 'Watch 5-min tutorial video',
  step2: 'Create test character with sample transcript',
  step3: 'Get feedback from Studio team',
  step4: 'Unlock full Studio access',
  step5: 'Join creator community (Discord)'
}

// Quality gates
export async function validateCharacter(character: Character): Promise<ValidationResult> {
  const checks = {
    voiceConsistency: await checkVoice(character),
    patternBalance: checkPatternDistribution(character),
    dialogueQuality: await checkDialogue(character),
    technicalCorrect: checkGraphStructure(character),
    playable: await testCharacter(character)
  }

  const score = calculateQualityScore(checks)

  if (score < 0.7) {
    return {
      approved: false,
      feedback: generateImprovementSuggestions(checks)
    }
  }

  return { approved: true }
}

// Template system
export const TEMPLATES = {
  healthcare: {
    structure: [
      { type: 'introduction', nodes: 2 },
      { type: 'career_decision', nodes: 2 },
      { type: 'challenge', nodes: 2 },
      { type: 'advice', nodes: 2 },
      { type: 'connection', nodes: 2 }
    ],
    patternFocus: ['helping', 'patience', 'analytical'],
    exampleCharacter: 'marcus'  // Show existing character as reference
  }
  // ... more templates
}

// Support system
export const CREATOR_SUPPORT = {
  documentation: 'Step-by-step guides with screenshots',
  videoTutorials: 'YouTube playlist (15 videos)',
  liveOfficeHours: 'Weekly Zoom Q&A',
  discord: 'Creator community for peer support',
  tickets: 'Email support (24hr response time)',
  reviewService: 'Pay $50 for professional character review'
}
```

---

## Cross-Persona Requirements Matrix

| Feature | Student | Educator | Gamer | Professional | Creator |
|---------|---------|----------|-------|--------------|---------|
| Mobile-first | ✅ Critical | ⚠️ Nice | ❌ Desktop OK | N/A | ❌ Desktop |
| Session boundaries | ✅ Critical | ✅ Critical | ⚠️ Nice | N/A | N/A |
| Pattern visibility | ✅ Critical | ✅ Critical | ✅ Critical | N/A | N/A |
| Career mapping | ✅ Critical | ✅ Critical | ❌ Hidden | N/A | ✅ Critical |
| Admin dashboard | N/A | ✅ Critical | N/A | ⚠️ Nice | ✅ Critical |
| New Game+ | ⚠️ Nice | ❌ Not needed | ✅ Critical | N/A | N/A |
| Pattern voices | ⚠️ Nice | ❌ Not needed | ✅ Critical | N/A | N/A |
| LinkedIn integration | ⚠️ Nice | ❌ Not needed | ❌ Not needed | ✅ Critical | ⚠️ Nice |
| Studio access | N/A | ⚠️ Nice | N/A | N/A | ✅ Critical |

---

## Implementation Priority (Based on Personas)

### Month 1 (Dec-Jan): Student + Educator Focus
1. ✅ Pattern visibility (Week 1 DONE)
2. 🔄 Session boundaries (Week 3 IN PROGRESS)
3. ⏳ Failure paths (Week 4)
4. ⏳ Mobile optimization (ongoing)

### Month 2 (Feb): Educator Validation
1. Admin dashboard
2. Career mapping in Journey Summary
3. Data export (CSV)
4. Email reminders
5. Urban Chamber pilot launch

### Month 3 (Mar): Gamer Features (if pure game path)
1. Journey Summary 2.0 (shareable cards)
2. Pattern voices
3. Achievement system
4. Steam launch prep

### Month 3 (Mar): B2B Expansion (if career validated)
1. White-label branding
2. Educator guide
3. Career pathway expansions
4. Outreach to 5-10 orgs

### Q3 2025: Professional Integration
1. Podcast launch
2. Interview workflow
3. Character approval system
4. LinkedIn integration
5. Professional dashboard

### Q4 2025: Creator Platform
1. Lux Story Studio MVP
2. Template system
3. Marketplace infrastructure
4. Creator onboarding
5. Community building

---

*All personas serve the same core experience, but prioritize different features. Month 1-2 focuses on Student + Educator (Urban Chamber validation). Month 3-4 adapts based on data.*
