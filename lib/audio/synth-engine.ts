/**
 * ISP Phase 4: Symphonic Agency
 * The Synthesizer Engine
 * 
 * Wraps the Web Audio API to provide controllable sonic layers.
 * We don't use samples; we use mathematics.
 */

// Safety check for SSR
const isBrowser = typeof window !== 'undefined'

export type SonicLayerType = 'ground' | 'tension' | 'spark'

interface SonicLayer {
    type: SonicLayerType
    oscillator?: OscillatorNode
    gain: GainNode
    filter: BiquadFilterNode
    pan: StereoPannerNode
}

export class SynthEngine {
    private context: AudioContext | null = null
    private masterGain: GainNode | null = null

    // The Orchestra
    private layers: Map<SonicLayerType, SonicLayer> = new Map()
    private isInitialized = false
    private isMuted = false

    constructor() {
        if (!isBrowser) return
    }

    /**
     * wake()
     * Initialize the AudioContext (must be called after user interaction)
     */
    async wake() {
        if (this.isInitialized) {
            if (this.context?.state === 'suspended') await this.context.resume()
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext)
        this.context = new AudioContextClass()

        // Master Chain
        this.masterGain = this.context.createGain()
        this.masterGain.gain.value = 0.5 // Safety cap
        this.masterGain.connect(this.context.destination)

        // Initialize Layers
        this.setupLayer('ground')
        this.setupLayer('tension')
        // Spark is special (noise), setup separately if needed, or just use oscillators for now

        this.isInitialized = true
        console.log("🎹 Synth Engine: Online")
    }

    private setupLayer(type: SonicLayerType) {
        if (!this.context || !this.masterGain) return

        const gain = this.context.createGain()
        const filter = this.context.createBiquadFilter()
        const pan = this.context.createStereoPanner()

        // Routing: Source -> Filter -> Gain -> Pan -> Master
        gain.connect(pan)
        pan.connect(this.masterGain)

        // Initial Silence
        gain.gain.value = 0

        this.layers.set(type, {
            type,
            gain,
            filter,
            pan
        })
    }

    /**
     * Start a continuous tone (Drone/Tension)
     */
    startTone(type: SonicLayerType, frequency: number = 220, waveType: OscillatorType = 'sine') {
        if (!this.context || !this.isInitialized) return

        const layer = this.layers.get(type)
        if (!layer) return

        // Stop existing if any
        if (layer.oscillator) {
            try { layer.oscillator.stop() } catch (_e) { }
        }

        const osc = this.context.createOscillator()
        osc.type = waveType
        osc.frequency.setValueAtTime(frequency, this.context.currentTime)

        // Connect through the chain (Osc -> Filter)
        osc.connect(layer.filter) // Filter connects to Gain in setup? No, wait.
        // Correction: Osc -> Filter -> Gain -> Pan -> Master
        // In setupLayer, I only connected Gain -> Pan -> Master.
        // I need to connect Filter -> Gain.
        layer.filter.connect(layer.gain)

        osc.start()
        layer.oscillator = osc
    }

    /**
     * Update the parameters of a running layer
     * This is the "Conductor's Baton"
     */
    modulate(type: SonicLayerType, params: {
        volume?: number      // 0.0 - 1.0
        frequency?: number   // Hz
        detune?: number      // Cents
        filterFreq?: number  // Hz cutoff
    }) {
        if (!this.context) return
        const layer = this.layers.get(type)
        if (!layer) return

        const now = this.context.currentTime
        const rampTime = 0.1 // Smooth transitions

        if (params.volume !== undefined) {
            layer.gain.gain.setTargetAtTime(params.volume * (this.isMuted ? 0 : 1), now, rampTime)
        }

        if (layer.oscillator) {
            if (params.frequency !== undefined) {
                layer.oscillator.frequency.setTargetAtTime(params.frequency, now, rampTime)
            }
            if (params.detune !== undefined) {
                layer.oscillator.detune.setTargetAtTime(params.detune, now, rampTime)
            }
        }

        if (params.filterFreq !== undefined) {
            layer.filter.frequency.setTargetAtTime(params.filterFreq, now, rampTime)
        }
    }

