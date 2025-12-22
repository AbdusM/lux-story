import { GameState } from './character-state'
import { PatternType, PATTERN_METADATA } from './patterns'

/**
 * Career Translation Engine
 * "The Reality Interface"
 * 
 * Maps game data to professional deliverables.
 * Transforms the player's choices into a strategic career profile.
 */

export interface CareerProfile {
    strategicRole: string
    executiveSummary: string
    coreCompetencies: string[]
    evidencePoints: string[]
    archetypeLabel: string
    archetypeDescription: string
}

const ROLE_MAPPINGS: Record<PatternType, string> = {
    analytical: 'The Systems Weaver',
    building: 'The World Builder',
    exploring: 'The Horizon Seeker',
    helping: 'The Resonance Engine',
    patience: 'The Deep Anchor'
}

/**
 * Generates the full career profile from game state
 */
export function generateCareerProfile(state: GameState): CareerProfile {
    // ... (unchanged logic)
    // 1. Determine Dominant Pattern
    const entries = Object.entries(state.patterns) as [PatternType, number][]
    const dominantPattern = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]

    // 2. Get Metadata
    const meta = PATTERN_METADATA[dominantPattern]

    // 3. Generate Executive Summary
    const summary = generateSummary(state, dominantPattern)

    // 4. Map Skills
    const competencies = meta.skills.map(skill => formatSkill(skill))

    // 5. Generate Evidence Points
    const evidence = generateEvidence(state)

    return {
        strategicRole: ROLE_MAPPINGS[dominantPattern],
        executiveSummary: summary,
        coreCompetencies: competencies,
        evidencePoints: evidence,
        archetypeLabel: meta.label,
        archetypeDescription: meta.contextDescription
    }
}

function generateSummary(state: GameState, pattern: PatternType): string {
    const leadershipStyle = {
        analytical: "You do not just solve problems; you dissolve them. You see the invisible architecture that governs reality.",
        building: "You act while others debate. You understand that the only way to predict the future is to build it yourself.",
        exploring: "You are allergic to the status quo. You find the edges of the map and push past them because that is where the truth lives.",
        helping: "You enable the genius of others. You are the invisible glue that turns a group of individuals into a unified force.",
        patience: "You possess the strength to wait. In a world of noise, your silence is the loudest signal."
    }[pattern]

    return `${leadershipStyle} The simulation confirms: you are a high-order strategic asset.`
}

function formatSkill(skillKey: string): string {
    // Map internal keys to Visionary Superpowers
    const dictionary: Record<string, string> = {
        criticalThinking: 'Piercing Insight',
        problemSolving: 'Reality Architecture',
        digitalLiteracy: 'Technological Intuition',
        timeManagement: 'Temporal Mastery',
        adaptability: 'Fluid Dynamics',
        emotionalIntelligence: 'Human Resonance',
        creativity: 'Impossible Design',
        collaboration: 'Force Multiplication',
        communication: 'Radical Clarity',
        leadership: 'Vision Generation'
    }
    return dictionary[skillKey] || skillKey
}

function generateEvidence(state: GameState): string[] {
    const points: string[] = []

    // Letter Decision -> Info Sec
    if (state.items.letter === 'burned') {
        points.push('Information Security: Demonstrated discretion with sensitive data handling.')
    } else if (state.items.letter === 'shown') {
        points.push('Transparency: Prioritized open communication in high-stakes scenarios.')
    }

    // Trust -> Leadership
    const highTrustCount = Array.from(state.characters.values()).filter(c => c.trust > 7).length
    if (highTrustCount >= 3) {
        points.push(`Relationship Building: Successfully established high-trust alliances with ${highTrustCount} key stakeholders.`)
    }

    // Mysteries -> Research
    if (state.mysteries.platformSeven === 'revealed') {
        points.push('Investigation: Uncovered hidden systemic anomalies through rigorous inquiry.')
    }

    // Episode completion -> Resilience
    points.push('Resilience: Completed objective despite ambiguous conditions and limited resources.')

    return points
}
