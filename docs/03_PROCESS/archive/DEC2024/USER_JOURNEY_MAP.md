# 🗺️ Complete User Journey Map
**From Game Start → All 9 Characters → Journey Complete**

---

## 🎬 **PHASE 1: GAME START**

### Step 1: Landing Page
- User visits `/`
- Sees `AtmosphericIntro` component
- Clicks "Enter the Station" or "Start"
- Triggers `initializeGame()`

### Step 2: Game Initialization
- `GameStateManager.loadGameState()` checks localStorage
- If no save: Creates new `GameState` with `playerId = player-{timestamp}-{random}`
- Sets `currentNodeId = 'samuel_introduction'`
- Sets `currentCharacterId = 'samuel'`
- All 9 character states initialized (trust = 0, relationshipStatus = 'stranger')

### Step 3: First Interaction - Samuel Introduction
**Node:** `samuel_introduction`  
**Samuel says:** "Welcome. I'm the conductor."

**Player Choices:**
1. "What is this place?" → `samuel_explains_station`
2. "I see platforms. Where do they lead?" → `samuel_explains_platforms`
3. "Who are you, really?" → `samuel_backstory_intro`
4. "[Continue]" → `samuel_introduction_2`

**Flow continues through intro nodes until → `samuel_hub_initial`**

---

## 🚂 **PHASE 2: INITIAL CHARACTER SELECTION**

### Hub: `samuel_hub_initial`
**Condition:** Player hasn't met Maya, Devon, or Jordan yet  
**Samuel says:** "Three travelers tonight. Each at their own crossroads. Before I tell you about them—when you think about your decision, what pulls at you most?"

**Note:** Samuel only mentions "three travelers" (Maya, Devon, Jordan) in his dialogue, but the hub actually offers **8 character paths** through player choice responses. The other 5 characters (Tess, Yaquin, Kai, Rohan, Silas) are discoverable through these paths but not explicitly mentioned upfront—they're introduced organically based on player values/interests.

**8 Character Paths Available:**

#### Path 1: Helping → Maya
- Choice: "Wanting to help people, but not sure I'm on the right path for it."
- → `samuel_discovers_helping` → `samuel_discovers_helping_2` → `samuel_discovers_helping_3`
- → **Meet Maya** (`maya_introduction`)
- Sets flag: `met_maya`

#### Path 2: Building/Systems → Devon
- Choice: "I like solving problems logically, but I feel like something's missing."
- → `samuel_discovers_building`
- → **Meet Devon** (`devon_introduction`)
- Sets flag: `met_devon`

#### Path 3: Exploring → Jordan
- Choice: "I've tried different things and I'm not sure if that's okay."
- → `samuel_discovers_exploring`
- → **Meet Jordan** (`jordan_introduction`)
- Sets flag: `met_jordan`

#### Path 4: Education → Tess
- Choice: "I'm interested in education and leadership, but the system feels broken."
- → `samuel_discovers_tess`
- → **Meet Tess** (`tess_introduction`)
- Sets flag: `met_tess`

#### Path 5: Creator → Yaquin
- Choice: "I have skills I want to teach, but I don't fit in a traditional classroom."
- → `samuel_discovers_yaquin`
- → **Meet Yaquin** (`yaquin_introduction`)
- Sets flag: `met_yaquin`

#### Path 6: Corporate Innovation → Kai
- Choice: "I'm fighting to innovate inside a rigid system."
- → `samuel_discovers_kai`
- → **Meet Kai** (`kai_introduction`)
- Sets flag: `met_kai`

#### Path 7: Infrastructure → Rohan
- Choice: "I'm tired of fake solutions. I want to know how things really work."
- → `samuel_discovers_rohan`
- → **Meet Rohan** (`rohan_introduction`)
- Sets flag: `met_rohan`

#### Path 8: Digital Refugee → Silas
- Choice: "I want to build something real. Something I can touch."
- → `samuel_discovers_silas`
- → **Meet Silas** (`silas_introduction`)
- Sets flag: `met_silas`

#### Alternative: "Show me everyone"
- Choice: "Who else is here tonight?" (from any discovery path)
- → `samuel_other_travelers` (shows Maya, Devon, Jordan)
- OR → `samuel_comprehensive_hub` (shows ALL 9 characters)

---

## 🔄 **PHASE 3: CHARACTER ARC COMPLETION**

### Arc Completion Flow
Each character arc has multiple nodes leading to a completion point:
- **Maya:** `maya_arc_complete` flag set
- **Devon:** `devon_arc_complete` flag set
- **Jordan:** `jordan_arc_complete` flag set
- **Marcus:** `marcus_arc_complete` flag set
- **Tess:** `tess_arc_complete` flag set
- **Yaquin:** `yaquin_arc_complete` flag set
- **Kai:** `kai_arc_complete` flag set
- **Rohan:** `rohan_arc_complete` flag set
- **Silas:** `silas_arc_complete` flag set

