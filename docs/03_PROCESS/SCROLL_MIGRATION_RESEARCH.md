# Scroll Architecture Migration Research

**Date:** January 22, 2026
**Status:** Manual research complete
**Purpose:** Document current scroll model before AI-assisted refactor

---

## Current DOM Structure (The Problem)

```
<LivingAtmosphere>
  <div className="flex flex-col min-h-[100dvh]">

    <header className="flex-shrink-0 glass-panel"> <!-- STICKY HEADER -->

    <main className="flex-1 overflow-y-auto"> <!-- SCROLL SURFACE #1 -->
      <div className="max-w-4xl mx-auto px-3">
        <Card className="glass-panel">
          <CardContent className="h-[45vh] overflow-y-auto"> <!-- NESTED SCROLL #1 -->
            <Card> <!-- Inner dialogue card -->
              <CardContent>
                <DialogueDisplay />
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card> <!-- Interrupt panel, conditional -->
        </Card>
      </div>
    </main>

    <footer className="flex-shrink-0 glass-panel"> <!-- NOT STICKY -->
      <div id="choices-scroll-container"
           className="max-h-[220px] overflow-y-auto"> <!-- NESTED SCROLL #2 -->
        <GameChoices />
      </div>
    </footer>

  </div>
</LivingAtmosphere>
```

---

## Overflow Properties Found

| Line | Element | Class | Issue |
|------|---------|-------|-------|
| 3449 | `<main>` | `overflow-y-auto` | ✅ This should be the ONLY scroll |
| 3480 | `<CardContent>` | `h-[45vh] overflow-y-auto` | ❌ NESTED SCROLL - dialogue |
| 3737 | `#choices-scroll-container` | `max-h-[220px] overflow-y-auto` | ❌ NESTED SCROLL - choices |

---

## Why Current Architecture Exists

1. **Fixed height dialogue card (h-[45vh]):** Allows choices to always be visible below
2. **Scrollable choices (max-h-[220px]):** Prevents many choices from pushing content off screen
3. **Glass panel aesthetic:** Bordered containers create the "cyber-noir" feel

**The trade-off was:** Visual containment over scroll fluidity.

---

## What Breaks If We Remove Nested Scroll

### Removing `h-[45vh] overflow-y-auto` from CardContent:
- Dialogue content will expand to natural height
- Long dialogues will push footer off-screen
- User will need to scroll main to see choices
- ✅ This is actually CORRECT behavior (like ChatGPT)

### Removing `max-h-[220px] overflow-y-auto` from choices:
- Many choices will expand vertically
- Could push dialogue out of view
- Need bottom sheet for >3 choices to prevent this

---

## Target Architecture

```
<LivingAtmosphere>
  <div className="flex flex-col h-[100dvh]">

    <header className="flex-shrink-0 sticky top-0 z-10">

    <main className="flex-1 overflow-y-auto" id="transcript">
      <!-- Messages stack vertically, no fixed height -->
      <MessageCard type="npc" speaker="Samuel" />
      <MessageCard type="npc" speaker="Samuel" />
      <MessageCard type="user" text="Player choice" />
      <MessageCard type="npc" speaker="Samuel" />
      <TypingIndicator />
    </main>

    <footer className="flex-shrink-0 sticky bottom-0 z-10">
      <!-- ≤3 choices inline, >3 triggers bottom sheet -->
      <QuickReplies choices={choices.slice(0,3)} />
      {choices.length > 3 && <MoreOptionsButton />}
    </footer>

    <BottomSheet> <!-- Conditionally rendered -->
      <ChoiceList choices={allChoices} />
    </BottomSheet>

  </div>
</LivingAtmosphere>
```

---

## Key Changes Required

### 1. Remove nested scroll from dialogue
```diff
- <CardContent className="p-5 sm:p-8 md:p-10 h-[45vh] sm:h-[50vh] overflow-y-auto">
+ <CardContent className="p-5 sm:p-8 md:p-10">
```

### 2. Remove nested scroll from choices
```diff
- <div id="choices-scroll-container"
-      className="max-h-[220px] sm:max-h-[260px] overflow-y-auto">
+ <div id="choices-container">
```

### 3. Add bottom sheet for >3 choices
```tsx
{choices.length > 3 ? (
  <>
    <QuickReplies choices={choices.slice(0,3)} />
    <MoreOptionsButton onClick={openSheet} />
    <BottomSheet open={sheetOpen} onClose={closeSheet}>
      <ChoiceList choices={choices} />
    </BottomSheet>
  </>
) : (
  <GameChoices choices={choices} />
)}
```

