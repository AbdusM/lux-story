/**
 * Pattern-Based Endings
 *
 * Different ending narratives based on player's dominant pattern.
 * Triggered when player completes the station mystery arc.
 */

import { type PatternType } from './patterns'

export interface PatternEnding {
    pattern: PatternType
    title: string
    subtitle: string
    narrative: string[]
    callToAction: string
}

export const PATTERN_ENDINGS: Record<PatternType, PatternEnding> = {
    analytical: {
        pattern: 'analytical',
        title: 'The Clear-Eyed Path',
        subtitle: 'You see the world as it truly is',
        narrative: [
            "You came to Grand Central seeking answers. You found them—not in simple solutions, but in understanding the complex systems that shape our lives.",
            "Your mind cuts through noise to find signal. Where others see chaos, you see patterns. Where others feel lost, you find the logic underneath.",
            "The world needs people who can think clearly, who can analyze problems without flinching from hard truths. That's your gift.",
            "Take it forward. The puzzles out there are waiting for someone like you to solve them."
        ],
        callToAction: "Your analytical mind is your compass. Trust it."
    },

    patience: {
        pattern: 'patience',
        title: 'The Anchor Point',
        subtitle: 'You are the stillness in the storm',
        narrative: [
            "In a world obsessed with speed, you found power in slowing down. You listened when others talked. You waited when others rushed.",
            "Your journey wasn't about conquering the station. It was about inhabiting it. Understanding that some truths only reveal themselves in silence.",
            "We need that stillness. We need people who can hold space for complexity without forcing a resolution.",
            "Carry that peace with you. It's rare, and it's necessary."
        ],
        callToAction: "Your patience is not passivity. It is strength."
    },

    exploring: {
        pattern: 'exploring',
        title: 'The Open Horizon',
        subtitle: 'You map the edges of the unknown',
        narrative: [
            "You didn't just walk the path; you widened it. Every question you asked opened a new door. Every curiosity led to a new discovery.",
            "The station is vast, but your imagination is vaster. You refused to accept the surface-level explanation. You wanted to know *why*.",
            "That hunger for the unknown is what drives humanity forward. Don't ever let it be unsatisfied.",
            "The map is never finished. Keep drawing it."
        ],
        callToAction: "Your curiosity is the key that unlocks the future."
    },

    helping: {
        pattern: 'helping',
        title: 'The Human Thread',
        subtitle: 'You weave the connections that matter',
        narrative: [
            "You realized early on that the station isn't about trains or architecture. It's about people. And you made every interaction count.",
            "You listened. You supported. You saw the person behind the role. You turned a labyrinth of strangers into a community.",
            "In a fragmented world, connection is a radical act. You are a weaver of that connection.",
            "Don't lose that warmth. It lights the way for everyone else."
        ],
        callToAction: "Your empathy is a superpower. Use it."
    },

    building: {
        pattern: 'building',
        title: 'The Architect\'s Vision',
        subtitle: 'You see what could be, and make it so',
        narrative: [
            "You didn't just observe the station; you thought about how to improve it. You saw potential where others saw limits.",
            "Your mind is a workshop. You understand that the future isn't something that happens to us—it's something we make.",
            "We need builders. We need visionaries who aren't afraid to get their hands dirty to create something new.",
            "Go build. The world is waiting for your blueprint."
        ],
        callToAction: "Your vision is the foundation of tomorrow."
    }
}

/**
 * Get the ending content for a specific pattern
 */
export function getPatternEnding(pattern: PatternType): PatternEnding {
    if (pattern in PATTERN_ENDINGS) {
        return PATTERN_ENDINGS[pattern]
    }
    // Fallback if somehow an invalid pattern occurs
    return PATTERN_ENDINGS.exploring
}
