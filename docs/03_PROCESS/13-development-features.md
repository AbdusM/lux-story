# Development Features - Code Focus Review

**Date:** January 6, 2026
**Purpose:** Organized catalog of code development features for prioritization
**Scope:** Features requiring active development (excludes post-production items)

---

## Quick Reference

| Category | Feature Count | Priority Range |
|----------|---------------|----------------|
| Pattern System Derivatives | 12 | P1-P3 |
| Trust System Derivatives | 7 | P1-P3 |
| Dialogue & Narrative | 8 | P2-P3 |
| Assessment & Skills | 7 | P2-P3 |
| UI/UX & Accessibility | 11 | P2-P3 |
| Content Expansion | 6 | P2-P4 |
| Infrastructure | 8 | P3-P4 |
| **Total Development Features** | **~59** | |

---

# TIER 1: HIGH-VALUE DERIVATIVES

These build directly on completed 16/16 systems.

## 1.1 Pattern System Derivatives

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-001 | Pattern-Influenced Trust Decay | Patience = slower decay, Exploring = faster | Medium | E-004, E-013 |
| D-002 | Pattern-Gated Trust Content | Needs BOTH Trust 8+ AND Pattern 6+ | Low | E-004, E-012 |
| D-007 | Choice Pattern Previews | Subtle color glow hints pattern alignment | Low | E-004 |
| D-004 | Cross-Character Pattern Recognition | Characters comment on your pattern development | Medium | E-004, E-015 |
| D-040 | Pattern Evolution Heatmap | Visual showing when/where patterns grew | Medium | E-004 |
| D-096 | Pattern Voice Conflicts | Internal voices disagree, forcing choice | Medium | E-007 |

**Recommended Priority:**
- D-001, D-002, D-007 - Low complexity, high impact
- D-004 - Medium complexity, leverages consequence echoes

---

## 1.2 Trust System Derivatives

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-003 | Trust-Based Pattern Voice Tone | Voices change tone based on character trust | Medium | E-007, E-011 |
| D-005 | Trust Asymmetry Gameplay | Characters react when trust is unbalanced | Medium | E-011 |
| D-010 | Consequence Echo Intensity | High trust = vivid memories, low = vague | Low | E-015, E-011 |
| D-082 | Trust Momentum System | Trust changes faster/slower based on momentum | Medium | E-011 |
| D-093 | Trust Relationship Inheritance | Friends of trusted characters trust you faster | Medium | E-011, relationships |

**Recommended Priority:**
- D-010 - Low complexity, enhances existing consequence echoes
- D-003 - Medium complexity, enhances pattern voices

---

## 1.3 Interrupt System Derivatives

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-009 | Pattern-Filtered Interrupts | Only see interrupts aligned with developed patterns | Medium | E-076, E-005 |
| D-084 | Interrupt Combo Chains | Successful interrupt creates follow-up opportunity | Medium | E-076 |

**Recommended Priority:**
- D-009 - Creates meaningful pattern investment

---

## 1.4 Knowledge Flag Derivatives

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-006 | Knowledge-Influenced Dialogue | Combine multiple knowledge pieces for new branches | Medium | E-026, E-027 |
| D-019 | Iceberg References Discoverable | Hear casual mentions 3x → unlock investigation | Medium | E-072, E-027 |
| D-083 | Knowledge Flag Synthesis | Combining knowledge pieces creates insights | Medium | E-026 |

**Recommended Priority:**
- D-006, D-019 - Deepens existing iceberg architecture

---

# TIER 2: CONTENT EXPANSION

## 2.1 Sector Development

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| E-070 | Sector 2 - Market | Trust economy, information trading | High | E-026, E-027 |
| E-071 | Sector 3 - Deep Station | New Game+, pattern mastery, recursion | High | E-070 |
| D-086 | Sector Completion Requirements | Gate sectors behind completion metrics | Medium | E-067 |

**Note:** E-070 and E-071 are major content additions. Consider scope carefully.

---

## 2.2 Character System Expansion

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-016 | Character-Influenced Environment | Trust with specific chars changes station | High | E-074, E-011 |
| D-017 | Cross-Character Loyalty Prerequisites | Some experiences need trust with multiple chars | Medium | E-057, E-075 |
| D-018 | Sector-Specific Character Appearances | Characters appear in sectors matching roles | Medium | E-067 |

---

## 2.3 Thought Cabinet System

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| E-154 | Thought Cabinet | Disco Elysium-style ideas as "equipment" | High | E-007 |

**Note:** This is a significant psychological mechanic addition.

---

# TIER 3: UI/UX & POLISH

## 3.1 Visual Polish

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-008 | Rich Text State Effects | Text styling changes based on player state | Low | E-023 |
| D-026 | State-Based Animation | Animations adapt to player state | Medium | E-143 |
| D-038 | Milestone Celebrations | Special UI for major milestones | Low | — |
| D-074 | Skill Radar Chart | Your skills vs career requirements overlay | Medium | E-029 |
| D-075 | Session Intensity Heatmap | Visual of when you're most engaged | Medium | I-041 |

---

