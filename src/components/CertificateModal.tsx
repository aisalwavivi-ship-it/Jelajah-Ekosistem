import React, { useEffect } from 'react';
import { X, Printer, Award, Sparkles } from 'lucide-react';
import { BadgeInfo } from '../types';
import { sound } from '../utils/audio';
import { triggerCertificateConfetti } from '../utils/confetti';
import { getExplorerLevel } from '../utils/levels';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  score: number;
  badge: BadgeInfo;
  stars: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  playerName,
  score,
  badge,
  stars,
}) => {
  const explorerLevel = getExplorerLevel(stars);

  useEffect(() => {
    if (isOpen) {
      triggerCertificateConfetti();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-amber-300 p-6 sm:p-10 my-auto text-stone-800">
        {/* Certificate Watermark and Decorative Borders */}
        <div className="absolute inset-2 border-2 border-dashed border-amber-400/70 rounded-2xl pointer-events-none" />
        <div className="absolute top-4 right-4 text-4xl opacity-15 pointer-events-none">🌿</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-15 pointer-events-none">🌳</div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition z-10 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Media Pembelajaran IPAS Kelas V SD
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-emerald-950 tracking-tight">
            PIAGAM PENGHARGAAN
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm italic">
            Diberikan atas keberhasilan menyelesaikan seluruh misi petualangan
          </p>
          <div className="text-lg font-display font-bold text-amber-800">
            🌿 JELAJAH EKOSISTEM 🌿
          </div>
        </div>

        {/* Certificate Recipient */}
        <div className="text-center space-y-3 my-6 py-4 bg-amber-50/50 rounded-2xl border border-amber-200/60">
          <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            Diberikan kepada Penjelajah:
          </p>
          <p className="font-display font-black text-2xl sm:text-3xl text-emerald-900 underline decoration-amber-400 decoration-wavy decoration-2">
            {playerName || 'Penjelajah Cilik'}
          </p>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto px-4">
            Telah berhasil menelusuri <strong>Jalan Setapak Ekosistem</strong>, mengidentifikasi komponen <strong>Biotik & Abiotik</strong>, serta memahami harmoni hubungan dalam ekosistem.
          </p>
        </div>

        {/* Badge & Scores Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-6 py-3 border-y border-stone-200">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-stone-500">Tingkat Penjelajah</span>
            <span className="text-2xl mt-0.5">{explorerLevel.icon}</span>
            <span className="font-display font-bold text-xs sm:text-sm text-emerald-950">
              Lv.{explorerLevel.level} {explorerLevel.title}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-stone-500">Lencana Prestasi</span>
            <span className="text-2xl mt-0.5">{badge.icon}</span>
            <span className="font-display font-bold text-xs sm:text-sm text-amber-950">
              {badge.title}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-stone-500">Nilai Evaluasi</span>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-800 mt-0.5">
              {score}
            </span>
            <span className="text-[10px] text-stone-400">dari 100 poin</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-stone-500">Bintang Diraih</span>
            <span className="text-2xl mt-0.5">⭐</span>
            <span className="font-display font-bold text-base sm:text-lg text-amber-900">
              {stars} Bintang
            </span>
          </div>
        </div>

        {/* Date and Official Signature stamp */}
        <div className="flex items-end justify-between pt-4 text-xs text-stone-600">
          <div>
            <p className="text-stone-400 text-[10px]">Tanggal Penyelesaian:</p>
            <p className="font-bold text-stone-700">{currentDate}</p>
            <p className="text-[10px] text-stone-500">Bab 3: Harmoni dalam Ekosistem</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center p-1 bg-emerald-50 text-emerald-800 rotate-[-8deg] shadow-xs mx-auto mb-1">
              <span className="text-xs">🌱</span>
              <span className="text-[9px] font-extrabold uppercase leading-tight">IPAS KELAS V</span>
              <span className="text-[8px] font-semibold text-emerald-600">Terverifikasi</span>
            </div>
            <p className="font-bold text-stone-800 text-[11px]">Tim Guru IPAS SD</p>
          </div>
        </div>

        {/* Print / Action Buttons */}
        <div className="mt-8 pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs sm:text-sm"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md text-xs sm:text-sm transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan Piagam</span>
          </button>
        </div>
      </div>
    </div>
  );
};
