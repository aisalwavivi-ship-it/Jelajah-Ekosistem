import React, { useState, useEffect } from 'react';
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
  imageSrc: string;
  x: number;
  y: number;
  explanation: string;
}

const POPULATION_ITEMS: PopulationItem[] = [
  {
    id: 'fish_population',
    name: 'Ikan Mas',
    isPopulation: true,
    speciesName: 'Ikan Mas',
    countDescription: 'Kumpulan 7 ekor ikan mas sejenis',
    icon: '🐟🐟🐟',
    imageSrc: '/misi4/tiga-ikan-mas.png',
    x: 52,
    y: 74,
    explanation: 'Tepat sekali! Kumpulan 7 ekor ikan mas sejenis di kolam air membentuk satu POPULASI ikan mas.',
  },
  {
    id: 'lotus_population',
    name: 'Bunga Teratai',
    isPopulation: true,
    speciesName: 'Bunga Teratai',
    countDescription: 'Sekelompok 5 tanaman teratai sejenis',
    icon: '🪷🪷🪷',
    imageSrc: '/misi4/teratai.png',
    x: 40,
    y: 70,
    explanation: 'Benar! Kumpulan tanaman bunga teratai sejenis yang tumbuh bersama di kolam adalah POPULASI teratai.',
  },
  {
    id: 'bee_population',
    name: 'Lebah Madu',
    isPopulation: true,
    speciesName: 'Lebah Madu',
    countDescription: 'Kawanan lebah pekerja sejenis',
    icon: '🐝🐝🐝',
    imageSrc: '/misi4/kawanan-lebah.png',
    x: 65,
    y: 35,
    explanation: 'Hebat! Sekelompok lebah madu sejenis yang bersama-sama mencari nektar adalah contoh nyata POPULASI.',
  },
  {
    id: 'bird_population',
    name: 'Burung Pipit',
    isPopulation: true,
    speciesName: 'Burung Pipit',
    countDescription: 'Kumpulan 6 ekor burung pipit sejenis',
    icon: '🐦🐦🐦',
    imageSrc: '/misi4/sekawanan-burung.png',
    x: 80,
    y: 22,
    explanation: 'Bagus! Kumpulan beberapa ekor burung pipit sejenis di dahan pohon merupakan POPULASI burung pipit.',
  },
  {
    id: 'pine_population',
    name: 'Pohon Pinus',
    isPopulation: true,
    speciesName: 'Pohon Pinus',
    countDescription: 'Kelompok 6 pohon pinus sejenis',
    icon: '🌲🌲🌲',
    imageSrc: '/misi4/pohon-pinus.svg',
    x: 85,
    y: 55,
    explanation: 'Tepat sekali! Sekelompok pohon pinus sejenis yang tumbuh di lereng bukit membentuk POPULASI pinus.',
  },
  // Distractors
  {
    id: 'single_rabbit',
    name: 'Kelinci',
    isPopulation: false,
    speciesName: 'Kelinci',
    countDescription: 'Hanya 1 ekor',
    icon: '🐰',
    imageSrc: '/misi4/kelinci.png',
    x: 30,
    y: 84,
    explanation: 'Ini hanya 1 ekor kelinci, jadi ini adalah INDIVIDU, bukan populasi!',
  },
  {
    id: 'single_turtle',
    name: 'Kura-kura',
    isPopulation: false,
    speciesName: 'Kura-kura',
    countDescription: 'Hanya 1 ekor',
    icon: '🐢',
    imageSrc: '/misi4/kura-kura.png',
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
  const [wrongClickedIds, setWrongClickedIds] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<PopulationItem | null>(null);
  const [feedback, setFeedback] = useState<{
    text: string;
    isCorrect: boolean;
  } | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [verificationChoice, setVerificationChoice] = useState<string | null>(null);
  const weatherCond = WEATHER_CONDITIONS[activeWeather];

  useEffect(() => {
    sound.startSoundscape('forest');
    return () => {
      sound.stopSoundscape();
    };
  }, []);

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
      if (!wrongClickedIds.includes(item.id)) {
        setWrongClickedIds((prev) => [...prev, item.id]);
      }
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
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
              <img
                src="/misi4/tiga-ikan-mas.png"
                alt="3 Ekor Ikan Mas (Populasi)"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
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
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                <img
                  src="/misi4/tiga-ikan-mas.png"
                  alt="Populasi Ikan Mas"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
              <div>
                <span className="font-bold text-sky-950 block text-xs sm:text-sm">Populasi Ikan Mas</span>
                <p className="text-[11px] text-sky-800 leading-snug">
                  Kumpulan individu <strong>SEJENIS</strong> (hanya ikan mas) di suatu tempat yang sama.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border-2 border-stone-300 flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                <img
                  src="/misi4/satu-ikan-mas.png"
                  alt="1 Ekor Ikan (Individu)"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs sm:text-sm">1 Ekor Ikan (Individu)</span>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Bukan populasi! Jika hanya <strong>satu ekor tunggal</strong>, itu disebut individu.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50 border-2 border-indigo-300 flex items-center gap-3">
              <div className="w-14 h-12 shrink-0 flex items-center justify-center gap-1">
                <img src="/misi4/satu-ikan-mas.png" alt="Ikan" className="w-4 h-4 object-contain" />
                <img src="/misi4/katak.svg" alt="Katak" className="w-4 h-4 object-contain" />
                <img src="/misi4/teratai.png" alt="Teratai" className="w-4 h-4 object-contain" />
              </div>
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
        <div
          className="relative w-full min-h-[420px] sm:min-h-[480px] rounded-3xl border-4 border-sky-300 shadow-xl overflow-hidden"
          style={{
            backgroundImage: "url('/misi4-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Character standing on path */}
          <div className="absolute left-6 sm:left-14 bottom-14 sm:bottom-20 z-30 flex flex-col items-center pointer-events-none select-none">
            <CharacterAvatar size="md" isWalking={false} />
            <span className="text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded-full text-stone-700 shadow-xs mt-1">
              Dara mencari populasi
            </span>
          </div>

          {/* Interactive Population Items */}
          {POPULATION_ITEMS.map((item) => {
            const isDiscovered = discoveredIds.includes(item.id);
            const isWrong = wrongClickedIds.includes(item.id);
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
                  className="bg-transparent border-0 p-1 shadow-none outline-none flex flex-col items-center cursor-pointer relative group transition-transform"
                >
                  <div
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-transform duration-200 ${
                      isSelected ? 'scale-115' : 'group-hover:scale-108'
                    }`}
                  >
                    <img
                      src={item.imageSrc}
                      alt={item.name}
                      className={`max-w-full max-h-full object-contain pointer-events-none transition-all duration-200 ${
                        isSelected
                          ? isWrong
                            ? 'filter drop-shadow-[0_0_12px_rgba(239,68,68,0.95)]'
                            : 'filter drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]'
                          : isDiscovered
                          ? 'filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-[0_0_8px_rgba(16,185,129,0.85)]'
                          : isWrong
                          ? 'filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] drop-shadow-[0_0_8px_rgba(239,68,68,0.85)]'
                          : 'filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]'
                      }`}
                    />

                    {isDiscovered && (
                      <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-xs shadow-md font-bold leading-none ring-2 ring-white">
                        ✓
                      </span>
                    )}

                    {isWrong && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-xs shadow-md font-bold leading-none ring-2 ring-white">
                        ✕
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] sm:text-xs font-bold mt-1 bg-white/95 px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap text-stone-800 pointer-events-none">
                    {item.name}
                  </span>
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
                <span className="flex items-center gap-1.5">
                  <span>Pilihan A</span>
                  <img src="/misi4/kelinci.png" alt="Kelinci" className="w-5 h-5 object-contain inline-block" />
                </span>
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
                <span className="flex items-center gap-1.5">
                  <span>Pilihan B</span>
                  <img src="/misi4/tiga-ikan-mas.png" alt="Populasi Ikan Mas" className="w-7 h-5 object-contain inline-block" />
                </span>
                {verificationChoice === 'correct' && <span className="text-sky-700 font-bold">✓ Tepat Sekali!</span>}
              </div>
              <p className="text-[11px] text-stone-700 font-normal">
                Sekumpulan 15 ekor ikan mas sejenis yang hidup bersama di dalam kolam.
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
                <span className="flex items-center gap-1">
                  <span>Pilihan C</span>
                  <img src="/misi4/satu-ikan-mas.png" alt="Ikan" className="w-4 h-4 object-contain inline-block" />
                  <img src="/misi4/katak.svg" alt="Katak" className="w-4 h-4 object-contain inline-block" />
                  <img src="/misi4/teratai.png" alt="Teratai" className="w-4 h-4 object-contain inline-block" />
                </span>
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
