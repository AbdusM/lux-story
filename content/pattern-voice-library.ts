/**
 * Pattern Voice Library
 *
 * Lux Story 2.0 - The Thought Cabinet
 *
 * Each pattern has a distinct "voice" that comments on dialogue,
 * nudges toward aligned choices, and makes observations.
 *
 * Voice Guidelines:
 * - ANALYTICAL: Precise, pattern-seeking, slightly detached
 * - PATIENCE: Calm, measured, values process over outcome
 * - EXPLORING: Curious, enthusiastic, question-asking
 * - HELPING: Empathetic, caring, other-focused
 * - BUILDING: Practical, constructive, action-oriented
 */

import type { PatternVoiceEntry } from '@/lib/pattern-voices'

export const PATTERN_VOICE_LIBRARY: PatternVoiceEntry[] = [
  // ============= ANALYTICAL VOICES =============
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'devon' },
    voices: [
      "He thinks in systems. So do you. This is your language.",
      "There's a framework here. You can see it, can't you?",
      "Pattern recognition. That's what's happening right now."
    ],
    style: 'urge'
  },
  {
    pattern: 'analytical',
    minLevel: 6,
    trigger: 'npc_emotion',
    condition: { emotion: 'confused' },
    voices: [
      "They're missing something. Break it down for them.",
      "There's a logical gap here. You can see it.",
      "The pieces don't quite fit. Help them see why."
    ],
    style: 'observation'
  },
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'rohan' },
    voices: [
      "Another systems thinker. This could be interesting.",
      "He's questioning foundations. That's your territory.",
      "Deep analysis ahead. Stay sharp."
    ],
    style: 'whisper'
  },
  {
    pattern: 'analytical',
    minLevel: 7,
    trigger: 'before_choices',
    voices: [
      "Consider the second-order effects here.",
      "There's more data in what they're not saying.",
      "The optimal path isn't always the obvious one."
    ],
    style: 'observation',
    cooldown: 8
  },

  // ============= PATIENCE VOICES =============
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'npc_emotion',
    condition: { emotion: 'rushed' },
    voices: [
      "They're moving too fast. Slow them down.",
      "Urgency isn't always wisdom. Wait.",
      "The real answer needs time to surface."
    ],
    style: 'whisper'
  },
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'grace' },
    voices: [
      "She understands waiting. You understand waiting.",
      "Presence over productivity. That's the lesson here.",
      "Some conversations need to breathe."
    ],
    style: 'observation'
  },
  {
    pattern: 'patience',
    minLevel: 6,
    trigger: 'npc_emotion',
    condition: { emotion: 'anxious' },
    voices: [
      "Don't rush to fix this. Sit with it first.",
      "Anxiety responds to steadiness. Be steady.",
      "Let the silence do some of the work."
    ],
    style: 'urge'
  },
  {
    pattern: 'patience',
    minLevel: 7,
    trigger: 'before_choices',
    voices: [
      "Not every question needs an immediate answer.",
      "The right moment will reveal itself. Wait for it.",
      "Slow is smooth. Smooth is fast."
    ],
    style: 'whisper',
    cooldown: 8
  },

  // ============= EXPLORING VOICES =============
  {
    pattern: 'exploring',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'maya' },
    voices: [
      "She's building something secret. Find out more.",
      "Curiosity and creativity—that's the combination here.",
      "There's more to discover. Keep asking."
    ],
    style: 'urge'
  },
  {
    pattern: 'exploring',
    minLevel: 5,
    trigger: 'before_choices',
    voices: [
      "What aren't they telling you? Dig deeper.",
      "The interesting path is rarely the obvious one.",
      "Ask the question they don't expect."
    ],
    style: 'urge'
  },
  {
    pattern: 'exploring',
    minLevel: 6,
    trigger: 'npc_emotion',
    condition: { emotion: 'hesitant' },
    voices: [
      "They're holding something back. Gently explore it.",
      "There's a story here. Coax it out.",
      "Hesitation often hides the most interesting truth."
    ],
    style: 'observation'
  },
  {
    pattern: 'exploring',
    minLevel: 7,
    trigger: 'node_enter',
    voices: [
      "New territory. Pay attention to everything.",
      "Every conversation is a map. What does this one reveal?",
      "Stay curious. That's your superpower."
    ],
    style: 'whisper',
    cooldown: 10
  },

  // ============= HELPING VOICES =============
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'npc_emotion',
    condition: { emotion: 'vulnerable' },
    voices: [
      "They're opening up. Hold that space for them.",
      "This is what you do. Be present.",
      "Listen with your whole self."
    ],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'marcus' },
    voices: [
      "A healer recognizes a healer. That's you.",
      "Care work is skilled work. He knows. You know.",
      "This conversation matters to someone other than you."
    ],
    style: 'observation'
  },
  {
    pattern: 'helping',
    minLevel: 6,
    trigger: 'npc_emotion',
    condition: { emotion: 'struggling' },
    voices: [
      "They need support, not solutions. Can you tell the difference?",
      "Sometimes the best help is just showing up.",
      "Your instinct is to help. Trust it."
    ],
    style: 'whisper'
  },
  {
    pattern: 'helping',
    minLevel: 7,
    trigger: 'before_choices',
    voices: [
      "Which choice serves them, not just the conversation?",
      "Care is a choice. Make it deliberately.",
      "The right words can change everything for them."
    ],
    style: 'urge',
    cooldown: 8
  },

  // ============= BUILDING VOICES =============
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'elena' },
    voices: [
      "Hands-on work. Your kind of work.",
      "She makes things real. So do you.",
      "Theory is nice. Building is better."
    ],
    style: 'observation'
  },
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'before_choices',
    voices: [
      "Talk is cheap. What are you going to DO?",
      "Find the action in this moment.",
      "Building requires choosing. Choose."
    ],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 6,
    trigger: 'npc_emotion',
    condition: { emotion: 'stuck' },
    voices: [
      "They're paralyzed. Show them the first small step.",
      "Action cures fear. Help them see that.",
      "Break it down into something they can actually do."
    ],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 7,
    trigger: 'node_enter',
    voices: [
      "What can be built from this conversation?",
      "Every problem is a project waiting to happen.",
      "Think in terms of next steps. Always."
    ],
    style: 'whisper',
    cooldown: 10
  },

  // ============= CROSS-CHARACTER GENERIC =============
  {
    pattern: 'analytical',
    minLevel: 8,
    trigger: 'node_enter',
    voices: [
      "Your mind is a machine. Let it work.",
      "Systems within systems. You see them all.",
      "Analysis isn't cold. It's clarity."
    ],
    style: 'whisper',
    cooldown: 15
  },
  {
    pattern: 'patience',
    minLevel: 8,
    trigger: 'node_enter',
    voices: [
      "Time is your ally. It always has been.",
      "Rushing is for amateurs. You know better.",
      "The patient path is the certain path."
    ],
    style: 'whisper',
    cooldown: 15
  },
  {
    pattern: 'exploring',
    minLevel: 8,
    trigger: 'node_enter',
    voices: [
      "The unknown calls to you. Answer it.",
      "Curiosity isn't a weakness. It's your edge.",
      "Every door opens onto another door."
    ],
    style: 'whisper',
    cooldown: 15
  },
  {
    pattern: 'helping',
    minLevel: 8,
    trigger: 'node_enter',
    voices: [
      "You carry others' weight. That's strength.",
      "Empathy isn't soft. It's power.",
      "The world needs what you give."
    ],
    style: 'whisper',
    cooldown: 15
  },
  {
    pattern: 'building',
    minLevel: 8,
    trigger: 'node_enter',
    voices: [
      "Your hands know things your mind hasn't learned yet.",
      "Create first. Explain later.",
      "The world is clay. Shape it."
    ],
    style: 'whisper',
    cooldown: 15
  },

  // ============================================
  // KAI - The Protector
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'kai' },
    voices: ["He's assessing the threat level. You should too."],
    style: 'urge'
  },

  // ============================================
  // TESS - The Curator
  // ============================================
  {
    pattern: 'analytical', // BS Detection
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'tess' },
    voices: ["She can hear the fake notes. Don't play them."],
    style: 'urge'
  },
  {
    pattern: 'building', // Constructing Taste
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'tess' },
    voices: ["Quality is a structure you build, not find."],
    style: 'observation'
  },

  // ============================================
  // ALEX - The Tactician
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'alex' },
    voices: ["Check your six. Always."],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'alex' },
    voices: ["A solid plan. Reinforced."],
    style: 'observation'
  },

  // ============================================
  // ASHA - The Visionary
  // ============================================
  {
    pattern: 'exploring',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'asha' },
    voices: ["The map is not the territory. Look beyond it."],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'asha' },
    voices: ["We are building the future we want to see."],
    style: 'observation'
  },

  // ============================================
  // SILAS - The Maintainer
  // ============================================
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'silas' },
    voices: ["Clean it right, or don't clean it at all."],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'silas' },
    voices: ["Things break. We fix 'em. That's the job."],
    style: 'observation'
  },

  // ============================================
  // LIRA - The Listener
  // ============================================
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'lira' },
    voices: ["Listen to the silence between their words."],
    style: 'urge'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'lira' },
    voices: ["A new harmony is forming."],
    style: 'observation'
  },

  // ============================================
  // ZARA - The Analyst
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'zara' },
    voices: ["The data doesn't lie. Only people do."],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'zara' },
    voices: ["Optimization complete. Efficiency increased."],
    style: 'observation'
  },

  // ============================================
  // YAQUIN - The Bio-Architect
  // ============================================
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'yaquin' },
    voices: ["Grow it. Don't force it."],
    style: 'urge'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'yaquin' },
    voices: ["Even the moss has a strategy."],
    style: 'observation'
  },

  // ============================================
  // SAMUEL - The Fallen Hero
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'samuel' },
    voices: ["The hero archetype is a cage. He's trapped in it."],
    style: 'whisper'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'samuel' },
    voices: ["He needs forgiveness, not admiration."],
    style: 'urge'
  },

  // ============================================
  // JORDAN - The Runner
  // ============================================
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'jordan' },
    voices: ["He's running from himself. Keep up."],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'jordan' },
    voices: ["Momentum is useful. Direct it."],
    style: 'observation'
  },

  // ============================================
  // EXPANDED VOICES (Depth)
  // ============================================
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'kai' },
    voices: ["Safety takes time. He knows the cost of rushing."],
    style: 'whisper'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'alex' },
    voices: ["The shadows hide the best paths. Follow him."],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'grace' },
    voices: ["Her silence is a gift. Accept it."],
    style: 'observation'
  },

  // ============================================
  // QUINN - The Reformed Financier
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'quinn' },
    voices: ["He thinks in decades. Match his timeframe."],
    style: 'urge'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'quinn' },
    voices: ["Compounding works both ways. In money. In relationships."],
    style: 'observation'
  },
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'quinn' },
    voices: ["He's building portfolios. You're building futures. Find the overlap."],
    style: 'whisper'
  },

  // ============================================
  // DANTE - The Reformed Closer
  // ============================================
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'dante' },
    voices: ["He's looking for authenticity, not tactics. Give him the real thing."],
    style: 'urge'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'dante' },
    voices: ["Every question is an opportunity to understand, not to close."],
    style: 'observation'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'dante' },
    voices: ["Real sales is relationship architecture. Build it."],
    style: 'whisper'
  },

  // ============================================
  // NADIA - The AI Ethicist
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'nadia' },
    voices: ["She sees the edge cases. The failures. Show her you do too."],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'nadia' },
    voices: ["Ethics isn't a checkbox. It's care encoded in systems."],
    style: 'observation'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'nadia' },
    voices: ["Move fast and break things. She's seen the broken things."],
    style: 'whisper'
  },

  // ============================================
  // ISAIAH - The Reluctant Fundraiser
  // ============================================
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'isaiah' },
    voices: ["He carries the weight of faces, not metrics. Meet him there."],
    style: 'urge'
  },
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'isaiah' },
    voices: ["Generational change. That's his horizon. Match it."],
    style: 'observation'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'isaiah' },
    voices: ["Systems that outlast their builders. That's the real philanthropy."],
    style: 'whisper'
  },

  // ============================================
  // PHASE 1: CORE CHARACTER EXPANSION (5/5 Coverage)
  // devon, rohan, maya, marcus, elena
  // ============================================

  // ============================================
  // DEVON - The Systems Thinker (was 1/5, adding 4)
  // Has: analytical
  // Adding: patience, exploring, helping, building
  // ============================================
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'devon' },
    voices: [
      "Complex systems reveal themselves slowly. Let him show you.",
      "He's debugging in real-time. Give him space.",
      "The architecture needs time to explain itself."
    ],
    style: 'observation'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'devon' },
    voices: [
      "There are subsystems here you haven't mapped yet.",
      "Ask him about the edge cases. That's where it gets interesting.",
      "Every system has hidden doors. Find them."
    ],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'devon' },
    voices: [
      "He's carrying more than code. See the person behind the systems.",
      "Engineers need support too. Offer it.",
      "His precision hides something softer. Meet him there."
    ],
    style: 'whisper'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'devon' },
    voices: [
      "He builds to solve. So do you.",
      "Infrastructure isn't glamorous. It's essential. He gets that.",
      "The foundation he's laying will hold weight. Appreciate it."
    ],
    style: 'observation'
  },

  // ============================================
  // ROHAN - The Deep Tech Philosopher (was 1/5, adding 4)
  // Has: analytical
  // Adding: patience, exploring, helping, building
  // ============================================
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'rohan' },
    voices: [
      "His thoughts spiral deep. Follow them slowly.",
      "Introspection takes time. Honor that.",
      "The pause before his answer holds meaning."
    ],
    style: 'whisper'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'rohan' },
    voices: [
      "He's questioning everything. Join him.",
      "There's a rabbit hole here. Worth falling into.",
      "Philosophy disguised as engineering. Dig deeper."
    ],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'rohan' },
    voices: [
      "Brilliance can be lonely. Acknowledge his.",
      "He needs a witness, not a judge.",
      "Sometimes the sharpest minds need the softest support."
    ],
    style: 'observation'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'rohan' },
    voices: [
      "He's building something no one's seen before.",
      "Innovation requires construction. He's doing both.",
      "Theory becomes reality when you build it. He knows."
    ],
    style: 'urge'
  },

  // ============================================
  // MAYA - The Tech Innovator (was 1/5, adding 4)
  // Has: exploring
  // Adding: analytical, patience, helping, building
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'maya' },
    voices: [
      "Her code has logic you can follow. Trace it.",
      "She's optimizing something. Figure out what.",
      "The pattern in her work mirrors your thinking."
    ],
    style: 'urge'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'maya' },
    voices: [
      "Family expectations are heavy. She's carrying them.",
      "Pressure makes diamonds. Or breaks things. Wait and see.",
      "Her secrets unfold on their own timeline."
    ],
    style: 'whisper'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'maya' },
    voices: [
      "She's proving something to people who aren't here.",
      "Success and loneliness often travel together. She knows.",
      "Behind the innovation is someone who needs to be seen."
    ],
    style: 'observation'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'maya' },
    voices: [
      "She's creating something real. Respect the craft.",
      "Every line of code is an act of construction.",
      "Builders recognize builders. You see each other."
    ],
    style: 'urge'
  },

  // ============================================
  // MARCUS - The Medical Tech (was 1/5, adding 4)
  // Has: helping
  // Adding: analytical, patience, exploring, building
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'marcus' },
    voices: [
      "Diagnosis is pattern recognition. He's doing it constantly.",
      "Medical precision requires analytical clarity. Match his.",
      "He sees symptoms. You see systems. Same skill."
    ],
    style: 'observation'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'marcus' },
    voices: [
      "Healing takes time. He's learned that the hard way.",
      "Crisis responders know how to wait. He's teaching you.",
      "The calm in his voice is earned. Listen to it."
    ],
    style: 'whisper'
  },
  {
    pattern: 'exploring',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'marcus' },
    voices: [
      "There are stories in these walls he hasn't told yet.",
      "Healthcare has hidden corners. He knows them all.",
      "Ask about the ones he couldn't save. That's where the truth is."
    ],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'marcus' },
    voices: [
      "He's building something bigger than patient care.",
      "Systems that save lives. That's his architecture.",
      "Every protocol he creates is a future crisis prevented."
    ],
    style: 'observation'
  },

  // ============================================
  // ELENA - The Archivist (was 1/5, adding 4)
  // Has: building
  // Adding: analytical, patience, exploring, helping
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'elena' },
    voices: [
      "She categorizes everything. That's how she makes sense of chaos.",
      "Information architecture. She's built it in her mind.",
      "Her filing system has logic. Understand it."
    ],
    style: 'observation'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'elena' },
    voices: [
      "Archives reward the patient. She'll show you.",
      "History reveals itself slowly. She's used to waiting.",
      "The past isn't going anywhere. Neither should you."
    ],
    style: 'whisper'
  },
  {
    pattern: 'exploring',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'elena' },
    voices: [
      "There are secrets in her collection. Uncover them.",
      "Every archive has hidden treasures. Ask her.",
      "She knows where the interesting things are buried."
    ],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'elena' },
    voices: [
      "Preservation is an act of care. She understands that.",
      "She saves things so others won't lose them.",
      "Behind the organization is someone who wants to protect."
    ],
    style: 'observation'
  },

  // ============================================
  // PHASE 2: SECONDARY CHARACTER EXPANSION (5/5 Coverage)
  // grace, kai, tess, asha, silas, lira, zara, yaquin, samuel, jordan
  // ============================================

  // ============================================
  // GRACE - Healthcare Operations (was 2/5, adding 3)
  // Has: patience, helping
  // Adding: analytical, exploring, building
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'grace' },
    voices: [
      "She tracks patterns in patient outcomes. That's data.",
      "Healthcare logistics is systems thinking. She knows.",
      "Her intuition is just analysis she doesn't explain."
    ],
    style: 'observation'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'grace' },
    voices: [
      "There's more to her story than bedside manner.",
      "The quiet ones hold the deepest mysteries.",
      "Ask her about what she's seen. If you're ready."
    ],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'grace' },
    voices: [
      "She builds bridges between suffering and healing.",
      "Every routine she creates saves someone later.",
      "Steady hands build steady systems."
    ],
    style: 'whisper'
  },

  // ============================================
  // KAI - Safety Specialist (was 2/5, adding 3)
  // Has: analytical, patience
  // Adding: exploring, helping, building
  // ============================================
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'kai' },
    voices: [
      "Danger lurks in overlooked corners. He finds them.",
      "Safety requires knowing what can go wrong. Explore it.",
      "He's mapped every risk. Ask him about the interesting ones."
    ],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'kai' },
    voices: [
      "Protection is love expressed through vigilance.",
      "He keeps people safe because he cares. That's it.",
      "Every protocol comes from caring about someone."
    ],
    style: 'observation'
  },
  {
    pattern: 'building',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'kai' },
    voices: [
      "Safety systems don't build themselves. He does.",
      "Prevention is construction. He's an architect of it.",
      "Every guard rail he installs is a future saved."
    ],
    style: 'whisper'
  },

  // ============================================
  // TESS - Education Founder (was 2/5, adding 3)
  // Has: analytical, building
  // Adding: patience, exploring, helping
  // ============================================
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'tess' },
    voices: [
      "Education is slow work. She's accepted that.",
      "Growth doesn't rush. She's learned to wait.",
      "The seeds she plants won't bloom for years. She plants anyway."
    ],
    style: 'whisper'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'tess' },
    voices: [
      "Her curriculum has hidden depths. Discover them.",
      "What drives someone to teach? Ask her.",
      "Every educator has a story about the one who almost didn't make it."
    ],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'tess' },
    voices: [
      "Teaching is service dressed as profession.",
      "She's invested in futures she'll never see.",
      "Every student is a bet on the world getting better."
    ],
    style: 'observation'
  },

  // ============================================
  // ASHA - Conflict Resolution (was 2/5, adding 3)
  // Has: exploring, building
  // Adding: analytical, patience, helping
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'asha' },
    voices: [
      "She reads the room like data. Every tension catalogued.",
      "Mediation requires understanding all perspectives. She does.",
      "The pattern in conflict is always fear. She sees it."
    ],
    style: 'observation'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'asha' },
    voices: [
      "Resolution can't be rushed. She knows the cost of trying.",
      "She sits with discomfort so others don't have to.",
      "Peace takes longer than war. She's committed to the timeline."
    ],
    style: 'whisper'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'asha' },
    voices: [
      "She stands between people and their worst impulses.",
      "Conflict resolution is care work with higher stakes.",
      "Every bridge she builds saves someone from burning one."
    ],
    style: 'urge'
  },

  // ============================================
  // SILAS - Advanced Manufacturing (was 2/5, adding 3)
  // Has: patience, building
  // Adding: analytical, exploring, helping
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'silas' },
    voices: [
      "Machines don't lie. Neither does he.",
      "He diagnoses problems by sound. That's pattern recognition.",
      "Efficiency is a form of elegance. He sees it everywhere."
    ],
    style: 'observation'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'silas' },
    voices: [
      "The factory floor has stories the office never hears.",
      "What happens when the machines stop? Ask him.",
      "There's dignity in his work most people miss. Find it."
    ],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'silas' },
    voices: [
      "He keeps the line running so families get paid.",
      "Skilled trades support entire communities. He knows.",
      "Behind every functioning machine is someone who cares."
    ],
    style: 'whisper'
  },

  // ============================================
  // LIRA - Communications / Sound Design (was 2/5, adding 3)
  // Has: helping, exploring
  // Adding: analytical, patience, building
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'lira' },
    voices: [
      "Sound has structure. She deconstructs it.",
      "Every frequency carries information. She reads it.",
      "Her ear catches patterns others miss entirely."
    ],
    style: 'observation'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'lira' },
    voices: [
      "The right sound takes time to find. She waits for it.",
      "Silence teaches as much as noise. She listens to both.",
      "Music rewards those who can be still."
    ],
    style: 'whisper'
  },
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'lira' },
    voices: [
      "Soundscapes are architecture for the ears.",
      "She constructs experiences out of thin air.",
      "Every mix is a structure built from vibrations."
    ],
    style: 'urge'
  },

  // ============================================
  // ZARA - Data Ethics (was 2/5, adding 3)
  // Has: analytical, building
  // Adding: patience, exploring, helping
  // ============================================
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'zara' },
    voices: [
      "Ethics can't be rushed. She knows the cost of shortcuts.",
      "The right answer takes longer than the convenient one.",
      "She's played the long game before. She'll do it again."
    ],
    style: 'whisper'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'zara' },
    voices: [
      "What's the data really hiding? She'll help you see.",
      "Ethics requires asking uncomfortable questions. Ask them.",
      "The edge cases reveal the true cost. She knows them all."
    ],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'zara' },
    voices: [
      "She protects people from algorithms that don't see them.",
      "Data ethics is care work at scale.",
      "Behind every policy she writes is someone she's trying to save."
    ],
    style: 'observation'
  },

  // ============================================
  // YAQUIN - EdTech Creator (was 2/5, adding 3)
  // Has: building, exploring
  // Adding: analytical, patience, helping
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'yaquin' },
    voices: [
      "Learning has patterns. He's mapped them.",
      "EdTech is education plus systems thinking.",
      "He measures what matters. That's harder than it sounds."
    ],
    style: 'observation'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'yaquin' },
    voices: [
      "Behavior change takes time. He's built for it.",
      "The best tools work slowly. He knows.",
      "Growth is invisible until it isn't. He trusts the process."
    ],
    style: 'whisper'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'yaquin' },
    voices: [
      "Every feature he builds is meant to unlock someone.",
      "Accessibility is care embedded in code.",
      "He remembers being the kid who needed help. He builds for that kid."
    ],
    style: 'urge'
  },

  // ============================================
  // SAMUEL - Station Keeper (was 2/5, adding 3)
  // Has: analytical, helping
  // Adding: patience, exploring, building
  // ============================================
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'samuel' },
    voices: [
      "He's waited here longer than you know.",
      "The station unfolds at its own pace. Trust it.",
      "Wisdom isn't rushed. Neither is he."
    ],
    style: 'whisper'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'samuel' },
    voices: [
      "The hub hides more than it shows. He knows where.",
      "Every platform has a secret. He's seen them all.",
      "Ask him about the trains that never arrive."
    ],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'samuel' },
    voices: [
      "He's built this place, conversation by conversation.",
      "The station is his creation. Respect the craft.",
      "Stewardship is a form of construction."
    ],
    style: 'observation'
  },

  // ============================================
  // JORDAN - Career Navigator (was 2/5, adding 3)
  // Has: exploring, building
  // Adding: analytical, patience, helping
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'jordan' },
    voices: [
      "He sees the patterns in your choices. So should you.",
      "Navigation requires understanding the map. He does.",
      "Every question he asks is calibrated. Pay attention."
    ],
    style: 'observation'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'jordan' },
    voices: [
      "The right path reveals itself. He's learned to wait.",
      "Career journeys take time. He's not rushing you.",
      "Running is his thing. But he knows when to stop."
    ],
    style: 'whisper'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'jordan' },
    voices: [
      "He's not just navigating. He's guiding.",
      "Your path matters to him. That's not an act.",
      "He's walked lost before. That's why he helps now."
    ],
    style: 'urge'
  },

  // ============================================
  // PHASE 3: LINKEDIN 2026 CHARACTER EXPANSION (5/5 Coverage)
  // quinn, dante, nadia, isaiah, alex
  // ============================================

  // ============================================
  // QUINN - The Reformed Financier (was 3/5, adding 2)
  // Has: analytical, patience, building
  // Adding: exploring, helping
  // ============================================
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'quinn' },
    voices: [
      "His past has chapters he hasn't shared. Worth exploring.",
      "Wall Street taught him things Birmingham needs. Ask what.",
      "Every reformed person has a turning point. Find his."
    ],
    style: 'urge'
  },
  {
    pattern: 'helping',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'quinn' },
    voices: [
      "He's giving back what he once took. Respect the journey.",
      "Wealth redistribution as personal mission. He's serious.",
      "His help comes with wisdom bought at a price."
    ],
    style: 'observation'
  },

  // ============================================
  // DANTE - The Reformed Closer (was 3/5, adding 2)
  // Has: helping, exploring, building
  // Adding: analytical, patience
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'dante' },
    voices: [
      "He reads people like spreadsheets. Every tell catalogued.",
      "Sales is psychology with numbers. He knows both.",
      "The pitch has structure. He's deconstructed it."
    ],
    style: 'observation'
  },
  {
    pattern: 'patience',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'dante' },
    voices: [
      "He learned to stop closing and start listening.",
      "Rushing killed deals. Now he waits.",
      "Patience is the skill he had to teach himself."
    ],
    style: 'whisper'
  },

  // ============================================
  // NADIA - The AI Ethicist (was 3/5, adding 2)
  // Has: analytical, helping, patience
  // Adding: exploring, building
  // ============================================
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'nadia' },
    voices: [
      "The bleeding edge of AI has corners she's seen. Ask about them.",
      "Her questions go places most people avoid.",
      "What happens when the machine makes the wrong call? She knows."
    ],
    style: 'urge'
  },
  {
    pattern: 'building',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'nadia' },
    voices: [
      "She's not just critiquing—she's constructing better frameworks.",
      "Ethics needs architecture. She's drafting the blueprints.",
      "Guardrails don't build themselves. She does."
    ],
    style: 'observation'
  },

  // ============================================
  // ISAIAH - The Reluctant Fundraiser (was 3/5, adding 2)
  // Has: helping, patience, building
  // Adding: analytical, exploring
  // ============================================
  {
    pattern: 'analytical',
    minLevel: 5,
    trigger: 'before_choices',
    condition: { characterId: 'isaiah' },
    voices: [
      "He tracks impact, not just dollars. Different metrics.",
      "Nonprofit math has its own logic. He's mastered it.",
      "Every grant has hidden strings. He sees them all."
    ],
    style: 'observation'
  },
  {
    pattern: 'exploring',
    minLevel: 4,
    trigger: 'node_enter',
    condition: { characterId: 'isaiah' },
    voices: [
      "His reluctance hides a story. Worth uncovering.",
      "Why does fundraising feel like selling out? Ask him.",
      "The tension between mission and money—he lives it."
    ],
    style: 'urge'
  },

  // ============================================
  // ALEX - The Tactician (was 3/5, adding 2)
  // Has: analytical, exploring, building
  // Adding: patience, helping
  // ============================================
  {
    pattern: 'patience',
    minLevel: 5,
    trigger: 'node_enter',
    condition: { characterId: 'alex' },
    voices: [
      "Strategy requires waiting for the right moment. He does.",
      "The best tacticians know when not to move.",
      "His calm is earned through chaos navigated."
    ],
    style: 'whisper'
  },
  {
    pattern: 'helping',
    minLevel: 4,
    trigger: 'before_choices',
    condition: { characterId: 'alex' },
    voices: [
      "Supply chains feed families. He never forgets that.",
      "Logistics is service at scale. He's good at it.",
      "Every route he optimizes helps someone he'll never meet."
    ],
    style: 'observation'
  }
]

export default PATTERN_VOICE_LIBRARY
