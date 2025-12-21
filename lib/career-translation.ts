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
    analytical: 'Strategic Systems Architect',
    building: 'Solutions Engineer',
    exploring: 'Innovation Lead',
    helping: 'Engagement Director',
    patience: 'Operations Strategist'
}

/**
 * Generates the full career profile from game state
 */
export function generateCareerProfile(state: GameState): CareerProfile {
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
        analytical: "Data-driven decision making with a focus on systemic efficiency.",
        building: "Practical problem-solving emphasizing tangible results and rapid prototyping.",
        exploring: "Adaptive strategy focused on uncovering new market opportunities.",
        helping: "Consensus-building leadership prioritizing team cohesion and stakeholder alignment.",
        patience: "Long-term strategic planning with high resilience in high-pressure environments."
    }[pattern]

    return `A ${leadershipStyle} Demonstrated ability to navigate complex, ambiguous environments (Grand Central Terminus simulation) while maintaining operational continuity.`
}

function formatSkill(skillKey: string): string {
    // Map internal keys to Resume-speak
    const dictionary: Record<string, string> = {
        criticalThinking: 'Strategic Analysis',
        problemSolving: 'Complex Problem Solving',
        digitalLiteracy: 'Digital Fluency',
        timeManagement: 'Resource Optimization',
        adaptability: 'Adaptive Strategy',
        emotionalIntelligence: 'Stakeholder Management',
        creativity: 'Innovation Strategy',
        collaboration: 'Cross-functional Leadership',
        communication: 'Executive Communication',
        leadership: 'Team Leadership'
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
