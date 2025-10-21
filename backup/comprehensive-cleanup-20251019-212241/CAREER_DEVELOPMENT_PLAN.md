# Software Development Plan: Career Exploration Birmingham
## 16-Week Sprint Plan for Catalyze Birmingham Challenge

### Project Overview
Transform Lux contemplative platform into implicit career exploration system for Birmingham youth (ages 11-22) across 7 counties. Maintain non-achievement philosophy while adding career discovery through narrative.

**Timeline**: 16 weeks (4 months) to application submission
**Budget**: $50,000 development budget (pre-grant)
**Team**: 2-3 developers + 1 Birmingham coordinator

---

## Sprint 0: Foundation & Setup (Week 1)
**Goal**: Establish development environment and branch strategy

### Tasks
```bash
# 1. Create and setup branch
git checkout -b career-exploration-birmingham
git push -u origin career-exploration-birmingham

# 2. Setup dual deployment
# Update next.config.js for dual builds
# Configure Cloudflare Pages for career branch

# 3. Create feature flags
# lib/feature-flags.ts
export const FEATURES = {
  CAREER_MODE: process.env.NEXT_PUBLIC_CAREER_MODE === 'true',
  ZIPPY_CHARACTER: true,
  FOREST_REGIONS: false, // Enable progressively
  PATTERN_TRACKING: false,
  BIRMINGHAM_CONTENT: false
}
```

### Deliverables
- [ ] Career branch created and deployed to staging
- [ ] Feature flag system implemented
- [ ] Development environment configured
- [ ] Project board created with all tasks

---

## Sprint 1: Zippy Character Implementation (Week 2-3)
**Goal**: Add time-confused butterfly as subtle career guide

### Phase 1.1: Basic Zippy Integration
```typescript
// components/StoryMessage.tsx enhancement
const getCharacterEmoji = (speaker: string) => {
  switch(speaker.toLowerCase()) {
    case 'zippy': return '🦋'
    case 'lux': return '🦥'
    // ... existing characters
  }
}

// Add Zippy color scheme
.message-zippy {
  border-left: 3px solid transparent;
  border-image: linear-gradient(45deg, #667eea, #764ba2);
  animation: flutter 3s ease-in-out infinite;
}

@keyframes flutter {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) rotate(-1deg); }
  75% { transform: translateX(2px) rotate(1deg); }
}
```

### Phase 1.2: Zippy Dialogue System
```typescript
// data/zippy-dialogues.json
{
  "time_confusion": [
    "Was I going to be a doctor? Or will I be?",
    "Tomorrow already happened, I think?",
    "I remember the future where you found your path."
  ],
  "career_hints": [
    "The ant knows about carrying. Maybe too much.",
    "The owl sees in the dark. Useful for some work.",
    "Lux doesn't work. This is also work."
  ]
}

// hooks/useZippy.ts
export function useZippy() {
  const [lastAppearance, setLastAppearance] = useState(0)
  
  const shouldAppear = useCallback(() => {
    const timeSinceLastAppearance = Date.now() - lastAppearance
    const stillnessTime = usePresence().stillnessTime
    
    // Appears after 2 minutes of stillness
    return stillnessTime > 120000 && timeSinceLastAppearance > 300000
  }, [lastAppearance])
  
  const getZippyMessage = useCallback(() => {
    const context = useGameState().currentContext
    return selectContextualDialogue(context)
  }, [])
  
  return { shouldAppear, getZippyMessage }
}
```

### Deliverables
- [ ] Zippy appears with butterfly emoji
- [ ] Flutter animation on Zippy messages
- [ ] Time-confusion dialogue implemented
- [ ] Appears based on stillness (patience mechanic)

---

## Sprint 2: Forest Regions System (Week 4-5)
**Goal**: Create implicit career sectors through environmental storytelling

