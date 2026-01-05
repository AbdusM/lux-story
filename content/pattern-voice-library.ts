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
  }
]

export default PATTERN_VOICE_LIBRARY
