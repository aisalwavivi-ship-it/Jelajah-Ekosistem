import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, X, Sparkles, Lightbulb, ChevronRight, ChevronDown } from 'lucide-react';
import { AppScene } from '../types';
import { sound } from '../utils/audio';

interface FloatingMascotProps {
  currentScene: AppScene;
  studentName?: string;
  isAudioMuted?: boolean;
}

interface SceneTip {
  title: string;
  badge: string;
  tip: string;
  funFact: string;
  mood: 'happy' | 'curious' | 'celebrate' | 'thinking';
}

const SCENE_TIPS: Record<AppScene, SceneTip> = {
  start: {
    title: 'Salam Petualang!',
    badge: 'Gerbang Awal',
    tip: 'Isi namamu di kolom nama, lalu klik "Mulai Petualangan" untuk menyusuri jalan setapak bersama!',
    funFact: 'Ekosistem adalah kesatuan hubungan timbal balik antara makhluk hidup dengan lingkungan sekitarnya.',
    mood: 'happy',
  },
  map: {
    title: 'Peta Penjelajahan',
    badge: 'Jalan Setapak',
    tip: 'Pilih pos batu pijakan yang menyala untuk melanjutkan penyelidikan alam di tiap stasiun!',
    funFact: 'Menyelesaikan misi secara bertahap membantumu mengumpulkan bintang dan membuka Sertifikat Penjelajah!',
    mood: 'curious',
  },
  material: {
    title: 'Buku Catatan Materi',
    badge: 'Ensiklopedi Sains',
    tip: 'Baca rangkuman materi sains ekosistem, individu, populasi, komunitas, biotik, dan abiotik untuk bekal kuis!',
    funFact: 'Tumbuhan disebut produsen karena mampu memasak makanannya sendiri lewat fotosintesis.',
    mood: 'thinking',
  },
  'mission-1': {
    title: 'Misi 1: Mengenal Ekosistem',
    badge: 'Pengamatan Alam',
    tip: 'Klik objek-objek di taman untuk mengamati makhluk hidup (biotik) dan lingkungan tak hidup (abiotik). Keduanya saling berdampingan membentuk ekosistem!',
    funFact: 'Tumbuhan, hewan, air, tanah, batu, dan sinar matahari berinteraksi bersama membentuk satu kesatuan ekosistem.',
    mood: 'curious',
  },
  'mission-2': {
    title: 'Misi 2: Ciri Makhluk Hidup',
    badge: 'Uji Detektif',
    tip: 'Cek 4 ciri hidup: bernapas, bergerak, butuh nutrisi/makan, dan berkembang biak. Abiotik tidak memilikinya!',
    funFact: 'Air sungai bisa bergerak karena gaya gravitasi, namun air bukan makhluk hidup karena tidak bernapas atau butuh makan.',
    mood: 'thinking',
  },
  'mission-3': {
    title: 'Misi 3: Peran Komponen Biotik',
    badge: 'Kebun Rindang',
    tip: 'Kelompokkan ke zona yang tepat: Produsen (tumbuhan), Konsumen (hewan), atau Pengurai (jamur & cacing)!',
    funFact: 'Tumbuhan hijau adalah produsen utama karena mampu membuat makanan sendiri melalui fotosintesis.',
    mood: 'curious',
  },
  'mission-4': {
    title: 'Misi 4: Kekuatan Abiotik',
    badge: 'Faktor Lingkungan',
    tip: 'Atur intensitas cahaya matahari, air, dan unsur hara tanah untuk melihat pertumbuhannya secara seimbang!',
    funFact: 'Matahari adalah sumber energi terbesar di bumi yang menggerakkan siklus air dan fotosintesis.',
    mood: 'thinking',
  },
  'mission-5': {
    title: 'Misi 5: Rancang Ekosistem',
    badge: 'Keseimbangan Alam',
    tip: 'Pilih ekosistem Taman atau Kolam, lalu pasang komponen hidup dan lingkungannya hingga seimbang!',
    funFact: 'Ekosistem yang seimbang akan tetap lestari karena produsen dan konsumen saling melengkapi.',
    mood: 'happy',
  },
  'mission-6': {
    title: 'Misi 6: Uji Coba Gangguan',
    badge: 'Bagaimana Jika?',
    tip: 'Amati efek berantai ketika salah satu komponen alam terganggu atau tercemar limbah!',
    funFact: 'Satu perubahan kecil pada rantai makanan bisa memengaruhi seluruh kelangsungan makhluk hidup lainnya.',
    mood: 'thinking',
  },
  'mission-7': {
    title: 'Misi 7: Aliran Energi Rantai',
    badge: 'Penyelidikan Ekosistem',
    tip: 'Hubungkan panah rantai makanan: dari produsen ➔ herbivora ➔ karnivora ➔ pengurai!',
    funFact: 'Panah pada rantai makanan menunjukkan arah perpindahan energi makanan dari mangsa ke pemangsa.',
    mood: 'curious',
  },
  'mission-8': {
    title: 'Misi 8: Rangkuman Peta Konsep',
    badge: 'Puncak Pandang',
    tip: 'Tarik dan pasangkan simpul kata kunci untuk membentuk peta konsep ekosistem yang utuh!',
    funFact: 'Peta pikiran menghubungkan pemahaman biotik, abiotik, dan perannya dalam satu gambar besar.',
    mood: 'happy',
  },
  quiz: {
    title: 'Ujian Evaluasi Akhir',
    badge: 'Tantangan Pengetahuan',
    tip: 'Baca 10 pertanyaan dengan cermat. Nilai tinggi akan membuka Lencana Kehormatan dan Sertifikat Resmi!',
    funFact: 'Soal kuis dirancang sesuai kurikulum IPAS Kelas 5 tentang Harmoni dalam Ekosistem.',
    mood: 'celebrate',
  },
  finish: {
    title: 'Hebat, Penjelajah Juara!',
    badge: 'Petualangan Selesai',
    tip: 'Kamu berhasil menaklukkan seluruh rute jalan setapak! Klik "Sertifikat" untuk mencetak prestasimu!',
    funFact: 'Tetap rawat tanaman dan cintai lingkungan di sekitarmu setiap hari!',
    mood: 'celebrate',
  },
};

