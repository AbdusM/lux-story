# Career Paths & Birmingham Opportunities - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/lib/career-analytics.ts`, `/content/birmingham-opportunities.ts`
**Status:** Auto-generated

## Overview

The career analytics system maps player behavioral patterns to real-world Birmingham career paths and opportunities. This document catalogs all career affinities, Birmingham organizations, and the pattern-to-career mapping logic.

**Key Stats:**
- Career paths: 8 sectors
- Birmingham opportunities: 32+ organizations
- Pattern mappings: 11 behavioral patterns → career affinities
- Career insights: Evidence-based recommendations with confidence scores

---

## Career Path Affinities

### The 8 Sectors

| Career Path | Focus | Primary Patterns |
|-------------|-------|------------------|
| **Healthcare** | Medical, nursing, patient care | helping, caring, supporting |
| **Engineering** | Infrastructure, manufacturing, systems | building, analyzing, designing |
| **Technology** | Software, fintech, health tech | analyzing, researching, investigating |
| **Education** | Teaching, curriculum design, training | helping, organizing, supporting |
| **Sustainability** | Environmental, renewable energy, urban planning | environmental, growing |
| **Entrepreneurship** | Startups, business development, innovation | leading, organizing, creating |
| **Creative** | Arts, design, media, marketing | expressing, storytelling, designing |
| **Service** | Nonprofit, community development, social work | helping, supporting, leading |

---

## Birmingham Opportunities by Sector

### Healthcare

| Organization | Focus Area | Type |
|--------------|------------|------|
| UAB Medical Center | Nursing & Medical Programs | Major academic medical center |
| Children's of Alabama | Pediatric Specialties | Only children's hospital in Alabama |
| Birmingham VA Medical Center | Veterans Healthcare | Federal medical facility |
| Brookwood Baptist Health | Community Healthcare | Regional health system |

**Additional Opportunities:**
- St. Vincent's Hospital
- UAB Hospital (23,000 employees)
- Pediatric specialty training programs

---

### Engineering

| Organization | Focus Area | Type |
|--------------|------------|------|
| Southern Company | Energy Infrastructure | Utilities/Energy |
| BBVA Field Engineering Programs | Civil Engineering | Infrastructure |
| Nucor Steel | Manufacturing Engineering | Steel production (400+ local employees) |
| Alabama Power | Electrical Engineering | Energy distribution |

**Additional Opportunities:**
- Brasfield & Gorrie (Construction Engineering)
- Mercedes-Benz (Automotive Engineering, Tuscaloosa plant)
- Advanced manufacturing facilities

---

### Technology

| Organization | Focus Area | Type |
|--------------|------------|------|
| Regions Bank | Fintech Development | Financial technology |
| BBVA Innovation Center | Banking Technology | Tech innovation lab |
| UAB Informatics | Health Tech | Medical informatics |
| Velocity Accelerator | Tech Startups | Startup accelerator |

**Additional Opportunities:**
- Innovation Depot (100+ startups, $100M+ capital raised)
- Covalence (Coding bootcamp)
- Tech startup ecosystem

---

### Education

| Organization | Focus Area | Type |
|--------------|------------|------|
| Birmingham City Schools | Teaching | Public K-12 education |
| UAB Education Programs | Higher education, teacher training | University programs |
| Jefferson County Schools | Teaching, administration | County school system |
| Community Education Partners | Alternative education, vocational training | Community programs |

**Additional Opportunities:**
- Lawson State Community College (Vocational/technical training)
- Private schools
- Educational technology companies

---

### Sustainability

| Organization | Focus Area | Type |
|--------------|------------|------|
| Alabama Power Renewable Energy | Clean energy initiatives | Energy sector |
| Environmental Services - City of Birmingham | Municipal sustainability | Government |
| Green Infrastructure Projects | Urban planning, green spaces | Public works |
| Urban Agriculture Initiatives | Local food systems, community gardens | Community-led |

**Additional Opportunities:**
- Railroad Park (21-acre green space)
- Urban forestry programs
- Sustainable construction initiatives

---

### Entrepreneurship

| Organization | Focus Area | Type |
|--------------|------------|------|
| Innovation Depot | Startup Incubator | Tech/business incubation |
| Velocity Accelerator | Business Development | Startup accelerator |
| REV Birmingham | Economic Development | Urban redevelopment |
| Alabama Launchpad | Venture Capital | Seed funding competition |

**Additional Opportunities:**
- Woodlawn (Emerging maker/arts district)
- Small business resources
- Entrepreneurship education programs

---

### Creative

