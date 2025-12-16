# Claude Web Review Prompt

Copy everything below the line and paste into Claude web, then upload all 8 documents from this folder.

---

## Context

I'm building **Grand Central Terminus** — a dialogue-driven career exploration game where a mysterious train station appears between who you were and who you're becoming. Players explore through choices that reveal behavioral patterns (analytical, patience, exploring, helping, building).

**Tech Stack:** Next.js 15, TypeScript, Framer Motion, Tailwind, Vercel

**Target:** Birmingham youth (14-24), mobile-first

## Documents for Review

I'm uploading 8 strategic documents. Please review each critically:

1. `00_PHILOSOPHY_FOUNDATION.md` - Core principles that filter all decisions
2. `01_SYSTEMS_INVENTORY.md` - Audit of what exists in codebase
3. `02_COMPREHENSIVE_ROADMAP.md` - All improvements by priority
4. `03_PRD_VALIDATION.md` - Documentation vs. reality check
5. `04_ISP_DORMANT_CAPABILITIES.md` - What's built but not activated
6. `05_ISP_COMBINATORIAL_SYNTHESES.md` - A + B = C new mechanics
7. `06_ISP_10X_FUTURES.md` - Moonshot scenarios
8. `07_ISP_MASTER_SYNTHESIS.md` - Unified roadmap

## What I Need

For EACH document, provide:

### 1. Internal Inconsistencies
- Contradictions within the document
- Claims that conflict with each other
- Logic gaps

### 2. Cross-Document Conflicts
- Where this doc contradicts another doc
- Duplicate information that differs
- Terminology mismatches

### 3. Missing Considerations
- What's not addressed that should be
- Edge cases not covered
- Assumptions that need validation

### 4. Refinement Suggestions
- Areas that are vague and need specificity
- Sections that could be consolidated
- Information that should be moved elsewhere

### 5. Red Flags
- Overengineering risks
- Scope creep indicators
- "Developer's Delight" features (excites devs, confuses users)
- Conflicts with mobile-first/feel-first philosophy

### 6. Priority Assessment
- Is this document necessary for launch?
- What can be deferred to post-launch?
- What's blocking engineering work?

## Output Format

For each document:

```
## [Document Name]

**Overall Assessment:** [1-2 sentences]

**Internal Inconsistencies:**
- [Issue] → [Suggested fix]

**Cross-Document Conflicts:**
- [Conflict with Doc X] → [Resolution]

**Missing Considerations:**
- [Gap] → [Why it matters]

**Refinement Suggestions:**
- [Area] → [Specific improvement]

**Red Flags:**
- [Risk] → [Mitigation]

**Priority:** [Critical/Important/Nice-to-have for launch]

**Blocking Engineering?** [Yes/No] - [What's needed]
```

## Final Deliverable

After reviewing all 8 documents, provide:

1. **Consolidated Action List** - All fixes ranked by priority
2. **Document Dependency Map** - Which docs depend on which
3. **Engineering Readiness Score** - 1-10, what's blocking starting dev work
4. **Recommended Next Steps** - 3-5 specific actions to finalize docs

## Constraints

- Be direct and critical, not diplomatic
- Flag anything that feels like scope creep
- Prioritize mobile-first, feel-first principles
- Remember: this is for Birmingham youth, not enterprise software
- The goal is a polished indie game experience, not a platform (yet)
