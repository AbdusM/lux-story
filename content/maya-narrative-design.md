# Maya Chen - Narrative Arc Design

## Character Profile
- **Name**: Maya Chen
- **Age**: 19
- **Background**: Pre-med student at UAB, first-generation American
- **Internal Conflict**: Parents' medical dreams vs. personal passion for robotics
- **Location**: Platform 1 (The Care Line) at Grand Central Terminus

## Branching Narrative Structure

```
START: maya_introduction
├── Trust < 2: Surface conversation
│   ├── Ask about studies → maya_studies_surface
│   └── Ask about Birmingham → maya_birmingham_generic
│
└── Trust ≥ 2: Deeper conversation
    ├── Notice her anxiety → maya_anxiety_reveal
    │   ├── Encourage vulnerability → maya_robotics_passion (Trust +1)
    │   └── Suggest practical path → maya_medical_robotics
    │
    └── Ask about family → maya_family_pressure
        ├── Challenge expectations → maya_rebellion_path (Trust +2)
        └── Understand sacrifice → maya_understanding_path (Trust +1)

CLIMAX: maya_crossroads (Trust ≥ 5)
├── Help her choose robotics → maya_robotics_ending
├── Suggest compromise → maya_hybrid_ending
└── Support any choice → maya_empowered_ending
```

## Key Dialogue Nodes

### 1. Introduction (maya_introduction)
**Required**: None
**Sets**: First meeting flag
**Variations**:
- First meeting: Nervous, studying intensely
- Return visit: Remembers you, slightly more open

### 2. Studies Surface (maya_studies_surface)
**Required**: Trust < 2
**Content**: Generic pre-med discussion, UAB programs

### 3. Anxiety Reveal (maya_anxiety_reveal)
**Required**: Trust ≥ 2, lacks "knows_anxiety"
**Sets**: "knows_anxiety" flag
**Content**: Opens up about pressure, mentions "other interests"

### 4. Robotics Passion (maya_robotics_passion)
**Required**: Trust ≥ 3, has "knows_anxiety"
**Sets**: "knows_robotics" flag
**Critical**: Major trust gate - she reveals her true passion
**Choices**:
- "Follow your dreams" → +1 trust, "encouraged_robotics"
- "Medical robotics exists" → "suggested_hybrid"
- "Your parents love you" → "validated_family"

### 5. Family Pressure (maya_family_pressure)
**Required**: Trust ≥ 2
**Sets**: "knows_family" flag
**Content**: Immigration story, sacrifices, expectations

### 6. The Crossroads (maya_crossroads)
**Required**: Trust ≥ 5, has "knows_robotics", has "knows_family"
**Content**: She's considering changing majors
**This is the climax** - your accumulated relationship determines outcome

### 7. Endings

**Robotics Ending** (maya_robotics_ending)
- She switches to robotics engineering
- Mentions Birmingham's Innovation Depot
- Thanks you for believing in her

**Hybrid Ending** (maya_hybrid_ending)
- Pursues biomedical engineering with robotics focus
- UAB's joint program perfect fit
- Balances family and passion

**Empowered Ending** (maya_empowered_ending)
- Makes her own choice with confidence
- Your support gave her strength
- Most authentic ending

## Birmingham Integration
- UAB specific programs and buildings
- Innovation Depot for robotics startups
- Birmingham's growing tech scene
- Southern Company internships
- Local medical device companies

## State Changes Per Node

| Node | Trust Change | Flags Added | Relationship |
|------|--------------|-------------|--------------|
| maya_introduction | 0 | met_maya | stranger |
| maya_anxiety_reveal | +1 | knows_anxiety | acquaintance |
| maya_robotics_passion | +1 | knows_robotics | acquaintance→confidant |
| maya_family_pressure | +1 | knows_family | acquaintance |
| maya_rebellion_path | +2 | supported_rebellion | confidant |
| maya_crossroads | 0 | at_crossroads | confidant |
| Any ending | +1 | completed_maya_arc | confidant |

## Pattern Tracking
- **Analytical**: Medical robotics suggestions, practical solutions
- **Helping**: Emotional support, encouragement
- **Building**: Focus on her robotics projects
- **Patience**: Letting her reveal at her pace
- **Exploring**: Asking about Birmingham opportunities

## Content Generation Notes
For each node, we need 3-5 variations:
1. Base version (neutral tone)
2. Anxious version (when stressed)
3. Confident version (high trust)
4. Emotional version (vulnerable moments)
5. Determined version (decision points)

Total nodes needed: ~15-20 for complete arc
Estimated playtime: 10-15 minutes
Replayability: High (3 distinct paths, multiple variations)