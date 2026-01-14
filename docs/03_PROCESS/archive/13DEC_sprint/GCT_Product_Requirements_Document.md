# Product Requirements Document
## Grand Central Terminus (Actualize Me) — Career Exploration Platform
**Version:** 1.0 (Beta)  
**Date:** December 2024  
**Authors:** Abdus Muwwakkil, Ronny  
**Status:** Pre-Release

---

## Executive Summary

Grand Central Terminus (internally: **Actualize Me**) is an immersive career exploration platform that uses interactive storytelling ("nanostems") to help users ages 14–30+ discover career pathways, develop professional vocabulary, and understand workplace realities—without the barrier to entry of traditional job shadowing or mentorship.

**Core Thesis:** People finish high school not knowing what they want to do, go to college, rack up debt, and still don't have the right career path. If we can solve—with exposure and nanostems—people knowing how to pick the right major, we've done a huge good to society.

**Product Positioning:** "iTunes for real-world experiences." A scalable catalog of career simulations that grows in value as the library expands.

---

## Problem Statement

### The Broken Systems
- Looking for a job, getting a job, finding a career, moving adjacently between industries—these are all broken systems
- Millions of unemployed Americans with degrees and PhDs who want work but can't find it
- Fortune 500 companies like Unilever have lower acceptance rates than Harvard
- Traditional career guidance relies on intermediaries (guidance counselors, after-school programs) that most users don't have access to

### The Gap We're Filling
1. **Awareness Gap** — Users don't know what career paths exist or how to navigate them
2. **Network Gap** — Users lack connections to professionals or decision-makers
3. **Vocabulary Gap** — Users can't articulate their transferable skills or interests professionally

### User Pain Point (The 14-Year-Old Example)
A motivated teen walks into a library media lab asking, "If I learn this equipment, will I get my certification?" He wants to be a sound engineer but:
- Doesn't know stadium audio engineering exists as a career
- Doesn't know the range of sound engineering roles (Broadway, sports, film, indie music)
- Has no path from curiosity → certification → professional identity

---

## Target Audience

### Primary Users
| Segment | Age Range | Description |
|---------|-----------|-------------|
| Early Explorers | 14–18 | High schoolers who should see themselves as professionals; need exposure before college decisions |
| College/Early Career | 18–25 | Students or recent grads navigating major selection, internships, first jobs |
| Career Transitioners | 25–35 | Professionals pivoting industries or seeking adjacent moves |

### Secondary Stakeholders
- **Workforce Development Orgs** — Urban Chamber of Commerce, libraries, Innovate Alabama-type programs
- **Educational Institutions** — After-school programs, community colleges, boot camps
- **Employers** — Companies seeking diverse talent pipelines (future B2B model)

---

## Product Vision & Principles

### The Core Insight
> "The next best action doesn't happen on our platform. The next best action will actually happen outside of our platform. And we're okay with that."

We're not a job board. We're not a course platform. We create **awareness and vocabulary** so users can take better action in the real world.

### Guiding Principles

1. **Engagement Over Expertise** — A nanostem with 90% completion built by us beats a nanostem with 1% completion built with industry experts. Build first, validate later.

2. **The User is the Stakeholder** — Don't design for the psychiatrist, teacher, or guidance counselor. Design for the individual who will embrace the experience and take the next best action.

3. **Build Small, Generalize Big** — Solve for a small niche; the solution will generalize to a much larger audience.

4. **No Strings Attached** — Like reading a book. You can pick it up, put it down, no account required. Trust is our greatest capital.

5. **Hyperjump the Broken Systems** — We're not here to model broken career systems. We're here to institute better ways using technology.

---

## Core Product: The Nanostem

### Definition
A **nanostem** is a short, immersive, text-based scenario that simulates a real-world professional situation. Users make choices that reveal their skills, mindsets, and alignment with specific career paths.

### Anatomy of a Nanostem

