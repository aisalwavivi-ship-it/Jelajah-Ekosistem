import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles, Map, AlertCircle } from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';
import { AudioNarratorButton } from '../components/AudioNarratorButton';

interface Mission3Props {
  onComplete: (points: number) => void;
  onGoToMap: () => void;
  onNextMission: () => void;
}

interface ItemCard {
  id: string;
  name: string;
  isSingleIndividual: boolean;
  icon: string;
  category: string;
  individualCount: number;
  explanation: string;
}

const CANDIDATE_ITEMS: ItemCard[] = [
  {
    id: 'one_tree',
    name: '1 Batang Pohon Beringin',
    isSingleIndividual: true,
    icon: '🌳',
    category: '1 Individu Tumbuhan',
    individualCount: 1,
    explanation: 'Tepat sekali! Satu pohon yang berdiri kokoh di taman adalah SATU individu.',
  },
  {
    id: 'one_fish',
    name: '1 Ekor Ikan Mas',
    isSingleIndividual: true,
    icon: '🐟',
    category: '1 Individu Hewan Air',
    individualCount: 1,
    explanation: 'Benar! Seekor ikan mas yang berenang sendirian di kolam adalah SATU individu.',
  },
  {
    id: 'one_butterfly',
    name: '1 Ekor Kupu-kupu',
    isSingleIndividual: true,
    icon: '🦋',
    category: '1 Individu Serangga',
    individualCount: 1,
    explanation: 'Hebat! Satu ekor kupu-kupu yang hinggap di bunga adalah SATU individu.',
  },
  {
    id: 'one_bird',
    name: '1 Ekor Burung Kutilang',
    isSingleIndividual: true,
    icon: '🐦',
    category: '1 Individu Burung',
    individualCount: 1,
    explanation: 'Bagus! Seekor burung kutilang di atas ranting adalah SATU individu.',
  },
  {
    id: 'one_rabbit',
    name: '1 Ekor Kelinci',
    isSingleIndividual: true,
    icon: '🐰',
    category: '1 Individu Mamalia',
    individualCount: 1,
    explanation: 'Tepat! Satu ekor kelinci yang melompat di rerumputan adalah SATU individu.',
  },
  {
    id: 'one_lotus',
    name: '1 Bunga Teratai',
    isSingleIndividual: true,
    icon: '🪷',
    category: '1 Individu Tumbuhan',
    individualCount: 1,
    explanation: 'Benar sekali! Satu tangkai bunga teratai di atas kolam adalah SATU individu.',
  },
  // Non-individuals (Groups or Abiotic)
  {
    id: 'stone_pile',
    name: 'Sebongkah Batu Sungai',
    isSingleIndividual: false,
    icon: '🪨',
    category: 'Benda Tak Hidup (Abiotik)',
    individualCount: 0,
    explanation: 'Batu adalah benda tak hidup (abiotik). "Individu" hanya berlaku untuk makhluk hidup!',
  },
  {
    id: 'many_bees',
    name: 'Kawanan Banyak Lebah',
    isSingleIndividual: false,
    icon: '🐝🐝🐝',
    category: 'Bukan 1 Individu (Populasi)',
    individualCount: 15,
    explanation: 'Kawanan lebah terdiri dari BANYAK lebah sejenis. Itu disebut POPULASI, bukan 1 individu.',
  },
  {
    id: 'puddle_water',
    name: 'Genangan Air Kolam',
    isSingleIndividual: false,
    icon: '💧',
    category: 'Benda Tak Hidup (Abiotik)',
    individualCount: 0,
    explanation: 'Air adalah faktor abiotik, bukan makhluk hidup tunggal.',
  },
  {
    id: 'fish_shoal',
    name: 'Kumpulan 10 Ikan Mujair',
    isSingleIndividual: false,
    icon: '🐟🐟🐟',
    category: 'Bukan 1 Individu (Populasi)',
    individualCount: 10,
    explanation: 'Kumpulan 10 ekor ikan sejenis adalah POPULASI, bukan satu individu.',
  },
];