| Organization | Focus Area | Type |
|--------------|------------|------|
| Birmingham Arts District | Visual arts, galleries | Cultural district |
| UAB Arts Programs | Fine arts, performing arts | University programs |
| Local Media & Marketing Agencies | Advertising, digital media | Private sector |
| Birmingham Design Week | Design community, events | Annual event/community |

**Additional Opportunities:**
- Sidewalk Film Festival
- Local music venues
- Creative agencies

---

### Service

| Organization | Focus Area | Type |
|--------------|------------|------|
| United Way of Central Alabama | Community programs, nonprofits | Umbrella organization |
| Birmingham Civil Rights Institute | Education, social justice | Museum/education |
| Community Foundation Greater Birmingham | Philanthropy, grantmaking | Foundation |
| Local Non-Profit Organizations | Varied social services | Community organizations |

**Additional Opportunities:**
- Homeless services organizations
- Youth development programs
- Faith-based community services

---

## Pattern-to-Career Mapping Logic

### Mapping Weights

Each behavioral pattern contributes to multiple career affinities with weighted distribution:

| Pattern | Career Affinities (weights) |
|---------|----------------------------|
| **helping** | healthcare (0.4), education (0.3), service (0.3) |
| **caring** | healthcare (0.5), education (0.3), service (0.2) |
| **supporting** | healthcare (0.3), education (0.4), service (0.3) |
| **building** | engineering (0.6), technology (0.4) |
| **creating** | engineering (0.4), technology (0.3), creative (0.3) |
| **designing** | engineering (0.3), technology (0.3), creative (0.4) |
| **analyzing** | technology (0.5), engineering (0.3), healthcare (0.2) |
| **researching** | technology (0.4), healthcare (0.3), education (0.3) |
| **investigating** | technology (0.4), engineering (0.3), service (0.3) |
| **environmental** | sustainability (0.6), engineering (0.4) |
| **growing** | sustainability (0.5), healthcare (0.3), education (0.2) |
| **leading** | entrepreneurship (0.4), education (0.3), service (0.3) |
| **organizing** | entrepreneurship (0.3), education (0.4), technology (0.3) |
| **expressing** | creative (0.6), technology (0.2), education (0.2) |
| **storytelling** | creative (0.5), education (0.3), technology (0.2) |

**Total Patterns:** 15 behavioral patterns mapped to career affinities

---

## Career Insights System

### Insight Structure

```typescript
interface CareerInsight {
  careerPath: keyof CareerPathAffinities
  confidence: number // 0-95%
  evidencePoints: string[]
  birminghamOpportunities: string[]
  nextSteps: string[]
  personalizedOpportunities?: Array<{
    name: string
    organization: string
    type: string
    matchScore: number
    matchReasons: string[]
  }>
}
```

### Evidence Points by Career

**Healthcare:**
- "Shows strong helping orientation"
- "Demonstrates empathy and care"
- "Natural inclination to support others"

**Engineering:**
- "Enjoys creating and constructing"
- "Systematic problem-solving approach"
- "Methodical thinking style"

**Technology:**
- "Data-driven decision making"
- "Strong research capabilities"
- "Logical problem-solving"

**Education:**
- "Supportive communication style"
- "Natural teaching abilities"
- "Collaborative mindset"

---

## Next Steps by Career Path

### Healthcare
1. Shadow a healthcare professional at UAB
2. Volunteer at local hospitals
3. Explore Birmingham opportunities in this field
4. Connect with local professionals

### Engineering
1. Join engineering clubs
2. Attend Alabama Power career events
3. Explore Birmingham opportunities in this field
4. Research education requirements

### Technology
1. Learn programming basics
2. Visit Innovation Depot
3. Explore Birmingham opportunities in this field
4. Consider internship opportunities

### Education
1. Volunteer as a tutor
2. Explore UAB Education programs
3. Explore Birmingham opportunities in this field
4. Connect with local professionals

### Sustainability
1. Join environmental clubs
2. Research green career paths
3. Explore Birmingham opportunities in this field
4. Research education requirements

### Entrepreneurship
1. Attend startup events
2. Develop business ideas
3. Explore Birmingham opportunities in this field
4. Consider internship opportunities

### Creative
1. Build a portfolio
2. Explore local arts opportunities
3. Explore Birmingham opportunities in this field
4. Connect with local professionals

### Service
1. Volunteer with nonprofits
2. Research social work programs
3. Explore Birmingham opportunities in this field
4. Consider internship opportunities

---

## Usage Examples

### Analyzing Career Affinities