### Phase 2.1: Region Infrastructure
```typescript
// lib/forest-regions.ts
export const FOREST_REGIONS = {
  'healing-grove': {
    name: 'The Quiet Grove',
    ambience: ['soft-beeping.mp3', 'footsteps.mp3'],
    palette: { primary: '#10b981', secondary: '#34d399' },
    hiddenSector: 'healthcare',
    characters: ['Patient Pigeon', 'Steady Swan']
  },
  'building-grounds': {
    name: 'Where Things Take Shape',
    ambience: ['hammering.mp3', 'measuring.mp3'],
    palette: { primary: '#f59e0b', secondary: '#fbbf24' },
    hiddenSector: 'construction',
    characters: ['Careful Carpenter Ant']
  },
  'counting-stones': {
    name: 'The Pattern Place',
    ambience: ['typing.mp3', 'calculating.mp3'],
    palette: { primary: '#3b82f6', secondary: '#60a5fa' },
    hiddenSector: 'finance',
    characters: ['The Keeper of Patterns']
  },
  'growing-place': {
    name: 'Where Time Moves Slowly',
    ambience: ['wind.mp3', 'growth.mp3'],
    palette: { primary: '#84cc16', secondary: '#a3e635' },
    hiddenSector: 'agriculture',
    characters: ['Season Keeper']
  },
  'making-space': {
    name: 'The Rhythm Section',
    ambience: ['machinery.mp3', 'assembly.mp3'],
    palette: { primary: '#6366f1', secondary: '#818cf8' },
    hiddenSector: 'manufacturing',
    characters: ['Rhythm Keeper']
  }
}

// components/ForestRegion.tsx
export function ForestRegion({ regionId, children }) {
  const region = FOREST_REGIONS[regionId]
  const { recordPresence } = usePatternTracking()
  
  useEffect(() => {
    // Silently track time in region
    const interval = setInterval(() => {
      recordPresence(regionId)
    }, 10000) // Every 10 seconds
    
    return () => clearInterval(interval)
  }, [regionId])
  
  return (
    <div 
      className="forest-region"
      style={{
        '--region-primary': region.palette.primary,
        '--region-secondary': region.palette.secondary
      }}
    >
      <AmbientSound sources={region.ambience} volume={0.3} />
      {children}
    </div>
  )
}
```

### Phase 2.2: Navigation Without Maps
```typescript
// No traditional navigation menu - paths appear through exploration
// components/PathDiscovery.tsx
export function PathDiscovery() {
  const { visitedRegions } = usePatternTracking()
  const [visiblePaths, setVisiblePaths] = useState([])
  
  useEffect(() => {
    // Paths become visible after visiting
    visitedRegions.forEach(region => {
      setTimeout(() => {
        setVisiblePaths(prev => [...prev, region])
      }, 3000) // Gentle revelation
    })
  }, [visitedRegions])
  
  return (
    <div className="paths-container">
      {visiblePaths.map(path => (
        <div key={path} className="path-hint">
          A path leads to {FOREST_REGIONS[path].name}
        </div>
      ))}
    </div>
  )
}
```

### Deliverables
- [ ] 5 forest regions implemented
- [ ] Ambient sound system working
- [ ] Color palettes per region
- [ ] Path discovery mechanism

---

## Sprint 3: Pattern Tracking System (Week 6-7)
**Goal**: Build invisible career affinity detection

### Phase 3.1: Pattern Detection Engine
```typescript
// lib/pattern-engine.ts
interface PatternData {
  regionTime: Record<string, number>
  characterAffinity: Record<string, number>
  choiceThemes: string[]
  stillnessLocations: string[]
  timestamp: number
}

class PatternEngine {
  private patterns: PatternData
  
  constructor() {
    this.patterns = this.loadPatterns() || this.initializePatterns()
  }
  
  recordInteraction(interaction: Interaction) {
    // Silent recording - no user feedback
    switch(interaction.type) {
      case 'region_presence':
        this.patterns.regionTime[interaction.region] += interaction.duration
        break
      case 'character_dialogue':
        this.patterns.characterAffinity[interaction.character]++
        break
      case 'choice_made':
        this.patterns.choiceThemes.push(this.extractTheme(interaction.choice))
        break
      case 'stillness':
        this.patterns.stillnessLocations.push(interaction.location)
        break
    }
    
    this.savePatterns()
    this.checkForEmergentPatterns()
  }
  
  private checkForEmergentPatterns() {
    const dominantRegion = this.getDominantRegion()
    const consistentTheme = this.getConsistentTheme()
    
    if (dominantRegion && consistentTheme) {
      // Queue subtle revelation
      this.queueNarrativeInsight({
        type: 'career_affinity',
        strength: 'emerging',
        expression: this.generateSubtleHint(dominantRegion, consistentTheme)
      })
    }
  }
  
  private generateSubtleHint(region: string, theme: string): string {
    // Never mention careers directly
    const hints = {
      'healing-grove': {
        'helping': "The grove feels familiar now. Like breathing.",
        'patience': "You wait here often. The rhythm suits you."
      },
      'building-grounds': {
        'creating': "Your hands remember the feeling of making.",
        'persistence': "Each piece finds its place, eventually."
      }
    }
    
    return hints[region]?.[theme] || "The forest knows you better now."
  }
}
```

