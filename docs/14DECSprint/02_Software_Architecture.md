# Software Architecture - Lux Story Content Beast Path

**Date:** December 14, 2024
**Strategic Direction:** Path A - Content Beast Mode
**Timeline:** 12 months (Q1 2025 - Q4 2025)

---

## Architecture Philosophy

**Core Principle:** Build for scale WITHOUT over-engineering.

**What This Means:**
- Choose tools that handle 1,000 users AND 100,000 users
- No premature optimization, but no architectural dead-ends
- Migrate incrementally (localStorage → cloud, TypeScript → CMS)
- Mobile-first, but desktop-capable
- Open to creator platform (Q4) without rebuild

**Anti-Patterns to Avoid:**
- Building for scale we don't have yet
- Choosing tech because it's trendy
- Over-abstracting before we understand patterns
- Database migrations before we validate B2B demand

---

## Current Stack (Month 1-2)

### Frontend
```typescript
// Framework
Next.js 15 (App Router)
React 18
TypeScript (strict mode)

// Styling
Tailwind CSS 3.4
Framer Motion (animations)

// State Management
Custom GameState (hooks/useGameState.ts)
localStorage for persistence
Context API for global state

// UI Components
Radix UI (accessibility)
Lucide React (icons)
Custom pixel art avatars (32×32 SVG)
```

**Why This Stack:**
- Next.js 15: SSR + App Router for performance, Vercel deployment
- TypeScript: Type safety for complex dialogue graphs
- Tailwind: Rapid prototyping, consistent design system
- localStorage: Zero-latency saves, works offline

**Current Limitations:**
- No cloud sync (data trapped on device)
- No multi-device support
- No analytics beyond basic page views
- Content updates require code deploy

---

## Target Stack (Month 6-12)

### Database Evolution

**Phase 1: localStorage (Current)**
```typescript
// lib/character-state.ts
export function saveGameState(state: GameState): void {
  localStorage.setItem('lux-story-game-state', JSON.stringify(state))
}
```

**Phase 2: Hybrid (Month 3-4)**
```typescript
// lib/cloud-sync.ts
import { createClient } from '@supabase/supabase-js'

export async function syncGameState(localState: GameState): Promise<void> {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

  // Cloud sync with conflict resolution
  const { data: cloudState } = await supabase
    .from('game_states')
    .select('*')
    .eq('player_id', localState.playerId)
    .single()

  // Local-first: localStorage writes immediately, cloud syncs in background
  const mergedState = resolveConflicts(localState, cloudState)

  await supabase
    .from('game_states')
    .upsert(mergedState)
}
```

**Phase 3: Full Cloud (Month 6+)**
- Supabase PostgreSQL for player data
- Real-time sync across devices
- Backup and recovery
- Analytics table for pattern tracking

**Migration Strategy:**
1. Add optional cloud sync (Month 3)
2. Default to localStorage, offer "Sign in to sync across devices"
3. Gradual migration: 10% → 50% → 100%
4. Never lose localStorage data (export option always available)

---

## Content Management System

### Current: TypeScript Files

**Structure:**
```
content/
├── samuel-dialogue-graph.ts      (270 nodes)
├── maya-dialogue-graph.ts        (45 nodes)
├── devon-dialogue-graph.ts       (38 nodes)
├── marcus-dialogue-graph.ts      (25 nodes)
├── rohan-dialogue-graph.ts       (22 nodes)
├── yaquin-dialogue-graph.ts      (20 nodes)
├── jordan-dialogue-graph.ts      (15 nodes)
├── kai-dialogue-graph.ts         (12 nodes)
├── lira-dialogue-graph.ts        (8 nodes)
├── asha-dialogue-graph.ts        (8 nodes)
├── zara-dialogue-graph.ts        (7 nodes)
└── thoughts.ts                   (55 thoughts)
```

**Pros:**
- Type-safe dialogue graphs
- Version control via Git
- Fast local development
- No CMS setup overhead

**Cons:**
- Content updates require code deploy
- Non-technical writers can't contribute
- No visual dialogue editor
- Scaling to 450+ nodes gets unwieldy

