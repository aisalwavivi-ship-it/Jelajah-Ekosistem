import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Sparkles, RotateCcw, Map } from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';
import { AudioNarratorButton } from '../components/AudioNarratorButton';
import { BatuTamanImage, isBatuTaman } from '../components/BatuTamanImage';
import { TanahSuburImage, isTanahSubur } from '../components/TanahSuburImage';

interface Mission1Props {
  onComplete: (points: number) => void;
  onGoToMap: () => void;
  onNextMission: () => void;
}

interface ObservedObject {
  id: string;
  name: string;
  category: 'tumbuhan' | 'hewan' | 'air' | 'batu' | 'tanah_cahaya';
  type: 'biotik' | 'abiotik';
  icon: string;
  x: number; // percentage
  y: number; // percentage
  dialog: string;
  scientificNote: string;
}

const OBJECTS: ObservedObject[] = [
  // Tumbuhan (Biotik)
  {
    id: 'tree',
    name: 'Pohon Rindang',
    category: 'tumbuhan',
    type: 'biotik',
    icon: '🌳',
    x: 14,
    y: 38,
    dialog: '“Pohon adalah tumbuhan hidup yang bernapas, berfotosintesis, dan bertumbuh. Di sini, aku adalah makhluk hidup (biotik)!”',
    scientificNote: 'Tumbuhan adalah makhluk hidup penghasil oksigen dan tempat berteduh di ekosistem.'
  },
  {
    id: 'grass',
    name: 'Rumput Hijau',
    category: 'tumbuhan',
    type: 'biotik',
    icon: '🌱',
    x: 28,
    y: 78,
    dialog: '“Rumput tumbuh menutupi hamparan tanah. Kami adalah tumbuhan hidup yang menyerap air dan cahaya!”',
    scientificNote: 'Rumput adalah produsen alami yang menjaga kelembapan tanah dan rumah bagi serangga kecil.'
  },
  {
    id: 'flower',
    name: 'Tanaman Bunga',
    category: 'tumbuhan',
    type: 'biotik',
    icon: '🌺',
    x: 42,
    y: 65,
    dialog: '“Bungaku mekar cerah mengundang serangga. Aku tumbuhan hidup yang berkembang biak dengan indah!”',
    scientificNote: 'Bunga adalah bagian tumbuhan yang menghasilkan nektar bagi hewan di ekosistem.'
  },
  // Hewan (Biotik)
  {
    id: 'butterfly',
    name: 'Kupu-kupu Cantik',
    category: 'hewan',
    type: 'biotik',
    icon: '🦋',
    x: 50,
    y: 32,
    dialog: '“Aku kupu-kupu yang terbang lincah mencari nektar bunga. Aku hewan yang bernapas dan bergerak aktif!”',
    scientificNote: 'Kupu-kupu adalah hewan yang membantu penyerbukan bunga di ekosistem taman.'
  },
  {
    id: 'bird',
    name: 'Burung Berkicau',
    category: 'hewan',
    type: 'biotik',
    icon: '🐦',
    x: 75,
    y: 35,
    dialog: '“Cicit cuit! Aku bertengger di dahan pohon. Sebagai hewan, aku mencari makan dan hidup berdampingan di alam!”',
    scientificNote: 'Burung adalah hewan yang bergerak bebas di udara dan dahan pohon.'
  },
  {
    id: 'fish',
    name: 'Ikan Kolam',
    category: 'hewan',
    type: 'biotik',
    icon: '🐟',
    x: 60,
    y: 74,
    dialog: '“Kecipak-kecipuk! Aku ikan yang berenang lincah di air jernih. Aku hewan perairan yang bernapas dengan insang!”',
    scientificNote: 'Ikan adalah hewan perairan yang membutuhkan air bersih dan oksigen terlarut.'
  },
  // Air (Abiotik)
  {
    id: 'water',
    name: 'Air Jernih Kolam',
    category: 'air',
    type: 'abiotik',
    icon: '💧',
    x: 70,
    y: 75,
    dialog: '“Air tidak bernapas dan tidak berkembang biak. Air adalah lingkungan tak hidup (abiotik) yang mutlak dibutuhkan ikan dan tanaman!”',
    scientificNote: 'Air merupakan komponen fisik tak hidup yang menjadi tempat hidup biota air dan pelepas dahaga.'
  },
  // Batu (Abiotik)
  {
    id: 'stone',
    name: 'Batu Taman',
    category: 'batu',
    type: 'abiotik',
    icon: '🪨',
    x: 36,
    y: 70,
    dialog: '“Batu adalah benda alam padat tak hidup (abiotik). Aku tidak bertumbuh, tetapi aku menjadi tempat berpijak dan berteduh serangga kecil!”',
    scientificNote: 'Batu adalah mineral tak hidup yang menyusun struktur tanah dan memberi perlindungan alami.'
  },
  // Tanah & Cahaya (Abiotik)
  {
    id: 'soil',
    name: 'Tanah Subur',
    category: 'tanah_cahaya',
    type: 'abiotik',
    icon: '🪴',
    x: 20,
    y: 84,
    dialog: '“Tanah adalah lapisan tak hidup (abiotik) tempat berpijak dan menyediakan mineral untuk akar pohon!”',
    scientificNote: 'Tanah menyimpan hara dan air bagi kehidupan tumbuhan.'
  },
  {
    id: 'sun',
    name: 'Cahaya Matahari',
    category: 'tanah_cahaya',
    type: 'abiotik',
    icon: '☀️',
    x: 85,
    y: 15,
    dialog: '“Sinar matahari menyinari bumi dari kejauhan! Aku adalah faktor abiotik sumber energi utama yang menghangatkan seluruh taman!”',
    scientificNote: 'Cahaya matahari memberi energi untuk fotosintesis tumbuhan dan menghangatkan lingkungan.'
  }
];

