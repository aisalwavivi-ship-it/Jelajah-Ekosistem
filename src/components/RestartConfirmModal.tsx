import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, X, ShieldAlert, CheckCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface RestartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onConfirmRestart?: () => void;
  currentAttemptNumber?: number;
  currentAttempt?: number;
  completedCount?: number;
  stars?: number;
}

export const RestartConfirmModal: React.FC<RestartConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onConfirmRestart,
  currentAttemptNumber,
  currentAttempt,
  completedCount = 0,
  stars = 0,
}) => {
  if (!isOpen) return null;

  const attemptNum = currentAttemptNumber ?? currentAttempt ?? 1;

  const handleConfirm = () => {
    if (typeof onConfirm === 'function') {
      onConfirm();
    } else if (typeof onConfirmRestart === 'function') {
      onConfirmRestart();
    }
  };

  return (
    <AnimatePresence>
      <div
        id="modal-restart-confirm-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs"
      >
        <motion.div
          id="modal-restart-confirm-content"
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-3 border-amber-300 overflow-hidden"
        >
          {/* Top banner */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-xl shadow-inner">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-100 bg-black/20 px-2 py-0.5 rounded-full inline-block mb-0.5">
                  Konfirmasi Mulai Sesi Baru
                </span>
                <h3 className="font-display font-black text-xl text-white">
                  Mulai dari awal?
                </h3>
              </div>
            </div>

            <button
              id="btn-close-restart-modal"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer"
              title="Batal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex gap-3 text-left">
              <div className="shrink-0 text-2xl">🌱</div>
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                Progress sesi saat ini akan dimulai kembali dari M1. Riwayat pengerjaan sebelumnya tetap aman dan tidak akan dihapus.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 text-xs text-stone-600 space-y-1.5 text-left">
              <div className="flex items-center gap-2 font-bold text-stone-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Setelah memulai sesi baru:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600 pl-1">
                <li>Membuat <strong>Percobaan {attemptNum + 1}</strong></li>
                <li>Posisi petualangan kembali ke Misi 1 (Gerbang Sekolah)</li>
                <li>Misi 2–8 dan Tantangan Akhir akan terkunci kembali</li>
                <li>Bintang dan riwayat pengerjaan sebelumnya tetap tersimpan di Riwayat</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="btn-restart-cancel"
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-2xl border-2 border-stone-300 text-stone-700 hover:bg-stone-100 font-display font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95"
              >
                Batal
              </button>

              <button
                id="btn-restart-confirm"
                type="button"
                onClick={() => {
                  sound.playStarEarned();
                  handleConfirm();
                }}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-display font-black text-xs sm:text-sm shadow-md transition cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Mulai Lagi</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
