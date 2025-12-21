/**
 * ISP Phase 6: The Pulse
 * The Gothicvania Logic
 * 
 * "Elegance meets Dread."
 * 
 * Maps Biological State -> BPM & Harmony
 * - Low Anxiety: 100 BPM, A Harmonic Minor Arpeggios (Harpsichord)
 * - High Anxiety: 130 BPM, Driving Bass, Dissonant Tritones
 */

import { GameState } from '../character-state'
import { synthEngine } from './synth-engine'
import { isAudioEnabled } from '../audio-feedback'

export class GenerativeScore {
    private isRunning = false
    private timerID: NodeJS.Timeout | null = null

    // Sequencer State
    private bpm = 100
    private lookahead = 25.0 // ms
    private scheduleAheadTime = 0.1 // s
    private nextNoteTime = 0.0
    private current16thNote = 0

    // Musical State
    private intensity = 0 // 0-100 (Derived from Anxiety)
    private resilience = 0 // 0-100 (Derived from Patience)

    // Theory: A Harmonic Minor (A, B, C, D, E, F, G#, A)
    // Frequencies (A2 = 110Hz base)
    private scale = {
        A2: 110.00,
        B2: 123.47,
        C3: 130.81,
        D3: 146.83,
        E3: 164.81,
        F3: 174.61,
        Gs3: 207.65,
        A3: 220.00,
        C4: 261.63,
        E4: 329.63
    }

    start() {
        if (this.isRunning) return

        // Respect global audio setting
        if (!isAudioEnabled()) {
            console.log("🎼 Conductor: Audio disabled, remaining silent")
            return
        }

        synthEngine.wake().then(() => {
            this.isRunning = true
            this.nextNoteTime = synthEngine['context']!.currentTime
            this.scheduler()
            console.log("🎹 Gothic Engine: Awakened")
        })
    }

    stop() {
        this.isRunning = false
        if (this.timerID) clearTimeout(this.timerID)
        synthEngine.dispose()
    }

    /**
     * The Main Loop: Updates BPM and Intensity based on biology
     */
    update(state: GameState, characterId: string) {
        if (!this.isRunning) return

        const character = state.characters.get(characterId)
        if (!character) return

        const { anxiety } = character
        this.resilience = state.patterns.patience || 0
        this.intensity = anxiety

        // Map Anxiety to BPM
        // 0 Anxiety -> 100 BPM (Stately, Baroque)
        // 100 Anxiety -> 130 BPM (Urgent)
        this.bpm = 100 + (anxiety * 0.3)
    }

    /**
     * Web Audio Scheduler (Lookahead)
     */
    private scheduler() {
        if (!this.isRunning) return

        while (this.nextNoteTime < synthEngine['context']!.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.current16thNote, this.nextNoteTime)
            this.nextNote()
        }

        this.timerID = setTimeout(() => this.scheduler(), this.lookahead)
    }

    private nextNote() {
        const secondsPerBeat = 60.0 / this.bpm
        this.nextNoteTime += 0.25 * secondsPerBeat // Advance by 16th note
        this.current16thNote++
        if (this.current16thNote === 16) {
            this.current16thNote = 0
        }
    }

    /**
     * The Sequencer Logic - Gothic Arpeggiators
     */
    private scheduleNote(beatNumber: number, time: number) {
        // 1. The Kick (The Castle Gate)
        // Only enters when tension rises (Anxiety > 30)
        const kickBeats = [0, 6, 10]
        if (this.intensity > 30 && kickBeats.includes(beatNumber)) {
            // High Anxiety = More kick distortion
            const distortion = this.intensity > 50 ? (this.intensity - 50) : 0
            synthEngine.triggerKick(time, distortion)
        }

        // 2. The Bass (The Undertow)
        // Enters early (Anxiety > 10) to support the harpsichord
        if (this.intensity > 10 && beatNumber % 2 === 0) {
            let note = this.scale.A2
            // ... (rest of bass logic)
            // Use intensity to switch to "Tension" notes (F3, G#3)
            if (this.intensity > 40 && (beatNumber === 8 || beatNumber === 10)) {
                note = this.scale.F3 // The distinctive VI chord root
            }
            if (this.intensity > 60 && (beatNumber === 12 || beatNumber === 14)) {
                note = this.scale.Gs3 // The Leading Tone (very gothic)
            }

            // Aggression filter opens up with anxiety
            const aggression = this.intensity / 100
            synthEngine.triggerBass(time, note, aggression * 0.5)
        }

        // 3. The Arpeggio (The Harpsichord)
        // ALWAYS ACTIVE (The signature sound)
        // Pattern: Root - Minor 3rd - 5th - Octave (A C E A)
        // Or Pattern: Root - 5th - Octave - 5th (A E A E)

        // "Alberti Bass" style or similar Baroque figuration
        const arpPattern = [
            this.scale.A3, this.scale.E4, this.scale.A3, this.scale.C4,
            this.scale.A3, this.scale.E4, this.scale.A3, this.scale.C4,
            // Variation on second half
            this.scale.F3, this.scale.C4, this.scale.F3, this.scale.A3,
            this.scale.E3, this.scale.B2, this.scale.E3, this.scale.Gs3
        ]

        const note = arpPattern[beatNumber]
        if (note) {
            // Random chance to skip notes for "decayed" feel if resilience is low
            if (Math.random() > 0.1) {
                synthEngine.triggerPluck(time, note)
            }
        }


        // 4. The Bell/Spark (The Ghost)
        // Rare, high resonant chime on beat 1 or syncopated
        if (beatNumber === 0 && Math.random() > 0.5) {
            synthEngine.triggerSpark(this.scale.E4 * 2) // High E (Dominant)
        }
    }
}

export const generativeScore = new GenerativeScore()
