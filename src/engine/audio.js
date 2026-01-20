/**
 * Ephemera - Audio Manager
 *
 * Generates ambient sound using Web Audio API.
 * No external files needed - everything is synthesized.
 *
 * The sound is meant to be barely there - a presence more than a melody.
 * Like the hum of thought, the quiet of attention, the space where
 * meaning lives.
 */

export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isPlaying = false;
        this.oscillators = [];
        this.initialized = false;
    }

    /**
     * Initialize audio context (must be called from user gesture)
     */
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0;
            this.initialized = true;
        } catch (e) {
            console.log('Web Audio not supported');
        }
    }

    /**
     * Start ambient sound
     */
    startAmbient() {
        this.init();

        if (!this.audioContext || this.isPlaying) return;

        this.isPlaying = true;

        // Fade in master volume
        this.masterGain.gain.setTargetAtTime(0.15, this.audioContext.currentTime, 2);

        // Create layered ambient tones
        this.createDrone(65.41, 0.08);   // C2 - deep foundation
        this.createDrone(130.81, 0.05);  // C3 - body
        this.createDrone(196.00, 0.03);  // G3 - fifth
        this.createDrone(261.63, 0.02);  // C4 - shimmer

        // Add subtle movement
        this.createShimmer();

        // Occasional soft tones
        this.scheduleAccents();
    }

    /**
     * Create a drone oscillator
     */
    createDrone(frequency, volume) {
        if (!this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        // Use sine wave for purity
        osc.type = 'sine';
        osc.frequency.value = frequency;

        // Gentle low-pass filter
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;

        // Connect
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        // Volume
        gain.gain.value = volume;

        // Start
        osc.start();

        // Subtle frequency wobble
        this.addWobble(osc, frequency, 0.5);

        this.oscillators.push({ osc, gain, filter });

        return osc;
    }

    /**
     * Add subtle frequency wobble to an oscillator
     */
    addWobble(osc, baseFreq, amount) {
        if (!this.audioContext) return;

        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();

        lfo.type = 'sine';
        lfo.frequency.value = 0.1 + Math.random() * 0.1; // Very slow

        lfoGain.gain.value = amount;

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        lfo.start();
    }

    /**
     * Create shimmering high-frequency texture
     */
    createShimmer() {
        if (!this.audioContext) return;

        // Create noise
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(
            1,
            bufferSize,
            this.audioContext.sampleRate
        );
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        // Heavy filtering for soft shimmer
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 10;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.01; // Very quiet

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();

        // Slowly modulate the filter
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.value = 0.05;
        lfoGain.gain.value = 500;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
    }

    /**
     * Schedule occasional accent tones
     */
    scheduleAccents() {
        if (!this.audioContext || !this.isPlaying) return;

        // Random interval between 5-15 seconds
        const interval = 5000 + Math.random() * 10000;

        setTimeout(() => {
            if (this.isPlaying) {
                this.playAccent();
                this.scheduleAccents();
            }
        }, interval);
    }

    /**
     * Play a single accent tone
     */
    playAccent() {
        if (!this.audioContext) return;

        const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 600;

        gain.gain.value = 0;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start();

        // Gentle envelope
        const now = this.audioContext.currentTime;
        gain.gain.setTargetAtTime(0.03, now, 0.5);
        gain.gain.setTargetAtTime(0, now + 2, 1);

        // Stop after fade
        setTimeout(() => osc.stop(), 5000);
    }

    /**
     * Stop all audio
     */
    stop() {
        if (!this.audioContext) return;

        this.isPlaying = false;

        // Fade out
        this.masterGain.gain.setTargetAtTime(0, this.audioContext.currentTime, 1);

        // Stop oscillators after fade
        setTimeout(() => {
            this.oscillators.forEach(({ osc }) => {
                try {
                    osc.stop();
                } catch (e) {
                    // Already stopped
                }
            });
            this.oscillators = [];
        }, 3000);
    }

    /**
     * Set master volume
     */
    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(
                value * 0.15,
                this.audioContext.currentTime,
                0.5
            );
        }
    }
}
