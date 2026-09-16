import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, CheckCircle, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { AppScene } from '../types';

interface MissionProgressBarProps {
  completedCount: number;
  totalMissions?: number;
  currentScene: AppScene;
  onGoToQuiz: () => void;
  onContinueMissions: () => void;
}

export const MissionProgressBar: React.FC<MissionProgressBarProps> = ({
  completedCount,
  totalMissions = 8,
  currentScene,
  onGoToQuiz,
  onContinueMissions,
}) => {
  const percentage = Math.min(100, Math.round((completedCount / totalMissions) * 100));

  // Determine motivating message
  const getMotivationalMessage = () => {
    if (completedCount === 0) {
      return 'Mulai langkah pertamamu dari Misi 1 di Gerbang Sekolah!';
    }
    if (completedCount < 4) {
      return `Langkah awal yang hebat! Sudah menyelesaikan ${completedCount} misi.`;
    }
    if (completedCount < 7) {
      return `Keren! Sudah ${completedCount} dari ${totalMissions} misi terselesaikan!`;
    }
    if (completedCount === 7) {
      return 'Satu misi lagi sebelum membuka Tantangan Kuis Akhir!';
    }
    return 'Semua misi selesai! Kamu siap menaklukkan Tantangan Kuis Akhir!';
  };

  const isReadyForQuiz = completedCount >= totalMissions;

  return (
    <div className="w-full bg-emerald-950/95 text-white px-3 sm:px-6 py-2 border-b border-emerald-800 shadow-sm relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Stats & percentage */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg">🌿</span>
            <span className="text-xs font-bold text-emerald-200">
              Progres Misi:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded-full">
              {completedCount} / {totalMissions} Misi ({percentage}%)
            </span>
          </div>

          <span className="hidden md:inline text-stone-300 text-xs italic">
            • {getMotivationalMessage()}
          </span>
        </div>

        {/* Center/Right: Visual Progress Bar & Action CTA */}
        <div className="w-full sm:w-auto flex items-center gap-3 flex-1 max-w-md">
          {/* Bar track */}
          <div className="flex-1 bg-emerald-900/90 h-3 rounded-full overflow-hidden p-0.5 border border-emerald-700/60 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full transition-all ${
                isReadyForQuiz
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-sm shadow-amber-300'
                  : 'bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300'
              }`}
            />
          </div>

          {/* Quick CTA */}
          {isReadyForQuiz ? (
            <button
              id="btn-progress-go-quiz"
              onClick={() => {
                sound.playStarEarned();
                onGoToQuiz();
              }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition animate-pulse"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Kuis Akhir!</span>
            </button>
          ) : (
            <button
              id="btn-progress-continue"
              onClick={() => {
                sound.playClick();
                onContinueMissions();
              }}
              className="shrink-0 hidden sm:flex items-center gap-1 px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-[11px] font-semibold rounded-lg border border-emerald-600/60 transition"
            >
              <span>Lanjut Belajar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