### Phase 3.2: Privacy-First Storage
```typescript
// lib/secure-patterns.ts
export class SecurePatternStorage {
  private readonly STORAGE_KEY = 'journey_memory'
  
  save(patterns: PatternData) {
    // Everything stays local
    const encrypted = this.lightEncrypt(patterns)
    localStorage.setItem(this.STORAGE_KEY, encrypted)
    
    // Optional anonymous aggregation
    if (this.hasConsent()) {
      this.shareAnonymized(patterns)
    }
  }
  
  private lightEncrypt(data: any): string {
    // Simple obfuscation to prevent casual inspection
    return btoa(JSON.stringify(data))
  }
  
  private shareAnonymized(patterns: PatternData) {
    // Strip all identifying information
    const anonymous = {
      regionDistribution: this.normalizeDistribution(patterns.regionTime),
      themeFrequency: this.countThemes(patterns.choiceThemes),
      timestamp: Math.floor(patterns.timestamp / 86400000) * 86400000 // Day precision only
    }
    
    // Send to research endpoint (if user consented)
    fetch('/api/research/patterns', {
      method: 'POST',
      body: JSON.stringify(anonymous)
    })
  }
}
```

### Deliverables
- [ ] Pattern engine recording all interactions
- [ ] Local storage with encryption
- [ ] Anonymous aggregation system
- [ ] Narrative hints queueing system

---

## Sprint 4: Birmingham Content Creation (Week 8-9)
**Goal**: Localize content for Birmingham context

### Phase 4.1: County-Specific Adaptations
```typescript
// data/birmingham-content.json
{
  "counties": {
    "jefferson": {
      "id": "jefferson",
      "forestName": "Where All Paths Cross",
      "description": "The busiest part of the forest, where many gather",
      "characters": ["Metro Mouse", "Downtown Deer"],
      "employers": ["regions-bank", "uab-health", "alabama-power"]
    },
    "bibb": {
      "id": "bibb",
      "forestName": "The Quiet Forest",
      "description": "Few visit here, but the trees grow just as tall",
      "characters": ["Solitary Squirrel", "Independent Ibis"],
      "employers": ["local-manufacturer", "forest-service"],
      "special": "enhanced-offline-mode"
    },
    "chilton": {
      "id": "chilton",
      "forestName": "The Growing Place",
      "description": "Where patience is measured in seasons",
      "characters": ["Peach Tree Keeper", "Season Watcher"],
      "employers": ["farm-cooperative", "local-processing"]
    }
    // ... other 4 counties
  }
}
```

### Phase 4.2: Employer Character System
```typescript
// lib/employer-characters.ts
export const EMPLOYER_CHARACTERS = {
  'regions-bank': {
    name: 'The Pattern Keeper',
    appearance: 'A figure in subtle blue and green',
    location: 'counting-stones',
    dialogue: {
      greeting: "Numbers tell stories, if you listen.",
      patience: "Everything balances, given time.",
      departure: "The patterns will be here tomorrow."
    },
    // Hidden employer data
    realEmployer: 'Regions Bank',
    opportunities: ['teller', 'analyst', 'customer-service'],
    annualHiring: 20
  },
  'uab-health': {
    name: 'The Healing Guide',
    appearance: 'Someone in soft white and green',
    location: 'healing-grove',
    dialogue: {
      greeting: "Every breath is a small healing.",
      patience: "Recovery cannot be rushed.",
      departure: "Rest is part of the work."
    },
    realEmployer: 'UAB Health System',
    opportunities: ['nursing', 'tech', 'administration'],
    annualHiring: 50
  }
  // ... other employers
}

// components/EmployerCharacter.tsx
export function EmployerCharacter({ employerId }) {
  const character = EMPLOYER_CHARACTERS[employerId]
  const { recordInteraction } = usePatternTracking()
  
  const handleInteraction = () => {
    recordInteraction({
      type: 'employer_contact',
      employer: employerId,
      timestamp: Date.now()
    })
    
    // Show dialogue, never mention company name
    return character.dialogue.greeting
  }
  
  return (
    <div className="forest-inhabitant">
      <p className="character-appearance">{character.appearance}</p>
      <StoryMessage speaker={character.name} text={handleInteraction()} />
    </div>
  )
}
```

