import React from 'react';
import { X, Sparkles, Compass, CheckCircle2, Award } from 'lucide-react';
import { CharacterAvatar } from './illustrations/CharacterAvatar';
import { sound } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-200 relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Background decorative leaves */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-12 -mt-12 pointer-events-none opacity-60" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧭</span>
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-stone-800">
                Cara Bermain & Petualangan
              </h3>
              <p className="text-xs text-stone-500">
                Panduan untuk Penjelajah Ekosistem Cilik
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto space-y-4 pr-1 text-stone-700 text-sm">
          {/* Guide introduction */}
          <div className="flex items-start gap-4 p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200">
            <CharacterAvatar size="md" className="shrink-0" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-amber-900 mb-1">
                Halo, Penjelajah Hebat! 🌿
              </p>
              <p className="text-stone-700 leading-relaxed">
                Tugasmu adalah mengikuti <strong>jalan setapak alami</strong> mulai dari gerbang sekolah, mengamati lingkungan, mengelompokkan <strong>komponen biotik</strong> dan <strong>abiotik</strong>, hingga memahami rahasia ekosistem!
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1 text-xs sm:text-sm">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>1. Ikuti Jalan Setapak</span>
              </div>
              <p className="text-xs text-stone-600">
                Jalan setapak menghubungkan 8 misi dari sekolah sampai puncak pandang. Selesaikan setiap misi berurutan!
              </p>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl">
              <div className="flex items-center gap-2 font-bold text-sky-900 mb-1 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-sky-700" />
                <span>2. Kumpulkan Bintang ⭐</span>
              </div>
              <p className="text-xs text-stone-600">
                Dapatkan bintang dengan mengamati objek, memilah benda biotik dan abiotik, dan menyelesaikan kuis.
              </p>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl">
              <div className="flex items-center gap-2 font-bold text-purple-900 mb-1 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-purple-700" />
                <span>3. Coba Lagi Kapan Saja</span>
              </div>
              <p className="text-xs text-stone-600">
                Jangan takut salah! Jika jawabanmu keliru, kamu selalu bisa mencoba lagi sampai benar-benar paham.
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <div className="flex items-center gap-2 font-bold text-amber-900 mb-1 text-xs sm:text-sm">
                <Award className="w-4 h-4 text-amber-700" />
                <span>4. Raih Piagam Juara 🏆</span>
              </div>
              <p className="text-xs text-stone-600">
                Di akhir petualangan, kamu akan memperoleh badge kehormatan serta sertifikat resmi Penjelajah Ekosistem!
              </p>
            </div>
          </div>

          {/* Quick Concept reminder */}
          <div className="p-3.5 bg-stone-100 rounded-2xl text-xs space-y-1 border border-stone-200">
            <p className="font-bold text-stone-800">💡 Kunci Rahasia Pembelajaran:</p>
            <p>
              • <strong>Biotik:</strong> Makhluk hidup (manusia, hewan, tumbuhan, jamur).
            </p>
            <p>
              • <strong>Abiotik:</strong> Benda/faktor tak hidup (air, udara, tanah, sinar matahari, batu).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-amber-100 flex justify-end">
          <button
            id="btn-close-how-to-play"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-bold rounded-2xl shadow-md transition active:scale-95 text-center"
          >
            Siap Berpetualang! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
