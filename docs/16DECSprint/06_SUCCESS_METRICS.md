# Success Metrics
**December 16, 2024 - Measurable Goals**

---

## Pattern System Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Acknowledgment rate | 4.4% | 20% | Count nodes with `patternReflection` / total pattern choices |
| First orb view time | 10-15 min | <3 min | Time from game start to first orb earned |
| Silent choices | ~70% | <30% | Choices with zero feedback |
| Pattern education | Via tutorial | Via play | Samuel echo triggers on first pattern choice |

---

## System Activation Metrics

| System | Current | Target | Measure |
|--------|---------|--------|---------|
| Consequence Echoes | 20% activated | 80% activated | Trust changes triggering character echoes |
| Identity System | 5% activated | 100% activated | All 5 patterns can trigger identity offer |
| Pattern Unlocks | 10% activated | 50% activated | Unlocks gate dialogue choices |
| Orb Milestones | 15% activated | 100% activated | Tier transitions trigger Samuel acknowledgment |
| Session Boundaries | 30% activated | 80% activated | Boundaries only at canBoundary nodes |

---

## Player Experience Metrics

### Engagement
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Session completion rate | 80%+ | Players who finish a full character arc |
| Return rate (7 days) | 50%+ | Players who return within 7 days |
| Time to first insight | <10 min | Time until player sees pattern emerging |
| Characters completed | 3+ per journey | Average characters talked to before journey end |

### Feel Metrics (Qualitative)
| Metric | Target | How to Test |
|--------|--------|-------------|
| "Felt seen" | Majority report | Post-session survey |
| "Choices mattered" | Majority report | Post-session survey |
| "Understood patterns" | Majority report | Quiz: Can explain pattern system |
| "Would return" | Majority report | Post-session survey |

---

## Anthony Pilot Metrics (B2B Validation)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Completion rate | 80%+ | Students who finish full journey |
| NPS | 50+ | Net Promoter Score survey |
| Career action taken | 30%+ | Contacted professional, researched career |
| Advisor satisfaction | 80%+ satisfied | Post-pilot advisor survey |
| Time to first insight | <10 min | Tracked in session |

### Pilot Success Criteria
- [ ] 80%+ completion rate
- [ ] NPS ≥ 50
- [ ] Advisors say "I'd use this again"
- [ ] Students report feeling "seen"
- [ ] Clear pattern-career connection visible to students

---

## itch.io Launch Metrics (Game Validation)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Downloads (Month 1) | 1,000+ | itch.io analytics |
| Rating | 4+ stars | User ratings |
| Completion rate | 60%+ | In-game tracking |
| Comments mentioning "patterns" | 30%+ | Content analysis |
| Wishlists for full version | 500+ | itch.io analytics |

---

## Technical Health Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| LCP (mobile) | <2.5s | Lighthouse |
| Dead code lines | <1,000 | Line count in archive |
| TypeScript `any` usage | <10 | grep count |
| Bundle size | <500KB | Build output |
| API error rate | <1% | Supabase logs |

---

## Phase Exit Criteria

### Phase 1: Foundation (Week 1-2)
- [ ] Pattern acknowledgment: 4% → 10%
- [ ] System activation: 30% → 50%
- [ ] Zero silent trust changes
- [ ] First orb echo triggers reliably
- [ ] Session boundaries feel natural

### Phase 2: Identity (Week 3)
- [ ] All 5 patterns can trigger identity offer
- [ ] +20% bonus applies correctly
- [ ] Ceremony feels significant (player feedback)

### Phase 3: Polish (Week 4)
- [ ] Pattern acknowledgment: 10% → 20%
- [ ] Full playthrough smooth
- [ ] Journey ending feels ceremonial

### Phase 4: Validation (Month 2-3)
- [ ] Anthony Pilot: 80%+ completion, NPS 50+
- [ ] itch.io: 1,000+ downloads, 4+ stars
- [ ] Data supports path forward decision

---

## Measurement Implementation

### In-Game Tracking (localStorage)
```typescript
interface SessionMetrics {
  sessionStart: number
  firstOrbTime: number | null
  choiceCount: number
  silentChoiceCount: number
  echoesTriggered: number
  charactersVisited: string[]
  sessionEnd: number | null
  completed: boolean
}
```

### Admin Dashboard Additions
- Pattern acknowledgment rate widget
- System activation percentage
- Session completion funnel
- Time-to-first-orb histogram

### Survey Integration
- Post-session NPS prompt (optional)
- "Did you feel seen?" single question
- Career action follow-up (2 weeks later)

---

## Review Cadence

| Timeframe | What to Review |
|-----------|----------------|
| Daily | Build errors, console errors |
| Weekly | Pattern acknowledgment rate, session completion |
| Bi-weekly | Pilot feedback, qualitative patterns |
| Monthly | Full metrics review, path decision |

---

*If we're not measuring it, we can't improve it. These metrics drive decisions.*
