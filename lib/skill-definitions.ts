export interface SkillDefinition {
    id: string
    title: string
    superpowerName: string
    definition: string
    manifesto: string
    tacticalScenario?: string
}

export const SKILL_DEFINITIONS: Record<string, SkillDefinition> = {
    // --- MIND CLUSTER ---
    criticalThinking: {
        id: 'criticalThinking',
        title: 'Critical Thinking',
        superpowerName: 'Piercing Insight',
        definition: 'The ability to deconstruct reality into its component truths.',
        manifesto: 'You do not accept surface-level explanations. You cut through the noise to find the signal.'
    },
    problemSolving: {
        id: 'problemSolving',
        title: 'Problem Solving',
        superpowerName: 'Reality Architecture',
        definition: 'The capacity to reassemble broken systems into functional wholes.',
        manifesto: 'Problems are not obstacles; they are design flaws waiting for your correction.'
    },
    systemsThinking: {
        id: 'systemsThinking',
        title: 'Systems Thinking',
        superpowerName: 'Pattern Recognition',
        definition: 'Seeing the invisible threads that connect dispersed events.',
        manifesto: 'You understand that nothing happens in isolation. You see the butterfly, you fear the hurricane.'
    },
    digitalLiteracy: {
        id: 'digitalLiteracy',
        title: 'Digital Literacy',
        superpowerName: 'Technological Intuition',
        definition: 'Fluency in the language of the machine.',
        manifesto: 'The digital realm is not a tool; it is an extension of your own nervous system.'
    },
    technicalLiteracy: {
        id: 'technicalLiteracy',
        title: 'Technical Literacy',
        superpowerName: 'Component Mastery',
        definition: 'Understanding the nuts and bolts of the engine.',
        manifesto: 'You do not just drive the car; you know exactly how the pistons fire.'
    },
    informationLiteracy: {
        id: 'informationLiteracy',
        title: 'Information Literacy',
        superpowerName: 'Source Verification',
        definition: 'The filter that distinguishes fact from fabrication.',
        manifesto: 'In an age of infinite data, your discernment is the ultimate currency.'
    },
    strategicThinking: {
        id: 'strategicThinking',
        title: 'Strategic Thinking',
        superpowerName: 'Future Casting',
        definition: 'Playing the game four moves ahead of the present.',
        manifesto: 'While others react to today, you are already shaping the outcome of next week.'
    },

    // --- HEART CLUSTER ---
    emotionalIntelligence: {
        id: 'emotionalIntelligence',
        title: 'Emotional Intelligence',
        superpowerName: 'Human Resonance',
        definition: 'The ability to read the hidden emotional spectrum of others.',
        manifesto: 'You hear what is not being said. You feel the room before you enter it.'
    },
    empathy: {
        id: 'empathy',
        title: 'Empathy',
        superpowerName: 'Deep Connection',
        definition: 'Dissolving the barrier between self and other.',
        manifesto: 'You do not just observe pain; you share it, and in doing so, you heal it.'
    },
    patience: {
        id: 'patience',
        title: 'Patience',
        superpowerName: 'Temporal Anchor',
        definition: 'The strength to remain still when the world demands motion.',
        manifesto: 'Time is your ally, not your enemy. You wait for the precise moment to strike.'
    },
    culturalCompetence: {
        id: 'culturalCompetence',
        title: 'Cultural Competence',
        superpowerName: 'Global Perspective',
        definition: 'Navigating the complex codes of diverse human tribes.',
        manifesto: 'You are a citizen of the world. No custom is foreign to you; no border is absolute.'
    },
    mentorship: {
        id: 'mentorship',
        title: 'Mentorship',
        superpowerName: 'Talent Activation',
        definition: 'Unlocking the latent potential in others.',
        manifesto: 'Your legacy is not what you build, but who you build up.'
    },
    encouragement: {
        id: 'encouragement',
        title: 'Encouragement',
        superpowerName: 'Morale Injection',
        definition: 'The fuel that keeps the engine running against the odds.',
        manifesto: 'A single word from you can turn a retreat into a charge.'
    },
    respect: {
        id: 'respect',
        title: 'Respect',
        superpowerName: 'Dignity Enforcement',
        definition: 'Recognizing the sovereign value of every consciousness.',
        manifesto: 'You treat the janitor with the same gravity as the CEO. Class is irrelevant.'
    },

    // --- VOICE CLUSTER ---
    creativity: {
        id: 'creativity',
        title: 'Creativity',
        superpowerName: 'Impossible Design',
        definition: 'Generating solutions that logic deems impossible.',
        manifesto: 'You do not think outside the box; you realize there is no box.'
    },
    marketing: {
        id: 'marketing',
        title: 'Marketing',
        superpowerName: 'Idea Transmission',
        definition: 'Packaging truth so that it becomes contagious.',
        manifesto: 'The best product does not win; the best story does. You tell the story.'
    },
    curriculumDesign: {
        id: 'curriculumDesign',
        title: 'Curriculum Design',
        superpowerName: 'Knowledge Architecture',
        definition: 'Structuring chaos into a learnable path.',
        manifesto: 'You build the ladder that allows others to climb to your level.'
    },
    collaboration: {
        id: 'collaboration',
        title: 'Collaboration',
        superpowerName: 'Force Multiplication',
        definition: 'Merging distinct signals into a harmonious output.',
        manifesto: '1 + 1 = 3. You make the whole greater than the sum of its parts.'
    },
    wisdom: {
        id: 'wisdom',
        title: 'Wisdom',
        superpowerName: 'Deep Knowing',
        definition: 'Pattern recognition applied to the human condition.',
        manifesto: 'Knowledge is knowing that a tomato is a fruit. Wisdom is knowing not to put it in a fruit salad.'
    },
    curiosity: {
        id: 'curiosity',
        title: 'Curiosity',
        superpowerName: 'Relentless Inquiry',
        definition: 'The itch that can only be scratched by discovery.',
        manifesto: 'You are never satisfied with "good enough." You always ask "what if?"'
    },
    observation: {
        id: 'observation',
        title: 'Observation',
        superpowerName: 'Active Witness',
        definition: 'Seeing what others overlook.',
        manifesto: 'The clues are always there. You are simply the only one watching.'
    },

    // --- HANDS CLUSTER ---
    leadership: {
        id: 'leadership',
        title: 'Leadership',
        superpowerName: 'Vision Generation',
        definition: 'Defining reality for those who cannot define it for themselves.',
        manifesto: 'You do not ask for permission. You set the direction and the tribe follows.'
    },
    crisisManagement: {
        id: 'crisisManagement',
        title: 'Crisis Management',
        superpowerName: 'Storm Navigation',
        definition: 'Operating at peak efficiency when the system is failing.',
        manifesto: 'Panic is a luxury you cannot afford. When the alarms ring, you get quiet.'
    },
    triage: {
        id: 'triage',
        title: 'Triage',
        superpowerName: 'Ruthless Prioritization',
        definition: 'Deciding what lives and what dies to save the organism.',
        manifesto: 'You make the hard calls that others are too afraid to voice.'
    },
    courage: {
        id: 'courage',
        title: 'Courage',
        superpowerName: 'Fear Mastery',
        definition: 'Acting in spite of terror.',
        manifesto: 'Bravery is not the absence of fear; it is the mastery of it.'
    },
    resilience: {
        id: 'resilience',
        title: 'Resilience',
        superpowerName: 'Antifragility',
        definition: 'Becoming stronger with every blow.',
        manifesto: 'You do not bounce back; you bounce forward. Pain is just data.'
    },
    actionOrientation: {
        id: 'actionOrientation',
        title: 'Action Orientation',
        superpowerName: 'Kinetic Bias',
        definition: 'The preference for movement over deliberation.',
        manifesto: 'Analysis paralysis is death. When in doubt, move.'
    },
    riskManagement: {
        id: 'riskManagement',
        title: 'Risk Management',
        superpowerName: 'Calculated Gamble',
        definition: 'Knowing exactly how far to push before the break.',
        manifesto: 'You bet big, but you never bet blindly.'
    },
    urgency: {
        id: 'urgency',
        title: 'Urgency',
        superpowerName: 'Velocity Enforcement',
        definition: 'Compressing timelines through sheer will.',
        manifesto: 'Later is never. We execute now.'
    },

    // --- COMPASS CLUSTER ---
    adaptability: {
        id: 'adaptability',
        title: 'Adaptability',
        superpowerName: 'Fluid Dynamics',
        definition: 'Morpheing your approach to fit the changing container.',
        manifesto: 'Be like water. The rigid branch breaks; the willow bends and survives.'
    },
    learningAgility: {
        id: 'learningAgility',
        title: 'Learning Agility',
        superpowerName: 'Rapid Absorption',
        definition: 'Decoding new syntax in real-time.',
        manifesto: 'You are a perpetual rookie, always hungry for the next lesson.'
    },
    humility: {
        id: 'humility',
        title: 'Humility',
        superpowerName: 'Ego Suspension',
        definition: 'Removing the self from the equation to see the truth.',
        manifesto: 'You do not need to be right; you need to win. There is a difference.'
    },
    fairness: {
        id: 'fairness',
        title: 'Fairness',
        superpowerName: 'Systemic Justice',
        definition: 'Balancing the scales irrespective of personal bias.',
        manifesto: 'A rigged game serves no one. You enforce the rules of the playground.'
    },
    pragmatism: {
        id: 'pragmatism',
        title: 'Pragmatism',
        superpowerName: 'Effective Truth',
        definition: 'Valuing what works over what feels good.',
        manifesto: 'Theory is nice. Results are better. You deal in results.'
    },
    integrity: {
        id: 'integrity',
        title: 'Integrity',
        superpowerName: 'Core Alignment',
        definition: 'Absolute consistency between word and deed.',
        manifesto: 'You are the same person in the dark as you are in the light.'
    },
    accountability: {
        id: 'accountability',
        title: 'Accountability',
        superpowerName: 'Ownership',
        definition: 'Standing by your output, pass or fail.',
        manifesto: 'No excuses. No blame. The buck stops here.'
    },

    // --- CRAFT CLUSTER ---
    deepWork: {
        id: 'deepWork',
        title: 'Deep Work',
        superpowerName: 'Hyper Focus',
        definition: 'Entering the flow state at will.',
        manifesto: 'Distraction is the enemy of craft. You go deep where others skim the surface.'
    },
    timeManagement: {
        id: 'timeManagement',
        title: 'Time Management',
        superpowerName: 'Temporal Mastery',
        definition: 'Bending the clock to fit your agenda.',
        manifesto: 'We all have 24 hours. You just use yours better.'
    },
    financialLiteracy: {
        id: 'financialLiteracy',
        title: 'Financial Literacy',
        superpowerName: 'Value Assessment',
        definition: 'Understanding the flow of resources.',
        manifesto: 'Money is energy. You know how to channel it efficiently.'
    },

    // --- CENTER HUB ---
    communication: {
        id: 'communication',
        title: 'Communication',
        superpowerName: 'Radical Clarity',
        definition: 'Transmitting complex ideas with zero signal loss.',
        manifesto: 'If they didn\'t understand, you didn\'t communicate. Simplicity is your sword.',
        tacticalScenario: 'Use when team alignment is fracturing. Cut through jargon and ambiguity to realign everyone on the singular objective.'
    },
    // --- FUTURE OF WORK (AI) ---
    aiLiteracy: {
        id: 'aiLiteracy',
        title: 'AI Literacy',
        superpowerName: 'Synthetic Fluency',
        definition: 'Navigating the new intelligence layer with confidence.',
        manifesto: 'You treat AI not as a magic box, but as a lever. You know when to push, when to pull, and when to let go.'
    },
    agenticCoding: {
        id: 'agenticCoding',
        title: 'Agentic Coding',
        superpowerName: 'System Architecture',
        definition: 'Directing autonomous agents to build complex systems.',
        manifesto: 'You do not just write code; you orchestrate its creation. You are the conductor, not just the violinist.'
    },
    multimodalCreation: {
        id: 'multimodalCreation',
        title: 'Multimodal Creation',
        superpowerName: 'Reality Synthesis',
        definition: 'Blending text, image, and voice into cohesive narratives.',
        manifesto: 'The medium is no longer the message. The vision is the message. You use every tool to manifest it.'
    },
    dataDemocratization: {
        id: 'dataDemocratization',
        title: 'Data Democratization',
        superpowerName: 'Conversational Analytics',
        definition: 'Asking questions of data as if it were a colleague.',
        manifesto: 'You do not need a translator for the truth. You speak the language of facts directly.'
    },
    workflowOrchestration: {
        id: 'workflowOrchestration',
        title: 'Workflow Orchestration',
        superpowerName: 'Friction Removal',
        definition: 'Automating the mundane to liberate the mind for the meaningful.',
        manifesto: 'If a machine can do it, a human should not. You preserve your energy for what only you can do.'
    },
    groundedResearch: {
        id: 'groundedResearch',
        title: 'Grounded Research',
        superpowerName: 'Source Truth',
        definition: 'Synthesizing vast knowledge without losing the thread of origin.',
        manifesto: 'In an ocean of noise, you anchor to the facts. You trust, but you always verify.'
    },

    // --- ADDITIONAL SKILLS (Formalized from content usage) ---
    visionaryThinking: {
        id: 'visionaryThinking',
        title: 'Visionary Thinking',
        superpowerName: 'Future Sight',
        definition: 'Seeing possibilities that others dismiss as impossible.',
        manifesto: 'You paint with colors that do not yet exist. The future is not discovered; it is invented.'
    },
    sustainability: {
        id: 'sustainability',
        title: 'Sustainability',
        superpowerName: 'Regenerative Design',
        definition: 'Building systems that strengthen rather than deplete.',
        manifesto: 'You measure success not by what you take, but by what you leave behind for others.'
    },
    entrepreneurship: {
        id: 'entrepreneurship',
        title: 'Entrepreneurship',
        superpowerName: 'Opportunity Alchemy',
        definition: 'Transforming uncertainty into value through calculated action.',
        manifesto: 'Where others see risk, you see runway. Where others see problems, you see products.'
    },
    instructionalDesign: {
        id: 'instructionalDesign',
        title: 'Instructional Design',
        superpowerName: 'Learning Architecture',
        definition: 'Engineering experiences that transform confusion into competence.',
        manifesto: 'You do not just teach; you build the scaffolding for understanding itself.'
    },
    psychology: {
        id: 'psychology',
        title: 'Psychology',
        superpowerName: 'Mind Mapping',
        definition: 'Understanding the hidden drivers of human behavior.',
        manifesto: 'You see the iceberg beneath the surface. What people do is only a fraction of who they are.'
    },
    pedagogy: {
        id: 'pedagogy',
        title: 'Pedagogy',
        superpowerName: 'Teaching Craft',
        definition: 'The art and science of helping others learn.',
        manifesto: 'You meet learners where they are and guide them to where they need to be.'
    },
    promptEngineering: {
        id: 'promptEngineering',
        title: 'Prompt Engineering',
        superpowerName: 'AI Whispering',
        definition: 'Crafting precise instructions that unlock AI potential.',
        manifesto: 'You speak the language of machines with the clarity of poetry. Garbage in, gold out.'
    },
    humor: {
        id: 'humor',
        title: 'Humor',
        superpowerName: 'Tension Release',
        definition: 'Using levity to disarm, connect, and illuminate.',
        manifesto: 'You know that laughter is the shortest distance between two people.'
    },

    // --- ETHICS & VALUES CLUSTER ---
    ethicalReasoning: {
        id: 'ethicalReasoning',
        title: 'Ethical Reasoning',
        superpowerName: 'Moral Compass',
        definition: 'Navigating complex decisions through principled frameworks.',
        manifesto: 'Right and wrong are not always clear, but you have the tools to find the truth in the grey.'
    },
    values: {
        id: 'values',
        title: 'Values',
        superpowerName: 'Core Principles',
        definition: 'Living in alignment with your deepest beliefs.',
        manifesto: 'Your actions are an expression of what you hold sacred. Compromise elsewhere, never here.'
    },
    compliance: {
        id: 'compliance',
        title: 'Compliance',
        superpowerName: 'Regulatory Navigation',
        definition: 'Understanding and working within established rules and frameworks.',
        manifesto: 'Rules are not obstacles; they are the guardrails that keep the system fair for everyone.'
    },
    utilitarian: {
        id: 'utilitarian',
        title: 'Utilitarian Thinking',
        superpowerName: 'Greatest Good',
        definition: 'Optimizing decisions for maximum collective benefit.',
        manifesto: 'You measure success by how many lives are improved, not by who gets the credit.'
    },

    // --- SELF & PERSONAL GROWTH CLUSTER ---
    selfAwareness: {
        id: 'selfAwareness',
        title: 'Self-Awareness',
        superpowerName: 'Inner Mirror',
        definition: 'Understanding your own patterns, biases, and blind spots.',
        manifesto: 'Know thyself. The unexamined life is a ship without a rudder.'
    },
    grounding: {
        id: 'grounding',
        title: 'Grounding',
        superpowerName: 'Centered Presence',
        definition: 'Staying anchored when chaos swirls around you.',
        manifesto: 'You are the eye of the storm. While others spin, you remain still.'
    },
    confidence: {
        id: 'confidence',
        title: 'Confidence',
        superpowerName: 'Self-Trust',
        definition: 'Believing in your capacity to handle what comes.',
        manifesto: 'You do not need external validation. You know what you bring to the table.'
    },
    growth: {
        id: 'growth',
        title: 'Growth Mindset',
        superpowerName: 'Infinite Potential',
        definition: 'Viewing challenges as opportunities for development.',
        manifesto: 'You are not fixed. Every failure is a lesson, every setback a setup for a comeback.'
    },
    purpose: {
        id: 'purpose',
        title: 'Purpose',
        superpowerName: 'North Star',
        definition: 'Understanding why you do what you do.',
        manifesto: 'When you know your why, the how becomes bearable. Purpose is your fuel.'
    },
    discipline: {
        id: 'discipline',
        title: 'Discipline',
        superpowerName: 'Iron Will',
        definition: 'Doing what needs to be done, regardless of how you feel.',
        manifesto: 'Motivation is fickle. Discipline is reliable. You show up every single day.'
    },
    mastery: {
        id: 'mastery',
        title: 'Mastery',
        superpowerName: 'Craft Perfection',
        definition: 'The relentless pursuit of excellence in your domain.',
        manifesto: 'Good enough is the enemy of great. You practice until the difficult becomes effortless.'
    },
    openness: {
        id: 'openness',
        title: 'Openness',
        superpowerName: 'Receptive Mind',
        definition: 'Embracing new ideas without immediate judgment.',
        manifesto: 'Your mind is a parachute. It only works when it is open.'
    },

    // --- COMMUNICATION & SOCIAL CLUSTER ---
    activeListening: {
        id: 'activeListening',
        title: 'Active Listening',
        superpowerName: 'Deep Hearing',
        definition: 'Hearing not just words, but meaning, emotion, and intent.',
        manifesto: 'Most people listen to reply. You listen to understand.'
    },
    negotiation: {
        id: 'negotiation',
        title: 'Negotiation',
        superpowerName: 'Win-Win Creation',
        definition: 'Finding agreements that leave all parties better off.',
        manifesto: 'The best deals are not won; they are engineered so everyone feels victorious.'
    },
    socialLearning: {
        id: 'socialLearning',
        title: 'Social Learning',
        superpowerName: 'Collective Wisdom',
        definition: 'Learning from the experiences and insights of others.',
        manifesto: 'You do not need to make every mistake yourself. You learn from the scars of those who walked before.'
    },
    selfMarketing: {
        id: 'selfMarketing',
        title: 'Self-Marketing',
        superpowerName: 'Value Articulation',
        definition: 'Communicating your worth without arrogance.',
        manifesto: 'If you do not tell your story, someone else will. Make sure they get it right.'
    },

    // --- ANALYTICAL & DATA CLUSTER ---
    dataAnalysis: {
        id: 'dataAnalysis',
        title: 'Data Analysis',
        superpowerName: 'Pattern Extraction',
        definition: 'Transforming raw numbers into actionable insights.',
        manifesto: 'Data does not lie, but it does not volunteer the truth either. You ask the right questions.'
    },
    dataLiteracy: {
        id: 'dataLiteracy',
        title: 'Data Literacy',
        superpowerName: 'Numerical Fluency',
        definition: 'Reading, understanding, and communicating with data.',
        manifesto: 'In a world drowning in data, you are fluent in its language.'
    },
    attentionToDetail: {
        id: 'attentionToDetail',
        title: 'Attention to Detail',
        superpowerName: 'Precision Focus',
        definition: 'Catching the small errors that cause big problems.',
        manifesto: 'God is in the details. Devils too. You find them both.'
    },

    // --- TECHNICAL CLUSTER ---
    cybersecurity: {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        superpowerName: 'Digital Defense',
        definition: 'Protecting systems and data from malicious actors.',
        manifesto: 'You think like the attacker so you can defend like a fortress.'
    },
    technology: {
        id: 'technology',
        title: 'Technology',
        superpowerName: 'Tool Mastery',
        definition: 'Leveraging tools to amplify human capability.',
        manifesto: 'Technology is an extension of your will. You wield it, not the other way around.'
    },
    debuggingMastery: {
        id: 'debuggingMastery',
        title: 'Debugging Mastery',
        superpowerName: 'Root Cause Hunter',
        definition: 'Systematically isolating and eliminating defects.',
        manifesto: 'Bugs are puzzles. You love puzzles. You will find where it breaks.'
    },
    debugging: {
        id: 'debugging',
        title: 'Debugging',
        superpowerName: 'Error Elimination',
        definition: 'Finding and fixing problems in complex systems.',
        manifesto: 'Something is wrong. You will find it. You will fix it. That is what you do.'
    },
    distributedSystems: {
        id: 'distributedSystems',
        title: 'Distributed Systems',
        superpowerName: 'Network Architecture',
        definition: 'Designing systems that work across multiple machines.',
        manifesto: 'You understand that the network is not reliable, and you build for that truth.'
    },
    observability: {
        id: 'observability',
        title: 'Observability',
        superpowerName: 'System Insight',
        definition: 'Making complex systems transparent and debuggable.',
        manifesto: 'You cannot fix what you cannot see. You make the invisible visible.'
    },
    incidentManagement: {
        id: 'incidentManagement',
        title: 'Incident Management',
        superpowerName: 'Crisis Response',
        definition: 'Coordinating effective responses when things go wrong.',
        manifesto: 'When the alarms ring, you do not panic. You execute the playbook.'
    },

    // --- CREATIVE & STRATEGY CLUSTER ---
    contentCreation: {
        id: 'contentCreation',
        title: 'Content Creation',
        superpowerName: 'Story Weaving',
        definition: 'Crafting compelling narratives across mediums.',
        manifesto: 'Every piece of content is a chance to change a mind. You do not waste chances.'
    },
    metaphoricalThinking: {
        id: 'metaphoricalThinking',
        title: 'Metaphorical Thinking',
        superpowerName: 'Abstract Bridging',
        definition: 'Explaining complex ideas through relatable comparisons.',
        manifesto: 'A good metaphor is worth a thousand explanations. You find the bridge between the known and unknown.'
    },
    projectManagement: {
        id: 'projectManagement',
        title: 'Project Management',
        superpowerName: 'Orchestrated Execution',
        definition: 'Coordinating people, resources, and timelines to achieve goals.',
        manifesto: 'Vision without execution is hallucination. You turn plans into reality.'
    },
    prioritization: {
        id: 'prioritization',
        title: 'Prioritization',
        superpowerName: 'Essential Focus',
        definition: 'Knowing what matters most and acting accordingly.',
        manifesto: 'You cannot do everything, but you can do the right things. You choose wisely.'
    }
}