export const Mission1Observe: React.FC<Mission1Props> = ({
  onComplete,
  onGoToMap,
  onNextMission,
}) => {
  const [inspectedIds, setInspectedIds] = useState<string[]>([]);
  const [activeObject, setActiveObject] = useState<ObservedObject | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [isDefinitionCorrect, setIsDefinitionCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    sound.startSoundscape('grassland');
    return () => {
      sound.stopSoundscape();
    };
  }, []);

  const inspectedBiotik = OBJECTS.filter((o) => inspectedIds.includes(o.id) && o.type === 'biotik');
  const inspectedAbiotik = OBJECTS.filter((o) => inspectedIds.includes(o.id) && o.type === 'abiotik');

  const hasPlant = OBJECTS.some((o) => inspectedIds.includes(o.id) && o.category === 'tumbuhan');
  const hasAnimal = OBJECTS.some((o) => inspectedIds.includes(o.id) && o.category === 'hewan');
  const hasWater = inspectedIds.includes('water');
  const hasRock = inspectedIds.includes('stone');

  const handleInspect = (obj: ObservedObject) => {
    sound.playClick();
    setActiveObject(obj);

    if (!inspectedIds.includes(obj.id)) {
      const nextList = [...inspectedIds, obj.id];
      setInspectedIds(nextList);

      // Check if minimum requirement reached (at least 6 objects including both biotic and abiotic)
      if (nextList.length >= 6 && !hasCompleted) {
        setHasCompleted(true);
        sound.playStarEarned();
        onComplete(10);
      }
    }
  };

  const handleVerifyDefinition = (optionId: string) => {
    setSelectedDefinition(optionId);
    if (optionId === 'correct') {
      sound.playCorrect();
      setIsDefinitionCorrect(true);
    } else {
      sound.playWrong();
      setIsDefinitionCorrect(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-115px)] w-full p-3 sm:p-6 flex flex-col justify-between relative z-10">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Mission Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-200/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl shrink-0">
              🌎
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  Misi 1: Observasi Alam
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-emerald-950">
                  Apa Itu Ekosistem?
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                <p className="text-emerald-900 font-semibold text-xs sm:text-sm">
                  “Ekosistem adalah kesatuan antara makhluk hidup dan lingkungan tak hidup yang terdapat dalam suatu tempat.”
                </p>
                <AudioNarratorButton
                  id="audio-mission1-header"
                  audioText="Ekosistem adalah kesatuan antara makhluk hidup dan lingkungan tak hidup yang terdapat dalam suatu tempat."
                  label="Dengarkan Penjelasan"
                  size="sm"
                  variant="pill"
                />
              </div>
              <p className="text-stone-600 text-xs mt-0.5">
                Klik komponen-komponen alam di bawah (tumbuhan, hewan, air, batu) untuk melihat bagaimana semuanya bersatu membentuk ekosistem!
              </p>
            </div>
          </div>

          {/* Inspection Gauge & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">
                Objek Diamati
              </span>
              <span className="font-display font-extrabold text-base sm:text-lg text-amber-950">
                {inspectedIds.length} / {OBJECTS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Live Ecosystem Formula Tracker */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border-2 border-emerald-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="font-bold text-stone-700">Rumus Ekosistem:</span>
            <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
              inspectedBiotik.length > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-stone-100 text-stone-400'
            }`}>
              <span>🌱 Makhluk Hidup (Biotik)</span>
              <span className="text-[10px] bg-emerald-200/80 px-1 rounded">{inspectedBiotik.length}</span>
            </span>
            <span className="font-bold text-stone-400">+</span>
            <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
              inspectedAbiotik.length > 0 ? 'bg-sky-100 text-sky-800 border border-sky-300' : 'bg-stone-100 text-stone-400'
            }`}>
              <span>💧 Lingkungan Tak Hidup (Abiotik)</span>
              <span className="text-[10px] bg-sky-200/80 px-1 rounded">{inspectedAbiotik.length}</span>
            </span>
            <span className="font-bold text-stone-400">=</span>
            <span className={`px-3 py-1 rounded-xl font-display font-extrabold flex items-center gap-1 transition-all ${
              inspectedBiotik.length > 0 && inspectedAbiotik.length > 0 ? 'bg-amber-300 text-amber-950 shadow-xs ring-2 ring-amber-400' : 'bg-stone-100 text-stone-400'
            }`}>
              <span>🌎 EKOSISTEM</span>
            </span>
          </div>

          {/* Quick Target Indicators for core components */}
          <div className="flex items-center gap-2 text-[11px] text-stone-600 shrink-0">
            <span className={`px-2 py-0.5 rounded-lg border ${hasPlant ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-stone-50 border-stone-200'}`}>
              🌳 Tumbuhan {hasPlant ? '✓' : ''}
            </span>
            <span className={`px-2 py-0.5 rounded-lg border ${hasAnimal ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-stone-50 border-stone-200'}`}>
              🐾 Hewan {hasAnimal ? '✓' : ''}
            </span>
            <span className={`px-2 py-0.5 rounded-lg border ${hasWater ? 'bg-sky-50 text-sky-800 border-sky-300 font-bold' : 'bg-stone-50 border-stone-200'}`}>
              💧 Air {hasWater ? '✓' : ''}
            </span>
            <span className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 ${hasRock ? 'bg-stone-100 text-stone-800 border-stone-300 font-bold' : 'bg-stone-50 border-stone-200'}`}>
              <BatuTamanImage className="w-3.5 h-3.5" /> Batu {hasRock ? '✓' : ''}
            </span>
          </div>
        </div>

        {/* Celebratory Ecosystem Synthesis Banner */}
        {hasCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-3xl shadow-lg border-2 border-emerald-400 flex items-center gap-3"
          >
            <span className="text-3xl">🎉</span>
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-emerald-100 text-sm sm:text-base">
                Kesimpulan Pengamatan Ekosistem!
              </p>
              <p className="text-emerald-50">
                Semua unsur yang kamu temukan—makhluk hidup (pohon, rumput, bunga, kupu-kupu, burung, ikan) dan lingkungan tak hidup (air, tanah, batu, sinar matahari)—saling berdampingan dan berinteraksi membentuk satu kesatuan yang disebut <strong>EKOSISTEM</strong>!
              </p>
            </div>
          </motion.div>
        )}

        {/* Interactive Garden Exploration Scene */}
        <div className="relative w-full min-h-[440px] sm:min-h-[500px] bg-white/80 backdrop-blur-xs rounded-3xl border-4 border-emerald-300 shadow-xl overflow-hidden">
          {/* Background Scenery SVG: School in distance, rolling greens, and CONTINUOUS PATH */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            {/* Distant school fence */}
            <path d="M0 240 L1000 240" stroke="#cbd5e1" strokeWidth="3" />
            
            {/* Continuous Natural Path winding through this garden */}
            {/* Shadow */}
            <path
              d="M 0 450 C 180 430, 280 460, 420 480 S 700 470, 850 510 L 1000 520 L 1000 580 L 0 580 Z"
              fill="#92400e"
              opacity="0.85"
            />
            {/* Soil */}
            <path
              d="M 0 455 C 180 435, 280 465, 420 485 S 700 475, 850 515 L 1000 525 L 1000 575 L 0 575 Z"
              fill="#d97706"
            />
            {/* Stepping stones */}
            <ellipse cx="120" cy="465" rx="16" ry="8" fill="#e2e8f0" stroke="#94a3b8" />
            <ellipse cx="280" cy="475" rx="18" ry="9" fill="#cbd5e1" stroke="#94a3b8" />
            <ellipse cx="440" cy="495" rx="20" ry="10" fill="#f1f5f9" stroke="#94a3b8" />
            <ellipse cx="610" cy="490" rx="18" ry="9" fill="#e2e8f0" stroke="#94a3b8" />
            <ellipse cx="780" cy="510" rx="22" ry="11" fill="#cbd5e1" stroke="#94a3b8" />
            <ellipse cx="920" cy="530" rx="20" ry="10" fill="#f1f5f9" stroke="#94a3b8" />
          </svg>

          {/* Character standing at path entrance */}
          <div className="absolute left-4 sm:left-8 bottom-12 sm:bottom-16 z-10 flex flex-col items-center">
            <CharacterAvatar size="md" isWalking={false} />
            <span className="text-[10px] font-bold bg-white/90 px-2 py-0.5 rounded-full text-stone-700 shadow-xs mt-1">
              Dara mengamati
            </span>
          </div>

          {/* Clickable Environmental Objects */}
          {OBJECTS.map((obj) => {
            const isInspected = inspectedIds.includes(obj.id);
            const isSelected = activeObject?.id === obj.id;

            return (
              <motion.div
                key={obj.id}
                style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                whileHover={{ scale: 1.18 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  id={`btn-observe-${obj.id}`}
                  onClick={() => handleInspect(obj)}
                  className={`relative p-2.5 sm:p-3 rounded-2xl transition-all shadow-md flex flex-col items-center group cursor-pointer ${
                    isSelected
                      ? 'bg-amber-300 ring-4 ring-amber-400 scale-110 shadow-lg'
                      : isInspected
                      ? 'bg-white/90 hover:bg-white border-2 border-emerald-400'
                      : 'bg-white/75 hover:bg-white border-2 border-amber-300 animate-pulse-subtle'
                  }`}
                >
                  {isBatuTaman(obj.name) ? (
                    <BatuTamanImage className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm my-0.5" alt={obj.name} />
                  ) : isTanahSubur(obj.name) ? (
                    <TanahSuburImage className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm my-0.5" alt={obj.name} />
                  ) : (
                    <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                      {obj.icon}
                    </span>
                  )}
                  <span className="text-[10px] sm:text-xs font-bold text-stone-800 mt-1 whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
                    {obj.name}
                  </span>

                  {/* Checked star marker */}
                  {isInspected && (
                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white rounded-full p-0.5 text-xs shadow-xs">
                      ✓
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}

          {/* Floating Dialogue Card for Active Inspected Object */}
          <AnimatePresence>
            {activeObject && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-3 border-emerald-300 shadow-2xl z-30"
              >
                <div className="flex items-start justify-between gap-2 border-b border-emerald-100 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    {isBatuTaman(activeObject.name) ? (
                      <BatuTamanImage className="w-9 h-9" alt={activeObject.name} />
                    ) : isTanahSubur(activeObject.name) ? (
                      <TanahSuburImage className="w-9 h-9" alt={activeObject.name} />
                    ) : (
                      <span className="text-3xl">{activeObject.icon}</span>
                    )}
                    <div>
                      <h4 className="font-display font-bold text-stone-900 text-sm sm:text-base">
                        {activeObject.name}
                      </h4>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          activeObject.type === 'biotik'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-sky-100 text-sky-800 border border-sky-300'
                        }`}
                      >
                        {activeObject.type === 'biotik'
                          ? '🟢 Komponen Biotik (Makhluk Hidup)'
                          : '🔵 Komponen Abiotik (Benda Tak Hidup)'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveObject(null)}
                    className="text-stone-400 hover:text-stone-700 p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
                  {activeObject.dialog}
                </p>

                <p className="text-[11px] text-stone-500 mt-2 italic">
                  💡 Catatan IPA: {activeObject.scientificNote}
                </p>

                <div className="mt-3 pt-2.5 border-t border-emerald-100 flex items-center justify-between gap-2 flex-wrap">
                  <AudioNarratorButton
                    id={`audio-obj-${activeObject.id}`}
                    audioText={
                      activeObject.type === 'biotik'
                        ? `${activeObject.name} adalah makhluk hidup sehingga termasuk komponen biotik.`
                        : `${activeObject.name} bukan makhluk hidup sehingga termasuk komponen abiotik.`
                    }
                    label="Dengarkan"
                    size="sm"
                    variant="primary"
                  />
                  <span className="text-[10px] text-stone-500 font-medium">
                    {activeObject.type === 'biotik' ? '🟢 Komponen Biotik' : '🔵 Komponen Abiotik'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Definition Verification Activity */}
        <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border-2 border-emerald-300 shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-lg">
              🎯
            </span>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
                Aktivitas Verifikasi: Apa Pengertian Ekosistem?
              </h3>
              <p className="text-xs text-stone-600">
                Berdasarkan hasil pengamatanmu terhadap tumbuhan, hewan, air, batu, dan matahari, manakah definisi yang paling tepat?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => handleVerifyDefinition('wrong1')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer text-xs ${
                selectedDefinition === 'wrong1'
                  ? 'bg-red-50 border-red-300 text-red-900 ring-2 ring-red-200'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
              }`}
            >
              <div className="font-bold mb-1 flex items-center justify-between">
                <span>Pilihan A</span>
                {selectedDefinition === 'wrong1' && <span className="text-red-600 font-bold">✗ Belum Tepat</span>}
              </div>
              <p className="text-[11px] text-stone-600">
                Hanya kumpulan hewan dan tumbuhan di hutan lebat tanpa memperhitungkan air dan tanah.
              </p>
            </button>

            <button
              onClick={() => handleVerifyDefinition('correct')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer text-xs ${
                selectedDefinition === 'correct'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-3 ring-emerald-200 font-medium'
                  : 'bg-stone-50 hover:bg-emerald-50/50 border-stone-200 text-stone-800'
              }`}
            >
              <div className="font-bold mb-1 flex items-center justify-between text-emerald-900">
                <span>Pilihan B</span>
                {selectedDefinition === 'correct' && <span className="text-emerald-700 font-bold">✓ Tepat Sekali!</span>}
              </div>
              <p className="text-[11px] text-stone-700">
                <strong>Kesatuan antara makhluk hidup dan lingkungan tak hidup yang terdapat dalam suatu tempat.</strong>
              </p>
            </button>

            <button
              onClick={() => handleVerifyDefinition('wrong2')}
              className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer text-xs ${
                selectedDefinition === 'wrong2'
                  ? 'bg-red-50 border-red-300 text-red-900 ring-2 ring-red-200'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
              }`}
            >
              <div className="font-bold mb-1 flex items-center justify-between">
                <span>Pilihan C</span>
                {selectedDefinition === 'wrong2' && <span className="text-red-600 font-bold">✗ Belum Tepat</span>}
              </div>
              <p className="text-[11px] text-stone-600">
                Kumpulan benda mati seperti batu, air, dan udara yang tidak dihuni oleh makhluk hidup.
              </p>
            </button>
          </div>

          {selectedDefinition === 'correct' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-emerald-100/90 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-medium flex items-center gap-2"
            >
              <span className="text-xl">🌟</span>
              <span>
                <strong>Luar biasa!</strong> Kamu telah memahami inti dari konsep ekosistem: perpaduan tak terpisahkan antara makhluk hidup (biotik) dengan lingkungan tak hidup (abiotik) dalam satu kesatuan tempat.
              </span>
            </motion.div>
          )}
        </div>

        {/* Bottom Helper / Completion Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span>
              <strong>Tips Belajar:</strong> Klik dan amati minimal <strong>6 objek</strong> di taman (makhluk hidup & benda tak hidup) untuk memahami bagaimana komponen biotik dan abiotik berdampingan membentuk ekosistem, lalu buka Misi 2!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onGoToMap();
              }}
              className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Lihat Peta</span>
            </button>
            {hasCompleted && (
              <button
                onClick={() => {
                  sound.playFootstep();
                  onNextMission();
                }}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>Misi 2: Detektif Lingkungan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
