import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Sparkles, Map, Award, Eye, Search } from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';
import { EcosystemImage } from '../components/EcosystemImage';

interface Mission7Props {
  onComplete: (points: number) => void;
  onGoToMap: () => void;
  onNextMission: () => void;
}

interface DetectiveObject {
  id: string;
  name: string;
  category: 'biotik' | 'abiotik';
  icon: string;
  location: 'sekolah' | 'taman' | 'kolam';
  x: number;
  y: number;
  hint: string;
}

const getItemImage = (item: DetectiveObject | { id: string; name: string }): string => {
  switch (item.id) {
    case 'sch_student':
      return '/karakter-penjelajah.png';
    case 'sch_tree':
      return '/misi3/pohon-beringin.png';
    case 'sch_bird':
      return '/misi4/burung-pipit.png';
    case 'sch_sun':
      return '/misi6/cahaya-matahari.png';
    case 'sch_soil':
      return '/misi6/tanah-subur.png';
    case 'sch_stone':
      return '/misi6/batu-taman.png';
    case 'tmn_butterfly':
      return '/misi3/kupu-kupu.png';
    case 'tmn_flower':
      return '/misi1/flower.png';
    case 'tmn_caterpillar':
      return '/misi7/ulat-daun.jpg';
    case 'tmn_wind':
      return '/misi6/udara-oksigen.png';
    case 'tmn_water':
      return '/misi6/air-bersih.png';
    case 'tmn_gravel':
      return '/misi6/batu-taman.png';
    case 'klm_fish':
      return '/misi6/ikan-mas.png';
    case 'klm_lotus':
      return '/misi6/bunga-teratai.png';
    case 'klm_frog':
      return '/misi6/katak-hijau.png';
    case 'klm_water':
      return '/misi6/air-bersih.png';
    case 'klm_rock':
      return '/misi5/batu-kali.png';
    case 'klm_mud':
      return '/misi6/tanah-subur.png';
    default:
      return '/misi6/tanah-subur.png';
  }
};

const getImageSizeClasses = (id: string): string => {
  switch (id) {
    case 'sch_tree':
      return 'w-18 h-18 sm:w-22 sm:h-22';
    case 'sch_student':
      return 'w-13 h-17 sm:w-15 sm:h-21';
    case 'sch_sun':
      return 'w-13 h-13 sm:w-16 sm:h-16';
    case 'sch_bird':
      return 'w-10 h-10 sm:w-12 sm:h-12';
    case 'sch_stone':
    case 'tmn_gravel':
    case 'klm_rock':
      return 'w-12 h-10 sm:w-15 sm:h-12';
    case 'sch_soil':
    case 'klm_mud':
      return 'w-14 h-10 sm:w-16 sm:h-12';
    case 'tmn_butterfly':
      return 'w-11 h-11 sm:w-13 sm:h-13';
    case 'tmn_flower':
      return 'w-13 h-13 sm:w-16 sm:h-16';
    case 'tmn_caterpillar':
      return 'w-12 h-10 sm:w-14 sm:h-12 rounded-xl overflow-hidden';
    case 'tmn_wind':
      return 'w-12 h-12 sm:w-15 sm:h-15';
    case 'tmn_water':
    case 'klm_water':
      return 'w-11 h-11 sm:w-14 sm:h-14';
    case 'klm_fish':
      return 'w-12 h-10 sm:w-15 sm:h-12';
    case 'klm_lotus':
      return 'w-13 h-13 sm:w-16 sm:h-16';
    case 'klm_frog':
      return 'w-11 h-11 sm:w-14 sm:h-14';
    default:
      return 'w-11 h-11 sm:w-13 sm:h-13';
  }
};