### Target: Sanity CMS (Month 6+)

**Why Sanity:**
- Real-time collaboration
- Custom dialogue graph editor
- Media management (avatars, backgrounds)
- Flexible schema for character arcs
- Free tier: 100K documents (plenty for 450 nodes)
- GraphQL API

**Schema Design:**
```typescript
// schemas/dialogue-node.ts
export default {
  name: 'dialogueNode',
  type: 'document',
  fields: [
    {
      name: 'nodeId',
      type: 'string',
      validation: Rule => Rule.required().custom(validateNodeId)
    },
    {
      name: 'speaker',
      type: 'reference',
      to: [{ type: 'character' }]
    },
    {
      name: 'content',
      type: 'array',
      of: [{ type: 'richText' }]  // Supports italics, pauses, voice typography
    },
    {
      name: 'choices',
      type: 'array',
      of: [{ type: 'dialogueChoice' }]
    },
    {
      name: 'conditions',
      type: 'array',
      of: [{ type: 'conditionExpression' }]
    },
    {
      name: 'metadata',
      type: 'object',
      fields: [
        { name: 'stationId', type: 'string' },
        { name: 'arcPhase', type: 'string' },  // intro, crossroads, challenge, etc.
        { name: 'sessionBoundary', type: 'boolean' },
        { name: 'platformAnnouncement', type: 'text' }
      ]
    }
  ]
}
```

**Migration Strategy:**
1. Keep TypeScript files as source of truth (Month 1-5)
2. Build Sanity importer script (Month 5)
3. Migrate Station 1 (GCT) to Sanity (Month 6)
4. Station 2+ authored directly in Sanity
5. Export to TypeScript still possible (version control backup)

**Visual Dialogue Editor:**
```typescript
// Sanity Studio plugin: dialogue-graph-editor
// Allows non-technical writers to:
// - See dialogue flow as visual graph
// - Add/edit nodes with form UI
// - Preview character voices
// - Test condition logic
// - Mark session boundaries
```

---

## Analytics Architecture

### Current: None (Beyond Vercel Analytics)

**What We're Missing:**
- Which choices players make
- Where they drop off
- Pattern distribution
- Session duration
- Character popularity
- Replay patterns

### Target: PostHog (Month 2+)

**Why PostHog:**
- Product analytics + session recording
- Self-hosted option (GDPR compliant)
- Free tier: 1M events/month
- Feature flags (A/B test dialogue branches)
- Funnel analysis (intro → character arc → completion)

**Implementation:**
```typescript
// lib/analytics.ts
import posthog from 'posthog-js'

export function initAnalytics() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://app.posthog.com',
      autocapture: false  // Manual event tracking only
    })
  }
}

export function trackChoice(choice: DialogueChoice, gameState: GameState) {
  posthog.capture('dialogue_choice', {
    nodeId: gameState.currentNodeId,
    characterId: gameState.currentCharacterId,
    choiceText: choice.text,
    pattern: choice.pattern,
    playerPatterns: gameState.patterns,
    sessionDuration: Date.now() - gameState.sessionStartTime
  })
}

export function trackSessionBoundary(nodeId: string, sessionDuration: number) {
  posthog.capture('session_boundary', {
    nodeId,
    sessionDuration,
    characterId: gameState.currentCharacterId
  })
}

export function trackArcCompletion(characterId: string, arcPhase: string) {
  posthog.capture('arc_completion', {
    characterId,
    arcPhase,
    totalDuration: gameState.totalPlayTime,
    patternSnapshot: gameState.patterns
  })
}
```

**Key Metrics to Track:**

**Engagement Metrics:**
- Session duration (target: 5-15 min per session)
- Nodes per session (target: 8-12 nodes)
- Return rate (target: 60% return within 7 days)
- Arc completion rate (target: 70% complete at least 1 character)

**Pattern Metrics:**
- Pattern distribution (are all 5 patterns being earned?)
- Identity internalization rate (% who commit vs discard)
- Pattern correlation with choices
- Pattern evolution over time

