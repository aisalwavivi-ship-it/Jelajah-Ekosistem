// Web Audio API Synthesizer for rich, offline-capable educational sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazy AudioContext initialization
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      if (this.soundscapeMasterGain && this.ctx) {
        this.soundscapeMasterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      }
    } else if (this.currentSoundscape) {
      const target = this.currentSoundscape;
      this.currentSoundscape = null;
      this.startSoundscape(target);
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggleMute(): boolean {
    this.setEnabled(!this.enabled);
    return !this.enabled;
  }

  public stopOpeningJingle(): void {
    // Graceful no-op or stop ambient sounds to avoid overlapping audio
  }

  public playClick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playFootstep() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.07);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playWalkingSteps(count = 3, intervalMs = 240) {
    if (!this.enabled) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (this.enabled) {
          this.playFootstep();
        }
      }, i * intervalMs);
    }
  }

  public playMascotTip() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Pleasant marimba/chime sparkle: G5 -> C6 -> E6
    const notes = [783.99, 1046.5, 1318.51];

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + i * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Warm percussive envelope
      gain.gain.setValueAtTime(0.14, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.33);
    });
  }

  public playCorrect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.26);
    });
  }

  public playWrong() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.2);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  public playDropSuccess() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Subtle crystalline chime: G5 (784Hz) -> C6 (1046.5Hz) -> E6 (1318.5Hz)
    [783.99, 1046.5, 1318.51].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.055;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Subtle, non-intrusive volume
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.29);
    });
  }

  public playDropError() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Subtle tactile 'thud' with rapid pitch dive (130Hz -> 48Hz)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.14);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playStarEarned() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord = [659.25, 830.61, 987.77, 1318.51]; // E major gliss

    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  public playFanfare() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12, offset: 0 },
      { f: 523.25, d: 0.12, offset: 0.14 },
      { f: 523.25, d: 0.12, offset: 0.28 },
      { f: 659.25, d: 0.22, offset: 0.42 },
      { f: 783.99, d: 0.22, offset: 0.65 },
      { f: 1046.5, d: 0.45, offset: 0.9 }
    ];

    melody.forEach(note => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + note.offset;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.02);
    });
  }

  // ==========================================
  // ENVIRONMENT SOUNDSCAPES (Forest, Pond, Grassland)
  // Subtle atmospheric procedural soundscapes
  // ==========================================
  private currentSoundscape: 'forest' | 'pond' | 'grassland' | null = null;
  private soundscapeMasterGain: GainNode | null = null;
  private activeSoundscapeSources: AudioNode[] = [];
  private soundscapeIntervals: number[] = [];

  public getCurrentSoundscape(): 'forest' | 'pond' | 'grassland' | null {
    return this.currentSoundscape;
  }

  public stopSoundscape(fadeDuration = 0.8) {
    // Clear all scheduled intervals
    this.soundscapeIntervals.forEach(id => window.clearInterval(id));
    this.soundscapeIntervals = [];

    if (this.soundscapeMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.soundscapeMasterGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      const gainToClean = this.soundscapeMasterGain;
      const sourcesToClean = [...this.activeSoundscapeSources];
      this.soundscapeMasterGain = null;
      this.activeSoundscapeSources = [];

      setTimeout(() => {
        sourcesToClean.forEach(node => {
          try {
            if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
              (node as AudioScheduledSourceNode).stop();
            }
            node.disconnect();
          } catch {
            // ignore cleanup errors
          }
        });
        gainToClean.disconnect();
      }, fadeDuration * 1000 + 100);
    }
    this.currentSoundscape = null;
  }

  private createNoiseBuffer(duration = 2.5): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut * 0.92) + (white * 0.08);
      data[i] = lastOut * 2.5;
    }
    return buffer;
  }

  public startSoundscape(type: 'forest' | 'pond' | 'grassland') {
    if (!this.enabled) {
      this.currentSoundscape = type;
      return;
    }
    if (this.currentSoundscape === type && this.soundscapeMasterGain) {
      return; // Already playing this environment
    }

    this.stopSoundscape(0.5);
    this.initCtx();
    if (!this.ctx) return;

    this.currentSoundscape = type;
    const now = this.ctx.currentTime;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    // Subtle ambient master gain (0.045 max so it stays quiet and non-distracting)
    masterGain.gain.linearRampToValueAtTime(0.045, now + 1.2);
    masterGain.connect(this.ctx.destination);
    this.soundscapeMasterGain = masterGain;

    const noiseBuf = this.createNoiseBuffer(3);

    if (type === 'forest') {
      // 1. Forest: Whispering Wind through leafy canopy
      if (noiseBuf) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuf;
        noiseSource.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, now);
        filter.Q.setValueAtTime(1.8, now);

        // LFO for swaying breeze
        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.2, now); // slow 5-sec cycle
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(150, now);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noiseSource.connect(filter);
        filter.connect(masterGain);

        noiseSource.start(now);
        lfo.start(now);
        this.activeSoundscapeSources.push(noiseSource, lfo, filter);
      }

      // 2. Warm forest drone
      const warmDrone = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      warmDrone.type = 'sine';
      warmDrone.frequency.setValueAtTime(130.81, now); // C3
      droneGain.gain.setValueAtTime(0.2, now);
      warmDrone.connect(droneGain);
      droneGain.connect(masterGain);
      warmDrone.start(now);
      this.activeSoundscapeSources.push(warmDrone);

      // 3. Periodic soft birds chirping (every 3-5 seconds)
      const birdInterval = window.setInterval(() => {
        if (!this.ctx || !this.enabled || this.currentSoundscape !== 'forest') return;
        const t = this.ctx.currentTime;
        const birdOsc = this.ctx.createOscillator();
        const birdGain = this.ctx.createGain();
        birdOsc.type = 'sine';

        const baseF = 2400 + Math.random() * 800;
        birdOsc.frequency.setValueAtTime(baseF, t);
        birdOsc.frequency.exponentialRampToValueAtTime(baseF + 600, t + 0.06);
        birdOsc.frequency.exponentialRampToValueAtTime(baseF - 200, t + 0.14);

        birdGain.gain.setValueAtTime(0.0001, t);
        birdGain.gain.linearRampToValueAtTime(0.18, t + 0.04);
        birdGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

        birdOsc.connect(birdGain);
        birdGain.connect(masterGain);
        birdOsc.start(t);
        birdOsc.stop(t + 0.2);
      }, 3500);
      this.soundscapeIntervals.push(birdInterval);

    } else if (type === 'pond') {
      // 1. Pond: Gentle water ripples & gentle flowing lapping sound
      if (noiseBuf) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuf;
        noiseSource.loop = true;

        const lowpass = this.ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(320, now);

        const modOsc = this.ctx.createOscillator();
        modOsc.frequency.setValueAtTime(0.35, now); // 3-second gentle lap cycle
        const modGain = this.ctx.createGain();
        modGain.gain.setValueAtTime(90, now);
        modOsc.connect(modGain);
        modGain.connect(lowpass.frequency);

        noiseSource.connect(lowpass);
        lowpass.connect(masterGain);

        noiseSource.start(now);
        modOsc.start(now);
        this.activeSoundscapeSources.push(noiseSource, modOsc, lowpass);
      }

      // 2. Periodic soft water droplet (every 2-4 seconds)
      const dripInterval = window.setInterval(() => {
        if (!this.ctx || !this.enabled || this.currentSoundscape !== 'pond') return;
        const t = this.ctx.currentTime;
        const dripOsc = this.ctx.createOscillator();
        const dripGain = this.ctx.createGain();
        dripOsc.type = 'sine';

        const startFreq = 1400 + Math.random() * 400;
        dripOsc.frequency.setValueAtTime(startFreq, t);
        dripOsc.frequency.exponentialRampToValueAtTime(startFreq * 0.55, t + 0.08);

        dripGain.gain.setValueAtTime(0.0001, t);
        dripGain.gain.linearRampToValueAtTime(0.22, t + 0.015);
        dripGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

        dripOsc.connect(dripGain);
        dripGain.connect(masterGain);
        dripOsc.start(t);
        dripOsc.stop(t + 0.12);
      }, 2600);
      this.soundscapeIntervals.push(dripInterval);

      // 3. Very subtle low frog croak
      const frogInterval = window.setInterval(() => {
        if (!this.ctx || !this.enabled || this.currentSoundscape !== 'pond') return;
        const t = this.ctx.currentTime;
        const frogOsc = this.ctx.createOscillator();
        const frogFilter = this.ctx.createBiquadFilter();
        const frogGain = this.ctx.createGain();

        frogOsc.type = 'sawtooth';
        frogOsc.frequency.setValueAtTime(160, t);
        frogOsc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

        frogFilter.type = 'lowpass';
        frogFilter.frequency.setValueAtTime(360, t);

        frogGain.gain.setValueAtTime(0.0001, t);
        frogGain.gain.linearRampToValueAtTime(0.08, t + 0.03);
        frogGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

        frogOsc.connect(frogFilter);
        frogFilter.connect(frogGain);
        frogGain.connect(masterGain);
        frogOsc.start(t);
        frogOsc.stop(t + 0.18);
      }, 6200);
      this.soundscapeIntervals.push(frogInterval);

    } else if (type === 'grassland') {
      // 1. Grassland: Open airy meadow wind
      if (noiseBuf) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuf;
        noiseSource.loop = true;

        const bandpass = this.ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(600, now);
        bandpass.Q.setValueAtTime(1.2, now);

        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.15, now);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(220, now);
        lfo.connect(lfoGain);
        lfoGain.connect(bandpass.frequency);

        noiseSource.connect(bandpass);
        bandpass.connect(masterGain);

        noiseSource.start(now);
        lfo.start(now);
        this.activeSoundscapeSources.push(noiseSource, lfo, bandpass);
      }

      // 2. Open air subtle chord
      const droneOsc1 = this.ctx.createOscillator();
      const droneOsc2 = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      droneOsc1.type = 'sine';
      droneOsc2.type = 'triangle';
      droneOsc1.frequency.setValueAtTime(220, now); // A3
      droneOsc2.frequency.setValueAtTime(329.63, now); // E4
      droneGain.gain.setValueAtTime(0.12, now);
      droneOsc1.connect(droneGain);
      droneOsc2.connect(droneGain);
      droneGain.connect(masterGain);
      droneOsc1.start(now);
      droneOsc2.start(now);
      this.activeSoundscapeSources.push(droneOsc1, droneOsc2);

      // 3. High cricket/cicada pulse in meadow
      const cricketInterval = window.setInterval(() => {
        if (!this.ctx || !this.enabled || this.currentSoundscape !== 'grassland') return;
        const t = this.ctx.currentTime;
        // 2 quick pulses
        [0, 0.05].forEach(offset => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(4600 + Math.random() * 200, t + offset);
          g.gain.setValueAtTime(0.0001, t + offset);
          g.gain.linearRampToValueAtTime(0.06, t + offset + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.035);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(t + offset);
          osc.stop(t + offset + 0.04);
        });
      }, 4200);
      this.soundscapeIntervals.push(cricketInterval);
    }
  }
}

export type SoundscapeType = 'forest' | 'pond' | 'grassland';
export const sound = new SoundEngine();