**After completing an arc:**
- Player returns to Samuel's hub
- Hub changes based on completed arcs
- Reflection gateways unlock

---

## 🎯 **PHASE 4: PROGRESSIVE HUBS**

### Hub Progression Logic

#### After Maya's Arc Complete
**Hub:** `samuel_hub_after_maya`  
**Condition:** `maya_arc_complete` = true, `devon_arc_complete` = false  
**Available:**
- Devon (Platform 3)
- Return to Maya (revisit) - if `maya_arc_complete`
- "Show me everyone" → `samuel_comprehensive_hub`
- Pattern observation (if trust ≥ 3)

#### After Devon's Arc Complete
**Hub:** `samuel_hub_after_devon`  
**Condition:** `devon_arc_complete` = true, `jordan_arc_complete` = false  
**Available:**
- Jordan (Conference Room B)
- Marcus (Platform 4 - Medical Bay) - if `met_devon`
- Return to Maya (revisit) - if `maya_arc_complete`
- Return to Devon (if not completed)
- "Show me everyone" → `samuel_comprehensive_hub`
- Pattern observation (if trust ≥ 3)

#### Reflection Gateways (After Each Arc)
When returning to Samuel after completing an arc, player may hit reflection gateways:
- `samuel_maya_reflection_gateway`
- `samuel_devon_reflection_gateway`
- `samuel_jordan_reflection_gateway`
- `samuel_marcus_reflection_gateway`
- `samuel_tess_reflection_gateway`
- `samuel_yaquin_reflection_gateway`
- `samuel_kai_reflection_gateway`
- `samuel_rohan_reflection_gateway`
- `samuel_silas_reflection_gateway`

These provide narrative reflection on the completed arc.

---

## 🌐 **PHASE 5: COMPREHENSIVE HUB**

### Hub: `samuel_comprehensive_hub`
**Access:** Always available via "Show me everyone" option  
**Shows ALL 9 Characters:**

1. **Maya** - Platform 1
   - New: `maya_introduction` (if not met)
   - Revisit: `maya_revisit_graph` (if `maya_arc_complete`)

2. **Devon** - Platform 3
   - New: `devon_introduction` (if not met)
   - Revisit: (future - if `devon_arc_complete`)

3. **Jordan** - Conference Room B
   - New: `jordan_introduction` (if not met)
   - Revisit: (future - if `jordan_arc_complete`)

4. **Marcus** - Platform 4 (Medical Bay)
   - New: `marcus_introduction` (if `met_devon`)
   - Available after meeting Devon

5. **Tess** - Pizitz Food Hall
   - New: `tess_introduction` (always available)

6. **Yaquin** - Platform 5
   - New: `yaquin_introduction` (always available)
   - Revisit: `yaquin_revisit_graph` (if `yaquin_arc_complete`)

7. **Kai** - Platform 6
   - New: `kai_introduction` (always available)

8. **Rohan** - Platform 7
   - New: `rohan_introduction` (always available)

9. **Silas** - Platform 8
   - New: `silas_introduction` (always available)

**Note:** This hub is ALWAYS accessible, ensuring players can meet all characters regardless of progression order.

---

## 📊 **PHASE 6: CHARACTER MEETING REQUIREMENTS**

### No Prerequisites (Available from Start)
- ✅ Maya (via helping path)
- ✅ Devon (via building path)
- ✅ Jordan (via exploring path)
- ✅ Tess (via education path)
- ✅ Yaquin (via creator path)
- ✅ Kai (via corporate innovation path)
- ✅ Rohan (via infrastructure path)
- ✅ Silas (via digital refugee path)

### Prerequisites
- ⚠️ **Marcus:** Requires `met_devon` flag
  - Available in `samuel_hub_after_devon`
  - Available in `samuel_comprehensive_hub` (if `met_devon`)

---

## 🎓 **PHASE 7: CHARACTER ARC STRUCTURE**

Each character arc follows this pattern:

### Arc Structure
1. **Introduction** (`{character}_introduction`)
   - First meeting
   - Sets `met_{character}` flag
   - Builds initial trust

2. **Main Arc** (15-20 nodes)
   - Character's story unfolds
   - Player makes choices affecting trust
   - Patterns demonstrated
   - Skills tracked

3. **Arc Completion** (Final node)
   - Sets `{character}_arc_complete` flag
   - Character makes final decision
   - Returns player to Samuel

4. **Revisit** (If available)
   - Maya: `maya_revisit_graph` (available after completion)
   - Yaquin: `yaquin_revisit_graph` (available after completion)
   - Others: Future implementation

---

## 🏁 **PHASE 8: JOURNEY COMPLETION**

### Journey Complete Conditions
Journey is considered "complete" when:
- ✅ **2+ arcs completed** (any combination), OR
- ✅ **20+ choices made** (across all patterns), OR
- ✅ **Global flag `journey_complete`** is set