export const Mission3Biotic: React.FC<Mission3Props> = ({
  onComplete,
  onGoToMap,
  onNextMission,
}) => {
  const [foundIndividualIds, setFoundIndividualIds] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<{
    text: string;
    isCorrect: boolean;
    name: string;
  } | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [verificationChoice, setVerificationChoice] = useState<string | null>(null);

  const targetIndividuals = CANDIDATE_ITEMS.filter((i) => i.isSingleIndividual);

  const handleItemClick = (item: ItemCard) => {
    if (item.isSingleIndividual) {
      sound.playCorrect();
      if (!foundIndividualIds.includes(item.id)) {
        const nextList = [...foundIndividualIds, item.id];
        setFoundIndividualIds(nextList);

        if (nextList.length >= targetIndividuals.length && !hasCompleted) {
          setHasCompleted(true);
          sound.playStarEarned();
          onComplete(15);
        }
      }
      setSelectedMessage({
        text: `🌟 ${item.explanation}`,
        isCorrect: true,
        name: item.name,
      });
    } else {
      sound.playWrong();
      setSelectedMessage({
        text: `⚠️ Perhatikan: ${item.explanation}`,
        isCorrect: false,
        name: item.name,
      });
    }
  };

  const handleReset = () => {
    sound.playClick();
    setFoundIndividualIds([]);
    setSelectedMessage(null);
    setHasCompleted(false);
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
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-200/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-2xl shrink-0">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                  Misi 3: Tingkat Organisasi
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-emerald-950">
                  Siapa Aku? Mengenal Individu
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                <p className="text-stone-700 text-xs sm:text-sm">
                  “<strong>Individu</strong> adalah <strong>satu makhluk hidup tunggal</strong>.” Temukan kartu yang menggambarkan satu individu!
                </p>
                <AudioNarratorButton
                  id="audio-mission3-header"
                  audioText="Individu adalah satu makhluk hidup. Contohnya satu ikan, satu burung, atau satu pohon."
                  label="Dengarkan Penjelasan"
                  size="sm"
                  variant="pill"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 bg-teal-50 border border-teal-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-teal-800 block">
                Individu Ditemukan
              </span>
              <span className="font-display font-extrabold text-base sm:text-lg text-teal-950">
                {foundIndividualIds.length} / {targetIndividuals.length}
              </span>
            </div>

            {hasCompleted && (
              <button
                id="btn-next-mission-3"
                onClick={() => {
                  sound.playFootstep();
                  onNextMission();
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-display font-bold rounded-2xl shadow-md text-xs sm:text-sm animate-pulse-subtle transition cursor-pointer"
              >
                <span>Lanjut Misi 4: Populasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Example & Contrast Banner (Individual fish vs school of fish vs abiotic) */}
        <div className="bg-white/95 rounded-3xl p-4 border-2 border-teal-300 shadow-sm">
          <h3 className="font-display font-bold text-xs sm:text-sm text-stone-800 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Perbandingan Visual: Contoh Individu vs Lainnya</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-teal-50 border-2 border-teal-400 flex items-center gap-3">
              <span className="text-3xl shrink-0">🐟</span>
              <div>
                <span className="font-bold text-teal-950 block text-xs sm:text-sm">1 Ekor Ikan (Individu)</span>
                <p className="text-[11px] text-teal-700 leading-snug">
                  Hanya <strong>satu</strong> makhluk hidup tunggal yang hidup mandiri.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3">
              <span className="text-3xl shrink-0">🐟🐟🐟</span>
              <div>
                <span className="font-bold text-amber-950 block text-xs sm:text-sm">Kumpulan Ikan (Populasi)</span>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Bukan individu! Terdiri dari <strong>banyak</strong> ikan sejenis yang berkumpul.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border-2 border-stone-300 flex items-center gap-3">
              <span className="text-3xl shrink-0">🪨</span>
              <div>
                <span className="font-bold text-stone-900 block text-xs sm:text-sm">Batu / Air (Abiotik)</span>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Benda tak hidup. Istilah "Individu" hanya untuk <strong>makhluk hidup</strong>!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Big Concept Card */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border-2 border-teal-500 flex flex-col sm:flex-row items-center gap-4">
          <CharacterAvatar size="md" className="shrink-0" />
          <div>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-teal-700 text-teal-200 rounded-full inline-block mb-1">
              Konsep Utama: Tingkatan Organisasi
            </span>
            <p className="font-display font-extrabold text-lg sm:text-xl text-amber-200 leading-snug">
              “Individu adalah SATU makhluk hidup tunggal.”
            </p>
            <p className="text-xs sm:text-sm text-teal-100 mt-1">
              Contohnya: 1 pohon beringin, 1 ekor ikan mas, 1 ekor burung kutilang, atau 1 ekor kupu-kupu.
            </p>
          </div>
        </div>

        {/* Feedback Message Bar */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-md ${
                selectedMessage.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">
                  {selectedMessage.isCorrect ? '🌟' : '🤔'}
                </span>
                <p className="text-xs sm:text-sm font-medium">
                  {selectedMessage.text}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-stone-400 hover:text-stone-700 text-xs p-1"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Item Selection Grid */}
        <div className="bg-white/95 rounded-3xl p-4 sm:p-6 border-2 border-teal-200 shadow-md">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
            <h3 className="font-display font-bold text-sm sm:text-base text-stone-800 flex items-center gap-2">
              <span>🔎</span>
              <span>Pilih Semua Kartu yang Merupakan 1 Individu (Satu Makhluk Hidup):</span>
            </h3>

            <button
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CANDIDATE_ITEMS.map((item) => {
              const isFound = foundIndividualIds.includes(item.id);

              return (
                <motion.button
                  key={item.id}
                  id={`btn-individual-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col items-center justify-center text-center relative group cursor-pointer ${
                    isFound
                      ? 'bg-teal-100 border-teal-500 ring-2 ring-teal-300 shadow-sm'
                      : 'bg-stone-50 hover:bg-teal-50/70 border-stone-200 hover:border-teal-300'
                  }`}
                >
                  <span className="text-4xl mb-1.5 filter drop-shadow-xs group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="font-display font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-teal-800 font-semibold mt-1">
                    {item.category}
                  </span>

                  {isFound && (
                    <span className="absolute top-2 right-2 bg-teal-600 text-white rounded-full p-0.5 text-xs shadow-xs font-bold">
                      ✓
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Interactive Verification Activity */}
        <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border-2 border-teal-300 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-lg">
              🎯
            </span>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
                Aktivitas Verifikasi: Uji Pemahaman Individu
              </h3>
              <p className="text-xs text-stone-600">
                Dari skenario berikut, manakah yang merupakan contoh <strong>SATU INDIVIDU</strong>?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => handleVerify('correct')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer text-xs ${
                verificationChoice === 'correct'
                  ? 'bg-teal-50 border-teal-500 text-teal-950 ring-3 ring-teal-200'
                  : 'bg-stone-50 hover:bg-teal-50/50 border-stone-200 text-stone-800'
              }`}
            >
              <div className="font-bold mb-1 flex items-center justify-between text-teal-900">
                <span>Pilihan A 🐟</span>
                {verificationChoice === 'correct' && <span className="text-teal-700 font-bold">✓ Tepat Sekali!</span>}
              </div>
              <p className="text-[11px] text-stone-700">
                <strong>Seekor ikan mas</strong> yang sedang berenang sendirian di tepi kolam sekolah.
              </p>
            </button>

            <button
              onClick={() => handleVerify('wrong1')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer text-xs ${
                verificationChoice === 'wrong1'
                  ? 'bg-red-50 border-red-300 text-red-900 ring-2 ring-red-200'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
              }`}
            >
              <div className="font-bold mb-1 flex items-center justify-between">
                <span>Pilihan B 🐟🐟🐟</span>
                {verificationChoice === 'wrong1' && <span className="text-red-600 font-bold">✗ Ini Populasi</span>}
              </div>
              <p className="text-[11px] text-stone-600">
                Sekelompok 10 ekor ikan mas yang berenang bersama-sama membentuk kawanan.
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
                <span>Pilihan C 🪨</span>
                {verificationChoice === 'wrong2' && <span className="text-red-600 font-bold">✗ Ini Abiotik</span>}
              </div>
              <p className="text-[11px] text-stone-600">
                Sebongkah batu kali dan pasir yang terendam di dasar kolam.
              </p>
            </button>
          </div>

          {verificationChoice === 'correct' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-teal-100/90 border border-teal-300 rounded-2xl text-xs text-teal-900 font-medium flex items-center gap-2"
            >
              <span className="text-xl">🌟</span>
              <span>
                <strong>Benar!</strong> Seekor ikan mas tunggal adalah contoh sempurna dari <strong>Individu</strong>. Jika banyak ikan mas berkumpul, barulah disebut <strong>Populasi</strong>.
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
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md"
            >
              <span>Lanjut ke Misi 4: Populasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
