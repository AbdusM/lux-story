# Dialogue, Menu, and Simulation Deep Audit

Scope: dialogue answers/choices (static + dynamic), in‑game menu + journal, and simulation registries/entry points. Admin/profile views excluded.

## Evidence Baseline

Key flow points used for the audit:
- Dialogue choice evaluation + auto‑fallback: `lib/dialogue-graph.ts`
- Pattern unlock choices: `lib/pattern-unlock-choices.ts`
- Dynamic choices: `lib/story-engine.ts`, `lib/choice-generator.ts`, `lib/choice-templates.ts`
- Choice rendering: `components/GameChoices.tsx`, `components/StatefulGameInterface.tsx`
- In‑game menu: `components/UnifiedMenu.tsx`
- Journal / Prism: `components/Journal.tsx`, `components/journal/SimulationGodView.tsx`
- Simulation registries: `content/simulation-registry.ts`, `lib/simulation-registry.ts`

## Dialogue Answers / Choices

### Answer Sources (static + dynamic)
1. **Dialogue Graphs**  
   Each character graph defines nodes with `choices` and optional gating via conditions (trust, flags, patterns, etc.).  
2. **Pattern Unlock Choices**  
   Synthetic choices appear when pattern thresholds are met (per character).  
3. **Dynamic Choice Engine (StoryEngine)**  
   The grand‑central story can replace static choices with contextual templates and optional live augmentation.

### Critical Logic Notes
- **Auto‑fallback safety** shows all choices if none are visible, preventing dead‑ends but masking gating misconfigurations:
```619:671:lib/dialogue-graph.ts
  static evaluateChoices(
    node: DialogueNode,
    gameState: GameState,
    characterId?: string,
    skillLevels?: Record<string, number>
  ): EvaluatedChoice[] {
    ...
    const visibleCount = evaluated.filter(c => c.visible).length
    if (visibleCount === 0 && node.choices.length > 0) {
      console.warn(
        `[AUTO-FALLBACK] No visible choices at node "${node.nodeId}". ` +
        `Showing all ${node.choices.length} choices as fallback to prevent deadlock.`
      )
      return node.choices.map(choice => ({
        choice,
        visible: true,
        enabled: true,
        reason: undefined
      }))
    }
    return evaluated
  }
```
- **Pattern unlock choices** are synthetic and depend on registry alignment and node existence:
```28:83:lib/pattern-unlock-choices.ts
  const unlockedNodeIds = getPatternUnlocks(characterId, patternLevels)
  if (unlockedNodeIds.length === 0) return []
  ...
  if (!graph.nodes.has(nodeId)) {
    console.warn(`[PatternUnlocks] Node "${nodeId}" not found in ${characterId} graph`)
    continue
  }
  const syntheticChoice: ConditionalChoice = {
    choiceId: `pattern_unlock_${nodeId}`,
    text: `✨ ${unlockConfig.description}`,
    nextNodeId: nodeId,
    pattern: unlockConfig.pattern,
    // No consequence - just navigation
  }
```
- **Dynamic choices** can replace static choices and apply semantic filtering:
```80:99:lib/story-engine.ts
    if (gameState && baseScene.choices) {
      try {
        const dynamicChoices = await generateDynamicChoices(baseScene, gameState, {
          performanceLevel: this.getPerformanceLevel(gameState),
          platformContext: this.getPlatformContext(baseScene, gameState),
          characterContext: this.getCharacterContext(baseScene, gameState),
          enableLiveAugmentation: true,
          playerId: 'player-main',
          liveAugmentationChance: 0.33
        })
        if (dynamicChoices.length > 0 && ChoiceGenerator.shouldUseDynamicChoices(baseScene)) {
          baseScene.choices = dynamicChoices
        }
      } catch (error) {
        console.warn('Dynamic choice generation failed, using static choices:', error)
      }
    }
```

### Dialogue Coverage Findings
- All 20 character graphs contain `interrupt` windows (see `docs/03_PROCESS/18-dialogue-menu-simulations-matrix.*`).
- Choice volume is uneven (e.g., `samuel` is significantly larger than several other characters), which impacts QA surface area.
- Conditional refs are high in some graphs, implying heavy gating and increased risk of misconfigured conditions.

### Risks / Gaps (Dialogue)
- **Auto‑fallback can mask misconfigured visibility**: a node with all choices gated incorrectly will still show all choices, making QA signal weaker.
- **Dynamic choices use a hardcoded `playerId`** in `StoryEngine` (`player-main`) which can diverge from actual auth context.
- **Semantic filtering can reduce options** and inadvertently collapse narrative branches when dynamic choices are used (no explicit minimum choice count enforced).

## In‑Game Menu (UnifiedMenu)

### Menu Structure
Menu items are consolidated in `components/UnifiedMenu.tsx` and wired in `components/StatefulGameInterface.tsx`.
- Audio: Volume slider, Mute toggle
- Accessibility: Text size, Color mode, Reduce Motion
- Profile: Career Profile, Clinical Audit (if `playerId`), All Settings (`/profile`)
- Account: User info + Sign Out / Sign In

### Risks / Gaps (Menu)
- **Conditional rendering** for menu items (e.g., `onShowReport`, `playerId`) can cause menu sections to appear partially empty if props are not supplied, with no explicit empty state.
- **Profile routing** sends users to `/profile` from in‑game; audit does not validate state continuity across route changes.

## Journal / Prism

### Tabs
Tabs include harmonics, essence, mastery, careers, combos, opportunities, mind, toolkit, simulations, cognition, analysis, and optional God Mode (dev/educator or `?godmode=true`).

### Risks / Gaps (Journal)
- **God Mode gating is permissive** via URL query, which may be acceptable for dev but should be documented as an intentional override.
- **Badging logic** assumes data presence but no explicit “empty state” path for tabs with zero content.

## Simulations

### Registry Alignment
Two registries are used:
- `content/simulation-registry.ts`: “Pure Form” for God Mode and simulation contexts
- `lib/simulation-registry.ts`: Narrative metadata used by the story engine

### Findings
- **All 20 simulations now share identical IDs across both registries** (unified via `lib/simulation-id-map.ts`).
- No explicit mapping object tying the two registries together; alignment relies on `characterId`.

### Risks / Gaps (Simulations)
- **Drift risk reduced**: IDs are now unified via `lib/simulation-id-map.ts` with runtime validation + drift tests.
- **Entry nodes** are only defined in `lib/simulation-registry.ts`; nothing enforces that `entryNodeId` exists in the character graph.

## Summary of Gaps (Prioritized)
1. **Registry Drift Risk**: Mitigated by unified IDs + canonical map + drift tests (residual risk only if map is bypassed).
2. **Dialogue Gating Visibility**: Auto‑fallback can hide misconfigured gating.
3. **Dynamic Choice Integrity**: Semantic filtering may remove meaningful branches.
4. **Menu Partial Rendering**: Incomplete profile section without empty state.
5. **God Mode Exposure**: Query param in prod likely intentional but should be documented or gated.

