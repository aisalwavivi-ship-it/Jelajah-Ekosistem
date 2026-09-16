import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, RotateCcw, X, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface ConfirmResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentAttempt?: number;
  completedCount?: number;
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentAttempt = 1,
  completedCount = 0,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-confirm-restart"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, type: 'tween', ease: 'easeOut' }}
        className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden p-6 text-stone-800"
      >
        {/* Close Button */}
        <button
          id="btn-confirm-restart-close"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
          title="Tutup dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-inner">
            <RotateCcw className="w-7 h-7" />
          </div>

          <h3 className="font-display font-black text-2xl text-emerald-950 tracking-tight">
            Mulai dari awal?
          </h3>

          <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200 text-stone-700 text-xs sm:text-sm leading-relaxed space-y-2 text-center w-full">
            <p className="font-medium">
              Progress sesi saat ini ({completedCount}/8 Misi) akan dimulai kembali dari <strong>Misi 1 (M1)</strong>.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-xs bg-emerald-100/90 py-1.5 px-3 rounded-xl border border-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>Riwayat pengerjaan sebelumnya tetap aman dan tidak akan dihapus.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-2 border-t border-stone-100">
          <button
            id="btn-confirm-restart-cancel"
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-3 px-4 rounded-xl border-2 border-stone-300 hover:bg-stone-100 text-stone-700 font-display font-bold text-sm transition cursor-pointer active:scale-95"
          >
            Batal
          </button>

          <button
            id="btn-confirm-restart-submit"
            type="button"
            onClick={() => {
              sound.playClick();
              onConfirm();
            }}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-display font-extrabold text-sm shadow-md transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Lagi</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