**Character Metrics:**
- Character popularity (which characters get most engagement?)
- Arc completion by character
- Trust level distribution
- Intersection scene triggers

**B2B Metrics (Urban Chamber):**
- Completion rate per cohort
- Time to completion
- Career cluster distribution
- Pattern → career correlation

**Funnel Analysis:**
```typescript
// Key funnel stages
1. Game start → First choice (target: 95%)
2. First choice → Node 5 (target: 85%)
3. Node 5 → Session boundary 1 (target: 75%)
4. Session 1 → Session 2 return (target: 60%)
5. Arc intro → Arc crossroads (target: 70%)
6. Crossroads → Arc completion (target: 55%)
```

---

## AI Content Pipeline

### Purpose
Reduce character arc creation time from 7 hours → 2.5 hours (64% faster) while maintaining quality.

### Architecture

**Input: Professional Interview (Audio)**
```
Urban professional (surgeon, AI engineer, organizer, etc.)
30-45 min conversation about:
- Career journey
- Key crossroads moments
- Pattern-revealing decisions
- Challenges and insights
```

**Stage 1: Transcription**
```typescript
// lib/ai-pipeline/transcribe.ts
import OpenAI from 'openai'

export async function transcribeInterview(audioFile: File): Promise<string> {
  const openai = new OpenAI()
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
    language: 'en'
  })
  return transcription.text
}
```

**Stage 2: Arc Extraction**
```typescript
// lib/ai-pipeline/extract-arc.ts
export async function extractCharacterArc(transcript: string): Promise<CharacterArcData> {
  const openai = new OpenAI()

  const systemPrompt = `
You are a narrative designer for Lux Story, a career exploration game.

Your task: Extract a 10-node character arc from this professional's interview.

Structure:
1. Introduction (2 nodes) - Who they are, what draws player in
2. Crossroads (2 nodes) - Key decision point in their career
3. Challenge (2 nodes) - Obstacle they faced
4. Insight (2 nodes) - What they learned, pattern revelation
5. Path Forward (2 nodes) - Where they are now, what's next

Requirements:
- Each node: 2-4 dialogue chunks
- Show, don't tell (reveal career through story, not exposition)
- Pattern-revealing choices (analytical, helping, building, patience, exploring)
- Trust-gated progression (early nodes build trust)
- Character voice (match professional's speaking style)

Output format: JSON matching CharacterArcData schema
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: transcript }
    ],
    response_format: { type: 'json_object' }
  })

  return JSON.parse(response.choices[0].message.content!)
}
```

**Stage 3: Human Review & Polish**
```typescript
// lib/ai-pipeline/review.ts
export interface ReviewChecklist {
  characterVoiceConsistent: boolean
  patternsBalanced: boolean  // All 5 patterns represented
  trustProgression: boolean  // Early nodes low-trust, later high-trust
  choicesMeaningful: boolean  // No obvious "right" answers
  sessionBoundaries: boolean  // Natural pause points every 8-12 nodes
  narrativeTension: boolean  // Crossroads → Challenge creates stakes
}

export function generateReviewPrompt(arc: CharacterArcData): string {
  return `
Review this AI-generated character arc for quality:

${JSON.stringify(arc, null, 2)}

Check for:
1. Character voice consistency (does it match the professional's style?)
2. Pattern balance (are all 5 patterns represented?)
3. Trust progression (do early nodes build trust before deeper questions?)
4. Choice quality (are there obvious "right" answers?)
5. Session boundaries (are there natural pause points?)
6. Narrative tension (does crossroads → challenge create stakes?)

Suggest specific edits to improve.
`
}
```

**Stage 4: TypeScript Generation**
```typescript
// lib/ai-pipeline/generate-typescript.ts
export function generateDialogueGraph(arc: CharacterArcData): string {
  // Generates TypeScript file matching existing dialogue graph format
  return `
import { DialogueNode } from '@/lib/dialogue-graph'

export const ${arc.characterId}DialogueGraph: DialogueNode[] = [
  ${arc.nodes.map(node => generateNodeCode(node)).join(',\n  ')}
]

export const ${arc.characterId}EntryPoints = {
  INTRODUCTION: '${arc.characterId}_intro_1',
  CROSSROADS: '${arc.characterId}_crossroads_1',
  CHALLENGE: '${arc.characterId}_challenge_1',
  INSIGHT: '${arc.characterId}_insight_1',
  PATH_FORWARD: '${arc.characterId}_path_forward_1'
} as const
`
}
```

**Pipeline Workflow:**
```
Professional Interview (45 min)
         ↓
