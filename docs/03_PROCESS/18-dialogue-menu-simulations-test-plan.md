# Test Plan — Dialogue, Menu, Simulations

Goal: cover missing mechanics and fragile flows discovered in the audit without broad regression expansion.

## P0 (Critical)
1. **Simulation registry alignment guard**  
   - Type: Unit (fast)  
   - Validate that every `characterId` appears in both registries and that `entryNodeId` exists in the character graph.  
   - Sources: `content/simulation-registry.ts`, `lib/simulation-registry.ts`, `lib/graph-registry.ts`, `content/*-dialogue-graph.ts`

2. **Dialogue gating dead‑end prevention**  
   - Type: Unit  
   - Ensure no node has `choices` where all `visibleCondition` evaluate false at default state unless intentionally flagged.  
   - Sources: `lib/dialogue-graph.ts`, `content/*-dialogue-graph.ts`

3. **Pattern unlock integrity**  
   - Type: Unit  
   - Verify that every `patternUnlocks` entry points to an existing node and unlock text is non‑empty.  
   - Sources: `lib/pattern-affinity.ts`, `lib/pattern-unlock-choices.ts`, `content/*-dialogue-graph.ts`

## P1 (High)
4. **Dynamic choice replacement safety**  
   - Type: Unit  
   - Assert dynamic choices keep `nextScene` mapping when used and do not reduce available options below 2 without explicit reason.  
   - Sources: `lib/story-engine.ts`, `lib/choice-generator.ts`, `lib/choice-templates.ts`

5. **UnifiedMenu actions**  
   - Type: E2E  
   - Validate volume slider, mute toggle, and `Reduce Motion` toggles persist (localStorage + settings sync).  
   - Sources: `components/UnifiedMenu.tsx`, `components/StatefulGameInterface.tsx`

6. **Journal tab navigation**  
   - Type: E2E  
   - Open Prism, cycle base tabs, confirm empty‑state rendering for tabs with zero data.  
   - Sources: `components/Journal.tsx` and per‑tab components

## P2 (Medium)
7. **God Mode gating**  
   - Type: Unit + E2E  
   - Ensure `god_mode` tab appears only in dev/educator or `?godmode=true`.  
   - Sources: `components/Journal.tsx`

8. **Simulation entry/exit behavior**  
   - Type: E2E  
   - Use God Mode to mount simulation and confirm exit returns to dialogue without state corruption.  
   - Sources: `components/journal/SimulationGodView.tsx`, `components/StatefulGameInterface.tsx`

## P3 (Nice‑to‑have)
9. **Menu partial rendering**  
   - Type: Unit  
   - Validate that missing props (e.g., `onShowReport`, `playerId`) do not leave empty sections without headings.  
   - Sources: `components/UnifiedMenu.tsx`