```
┌─────────────────────────────────────────┐
│  STAGE (Narrative Container)            │
│  ─────────────────────────────────────  │
│  Scene description, NPC dialogue,       │
│  situational context                    │
│                                         │
│  "You're at a mission-critical SpaceX  │
│   launch. The last launch failed. The   │
│   head of NASA is stressed. Can you     │
│   help them through it?"                │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  CHOICES (Response Container)           │
│  ─────────────────────────────────────  │
│  ┌─────────────┐  ┌─────────────┐       │
│  │  Choice A   │  │  Choice B   │       │
│  └─────────────┘  └─────────────┘       │
│  ┌─────────────┐  ┌─────────────┐       │
│  │  Choice C   │  │  Choice D   │       │
│  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  PATTERN MAPPING                        │
│  ─────────────────────────────────────  │
│  Each choice → Skill/Mindset pattern    │
│  Pattern → Cumulative profile           │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│  INSIGHTS (Teaching Moment)             │
│  ─────────────────────────────────────  │
│  "You exhibited conflict resolution.    │
│   This is a critical mindset in         │
│   aerospace program management."        │
└─────────────────────────────────────────┘
```

### The Formula
1. Set out what's happening (scene)
2. Present choices
3. Each choice maps to a pattern
4. Pattern reveals something about the user
5. Next scene continues based on accumulated patterns
6. Repeat until Insights summary

**Scene Length Guidelines:**
- If narrative requires scrolling on mobile, split into multiple scenes
- Break long passages at natural pause points
- Move overflow content to new scene rather than forcing scroll
- Target: full scene visible without scroll on iPhone

### Content Sourcing
- LinkedIn posts from professionals
- Podcast transcripts
- Public interviews and books
- World Economic Forum future-of-work data
- Real professional experiences (adapted, not verbatim)

**Note:** We don't need expert validation to ship. We can nanostem anything, then enhance with professional ties later. That's secondary to MVP engagement.

---

## Feature Requirements

### P0 — Must Have for Beta

#### 1. Nanostem Player
- Text-based narrative display
- Multiple choice response system
- Scene-to-scene progression
- Pattern/skill tracking per session

#### 2. Insights System
- End-of-nanostem summary
- Skills revealed through decision-making
- Transferable skills vocabulary
- Industry-specific mindsets identified

#### 3. Nanostem Library
- Minimum viable catalog for beta (AI, cybersecurity, sound engineering, healthcare)
- Category/industry browsing
- Future: search and filtering

#### 4. Data Disclaimer (In-App Copy)
> "The station has a way of memory. Every choice you make leaves an echo. Over time, these echoes gather—it becomes something you can see. Think of it as a mirror, not of what you've done, but of who you are."

### P1 — Post-Beta

#### 5. Skills Tree / Profile
- Cumulative tracking across nanostems
- Visual representation of skill development
- Shareable profile (opt-in)

#### 6. Data Sharing (Opt-In)
- Global toggle: "Do you want to share your data?"
- Opt-out = data never shared
- No negative framing (platform never says "you suck at something")

**Capstone Data Share Flow (Skill Tree Integration):**
```
User completes 5 nanostems in a pathway
          │
          ▼
Step 6: Capstone Simulation
(Sponsored by Partner Company)
          │
          ▼
Prompt: "Would you like to share your 
data with [Company X] who designed 
this final simulation?"
          │
    ┌─────┴─────┐
    ▼           ▼
  [Yes]       [No]
    │           │
    ▼           ▼
 Profile     Continue
 shared      anonymously
```

#### 7. AI-Powered Content Creation
- Multiple agents for narrative generation
- Transcript-to-nanostem pipeline
- Scale catalog without content creation hell

### P2 — Future Roadmap

#### 8. Corporate Nanostem Bids
- Branded experiences (e.g., "SpaceX Launch Simulation")
- Employer-sponsored career pipelines
- Candidate data shared back to sponsor (with user consent)
- Not corporate mumbo jumbo—authentic engagement experiences

#### 9. Partnership Integrations
- Carol Dweck growth mindset principles
- Industry thought leader content
- Podcast community blasts

---

## UI/UX Requirements

### Design Philosophy
> "We're creating our own genre. A new modality for career exploration."

