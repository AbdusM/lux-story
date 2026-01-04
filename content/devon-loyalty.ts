import { LoyaltyExperience, registerExperience } from '@/lib/experience-engine'

const DEVON_OUTAGE: LoyaltyExperience = {
    id: 'devon_outage',
    characterId: 'devon',
    title: 'System Failure',
    description: 'A cascading power failure threatens the life support systems in Sector 3. Devon needs help triaging the grid.',
    startStepId: 'start',
    onComplete: (result, gameState) => {
        const updates: any = { globalFlags: new Set(gameState.globalFlags) }
        if (result === 'success') {
            updates.globalFlags.add('devon_outage_success')
        } else {
            updates.globalFlags.add('devon_outage_failure')
        }
        return updates
    },
    steps: {
        'start': {
            id: 'start',
            text: "Red alarms scream through the corridor. Devon is at a terminal, typing furiously. 'It's cascading,' he yells. 'Primary containment failed. If I reroute to backup, we lose the cryo-storerooms. If I don't, we might lose pressure in the Hub.'",
            type: 'timed_challenge',
            duration: 15000, // 15 seconds real-time pressure
            choices: [
                {
                    id: 'save_hub',
                    text: "[HELPING] 'Save the Hub! People are there.'",
                    nextStepId: 'hub_focus'
                },
                {
                    id: 'analyze_cascade',
                    text: "[ANALYTICAL] 'Wait. Where is the surge originating?'",
                    nextStepId: 'root_cause',
                    requiredPattern: 'analytical',
                    patternLevel: 3
                },
                {
                    id: 'manual_override',
                    text: "[BUILDING] 'I can manual override the junction. Buy me time.'",
                    nextStepId: 'manual_fix',
                    requiredPattern: 'building',
                    patternLevel: 3
                }
            ]
        },
        'hub_focus': {
            id: 'hub_focus',
            text: "Devon nods and slams the reroute command. The lights flicker and die, then emergency red kicks in. 'Hub is safe,' he pants. 'But we lost the storerooms. Years of seeds and samples... gone.'",
            type: 'choice',
            choices: [
                {
                    id: 'comfort',
                    text: "'We saved the people, Devon. That's what matters.'",
                    nextStepId: 'mixed'
                },
                {
                    id: 'pragmatic',
                    text: "'It was the only choice.'",
                    nextStepId: 'mixed'
                }
            ]
        },
        'root_cause': {
            id: 'root_cause',
            text: "You scan the flow data. 'There. Sector 4 junction is looping back on itself.'\n\nDevon's eyes widen. 'A feedback loop. If we cut it...'\n\n'The whole system stabilizes.'",
            type: 'choice',
            choices: [
                {
                    id: 'execute_cut',
                    text: "Cut the connection together.",
                    nextStepId: 'success'
                }
            ]
        },
        'manual_fix': {
            id: 'manual_fix',
            text: "You sprint to the wall panel and rip it open. Sparks shower down. You have seconds to bridge the blown fuse.",
            type: 'choice', // Could be a mini-game in full version
            choices: [
                {
                    id: 'bridge_connection',
                    text: "[BUILDING] Use your multi-tool to bridge the gap.",
                    nextStepId: 'success'
                }
            ]
        },
        'success': { id: 'success', text: "Success", type: 'choice' },
        'failure': { id: 'failure', text: "Failure", type: 'choice' },
        'mixed': { id: 'mixed', text: "Mixed", type: 'choice' }
    }
}

registerExperience(DEVON_OUTAGE)