Whisper Transcription (2 min)
         ↓
GPT-4 Arc Extraction (5 min)
         ↓
Human Review & Polish (90 min)  ← Where quality comes from
         ↓
TypeScript Generation (2 min)
         ↓
Integration Testing (30 min)
         ↓
Character Arc Complete (2.5 hours total)
```

**Quality Gates:**
- Human must approve before TypeScript generation
- Playtesting with 2-3 beta users before production
- Pattern distribution analysis (PostHog)
- Voice consistency check (does it sound like the professional?)

---

## Performance Optimization

### Current Bottlenecks

**Problem 1: Bundle Size**
- Current: ~450 KB JS (uncompressed)
- Target: <200 KB (compressed)

**Solution: Code Splitting**
```typescript
// app/play/page.tsx
import dynamic from 'next/dynamic'

const StatefulGameInterface = dynamic(
  () => import('@/components/StatefulGameInterface'),
  { ssr: false }  // Client-only (needs localStorage)
)

// Lazy load character dialogue graphs
const characterGraphs = {
  samuel: () => import('@/content/samuel-dialogue-graph'),
  maya: () => import('@/content/maya-dialogue-graph'),
  devon: () => import('@/content/devon-dialogue-graph')
  // ... etc
}

export default function PlayPage() {
  return <StatefulGameInterface />
}
```

**Problem 2: First Paint**
- Current: ~1.2s on mobile 4G
- Target: <800ms

**Solution: Optimistic UI + Skeletons**
```typescript
// components/DialogueLoader.tsx
export function DialogueLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="h-4 bg-muted rounded w-2/3" />
    </div>
  )
}
```

**Problem 3: Mobile Performance**
- Framer Motion animations can jank on low-end devices

**Solution: Reduced Motion + GPU Acceleration**
```typescript
// lib/animation-utils.ts
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const choiceVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: shouldReduceMotion() ? 'tween' : 'spring',
      duration: shouldReduceMotion() ? 0.2 : 0.5
    }
  }
}
```

---

## Mobile-First Architecture

### Design Constraints

**Target Devices:**
- iPhone 12/13/14 (most common)
- Samsung Galaxy S21/S22
- Minimum: iPhone SE (375px width)

**Session Structure:**
- 5-15 minute sessions
- Auto-save every 8-12 nodes
- Session boundaries with platform announcements
- Offline-capable (localStorage)

**Touch Interactions:**
```typescript
// components/ChoiceButton.tsx
export function ChoiceButton({ choice, onSelect }: ChoiceButtonProps) {
  return (
    <motion.button
      className="
        min-h-[44px]          /* iOS minimum touch target */
        px-4 py-3
        text-left
        w-full
        rounded-lg
        bg-background
        hover:bg-accent
        active:scale-[0.98]   /* Tactile feedback */
        transition-colors
      "
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
    >
      {choice.text}
    </motion.button>
  )
}
```

**Responsive Typography:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontSize: {
        'narrative': ['1rem', { lineHeight: '1.75rem' }],      // Mobile
        'narrative-lg': ['1.125rem', { lineHeight: '1.875rem' }]  // Desktop
      }
    }
  }
}
```

**Viewport Handling:**
```typescript
// app/layout.tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,  // Prevent accidental zoom on input focus
  userScalable: false
}
```

---

## Deployment & Infrastructure

### Current: Vercel

**Why Vercel:**
- Next.js native support
- Edge network (fast globally)
- Auto-preview deployments
- Zero config

