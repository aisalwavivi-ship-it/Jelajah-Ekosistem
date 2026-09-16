// Web Speech API Text-to-Speech Engine tailored for Grade 5 Elementary School Indonesian Learning
export interface TTSSpeakOptions {
  id?: string;
  text: string;
  rate?: number; // default ~0.92 for clear, friendly, articulate speech
  pitch?: number; // default ~1.05 for warm, teacher-like tone
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export type TTSStatus = 'idle' | 'speaking' | 'paused' | 'ended';

type Listener = (state: { activeId: string | null; status: TTSStatus }) => void;

class TTSEngine {
  private activeId: string | null = null;
  private status: TTSStatus = 'idle';
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<Listener> = new Set();
  private indonesianVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;
  private isSoundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
    if (!enabled && this.status === 'speaking') {
      this.stop();
    }
  }

  public getSoundEnabled(): boolean {
    return this.isSoundEnabled;
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.voicesLoaded = true;
        // Search for Indonesian voice: id-ID, id_ID, Indonesian, Bahasa Indonesia
        const idVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('id') ||
            v.name.toLowerCase().includes('indonesia') ||
            v.name.toLowerCase().includes('gadis') ||
            v.name.toLowerCase().includes('ardi') ||
            v.name.toLowerCase().includes('damayanti')
        );

        if (idVoice) {
          this.indonesianVoice = idVoice;
        } else {
          // Fallback: check voices with lang starting with 'ms' (Malay) or default
          const fallbackId = voices.find((v) => v.lang.toLowerCase().startsWith('ms'));
          this.indonesianVoice = fallbackId || null;
        }
      }
    } catch (e) {
      console.warn('TTS voice init error:', e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener({ activeId: this.activeId, status: this.status });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ activeId: this.activeId, status: this.status });
    }
  }

  public speak(options: TTSSpeakOptions): boolean {
    if (!this.isSupported()) {
      return false;
    }

    if (!this.isSoundEnabled) {
      return false;
    }

    // Always stop previous speech to prevent overlapping voices
    this.stop();

    if (!this.voicesLoaded) {
      this.initVoices();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(options.text);
      utterance.lang = 'id-ID';

      if (this.indonesianVoice) {
        utterance.voice = this.indonesianVoice;
      }

      // Friendly, articulate teacher-like pace for Grade 5 students
      utterance.rate = options.rate ?? 0.92;
      utterance.pitch = options.pitch ?? 1.05;

      const speechId = options.id || options.text.substring(0, 32);
      this.activeId = speechId;
      this.status = 'speaking';
      this.currentUtterance = utterance;

      utterance.onstart = () => {
        this.status = 'speaking';
        this.notify();
        options.onStart?.();
      };

      utterance.onend = () => {
        if (this.activeId === speechId) {
          this.status = 'ended';
          this.activeId = null;
          this.currentUtterance = null;
          this.notify();
          options.onEnd?.();
        }
      };

      utterance.onerror = (e) => {
        // Cancelled events are normal when switching or stopping
        if (this.activeId === speechId) {
          this.status = 'idle';
          this.activeId = null;
          this.currentUtterance = null;
          this.notify();
          options.onError?.(e);
        }
      };

      utterance.onpause = () => {
        if (this.activeId === speechId) {
          this.status = 'paused';
          this.notify();
          options.onPause?.();
        }
      };

      utterance.onresume = () => {
        if (this.activeId === speechId) {
          this.status = 'speaking';
          this.notify();
          options.onResume?.();
        }
      };

      // Workaround for some browsers pausing long utterances
      window.speechSynthesis.speak(utterance);
      this.notify();
      return true;
    } catch (err) {
      console.warn('Speech synthesis speak error:', err);
      this.status = 'idle';
      this.activeId = null;
      this.notify();
      options.onError?.(err);
      return false;
    }
  }

  public pause(): void {
    if (this.isSupported() && this.status === 'speaking') {
      window.speechSynthesis.pause();
      this.status = 'paused';
      this.notify();
    }
  }

  public resume(): void {
    if (this.isSupported() && this.status === 'paused') {
      window.speechSynthesis.resume();
      this.status = 'speaking';
      this.notify();
    }
  }

  public stop(): void {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
      this.status = 'idle';
      this.activeId = null;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public getActiveId(): string | null {
    return this.activeId;
  }

  public getStatus(): TTSStatus {
    return this.status;
  }
}

export const tts = new TTSEngine();