const DETECTIVE_ITEMS: DetectiveObject[] = [
  // 1. Lokasi: Sekolah
  { id: 'sch_student', name: 'Siswa Belajar', category: 'biotik', icon: '🧑‍🎓', location: 'sekolah', x: 29, y: 64, hint: 'Manusia (makhluk hidup)' },
  { id: 'sch_tree', name: 'Pohon Beringin', category: 'biotik', icon: '🌳', location: 'sekolah', x: 80, y: 48, hint: 'Tumbuhan peneduh sekolah' },
  { id: 'sch_bird', name: 'Burung Gereja', category: 'biotik', icon: '🐦', location: 'sekolah', x: 46, y: 24, hint: 'Hewan terbang di atap' },
  { id: 'sch_sun', name: 'Sinar Pagi', category: 'abiotik', icon: '☀️', location: 'sekolah', x: 87, y: 16, hint: 'Cahaya & panas matahari' },
  { id: 'sch_soil', name: 'Tanah Subur', category: 'abiotik', icon: '🪴', location: 'sekolah', x: 52, y: 85, hint: 'Tanah subur tempat berpijak dan tumbuhnya rumput' },
  { id: 'sch_stone', name: 'Batu Taman', category: 'abiotik', icon: '🪨', location: 'sekolah', x: 18, y: 82, hint: 'Batu alam batas taman' },

  // 2. Lokasi: Taman Asri
  { id: 'tmn_wind', name: 'Angin Sejuk', category: 'abiotik', icon: '🌬️', location: 'taman', x: 48, y: 18, hint: 'Udara segar berhembus di antara pepohonan' },
  { id: 'tmn_butterfly', name: 'Kupu-kupu Kuning', category: 'biotik', icon: '🦋', location: 'taman', x: 28, y: 42, hint: 'Serangga penyerbuk beterbangan dekat dedaunan' },
  { id: 'tmn_flower', name: 'Bunga Dahlia', category: 'biotik', icon: '🌺', location: 'taman', x: 74, y: 62, hint: 'Tumbuhan berbunga mekar di semak taman' },
  { id: 'tmn_caterpillar', name: 'Ulat Daun', category: 'biotik', icon: '🐛', location: 'taman', x: 84, y: 76, hint: 'Hewan kecil pemakan daun di ranting rendah' },
  { id: 'tmn_water', name: 'Air Siraman', category: 'abiotik', icon: '💧', location: 'taman', x: 54, y: 68, hint: 'Tetes air menyegarkan di tanaman dan tanah' },
  { id: 'tmn_gravel', name: 'Batu Taman', category: 'abiotik', icon: '🪨', location: 'taman', x: 20, y: 80, hint: 'Bebatuan taman di tepi jalan setapak' },

  // 3. Lokasi: Kolam Tenang
  { id: 'klm_water', name: 'Air Danau/Kolam', category: 'abiotik', icon: '💧', location: 'kolam', x: 44, y: 44, hint: 'Air tawar jernih penopang kehidupan kolam' },
  { id: 'klm_fish', name: 'Ikan Nila', category: 'biotik', icon: '🐟', location: 'kolam', x: 52, y: 68, hint: 'Hewan air bernapas dengan insang dan berenang bebas' },
  { id: 'klm_lotus', name: 'Teratai Air', category: 'biotik', icon: '🪷', location: 'kolam', x: 28, y: 72, hint: 'Tumbuhan berdaun lebar mengapung di permukaan air' },
  { id: 'klm_frog', name: 'Katak Sawah', category: 'biotik', icon: '🐸', location: 'kolam', x: 72, y: 64, hint: 'Hewan amfibi di tepi perairan dekat bebatuan saung' },
  { id: 'klm_rock', name: 'Batu Kali', category: 'abiotik', icon: '🪨', location: 'kolam', x: 88, y: 80, hint: 'Batu kali besar di tepian kolam' },
  { id: 'klm_mud', name: 'Lumpur Dasar', category: 'abiotik', icon: '🪴', location: 'kolam', x: 14, y: 82, hint: 'Tanah lumpur dan sedimen dasar penyubur tanaman kolam' },
];

