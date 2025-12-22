export interface SkillDefinition {
    id: string
    title: string
    superpowerName: string
    definition: string
    manifesto: string
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
        manifesto: 'If they didn\'t understand, you didn\'t communicate. Simplicity is your sword.'
    }
}
