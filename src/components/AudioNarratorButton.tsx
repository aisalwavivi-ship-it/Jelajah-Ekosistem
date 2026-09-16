import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Square, Pause, Play, RotateCcw } from 'lucide-react';
import { tts, TTSStatus } from '../utils/tts';
import { sound } from '../utils/audio';

export interface AudioNarratorButtonProps {
  audioText: string;
  id?: string;
  label?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'compact' | 'pill' | 'chip';
  isMuted?: boolean;
  className?: string;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

export const AudioNarratorButton: React.FC<AudioNarratorButtonProps> = ({
  audioText,
  id,
  label = 'Dengarkan',
  title = 'Dengarkan penjelasan materi dengan suara Bahasa Indonesia',
  size = 'md',
  variant = 'primary',
  isMuted,
  className = '',
  onPlayStart,
  onPlayEnd,
}) => {
  const speechId = useRef<string>(id || `speech-${Math.random().toString(36).substring(2, 9)}`).current;
  const [ttsStatus, setTtsStatus] = useState<TTSStatus>('idle');
  const [isSelfActive, setIsSelfActive] = useState<boolean>(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Sync with global TTS engine
  useEffect(() => {
    const unsubscribe = tts.subscribe(({ activeId, status }) => {
      if (activeId === speechId) {
        setIsSelfActive(true);
        setTtsStatus(status);
        if (status === 'ended') {
          setHasPlayedOnce(true);
        }
      } else {
        setIsSelfActive(false);
        if (ttsStatus !== 'idle') {
          setTtsStatus('idle');
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [speechId, ttsStatus]);

  // Sync sound muted status with TTS engine
  useEffect(() => {
    if (isMuted !== undefined) {
      tts.setSoundEnabled(!isMuted);
    } else {
      tts.setSoundEnabled(sound.isEnabled());
    }
  }, [isMuted]);

  // Handle play / trigger speech
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check browser support
    if (!tts.isSupported()) {
      setWarningMessage('Fitur suara belum didukung oleh browser ini. Silakan gunakan browser yang mendukung pembacaan suara.');
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    // Check if sound is muted
    const soundActive = isMuted !== undefined ? !isMuted : sound.isEnabled();
    if (!soundActive) {
      sound.playClick();
      setWarningMessage('Suara sedang dimatikan. Aktifkan suara di menu atas untuk mendengarkan penjelasan.');
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    sound.playClick();
    setWarningMessage(null);

    tts.speak({
      id: speechId,
      text: audioText,
      rate: 0.92,
      pitch: 1.05,
      onStart: () => {
        onPlayStart?.();
      },
      onEnd: () => {
        setHasPlayedOnce(true);
        onPlayEnd?.();
      },
      onError: (err) => {
        console.warn('Speech playback error:', err);
      },
    });
  };

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    tts.pause();
  };

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    tts.resume();
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    tts.stop();
    setHasPlayedOnce(true);
  };

  // Determine sizing classes (ensuring >= 44px min-touch target)
  const sizeClasses = {
    sm: 'text-[11px] py-1.5 px-2.5 min-h-[36px] sm:min-h-[38px]',
    md: 'text-xs sm:text-sm py-2 px-3.5 min-h-[44px]',
    lg: 'text-sm sm:text-base py-2.5 px-4.5 min-h-[48px]',
  }[size];

  const isSpeaking = isSelfActive && ttsStatus === 'speaking';
  const isPaused = isSelfActive && ttsStatus === 'paused';

  // Variant classes
  let variantStyles = 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-sm';
  if (variant === 'secondary') {
    variantStyles = 'bg-amber-500 hover:bg-amber-600 text-stone-950 border-amber-400 font-bold shadow-xs';
  } else if (variant === 'compact') {
    variantStyles = 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs font-semibold';
  } else if (variant === 'pill') {
    variantStyles = 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-300 rounded-full shadow-2xs font-bold';
  } else if (variant === 'chip') {
    variantStyles = 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300 rounded-xl font-medium';
  }

  // When active/speaking, emphasize with a soft glow and distinctive border
  if (isSpeaking) {
    variantStyles = 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 ring-2 ring-emerald-300 shadow-md animate-pulse-subtle';
  } else if (isPaused) {
    variantStyles = 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-200 shadow-sm';
  }

  const ariaDescription = isSpeaking
    ? 'Sedang membacakan materi. Klik untuk jeda atau hentikan pembacaan.'
    : isPaused
    ? 'Pembacaan suara sedang dijeda. Klik untuk melanjutkan.'
    : hasPlayedOnce
    ? `Dengarkan lagi: ${title}`
    : `Dengarkan: ${title}`;

  return (
    <div className="relative inline-flex items-center gap-1.5 select-none">
      {/* Active Speaking / Paused Controls */}
      {isSelfActive && (isSpeaking || isPaused) ? (
        <div
          className={`flex items-center gap-1 p-1 rounded-2xl bg-white border border-emerald-300 shadow-md ${className}`}
          role="group"
          aria-label="Kontrol Pemutar Suara Materi"
        >
          {/* Main Status Pill with Sound Wave Animation */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 rounded-xl">
            <Volume2 className="w-4 h-4 text-emerald-700 animate-pulse" />
            <div className="flex items-center gap-0.5 h-3.5 px-0.5">
              <span className="w-1 bg-emerald-600 rounded-full animate-[bounce_0.8s_infinite_100ms] h-3" />
              <span className="w-1 bg-emerald-600 rounded-full animate-[bounce_0.8s_infinite_300ms] h-4" />
              <span className="w-1 bg-emerald-600 rounded-full animate-[bounce_0.8s_infinite_200ms] h-2" />
            </div>
            <span className="text-[11px] sm:text-xs">
              {isSpeaking ? 'Sedang berbicara...' : 'Dijeda'}
            </span>
          </div>

          {/* Pause / Resume Button */}
          {isSpeaking ? (
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center justify-center p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 min-w-[40px] min-h-[40px] transition active:scale-95 cursor-pointer"
              title="Jeda Pembacaan"
              aria-label="Jeda Pembacaan Suara"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResume}
              className="flex items-center justify-center p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 min-w-[40px] min-h-[40px] transition active:scale-95 cursor-pointer"
              title="Lanjutkan Pembacaan"
              aria-label="Lanjutkan Pembacaan Suara"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Stop Button */}
          <button
            type="button"
            onClick={handleStop}
            className="flex items-center justify-center p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 min-w-[40px] min-h-[40px] transition active:scale-95 cursor-pointer"
            title="Berhenti Membaca"
            aria-label="Hentikan Pembacaan Suara"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      ) : (
        /* Idle or Replay Button */
        <button
          type="button"
          onClick={handlePlay}
          className={`flex items-center justify-center gap-1.5 rounded-2xl border transition-all duration-200 active:scale-95 cursor-pointer ${sizeClasses} ${variantStyles} ${className}`}
          title={title}
          aria-label={ariaDescription}
        >
          {hasPlayedOnce ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-current shrink-0" />
              <span className="font-semibold whitespace-nowrap">Dengarkan Lagi</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-current shrink-0" />
              <span className="font-semibold whitespace-nowrap">{label}</span>
            </>
          )}
        </button>
      )}

      {/* Floating Alert Toast when Muted or Unsupported */}
      {warningMessage && (
        <div
          role="alert"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-xl bg-stone-900 text-white text-[11px] font-medium leading-tight shadow-xl z-50 flex items-start gap-2 border border-amber-400"
        >
          <VolumeX className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{warningMessage}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setWarningMessage(null);
            }}
            className="text-stone-400 hover:text-white p-0.5 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