**Build Performance:**
```bash
# Current build time: ~30 seconds
npm run build
> next build
✓ Compiled in 7.2s
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Collecting page data
✓ Finalizing page optimization
```

**Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
OPENAI_API_KEY=sk-xxxxx  # Server-side only
SANITY_PROJECT_ID=xxxxx
SANITY_DATASET=production
```

### Future: Multi-Region (Month 6+)

**Why Multi-Region:**
- Urban Chamber pilots in multiple cities
- Podcast audience internationally
- Station 2+ launches globally

**Strategy:**
- Vercel Edge for static assets
- Supabase multi-region read replicas
- Cloudflare CDN for media (avatars, backgrounds)

---

## B2B Architecture (Urban Chamber)

### Admin Dashboard Requirements

**From User Story Mapping:**
```typescript
// lib/admin/dashboard.ts
export interface CohortDashboard {
  cohortId: string
  cohortName: string  // "Birmingham Urban Chamber - Feb 2025"
  studentCount: number
  startDate: Date
  endDate: Date

  metrics: {
    completionRate: number  // % who completed at least 1 character arc
    avgSessionDuration: number  // minutes
    avgNodesPerSession: number
    returnRate: number  // % who returned after first session
  }

  patterns: {
    analytical: { min: number; max: number; avg: number }
    helping: { min: number; max: number; avg: number }
    building: { min: number; max: number; avg: number }
    patience: { min: number; max: number; avg: number }
    exploring: { min: number; max: number; avg: number }
  }

  careerClusters: {
    cluster: string  // "Healthcare (helping+patience)"
    studentCount: number
    topCharacters: string[]  // ["Maya", "Marcus"]
  }[]

  exportCSV: () => Promise<Blob>
}
```

**Dashboard UI:**
```typescript
// app/admin/cohorts/[cohortId]/page.tsx
export default function CohortDashboardPage({ params }: { params: { cohortId: string } }) {
  const cohort = useCohortData(params.cohortId)

  return (
    <div className="p-8 space-y-8">
      <CohortHeader cohort={cohort} />

      <MetricsGrid metrics={cohort.metrics} />

      <PatternDistribution patterns={cohort.patterns} />

      <CareerClusters clusters={cohort.careerClusters} />

      <StudentList cohortId={params.cohortId} />

      <ExportButton onExport={cohort.exportCSV} />
    </div>
  )
}
```

**Privacy & Compliance:**
- No PII stored (students identified by anonymous ID)
- Aggregate data only in dashboard
- FERPA compliant (educational records)
- Optional: Student can share individual results with educator

---

## Creator Platform Architecture (Q4 2025)

### Vision
Let educators, professionals, and narrative designers create their own character arcs using Lux Story Studio.

### Architecture

**Studio UI:**
```typescript
// Sanity Studio with custom plugins
// URL: studio.lux-story.com