### Phase 4.3: Civil Rights History Integration
```typescript
// data/birmingham-history.json
{
  "historical_elements": {
    "freedom_tree": {
      "description": "A tree that remembers when walking was resistance",
      "location": "all-regions",
      "dialogue": "Some paths were walked so others could run."
    },
    "patience_stones": {
      "description": "Stones worn smooth by waiting",
      "location": "jefferson",
      "dialogue": "Change came slowly, then all at once."
    },
    "courage_creek": {
      "description": "Water that flows despite obstacles",
      "location": "birmingham-center",
      "dialogue": "The stream found its way, as streams do."
    }
  }
}
```

### Deliverables
- [ ] All 7 counties represented
- [ ] 10+ employer characters created
- [ ] Civil rights elements integrated
- [ ] Local success stories woven in

---

## Sprint 5: Offline-First PWA (Week 10-11)
**Goal**: Enable full functionality without internet (critical for rural counties)

### Phase 5.1: Service Worker Enhancement
```javascript
// public/service-worker.js
const CACHE_NAME = 'lux-career-v1'
const OFFLINE_ASSETS = [
  '/',
  '/offline.html',
  '/contemplative-story-career.json',
  '/birmingham-content.json',
  '/forest-regions.json',
  // All story assets
  ...STORY_SCENES,
  // All audio files
  ...AMBIENT_SOUNDS
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching offline assets')
      return cache.addAll(OFFLINE_ASSETS)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache first, network fallback
      if (response) {
        return response
      }
      
      return fetch(event.request).then((response) => {
        // Cache new resources dynamically
        if (shouldCache(event.request)) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      }).catch(() => {
        // Offline fallback
        return caches.match('/offline.html')
      })
    })
  )
})

// Background sync for pattern data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-patterns') {
    event.waitUntil(syncPatternData())
  }
})

async function syncPatternData() {
  const patterns = await getLocalPatterns()
  if (patterns && navigator.onLine) {
    await fetch('/api/patterns/sync', {
      method: 'POST',
      body: JSON.stringify(patterns)
    })
  }
}
```

### Phase 5.2: Offline State Management
```typescript
// hooks/useOfflineSync.ts
export function useOfflineSync() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [pendingSync, setPendingSync] = useState([])
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      syncPendingData()
    }
    
    const handleOffline = () => {
      setIsOffline(true)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  const queueForSync = (data: any) => {
    setPendingSync(prev => [...prev, data])
    localStorage.setItem('pending_sync', JSON.stringify([...pendingSync, data]))
  }
  
  const syncPendingData = async () => {
    const pending = JSON.parse(localStorage.getItem('pending_sync') || '[]')
    
    for (const item of pending) {
      await syncItem(item)
    }
    
    localStorage.removeItem('pending_sync')
    setPendingSync([])
  }
  
  return { isOffline, queueForSync, pendingCount: pendingSync.length }
}
```

### Deliverables
- [ ] Service worker caching all assets
- [ ] Offline fallback pages
- [ ] Background sync for patterns
- [ ] Offline indicator UI

---

## Sprint 6: Analytics Without Surveillance (Week 12-13)
**Goal**: Measure impact without invasive tracking

### Phase 6.1: Ethical Analytics System
```typescript
// lib/ethical-analytics.ts
export class EthicalAnalytics {
  private store: AnalyticsStore
  
  constructor() {
    this.store = new LocalAnalyticsStore() // Local first
  }
  
  track(event: AnalyticsEvent) {
    // No PII, no precise timestamps, no device fingerprinting
    const sanitized = {
      type: event.type,
      category: event.category,
      // Round timestamp to nearest hour
      time: Math.floor(event.timestamp / 3600000) * 3600000,
      // General context only
      context: this.generalizeContext(event.context)
    }
    
    this.store.record(sanitized)
    
    // Aggregate before any sharing
    if (this.shouldShare()) {
      this.shareAggregated()
    }
  }
  
  private generalizeContext(context: any) {
    return {
      county: context.county, // OK to track
      // Don't track: age, gender, school, IP, device
      sessionLength: this.bucketize(context.sessionLength),
      dayOfWeek: new Date().getDay()
    }
  }
  
  private bucketize(value: number): string {
    // Convert precise values to ranges
    if (value < 300000) return 'short' // < 5 min
    if (value < 1200000) return 'medium' // 5-20 min
    return 'long' // > 20 min
  }
  
  async shareAggregated() {
    const aggregated = this.store.getAggregated()
    
    // Only share if 10+ sessions to ensure anonymity
    if (aggregated.sessionCount >= 10) {
      await fetch('/api/analytics/aggregated', {
        method: 'POST',
        body: JSON.stringify({
          county: aggregated.county,
          avgSessionLength: aggregated.avgSessionLength,
          popularRegions: aggregated.topRegions,
          periodStart: aggregated.periodStart,
          sessionCount: aggregated.sessionCount
        })
      })
    }
  }
}
```