### Journey Summary
When complete, player can access:
- **Journey Summary** (Samuel-narrated reflection)
- Shows:
  - Opening paragraph (pattern-based)
  - Pattern reflection (dominant + secondary)
  - Relationship reflections (all characters met)
  - Skill highlights (top 3 demonstrated skills)
  - Closing wisdom (Samuel's final words)

### Accessing Journey Summary
- Available via "Your Journey" button in header
- Or through Samuel's dialogue after completion
- Shows personalized narrative of entire journey

---

## 🗺️ **COMPLETE PATH TO ALL 9 CHARACTERS**

### Optimal Path (Meeting All Characters)

#### **Start → Samuel Introduction**
1. Land on `/` → Click "Start"
2. Meet Samuel: "I'm the conductor"
3. Go through intro → `samuel_hub_initial`

#### **Meet First 3 (Core Characters)**
4. **Maya** (helping path) → Complete arc → `maya_arc_complete`
5. Return to Samuel → `samuel_hub_after_maya`
6. **Devon** (building path) → Complete arc → `devon_arc_complete`
7. Return to Samuel → `samuel_hub_after_devon`
8. **Jordan** (exploring path) → Complete arc → `jordan_arc_complete`

#### **Meet Remaining 6 (Via Comprehensive Hub)**
9. Return to Samuel → Click "Show me everyone" → `samuel_comprehensive_hub`
10. **Marcus** (Platform 4) → Complete arc → `marcus_arc_complete`
11. Return to Samuel → "Show me everyone" again
12. **Tess** (Pizitz Food Hall) → Complete arc → `tess_arc_complete`
13. Return to Samuel → "Show me everyone"
14. **Yaquin** (Platform 5) → Complete arc → `yaquin_arc_complete`
15. Return to Samuel → "Show me everyone"
16. **Kai** (Platform 6) → Complete arc → `kai_arc_complete`
17. Return to Samuel → "Show me everyone"
18. **Rohan** (Platform 7) → Complete arc → `rohan_arc_complete`
19. Return to Samuel → "Show me everyone"
20. **Silas** (Platform 8) → Complete arc → `silas_arc_complete`

#### **Journey Complete**
21. Return to Samuel
22. Access "Your Journey" → See complete narrative summary
23. All 9 characters experienced ✅

---

## 🔄 **ALTERNATIVE PATHS**

### Path A: Pattern-Based Discovery
- Player chooses based on their values/interests
- Samuel routes to matching character
- More organic, less comprehensive

### Path B: Comprehensive Hub First
- Player immediately asks "Who else is here?"
- Gets full list of all 9 characters
- Can meet in any order
- Most efficient for completion

### Path C: Mixed Approach
- Meet 2-3 characters organically
- Then use "Show me everyone" for remaining
- Balanced experience

---

## 📝 **KEY MECHANICS**

### State Tracking
- **Global Flags:** Track arc completions (`{character}_arc_complete`)
- **Met Flags:** Track first meetings (`met_{character}`)
- **Trust Levels:** Per-character (0-10)
- **Patterns:** Accumulated across all interactions
- **Skills:** Tracked per choice/demonstration

### Hub Logic
- Hubs change based on completed arcs
- "Show me everyone" always available
- Reflection gateways unlock after completions
- Revisit graphs unlock after completions (Maya, Yaquin)

### Navigation
- Cross-graph navigation via `findCharacterForNode()`
- Automatic routing to correct graph variant
- Fallback to Samuel intro if node not found
- Error handling prevents stuck states

---

## ✅ **VERIFICATION**

**All 9 Characters Accessible:**
- ✅ Maya - Always available (helping path or comprehensive hub)
- ✅ Devon - Always available (building path or comprehensive hub)
- ✅ Jordan - Always available (exploring path or comprehensive hub)
- ✅ Marcus - Available after meeting Devon
- ✅ Tess - Always available (education path or comprehensive hub)
- ✅ Yaquin - Always available (creator path or comprehensive hub)
- ✅ Kai - Always available (corporate path or comprehensive hub)
- ✅ Rohan - Always available (infrastructure path or comprehensive hub)
- ✅ Silas - Always available (digital refugee path or comprehensive hub)

**No Dead Ends:**
- Every node has choices
- Every arc has completion
- Every completion returns to Samuel
- Comprehensive hub always accessible

---

## 🎯 **SUMMARY**

**Start:** Landing page → Samuel introduction  
**Middle:** Meet characters → Complete arcs → Return to Samuel  
**End:** Journey summary (2+ arcs or 20+ choices)  
**All Characters:** Accessible via comprehensive hub at any time

**Total Characters:** 9  
**Total Arcs:** 9  
**Completion Requirement:** 2+ arcs OR 20+ choices  
**No Restrictions:** All characters accessible, no hard locks