export const studioConfig = {
  projectId: 'lux-story',
  dataset: 'creator-content',

  plugins: [
    dialogueGraphEditor(),     // Visual node editor
    patternBalancer(),         // Ensure all 5 patterns represented
    voiceConsistencyChecker(), // AI checks character voice
    previewPlayer()            // Test arc in-game before publishing
  ]
}
```

**Marketplace:**
```typescript
// app/marketplace/page.tsx
export interface CreatorArc {
  arcId: string
  title: string
  creator: {
    id: string
    name: string
    verified: boolean  // Professional interview + human review
  }
  characterId: string
  characterName: string
  description: string
  careerType: string  // "Healthcare", "Engineering", "Trades", etc.
  nodeCount: number
  avgDuration: number  // minutes
  rating: number  // 1-5 stars
  playCount: number
  price: number  // $0 (free) or $2.99, $4.99
  revenue: {
    creatorShare: 0.70  // 70% to creator
    platformShare: 0.30  // 30% to Lux Story
  }
}
```

**Revenue Split:**
- Creator: 70% of arc sales
- Lux Story: 30% platform fee
- Pricing tiers: Free, $2.99, $4.99 per arc

**Quality Gates:**
- AI pre-check (pattern balance, voice consistency)
- Human review for "Verified" badge
- Community ratings
- Refund policy (if <50% completion rate)

---

## Migration Roadmap

### Month 1-2: Foundation (Current)
- [x] localStorage persistence
- [x] TypeScript dialogue graphs
- [x] Identity system
- [ ] Session boundaries (Week 3)
- [ ] PostHog analytics (Week 4)

### Month 3-4: Cloud Sync
- [ ] Supabase setup
- [ ] Optional cloud sync (sign in to sync)
- [ ] Multi-device support
- [ ] Backup & recovery

### Month 5-6: CMS Migration
- [ ] Sanity CMS setup
- [ ] Import existing dialogue graphs
- [ ] Visual dialogue editor
- [ ] Station 2 authored in Sanity

### Month 7-9: B2B Infrastructure
- [ ] Admin dashboard
- [ ] Cohort management
- [ ] Career cluster algorithms
- [ ] CSV export for educators

### Month 10-12: Creator Platform
- [ ] Lux Story Studio (Sanity Studio)
- [ ] Marketplace UI
- [ ] Revenue sharing (Stripe Connect)
- [ ] Creator onboarding flow

---

## Technical Debt Management

### Current Known Debt

**1. localStorage Size Limits**
- **Issue**: 5-10 MB limit in browsers
- **Impact**: With 450+ nodes, could hit limit
- **Fix**: Cloud sync (Month 3-4) + compression

**2. Dialogue Graph Type Safety**
- **Issue**: Some graphs missing required fields
- **Impact**: Runtime errors if nodeId not found
- **Fix**: Zod schema validation (Month 2)

**3. No Error Boundaries**
- **Issue**: If dialogue node fails to render, whole app crashes
- **Impact**: Poor UX
- **Fix**: React Error Boundaries (Week 4)

**4. Bundle Size**
- **Issue**: All dialogue graphs loaded at once
- **Impact**: Slow first load
- **Fix**: Code splitting (Month 2)

### Debt Paydown Strategy

**Red (Must Fix Before Scale):**
- Error boundaries (Week 4)
- Cloud sync (Month 3-4)
- Bundle splitting (Month 2)

**Yellow (Should Fix Before B2B):**
- Zod validation (Month 2)
- Analytics (Month 2)
- Admin dashboard (Month 3-4)

**Green (Nice to Have):**
- CMS migration (Month 5-6)
- Creator platform (Month 10-12)

---

## Testing Strategy

### Unit Tests
```typescript
// lib/__tests__/identity-system.test.ts
import { calculatePatternGain, hasInternalizedPattern } from '../identity-system'

describe('Identity System', () => {
  it('applies +20% bonus for internalized patterns', () => {
    const gameState = createMockGameState({
      thoughts: [
        { id: 'identity-analytical', status: 'internalized' }
      ]
    })

    const gain = calculatePatternGain(1, 'analytical', gameState)
    expect(gain).toBe(1.2)
  })

  it('returns base gain for non-internalized patterns', () => {
    const gameState = createMockGameState({ thoughts: [] })
    const gain = calculatePatternGain(1, 'analytical', gameState)
    expect(gain).toBe(1.0)
  })
})
```

### Integration Tests (Playwright)
```typescript
// tests/e2e/dialogue-flow.spec.ts
import { test, expect } from '@playwright/test'