    /**
     * The Grit: Creates a sigmoid distortion curve for WaveShaper
     * @param amount 0-100 (Higher is dirtier)
     */
    private makeDistortionCurve(amount: number) {
        const k = typeof amount === 'number' ? amount : 50
        const n_samples = 44100
        const curve = new Float32Array(n_samples)
        const deg = Math.PI / 180
        let x
        for (let i = 0; i < n_samples; ++i) {
            x = i * 2 / n_samples - 1
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x))
        }
        return curve
    }

    /**
     * triggerKick() 
     * Synthesizes a heavy, punchy kick drum
     * Sine wave sweeping from 150Hz to 50Hz very quickly
     */
    triggerKick(time: number = 0, distortionAmount: number = 0) {
        if (!this.context || !this.masterGain) return
        const t = time || this.context.currentTime

        const osc = this.context.createOscillator()
        const gain = this.context.createGain()

        // Distortion Chain (Optional)
        let outputNode: AudioNode = gain
        if (distortionAmount > 0) {
            const shaper = this.context.createWaveShaper()
            shaper.curve = this.makeDistortionCurve(distortionAmount)
            shaper.oversample = '4x'
            gain.connect(shaper)
            outputNode = shaper
        }

        outputNode.connect(this.masterGain)

        osc.frequency.setValueAtTime(150, t)
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5)

        gain.gain.setValueAtTime(0.8, t) // Impact
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5)

        osc.start(t)
        osc.stop(t + 0.5)
    }

    /**
     * triggerBass()
     * A short, gritty sawtooth bass pluck
     */
    triggerBass(time: number = 0, note: number = 55, aggression: number = 0) {
        if (!this.context || !this.masterGain) return
        const t = time || this.context.currentTime

        const osc = this.context.createOscillator()
        const filter = this.context.createBiquadFilter()
        const gain = this.context.createGain() // VCA

        // Signal Path: Osc -> Filter -> Gain -> Master
        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain)

        // Config
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(note, t)

        // Filter Envelope (The "Wow" sound)
        filter.type = 'lowpass'
        filter.Q.value = 1 + (aggression * 5) // Resonance increases with aggression
        filter.frequency.setValueAtTime(aggression ? 800 : 200, t)
        filter.frequency.exponentialRampToValueAtTime(100, t + 0.2) // Quick close

        // Amp Envelope
        gain.gain.setValueAtTime(0.3, t)
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3)

        osc.start(t)
        osc.stop(t + 0.3)
    }

    /**
     * Special Effect: Cold Fusion Spark
     * A quick, crystalline pluck
     */
    triggerSpark(note: number = 880) {
        if (!this.context || !this.masterGain) return

        const osc = this.context.createOscillator()
        const gain = this.context.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(note, this.context.currentTime)

        gain.gain.setValueAtTime(0.1, this.context.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5)

        osc.connect(gain)
        gain.connect(this.masterGain)

        osc.start()
        osc.stop(this.context.currentTime + 0.5)
    }

    /**
     * Gothicvania Special: Harpsichord/Pizzicato Pluck
     * "The Vampire Killer"
     */
    triggerPluck(time: number = 0, note: number = 440) {
        if (!this.context || !this.masterGain) return
        const t = time || this.context.currentTime

        const osc = this.context.createOscillator()
        const gain = this.context.createGain()

        // Bright, rich waveform (Sawtooth is good for Harpsichord Strings)
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(note, t)

        // Aggressive Pluck Envelope
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.2, t + 0.02) // Fast attack
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4) // Sharp decay

        // Connect
        osc.connect(gain)
        gain.connect(this.masterGain)

        osc.start(t)
        osc.stop(t + 0.4)
    }

    setMute(muted: boolean) {
        this.isMuted = muted
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.5, this.context?.currentTime || 0, 0.1)
        }
    }

    dispose() {
        this.layers.forEach(l => {
            try { l.oscillator?.stop() } catch (_e) { }
            l.oscillator?.disconnect()
        })
        this.context?.close()
        this.isInitialized = false
    }
}

// Singleton Instance
export const synthEngine = new SynthEngine()