### Phase 6.2: Impact Measurement
```typescript
// lib/impact-metrics.ts
export class ImpactMetrics {
  // Measure what matters without being creepy
  
  measureAnxietyReduction() {
    // Through narrative choices, not surveys
    const calmChoices = this.countCalmChoices()
    const rushChoices = this.countRushChoices()
    
    return {
      trend: calmChoices > rushChoices ? 'reducing' : 'stable',
      confidence: this.calculateConfidence(calmChoices + rushChoices)
    }
  }
  
  measureCareerClarity() {
    // Through time distribution, not tests
    const patterns = this.getPatterns()
    const concentration = this.calculateGiniCoefficient(patterns.regionTime)
    
    return {
      clarity: concentration > 0.6 ? 'emerging' : 'exploring',
      primaryInterest: this.getTopRegion(patterns.regionTime)
    }
  }
  
  measureEngagement() {
    return {
      sessionsPerWeek: this.getSessionFrequency(),
      avgSessionLength: this.getAverageSession(),
      completionRate: this.getCompletionRate(),
      returnRate: this.getReturnRate()
    }
  }
}
```

### Deliverables
- [ ] Local-first analytics
- [ ] Aggregated sharing only
- [ ] Impact metrics without surveys
- [ ] Privacy-preserving reports

---

## Sprint 7: Testing & Refinement (Week 14-15)
**Goal**: Test with real Birmingham youth and refine

### Phase 7.1: Youth Testing Protocol
```typescript
// testing/youth-testing.ts
export const TESTING_PROTOCOL = {
  recruitment: {
    target: 50,
    distribution: {
      jefferson: 20,
      rural: 20, // Bibb, Chilton, Walker
      suburban: 10 // Shelby, St. Clair
    },
    ages: {
      '11-13': 15,
      '14-17': 25,
      '18-22': 10
    }
  },
  
  sessions: {
    duration: '45-60 minutes',
    location: 'Library or school',
    format: 'Individual play with observation',
    compensation: '$20 gift card'
  },
  
  metrics: {
    quantitative: [
      'Time to first stillness',
      'Regions explored',
      'Characters encountered',
      'Session length',
      'Return interest (1-10)'
    ],
    qualitative: [
      'Emotional response',
      'Confusion points',
      'Favorite moments',
      'Career interests mentioned',
      'Anxiety indicators'
    ]
  }
}
```

### Phase 7.2: Iteration Based on Feedback
```typescript
// Rapid iteration cycles
const ITERATION_CYCLES = [
  {
    week: 14,
    focus: 'Onboarding clarity',
    changes: [
      'Simplify initial forest entry',
      'Add subtle tutorial through Lux',
      'Clarify navigation hints'
    ]
  },
  {
    week: 15,
    focus: 'Engagement sustainment',
    changes: [
      'Adjust Zippy appearance frequency',
      'Refine revelation timing',
      'Add more character interactions'
    ]
  }
]
```

### Deliverables
- [ ] 50 youth tested
- [ ] Feedback incorporated
- [ ] Performance optimized
- [ ] Accessibility verified

---

## Sprint 8: Demo & Documentation (Week 16)
**Goal**: Prepare compelling demo for grant application