test('complete Samuel introduction arc', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Start Journey')

  // Make 5 analytical choices
  for (let i = 0; i < 5; i++) {
    await page.click('text=/analyze/i')  // Any choice with "analyze"
    await page.waitForTimeout(1000)
  }

  // Verify identity thought triggered
  await page.click('text=Thought Cabinet')
  await expect(page.locator('text=The Analytical Observer')).toBeVisible()
})
```

### User Testing
```typescript
// Manual testing checklist (before each release)
// [ ] Start new game on mobile (iPhone)
// [ ] Complete 1 character arc end-to-end
// [ ] Verify session boundaries work
// [ ] Test cloud sync (if enabled)
// [ ] Check analytics events (PostHog)
// [ ] Verify patterns update correctly
// [ ] Test identity internalization
```

---

## Security & Privacy

### Data Collection Policy

**What We Collect:**
- Anonymous player ID (UUID)
- Dialogue choices made
- Pattern distribution
- Session duration
- Device type (mobile/desktop)

**What We DON'T Collect:**
- Names, emails (unless B2B cohort)
- IP addresses (PostHog anonymizes)
- Precise location
- Device identifiers

**B2B Exception:**
- Urban Chamber students may be identified by cohort
- Aggregate data only shared with educators
- Individual data requires student consent

### Security Measures

**Authentication (Month 3+):**
```typescript
// Supabase Auth
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously()
  return data.user
}
```

**Rate Limiting:**
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')  // 10 requests per 10 seconds
})

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }
}
```

---

## Cost Projections

### Year 1 Infrastructure Costs

**Month 1-2 (Free Tier):**
- Vercel: $0 (hobby plan)
- PostHog: $0 (1M events/month)
- Supabase: $0 (500 MB database)
- Total: **$0/month**

**Month 3-6 (Scaling):**
- Vercel: $20/month (Pro plan)
- PostHog: $0 (still under 1M events)
- Supabase: $25/month (Pro plan, 8 GB database)
- OpenAI: $50/month (AI content pipeline)
- Total: **$95/month** = **$1,140/year**

**Month 7-12 (B2B + Creator Platform):**
- Vercel: $20/month
- PostHog: $50/month (5M events)
- Supabase: $25/month
- OpenAI: $100/month (more arc generation)
- Sanity: $199/month (Growth plan)
- Stripe: 2.9% + 30¢ per transaction
- Total: **$394/month** = **$4,728/year**

**Year 1 Total Infrastructure Cost: ~$3,000**

**Revenue Offset:**
- Month 2: $5,000 Urban Chamber pilot
- Q2-Q4: $50-80K B2B + game sales
- Infrastructure paid for 16x over

---

## Success Metrics

### Technical KPIs (Month 1-6)

**Performance:**
- First Contentful Paint: <1.2s → <800ms
- Time to Interactive: <2.5s → <1.5s
- Lighthouse Score: 85 → 95+
- Mobile vs Desktop parity: 95%+

**Reliability:**
- Uptime: >99.5%
- Error rate: <0.1%
- Data loss incidents: 0
- Cloud sync conflicts: <0.5%

**Engagement (PostHog):**
- Session duration: 10+ minutes
- Return rate (7 day): >60%
- Arc completion: >70%
- Pattern distribution variance: <20% (balanced)

### Business KPIs (Month 6-12)

**B2B:**
- Urban Chamber cohorts: 5-10
- Student completion rate: >70%
- Educator NPS: >50
- Renewal rate: >80%

**Creator Platform:**
- Active creators: 20-50
- Published arcs: 50-100
- Creator earnings: $200-500/month avg
- Quality (verified badge): >60%

---

## Appendix: Tech Stack Alternatives Considered

### Why NOT These Options

**Gatsby (instead of Next.js):**
- ❌ Build times too slow for 450+ nodes
- ❌ Static generation doesn't help (need SSR for auth)
- ❌ Losing momentum vs Next.js

**Firebase (instead of Supabase):**
- ❌ More expensive at scale
- ❌ Vendor lock-in (can't self-host)
- ✅ Better real-time (but we don't need it)

**Strapi (instead of Sanity):**
- ❌ Self-hosted complexity
- ❌ No real-time collaboration
- ✅ Free forever (but maintenance cost)

**Unity/Godot (instead of web):**
- ❌ Mobile deployment complexity
- ❌ Slower iteration (compile times)
- ✅ Better animations (but Framer Motion is good enough)

**Our Choice Philosophy:**
- Boring tech that scales
- Managed services > self-hosted
- Type safety everywhere
- Mobile-first, always

---

*"Choose tools that let you move fast. Optimize when you have users, not before."*
