import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, X, VolumeX } from 'lucide-react';
import { MISSION_VOICE_PROMPTS, playMissionVoicePrompt, stopCurrentVoicePrompt } from '../utils/missionVoicePrompts';
import { tts } from '../utils/tts';

interface MissionVoicePromptGuideProps {
  sceneKey: string;
  isAudioMuted: boolean;
}

export const MissionVoicePromptGuide: React.FC<MissionVoicePromptGuideProps> = ({
  sceneKey,
  isAudioMuted,
}) => {
  const prompt = MISSION_VOICE_PROMPTS[sceneKey];
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Subscribe to TTS active state for this prompt
  useEffect(() => {
    if (!prompt) return;

    const unsubscribe = tts.subscribe((state) => {
      setIsPlaying(state.activeId === prompt.id && state.status === 'speaking');
    });

    return () => {
      unsubscribe();
    };
  }, [prompt]);

  // Reset dismissed state when switching scenes
  useEffect(() => {
    setIsDismissed(false);
  }, [sceneKey]);

  if (!prompt || isDismissed) {
    return null;
  }

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAudioMuted) return;
    playMissionVoicePrompt(sceneKey, {
      isMuted: isAudioMuted,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
    });
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopCurrentVoicePrompt();
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        id={`voice-prompt-banner-${sceneKey}`}
        initial={{ opacity: 0, y: -16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-4xl mx-auto px-3 sm:px-4 mb-3 sm:mb-4 select-none"
      >
        <div className="bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-teal-900/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3 sm:p-3.5 shadow-lg flex items-center justify-between gap-2.5 sm:gap-4 text-white">
          {/* Avatar & Voice Indicator */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600/60 border border-emerald-300/60 flex items-center justify-center text-lg sm:text-xl shadow-inner">
                🧭
              </div>
              {isPlaying && !isAudioMuted && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white items-center justify-center text-[9px] text-black font-bold">
                    ♪
                  </span>
                </span>
              )}
            </div>
            <div className="hidden xs:block">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300">
                Pemandu Petualangan
              </span>
              <div className="text-xs font-semibold text-emerald-100 flex items-center gap-1">
                {prompt.badge}
              </div>
            </div>
          </div>

          {/* Voice Prompt Text */}
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-xs sm:text-sm font-medium text-emerald-50 leading-snug line-clamp-2 sm:line-clamp-none">
              “{prompt.text}”
            </p>
          </div>

          {/* Actions: Replay Voice & Dismiss */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id={`btn-replay-voice-${sceneKey}`}
              onClick={handleReplay}
              title={isAudioMuted ? 'Suara dinonaktifkan di pengaturan' : 'Dengarkan ulang panduan'}
              disabled={isAudioMuted}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                isAudioMuted
                  ? 'bg-emerald-950/40 text-emerald-400/50 cursor-not-allowed'
                  : 'bg-emerald-700/60 hover:bg-emerald-600 text-white border border-emerald-400/40 shadow-xs cursor-pointer'
              }`}
            >
              {isAudioMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <RotateCcw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
              )}
              <span className="hidden sm:inline">
                {isPlaying ? 'Memutar...' : 'Dengar Ulang'}
              </span>
            </button>

            <button
              id={`btn-dismiss-voice-${sceneKey}`}
              onClick={handleDismiss}
              title="Tutup panduan suara"
              className="p-1 sm:p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-700/40 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