Inspiration: Spider-Verse visual differentiation—break up the spaces, texture the containers.

### Mobile-First Constraints
Current issues identified:
- Containers bleed into each other on iPhone
- Insufficient visual separation between Stage and Choices
- Excessive scrolling in both containers
- Choice order bias (users pick first 3, don't scroll)

**Specific Fixes Required:**

| Issue | Fix | CSS Property |
|-------|-----|--------------|
| Container bleed | Add space between Stage and Choices | `padding-top` on Choices container |
| Weak separation | Deeper border/shadow on top of Choices | `box-shadow` or `border-top` with increased weight |
| Blue highlight too subtle | Increase prominence | Darker blue value on left accent |
| Double scroll fatigue | Convert Stage to horizontal carousel | `overflow-x: scroll` with snap points |
| Choice bias | Randomize order on render | JavaScript shuffle on mount |

### Layout Specifications

#### Narrative Container (Stage)
| Property | Requirement |
|----------|-------------|
| Background | Darker than Choices container; consider dark background + light text |
| Border | Blue highlight on left edge (make more prominent) |
| Typography | Arial for body text (easy on eyes for deep reading); fancier font for headings |
| Scrolling | Consider horizontal carousel instead of vertical scroll |
| Spacing | Add padding-top to create separation from Choices |

#### Choices Container
| Property | Requirement |
|----------|-------------|
| Layout | 2x2 grid ("Who Wants to Be a Millionaire" format) for 4 choices |
| Layout (5+ choices) | Randomize order to prevent first-choice bias |
| Background | Lighter than Stage; consider texture |
| Border | Deeper border/shadow on top edge to prevent "bleeding" into Stage |
| Scrolling | Vertical scroll if needed; explore horizontal carousel |

#### Visual Hierarchy
```
┌──────────────────────────────────────────────┐
│ ▌ STAGE (Dark BG, Light Text, Blue Accent)   │
│ ▌ Horizontal carousel for multi-part scenes  │
└──────────────────────────────────────────────┘
     ↑ Clear visual break (shadow/border) ↑
┌──────────────────────────────────────────────┐
│   CHOICES (Light BG, 2x2 Grid)               │
│   ┌─────────┐ ┌─────────┐                    │
│   │    A    │ │    B    │                    │
│   └─────────┘ └─────────┘                    │
│   ┌─────────┐ ┌─────────┐                    │
│   │    C    │ │    D    │                    │
│   └─────────┘ └─────────┘                    │
└──────────────────────────────────────────────┘
```

### Accessibility
- ARIA labels on all interactive elements
- Screen reader compatible
- Larger font option (system-level support)
- High contrast mode consideration

### Typography
| Element | Font | Size | Notes |
|---------|------|------|-------|
| Headings | Times New Roman or similar serif | Larger | "Royal and presidential" |
| Body/Narrative | Arial | Standard | Clean, easy for deep reading |
| Choices | Arial | Standard | Consistent with body |

---

## Technical Architecture

### Current Stack
- **Frontend:** Custom CSS (no Bootstrap/template) — all design is custom-implemented
- **UI Pattern:** Text-based, chatbot-style delivery
- **Content Engine:** AI agents for narrative generation
- **State:** Browser-level session (no account required)

> **Engineering Note:** Because this is all custom CSS with no framework, there's no "perfect visual" template to fall back on. Every layout decision is hand-coded, which gives flexibility but requires careful iteration.

### The Patent Opportunity
> "If I say, do a patent on this platform today, this is what you're patenting: the way of delivery of information to people."

**What we're NOT:** LinkedIn trying to be TikTok  
**What we ARE:** ChatGPT-style interface delivering multimedia story experiences

### Content Pipeline
```
Source Material (Podcasts, LinkedIn, Interviews)
          │
          ▼
    AI Processing
    (Narrative Agent)
          │
          ▼
    Nanostem Draft
          │
          ▼
    Pattern Mapping
    (Skills/Mindsets)
          │
          ▼
    QA / Engagement Test
          │
          ▼
    Publish to Library
```

### Multi-Agent Architecture
The platform uses multiple specialized AI agents for content generation:

| Agent | Role |
|-------|------|
| Narrative Channel Agent | Analyzes source material, generates NPC dialogue and scene descriptions |
| Pattern Mapping Agent | Assigns skill/mindset tags to each choice |
| Insights Agent | Generates end-of-experience summaries |

**Example Prompt Pattern:**
> "You are the narrative channel agent. Please analyze this [transcript/article] and create a new NPC story."

### Current Build Status
| Nanostem | Status | Notes |
|----------|--------|-------|
| AI / Future of Work | ✅ Built | Launch-ready for Urban Chamber beta |
| Sound Engineering | 🔨 In Progress | Based on 14-year-old use case |
| Healthcare | 🔨 In Progress | Heart monitor scenario |
| Cybersecurity | 📋 Planned | Priority for emerging industry focus |

---

## Success Metrics

### Beta Success Criteria
| Metric | Target | Rationale |
|--------|--------|-----------|
| Nanostem Completion Rate | >70% | Engagement beats everything |
| Time in Experience | >5 min avg | Deep enough to provide value |
| Return Usage | >30% within 7 days | Stickiness indicator |
| Beta Testers | 16+ (Urban Chamber cohort) | Validates B2B channel |

### Long-Term Validation (White Paper Hypothesis)
- Users who complete nanostems have higher ROI post-college
- Users more likely to finish degree programs
- Users report increased career vocabulary and confidence

---

## Go-To-Market: Beta Launch

### Immediate Actions
1. Finalize one more link (beta version 1)
2. Create outreach spreadsheet (who do we talk to, what do we say)
3. Schedule call with Anthony (Urban Chamber of Commerce)

### Beta Partner: Urban Chamber of Commerce
- **Contact:** Anthony, Executive Director
- **Facility:** 17,000 sq ft in Las Vegas
- **Their Offering:** 10 hours of AI coursework for cohort of 16
- **Our Positioning:** Complementary experience to his curriculum; immersion not instruction
- **Their Interest:** Beta testing, understands the feedback loop

### Content Priority for Beta
Focus on emerging industries (aligns with Urban Chamber priorities):
1. AI / Future of Work
2. Cybersecurity
3. Sound Engineering / Media Production
4. 3D Printing / Robotics
5. Healthcare adjacent

### Outreach Strategy
- **Ronny's Brother's Advice:** "Our current experience should facilitate the next conversations we want to have."
- Lead with AI-relevant nanostem for Urban Chamber
- Podcast appearances to penetrate industry silos
- Community blasts to influencer audiences

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Content creation hell | AI-powered pipeline; don't over-customize |
| Expert dependency | Build first, enhance with experts later; engagement > validation |
| Trust erosion (data sharing) | Simple opt-in/opt-out; no negative framing; transparent disclaimer |
| Mobile UX issues | Prioritize container separation; test on iPhone before launch |
| Choice order bias | Randomize choice display order |

---

## Appendix

### Key Quotes from Product Sessions

**On Broken Systems:**
> "Looking for a job, getting a job, finding a career, being able to move adjacently to different industries—these are all broken systems. They're broken. They don't work. Millions of unemployed Americans who want a job, who can't find work, who have degrees, PhDs. So I'm not so interested in trying to model broken systems. I'm actually here to institute better ways."

**On Building First:**
> "Sometimes people don't know what they want or what they need, especially if you're building something new. No one was like, 'The job I want is an iPhone.' That's the whole point of being a founder. Sometimes you have to build some new shit."

**On the Value Proposition:**
> "The real value that we believe we can get people to pay us for is that now, because of that experience, that next phone call you're going to make is going to be right to the decision maker. Or now, when you create that new thing for your portfolio, you'll know exactly how to position and market it."

**On Trust:**
> "Our greatest capital is trust. Our greatest value is that we are a trusted voice for you to go and explore what the real world looks like without the barrier to entry."

---

*Document generated from product strategy session transcript. For questions, contact the product team.*