## 3.2 Accessibility

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-030 | Visual Accessibility Profiles | One-click profiles (dyslexia, low vision) | Medium | E-127 |
| D-077 | Color Blind Pattern Modes | Shapes + text, not just hue | Low | E-004 |
| D-078 | Cognitive Load Adjustment | Reduce choices to 2 for accessibility | Low | E-022 |
| D-080 | Large Text Mode | 2x text without breaking layout | Medium | E-140 |

**Recommended Priority:**
- D-077, D-078 - Low complexity, high accessibility impact

---

## 3.3 Session & Navigation

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-029 | Adaptive Session Length | System learns optimal session length per player | Medium | I-041 |
| D-037 | Session History Replay | Visual replay of your playthrough | Medium | E-092 |

---

# TIER 4: ASSESSMENT & SKILLS

## 4.1 Career & Skills Enhancement

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-011 | Dynamic Career Recommendations | Recs update live as you play | Medium | E-089 |
| D-012 | Skill Transfer Visualization | Show how skills connect across domains | Medium | E-029 |
| D-014 | Skill Gap Identification | System identifies missing skills for desired career | Medium | E-089 |
| D-015 | Pattern-Skill Correlation Analysis | Admin sees which patterns predict which skills | Medium | E-099 |
| D-053 | Skill Application Challenges | Mini-challenges testing specific skills | Medium | E-029 |

---

## 4.2 Assessment Infrastructure

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| I-043 | A/B Testing Framework | Test dialogue variations scientifically | High | I-041 |
| I-045 | Research Data Export | Structured data for researchers | Medium | I-044 |
| D-049 | A/B Testing for Dialogue | Test which formulations best reveal patterns | Medium | I-043 |
| D-050 | Bias Detection in Assessment | Identify if demographics over-index on patterns | High | I-002 |

---

# TIER 5: NARRATIVE DEPTH

## 5.1 Dialogue Enhancement

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-062 | Consequence Cascade Chains | Choices cause 3+ degree cascades | High | E-015, E-075 |
| D-064 | Narrative Framing by Pattern | Station appears different to different patterns | High | E-004, E-065 |
| D-061 | Player-Generated Story Arcs | Unique arcs emerge from choice combinations | High | E-016 |

**Note:** These are high-complexity narrative features.

---

## 5.2 Replay Value

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-036 | New Game+ Pattern Inversions | Replay with opposite dominant pattern | High | E-071, E-004 |
| D-073 | Choice Divergence Tree | See paths you didn't take | High | E-016 |

---

# TIER 6: ADMIN & ANALYTICS

## 6.1 Admin Dashboard Enhancement

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-021 | Cohort Pattern Drift Detection | Alert when cohort shows unusual clustering | Medium | E-097 |
| D-023 | Family View Child Language | Student-readable version of their report | Low | E-099 |
| D-098 | Admin Intervention Alerts | Alert educators for concerning patterns | Medium | E-098 |

---

## 6.2 Visualization

| ID | Feature | Description | Complexity | Dependencies |
|----|---------|-------------|------------|--------------|
| D-039 | Trust Relationship Timeline | Graph showing trust evolution over time | Medium | E-011 |
| D-072 | Trust Network as Social Graph | Network visualization of character relationships | Medium | E-116 |

---

# PRIORITY MATRIX

## Recommended First (Low Complexity, High Value)

| ID | Feature | Why |
|----|---------|-----|
| D-002 | Pattern-Gated Trust Content | Low complexity, combines two complete systems |
| D-007 | Choice Pattern Previews | Low complexity, immediate player feedback |
| D-010 | Consequence Echo Intensity | Low complexity, enhances 16/16 echo system |
| D-077 | Color Blind Pattern Modes | Low complexity, accessibility win |
| D-078 | Cognitive Load Adjustment | Low complexity, accessibility win |
| D-008 | Rich Text State Effects | Low complexity, visual polish |
| D-038 | Milestone Celebrations | Low complexity, engagement boost |

## Recommended Second (Medium Complexity, High Value)

| ID | Feature | Why |
|----|---------|-----|
| D-001 | Pattern-Influenced Trust Decay | Creates meaningful pattern investment |
| D-004 | Cross-Character Pattern Recognition | Leverages consequence echoes |
| D-009 | Pattern-Filtered Interrupts | Creates meaningful pattern investment |
| D-006 | Knowledge-Influenced Dialogue | Deepens knowledge flag system |
| D-030 | Visual Accessibility Profiles | Accessibility win |

## Consider Carefully (High Complexity)

| ID | Feature | Why |
|----|---------|-----|
| E-070 | Sector 2 - Market | Major content addition |
| E-071 | Sector 3 - Deep Station | Major content addition |
| E-154 | Thought Cabinet | Significant new system |
| D-062 | Consequence Cascades | High narrative complexity |
| D-064 | Narrative Framing by Pattern | High complexity |

---

# EXCLUDED FROM THIS DOCUMENT

The following are in `90-post-development.md`:
- Pilots, User Testing, Customer Onboarding
- Monetization (E-162, B2B Licensing)
- White-Label Deployment (E-159)
- Third-Party Integration API (E-157)
- Enterprise Scale (E-158, Phase 4)
- Content Creation Toolkit (E-160)
- Social/Multiplayer Features (D-041 to D-045)
- Real-World Integrations (LinkedIn, Apprenticeship APIs)
- Wild/Moonshot Features (W-001 to W-030)

---

**Generated:** January 6, 2026
**Status:** Ready for prioritization review
