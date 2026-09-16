import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  Calendar,
  Star,
  Trophy,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { ActiveSession, SessionHistoryItem } from '../types';
import { sound } from '../utils/audio';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSession: ActiveSession;
  history: SessionHistoryItem[];
  studentName?: string;
  onStartNewAttempt?: () => void;
  onOpenRestartConfirm?: () => void;
  onGoToMap?: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  activeSession,
  history,
  studentName = 'Penjelajah Muda',
  onStartNewAttempt,
  onOpenRestartConfirm,
  onGoToMap,
}) => {
  if (!isOpen) return null;

  const handleStartAttempt = () => {
    if (typeof onStartNewAttempt === 'function') {
      onStartNewAttempt();
    } else if (typeof onOpenRestartConfirm === 'function') {
      onOpenRestartConfirm();
    }
  };

  const handleGoMap = () => {
    onClose();
    if (typeof onGoToMap === 'function') {
      onGoToMap();
    }
  };

  const activeCompletedCount = Object.values(activeSession.completedMissions).filter(Boolean).length;
  const activeProgressPercent = Math.round((activeCompletedCount / 8) * 100);

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'Baru saja';
    try {
      const d = new Date(isoStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoStr;
    }
  };

  return (
    <AnimatePresence>
      <div
        id="modal-history-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/75 backdrop-blur-xs overflow-y-auto"
      >
        <motion.div
          id="modal-history-content"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-3 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-700 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl shadow-inner">
                📚
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                    Rekam Jejak Belajar
                  </span>
                  <span className="text-xs text-emerald-200">
                    {studentName || 'Penjelajah Muda'}
                  </span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                  Riwayat Pengerjaan
                </h2>
              </div>
            </div>

            <button
              id="btn-close-history-modal"
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

          {/* Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* 1. ACTIVE SESSION SECTION */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sesi Pengerjaan Saat Ini</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Checkpoint Aktif
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50/90 via-emerald-50/40 to-teal-50/80 border-2 border-amber-300 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-base sm:text-lg text-stone-900">
                        Percobaan {activeSession.attemptNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          activeSession.status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-400 text-stone-950 ring-1 ring-amber-500/40'
                        }`}
                      >
                        {activeSession.status === 'completed' ? '✓ Selesai' : 'Sedang Berjalan'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Dimulai: {formatDate(activeSession.startedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-white rounded-xl border border-amber-200 text-center shadow-2xs">
                      <span className="text-[10px] text-stone-500 block font-semibold">Progres Misi</span>
                      <span className="font-display font-bold text-xs text-emerald-950">
                        {activeCompletedCount}/8 Misi ({activeProgressPercent}%)
                      </span>
                    </div>

                    <div className="px-3 py-1.5 bg-white rounded-xl border border-amber-200 text-center shadow-2xs">
                      <span className="text-[10px] text-stone-500 block font-semibold">Bintang</span>
                      <span className="font-display font-bold text-xs text-amber-700 flex items-center justify-center gap-0.5">
                        ⭐ {activeSession.stars}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active Session Progress Bar */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-700 font-medium">
                    <span>Capaian Jalan Setapak (M1–M8):</span>
                    <span className="font-bold text-emerald-900">{activeCompletedCount} dari 8 Selesai</span>
                  </div>
                  <div className="w-full h-3 bg-stone-200/90 rounded-full overflow-hidden p-0.5 border border-amber-200">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${activeProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Score info if quiz is done */}
                {activeSession.quizScore !== null && (
                  <div className="mt-3 p-2.5 rounded-2xl bg-white/80 border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="text-stone-700 font-semibold flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500" /> Skor Kuis Evaluasi:
                    </span>
                    <span className="font-display font-extrabold text-sm text-emerald-900">
                      {activeSession.quizScore} / 100
                    </span>
                  </div>
                )}

                {/* Quick actions for current active session */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60">
                  <button
                    id="btn-history-continue-map"
                    onClick={() => {
                      sound.playClick();
                      handleGoMap();
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-bold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span>Lanjutkan di Peta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id="btn-history-start-new-attempt"
                    onClick={() => {
                      sound.playClick();
                      handleStartAttempt();
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-amber-50 border border-amber-300 text-amber-950 font-display font-bold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Mulai Percobaan Baru</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. COMPLETED SESSIONS HISTORY LIST */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Riwayat Sesi Selesai ({history.length})</span>
                </span>
                <span className="text-[11px] text-stone-500 italic">
                  Tersimpan mandiri, tidak terhapus saat reset
                </span>
              </div>

              {history.length === 0 ? (
                <div className="p-8 rounded-3xl bg-stone-50 border-2 border-dashed border-stone-300 text-center space-y-2">
                  <div className="text-3xl">🎒</div>
                  <h4 className="font-display font-bold text-sm text-stone-800">
                    Belum Ada Riwayat Sesi Selesai
                  </h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                    Selesaikan seluruh 8 Misi Ekosistem dan ikuti Tantangan Kuis Akhir untuk mencatat riwayat pertamamu di sini!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((h) => {
                    const isFullyFinished = h.completedCount >= 8 && h.quizScore !== null;
                    return (
                      <div
                        key={`history-attempt-${h.sessionId}-${h.completedAt}`}
                        className="p-4 sm:p-4.5 rounded-2xl bg-white border-2 border-stone-200/90 shadow-xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-extrabold text-sm sm:text-base text-emerald-950">
                              Percobaan {h.attemptNumber}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isFullyFinished
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {isFullyFinished ? '✓ Selesai Penuh' : 'Selesai'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-stone-600">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>📅 {formatDate(h.completedAt)}</span>
                          </div>

                          {h.badgeTitle && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 pt-0.5">
                              <span>🏅</span>
                              <span>{h.badgeTitle}</span>
                            </div>
                          )}
                        </div>

                        {/* Badges / Metrics Row */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                          <div className="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                            <span className="text-[10px] text-emerald-800 font-semibold block">Misi</span>
                            <span className="text-xs font-black text-emerald-950">
                              ✅ {h.completedCount}/8
                            </span>
                          </div>

                          <div className="px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                            <span className="text-[10px] text-amber-800 font-semibold block">Bintang</span>
                            <span className="text-xs font-black text-amber-900 flex items-center justify-center gap-0.5">
                              ⭐ {h.stars}
                            </span>
                          </div>

                          {h.quizScore !== null && (
                            <div className="px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-center">
                              <span className="text-[10px] text-sky-800 font-semibold block">Skor Kuis</span>
                              <span className="text-xs font-black text-sky-950">
                                🏆 {h.quizScore}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
            <p className="text-[11px] text-stone-500 italic">
              Prinsip Jelajah Ekosistem: Reset sesi tidak akan menghapus riwayat pengerjaan.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-xs active:scale-95"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