### 4. Make footer sticky
```diff
- <footer className="flex-shrink-0 glass-panel">
+ <footer className="flex-shrink-0 sticky bottom-0 glass-panel z-10">
```

### 5. Add scroll intent tracking
```tsx
const [userScrolled, setUserScrolled] = useState(false)
const transcriptRef = useRef<HTMLElement>(null)

// Detect user scroll
const handleScroll = (e) => {
  const el = e.target
  const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 80
  setUserScrolled(!isAtBottom)
}

// Auto-scroll only if user hasn't scrolled up
useEffect(() => {
  if (!userScrolled && transcriptRef.current) {
    transcriptRef.current.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
  }
}, [currentContent])
```

### 6. Add "Jump to latest" pill
```tsx
{userScrolled && (
  <motion.button
    className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-2 rounded-full"
    onClick={() => {
      transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
      setUserScrolled(false)
    }}
  >
    Jump to latest ↓
  </motion.button>
)}
```

---

## Safe Area Handling

Current:
```tsx
style={{ marginBottom: 'max(1rem, env(safe-area-inset-bottom, 16px))' }}
```

Target:
```tsx
<footer
  className="sticky bottom-0"
  style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
>
```

---

## CSS Changes (globals.css)

```css
/* Remove any global nested scroll styles */
.dialogue-card {
  /* No fixed height, no overflow */
}

/* Single scroll surface */
#transcript {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

/* Message cards don't scroll */
.message-card {
  overflow: visible;
}

/* Sticky footer */
.choices-footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(12px);
}
```

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Long dialogue pushes choices off screen | User scrolls down (expected behavior) |
| Many choices expand too tall | Bottom sheet for >3 choices |
| iOS rubber band scroll | `overscroll-behavior-y: contain` |
| Auto-scroll fights user | Scroll intent tracking |
| Keyboard covers input | `visualViewport` API for composer |

---

## Manual Test Checklist

After implementing:
- [ ] iPhone SE: Single fluid scroll works
- [ ] iPhone Pro Max: Thumb zone comfortable
- [ ] Long dialogue: Can scroll to see choices
- [ ] 5+ choices: Bottom sheet opens
- [ ] Scroll up mid-conversation: "Jump to latest" appears
- [ ] New message arrives: Auto-scrolls only if at bottom
- [ ] Keyboard opens: Footer adjusts

---

## Files to Modify

1. `components/StatefulGameInterface.tsx` - Main refactor
2. `components/ChatPacedDialogue.tsx` - May need MessageCard extraction
3. `components/ui/BottomSheet.tsx` - New component
4. `app/globals.css` - Scroll CSS
5. `lib/ui-constants.ts` - Bottom sheet heights

---

## Implementation Complete (January 22, 2026)

### Changes Made to `StatefulGameInterface.tsx`:

#### 1. Dialogue CardContent (line ~3480)
```diff
- className="p-5 sm:p-8 md:p-10 h-[45vh] sm:h-[50vh] overflow-y-auto"
- style={{ WebkitOverflowScrolling: 'touch', scrollbarGutter: 'stable' }}
+ className="p-5 sm:p-8 md:p-10"
+ // SINGLE SCROLL REFACTOR: Removed h-[45vh] and overflow-y-auto - main scrolls now
```

#### 2. Footer (line ~3717)
```diff
- className="flex-shrink-0 glass-panel max-w-4xl mx-auto px-3 sm:px-4 z-20"
- style={{ marginTop: '1.5rem', marginBottom: 'max(1rem, env(safe-area-inset-bottom, 16px))' }}
+ className="flex-shrink-0 sticky bottom-0 glass-panel max-w-4xl mx-auto px-3 sm:px-4 z-20"
+ style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
```

#### 3. Choices Container (line ~3737)
```diff
- id="choices-scroll-container"
- className="max-h-[220px] sm:max-h-[260px] overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth w-full"
- style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'y proximity', touchAction: 'pan-y' }}
- onScroll={(e) => { /* scroll indicator logic */ }}
+ id="choices-container"
+ className="w-full"
+ // SINGLE SCROLL REFACTOR: Removed nested scroll - choices expand naturally
```

### Verification
- ✅ Build passes
- ✅ All 1143 tests pass
- ✅ No TypeScript errors

### What's Still Needed (Future Tickets)
- **TICKET-002:** Bottom Sheet for >3 choices
- **Scroll intent tracking:** Auto-scroll only when user is at bottom
- **"Jump to latest" pill:** Show when user scrolls up

**Manual migration: COMPLETE**