export const FloatingMascot: React.FC<FloatingMascotProps> = ({
  currentScene,
  studentName = 'Penjelajah Muda',
  isAudioMuted = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showFunFact, setShowFunFact] = useState(false);
  const [hasUnreadTip, setHasUnreadTip] = useState(false);
  const prevSceneRef = useRef<AppScene>(currentScene);

  const sceneData = SCENE_TIPS[currentScene] || SCENE_TIPS.start;

  // Trigger sound and bouncy entry whenever currentScene changes
  useEffect(() => {
    // Only play and pop open on actual scene change or initial mount
    const isSceneChanged = prevSceneRef.current !== currentScene;
    prevSceneRef.current = currentScene;

    if (isSceneChanged) {
      setIsOpen(true);
      setShowFunFact(false);
      setHasUnreadTip(true);
    }

    // Play subtle marimba chime tip sound if audio is enabled
    if (!isAudioMuted) {
      const audioTimer = setTimeout(() => {
        sound.playMascotTip();
      }, 350);
      return () => clearTimeout(audioTimer);
    }
  }, [currentScene, isAudioMuted]);

  const handleToggleOpen = () => {
    sound.playClick();
    if (!isOpen) {
      setHasUnreadTip(false);
      if (!isAudioMuted) {
        sound.playMascotTip();
      }
    }
    setIsOpen((prev) => !prev);
  };

  const handlePlaySoundAgain = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playMascotTip();
  };

  return (
    <div
      id="floating-mascot-container"
      className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none select-none max-w-[calc(100vw-24px)]"
    >
      {/* 1. Contextual Speech Bubble Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15, x: 15 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="pointer-events-auto mb-2 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-emerald-400/80 overflow-hidden"
          >
            {/* Mascot Header */}
            <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xs shadow-inner">
                  🌿
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-white leading-tight">
                    Riko si Kancil Alam
                  </h4>
                  <span className="text-[10px] text-emerald-200 block font-medium">
                    {sceneData.badge}
                  </span>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1">
                {/* Audio cue replay button */}
                <button
                  id="btn-mascot-replay-audio"
                  onClick={handlePlaySoundAgain}
                  className="p-1 rounded-lg hover:bg-white/20 text-emerald-100 transition active:scale-95"
                  title="Putar nada petunjuk"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                {/* Close/Minimize */}
                <button
                  id="btn-mascot-minimize"
                  onClick={handleToggleOpen}
                  className="p-1 rounded-lg hover:bg-white/20 text-emerald-100 transition active:scale-95"
                  title="Sembunyikan petunjuk"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tip Body Content */}
            <div className="p-3 text-stone-800 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-amber-500 text-base shrink-0 mt-0.5 animate-bounce">
                  💡
                </span>
                <p className="text-xs sm:text-[13px] leading-relaxed font-medium text-stone-700">
                  {sceneData.tip}
                </p>
              </div>

              {/* Extra Expandable "Tahukah Kamu?" Section */}
              <AnimatePresence>
                {showFunFact && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 leading-relaxed space-y-1">
                      <div className="flex items-center gap-1 font-bold text-amber-800">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Tahukah Kamu?</span>
                      </div>
                      <p>{sceneData.funFact}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer controls inside bubble */}
              <div className="pt-1 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowFunFact((prev) => !prev);
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 transition"
                >
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  <span>{showFunFact ? 'Tutup Fakta' : 'Fakta Alam ➔'}</span>
                </button>

                <span className="text-[10px] text-stone-600">
                  {studentName ? `Untuk ${studentName}` : 'Tips Pintar'}
                </span>
              </div>
            </div>

            {/* Pointer notch to mascot below */}
            <div className="w-3 h-3 bg-white border-r-2 border-b-2 border-emerald-400/80 rotate-45 ml-auto mr-7 -mb-1.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. The Floating Mascot Character Avatar Button */}
      <motion.div
        initial={{ x: 80, opacity: 0, scale: 0.5 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="pointer-events-auto relative cursor-pointer"
      >
        <motion.button
          id="btn-floating-mascot-avatar"
          onClick={handleToggleOpen}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            y: [0, -6, 0],
            rotate: [0, -1.5, 1.5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut',
            type: 'tween',
          }}
          className="relative focus:outline-hidden group"
          title={isOpen ? 'Tutup tips Riko' : 'Buka tips Riko si Kancil'}
        >
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 opacity-65 blur-xs group-hover:opacity-100 transition" />

          {/* Mascot SVG Avatar Container */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-amber-100 via-amber-200 to-emerald-200 p-1 border-2 border-amber-300 shadow-xl flex items-center justify-center overflow-hidden">
            {/* Vector Riko si Kancil Mascot Artwork */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ears */}
              <motion.g
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 2.5, type: 'tween', ease: 'easeInOut' }}
                style={{ transformOrigin: '50% 30%' }}
              >
                {/* Left Ear */}
                <ellipse cx="30" cy="24" rx="10" ry="18" fill="#b45309" transform="rotate(-18 30 24)" />
                <ellipse cx="30" cy="24" rx="6" ry="12" fill="#fed7aa" transform="rotate(-18 30 24)" />

                {/* Right Ear */}
                <ellipse cx="70" cy="24" rx="10" ry="18" fill="#b45309" transform="rotate(18 70 24)" />
                <ellipse cx="70" cy="24" rx="6" ry="12" fill="#fed7aa" transform="rotate(18 70 24)" />
              </motion.g>

              {/* Safari Explorer Hat on Mascot Head */}
              <g>
                <ellipse cx="50" cy="36" rx="34" ry="7" fill="#78350f" />
                <path d="M 28 36 Q 50 14 72 36 Z" fill="#92400e" />
                <rect x="29" y="32" width="42" height="4" fill="#047857" rx="1.5" />
                <circle cx="50" cy="34" r="2.5" fill="#facc15" />
              </g>

              {/* Head / Face */}
              <ellipse cx="50" cy="58" rx="26" ry="24" fill="#d97706" />
              {/* White muzzle & cheeks */}
              <ellipse cx="50" cy="65" rx="16" ry="14" fill="#fffbeb" />

              {/* Eyes with blinking animation */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.45, 0.5, 0.55, 1], type: 'tween', ease: 'easeInOut' }}
                style={{ transformOrigin: '50% 52%' }}
              >
                <ellipse cx="40" cy="52" rx="4.5" ry="6" fill="#1c1917" />
                <circle cx="38.5" cy="50" r="1.8" fill="#ffffff" />

                <ellipse cx="60" cy="52" rx="4.5" ry="6" fill="#1c1917" />
                <circle cx="58.5" cy="50" r="1.8" fill="#ffffff" />
              </motion.g>

              {/* Snout & Nose */}
              <polygon points="46,62 54,62 50,66" fill="#451a03" />
              {/* Cute Smile */}
              <path
                d="M 45 68 Q 50 72 55 68"
                stroke="#451a03"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Rosy Cheeks */}
              <circle cx="33" cy="61" r="3.5" fill="#fb7185" opacity="0.6" />
              <circle cx="67" cy="61" r="3.5" fill="#fb7185" opacity="0.6" />

              {/* Green explorer neckerchief */}
              <polygon points="38,78 62,78 50,89" fill="#059669" />
              <circle cx="50" cy="80" r="2.5" fill="#f59e0b" />
            </svg>
          </div>

          {/* Unread / Notification Sparkle Badge if collapsed */}
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, type: 'tween', ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-stone-900 border-2 border-white shadow-md flex items-center justify-center font-bold text-xs"
            >
              💡
            </motion.div>
          )}

          {/* Quick Click Hint Pill on Hover */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-stone-900/90 text-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-300/40 shadow-sm whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:scale-105 transition">
            {isOpen ? 'Tutup' : 'Tips Riko'}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};