// Skill-to-character development hints (Moved from SkillsView)
export const SKILL_CHARACTER_HINTS: Record<string, string[]> = {
    leadership: ['Maya', 'Samuel'],
    courage: ['Kai', 'Maya'],
    criticalThinking: ['Rohan', 'Kai'],
    problemSolving: ['Devon', 'Rohan'],
    systemsThinking: ['Silas', 'Rohan'],
    crisisManagement: ['Silas', 'Kai'],
    triage: ['Silas'],
    digitalLiteracy: ['Rohan', 'Kai'],
    technicalLiteracy: ['Rohan'],
    adaptability: ['Kai', 'Jordan'],
    resilience: ['Kai', 'Jordan'],
    learningAgility: ['Rohan', 'Maya'],
    emotionalIntelligence: ['Devon', 'Maya', 'Jordan'],
    empathy: ['Jordan', 'Devon'],
    patience: ['Samuel', 'Jordan'],
    culturalCompetence: ['Jordan', 'Yaquin'],
    creativity: ['Maya', 'Tess'],
    marketing: ['Maya'],
    communication: ['Samuel', 'Maya', 'Devon'],
    collaboration: ['Devon', 'Jordan'],
    humility: ['Rohan', 'Jordan'],
    fairness: ['Silas', 'Jordan'],
    pragmatism: ['Rohan', 'Samuel'],
    deepWork: ['Rohan'],
    timeManagement: ['Samuel', 'Kai'],
    curriculumDesign: ['Kai'],
    mentorship: ['Samuel'],
    wisdom: ['Samuel', 'Yaquin'],
    observation: ['Tess'],
    curiosity: ['Tess', 'Rohan'],
    integrity: ['Samuel', 'Silas'],
    accountability: ['Kai', 'Samuel'],
    financialLiteracy: ['Devon'],
    actionOrientation: ['Kai', 'Maya'],
    riskManagement: ['Silas', 'Kai'],
    urgency: ['Silas'],
    encouragement: ['Jordan', 'Samuel'],
    respect: ['Samuel', 'Jordan'],
    informationLiteracy: ['Rohan'],
    strategicThinking: ['Maya', 'Silas']
}
