import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles, Map, Split } from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';
import { BatuTamanImage, isBatuTaman } from '../components/BatuTamanImage';
import { TanahSuburImage, isTanahSubur } from '../components/TanahSuburImage';

interface Mission5Props {
  onComplete: (points: number) => void;
  onGoToMap: () => void;
  onNextMission: () => void;
}

type EcosystemType = 'taman' | 'kolam';

interface EcosystemItem {
  id: string;
  name: string;
  category: 'populasi' | 'abiotik';
  icon: string;
  role: string;
  x: number;
  y: number;
  placedAnimation?: {
    scale: number[];
    y: number[];
  };
}

const GARDEN_ITEMS: EcosystemItem[] = [
  // Berbagai Populasi pembentuk Komunitas
  { id: 'g_tree', name: 'Populasi Pohon Peneduh', category: 'populasi', icon: '🌳', role: 'Kumpulan pohon peneduh & penghasil oksigen', x: 20, y: 35 },
  { id: 'g_flower', name: 'Populasi Bunga Warna-warni', category: 'populasi', icon: '🌺', role: 'Kumpulan tanaman bunga sumber nektar', x: 45, y: 75 },
  { id: 'g_butterfly', name: 'Populasi Kupu-kupu', category: 'populasi', icon: '🦋', role: 'Kumpulan kupu-kupu penyerbuk bunga', x: 55, y: 35 },
  { id: 'g_bee', name: 'Populasi Lebah Madu', category: 'populasi', icon: '🐝', role: 'Kawanan lebah pekerja di taman', x: 72, y: 40 },
  { id: 'g_bird', name: 'Populasi Burung Pipit', category: 'populasi', icon: '🐦', role: 'Kumpulan burung pemakan biji-bijian', x: 82, y: 28 },
  { id: 'g_ant', name: 'Populasi Semut Tanah', category: 'populasi', icon: '🐜', role: 'Koloni semut penggembur tanah', x: 35, y: 82 },
  // Faktor Abiotik pendukung
  { id: 'g_sun', name: 'Cahaya Matahari', category: 'abiotik', icon: '☀️', role: 'Penghangat bumi & energi fotosintesis', x: 85, y: 15 },
  { id: 'g_soil', name: 'Tanah Subur', category: 'abiotik', icon: '🪴', role: 'Media tempat tumbuh akar dan nutrisi', x: 25, y: 80 },
  { id: 'g_rock', name: 'Batu Taman', category: 'abiotik', icon: '🪨', role: 'Tempat berteduh & pijakan serangga alami', x: 62, y: 82 }
];

const POND_ITEMS: EcosystemItem[] = [
  // Berbagai Populasi pembentuk Komunitas
  { id: 'p_fish', name: 'Populasi Ikan Mas', category: 'populasi', icon: '🐟', role: 'Kumpulan ikan yang berenang di air', x: 50, y: 65 },
  { id: 'p_lotus', name: 'Populasi Bunga Teratai', category: 'populasi', icon: '🪷', role: 'Kumpulan tanaman teratai berdaun lebar', x: 30, y: 55 },
  { id: 'p_frog', name: 'Populasi Katak Hijau', category: 'populasi', icon: '🐸', role: 'Kumpulan katak amfibi di tepi kolam', x: 75, y: 70 },
  { id: 'p_dragonfly', name: 'Populasi Capung Air', category: 'populasi', icon: '🦗', role: 'Kumpulan capung pembasmi jentik', x: 65, y: 30 },
  { id: 'p_duck', name: 'Populasi Bebek Air', category: 'populasi', icon: '🦆', role: 'Kumpulan bebek berenang mencari makan', x: 82, y: 50 },
  { id: 'p_snail', name: 'Populasi Keong Kolam', category: 'populasi', icon: '🐌', role: 'Kumpulan keong pembersih lumut', x: 22, y: 72 },
  // Faktor Abiotik pendukung
  { id: 'p_water', name: 'Air Kolam Alami', category: 'abiotik', icon: '💧', role: 'Media cair tempat tinggal biota kolam', x: 40, y: 45 },
  { id: 'p_rock', name: 'Batu Taman & Kali', category: 'abiotik', icon: '🪨', role: 'Tempat bertengger katak & keong', x: 88, y: 75 }
];