### Phase 8.1: Demo Creation
```typescript
// Create guided demo experience
export const GRANT_DEMO = {
  duration: '10 minutes',
  path: [
    {
      scene: 'Forest entry',
      highlight: 'Non-pressured introduction'
    },
    {
      scene: 'Meet Lux',
      highlight: 'Contemplative approach'
    },
    {
      scene: 'Explore healing grove',
      highlight: 'Implicit healthcare exploration'
    },
    {
      scene: 'Encounter employer character',
      highlight: 'Real Birmingham employer (unnamed)'
    },
    {
      scene: 'Stillness revelation',
      highlight: 'Pattern recognition through patience'
    },
    {
      scene: 'County selection',
      highlight: 'All 7 counties served'
    }
  ],
  
  metrics_overlay: {
    show: [
      'Anxiety reduction indicator',
      'Engagement time',
      'Pattern emergence',
      'Zero achievement pressure'
    ]
  }
}
```

### Phase 8.2: Documentation Package
```markdown
# Documentation for Grant Application

## Technical Documentation
- Architecture overview
- Offline capability proof
- Privacy/security measures
- Scalability plan

## Impact Documentation
- Youth testing results
- Anxiety reduction data
- Engagement metrics
- Testimonials

## Partnership Documentation
- Letters of support
- Employer commitments
- School partnerships
- Community endorsements
```

### Deliverables
- [ ] 10-minute demo video
- [ ] Live demo environment
- [ ] Complete documentation
- [ ] Grant application ready

---

## Development Checklist

### Week 1-2: Foundation
- [ ] Branch setup
- [ ] Zippy character basic implementation
- [ ] Animation system

### Week 3-5: Core Features
- [ ] Forest regions (5 sectors)
- [ ] Pattern tracking (invisible)
- [ ] Ambient sound system

### Week 6-9: Birmingham Specific
- [ ] County adaptations (all 7)
- [ ] Employer characters (10+)
- [ ] Local history integration
- [ ] Cultural elements

### Week 10-13: Technical Excellence
- [ ] Offline-first PWA
- [ ] Privacy-first analytics
- [ ] Performance optimization
- [ ] Accessibility compliance

### Week 14-16: Testing & Polish
- [ ] Youth testing (50 participants)
- [ ] Feedback incorporation
- [ ] Demo creation
- [ ] Documentation completion

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Scope creep toward gamification | Weekly philosophy review |
| Technical complexity | Incremental feature flags |
| Youth engagement | Early testing, rapid iteration |
| Rural connectivity | Offline-first from start |
| Timeline pressure | Parallel development tracks |

---

## Success Metrics

### Technical Success
- [ ] Loads in < 2 seconds
- [ ] Works fully offline
- [ ] No data breaches
- [ ] 99.9% uptime

### User Success
- [ ] 75% completion rate
- [ ] 60% anxiety reduction
- [ ] 80% would recommend
- [ ] 50% return rate

### Grant Success
- [ ] Compelling demo
- [ ] Strong partnerships
- [ ] Clear impact data
- [ ] Sustainable model

---

## Team Allocation

### Developer 1: Core Platform
- Zippy implementation
- Forest regions
- Pattern tracking
- Performance optimization

### Developer 2: Birmingham Features
- County content
- Employer characters
- Local adaptations
- PWA implementation

### Developer 3 (if available): Testing & Analytics
- Youth testing coordination
- Analytics implementation
- Documentation
- Demo creation

### Birmingham Coordinator: Community
- Partnership development
- Youth recruitment
- Grant writing support
- Local relationship building

---

## Budget Allocation (Pre-Grant)

| Category | Amount | Purpose |
|----------|--------|---------|
| Development | $30,000 | 3 developers × 2 months |
| Birmingham Coordinator | $10,000 | 4 months part-time |
| Testing | $5,000 | Youth compensation, venues |
| Infrastructure | $2,000 | Hosting, services |
| Design/Content | $3,000 | Audio, visuals, writing |
| **Total** | **$50,000** | Pre-grant investment |

---

## Post-Grant Roadmap

### Phase 1: Scale (Months 1-6)
- Deploy to all 7 counties
- Train facilitators
- Onboard employers

### Phase 2: Enhance (Months 7-12)
- Add more career paths
- Parent mode
- Teacher dashboard

### Phase 3: Expand (Months 13-24)
- Other Alabama cities
- Multi-state pilot
- National model

---

## Conclusion

This 16-week development plan transforms Lux into a revolutionary career exploration platform while maintaining its contemplative core. By focusing on implicit discovery rather than explicit assessment, we create the only career platform that reduces anxiety rather than creating it.

**Next Immediate Action**: Create branch and implement Zippy character (Week 1)