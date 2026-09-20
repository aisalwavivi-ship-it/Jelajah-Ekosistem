// Voice Prompts for Mission Opening Guidance (Pemandu Petualangan Sains SD)
// Sesuai materi, tujuan aktivitas, dan instruksi nyata pada setiap Misi 1-8 dan Tantangan
import { tts } from './tts';
import { sound } from './audio';

export interface MissionVoicePromptItem {
  id: string;
  sceneKey: string;
  missionNumber?: number;
  title: string;
  badge: string;
  text: string;
  audioFile?: string; // Optional path if custom audio files are added to /public/audio/
}

export const MISSION_VOICE_PROMPTS: Record<string, MissionVoicePromptItem> = {
  'mission-1': {
    id: 'voice-mission-1',
    sceneKey: 'mission-1',
    missionNumber: 1,
    title: 'Misi 1: Observasi Alam',
    badge: 'Pemandu Alam',
    text: 'Halo Penjelajah! Yuk amati taman sekolah dan temukan bagaimana makhluk hidup dan benda tak hidup bersatu membentuk ekosistem!',
    audioFile: '/audio/mission-1.mp3',
  },
  'mission-2': {
    id: 'voice-mission-2',
    sceneKey: 'mission-2',
    missionNumber: 2,
    title: 'Misi 2: Jelajah Jenis Ekosistem',
    badge: 'Klasifikasi Lingkungan',
    text: 'Di Misi dua, ayo bantu kelompokkan lingkungan alam ini ke dalam ekosistem darat atau ekosistem air!',
    audioFile: '/audio/mission-2.mp3',
  },
  'mission-3': {
    id: 'voice-mission-3',
    sceneKey: 'mission-3',
    missionNumber: 3,
    title: 'Misi 3: Siapa Aku? (Individu)',
    badge: 'Satu Makhluk Hidup',
    text: 'Misi tiga dimulai! Ayo temukan dan pilih makhluk hidup yang merupakan satu individu tunggal!',
    audioFile: '/audio/mission-3.mp3',
  },
  'mission-4': {
    id: 'voice-mission-4',
    sceneKey: 'mission-4',
    missionNumber: 4,
    title: 'Misi 4: Temukan Populasi',
    badge: 'Kumpulan Sejenis',
    text: 'Ayo ke Misi empat! Cari dan temukan sekumpulan makhluk hidup sejenis yang membentuk populasi!',
    audioFile: '/audio/mission-4.mp3',
  },
  'mission-5': {
    id: 'voice-mission-5',
    sceneKey: 'mission-5',
    missionNumber: 5,
    title: 'Misi 5: Temukan Komunitas',
    badge: 'Berbagai Populasi',
    text: 'Misi lima! Mari kumpulkan berbagai populasi makhluk hidup yang hidup bersama untuk membentuk komunitas!',
    audioFile: '/audio/mission-5.mp3',
  },
  'mission-6': {
    id: 'voice-mission-6',
    sceneKey: 'mission-6',
    missionNumber: 6,
    title: 'Misi 6: Detektif Biotik & Abiotik',
    badge: 'Pilahkan Komponen',
    text: 'Saatnya jadi detektif! Pisahkan mana komponen biotik makhluk hidup, dan mana komponen abiotik benda tak hidup!',
    audioFile: '/audio/mission-6.mp3',
  },
  'mission-7': {
    id: 'voice-mission-7',
    sceneKey: 'mission-7',
    missionNumber: 7,
    title: 'Misi 7: Penyelidikan Nyata',
    badge: 'Eksplorasi Lingkungan',
    text: 'Misi tujuh! Selidiki lingkungan sekolah, taman, dan kolam untuk menemukan komponen biotik dan abiotik di sekitarmu!',
    audioFile: '/audio/mission-7.mp3',
  },
  'mission-8': {
    id: 'voice-mission-8',
    sceneKey: 'mission-8',
    missionNumber: 8,
    title: 'Misi 8: Tantangan Susun Piramida Ekosistem',
    badge: 'Piramida Ekosistem',
    text: 'Misi delapan! Yuk, susun piramida ekosistem dari dasar sampai puncak! 🌱',
    audioFile: '/audio/mission-8.mp3',
  },
  'quiz': {
    id: 'voice-quiz',
    sceneKey: 'quiz',
    title: 'Tantangan Evaluasi Ekosistem',
    badge: 'Uji Pemahaman',
    text: 'Saatnya tantangan akhir! Ayo uji semua pengetahuan ekosistemmu dan raih bintang penjelajah!',
    audioFile: '/audio/quiz.mp3',
  },
};

// Active voice playback manager to prevent sound collision
let currentAudioElement: HTMLAudioElement | null = null;

export function stopCurrentVoicePrompt(): void {
  // 1. Stop any HTML audio element
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudioElement = null;
  }

  // 2. Stop Web Speech TTS
  tts.stop();
}

export function playMissionVoicePrompt(
  sceneKey: string,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    isMuted?: boolean;
  }
): boolean {
  const isMuted = options?.isMuted ?? !sound.isEnabled();
  if (isMuted) return false;

  const item = MISSION_VOICE_PROMPTS[sceneKey];
  if (!item) return false;

  // Stop any playing sound to ensure zero audio collision
  stopCurrentVoicePrompt();
  sound.stopOpeningJingle();

  // Try optional HTML audio file if it exists, otherwise fall back to Web Speech API
  if (typeof window !== 'undefined' && item.audioFile) {
    try {
      const audio = new Audio(item.audioFile);
      currentAudioElement = audio;

      let hasFallenBack = false;
      const fallbackToTTS = () => {
        if (hasFallenBack) return;
        hasFallenBack = true;
        currentAudioElement = null;
        tts.speak({
          id: item.id,
          text: item.text,
          rate: 0.94,
          pitch: 1.08,
          onStart: options?.onStart,
          onEnd: options?.onEnd,
        });
      };

      audio.oncanplaythrough = () => {
        audio.play().catch(() => {
          fallbackToTTS();
        });
      };

      audio.onplay = () => {
        options?.onStart?.();
      };

      audio.onended = () => {
        currentAudioElement = null;
        options?.onEnd?.();
      };

      audio.onerror = () => {
        fallbackToTTS();
      };

      audio.load();
      return true;
    } catch {
      // Proceed directly to TTS fallback
    }
  }

  // Standard high-quality, friendly Web Speech API TTS
  return tts.speak({
    id: item.id,
    text: item.text,
    rate: 0.94, // friendly conversational pace for kids
    pitch: 1.08, // cheerful, warm adventurer tone
    onStart: options?.onStart,
    onEnd: options?.onEnd,
  });
}