export const Mission5BuildEco: React.FC<Mission5Props> = ({
  onComplete,
  onGoToMap,
  onNextMission,
}) => {
  const [selectedEco, setSelectedEco] = useState<EcosystemType | null>(null);
  const [activeItems, setActiveItems] = useState<string[]>([]);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [showDiscoveryAnimation, setShowDiscoveryAnimation] = useState<boolean>(false);
  const [verificationChoice, setVerificationChoice] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEco === 'taman') {
      sound.startSoundscape('grassland');
    } else {
      sound.startSoundscape('pond');
    }
    return () => {
      sound.stopSoundscape();
    };
  }, [selectedEco]);

  const currentAvailableItems = selectedEco === 'taman' ? GARDEN_ITEMS : POND_ITEMS;

  const handleVerify = (choiceId: string) => {
    setVerificationChoice(choiceId);
    if (choiceId === 'correct') {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const handleToggleItem = (itemId: string) => {
    sound.playClick();
    const next = activeItems.includes(itemId)
      ? activeItems.filter((id) => id !== itemId)
      : [...activeItems, itemId];

    setActiveItems(next);

    // Check completion condition: at least 3 populations and 1 abiotic selected
    const activeObjs = currentAvailableItems.filter((i) => next.includes(i.id));
    const populationCount = activeObjs.filter((i) => i.category === 'populasi').length;
    const abioticCount = activeObjs.filter((i) => i.category === 'abiotik').length;

    if (populationCount >= 3 && abioticCount >= 1 && !hasCompleted) {
      setHasCompleted(true);
      setShowDiscoveryAnimation(true);
      sound.playStarEarned();
      onComplete(15);
    }
  };

  const handleSelectEco = (type: EcosystemType) => {
    sound.playFootstep();
    setSelectedEco(type);
    setActiveItems([]);
    setHasCompleted(false);
    setShowDiscoveryAnimation(false);
  };

  const selectedItemsData = currentAvailableItems.filter((i) => activeItems.includes(i.id));
  const selectedPopulations = selectedItemsData.filter((i) => i.category === 'populasi');
  const selectedAbiotic = selectedItemsData.filter((i) => i.category === 'abiotik');

  return (
    <div className="min-h-[calc(100vh-115px)] w-full p-3 sm:p-6 flex flex-col justify-between relative z-10">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-200/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              <img
                src="/misi5/header-komunitas.jpg"
                alt="Komunitas Makhluk Hidup: Burung, Jangkrik, dan Bunga"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  Misi 5
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                  Bangun Komunitas Makhluk Hidup
                </h2>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                Jalan setapak bercabang! Pilih lingkungan alam, lalu kumpulkan berbagai <strong>populasi</strong> untuk membentuk <strong>komunitas</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Contrast Banner (Komunitas vs Populasi vs Individu) */}
        <div className="bg-white/95 rounded-3xl p-4 border-2 border-emerald-300 shadow-sm">
          <h3 className="font-display font-bold text-xs sm:text-sm text-stone-800 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Perbandingan Visual: Memahami Tingkatan Komunitas</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex items-center gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <img
                  src="/misi4/satu-ikan-mas.png"
                  alt="Ikan Mas"
                  className="w-7 h-7 object-contain drop-shadow-xs"
                />
                <img
                  src="/misi5/kodok.jpg"
                  alt="Kodok"
                  className="w-7 h-7 object-cover rounded-full border border-emerald-300 drop-shadow-xs"
                />
                <img
                  src="/misi4/teratai.png"
                  alt="Bunga Teratai"
                  className="w-7 h-7 object-contain drop-shadow-xs"
                />
              </div>
              <div>
                <span className="font-bold text-emerald-950 block text-xs sm:text-sm">Komunitas Kolam</span>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Kumpulan <strong>berbagai macam populasi berbeda</strong> (ikan + katak + teratai) yang hidup bersama di suatu tempat.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border-2 border-sky-300 flex items-center gap-3">
              <div className="w-12 h-8 shrink-0 flex items-center justify-center">
                <img
                  src="/misi4/tiga-ikan-mas.png"
                  alt="3 Ikan Mas"
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
              <div>
                <span className="font-bold text-sky-950 block text-xs sm:text-sm">3 Ikan Mas</span>
                <p className="text-[11px] text-sky-700 leading-snug">
                  Bukan komunitas! Ini hanya <strong>satu jenis</strong> populasi ikan mas saja.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border-2 border-stone-300 flex items-center gap-3">
              <div className="w-10 h-8 shrink-0 flex items-center justify-center">
                <img
                  src="/misi4/satu-ikan-mas.png"
                  alt="1 Ekor Ikan"
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
              <div>
                <span className="font-bold text-stone-900 block text-xs sm:text-sm">1 Ekor Ikan (Individu)</span>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Bukan komunitas! Ini adalah <strong>satu makhluk hidup tunggal</strong> mandiri.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trail Fork Selection (Percabangan Jalan Setapak) */}
        {!selectedEco ? (
          <div
            className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl text-center space-y-6"
            style={{
              backgroundImage: "url('/misi5-fork-bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="relative z-10 max-w-lg mx-auto bg-white/50 backdrop-blur-xs rounded-2xl p-3 sm:p-4 shadow-sm border border-amber-200/60">
              <span className="text-4xl">🛤️</span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1">
                Jalan Setapak Bercabang!
              </h3>
              <p className="text-stone-800 font-semibold text-sm mt-1">
                Kamu sampai di persimpangan jalan. Di manakah kamu ingin mengamati dan membangun komunitas makhluk hidup?
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-2">
              {/* Branch 1: Taman */}
              <motion.button
                id="btn-choose-taman"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelectEco('taman')}
                className="p-6 rounded-3xl bg-white/55 backdrop-blur-xs border-3 border-emerald-400 hover:border-emerald-600 shadow-lg text-center flex flex-col items-center group cursor-pointer transition"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform overflow-hidden border-2 border-emerald-300">
                  <img
                    src="/misi5/pohon-taman.jpg"
                    alt="Pohon Taman"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-display font-bold text-xl text-emerald-950">
                  Komunitas Taman
                </h4>
                <p className="text-xs text-stone-800 font-medium mt-1">
                  Populasi pohon, bunga, kupu-kupu, lebah, burung, dan semut yang hidup bersama di taman.
                </p>
                <span className="mt-4 px-4 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs">
                  Pilih Cabang Taman 🌿
                </span>
              </motion.button>

              {/* Branch 2: Kolam */}
              <motion.button
                id="btn-choose-kolam"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelectEco('kolam')}
                className="p-6 rounded-3xl bg-white/55 backdrop-blur-xs border-3 border-sky-400 hover:border-sky-600 shadow-lg text-center flex flex-col items-center group cursor-pointer transition"
              >
                <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform overflow-hidden border-2 border-sky-300">
                  <img
                    src="/misi5/air-kolam.jpg"
                    alt="Air Kolam"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-display font-bold text-xl text-sky-950">
                  Komunitas Kolam
                </h4>
                <p className="text-xs text-stone-800 font-medium mt-1">
                  Populasi ikan mas, teratai, katak, capung air, dan bebek yang hidup bersama di kolam.
                </p>
                <span className="mt-4 px-4 py-1.5 bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs">
                  Pilih Cabang Kolam 💧
                </span>
              </motion.button>
            </div>
          </div>
        ) : (
          /* Active Ecosystem Construction Viewport */
          <div className="space-y-4">
            {/* Concept Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 rounded-3xl shadow-md border-2 border-emerald-400 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-emerald-300/50 shadow-xs">
                <img
                  src="/misi5/header-komunitas.jpg"
                  alt="Komunitas Makhluk Hidup"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-700 text-emerald-200 rounded-full inline-block mb-0.5">
                  Konsep Inti: Komunitas
                </span>
                <p className="text-xs sm:text-sm font-bold text-amber-200">
                  “Komunitas adalah kumpulan berbagai macam populasi yang hidup bersama di suatu wilayah.”
                </p>
              </div>
            </div>

            {/* Top Bar Switcher */}
            <div className="flex items-center justify-between bg-white/90 rounded-2xl p-2.5 px-4 border border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedEco === 'taman' ? '🌳' : '🌊'}</span>
                <span className="font-display font-bold text-sm text-stone-800">
                  Membangun Komunitas: {selectedEco === 'taman' ? 'Taman Hijau' : 'Kolam Air'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectEco(selectedEco === 'taman' ? 'kolam' : 'taman')}
                  className="text-xs font-semibold text-emerald-800 hover:underline px-2 py-1"
                >
                  Ganti ke {selectedEco === 'taman' ? 'Kolam 🌊' : 'Taman 🌳'}
                </button>
                <button
                  onClick={() => {
                    setActiveItems([]);
                    setShowDiscoveryAnimation(false);
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 p-1 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Kosongkan</span>
                </button>
              </div>
            </div>

            {/* Interactive Living Ecosystem Canvas with Discovery Animation */}
            <div
              className={`relative w-full min-h-[380px] sm:min-h-[440px] rounded-3xl border-4 shadow-xl overflow-hidden transition-all duration-700 ${
                showDiscoveryAnimation ? 'ring-4 ring-amber-400 shadow-2xl' : ''
              } ${
                selectedEco === 'taman'
                  ? 'bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 border-emerald-400'
                  : 'bg-gradient-to-b from-sky-200 via-sky-100 to-blue-200 border-sky-400'
              }`}
            >
              {/* Background Landscape Graphics */}
              {selectedEco === 'taman' ? (
                <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <polygon points="0,280 250,150 500,300" fill="#bae6fd" opacity="0.4" />
                  <polygon points="450,300 750,160 1000,310" fill="#7dd3fc" opacity="0.4" />
                  <path d="M 0 350 Q 250 310 500 340 T 1000 320 L 1000 500 L 0 500 Z" fill="#86efac" opacity="0.6" />
                  <path d="M 0 420 Q 300 390 500 420 T 1000 400 L 1000 500 L 0 500 Z" fill="#b45309" />
                  <path d="M 0 425 Q 300 395 500 425 T 1000 405 L 1000 495 L 0 495 Z" fill="#d97706" />
                </svg>
              ) : (
                <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <polygon points="0,280 250,150 500,300" fill="#bae6fd" opacity="0.4" />
                  <polygon points="450,300 750,160 1000,310" fill="#7dd3fc" opacity="0.4" />
                  <ellipse cx="500" cy="350" rx="460" ry="140" fill="#0284c7" opacity="0.8" />
                  <ellipse cx="500" cy="350" rx="440" ry="125" fill="#38bdf8" opacity="0.85" />
                  <ellipse cx="400" cy="320" rx="120" ry="25" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
                  <ellipse cx="600" cy="370" rx="140" ry="30" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
                  <path d="M 0 460 Q 200 440 400 470 T 1000 450 L 1000 500 L 0 500 Z" fill="#d97706" />
                </svg>
              )}

              {/* Character observing */}
              <div className="absolute left-4 bottom-6 z-10">
                <CharacterAvatar size="sm" isWalking={false} />
              </div>

              {/* Render Selected Items Visually in the Canvas with Discovery Animation placement */}
              {selectedItemsData.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0, y: -40, opacity: 0 }}
                  animate={{
                    scale: showDiscoveryAnimation ? [1, 1.25, 1] : 1,
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{
                    scale: {
                      type: 'tween',
                      ease: 'easeInOut',
                      duration: 0.8,
                    },
                    y: {
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    },
                    opacity: { duration: 0.4 },
                    delay: idx * 0.08,
                  }}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                >
                  <motion.div
                    animate={
                      item.category === 'populasi'
                        ? {
                            y: [0, -6, 0],
                            rotate: showDiscoveryAnimation ? [-4, 4, -4] : 0,
                          }
                        : { scale: [1, 1.05, 1] }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 2.4,
                      ease: 'easeInOut',
                      type: 'tween',
                    }}
                    className="text-4xl sm:text-5xl filter drop-shadow-md cursor-default flex items-center justify-center"
                  >
                    {isBatuTaman(item.name) ? (
                      <BatuTamanImage className="w-12 h-12 drop-shadow-md" alt={item.name} />
                    ) : isTanahSubur(item.name) ? (
                      <TanahSuburImage className="w-12 h-12 drop-shadow-md" alt={item.name} />
                    ) : (
                      item.icon
                    )}
                  </motion.div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs mt-1 whitespace-nowrap ${
                      item.category === 'populasi'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-sky-100 text-sky-950 border border-sky-300'
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.div>
              ))}

              {/* Visual Reward: Discovery Animation Trigger Overlay */}
              <AnimatePresence>
                {showDiscoveryAnimation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 p-3.5 rounded-2xl border-2 border-white shadow-2xl z-30 flex items-center gap-3"
                  >
                    <motion.span
                      animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, type: 'tween', ease: 'easeInOut' }}
                      className="text-3xl shrink-0"
                    >
                      ✨
                    </motion.span>
                    <div className="flex-1">
                      <p className="font-display font-extrabold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                        <span>Animasi Penemuan!</span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                      </p>
                      <p className="text-[11px] text-amber-950 font-medium leading-tight mt-0.5">
                        Semua populasi telah ditempatkan dengan harmonis di habitatnya membentuk komunitas utuh!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeItems.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 pointer-events-none">
                  <p className="font-display font-bold text-base sm:text-lg text-stone-700 bg-white/80 backdrop-blur-xs px-4 py-2 rounded-2xl shadow-sm border border-stone-200">
                    👇 Pilih populasi makhluk hidup di bawah untuk membentuk komunitas!
                  </p>
                </div>
              )}
            </div>

            {/* Selection Palette: Populations and Abiotic Support */}
            <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-md">
              <h4 className="font-display font-bold text-xs sm:text-sm text-stone-800 mb-3 flex items-center justify-between">
                <span>Pilih Komponen Penyusun Komunitas:</span>
                <span className="text-[11px] font-normal text-stone-500">
                  (Pilih minimal 3 Populasi & 1 Abiotik)
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {currentAvailableItems.map((item) => {
                  const isPicked = activeItems.includes(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      id={`btn-item-${item.id}`}
                      onClick={() => handleToggleItem(item.id)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-2xl border-2 transition flex flex-col items-center justify-center text-center cursor-pointer ${
                        isPicked
                          ? item.category === 'populasi'
                            ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300'
                            : 'bg-sky-100 border-sky-500 ring-2 ring-sky-300'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      {isBatuTaman(item.name) ? (
                        <BatuTamanImage className="w-8 h-8 mb-1" alt={item.name} />
                      ) : isTanahSubur(item.name) ? (
                        <TanahSuburImage className="w-8 h-8 mb-1" alt={item.name} />
                      ) : (
                        <span className="text-2xl mb-1">{item.icon}</span>
                      )}
                      <span className="font-bold text-[11px] text-stone-800 truncate w-full">
                        {item.name}
                      </span>
                      <span
                        className={`text-[9px] font-semibold mt-0.5 ${
                          item.category === 'populasi'
                            ? 'text-emerald-700'
                            : 'text-sky-700'
                        }`}
                      >
                        {item.category === 'populasi' ? '👥 Populasi' : '☀️ Abiotik'}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Summary Learning Box when Community is assembled */}
            {hasCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50/95 border-3 border-emerald-300 rounded-3xl p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  <h4 className="font-display font-bold text-base sm:text-lg text-emerald-950">
                    Komunitas Alami Berhasil Terbentuk!
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3 bg-white rounded-2xl border border-emerald-200">
                    <p className="font-bold text-emerald-900 mb-1">
                      👨‍👩‍👧‍👦 Berbagai Populasi yang Membentuk Komunitas:
                    </p>
                    <p className="text-stone-700">
                      {selectedPopulations.length > 0
                        ? selectedPopulations.map((b) => b.name).join(', ')
                        : 'Belum ada'}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-sky-200">
                    <p className="font-bold text-sky-900 mb-1">
                      ☀️ Lingkungan Abiotik Pendukung:
                    </p>
                    <p className="text-stone-700">
                      {selectedAbiotic.length > 0
                        ? selectedAbiotic.map((a) => a.name).join(', ')
                        : 'Belum ada'}
                    </p>
                  </div>
                </div>

                <p className="font-display font-bold text-sm sm:text-base text-emerald-900 bg-emerald-100/70 p-3 rounded-2xl border border-emerald-300 text-center">
                  “Kumpulan berbagai populasi makhluk hidup yang hidup bersama di tempat ini membentuk satu KOMUNITAS yang harmonis.”
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* Interactive Verification Activity */}
        <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border-2 border-emerald-300 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-lg">
              🎯
            </span>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
                Aktivitas Verifikasi: Uji Pemahaman Konsep Komunitas
              </h3>
              <p className="text-xs text-stone-600">
                Di sebuah kolam, terdapat sekumpulan ikan mas, sekelompok katak hijau, dan rumpun teratai yang hidup berdampingan. Seluruh kumpulan populasi yang hidup bersama ini dinamakan...
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
                <span>Pilihan A 👤</span>
                {verificationChoice === 'wrong1' && <span className="text-red-600 font-bold">✗ Ini Individu</span>}
              </div>
              <p className="text-[11px] text-stone-600">
                <strong>Individu</strong> — hanya satu makhluk hidup tunggal.
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
                <span>Pilihan B 👥</span>
                {verificationChoice === 'wrong2' && <span className="text-red-600 font-bold">✗ Ini Hanya 1 Jenis</span>}
              </div>
              <p className="text-[11px] text-stone-600">
                <strong>Populasi</strong> — hanya berlaku untuk satu spesies sejenis.
              </p>
            </button>

            <button
              onClick={() => handleVerify('correct')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer text-xs ${
                verificationChoice === 'correct'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-3 ring-emerald-200 font-medium'
                  : 'bg-stone-50 hover:bg-emerald-50/50 border-stone-200 text-stone-800'
              }`}
            >
              <div className="font-bold mb-1 flex items-center justify-between text-emerald-900">
                <span>Pilihan C 👨‍👩‍👧‍👦</span>
                {verificationChoice === 'correct' && <span className="text-emerald-700 font-bold">✓ Tepat Sekali!</span>}
              </div>
              <p className="text-[11px] text-stone-700">
                <strong>Komunitas</strong> — kumpulan berbagai macam populasi berbeda di satu tempat.
              </p>
            </button>
          </div>

          {verificationChoice === 'correct' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-emerald-100/90 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-medium flex items-center gap-2"
            >
              <span className="text-xl">🌟</span>
              <span>
                <strong>Benar Sekali!</strong> Pertemuan antara populasi ikan mas + populasi katak + populasi teratai di kolam membentuk satu kesatuan <strong>Komunitas</strong>.
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
              <span>Lanjut ke Misi 6: Biotik & Abiotik</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
