import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowUpDown,
  Printer,
  ChevronRight,
  Compass,
  Award,
  Filter,
} from 'lucide-react';
import { MissionId, MissionJournalEntry } from '../types';
import { MISSIONS_DATA, MISSION_JOURNAL_DETAILS, EXPLORER_BADGES } from '../data/missions';
import { sound } from '../utils/audio';

interface ExplorerJournalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: MissionJournalEntry[];
  studentName: string;
  totalStars: number;
  completedMissions: Record<MissionId, boolean>;
  lastCompletedMissionId?: MissionId | null;
  onNavigateToMission: (missionId: MissionId) => void;
  onOpenHistory?: () => void;
  historyCount?: number;
}

type SortOrder = 'newest' | 'oldest' | 'missionNumber';
type CategoryFilter = 'all' | 'biotik' | 'abiotik' | 'ekosistem';

export const ExplorerJournal: React.FC<ExplorerJournalProps> = ({
  isOpen,
  onClose,
  entries,
  studentName,
  totalStars,
  completedMissions,
  lastCompletedMissionId,
  onNavigateToMission,
  onOpenHistory,
  historyCount = 0,
}) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [showBadges, setShowBadges] = useState<boolean>(true);

  // Format timestamp in friendly Indonesian locale
  const formatTimestamp = (isoDateString: string) => {
    try {
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) return 'Hari ini';

      const datePart = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);

      const timePart = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);

      return `${datePart}, ${timePart} WIB`;
    } catch {
      return 'Baru saja';
    }
  };

  const completedCount = Object.values(completedMissions).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 8) * 100);

  // Status rank title based on progress
  const getExplorerRank = () => {
    if (completedCount === 8) return '🌟 Master Harmoni Ekosistem Rimba';
    if (completedCount >= 6) return '🌿 Pengamat Ekosistem Terampil';
    if (completedCount >= 3) return '🔍 Detektif Alam Madya';
    if (completedCount >= 1) return '🌱 Penjelajah Alam Pemula';
    return '🧭 Calon Penjelajah Muda';
  };

  // Filter & Sort entries
  const displayedEntries = useMemo(() => {
    let list = [...entries];

    // Category filter
    if (activeFilter !== 'all') {
      list = list.filter((e) => {
        const details = MISSION_JOURNAL_DETAILS[e.missionId];
        const tag = e.categoryTag || details?.categoryTag;
        return tag === activeFilter;
      });
    }

    // Sort order
    list.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
      } else {
        return a.missionId - b.missionId;
      }
    });

    return list;
  }, [entries, sortOrder, activeFilter]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-explorer-journal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-xs overflow-y-auto"
    >
      <motion.div
        id="modal-explorer-journal-content"
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="relative w-full max-w-3xl bg-stone-50 rounded-3xl shadow-2xl border-4 border-amber-800/40 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Decorative Leather & Leaf Edge Ribbon */}
        <div className="h-3 bg-gradient-to-r from-emerald-800 via-amber-700 to-emerald-900 border-b border-amber-900/30 w-full shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-amber-50 via-stone-100 to-emerald-50/70 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md border-2 border-amber-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg sm:text-xl text-stone-900 tracking-tight">
                  Jurnal Penjelajah Alam
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  Log Lapangan
                </span>
              </div>
              <p className="text-xs text-stone-600 flex items-center gap-2 mt-0.5">
                <span>Catatan jejak observasi & perolehan bintang</span>
                <span className="text-stone-300">•</span>
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <img src="/karakter-penjelajah.png" alt="Penjelajah" className="w-4 h-4 object-contain inline-block" referrerPolicy="no-referrer" />
                  <span>{studentName || 'Penjelajah'}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenHistory && (
              <button
                id="btn-journal-open-history"
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onOpenHistory();
                }}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold border border-amber-300 flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
                title="Lihat Riwayat Sesi Pengerjaan"
              >
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden sm:inline">Riwayat Sesi</span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-300 text-amber-950">
                    {historyCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="btn-journal-close"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 hover:bg-stone-200/80 rounded-full text-stone-500 hover:text-stone-900 transition active:scale-95"
              title="Tutup Jurnal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-stone-800 flex-1">
          {/* Progress & Stats Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                  Status Ekspedisi
                </span>
                <h4 className="font-display font-bold text-base text-stone-900">
                  {getExplorerRank()}
                </h4>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-amber-800 block">
                    Bintang Lapangan
                  </span>
                  <span className="font-display font-black text-sm sm:text-base text-amber-900 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {totalStars}
                  </span>
                </div>
                <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-emerald-800 block">
                    Misi Ditaklukkan
                  </span>
                  <span className="font-display font-black text-sm sm:text-base text-emerald-900">
                    {completedCount} / 8
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar and Stepping Milestone Dots */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-stone-600">
                <span>Kelengkapan Jurnal</span>
                <span className="text-emerald-700 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full shadow-xs"
                />
              </div>

              {/* 8-Mission Stepping Stone Indicators */}
              <div className="grid grid-cols-8 gap-1 pt-1.5">
                {MISSIONS_DATA.map((m) => {
                  const isDone = completedMissions[m.id];
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        sound.playClick();
                        onClose();
                        onNavigateToMission(m.id);
                      }}
                      className={`py-1 rounded-lg text-center cursor-pointer transition flex flex-col items-center gap-0.5 ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold hover:bg-emerald-200'
                          : 'bg-stone-100 text-stone-400 border border-stone-200 hover:bg-stone-200/70'
                      }`}
                      title={`Pos ${m.id}: ${m.title} (${isDone ? 'Selesai' : 'Belum selesai'})`}
                    >
                      <span className="text-[11px] leading-none">{m.icon}</span>
                      <span className="text-[9px] font-mono leading-none">
                        {isDone ? '✓' : `M${m.id}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gamified Explorer Badges Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-stone-50 to-emerald-50/80 border-2 border-amber-300 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base shadow-xs">
                  🎖️
                </span>
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-amber-950">
                    Lencana Prestasi Penjelajah
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    Buka lencana kehormatan dengan menyelesaikan tiap pos di peta petualangan!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full">
                  {EXPLORER_BADGES.filter((b) => completedMissions[b.missionId]).length} / 8 Terbuka
                </span>
                <button
                  onClick={() => setShowBadges(!showBadges)}
                  className="text-xs text-amber-800 font-bold hover:underline cursor-pointer"
                >
                  {showBadges ? 'Sembunyikan' : 'Lihat Semua'}
                </button>
              </div>
            </div>

            {/* Celebratory Banner for Newly Completed Mission */}
            {lastCompletedMissionId && completedMissions[lastCompletedMissionId] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-between shadow-sm border border-amber-500"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg animate-bounce">🎉</span>
                  <span>
                    Hebat! Lencana Penjelajah untuk Pos {lastCompletedMissionId} berhasil kamu raih dan terbuka!
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-black/20 text-stone-950 rounded-full shrink-0">
                  Pencapaian Baru ✨
                </span>
              </motion.div>
            )}

            {/* Badges Grid with Celebratory Scale-up & Fade-in Animations */}
            {showBadges && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {EXPLORER_BADGES.map((badge) => {
                  const isUnlocked = completedMissions[badge.missionId];
                  const isJustCompleted = lastCompletedMissionId === badge.missionId;

                  return (
                    <motion.div
                      key={badge.id}
                      initial={
                        isUnlocked
                          ? { scale: 0.15, opacity: 0, y: 18 }
                          : { scale: 0.95, opacity: 0.6 }
                      }
                      animate={
                        isUnlocked
                          ? {
                              scale: isJustCompleted
                                ? [0.15, 1.28, 0.94, 1.06, 1]
                                : [0.15, 1.16, 0.98, 1],
                              opacity: 1,
                              y: 0,
                              boxShadow: isJustCompleted
                                ? [
                                    '0px 0px 0px rgba(245, 158, 11, 0)',
                                    '0px 0px 22px rgba(245, 158, 11, 0.75)',
                                    '0px 4px 14px rgba(245, 158, 11, 0.35)',
                                  ]
                                : [
                                    '0px 2px 6px rgba(16, 185, 129, 0.15)',
                                    '0px 4px 14px rgba(245, 158, 11, 0.35)',
                                    '0px 2px 6px rgba(16, 185, 129, 0.15)',
                                  ],
                            }
                          : { scale: 1, opacity: 0.6, y: 0 }
                      }
                      transition={{
                        duration: isJustCompleted ? 0.8 : 0.6,
                        ease: [0.175, 0.885, 0.32, 1.275],
                        delay: isUnlocked ? (badge.missionId - 1) * 0.06 : 0,
                        type: 'tween',
                      }}
                      whileHover={isUnlocked ? { scale: 1.05, y: -2 } : { scale: 1.01 }}
                      onClick={() => {
                        if (isUnlocked) {
                          sound.playStarEarned();
                          setSelectedBadgeId(badge.id);
                        } else {
                          sound.playClick();
                          setSelectedBadgeId(badge.id);
                        }
                      }}
                      className={`relative p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer select-none ${
                        isUnlocked
                          ? isJustCompleted
                            ? 'bg-gradient-to-b from-yellow-100 via-amber-50 to-emerald-50 border-amber-500 ring-3 ring-amber-400/80 shadow-md'
                            : 'bg-gradient-to-b from-amber-50 to-emerald-50 border-amber-400 ring-2 ring-amber-300/60 shadow-sm'
                          : 'bg-stone-100/80 border-stone-200 opacity-60 hover:opacity-80'
                      }`}
                    >
                      {/* Celebratory Ribbon for newly unlocked badge */}
                      {isJustCompleted && (
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity, type: 'tween', ease: 'easeInOut' }}
                          className="absolute -top-2 px-2 py-0.5 rounded-full bg-red-500 text-white font-black text-[8px] uppercase tracking-wider shadow-sm z-10"
                        >
                          🌟 BARU!
                        </motion.span>
                      )}

                      {/* Badge Icon */}
                      {isUnlocked ? (
                        <motion.div
                          animate={{ rotate: [0, 8, -8, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', type: 'tween' }}
                          className="text-3xl sm:text-4xl mb-1.5 filter drop-shadow-sm"
                        >
                          {badge.icon}
                        </motion.div>
                      ) : (
                        <div className="relative mb-1.5">
                          <span className="text-3xl sm:text-4xl grayscale filter opacity-50">
                            {badge.icon}
                          </span>
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-stone-700 text-white text-[10px] flex items-center justify-center shadow-xs">
                            🔒
                          </span>
                        </div>
                      )}

                      <span
                        className={`font-display font-bold text-xs leading-tight line-clamp-1 ${
                          isUnlocked ? 'text-amber-950' : 'text-stone-500'
                        }`}
                      >
                        {badge.badgeName}
                      </span>

                      <span className="text-[10px] font-mono text-stone-500 mt-0.5">
                        Pos {badge.missionId}
                      </span>

                      {/* Unlock Status Pill with Animation */}
                      {isUnlocked ? (
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity, type: 'tween', ease: 'easeInOut' }}
                          className="mt-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 text-[9px] font-extrabold flex items-center gap-1 shadow-2xs"
                        >
                          <Sparkles className="w-2.5 h-2.5 fill-stone-950" />
                          <span>TERBUKA!</span>
                        </motion.span>
                      ) : (
                        <span className="mt-1.5 px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[9px] font-semibold">
                          Terkunci
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filtering & Sorting Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-[11px] font-bold text-stone-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: 'all', label: `Semua (${entries.length})` },
                { id: 'biotik', label: '🌿 Biotik' },
                { id: 'abiotik', label: '☀️ Abiotik' },
                { id: 'ekosistem', label: '💧 Ekosistem' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveFilter(filter.id as CategoryFilter);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    activeFilter === filter.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Urutan:
              </span>
              <select
                id="select-journal-sort"
                value={sortOrder}
                onChange={(e) => {
                  sound.playClick();
                  setSortOrder(e.target.value as SortOrder);
                }}
                className="bg-white border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-semibold text-stone-700 focus:outline-emerald-600 shadow-2xs"
              >
                <option value="newest">Terbaru Selesai</option>
                <option value="oldest">Terlama Selesai</option>
                <option value="missionNumber">Nomor Pos (M1-M8)</option>
              </select>
            </div>
          </div>

          {/* Chronological List Entries */}
          {displayedEntries.length === 0 ? (
            /* Empty State */
            <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-stone-200 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-2xl shadow-inner">
                🧭
              </div>
              <h4 className="font-display font-bold text-base text-stone-800">
                {entries.length === 0
                  ? 'Jurnal Lapangan Masih Kosong'
                  : 'Tidak ada catatan untuk filter ini'}
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                {entries.length === 0
                  ? 'Kamu belum menyelesaikan misi di sepanjang jalan setapak. Ayo selesaikan Pos 1 di Taman Sekolah untuk mencatat hasil penyelidikan pertamamu!'
                  : 'Coba pilih filter "Semua" untuk melihat kembali seluruh catatan misi yang telah kamu selesaikan.'}
              </p>
              {entries.length === 0 && (
                <button
                  id="btn-journal-start-first-mission"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onNavigateToMission(1);
                  }}
                  className="mt-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-1.5 transition active:scale-95"
                >
                  <span>Mulai Misi 1: Ayo Mengamati</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            /* Timeline List */
            <div className="relative pl-4 sm:pl-6 space-y-4 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-600 before:via-amber-500 before:to-teal-600">
              <AnimatePresence>
                {displayedEntries.map((entry, index) => {
                  const details = MISSION_JOURNAL_DETAILS[entry.missionId];
                  const category = entry.categoryTag || details?.categoryTag || 'ekosistem';

                  const categoryColor =
                    category === 'biotik'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : category === 'abiotik'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-teal-100 text-teal-800 border-teal-300';

                  return (
                    <motion.div
                      key={entry.id || `entry-${entry.missionId}-${index}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                      className="relative p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow group"
                    >
                      {/* Timeline Node Icon marker */}
                      <div className="absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full bg-emerald-700 border-2 border-white text-white flex items-center justify-center text-[10px] shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>

                      {/* Entry Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-1.5 bg-stone-50 rounded-xl border border-stone-200/80">
                            {entry.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[11px] font-bold text-stone-500">
                                Pos {entry.missionId}
                              </span>
                              <span
                                className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase border ${categoryColor}`}
                              >
                                {category}
                              </span>
                              <h5 className="font-display font-bold text-sm sm:text-base text-stone-900 leading-tight">
                                {entry.title}
                              </h5>
                            </div>
                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{entry.location || entry.subtitle}</span>
                            </p>
                          </div>
                        </div>

                        {/* Badges: Timestamp & Stars */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Stars Earned */}
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 rounded-xl font-display font-black text-xs shadow-2xs">
                            <Star className="w-3.5 h-3.5 fill-stone-950" />
                            <span>+{entry.starsEarned} Bintang</span>
                          </div>

                          {/* Timestamp */}
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 bg-stone-100 px-2.5 py-1 rounded-xl font-medium">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>{formatTimestamp(entry.completedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Entry Key Findings & Field Notes */}
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Temuan & Observasi Ilmiah:</span>
                          </div>
                          <p className="text-stone-700 leading-relaxed">
                            {details?.keyDiscovery || entry.summary}
                          </p>
                        </div>

                        {/* Learning outcome tag */}
                        {details?.learningObjective && (
                          <p className="text-[11px] text-stone-500 italic pl-1">
                            🎯 Capaian: {details.learningObjective}
                          </p>
                        )}
                      </div>

                      {/* PERSISTENT 'KEY CONCEPTS' FOOTER SECTION: Biotik & Abiotik Review */}
                      {(() => {
                        const keyConcepts = entry.keyConcepts || details?.keyConcepts || {
                          biotik: 'Komponen makhluk hidup (tumbuhan, hewan, pengurai) yang saling berinteraksi.',
                          abiotik: 'Komponen fisik dan benda tak hidup (air, tanah, udara, sinar matahari) penyokong kehidupan.',
                          relationship: 'Komponen biotik dan abiotik saling memengaruhi membentuk keseimbangan ekosistem.',
                        };

                        return (
                          <div className="mt-3.5 pt-3 border-t-2 border-stone-200 bg-gradient-to-r from-emerald-50/70 via-stone-50/90 to-sky-50/70 rounded-2xl p-3 sm:p-3.5 border border-stone-200/90 shadow-2xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-display font-bold text-xs text-stone-900">
                                <span className="text-sm">🔑</span>
                                <span className="uppercase tracking-wider font-extrabold text-[11px] text-emerald-950">
                                  Key Concepts (Konsep Kunci Misi)
                                </span>
                              </div>
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                                Review Materi Siswa
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              {/* Biotik Definition */}
                              <div className="p-2.5 rounded-xl bg-white/95 border border-emerald-300 shadow-2xs space-y-1">
                                <div className="font-bold flex items-center gap-1 text-emerald-900">
                                  <span>🌱 Komponen Biotik:</span>
                                </div>
                                <p className="text-stone-700 leading-relaxed text-[11px]">
                                  {keyConcepts.biotik}
                                </p>
                              </div>

                              {/* Abiotik Definition */}
                              <div className="p-2.5 rounded-xl bg-white/95 border border-sky-300 shadow-2xs space-y-1">
                                <div className="font-bold flex items-center gap-1 text-sky-900">
                                  <span>☀️ Komponen Abiotik:</span>
                                </div>
                                <p className="text-stone-700 leading-relaxed text-[11px]">
                                  {keyConcepts.abiotik}
                                </p>
                              </div>
                            </div>

                            {/* Relationship Concept */}
                            {keyConcepts.relationship && (
                              <div className="text-[11px] text-stone-700 bg-white/90 p-2 rounded-xl border border-amber-200/90 flex items-start gap-1.5 shadow-2xs">
                                <span className="font-bold text-amber-900 shrink-0 text-[11px]">
                                  💡 Keterkaitan:
                                </span>
                                <span className="leading-relaxed text-[11px]">
                                  {keyConcepts.relationship}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Entry Footer Action */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Terverifikasi dalam Buku Lapangan
                        </span>

                        <button
                          onClick={() => {
                            sound.playClick();
                            onClose();
                            onNavigateToMission(entry.missionId);
                          }}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group-hover:translate-x-0.5 transition"
                        >
                          <span>Buka Pos Ini</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3.5 bg-stone-100/90 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <span className="text-base">📜</span>
            <span>
              Catatan tersimpan otomatis di perangkatmu untuk memantau kemajuan belajar IPAS.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Quick Print Button */}
            {entries.length > 0 && (
              <button
                id="btn-journal-print"
                onClick={() => {
                  sound.playClick();
                  window.print();
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition"
                title="Cetak Salinan Jurnal"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Jurnal</span>
              </button>
            )}

            <button
              id="btn-journal-close-footer"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Selected Badge Detail Popup Modal */}
        <AnimatePresence>
          {selectedBadgeId && (() => {
            const badge = EXPLORER_BADGES.find((b) => b.id === selectedBadgeId);
            if (!badge) return null;
            const isUnlocked = completedMissions[badge.missionId];

            return (
              <div
                id="modal-badge-detail"
                className="absolute inset-0 z-20 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 10 }}
                  className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-300 shadow-2xl text-center space-y-3 relative"
                >
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedBadgeId(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <motion.div
                    animate={
                      isUnlocked
                        ? {
                            scale: [1, 1.15, 1],
                            rotate: [0, 5, -5, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 1.5, repeat: isUnlocked ? Infinity : 0, type: 'tween', ease: 'easeInOut' }}
                    className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-100 to-emerald-100 border-2 border-amber-300 flex items-center justify-center text-5xl shadow-md"
                  >
                    {badge.icon}
                  </motion.div>

                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
                      Pos {badge.missionId} Ekspedisi
                    </span>
                    <h4 className="font-display font-black text-lg text-stone-900 mt-1">
                      {badge.badgeName}
                    </h4>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed px-2">
                    {isUnlocked ? badge.unlockedDesc : badge.lockedDesc}
                  </p>

                  <div className="pt-2">
                    {isUnlocked ? (
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Lencana Ini Telah Kamu Kuasai! 🌟</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-stone-600 text-xs">
                          🔒 Lencana ini masih terkunci. Selesaikan misi di <strong>Pos {badge.missionId}</strong> untuk membukanya!
                        </div>
                        <button
                          onClick={() => {
                            sound.playClick();
                            setSelectedBadgeId(null);
                            onClose();
                            onNavigateToMission(badge.missionId);
                          }}
                          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                        >
                          Menuju Pos {badge.missionId} Sekarang
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
