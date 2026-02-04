/**
 * Assessment Questions
 *
 * Question banks for each assessment arc.
 * Organized by assessment and phase.
 *
 * @module lib/ranking/assessment-questions
 */

import type { AssessmentQuestion } from './assessment-arc'

// ═══════════════════════════════════════════════════════════════════════════
// FIRST CROSSING - Written Phase (Knowledge)
// ═══════════════════════════════════════════════════════════════════════════

export const FIRST_CROSSING_WRITTEN: AssessmentQuestion[] = [
  {
    id: 'fc_w1',
    prompt: 'What matters most when building trust with someone?',
    type: 'choice',
    options: [
      {
        id: 'a',
        text: 'Agreeing with everything they say',
        score: 0,
        feedback: 'Agreement without authenticity feels hollow.',
        patterns: []
      },
      {
        id: 'b',
        text: 'Being consistently present and honest',
        score: 3,
        feedback: 'Trust grows from reliability and authenticity.',
        patterns: ['patience', 'helping']
      },
      {
        id: 'c',
        text: 'Impressing them with your knowledge',
        score: 1,
        feedback: 'Knowledge helps, but connection matters more.',
        patterns: ['analytical']
      },
      {
        id: 'd',
        text: 'Finding what you can offer them',
        score: 2,
        feedback: 'Value exchange matters, but relationships are deeper.',
        patterns: ['building']
      }
    ],
    evaluationCriteria: ['trust-building', 'relationship-awareness'],
    maxScore: 3
  },
  {
    id: 'fc_w2',
    prompt: 'A character shares something vulnerable. What should you do?',
    type: 'choice',
    options: [
      {
        id: 'a',
        text: 'Immediately offer advice to fix the problem',
        score: 1,
        feedback: 'Helpful intent, but sometimes listening is enough.',
        patterns: ['building', 'helping']
      },
      {
        id: 'b',
        text: 'Share a similar experience to show you understand',
        score: 2,
        feedback: 'Empathy through shared experience can connect.',
        patterns: ['helping']
      },
      {
        id: 'c',
        text: 'Acknowledge what they shared and give them space',
        score: 3,
        feedback: 'Honoring vulnerability without pressure shows maturity.',
        patterns: ['patience', 'helping']
      },
      {
        id: 'd',
        text: 'Change the subject to lighten the mood',
        score: 0,
        feedback: 'Avoiding discomfort dismisses their trust.',
        patterns: []
      }
    ],
    evaluationCriteria: ['empathy', 'emotional-intelligence'],
    maxScore: 3
  },
  {
    id: 'fc_w3',
    prompt: 'What is a pattern in the context of the station?',
    type: 'choice',
    options: [
      {
        id: 'a',
        text: 'A repeating design in the architecture',
        score: 0,
        feedback: 'Patterns here are about behavior, not decor.',
        patterns: []
      },
      {
        id: 'b',
        text: 'A consistent way you approach challenges',
        score: 3,
        feedback: 'Exactly. Patterns reveal your natural tendencies.',
        patterns: ['analytical']
      },
      {
        id: 'c',
        text: 'A schedule the station follows',
        score: 0,
        feedback: 'The station\'s patterns are about travelers, not time.',
        patterns: []
      },
      {
        id: 'd',
        text: 'Something you should try to hide',
        score: 1,
        feedback: 'Patterns are not flaws—they\'re insights.',
        patterns: ['patience']
      }
    ],
    evaluationCriteria: ['pattern-understanding', 'self-awareness'],
    maxScore: 3
  },
  {
    id: 'fc_w4',
    prompt: 'When exploring a new platform, what is most valuable?',
    type: 'choice',
    options: [
      {
        id: 'a',
        text: 'Finding the fastest route through',
        score: 1,
        feedback: 'Efficiency has value, but you might miss things.',
        patterns: ['analytical']
      },
      {
        id: 'b',
        text: 'Talking to everyone you meet',
        score: 2,
        feedback: 'Connections matter, though quality over quantity.',
        patterns: ['helping', 'exploring']
      },
      {
        id: 'c',
        text: 'Taking time to observe and understand',
        score: 3,
        feedback: 'Observation reveals what rushing misses.',
        patterns: ['patience', 'exploring']
      },
      {
        id: 'd',
        text: 'Completing every task immediately',
        score: 1,
        feedback: 'Tasks matter, but so does context.',
        patterns: ['building']
      }
    ],
    evaluationCriteria: ['exploration', 'patience'],
    maxScore: 3
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// FIRST CROSSING - Practical Phase (Decision)
// ═══════════════════════════════════════════════════════════════════════════

export const FIRST_CROSSING_PRACTICAL: AssessmentQuestion[] = [
  {
    id: 'fc_p1',
    prompt: 'You\'re having a conversation with Maya when Devon interrupts with urgent news. Maya looks disappointed. What do you do?',
    type: 'scenario',
    options: [
      {
        id: 'a',
        text: 'Immediately turn to Devon—urgent news is important',
        score: 1,
        feedback: 'Efficiency matters, but so do feelings.',
        patterns: ['analytical']
      },
      {
        id: 'b',
        text: 'Tell Devon to wait—you were here first with Maya',
        score: 1,
        feedback: 'Loyalty to Maya, but dismissive of Devon.',
        patterns: ['patience']
      },
      {
        id: 'c',
        text: 'Acknowledge Maya\'s disappointment before addressing Devon',
        score: 3,
        feedback: 'Balancing both relationships shows emotional awareness.',
        patterns: ['helping', 'patience']
      },
      {
        id: 'd',
        text: 'Suggest all three of you discuss together',
        score: 2,
        feedback: 'Inclusive, though not always appropriate.',
        patterns: ['exploring', 'building']
      }
    ],
    evaluationCriteria: ['conflict-navigation', 'multi-relationship'],
    maxScore: 3
  },
  {
    id: 'fc_p2',
    prompt: 'Marcus asks for your opinion on a difficult choice he\'s facing. You don\'t know enough to give good advice. What do you say?',
    type: 'scenario',
    options: [
      {
        id: 'a',
        text: 'Give advice anyway—he asked for your opinion',
        score: 0,
        feedback: 'Uninformed advice can cause harm.',
        patterns: []
      },
      {
        id: 'b',
        text: 'Admit you don\'t know enough and ask questions',
        score: 3,
        feedback: 'Honesty and curiosity together show wisdom.',
        patterns: ['exploring', 'patience']
      },
      {
        id: 'c',
        text: 'Deflect by asking what he thinks he should do',
        score: 2,
        feedback: 'Sometimes reflection helps, but it can feel evasive.',
        patterns: ['helping']
      },
      {
        id: 'd',
        text: 'Research quickly and come back with an answer',
        score: 2,
        feedback: 'Effort is good, but connection matters in the moment.',
        patterns: ['analytical', 'building']
      }
    ],
    evaluationCriteria: ['honesty', 'relationship-care'],
    maxScore: 3
  },
  {
    id: 'fc_p3',
    prompt: 'You discover information that would help Tess but might upset her. What do you do?',
    type: 'scenario',
    options: [
      {
        id: 'a',
        text: 'Share it immediately—she deserves to know',
        score: 2,
        feedback: 'Honesty is valued, but timing matters.',
        patterns: ['analytical']
      },
      {
        id: 'b',
        text: 'Keep it to yourself to protect her feelings',
        score: 0,
        feedback: 'Protection that withholds truth isn\'t kindness.',
        patterns: []
      },
      {
        id: 'c',
        text: 'Find the right moment and share it gently',
        score: 3,
        feedback: 'Truth with compassion respects both honesty and care.',
        patterns: ['patience', 'helping']
      },
      {
        id: 'd',
        text: 'Hint at it and let her figure it out',
        score: 1,
        feedback: 'Indirect approaches can confuse.',
        patterns: ['exploring']
      }
    ],
    evaluationCriteria: ['honesty', 'emotional-awareness'],
    maxScore: 3
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// FIRST CROSSING - Finals Phase (Synthesis)
// ═══════════════════════════════════════════════════════════════════════════

export const FIRST_CROSSING_FINALS: AssessmentQuestion[] = [
  {
    id: 'fc_f1',
    prompt: 'Reflecting on your time at the station so far, what has surprised you most about yourself?',
    type: 'reflection',
    options: [
      {
        id: 'a',
        text: 'I\'m more curious than I realized',
        score: 2,
        feedback: 'Curiosity is the beginning of growth.',
        patterns: ['exploring']
      },
      {
        id: 'b',
        text: 'I care more about others than I thought',
        score: 2,
        feedback: 'Compassion often surprises us.',
        patterns: ['helping']
      },
      {
        id: 'c',
        text: 'I\'m better at seeing patterns than I knew',
        score: 2,
        feedback: 'Pattern recognition is a powerful skill.',
        patterns: ['analytical']
      },
      {
        id: 'd',
        text: 'I want to build things that matter',
        score: 2,
        feedback: 'The drive to create is transformative.',
        patterns: ['building']
      }
    ],
    evaluationCriteria: ['self-awareness', 'pattern-recognition'],
    maxScore: 2
  },
  {
    id: 'fc_f2',
    prompt: 'What role do you think you play in the relationships you\'ve built here?',
    type: 'reflection',
    options: [
      {
        id: 'a',
        text: 'The one who listens and supports',
        score: 2,
        feedback: 'Support is a gift.',
        patterns: ['helping', 'patience']
      },
      {
        id: 'b',
        text: 'The one who asks hard questions',
        score: 2,
        feedback: 'Challenging questions drive growth.',
        patterns: ['analytical', 'exploring']
      },
      {
        id: 'c',
        text: 'The one who brings people together',
        score: 2,
        feedback: 'Connection-building is rare and valuable.',
        patterns: ['helping', 'building']
      },
      {
        id: 'd',
        text: 'I\'m still figuring that out',
        score: 2,
        feedback: 'Self-discovery is a journey, not a destination.',
        patterns: ['exploring']
      }
    ],
    evaluationCriteria: ['self-awareness', 'relationship-understanding'],
    maxScore: 2
  },
  {
    id: 'fc_f3',
    prompt: 'If you could change one thing about how you\'ve approached the station so far, what would it be?',
    type: 'reflection',
    options: [
      {
        id: 'a',
        text: 'I would have taken more time to observe',
        score: 2,
        feedback: 'Patience yields insights.',
        patterns: ['patience']
      },
      {
        id: 'b',
        text: 'I would have asked more questions',
        score: 2,
        feedback: 'Questions are how we learn.',
        patterns: ['exploring', 'analytical']
      },
      {
        id: 'c',
        text: 'I would have been more vulnerable',
        score: 2,
        feedback: 'Vulnerability opens doors.',
        patterns: ['helping']
      },
      {
        id: 'd',
        text: 'I wouldn\'t change anything—I learned from it all',
        score: 2,
        feedback: 'Self-acceptance is also wisdom.',
        patterns: ['patience']
      }
    ],
    evaluationCriteria: ['self-reflection', 'growth-mindset'],
    maxScore: 2
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// CROSSROADS TRIAL - Questions (Placeholder for full implementation)
// ═══════════════════════════════════════════════════════════════════════════

export const CROSSROADS_TRIAL_WRITTEN: AssessmentQuestion[] = [
  {
    id: 'ct_w1',
    prompt: 'When two people you care about are in conflict, what\'s most important?',
    type: 'choice',
    options: [
      {
        id: 'a',
        text: 'Choosing a side based on who\'s right',
        score: 1,
        feedback: 'Right and wrong are often matters of perspective.',
        patterns: ['analytical']
      },
      {
        id: 'b',
        text: 'Helping them understand each other',
        score: 3,
        feedback: 'Bridge-building creates lasting resolution.',
        patterns: ['helping', 'patience']
      },
      {
        id: 'c',
        text: 'Staying out of it entirely',
        score: 1,
        feedback: 'Sometimes distance is wise, but connection matters.',
        patterns: ['patience']
      },
      {
        id: 'd',
        text: 'Finding a solution that satisfies both',
        score: 2,
        feedback: 'Solution-finding helps, but understanding comes first.',
        patterns: ['building', 'analytical']
      }
    ],
    evaluationCriteria: ['conflict-resolution', 'relationship-depth'],
    maxScore: 3
  }
]

export const CROSSROADS_TRIAL_PRACTICAL: AssessmentQuestion[] = [
  {
    id: 'ct_p1',
    prompt: 'You\'re asked to lead a project, but you know someone else might be better suited. What do you do?',
    type: 'scenario',
    options: [
      {
        id: 'a',
        text: 'Accept it—you were asked for a reason',
        score: 2,
        feedback: 'Confidence is good, but humility has value too.',
        patterns: ['building']
      },
      {
        id: 'b',
        text: 'Recommend the other person instead',
        score: 3,
        feedback: 'Recognizing others\' strengths shows maturity.',
        patterns: ['helping', 'analytical']
      },
      {
        id: 'c',
        text: 'Decline without explanation',
        score: 0,
        feedback: 'Unexplained refusal leaves others confused.',
        patterns: []
      },
      {
        id: 'd',
        text: 'Suggest co-leading with the other person',
        score: 3,
        feedback: 'Collaboration often yields the best results.',
        patterns: ['building', 'helping']
      }
    ],
    evaluationCriteria: ['self-awareness', 'leadership'],
    maxScore: 3
  }
]

export const CROSSROADS_TRIAL_FINALS: AssessmentQuestion[] = [
  {
    id: 'ct_f1',
    prompt: 'How has your understanding of yourself changed since your first assessment?',
    type: 'reflection',
    options: [
      {
        id: 'a',
        text: 'I understand my patterns better now',
        score: 2,
        feedback: 'Pattern awareness is growth.',
        patterns: ['analytical']
      },
      {
        id: 'b',
        text: 'I know what I care about more clearly',
        score: 2,
        feedback: 'Clarity of values guides choices.',
        patterns: ['patience']
      },
      {
        id: 'c',
        text: 'I\'ve learned how I affect others',
        score: 2,
        feedback: 'Understanding impact is wisdom.',
        patterns: ['helping']
      },
      {
        id: 'd',
        text: 'I see more possibilities than before',
        score: 2,
        feedback: 'Expanded horizons mean growth.',
        patterns: ['exploring']
      }
    ],
    evaluationCriteria: ['growth-reflection', 'self-awareness'],
    maxScore: 2
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// MASTER'S CHALLENGE - Questions (Placeholder for full implementation)
// ═══════════════════════════════════════════════════════════════════════════

export const MASTERS_CHALLENGE_WRITTEN: AssessmentQuestion[] = [
  {
    id: 'mc_w1',
    prompt: 'What does it mean to truly master something?',
    type: 'choice',
    options: [
      {
        id: 'a',
        text: 'Knowing everything about it',
        score: 1,
        feedback: 'Knowledge alone isn\'t mastery.',
        patterns: ['analytical']
      },
      {
        id: 'b',
        text: 'Being able to adapt it to any situation',
        score: 3,
        feedback: 'True mastery is flexible wisdom.',
        patterns: ['exploring', 'building']
      },
      {
        id: 'c',
        text: 'Teaching it to others',
        score: 2,
        feedback: 'Teaching deepens understanding, but isn\'t required.',
        patterns: ['helping']
      },
      {
        id: 'd',
        text: 'Never making mistakes',
        score: 0,
        feedback: 'Masters make mistakes—they just learn from them.',
        patterns: []
      }
    ],
    evaluationCriteria: ['mastery-understanding', 'growth-mindset'],
    maxScore: 3
  }
]

export const MASTERS_CHALLENGE_PRACTICAL: AssessmentQuestion[] = [
  {
    id: 'mc_p1',
    prompt: 'A crisis emerges that affects multiple people you care about. You can\'t help everyone. How do you decide?',
    type: 'scenario',
    options: [
      {
        id: 'a',
        text: 'Help whoever needs it most urgently',
        score: 2,
        feedback: 'Triage is practical wisdom.',
        patterns: ['analytical']
      },
      {
        id: 'b',
        text: 'Find ways to help them help each other',
        score: 3,
        feedback: 'Multiplying your impact shows mastery.',
        patterns: ['building', 'helping']
      },
      {
        id: 'c',
        text: 'Trust that some can handle it themselves',
        score: 2,
        feedback: 'Trusting others\' capabilities is wisdom.',
        patterns: ['patience']
      },
      {
        id: 'd',
        text: 'Spread yourself thin trying to reach everyone',
        score: 1,
        feedback: 'Noble intent, but unsustainable.',
        patterns: ['helping']
      }
    ],
    evaluationCriteria: ['crisis-management', 'strategic-thinking'],
    maxScore: 3
  }
]

export const MASTERS_CHALLENGE_FINALS: AssessmentQuestion[] = [
  {
    id: 'mc_f1',
    prompt: 'What will you carry with you when you leave the station?',
    type: 'reflection',
    options: [
      {
        id: 'a',
        text: 'The relationships I\'ve built',
        score: 2,
        feedback: 'Connection outlasts location.',
        patterns: ['helping']
      },
      {
        id: 'b',
        text: 'A clearer sense of who I am',
        score: 2,
        feedback: 'Self-knowledge is portable.',
        patterns: ['analytical', 'patience']
      },
      {
        id: 'c',
        text: 'The skills I\'ve developed',
        score: 2,
        feedback: 'Capabilities serve wherever you go.',
        patterns: ['building']
      },
      {
        id: 'd',
        text: 'Questions I\'m still exploring',
        score: 2,
        feedback: 'The best journeys never truly end.',
        patterns: ['exploring']
      }
    ],
    evaluationCriteria: ['synthesis', 'forward-thinking'],
    maxScore: 2
  }
]
