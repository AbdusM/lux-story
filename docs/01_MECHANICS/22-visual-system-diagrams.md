# Visual System Diagrams
**Source:** `STAKEHOLDER_OVERVIEW.md` & `CHARACTER_STYLES_REFERENCE.md`

## 1. Grand Central Terminus: System Architecture
*Visualizing the Technical Stack described in Stakeholder Overview*

```mermaid
graph TD
    subgraph "Frontend (Next.js 15)"
        UI[User Interface]
        DialogueComp[Dialogue System]
        JournalComp[Journal & Stats]
        ConstellationComp[Constellation Graph]
        
        UI --> DialogueComp
        UI --> JournalComp
        UI --> ConstellationComp
        
        StateStore[Zustand State Store]
        DialogueComp <--> StateStore
        JournalComp <--> StateStore
        ConstellationComp <--> StateStore
    end

    subgraph "Game Logic Layer (TypeScript)"
        PatternEng[Pattern Engine]
        TrustSys[Trust & Progression]
        DialogueNav[Dialogue Navigator]
        Achievements[Achievement System]
        
        StateStore <--> PatternEng
        StateStore <--> TrustSys
        StateStore <--> DialogueNav
        StateStore <--> Achievements
    end

    subgraph "Data Content"
        Nodes[1,431 Dialogue Nodes]
        Chars[20 Character Definitions]
        Patterns[5 Behavioral Patterns]
        
        DialogueNav --> Nodes
        TrustSys --> Chars
        PatternEng --> Patterns
    end

    style Frontend fill:#e1f5fe,stroke:#01579b
    style "Game Logic Layer (TypeScript)" fill:#fff9c4,stroke:#fbc02d
    style "Data Content" fill:#e8f5e9,stroke:#2e7d32
```

---

## 2. The Living Station: Character Relationship Web
*Mapping the interconnected relationships from Character Styles Reference*

```mermaid
graph TD
    %% Hub
    Samuel(Samuel <br/> The Owl <br/> *Station Keeper*) 
    style Samuel fill:#eceff1,stroke:#37474f,stroke-width:4px

    %% Core Layer
    Maya(Maya <br/> The Cat <br/> *Tech*)
    Marcus(Marcus <br/> The Bear <br/> *Health*)
    Devon(Devon <br/> The Deer <br/> *Systems*)

    Samuel --- Maya
    Samuel --- Marcus
    Samuel --- Devon
    
    Maya <-->|Tension: Innovation vs Care| Marcus
    Marcus <-->|Shared Burden| Devon

    %% Secondary Layer
    Kai(Kai <br/> *Safety*)
    Rohan(Rohan <br/> The Raven <br/> *Deep Tech*)
    Tess(Tess <br/> The Fox <br/> *Education*)

    Maya --- Kai
    Marcus --- Rohan
    Devon --- Tess

    Kai --- Rohan
    Rohan --- Tess

    %% Extended Layer
    Quinn(Quinn <br/> Hedgehog <br/> *Finance*)
    Nadia(Nadia <br/> Barn Owl <br/> *AI Strategy*)

    Kai --- Quinn
    Tess --- Nadia
    Quinn <-->|Ethics vs Profit| Nadia

    %% Outer Layer
    Dante(Dante <br/> Peacock <br/> *Sales*)
    Isaiah(Isaiah <br/> Elephant <br/> *Nonprofit*)
    Asha(Asha <br/> *Mediator*)

    Quinn --- Dante
    Dante <-->|Commercial vs Mission| Isaiah
    Isaiah --- Asha
    Nadia --- Asha

    classDef tech fill:#e3f2fd,stroke:#1565c0;
    classDef health fill:#e8f5e9,stroke:#2e7d32;
    classDef finance fill:#fff3e0,stroke:#e65100;
    
    class Maya,Rohan,Devon,Nadia tech;
    class Marcus,Grace,Asha health;
    class Quinn,Dante finance;
```

---

## 3. The Core Engagement Loop
*Visualizing the "Game Design Principles" section*

```mermaid
stateDiagram-v2
    [*] --> Dialogue
    
    state "Narrative Engagement" as Narrative {
        Dialogue --> ChoicePoints : Player reads text
        ChoicePoints --> MeaningfulAction : Player selects response
    }

    state "System Processing" as System {
        MeaningfulAction --> PatternEngine : Analysis
        PatternEngine --> IdentityProfile : Update 5 Patterns
        MeaningfulAction --> TrustSystem : Analysis
        TrustSystem --> RelationshipState : Update Trust (0-10)
    }

    state "Feedback & Discovery" as Feedback {
        IdentityProfile --> EmergentVoice : Inner Monologue Changes
        RelationshipState --> VulnerabilityArc : Unlock Depth (Trust >6)
        RelationshipState --> LoyaltyExperience : Unlock Event (Trust >8)
    }

    EmergentVoice --> Dialogue : Adapts Tone
    VulnerabilityArc --> Dialogue : New Content
    LoyaltyExperience --> Dialogue : Unique Scene
```

---

## 4. Behavioral Pattern Map
*Visualizing the 5 Core Patterns and their Career Allignments*

```mermaid
mindmap
  root((Identity))
    Analytical
      ::icon(fa fa-glasses)
      Logic-Driven
      Data Science
      Engineering
      Research
    Patience
      ::icon(fa fa-clock)
      Long-term Thinking
      Mentorship
      Healthcare (Care)
      Education
    Exploring
      ::icon(fa fa-compass)
      Curiosity
      Innovation
      Arts
      Entrepreneurship
    Helping
      ::icon(fa fa-hand-holding-heart)
      Empathy
      Social Work
      HR
      Nursing
    Building
      ::icon(fa fa-hammer)
      Creation
      Manufacturing
      Design
      Systems Arch
```