export const Mission7EcosystemDetective: React.FC<Mission7Props> = ({
  onComplete,
  onGoToMap,
  onNextMission,
}) => {
  const [currentLocation, setCurrentLocation] = useState<'sekolah' | 'taman' | 'kolam'>('sekolah');
  const [foundItemIds, setFoundItemIds] = useState<string[]>([]);
  const [recentFound, setRecentFound] = useState<DetectiveObject | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [showDiscoveryAnimation, setShowDiscoveryAnimation] = useState<boolean>(false);

  useEffect(() => {
    if (currentLocation === 'kolam') {
      sound.startSoundscape('pond');
    } else if (currentLocation === 'taman') {
      sound.startSoundscape('grassland');
    } else {
      sound.startSoundscape('forest');
    }
    return () => {
      sound.stopSoundscape();
    };
  }, [currentLocation]);

  const foundObjects = DETECTIVE_ITEMS.filter((i) => foundItemIds.includes(i.id));
  const bioticCount = foundObjects.filter((i) => i.category === 'biotik').length;
  const abioticCount = foundObjects.filter((i) => i.category === 'abiotik').length;

  const currentSceneItems = DETECTIVE_ITEMS.filter((i) => i.location === currentLocation);

  const handleInspect = (item: DetectiveObject) => {
    sound.playClick();
    setRecentFound(item);

    if (!foundItemIds.includes(item.id)) {
      const nextList = [...foundItemIds, item.id];
      setFoundItemIds(nextList);

      const nextObjects = DETECTIVE_ITEMS.filter((i) => nextList.includes(i.id));
      const nextBio = nextObjects.filter((i) => i.category === 'biotik').length;
      const nextAbio = nextObjects.filter((i) => i.category === 'abiotik').length;

      // Completed when at least 5 biotic and 5 abiotic are found
      if (nextBio >= 5 && nextAbio >= 5 && !hasCompleted) {
        setHasCompleted(true);
        setShowDiscoveryAnimation(true);
        sound.playFanfare();
        onComplete(15);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-115px)] w-full p-3 sm:p-6 flex flex-col justify-between relative z-10">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-200/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0">
              🕵️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                  Misi 7
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                  Detektif Ekosistem: Eksplorasi 3 Lokasi
                </h2>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                “Temukan minimal <strong>5 komponen biotik</strong> dan <strong>5 komponen abiotik</strong> di 3 area lingkungan!”
              </p>
            </div>
          </div>

          {/* Dual Gauges: Biotik 5/5 & Abiotik 5/5 */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className={`px-3 py-1.5 rounded-2xl text-center border-2 transition ${
                bioticCount >= 5
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <span className="text-[10px] uppercase font-bold block">🟢 Biotik</span>
              <span className="font-display font-extrabold text-base sm:text-lg">
                {bioticCount}/5
              </span>
            </div>

            <div
              className={`px-3 py-1.5 rounded-2xl text-center border-2 transition ${
                abioticCount >= 5
                  ? 'bg-sky-100 border-sky-500 text-sky-950'
                  : 'bg-sky-50 border-sky-200 text-sky-800'
              }`}
            >
              <span className="text-[10px] uppercase font-bold block">🔵 Abiotik</span>
              <span className="font-display font-extrabold text-base sm:text-lg">
                {abioticCount}/5
              </span>
            </div>
          </div>
        </div>

        {/* Celebratory Completion Alert */}
        {hasCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-3xl text-stone-900 border-3 border-white shadow-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">🎉</span>
              <div>
                <h4 className="font-display font-black text-base sm:text-lg text-emerald-950">
                  Hebat! Kamu Berhasil Menjadi Detektif Ekosistem!
                </h4>
                <p className="text-xs sm:text-sm font-medium text-stone-800">
                  Kamu telah menemukan lebih dari 5 biotik dan 5 abiotik. Karakter melanjutkan perjalanan ke bukit pandang!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playFootstep();
                onNextMission();
              }}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-display font-bold text-xs sm:text-sm rounded-2xl shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Ke Misi 8: Piramida Ekosistem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* 3 Selectable Location Switcher Tabs */}
        <div className="flex items-center justify-center gap-3">
          {[
            { id: 'sekolah' as const, label: '🏫 Lingkungan Sekolah', icon: '🏫' },
            { id: 'taman' as const, label: '🌳 Taman Asri', icon: '🌳' },
            { id: 'kolam' as const, label: '🌊 Kolam Tenang', icon: '🌊' }
          ].map((loc) => {
            const isCurrent = currentLocation === loc.id;
            return (
              <button
                key={loc.id}
                id={`btn-loc-${loc.id}`}
                onClick={() => {
                  sound.playClick();
                  setCurrentLocation(loc.id);
                }}
                className={`px-4 sm:px-6 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                  isCurrent
                    ? 'bg-emerald-800 text-white border-emerald-400 shadow-md scale-105'
                    : 'bg-white hover:bg-emerald-50 text-stone-700 border-stone-200'
                }`}
              >
                <span>{loc.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panoramic Exploration Canvas with Winding Trail */}
        <div
          className={`relative w-full min-h-[380px] sm:min-h-[440px] rounded-3xl border-4 shadow-xl overflow-hidden p-4 ${
            currentLocation === 'sekolah'
              ? 'border-amber-300'
              : currentLocation === 'taman'
              ? 'border-emerald-400'
              : 'border-sky-400'
          }`}
        >
          {/* Background for Lingkungan Sekolah: Realistic school garden landscape */}
          {currentLocation === 'sekolah' ? (
            <div className="absolute inset-0 z-0">
              <img
                src="/misi7/taman-sekolah-realistis.jpg"
                alt="Taman Sekolah Realistis"
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              {/* Subtle ambient lighting layer for clarity of elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
            </div>
          ) : currentLocation === 'taman' ? (
            /* Background for Taman Asri: Realistic lush park landscape */
            <div className="absolute inset-0 z-0">
              <img
                src="/misi7/taman-asri-bg.jpg"
                alt="Taman Asri Realistis"
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              {/* Subtle ambient lighting layer for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
            </div>
          ) : currentLocation === 'kolam' ? (
            /* Background for Kolam Tenang: Realistic serene pond landscape */
            <div className="absolute inset-0 z-0">
              <img
                src="/misi7/kolam-tenang-realistis.jpg"
                alt="Kolam Tenang Realistis"
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              {/* Subtle ambient lighting layer for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
            </div>
          ) : (
            /* Continuous Natural Trail Base for other locations */
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path
                d="M 0 420 C 200 400, 400 440, 600 420 S 850 450, 1000 430 L 1000 500 L 0 500 Z"
                fill="#92400e"
                opacity="0.8"
              />
              <path
                d="M 0 425 C 200 405, 400 445, 600 425 S 850 455, 1000 435 L 1000 495 L 0 495 Z"
                fill="#d97706"
              />
            </svg>
          )}

          {/* Character standing in this area */}
          <div className="absolute left-6 bottom-8 z-10">
            <CharacterAvatar size="sm" isWalking={false} />
          </div>

          {/* Objects Placed in this Scene */}
          {currentSceneItems.map((item, idx) => {
            const isFound = foundItemIds.includes(item.id);
            const isRecent = recentFound?.id === item.id;

            return (
              <motion.div
                key={item.id}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                animate={
                  showDiscoveryAnimation
                    ? {
                        scale: [1, 1.2, 1],
                        y: [0, -8, 0],
                      }
                    : {}
                }
                transition={{
                  repeat: showDiscoveryAnimation ? 2 : 0,
                  duration: 0.8,
                  delay: idx * 0.1,
                  type: 'tween',
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  id={`btn-detective-${item.id}`}
                  onClick={() => handleInspect(item)}
                  className="group relative flex flex-col items-center cursor-pointer bg-transparent border-none p-0 outline-none focus:outline-none select-none transition-transform"
                >
                  {/* Realistic object visual integrated directly into the environment */}
                  <div className="relative flex items-center justify-center">
                    <EcosystemImage
                      src={getItemImage(item)}
                      alt={item.name}
                      className={`${getImageSizeClasses(item.id)} object-contain select-none transition-all duration-300 filter drop-shadow-md group-hover:scale-110 group-hover:drop-shadow-xl ${
                        isRecent
                          ? 'brightness-110 drop-shadow-[0_0_16px_rgba(251,191,36,0.9)] scale-105'
                          : ''
                      }`}
                    />

                    {/* Subtle status indicator checkmark when found */}
                    {isFound && (
                      <span
                        className={`absolute -top-1 -right-1 text-white rounded-full p-0.5 shadow-md flex items-center justify-center ring-2 ring-white/90 ${
                          item.category === 'biotik' ? 'bg-emerald-600' : 'bg-sky-600'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Minimal legible HTML text label */}
                  <span
                    className={`mt-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold transition-all shadow-md flex items-center gap-1.5 backdrop-blur-xs whitespace-nowrap border ${
                      isRecent
                        ? 'bg-amber-400 text-stone-950 border-amber-500 ring-2 ring-amber-300 scale-105'
                        : isFound
                        ? item.category === 'biotik'
                          ? 'bg-emerald-950/85 text-emerald-100 border-emerald-400/50'
                          : 'bg-sky-950/85 text-sky-100 border-sky-400/50'
                        : 'bg-black/60 text-white border-white/25 group-hover:bg-black/80 group-hover:border-white/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        item.category === 'biotik' ? 'bg-emerald-400' : 'bg-sky-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </span>
                </button>
              </motion.div>
            );
          })}

          {/* Discovery Animation Popup Overlay */}
          <AnimatePresence>
            {showDiscoveryAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 p-4 rounded-3xl border-3 border-white shadow-2xl z-30 flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-100/90 border border-amber-300 flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-6 h-6 text-amber-900" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-stone-950 flex items-center gap-1.5">
                    <span>Penemuan Berhasil!</span>
                    <Sparkles className="w-4 h-4 text-amber-950" />
                  </h4>
                  <p className="text-xs text-amber-950 font-medium leading-snug mt-0.5">
                    Semua komponen biotik dan abiotik telah terpetakan dengan tepat di lingkungan ekosistem ini!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Detail Info popup */}
          <AnimatePresence>
            {recentFound && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute bottom-4 right-4 max-w-xs bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border-2 border-emerald-300 shadow-xl z-30"
              >
                <div className="flex items-center justify-between mb-1 gap-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <EcosystemImage
                      src={getItemImage(recentFound)}
                      alt={recentFound.name}
                      className="max-w-full max-h-full object-contain select-none"
                    />
                  </div>
                  <span
                    className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      recentFound.category === 'biotik'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        recentFound.category === 'biotik' ? 'bg-emerald-600' : 'bg-sky-600'
                      }`}
                    />
                    <span>{recentFound.category === 'biotik' ? 'Biotik' : 'Abiotik'}</span>
                  </span>
                </div>
                <h5 className="font-display font-bold text-xs text-stone-900">
                  {recentFound.name}
                </h5>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  {recentFound.hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>Lanjut ke Misi 8: Piramida Ekosistem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
