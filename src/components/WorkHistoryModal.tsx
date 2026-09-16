import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Award,
  Star,
  CheckCircle2,
  Trophy,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { SessionRecord, MissionId } from '../types';
import { MISSIONS_DATA } from '../data/missions';
import { sound } from '../utils/audio';

interface WorkHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SessionRecord[];
  activeAttemptNumber: number;
  activeCompletedCount: number;
  activeStars: number;
  activeStatus: 'active' | 'completed';
  activeQuizScore: number | null;
  activeStudentName: string;
  activeStartedAt: string;
  onRequestStartNewSession: () => void;
  onContinueActiveSession: () => void;
  onViewCertificateForSession?: (session: SessionRecord) => void;
}

export const WorkHistoryModal: React.FC<WorkHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  activeAttemptNumber,
  activeCompletedCount,
  activeStars,
  activeStatus,
  activeQuizScore,
  activeStudentName,
  activeStartedAt,
  onRequestStartNewSession,
  onContinueActiveSession,
  onViewCertificateForSession,
}) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format date in Indonesian locale (e.g. 16 September 2026)
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Hari ini';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return '16 September 2026';
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return '16 September 2026';
    }
  };

  const formatTime = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return '';
      return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(d) + ' WIB';
    } catch {
      return '';
    }
  };

  // Sort history: newest attempt first
  const sortedHistory = [...history].sort((a, b) => b.attemptNumber - a.attemptNumber);

  return (
    <div
      id="modal-work-history"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.24, type: 'tween', ease: 'easeOut' }}
        className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border-4 border-emerald-300 overflow-hidden my-auto text-stone-800 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-5 sm:px-7 py-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">📚</span>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-emerald-50 tracking-tight leading-tight flex items-center gap-2">
                RIWAYAT PENGERJAAN
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-200">
                Catatan sesi dan rekam jejak petualangan belajar ekosistem
              </p>
            </div>
          </div>

          <button
            id="btn-close-work-history"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            title="Tutup Riwayat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
          
          {/* 1. ACTIVE SESSION CARD */}
          <div className="bg-amber-50/90 rounded-3xl border-2 border-amber-300 p-4 sm:p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="font-display font-extrabold text-base sm:text-lg text-amber-950">
                  Percobaan {activeAttemptNumber} — {activeStatus === 'completed' ? 'Selesai' : 'Sedang Berjalan'}
                </h3>
              </div>
              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                Sesi Aktif
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-white/80 rounded-2xl p-2.5 border border-amber-200">
                <span className="text-[10px] text-stone-500 font-semibold block">Progress Misi</span>
                <span className="font-display font-extrabold text-sm sm:text-base text-emerald-900">
                  {activeCompletedCount}/8 Misi
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block">
                  ({Math.round((activeCompletedCount / 8) * 100)}%)
                </span>
              </div>

              <div className="bg-white/80 rounded-2xl p-2.5 border border-amber-200">
                <span className="text-[10px] text-stone-500 font-semibold block">Bintang Sesi Ini</span>
                <span className="font-display font-extrabold text-sm sm:text-base text-amber-900 flex items-center justify-center gap-1">
                  ⭐ {activeStars}
                </span>
              </div>

              <div className="bg-white/80 rounded-2xl p-2.5 border border-amber-200">
                <span className="text-[10px] text-stone-500 font-semibold block">Tantangan Akhir</span>
                <span className="font-display font-extrabold text-sm sm:text-base text-stone-800">
                  {activeQuizScore !== null ? `${activeQuizScore} Poin` : 'Belum Kuis'}
                </span>
              </div>

              <div className="bg-white/80 rounded-2xl p-2.5 border border-amber-200">
                <span className="text-[10px] text-stone-500 font-semibold block">Mulai Sesi</span>
                <span className="font-bold text-xs text-stone-700 block truncate">
                  {formatDate(activeStartedAt)}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {formatTime(activeStartedAt)}
                </span>
              </div>
            </div>

            {/* Quick Action inside Active Session */}
            <div className="mt-4 pt-3 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onContinueActiveSession();
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
              >
                <span>Lanjutkan Misi Aktif</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onRequestStartNewSession();
                }}
                className="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-300 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                <span>Mulai Sesi Baru</span>
              </button>
            </div>
          </div>

          {/* 2. COMPLETED HISTORY SESSIONS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xs sm:text-sm text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Riwayat Sesi Selesai ({sortedHistory.length})</span>
              </h3>
              {sortedHistory.length > 0 && (
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Tersimpan Permanen
                </span>
              )}
            </div>

            {sortedHistory.length === 0 ? (
              <div className="text-center py-8 px-4 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 text-stone-500 space-y-2">
                <span className="text-3xl block">🌱</span>
                <p className="font-display font-bold text-sm text-stone-700">
                  Belum ada sesi yang selesai dicatat
                </p>
                <p className="text-xs max-w-sm mx-auto text-stone-500">
                  Selesaikan 8 Misi Ekosistem dan ikuti Tantangan Kuis hingga selesai. Catatan hasil pengerjaanmu akan otomatis tersimpan di sini!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedHistory.map((item) => {
                  const isExpanded = expandedSessionId === item.id;
                  const dateDisplay = formatDate(item.completedAt || item.startedAt);
                  const timeDisplay = formatTime(item.completedAt || item.startedAt);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-300 transition-all p-4 shadow-xs space-y-3"
                    >
                      {/* Session Header Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">{item.badgeIcon || '🏅'}</span>
                          <div>
                            <h4 className="font-display font-black text-base text-emerald-950 flex items-center gap-2">
                              <span>Percobaan {item.attemptNumber} — Selesai</span>
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Selesai
                              </span>
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-stone-400" />
                                <span>{dateDisplay}</span>
                              </span>
                              {timeDisplay && (
                                <span className="flex items-center gap-1 text-stone-400">
                                  <Clock className="w-3 h-3" />
                                  <span>{timeDisplay}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Badges and action */}
                        <div className="flex items-center gap-2">
                          {onViewCertificateForSession && (
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                onViewCertificateForSession(item);
                              }}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Lihat Piagam Percobaan Ini"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-600" />
                              <span>Piagam</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setExpandedSessionId(isExpanded ? null : item.id);
                            }}
                            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs"
                          >
                            <span>{isExpanded ? 'Tutup Rincian' : 'Rincian Misi'}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Summary Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 block">Status Misi</span>
                          <span className="font-display font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{item.completedMissionsCount}/8 Misi (100%)</span>
                          </span>
                        </div>

                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 block">Tantangan Akhir</span>
                          <span className="font-display font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-600" />
                            <span>{item.quizScore ?? 100} Poin</span>
                          </span>
                        </div>

                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 block">Total Bintang</span>
                          <span className="font-display font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{item.stars} Bintang</span>
                          </span>
                        </div>

                        <div className="p-2 bg-stone-50 rounded-xl">
                          <span className="text-[10px] text-stone-400 block">Lencana Diraih</span>
                          <span className="font-display font-bold text-stone-800 truncate block mt-0.5" title={item.badgeTitle}>
                            {item.badgeTitle || 'Ahli Ekosistem'}
                          </span>
                        </div>
                      </div>

                      {/* Expandable breakdown for M1-M8 scores */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pt-2 border-t border-stone-100 overflow-hidden"
                          >
                            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                              Rincian Skor Per Misi:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                              {MISSIONS_DATA.map((m) => {
                                const score = item.missionScores ? item.missionScores[m.id] : m.points;
                                const isMissionDone = item.completedMissions ? item.completedMissions[m.id] : true;
                                return (
                                  <div
                                    key={m.id}
                                    className="p-1.5 bg-emerald-50/70 border border-emerald-100 rounded-lg flex items-center justify-between"
                                  >
                                    <span className="font-semibold text-stone-700 truncate text-[11px]">
                                      M{m.id}: {m.icon}
                                    </span>
                                    <span className="text-amber-800 font-extrabold text-[11px] shrink-0">
                                      ⭐{score || m.points}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-5 sm:px-7 py-3 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-stone-500">
            Penjelajah: <strong>{activeStudentName || 'Penjelajah Muda'}</strong>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-display font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};
