import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Sparkles, Map, Award, Eye } from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';

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

const DETECTIVE_ITEMS: DetectiveObject[] = [
  // 1. Lokasi: Sekolah
  { id: 'sch_student', name: 'Siswa Belajar', category: 'biotik', icon: '🧑‍🎓', location: 'sekolah', x: 25, y: 65, hint: 'Manusia (makhluk hidup)' },
  { id: 'sch_tree', name: 'Pohon Beringin', category: 'biotik', icon: '🌳', location: 'sekolah', x: 75, y: 40, hint: 'Tumbuhan peneduh sekolah' },
  { id: 'sch_bird', name: 'Burung Gereja', category: 'biotik', icon: '🐦', location: 'sekolah', x: 45, y: 25, hint: 'Hewan terbang di atap' },
  { id: 'sch_sun', name: 'Sinar Pagi', category: 'abiotik', icon: '☀️', location: 'sekolah', x: 85, y: 15, hint: 'Cahaya & panas matahari' },
  { id: 'sch_soil', name: 'Tanah Lapangan', category: 'abiotik', icon: '🪴', location: 'sekolah', x: 50, y: 80, hint: 'Tanah tempat berpijak' },
  { id: 'sch_stone', name: 'Batu Hias', category: 'abiotik', icon: '🪨', location: 'sekolah', x: 15, y: 82, hint: 'Batu alam batas taman' },

  // 2. Lokasi: Taman
  { id: 'tmn_butterfly', name: 'Kupu-kupu Kuning', category: 'biotik', icon: '🦋', location: 'taman', x: 30, y: 40, hint: 'Serangga penyerbuk' },
  { id: 'tmn_flower', name: 'Bunga Dahlia', category: 'biotik', icon: '🌺', location: 'taman', x: 65, y: 70, hint: 'Tumbuhan berbunga' },
  { id: 'tmn_caterpillar', name: 'Ulat Daun', category: 'biotik', icon: '🐛', location: 'taman', x: 20, y: 75, hint: 'Hewan kecil pemakan daun' },
  { id: 'tmn_wind', name: 'Angin Sejuk', category: 'abiotik', icon: '🌬️', location: 'taman', x: 50, y: 20, hint: 'Udara segar bergerak' },
  { id: 'tmn_water', name: 'Air Siraman', category: 'abiotik', icon: '💧', location: 'taman', x: 40, y: 65, hint: 'Tetes air menyegarkan' },
  { id: 'tmn_gravel', name: 'Batu Kerikil', category: 'abiotik', icon: '🪨', location: 'taman', x: 80, y: 80, hint: 'Bebatuan kecil di jalan setapak' },

  // 3. Lokasi: Kolam
  { id: 'klm_fish', name: 'Ikan Nila', category: 'biotik', icon: '🐟', location: 'kolam', x: 45, y: 65, hint: 'Hewan air bernapas dengan insang' },
  { id: 'klm_lotus', name: 'Teratai Air', category: 'biotik', icon: '🪷', location: 'kolam', x: 25, y: 55, hint: 'Tumbuhan berdaun lebar' },
  { id: 'klm_frog', name: 'Katak Sawah', category: 'biotik', icon: '🐸', location: 'kolam', x: 75, y: 70, hint: 'Hewan amfibi' },
  { id: 'klm_water', name: 'Air Danau/Kolam', category: 'abiotik', icon: '💧', location: 'kolam', x: 50, y: 45, hint: 'Air tawar penopang kehidupan' },
  { id: 'klm_rock', name: 'Batu Kali', category: 'abiotik', icon: '🪨', location: 'kolam', x: 85, y: 60, hint: 'Batu besar tepi perairan' },
  { id: 'klm_mud', name: 'Lumpur Dasar', category: 'abiotik', icon: '🪴', location: 'kolam', x: 15, y: 80, hint: 'Tanah lumpur dasar kolam' },
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

            {hasCompleted && (
              <button
                id="btn-next-mission-7"
                onClick={() => {
                  sound.playFootstep();
                  onNextMission();
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-display font-bold rounded-2xl shadow-md text-xs sm:text-sm animate-pulse-subtle transition"
              >
                <span>Lanjut Misi 8</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
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
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-display font-bold text-xs sm:text-sm rounded-2xl shadow-md shrink-0 flex items-center gap-2"
            >
              <span>Ke Misi 8: Peta Pikiran</span>
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
              ? 'bg-gradient-to-b from-sky-200 via-amber-50 to-emerald-100 border-amber-300'
              : currentLocation === 'taman'
              ? 'bg-gradient-to-b from-sky-200 via-emerald-100 to-green-100 border-emerald-300'
              : 'bg-gradient-to-b from-sky-200 via-sky-100 to-blue-200 border-sky-300'
          }`}
        >
          {/* Continuous Natural Trail Base */}
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
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  id={`btn-detective-${item.id}`}
                  onClick={() => handleInspect(item)}
                  className={`p-2.5 sm:p-3 rounded-2xl transition-all shadow-md flex flex-col items-center cursor-pointer border-2 ${
                    isRecent
                      ? 'bg-amber-300 border-amber-500 ring-4 ring-amber-300 scale-110 shadow-xl'
                      : isFound
                      ? item.category === 'biotik'
                        ? 'bg-white/95 border-emerald-400 ring-2 ring-emerald-200'
                        : 'bg-white/95 border-sky-400 ring-2 ring-sky-200'
                      : 'bg-white/80 hover:bg-white border-stone-300 animate-pulse-subtle'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                    {item.icon}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-stone-900 mt-1 whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
                    {item.name}
                  </span>

                  {isFound && (
                    <span
                      className={`absolute -top-2 -right-2 text-white rounded-full p-0.5 text-xs shadow-xs font-bold ${
                        item.category === 'biotik' ? 'bg-emerald-600' : 'bg-sky-600'
                      }`}
                    >
                      ✓
                    </span>
                  )}
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
                <motion.span
                  animate={{ rotate: [0, 360], scale: [1, 1.25, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl shrink-0"
                >
                  🌟
                </motion.span>
                <div>
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-stone-950 flex items-center gap-1.5">
                    <span>Animasi Penemuan Berhasil!</span>
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
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{recentFound.icon}</span>
                  <span
                    className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                      recentFound.category === 'biotik'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {recentFound.category === 'biotik' ? '🟢 Biotik' : '🔵 Abiotik'}
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
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md"
            >
              <span>Lanjut ke Misi 8: Peta Pikiran Ekosistem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
