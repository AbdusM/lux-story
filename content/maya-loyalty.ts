import { LoyaltyExperience, registerExperience } from '@/lib/experience-engine'

const MAYA_DEMO: LoyaltyExperience = {
    id: 'maya_demo',
    characterId: 'maya',
    title: 'The Demonstration',
    description: 'Maya is presenting her medical drone prototype to station leadership. She needs you to manage the presentation strategy.',
    startStepId: 'start',
    onComplete: (result, gameState) => {
        const updates: any = { globalFlags: new Set(gameState.globalFlags) }
        if (result === 'success') {
            updates.globalFlags.add('maya_demo_success')
            // Trust boost would happen in the wrapper or specific effect
        } else {
            updates.globalFlags.add('maya_demo_failure')
        }
        return updates
    },
    steps: {
        'start': {
            id: 'start',
            text: "Administrator Kael is looking at the drone with skepticism. 'It looks... fragile,' he says. Maya looks panic-stricken. 'It's a prototype! It's meant for precision, not-'\n\nShe's losing him. Intervene.",
            type: 'choice',
            choices: [
                {
                    id: 'tech_specs',
                    text: "[ANALYTICAL] Focus on the data. Show the efficiency metrics.",
                    nextStepId: 'step_technical',
                    requiredPattern: 'analytical',
                    patternLevel: 3
                },
                {
                    id: 'vision',
                    text: "[BUILDING] Focus on the potential. Describe the future infrastructure.",
                    nextStepId: 'step_vision',
                    requiredPattern: 'building',
                    patternLevel: 3
                },
                {
                    id: 'deflect',
                    text: "Distract Kael. 'Let's see it in action first.'",
                    nextStepId: 'step_action'
                }
            ]
        },
        'step_technical': {
            id: 'step_technical',
            text: "You project the flight stability graphs. 'It's not fragile,' you state. 'It's optimized. 99.8% stability in variable pressure.'\n\nKael raises an eyebrow. 'Efficient. But can it handle real-world debris?'",
            type: 'choice',
            choices: [
                {
                    id: 'sim_debris',
                    text: "Run the collision avoidance simulation.",
                    nextStepId: 'success'
                },
                {
                    id: 'honest_limits',
                    text: "Admit current limitations but highlight the sensor array.",
                    nextStepId: 'mixed'
                }
            ]
        },
        'step_vision': {
            id: 'step_vision',
            text: "You step forward. 'This isn't just a drone. It's the first node of an automated repair network.'\n\nMaya catches on. 'Exactly. It scales.'\n\nKael nods slowly. 'Ambitious. But expensive.'",
            type: 'choice',
            choices: [
                {
                    id: 'cost_benefit',
                    text: "[ANALYTICAL] Break down the long-term ROI.",
                    nextStepId: 'success'
                },
                {
                    id: 'safety_appeal',
                    text: "[HELPING] 'What is the cost of another accident in Sector 4?'",
                    nextStepId: 'success',
                    requiredPattern: 'helping',
                    patternLevel: 3
                }
            ]
        },
        'step_action': {
            id: 'step_action',
            text: "Maya activates the drone. It hovers, buzzing nervously. She tries to pick up a test canister, but her hands are shaking on the controller.",
            type: 'choice',
            choices: [
                {
                    id: 'steady_hand',
                    text: "[PATIENCE] Place a steadying hand on her shoulder. 'Breathe.'",
                    nextStepId: 'success',
                    requiredPattern: 'patience',
                    patternLevel: 3
                },
                {
                    id: 'take_control',
                    text: "Take the controller gently. 'Allow me.'",
                    nextStepId: 'mixed' // Competent but undermines her
                },
                {
                    id: 'watch',
                    text: "Let her struggle. She needs to do this.",
                    nextStepId: 'failure'
                }
            ]
        },
        'success': { id: 'success', text: "Success", type: 'choice' }, // Placeholder end states
        'failure': { id: 'failure', text: "Failure", type: 'choice' },
        'mixed': { id: 'mixed', text: "Mixed", type: 'choice' }
    }
}

registerExperience(MAYA_DEMO)
