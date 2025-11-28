# Software Development Plan: The Thought Cabinet Integration

## 1. Overview
We will implement "The Thought Cabinet," a slide-over UI panel that visualizes the player's internal state (beliefs, worldview, key insights) evolving from their narrative choices. This feature enhances the "contemplative" nature of the app without cluttering the chat-based interface.

**Core Philosophy:**
- **Non-Intrusive:** It lives in a hidden-by-default slide-over panel.
- **Integrated:** It is part of the `GameState` and persists across sessions.
- **Reactive:** It updates automatically when narrative nodes trigger specific "thought" events.

## 2. Architecture

### A. Data Structure (`content/thoughts.ts` & `lib/game-store.ts`)
We will define a `Thought` as a structured object:
```typescript
interface Thought {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or Lucide icon name
  status: 'developing' | 'internalized' | 'discarded';
  progress: number; // 0-100 for 'developing' thoughts
  color: string; // For UI theming (e.g., 'blue', 'amber')
}
```

**State Management:**
- Update `GameState` in `lib/game-store.ts` to include `thoughts: Thought[]`.
- Add actions: `addThought(id)`, `advanceThought(id, amount)`, `internalizeThought(id)`.

### B. UI Components
1.  **`components/ThoughtCabinet.tsx`:**
    - A custom Slide-Over panel using `framer-motion` (since `shadcn/ui/sheet` is missing).
    - **Header:** "Internal Monologue" or "Thought Cabinet".
    - **Body:** Two sections: "Active Thoughts" (Developing) and "Core Beliefs" (Internalized).
    - **Card Design:** Each thought is a card. Clicking it reveals the full description and "effects" (narrative flavor text).

2.  **Trigger Button:**
    - Integrated into `components/StatefulGameInterface.tsx` (Top Actions area).
    - Icon: A brain or spark icon (`Lucide-React`).
    - Visual feedback: A small "notification dot" when a new thought is added or updated.

### C. Narrative Integration
- We will trigger thoughts via the existing `consequence` logic in `dialogue-graph.ts` (or a new `thoughtEvent` field if we want to be cleaner).
- *MVP Approach:* Use the existing `flags` system or `onEnter` callbacks to trigger `addThought`.

## 3. Implementation Steps

### Phase 1: Foundation (Data & State)
1.  [ ] Create `content/thoughts.ts` with a registry of initial thoughts (e.g., "Industrial Resilience", "Nature's Whisper").
2.  [ ] Update `lib/game-store.ts` to add the `thoughts` array and actions.
3.  [ ] Create a helper hook `useThoughtSystem()` to easily manage thoughts from components.

### Phase 2: The UI (Cabinet & Trigger)
4.  [ ] Create `components/ThoughtCabinet.tsx` (The Slide-Over Panel).
5.  [ ] Implement the `ThoughtCard` sub-component with distinct styles for "Developing" vs "Internalized".
6.  [ ] Add the Trigger Button to `StatefulGameInterface.tsx` with open/close state logic.

### Phase 3: Integration & Polish
7.  [ ] Add a "New Thought" notification animation (subtle glow/dot on the trigger).
8.  [ ] Connect a specific narrative choice in `samuel-dialogue-graph.ts` to trigger a thought (Proof of Concept).
9.  [ ] Verify responsiveness on mobile (full-screen modal) vs desktop (side panel).

## 4. Technical Constraints & Safety
- **Type Safety:** Strict typing for `ThoughtId` to prevent typos in dialogue files.
- **Persistence:** Ensure `thoughts` are saved to `localStorage` via the existing persistence layer.
- **Performance:** The cabinet is a heavy UI element; ensure it uses `AnimatePresence` correctly to mount/unmount smoothly without layout shifts.

## 5. Verification Plan
- **Manual Test:** Click the button -> Panel opens.
- **State Test:** Trigger a thought -> Panel shows "New" badge -> Open panel -> Thought is listed.
- **Persistence Test:** Refresh page -> Thought remains.
