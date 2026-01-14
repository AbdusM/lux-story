# Lux Story: The Worldbuilding OS
> A high-fidelity sci-fi RPG that functions as a stealth career assessment platform for the 2030 workforce.

**Status**: ✅ Fully Operational (v1.0)
**Live Demo**: [https://career-exploration-birmingha.lux-story.pages.dev](https://career-exploration-birmingha.lux-story.pages.dev)

---

## 🌌 The Concept
Lux Story is a "Trojan Horse" for education. It looks, feels, and plays like a premium indie game (inspired by *Disco Elysium* and *Mass Effect*), but every interaction invisibly tracks **Future Skills** defined by the World Economic Forum.

### The "Heart & Hands" Engine
The system uses a unique hybrid architecture:
1.  **The Heart (Narrative)**: A graph-based dialogue engine where choices reveal character.
2.  **The Hands (Simulation)**: Real-world job simulations (Coding, Triage, Negotiation) embedded directly into the story.

---

## 🎮 Key Capabilities

### 1. Psychological Depth ("The Disco Mechanics")
*   **Pattern Voices**: Your dominant stats (Analytical, Helping, etc.) "speak" to you via inner monologue.
*   **Dynamic Mirroring**: NPCs change their tone and body language based on who you are becoming.

### 2. Cinematic Agency ("The Bioware Mechanics")
*   **Interrupts**: Real-time "Quick Time Events" during dialogue (e.g., *[INTERRUPT] Reach out and stop him*) allow for physical agency.
*   **Trust Economy**: Trading information (`KnowledgeFlags`) is the primary currency.

### 3. The 2030 Skills System ("The Brain")
We track 50+ granular skills that map to 6 Birmingham-Ready Career Paths:
*   **Sustainable Construction** (Systems Thinking)
*   **Healthcare Tech** (Empathy + Tech)
*   **Cybersecurity** (Pattern Recognition)
*   **Advanced Logistics** (Triage)
*   **FinTech** (Risk Management)
*   **Community Data** (Critical Thinking)

---

## 🏗️ Technical Architecture

### Stack
*   **Core**: Next.js 15, React 18, TypeScript (Strict)
*   **State**: Zustand + LocalStorage (Persisted Session)
*   **UI**: Tailwind CSS + Framer Motion (No heavy assets)
*   **Logic**: Custom `DialogueGraphNavigator` and `SimulationRenderer`

### The "Worldbuilding OS"
The content is organized into "Fractals"—self-contained sectors that can be expanded infinitely:
*   **Sector 0**: Station Entry (Discovery)
*   **Sector 1**: Grand Hall (Reality Switching)
*   **Sector 2**: Market (Trust Economy)
*   **Sector 3**: The Deep Station (Recursion/New Game+)

---

## 🚀 Quick Start

### Installation
```bash
git clone https://github.com/AbdusM/lux-story.git
cd lux-story
npm install
npm run dev
```

### Running Tests
```bash
# Verify Character Specs
npx tsx scripts/audit-characters.ts

# Verify Dialogue Logic
npx tsx scripts/validate-dialogue-graphs.ts
```

---

## 📄 Documentation

### For New Team Members
*   [Navigation Guide](docs/03_PROCESS/onboarding/00-navigation-guide.md) - Start here! Complete guide to finding what you need.
*   [Character Quick Reference](docs/03_PROCESS/onboarding/01-character-quick-reference.md) - All 20 characters at a glance.
*   [Game Terminology Glossary](docs/03_PROCESS/onboarding/02-glossary.md) - Understand patterns, trust, simulations, and more.

### Technical Documentation
*   [Game Capabilities Audit](docs/01_MECHANICS/11-game-capabilities-audit.md) - Full feature breakdown.
*   [System Integration Report](docs/01_MECHANICS/10-system-integration-report.md) - Verification of Career/Skill mapping.
*   [Worldbuilding Bible](docs/02_WORLD/01-station-history-bible.md) - The lore foundation.

---

**Built for the Birmingham Catalyze Challenge.**
*Career discovery through contemplation, not examination.*