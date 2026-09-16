import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles, Map, Wind, Droplets, Sun, Mountain, Layers } from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';
import { WeatherType, WEATHER_CONDITIONS } from '../utils/weather';

interface Mission4Props {
  onComplete: (points: number) => void;
  onGoToMap: () => void;
  onNextMission: () => void;
  activeWeather?: WeatherType;
}

interface PopulationItem {
  id: string;
  name: string;
  isPopulation: boolean;
  speciesName: string;
  countDescription: string;
  icon: string;
  x: number;
  y: number;
  explanation: string;
}

const POPULATION_ITEMS: PopulationItem[] = [
  {
    id: 'fish_population',
    name: 'Kumpulan Ikan Mas',
    isPopulation: true,
    speciesName: 'Ikan Mas',
    countDescription: 'Kumpulan 7 ekor ikan mas sejenis',
    icon: '🐟🐟🐟',
    x: 25,
    y: 75,
    explanation: 'Tepat sekali! Kumpulan 7 ekor ikan mas sejenis di kolam air membentuk satu POPULASI ikan mas.',
  },
  {
    id: 'lotus_population',
    name: 'Rumpun Bunga Teratai',
    isPopulation: true,
    speciesName: 'Bunga Teratai',
    countDescription: 'Sekelompok 5 tanaman teratai sejenis',
    icon: '🪷🪷🪷',
    x: 40,
    y: 70,
    explanation: 'Benar! Kumpulan tanaman bunga teratai sejenis yang tumbuh bersama di kolam adalah POPULASI teratai.',
  },
  {
    id: 'bee_population',
    name: 'Kawanan Lebah Madu',
    isPopulation: true,
    speciesName: 'Lebah Madu',
    countDescription: 'Kawanan lebah pekerja sejenis',
    icon: '🐝🐝🐝',
    x: 65,
    y: 35,
    explanation: 'Hebat! Sekelompok lebah madu sejenis yang bersama-sama mencari nektar adalah contoh nyata POPULASI.',
  },
  {
    id: 'bird_population',
    name: 'Sekawanan Burung Pipit',
    isPopulation: true,
    speciesName: 'Burung Pipit',
    countDescription: 'Kumpulan 6 ekor burung pipit sejenis',
    icon: '🐦🐦🐦',
    x: 80,
    y: 22,
    explanation: 'Bagus! Kumpulan beberapa ekor burung pipit sejenis di dahan pohon merupakan POPULASI burung pipit.',
  },
  {
    id: 'pine_population',
    name: 'Kumpulan Pohon Pinus',
    isPopulation: true,
    speciesName: 'Pohon Pinus',
    countDescription: 'Kelompok 6 pohon pinus sejenis',
    icon: '🌲🌲🌲',
    x: 85,
    y: 55,
    explanation: 'Tepat sekali! Sekelompok pohon pinus sejenis yang tumbuh di lereng bukit membentuk POPULASI pinus.',
  },
  // Distractors
  {
    id: 'single_rabbit',
    name: '1 Ekor Kelinci Sendirian',
    isPopulation: false,
    speciesName: 'Kelinci',
    countDescription: 'Hanya 1 ekor',
    icon: '🐰',
    x: 52,
    y: 60,
    explanation: 'Ini hanya 1 ekor kelinci, jadi ini adalah INDIVIDU, bukan populasi!',
  },
  {
    id: 'single_turtle',
    name: '1 Ekor Kura-kura',
    isPopulation: false,
    speciesName: 'Kura-kura',
    countDescription: 'Hanya 1 ekor',
    icon: '🐢',
    x: 18,
    y: 60,
    explanation: 'Kura-kura ini sendirian, maka ia adalah satu INDIVIDU, belum membentuk populasi.',
  },
];

