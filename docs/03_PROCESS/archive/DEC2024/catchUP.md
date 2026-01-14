Lux Story 2.0: The Living Station  
 Vision: Transform Lux Story from a branching dialogue game into a living  
  world where the station remembers, characters interconnect, and the  
 player's identity emerges through systemic feedback.  
 Inspiration: RDR1→2 (camp as living system), ME1→2 (loyalty missions,  
 interrupts, consequence chains)  
 \---  
 ✅ COMPLETED SYSTEMS (December 2024\)  
 | System                                       | Status   | Commit     |  
 |----------------------------------------------|----------|------------|  
 | Cross-character echoes                       | ✅ Built | d981ff3    |  
 | Interrupt system                             | ✅ Built | d981ff3    |  
 | Pattern voices                               | ✅ Built | d981ff3    |  
 | Character waiting                            | ✅ Built | d981ff3    |  
 | Delayed gifts                                | ✅ Built | d981ff3    |  
 | Relationship web visualization               | ✅ Built | (unstaged) |  
 | Thought cabinet wiring                       | ✅ Built | (unstaged) |  
 | Full character coverage (48 edges, 13 chars) | ✅ Built | (unstaged) |  
 Original Gap (RESOLVED): \~\~Characters exist in silos. Maya doesn't know  
 you helped Devon.\~\~ Now characters reference each other, players see the  
  relationship web, and choices echo across the station.  
 \---  
 Game Design Principles (from Next-Gen Guide)  
 Principles Already Aligned ✅  
 | Principle                       | Implementation  
                          |  
 |---------------------------------|-------------------------------------  
 \-------------------------|  
 | Trust players (Miyazaki)        | No quest logs, minimal hand-holding,  
  discovery-based         |  
 | Delayed consequences (CDPR)     | Delayed gifts system surfaces  
 choices 2-5 interactions later |  
 | Factions \> morality (New Vegas) | 5 patterns instead of good/evil  
                          |  
 | Information hunger              | Private opinions revealed at trust  
 ≥6                        |  
 | Character interconnection       | 48 relationship edges,  
 cross-character echoes                |  
 Principles to Apply 🎯  
 | Principle                      | Source                 | Application  
 to Lux Story                                                    |  
 |--------------------------------|------------------------|-------------  
 \----------------------------------------------------------------|  
 | \~40 second discovery intervals | BOTW/Ghost of Tsushima | Every minute  
  of play should have a discovery (pattern voice, echo, insight) |  
 | Tension/release cycles         | Platinum/Naughty Dog   | Emotional  
 rhythm: intense moments → quiet reflection                        |  
 | "Play, Show, Tell" hierarchy   | CDPR                   | Choices  
 (play) \> Reactions (show) \> Exposition (tell)                       |  
 | Illusion of choice             | Walking Dead           | Feeling of  
 impact \> actual divergence                                       |  
 | Small humanlike moments        | CDPR                   | Interrupts,  
 emotional beats, body language in text                          |  
 | Avoid choice paralysis         | Open world research    | 3-4  
 meaningful choices, not 6+ overwhelming options  
 |  
 \---  
 Current State (What We Have Now)  
 | System                 | Status | Quality   |  
 |------------------------|--------|-----------|  
 | Per-character state    | Built  | Excellent |  
 | Pattern tracking       | Built  | Excellent |  
 | Consequence echoes     | Built  | Excellent |  
 | Cross-character memory | Built  | Excellent |  
 | Interrupt system       | Built  | Good      |  
 | Pattern voices         | Built  | Good      |  
 | Character waiting      | Built  | Good      |  
 | Delayed gifts          | Built  | Good      |  
 | Relationship web UI    | Built  | Good      |  
 | Thought cabinet wiring | Built  | Good      |  
 Current Gap: None. All planned systems (Station Evolution, Loyalty Experiences, Polish) are implemented.  
 \---  
 Evolution Tiers  
 Tier 1: The Consequence Web ✅ COMPLETE  
 Impact: Characters feel interconnected  
 Characters reference your relationships with others through dialogue.  
 Implementation:  
 1\. Add crossCharacterEchoes system in lib/consequence-echoes.ts  
 2\. When arc completes, queue "gossip echoes" for other characters  
 3\. Samuel becomes the primary conduit: "Devon mentioned you..."  
 New Interface:  
 interface CrossCharacterEcho {  
   sourceCharacter: CharacterId  
   sourceFlag: string           // e.g., 'maya\_arc\_complete'  
   targetCharacter: CharacterId  
   delay: number                // Interactions before surfacing  
   echo: ConsequenceEcho  
 }  
 Example Flow:  
 \- Complete Maya's arc → maya\_arc\_complete flag set  
 \- Next Devon interaction: "Maya mentioned you. Said you didn't try to  
 fix her."  
 \- Samuel in hub: "Maya's been different lately. Lighter."  
 Files:  
 \- lib/consequence-echoes.ts \- Add crossCharacterEchoes  
 \- lib/cross-character-memory.ts \- New file for queuing/processing  
 \- content/\*-dialogue-graph.ts \- Add conditional nodes with  
 hasGlobalFlags  
 \---  
 Tier 2: The Interrupt System ✅ COMPLETE  
 Impact: Moment-to-moment agency within dialogue  
 Brief windows where player can act during NPC speech.  
 Implementation:  
 1\. Add InterruptWindow to DialogueContent  
 2\. Render timed button during dialogue display  
 3\. If triggered: branch to interrupt node, apply bonus consequence  
 New Interface:  
 interface InterruptWindow {  
   duration: number             // ms to respond (2000-4000)  
   type: 'connection' | 'challenge' | 'silence'  
   action: string               // Visual description  
   targetNodeId: string         // Where interrupt leads  
   consequence?: StateChange    // Bonus for taking it  
   missedNodeId?: string        // Alternative if missed (optional)  
 }  
 Example:  
 content: \[{  
   text: "She looked at me yesterday and said 'I know you.' First time in  
  months. And I just—",  
   interrupt: {  
     duration: 3000,  
     type: 'connection',  
     action: 'Reach out and touch her shoulder',  
     targetNodeId: 'grace\_interrupt\_comfort',  
     consequence: { characterId: 'grace', trustChange: 2 }  
   }  
 }\]  
 Files:  
 \- lib/dialogue-graph.ts \- Add InterruptWindow to DialogueContent  
 \- components/ChatPacedDialogue.tsx \- Render interrupt UI  
 \- components/game/InterruptButton.tsx \- New component  
 \---  
 Tier 3: Pattern Voices ✅ COMPLETE  
 Impact: Disco Elysium "thought cabinet" feel  
 When patterns reach threshold, they "speak" as inner monologue during  
 dialogue.  
 Implementation:  
 1\. Add PatternVoice system that injects inner thoughts  
 2\. Voices comment on NPC dialogue, nudge toward aligned choices  
 3\. Render as distinct styled text (italic, different color)  
 New Interface:  
 interface PatternVoice {  
   pattern: PatternType  
   minLevel: number  
   trigger: 'on\_node\_enter' | 'before\_choices' | 'on\_npc\_emotion'  
   condition?: { npcEmotion?: string; nodeTag?: string }  
   text: string  
   style: 'whisper' | 'urge' | 'observation'  
 }  
 Example:  
 Devon: "The systems here are beautiful. Interconnected."  
 \[ANALYTICAL \- 6\]: This is what you've been looking for.  
                   Someone who sees the architecture.  
                   Press him on the details.  
 Choices appear...  
 Files:  
 \- lib/pattern-voices.ts \- New file for voice triggers  
 \- components/DialogueDisplay.tsx \- Render voice interjections  
 \- content/pattern-voice-library.ts \- Voice text per pattern/context  
 \---  
 Tier 4: Station Evolution (1 week)  
 Impact: World remembers and changes  
 The station visibly reflects player's journey.  
 Implementation:  
 1\. Track StationState with visual/ambient changes  
 2\. Characters appear "doing things" based on arc progress  
 3\. Ambient descriptions change based on relationships  
 New Interface:  
 interface StationState {  
   atmosphere: 'quiet' | 'bustling' | 'tense' | 'hopeful'  
   platformStates: Record\<PlatformId, PlatformVisualState\>  
   ambientEvents: AmbientEvent\[\]  
   characterActivities: Map\<CharacterId, Activity\>  
 }  
 interface PlatformVisualState {  
   warmth: number               // 0-1, affects description  
   lastVisited: number  
   visualChanges: string\[\]      // "Maya's robot demo running"  
 }  
 Example:  
 \- After Maya arc: Platform 1 shows her robot demo on a screen  
 \- After Elena arc: Lights in the station feel "warmer" (she fixed  
 something)  
 \- After Grace arc: An elderly NPC sits peacefully on a bench  
 Files:  
 \- lib/station-state.ts \- New file  
 \- content/ambient-descriptions.ts \- Context-aware station text  
 \- components/StationView.tsx \- Visual representation (if adding)  
 \---  
 Tier 5: Loyalty Experiences (2+ weeks)  
 Impact: Memorable interactive moments  
 Deep-dive experiences that test player's patterns in context.  
 Current State: Elena has "The Troubleshoot", Grace has "The Moment"  
 Expansion:  
 \- Every major character gets one signature interactive experience  
 \- Not just dialogue \- environmental problem-solving  
 \- Player's dominant pattern affects available approaches  
 Example Concepts:  
 | Character | Experience       | Test  
                |  
 |-----------|------------------|----------------------------------------  
 \---------------|  
 | Maya      | "The Demo"       | Help her present to skeptical investors  
                |  
 | Devon     | "The Outage"     | Triage a system failure with him  
                |  
 | Samuel    | "The Quiet Hour" | Sit in silence, choose when to speak  
                |  
 | Rohan     | "The Dive"       | Go deep into code with him, face  
 existential question |  
 Files:  
 \- content/\*-loyalty-experience.ts \- New files per character  
 \- lib/experience-engine.ts \- Non-dialogue interaction handling  
 \---  
 Selected Scope: Full Sprint (Tiers 1-3) ✅ COMPLETE  
 | Tier                   | Status      |  
 |------------------------|-------------|  
 | 1\. Consequence Web     | ✅ COMPLETE |  
 | 2\. Interrupt System    | ✅ COMPLETE |  
 | 3\. Pattern Voices      | ✅ COMPLETE |  
 | 4. Station Evolution   | ✅ COMPLETE |  
 | 5. Loyalty Experiences | ✅ COMPLETE |  
 \---  
 Detailed Implementation Plan  
 Phase 1: Consequence Web (Days 1-2)  
 Goal: Characters reference player's relationships with others.  
 Step 1.1: Create Cross-Character Memory System  
 File: lib/cross-character-memory.ts (NEW)  
 \- CrossCharacterEcho interface  
 \- EchoQueue class with add/consume methods  
 \- getEchosForCharacter(characterId, gameState) → ConsequenceEcho\[\]  
 \- Integration with globalFlags system  
 Step 1.2: Define Echo Mappings  
 File: lib/cross-character-echoes.ts (NEW)  
 CROSS\_CHARACTER\_ECHOES: CrossCharacterEcho\[\] \= \[  
   // Maya arc complete → affects Samuel, Devon  
   {  
     sourceFlag: 'maya\_arc\_complete',  
     echoes: \[  
       { target: 'samuel', delay: 0, text: "Maya's been different lately.  
  Lighter." },  
       { target: 'devon', delay: 1, text: "Maya mentioned you. Said you  
 didn't try to fix her." }  
     \]  
   },  
   // Elena arc complete → affects Samuel, Grace  
   {  
     sourceFlag: 'elena\_arc\_complete',  
     echoes: \[  
       { target: 'samuel', delay: 0, text: "Elena finished her shift  
 smiling. That's rare." },  
       { target: 'grace', delay: 1, text: "The electrician talked about  
 you. Said you get it." }  
     \]  
   },  
   // ... for each character arc  
 \]  
 Step 1.3: Add Samuel Hub Gossip Nodes  
 File: content/samuel-dialogue-graph.ts (MODIFY)  
 Add conditional nodes after hub:  
 \- samuel\_gossip\_maya (hasGlobalFlags: \['maya\_arc\_complete'\])  
 \- samuel\_gossip\_elena (hasGlobalFlags: \['elena\_arc\_complete'\])  
 \- samuel\_gossip\_grace (hasGlobalFlags: \['grace\_arc\_complete'\])  
 \- ... for each character  
 Step 1.4: Wire Into Dialogue Engine  
 File: components/StatefulGameInterface.tsx (MODIFY)  
 In handleChoice or node transition:  
 \- Check for pending cross-character echoes  
 \- If exists, prepend to next dialogue content  
 Step 1.5: Test  
 \- Complete Maya arc → Visit Samuel → Verify gossip  
 \- Complete Maya arc → Visit Devon → Verify delayed reference  
 \---  
 Phase 2: Interrupt System (Days 3-5)  
 Goal: Player can act during NPC dialogue.  
 Step 2.1: Extend Dialogue Types  
 File: lib/dialogue-graph.ts (MODIFY)  
 Add to DialogueContent interface:  
   interrupt?: {  
     duration: number           // 2000-4000ms  
     type: 'connection' | 'challenge' | 'silence'  
     action: string             // "Reach out"  
     targetNodeId: string  
     consequence?: StateChange  
     missedNodeId?: string      // Optional alternative  
   }  
 Step 2.2: Create Interrupt Component  
 File: components/game/InterruptButton.tsx (NEW)  
 \- Animated button that appears mid-dialogue  
 \- Countdown timer (visual progress bar)  
 \- Click handler → emit interrupt event  
 \- Auto-dismiss on timeout  
 \- Respects prefers-reduced-motion  
 Step 2.3: Integrate Into Chat Display  
 File: components/ChatPacedDialogue.tsx (MODIFY)  
 \- Detect interrupt in content  
 \- Show InterruptButton at appropriate text position  
 \- Handle interrupt click → navigate to targetNodeId  
 \- Handle timeout → continue to next or missedNodeId  
 Step 2.4: Add Interrupts to Grace's Arc  
 File: content/grace-dialogue-graph.ts (MODIFY)  
 Add 2-3 interrupt moments:  
 1\. grace\_mrs\_patterson\_story \- "And I just—" → reach out  
 2\. grace\_demographics\_moment \- "Nobody's watching." → acknowledge  
 3\. grace\_farewell \- "Thank you for—" → hug (high trust only)  
 Step 2.5: Test  
 \- Verify timing feels right (not too fast/slow)  
 \- Test keyboard accessibility  
 \- Test with reduced motion preferences  
 \---  
 Phase 3: Pattern Voices (Days 6-9)  
 Goal: Patterns "speak" as inner monologue.  
 Step 3.1: Create Pattern Voice System  
 File: lib/pattern-voices.ts (NEW)  
 interface PatternVoice {  
   pattern: PatternType  
   minLevel: number  
   triggers: PatternVoiceTrigger\[\]  
 }  
 interface PatternVoiceTrigger {  
   condition: 'node\_enter' | 'before\_choices' | 'npc\_emotion'  
   match?: { emotion?: string; tag?: string; characterId?: string }  
   voices: string\[\]           // Random selection  
   style: 'whisper' | 'urge' | 'observation'  
 }  
 getPatternVoice(context, gameState) → PatternVoiceResult | null  
 Step 3.2: Create Voice Library  
 File: content/pattern-voice-library.ts (NEW)  
 PATTERN\_VOICES: PatternVoice\[\] \= \[  
   {  
     pattern: 'analytical',  
     minLevel: 5,  
     triggers: \[  
       {  
         condition: 'npc\_emotion',  
         match: { emotion: 'confused' },  
         voices: \[  
           "There's a pattern here. They can't see it yet.",  
           "Break it down. What are they actually asking?"  
         \],  
         style: 'observation'  
       },  
       {  
         condition: 'before\_choices',  
         match: { characterId: 'devon' },  
         voices: \[  
           "He thinks in systems. So do you.",  
           "This is your language. Speak it."  
         \],  
         style: 'urge'  
       }  
     \]  
   },  
   // ... for each pattern (5 patterns × 5-10 triggers each)  
 \]  
 Step 3.3: Create Voice Renderer  
 File: components/game/PatternVoice.tsx (NEW)  
 \- Styled container (italic, pattern color, subtle)  
 \- Animation: fade in, slight delay  
 \- Pattern icon/label prefix: \[ANALYTICAL\]  
 \- Dismisses automatically or on click  
 Step 3.4: Integrate Into Dialogue Display  
 File: components/DialogueDisplay.tsx (MODIFY)  
 After NPC content renders:  
 \- Call getPatternVoice(currentContext, gameState)  
 \- If voice returned, render PatternVoice component  
 \- Before choices render, check for 'before\_choices' triggers  
 Step 3.5: Test  
 \- Verify voices only appear at threshold (5+)  
 \- Test each pattern has appropriate triggers  
 \- Ensure voices don't overwhelm (frequency limiting)  
 \- Test voice dismissal doesn't block choices  
 \---  
 Phase 4+: Completed Systems
- Station Evolution ✅ COMPLETE
- Loyalty Experiences ✅ COMPLETE
- (Detailed planning when Phase 1-3 complete) <-- Superseded by recent sprints  
 \---  
 Key Files Reference  
 Core Systems:  
 \- lib/character-state.ts \- GameState, StateChange  
 \- lib/dialogue-graph.ts \- DialogueNode, DialogueContent  
 \- lib/consequence-echoes.ts \- Current echo system  
 \- lib/game-store.ts \- Zustand store  
 New Files to Create:  
 \- lib/cross-character-memory.ts \- Consequence web  
 \- lib/interrupt-system.ts \- Interrupt handling  
 \- lib/pattern-voices.ts \- Inner voice system  
 \- lib/station-state.ts \- Living station  
 \- components/game/InterruptButton.tsx \- Interrupt UI  
 \---  
 Success Metrics  
 After Tier 1-3 (1-2 weeks):  
 \- Characters reference each other naturally  
 \- Player feels agency within dialogue moments  
 \- Patterns feel like emerging personality traits  
 \- Replay value increases (different pattern builds \= different  
 experience)  
 After Tier 4-5 (1 month):  
 \- Station feels alive and responsive  
 \- Each character has a memorable signature moment  
 \- Player can describe "who they became" in the game  
 \---  
 Phase 2: Engagement Loops Sprint  
 Vision: Create satisfying feedback loops that draw players back like  
 Meta/IG's engagement patterns, but for meaningful personal growth—not  
 dopamine manipulation.  
 Inspiration: Instagram's "people are waiting for you," Duolingo's streak  
  mechanics, games with "you've been missed" notifications  
 \---  
 Current State (What We Have)  
 | System                      | Status               | Leverageable For  
    |  
 |-----------------------------|----------------------|------------------  
 \---|  
 | Character relationships web | Built (30+ edges)    | Visualization  
    |  
 | Cross-character echoes      | Built                | Character pulls  
    |  
 | Session boundaries          | Built                | Return hooks  
    |  
 | Revisit mechanics           | Built (Maya, Yaquin) | Check-ins  
    |  
 | Knowledge flags             | Built                | Delayed gifts  
    |  
 | Trust levels                | Built                | Progressive  
 reveals |  
 | Pattern tracking            | Built                | Personal  
 synthesis  |  
 Critical Gap: We have rich systems but no "pull" mechanics—players don't  
  feel called back to the station.  
 \---  
 Engagement Loop Features  
 Feature 1: "They're Waiting for You" (Return Pulls)  
 Impact: Players feel remembered between sessions  
 When player returns, characters reference their absence and signal  
 desire to reconnect.  
 Implementation:  
 1\. Track lastVisitTimestamp per character  
 2\. On return, eligible characters show "waiting" state in platform UI  
 3\. Samuel (hub) mentions specific characters who've "been asking about  
 you"  
 4\. First dialogue on revisit acknowledges time passed  
 New Interface:  
 interface CharacterWaitingState {  
   characterId: CharacterId  
   hoursSinceVisit: number  
   waitingMessage: string          // "Maya's been tinkering more than   
 usual..."  
   priority: number                // Who to mention first  
   hasNewContent: boolean          // True if their state changed  
 }  
 function getWaitingCharacters(gameState: GameState):   
 CharacterWaitingState\[\]  
 Integration Points:  
 \- lib/session-structure.ts \- Track session timestamps  
 \- lib/cross-character-echoes.ts \- Waiting messages tied to relationships  
 \- components/StatefulGameInterface.tsx \- Show waiting state  
 Files:  
 \- lib/character-waiting.ts (NEW)  
 \- content/samuel-waiting-dialogue.ts (NEW) \- Samuel's "return" dialogue  
 \- Modify existing character graphs to include time-aware greetings  
 \---  
 Feature 2: Relationship Web Visualization  
 Impact: Players see their investment mapped out  
 Visual representation of relationships formed, showing interconnections  
 and unlocked reveals.  
 Implementation:  
 1\. Leverage existing CHARACTER\_RELATIONSHIP\_WEB data  
 2\. Create simple constellation/web view showing:  
   \- Characters met (nodes)  
   \- Relationships revealed (edges)  
   \- Trust levels (node intensity)  
   \- Unlocked private opinions (glow effect)  
 3\. Accessible from Journal or dedicated tab  
 Design:  
 interface RelationshipWebData {  
   nodes: {  
     characterId: CharacterId  
     met: boolean  
     trustLevel: number  
     arcComplete: boolean  
   }\[\]  
   edges: {  
     from: CharacterId  
     to: CharacterId  
     revealed: boolean  
     type: RelationshipType  
     isPrivateOpinion: boolean    // Higher trust reveal  
   }\[\]  
   stats: {  
     totalRelationshipsRevealed: number  
     totalPossible: number  
     deepestTrust: CharacterId  
   }  
 }  
 Files:  
 \- lib/relationship-web-data.ts (NEW) \- Compute web from state  
 \- components/RelationshipWeb.tsx (NEW) \- Visual component  
 \- components/Journal.tsx (MODIFY) \- Add tab/section  
 \---  
 Feature 3: Delayed Gifts (Layered Callbacks)  
 Impact: Choices pay off unexpectedly later  
 Player actions create "gifts" that reveal themselves in future  
 conversations with different characters.  
 Implementation:  
 1\. When player makes significant choice, queue "delayed gifts"  
 2\. Gifts surface 2-5 interactions later with different characters  
 3\. Example: Encouraging Maya → Devon mentions "Maya's been more  
 confident"  
 Interface:  
 interface DelayedGift {  
   sourceChoice: string            // What triggered this  
   sourceCharacter: CharacterId  
   targetCharacter: CharacterId  
   delayInteractions: number       // Surfaces after N interactions  
   giftType: 'callback' | 'reference' | 'thank\_you' | 'perspective'  
   content: {  
     text: string  
     emotion?: string  
   }  
   consumed: boolean               // Once shown, don't repeat  
 }  
 Example Flow:  
 1\. Player tells Maya "take your time deciding" (patience choice)  
 2\. 3 interactions later, visiting Samuel: "Maya told me about your  
 advice. 'Take your time,' she said you told her. She seemed lighter."  
 3\. Gift consumed, won't repeat  
 Files:  
 \- lib/delayed-gifts.ts (NEW)  
 \- Integrate into StatefulGameInterface.tsx gift delivery  
 \- Add gift triggers to existing dialogue choice handlers  
 \---  
 Feature 4: "The Station Remembers" (Personal Synthesis)  
 Impact: Game reflects your patterns back to you  
 At key moments, the station/Samuel synthesizes who you've become based  
 on your patterns and choices.  
 Implementation:  
 1\. Track "synthesis milestones" (5 arcs complete, high pattern  
 threshold, etc.)  
 2\. Samuel delivers personalized synthesis:  
   \- "You've talked to five travelers now. I've noticed something..."  
   \- "Your pattern leads with \[dominant\]. But here's the interesting  
 part..."  
 3\. Not judgment—observation that validates player identity  
 Interface:  
 interface SynthesisMoment {  
   trigger: 'arc\_count' | 'pattern\_threshold' | 'relationship\_web' |  
 'time\_in\_station'  
   threshold: number  
   delivered: boolean  
   synthesis: (gameState: GameState) \=\> SynthesisContent  
 }  
 interface SynthesisContent {  
   setup: string                   // "Five travelers now..."  
   observation: string             // "You lead with questions..."  
   affirmation: string             // "That's not common. That's   
 valuable."  
 }  
 Files:  
 \- lib/personal-synthesis.ts (NEW)  
 \- content/samuel-synthesis-dialogue.ts (NEW)  
 \- Trigger from StatefulGameInterface.tsx on milestone detection  
 \---  
 Feature 5: Unfinished Threads (Cliffhangers)  
 Impact: Incomplete conversations pull you back  
 Some conversations can't complete in one session—they end on a  
 cliffhanger that creates return motivation.  
 Implementation:  
 1\. Mark certain nodes as "session\_end\_points"  
 2\. When player hits session boundary near these nodes, offer:  
   \- "Maya pauses. 'Can we... continue this tomorrow? I need to think.'"  
 3\. Next session, that character has priority and picks up  
 mid-conversation  
 Interface:  
 interface UnfinishedThread {  
   characterId: CharacterId  
   nodeId: string  
   threadSummary: string           // "You were discussing her   
 parents..."  
   resumeNodeId: string  
   expiresAfterDays: number        // Optional \- thread can "resolve"   
 off-screen  
 }  
 Files:  
 \- lib/unfinished-threads.ts (NEW)  
 \- Add sessionEndPoint metadata to select dialogue nodes  
 \- Modify session boundary logic to detect and queue threads  
 \---  
 Feature 6: Character Check-Ins (Post-Arc Updates)  
 Impact: Characters evolve after you've helped them  
 After arc completion, characters send "updates" that show consequences  
 of player's guidance.  
 Implementation:  
 1\. Queue check-in for 1-3 sessions after arc completion  
 2\. Check-in is brief (2-3 exchanges) but meaningful:  
   \- "Remember what I told you about my parents? Well..."  
   \- References specific player advice from their arc  
 3\. Different outcomes based on which path player guided them toward  
 Existing Foundation:  
 \- maya-revisit-graph.ts already has this pattern  
 \- Need to systematize for all characters  
 Files:  
 \- lib/character-check-ins.ts (NEW) \- Queue and scheduling system  
 \- Expand revisit graphs for Devon, Grace, Elena, etc.  
 \- Integrate into Samuel hub navigation  
 \---  
 Implementation Plan  
 Sprint 1: Foundation (Features 1, 3\)  
 Goal: Return motivation \+ investment payoff  
 Step 1.1: Character Waiting System  
 \- Create lib/character-waiting.ts  
 \- Track timestamps in GameState  
 \- Add waiting detection to session start  
 Step 1.2: Samuel's Return Dialogue  
 \- Create content/samuel-waiting-dialogue.ts  
 \- Conditional nodes based on who's waiting  
 \- "Maya's been asking about you..." pattern  
 Step 1.3: Delayed Gifts Foundation  
 \- Create lib/delayed-gifts.ts  
 \- Queue mechanism with interaction countdown  
 \- Integrate delivery into dialogue engine  
 Step 1.4: Wire Gift Triggers  
 \- Add gift creation to key choices in existing graphs  
 \- Cross-character gift delivery in Samuel hub  
 \---  
 Sprint 2: Visualization (Feature 2\)  
 Goal: Make investment visible  
 Step 2.1: Relationship Web Data  
 \- Create lib/relationship-web-data.ts  
 \- Compute nodes/edges from GameState  
 \- Calculate reveal status from trust \+ flags  
 Step 2.2: Web Component  
 \- Create components/RelationshipWeb.tsx  
 \- Simple force-directed or radial layout  
 \- Touch/click to see relationship details  
 Step 2.3: Journal Integration  
 \- Add Relationships tab to Journal  
 \- Show stats: relationships revealed, total possible  
 \---  
 Sprint 3: Depth Systems (Features 4, 5, 6\)  
 Goal: Meaningful reflection \+ continuity  
 Step 3.1: Personal Synthesis  
 \- Create lib/personal-synthesis.ts  
 \- Define milestones (5 arcs, pattern \> 7, etc.)  
 \- Create Samuel synthesis dialogue  
 Step 3.2: Unfinished Threads  
 \- Create lib/unfinished-threads.ts  
 \- Mark 2-3 nodes per character as session-end-points  
 \- Integrate with session boundary system  
 Step 3.3: Expand Check-Ins  
 \- Create check-in dialogue for remaining characters  
 \- Systematize the pattern from Maya's revisit  
 \---  
 Priority Ranking  
 | Feature                | Impact | Effort | Priority |  
 |------------------------|--------|--------|----------|  
 | 1\. "They're Waiting"   | High   | Low    | P0       |  
 | 3\. Delayed Gifts       | High   | Medium | P0       |  
 | 6\. Character Check-Ins | High   | Medium | P1       |  
 | 2\. Relationship Web    | Medium | Medium | P1       |  
 | 4\. Personal Synthesis  | Medium | Low    | P2       |  
 | 5\. Unfinished Threads  | Medium | Medium | P2       |  
 Recommended Approach: Implement P0 features first (Sprint 1), then P1  
 (Sprint 2-3), then P2 as polish.  
 \---  
 Success Metrics  
 After Engagement Loops:  
 \- Players feel "remembered" when returning  
 \- Choices feel consequential beyond immediate dialogue  
 \- Investment is visible (relationship web)  
 \- Characters feel alive between sessions  
 \- Natural return motivation without manipulation  
 Anti-Goals:  
 \- No FOMO mechanics ("you're missing out\!")  
 \- No punishment for absence  
 \- No artificial urgency  
 \- Engagement should feel earned, not extracted  
 \---  
 Phase 3: P0 Side Menu Features Sprint  
 Vision: Surface the rich existing systems (relationships, thoughts) that  
  are currently orphaned.  
 ISP \+ Netflix Discipline: Phase 1 research complete → minimal viable  
 implementation → validate.  
 \---  
 Completed Status  
 | Feature                                                | Status      |  
 |--------------------------------------------------------|-------------|  
 | Tier 1-3 (Consequence Web, Interrupts, Pattern Voices) | ✅ COMPLETE |  
 | Engagement Sprint 1 (Waiting, Gifts)                   | ✅ COMPLETE |
| P2: Relationship Web Visualization                     | ✅ COMPLETE |
| P3: Thought Cabinet & Logic                            | ✅ COMPLETE |
| P4: Ability System Expansion                           | ✅ COMPLETE |
| P5: Station Evolution (Tier 4)                         | ✅ COMPLETE |
| P6: Loyalty Experiences (Tier 5)                       | ✅ COMPLETE |
| P7: Final Polish                                       | ✅ COMPLETE |  
 \---  
 Phase 1 Research Findings  
 Finding 1: Relationship Web \- Data Rich, UI Missing  
 File: lib/character-relationships.ts (673 lines)  
 Existing infrastructure:  
 \- CHARACTER\_RELATIONSHIP\_WEB: 30+ CharacterRelationshipEdge objects  
 \- Each edge has: type, intensity, publicOpinion, privateOpinion,  
 memories\[\], dynamicRules, revealConditions  
 \- Helper functions already exist: getCharacterMention(),  
 getSharedMemory(), getCharacterConnections(),  
 checkRelationshipEvolution()  
 Gap: All this data exists but Journal doesn't visualize it. Players  
 can't see the web they're building.  
 Finding 2: Thought Cabinet \- Component Works, Data Orphaned  
 File: components/ThoughtCabinet.tsx (275 lines)  
 Working component with:  
 \- Mysteries section (locked thoughts)  
 \- Thoughts section (unlocked thoughts)  
 \- Progress tracking  
 \- Expand/collapse animations  
 Shows "Your mind is clear" because no thoughts are ever unlocked.  
 File: content/thoughts.ts (210 lines)  
 THOUGHT\_REGISTRY with 20+ thoughts defined:  
 \- 5 identity thoughts (threshold 5 trigger)  
 \- 15 pattern-specific thoughts (building, exploring, analytical,  
 helping, patience)  
 Gap: No dialogue nodes have onEnter.thoughtId set. Thoughts exist but  
 never trigger.  
 \---  
 P0 Implementation Plan  
 P0 \#1: Relationship Web Visualization  
 Goal: Connect CHARACTER\_RELATIONSHIP\_WEB data to existing  
 ConstellationPanel UI.  
 Current State (What Exists):  
 \- components/constellation/ConstellationGraph.tsx \- Radial layout with  
 Samuel spokes  
 \- components/constellation/ConstellationPanel.tsx \- Panel with  
 People/Skills tabs  
 \- components/constellation/DetailModal.tsx \- Shows trust level, NO  
 inter-character opinions  
 \- lib/character-relationships.ts \- 30+ edges with opinions (NOT   
 CONNECTED)  
 Implementation (Enhance Existing):  
 Step 1: Add inter-character edges to ConstellationGraph  
 File: components/constellation/ConstellationGraph.tsx (MODIFY)  
 \- Import CHARACTER\_RELATIONSHIP\_WEB from lib/character-relationships.ts  
 \- Render additional connection lines between characters (not just Samuel  
  spokes)  
 \- Show edges only when BOTH characters are met  
 \- Different line style for inter-character vs Samuel connections  
 Step 2: Enhance DetailModal with relationship opinions  
 File: components/constellation/DetailModal.tsx (MODIFY)  
 In CharacterDetail section:  
 \- Import getCharacterConnections from lib/character-relationships.ts  
 \- Add "What Others Think" section showing:  
   \- Public opinions (always visible if both met)  
   \- Private opinions (revealed at trust ≥6)  
 \- Show memories if unlocked  
 Step 3: Add relationships stats  
 File: hooks/useConstellationData.ts (MODIFY)  
 Add to return value:  
 \- relationshipsRevealed: number (count of revealed edges)  
 \- totalRelationships: number (count of possible edges)  
 Files to Modify:  
 \- components/constellation/ConstellationGraph.tsx (MODIFY \- add  
 inter-character edges)  
 \- components/constellation/DetailModal.tsx (MODIFY \- add opinions  
 section)  
 \- hooks/useConstellationData.ts (MODIFY \- add relationship stats)  
 \---  
 P0 \#2: Thought Cabinet Revival  
 Goal: Make thoughts actually unlock through gameplay.  
 Implementation (Minimal Viable):  
 Step 1: Add thought triggers to key dialogue nodes  
 Available thoughts in content/thoughts.ts:  
 \- Building: industrial-legacy, hands-on-truth, maker-mindset  
 \- Exploring: green-frontier, curious-wanderer, hidden-connections  
 \- Analytical: analytical-eye, pattern-seeker, question-everything  
 \- Helping: community-heart, empathy-bridge, collective-strength  
 \- Patience: long-game, steady-hand, trust-process  
 \- Identity (5): Auto-trigger at pattern threshold 5 ✅ ALREADY WORKING  
 Target nodes (moments of insight):  
 \- Maya building moment → maker-mindset  
 \- Devon systems explanation → pattern-seeker or analytical-eye  
 \- Grace presence moment → long-game or steady-hand  
 \- Elena troubleshooting → hands-on-truth  
 \- Samuel first wisdom → hidden-connections  
 Step 2: Wire onEnter to unlock thoughts  
 File: content/\*-dialogue-graph.ts (MODIFY)  
 Add to select nodes:  
 onEnter: {  
   thoughtId: 'thought\_id\_here'  
 }  
 Step 3: Verify ThoughtCabinet integration  
 File: components/ThoughtCabinet.tsx (VERIFY)  
 \- Already uses useGameSelectors.useThoughts()  
 \- Should automatically show thoughts when they're in state  
 \- May need minor fix to read from correct state path  
 Files to Modify:  
 \- content/maya-dialogue-graph.ts (ADD thoughtId to 1-2 nodes)  
 \- content/devon-dialogue-graph.ts (ADD thoughtId to 1-2 nodes)  
 \- content/grace-dialogue-graph.ts (ADD thoughtId to 1-2 nodes)  
 \- content/samuel-dialogue-graph.ts (ADD thoughtId to 2-3 nodes)  
 \- components/StatefulGameInterface.tsx (VERIFY thought unlocking logic)  
 \---  
 Execution Order  
 1\. P0 \#2 First (Thought Cabinet) \- Simpler, lower risk, validates side  
 menu is working  
 2\. P0 \#1 Second (Relationship Web) \- Builds on validated Journal  
 integration  
 \---  
 Success Criteria  
 P0 \#2 (Thought Cabinet): ✅ COMPLETE  
 \- Complete Maya arc → see new thought in Thought Cabinet  
 \- Pattern reaches 5 → see pattern-specific thought  
 \- Thoughts show unlocked state with animation  
 P0 \#1 (Relationship Web): ✅ COMPLETE  
 \- ConstellationGraph shows inter-character edges (not just Samuel  
 spokes)  
 \- DetailModal shows "What Others Think" with public opinions  
 \- High trust (≥6) → reveal private opinions with glow effect  
 \- Stats show relationship discovery progress  
 \---  
 Phase 4: Polish & Pacing (Next-Gen Principles)  
 Vision: Apply game design principles from the Next-Gen Guide to elevate  
 the experience from "systems that work" to "systems that feel right."  
 Source: "The Complete Guide to Next-Gen Game Design Mechanics" \- GDC  
 talks, developer interviews, design postmortems from Elden Ring, BOTW,  
 Ghost of Tsushima, Witcher 3, Mass Effect, Disco Elysium, etc.  
 \---  
 Core Principles Applied  
 From Open World Philosophy  
 "Our main idea is just to trust players." \- Miyazaki  
 \- Already doing: No quest logs, discovery-based reveals  
 \- Can improve: More environmental storytelling through dialogue details  
 From Quest Design (CDPR)  
 "Play, Show, Tell—always in that order." \- Paweł Sasko  
 \- Play: Meaningful choices  
 \- Show: Character reactions, emotion shifts  
 \- Tell: Only as fallback  
 "Create information hunger through deliberate absence of key   
 information."  
 \- Already doing: Trust-gated reveals, private opinions at ≥6  
 \- Can improve: More mystery hooks early in arcs  
 From Combat Feel (Applied to Dialogue)  
 "The feedback trinity: hitstop, screen shake, sound." \- Multiple sources  
 For dialogue games, this translates to:  
 \- Hitstop: Pause/beat before important reveals  
 \- Screen shake: Visual emphasis on key moments (already have interaction  
  animations)  
 \- Sound: Audio cues for trust changes, pattern shifts (not yet  
 implemented)  
 From Tension/Release Cycles  
 "Tension is a must-have in any artistic experience. But too much causes   
 exhaustion." \- John Rose  
 \- Map intensity curves per arc  
 \- Ensure Samuel hub provides "release" between intense arcs  
 \- Vary pacing—not every moment should be high stakes  
 From Choice Design  
 "The illusion of choice is better than choice... The Walking Dead   
 created the feeling of choice without giving actual choice." \- Nessa   
 Cannon  
 \- Focus on consequence VISIBILITY, not divergence quantity  
 \- Ensure choices have immediate reactions  
 \- Later callbacks ("Remember when you said...") amplify feeling of  
 impact  
 \---  
 Detailed Audit Tasks  
 Task 1: Play/Show/Tell Audit (P0)  
 Principle: CDPR's quest design hierarchy  
 Specific Targets:  
 | Character | Arc Length  | Known Issues                               |  
 |-----------|-------------|--------------------------------------------|  
 | Maya      | \~40 nodes   | Some exposition-heavy nodes about family   |  
 | Devon     | \~35 nodes   | Technical explanations can be "tell" heavy |  
 | Grace     | \~50 nodes   | Good balance (emotional arc)               |  
 | Elena     | \~30 nodes   | New arc, needs verification                |  
 | Samuel    | \~100+ nodes | Hub can feel exposition-y                  |  
 Red Flags to Find:  
 // BAD: Exposition dump with no choice  
 {  
   nodeId: 'character\_backstory',  
   content: \[{ text: "Long exposition..." }\],  
   choices: \[{ text: "Continue", nextNodeId: 'next' }\] // Fake choice  
 }  
 // GOOD: Information through interaction  
 {  
   nodeId: 'character\_backstory',  
   content: \[{ text: "Short hook..." }\],  
   choices: \[  
     { text: "Tell me more about X", ... },  // Player drives discovery  
     { text: "How did that feel?", ... },     // Emotional angle  
     { text: "What happened next?", ... }     // Story angle  
   \]  
 }  
 Implementation Steps:  
 1\. Run grep for nodes with single "Continue" choice  
 2\. Run grep for content arrays \>3 items (long monologues)  
 3\. For each flagged node:  
   \- Can we split into choice-driven discovery?  
   \- Can we convert "tell" to "show" (emotion, reaction)?  
   \- Is there a way to make player complicit in revealing info?  
 Files to Audit:  
 \- content/maya-dialogue-graph.ts  
 \- content/devon-dialogue-graph.ts  
 \- content/grace-dialogue-graph.ts  
 \- content/elena-dialogue-graph.ts  
 \- content/samuel-dialogue-graph.ts  
 \- All other content/\*-dialogue-graph.ts  
 Success Criteria:  
 \- No nodes with only "Continue" choice (unless intentional beat)  
 \- No monologues \>4 content items without player input  
 \- Every major choice shows character reaction (emotion change, dialogue  
 shift)  
 \---  
 Task 2: Consequence Visibility Enhancement (P0)  
 Principle: "The feeling of impact matters more than actual divergence"  
 Current Systems (Already Built):  
 | System             | Visibility         | Enhancement Needed  
           |  
 |--------------------|--------------------|-----------------------------  
 \----------|  
 | Trust changes      | Constellation glow | Add in-moment feedback  
           |  
 | Pattern tracking   | Journal stats      | Pattern voices help, but add  
  UI pulse |  
 | Consequence echoes | Character dialogue | Working well  
           |  
 | Delayed gifts      | Surprise callbacks | Add source attribution  
           |  
 Implementation Steps:  
 Step 2.1: Trust Change Micro-Feedback  
 // In StatefulGameInterface.tsx, when trust changes:  
 // Add subtle visual \+ optional audio cue  
 interface TrustFeedback {  
   characterId: CharacterId  
   change: number  
   // Visual: Brief glow on character portrait/name  
   // Audio: Subtle chime (positive) or minor key (negative)  
 }  
 Files to Modify:  
 \- components/StatefulGameInterface.tsx \- Detect trust changes, trigger  
 feedback  
 \- components/DialogueDisplay.tsx or new  
 components/game/TrustFeedback.tsx \- Visual component  
 \- Consider: Audio hooks (optional, can defer)  
 Step 2.2: Delayed Gift Source Attribution  
 // Current delayed gift:  
 { text: "Maya told me about your advice." }  
 // Enhanced with source context:  
 {  
   text: "Maya told me about your advice.",  
   giftContext: {  
     sourceChoice: "You told Maya to take her time",  
     sourceCharacter: "maya",  
     timestamp: "3 interactions ago"  
   }  
 }  
 Files to Modify:  
 \- lib/delayed-gifts.ts \- Add source context to gift structure  
 \- components/DialogueDisplay.tsx \- Render gift attribution subtly  
 Step 2.3: Pattern Shift Indicator  
 When pattern threshold crosses (e.g., analytical reaches 5):  
 \- Brief UI indication ("Something shifts in how you see the world...")  
 \- Links to thought cabinet reveal  
 Files to Modify:  
 \- components/StatefulGameInterface.tsx \- Detect pattern threshold  
 crossings  
 \- components/game/PatternShiftIndicator.tsx \- New component (optional)  
 Success Criteria:  
 \- Trust changes have visible in-moment feedback  
 \- Delayed gifts attribute their source ("Remember when you...")  
 \- Pattern threshold crossings feel like moments of identity emergence  
 \---  
 Task 3: Discovery Interval Mapping (P1)  
 Principle: BOTW targets \~40 seconds between discoveries  
 For Dialogue Games: \~45-60 seconds of reading \= \~200-300 words \= \~3-4  
 dialogue exchanges  
 Discovery Types:  
 1\. Pattern voice interjection \- Already built, trigger conditions in  
 lib/pattern-voices.ts  
 2\. Consequence echo \- Already built, conditions in  
 lib/consequence-echoes.ts  
 3\. Thought unlock \- Already wired, thoughtId in dialogue nodes  
 4\. Character insight \- Emotional revelation, backstory piece  
 5\. Interrupt opportunity \- Built, need to audit coverage  
 6\. Trust milestone \- Crossing 3, 5, 7, 9 should feel significant  
 Implementation Steps:  
 Step 3.1: Arc Timeline Mapping  
 For each character arc, create timeline:  
 Node 1 → Node 2 → Node 3 → Node 4 → ...  
   ↓        ↓        ↓        ↓  
  \[D\]      \[ \]      \[D\]      \[ \]    ← D \= Discovery moment  
 Target: No more than 3 consecutive nodes without a discovery.  
 Step 3.2: Add Pattern Voice Triggers to Dead Zones  
 // In lib/pattern-voices.ts, add triggers for:  
 \- First meeting moments (each character)  
 \- Emotional peak moments  
 \- Decision points  
 \- Post-decision reflections  
 Step 3.3: Add Interrupt Opportunities  
 Current interrupts: Grace's arc has examples  
 Expand to: Devon (technical moment), Maya (family moment), Elena  
 (troubleshooting)  
 Files to Audit/Modify:  
 \- content/\*-dialogue-graph.ts \- Map node sequences  
 \- lib/pattern-voices.ts \- Add triggers for dead zones  
 \- content/pattern-voice-library.ts \- Add voice content  
 Success Criteria:  
 \- No character arc has \>3 consecutive "plain" nodes  
 \- Each arc has at least 2 interrupt opportunities  
 \- Pattern voices trigger at emotionally appropriate moments  
 \---  
 Task 4: Tension/Release Cycle Design (P1)  
 Principle: Intensity variation—peaks feel more powerful through contrast  
 Intensity Scale:  
 | Level | Description        | Example                          |  
 |-------|--------------------|----------------------------------|  
 | 1     | Quiet, reflective  | Samuel hub, post-arc             |  
 | 2     | Light conversation | Getting to know character        |  
 | 3     | Building tension   | Character reveals conflict       |  
 | 4     | High stakes        | Key decision, emotional peak     |  
 | 5     | Climax             | Arc resolution, interrupt moment |  
 Ideal Arc Shape:  
 Intensity  
 5 |           \*  
 4 |       \*       \*  
 3 |   \*               \*  
 2 | \*                   \*  
 1 |                       \*  
   \+-----------------------→ Time  
     Intro  Build  Peak  Resolution  
 Anti-Pattern (Flat High):  
 5 | \* \* \* \* \* \* \* \*  ← Exhausting  
 Anti-Pattern (Flat Low):  
 1 | \* \* \* \* \* \* \* \*  ← Boring  
 Implementation Steps:  
 Step 4.1: Tag Nodes with Intensity  
 Add metadata to dialogue nodes:  
 {  
   nodeId: 'grace\_mrs\_patterson\_story',  
   metadata: {  
     intensity: 5,  // Peak emotional moment  
     pacing: 'slow' // Allow player to absorb  
   }  
 }  
 Step 4.2: Ensure Samuel Hub is Release Zone  
 After intense arc completion:  
 \- Samuel's tone should be warm, reflective  
 \- No immediate high-stakes decisions  
 \- Allow player to "breathe"  
 Step 4.3: Add "Quiet Beats" Where Missing  
 If arc goes 4→5→5→4, inject 3 between:  
 4→3→5→3→4 (breathing room around climax)  
 Files to Modify:  
 \- lib/dialogue-graph.ts \- Add intensity to metadata schema  
 \- content/\*-dialogue-graph.ts \- Tag nodes with intensity  
 \- content/samuel-dialogue-graph.ts \- Ensure hub nodes are low intensity  
 Success Criteria:  
 \- Each arc has identifiable intensity curve  
 \- No arc has \>3 consecutive intensity-5 nodes  
 \- Samuel hub consistently provides release after intense arcs  
 \---  
 Task 5: Choice Count Optimization (P2)  
 Principle: Avoid choice paralysis—3-4 meaningful choices max  
 Current State Analysis:  
 Run: grep \-c "choiceId" content/\*-dialogue-graph.ts  
 Ideal Distribution:  
 \- 2 choices: Binary decision, clear contrast  
 \- 3 choices: Nuanced decision, different angles  
 \- 4 choices: Maximum for complex moments  
 \- 5+ choices: Too many—use visibility conditions  
 Implementation Steps:  
 Step 5.1: Find Nodes with 5+ Choices  
 \# Script to find nodes with many choices  
 grep \-B5 "choices:" content/\*.ts | grep \-A50 "choices:" | grep \-c  
 "choiceId"  
 Step 5.2: Reduce Using Visibility Conditions  
 // Instead of 6 always-visible choices:  
 choices: \[  
   { text: "Option A", visibleCondition: { hasGlobalFlags: \['met\_maya'\] }  
  },  
   { text: "Option B", visibleCondition: { lacksGlobalFlags: \['met\_maya'\]  
  } },  
   // ... context-aware options  
 \]  
 Step 5.3: Ensure Pattern Diversity  
 Each choice set should cover different patterns:  
 \- Analytical choice  
 \- Helping choice  
 \- Exploring choice  
 \- Building choice  
 \- Patience choice  
 (Not all 5 needed, but at least 2-3 distinct approaches)  
 Files to Modify:  
 \- content/\*-dialogue-graph.ts \- Reduce choice counts, add visibility  
 conditions  
 Success Criteria:  
 \- No nodes with \>5 visible choices  
 \- All 4+ choice nodes use visibility conditions where appropriate  
 \- Each choice set represents meaningfully different approaches  
 \---  
 New Feature: Information Hunger Hooks (P1)  
 Principle: "Facilitate desire to work for the next piece of story  
 through deliberate absence"  
 Implementation:  
 Add "mystery hooks" early in arcs that pay off later:  
 // Early in arc:  
 { text: "There's something I haven't told anyone here..." }  
 // Choice to pursue or not  
 // Later, if player built trust:  
 { text: "Remember when I said there was something? Well..." }  
 Files to Modify:  
 \- content/\*-dialogue-graph.ts \- Add early mystery hooks  
 \- lib/consequence-echoes.ts \- Add echo for "mystery resolved"  
 \---  
 New Feature: Small Humanlike Moments (P1)  
 Principle: "Body language creates bonds without heavy budget"  
 For Dialogue: Micro-actions in text that show character behavior  
 Examples:  
 // Instead of:  
 { text: "I appreciate that." }  
 // Use:  
 { text: "\*She pauses, looking down at her hands.\* I appreciate that." }  
 // Or with emotion/interaction:  
 {  
   text: "I appreciate that.",  
   emotion: 'grateful',  
   interaction: 'nod',  // Triggers avatar animation  
   microAction: "She brushes hair behind her ear"  // NEW: Inline action  
 }  
 Implementation:  
 Add microAction field to DialogueContent:  
 interface DialogueContent {  
   text: string  
   emotion?: string  
   interaction?: string  
   microAction?: string  // NEW: Brief physical description  
 }  
 Render: Prepend microAction to text in italics  
 Files to Modify:  
 \- lib/dialogue-graph.ts \- Add microAction to interface  
 \- components/DialogueDisplay.tsx \- Render microAction  
 \- content/\*-dialogue-graph.ts \- Add microActions to key emotional  
 moments  
 \---  
 Implementation Priority  
 Immediate (Before Next Feature Work)  
 1\. Commit unstaged work (thoughtId \+ relationship edges)  
 2\. Task 2: Consequence Visibility (trust feedback, gift attribution)  
 Short-Term (P0)  
 3\. Task 1: Play/Show/Tell Audit (find and fix exposition dumps)  
 Medium-Term (P1)  
 4\. Task 3: Discovery Interval Mapping  
 5\. Task 4: Tension/Release Cycle Design  
 6\. Information Hunger Hooks  
 7\. Small Humanlike Moments  
 Polish (P2)  
 8\. Task 5: Choice Count Optimization  
 \---  
 Commit Plan  
 Commit 1: Current unstaged work  
 feat(coverage): full character coverage for thoughts and relationships  
 \- Add thoughtId to 8 additional character arcs  
 \- Add 18 relationship edges for Jordan, Kai, Silas, Alex, Grace, Elena  
 \- Enhance ConstellationGraph with inter-character relationship lines  
 \- Add "What Others Think" section to DetailModal  
 \- Add relationshipStats to useConstellationData hook  
 Commit 2: Consequence visibility  
 feat(feedback): enhance consequence visibility  
 \- Add trust change micro-feedback  
 \- Add source attribution to delayed gifts  
 \- Add pattern threshold crossing indicator  
 Commit 3: Play/Show/Tell fixes  
 fix(dialogue): apply Play/Show/Tell audit fixes  
 \- Convert exposition dumps to choice-driven discovery  
 \- Add character reactions to all major choices  
 \- Remove or enhance fake choices  
 Commit 4: Discovery intervals  
 feat(pacing): implement discovery interval coverage  
 \- Add pattern voice triggers to dead zones  
 \- Add interrupt opportunities to Devon, Maya, Elena arcs  
 \- Map and verify \<60 second discovery intervals  
 \---  
 Success Metrics (Phase 4 Complete)  
 Quantitative:  
 \- 0 nodes with only "Continue" choice  
 \- 0 monologues \>4 content items without player input  
 \- 0 arcs with \>3 consecutive plain nodes  
 \- 0 nodes with \>5 visible choices  
 \- 100% of major choices have visible reaction  
 Qualitative:  
 \- Trust changes feel impactful in the moment  
 \- Delayed gifts feel like meaningful callbacks  
 \- Pattern voices feel like player's emerging identity  
 \- Arcs have satisfying tension/release rhythm  
 \- Player never goes \>60 seconds without "something happening"  
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌  
