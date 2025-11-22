# Narrative Audit & Cross-Talk Plan

**Status:** ✅ All character graphs audited (Marcus, Tess, Yaquin, Silas).
**Architecture:** Robust. All graphs link back to the Hub.
**Mechanics:** Consistent. All graphs use `[ACTION]` and `richEffectContext: 'warning'`.
**Gap:** Characters are narratively isolated. No cross-talk was found in the files.

## Implementation Plan: "The Living Station"

We will inject 1-2 lines of dialogue into specific nodes to create a web of awareness between characters.

### 1. Kai & Rohan (The "Black Box" Alliance)
*   **Where:** `content/kai-dialogue-graph.ts` (Node: `kai_studio_realization`)
*   **Addition:** *"I met a guy downstairs, Rohan. He said the code is broken. I think the training is broken too. We're both just trying to find the truth."*
*   **Where:** `content/rohan-dialogue-graph.ts` (Node: `rohan_farewell`)
*   **Addition:** *"There's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right."*

### 2. Silas & Devon (The "Systems" Alliance)
*   **Where:** `content/silas-dialogue-graph.ts` (Node: `silas_farewell`)
*   **Addition:** *"Systems are everywhere. I saw a kid, Devon, drawing flowcharts for his dad. He gets it. A family is just a network that needs maintenance."*

### 3. Yaquin & Jordan (The "Non-Linear" Alliance)
*   **Where:** `content/jordan-dialogue-graph.ts` (Node: `jordan_farewell_accumulation`)
*   **Addition:** *"I heard about a guy teaching dental skills on TikTok. Yaquin? He's doing exactly what I'm talking about. Accumulating skills, not titles."*

### 4. Tess & Kai (The "Education" Alliance)
*   **Where:** `content/tess-dialogue-graph.ts` (Node: `tess_farewell`)
*   **Addition:** *"There's someone else here—Kai. From corporate. They're realizing the same thing I did: you can't fix the system from inside a cubicle."*

## Execution
I will apply these 5 specific edits now.
