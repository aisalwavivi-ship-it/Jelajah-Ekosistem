/**
 * Procedural Ambient Nature Music Engine for "Jelajah Ekosistem"
 *
 * Uses the Web Audio API to create a gentle, warm, and classroom-appropriate
 * ambient nature soundtrack (soft marimba/kalimba pentatonic chords, calming forest
 * breeze, and occasional gentle morning birdsong).
 *
 * Key benefits:
 * - 100% offline, zero external audio asset dependencies (no broken MP3 URLs or CORS issues)
 * - Soft, non-distracting frequencies specifically tailored for elementary focus & immersion
 * - Seamless looping without clicks or gaps
 * - Graceful fade-in and fade-out transitions
 */

class AmbientNatureMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlayingState: boolean = false;
  private masterGain: GainNode | null = null;
  private schedulerTimer: number | null = null;
  private breezeNode: AudioNode | null = null;
  private breezeGain: GainNode | null = null;
  private lfoOsc: OscillatorNode | null = null;

  // Track chord sequence progression (Pentatonic nature progression in C / G / Am / F)
  private stepIndex: number = 0;
  private nextChordTime: number = 0;

  // Chord definitions: gentle, tranquil Indonesian nature forest feel
  private readonly CHORDS = [
    // 1. C major 9 (Morning dew on green leaves)
    { base: 130.81, notes: [261.63, 329.63, 392.0, 493.88, 587.33] }, // C3, C4, E4, G4, B4, D5
    // 2. A minor 7 (Shaded school grove / Kebun Rindang)
    { base: 110.0, notes: [220.0, 261.63, 329.63, 392.0, 523.25] }, // A2, A3, C4, E4, G4, C5
    // 3. F major 7#11 (Gentle clear water stream / Tepi Kolam)
    { base: 87.31, notes: [174.61, 261.63, 329.63, 392.0, 523.25] }, // F2, F3, C4, E4, G4, C5
    // 4. G sus4 add9 (Sunlight warming the canopy / Harmoni Alam)
    { base: 98.0, notes: [196.0, 293.66, 392.0, 440.0, 587.33] }, // G2, G3, D4, G4, A4, D5
  ];

  // Kalimba melodies matching the chord roots
  private readonly KALIMBA_PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.ctx && !this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  /**
   * Generates a continuous organic ambient breeze using filtered pink noise + LFO
   */
  private startBreeze() {
    if (!this.ctx || !this.masterGain) return;

    // Generate 4 seconds of smooth pink noise buffer
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Resonant low-pass filter to simulate forest wind in tree canopy
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(360, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    // Subtle LFO modulation for wind gusts
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // very slow 8-second cycle
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.lfoOsc = lfo;

    const breezeGain = this.ctx.createGain();
    // Keep ambient breeze very quiet and soothing for classrooms
    breezeGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(breezeGain);
    breezeGain.connect(this.masterGain);

    whiteNoise.start();
    this.breezeNode = whiteNoise;
    this.breezeGain = breezeGain;
  }

  /**
   * Plays a warm, organic chord pad with soft attack & long decay
   */
  private playWarmPadChord(notes: number[], startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Warm sine + triangle blend
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      // Slight detune for rich choral warmth
      osc.frequency.setValueAtTime(freq, startTime);
      osc.detune.setValueAtTime((idx - 2) * 3, startTime);

      // Lowpass filter to ensure zero harshness
      const padFilter = this.ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(680 + idx * 80, startTime);

      // Slow breathing envelope
      const maxGain = 0.022 / Math.sqrt(notes.length);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(maxGain, startTime + 1.8);
      gain.gain.setValueAtTime(maxGain, startTime + duration - 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 1.2);

      osc.connect(padFilter);
      padFilter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 1.3);
    });
  }

  /**
   * Plays a single gentle kalimba / wooden marimba chime
   */
  private playKalimbaPluck(freq: number, startTime: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm wooden harmonic overtone
    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(freq * 2.76, startTime); // Marimba non-harmonic ping

    const harmonicGain = this.ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.008, startTime);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);

    // Pluck amplitude envelope
    gain.gain.setValueAtTime(0.035, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.6);

    osc.connect(gain);
    oscHarmonic.connect(harmonicGain);
    harmonicGain.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    oscHarmonic.start(startTime);

    osc.stop(startTime + 1.7);
    oscHarmonic.stop(startTime + 0.15);
  }

  /**
   * Plays a rare, gentle bird chirp in the distance
   */
  private playBirdChirp(startTime: number) {
    if (!this.ctx || !this.masterGain) return;

    const baseFreq = 2600 + Math.random() * 600;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, startTime);
    osc.frequency.linearRampToValueAtTime(baseFreq + 700, startTime + 0.06);
    osc.frequency.linearRampToValueAtTime(baseFreq + 300, startTime + 0.12);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.018, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.16);

    // Second secondary chirp 180ms later
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    const t2 = startTime + 0.18;

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq + 200, t2);
    osc2.frequency.linearRampToValueAtTime(baseFreq + 900, t2 + 0.05);

    gain2.gain.setValueAtTime(0.0001, t2);
    gain2.gain.linearRampToValueAtTime(0.014, t2 + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.12);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);

    osc2.start(t2);
    osc2.stop(t2 + 0.14);
  }

  /**
   * Scheduler loop to queue up chords and peaceful melodies
   */
  private scheduleMusic() {
    if (!this.ctx || !this.isPlayingState) return;

    const lookahead = 0.5; // seconds
    const chordDuration = 7.0; // 7 seconds per harmony chord

    while (this.nextChordTime < this.ctx.currentTime + lookahead) {
      const chord = this.CHORDS[this.stepIndex % this.CHORDS.length];
      const chordStartTime = Math.max(this.nextChordTime, this.ctx.currentTime + 0.05);

      // 1. Play warm ambient chord pad
      this.playWarmPadChord(chord.notes, chordStartTime, chordDuration);

      // 2. Play 2-3 peaceful kalimba arpeggio notes dispersed over the chord
      const melodyOffsets = [0.4, 2.2, 4.3];
      melodyOffsets.forEach((offset, idx) => {
        const noteFreq =
          this.KALIMBA_PENTATONIC[
            (this.stepIndex * 2 + idx + Math.floor(Math.random() * 2)) %
              this.KALIMBA_PENTATONIC.length
          ];
        this.playKalimbaPluck(noteFreq, chordStartTime + offset);
      });

      // 3. Occasional distant birdsong (roughly every other chord)
      if (this.stepIndex % 2 === 1) {
        this.playBirdChirp(chordStartTime + 3.2);
      }

      this.stepIndex++;
      this.nextChordTime = chordStartTime + chordDuration;
    }
  }

  /**
   * Starts ambient nature music playback with a smooth fade in
   */
  public start(): boolean {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return false;

      if (this.isPlayingState) return true;

      this.isPlayingState = true;
      const now = this.ctx.currentTime;

      // Smooth fade-in over 1.2 seconds to 0.75 level
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.linearRampToValueAtTime(0.75, now + 1.2);

      this.nextChordTime = now + 0.1;
      this.stepIndex = 0;

      // Start the soft forest breeze background
      this.startBreeze();

      // Trigger initial music scheduling and run interval
      this.scheduleMusic();
      this.schedulerTimer = window.setInterval(() => {
        this.scheduleMusic();
      }, 400);

      return true;
    } catch (e) {
      console.warn('Could not start ambient nature music:', e);
      this.isPlayingState = false;
      return false;
    }
  }

  /**
   * Stops ambient nature music playback with a gentle fade out
   */
  public stop() {
    if (!this.isPlayingState || !this.ctx || !this.masterGain) {
      this.isPlayingState = false;
      return;
    }

    try {
      const now = this.ctx.currentTime;
      // Gentle fade out over 0.8 seconds
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        if (!this.isPlayingState) {
          if (this.schedulerTimer) {
            clearInterval(this.schedulerTimer);
            this.schedulerTimer = null;
          }
          if (this.breezeNode) {
            try {
              (this.breezeNode as AudioBufferSourceNode).stop();
              this.breezeNode.disconnect();
            } catch {}
            this.breezeNode = null;
          }
          if (this.lfoOsc) {
            try {
              this.lfoOsc.stop();
              this.lfoOsc.disconnect();
            } catch {}
            this.lfoOsc = null;
          }
        }
      }, 850);
    } catch (e) {
      console.warn('Error during music stop:', e);
    }

    this.isPlayingState = false;
  }

  /**
   * Toggles ambient music on/off
   */
  public toggle(): boolean {
    if (this.isPlayingState) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }

  public isPlaying(): boolean {
    return this.isPlayingState;
  }
}

export const ambientMusic = new AmbientNatureMusicEngine();