export const Mission4Abiotic: React.FC<Mission4Props> = ({
  onComplete,
  onGoToMap,
  onNextMission,
  activeWeather = 'sunny',
}) => {
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<PopulationItem | null>(null);
  const [feedback, setFeedback] = useState<{
    text: string;
    isCorrect: boolean;
  } | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [verificationChoice, setVerificationChoice] = useState<string | null>(null);
  const weatherCond = WEATHER_CONDITIONS[activeWeather];

  const targetPopulations = POPULATION_ITEMS.filter((i) => i.isPopulation);

  const handleSelectItem = (item: PopulationItem) => {
    setActiveItem(item);

    if (item.isPopulation) {
      sound.playCorrect();
      setFeedback({
        text: item.explanation,
        isCorrect: true,
      });

      if (!discoveredIds.includes(item.id)) {
        const nextList = [...discoveredIds, item.id];
        setDiscoveredIds(nextList);

        if (nextList.length === targetPopulations.length && !hasCompleted) {
          setHasCompleted(true);
          sound.playStarEarned();
          onComplete(15);
        }
      }
    } else {
      sound.playWrong();
      setFeedback({
        text: item.explanation,
        isCorrect: false,
      });
    }
  };

  const handleVerify = (choiceId: string) => {
    setVerificationChoice(choiceId);
    if (choiceId === 'correct') {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="min-h-[calc(100vh-115px)] w-full p-3 sm:p-6 flex flex-col justify-between relative z-10">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-sky-300/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-2xl shrink-0">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full">
                  Misi 4
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                  Temukan Populasi di Alam
                </h2>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                Cari dan klik semua <strong>POPULASI</strong> (kumpulan individu sejenis di suatu tempat)!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/90 border border-amber-200 rounded-2xl">
              <span className="text-xl">{weatherCond.icon}</span>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-amber-900 block leading-tight">
                  Cuaca: {weatherCond.label}
                </span>
                <span className="text-[11px] font-extrabold text-amber-950">
                  {weatherCond.temperature} • {weatherCond.humidity}
                </span>
              </div>
            </div>

            <div className="px-3.5 py-1.5 bg-sky-50 border border-sky-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-sky-800 block">
                Populasi Ditemukan
              </span>
              <span className="font-display font-extrabold text-base sm:text-lg text-sky-950">
                {discoveredIds.length} / {targetPopulations.length}
              </span>
            </div>

            {hasCompleted && (
              <button
                id="btn-next-mission-4"
                onClick={() => {
                  sound.playFootstep();
                  onNextMission();
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-display font-bold rounded-2xl shadow-md text-xs sm:text-sm animate-pulse-subtle transition"
              >
                <span>Lanjut Misi 5: Komunitas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Contrast Banner (Populasi vs Individu vs Komunitas) */}
        <div className="bg-white/95 rounded-3xl p-4 border-2 border-sky-300 shadow-sm">
          <h3 className="font-display font-bold text-xs sm:text-sm text-stone-800 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Perbandingan Visual: Memahami Populasi Secara Tegas</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-sky-50 border-2 border-sky-400 flex items-center gap-3">
              <span className="text-3xl shrink-0">🐟🐟🐟</span>
              <div>
                <span className="font-bold text-sky-950 block text-xs sm:text-sm">Populasi Ikan Mas</span>
                <p className="text-[11px] text-sky-800 leading-snug">
                  Kumpulan individu <strong>SEJENIS</strong> (hanya ikan mas) di suatu tempat yang sama.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border-2 border-stone-300 flex items-center gap-3">
              <span className="text-3xl shrink-0">🐟</span>
              <div>
                <span className="font-bold text-stone-900 block text-xs sm:text-sm">1 Ekor Ikan (Individu)</span>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Bukan populasi! Jika hanya <strong>satu ekor tunggal</strong>, itu disebut individu.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50 border-2 border-indigo-300 flex items-center gap-3">
              <span className="text-3xl shrink-0">🐟🐸🪷</span>
              <div>
                <span className="font-bold text-indigo-950 block text-xs sm:text-sm">Ikan + Katak + Teratai</span>
                <p className="text-[11px] text-indigo-700 leading-snug">
                  Bukan populasi! Kumpulan <strong>berbagai jenis makhluk hidup</strong> disebut <strong>Komunitas</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Big Concept Banner */}
        <div className="bg-gradient-to-r from-sky-800 to-blue-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border-2 border-sky-400 flex flex-col sm:flex-row items-center gap-4">
          <CharacterAvatar size="md" className="shrink-0" />
          <div>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-sky-700 text-sky-200 rounded-full inline-block mb-1">
              Konsep Utama IPAS: Tingkatan Kehidupan
            </span>
            <p className="font-display font-extrabold text-lg sm:text-xl text-amber-200 leading-snug">
              “Populasi adalah kumpulan individu SEJENIS yang hidup di suatu tempat.”
            </p>
            <p className="text-xs sm:text-sm text-sky-100 mt-1">
              Syarat populasi: Makhluk hidupnya harus sejenis dan berjumlah lebih dari satu (kumpulan). Contoh: sekumpulan ikan mas di kolam atau sekelompok pohon pinus di bukit!
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-md ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{feedback.isCorrect ? '🌟' : '🤔'}</span>
                <div>
                  <p className="font-bold text-xs sm:text-sm">
                    {feedback.isCorrect ? 'Tepat Sekali (Populasi)!' : 'Bukan Populasi:'}
                  </p>
                  <p className="text-xs sm:text-sm">{feedback.text}</p>
                </div>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="text-stone-400 hover:text-stone-700 text-xs p-1"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Open Field Landscape Viewport */}
        <div className="relative w-full min-h-[420px] sm:min-h-[480px] bg-gradient-to-b from-sky-300 via-sky-100 to-amber-100 rounded-3xl border-4 border-sky-300 shadow-xl overflow-hidden">
          {/* Natural Vector Scenery & Winding Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            <polygon points="0,320 250,160 500,340" fill="#bae6fd" opacity="0.5" />
            <polygon points="400,340 700,180 1000,350" fill="#7dd3fc" opacity="0.4" />

            <path
              d="M0 340 Q300 280 600 330 T1000 310 L1000 600 L0 600 Z"
              fill="#86efac"
              opacity="0.7"
            />
            <path
              d="M0 380 Q400 320 750 370 T1000 360 L1000 600 L0 600 Z"
              fill="#4ade80"
            />

            {/* River / Pond Water area */}
            <path
              d="M 160 380 C 220 440, 210 500, 250 600 L 450 600 C 420 510, 410 440, 360 380 Z"
              fill="#0284c7"
              opacity="0.8"
            />
            <path
              d="M 180 400 C 240 450, 230 510, 270 600 L 430 600 C 400 510, 390 450, 340 400 Z"
              fill="#38bdf8"
              opacity="0.9"
            />

            {/* Winding soil path */}
            <path
              d="M 0 520 C 200 500, 350 530, 520 510 S 780 500, 1000 540 L 1000 600 L 0 600 Z"
              fill="#92400e"
              opacity="0.85"
            />
            <path
              d="M 0 525 C 200 505, 350 535, 520 515 S 780 505, 1000 545 L 1000 595 L 0 595 Z"
              fill="#d97706"
            />
          </svg>

          {/* Character standing on path */}
          <div className="absolute left-6 sm:left-14 bottom-14 sm:bottom-20 z-10 flex flex-col items-center">
            <CharacterAvatar size="md" isWalking={false} />
            <span className="text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded-full text-stone-700 shadow-xs mt-1">
              Dara mencari populasi
            </span>
          </div>

          {/* Interactive Population Items */}
          {POPULATION_ITEMS.map((item) => {
            const isDiscovered = discoveredIds.includes(item.id);
            const isSelected = activeItem?.id === item.id;

            return (
              <motion.div
                key={item.id}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  id={`btn-population-${item.id}`}
                  onClick={() => handleSelectItem(item)}
                  className={`p-2.5 sm:p-3 rounded-2xl transition-all shadow-lg flex flex-col items-center cursor-pointer border-3 ${
                    isSelected
                      ? 'bg-amber-300 border-white ring-4 ring-amber-400 scale-110'
                      : isDiscovered
                      ? 'bg-white/95 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200'
                      : 'bg-white/85 hover:bg-white border-amber-300 animate-pulse-subtle'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow-xs">
                    {item.icon}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold mt-1 bg-white/95 px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap text-stone-800">
                    {item.name}
                  </span>

                  {isDiscovered && (
                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-0.5 text-xs shadow-xs font-bold">
                      ✓
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Verification Activity */}
        <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border-2 border-sky-300 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-lg">
              🎯
            </span>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
                Aktivitas Verifikasi: Uji Pemahaman Populasi
              </h3>
              <p className="text-xs text-stone-600">
                Dari skenario berikut, manakah yang merupakan contoh nyata dari <strong>POPULASI</strong>?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => handleVerify('wrong1')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer text-xs ${
                verificationChoice === 'wrong1'
                  ? 'bg-red-50 border-red-300 text-red-900 ring-2 ring-red-200'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
              }`}
            >
              <div className="font-bold mb-1 flex items-center justify-between">
                <span>Pilihan A 🐰</span>
                {verificationChoice === 'wrong1' && <span className="text-red-600 font-bold">✗ Ini Individu</span>}
              </div>
              <p className="text-[11px] text-stone-600">
                Seekor kelinci lucu yang sedang melompat sendirian di tepi padang rumput.
              </p>
            </button>

            <button
              onClick={() => handleVerify('correct')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer text-xs ${
                verificationChoice === 'correct'
                  ? 'bg-sky-50 border-sky-500 text-sky-950 ring-3 ring-sky-200 font-medium'
                  : 'bg-stone-50 hover:bg-sky-50/50 border-stone-200 text-stone-800'
              }`}
            >
              <div className="font-bold mb-1 flex items-center justify-between text-sky-900">
                <span>Pilihan B 🐟🐟🐟</span>
                {verificationChoice === 'correct' && <span className="text-sky-700 font-bold">✓ Tepat Sekali!</span>}
              </div>
              <p className="text-[11px] text-stone-700">
                <strong>Sekumpulan 15 ekor ikan mas sejenis</strong> yang hidup bersama di dalam kolam.
              </p>
            </button>

            <button
              onClick={() => handleVerify('wrong2')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer text-xs ${
                verificationChoice === 'wrong2'
                  ? 'bg-red-50 border-red-300 text-red-900 ring-2 ring-red-200'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
              }`}
            >
              <div className="font-bold mb-1 flex items-center justify-between">
                <span>Pilihan C 🐟🐸🪷</span>
                {verificationChoice === 'wrong2' && <span className="text-red-600 font-bold">✗ Ini Komunitas</span>}
              </div>
              <p className="text-[11px] text-stone-600">
                Campuran berbagai hewan dan tanaman seperti katak, teratai, dan ikan di danau.
              </p>
            </button>
          </div>

          {verificationChoice === 'correct' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-sky-100/90 border border-sky-300 rounded-2xl text-xs text-sky-900 font-medium flex items-center gap-2"
            >
              <span className="text-xl">🌟</span>
              <span>
                <strong>Tepat sekali!</strong> Kumpulan individu dari <strong>spesies sejenis</strong> (ikan mas saja) yang berada di suatu tempat membentuk sebuah <strong>Populasi</strong>.
              </span>
            </motion.div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-xs"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Peta Petualangan</span>
          </button>

          {hasCompleted && (
            <button
              onClick={() => {
                sound.playFootstep();
                onNextMission();
              }}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md"
            >
              <span>Lanjut ke Misi 5: Komunitas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