```typescript
import { getCareerAnalytics } from '@/lib/career-analytics'

const analytics = getCareerAnalytics()
const affinities = analytics.analyzeCareerAffinities(playerId)

// Returns normalized affinities (sum = 1.0):
// {
//   healthcare: 0.35,
//   engineering: 0.12,
//   technology: 0.28,
//   education: 0.15,
//   sustainability: 0.02,
//   entrepreneurship: 0.04,
//   creative: 0.02,
//   service: 0.02
// }
```

### Generating Career Insights

```typescript
import { getCurrentCareerInsights } from '@/lib/career-analytics'

const insights = await getCurrentCareerInsights(playerId)

// Returns top 3 career matches:
// [
//   {
//     careerPath: 'healthcare',
//     confidence: 85,
//     evidencePoints: ['Shows strong helping orientation', 'Demonstrates empathy...'],
//     birminghamOpportunities: ['UAB Medical Center', 'Children\'s of Alabama', ...],
//     nextSteps: ['Shadow a healthcare professional at UAB', ...],
//     personalizedOpportunities: [...]
//   },
//   ...
// ]
```

### Creating Analytics Snapshot

```typescript
import { getCareerAnalytics } from '@/lib/career-analytics'

const analytics = getCareerAnalytics()
const snapshot = analytics.createSnapshot(playerId, sessionId)

// Returns full analytics snapshot including:
// - totalChoices, patternDistribution
// - careerAffinities
// - averageResponseTime, sessionDuration
// - platformsExplored
// - primaryAffinity, secondaryAffinity
// - insights array
```

---

## Pattern → Career Flow

### Step 1: Player Makes Choices
```
Choice: "Ask about their research methodology"
Pattern: analyzing
```

### Step 2: Pattern Mapping Applied
```
analyzing → technology (0.5), engineering (0.3), healthcare (0.2)
```

### Step 3: Affinities Accumulated
```
After 20 choices with mixed patterns:
healthcare: 0.35
technology: 0.28
education: 0.15
...
```

### Step 4: Insights Generated
```
Top match: Healthcare (85% confidence)
Evidence: "Shows strong helping orientation", "Demonstrates empathy"
Opportunities: UAB Medical Center, Children's of Alabama
Next steps: Shadow healthcare professional, volunteer at hospitals
```

---

## Cross-References

- **Patterns:** See `03-patterns.md` for the 5 core patterns (analytical, patience, etc.)
- **Skills:** See `02-skills.md` for WEF 2030 skills that map to careers
- **UI Metadata:** See `10-ui-metadata.md` for Birmingham location context
- **Analytics:** See `12-analytics.md` for full event tracking system

---

## Design Notes

### Birmingham-First Design

**Philosophy:** Every career path must have concrete local opportunities.

**Benefits:**
- Players see immediate actionability ("I can visit Innovation Depot tomorrow")
- Reduces "career fantasy" disconnected from reality
- Grounds abstract career concepts in familiar geography
- Enables family/educator conversations with local references

**Localization Strategy:**
- Current: Birmingham, AL (20+ organizations documented)
- Template structure supports other cities
- Opportunity data could be dynamically loaded via ZIP code
- Future: Memphis, Nashville, Atlanta, etc.

### Evidence-Based Insights

**No Career Quizzes:**
- Traditional assessments: "What's your favorite color?" → "You should be an engineer"
- Lux Story approach: Track 20 actual behavioral choices → Identify patterns → Map to careers

**Transparent Logic:**
- Every insight shows evidence points ("Shows strong helping orientation")
- Confidence scores capped at 95% (never claim certainty)
- Multiple career paths shown (acknowledge complexity)

### Pattern Weight Design

**Why Weighted Distribution?**
- "helping" doesn't exclusively mean healthcare (also education, service)
- "analyzing" relevant to technology, engineering, AND healthcare (medical research)
- Real careers require multiple competencies

**Normalization:**
- All affinities sum to 1.0 (relative strengths matter, not absolute values)
- Minimum threshold (0.1) filters noise
- Top 3 affinities shown (focus over comprehensiveness)

### Future Considerations

**Dynamic Opportunities:**
- Integration with real job boards (Indeed, LinkedIn)
- Partnership with Birmingham orgs for live opportunities
- Student-specific programs (internships, summer programs)

**Expanded Sectors:**
- Currently 8 sectors
- Could add: Finance, Legal, Government, Military, Trades, Hospitality
- Trade-off: Specificity vs. overwhelming choice

**Personalization Depth:**
- Age-specific opportunities (16-18 vs. 18-24 vs. adult career change)
- Education level filtering (high school vs. college vs. no degree)
- Disability accommodations
- Transportation considerations (BJCTA accessibility)

---

**Generated on:** January 13, 2026
**Verification:** Run `npm run verify-data-dict` to check for drift from source
