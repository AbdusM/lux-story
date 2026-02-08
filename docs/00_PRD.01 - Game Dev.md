Below is a **game-development–focused deep dive** on **Clair Obscur: Expedition 33**—covering **production history, team/pipeline strategy, tech stack, systems design, narrative/cinematics infrastructure, audio, performance**, and **post-launch operations** (as far as it’s publicly documented).

---

## **1\) Project snapshot**

**What it is:** A premium, single‑player RPG that blends **turn-based combat** with **real-time “reaction” mechanics** (dodge/parry/counter, timed attack rhythms, free-aim weak-point targeting). ([Expedition 33](https://www.expedition33.com/overview))  
**Developer:** **Sandfall Interactive** (France; studio publicly references Montpellier). ([Reallusion Magazine](https://magazine.reallusion.com/2021/06/09/pitch-produce-project-w-sandfall-interactive-studios-develops-ambitious-rpg-game-with-real-time-tools/))  
**Publisher:** **Kepler Interactive**. ([GamesBeat](https://gamesbeat.com/kepler-interactive-begins-2023-with-new-partnerships/))  
**Engine:** **Unreal Engine 5**. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))  
**Launch:** **April 24, 2025** (official site \+ platform rollout reporting). ([Expedition 33](https://www.expedition33.com/overview))  
**Platforms:** PS5, Xbox Series X|S, Windows PC (Steam/Epic mentioned in multiple places). ([Expedition 33](https://www.expedition33.com/overview))  
**Business note:** Widely reported the game was built with a **very small core team** and leveraged **outsourcing/partners** (important for understanding how it was produced). ([GameSpot](https://www.gamespot.com/articles/clair-obscur-expedition-33-budget-was-under-10-million-report/1100-6536874/))

---

## **2\) Production timeline (what’s known publicly)**

This is useful because it explains *why* certain pipeline decisions were made (Blueprint-heavy logic, Sequencer-first combat presentation, early character tooling, etc.).

* **Founded / early phase:** Sandfall describes itself as founded in **2020** in France. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))  
* **2021 (Project W era):** The game was previously shown/known as **Project W** in studio communications and third-party coverage, with a strong emphasis on real-time character tools and UE integration. ([Reallusion Magazine](https://magazine.reallusion.com/2021/06/09/pitch-produce-project-w-sandfall-interactive-studios-develops-ambitious-rpg-game-with-real-time-tools/))  
* **April 2021–March 2022 scale-up \+ vertical slice:** Sandfall’s March 2022 update describes moving from Paris to Montpellier (April 2021), team expansion (from \~6 to \>15), and being close to a **vertical slice demo** (“more than one hour of gameplay”). ([Sandfall Interactive](https://www.sandfall.co/post/march-2022-update-latest-news-from-sandfall))  
* **Funding/Support (early):** Publicly thanked supporters include **Epic MegaGrant ($50k)** plus French and regional support (CNC; Occitanie Region), plus angels/friends/family. ([Sandfall Interactive](https://www.sandfall.co/post/march-2022-update-latest-news-from-sandfall))  
* **Kepler publishing partnership:** Sandfall announced in March 2023 that Project W would be published by Kepler, describing Kepler as “co‑owned and run by developers.” ([Sandfall Interactive](https://www.sandfall.co/post/march-2023-update-project-w-to-be-published-by-kepler-interactive))  
* **Announcement window:** The PlayStation blog post (June 2024\) frames the title reveal period and details the game’s premise \+ combat goals.  
* **“Gone gold”:** Official post: March 22, 2025\. ([Expedition 33](https://www.expedition33.com/post/33-days-to-go-expedition-33-has-gone-gold))  
* **Release:** April 24, 2025\. ([Expedition 33](https://www.expedition33.com/overview))  
* **Major free content update:** December 11, 2025 (“Thank You Update”) with a new level and major features (including Photo Mode). ([PlayStation.Blog](https://blog.playstation.com/2025/12/11/new-clair-obscur-expedition-33-content-available-today-including-versos-drafts-level/))

---

## **3\) Studio \+ team strategy (how a “small core” shipped something huge)**

A lot of the “how did they build this?” story is basically **scope discipline \+ tool leverage \+ selective outsourcing**.

### **Core-team philosophy**

Sandfall leadership has repeatedly emphasized **staying small/agile** (and not just ballooning headcount post-success). ([PC Gamer](https://www.pcgamer.com/games/rpg/id-prefer-working-as-a-small-team-clair-obscur-expedition-33-devs-think-their-studio-is-just-the-right-size-with-no-real-plans-to-expand-it-yet/))

### **Scope choice as a production tactic**

Reporting tied to a New York Times piece (via GameSpot) says they conserved resources by **avoiding an open-world setup** and leaning into a structure that supports a more controllable content footprint. ([GameSpot](https://www.gamespot.com/articles/clair-obscur-expedition-33-budget-was-under-10-million-report/1100-6536874/))  
This aligns with what you see in their UE interviews: intense focus on **cinematics, authored presentation, and quality-per-minute**.

### **Outsourcing: treated as “containable” work packages**

Multiple sources discuss outsourcing without portraying it as “they outsourced the whole game”—more like **targeted external help** (QA, localization, some animation, marketing support). ([GameSpot](https://www.gamespot.com/articles/clair-obscur-expedition-33-budget-was-under-10-million-report/1100-6536874/))  
A concrete example: **QLOC** publicly lists the title as a **QA project**. ([QLOC](https://q-loc.com/projects/clair-obscur-expedition-33/))

**Why this matters (dev standpoint):**  
This is a classic “small strike team \+ external specialists” structure: keep **creative cohesion** (combat feel, art direction, narrative tone) internal, while scaling **throughput** via partners for well-defined deliverables (QA, localization, some animation, etc.). ([GameSpot](https://www.gamespot.com/articles/clair-obscur-expedition-33-budget-was-under-10-million-report/1100-6536874/))

---

## **4\) Core pillars & gameplay loop (systems view)**

### **The “reactive turn-based” identity**

Official positioning is very consistent:

* **Turn-based core** (party building, skills, builds, gear, stats, synergies)  
* **Real-time layer**: dodge/parry/counter, “attack rhythm” timing, and a **free-aim** weak-point system. ([Expedition 33](https://www.expedition33.com/overview))

This hybrid approach has a huge downstream impact on implementation:

* You need deterministic turn logic **and** high-responsiveness input windows.  
* Animation \+ VFX \+ camera need to support “combat as performance,” not just math resolution.

### **Party/build system (what’s explicitly described)**

The official overview emphasizes:

* Build your party; **level up six characters**  
* “Unique builds” via **gear, stats, skills, character synergies** ([Expedition 33](https://www.expedition33.com/overview))

### **World & tone (design target)**

The setting is pitched as fantasy inspired by **Belle Époque France** with surreal enemies and painterly aesthetics, which heavily informs environment art, lighting, and color scripting. ([Expedition 33](https://www.expedition33.com/overview))

---

## **5\) Narrative & story infrastructure (what the story *needs* technically)**

### **Premise (story constraint that drives everything)**

The core narrative hook is the **Paintress** and her annual ritual: she paints a number, and people of that age disappear; “33” is the current year, and Expedition 33 goes to end the cycle. ([Expedition 33](https://www.expedition33.com/overview))

### **Character pipeline as “production pipeline”**

Sandfall’s official character bios show each main party member has a clear role fantasy (engineer/defender, scholar/mage, warrior/teacher, etc.) and relationship arcs (e.g., Gustave/Maelle). ([Expedition 33](https://www.expedition33.com/overview/characters))

**From a dev standpoint**, the game’s narrative ambitions imply:

* Heavy **cinematic coverage**  
* Tight **performance capture / facial fidelity**  
* A content pipeline where writing → VO → cinematic staging is efficient and repeatable

And Sandfall explicitly confirms they designed around that:

* They call out **Sequencer** as “key” because the game has many cinematics and character importance. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))  
* Their combat presentation treats each move as a cinematic unit (more below), which is basically “storytelling grammar” applied to battle. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

---

## **6\) Tech stack overview (what they used, and *why it fits their constraints*)**

### **Engine: Unreal Engine 5**

This is not just a “rendering” choice; it shaped staffing and workflow.

#### **Blueprints as the core gameplay layer**

Sandfall explicitly states:

* **All the core logic** ended up in **Blueprints**, *including features created by programmers*, because it accelerated iteration and matched their manpower realities. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))

That’s a very strong statement, and it implies:

* Their gameplay architecture likely emphasizes Blueprint maintainability (clear interfaces, data assets, modular components).  
* C++ is probably used for performance-critical primitives and engine-level hooks, but the “game” lives in BP.

#### **Sequencer as a foundational system (not “just cutscenes”)**

They state Sequencer was **key** for their engine choice. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))

In the deep-dive dev interview, they go further:

* **Each move is a Level Sequence** (combat skills built as authored sequences), with Sequencer providing predictable, cross-discipline control over animation, VFX, camera, and timings. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

**Dev takeaway:** This turns combat into a content pipeline where designers/cinematics/VFX/audio can collaborate inside a shared timeline tool.

---

## **7\) Combat presentation architecture (how it’s built to look/feel the way it does)**

This is one of the most “distinctive” production decisions and it’s unusually well documented.

### **“Each move is a level sequence”**

Sandfall’s UE interview describes building combat actions as **Level Sequences** and emphasizes Sequencer as “the backbone” that makes it manageable (animation tracks, camera, events, etc.). ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

### **Dynamic Binding (reusability)**

They mention using **Dynamic Binding** so sequences can be re-used across actors (not hard-bound to one entity). ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

### **Why this is smart for a small team**

Because it reduces the “integration tax”:

* Combat designers can author timings  
* VFX can lock to frames  
* Audio can sync precisely  
* Cinematics/camera can make every skill “feel expensive”

Without requiring a huge engineering layer for every unique move.

---

## **8\) World/level streaming & traversal (technical world design)**

### **World Partition**

Sandfall describes World Partition as enabling:

* World divided into streaming cells  
* Multiple artists working simultaneously without locking whole levels  
* Better memory/CPU/GPU outcomes ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))

They also give a concrete team constraint:

* Environment team was often **3–5 people** depending on phase, making “locking a full level” a major contention risk. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))

### **Traversal edge case: flying mount navigation**

Their UE deep dive describes a tricky problem: building an overworld traversal system that includes a **flying mount** and required:

* Efficient collision for large world map travel  
* A dedicated or “second” NavMesh for the mount  
* Tooling to simplify collision shapes for big environment objects (for performance). ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

If you’re thinking like a systems designer: that’s “open-world-like traversal” complexity—handled with very specific tech and tooling, without necessarily going full open-world everywhere.

---

## **9\) Rendering, lighting, and art pipeline (how they achieved the look)**

### **UE5 feature leverage: Nanite \+ Lumen**

They directly credit UE5 flagship features as essential for a small team:

* **Nanite** reduces the burden of manual LOD creation. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))  
* **Lumen** supports dynamic lighting—but migration required work.

Creative Bloq reports:

* They upgraded from **UE4 → UE5** when UE5 released (2022) and called it a “game changer.”  
* The switch created pain (plugins not working; “redo a lot of lighting… basically everything,” with Lumen). ([Creative Bloq](https://www.creativebloq.com/3d/video-game-design/using-unreal-engine-5-can-be-a-trap-says-the-dev-behind-clair-obscur-expedition-33))

### **“Spend time where players look”**

Creative Bloq also describes an art strategy:

* Use available/free environment assets and rework them into their style  
* Put effort into landmark/hero shapes; don’t over-invest in unseen detail ([Creative Bloq](https://www.creativebloq.com/3d/video-game-design/using-unreal-engine-5-can-be-a-trap-says-the-dev-behind-clair-obscur-expedition-33))

This lines up with Guillermin’s comments about the UE ecosystem and asset marketplaces (including Fab) being useful for getting free/paid assets. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))

---

## **10\) Character creation \+ performance pipeline (Reallusion → MetaHuman evolution)**

This is one of the clearest “toolchain evolution” stories you’ll find in a modern RPG.

### **Early pipeline (Project W era): Reallusion \+ mocap ecosystem**

Reallusion’s 2021 feature story says Sandfall used:

* **Character Creator** (+ SkinGen)  
* **iClone**  
* **Rokoko Smartsuit profile for iClone**  
* **ActorCore** motion library  
  …and targeted Unreal integration (mentioning UE skeleton compatibility). ([Reallusion Magazine](https://magazine.reallusion.com/2021/06/09/pitch-produce-project-w-sandfall-interactive-studios-develops-ambitious-rpg-game-with-real-time-tools/))

### **UE5 era: MetaHuman \+ MetaHuman Animator**

Creative Bloq reports:

* They moved to **MetaHuman** for high-fidelity characters  
* Switching from Character Creator to MetaHuman needed “hacks” to resculpt while preserving facial rigs (early MetaHuman customization limits). ([Creative Bloq](https://www.creativebloq.com/3d/video-game-design/using-unreal-engine-5-can-be-a-trap-says-the-dev-behind-clair-obscur-expedition-33))

In Sandfall’s UE5 deep dive, they describe:

* A custom **“sandfall metahuman base model”** with animation blueprint micro‑movements, look-at, facial micromovements, etc.  
* Using **MetaHuman Animator** for facial animation and performance capture  
* A material system for **dirt/blood/sweat/tears** layers. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

**Dev takeaway:** Their character fidelity is not “just MetaHuman.” It’s MetaHuman \+ custom base \+ animation blueprint work \+ material layering \+ capture pipeline.

---

## **11\) Performance & optimization toolchain**

Sandfall’s UE deep dive explicitly references:

* **Unreal Insights** as a key performance tool for profiling and improving end-user performance. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))  
* Performance-minded UE features: **Virtual Textures**, **Virtual Shadow Maps**, **PSO precaching**. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

They also cite day-to-day productivity infrastructure:

* Access to full source code and using **Unreal Game Sync** daily for workflow. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

---

## **12\) Audio & music systems (composition \+ runtime implementation)**

### **Runtime audio system in UE5**

Their UE deep dive describes an interactive music approach:

* A “music manager” Blueprint controlling **music contexts**  
* Tracks that can switch based on gameplay events (ambush, victory, etc.)  
* Use of **MetaSounds presets**, **markers** in audio files, and UE audio tools like **Submixes** and **Audio Modulation** to produce multiple “mixes” of a track. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

### **Composition pipeline \+ credits footprint**

Official soundtrack postings credit **Lorien Testard** and **Alice Duport‑Percier** (and show the scale of the album). ([Clair Obscur Expedition 33](https://clairobscurexpedition33.bandcamp.com/album/clair-obscur-expedition-33-original-soundtrack))

The December 2025 content update post also explicitly calls out new music being added for the new level. ([PlayStation.Blog](https://blog.playstation.com/2025/12/11/new-clair-obscur-expedition-33-content-available-today-including-versos-drafts-level/))

---

## **13\) Voice, performance capture, and “who actually made the performances”**

### **Voice cast (official)**

Sandfall and PlayStation communications list major cast members including:

* Charlie Cox (Gustave), Jennifer English (Maelle), Andy Serkis (Renoir), Ben Starr (Verso), etc. ([Expedition 33](https://www.expedition33.com/post/meet-our-english-voice-cast))

### **Voice production as an internal role**

The PlayStation cast post is written by **Jennifer Svedberg‑Yen**, explicitly titled **Lead Writer and Voice Producer**, which indicates voice production was handled as an in-house discipline (not purely publisher-side). ([PlayStation.Blog](https://blog.playstation.com/2024/10/16/introducing-the-cast-of-clair-obscur-expedition-33/))

### **Important industry nuance: mocap/performance contributors**

A recurring point in 2025 coverage: crediting only “big name voices” can erase the work of performance capture actors and external teams; multiple industry discussions pushed back on the “under 30 devs made everything” narrative. ([PC Gamer](https://www.pcgamer.com/gaming-industry/no-geoff-keighley-clair-obscur-expedition-33-was-not-made-by-a-team-of-under-30-developers-and-devs-say-repeating-the-myth-is-a-dangerous-path/))

---

## **14\) Post-launch content & live operations (what shipped after 1.0)**

The December 11, 2025 PlayStation blog post (by Guillaume Broche) is unusually detailed about what was added and how.

### **“Thank You Update” highlights (free)**

* New level: **“Verso’s Drafts”** (new environments, battles, cutscenes) ([PlayStation.Blog](https://blog.playstation.com/2025/12/11/new-clair-obscur-expedition-33-content-available-today-including-versos-drafts-level/))  
* New music tracks for the level ([PlayStation.Blog](https://blog.playstation.com/2025/12/11/new-clair-obscur-expedition-33-content-available-today-including-versos-drafts-level/))  
* Unlockables: **13 weapons**, **16 Luminas**, costumes/hairstyles ([PlayStation.Blog](https://blog.playstation.com/2025/12/11/new-clair-obscur-expedition-33-content-available-today-including-versos-drafts-level/))  
* **Photo Mode** (notable technical freedoms: can be used during cinematics; camera can travel “infinite distance without collision,” allowing “backstage” access) ([PlayStation.Blog](https://blog.playstation.com/2025/12/11/new-clair-obscur-expedition-33-content-available-today-including-versos-drafts-level/))  
* QoL: Lumina search filters, saved loadouts, abandon battle option ([PlayStation.Blog](https://blog.playstation.com/2025/12/11/new-clair-obscur-expedition-33-content-available-today-including-versos-drafts-level/))  
* Late-game content: additional boss battles \+ Endless Tower rewards ([PlayStation.Blog](https://blog.playstation.com/2025/12/11/new-clair-obscur-expedition-33-content-available-today-including-versos-drafts-level/))

**Dev takeaway:** Photo mode design here is a deliberate “give the player the keys” decision, even at the risk of exposing behind-the-scenes spaces—something many studios avoid. ([PlayStation.Blog](https://blog.playstation.com/2025/12/11/new-clair-obscur-expedition-33-content-available-today-including-versos-drafts-level/))

---

## **15\) Budget, pricing, and “indie” discourse (production reality)**

### **Budget reporting**

GameSpot (citing NYT) reports:

* Budget **“less than $10 million”**  
* They conserved resources by avoiding open world  
* Core team about **30**, with **battle animations outsourced** to a Korean studio  
* External teams helped with marketing/localization; credits include hundreds of contributors. ([GameSpot](https://www.gamespot.com/articles/clair-obscur-expedition-33-budget-was-under-10-million-report/1100-6536874/))

### **Pricing**

That same report notes the title’s price point being **$50** rather than typical $70+ for many AAA releases. ([GameSpot](https://www.gamespot.com/articles/clair-obscur-expedition-33-budget-was-under-10-million-report/1100-6536874/))

### **Why devs talk about this**

Because it demonstrates a repeatable production pattern:

* Keep scope and structure controlled  
* Invest heavily in art direction, presentation, and systems depth  
* Use modern engines \+ marketplace ecosystems to multiply output ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))

---

## **16\) Controversies relevant to development (AI \+ “small team myth”)**

If you’re researching “everything from a dev standpoint,” you should include these—not as drama, but as **pipeline governance lessons**.

### **“Mythologically small teams”**

There was notable pushback in 2025 against the idea the game was made by “under 30 devs,” because it minimizes outsourced and partner contributions and can create harmful expectations for staffing/budget. ([PC Gamer](https://www.pcgamer.com/gaming-industry/no-geoff-keighley-clair-obscur-expedition-33-was-not-made-by-a-team-of-under-30-developers-and-devs-say-repeating-the-myth-is-a-dangerous-path/))

### **Generative AI policy clash**

Some awards bodies reportedly rescinded awards due to confirmed generative AI use (with discussion about assets being removed later, but disqualification standing). ([The Verge](https://www.theverge.com/news/849144/indie-game-awards-game-of-the-year-expedition-33-generative-ai-chantey-modretro))

**Dev takeaway:** If you use gen-AI anywhere in the pipeline, you need:

* Clear internal documentation of where/why  
* A disclosure policy aligned with platform holders/awards rules  
* Asset provenance tracking

---

## **17\) What you can “learn and reuse” as a game dev**

Here are the most transferable technical/production patterns that Expedition 33 publicly demonstrates:

1. **Blueprint-first production** can work at high quality if you treat BP like “real code” (modularity, conventions, profiling) and reserve C++ for engine-level needs. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))  
2. **Sequencer as a gameplay tool** (not just cutscenes): building combat actions as Level Sequences creates a shared timeline language across design/animation/VFX/audio/camera. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))  
3. **World Partition** is as much a *team collaboration* feature as it is a streaming feature—especially with a 3–5 person environment team. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/clair-obscur-expedition-33-autonomy-creativity-and-community-key-to-sandfall-interactives-success))  
4. **Migration costs are real** (UE4 → UE5): plan for broken plugins, lighting redo, and workflow disruption—*even if the end payoff is massive*. ([Creative Bloq](https://www.creativebloq.com/3d/video-game-design/using-unreal-engine-5-can-be-a-trap-says-the-dev-behind-clair-obscur-expedition-33))  
5. **Evolving character tooling is normal**: start with commercially available character \+ mocap tools (Reallusion ecosystem), then migrate to MetaHuman when fidelity \+ pipeline maturity justify it. ([Reallusion Magazine](https://magazine.reallusion.com/2021/06/09/pitch-produce-project-w-sandfall-interactive-studios-develops-ambitious-rpg-game-with-real-time-tools/))  
6. **Optimization tool literacy** (Unreal Insights, PSO precaching, VT/VSM) is mandatory when you’re aiming for AAA visuals with a small team. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

---

## **18\) Gaps: what *isn’t* publicly documented in detail**

Even with unusually good interviews, some specifics aren’t clearly public:

* Exact internal architecture (Gameplay Ability System vs custom ability system, data model, save system design)  
* Exact content structure (number of levels, quest system internals, dialogue branching rules)  
* Tooling stack outside UE (Jira vs Linear, Perforce vs Git, build farm details) — though Unreal Game Sync usage strongly suggests a Perforce-centered workflow is plausible; still, not formally stated beyond UGS usage. ([Unreal Engine](https://www.unrealengine.com/en-US/developer-interviews/inside-the-development-journey-of-clair-obscur-expedition-33))

If you tell me what you’re trying to do with this research (e.g., **benchmarking pipelines, designing a similar combat system, estimating staffing, building a pitch**), I can re-format the above into:

* a **one-page production teardown**  
* a **combat system blueprint (turn loop \+ real-time reaction windows)**  
* or a **tech-stack checklist** you can apply to another project.

