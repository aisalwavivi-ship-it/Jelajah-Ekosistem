import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Sparkles, CheckCircle2, Lock, ChevronRight, Award } from 'lucide-react';
import { EXPLORER_LEVELS, getNextLevelProgress } from '../utils/levels';
import { sound } from '../utils/audio';

interface StudentLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  stars: number;
}

export const StudentLevelModal: React.FC<StudentLevelModalProps> = ({
  isOpen,
  onClose,
  playerName,
  stars,
}) => {
  if (!isOpen) return null;

  const { currentLevel, nextLevel, progressPercent, starsNeeded } = getNextLevelProgress(stars);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-emerald-200 overflow-hidden flex flex-col max-h-[90vh]"
          id="modal-student-level"
        >
          {/* Top Header Card */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
            {/* Ambient background decoration */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-2xl shadow-inner">
                  {currentLevel.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                      Identitas Penjelajah
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
                      Level {currentLevel.level}
                    </span>
                  </div>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
                    {playerName || 'Penjelajah Muda'}
                  </h2>
                </div>
              </div>

              <button
                id="btn-close-level-modal"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Level Highlight Badge */}
            <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-100 font-medium">Gelar Saat Ini:</span>
                <span className="font-display font-bold text-amber-300 flex items-center gap-1">
                  {currentLevel.icon} {currentLevel.title}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {currentLevel.description}
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            {/* Progress to Next Level */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>Koleksi: {stars} Bintang</span>
                </div>
                <div className="text-xs font-semibold text-amber-800">
                  {nextLevel ? (
                    <span>
                      Menuju <strong>{nextLevel.title}</strong>
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Peringkat Tertinggi!
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-stone-200/80 rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${currentLevel.progressColor}`}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px] text-stone-600">
                <span>{progressPercent}% capaian tingkat ini</span>
                {nextLevel ? (
                  <span className="font-semibold text-amber-900">
                    Butuh <strong>{starsNeeded} ⭐</strong> lagi
                  </span>
                ) : (
                  <span className="font-semibold text-emerald-700">Maksimal</span>
                )}
              </div>
            </div>

            {/* Level Tier Ladder list */}
            <div>
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Jenjang Peringkat Penjelajah</span>
              </h3>

              <div className="space-y-2">
                {EXPLORER_LEVELS.map((lvl) => {
                  const isCurrent = lvl.level === currentLevel.level;
                  const isAchieved = stars >= lvl.minStars;
                  const isLocked = !isAchieved;

                  return (
                    <div
                      key={lvl.level}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-emerald-50/90 border-emerald-400 shadow-xs ring-2 ring-emerald-400/30'
                          : isAchieved
                          ? 'bg-stone-50 border-stone-200 opacity-90'
                          : 'bg-stone-100/60 border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${
                            isCurrent
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                              : isAchieved
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-stone-200 text-stone-400 border-stone-300'
                          }`}
                        >
                          {lvl.icon}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-display font-bold ${
                                isCurrent
                                  ? 'text-emerald-950'
                                  : isAchieved
                                  ? 'text-stone-800'
                                  : 'text-stone-500'
                              }`}
                            >
                              Level {lvl.level}: {lvl.title}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded-md bg-emerald-600 text-white text-[9px] font-bold">
                                Aktif
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-1">
                            {lvl.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-semibold text-stone-600 block">
                          {lvl.minStars}
                          {lvl.maxStars ? `–${lvl.maxStars}` : '+'} ⭐
                        </span>
                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5 justify-end">
                            <CheckCircle2 className="w-3 h-3" /> Posisi Ini
                          </span>
                        ) : isAchieved ? (
                          <span className="text-[10px] font-medium text-stone-500 flex items-center gap-0.5 justify-end">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terlewati
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-stone-400 flex items-center gap-0.5 justify-end">
                            <Lock className="w-3 h-3" /> Terkunci
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
            <p className="text-[11px] text-stone-500 italic">
              Kumpulkan bintang dari setiap pos misi & kuis!
            </p>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-xs active:scale-95"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
